var selElem = null; // store the currently selected element
var origBorder = "";
var HEADLINE_TOOLIP_ID = 'headline_toolip';

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


chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
	switch(message.type) {
		case "colors-div":
			//getScreenSize();
			//startReadingHint();
			//captureAndDislayUserData();			
			//sendDataByGet();
			//sendJSONData();
			captureAndDislayUserData();
			//showHeadLineToolips();
			//getMouseTrajectory();
			/*
			var divs = document.querySelectorAll("div");
			if(divs.length === 0) {
				alert("There are no any divs in the page.");
			} else {
				for(var i=0; i<divs.length; i++) {
					divs[i].style.backgroundColor = message.color;
				}
			}*/
			
			//window.scrollTo(0,100);
		break;
	}
});

function captureAndDislayUserData() {
	var body = document.querySelectorAll("body");
	if(body.length === 0) {
		alert("There are no any divs in the page.");
	} else {
		//body[0].addEventListener("click",getClickXY, false);
		//body[0].addEventListener("mousemove",showMouseMove,false);
		window.addEventListener("scroll",showMouseScroll,false);

		pageHeadObj.pageHeadY = $(window).scrollTop();
		pageHeadObj.timeStamp = new Date().getTime();

		
		//var win = $(window);
		//win.addEventListener("scroll",showMouseScroll,false);
	}
}

function getScreenSize() {
	console.log("windows.height:" + $(window).height());   // returns height of browser viewport
	console.log("windows.width:" + $(window).width());   // returns height of HTML document
	console.log("document.height:" + $(document).height());   
	console.log("document.width:" + $(document).width());   
}

/**
Test if the code can get HTML content in https
**/
function testHTTPS() {
	//var body = document.querySelectorAll("body");
	//var result = getHeadLine();
	//var pObj = getParagraphs(result);
	//fistParaYOffset = getParaPosition(pObj.paras[0]);
	alert($("em").html());
	alert($("h1").html());
	alert($("h2").html());
	alert($("h3").html());
	alert($("h4").html());
}




/***
This function detects an intentional scroll
**/
function detectUserScroll() {
	var curTimeStamp = new Date().getTime();
	if( (curTimeStamp - lastScrollTimeStamp) >  SCROLL_TIMESPAN) {// scroll detected
		var deltaOffset = $(window).scrollTop() - pageHeadObj.pageHeadY;
		var deltaTime = curTimeStamp -  pageHeadObj.timeStamp;

		pageHeadObj.pageHeadY = $(window).scrollTop();
		pageHeadObj.timeStamp = curTimeStamp;
		console.log("real Scroll detected: y Delta = " + deltaOffset + ", timeDelta = " +deltaTime );
	}

}

function showMouseScroll(event) {
	var curTimeStamp = new Date().getTime();
	lastScrollTimeStamp = curTimeStamp;
	setTimeout(detectUserScroll,SCROLL_TIMESPAN);
}

function showMouseMove(event) {
	console.log("mouse move  X:" + event.clientX + ",Y:"+event.clientY + ",Page X:" + event.pageX + " Y: " + event.pageY);
	//console.log("mouse X:" + event.clientX + ",Y:"+event.clientY);
	//processRawData('mouse',event.clientX,event.clientY,event.screenX,event.screenY,event.pageX,event.pageY);
	return false;
}

Date.prototype.yyyymmdd = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = this.getDate().toString();
   return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
};

/**
	This function handles all the raw data gotten from a user behavior. 
	It creates an object for each raw data item, put it into a collection(array).
	Send data to remote server if necessary.
***/
function processRawData(type,clientX,clientY,screenX,screenY,pageX,pageY) {
	var timestamp = new Date().getTime();
	var date = new Date(timestamp);
	//console.log("timestamp = " + timestamp + ", ");
	var dateString = date.getFullYear() + '/' + (date.getMonth()+1) + '/' +  date.getDate()  + ' '
					  + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    //console.log("timestamp = " + timestamp + ", dateString = " + dateString);
	var new_obj = {'Timestamp':timestamp+'s','Date':dateString,'Type':type, 'ClientX':clientX, 
				   'ClientY':clientY, 'ScreenX':screenX,'ScreenY':screenY,'PageX':pageX,'PageY':pageY};
	
	//we need to create two identical data item, one for send one for front-end analysis
	var new_obj1 = {'Timestamp':timestamp+'s','Date':dateString,'Type':type, 'ClientX':clientX, 
				   'ClientY':clientY, 'ScreenX':screenX,'ScreenY':screenY,'PageX':pageX,'PageY':pageY};

	totalDataLength++;
	
	//Put data into front-end storage Array
	userDataObjArr.dataList.push(new_obj1);
	userDataObjArr.dataLength++;


	//put data into cache array for ajax send
	var curItemIndex = jsonSendObjArr.curItem;
	jsonSendObjArr.objList[curItemIndex].dataList.push(new_obj);      //jsonSendObj.itemList.push( new_obj );
	
	//when necessary, send the data.
	if(jsonSendObjArr.objList[curItemIndex].dataList.length >= MAX_SENDOBJ_LENGTH) {
		console.log("send json data, totalDataLength = " + totalDataLength + ", curItemIndex = " 
					+ curItemIndex + ", len = " + jsonSendObjArr.objList[curItemIndex].dataList.length);
		console.log("Length of array is " + userDataObjArr.dataList.length);
		jsonSendObjArr.curItem = (jsonSendObjArr.curItem + 1) % OBJ_ARR_LENGTH;
		sendJSONData();
	}
}

	/**
		This function takes the mouse x,y and timestamp into consideration to 
		detect a mouse scroll action
	***/
	var lastX;//mouse x before scrolling
	var lastY;//moust y before scrolling
	var lastTimeStamp;//the last event
	function detectScroll(type,timeStamp,clientX,clientY,screenX,screenY,pageX,pageY) {
		
	
	
	
	
	
	}


	/**The following code illustrates how to submit json arrays to a google spread sheet 
	web apps, on the google side, the code can decode the json array**/

	/**
		Send JSON data to a remove server.(google web app)
	**/
	
	function sendJSONData() {
		//jsonSendObjArr.lastSendItm = jsonSendObjArr.curItem;
		var curObjIndex = jsonSendObjArr.lastSendItm;
		jsonSendObjArr.lastSendItm = (jsonSendObjArr.lastSendItm + 1) % OBJ_ARR_LENGTH;

		$.ajax({
			   type: "POST",
			   url: "https://script.google.com/macros/s/AKfycbyNQLA7ZiDQMnMorpW6kyqIcmA5CdDe4Ho_39rz4Whj1nB_hTQ/exec",
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
	//console.log("mouse X:" + event.clientX + ",Y:"+event.clientY);
	processRawData('click',event.clientX,event.clientY,event.screenX,event.screenY,event.pageX,event.pageY);
	return false;
}

function recordUnBlurEvent(event) {
	processRawData('unblur',event.clientX,event.clientY,event.screenX,event.screenY,event.pageX,event.pageY);
	return false;
}






/**
	This function correlate any mouse click with a 
	textal area, if no textual area can be identified,
	then an empty is returned. 
	TODO: avoid returning an empty element. 
**/

/*
function OnMouseMove (event) {
            var posX = event.clientX, posY = event.clientY;

                // displays the coordinates used for the elementFromPoint method
           // var info = document.getElementById ("info");
           // info.innerHTML = event.clientX + ", " + event.clientY;

                // get the element that is located under the mouse 
            var overElem = document.elementFromPoint (posX, posY);

            if (overElem && overElem.tagName === undefined) {   // in case of text nodes (Opera)
                overElem = overElem.parentNode; // the parent node will be selected
            }

            if (selElem) {  // if there was previously selected element
                if (selElem == overElem) {  // if mouse is over the previously selected element
                    return; // does not need to update the selection border
                }
                selElem.style.border = origBorder;  // set border to the stored value
                selElem = null;
            }
                // the body and the html tag won't be selected
            if (overElem && overElem.tagName.toLowerCase () != "body" && overElem.tagName.toLowerCase () != "html") {
                selElem = overElem; // stores the selected element
                origBorder = overElem.style.border; // stores the border settings of the selected element
                overElem.style.border = "3px solid red";    // draws selection border
            }
}*/




/** The following code illustrates how to use jQuery to submit an ajax get*/
/*
$.ajax({
  type: "GET",
  url: "https://script.google.com/macros/s/AKfycbyFQXA49rONAqprRWfb6Ro5xTKW8ECFXp448FmhSbCul_QG88lb/exec?F1=abc&F2=def",
  cache: false,
  success: function(data){
	 alert("success")
  }
});
*/



 
/*The following code send data to a google docs sheet */
function sendDataByGet() {
	var xhr = new XMLHttpRequest(); 
	xhr.open("GET", "https://script.google.com/macros/s/AKfycbyNQLA7ZiDQMnMorpW6kyqIcmA5CdDe4Ho_39rz4Whj1nB_hTQ/exec?F1=111&F2=222&F3=333", true);
	xhr.onreadystatechange = function() {
		 if (xhr.readyState == 4) {
			alert("Okay");
			// paste your code here 
		 }
	}
	xhr.send();
}


/**
	The following code get mouse trajectory and put (x,y,timestamp) 
	into a json array. 
**/

function getMouseTrajectory() {
	var jsonObj = {};
	jsonObj.itemlist=[];

	var d = new Date();
	var n = d.getTime();

	$("body").mousemove(function(event) {
		var d = new Date();
		var n = d.getTime();
		var new_obj = {'x':event.pageX, 'y':event.pageY, 'timestamp': n};
		jsonObj.itemlist.push( new_obj );
		var len = jsonObj.itemlist.length;
		//if(len % 100 == 0)
		//	alert('len is ' + len);
		//console.log('x:' + event.pageX + ", y " + event.pageY + ", timestampe" + new_obj['timestamp']);
		console.log('pageX:=' + event.pageX + ',pageY:=' + event.pageY + ", clientX = " + event.clientX + ", clientY = " + event.clientY + ", screenX = " + event.screenX + ", screenY = " + event.screenY);
	});

}



/**The following code shows how to get scroll event*/
/*
$(window).scroll(function(event) {
	console.log("new windows position : x " + window.pageXOffset + ", y " + window.pageYOffset);
});
*/





/**The following code shows how to log mouse click event*/
/*
$("body").click(function(event){
	console.log('click happened at pageX:=' + event.pageX + ',pageY:=' + event.pageY + ", clientX = " + event.clientX + ", clientY = " + event.clientY + ", screenX = " + event.screenX + ", screenY = " + event.screenY);
});
*/




	





    



	/***The following code shows how to capture a user selected text**/
	/*
	if(!window.Kolich){
		Kolich = {};
	}

	Kolich.Selector = {};
	Kolich.Selector.getSelected = function(){
		var t = '';
		if(window.getSelection){
			t = window.getSelection();
		}else if(document.getSelection){
			t = document.getSelection();
		}else if(document.selection){
			t = document.selection.createRange().text;
		}
		return t;
	}

	Kolich.Selector.mouseup = function(){
		var st = Kolich.Selector.getSelected();
		if(st!=''){
			alert("You selected:\n"+st);
		}
	}

	$(document).ready(function(){
		$(document).bind("mouseup", Kolich.Selector.mouseup);
	}); */


//console.log($('body').text())
/**
Given a paragrah html object,
return the position of its first html word.
notice that the position is the vertical offset of the document.
**/
function getParaPosition(para) {
	var html =$(para).html();
	var firstWord = getFirstWordFromHTML(html);
	var tmpSpanId = 'tmpSpanStartReadingHint';
	html = html.replace(firstWord, "<span id='" + tmpSpanId + "'>" + firstWord +  "</span>" );
	$(para).html(html);
	var firstSpan = document.getElementById(tmpSpanId);
	var offset = $(firstSpan).offset();
	return offset.top;
}

function startReadingHint()
{
	//Get the headline element
	var result = getHeadLine();
	
	//the vertical offset of the 1st paragraph
	var fistParaYOffset = undefined;
	//$("#vote")
	
	if( $(result).text())
	{ // if result exists
		//Add a div to display a msg over the headline element, telling the subject to start
		$("body").append("<div id='start_tag' style='position:absolute; top:100px;left:300px' > <font color='red' size='12px' face='serif'> <i> Please start from the headline </i></font> </div>");
		var destination = $(result).offset();
		//alert("destination: " + destination.top + "," + destination.left);
		$('#start_tag').css({top: destination.top, left: destination.left});
		var pObj = getParagraphs(result);
		fistParaYOffset = getParaPosition(pObj.paras[0]);
		
		for(var i=0;i<pObj.length;i++) {
			$(pObj.paras[i]).lettering('words');
		}
		
		for(var i=0;i<pObj.length;i++) {
			var spanArray = $(pObj.paras[i]).children('span')
			blurElement(spanArray[0]);
			//unBlurElement(spanArray[0]);
			//alert($(spanArray[0]).html());
		}

		//scrollTo the 1st paragraph.
		window.scrollTo(0,fistParaYOffset);

		//update pageHead object
		pageHeadObj.pageHeadY = $(window).scrollTop();
		pageHeadObj.timeStamp = new Date().getTime();

		//Start logging data and send it to background
		captureAndDislayUserData();
	}
}

function showHeadLineToolips(headLine) {
	var toolipDiv = document.createElement("div");
	$(toolipDiv).html("Are you reading this article?<BR>Click to continue reading111");
	$(toolipDiv).addClass("ui-tooltip");
	$("body").append(toolipDiv);
}