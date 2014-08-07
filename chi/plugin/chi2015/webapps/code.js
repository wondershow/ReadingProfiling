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


function getDataTable() {
  
  var res = {};
  var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
  var sheet = ss.getSheetByName("DATA");
  
  var dataClickPage = Charts.newDataTable()
     .addColumn(Charts.ColumnType.NUMBER, "X")
     .addColumn(Charts.ColumnType.NUMBER, "Y")
  
  var dataClickScreen = Charts.newDataTable()
     .addColumn(Charts.ColumnType.NUMBER, "X")
     .addColumn(Charts.ColumnType.NUMBER, "Y")
  
  var dataMousePage = Charts.newDataTable()
     .addColumn(Charts.ColumnType.NUMBER, "X")
     .addColumn(Charts.ColumnType.NUMBER, "Y")
  
  var dataMouseScreen = Charts.newDataTable()
     .addColumn(Charts.ColumnType.NUMBER, "X")
     .addColumn(Charts.ColumnType.NUMBER, "Y")
  
  
  
  var colName2IndexMapping = {};
  var colNum = sheet.getLastColumn();
  
  var headers = sheet.getRange(1, 1, 1, colNum).getValues()[0]; //read headers
  for(i=0;i<headers.length;i++) {
    Logger.log(headers[i]);
    colName2IndexMapping[headers[i]] = i;
  }
  
  var range = sheet.getDataRange();
  var lastRow = range.getLastRow();
  
  for(var i=2;i<=lastRow;i++)  {
    row = sheet.getRange(i, 1, 1, colNum).getValues()[0];
    var indexType = colName2IndexMapping['Type'];
    var indexPageX = colName2IndexMapping['PageX'];
    var indexPageY = colName2IndexMapping['PageY'];
    var indexScreenX = colName2IndexMapping['ClientX'];
    var indexScreenY = colName2IndexMapping['ClientY'];
    if(row[indexType] == 'mouse') {
      dataMousePage.addRow([  row[indexPageX]       ,    row[indexPageY]      ]);
      dataMouseScreen.addRow([  row[indexScreenX]       ,    row[indexScreenY]      ]);
    } else {
      dataClickPage.addRow([row[indexPageX],row[indexPageY]]);
      dataClickScreen.addRow([row[indexScreenX],row[indexScreenY]]);
    }
  }
  
  res.dataMousePage = dataMousePage;
  res.dataMouseScreen = dataMouseScreen;
  res.dataClickPage = dataClickPage;
  res.dataClickScreen = dataClickScreen;
  
  return res;
}

function createChartUiApp() {
  
   dataObj = getDataTable();
  
   var mousePageChartBuilder = Charts.newScatterChart()
       .setTitle('User Mouse Map(Global)')
       .setXAxisTitle('Page X')
       .setYAxisTitle('Page Y')
       .setDimensions(500, 500)
       .setLegendPosition(Charts.Position.NONE);
   
   var mouseScreenChartBuilder = Charts.newScatterChart()
       .setTitle('User Mouse Map(Window)')
       .setXAxisTitle('Screen X')
       .setYAxisTitle('Screen Y')
       .setDimensions(500, 500)
       .setLegendPosition(Charts.Position.NONE);
  
  var clickPageChartBuilder = Charts.newScatterChart()
       .setTitle('User Click Map(Global)')
       .setXAxisTitle('Page X')
       .setYAxisTitle('Page Y')
       .setDimensions(500, 500)
       .setLegendPosition(Charts.Position.NONE);
  
  var clickScreenChartBuilder = Charts.newScatterChart()
       .setTitle('User Click Map(Window)')
       .setXAxisTitle('Screen X')
       .setYAxisTitle('Screen Y')
       .setDimensions(500, 500)
       .setLegendPosition(Charts.Position.NONE);
   
  
  mousePageChartBuilder.setDataTable(dataObj.dataMousePage);
  mouseScreenChartBuilder.setDataTable(dataObj.dataMouseScreen);
  clickPageChartBuilder.setDataTable(dataObj.dataClickPage);
  clickScreenChartBuilder.setDataTable(dataObj.dataClickScreen);
  
  var mousePageChart = mousePageChartBuilder.build();
  var mouseScreenChart = mouseScreenChartBuilder.build();
  var clickPageChart = clickPageChartBuilder.build();
  var clickScreenChart = clickScreenChartBuilder.build();
  
  var app = UiApp.createApplication();
  var vPanel = app.createVerticalPanel();
  var hPanel1 = app.createHorizontalPanel();
  var hPanel2 = app.createHorizontalPanel();
  hPanel1.add(mousePageChart).add(mouseScreenChart);
  hPanel2.add(clickPageChart).add(clickScreenChart);
  vPanel.add(hPanel1).add(hPanel2);

  app.add(vPanel);
   
   
  return app;
   
   //var flow = app.createFlowPanel();
   
   //var document.getElementById('columnchart')
   //return UiApp.createApplication().add(chart);
}


/**

**/
function createChart(srcURL) {
  var chartBuilder = Charts.newScatterChart()
  .setTitle('Adjusted GDP vs. U.S. Population')
  .setXAxisTitle('U.S. Population (millions)')
  .setYAxisTitle('Adjusted GDP ($ billions)')
  .setDimensions(1000, 1000)
  .setLegendPosition(Charts.Position.NONE)
  .setDataSourceUrl(srcURL);
  
  return chartBuilder.build();
}

function doGet(e) { // change to doPost(e) if you are recieving POST data
  
  /*
  var data = Charts.newDataTable()
      .addColumn(Charts.ColumnType.STRING, "Name")
      .addColumn(Charts.ColumnType.STRING, "Gender")
      .addColumn(Charts.ColumnType.NUMBER, "Age")
      .addColumn(Charts.ColumnType.NUMBER, "Donuts eaten")
      .addRow(["Michael", "Male", 12, 5])
      .addRow(["Michael", "Male", 12, 5])
      .addRow(["Elisa", "Female", 20, 7])
      .addRow(["Robert", "Male", 7, 3])
      .addRow(["John", "Male", 54, 2])
      .addRow(["Jessica", "Female", 22, 6])
      .addRow(["Aaron", "Male", 3, 1])
      .addRow(["Margareth", "Female", 42, 8])
      .addRow(["Miranda", "Female", 33, 6])
      .build();

  var ageFilter = Charts.newNumberRangeFilter()
      .setFilterColumnLabel("Age")
      .build();

  var genderFilter = Charts.newCategoryFilter()
      .setFilterColumnLabel("Gender")
      .build();

  var pieChart = Charts.newPieChart()
      .setDataViewDefinition(Charts.newDataViewDefinition()
                            .setColumns([0,3]))
      .build();

  var tableChart = Charts.newTableChart()
      .build();

  var dashboard = Charts.newDashboardPanel()
      .setDataTable(data)
      .bind([ageFilter, genderFilter], [pieChart, tableChart])
      .build();

  var uiApp = UiApp.createApplication();

  dashboard.add(uiApp.createVerticalPanel()
                .add(uiApp.createHorizontalPanel()
                    .add(ageFilter).add(genderFilter)
                    .setSpacing(70))
                .add(uiApp.createHorizontalPanel()
                    .add(pieChart).add(tableChart)
                    .setSpacing(10)));

  uiApp.add(dashboard);
  return uiApp;*/
  
  
  
  
  
  
  

  

  
  
  
  return createChartUiApp();
  
  /*
  var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
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
  return app;
  
  var app = UiApp.createApplication();
  var form = app.createFormPanel();
  var flow = app.createFlowPanel();
  flow.add(app.createTextBox().setName(type));
  flow.add(app.createSubmitButton(type));
  form.add(flow);
  app.add(form);
  Logger.log("just for asdf444444");
  return app;*/
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

