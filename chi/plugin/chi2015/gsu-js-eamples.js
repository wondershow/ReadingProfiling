/**
This file is used to save some JS examples 
that can finish some functions

**/


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


function Confirm(question,ele,firstparagrah, callback) {
        // Content will consist of the question and ok/cancel buttons
        var message = $('<p />', {
            text: question
        }),
            ok = $('<button />', {
                text: 'Ok',
                click: function() {
                    callback(true);
                }
				
            }),
            cancel = $('<button />', {
                text: 'Cancel',
                click: function() {
                    callback(false);
                }
            });

        dialogue(message.add(ok),ele, '');
    }

	    function dialogue(content,ele, title) {
	/* 
   * Since the dialogue isn't really a tooltip as such, we'll use a dummy
   * out-of-DOM element as our target instead of an actual element like document.body
   */
        $('<div />').qtip({
			id: 'myTooltip',
            content: {
                text: content,
                title: title
            },
            position: {
                my: 'top center',
                at: 'bottom center',
                // Center it...
                target: $(ele), // ... in the window
				corner: {
					target: 'topRight',
					tooltip: 'bottomLeft'
				}
            },
            show: {
                    ready: true, // Show it straight away
                    modal: {
                        on: true, // Make it modal (darken the rest of the page)...
                        blur: false, // ... but don't close the tooltip when clicked
                        escape: false //dont hide on escape button 
                    }
                },
            hide: false,
            // We'll hide it maunally so disable hide events
            style: 'ui-tooltip-light ui-tooltip-rounded ui-tooltip-dialogue',
            // Add a few styles
            events: {
                // Hide the tooltip when any buttons in the dialogue are clicked
                render: function(event, api) {
					//$(this).remove();
					//alert("api.elements.content"+api.elements.content);
					//alert("api.hide" + api.hide)
					//var test = $('button', api.elements.content);
					//alert("test = " + test);
                    $('button', api.elements.content).click(api.hide);
                },
                // Destroy the tooltip once it's hidden as we no longer need it!
                hide: function(event, api) {
					//alert("I am here");
                    api.destroy();
                }
            }
        });
		var body = document.querySelectorAll("body");
		if(body.length === 0) {
		alert("There are no any divs in the page.");
		} else {
			$(body[0]).qtip('distroy');
		}
    }