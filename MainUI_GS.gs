function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Bulan DMS')
    .addItem('Launch', 'openSidebar')
    .addToUi();
}

function openSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('MainUI_HTML')
    .setTitle('Bulan DMS - Main Menu')
    .setWidth(400);
  SpreadsheetApp.getUi().showSidebar(html);
}

// First function to call from Button 1
function runBulan_SheetToDocs_GS() {
  startBulan_SheetToDocs_GS();
}

// Second function to call from Button 2
function runBulan_AI_GS() {
  startBulan_AI_GS();
}
