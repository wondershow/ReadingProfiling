/**
create a spreadsheet under a specific drive folder
**/
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
      curSSFile = newFile;
      var sheet = ss.getSheets()[0];
      sheet.appendRow(["Timestamp","Date","Type","ClientX","ClientY","ScreenX","ScreenY","PageX","PageY"]);
      break;
    }
  }
}

/**
View a spread sheet as a table, to simulate a query on this table like

SELECT col_name1 FROM ss WHERE col_name2 = 'key'

Note that the return value is an array
**/
function getDataFromSpreadSheet(col_name1, col_name2, sheet, key) {
  
  var res = [];
  
  var colName2IndexMapping = {};
  
  var colNum = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, colNum).getValues()[0]; //read headers
  var colArr = [col_name1,col_name2];
  
  
  for(var i=0;i<colArr.length;i++) {
    for(var j=0;j<headers.length;j++) {
      if(headers[j] == colArr[i] )
      colName2IndexMapping[colArr[i]] = j;
    }
  }
  
  
  //freze the first row 
  sheet.setFrozenRows(1);
  //sort sheet by the query column, so that we dont have to check every single row
  sheet.sort(colName2IndexMapping[col_name2] + 1);
  
  var range = sheet.getDataRange();
  var lastRow = range.getLastRow();
  Logger.log("Row number = " + lastRow);
  var ifMatch = false;
  
  for(var i=2;i<=lastRow;i++)  {
    row = sheet.getRange(i, 1, 1, colNum).getValues()[0];
    var indexOfQuery = colName2IndexMapping[col_name2];
    var indexOfRes = colName2IndexMapping[col_name1];
    //Logger.log("row[0] = " + row[0] + "row[1] = " + row[1] );
    Logger.log("indexOfQuery = " + indexOfQuery + ", indexOfRes = " + indexOfRes);
    
    if(row[indexOfQuery] == key ) {
      ifMatch = true;
      res.push(row[indexOfRes]);
      
    }
    
    
    //jump out when mismatch after match appears
    if(ifMatch && row[indexOfQuery] != key) 
      break;
  }
  
  
  return res;
}

/**
   To open a file under specific drive path
**/
function openFileWithPath(folderName,fileName){
  var folders = DriveApp.getFoldersByName(folderName);
  while (folders.hasNext()) {
    var folder = folders.next();
  }
  var files = folder.getFiles();
  while (files.hasNext()) {
    var newFile = files.next();
    if(newFile.getName() == fileName) {
          return newFile;
    }
  }
  
  return null;
}


/**
UPDATE ss
SET col1 = val1, col2 = val2...
WHERE colx = valx
*/
function updateTable(colArr,valArr,colx,valx,sheet) {

  
  var colNum = sheet.getLastColumn();
  var lastRow = sheet.getLastRow();
  var headers = sheet.getRange(1, 1, 1, colNum).getValues()[0]; //read headers   
  
  var dataRows = sheet.getRange(2, 1, lastRow -1 , colNum).getValues();
  
  Logger.log("dataRows.length = " + dataRows.length);
  
  var col2indexMap = getCol2IndexMapping(headers);
  var newRow = [];
  for(var i=0;i<dataRows.length;i++) {
  
    var row = dataRows[i];
    var keyIndex = col2indexMap[colx];
    if(row[keyIndex] == valx) {
      for(var j=0;j<row.length;j++) 
        newRow[j] = row[j];
      for(var j=0;j<colArr.length;j++) {
        var index = col2indexMap[colArr[j]];
        newRow[index] = valArr[j];
        Logger.log("updating111")
      }
      
      var values = [];
      values.push(newRow);
      Logger.log("values = " + values);
      range = sheet.getRange(2+i, 1, 1, colNum);      
      range.setValues(values);
      
      Logger.log("matched111");
      break;
    }
    
  }






}


/**
This function creates a mapping from colname to index.
**/
function getCol2IndexMapping(header) {
  var res = {};
  for(var j=0;j<header.length;j++) 
    res [ header[j] ] = j;
  
  
  return res;
}


/**

Insert a row into a spreadsheet 

**/
function insertIntoTable(colArr, valArr, sheet) {
  var colNum = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, colNum).getValues()[0]; //read headers 
  
  //create an array same length with number of columns and initialized with ''
  var fullRow = [];
  for (var i=0;i<headers.length;i++) 
       fullRow.push('');
  
  //populate the fullRow with values given by the caller
  for (var j=0;j<headers.length;j++) {
    var colName = headers[j]
    for(i =0;i<colArr.length;i++) {
      if(colArr[i] == colName) {
        fullRow[j] = valArr[i];
        break;
      }
    }
  }
 
  sheet.appendRow(fullRow);
}


function test() {
 

  
  var win_h = 1
    var win_w = 2
    var page_h = 3
    var page_w = 4
    
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
    var colArr = ['date','ssname','win_w','win_h','page_w','page_h'];
    var valArr = [timeStamp,dataSheetName,win_w,win_h,page_w,page_h];
    insertIntoTable(colArr,valArr,subjectSheet);
}