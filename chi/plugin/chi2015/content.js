var selElem = null; // store the currently selected element
var origBorder = ""; 

chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
	switch(message.type) {
		case "colors-div":
			/*
			var divs = document.querySelectorAll("div");
			if(divs.length === 0) {
				alert("There are no any divs in the page.");
			} else {
				for(var i=0; i<divs.length; i++) {
					divs[i].style.backgroundColor = message.color;
				}
			}*/
			var body = document.querySelectorAll("body");
			if(body.length === 0) {
				alert("There are no any divs in the page.");
			} else {
				alert("msg3");
				body[0].addEventListener("click",getAndDisplayXandY, false);
			}
			//document.addEventListener();
		break;
	}
});



/***
	This function get and display coordinate of a mouse click event.
***/
function getAndDisplayXandY(e){
 var evt = e ? e:window.event;
 var clickX=0, clickY=0;

 if ((evt.clientX || evt.clientY) &&
     document.body &&
     document.body.scrollLeft!=null) {
	clickX = evt.clientX + document.body.scrollLeft;
	 clickY = evt.clientY + document.body.scrollTop;
 }
 if ((evt.clientX || evt.clientY) &&
     document.compatMode=='CSS1Compat' && 
     document.documentElement && 
     document.documentElement.scrollLeft!=null) {
	clickX = evt.clientX + document.documentElement.scrollLeft;
	clickY = evt.clientY + document.documentElement.scrollTop;
 }
 if (evt.pageX || evt.pageY) {
	clickX = evt.pageX;
	clickY = evt.pageY;
 }

 alert (evt.type.toUpperCase() + ' mouse event3333:'
		+'\n pageX = ' + clickX
		+'\n pageY = ' + clickY 
		+'\n clientX = ' + evt.clientX
		+'\n clientY = '  + evt.clientY 
		+'\n screenX = ' + evt.screenX 
		+'\n screenY = ' + evt.screenY)

 alert("here you are");
 var element = document.elementFromPoint(evt.clientX, evt.clientY);
 alert(element.type);


  $(document).ready(function(){
            $('html').mousemove(function(event){
                console.log("mouse move X:"+event.pageX+" Y:"+event.pageY);
            });
            $('html').click(function(event){
                console.log("mouse click X:"+event.pageX+" Y:"+event.pageY);
            });
            $('html').keyup(function(event){
                console.log("keyboard event: key pressed "+event.keyCode);
            });
  });

 return false;
}


function getAndDisplayElementName(e) {
	



}


/**
	This function correlate any mouse click with a 
	textal area, if no textual area can be identified,
	then an empty is returned. 
	TODO: avoid returning an empty element. 
**/
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
}


$("body").append('<p>Test6666</p>');

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
/*var xhr = new XMLHttpRequest(); 
xhr.open("GET", "https://script.google.com/macros/s/AKfycbyFQXA49rONAqprRWfb6Ro5xTKW8ECFXp448FmhSbCul_QG88lb/exec?F1=whc3333&F2=zcd4444", true);
xhr.onreadystatechange = function() {
	 if (xhr.readyState == 4) {
		alert("Okay");
		// paste your code here 
     }
}
xhr.send();
*/



/*
alert('4444');
 var sendInfo = {
           F1: 'ajaxFFFF1',
           F2: 'ajaxFFFF2',
       };

$.ajax({
           type: "POST",
           url: "https://script.google.com/macros/s/AKfycbyNQLA7ZiDQMnMorpW6kyqIcmA5CdDe4Ho_39rz4Whj1nB_hTQ/exec",
           dataType: "json",
           success: function (msg) {
               alert('success')
           },
		   error: function(XMLHttpRequest, textStatus, errorThrown) { 
			alert("Status: " + textStatus); alert("Error: " + errorThrown); 
		   },
           data: sendInfo
 });*/





/**
	The following code get mouse trajectory and put (x,y,timestamp) 
	into a json array. 
**/
/*
alert('lcy')
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
	console.log('x:' + event.pageX + ", y " + event.pageY + ", timestampe" + new_obj['timestamp']);
})
*/