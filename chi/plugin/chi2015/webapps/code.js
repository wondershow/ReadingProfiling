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
  /*var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
  var sheet = ss.getSheetByName("DATA");
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]; //read headers
  var nextRow = sheet.getLastRow(); // get next row
  var cell = sheet.getRange('a1');
  var col = 0;
  for (i in headers){ // loop through the headers and if a parameter name matches the header name insert the value
    if (headers[i] == "Timestamp"){
      val = new Date();
    } else {
      val = e.parameter[headers[i]];
    }
    cell.offset(nextRow, col).setValue(val);
    col++;
  }
  
  Logger.log("just for test");

  //http://www.google.com/support/forum/p/apps-script/thread?tid=04d9d3d4922b8bfb&hl=en
  var app = UiApp.createApplication(); // included this part for debugging so you can see what data is coming in
  var panel = app.createVerticalPanel();
  for( p in e.parameters){
    panel.add(app.createLabel(p +" "+e.parameters[p]));
  }
  app.add(panel);
  return app;*/
  
  var app = UiApp.createApplication();
  var form = app.createFormPanel();
  var flow = app.createFlowPanel();
  flow.add(app.createTextBox().setName("textBox"));
  flow.add(app.createSubmitButton("Submit11111111"));
  form.add(flow);
  app.add(form);
  Logger.log("just for asdf444444");
  return app;
}

/**

from https://developers.google.com/apps-script/releases/?hl=en

function doPost(request) {
    var jsonString = request.postData.getDataAsString();
    var jsonData = JSON.parse(jsonString);
    sheet.appendRow([ 'Data1:' , jsonData.Data1 ]); // Just an example
}


**/
function doPost(e) { // change to doPost(e) if you are recieving POST data
  //clear the table for storage.
  //delAllRows();
  
  
  var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
  var sheet = ss.getSheetByName("DATA");
  var maxRow = sheet.getMaxRows();
  Logger.log("maxRow = " + maxRow);
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]; //read headers
  var nextRow = sheet.getLastRow(); // get next row
  Logger.log("nextRow = " + nextRow);

  if( (maxRow - nextRow) < 1000 ) {
    sheet.insertRowsAfter(maxRow,1000);
  }
  
  var cell = sheet.getRange('a1');
  var attr_val = '';
  //attr_val += "contents = " + e.postData.contents
  //attr_val += "getContentType" + e.postData.getContentType();
  var jsonData = JSON.parse(e.postData.contents);
  //for(var key in e.postData) {
  //attr_val += data.dataList[0].F1 + ',' + data.DataList[0].F2;
  //}
  Logger.log("just for test1111");
  
  for(var j = 0; j<jsonData.dataList.length;j++) {
    var col = 0;
    var row = nextRow+j;
    Logger.log("inserting at row " + row );
    for (i in headers){ // loop through the headers and if a parameter name matches the header name insert the value
      /*if (headers[i] == "Timestamp") {
        //val = new Date();
        Logger.log("Timestamp = " + obj[ headers[i] ] );
      }*/
      var row = nextRow+j;
      var obj = jsonData.dataList[j];
      var val = obj[ headers[i] ];
      cell.offset(nextRow+j, col).setValue(val);
      col++;
    }
  }
  
  Logger.log("just for test3333333");
  var app = UiApp.createApplication();
  app.add(app.createLabel("Form submitted. The text box's value was asdf"));
  return app;
}


//http://www.google.sc/support/forum/p/apps-script/thread?tid=345591f349a25cb4&hl=en
function setUp() {
  ScriptProperties.setProperty('active', SpreadsheetApp.getActiveSpreadsheet().getId());
}

function testMaxRow() {
 
}

/**
This function deletes all rows in a spreadsheet,
only keep the 1st row(head row).
*/
function delAllRows() {
  var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
  var sheet = ss.getSheetByName("DATA");
  var range = sheet.getDataRange();
  var lastRow = range.getLastRow()
  
  sheet.deleteRows(2, lastRow-1)
}

