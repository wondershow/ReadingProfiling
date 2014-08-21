var selElem = null; // store the currently selected element
var origBorder = "";
var HEADLINE_TOOLIP_ID = 'headline_toolip';
var ifReadingOver = false;
//jsonSendObjArr is for data exchange use
var MAX_SENDOBJ_LENGTH = 200;
var OBJ_ARR_LENGTH = 5;
var jsonSendObjArr = {};
jsonSendObjArr.objList = [];
jsonSendObjArr.objArrLen = OBJ_ARR_LENGTH;
jsonSendObjArr.curItem = 0;     //The obj index that is holding client side data
jsonSendObjArr.lastSendItm = 0; //The obj index that is sent by ajax
for(var i=0; i<OBJ_ARR_LENGTH; i++) {
	jsonSendObjArr.objList[i] = {};
	jsonSendObjArr.objList[i].dataList=[];
}

//The vertical offset of the current window and the whole document
pageHeadObj = {};
pageHeadObj.pageHeadY = 0;
pageHeadObj.timeStamp = 0;

var lastScrollTimeStamp = 0;

//we suppose that two intentional scroll action at least 
//have a time interval of SCROLL_TIMESPAN milliseconds
var SCROLL_TIMESPAN = 1000;

//userDataObjArr is for front-end behavioral analysis analysis use
var userDataObjArr = {};
userDataObjArr.dataList = [];

//How many data items are stored in this array?
userDataObjArr.dataLength = 0; 

//How many data items have been processed by the front side behavioral analysis algorithm
userDataObjArr.cursorLength = 0; 

//For display use
var totalDataLength = 0;


/**
object to hold where last curser event happened
*/
var lastCursorPos = {};
lastCursorPos.clientX = 0;
lastCursorPos.clientY = 0;
lastCursorPos.pageX = 0;
lastCursorPos.pageY = 0;

//the webservice url
var WEB_SERVICE_URL = 'https://script.google.com/macros/s/AKfycbwkbRhGvACgigHBcNLgW_mGnWSxkuGhzNAxqgk-76yQemxi7ZE/exec';

//The Y value of the first and last word, which helps to get the page height
var lastWordY;
var fistWordY;
var headlineY;


var g_bluredItemList = new List();


	chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
		switch(message.type) {
			case "colors-div":
				startReadingHint();
				captureAndDislayUserData();
			break;
		}
	});

	function captureAndDislayUserData() {
		var body = document.querySelectorAll("body");
		if(body.length === 0) {
			alert("There are no any divs in the page.");
		} else {
			body[0].addEventListener("click",getClickXY, false);
			body[0].addEventListener("mousemove",showMouseMove,false);
			window.addEventListener("scroll",showMouseScroll,false);

			pageHeadObj.pageHeadY = $(window).scrollTop();
			pageHeadObj.timeStamp = new Date().getTime();

			//var win = $(window);
			//win.addEventListener("scroll",showMouseScroll,false);
		}
	}

	/**
		This function collects the basic subject environment data such
		as his/her screen width, height, page width and height, the place
		of the first/last paragrah and the position of the headline
		send these to the web server
	**/
	function sendBasicSettings() {
		var url = WEB_SERVICE_URL + '?type=record&win_h=' + $(window).height()
			+ "&win_w=" + $(window).width() +  "&page_w=" + $(document).width()
			+ "&page_h=" + $(document).height() + "&firstwordY=" + fistWordY
			+ "&lastwordY=" + lastWordY + "&headlineY=" +headlineY;
		
		console.log(url);
		ajaxRequest(url);
	}

	/***
	This function detects an intentional scroll
	**/
	function detectUserScroll() {
		var curTimeStamp = new Date().getTime();
		if( (curTimeStamp - lastScrollTimeStamp) >  SCROLL_TIMESPAN) {// scroll detected
			var deltaOffset = $(window).scrollTop() - pageHeadObj.pageHeadY;
			var deltaTime = curTimeStamp -  pageHeadObj.timeStamp;
			
			console.log("real Scroll detected: y Delta = " + deltaOffset + ", timeDelta = " +deltaTime 
				+ ",From:" + pageHeadObj.pageHeadY + "To: " + $(window).scrollTop());

			var dataObj = {
				'Type' : 'scroll',
				'From':pageHeadObj.pageHeadY,
				'To':$(window).scrollTop(),
				'TimeDelta':deltaTime,
				'YDelta':deltaOffset,
			}

			processRawData(dataObj);

			pageHeadObj.pageHeadY = $(window).scrollTop();
			pageHeadObj.timeStamp = curTimeStamp;
		}
	}

	/**
		To detect the scroll action
	**/
	function showMouseScroll(event) {
		var curTimeStamp = new Date().getTime();
		lastScrollTimeStamp = curTimeStamp;
		setTimeout(detectUserScroll,SCROLL_TIMESPAN);
	}

	/**
		To detect the mouse position
	**/
	function showMouseMove(event) {
		var dataObj = {
			'Type' : 'mouse',
			'ClientX':event.clientX,
			'ClientY':event.clientY,
			'ScreenX':event.screenX,
			'ScreenY':event.screenY,
			'PageX':event.pageX,
			'PageY':event.pageY,
		}
		processRawData(dataObj);
		//processRawData('mouse',event.clientX,event.clientY,event.screenX,event.screenY,event.pageX,event.pageY);
		return false;
	}

	/*
		To update lastCursor position
	*/
	function updateLastCursor(client_X,client_Y,page_X,page_Y) {
		lastCursorPos.clientX = client_X;
		lastCursorPos.clientY = client_Y;
		lastCursorPos.pageX = page_X;
		lastCursorPos.pageY = page_Y;
	}

	/**
		This function handles all the raw data gotten from a user behavior. 
		It creates an object for each raw data item, put it into a collection(array).
		Send data to remote server if necessary.
	***/
	//function processRawData(type,clientX,clientY,screenX,screenY,pageX,pageY) {
	function processRawData(dataObj) {
		var timestamp = new Date().getTime();
		var date = new Date(timestamp);
		//console.log("timestamp = " + timestamp + ", ");
		var dateString = date.getFullYear() + '/' + (date.getMonth()+1) + '/' +  date.getDate()  + ' '
						  + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
		
		dataObj.Timestamp = timestamp + "s";
		dataObj.Date = dateString;
		/*
		//console.log("timestamp = " + timestamp + ", dateString = " + dateString);
		var new_obj = {'Timestamp':timestamp+'s','Date':dateString,'Type':type, 'ClientX':clientX, 
					   'ClientY':clientY, 'ScreenX':screenX,'ScreenY':screenY,'PageX':pageX,'PageY':pageY};
		
		//we need to create two identical data item, one for send one for front-end analysis
		var new_obj1 = {'Timestamp':timestamp+'s','Date':dateString,'Type':type, 'ClientX':clientX, 
					   'ClientY':clientY, 'ScreenX':screenX,'ScreenY':screenY,'PageX':pageX,'PageY':pageY};
		*/
		updateLastCursor(dataObj.ClientX,dataObj.ClientY,dataObj.PageX,dataObj.PageY);
		
	

		totalDataLength++;

		//Put data into front-end storage Array
		//userDataObjArr.dataList.push(new_obj1);
		//userDataObjArr.dataLength++;

		//put data into cache array for ajax send
		var curItemIndex = jsonSendObjArr.curItem;
		jsonSendObjArr.objList[curItemIndex].dataList.push(dataObj);      //jsonSendObj.itemList.push( new_obj );
		
		//when necessary, send the data.
		if(jsonSendObjArr.objList[curItemIndex].dataList.length >= MAX_SENDOBJ_LENGTH) {
			console.log("send json data, totalDataLength = " + totalDataLength + ", curItemIndex = " 
						+ curItemIndex + ", len = " + jsonSendObjArr.objList[curItemIndex].dataList.length);
			console.log("Length of array is " + totalDataLength);
			jsonSendObjArr.curItem = (jsonSendObjArr.curItem + 1) % OBJ_ARR_LENGTH;
			sendJSONData();
		}
	}

	/**
		Send JSON data to a remove server.(google web app)
	**/
	function sendJSONData() {
		//jsonSendObjArr.lastSendItm = jsonSendObjArr.curItem;
		var curObjIndex = jsonSendObjArr.lastSendItm;
		jsonSendObjArr.lastSendItm = (jsonSendObjArr.lastSendItm + 1) % OBJ_ARR_LENGTH;
		
		if( ifReadingOver == false) // send before the user confirms that the reading is over 
			$.ajax({
				   type: "POST",
				   url: WEB_SERVICE_URL,
				   dataType: "json",
				   success: function (msg) {
					   //console.log(arguments);
					   //alert('success')
					   cleanSendObjArray(curObjIndex);
				   },
				   error: function(XMLHttpRequest, textStatus, errorThrown) {
				   
						//console.log(arguments);
						//alert("Status: " + textStatus);
						//alert("Error: " + errorThrown);
					  cleanSendObjArray(curObjIndex);

				   },
				   data: JSON.stringify(jsonSendObjArr.objList[curObjIndex])
			});
	}

	/***
		To clean the send obj array.
	**/
	function cleanSendObjArray(index) {
		jsonSendObjArr.objList[index] = {};
		jsonSendObjArr.objList[index].dataList=[];
	}

	/***
		This function get and display coordinate of a mouse click event.
	***/
	function getClickXY(event){
		var dataObj = {
			'Type' : 'click',
			'ClientX':event.clientX,
			'ClientY':event.clientY,
			'ScreenX':event.screenX,
			'ScreenY':event.screenY,
			'PageX':event.pageX,
			'PageY':event.pageY,
		}
		processRawData(dataObj);

		//processRawData('click',event.clientX,event.clientY,event.screenX,event.screenY,event.pageX,event.pageY);
		return false;
	}

	/**
		To log unblur action
	*/
	function recordUnBlurEvent(event) {
		var dataObj = {
			'Type' : 'unblur',
			'ClientX':event.clientX,
			'ClientY':event.clientY,
			'ScreenX':event.screenX,
			'ScreenY':event.screenY,
			'PageX':event.pageX,
			'PageY':event.pageY,
		}
		processRawData(dataObj);
		//processRawData('unblur',event.clientX,event.clientY,event.screenX,event.screenY,event.pageX,event.pageY);
		return false;
	}

	function startReadingHint()
	{
		//Get the headline element
		var result = getHeadLine();
		
		//the vertical offset of the 1st paragraph
		var fistParaYOffset = undefined;
		
		if( $(result).text())
		{ // if result exists
			//Add a div to display a msg over the headline element, telling the subject to start
			
			var destination = $(result).offset();
			headlineY = destination.top;

			//alert("destination: " + destination.top + "," + destination.left);
			$('#start_tag').css({top: destination.top, left: destination.left});
			var pObj = getParagraphs(result);
			var firstPara = pObj.paras[0];
			
			fistParaYOffset = getParaPosition(pObj.paras[0]);	
			
			for(var i=0;i<pObj.length;i++) {
				$(pObj.paras[i]).lettering('words');
			}
			
			var spanArray;
			for(var i=0;i<pObj.length;i++) {
				spanArray = $(pObj.paras[i]).children('span')
				
				//blur first word
				blurElement(spanArray[0]);

				var randIndex = Math.floor((Math.random() * (pObj.length-1)) + 1)
				blurElement(spanArray[randIndex]);

				//unBlurElement(spanArray[0]);
				//alert($(spanArray[0]).html());
			}

			lastWordY = $(spanArray[spanArray.length-1]).offset().top;

			//set up the js for last word in the article.
			blurLastSpan(spanArray[spanArray.length-1])
			
			//to ask the subject to input his/her name
			promtSubjectName(result);

			//scrollTo the 1st paragraph.
			//window.scrollTo(0,fistParaYOffset);

			//update pageHead object
			pageHeadObj.pageHeadY = $(window).scrollTop();
			pageHeadObj.timeStamp = new Date().getTime();
		}
	}

	/**
		To popup a dialog box asking the subject to input his/her name
	**/
	function promtSubjectName(headLine) {
		var name = prompt("Can you please tell us your name? ");
		var fullURL = WEB_SERVICE_URL + "?type=create&user_name=" + encodeURIComponent(name.trim());
		ajaxRequest(fullURL);
		alert("Thanks " + name + "!, please start reading");
	}