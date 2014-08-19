//The name of driver folder to hold all the data
var FOLDER_NAME = 'chi2015';

//remember the current spreadsheet file
var curSSFile;

// Script-as-app template.
function doGet(e) {
  
  Logger.log("e.parameter['type'] = " + e.parameter['type']);
  //Logger.log("e.parameter['type']");
  
  if(e.parameter['type']=='create') { // create a new table
    var user_name = e.parameter['user_name'];
    var file_name = user_name;
    while(ifFileExists(file_name,FOLDER_NAME))
      file_name = file_name + "1";
    
    
    //create a new spreadsheet for this user to hold his behavorial data
    createSpreadSheet(file_name,FOLDER_NAME);
    
    
    //update the "Subjects" table to keep this user tracked
    var file = openFileWithPath('chi2015','Subjects');
    var ss = SpreadsheetApp.openById(file.getId());
    var sheet = ss.getSheets()[0];
    updateTable(['curSSname'],[file_name], 'username','Admin',  sheet);
    
    Logger.log("doGet type = create");
  } else if(e.parameter['type']=='record') { // to record some basic settings of a subject
    var win_h = e.parameter['win_h'];
    var win_w = e.parameter['win_w'];
    var page_h = e.parameter['page_h'];
    var page_w = e.parameter['page_w'];
    var firstY = e.parameter['firstwordY'];
    var lastY = e.parameter['lastwordY'];
    var headlineY = e.parameter['headlineY'];
    
    
    var d = new Date();
    var timeStamp = d.toLocaleDateString() + " " + d.toLocaleTimeString()
    //col_name1, col_name2, sheet, key
     //update the "Subjects" table to keep this user tracked
    var file = openFileWithPath('chi2015','Subjects');
    var ss = SpreadsheetApp.openById(file.getId());
    var subjectSheet = ss.getSheets()[0];
    //var colArr = [col_name1,"username",subjectSheet,"Admin"];
    
    var res = getDataFromSpreadSheet('curSSname',"username",subjectSheet,'Admin');
    var dataSheetName = res[0];
    
   
    //file = openFileWithPath('chi2015',dataSheetName);
    //ss = SpreadsheetApp.openById(file.getId());
    //var dataSheet = ss.getSheets()[0];                             
    var colArr = ['date','ssname','win_w','win_h','page_w','page_h','firstword_y','lastword_y','headline_y'];
    var valArr = [timeStamp,dataSheetName,win_w,win_h,page_w,page_h,firstY,lastY,headlineY];
    Logger.log("colArr:" + colArr);
    Logger.log("valArr:" + valArr);
    insertIntoTable(colArr,valArr,subjectSheet);
    Logger.log("doGet type = record");
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  //The following code are useless
  var app = UiApp.createApplication();
  var button = app.createButton('Click Me');
  app.add(button);
  var label = app.createLabel('The button was clicked.')
                 .setId('statusLabel')
                 .setVisible(false);
  app.add(label);
  return app;
}


function doPost(e) { // change to doPost(e) if you are recieving POST data
  //clear the table for storage.
  //delAllRows();
 
  Logger.log("curSSFile.getId() = asdf"); 
  Logger.log("curSSFile.getId() = " + curSSFile.getId()) 
  var ss = SpreadsheetApp.openById(curSSFile.getId());
  
 
  //var ss = curSSFile//SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
  //var sheet = ss.getSheetByName("DATA");
  var sheet = ss.getSheets()[0];
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


/**
create a spreadsheet under a specific folder
*
function createSpreadSheet(fileName,folderName) {
  var folders = DriveApp.getFoldersByName(folderName);
  while (folders.hasNext()) {
   var folder = folders.next();
  }
  
  var file = {
    "title": fileName,
    "mimeType": "application/vnd.google-apps.spreadsheet",
    "parents": [
      {
        "id": folder.getId()
      }
    ]
  };
  
  Drive.Files.insert(file);
  
  var files = folder.getFiles();
  while (files.hasNext()) {
  
    var newFile = files.next();
    if(newFile.getName() == fileName) {
      var ss = SpreadsheetApp.openById(newFile.getId());
      var sheet = ss.getSheets()[0];
      sheet.appendRow(["Timestamp","Date","Type","ClientX","ClientY","ScreenX","ScreenY","PageX","PageY"]);
      break;
    }  
  }
}*/


/**
Check if a file has been existing in a folder
**/
function ifFileExists(fileName,folderName) {
  var folders = DriveApp.getFoldersByName(folderName);
  while (folders.hasNext()) {
   var folder = folders.next();
    var files = folder.getFiles();
    while (files.hasNext()) {
      var file = files.next();
      if(file.getName() == fileName)
        return true;
    }
  }
  return false;
}

/**
Just for test use
*/
function test1() {
  createSpreadSheet('asdf',FOLDER_NAME);
  //var res = ifFileExists('asdf',FOLDER_NAME);
  //Logger.log(res);
}

//http://www.google.sc/support/forum/p/apps-script/thread?tid=345591f349a25cb4&hl=en
function setUp() {
  ScriptProperties.setProperty('active', SpreadsheetApp.getActiveSpreadsheet().getId());
}