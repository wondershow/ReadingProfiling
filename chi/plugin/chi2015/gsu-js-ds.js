/**
	This file stores some basic data structre implemented in JS.
**/

function List() {
 List.makeNode = function() { 
  return {data: null, next: null}; 
 }; 
 
 this.start = null; 
 this.end = null; 
 
 this.add = function(data) { 
  if (this.start === null) { 
   this.start = List.makeNode(); 
   this.end = this.start; 
  } else { 
   this.end.next = List.makeNode(); 
   this.end = this.end.next; 
  } ; 
  this.end.data = data; 
 }; 
 
 this.delete = function(data) { 
  var current = this.start; 
  var previous = this.start; 
  while (current !== null) { 
   if (data === current.data) { 
    if (current === this.start) { 
     this.start = current.next; 
     return; 
    } 
    if (current === this.end) 
         this.end = previous;
    previous.next = current.next; return; 
    }
    previous = current; 
    current = current.next; 
   }
 }; 

 this.insertAsFirst = function(d) { 
  var temp = List.makeNode(); 
  temp.next = this.start; 
  this.start = temp; 
  temp.data = d; 
 }; 

 this.insertAfter = function(t, d) { 
  var current = this.start; 
  while (current !== null) { 
   if (current.data === t) {
    var temp = List.makeNode();
    temp.data = d; 
    temp.next = current.next; 
    if (current === this.end) this.end = temp;
    current.next = temp; 
    return; 
   } 
   current = current.next; 
   }
  };

  this.item = function(i) { 
   var current = this.start; 
   while (current !== null) { 
    i--; 
    if (i === 0) return current; 
    current = current.next; 
   } 
   return null; 
  }; 

 this.each = function(f) {
  var current = this.start;
  while (current !== null) { 
   f(current); 
   current = current.next; 
  } 
 };
} 