// This gets called when Button 1 has been clicked
function startBulan_SheetToDocs_GS() {
  const html = HtmlService.createHtmlOutputFromFile('Bulan_SheetToDocs_HTML')
    .setTitle('Bulan DMS - Sheet to Docs')
    .setWidth(400);
  SpreadsheetApp.getUi().showSidebar(html);
}

function getSheetHeaders(sheetName, rangeA1) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) throw new Error('Sheet not found.');
  
  const range = sheet.getRange(rangeA1);
  const headers = range.getValues()[0]; // first row
  return headers;
}

function getTemplatePlaceholders(templateId) {
  const doc = DocumentApp.openById(templateId);
  const bodyText = doc.getBody().getText();
  const placeholders = [...bodyText.matchAll(/\{(.*?)\}/g)].map(m => m[1]);
  return [...new Set(placeholders)]; // unique only
}

function generateDocuments(settings) {
  const ss = SpreadsheetApp.openById(settings.sheetId);
  const sheet = ss.getSheetByName(settings.sheetName);
  const range = sheet.getRange(settings.rangeA1);
  const data = range.getValues();
  const headers = data[0];

  const folder = DriveApp.getFolderById(settings.folderId);
  const templateId = settings.templateId;
  const map = settings.mapping; // { templatePlaceholder: sheetHeader }

  const results = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const templateCopy = DriveApp.getFileById(templateId).makeCopy(settings.fileNameFormat, folder);
    const doc = DocumentApp.openById(templateCopy.getId());
    let body = doc.getBody();

    // Build a data map from headers to values
    const rowData = {};
    headers.forEach((header, idx) => {
      rowData[header] = row[idx];
    });

    // Replace placeholders
    for (let placeholder in map) {
      const sheetField = map[placeholder];
      const value = rowData[sheetField] || '';
      body.replaceText(`{${placeholder}}`, value);
    }

    // Update file name dynamically
    let finalName = settings.fileNameFormat;
    finalName = finalName.replace(/\{(.*?)\}/g, (_, match) => rowData[match] || '');
    templateCopy.setName(finalName);

    doc.saveAndClose();
    results.push(finalName);
  }

  return results.length;
}

function extractIdFromUrl(url) {
  const match = url.match(/[-\w]{25,}/);
  return match ? match[0] : null;
}
