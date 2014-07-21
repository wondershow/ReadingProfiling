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
				body[0].addEventListener("click",OnMouseMove, false);
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

 alert (evt.type.toUpperCase() + ' mouse event2222:'
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