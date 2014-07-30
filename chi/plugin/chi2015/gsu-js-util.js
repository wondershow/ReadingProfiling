/***
This function takes one html string 
as input, return the 1st word in the html 
text(those displayed on the screen.)
**/
function getFirstWordFromHTML(html) {
	var words = html.split(/\s+/);
	var firstWord = '';
	var i = 0;
	
	while(words.length>0 && i< words.length) {
		if( words[i].length > 0 ) {
			firstWord = words[i];
			break;
		}
		i++;
	}

	firstWord = strip(firstWord);
	firstWord = firstWord.replace(/[^a-zA-Z-]/g, '');
	return firstWord;
}

/***
	This function get the headline of a webpage.
	basically this function returns the <h> 
	tag with largest font size
*/
function getHeadLine() 
{
	var text = '';
	var max_font_size = 0;
	var result = null;

	$("h1, h2, h3, h4, h5, h6").filter(
									function()
									{
										if(($(this).text().length>5)&&($(this).text().length<100))
										{
											//alert($(this).text());
											return true;
										}

									}
		).each( 
			function()
			{
				//alert($(this).css('font-size')+", text = " + $(this).text());

				//alert("$(this).text() = " + $(this).text() + ", font-size="+$(this).css('font-size'));
				//alert("max_font_size = " + max_font_size);
				var font_size = $(this).css('font-size').replace('px', '');
				//alert("font_size = '" + font_size + "'");
				if( $.isNumeric(font_size) &&   parseInt(font_size) > parseInt(max_font_size)  ) 
				{
					//alert( (font_size > max_font_size) + ",font_size = " + font_size + ", max_font_size = " + max_font_size );
					//alert("font_size1111 = '" + font_size + "'");
					result = $(this);
					max_font_size = font_size
				}
			}
	);
	return result;
}


/**
	This function helps to remove 
	all HTML tags from a given string
**/
function strip(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

/**
	This function calculates the frequency of a set of strings.
	@resArr similar as a dic, "string" => frequency
	@string the string to be counted
**/
function getHitRate (resArr, string) {
	if(!(string in resArr))
		resArr[string] = 1;
	else
		resArr[string] = resArr[string] + 1;
}


/**
	Given a HTML element, return its
	font size, here we 
	return a numeric value
*/
function getFontSize(el) {
	var sizeText = $(el).css('font-size');
	return sizeText.replace(/[a-zA-Z]/g,'').replace(/\s/g,'');
}

/**
	Given a HTML element, return its 
	font
**/
function getFontStyle(el) {
	return $(el).css('font-family');
}

/**
Given an array of paragraph HTML elements(<p>),
do a poll for the css font styles(font and fontsize), 
return the most popular font style.
*/
function getMainFontClass(paraArr) {
    var	hash = new Object();

	for(i=0;i<paraArr.length;i++) {
		var pBody = paraArr[i];
		var key = getFontStyle(pBody) + "," + getFontSize(pBody);
		
		//update poll
		if(!(key in hash))
			hash[key] = 1;
		else
			hash[key] = hash[key] + 1;
	}
	
	var highFreq = 0;
	var res = '';
	for(key in hash) {
		if (hash.hasOwnProperty(key) && hash[key]> highFreq) {
			highFreq = hash[key];
			res = key;
		}
	}
	return res;
}




/*
 * defines a paragrahs object
 * will be used in function @getParagraphs
 */
function paragrahsObj() {
	this.paras = new Object();
	this.paraCssClass = '';
}



/**
	Given a html element(<h>), get all its paragraphs(belong to that title)
**/
function getParagraphs(titleEl) {

	var stop = false;
	var ele = titleEl;

	//We suppose that the paragraph and title are under same ancestor
	//So we search upwards until find first ancestor that has an <p> 
	//tag as its offspring
	while($(ele).find( "p" ).length == 0) {
		ele = $(ele).parent();
	}
	
	var pArr = $.makeArray( $(ele).find( "p" ) );


	var fontStyle = getMainFontClass(pArr);

	var fontStlArr = fontStyle.split(',');
	var fontStr = fontStlArr[0];
	var fontSizeStr = fontStlArr[1];

	var res = new paragrahsObj();
	
	
	var count = 0;
	$(ele).find( "p" ).filter(function () {
		if($(this).css('font-family') === fontStr && ($(this).css('font-size')).indexOf(fontSizeStr) >= 0) {
			//alert( $(this).css('font-family') + "," + $(this).css('font-size') + "," + $(this).html());
			//$(this).html(  count + ":" + $(this).html());
			//count = count + 1;
			res.paras[count++] = $(this);
			//return true;
		}
	});
	return res;
}

/**
	To get leftmost X of current window(NOT screen!).
	since if you have a scroll bar, window might have offset 
	from the documents(0,0) position
**/
function getWindowX() {
	var doc = document.documentElement, body = document.body;
	var left = (doc && doc.scrollLeft || body && body.scrollLeft || 0);
	var top = (doc && doc.scrollTop  || body && body.scrollTop  || 0);
	return left;
}

/**
	To get leftmost Y of current window(NOT screen!).
	since if you have a scroll bar, window might have offset 
	from the documents(0,0) position
**/
function getWindowY() {
	var doc = document.documentElement, body = document.body;
	var left = (doc && doc.scrollLeft || body && body.scrollLeft || 0);
	var top = (doc && doc.scrollTop  || body && body.scrollTop  || 0);
	return top;
}

/**
	To get the current range of window(NOT screen!).
	Since the document width and height might exceed the 
	screen limit.
**/
function getWindowRange() {
	res = new Object();
	res['xFrom'] = getWindowX();
	res['xTo'] = getWindowX() + $(window).width();
	res['yFrom'] = getWindowY();
	res['yTo'] = getWindowY() + $(window).height();
	return res; 
}

/**
	To make an HTML blurred in 
	its text.
**/
function blurElement(ele) {
	$(ele).css({'color': 'transparent','text-shadow' : '0 0 5px rgba(0,0,0,0.5)'});
}

/**
	To remove the blur effect of an element.
**/
function unBlurElement(ele) {
	$(ele).css('color', 'auto').css('text-shadow', 'auto');
}

