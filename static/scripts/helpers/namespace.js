//-------------------------------------------------------
//------------- prototype enhancements ------------------
//-------------------------------------------------------
//define bind:
Function.prototype.bind = function(scope) {
    var _function = this;
    return function() {
        return _function.apply(scope, arguments);
    }
};

//define namespace:
String.prototype.namespace = function(separator) {
    var ns = this.split(separator || '.'), p = window, i;
    for (i = 0; i < ns.length; i++) {
        p = p[ns[i]] = p[ns[i]] || {};
    }
};

String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

//define truncate:
String.prototype.truncate = function(nwords) {
    var words = this.split(' '), suffix = '';
    while(words.length > nwords) {
        words.pop();
        suffix = '...';
    }
    return words.join(' ') + suffix;
};


//extending the Array object:
Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j, 1);
        }
    }
    return a;
};

//Function so IE will support the "trim" function (used in sealevel.js)
if(typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    }
} 
'localground'.namespace();
'ui'.namespace();


//extending jquery to support !important:
// For those who need them (< IE 9), add support for CSS functions
var isStyleFuncSupported = CSSStyleDeclaration.prototype.getPropertyValue != null;
if (!isStyleFuncSupported) {
    CSSStyleDeclaration.prototype.getPropertyValue = function(a) {
        return this.getAttribute(a);
    };
    CSSStyleDeclaration.prototype.setProperty = function(styleName, value, priority) {
        this.setAttribute(styleName,value);
        var priority = typeof priority != 'undefined' ? priority : '';
        if (priority != '') {
            // Add priority manually
            var rule = new RegExp(RegExp.escape(styleName) + '\\s*:\\s*' + RegExp.escape(value) + '(\\s*;)?', 'gmi');
            this.cssText = this.cssText.replace(rule, styleName + ': ' + value + ' !' + priority + ';');
        } 
    }
    CSSStyleDeclaration.prototype.removeProperty = function(a) {
        return this.removeAttribute(a);
    }
    CSSStyleDeclaration.prototype.getPropertyPriority = function(styleName) {
        var rule = new RegExp(RegExp.escape(styleName) + '\\s*:\\s*[^\\s]*\\s*!important(\\s*;)?', 'gmi');
        return rule.test(this.cssText) ? 'important' : '';
    }
}

// Escape regex chars with \
RegExp.escape = function(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// The style function
jQuery.fn.style = function(styleName, value, priority) {
    // DOM node
    var node = this.get(0);
    // Ensure we have a DOM node 
    if (typeof node == 'undefined') {
        return;
    }
    // CSSStyleDeclaration
    var style = this.get(0).style;
    // Getter/Setter
    if (typeof styleName != 'undefined') {
        if (typeof value != 'undefined') {
            // Set style property
            var priority = typeof priority != 'undefined' ? priority : '';
            style.setProperty(styleName, value, priority);
        } else {
            // Get style property
            return style.getPropertyValue(styleName);
        }
    } else {
        // Get CSSStyleDeclaration
        return style;
    }
}

/*
if  (document.getElementById){

	(function(){
	
		//Stop Opera selecting anything whilst dragging.
		if (window.opera){
			document.write("<input type='hidden' id='Q' value=' '>");
		}
	
		var n = 500;
		var dragok = false;
		var y,x,d,dy,dx;
	
		function move(e){
			if (!e) e = window.event;
			if (dragok){
				var lft=dx + e.clientX - x,top=dy + e.clientY - y;
				d.style.marginLeft = lft + "px";
				d.style.marginTop  = top + "px";
				return false;
			}
		}
	
		function down(e){
			if (!e) e = window.event;
			var temp = (typeof e.target != "undefined")?e.target:e.srcElement;
			if (temp.tagName != "HTML"|"BODY" && temp.className != "dragclass"){
				temp = (typeof temp.parentNode != "undefined")?temp.parentNode:temp.parentElement;
			}
			if (temp.className == "dragclass"){
				if (window.opera){
					document.getElementById("Q").focus();
				}
				dragok = true;
				temp.style.zIndex = n++;
				d = temp;
				dx = parseInt(temp.style.marginLeft+0);
				dy = parseInt(temp.style.marginTop+0);
				x = e.clientX;
				y = e.clientY;
				document.onmousemove = move;
				return false;
			 }
		}
	
		function up(){
			dragok = false;
			document.onmousemove = null;
		}
	
		document.onmousedown = down;
		document.onmouseup = up;
	
	})();
}//End.
*/



