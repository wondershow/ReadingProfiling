/**
 * Retrieves all the rows in the active spreadsheet that contain data and logs the
 * values for each row.
 * For more information on using the Spreadsheet API, see
 * https://developers.google.com/apps-script/service_spreadsheet
 */
function readRows() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var rows = sheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();

  for (var i = 0; i <= numRows - 1; i++) {
    var row = values[i];
    Logger.log(row);
  }
};

/**
 * Adds a custom menu to the active spreadsheet, containing a single menu item
 * for invoking the readRows() function specified above.
 * The onOpen() function, when defined, is automatically invoked whenever the
 * spreadsheet is opened.
 * For more information on using the Spreadsheet API, see
 * https://developers.google.com/apps-script/service_spreadsheet
 */
function onOpen() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = [{
    name : "Read Data",
    functionName : "readRows"
  }];
  spreadsheet.addMenu("Script Center Menu", entries);
};



function doGet(e) { // change to doPost(e) if you are recieving POST data
  var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
  var sheet = ss.getSheetByName("DATA");
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]; //read headers
  var nextRow = sheet.getLastRow(); // get next row
  var cell = sheet.getRange('a1');
  var col = 0;
  
  //var json = response.getContentText();
  //var data = JSON.parse(json);
  
  
  for (i in headers){ // loop through the headers and if a parameter name matches the header name insert the value
    if (headers[i] == "Timestamp"){
      val = new Date();
    } else {
      val = e.parameter[headers[i]];
    }
    cell.offset(nextRow, col).setValue('get');
    col++;
  }
  
  //http://www.google.com/support/forum/p/apps-script/thread?tid=04d9d3d4922b8bfb&hl=en
  var app = UiApp.createApplication(); // included this part for debugging so you can see what data is coming in
  var panel = app.createVerticalPanel();
  for( p in e.parameters){
    panel.add(app.createLabel(p +"get "+e.parameters[p]));
  }
  app.add(panel);
  return app;
}

function doPost(e) { // change to doPost(e) if you are recieving POST data
  var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
  var sheet = ss.getSheetByName("DATA");
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]; //read headers
  var nextRow = sheet.getLastRow(); // get next row
  var cell = sheet.getRange('a1');
  
  var attr_val = '';
  //attr_val += "contents = " + e.postData.contents
  //attr_val += "getContentType" + e.postData.getContentType();
  var jsonData = JSON.parse(e.postData.contents);
  
  //for(var key in e.postData) {
  //attr_val += data.itemlist[0].F1 + ',' + data.itemlist[0].F2;
  //}
  
  for(var j = 0; j<jsonData.itemlist.length;j++) {
    var col = 0;
    for (i in headers){ // loop through the headers and if a parameter name matches the header name insert the value
      if (headers[i] == "Timestamp"){
        val = new Date();
      } else {
        var obj = jsonData.itemlist[j];
        val = obj[headers[i]];
      }
      cell.offset(nextRow+j, col).setValue(val);
      col++;
    }
  }
  //http://www.google.com/support/forum/p/apps-script/thread?tid=04d9d3d4922b8bfb&hl=en
  var app = UiApp.createApplication(); // included this part for debugging so you can see what data is coming in
  var panel = app.createVerticalPanel();
  for( p in e.parameters){
    //panel.add(app.createLabel(p +" "+e.parameters[p]));
    panel.add(app.createLabel(p +" post" + attr_val));
  }
  app.add(panel);
  return app;
}


//http://www.google.sc/support/forum/p/apps-script/thread?tid=345591f349a25cb4&hl=en
function setUp() {
  ScriptProperties.setProperty('active', SpreadsheetApp.getActiveSpreadsheet().getId());
}


