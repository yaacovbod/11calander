function doGet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const qSheet = ss.getSheetByName('questions')
  const tSheet = ss.getSheetByName('texts')
  const sSheet = ss.getSheetByName('settings')

  const qData = qSheet.getDataRange().getValues()
  const tData = tSheet.getDataRange().getValues()
  const correctPassword = sSheet.getRange('A2').getValue().toString()

  const questions = []
  const qHeaders = qData[0].map(h => h.toString().trim().toLowerCase())
  
  const imageUrlColumnIndex = qHeaders.indexOf('image_url')
  const refAnswerColumnIndex = qHeaders.indexOf('reference_answer')

  for (let i = 1; i < qData.length; i++) {
    const row = qData[i]
    let obj = {}
    qHeaders.forEach((header, index) => {
      let val = row[index]
      if (header === 'options') {
        if (val !== '' && val != null) {
          val = val.toString().split('|').map(s => s.trim())
        } else {
          val = [] 
        }
      }
      if (header === 'correct_answer' && typeof val === 'string') {
        if (val.includes(',')) val = val.split(',').map(v => parseInt(v.trim()))
        else if (!isNaN(val) && val !== '') val = parseInt(val, 10)
      }
      obj[header] = val
    })
    
    if (imageUrlColumnIndex !== -1 && row[imageUrlColumnIndex]) {
        obj.image_url = row[imageUrlColumnIndex].toString()
    }
    
    if (refAnswerColumnIndex !== -1 && row[refAnswerColumnIndex]) {
        obj.reference_answer = row[refAnswerColumnIndex].toString()
    }
    
    questions.push(obj)
  }

  const texts = {}
  const tHeaders = tData[0].map(h => h.toString().trim().toLowerCase())
  
  let topicIdx = tHeaders.indexOf('topic_id')
  let idIdx = tHeaders.indexOf('segment_id')
  if (idIdx === -1) idIdx = tHeaders.indexOf('text_id')
  
  // תיקון באג: הוספת 'text_content' לרשימת החיפוש (שם העמודה בגיליון)
  let textIdx = tHeaders.indexOf('text')
  if (textIdx === -1) textIdx = tHeaders.indexOf('text_content')
  if (textIdx === -1) textIdx = tHeaders.indexOf('content')
  if (textIdx === -1) textIdx = tHeaders.indexOf('הטקסט')

  if (topicIdx === -1) topicIdx = 0
  if (idIdx === -1) idIdx = 1
  if (textIdx === -1 || textIdx === topicIdx || textIdx === idIdx) {
    textIdx = [0, 1, 2].find(i => i !== topicIdx && i !== idIdx) || 2
  }

  for (let i = 1; i < tData.length; i++) {
    const row = tData[i]
    const topicId = row[topicIdx]
    const textContent = row[textIdx]
    
    let segmentId = row[idIdx]
    if(segmentId !== '' && segmentId != null && !isNaN(segmentId)) {
         segmentId = parseInt(segmentId, 10)
    }

    if (topicId && textContent !== '') {
      if (!texts[topicId]) texts[topicId] = []
      texts[topicId].push({ id: segmentId, text: textContent })
    }
  }

  // בניית מבנה הדשבורד דינמית מהשאלות
  const dashboardStructure = {}
  const seenTopics = new Set()
  const categoryIdx = qHeaders.indexOf('category')
  const subcategoryIdx = qHeaders.indexOf('subcategory')
  const topicIdIdx = qHeaders.indexOf('topic_id')
  const titleIdx = qHeaders.indexOf('title')
  const topicTitleIdx = qHeaders.indexOf('topic_title')

  if (categoryIdx !== -1 && subcategoryIdx !== -1 && topicIdIdx !== -1) {
    for (let i = 1; i < qData.length; i++) {
      const row = qData[i]
      const cat = (row[categoryIdx] || '').toString().trim()
      const sub = (row[subcategoryIdx] || '').toString().trim()
      const topicId = (row[topicIdIdx] || '').toString().trim()

      if (!cat || !sub || !topicId) continue

      if (!dashboardStructure[cat]) dashboardStructure[cat] = { subcategories: {} }
      if (!dashboardStructure[cat].subcategories[sub]) dashboardStructure[cat].subcategories[sub] = []

      const topicKey = cat + '|' + sub + '|' + topicId
      if (!seenTopics.has(topicKey)) {
        seenTopics.add(topicKey)
        let topicTitle = topicId
        if (topicTitleIdx !== -1 && row[topicTitleIdx]) {
          topicTitle = row[topicTitleIdx].toString().trim()
        } else if (titleIdx !== -1 && row[titleIdx]) {
          topicTitle = row[titleIdx].toString().trim()
        }
        dashboardStructure[cat].subcategories[sub].push({ id: topicId, title: topicTitle })
      }
    }
  }

  return ContentService.createTextOutput(JSON.stringify({
    questions: questions,
    texts: texts,
    accessKey: correctPassword,
    dashboardStructure: dashboardStructure
  })).setMimeType(ContentService.MimeType.JSON)
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    const settingsSheet = ss.getSheetByName('settings')
    const correctPassword = settingsSheet.getRange('A2').getValue().toString()

    if (data.password !== correctPassword) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', feedback: 'שגיאת אבטחה הגישה נדחתה' }))
        .setMimeType(ContentService.MimeType.JSON)
    }

    if (data.action === 'grade_essay') {
      const feedback = getAiGradeFromSheet(data.prompt)
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', feedback: feedback }))
        .setMimeType(ContentService.MimeType.JSON)
    }

    let sheet = ss.getSheetByName('grades')
    if (!sheet) {
      sheet = ss.insertSheet('grades')
      sheet.appendRow(['תאריך', 'נושא', 'שם תלמיד', 'כיתה', 'ציון', 'תשובה', 'משוב בינה מלאכותית'])
    }
    
    sheet.appendRow([
      new Date(), 
      data.topic_id, 
      data.studentName, 
      data.studentClass, 
      data.score, 
      data.essay, 
      data.feedback
    ])
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON)

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

function getAiGradeFromSheet(prompt) {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const settingsSheet = ss.getSheetByName('settings')
  const apiKey = settingsSheet.getRange('A1').getValue()
  
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: "אתה מורה מקצועי להיסטוריה שבודק בחינות בגרות על פי הנחיות משרד החינוך לתשפ״ו. כללי הניקוד שעליך ליישם: (1) מילות קוד: הצג/תאר = תיאור בלי סיבות. הסבר = תיאור + סיבות/השפעות + דוגמה. השווה = דומה ושונה לפי קריטריונים. (2) עיגון בקטע מקור: תשובה נכונה שאין לה שום ביטוי בקטע = 0 ניקוד. תשובה נכונה שלא קושרה לקטע = עד 60%. (3) רמות תשובה: נדרש הסבר אך רק הציג = עד 70%. נדרש הסבר אך רק ציין בראשי פרקים = עד 60%. ציטוט בלבד ללא עיבוד = עד 60%. (4) אם לא צוין מספר פריטים, הנבחן צריך לפרט 3 פריטים. תשובה ארוכה שלא לעניין אינה מקנה ניקוד. חובה להתחיל במילה ציון ולאחריה מספר. תן משוב קצר עד שלושה משפטים אזהרה חמורה: לעולם אל תגלה את התשובה הנכונה או סעיפי המחוון החסרים. אם התלמיד טעה תן רמז קצר אחד בלבד שיגרום לו לחשוב ולתקן בעצמו." }] },
    generationConfig: {
      maxOutputTokens: 2500,
      temperature: 0.7
    }
  }

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  }

  const response = UrlFetchApp.fetch(url, options)
  const result = JSON.parse(response.getContentText())
  
  if (result.error) {
    return "שגיאה בשרת " + result.error.message
  }
  return result.candidates[0].content.parts[0].text
}