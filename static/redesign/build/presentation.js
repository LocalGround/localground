//     Underscore.js 1.6.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
(function(){var n=this,t=n._,r={},e=Array.prototype,u=Object.prototype,i=Function.prototype,a=e.push,o=e.slice,c=e.concat,l=u.toString,f=u.hasOwnProperty,s=e.forEach,p=e.map,h=e.reduce,v=e.reduceRight,g=e.filter,d=e.every,m=e.some,y=e.indexOf,b=e.lastIndexOf,x=Array.isArray,w=Object.keys,_=i.bind,j=function(n){return n instanceof j?n:this instanceof j?void(this._wrapped=n):new j(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=j),exports._=j):n._=j,j.VERSION="1.6.0";var A=j.each=j.forEach=function(n,t,e){if(null==n)return n;if(s&&n.forEach===s)n.forEach(t,e);else if(n.length===+n.length){for(var u=0,i=n.length;i>u;u++)if(t.call(e,n[u],u,n)===r)return}else for(var a=j.keys(n),u=0,i=a.length;i>u;u++)if(t.call(e,n[a[u]],a[u],n)===r)return;return n};j.map=j.collect=function(n,t,r){var e=[];return null==n?e:p&&n.map===p?n.map(t,r):(A(n,function(n,u,i){e.push(t.call(r,n,u,i))}),e)};var O="Reduce of empty array with no initial value";j.reduce=j.foldl=j.inject=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),h&&n.reduce===h)return e&&(t=j.bind(t,e)),u?n.reduce(t,r):n.reduce(t);if(A(n,function(n,i,a){u?r=t.call(e,r,n,i,a):(r=n,u=!0)}),!u)throw new TypeError(O);return r},j.reduceRight=j.foldr=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),v&&n.reduceRight===v)return e&&(t=j.bind(t,e)),u?n.reduceRight(t,r):n.reduceRight(t);var i=n.length;if(i!==+i){var a=j.keys(n);i=a.length}if(A(n,function(o,c,l){c=a?a[--i]:--i,u?r=t.call(e,r,n[c],c,l):(r=n[c],u=!0)}),!u)throw new TypeError(O);return r},j.find=j.detect=function(n,t,r){var e;return k(n,function(n,u,i){return t.call(r,n,u,i)?(e=n,!0):void 0}),e},j.filter=j.select=function(n,t,r){var e=[];return null==n?e:g&&n.filter===g?n.filter(t,r):(A(n,function(n,u,i){t.call(r,n,u,i)&&e.push(n)}),e)},j.reject=function(n,t,r){return j.filter(n,function(n,e,u){return!t.call(r,n,e,u)},r)},j.every=j.all=function(n,t,e){t||(t=j.identity);var u=!0;return null==n?u:d&&n.every===d?n.every(t,e):(A(n,function(n,i,a){return(u=u&&t.call(e,n,i,a))?void 0:r}),!!u)};var k=j.some=j.any=function(n,t,e){t||(t=j.identity);var u=!1;return null==n?u:m&&n.some===m?n.some(t,e):(A(n,function(n,i,a){return u||(u=t.call(e,n,i,a))?r:void 0}),!!u)};j.contains=j.include=function(n,t){return null==n?!1:y&&n.indexOf===y?n.indexOf(t)!=-1:k(n,function(n){return n===t})},j.invoke=function(n,t){var r=o.call(arguments,2),e=j.isFunction(t);return j.map(n,function(n){return(e?t:n[t]).apply(n,r)})},j.pluck=function(n,t){return j.map(n,j.property(t))},j.where=function(n,t){return j.filter(n,j.matches(t))},j.findWhere=function(n,t){return j.find(n,j.matches(t))},j.max=function(n,t,r){if(!t&&j.isArray(n)&&n[0]===+n[0]&&n.length<65535)return Math.max.apply(Math,n);var e=-1/0,u=-1/0;return A(n,function(n,i,a){var o=t?t.call(r,n,i,a):n;o>u&&(e=n,u=o)}),e},j.min=function(n,t,r){if(!t&&j.isArray(n)&&n[0]===+n[0]&&n.length<65535)return Math.min.apply(Math,n);var e=1/0,u=1/0;return A(n,function(n,i,a){var o=t?t.call(r,n,i,a):n;u>o&&(e=n,u=o)}),e},j.shuffle=function(n){var t,r=0,e=[];return A(n,function(n){t=j.random(r++),e[r-1]=e[t],e[t]=n}),e},j.sample=function(n,t,r){return null==t||r?(n.length!==+n.length&&(n=j.values(n)),n[j.random(n.length-1)]):j.shuffle(n).slice(0,Math.max(0,t))};var E=function(n){return null==n?j.identity:j.isFunction(n)?n:j.property(n)};j.sortBy=function(n,t,r){return t=E(t),j.pluck(j.map(n,function(n,e,u){return{value:n,index:e,criteria:t.call(r,n,e,u)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index-t.index}),"value")};var F=function(n){return function(t,r,e){var u={};return r=E(r),A(t,function(i,a){var o=r.call(e,i,a,t);n(u,o,i)}),u}};j.groupBy=F(function(n,t,r){j.has(n,t)?n[t].push(r):n[t]=[r]}),j.indexBy=F(function(n,t,r){n[t]=r}),j.countBy=F(function(n,t){j.has(n,t)?n[t]++:n[t]=1}),j.sortedIndex=function(n,t,r,e){r=E(r);for(var u=r.call(e,t),i=0,a=n.length;a>i;){var o=i+a>>>1;r.call(e,n[o])<u?i=o+1:a=o}return i},j.toArray=function(n){return n?j.isArray(n)?o.call(n):n.length===+n.length?j.map(n,j.identity):j.values(n):[]},j.size=function(n){return null==n?0:n.length===+n.length?n.length:j.keys(n).length},j.first=j.head=j.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:0>t?[]:o.call(n,0,t)},j.initial=function(n,t,r){return o.call(n,0,n.length-(null==t||r?1:t))},j.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:o.call(n,Math.max(n.length-t,0))},j.rest=j.tail=j.drop=function(n,t,r){return o.call(n,null==t||r?1:t)},j.compact=function(n){return j.filter(n,j.identity)};var M=function(n,t,r){return t&&j.every(n,j.isArray)?c.apply(r,n):(A(n,function(n){j.isArray(n)||j.isArguments(n)?t?a.apply(r,n):M(n,t,r):r.push(n)}),r)};j.flatten=function(n,t){return M(n,t,[])},j.without=function(n){return j.difference(n,o.call(arguments,1))},j.partition=function(n,t){var r=[],e=[];return A(n,function(n){(t(n)?r:e).push(n)}),[r,e]},j.uniq=j.unique=function(n,t,r,e){j.isFunction(t)&&(e=r,r=t,t=!1);var u=r?j.map(n,r,e):n,i=[],a=[];return A(u,function(r,e){(t?e&&a[a.length-1]===r:j.contains(a,r))||(a.push(r),i.push(n[e]))}),i},j.union=function(){return j.uniq(j.flatten(arguments,!0))},j.intersection=function(n){var t=o.call(arguments,1);return j.filter(j.uniq(n),function(n){return j.every(t,function(t){return j.contains(t,n)})})},j.difference=function(n){var t=c.apply(e,o.call(arguments,1));return j.filter(n,function(n){return!j.contains(t,n)})},j.zip=function(){for(var n=j.max(j.pluck(arguments,"length").concat(0)),t=new Array(n),r=0;n>r;r++)t[r]=j.pluck(arguments,""+r);return t},j.object=function(n,t){if(null==n)return{};for(var r={},e=0,u=n.length;u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},j.indexOf=function(n,t,r){if(null==n)return-1;var e=0,u=n.length;if(r){if("number"!=typeof r)return e=j.sortedIndex(n,t),n[e]===t?e:-1;e=0>r?Math.max(0,u+r):r}if(y&&n.indexOf===y)return n.indexOf(t,r);for(;u>e;e++)if(n[e]===t)return e;return-1},j.lastIndexOf=function(n,t,r){if(null==n)return-1;var e=null!=r;if(b&&n.lastIndexOf===b)return e?n.lastIndexOf(t,r):n.lastIndexOf(t);for(var u=e?r:n.length;u--;)if(n[u]===t)return u;return-1},j.range=function(n,t,r){arguments.length<=1&&(t=n||0,n=0),r=arguments[2]||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=0,i=new Array(e);e>u;)i[u++]=n,n+=r;return i};var R=function(){};j.bind=function(n,t){var r,e;if(_&&n.bind===_)return _.apply(n,o.call(arguments,1));if(!j.isFunction(n))throw new TypeError;return r=o.call(arguments,2),e=function(){if(!(this instanceof e))return n.apply(t,r.concat(o.call(arguments)));R.prototype=n.prototype;var u=new R;R.prototype=null;var i=n.apply(u,r.concat(o.call(arguments)));return Object(i)===i?i:u}},j.partial=function(n){var t=o.call(arguments,1);return function(){for(var r=0,e=t.slice(),u=0,i=e.length;i>u;u++)e[u]===j&&(e[u]=arguments[r++]);for(;r<arguments.length;)e.push(arguments[r++]);return n.apply(this,e)}},j.bindAll=function(n){var t=o.call(arguments,1);if(0===t.length)throw new Error("bindAll must be passed function names");return A(t,function(t){n[t]=j.bind(n[t],n)}),n},j.memoize=function(n,t){var r={};return t||(t=j.identity),function(){var e=t.apply(this,arguments);return j.has(r,e)?r[e]:r[e]=n.apply(this,arguments)}},j.delay=function(n,t){var r=o.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},j.defer=function(n){return j.delay.apply(j,[n,1].concat(o.call(arguments,1)))},j.throttle=function(n,t,r){var e,u,i,a=null,o=0;r||(r={});var c=function(){o=r.leading===!1?0:j.now(),a=null,i=n.apply(e,u),e=u=null};return function(){var l=j.now();o||r.leading!==!1||(o=l);var f=t-(l-o);return e=this,u=arguments,0>=f?(clearTimeout(a),a=null,o=l,i=n.apply(e,u),e=u=null):a||r.trailing===!1||(a=setTimeout(c,f)),i}},j.debounce=function(n,t,r){var e,u,i,a,o,c=function(){var l=j.now()-a;t>l?e=setTimeout(c,t-l):(e=null,r||(o=n.apply(i,u),i=u=null))};return function(){i=this,u=arguments,a=j.now();var l=r&&!e;return e||(e=setTimeout(c,t)),l&&(o=n.apply(i,u),i=u=null),o}},j.once=function(n){var t,r=!1;return function(){return r?t:(r=!0,t=n.apply(this,arguments),n=null,t)}},j.wrap=function(n,t){return j.partial(t,n)},j.compose=function(){var n=arguments;return function(){for(var t=arguments,r=n.length-1;r>=0;r--)t=[n[r].apply(this,t)];return t[0]}},j.after=function(n,t){return function(){return--n<1?t.apply(this,arguments):void 0}},j.keys=function(n){if(!j.isObject(n))return[];if(w)return w(n);var t=[];for(var r in n)j.has(n,r)&&t.push(r);return t},j.values=function(n){for(var t=j.keys(n),r=t.length,e=new Array(r),u=0;r>u;u++)e[u]=n[t[u]];return e},j.pairs=function(n){for(var t=j.keys(n),r=t.length,e=new Array(r),u=0;r>u;u++)e[u]=[t[u],n[t[u]]];return e},j.invert=function(n){for(var t={},r=j.keys(n),e=0,u=r.length;u>e;e++)t[n[r[e]]]=r[e];return t},j.functions=j.methods=function(n){var t=[];for(var r in n)j.isFunction(n[r])&&t.push(r);return t.sort()},j.extend=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]=t[r]}),n},j.pick=function(n){var t={},r=c.apply(e,o.call(arguments,1));return A(r,function(r){r in n&&(t[r]=n[r])}),t},j.omit=function(n){var t={},r=c.apply(e,o.call(arguments,1));for(var u in n)j.contains(r,u)||(t[u]=n[u]);return t},j.defaults=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]===void 0&&(n[r]=t[r])}),n},j.clone=function(n){return j.isObject(n)?j.isArray(n)?n.slice():j.extend({},n):n},j.tap=function(n,t){return t(n),n};var S=function(n,t,r,e){if(n===t)return 0!==n||1/n==1/t;if(null==n||null==t)return n===t;n instanceof j&&(n=n._wrapped),t instanceof j&&(t=t._wrapped);var u=l.call(n);if(u!=l.call(t))return!1;switch(u){case"[object String]":return n==String(t);case"[object Number]":return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;case"[object Date]":case"[object Boolean]":return+n==+t;case"[object RegExp]":return n.source==t.source&&n.global==t.global&&n.multiline==t.multiline&&n.ignoreCase==t.ignoreCase}if("object"!=typeof n||"object"!=typeof t)return!1;for(var i=r.length;i--;)if(r[i]==n)return e[i]==t;var a=n.constructor,o=t.constructor;if(a!==o&&!(j.isFunction(a)&&a instanceof a&&j.isFunction(o)&&o instanceof o)&&"constructor"in n&&"constructor"in t)return!1;r.push(n),e.push(t);var c=0,f=!0;if("[object Array]"==u){if(c=n.length,f=c==t.length)for(;c--&&(f=S(n[c],t[c],r,e)););}else{for(var s in n)if(j.has(n,s)&&(c++,!(f=j.has(t,s)&&S(n[s],t[s],r,e))))break;if(f){for(s in t)if(j.has(t,s)&&!c--)break;f=!c}}return r.pop(),e.pop(),f};j.isEqual=function(n,t){return S(n,t,[],[])},j.isEmpty=function(n){if(null==n)return!0;if(j.isArray(n)||j.isString(n))return 0===n.length;for(var t in n)if(j.has(n,t))return!1;return!0},j.isElement=function(n){return!(!n||1!==n.nodeType)},j.isArray=x||function(n){return"[object Array]"==l.call(n)},j.isObject=function(n){return n===Object(n)},A(["Arguments","Function","String","Number","Date","RegExp"],function(n){j["is"+n]=function(t){return l.call(t)=="[object "+n+"]"}}),j.isArguments(arguments)||(j.isArguments=function(n){return!(!n||!j.has(n,"callee"))}),"function"!=typeof/./&&(j.isFunction=function(n){return"function"==typeof n}),j.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},j.isNaN=function(n){return j.isNumber(n)&&n!=+n},j.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"==l.call(n)},j.isNull=function(n){return null===n},j.isUndefined=function(n){return n===void 0},j.has=function(n,t){return f.call(n,t)},j.noConflict=function(){return n._=t,this},j.identity=function(n){return n},j.constant=function(n){return function(){return n}},j.property=function(n){return function(t){return t[n]}},j.matches=function(n){return function(t){if(t===n)return!0;for(var r in n)if(n[r]!==t[r])return!1;return!0}},j.times=function(n,t,r){for(var e=Array(Math.max(0,n)),u=0;n>u;u++)e[u]=t.call(r,u);return e},j.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))},j.now=Date.now||function(){return(new Date).getTime()};var T={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;"}};T.unescape=j.invert(T.escape);var I={escape:new RegExp("["+j.keys(T.escape).join("")+"]","g"),unescape:new RegExp("("+j.keys(T.unescape).join("|")+")","g")};j.each(["escape","unescape"],function(n){j[n]=function(t){return null==t?"":(""+t).replace(I[n],function(t){return T[n][t]})}}),j.result=function(n,t){if(null==n)return void 0;var r=n[t];return j.isFunction(r)?r.call(n):r},j.mixin=function(n){A(j.functions(n),function(t){var r=j[t]=n[t];j.prototype[t]=function(){var n=[this._wrapped];return a.apply(n,arguments),z.call(this,r.apply(j,n))}})};var N=0;j.uniqueId=function(n){var t=++N+"";return n?n+t:t},j.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var q=/(.)^/,B={"'":"'","\\":"\\","\r":"r","\n":"n","	":"t","\u2028":"u2028","\u2029":"u2029"},D=/\\|'|\r|\n|\t|\u2028|\u2029/g;j.template=function(n,t,r){var e;r=j.defaults({},r,j.templateSettings);var u=new RegExp([(r.escape||q).source,(r.interpolate||q).source,(r.evaluate||q).source].join("|")+"|$","g"),i=0,a="__p+='";n.replace(u,function(t,r,e,u,o){return a+=n.slice(i,o).replace(D,function(n){return"\\"+B[n]}),r&&(a+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'"),e&&(a+="'+\n((__t=("+e+"))==null?'':__t)+\n'"),u&&(a+="';\n"+u+"\n__p+='"),i=o+t.length,t}),a+="';\n",r.variable||(a="with(obj||{}){\n"+a+"}\n"),a="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+a+"return __p;\n";try{e=new Function(r.variable||"obj","_",a)}catch(o){throw o.source=a,o}if(t)return e(t,j);var c=function(n){return e.call(this,n,j)};return c.source="function("+(r.variable||"obj")+"){\n"+a+"}",c},j.chain=function(n){return j(n).chain()};var z=function(n){return this._chain?j(n).chain():n};j.mixin(j),A(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=e[n];j.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!=n&&"splice"!=n||0!==r.length||delete r[0],z.call(this,r)}}),A(["concat","join","slice"],function(n){var t=e[n];j.prototype[n]=function(){return z.call(this,t.apply(this._wrapped,arguments))}}),j.extend(j.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}}),"function"==typeof define&&define.amd&&define("underscore",[],function(){return j})}).call(this);
//# sourceMappingURL=underscore-min.map;
(function(t,e){if(typeof define==="function"&&define.amd){define('backbone',["underscore","jquery","exports"],function(i,r,s){t.Backbone=e(t,s,i,r)})}else if(typeof exports!=="undefined"){var i=require("underscore");e(t,exports,i)}else{t.Backbone=e(t,{},t._,t.jQuery||t.Zepto||t.ender||t.$)}})(this,function(t,e,i,r){var s=t.Backbone;var n=[];var a=n.push;var o=n.slice;var h=n.splice;e.VERSION="1.1.2";e.$=r;e.noConflict=function(){t.Backbone=s;return this};e.emulateHTTP=false;e.emulateJSON=false;var u=e.Events={on:function(t,e,i){if(!c(this,"on",t,[e,i])||!e)return this;this._events||(this._events={});var r=this._events[t]||(this._events[t]=[]);r.push({callback:e,context:i,ctx:i||this});return this},once:function(t,e,r){if(!c(this,"once",t,[e,r])||!e)return this;var s=this;var n=i.once(function(){s.off(t,n);e.apply(this,arguments)});n._callback=e;return this.on(t,n,r)},off:function(t,e,r){var s,n,a,o,h,u,l,f;if(!this._events||!c(this,"off",t,[e,r]))return this;if(!t&&!e&&!r){this._events=void 0;return this}o=t?[t]:i.keys(this._events);for(h=0,u=o.length;h<u;h++){t=o[h];if(a=this._events[t]){this._events[t]=s=[];if(e||r){for(l=0,f=a.length;l<f;l++){n=a[l];if(e&&e!==n.callback&&e!==n.callback._callback||r&&r!==n.context){s.push(n)}}}if(!s.length)delete this._events[t]}}return this},trigger:function(t){if(!this._events)return this;var e=o.call(arguments,1);if(!c(this,"trigger",t,e))return this;var i=this._events[t];var r=this._events.all;if(i)f(i,e);if(r)f(r,arguments);return this},stopListening:function(t,e,r){var s=this._listeningTo;if(!s)return this;var n=!e&&!r;if(!r&&typeof e==="object")r=this;if(t)(s={})[t._listenId]=t;for(var a in s){t=s[a];t.off(e,r,this);if(n||i.isEmpty(t._events))delete this._listeningTo[a]}return this}};var l=/\s+/;var c=function(t,e,i,r){if(!i)return true;if(typeof i==="object"){for(var s in i){t[e].apply(t,[s,i[s]].concat(r))}return false}if(l.test(i)){var n=i.split(l);for(var a=0,o=n.length;a<o;a++){t[e].apply(t,[n[a]].concat(r))}return false}return true};var f=function(t,e){var i,r=-1,s=t.length,n=e[0],a=e[1],o=e[2];switch(e.length){case 0:while(++r<s)(i=t[r]).callback.call(i.ctx);return;case 1:while(++r<s)(i=t[r]).callback.call(i.ctx,n);return;case 2:while(++r<s)(i=t[r]).callback.call(i.ctx,n,a);return;case 3:while(++r<s)(i=t[r]).callback.call(i.ctx,n,a,o);return;default:while(++r<s)(i=t[r]).callback.apply(i.ctx,e);return}};var d={listenTo:"on",listenToOnce:"once"};i.each(d,function(t,e){u[e]=function(e,r,s){var n=this._listeningTo||(this._listeningTo={});var a=e._listenId||(e._listenId=i.uniqueId("l"));n[a]=e;if(!s&&typeof r==="object")s=this;e[t](r,s,this);return this}});u.bind=u.on;u.unbind=u.off;i.extend(e,u);var p=e.Model=function(t,e){var r=t||{};e||(e={});this.cid=i.uniqueId("c");this.attributes={};if(e.collection)this.collection=e.collection;if(e.parse)r=this.parse(r,e)||{};r=i.defaults({},r,i.result(this,"defaults"));this.set(r,e);this.changed={};this.initialize.apply(this,arguments)};i.extend(p.prototype,u,{changed:null,validationError:null,idAttribute:"id",initialize:function(){},toJSON:function(t){return i.clone(this.attributes)},sync:function(){return e.sync.apply(this,arguments)},get:function(t){return this.attributes[t]},escape:function(t){return i.escape(this.get(t))},has:function(t){return this.get(t)!=null},set:function(t,e,r){var s,n,a,o,h,u,l,c;if(t==null)return this;if(typeof t==="object"){n=t;r=e}else{(n={})[t]=e}r||(r={});if(!this._validate(n,r))return false;a=r.unset;h=r.silent;o=[];u=this._changing;this._changing=true;if(!u){this._previousAttributes=i.clone(this.attributes);this.changed={}}c=this.attributes,l=this._previousAttributes;if(this.idAttribute in n)this.id=n[this.idAttribute];for(s in n){e=n[s];if(!i.isEqual(c[s],e))o.push(s);if(!i.isEqual(l[s],e)){this.changed[s]=e}else{delete this.changed[s]}a?delete c[s]:c[s]=e}if(!h){if(o.length)this._pending=r;for(var f=0,d=o.length;f<d;f++){this.trigger("change:"+o[f],this,c[o[f]],r)}}if(u)return this;if(!h){while(this._pending){r=this._pending;this._pending=false;this.trigger("change",this,r)}}this._pending=false;this._changing=false;return this},unset:function(t,e){return this.set(t,void 0,i.extend({},e,{unset:true}))},clear:function(t){var e={};for(var r in this.attributes)e[r]=void 0;return this.set(e,i.extend({},t,{unset:true}))},hasChanged:function(t){if(t==null)return!i.isEmpty(this.changed);return i.has(this.changed,t)},changedAttributes:function(t){if(!t)return this.hasChanged()?i.clone(this.changed):false;var e,r=false;var s=this._changing?this._previousAttributes:this.attributes;for(var n in t){if(i.isEqual(s[n],e=t[n]))continue;(r||(r={}))[n]=e}return r},previous:function(t){if(t==null||!this._previousAttributes)return null;return this._previousAttributes[t]},previousAttributes:function(){return i.clone(this._previousAttributes)},fetch:function(t){t=t?i.clone(t):{};if(t.parse===void 0)t.parse=true;var e=this;var r=t.success;t.success=function(i){if(!e.set(e.parse(i,t),t))return false;if(r)r(e,i,t);e.trigger("sync",e,i,t)};q(this,t);return this.sync("read",this,t)},save:function(t,e,r){var s,n,a,o=this.attributes;if(t==null||typeof t==="object"){s=t;r=e}else{(s={})[t]=e}r=i.extend({validate:true},r);if(s&&!r.wait){if(!this.set(s,r))return false}else{if(!this._validate(s,r))return false}if(s&&r.wait){this.attributes=i.extend({},o,s)}if(r.parse===void 0)r.parse=true;var h=this;var u=r.success;r.success=function(t){h.attributes=o;var e=h.parse(t,r);if(r.wait)e=i.extend(s||{},e);if(i.isObject(e)&&!h.set(e,r)){return false}if(u)u(h,t,r);h.trigger("sync",h,t,r)};q(this,r);n=this.isNew()?"create":r.patch?"patch":"update";if(n==="patch")r.attrs=s;a=this.sync(n,this,r);if(s&&r.wait)this.attributes=o;return a},destroy:function(t){t=t?i.clone(t):{};var e=this;var r=t.success;var s=function(){e.trigger("destroy",e,e.collection,t)};t.success=function(i){if(t.wait||e.isNew())s();if(r)r(e,i,t);if(!e.isNew())e.trigger("sync",e,i,t)};if(this.isNew()){t.success();return false}q(this,t);var n=this.sync("delete",this,t);if(!t.wait)s();return n},url:function(){var t=i.result(this,"urlRoot")||i.result(this.collection,"url")||M();if(this.isNew())return t;return t.replace(/([^\/])$/,"$1/")+encodeURIComponent(this.id)},parse:function(t,e){return t},clone:function(){return new this.constructor(this.attributes)},isNew:function(){return!this.has(this.idAttribute)},isValid:function(t){return this._validate({},i.extend(t||{},{validate:true}))},_validate:function(t,e){if(!e.validate||!this.validate)return true;t=i.extend({},this.attributes,t);var r=this.validationError=this.validate(t,e)||null;if(!r)return true;this.trigger("invalid",this,r,i.extend(e,{validationError:r}));return false}});var v=["keys","values","pairs","invert","pick","omit"];i.each(v,function(t){p.prototype[t]=function(){var e=o.call(arguments);e.unshift(this.attributes);return i[t].apply(i,e)}});var g=e.Collection=function(t,e){e||(e={});if(e.model)this.model=e.model;if(e.comparator!==void 0)this.comparator=e.comparator;this._reset();this.initialize.apply(this,arguments);if(t)this.reset(t,i.extend({silent:true},e))};var m={add:true,remove:true,merge:true};var y={add:true,remove:false};i.extend(g.prototype,u,{model:p,initialize:function(){},toJSON:function(t){return this.map(function(e){return e.toJSON(t)})},sync:function(){return e.sync.apply(this,arguments)},add:function(t,e){return this.set(t,i.extend({merge:false},e,y))},remove:function(t,e){var r=!i.isArray(t);t=r?[t]:i.clone(t);e||(e={});var s,n,a,o;for(s=0,n=t.length;s<n;s++){o=t[s]=this.get(t[s]);if(!o)continue;delete this._byId[o.id];delete this._byId[o.cid];a=this.indexOf(o);this.models.splice(a,1);this.length--;if(!e.silent){e.index=a;o.trigger("remove",o,this,e)}this._removeReference(o,e)}return r?t[0]:t},set:function(t,e){e=i.defaults({},e,m);if(e.parse)t=this.parse(t,e);var r=!i.isArray(t);t=r?t?[t]:[]:i.clone(t);var s,n,a,o,h,u,l;var c=e.at;var f=this.model;var d=this.comparator&&c==null&&e.sort!==false;var v=i.isString(this.comparator)?this.comparator:null;var g=[],y=[],_={};var b=e.add,w=e.merge,x=e.remove;var E=!d&&b&&x?[]:false;for(s=0,n=t.length;s<n;s++){h=t[s]||{};if(h instanceof p){a=o=h}else{a=h[f.prototype.idAttribute||"id"]}if(u=this.get(a)){if(x)_[u.cid]=true;if(w){h=h===o?o.attributes:h;if(e.parse)h=u.parse(h,e);u.set(h,e);if(d&&!l&&u.hasChanged(v))l=true}t[s]=u}else if(b){o=t[s]=this._prepareModel(h,e);if(!o)continue;g.push(o);this._addReference(o,e)}o=u||o;if(E&&(o.isNew()||!_[o.id]))E.push(o);_[o.id]=true}if(x){for(s=0,n=this.length;s<n;++s){if(!_[(o=this.models[s]).cid])y.push(o)}if(y.length)this.remove(y,e)}if(g.length||E&&E.length){if(d)l=true;this.length+=g.length;if(c!=null){for(s=0,n=g.length;s<n;s++){this.models.splice(c+s,0,g[s])}}else{if(E)this.models.length=0;var k=E||g;for(s=0,n=k.length;s<n;s++){this.models.push(k[s])}}}if(l)this.sort({silent:true});if(!e.silent){for(s=0,n=g.length;s<n;s++){(o=g[s]).trigger("add",o,this,e)}if(l||E&&E.length)this.trigger("sort",this,e)}return r?t[0]:t},reset:function(t,e){e||(e={});for(var r=0,s=this.models.length;r<s;r++){this._removeReference(this.models[r],e)}e.previousModels=this.models;this._reset();t=this.add(t,i.extend({silent:true},e));if(!e.silent)this.trigger("reset",this,e);return t},push:function(t,e){return this.add(t,i.extend({at:this.length},e))},pop:function(t){var e=this.at(this.length-1);this.remove(e,t);return e},unshift:function(t,e){return this.add(t,i.extend({at:0},e))},shift:function(t){var e=this.at(0);this.remove(e,t);return e},slice:function(){return o.apply(this.models,arguments)},get:function(t){if(t==null)return void 0;return this._byId[t]||this._byId[t.id]||this._byId[t.cid]},at:function(t){return this.models[t]},where:function(t,e){if(i.isEmpty(t))return e?void 0:[];return this[e?"find":"filter"](function(e){for(var i in t){if(t[i]!==e.get(i))return false}return true})},findWhere:function(t){return this.where(t,true)},sort:function(t){if(!this.comparator)throw new Error("Cannot sort a set without a comparator");t||(t={});if(i.isString(this.comparator)||this.comparator.length===1){this.models=this.sortBy(this.comparator,this)}else{this.models.sort(i.bind(this.comparator,this))}if(!t.silent)this.trigger("sort",this,t);return this},pluck:function(t){return i.invoke(this.models,"get",t)},fetch:function(t){t=t?i.clone(t):{};if(t.parse===void 0)t.parse=true;var e=t.success;var r=this;t.success=function(i){var s=t.reset?"reset":"set";r[s](i,t);if(e)e(r,i,t);r.trigger("sync",r,i,t)};q(this,t);return this.sync("read",this,t)},create:function(t,e){e=e?i.clone(e):{};if(!(t=this._prepareModel(t,e)))return false;if(!e.wait)this.add(t,e);var r=this;var s=e.success;e.success=function(t,i){if(e.wait)r.add(t,e);if(s)s(t,i,e)};t.save(null,e);return t},parse:function(t,e){return t},clone:function(){return new this.constructor(this.models)},_reset:function(){this.length=0;this.models=[];this._byId={}},_prepareModel:function(t,e){if(t instanceof p)return t;e=e?i.clone(e):{};e.collection=this;var r=new this.model(t,e);if(!r.validationError)return r;this.trigger("invalid",this,r.validationError,e);return false},_addReference:function(t,e){this._byId[t.cid]=t;if(t.id!=null)this._byId[t.id]=t;if(!t.collection)t.collection=this;t.on("all",this._onModelEvent,this)},_removeReference:function(t,e){if(this===t.collection)delete t.collection;t.off("all",this._onModelEvent,this)},_onModelEvent:function(t,e,i,r){if((t==="add"||t==="remove")&&i!==this)return;if(t==="destroy")this.remove(e,r);if(e&&t==="change:"+e.idAttribute){delete this._byId[e.previous(e.idAttribute)];if(e.id!=null)this._byId[e.id]=e}this.trigger.apply(this,arguments)}});var _=["forEach","each","map","collect","reduce","foldl","inject","reduceRight","foldr","find","detect","filter","select","reject","every","all","some","any","include","contains","invoke","max","min","toArray","size","first","head","take","initial","rest","tail","drop","last","without","difference","indexOf","shuffle","lastIndexOf","isEmpty","chain","sample"];i.each(_,function(t){g.prototype[t]=function(){var e=o.call(arguments);e.unshift(this.models);return i[t].apply(i,e)}});var b=["groupBy","countBy","sortBy","indexBy"];i.each(b,function(t){g.prototype[t]=function(e,r){var s=i.isFunction(e)?e:function(t){return t.get(e)};return i[t](this.models,s,r)}});var w=e.View=function(t){this.cid=i.uniqueId("view");t||(t={});i.extend(this,i.pick(t,E));this._ensureElement();this.initialize.apply(this,arguments);this.delegateEvents()};var x=/^(\S+)\s*(.*)$/;var E=["model","collection","el","id","attributes","className","tagName","events"];i.extend(w.prototype,u,{tagName:"div",$:function(t){return this.$el.find(t)},initialize:function(){},render:function(){return this},remove:function(){this.$el.remove();this.stopListening();return this},setElement:function(t,i){if(this.$el)this.undelegateEvents();this.$el=t instanceof e.$?t:e.$(t);this.el=this.$el[0];if(i!==false)this.delegateEvents();return this},delegateEvents:function(t){if(!(t||(t=i.result(this,"events"))))return this;this.undelegateEvents();for(var e in t){var r=t[e];if(!i.isFunction(r))r=this[t[e]];if(!r)continue;var s=e.match(x);var n=s[1],a=s[2];r=i.bind(r,this);n+=".delegateEvents"+this.cid;if(a===""){this.$el.on(n,r)}else{this.$el.on(n,a,r)}}return this},undelegateEvents:function(){this.$el.off(".delegateEvents"+this.cid);return this},_ensureElement:function(){if(!this.el){var t=i.extend({},i.result(this,"attributes"));if(this.id)t.id=i.result(this,"id");if(this.className)t["class"]=i.result(this,"className");var r=e.$("<"+i.result(this,"tagName")+">").attr(t);this.setElement(r,false)}else{this.setElement(i.result(this,"el"),false)}}});e.sync=function(t,r,s){var n=T[t];i.defaults(s||(s={}),{emulateHTTP:e.emulateHTTP,emulateJSON:e.emulateJSON});var a={type:n,dataType:"json"};if(!s.url){a.url=i.result(r,"url")||M()}if(s.data==null&&r&&(t==="create"||t==="update"||t==="patch")){a.contentType="application/json";a.data=JSON.stringify(s.attrs||r.toJSON(s))}if(s.emulateJSON){a.contentType="application/x-www-form-urlencoded";a.data=a.data?{model:a.data}:{}}if(s.emulateHTTP&&(n==="PUT"||n==="DELETE"||n==="PATCH")){a.type="POST";if(s.emulateJSON)a.data._method=n;var o=s.beforeSend;s.beforeSend=function(t){t.setRequestHeader("X-HTTP-Method-Override",n);if(o)return o.apply(this,arguments)}}if(a.type!=="GET"&&!s.emulateJSON){a.processData=false}if(a.type==="PATCH"&&k){a.xhr=function(){return new ActiveXObject("Microsoft.XMLHTTP")}}var h=s.xhr=e.ajax(i.extend(a,s));r.trigger("request",r,h,s);return h};var k=typeof window!=="undefined"&&!!window.ActiveXObject&&!(window.XMLHttpRequest&&(new XMLHttpRequest).dispatchEvent);var T={create:"POST",update:"PUT",patch:"PATCH","delete":"DELETE",read:"GET"};e.ajax=function(){return e.$.ajax.apply(e.$,arguments)};var $=e.Router=function(t){t||(t={});if(t.routes)this.routes=t.routes;this._bindRoutes();this.initialize.apply(this,arguments)};var S=/\((.*?)\)/g;var H=/(\(\?)?:\w+/g;var A=/\*\w+/g;var I=/[\-{}\[\]+?.,\\\^$|#\s]/g;i.extend($.prototype,u,{initialize:function(){},route:function(t,r,s){if(!i.isRegExp(t))t=this._routeToRegExp(t);if(i.isFunction(r)){s=r;r=""}if(!s)s=this[r];var n=this;e.history.route(t,function(i){var a=n._extractParameters(t,i);n.execute(s,a);n.trigger.apply(n,["route:"+r].concat(a));n.trigger("route",r,a);e.history.trigger("route",n,r,a)});return this},execute:function(t,e){if(t)t.apply(this,e)},navigate:function(t,i){e.history.navigate(t,i);return this},_bindRoutes:function(){if(!this.routes)return;this.routes=i.result(this,"routes");var t,e=i.keys(this.routes);while((t=e.pop())!=null){this.route(t,this.routes[t])}},_routeToRegExp:function(t){t=t.replace(I,"\\$&").replace(S,"(?:$1)?").replace(H,function(t,e){return e?t:"([^/?]+)"}).replace(A,"([^?]*?)");return new RegExp("^"+t+"(?:\\?([\\s\\S]*))?$")},_extractParameters:function(t,e){var r=t.exec(e).slice(1);return i.map(r,function(t,e){if(e===r.length-1)return t||null;return t?decodeURIComponent(t):null})}});var N=e.History=function(){this.handlers=[];i.bindAll(this,"checkUrl");if(typeof window!=="undefined"){this.location=window.location;this.history=window.history}};var R=/^[#\/]|\s+$/g;var O=/^\/+|\/+$/g;var P=/msie [\w.]+/;var C=/\/$/;var j=/#.*$/;N.started=false;i.extend(N.prototype,u,{interval:50,atRoot:function(){return this.location.pathname.replace(/[^\/]$/,"$&/")===this.root},getHash:function(t){var e=(t||this).location.href.match(/#(.*)$/);return e?e[1]:""},getFragment:function(t,e){if(t==null){if(this._hasPushState||!this._wantsHashChange||e){t=decodeURI(this.location.pathname+this.location.search);var i=this.root.replace(C,"");if(!t.indexOf(i))t=t.slice(i.length)}else{t=this.getHash()}}return t.replace(R,"")},start:function(t){if(N.started)throw new Error("Backbone.history has already been started");N.started=true;this.options=i.extend({root:"/"},this.options,t);this.root=this.options.root;this._wantsHashChange=this.options.hashChange!==false;this._wantsPushState=!!this.options.pushState;this._hasPushState=!!(this.options.pushState&&this.history&&this.history.pushState);var r=this.getFragment();var s=document.documentMode;var n=P.exec(navigator.userAgent.toLowerCase())&&(!s||s<=7);this.root=("/"+this.root+"/").replace(O,"/");if(n&&this._wantsHashChange){var a=e.$('<iframe src="javascript:0" tabindex="-1">');this.iframe=a.hide().appendTo("body")[0].contentWindow;this.navigate(r)}if(this._hasPushState){e.$(window).on("popstate",this.checkUrl)}else if(this._wantsHashChange&&"onhashchange"in window&&!n){e.$(window).on("hashchange",this.checkUrl)}else if(this._wantsHashChange){this._checkUrlInterval=setInterval(this.checkUrl,this.interval)}this.fragment=r;var o=this.location;if(this._wantsHashChange&&this._wantsPushState){if(!this._hasPushState&&!this.atRoot()){this.fragment=this.getFragment(null,true);this.location.replace(this.root+"#"+this.fragment);return true}else if(this._hasPushState&&this.atRoot()&&o.hash){this.fragment=this.getHash().replace(R,"");this.history.replaceState({},document.title,this.root+this.fragment)}}if(!this.options.silent)return this.loadUrl()},stop:function(){e.$(window).off("popstate",this.checkUrl).off("hashchange",this.checkUrl);if(this._checkUrlInterval)clearInterval(this._checkUrlInterval);N.started=false},route:function(t,e){this.handlers.unshift({route:t,callback:e})},checkUrl:function(t){var e=this.getFragment();if(e===this.fragment&&this.iframe){e=this.getFragment(this.getHash(this.iframe))}if(e===this.fragment)return false;if(this.iframe)this.navigate(e);this.loadUrl()},loadUrl:function(t){t=this.fragment=this.getFragment(t);return i.any(this.handlers,function(e){if(e.route.test(t)){e.callback(t);return true}})},navigate:function(t,e){if(!N.started)return false;if(!e||e===true)e={trigger:!!e};var i=this.root+(t=this.getFragment(t||""));t=t.replace(j,"");if(this.fragment===t)return;this.fragment=t;if(t===""&&i!=="/")i=i.slice(0,-1);if(this._hasPushState){this.history[e.replace?"replaceState":"pushState"]({},document.title,i)}else if(this._wantsHashChange){this._updateHash(this.location,t,e.replace);if(this.iframe&&t!==this.getFragment(this.getHash(this.iframe))){if(!e.replace)this.iframe.document.open().close();this._updateHash(this.iframe.location,t,e.replace)}}else{return this.location.assign(i)}if(e.trigger)return this.loadUrl(t)},_updateHash:function(t,e,i){if(i){var r=t.href.replace(/(javascript:|#).*$/,"");t.replace(r+"#"+e)}else{t.hash="#"+e}}});e.history=new N;var U=function(t,e){var r=this;var s;if(t&&i.has(t,"constructor")){s=t.constructor}else{s=function(){return r.apply(this,arguments)}}i.extend(s,r,e);var n=function(){this.constructor=s};n.prototype=r.prototype;s.prototype=new n;if(t)i.extend(s.prototype,t);s.__super__=r.prototype;return s};p.extend=g.extend=$.extend=w.extend=N.extend=U;var M=function(){throw new Error('A "url" property or function must be specified')};var q=function(t,e){var i=e.error;e.error=function(r){if(i)i(t,r,e);t.trigger("error",t,r,e)}};return e});
//# sourceMappingURL=backbone-min.map;
// MarionetteJS (Backbone.Marionette)
// ----------------------------------
// v2.2.0
//
// Copyright (c)2014 Derick Bailey, Muted Solutions, LLC.
// Distributed under MIT license
//
// http://marionettejs.com


/*!
 * Includes BabySitter
 * https://github.com/marionettejs/backbone.babysitter/
 *
 * Includes Wreqr
 * https://github.com/marionettejs/backbone.wreqr/
 */


(function(root, factory) {

  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    define('marionette',['backbone', 'underscore'], function(Backbone, _) {
      return (root.Marionette = factory(root, Backbone, _));
    });
  } else if (typeof exports !== 'undefined') {
    var Backbone = require('backbone');
    var _ = require('underscore');
    module.exports = factory(root, Backbone, _);
  } else {
    root.Marionette = factory(root, root.Backbone, root._);
  }

}(this, function(root, Backbone, _) {
  'use strict';

  /* istanbul ignore next */
  // Backbone.BabySitter
  // -------------------
  // v0.1.4
  //
  // Copyright (c)2014 Derick Bailey, Muted Solutions, LLC.
  // Distributed under MIT license
  //
  // http://github.com/marionettejs/backbone.babysitter
  (function(Backbone, _) {
    "use strict";
    var previousChildViewContainer = Backbone.ChildViewContainer;
    // BabySitter.ChildViewContainer
    // -----------------------------
    //
    // Provide a container to store, retrieve and
    // shut down child views.
    Backbone.ChildViewContainer = function(Backbone, _) {
      // Container Constructor
      // ---------------------
      var Container = function(views) {
        this._views = {};
        this._indexByModel = {};
        this._indexByCustom = {};
        this._updateLength();
        _.each(views, this.add, this);
      };
      // Container Methods
      // -----------------
      _.extend(Container.prototype, {
        // Add a view to this container. Stores the view
        // by `cid` and makes it searchable by the model
        // cid (and model itself). Optionally specify
        // a custom key to store an retrieve the view.
        add: function(view, customIndex) {
          var viewCid = view.cid;
          // store the view
          this._views[viewCid] = view;
          // index it by model
          if (view.model) {
            this._indexByModel[view.model.cid] = viewCid;
          }
          // index by custom
          if (customIndex) {
            this._indexByCustom[customIndex] = viewCid;
          }
          this._updateLength();
          return this;
        },
        // Find a view by the model that was attached to
        // it. Uses the model's `cid` to find it.
        findByModel: function(model) {
          return this.findByModelCid(model.cid);
        },
        // Find a view by the `cid` of the model that was attached to
        // it. Uses the model's `cid` to find the view `cid` and
        // retrieve the view using it.
        findByModelCid: function(modelCid) {
          var viewCid = this._indexByModel[modelCid];
          return this.findByCid(viewCid);
        },
        // Find a view by a custom indexer.
        findByCustom: function(index) {
          var viewCid = this._indexByCustom[index];
          return this.findByCid(viewCid);
        },
        // Find by index. This is not guaranteed to be a
        // stable index.
        findByIndex: function(index) {
          return _.values(this._views)[index];
        },
        // retrieve a view by its `cid` directly
        findByCid: function(cid) {
          return this._views[cid];
        },
        // Remove a view
        remove: function(view) {
          var viewCid = view.cid;
          // delete model index
          if (view.model) {
            delete this._indexByModel[view.model.cid];
          }
          // delete custom index
          _.any(this._indexByCustom, function(cid, key) {
            if (cid === viewCid) {
              delete this._indexByCustom[key];
              return true;
            }
          }, this);
          // remove the view from the container
          delete this._views[viewCid];
          // update the length
          this._updateLength();
          return this;
        },
        // Call a method on every view in the container,
        // passing parameters to the call method one at a
        // time, like `function.call`.
        call: function(method) {
          this.apply(method, _.tail(arguments));
        },
        // Apply a method on every view in the container,
        // passing parameters to the call method one at a
        // time, like `function.apply`.
        apply: function(method, args) {
          _.each(this._views, function(view) {
            if (_.isFunction(view[method])) {
              view[method].apply(view, args || []);
            }
          });
        },
        // Update the `.length` attribute on this container
        _updateLength: function() {
          this.length = _.size(this._views);
        }
      });
      // Borrowing this code from Backbone.Collection:
      // http://backbonejs.org/docs/backbone.html#section-106
      //
      // Mix in methods from Underscore, for iteration, and other
      // collection related features.
      var methods = [ "forEach", "each", "map", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "toArray", "first", "initial", "rest", "last", "without", "isEmpty", "pluck" ];
      _.each(methods, function(method) {
        Container.prototype[method] = function() {
          var views = _.values(this._views);
          var args = [ views ].concat(_.toArray(arguments));
          return _[method].apply(_, args);
        };
      });
      // return the public API
      return Container;
    }(Backbone, _);
    Backbone.ChildViewContainer.VERSION = "0.1.4";
    Backbone.ChildViewContainer.noConflict = function() {
      Backbone.ChildViewContainer = previousChildViewContainer;
      return this;
    };
    return Backbone.ChildViewContainer;
  })(Backbone, _);

  /* istanbul ignore next */
  // Backbone.Wreqr (Backbone.Marionette)
  // ----------------------------------
  // v1.3.1
  //
  // Copyright (c)2014 Derick Bailey, Muted Solutions, LLC.
  // Distributed under MIT license
  //
  // http://github.com/marionettejs/backbone.wreqr
  (function(Backbone, _) {
    "use strict";
    var previousWreqr = Backbone.Wreqr;
    var Wreqr = Backbone.Wreqr = {};
    Backbone.Wreqr.VERSION = "1.3.1";
    Backbone.Wreqr.noConflict = function() {
      Backbone.Wreqr = previousWreqr;
      return this;
    };
    // Handlers
    // --------
    // A registry of functions to call, given a name
    Wreqr.Handlers = function(Backbone, _) {
      "use strict";
      // Constructor
      // -----------
      var Handlers = function(options) {
        this.options = options;
        this._wreqrHandlers = {};
        if (_.isFunction(this.initialize)) {
          this.initialize(options);
        }
      };
      Handlers.extend = Backbone.Model.extend;
      // Instance Members
      // ----------------
      _.extend(Handlers.prototype, Backbone.Events, {
        // Add multiple handlers using an object literal configuration
        setHandlers: function(handlers) {
          _.each(handlers, function(handler, name) {
            var context = null;
            if (_.isObject(handler) && !_.isFunction(handler)) {
              context = handler.context;
              handler = handler.callback;
            }
            this.setHandler(name, handler, context);
          }, this);
        },
        // Add a handler for the given name, with an
        // optional context to run the handler within
        setHandler: function(name, handler, context) {
          var config = {
            callback: handler,
            context: context
          };
          this._wreqrHandlers[name] = config;
          this.trigger("handler:add", name, handler, context);
        },
        // Determine whether or not a handler is registered
        hasHandler: function(name) {
          return !!this._wreqrHandlers[name];
        },
        // Get the currently registered handler for
        // the specified name. Throws an exception if
        // no handler is found.
        getHandler: function(name) {
          var config = this._wreqrHandlers[name];
          if (!config) {
            return;
          }
          return function() {
            var args = Array.prototype.slice.apply(arguments);
            return config.callback.apply(config.context, args);
          };
        },
        // Remove a handler for the specified name
        removeHandler: function(name) {
          delete this._wreqrHandlers[name];
        },
        // Remove all handlers from this registry
        removeAllHandlers: function() {
          this._wreqrHandlers = {};
        }
      });
      return Handlers;
    }(Backbone, _);
    // Wreqr.CommandStorage
    // --------------------
    //
    // Store and retrieve commands for execution.
    Wreqr.CommandStorage = function() {
      "use strict";
      // Constructor function
      var CommandStorage = function(options) {
        this.options = options;
        this._commands = {};
        if (_.isFunction(this.initialize)) {
          this.initialize(options);
        }
      };
      // Instance methods
      _.extend(CommandStorage.prototype, Backbone.Events, {
        // Get an object literal by command name, that contains
        // the `commandName` and the `instances` of all commands
        // represented as an array of arguments to process
        getCommands: function(commandName) {
          var commands = this._commands[commandName];
          // we don't have it, so add it
          if (!commands) {
            // build the configuration
            commands = {
              command: commandName,
              instances: []
            };
            // store it
            this._commands[commandName] = commands;
          }
          return commands;
        },
        // Add a command by name, to the storage and store the
        // args for the command
        addCommand: function(commandName, args) {
          var command = this.getCommands(commandName);
          command.instances.push(args);
        },
        // Clear all commands for the given `commandName`
        clearCommands: function(commandName) {
          var command = this.getCommands(commandName);
          command.instances = [];
        }
      });
      return CommandStorage;
    }();
    // Wreqr.Commands
    // --------------
    //
    // A simple command pattern implementation. Register a command
    // handler and execute it.
    Wreqr.Commands = function(Wreqr) {
      "use strict";
      return Wreqr.Handlers.extend({
        // default storage type
        storageType: Wreqr.CommandStorage,
        constructor: function(options) {
          this.options = options || {};
          this._initializeStorage(this.options);
          this.on("handler:add", this._executeCommands, this);
          var args = Array.prototype.slice.call(arguments);
          Wreqr.Handlers.prototype.constructor.apply(this, args);
        },
        // Execute a named command with the supplied args
        execute: function(name, args) {
          name = arguments[0];
          args = Array.prototype.slice.call(arguments, 1);
          if (this.hasHandler(name)) {
            this.getHandler(name).apply(this, args);
          } else {
            this.storage.addCommand(name, args);
          }
        },
        // Internal method to handle bulk execution of stored commands
        _executeCommands: function(name, handler, context) {
          var command = this.storage.getCommands(name);
          // loop through and execute all the stored command instances
          _.each(command.instances, function(args) {
            handler.apply(context, args);
          });
          this.storage.clearCommands(name);
        },
        // Internal method to initialize storage either from the type's
        // `storageType` or the instance `options.storageType`.
        _initializeStorage: function(options) {
          var storage;
          var StorageType = options.storageType || this.storageType;
          if (_.isFunction(StorageType)) {
            storage = new StorageType();
          } else {
            storage = StorageType;
          }
          this.storage = storage;
        }
      });
    }(Wreqr);
    // Wreqr.RequestResponse
    // ---------------------
    //
    // A simple request/response implementation. Register a
    // request handler, and return a response from it
    Wreqr.RequestResponse = function(Wreqr) {
      "use strict";
      return Wreqr.Handlers.extend({
        request: function() {
          var name = arguments[0];
          var args = Array.prototype.slice.call(arguments, 1);
          if (this.hasHandler(name)) {
            return this.getHandler(name).apply(this, args);
          }
        }
      });
    }(Wreqr);
    // Event Aggregator
    // ----------------
    // A pub-sub object that can be used to decouple various parts
    // of an application through event-driven architecture.
    Wreqr.EventAggregator = function(Backbone, _) {
      "use strict";
      var EA = function() {};
      // Copy the `extend` function used by Backbone's classes
      EA.extend = Backbone.Model.extend;
      // Copy the basic Backbone.Events on to the event aggregator
      _.extend(EA.prototype, Backbone.Events);
      return EA;
    }(Backbone, _);
    // Wreqr.Channel
    // --------------
    //
    // An object that wraps the three messaging systems:
    // EventAggregator, RequestResponse, Commands
    Wreqr.Channel = function(Wreqr) {
      "use strict";
      var Channel = function(channelName) {
        this.vent = new Backbone.Wreqr.EventAggregator();
        this.reqres = new Backbone.Wreqr.RequestResponse();
        this.commands = new Backbone.Wreqr.Commands();
        this.channelName = channelName;
      };
      _.extend(Channel.prototype, {
        // Remove all handlers from the messaging systems of this channel
        reset: function() {
          this.vent.off();
          this.vent.stopListening();
          this.reqres.removeAllHandlers();
          this.commands.removeAllHandlers();
          return this;
        },
        // Connect a hash of events; one for each messaging system
        connectEvents: function(hash, context) {
          this._connect("vent", hash, context);
          return this;
        },
        connectCommands: function(hash, context) {
          this._connect("commands", hash, context);
          return this;
        },
        connectRequests: function(hash, context) {
          this._connect("reqres", hash, context);
          return this;
        },
        // Attach the handlers to a given message system `type`
        _connect: function(type, hash, context) {
          if (!hash) {
            return;
          }
          context = context || this;
          var method = type === "vent" ? "on" : "setHandler";
          _.each(hash, function(fn, eventName) {
            this[type][method](eventName, _.bind(fn, context));
          }, this);
        }
      });
      return Channel;
    }(Wreqr);
    // Wreqr.Radio
    // --------------
    //
    // An object that lets you communicate with many channels.
    Wreqr.radio = function(Wreqr) {
      "use strict";
      var Radio = function() {
        this._channels = {};
        this.vent = {};
        this.commands = {};
        this.reqres = {};
        this._proxyMethods();
      };
      _.extend(Radio.prototype, {
        channel: function(channelName) {
          if (!channelName) {
            throw new Error("Channel must receive a name");
          }
          return this._getChannel(channelName);
        },
        _getChannel: function(channelName) {
          var channel = this._channels[channelName];
          if (!channel) {
            channel = new Wreqr.Channel(channelName);
            this._channels[channelName] = channel;
          }
          return channel;
        },
        _proxyMethods: function() {
          _.each([ "vent", "commands", "reqres" ], function(system) {
            _.each(messageSystems[system], function(method) {
              this[system][method] = proxyMethod(this, system, method);
            }, this);
          }, this);
        }
      });
      var messageSystems = {
        vent: [ "on", "off", "trigger", "once", "stopListening", "listenTo", "listenToOnce" ],
        commands: [ "execute", "setHandler", "setHandlers", "removeHandler", "removeAllHandlers" ],
        reqres: [ "request", "setHandler", "setHandlers", "removeHandler", "removeAllHandlers" ]
      };
      var proxyMethod = function(radio, system, method) {
        return function(channelName) {
          var messageSystem = radio._getChannel(channelName)[system];
          var args = Array.prototype.slice.call(arguments, 1);
          return messageSystem[method].apply(messageSystem, args);
        };
      };
      return new Radio();
    }(Wreqr);
    return Backbone.Wreqr;
  })(Backbone, _);

  var previousMarionette = root.Marionette;

  var Marionette = Backbone.Marionette = {};

  Marionette.VERSION = '2.2.0';

  Marionette.noConflict = function() {
    root.Marionette = previousMarionette;
    return this;
  };

  Backbone.Marionette = Marionette;

  // Get the Deferred creator for later use
  Marionette.Deferred = Backbone.$.Deferred;

  /* jshint unused: false */
  
  // Helpers
  // -------
  
  // For slicing `arguments` in functions
  var slice = Array.prototype.slice;
  
  // Marionette.extend
  // -----------------
  
  // Borrow the Backbone `extend` method so we can use it as needed
  Marionette.extend = Backbone.Model.extend;
  
  // Marionette.getOption
  // --------------------
  
  // Retrieve an object, function or other value from a target
  // object or its `options`, with `options` taking precedence.
  Marionette.getOption = function(target, optionName) {
    if (!target || !optionName) { return; }
    var value;
  
    if (target.options && (target.options[optionName] !== undefined)) {
      value = target.options[optionName];
    } else {
      value = target[optionName];
    }
  
    return value;
  };
  
  // Proxy `Marionette.getOption`
  Marionette.proxyGetOption = function(optionName) {
    return Marionette.getOption(this, optionName);
  };
  
  // Marionette.normalizeMethods
  // ----------------------
  
  // Pass in a mapping of events => functions or function names
  // and return a mapping of events => functions
  Marionette.normalizeMethods = function(hash) {
    var normalizedHash = {};
    _.each(hash, function(method, name) {
      if (!_.isFunction(method)) {
        method = this[method];
      }
      if (!method) {
        return;
      }
      normalizedHash[name] = method;
    }, this);
    return normalizedHash;
  };
  
  // utility method for parsing @ui. syntax strings
  // into associated selector
  Marionette.normalizeUIString = function(uiString, ui) {
    return uiString.replace(/@ui\.[a-zA-Z_$0-9]*/g, function(r) {
      return ui[r.slice(4)];
    });
  };
  
  // allows for the use of the @ui. syntax within
  // a given key for triggers and events
  // swaps the @ui with the associated selector.
  // Returns a new, non-mutated, parsed events hash.
  Marionette.normalizeUIKeys = function(hash, ui) {
    if (typeof(hash) === 'undefined') {
      return;
    }
  
    hash = _.clone(hash);
  
    _.each(_.keys(hash), function(key) {
      var normalizedKey = Marionette.normalizeUIString(key, ui);
      if (normalizedKey !== key) {
        hash[normalizedKey] = hash[key];
        delete hash[key];
      }
    });
  
    return hash;
  };
  
  // allows for the use of the @ui. syntax within
  // a given value for regions
  // swaps the @ui with the associated selector
  Marionette.normalizeUIValues = function(hash, ui) {
    if (typeof(hash) === 'undefined') {
      return;
    }
  
    _.each(hash, function(val, key) {
      if (_.isString(val)) {
        hash[key] = Marionette.normalizeUIString(val, ui);
      }
    });
  
    return hash;
  };
  
  // Mix in methods from Underscore, for iteration, and other
  // collection related features.
  // Borrowing this code from Backbone.Collection:
  // http://backbonejs.org/docs/backbone.html#section-121
  Marionette.actAsCollection = function(object, listProperty) {
    var methods = ['forEach', 'each', 'map', 'find', 'detect', 'filter',
      'select', 'reject', 'every', 'all', 'some', 'any', 'include',
      'contains', 'invoke', 'toArray', 'first', 'initial', 'rest',
      'last', 'without', 'isEmpty', 'pluck'];
  
    _.each(methods, function(method) {
      object[method] = function() {
        var list = _.values(_.result(this, listProperty));
        var args = [list].concat(_.toArray(arguments));
        return _[method].apply(_, args);
      };
    });
  };
  
  // Trigger an event and/or a corresponding method name. Examples:
  //
  // `this.triggerMethod("foo")` will trigger the "foo" event and
  // call the "onFoo" method.
  //
  // `this.triggerMethod("foo:bar")` will trigger the "foo:bar" event and
  // call the "onFooBar" method.
  Marionette.triggerMethod = function(event) {
  
    // split the event name on the ":"
    var splitter = /(^|:)(\w)/gi;
  
    // take the event section ("section1:section2:section3")
    // and turn it in to uppercase name
    function getEventName(match, prefix, eventName) {
      return eventName.toUpperCase();
    }
  
    // get the method name from the event name
    var methodName = 'on' + event.replace(splitter, getEventName);
    var method = this[methodName];
    var result;
  
    // call the onMethodName if it exists
    if (_.isFunction(method)) {
      // pass all arguments, except the event name
      result = method.apply(this, _.tail(arguments));
    }
  
    // trigger the event, if a trigger method exists
    if (_.isFunction(this.trigger)) {
      this.trigger.apply(this, arguments);
    }
  
    return result;
  };
  
  // triggerMethodOn invokes triggerMethod on a specific context
  //
  // e.g. `Marionette.triggerMethodOn(view, 'show')`
  // will trigger a "show" event or invoke onShow the view.
  Marionette.triggerMethodOn = function(context, event) {
    var args = _.tail(arguments, 2);
    var fnc;
  
    if (_.isFunction(context.triggerMethod)) {
      fnc = context.triggerMethod;
    } else {
      fnc = Marionette.triggerMethod;
    }
  
    return fnc.apply(context, [event].concat(args));
  };
  
  // DOMRefresh
  // ----------
  //
  // Monitor a view's state, and after it has been rendered and shown
  // in the DOM, trigger a "dom:refresh" event every time it is
  // re-rendered.
  
  Marionette.MonitorDOMRefresh = (function(documentElement) {
    // track when the view has been shown in the DOM,
    // using a Marionette.Region (or by other means of triggering "show")
    function handleShow(view) {
      view._isShown = true;
      triggerDOMRefresh(view);
    }
  
    // track when the view has been rendered
    function handleRender(view) {
      view._isRendered = true;
      triggerDOMRefresh(view);
    }
  
    // Trigger the "dom:refresh" event and corresponding "onDomRefresh" method
    function triggerDOMRefresh(view) {
      if (view._isShown && view._isRendered && isInDOM(view)) {
        if (_.isFunction(view.triggerMethod)) {
          view.triggerMethod('dom:refresh');
        }
      }
    }
  
    function isInDOM(view) {
      return Backbone.$.contains(documentElement, view.el);
    }
  
    // Export public API
    return function(view) {
      view.listenTo(view, 'show', function() {
        handleShow(view);
      });
  
      view.listenTo(view, 'render', function() {
        handleRender(view);
      });
    };
  })(document.documentElement);
  

  /* jshint maxparams: 5 */
  
  // Marionette.bindEntityEvents & unbindEntityEvents
  // ---------------------------
  //
  // These methods are used to bind/unbind a backbone "entity" (collection/model)
  // to methods on a target object.
  //
  // The first parameter, `target`, must have a `listenTo` method from the
  // EventBinder object.
  //
  // The second parameter is the entity (Backbone.Model or Backbone.Collection)
  // to bind the events from.
  //
  // The third parameter is a hash of { "event:name": "eventHandler" }
  // configuration. Multiple handlers can be separated by a space. A
  // function can be supplied instead of a string handler name.
  
  (function(Marionette) {
    'use strict';
  
    // Bind the event to handlers specified as a string of
    // handler names on the target object
    function bindFromStrings(target, entity, evt, methods) {
      var methodNames = methods.split(/\s+/);
  
      _.each(methodNames, function(methodName) {
  
        var method = target[methodName];
        if (!method) {
          throw new Marionette.Error('Method "' + methodName +
            '" was configured as an event handler, but does not exist.');
        }
  
        target.listenTo(entity, evt, method);
      });
    }
  
    // Bind the event to a supplied callback function
    function bindToFunction(target, entity, evt, method) {
      target.listenTo(entity, evt, method);
    }
  
    // Bind the event to handlers specified as a string of
    // handler names on the target object
    function unbindFromStrings(target, entity, evt, methods) {
      var methodNames = methods.split(/\s+/);
  
      _.each(methodNames, function(methodName) {
        var method = target[methodName];
        target.stopListening(entity, evt, method);
      });
    }
  
    // Bind the event to a supplied callback function
    function unbindToFunction(target, entity, evt, method) {
      target.stopListening(entity, evt, method);
    }
  
  
    // generic looping function
    function iterateEvents(target, entity, bindings, functionCallback, stringCallback) {
      if (!entity || !bindings) { return; }
  
      // type-check bindings
      if (!_.isFunction(bindings) && !_.isObject(bindings)) {
        throw new Marionette.Error({
          message: 'Bindings must be an object or function.',
          url: 'marionette.functions.html#marionettebindentityevents'
        });
      }
  
      // allow the bindings to be a function
      if (_.isFunction(bindings)) {
        bindings = bindings.call(target);
      }
  
      // iterate the bindings and bind them
      _.each(bindings, function(methods, evt) {
  
        // allow for a function as the handler,
        // or a list of event names as a string
        if (_.isFunction(methods)) {
          functionCallback(target, entity, evt, methods);
        } else {
          stringCallback(target, entity, evt, methods);
        }
  
      });
    }
  
    // Export Public API
    Marionette.bindEntityEvents = function(target, entity, bindings) {
      iterateEvents(target, entity, bindings, bindToFunction, bindFromStrings);
    };
  
    Marionette.unbindEntityEvents = function(target, entity, bindings) {
      iterateEvents(target, entity, bindings, unbindToFunction, unbindFromStrings);
    };
  
    // Proxy `bindEntityEvents`
    Marionette.proxyBindEntityEvents = function(entity, bindings) {
      return Marionette.bindEntityEvents(this, entity, bindings);
    };
  
    // Proxy `unbindEntityEvents`
    Marionette.proxyUnbindEntityEvents = function(entity, bindings) {
      return Marionette.unbindEntityEvents(this, entity, bindings);
    };
  })(Marionette);
  

  var errorProps = ['description', 'fileName', 'lineNumber', 'name', 'message', 'number'];
  
  Marionette.Error = Marionette.extend.call(Error, {
    urlRoot: 'http://marionettejs.com/docs/' + Marionette.VERSION + '/',
  
    constructor: function(message, options) {
      if (_.isObject(message)) {
        options = message;
        message = options.message;
      } else if (!options) {
        options = {};
      }
  
      var error = Error.call(this, message);
      _.extend(this, _.pick(error, errorProps), _.pick(options, errorProps));
  
      this.captureStackTrace();
  
      if (options.url) {
        this.url = this.urlRoot + options.url;
      }
    },
  
    captureStackTrace: function() {
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, Marionette.Error);
      }
    },
  
    toString: function() {
      return this.name + ': ' + this.message + (this.url ? ' See: ' + this.url : '');
    }
  });
  
  Marionette.Error.extend = Marionette.extend;
  
  // Callbacks
  // ---------
  
  // A simple way of managing a collection of callbacks
  // and executing them at a later point in time, using jQuery's
  // `Deferred` object.
  Marionette.Callbacks = function() {
    this._deferred = Marionette.Deferred();
    this._callbacks = [];
  };
  
  _.extend(Marionette.Callbacks.prototype, {
  
    // Add a callback to be executed. Callbacks added here are
    // guaranteed to execute, even if they are added after the
    // `run` method is called.
    add: function(callback, contextOverride) {
      var promise = _.result(this._deferred, 'promise');
  
      this._callbacks.push({cb: callback, ctx: contextOverride});
  
      promise.then(function(args) {
        if (contextOverride){ args.context = contextOverride; }
        callback.call(args.context, args.options);
      });
    },
  
    // Run all registered callbacks with the context specified.
    // Additional callbacks can be added after this has been run
    // and they will still be executed.
    run: function(options, context) {
      this._deferred.resolve({
        options: options,
        context: context
      });
    },
  
    // Resets the list of callbacks to be run, allowing the same list
    // to be run multiple times - whenever the `run` method is called.
    reset: function() {
      var callbacks = this._callbacks;
      this._deferred = Marionette.Deferred();
      this._callbacks = [];
  
      _.each(callbacks, function(cb) {
        this.add(cb.cb, cb.ctx);
      }, this);
    }
  });
  
  // Marionette Controller
  // ---------------------
  //
  // A multi-purpose object to use as a controller for
  // modules and routers, and as a mediator for workflow
  // and coordination of other objects, views, and more.
  Marionette.Controller = function(options) {
    this.options = options || {};
  
    if (_.isFunction(this.initialize)) {
      this.initialize(this.options);
    }
  };
  
  Marionette.Controller.extend = Marionette.extend;
  
  // Controller Methods
  // --------------
  
  // Ensure it can trigger events with Backbone.Events
  _.extend(Marionette.Controller.prototype, Backbone.Events, {
    destroy: function() {
      var args = slice.call(arguments);
      this.triggerMethod.apply(this, ['before:destroy'].concat(args));
      this.triggerMethod.apply(this, ['destroy'].concat(args));
  
      this.stopListening();
      this.off();
      return this;
    },
  
    // import the `triggerMethod` to trigger events with corresponding
    // methods if the method exists
    triggerMethod: Marionette.triggerMethod,
  
    // Proxy `getOption` to enable getting options from this or this.options by name.
    getOption: Marionette.proxyGetOption
  
  });
  
  // Marionette Object
  // ---------------------
  //
  // A Base Class that other Classes should descend from.
  // Object borrows many conventions and utilities from Backbone.
  Marionette.Object = function(options) {
    this.options = _.extend({}, _.result(this, 'options'), options);
  
    this.initialize.apply(this, arguments);
  };
  
  Marionette.Object.extend = Marionette.extend;
  
  // Object Methods
  // --------------
  
  _.extend(Marionette.Object.prototype, {
  
    //this is a noop method intended to be overridden by classes that extend from this base
    initialize: function() {},
  
    destroy: function() {
      this.triggerMethod('before:destroy');
      this.triggerMethod('destroy');
      this.stopListening();
    },
  
    // Import the `triggerMethod` to trigger events with corresponding
    // methods if the method exists
    triggerMethod: Marionette.triggerMethod,
  
    // Proxy `getOption` to enable getting options from this or this.options by name.
    getOption: Marionette.proxyGetOption,
  
    // Proxy `unbindEntityEvents` to enable binding view's events from another entity.
    bindEntityEvents: Marionette.proxyBindEntityEvents,
  
    // Proxy `unbindEntityEvents` to enable unbinding view's events from another entity.
    unbindEntityEvents: Marionette.proxyUnbindEntityEvents
  });
  
  // Ensure it can trigger events with Backbone.Events
  _.extend(Marionette.Object.prototype, Backbone.Events);
  
  /* jshint maxcomplexity: 10, maxstatements: 29 */
  
  // Region
  // ------
  //
  // Manage the visual regions of your composite application. See
  // http://lostechies.com/derickbailey/2011/12/12/composite-js-apps-regions-and-region-managers/
  
  Marionette.Region = function(options) {
    this.options = options || {};
    this.el = this.getOption('el');
  
    // Handle when this.el is passed in as a $ wrapped element.
    this.el = this.el instanceof Backbone.$ ? this.el[0] : this.el;
  
    if (!this.el) {
      throw new Marionette.Error({
        name: 'NoElError',
        message: 'An "el" must be specified for a region.'
      });
    }
  
    this.$el = this.getEl(this.el);
  
    if (this.initialize) {
      var args = slice.apply(arguments);
      this.initialize.apply(this, args);
    }
  };
  
  
  // Region Class methods
  // -------------------
  
  _.extend(Marionette.Region, {
  
    // Build an instance of a region by passing in a configuration object
    // and a default region class to use if none is specified in the config.
    //
    // The config object should either be a string as a jQuery DOM selector,
    // a Region class directly, or an object literal that specifies both
    // a selector and regionClass:
    //
    // ```js
    // {
    //   selector: "#foo",
    //   regionClass: MyCustomRegion
    // }
    // ```
    //
    buildRegion: function(regionConfig, DefaultRegionClass) {
      if (_.isString(regionConfig)) {
        return this._buildRegionFromSelector(regionConfig, DefaultRegionClass);
      }
  
      if (regionConfig.selector || regionConfig.el || regionConfig.regionClass) {
        return this._buildRegionFromObject(regionConfig, DefaultRegionClass);
      }
  
      if (_.isFunction(regionConfig)) {
        return this._buildRegionFromRegionClass(regionConfig);
      }
  
      throw new Marionette.Error({
        message: 'Improper region configuration type.',
        url: 'marionette.region.html#region-configuration-types'
      });
    },
  
    // Build the region from a string selector like '#foo-region'
    _buildRegionFromSelector: function(selector, DefaultRegionClass) {
      return new DefaultRegionClass({ el: selector });
    },
  
    // Build the region from a configuration object
    // ```js
    // { selector: '#foo', regionClass: FooRegion }
    // ```
    _buildRegionFromObject: function(regionConfig, DefaultRegionClass) {
      var RegionClass = regionConfig.regionClass || DefaultRegionClass;
      var options = _.omit(regionConfig, 'selector', 'regionClass');
  
      if (regionConfig.selector && !options.el) {
        options.el = regionConfig.selector;
      }
  
      var region = new RegionClass(options);
  
      // override the `getEl` function if we have a parentEl
      // this must be overridden to ensure the selector is found
      // on the first use of the region. if we try to assign the
      // region's `el` to `parentEl.find(selector)` in the object
      // literal to build the region, the element will not be
      // guaranteed to be in the DOM already, and will cause problems
      if (regionConfig.parentEl) {
        region.getEl = function(el) {
          if (_.isObject(el)) {
            return Backbone.$(el);
          }
          var parentEl = regionConfig.parentEl;
          if (_.isFunction(parentEl)) {
            parentEl = parentEl();
          }
          return parentEl.find(el);
        };
      }
  
      return region;
    },
  
    // Build the region directly from a given `RegionClass`
    _buildRegionFromRegionClass: function(RegionClass) {
      return new RegionClass();
    }
  
  });
  
  // Region Instance Methods
  // -----------------------
  
  _.extend(Marionette.Region.prototype, Backbone.Events, {
  
    // Displays a backbone view instance inside of the region.
    // Handles calling the `render` method for you. Reads content
    // directly from the `el` attribute. Also calls an optional
    // `onShow` and `onDestroy` method on your view, just after showing
    // or just before destroying the view, respectively.
    // The `preventDestroy` option can be used to prevent a view from
    // the old view being destroyed on show.
    // The `forceShow` option can be used to force a view to be
    // re-rendered if it's already shown in the region.
  
    show: function(view, options){
      this._ensureElement();
  
      var showOptions = options || {};
      var isDifferentView = view !== this.currentView;
      var preventDestroy =  !!showOptions.preventDestroy;
      var forceShow = !!showOptions.forceShow;
  
      // we are only changing the view if there is a view to change to begin with
      var isChangingView = !!this.currentView;
  
      // only destroy the view if we don't want to preventDestroy and the view is different
      var _shouldDestroyView = !preventDestroy && isDifferentView;
  
      // show the view if the view is different or if you want to re-show the view
      var _shouldShowView = isDifferentView || forceShow;
  
      if (isChangingView) {
        this.triggerMethod('before:swapOut', this.currentView);
      }
  
      if (_shouldDestroyView) {
        this.empty();
      }
  
      if (_shouldShowView) {
  
        // We need to listen for if a view is destroyed
        // in a way other than through the region.
        // If this happens we need to remove the reference
        // to the currentView since once a view has been destroyed
        // we can not reuse it.
        view.once('destroy', _.bind(this.empty, this));
        view.render();
  
        if (isChangingView) {
          this.triggerMethod('before:swap', view);
        }
  
        this.triggerMethod('before:show', view);
        Marionette.triggerMethodOn(view, 'before:show');
  
        if (isChangingView) {
          this.triggerMethod('swapOut', this.currentView);
        }
  
        this.attachHtml(view);
        this.currentView = view;
  
        if (isChangingView) {
          this.triggerMethod('swap', view);
        }
  
        this.triggerMethod('show', view);
        Marionette.triggerMethodOn(view, 'show');
  
        return this;
      }
  
      return this;
    },
  
    _ensureElement: function(){
      if (!_.isObject(this.el)) {
        this.$el = this.getEl(this.el);
        this.el = this.$el[0];
      }
  
      if (!this.$el || this.$el.length === 0) {
        throw new Marionette.Error('An "el" ' + this.$el.selector + ' must exist in DOM');
      }
    },
  
    // Override this method to change how the region finds the
    // DOM element that it manages. Return a jQuery selector object.
    getEl: function(el) {
      return Backbone.$(el);
    },
  
    // Override this method to change how the new view is
    // appended to the `$el` that the region is managing
    attachHtml: function(view) {
      // empty the node and append new view
      this.el.innerHTML='';
      this.el.appendChild(view.el);
    },
  
    // Destroy the current view, if there is one. If there is no
    // current view, it does nothing and returns immediately.
    empty: function() {
      var view = this.currentView;
  
      // If there is no view in the region
      // we should not remove anything
      if (!view) { return; }
  
      this.triggerMethod('before:empty', view);
      this._destroyView();
      this.triggerMethod('empty', view);
  
      // Remove region pointer to the currentView
      delete this.currentView;
      return this;
    },
  
    // call 'destroy' or 'remove', depending on which is found
    // on the view (if showing a raw Backbone view or a Marionette View)
    _destroyView: function() {
      var view = this.currentView;
  
      if (view.destroy && !view.isDestroyed) {
        view.destroy();
      } else if (view.remove) {
        view.remove();
      }
    },
  
    // Attach an existing view to the region. This
    // will not call `render` or `onShow` for the new view,
    // and will not replace the current HTML for the `el`
    // of the region.
    attachView: function(view) {
      this.currentView = view;
      return this;
    },
  
    // Checks whether a view is currently present within
    // the region. Returns `true` if there is and `false` if
    // no view is present.
    hasView: function() {
      return !!this.currentView;
    },
  
    // Reset the region by destroying any existing view and
    // clearing out the cached `$el`. The next time a view
    // is shown via this region, the region will re-query the
    // DOM for the region's `el`.
    reset: function() {
      this.empty();
  
      if (this.$el) {
        this.el = this.$el.selector;
      }
  
      delete this.$el;
      return this;
    },
  
    // Proxy `getOption` to enable getting options from this or this.options by name.
    getOption: Marionette.proxyGetOption,
  
    // import the `triggerMethod` to trigger events with corresponding
    // methods if the method exists
    triggerMethod: Marionette.triggerMethod
  });
  
  // Copy the `extend` function used by Backbone's classes
  Marionette.Region.extend = Marionette.extend;
  
  // Marionette.RegionManager
  // ------------------------
  //
  // Manage one or more related `Marionette.Region` objects.
  Marionette.RegionManager = (function(Marionette) {
  
    var RegionManager = Marionette.Controller.extend({
      constructor: function(options) {
        this._regions = {};
        Marionette.Controller.call(this, options);
      },
  
      // Add multiple regions using an object literal or a
      // function that returns an object literal, where
      // each key becomes the region name, and each value is
      // the region definition.
      addRegions: function(regionDefinitions, defaults) {
        if (_.isFunction(regionDefinitions)) {
          regionDefinitions = regionDefinitions.apply(this, arguments);
        }
  
        var regions = {};
  
        _.each(regionDefinitions, function(definition, name) {
          if (_.isString(definition)) {
            definition = {selector: definition};
          }
  
          if (definition.selector) {
            definition = _.defaults({}, definition, defaults);
          }
  
          var region = this.addRegion(name, definition);
          regions[name] = region;
        }, this);
  
        return regions;
      },
  
      // Add an individual region to the region manager,
      // and return the region instance
      addRegion: function(name, definition) {
        var region;
  
        if (definition instanceof Marionette.Region) {
          region = definition;
        } else {
          region = Marionette.Region.buildRegion(definition, Marionette.Region);
        }
  
        this.triggerMethod('before:add:region', name, region);
  
        this._store(name, region);
  
        this.triggerMethod('add:region', name, region);
        return region;
      },
  
      // Get a region by name
      get: function(name) {
        return this._regions[name];
      },
  
      // Gets all the regions contained within
      // the `regionManager` instance.
      getRegions: function(){
        return _.clone(this._regions);
      },
  
      // Remove a region by name
      removeRegion: function(name) {
        var region = this._regions[name];
        this._remove(name, region);
  
        return region;
      },
  
      // Empty all regions in the region manager, and
      // remove them
      removeRegions: function() {
        var regions = this.getRegions();
        _.each(this._regions, function(region, name) {
          this._remove(name, region);
        }, this);
  
        return regions;
      },
  
      // Empty all regions in the region manager, but
      // leave them attached
      emptyRegions: function() {
        var regions = this.getRegions();
        _.each(regions, function(region) {
          region.empty();
        }, this);
  
        return regions;
      },
  
      // Destroy all regions and shut down the region
      // manager entirely
      destroy: function() {
        this.removeRegions();
        return Marionette.Controller.prototype.destroy.apply(this, arguments);
      },
  
      // internal method to store regions
      _store: function(name, region) {
        this._regions[name] = region;
        this._setLength();
      },
  
      // internal method to remove a region
      _remove: function(name, region) {
        this.triggerMethod('before:remove:region', name, region);
        region.empty();
        region.stopListening();
        delete this._regions[name];
        this._setLength();
        this.triggerMethod('remove:region', name, region);
      },
  
      // set the number of regions current held
      _setLength: function() {
        this.length = _.size(this._regions);
      }
  
    });
  
    Marionette.actAsCollection(RegionManager.prototype, '_regions');
  
    return RegionManager;
  })(Marionette);
  

  // Template Cache
  // --------------
  
  // Manage templates stored in `<script>` blocks,
  // caching them for faster access.
  Marionette.TemplateCache = function(templateId) {
    this.templateId = templateId;
  };
  
  // TemplateCache object-level methods. Manage the template
  // caches from these method calls instead of creating
  // your own TemplateCache instances
  _.extend(Marionette.TemplateCache, {
    templateCaches: {},
  
    // Get the specified template by id. Either
    // retrieves the cached version, or loads it
    // from the DOM.
    get: function(templateId) {
      var cachedTemplate = this.templateCaches[templateId];
  
      if (!cachedTemplate) {
        cachedTemplate = new Marionette.TemplateCache(templateId);
        this.templateCaches[templateId] = cachedTemplate;
      }
  
      return cachedTemplate.load();
    },
  
    // Clear templates from the cache. If no arguments
    // are specified, clears all templates:
    // `clear()`
    //
    // If arguments are specified, clears each of the
    // specified templates from the cache:
    // `clear("#t1", "#t2", "...")`
    clear: function() {
      var i;
      var args = slice.call(arguments);
      var length = args.length;
  
      if (length > 0) {
        for (i = 0; i < length; i++) {
          delete this.templateCaches[args[i]];
        }
      } else {
        this.templateCaches = {};
      }
    }
  });
  
  // TemplateCache instance methods, allowing each
  // template cache object to manage its own state
  // and know whether or not it has been loaded
  _.extend(Marionette.TemplateCache.prototype, {
  
    // Internal method to load the template
    load: function() {
      // Guard clause to prevent loading this template more than once
      if (this.compiledTemplate) {
        return this.compiledTemplate;
      }
  
      // Load the template and compile it
      var template = this.loadTemplate(this.templateId);
      this.compiledTemplate = this.compileTemplate(template);
  
      return this.compiledTemplate;
    },
  
    // Load a template from the DOM, by default. Override
    // this method to provide your own template retrieval
    // For asynchronous loading with AMD/RequireJS, consider
    // using a template-loader plugin as described here:
    // https://github.com/marionettejs/backbone.marionette/wiki/Using-marionette-with-requirejs
    loadTemplate: function(templateId) {
      var template = Backbone.$(templateId).html();
  
      if (!template || template.length === 0) {
        throw new Marionette.Error({
          name: 'NoTemplateError',
          message: 'Could not find template: "' + templateId + '"'
        });
      }
  
      return template;
    },
  
    // Pre-compile the template before caching it. Override
    // this method if you do not need to pre-compile a template
    // (JST / RequireJS for example) or if you want to change
    // the template engine used (Handebars, etc).
    compileTemplate: function(rawTemplate) {
      return _.template(rawTemplate);
    }
  });
  
  // Renderer
  // --------
  
  // Render a template with data by passing in the template
  // selector and the data to render.
  Marionette.Renderer = {
  
    // Render a template with data. The `template` parameter is
    // passed to the `TemplateCache` object to retrieve the
    // template function. Override this method to provide your own
    // custom rendering and template handling for all of Marionette.
    render: function(template, data) {
      if (!template) {
        throw new Marionette.Error({
          name: 'TemplateNotFoundError',
          message: 'Cannot render the template since its false, null or undefined.'
        });
      }
  
      var templateFunc;
      if (typeof template === 'function') {
        templateFunc = template;
      } else {
        templateFunc = Marionette.TemplateCache.get(template);
      }
  
      return templateFunc(data);
    }
  };
  

  /* jshint maxlen: 114, nonew: false */
  // Marionette.View
  // ---------------
  
  // The core view class that other Marionette views extend from.
  Marionette.View = Backbone.View.extend({
  
    constructor: function(options) {
      _.bindAll(this, 'render');
  
      // this exposes view options to the view initializer
      // this is a backfill since backbone removed the assignment
      // of this.options
      // at some point however this may be removed
      this.options = _.extend({}, _.result(this, 'options'), _.isFunction(options) ? options.call(this) : options);
  
      this._behaviors = Marionette.Behaviors(this);
  
      Backbone.View.apply(this, arguments);
  
      Marionette.MonitorDOMRefresh(this);
      this.listenTo(this, 'show', this.onShowCalled);
    },
  
    // Get the template for this view
    // instance. You can set a `template` attribute in the view
    // definition or pass a `template: "whatever"` parameter in
    // to the constructor options.
    getTemplate: function() {
      return this.getOption('template');
    },
  
    // Serialize a model by returning its attributes. Clones
    // the attributes to allow modification.
    serializeModel: function(model){
      return model.toJSON.apply(model, slice.call(arguments, 1));
    },
  
    // Mix in template helper methods. Looks for a
    // `templateHelpers` attribute, which can either be an
    // object literal, or a function that returns an object
    // literal. All methods and attributes from this object
    // are copies to the object passed in.
    mixinTemplateHelpers: function(target) {
      target = target || {};
      var templateHelpers = this.getOption('templateHelpers');
      if (_.isFunction(templateHelpers)) {
        templateHelpers = templateHelpers.call(this);
      }
      return _.extend(target, templateHelpers);
    },
  
    // normalize the keys of passed hash with the views `ui` selectors.
    // `{"@ui.foo": "bar"}`
    normalizeUIKeys: function(hash) {
      var ui = _.result(this, 'ui');
      var uiBindings = _.result(this, '_uiBindings');
      return Marionette.normalizeUIKeys(hash, uiBindings || ui);
    },
  
    // normalize the values of passed hash with the views `ui` selectors.
    // `{foo: "@ui.bar"}`
    normalizeUIValues: function(hash) {
      var ui = _.result(this, 'ui');
      var uiBindings = _.result(this, '_uiBindings');
      return Marionette.normalizeUIValues(hash, uiBindings || ui);
    },
  
    // Configure `triggers` to forward DOM events to view
    // events. `triggers: {"click .foo": "do:foo"}`
    configureTriggers: function() {
      if (!this.triggers) { return; }
  
      var triggerEvents = {};
  
      // Allow `triggers` to be configured as a function
      var triggers = this.normalizeUIKeys(_.result(this, 'triggers'));
  
      // Configure the triggers, prevent default
      // action and stop propagation of DOM events
      _.each(triggers, function(value, key) {
        triggerEvents[key] = this._buildViewTrigger(value);
      }, this);
  
      return triggerEvents;
    },
  
    // Overriding Backbone.View's delegateEvents to handle
    // the `triggers`, `modelEvents`, and `collectionEvents` configuration
    delegateEvents: function(events) {
      this._delegateDOMEvents(events);
      this.bindEntityEvents(this.model, this.getOption('modelEvents'));
      this.bindEntityEvents(this.collection, this.getOption('collectionEvents'));
  
      _.each(this._behaviors, function(behavior) {
        behavior.bindEntityEvents(this.model, behavior.getOption('modelEvents'));
        behavior.bindEntityEvents(this.collection, behavior.getOption('collectionEvents'));
      }, this);
  
      return this;
    },
  
    // internal method to delegate DOM events and triggers
    _delegateDOMEvents: function(eventsArg) {
      var events = eventsArg || this.events;
      if (_.isFunction(events)) { events = events.call(this); }
  
      // normalize ui keys
      events = this.normalizeUIKeys(events);
      if(_.isUndefined(eventsArg)) {this.events = events;}
  
      var combinedEvents = {};
  
      // look up if this view has behavior events
      var behaviorEvents = _.result(this, 'behaviorEvents') || {};
      var triggers = this.configureTriggers();
      var behaviorTriggers = _.result(this, 'behaviorTriggers') || {};
  
      // behavior events will be overriden by view events and or triggers
      _.extend(combinedEvents, behaviorEvents, events, triggers, behaviorTriggers);
  
      Backbone.View.prototype.delegateEvents.call(this, combinedEvents);
    },
  
    // Overriding Backbone.View's undelegateEvents to handle unbinding
    // the `triggers`, `modelEvents`, and `collectionEvents` config
    undelegateEvents: function() {
      var args = slice.call(arguments);
      Backbone.View.prototype.undelegateEvents.apply(this, args);
  
      this.unbindEntityEvents(this.model, this.getOption('modelEvents'));
      this.unbindEntityEvents(this.collection, this.getOption('collectionEvents'));
  
      _.each(this._behaviors, function(behavior) {
        behavior.unbindEntityEvents(this.model, behavior.getOption('modelEvents'));
        behavior.unbindEntityEvents(this.collection, behavior.getOption('collectionEvents'));
      }, this);
  
      return this;
    },
  
    // Internal method, handles the `show` event.
    onShowCalled: function() {},
  
    // Internal helper method to verify whether the view hasn't been destroyed
    _ensureViewIsIntact: function() {
      if (this.isDestroyed) {
        throw new Marionette.Error({
          name: 'ViewDestroyedError',
          message: 'View (cid: "' + this.cid + '") has already been destroyed and cannot be used.'
        });
      }
    },
  
    // Default `destroy` implementation, for removing a view from the
    // DOM and unbinding it. Regions will call this method
    // for you. You can specify an `onDestroy` method in your view to
    // add custom code that is called after the view is destroyed.
    destroy: function() {
      if (this.isDestroyed) { return; }
  
      var args = slice.call(arguments);
  
      this.triggerMethod.apply(this, ['before:destroy'].concat(args));
  
      // mark as destroyed before doing the actual destroy, to
      // prevent infinite loops within "destroy" event handlers
      // that are trying to destroy other views
      this.isDestroyed = true;
      this.triggerMethod.apply(this, ['destroy'].concat(args));
  
      // unbind UI elements
      this.unbindUIElements();
  
      // remove the view from the DOM
      this.remove();
  
      // Call destroy on each behavior after
      // destroying the view.
      // This unbinds event listeners
      // that behaviors have registerd for.
      _.invoke(this._behaviors, 'destroy', args);
  
      return this;
    },
  
    bindUIElements: function() {
      this._bindUIElements();
      _.invoke(this._behaviors, this._bindUIElements);
    },
  
    // This method binds the elements specified in the "ui" hash inside the view's code with
    // the associated jQuery selectors.
    _bindUIElements: function() {
      if (!this.ui) { return; }
  
      // store the ui hash in _uiBindings so they can be reset later
      // and so re-rendering the view will be able to find the bindings
      if (!this._uiBindings) {
        this._uiBindings = this.ui;
      }
  
      // get the bindings result, as a function or otherwise
      var bindings = _.result(this, '_uiBindings');
  
      // empty the ui so we don't have anything to start with
      this.ui = {};
  
      // bind each of the selectors
      _.each(_.keys(bindings), function(key) {
        var selector = bindings[key];
        this.ui[key] = this.$(selector);
      }, this);
    },
  
    // This method unbinds the elements specified in the "ui" hash
    unbindUIElements: function() {
      this._unbindUIElements();
      _.invoke(this._behaviors, this._unbindUIElements);
    },
  
    _unbindUIElements: function() {
      if (!this.ui || !this._uiBindings) { return; }
  
      // delete all of the existing ui bindings
      _.each(this.ui, function($el, name) {
        delete this.ui[name];
      }, this);
  
      // reset the ui element to the original bindings configuration
      this.ui = this._uiBindings;
      delete this._uiBindings;
    },
  
    // Internal method to create an event handler for a given `triggerDef` like
    // 'click:foo'
    _buildViewTrigger: function(triggerDef) {
      var hasOptions = _.isObject(triggerDef);
  
      var options = _.defaults({}, (hasOptions ? triggerDef : {}), {
        preventDefault: true,
        stopPropagation: true
      });
  
      var eventName = hasOptions ? options.event : triggerDef;
  
      return function(e) {
        if (e) {
          if (e.preventDefault && options.preventDefault) {
            e.preventDefault();
          }
  
          if (e.stopPropagation && options.stopPropagation) {
            e.stopPropagation();
          }
        }
  
        var args = {
          view: this,
          model: this.model,
          collection: this.collection
        };
  
        this.triggerMethod(eventName, args);
      };
    },
  
    setElement: function() {
      var ret = Backbone.View.prototype.setElement.apply(this, arguments);
  
      // proxy behavior $el to the view's $el.
      // This is needed because a view's $el proxy
      // is not set until after setElement is called.
      _.invoke(this._behaviors, 'proxyViewProperties', this);
  
      return ret;
    },
  
    // import the `triggerMethod` to trigger events with corresponding
    // methods if the method exists
    triggerMethod: function() {
      var args = arguments;
      var triggerMethod = Marionette.triggerMethod;
  
      var ret = triggerMethod.apply(this, args);
      _.each(this._behaviors, function(b) {
        triggerMethod.apply(b, args);
      });
  
      return ret;
    },
  
    // Imports the "normalizeMethods" to transform hashes of
    // events=>function references/names to a hash of events=>function references
    normalizeMethods: Marionette.normalizeMethods,
  
    // Proxy `getOption` to enable getting options from this or this.options by name.
    getOption: Marionette.proxyGetOption,
  
    // Proxy `unbindEntityEvents` to enable binding view's events from another entity.
    bindEntityEvents: Marionette.proxyBindEntityEvents,
  
    // Proxy `unbindEntityEvents` to enable unbinding view's events from another entity.
    unbindEntityEvents: Marionette.proxyUnbindEntityEvents
  });
  
  // Item View
  // ---------
  
  // A single item view implementation that contains code for rendering
  // with underscore.js templates, serializing the view's model or collection,
  // and calling several methods on extended views, such as `onRender`.
  Marionette.ItemView = Marionette.View.extend({
  
    // Setting up the inheritance chain which allows changes to
    // Marionette.View.prototype.constructor which allows overriding
    constructor: function() {
      Marionette.View.apply(this, arguments);
    },
  
    // Serialize the model or collection for the view. If a model is
    // found, the view's `serializeModel` is called. If a collection is found,
    // each model in the collection is serialized by calling
    // the view's `serializeCollection` and put into an `items` array in
    // the resulting data. If both are found, defaults to the model.
    // You can override the `serializeData` method in your own view definition,
    // to provide custom serialization for your view's data.
    serializeData: function(){
      var data = {};
  
      if (this.model) {
        data = _.partial(this.serializeModel, this.model).apply(this, arguments);
      }
      else if (this.collection) {
        data = { items: _.partial(this.serializeCollection, this.collection).apply(this, arguments) };
      }
  
      return data;
    },
  
    // Serialize a collection by serializing each of its models.
    serializeCollection: function(collection){
      return collection.toJSON.apply(collection, slice.call(arguments, 1));
    },
  
    // Render the view, defaulting to underscore.js templates.
    // You can override this in your view definition to provide
    // a very specific rendering for your view. In general, though,
    // you should override the `Marionette.Renderer` object to
    // change how Marionette renders views.
    render: function() {
      this._ensureViewIsIntact();
  
      this.triggerMethod('before:render', this);
  
      this._renderTemplate();
      this.bindUIElements();
  
      this.triggerMethod('render', this);
  
      return this;
    },
  
    // Internal method to render the template with the serialized data
    // and template helpers via the `Marionette.Renderer` object.
    // Throws an `UndefinedTemplateError` error if the template is
    // any falsely value but literal `false`.
    _renderTemplate: function() {
      var template = this.getTemplate();
  
      // Allow template-less item views
      if (template === false) {
        return;
      }
  
      if (!template) {
        throw new Marionette.Error({
          name: 'UndefinedTemplateError',
          message: 'Cannot render the template since it is null or undefined.'
        });
      }
  
      // Add in entity data and template helpers
      var data = this.serializeData();
      data = this.mixinTemplateHelpers(data);
  
      // Render and add to el
      var html = Marionette.Renderer.render(template, data, this);
      this.attachElContent(html);
  
      return this;
    },
  
    // Attaches the content of a given view.
    // This method can be overridden to optimize rendering,
    // or to render in a non standard way.
    //
    // For example, using `innerHTML` instead of `$el.html`
    //
    // ```js
    // attachElContent: function(html) {
    //   this.el.innerHTML = html;
    //   return this;
    // }
    // ```
    attachElContent: function(html) {
      this.$el.html(html);
  
      return this;
    },
  
    // Override the default destroy event to add a few
    // more events that are triggered.
    destroy: function() {
      if (this.isDestroyed) { return; }
  
      return Marionette.View.prototype.destroy.apply(this, arguments);
    }
  });
  
  /* jshint maxstatements: 14 */
  /* jshint maxlen: 200 */
  
  // Collection View
  // ---------------
  
  // A view that iterates over a Backbone.Collection
  // and renders an individual child view for each model.
  Marionette.CollectionView = Marionette.View.extend({
  
    // used as the prefix for child view events
    // that are forwarded through the collectionview
    childViewEventPrefix: 'childview',
  
    // constructor
    // option to pass `{sort: false}` to prevent the `CollectionView` from
    // maintaining the sorted order of the collection.
    // This will fallback onto appending childView's to the end.
    constructor: function(options){
      var initOptions = options || {};
      this.sort = _.isUndefined(initOptions.sort) ? true : initOptions.sort;
  
      if (initOptions.collection && !(initOptions.collection instanceof Backbone.Collection)) {
        throw new Marionette.Error('The Collection option passed to this view needs to be an instance of a Backbone.Collection');
      }
  
      this.once('render', this._initialEvents);
  
      this._initChildViewStorage();
  
      Marionette.View.apply(this, arguments);
  
      this.initRenderBuffer();
    },
  
    // Instead of inserting elements one by one into the page,
    // it's much more performant to insert elements into a document
    // fragment and then insert that document fragment into the page
    initRenderBuffer: function() {
      this.elBuffer = document.createDocumentFragment();
      this._bufferedChildren = [];
    },
  
    startBuffering: function() {
      this.initRenderBuffer();
      this.isBuffering = true;
    },
  
    endBuffering: function() {
      this.isBuffering = false;
      this._triggerBeforeShowBufferedChildren();
      this.attachBuffer(this, this.elBuffer);
      this._triggerShowBufferedChildren();
      this.initRenderBuffer();
    },
  
    _triggerBeforeShowBufferedChildren: function() {
      if (this._isShown) {
        _.each(this._bufferedChildren, _.partial(this._triggerMethodOnChild, 'before:show'));
      }
    },
  
    _triggerShowBufferedChildren: function() {
      if (this._isShown) {
        _.each(this._bufferedChildren, _.partial(this._triggerMethodOnChild, 'show'));
  
        this._bufferedChildren = [];
      }
    },
  
    // Internal method for _.each loops to call `Marionette.triggerMethodOn` on
    // a child view
    _triggerMethodOnChild: function(event, childView) {
      Marionette.triggerMethodOn(childView, event);
    },
  
    // Configured the initial events that the collection view
    // binds to.
    _initialEvents: function() {
      if (this.collection) {
        this.listenTo(this.collection, 'add', this._onCollectionAdd);
        this.listenTo(this.collection, 'remove', this._onCollectionRemove);
        this.listenTo(this.collection, 'reset', this.render);
  
        if (this.sort) {
          this.listenTo(this.collection, 'sort', this._sortViews);
        }
      }
    },
  
    // Handle a child added to the collection
    _onCollectionAdd: function(child) {
      this.destroyEmptyView();
      var ChildView = this.getChildView(child);
      var index = this.collection.indexOf(child);
      this.addChild(child, ChildView, index);
    },
  
    // get the child view by model it holds, and remove it
    _onCollectionRemove: function(model) {
      var view = this.children.findByModel(model);
      this.removeChildView(view);
      this.checkEmpty();
    },
  
    // Override from `Marionette.View` to trigger show on child views
    onShowCalled: function() {
      this.children.each(_.partial(this._triggerMethodOnChild, 'show'));
    },
  
    // Render children views. Override this method to
    // provide your own implementation of a render function for
    // the collection view.
    render: function() {
      this._ensureViewIsIntact();
      this.triggerMethod('before:render', this);
      this._renderChildren();
      this.triggerMethod('render', this);
      return this;
    },
  
    // Render view after sorting. Override this method to
    // change how the view renders after a `sort` on the collection.
    // An example of this would be to only `renderChildren` in a `CompositeView`
    // rather than the full view.
    resortView: function() {
      this.render();
    },
  
    // Internal method. This checks for any changes in the order of the collection.
    // If the index of any view doesn't match, it will render.
    _sortViews: function() {
      // check for any changes in sort order of views
      var orderChanged = this.collection.find(function(item, index){
        var view = this.children.findByModel(item);
        return !view || view._index !== index;
      }, this);
  
      if (orderChanged) {
        this.resortView();
      }
    },
  
    // Internal method. Separated so that CompositeView can have
    // more control over events being triggered, around the rendering
    // process
    _renderChildren: function() {
      this.destroyEmptyView();
      this.destroyChildren();
  
      if (this.isEmpty(this.collection)) {
        this.showEmptyView();
      } else {
        this.triggerMethod('before:render:collection', this);
        this.startBuffering();
        this.showCollection();
        this.endBuffering();
        this.triggerMethod('render:collection', this);
      }
    },
  
    // Internal method to loop through collection and show each child view.
    showCollection: function() {
      var ChildView;
      this.collection.each(function(child, index) {
        ChildView = this.getChildView(child);
        this.addChild(child, ChildView, index);
      }, this);
    },
  
    // Internal method to show an empty view in place of
    // a collection of child views, when the collection is empty
    showEmptyView: function() {
      var EmptyView = this.getEmptyView();
  
      if (EmptyView && !this._showingEmptyView) {
        this.triggerMethod('before:render:empty');
  
        this._showingEmptyView = true;
        var model = new Backbone.Model();
        this.addEmptyView(model, EmptyView);
  
        this.triggerMethod('render:empty');
      }
    },
  
    // Internal method to destroy an existing emptyView instance
    // if one exists. Called when a collection view has been
    // rendered empty, and then a child is added to the collection.
    destroyEmptyView: function() {
      if (this._showingEmptyView) {
        this.triggerMethod('before:remove:empty');
  
        this.destroyChildren();
        delete this._showingEmptyView;
  
        this.triggerMethod('remove:empty');
      }
    },
  
    // Retrieve the empty view class
    getEmptyView: function() {
      return this.getOption('emptyView');
    },
  
    // Render and show the emptyView. Similar to addChild method
    // but "child:added" events are not fired, and the event from
    // emptyView are not forwarded
    addEmptyView: function(child, EmptyView) {
  
      // get the emptyViewOptions, falling back to childViewOptions
      var emptyViewOptions = this.getOption('emptyViewOptions') ||
                            this.getOption('childViewOptions');
  
      if (_.isFunction(emptyViewOptions)){
        emptyViewOptions = emptyViewOptions.call(this);
      }
  
      // build the empty view
      var view = this.buildChildView(child, EmptyView, emptyViewOptions);
  
      // Proxy emptyView events
      this.proxyChildEvents(view);
  
      // trigger the 'before:show' event on `view` if the collection view
      // has already been shown
      if (this._isShown) {
        Marionette.triggerMethodOn(view, 'before:show');
      }
  
      // Store the `emptyView` like a `childView` so we can properly
      // remove and/or close it later
      this.children.add(view);
  
      // Render it and show it
      this.renderChildView(view, -1);
  
      // call the 'show' method if the collection view
      // has already been shown
      if (this._isShown) {
        Marionette.triggerMethodOn(view, 'show');
      }
    },
  
    // Retrieve the `childView` class, either from `this.options.childView`
    // or from the `childView` in the object definition. The "options"
    // takes precedence.
    // This method receives the model that will be passed to the instance
    // created from this `childView`. Overriding methods may use the child
    // to determine what `childView` class to return.
    getChildView: function(child) {
      var childView = this.getOption('childView');
  
      if (!childView) {
        throw new Marionette.Error({
          name: 'NoChildViewError',
          message: 'A "childView" must be specified'
        });
      }
  
      return childView;
    },
  
    // Render the child's view and add it to the
    // HTML for the collection view at a given index.
    // This will also update the indices of later views in the collection
    // in order to keep the children in sync with the collection.
    addChild: function(child, ChildView, index) {
      var childViewOptions = this.getOption('childViewOptions');
      if (_.isFunction(childViewOptions)) {
        childViewOptions = childViewOptions.call(this, child, index);
      }
  
      var view = this.buildChildView(child, ChildView, childViewOptions);
  
      // increment indices of views after this one
      this._updateIndices(view, true, index);
  
      this._addChildView(view, index);
  
      return view;
    },
  
    // Internal method. This decrements or increments the indices of views after the
    // added/removed view to keep in sync with the collection.
    _updateIndices: function(view, increment, index) {
      if (!this.sort) {
        return;
      }
  
      if (increment) {
        // assign the index to the view
        view._index = index;
  
        // increment the index of views after this one
        this.children.each(function (laterView) {
          if (laterView._index >= view._index) {
            laterView._index++;
          }
        });
      }
      else {
        // decrement the index of views after this one
        this.children.each(function (laterView) {
          if (laterView._index >= view._index) {
            laterView._index--;
          }
        });
      }
    },
  
  
    // Internal Method. Add the view to children and render it at
    // the given index.
    _addChildView: function(view, index) {
      // set up the child view event forwarding
      this.proxyChildEvents(view);
  
      this.triggerMethod('before:add:child', view);
  
      // Store the child view itself so we can properly
      // remove and/or destroy it later
      this.children.add(view);
      this.renderChildView(view, index);
  
      if (this._isShown && !this.isBuffering) {
        Marionette.triggerMethodOn(view, 'show');
      }
  
      this.triggerMethod('add:child', view);
    },
  
    // render the child view
    renderChildView: function(view, index) {
      view.render();
      this.attachHtml(this, view, index);
      return view;
    },
  
    // Build a `childView` for a model in the collection.
    buildChildView: function(child, ChildViewClass, childViewOptions) {
      var options = _.extend({model: child}, childViewOptions);
      return new ChildViewClass(options);
    },
  
    // Remove the child view and destroy it.
    // This function also updates the indices of
    // later views in the collection in order to keep
    // the children in sync with the collection.
    removeChildView: function(view) {
  
      if (view) {
        this.triggerMethod('before:remove:child', view);
        // call 'destroy' or 'remove', depending on which is found
        if (view.destroy) { view.destroy(); }
        else if (view.remove) { view.remove(); }
  
        this.stopListening(view);
        this.children.remove(view);
        this.triggerMethod('remove:child', view);
  
        // decrement the index of views after this one
        this._updateIndices(view, false);
      }
  
      return view;
    },
  
    // check if the collection is empty
    isEmpty: function() {
      return !this.collection || this.collection.length === 0;
    },
  
    // If empty, show the empty view
    checkEmpty: function() {
      if (this.isEmpty(this.collection)) {
        this.showEmptyView();
      }
    },
  
    // You might need to override this if you've overridden attachHtml
    attachBuffer: function(collectionView, buffer) {
      collectionView.$el.append(buffer);
    },
  
    // Append the HTML to the collection's `el`.
    // Override this method to do something other
    // than `.append`.
    attachHtml: function(collectionView, childView, index) {
      if (collectionView.isBuffering) {
        // buffering happens on reset events and initial renders
        // in order to reduce the number of inserts into the
        // document, which are expensive.
        collectionView.elBuffer.appendChild(childView.el);
        collectionView._bufferedChildren.push(childView);
      }
      else {
        // If we've already rendered the main collection, append
        // the new child into the correct order if we need to. Otherwise
        // append to the end.
        if (!collectionView._insertBefore(childView, index)){
          collectionView._insertAfter(childView);
        }
      }
    },
  
    // Internal method. Check whether we need to insert the view into
    // the correct position.
    _insertBefore: function(childView, index) {
      var currentView;
      var findPosition = this.sort && (index < this.children.length - 1);
      if (findPosition) {
        // Find the view after this one
        currentView = this.children.find(function (view) {
          return view._index === index + 1;
        });
      }
  
      if (currentView) {
        currentView.$el.before(childView.el);
        return true;
      }
  
      return false;
    },
  
    // Internal method. Append a view to the end of the $el
    _insertAfter: function(childView) {
      this.$el.append(childView.el);
    },
  
    // Internal method to set up the `children` object for
    // storing all of the child views
    _initChildViewStorage: function() {
      this.children = new Backbone.ChildViewContainer();
    },
  
    // Handle cleanup and other destroying needs for the collection of views
    destroy: function() {
      if (this.isDestroyed) { return; }
  
      this.triggerMethod('before:destroy:collection');
      this.destroyChildren();
      this.triggerMethod('destroy:collection');
  
      return Marionette.View.prototype.destroy.apply(this, arguments);
    },
  
    // Destroy the child views that this collection view
    // is holding on to, if any
    destroyChildren: function() {
      var childViews = this.children.map(_.identity);
      this.children.each(this.removeChildView, this);
      this.checkEmpty();
      return childViews;
    },
  
    // Set up the child view event forwarding. Uses a "childview:"
    // prefix in front of all forwarded events.
    proxyChildEvents: function(view) {
      var prefix = this.getOption('childViewEventPrefix');
  
      // Forward all child view events through the parent,
      // prepending "childview:" to the event name
      this.listenTo(view, 'all', function() {
        var args = slice.call(arguments);
        var rootEvent = args[0];
        var childEvents = this.normalizeMethods(_.result(this, 'childEvents'));
  
        args[0] = prefix + ':' + rootEvent;
        args.splice(1, 0, view);
  
        // call collectionView childEvent if defined
        if (typeof childEvents !== 'undefined' && _.isFunction(childEvents[rootEvent])) {
          childEvents[rootEvent].apply(this, args.slice(1));
        }
  
        this.triggerMethod.apply(this, args);
      }, this);
    }
  });
  
  /* jshint maxstatements: 17, maxlen: 117 */
  
  // Composite View
  // --------------
  
  // Used for rendering a branch-leaf, hierarchical structure.
  // Extends directly from CollectionView and also renders an
  // a child view as `modelView`, for the top leaf
  Marionette.CompositeView = Marionette.CollectionView.extend({
  
    // Setting up the inheritance chain which allows changes to
    // Marionette.CollectionView.prototype.constructor which allows overriding
    // option to pass '{sort: false}' to prevent the CompositeView from
    // maintaining the sorted order of the collection.
    // This will fallback onto appending childView's to the end.
    constructor: function() {
      Marionette.CollectionView.apply(this, arguments);
    },
  
    // Configured the initial events that the composite view
    // binds to. Override this method to prevent the initial
    // events, or to add your own initial events.
    _initialEvents: function() {
  
      // Bind only after composite view is rendered to avoid adding child views
      // to nonexistent childViewContainer
  
      if (this.collection) {
        this.listenTo(this.collection, 'add', this._onCollectionAdd);
        this.listenTo(this.collection, 'remove', this._onCollectionRemove);
        this.listenTo(this.collection, 'reset', this._renderChildren);
  
        if (this.sort) {
          this.listenTo(this.collection, 'sort', this._sortViews);
        }
      }
    },
  
    // Retrieve the `childView` to be used when rendering each of
    // the items in the collection. The default is to return
    // `this.childView` or Marionette.CompositeView if no `childView`
    // has been defined
    getChildView: function(child) {
      var childView = this.getOption('childView') || this.constructor;
  
      if (!childView) {
        throw new Marionette.Error({
          name: 'NoChildViewError',
          message: 'A "childView" must be specified'
        });
      }
  
      return childView;
    },
  
    // Serialize the collection for the view.
    // You can override the `serializeData` method in your own view
    // definition, to provide custom serialization for your view's data.
    serializeData: function() {
      var data = {};
  
      if (this.model){
        data = _.partial(this.serializeModel, this.model).apply(this, arguments);
      }
  
      return data;
    },
  
    // Renders the model once, and the collection once. Calling
    // this again will tell the model's view to re-render itself
    // but the collection will not re-render.
    render: function() {
      this._ensureViewIsIntact();
      this.isRendered = true;
      this.resetChildViewContainer();
  
      this.triggerMethod('before:render', this);
  
      this._renderTemplate();
      this._renderChildren();
  
      this.triggerMethod('render', this);
      return this;
    },
  
    _renderChildren: function() {
      if (this.isRendered) {
        Marionette.CollectionView.prototype._renderChildren.call(this);
      }
    },
  
    // Render the root template that the children
    // views are appended to
    _renderTemplate: function() {
      var data = {};
      data = this.serializeData();
      data = this.mixinTemplateHelpers(data);
  
      this.triggerMethod('before:render:template');
  
      var template = this.getTemplate();
      var html = Marionette.Renderer.render(template, data, this);
      this.attachElContent(html);
  
      // the ui bindings is done here and not at the end of render since they
      // will not be available until after the model is rendered, but should be
      // available before the collection is rendered.
      this.bindUIElements();
      this.triggerMethod('render:template');
    },
  
    // Attaches the content of the root.
    // This method can be overridden to optimize rendering,
    // or to render in a non standard way.
    //
    // For example, using `innerHTML` instead of `$el.html`
    //
    // ```js
    // attachElContent: function(html) {
    //   this.el.innerHTML = html;
    //   return this;
    // }
    // ```
    attachElContent: function(html) {
      this.$el.html(html);
  
      return this;
    },
  
    // You might need to override this if you've overridden attachHtml
    attachBuffer: function(compositeView, buffer) {
      var $container = this.getChildViewContainer(compositeView);
      $container.append(buffer);
    },
  
    // Internal method. Append a view to the end of the $el.
    // Overidden from CollectionView to ensure view is appended to
    // childViewContainer
    _insertAfter: function (childView) {
      var $container = this.getChildViewContainer(this);
      $container.append(childView.el);
    },
  
    // Internal method to ensure an `$childViewContainer` exists, for the
    // `attachHtml` method to use.
    getChildViewContainer: function(containerView) {
      if ('$childViewContainer' in containerView) {
        return containerView.$childViewContainer;
      }
  
      var container;
      var childViewContainer = Marionette.getOption(containerView, 'childViewContainer');
      if (childViewContainer) {
  
        var selector = _.isFunction(childViewContainer) ? childViewContainer.call(containerView) : childViewContainer;
  
        if (selector.charAt(0) === '@' && containerView.ui) {
          container = containerView.ui[selector.substr(4)];
        } else {
          container = containerView.$(selector);
        }
  
        if (container.length <= 0) {
          throw new Marionette.Error({
            name: 'ChildViewContainerMissingError',
            message: 'The specified "childViewContainer" was not found: ' + containerView.childViewContainer
          });
        }
  
      } else {
        container = containerView.$el;
      }
  
      containerView.$childViewContainer = container;
      return container;
    },
  
    // Internal method to reset the `$childViewContainer` on render
    resetChildViewContainer: function() {
      if (this.$childViewContainer) {
        delete this.$childViewContainer;
      }
    }
  });
  
  // LayoutView
  // ----------
  
  // Used for managing application layoutViews, nested layoutViews and
  // multiple regions within an application or sub-application.
  //
  // A specialized view class that renders an area of HTML and then
  // attaches `Region` instances to the specified `regions`.
  // Used for composite view management and sub-application areas.
  Marionette.LayoutView = Marionette.ItemView.extend({
    regionClass: Marionette.Region,
  
    // Ensure the regions are available when the `initialize` method
    // is called.
    constructor: function(options) {
      options = options || {};
  
      this._firstRender = true;
      this._initializeRegions(options);
  
      Marionette.ItemView.call(this, options);
    },
  
    // LayoutView's render will use the existing region objects the
    // first time it is called. Subsequent calls will destroy the
    // views that the regions are showing and then reset the `el`
    // for the regions to the newly rendered DOM elements.
    render: function() {
      this._ensureViewIsIntact();
  
      if (this._firstRender) {
        // if this is the first render, don't do anything to
        // reset the regions
        this._firstRender = false;
      } else {
        // If this is not the first render call, then we need to
        // re-initialize the `el` for each region
        this._reInitializeRegions();
      }
  
      return Marionette.ItemView.prototype.render.apply(this, arguments);
    },
  
    // Handle destroying regions, and then destroy the view itself.
    destroy: function() {
      if (this.isDestroyed) { return this; }
  
      this.regionManager.destroy();
      return Marionette.ItemView.prototype.destroy.apply(this, arguments);
    },
  
    // Add a single region, by name, to the layoutView
    addRegion: function(name, definition) {
      this.triggerMethod('before:region:add', name);
      var regions = {};
      regions[name] = definition;
      return this._buildRegions(regions)[name];
    },
  
    // Add multiple regions as a {name: definition, name2: def2} object literal
    addRegions: function(regions) {
      this.regions = _.extend({}, this.regions, regions);
      return this._buildRegions(regions);
    },
  
    // Remove a single region from the LayoutView, by name
    removeRegion: function(name) {
      this.triggerMethod('before:region:remove', name);
      delete this.regions[name];
      return this.regionManager.removeRegion(name);
    },
  
    // Provides alternative access to regions
    // Accepts the region name
    // getRegion('main')
    getRegion: function(region) {
      return this.regionManager.get(region);
    },
  
    // Get all regions
    getRegions: function(){
      return this.regionManager.getRegions();
    },
  
    // internal method to build regions
    _buildRegions: function(regions) {
      var that = this;
  
      var defaults = {
        regionClass: this.getOption('regionClass'),
        parentEl: function() { return that.$el; }
      };
  
      return this.regionManager.addRegions(regions, defaults);
    },
  
    // Internal method to initialize the regions that have been defined in a
    // `regions` attribute on this layoutView.
    _initializeRegions: function(options) {
      var regions;
      this._initRegionManager();
  
      if (_.isFunction(this.regions)) {
        regions = this.regions(options);
      } else {
        regions = this.regions || {};
      }
  
      // Enable users to define `regions` as instance options.
      var regionOptions = this.getOption.call(options, 'regions');
  
      // enable region options to be a function
      if (_.isFunction(regionOptions)) {
        regionOptions = regionOptions.call(this, options);
      }
  
      _.extend(regions, regionOptions);
  
      // Normalize region selectors hash to allow
      // a user to use the @ui. syntax.
      regions = this.normalizeUIValues(regions);
  
      this.addRegions(regions);
    },
  
    // Internal method to re-initialize all of the regions by updating the `el` that
    // they point to
    _reInitializeRegions: function() {
      this.regionManager.emptyRegions();
      this.regionManager.each(function(region) {
        region.reset();
      });
    },
  
    // Enable easy overriding of the default `RegionManager`
    // for customized region interactions and business specific
    // view logic for better control over single regions.
    getRegionManager: function() {
      return new Marionette.RegionManager();
    },
  
    // Internal method to initialize the region manager
    // and all regions in it
    _initRegionManager: function() {
      this.regionManager = this.getRegionManager();
  
      this.listenTo(this.regionManager, 'before:add:region', function(name) {
        this.triggerMethod('before:add:region', name);
      });
  
      this.listenTo(this.regionManager, 'add:region', function(name, region) {
        this[name] = region;
        this.triggerMethod('add:region', name, region);
      });
  
      this.listenTo(this.regionManager, 'before:remove:region', function(name) {
        this.triggerMethod('before:remove:region', name);
      });
  
      this.listenTo(this.regionManager, 'remove:region', function(name, region) {
        delete this[name];
        this.triggerMethod('remove:region', name, region);
      });
    }
  });
  

  // Behavior
  // -----------
  
  // A Behavior is an isolated set of DOM /
  // user interactions that can be mixed into any View.
  // Behaviors allow you to blackbox View specific interactions
  // into portable logical chunks, keeping your views simple and your code DRY.
  
  Marionette.Behavior = (function(_, Backbone) {
    function Behavior(options, view) {
      // Setup reference to the view.
      // this comes in handle when a behavior
      // wants to directly talk up the chain
      // to the view.
      this.view = view;
      this.defaults = _.result(this, 'defaults') || {};
      this.options  = _.extend({}, this.defaults, options);
  
      // proxy behavior $ method to the view
      // this is useful for doing jquery DOM lookups
      // scoped to behaviors view.
      this.$ = function() {
        return this.view.$.apply(this.view, arguments);
      };
  
      // Call the initialize method passing
      // the arguments from the instance constructor
      this.initialize.apply(this, arguments);
    }
  
    _.extend(Behavior.prototype, Backbone.Events, {
      initialize: function() {},
  
      // stopListening to behavior `onListen` events.
      destroy: function() {
        this.stopListening();
      },
  
      proxyViewProperties: function (view) {
        this.$el = view.$el;
        this.el = view.el;
      },
  
      // import the `triggerMethod` to trigger events with corresponding
      // methods if the method exists
      triggerMethod: Marionette.triggerMethod,
  
      // Proxy `getOption` to enable getting options from this or this.options by name.
      getOption: Marionette.proxyGetOption,
  
      // Proxy `unbindEntityEvents` to enable binding view's events from another entity.
      bindEntityEvents: Marionette.proxyBindEntityEvents,
  
      // Proxy `unbindEntityEvents` to enable unbinding view's events from another entity.
      unbindEntityEvents: Marionette.proxyUnbindEntityEvents
    });
  
    // Borrow Backbones extend implementation
    // this allows us to setup a proper
    // inheritance pattern that follows suit
    // with the rest of Marionette views.
    Behavior.extend = Marionette.extend;
  
    return Behavior;
  })(_, Backbone);
  
  /* jshint maxlen: 143 */
  // Marionette.Behaviors
  // --------
  
  // Behaviors is a utility class that takes care of
  // gluing your behavior instances to their given View.
  // The most important part of this class is that you
  // **MUST** override the class level behaviorsLookup
  // method for things to work properly.
  
  Marionette.Behaviors = (function(Marionette, _) {
  
    function Behaviors(view, behaviors) {
  
      if (!_.isObject(view.behaviors)) {
        return {};
      }
  
      // Behaviors defined on a view can be a flat object literal
      // or it can be a function that returns an object.
      behaviors = Behaviors.parseBehaviors(view, behaviors || _.result(view, 'behaviors'));
  
      // Wraps several of the view's methods
      // calling the methods first on each behavior
      // and then eventually calling the method on the view.
      Behaviors.wrap(view, behaviors, _.keys(methods));
      return behaviors;
    }
  
    var methods = {
      behaviorTriggers: function(behaviorTriggers, behaviors) {
        var triggerBuilder = new BehaviorTriggersBuilder(this, behaviors);
        return triggerBuilder.buildBehaviorTriggers();
      },
  
      behaviorEvents: function(behaviorEvents, behaviors) {
        var _behaviorsEvents = {};
        var viewUI = _.result(this, 'ui');
  
        _.each(behaviors, function(b, i) {
          var _events = {};
          var behaviorEvents = _.clone(_.result(b, 'events')) || {};
          var behaviorUI = _.result(b, 'ui');
  
          // Construct an internal UI hash first using
          // the views UI hash and then the behaviors UI hash.
          // This allows the user to use UI hash elements
          // defined in the parent view as well as those
          // defined in the given behavior.
          var ui = _.extend({}, viewUI, behaviorUI);
  
          // Normalize behavior events hash to allow
          // a user to use the @ui. syntax.
          behaviorEvents = Marionette.normalizeUIKeys(behaviorEvents, ui);
  
          _.each(_.keys(behaviorEvents), function(key) {
            // Append white-space at the end of each key to prevent behavior key collisions.
            // This is relying on the fact that backbone events considers "click .foo" the same as
            // "click .foo ".
  
            // +2 is used because new Array(1) or 0 is "" and not " "
            var whitespace = (new Array(i + 2)).join(' ');
            var eventKey   = key + whitespace;
            var handler    = _.isFunction(behaviorEvents[key]) ? behaviorEvents[key] : b[behaviorEvents[key]];
  
            _events[eventKey] = _.bind(handler, b);
          });
  
          _behaviorsEvents = _.extend(_behaviorsEvents, _events);
        });
  
        return _behaviorsEvents;
      }
    };
  
    _.extend(Behaviors, {
  
      // Placeholder method to be extended by the user.
      // The method should define the object that stores the behaviors.
      // i.e.
      //
      // ```js
      // Marionette.Behaviors.behaviorsLookup: function() {
      //   return App.Behaviors
      // }
      // ```
      behaviorsLookup: function() {
        throw new Marionette.Error({
          message: 'You must define where your behaviors are stored.',
          url: 'marionette.behaviors.html#behaviorslookup'
        });
      },
  
      // Takes care of getting the behavior class
      // given options and a key.
      // If a user passes in options.behaviorClass
      // default to using that. Otherwise delegate
      // the lookup to the users `behaviorsLookup` implementation.
      getBehaviorClass: function(options, key) {
        if (options.behaviorClass) {
          return options.behaviorClass;
        }
  
        // Get behavior class can be either a flat object or a method
        return _.isFunction(Behaviors.behaviorsLookup) ? Behaviors.behaviorsLookup.apply(this, arguments)[key] : Behaviors.behaviorsLookup[key];
      },
  
      // Iterate over the behaviors object, for each behavior
      // instantiate it and get its grouped behaviors.
      parseBehaviors: function(view, behaviors) {
        return _.chain(behaviors).map(function(options, key) {
          var BehaviorClass = Behaviors.getBehaviorClass(options, key);
  
          var behavior = new BehaviorClass(options, view);
          var nestedBehaviors = Behaviors.parseBehaviors(view, _.result(behavior, 'behaviors'));
  
          return [behavior].concat(nestedBehaviors);
        }).flatten().value();
      },
  
      // Wrap view internal methods so that they delegate to behaviors. For example,
      // `onDestroy` should trigger destroy on all of the behaviors and then destroy itself.
      // i.e.
      //
      // `view.delegateEvents = _.partial(methods.delegateEvents, view.delegateEvents, behaviors);`
      wrap: function(view, behaviors, methodNames) {
        _.each(methodNames, function(methodName) {
          view[methodName] = _.partial(methods[methodName], view[methodName], behaviors);
        });
      }
    });
  
    // Class to build handlers for `triggers` on behaviors
    // for views
    function BehaviorTriggersBuilder(view, behaviors) {
      this._view      = view;
      this._viewUI    = _.result(view, 'ui');
      this._behaviors = behaviors;
      this._triggers  = {};
    }
  
    _.extend(BehaviorTriggersBuilder.prototype, {
      // Main method to build the triggers hash with event keys and handlers
      buildBehaviorTriggers: function() {
        _.each(this._behaviors, this._buildTriggerHandlersForBehavior, this);
        return this._triggers;
      },
  
      // Internal method to build all trigger handlers for a given behavior
      _buildTriggerHandlersForBehavior: function(behavior, i) {
        var ui = _.extend({}, this._viewUI, _.result(behavior, 'ui'));
        var triggersHash = _.clone(_.result(behavior, 'triggers')) || {};
  
        triggersHash = Marionette.normalizeUIKeys(triggersHash, ui);
  
        _.each(triggersHash, _.partial(this._setHandlerForBehavior, behavior, i), this);
      },
  
      // Internal method to create and assign the trigger handler for a given
      // behavior
      _setHandlerForBehavior: function(behavior, i, eventName, trigger) {
        // Unique identifier for the `this._triggers` hash
        var triggerKey = trigger.replace(/^\S+/, function(triggerName) {
          return triggerName + '.' + 'behaviortriggers' + i;
        });
  
        this._triggers[triggerKey] = this._view._buildViewTrigger(eventName);
      }
    });
  
    return Behaviors;
  
  })(Marionette, _);
  

  // AppRouter
  // ---------
  
  // Reduce the boilerplate code of handling route events
  // and then calling a single method on another object.
  // Have your routers configured to call the method on
  // your object, directly.
  //
  // Configure an AppRouter with `appRoutes`.
  //
  // App routers can only take one `controller` object.
  // It is recommended that you divide your controller
  // objects in to smaller pieces of related functionality
  // and have multiple routers / controllers, instead of
  // just one giant router and controller.
  //
  // You can also add standard routes to an AppRouter.
  
  Marionette.AppRouter = Backbone.Router.extend({
  
    constructor: function(options) {
      Backbone.Router.apply(this, arguments);
  
      this.options = options || {};
  
      var appRoutes = this.getOption('appRoutes');
      var controller = this._getController();
      this.processAppRoutes(controller, appRoutes);
      this.on('route', this._processOnRoute, this);
    },
  
    // Similar to route method on a Backbone Router but
    // method is called on the controller
    appRoute: function(route, methodName) {
      var controller = this._getController();
      this._addAppRoute(controller, route, methodName);
    },
  
    // process the route event and trigger the onRoute
    // method call, if it exists
    _processOnRoute: function(routeName, routeArgs) {
      // find the path that matched
      var routePath = _.invert(this.getOption('appRoutes'))[routeName];
  
      // make sure an onRoute is there, and call it
      if (_.isFunction(this.onRoute)) {
        this.onRoute(routeName, routePath, routeArgs);
      }
    },
  
    // Internal method to process the `appRoutes` for the
    // router, and turn them in to routes that trigger the
    // specified method on the specified `controller`.
    processAppRoutes: function(controller, appRoutes) {
      if (!appRoutes) { return; }
  
      var routeNames = _.keys(appRoutes).reverse(); // Backbone requires reverted order of routes
  
      _.each(routeNames, function(route) {
        this._addAppRoute(controller, route, appRoutes[route]);
      }, this);
    },
  
    _getController: function() {
      return this.getOption('controller');
    },
  
    _addAppRoute: function(controller, route, methodName) {
      var method = controller[methodName];
  
      if (!method) {
        throw new Marionette.Error('Method "' + methodName + '" was not found on the controller');
      }
  
      this.route(route, methodName, _.bind(method, controller));
    },
  
    // Proxy `getOption` to enable getting options from this or this.options by name.
    getOption: Marionette.proxyGetOption
  });
  
  // Application
  // -----------
  
  // Contain and manage the composite application as a whole.
  // Stores and starts up `Region` objects, includes an
  // event aggregator as `app.vent`
  Marionette.Application = function(options) {
    this.options = options;
    this._initializeRegions(options);
    this._initCallbacks = new Marionette.Callbacks();
    this.submodules = {};
    _.extend(this, options);
    this._initChannel();
    this.initialize.apply(this, arguments);
  };
  
  _.extend(Marionette.Application.prototype, Backbone.Events, {
    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function() {},
  
    // Command execution, facilitated by Backbone.Wreqr.Commands
    execute: function() {
      this.commands.execute.apply(this.commands, arguments);
    },
  
    // Request/response, facilitated by Backbone.Wreqr.RequestResponse
    request: function() {
      return this.reqres.request.apply(this.reqres, arguments);
    },
  
    // Add an initializer that is either run at when the `start`
    // method is called, or run immediately if added after `start`
    // has already been called.
    addInitializer: function(initializer) {
      this._initCallbacks.add(initializer);
    },
  
    // kick off all of the application's processes.
    // initializes all of the regions that have been added
    // to the app, and runs all of the initializer functions
    start: function(options) {
      this.triggerMethod('before:start', options);
      this._initCallbacks.run(options, this);
      this.triggerMethod('start', options);
    },
  
    // Add regions to your app.
    // Accepts a hash of named strings or Region objects
    // addRegions({something: "#someRegion"})
    // addRegions({something: Region.extend({el: "#someRegion"}) });
    addRegions: function(regions) {
      return this._regionManager.addRegions(regions);
    },
  
    // Empty all regions in the app, without removing them
    emptyRegions: function() {
      return this._regionManager.emptyRegions();
    },
  
    // Removes a region from your app, by name
    // Accepts the regions name
    // removeRegion('myRegion')
    removeRegion: function(region) {
      return this._regionManager.removeRegion(region);
    },
  
    // Provides alternative access to regions
    // Accepts the region name
    // getRegion('main')
    getRegion: function(region) {
      return this._regionManager.get(region);
    },
  
    // Get all the regions from the region manager
    getRegions: function(){
      return this._regionManager.getRegions();
    },
  
    // Create a module, attached to the application
    module: function(moduleNames, moduleDefinition) {
  
      // Overwrite the module class if the user specifies one
      var ModuleClass = Marionette.Module.getClass(moduleDefinition);
  
      // slice the args, and add this application object as the
      // first argument of the array
      var args = slice.call(arguments);
      args.unshift(this);
  
      // see the Marionette.Module object for more information
      return ModuleClass.create.apply(ModuleClass, args);
    },
  
    // Enable easy overriding of the default `RegionManager`
    // for customized region interactions and business-specific
    // view logic for better control over single regions.
    getRegionManager: function() {
      return new Marionette.RegionManager();
    },
  
    // Internal method to initialize the regions that have been defined in a
    // `regions` attribute on the application instance
    _initializeRegions: function(options) {
      var regions = _.isFunction(this.regions) ? this.regions(options) : this.regions || {};
  
      this._initRegionManager();
  
      // Enable users to define `regions` in instance options.
      var optionRegions = Marionette.getOption(options, 'regions');
  
      // Enable region options to be a function
      if (_.isFunction(optionRegions)) {
        optionRegions = optionRegions.call(this, options);
      }
  
      // Overwrite current regions with those passed in options
      _.extend(regions, optionRegions);
  
      this.addRegions(regions);
  
      return this;
    },
  
    // Internal method to set up the region manager
    _initRegionManager: function() {
      this._regionManager = this.getRegionManager();
  
      this.listenTo(this._regionManager, 'before:add:region', function(name) {
        this.triggerMethod('before:add:region', name);
      });
  
      this.listenTo(this._regionManager, 'add:region', function(name, region) {
        this[name] = region;
        this.triggerMethod('add:region', name, region);
      });
  
      this.listenTo(this._regionManager, 'before:remove:region', function(name) {
        this.triggerMethod('before:remove:region', name);
      });
  
      this.listenTo(this._regionManager, 'remove:region', function(name, region) {
        delete this[name];
        this.triggerMethod('remove:region', name, region);
      });
    },
  
    // Internal method to setup the Wreqr.radio channel
    _initChannel: function() {
      this.channelName = _.result(this, 'channelName') || 'global';
      this.channel = _.result(this, 'channel') || Backbone.Wreqr.radio.channel(this.channelName);
      this.vent = _.result(this, 'vent') || this.channel.vent;
      this.commands = _.result(this, 'commands') || this.channel.commands;
      this.reqres = _.result(this, 'reqres') || this.channel.reqres;
    },
  
    // import the `triggerMethod` to trigger events with corresponding
    // methods if the method exists
    triggerMethod: Marionette.triggerMethod,
  
    // Proxy `getOption` to enable getting options from this or this.options by name.
    getOption: Marionette.proxyGetOption
  });
  
  // Copy the `extend` function used by Backbone's classes
  Marionette.Application.extend = Marionette.extend;
  
  /* jshint maxparams: 9 */
  
  // Module
  // ------
  
  // A simple module system, used to create privacy and encapsulation in
  // Marionette applications
  Marionette.Module = function(moduleName, app, options) {
    this.moduleName = moduleName;
    this.options = _.extend({}, this.options, options);
    // Allow for a user to overide the initialize
    // for a given module instance.
    this.initialize = options.initialize || this.initialize;
  
    // Set up an internal store for sub-modules.
    this.submodules = {};
  
    this._setupInitializersAndFinalizers();
  
    // Set an internal reference to the app
    // within a module.
    this.app = app;
  
    if (_.isFunction(this.initialize)) {
      this.initialize(moduleName, app, this.options);
    }
  };
  
  Marionette.Module.extend = Marionette.extend;
  
  // Extend the Module prototype with events / listenTo, so that the module
  // can be used as an event aggregator or pub/sub.
  _.extend(Marionette.Module.prototype, Backbone.Events, {
  
    // By default modules start with their parents.
    startWithParent: true,
  
    // Initialize is an empty function by default. Override it with your own
    // initialization logic when extending Marionette.Module.
    initialize: function() {},
  
    // Initializer for a specific module. Initializers are run when the
    // module's `start` method is called.
    addInitializer: function(callback) {
      this._initializerCallbacks.add(callback);
    },
  
    // Finalizers are run when a module is stopped. They are used to teardown
    // and finalize any variables, references, events and other code that the
    // module had set up.
    addFinalizer: function(callback) {
      this._finalizerCallbacks.add(callback);
    },
  
    // Start the module, and run all of its initializers
    start: function(options) {
      // Prevent re-starting a module that is already started
      if (this._isInitialized) { return; }
  
      // start the sub-modules (depth-first hierarchy)
      _.each(this.submodules, function(mod) {
        // check to see if we should start the sub-module with this parent
        if (mod.startWithParent) {
          mod.start(options);
        }
      });
  
      // run the callbacks to "start" the current module
      this.triggerMethod('before:start', options);
  
      this._initializerCallbacks.run(options, this);
      this._isInitialized = true;
  
      this.triggerMethod('start', options);
    },
  
    // Stop this module by running its finalizers and then stop all of
    // the sub-modules for this module
    stop: function() {
      // if we are not initialized, don't bother finalizing
      if (!this._isInitialized) { return; }
      this._isInitialized = false;
  
      this.triggerMethod('before:stop');
  
      // stop the sub-modules; depth-first, to make sure the
      // sub-modules are stopped / finalized before parents
      _.each(this.submodules, function(mod) { mod.stop(); });
  
      // run the finalizers
      this._finalizerCallbacks.run(undefined, this);
  
      // reset the initializers and finalizers
      this._initializerCallbacks.reset();
      this._finalizerCallbacks.reset();
  
      this.triggerMethod('stop');
    },
  
    // Configure the module with a definition function and any custom args
    // that are to be passed in to the definition function
    addDefinition: function(moduleDefinition, customArgs) {
      this._runModuleDefinition(moduleDefinition, customArgs);
    },
  
    // Internal method: run the module definition function with the correct
    // arguments
    _runModuleDefinition: function(definition, customArgs) {
      // If there is no definition short circut the method.
      if (!definition) { return; }
  
      // build the correct list of arguments for the module definition
      var args = _.flatten([
        this,
        this.app,
        Backbone,
        Marionette,
        Backbone.$, _,
        customArgs
      ]);
  
      definition.apply(this, args);
    },
  
    // Internal method: set up new copies of initializers and finalizers.
    // Calling this method will wipe out all existing initializers and
    // finalizers.
    _setupInitializersAndFinalizers: function() {
      this._initializerCallbacks = new Marionette.Callbacks();
      this._finalizerCallbacks = new Marionette.Callbacks();
    },
  
    // import the `triggerMethod` to trigger events with corresponding
    // methods if the method exists
    triggerMethod: Marionette.triggerMethod
  });
  
  // Class methods to create modules
  _.extend(Marionette.Module, {
  
    // Create a module, hanging off the app parameter as the parent object.
    create: function(app, moduleNames, moduleDefinition) {
      var module = app;
  
      // get the custom args passed in after the module definition and
      // get rid of the module name and definition function
      var customArgs = slice.call(arguments);
      customArgs.splice(0, 3);
  
      // Split the module names and get the number of submodules.
      // i.e. an example module name of `Doge.Wow.Amaze` would
      // then have the potential for 3 module definitions.
      moduleNames = moduleNames.split('.');
      var length = moduleNames.length;
  
      // store the module definition for the last module in the chain
      var moduleDefinitions = [];
      moduleDefinitions[length - 1] = moduleDefinition;
  
      // Loop through all the parts of the module definition
      _.each(moduleNames, function(moduleName, i) {
        var parentModule = module;
        module = this._getModule(parentModule, moduleName, app, moduleDefinition);
        this._addModuleDefinition(parentModule, module, moduleDefinitions[i], customArgs);
      }, this);
  
      // Return the last module in the definition chain
      return module;
    },
  
    _getModule: function(parentModule, moduleName, app, def, args) {
      var options = _.extend({}, def);
      var ModuleClass = this.getClass(def);
  
      // Get an existing module of this name if we have one
      var module = parentModule[moduleName];
  
      if (!module) {
        // Create a new module if we don't have one
        module = new ModuleClass(moduleName, app, options);
        parentModule[moduleName] = module;
        // store the module on the parent
        parentModule.submodules[moduleName] = module;
      }
  
      return module;
    },
  
    // ## Module Classes
    //
    // Module classes can be used as an alternative to the define pattern.
    // The extend function of a Module is identical to the extend functions
    // on other Backbone and Marionette classes.
    // This allows module lifecyle events like `onStart` and `onStop` to be called directly.
    getClass: function(moduleDefinition) {
      var ModuleClass = Marionette.Module;
  
      if (!moduleDefinition) {
        return ModuleClass;
      }
  
      // If all of the module's functionality is defined inside its class,
      // then the class can be passed in directly. `MyApp.module("Foo", FooModule)`.
      if (moduleDefinition.prototype instanceof ModuleClass) {
        return moduleDefinition;
      }
  
      return moduleDefinition.moduleClass || ModuleClass;
    },
  
    // Add the module definition and add a startWithParent initializer function.
    // This is complicated because module definitions are heavily overloaded
    // and support an anonymous function, module class, or options object
    _addModuleDefinition: function(parentModule, module, def, args) {
      var fn = this._getDefine(def);
      var startWithParent = this._getStartWithParent(def, module);
  
      if (fn) {
        module.addDefinition(fn, args);
      }
  
      this._addStartWithParent(parentModule, module, startWithParent);
    },
  
    _getStartWithParent: function(def, module) {
      var swp;
  
      if (_.isFunction(def) && (def.prototype instanceof Marionette.Module)) {
        swp = module.constructor.prototype.startWithParent;
        return _.isUndefined(swp) ? true : swp;
      }
  
      if (_.isObject(def)) {
        swp = def.startWithParent;
        return _.isUndefined(swp) ? true : swp;
      }
  
      return true;
    },
  
    _getDefine: function(def) {
      if (_.isFunction(def) && !(def.prototype instanceof Marionette.Module)) {
        return def;
      }
  
      if (_.isObject(def)) {
        return def.define;
      }
  
      return null;
    },
  
    _addStartWithParent: function(parentModule, module, startWithParent) {
      module.startWithParent = module.startWithParent && startWithParent;
  
      if (!module.startWithParent || !!module.startWithParentIsConfigured) {
        return;
      }
  
      module.startWithParentIsConfigured = true;
  
      parentModule.addInitializer(function(options) {
        if (module.startWithParent) {
          module.start(options);
        }
      });
    }
  });
  

  return Marionette;
}));

define('apps/presentation/controller',[
    "marionette"
], function (Marionette) {
    "use strict";
    return Marionette.Controller.extend({
        initialize: function (options) {
            this.app = options.app;
        },
        dataDetail: function (dataType, id) {
            this.app.vent.trigger("show-detail", {
                id: id,
                dataType: dataType
            }, false);
        },
        dataList: function (dataType) {
            this.app.vent.trigger("show-list", dataType);
        },
        fetchMap: function (slug) {
            //alert(slug);
            this.app.vent.trigger("fetch-map", slug);
        }
    });
});
define('apps/presentation/router',[
    "jquery",
    "marionette",
    "backbone",
    "apps/presentation/controller"
], function ($, Marionette, Backbone, Controller) {
    "use strict";
    var Router = Marionette.AppRouter.extend({
        appRoutes: {
            ':dataType/:id': 'dataDetail',
            //'/^[\w-]+/': 'fetchMap'//,
            //new RegExp('^([\w-]+)'): 'fetchMap',
            ':slug': 'fetchMap'
        },
        initialize: function (options) {
            this.controller = new Controller({
                app: options.app
            });
            Marionette.AppRouter.prototype.initialize.apply(this, [options]);
            this.applyRoutingHacks();
            ///^[a-zA-Z0-9-_]+$/
            //this.route(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/, 'fetchMap');
        },
        applyRoutingHacks: function () {
            $('a').click(function () {
                if ('#/' + Backbone.history.fragment == $(this).attr('href')) {
                    Backbone.history.loadUrl(Backbone.history.fragment);
                }
            });
        }
    });
    return Router;
});
define('lib/maps/controls/searchBox',['jquery'], function ($) {
    "use strict";
    /**
     * Class that adds a Search Box to the map.
     * @class SearchBox
     * @param {google.maps.Map} map A google.maps.Map object, to which the
     * SearchBox should be attached.
     */
    var SearchBox = function (map) {
        var searchBox = null,
            $input = $('<input class="controls address-input" ' +
                'type="text" placeholder="Search for Places">'),

        /**
         * Performs the search based on the location that the user
         * entered into the search box. If a valid location is found,
         * this function also zooms the map to the resulting location.
         */
            search = function () {
                var places = searchBox.getPlaces();
                if (places) {
                    if (places.length === 0) {
                        return;
                    }
                    if (places[0].geometry.viewport) {
                        map.fitBounds(places[0].geometry.viewport);
                    } else {
                        map.setCenter(places[0].geometry.location);
                        map.setZoom(17);
                    }
                }
            },
        /** Creates an HTML search control, and attaches
         * it to the upper right-hand side of the map.
         */
            render = function () {
                //console.log(google.maps.ControlPosition.RIGHT_TOP, map.controls[google.maps.ControlPosition.RIGHT_TOP]);
                map.controls[google.maps.ControlPosition.RIGHT_TOP].push($input.get(0));
                searchBox = new google.maps.places.SearchBox($input.get(0));
                google.maps.event.addListener(searchBox, 'places_changed', function () {
                    search();
                });
                $input.keyup(function (event) {
                    if (event.keyCode === 13) {
                        search();
                    }
                });
            };



        //call render upon initialization
        render();
    };
    return SearchBox;
});
define('lib/maps/controls/tileController',["marionette", "underscore", "jquery"],
    function (Marionette, _, $) {
        "use strict";

        var TileController = Marionette.ItemView.extend({
            /**
             * Raw data array of map overlays, pulled from the Local Ground Data API.
             * @see <a href="//localground.org/api/0/tiles">Local Ground Data API</a>.
             */
            initialize: function (opts) {
                var key, that = this;
                _.extend(this, opts);
                this.tilesets = this.app.dataManager.tilesets;
                this.map = this.app.map;
                for (key in this.tilesets.mapTypes) {
                    this.map.mapTypes.set(key, this.tilesets.mapTypes[key]);
                }
                this.setActiveMapType(this.activeMapTypeID);
                setTimeout(function () {
                    that.showCustomAttribution(that.activeMapTypeID);
                }, 500);
                this.app.vent.on('map-tiles-changed', this.showCustomAttribution.bind(this));
            },
            getTileSetByKey: function (key, value) {
                return this.tilesets.find(function (model) {
                    if (key === 'name') {
                        return model.get(key).toLowerCase() === value.toLowerCase();
                    }
                    return model.get(key) === value;
                });
            },
            getMapTypeId: function () {
                var tileset = this.getTileSetByKey("name", this.map.getMapTypeId().toLowerCase());
                if (!tileset) {
                    return null;
                }
                return tileset.id;
            },
            hideCustomAttribution: function () {
                $('.tile-attribution').parent().prev().show();
                $('.tile-attribution').remove();
            },
            showCustomAttribution: function (id) {
                this.hideCustomAttribution();
                id = id || this.getMapTypeId();
                var tileset = this.tilesets.get(id),
                    $message;
                if (!tileset.get("attribution")) {
                    return;
                }
                $message = $('<span class="tile-attribution"></span>').html(tileset.get("attribution"));
                $('.gm-style-cc span').parent().append($message);
                $message.css({
                    marginLeft: ($message.width() - 6) * -1,
                    backgroundColor: "rgba(255, 255, 255, 0.7)"
                });
                $message.parent().prev().hide();
            },
            setActiveMapType: function (id) {
                this.showCustomAttribution(id);
                var tileset = this.getTileSetByKey("id", id);
                if (tileset) {
                    this.map.setMapTypeId(tileset.getMapTypeID());
                    this.app.vent.trigger("map-tiles-changed");
                }
            }
        });


        return TileController;
    });

define('lib/maps/basemap',["marionette",
        "jquery",
        "lib/maps/controls/searchBox",
        "lib/maps/controls/tileController"
    ],
    function (Marionette, $, SearchBox, TileController) {
        'use strict';
        /**
         * A class that handles the basic Google Maps functionality,
         * including tiles, search, and setting the default location.
         * @class Basemap
         */

        var Basemap = Marionette.View.extend({
            customMapTypeID: 'custom-style',
            map: null,
            showSearchControl: true,
            showDropdownControl: true,
            activeMapTypeID: 7,
            minZoom: 1,
            maxZoom: 22,
            mapID: 'map',
            disableStateMemory: false,
            activeModel: null,
            addMarkerClicked: false,
            targetedModel: null,
            tileManager: null,
            userProfile: null,
            panorama: null,
            //todo: populate this from user prefs:
            defaultLocation: {
                zoom: 15,
                center: { lat: -34, lng: 151 }
            },
            //el: '#map',
            template: false,

            initialize: function (opts) {
                // set initial properties (init params override state params):
                this.app = opts.app;
                this.tilesets = this.app.dataManager.tilesets;
                this.restoreState();
                $.extend(this, opts);

                //add event listeners:
                this.listenTo(this.tilesets, 'reset', this.onShow);
                this.listenTo(this.app.vent, 'highlight-marker', this.doHighlight);
                this.listenTo(this.app.vent, 'add-new-marker', this.activateMarker);
                this.listenTo(this.app.vent, 'delete-marker', this.deleteMarker);
                this.listenTo(this.app.vent, 'place-marker', this.placeMarkerOnMapXY);
                this.listenTo(this.app.vent, 'add-rectangle', this.initDrawingManager);
                this.listenTo(this.app.vent, 'show-streetview', this.showStreetView);
                this.listenTo(this.app.vent, 'hide-streetview', this.hideStreetView);

                // call parent:
                Marionette.View.prototype.initialize.call(this);
            },

            point2LatLng: function (point) {
                var topRight, bottomLeft, scale, worldPoint, offset;
                offset = this.$el.offset();
                point.x -= offset.left;
                point.y -= offset.top;
                topRight = this.map.getProjection().fromLatLngToPoint(this.map.getBounds().getNorthEast());
                bottomLeft = this.map.getProjection().fromLatLngToPoint(this.map.getBounds().getSouthWest());
                scale = Math.pow(2, this.map.getZoom());
                worldPoint = new google.maps.Point(point.x / scale + bottomLeft.x, point.y / scale + topRight.y);
                return this.map.getProjection().fromPointToLatLng(worldPoint);
            },
            initDrawingManager: function () {
                var that = this;
                this.drawingManager = new google.maps.drawing.DrawingManager({
                    drawingMode: google.maps.drawing.OverlayType.RECTANGLE,
                    drawingControl: false,
                    markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
                    rectangleOptions: {
                        strokeColor: '#ed867d',
                        fillColor: '#ed867d',
                        fillOpacity: 0,
                        strokeWeight: 4,
                        clickable: false,
                        editable: true,
                        zIndex: 1
                    }
                });
                google.maps.event.addListener(this.drawingManager, 'rectanglecomplete', function (rect) {
                    rect.setOptions({ editable: false });
                    that.drawingManager.setDrawingMode(null);
                    var getGeoJSONFromBounds = function (r) {
                            var bounds = r.getBounds().toJSON(),
                                north = bounds.north,
                                south = bounds.south,
                                east = bounds.east,
                                west = bounds.west;
                            return {
                                "type": "Polygon",
                                "coordinates": [[
                                    [east, north], [east, south], [west, south], [west, north], [east, north]
                                ]]
                            };
                        },
                        r = getGeoJSONFromBounds(rect);
                    rect.setMap(null);
                    that.targetedModel.set("geometry", r);
                    that.targetedModel.trigger('show-marker');
                    that.addMarkerClicked = false;
                    that.targetedModel = null;
                    that.drawingManager.setMap(null);
                    $('body').css({ cursor: 'auto' });
                });
                this.drawingManager.setMap(this.map);
            },

            doHighlight: function (model) {
                if (this.activeModel) {
                    this.activeModel.set("active", false);
                }
                this.activeModel = model;
            },

            placeMarkerOnMapXY: function (point) {
                var location = this.point2LatLng(point);
                this.placeMarkerOnMap(location);
            },

            // If the add marker button is clicked, allow user to add marker on click
            // after the marker is placed, disable adding marker and hide the "add marker" div
            placeMarkerOnMap: function (location) {
                if (!this.addMarkerClicked) {
                    return;
                }
                this.targetedModel.trigger('commit-data-no-save');
                if (!this.targetedModel.get("id")) {
                    this.targetedModel.collection.add(this.targetedModel);
                }
                this.targetedModel.setPointFromLatLng(location.lat(), location.lng());
                this.targetedModel.trigger('show-marker');
                this.targetedModel.save();
                this.addMarkerClicked = false;
                this.targetedModel = null;
            },

            getTileSetByKey: function (key, value) {
                return this.tilesets.find(function (model) {
                    if (key === 'name') {
                        return model.get(key).toLowerCase() === value.toLowerCase();
                    }
                    return model.get(key) === value;
                });
            },

            setActiveMapType: function (id) {
                //this.showCustomAttribution(id);
                var tileset = this.getTileSetByKey("id", id);
                if (tileset) {
                    this.map.setMapTypeId(tileset.getMapTypeID());
                    this.app.vent.trigger("map-tiles-changed");
                }
            },

            showMapTypesDropdown: function (opts) {
                // only show map dropdown once tilesets loaded:
                var key;
                for (key in opts.mapTypes) {
                    this.map.mapTypes.set(key, opts.mapTypes[key]);
                }
                if (this.showDropdownControl) {
                    this.map.setOptions({
                        mapTypeControlOptions: {
                            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                            position: google.maps.ControlPosition.TOP_LEFT,
                            mapTypeIds: opts.mapTypeIDs
                        },
                        mapTypeControl: true
                    });
                }
            },

            activateMarker: function (model) {
                this.addMarkerClicked = true;
                this.targetedModel = model;
            },

            deleteMarker: function (model) {
                //model.trigger('hide-marker');
                model.set("geometry", null);
                model.save();
            },

            renderMap: function () {
                var mapOptions = {
                    scrollwheel: false,
                    minZoom: this.minZoom,
                    streetViewControl: true,
                    //scaleControl: true,
                    panControl: false,
                    zoomControlOptions: this.zoomControlOptions || {
                        style: google.maps.ZoomControlStyle.SMALL
                    },
                    mapTypeControl: this.showDropdownControl,
                    //mapTypeId: this.activeMapTypeID,
                    rotateControlOptions: this.rotateControlOptions,
                    streetViewControlOptions: this.streetViewControlOptions,
                    zoom: this.zoom || this.defaultLocation.zoom,
                    center: this.center || this.defaultLocation.center
                };

                if (!this.$el.find("#" + this.mapID).get(0)) {
                    this.$el.append($('<div id="' + this.mapID + '"></div>'));
                }

                this.app.map = this.map = new google.maps.Map(document.getElementById(this.mapID),
                    mapOptions);
                this.initTileManager();
            },
            showStreetView: function (model) {
                this.activeModel = model;
                var that = this,
                    extras = model.get("extras") || {},
                    pov = extras.pov || { heading: 180, pitch: -10 };
                this.panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('map'),
                    {
                        position: {
                            lat: model.get("geometry").coordinates[1],
                            lng: model.get("geometry").coordinates[0]
                        },
                        addressControlOptions: {
                            position: google.maps.ControlPosition.BOTTOM_CENTER
                        },
                        pov: pov,
                        linksControl: false,
                        panControl: true,
                        addressControl: false,
                        enableCloseButton: true
                    }
                );
                google.maps.event.addListener(this.panorama, 'visible_changed', function () {
                    if (!this.getVisible()) {
                        that.app.vent.trigger('streetview-hidden');
                    }
                });
                if (this.app.screenType === "map") {
                    google.maps.event.addListener(this.panorama, 'pov_changed', function () {
                        if (that.app.mode !== "edit" || that.activeModel.get("overlay_type") !== "marker") {
                            return;
                        }
                        if (that.povTimer) {
                            clearTimeout(that.povTimer);
                        }
                        that.povTimer = setTimeout(function () {
                            var pov = {
                                    heading: that.panorama.getPov().heading,
                                    pitch: that.panorama.getPov().pitch
                                },
                                extras = that.activeModel.get("extras") || {};
                            extras.pov = pov;
                            that.activeModel.save({extras: JSON.stringify(extras)}, {patch: true, parse: false});
                            that.activeModel.set("extras", extras);
                        }, 500);
                    });
                }
                this.map.setStreetView(this.panorama);
            },
            hideStreetView: function () {
                if (this.panorama) {
                    this.panorama.setVisible(false);
                }
            },
            initTileManager: function () {
                if (this.tilesets.length == 0 || !this.map) {
                    return;
                }
                this.tileManager = new TileController({
                    map: this.map,
                    app: this.app,
                    activeMapTypeID: this.activeMapTypeID
                });
                this.map.set('mapTypeControlOptions', {
                    style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                    position: google.maps.ControlPosition.TOP_LEFT,
                    mapTypeIds: this.tilesets.mapTypeIDs
                });
            },

            addControls: function () {
                //add a search control, if requested:
                if (this.showSearchControl) {
                    this.searchControl = new SearchBox(this.map);
                }

                //add a browser-based location detector, if requested:
                /*if (opts.includeGeolocationControl) {
                    this.geolocationControl = new GeoLocation({
                        map: this.map,
                        userProfile: this.userProfile,
                        defaultLocation: this.defaultLocation
                    });
                }*/
            },

            addEventHandlers: function () {
                //add notifications:
                var that = this;
                google.maps.event.addListener(this.map, "maptypeid_changed", function () {
                    that.app.vent.trigger('map-tiles-changed');
                    that.saveState();
                });
                google.maps.event.addListener(this.map, "idle", function () {
                    that.saveState();
                });
                google.maps.event.addListener(this.map, 'zoom_changed', function () {
                    that.saveState();
                });

                google.maps.event.addListener(this.map, 'click', function (event) {
                    that.placeMarkerOnMap(event.latLng);
                });

                //todo: possibly move to a layout module?
                $(window).off('resize');
                $(window).on('resize', function () {
                    console.log('map resized');
                });
            },
            redraw: function (opts) {
                var that = this,
                    time = (opts && opts.time) ? opts.time : 50;
                setTimeout(function () {
                    google.maps.event.trigger(that.map, 'resize');
                }, time);
            },
            getZoom: function () {
                return this.map.getZoom();
            },
            getCenter: function () {
                return this.map.getCenter();
            },
            getMapTypeId: function () {
                return this.tileManager.getMapTypeId();
            },
            setZoom: function (zoom) {
                this.map.setZoom(zoom);
            },
            setCenter: function (center) {
                this.map.setCenter(center);
            },
            setMapTypeId: function (id) {
                this.app.basemapView.tileManager.setActiveMapType(id);
            },

            saveState: function () {
                if (!this.tileManager || this.disableStateMemory) {
                    return;
                }
                var latLng = this.map.getCenter(),
                    state = {
                        center: [latLng.lng(), latLng.lat()],
                        zoom: this.map.getZoom(),
                        activeMapTypeID: this.tileManager.getMapTypeId()
                    };
                this.app.saveState("basemap", state);
            },
            restoreState: function () {
                var state = this.app.restoreState("basemap");
                if (state) {
                    if (state.center) {
                        this.defaultLocation.center = new google.maps.LatLng(
                            state.center[1],
                            state.center[0]
                        );
                    }
                    if (state.zoom) {
                        this.defaultLocation.zoom = state.zoom;
                    }
                    if (state.activeMapTypeID) {
                        this.activeMapTypeID = state.activeMapTypeID;
                    }
                }
                return state;
            },
            onShow: function () {
                if (this.tilesets.length == 0) {
                    return;
                }
                //this.restoreState();
                this.renderMap();
                this.addControls();
                this.addEventHandlers();
            }

        });

        return Basemap;
    });

define('lib/maps/geometry/point',[], function () {
    "use strict";
    /**
     * Functions to help move from lat/lngs to GeoJSON
     * formats and vice versa
     * @class Point
     */
    var Point = function () {

        /**
         * Method that converts a google.maps.Point
         * into a GeoJSON Point object.
         * @param {google.maps.LatLng} googlePoint
         * A Google point object.
         * @see See the Google <a href="https://developers.google.com/maps/documentation/javascript/reference#LatLng">google.maps.LatLng</a>
         * documentation for more details.
         * @returns a GeoJSON Point object
         */
        this.getGeoJSON = function (latLng) {
            return {
                type: 'Point',
                coordinates: [latLng.lng(), latLng.lat()]
            };
        };

        /**
         * Method that converts a GeoJSON Point into
         * a google.maps.LatLng object.
         * @param {GeoJSON Point} geoJSON
         * A GeoJSON Point object
         * @returns {google.maps.LatLng}
         * A google.maps.LatLng object
         */
        this.getGoogleLatLng = function (geoJSON) {
            return new google.maps.LatLng(
                geoJSON.coordinates[1],
                geoJSON.coordinates[0]
            );
        };

        this.printLatLng = function (geoJSON, places) {
            places = places || 2;
            return geoJSON.coordinates[1].toFixed(places) + ", " +
                geoJSON.coordinates[0].toFixed(places);
        };

    };
    return Point;
});
define('lib/maps/geometry/polyline',[], function () {
    "use strict";
    /**
     * Functions to help move from lat/lngs to GeoJSON
     * formats and vice versa
     * @class Polyline
     */
    var Polyline = function () {

        /**
         * Method that converts a google.maps.Polyline
         * into a GeoJSON Linestring object.
         * @param {google.maps.Polyline} googlePolyline
         * A Google polyline object.
         * @see See the Google <a href="https://developers.google.com/maps/documentation/javascript/reference#Polyline">google.maps.Polyline</a>
         * documentation for more details.
         * @returns a GeoJSON Linestring object
         */
        this.getGeoJSON = function (googlePath) {
            var pathCoords = googlePath.getArray(),
                coords = [],
                i = 0;
            for (i; i < pathCoords.length; i++) {
                coords.push([pathCoords[i].lng(), pathCoords[i].lat()]);
            }
            return { type: 'LineString', coordinates: coords };
        };

        /**
         * Method that converts a GeoJSON Linestring into
         * an array of google.maps.LatLng objects.
         * @param {GeoJSON Linestring} geoJSON
         * A GeoJSON Linestring object
         * @returns {Array}
         * An array of google.maps.LatLng objects.
         */
        this.getGooglePath = function (geoJSON) {
            var path = [],
                coords = geoJSON.coordinates,
                i = 0;
            for (i; i < coords.length; i++) {
                path.push(new google.maps.LatLng(coords[i][1], coords[i][0]));
            }
            return path;
        };

        /**
         * Method that calculates the length of a
         * google.maps.Polyline (in miles)
         * @param {google.maps.Polyline} googlePolyline
         * A Google polyline object.
         * @returns {Number}
         * The length of the google.maps.Polyline object in miles.
         */
        this.calculateDistance = function (googlePolyline) {
            var coords = googlePolyline.getPath().getArray(),
                distance = 0,
                i = 0;
            for (i; i < coords.length; i++) {
                distance += google.maps.geometry.spherical.computeDistanceBetween(coords[i - 1], coords[i]);
            }
            return Math.round(distance / 1609.34 * 100) / 100;
        };

        /**
         * Method that calculates the bounding box of a
         * google.maps.Polyline (in miles)
         * @param {google.maps.Polyline} googlePolyline
         * A Google polyline object.
         * @returns {google.maps.LatLngBounds}
         * The bounding box.
         */
        this.getBounds = function (googlePolyline) {
            var bounds = new google.maps.LatLngBounds(),
                coords = googlePolyline.getPath().getArray(),
                i = 0;
            for (i; i < coords.length; i++) {
                bounds.extend(coords[i]);
            }
            return bounds;
        };

        /**
         * An approximation for the center point of a polyline.
         * @param {google.maps.Polyline} googlePolyline
         * @returns {google.maps.LatLng}
         * A latLng corresponding the approximate center of the
         * polyline.
         */
        this.getCenterPoint = function (googlePolyline) {
            var coordinates = googlePolyline.getPath().getArray();
            return coordinates[Math.floor(coordinates.length / 2)];
        };

        this.getCenterPointFromGeoJSON = function (geoJSON) {
            var path = this.getGooglePath(geoJSON);
            return path[Math.floor(path.length / 2)];
        };
    };
    return Polyline;
});
define('lib/maps/geometry/polygon',["lib/maps/geometry/polyline"], function (Polyline) {
    "use strict";
    /**
     * Functions to help move from lat/lngs to GeoJSON
     * formats and vice versa
     * @class Polygon
     */
    var Polygon = function () {
        Polyline.call(this);

        this.getGeoJSON = function (googlePath) {
            var pathCoords = googlePath.getArray(),
                coords = [],
                i = 0;
            for (i; i < pathCoords.length; i++) {
                coords.push([pathCoords[i].lng(), pathCoords[i].lat()]);
            }
            //add last coordinate again:
            coords.push([pathCoords[0].lng(), pathCoords[0].lat()]);
            return { type: 'Polygon', coordinates: [coords] };
        };

        /**
         * Method that converts a GeoJSON Linestring into
         * an array of google.maps.LatLng objects.
         * @param {GeoJSON Linestring} geoJSON
         * A GeoJSON Linestring object
         * @returns {Array}
         * An array of google.maps.LatLng objects.
         */
        this.getGooglePath = function (geoJSON) {
            var path = [],
                coords = geoJSON.coordinates[0],
                i = 0;
            for (i; i < coords.length; i++) {
                path.push(new google.maps.LatLng(coords[i][1], coords[i][0]));
            }
            path.pop();
            return path;
        };

        this.getCenterPoint = function (googleOverlay) {
            return this.getBounds(googleOverlay).getCenter();
        };

        this.getCenterPointFromGeoJSON = function (geoJSON) {
            var coords = this.getGooglePath(geoJSON),
                bounds = new google.maps.LatLngBounds(),
                i = 0;
            for (i; i < coords.length; i++) {
                bounds.extend(coords[i]);
            }
            return bounds.getCenter();
        };
    };
    return Polygon;

});
define('lib/maps/geometry/geometry',[
    "lib/maps/geometry/point",
    "lib/maps/geometry/polyline",
    "lib/maps/geometry/polygon"
], function (Point, Polyline, Polygon) {
    "use strict";
    /**
     * Functions to help move from lat/lngs to GeoJSON
     * formats and vice versa
     * @class Point
     */
    var Geometry = function () {
        this.point = null;
        this.polyline = null;
        this.polygon = null;

        this.getGeoJSON = function (googleObject) {
            if (googleObject instanceof google.maps.LatLng) {
                return this.point.getGeoJSON(googleObject);
            }
            if (googleObject instanceof google.maps.Marker) {
                return this.point.getGeoJSON(googleObject.position);
            }
            if (googleObject instanceof google.maps.Polyline) {
                return this.polyline.getGeoJSON(googleObject.getPath());
            }
            if (googleObject instanceof google.maps.Polygon) {
                return this.polygon.getGeoJSON(googleObject.getPath());
            }

            alert("Not an instance of a defined type!");
            return null;

        };

        this.initialize = function () {
            this.point = new Point();
            this.polyline = new Polyline();
            this.polygon = new Polygon();
        };

        this.initialize();

    };
    return Geometry;
});
define('models/base',["underscore", "jquery", "backbone", "form", "lib/maps/geometry/geometry", "lib/maps/geometry/point"],
    function (_, $, Backbone, Form, Geometry, Point) {
        "use strict";
        /**
         * An "abstract" Backbone Model; the root of all of the other
         * localground.model.* classes. Has some helper methods that help
         * the various models create forms to update models.
         * @class Base
         */
        var JSONFormatter = Form.JSONFormatter = function () {};
        var Base = Backbone.Model.extend({
            schema: {
                name: 'Text',
                caption: { type: 'TextArea'},
                tags: 'Text'
            },
            getDataTypePlural: function () {
                if (this.collection && this.collection.getDataType) {
                    return this.collection.getDataType();
                }
                var type = this.get("overlay_type");
                return (type == 'audio') ? 'audio' : type + "s";

            },
            getDataType: function () {
                return this.get("overlay_type");
            },
            filterFields: [
                "name",
                "tags",
                "owner",
                "caption",
                "attribution"
            ],
            defaults: {
                name: "Untitled",
                isVisible: true
            },
            urlRoot: null, /* /api/0/forms/<form_id>/fields/.json */
            updateSchema: null,
            hiddenFields: [
                "geometry",
                "overlay_type",
                "project_id",
                "url",
                "num",
                "manually_reviewed"
            ],
            validatorFunction: function (value, formValues) {
                var err = {
                    type: 'json',
                    message: 'Value must be a JSON object'
                };
                try {
                    JSON.parse(value);
                    return null;
                } catch (e) {
                    if (value) { return err; }
                    return null;
                }
            },
            dataTypes: {
                'string': 'Text',
                'float': 'Number',
                'integer': 'Number',
                'boolean': 'Checkbox',
                'geojson': 'TextArea',
                'memo': 'TextArea',
                'json': 'TextArea'
            },
            parse: function (resp, options) {
                if (options && !options.parse) {
                    return null;
                }
                return resp;
            },
            initialize: function (data, opts) {
                opts = opts || {};
                this.generateUpdateSchema(opts.updateMetadata);
                //in case geometry comes in as stringified:
                var geom = this.get("geometry");
                if (!_.isUndefined(geom) && _.isString(geom)) {
                    this.set("geometry", JSON.parse(geom));
                }
            },
            setPointFromLatLng: function (lat, lng) {
                lat = lat || this.get("lat");
                lng = lng || this.get("lng");
                var geoJSON = this.get("geometry");
                if (geoJSON && geoJSON.type === "Point") {
                    if (lat) { geoJSON.coordinates[1] = lat; }
                    if (lng) { geoJSON.coordinates[0] = lng; }
                } else if (!geoJSON && lat && lng) {
                    geoJSON = {
                        type: 'Point',
                        coordinates: [lng, lat]
                    };
                } else {
                    geoJSON = null;
                }
                this.set("geometry", geoJSON);
                return geoJSON;
            },
            set: function (attributes, options) {
                // overriding set method so that whenever geoJSON gets set,
                // and geoJSON is a Point, then lat and lng also get set:
                if (attributes.hasOwnProperty("geometry") || attributes === "geometry") {
                    var geoJSON = attributes.geometry;
                    if (geoJSON && geoJSON.type === "Point") {
                        attributes.lat = geoJSON.coordinates[1];
                        attributes.lng = geoJSON.coordinates[0];
                    }
                }
                return Backbone.Model.prototype.set.call(this, attributes, options);
            },
            toJSON: function () {
                // ensure that the geometry object is serialized before it
                // gets sent to the server:
                var json = Backbone.Model.prototype.toJSON.call(this);
                if (json.geometry != null) {
                    json.geometry = JSON.stringify(json.geometry);
                }
                if (json.extras != null) {
                    json.extras = JSON.stringify(json.extras);
                }
                return json;
            },
            toTemplateJSON: function () {
                var json = Backbone.Model.prototype.toJSON.call(this);
                json.key = this.getKey();
                return json;
            },
            getKey: function () {
                var key = this.collection.key;
                if (key) {
                    return this.collection.key;
                }
                switch(this.get("overlay_type")) {
                    case "photo": 
                        return "photos";
                    case "audio":
                        return "audio";
                    case "marker":
                        return "markers";
                    default: alert("case not handled");
                }
            },
            getCenter: function () {
                var geoJSON = this.get("geometry"),
                    point = new Point();
                if (!geoJSON) {
                    return null;
                }
                return point.getGoogleLatLng(geoJSON);
            },
            printLatLng: function (places) {
                var point = new Point();
                return point.printLatLng(this.get("geometry"), places);
            },
            setExtras: function (extras) {
                try {
                    extras = JSON.parse(extras);
                    this.set({ extras: extras }, { silent: true });
                } catch (e) {
                    this.set({ extras: null }, { silent: true });
                }
            },
            fetchCreateMetadata: function () {
                var that = this;
                if (!this.urlRoot) {
                    this.urlRoot = this.collection.url;
                }
                $.ajax({
                    url: this.urlRoot + '.json',
                    type: 'OPTIONS',
                    data: { _method: 'OPTIONS' },
                    success: function (data) {
                        that.createMetadata = data.actions.POST;
                    }
                });
            },
            fetchUpdateMetadata: function (callback) {
                var that = this;
                if (this.urlRoot == null) {
                    this.urlRoot = this.collection.url;
                }
                $.ajax({
                    url: this.urlRoot + this.id + '/.json',
                    type: 'OPTIONS',
                    data: { _method: 'OPTIONS' },
                    success: function (data) {
                        that.updateMetadata = data.actions.PUT;
                        callback();
                    }
                });
            },

            generateUpdateSchema: function (metadata) {
                this.updateSchema = this._generateSchema(metadata, true);
            },
            generateCreateSchema: function (metadata) {
                this.createSchema = this._generateSchema(metadata, true);
            },
            _generateSchema: function (metadata, edit_only) {
                //todo: eventually move this to its own class.
                if (!metadata) {
                    return null;
                }
                var schema = {}, key, val;
                //https://github.com/powmedia/backbone-forms#schema-definition
                for (key in metadata) {
                    val = metadata[key];
                    if (this.hiddenFields.indexOf(key) === -1) {
                        if (!edit_only || !val.read_only) {
                            //console.log(key);
                            schema[key] = {
                                type: this.dataTypes[val.type] || 'Text',
                                title: val.label || key,
                                help: val.help_text
                            };
                            if (val.choices) {
                                schema[key].type = 'Select';
                                schema[key].options = [];
                                _.each(val.choices, function (choice) {
                                    schema[key].options.push({
                                        val: choice.value,
                                        label: choice.display_name
                                    });
                                });
                            }
                            // TAP: Best way to do this?
                            if (schema[key].title == "tags") {
                                //schema[key].type = "List";

                            }
                            if (val.type.indexOf("json") != -1) {
                                schema[key].validators = [ this.validatorFunction ];
                            }
                        }
                    }

                }

                return schema;

            },
            setGeometryFromOverlay: function (googleOverlay) {
                var geomHelper = new Geometry(),
                    geoJSON = geomHelper.getGeoJSON(googleOverlay);
                this.set({
                    geometry: geoJSON
                });
                if (geoJSON.type === "Point") {
                    this.set({
                        lat: geoJSON.coordinates[1],
                        lng: geoJSON.coordinates[0]
                    });
                }
            },
            getFormSchema: function () {
                return {
                    name: { type: 'TextArea', title: "Name" },
                    caption:  { type: 'TextArea', title: "Caption" },
                    attribution: { type: 'TextArea', title: "Attribution" },
                    tags: { type: 'List', itemType: 'Text' }
                };
            }
        });
        return Base;
    });

define('models/projectUser',["underscore", "models/base"], function (_, Base) {
    "use strict";
    /**
     * A Backbone Model class for the Project datatype.
     * @class Project
     * @see <a href="//localground.org/api/0/projects/">//localground.org/api/0/projects/</a>
     */
    var ProjectUser = Base.extend({
        defaults: _.extend({}, Base.prototype.defaults, {
            isActive: false,
            isVisible: false,
            checked: false
        }),
        initialize: function (data, opts) {
            console.log(data, opts);
            // This had to be made dynamic because there are different users
            // for each project
            if (this.collection && this.collection.url) {
                this.urlRoot = this.collection.url;
            } else if (opts.id) {
                this.urlRoot = '/api/0/projects/' + opts.id + '/users/';
            } else {
                alert("id initialization parameter required for ProjectUser");
                return;
            }
            if (this.get("user")) {
                this.url = this.urlRoot + this.get("user") + "/";
            }
			      Base.prototype.initialize.apply(this, arguments);
		    },
        destroy: function (options) {
            //this.set("id", 1); //BUG: the ID needs to be set in order for the destroy to work.
            // needed to override the destroy method because the ProjectUser
            // endpoint doesn't have an ID, which Backbone requires:
            var opts = _.extend({url: this.urlRoot + this.get("user") + "/"}, options || {});
            console.log(this.get("user"));
            console.log(opts);
            return Backbone.Model.prototype.destroy.call(this, opts);
        }
    });
    return ProjectUser;
});

define('backbone-pageable',[
        "underscore",
		"backbone"
	], function (_, Backbone) {

  "use strict";

  var _extend = _.extend;
  var _omit = _.omit;
  var _clone = _.clone;
  var _each = _.each;
  var _pick = _.pick;
  var _contains = _.contains;
  var _isEmpty = _.isEmpty;
  var _pairs = _.pairs;
  var _invert = _.invert;
  var _isArray = _.isArray;
  var _isFunction = _.isFunction;
  var _isObject = _.isObject;
  var _keys = _.keys;
  var _isUndefined = _.isUndefined;
  var _result = _.result;
  var ceil = Math.ceil;
  var floor = Math.floor;
  var max = Math.max;

  var BBColProto = Backbone.Collection.prototype;

  function finiteInt (val, name) {
    if (!_.isNumber(val) || _.isNaN(val) || !_.isFinite(val) || ~~val !== val) {
      throw new TypeError("`" + name + "` must be a finite integer");
    }
    return val;
  }

  function queryStringToParams (qs) {
    var kvp, k, v, ls, params = {}, decode = decodeURIComponent;
    var kvps = qs.split('&');
    for (var i = 0, l = kvps.length; i < l; i++) {
      var param = kvps[i];
      kvp = param.split('='), k = kvp[0], v = kvp[1] || true;
      k = decode(k), v = decode(v), ls = params[k];
      if (_isArray(ls)) ls.push(v);
      else if (ls) params[k] = [ls, v];
      else params[k] = v;
    }
    return params;
  }

  // hack to make sure the whatever event handlers for this event is run
  // before func is, and the event handlers that func will trigger.
  function runOnceAtLastHandler (col, event, func) {
    var eventHandlers = col._events[event];
    if (eventHandlers && eventHandlers.length) {
      var lastHandler = eventHandlers[eventHandlers.length - 1];
      var oldCallback = lastHandler.callback;
      lastHandler.callback = function () {
        try {
          oldCallback.apply(this, arguments);
          func();
        }
        catch (e) {
          throw e;
        }
        finally {
          lastHandler.callback = oldCallback;
        }
      };
    }
    else func();
  }

  var PARAM_TRIM_RE = /[\s'"]/g;
  var URL_TRIM_RE = /[<>\s'"]/g;

  /**
     Drop-in replacement for Backbone.Collection. Supports server-side and
     client-side pagination and sorting. Client-side mode also support fully
     multi-directional synchronization of changes between pages.

     @class Backbone.PageableCollection
     @extends Backbone.Collection
  */
  var PageableCollection = Backbone.PageableCollection = Backbone.Collection.extend({

    /**
       The container object to store all pagination states.

       You can override the default state by extending this class or specifying
       them in an `options` hash to the constructor.

       @property {Object} state

       @property {0|1} [state.firstPage=1] The first page index. Set to 0 if
       your server API uses 0-based indices. You should only override this value
       during extension, initialization or reset by the server after
       fetching. This value should be read only at other times.

       @property {number} [state.lastPage=null] The last page index. This value
       is __read only__ and it's calculated based on whether `firstPage` is 0 or
       1, during bootstrapping, fetching and resetting. Please don't change this
       value under any circumstances.

       @property {number} [state.currentPage=null] The current page index. You
       should only override this value during extension, initialization or reset
       by the server after fetching. This value should be read only at other
       times. Can be a 0-based or 1-based index, depending on whether
       `firstPage` is 0 or 1. If left as default, it will be set to `firstPage`
       on initialization.

       @property {number} [state.pageSize=25] How many records to show per
       page. This value is __read only__ after initialization, if you want to
       change the page size after initialization, you must call #setPageSize.

       @property {number} [state.totalPages=null] How many pages there are. This
       value is __read only__ and it is calculated from `totalRecords`.

       @property {number} [state.totalRecords=null] How many records there
       are. This value is __required__ under server mode. This value is optional
       for client mode as the number will be the same as the number of models
       during bootstrapping and during fetching, either supplied by the server
       in the metadata, or calculated from the size of the response.

       @property {string} [state.sortKey=null] The model attribute to use for
       sorting.

       @property {-1|0|1} [state.order=-1] The order to use for sorting. Specify
       -1 for ascending order or 1 for descending order. If 0, no client side
       sorting will be done and the order query parameter will not be sent to
       the server during a fetch.
    */
    state: {
      firstPage: 1,
      lastPage: null,
      currentPage: null,
      pageSize: 25,
      totalPages: null,
      totalRecords: null,
      sortKey: null,
      order: -1
    },

    /**
       @property {"server"|"client"|"infinite"} [mode="server"] The mode of
       operations for this collection. `"server"` paginates on the server-side,
       `"client"` paginates on the client-side and `"infinite"` paginates on the
       server-side for APIs that do not support `totalRecords`.
    */
    mode: "server",

    /**
       A translation map to convert Backbone.PageableCollection state attributes
       to the query parameters accepted by your server API.

       You can override the default state by extending this class or specifying
       them in `options.queryParams` object hash to the constructor.

       @property {Object} queryParams
       @property {string} [queryParams.currentPage="page"]
       @property {string} [queryParams.pageSize="per_page"]
       @property {string} [queryParams.totalPages="total_pages"]
       @property {string} [queryParams.totalRecords="total_entries"]
       @property {string} [queryParams.sortKey="sort_by"]
       @property {string} [queryParams.order="order"]
       @property {string} [queryParams.directions={"-1": "asc", "1": "desc"}] A
       map for translating a Backbone.PageableCollection#state.order constant to
       the ones your server API accepts.
    */
    queryParams: {
      currentPage: "page",
      pageSize: "per_page",
      totalPages: "total_pages",
      totalRecords: "total_entries",
      sortKey: "sort_by",
      order: "order",
      directions: {
        "-1": "asc",
        "1": "desc"
      }
    },

    /**
       __CLIENT MODE ONLY__

       This collection is the internal storage for the bootstrapped or fetched
       models. You can use this if you want to operate on all the pages.

       @property {Backbone.Collection} fullCollection
    */

    /**
       Given a list of models or model attributues, bootstraps the full
       collection in client mode or infinite mode, or just the page you want in
       server mode.

       If you want to initialize a collection to a different state than the
       default, you can specify them in `options.state`. Any state parameters
       supplied will be merged with the default. If you want to change the
       default mapping from #state keys to your server API's query parameter
       names, you can specifiy an object hash in `option.queryParams`. Likewise,
       any mapping provided will be merged with the default. Lastly, all
       Backbone.Collection constructor options are also accepted.

       See:

       - Backbone.PageableCollection#state
       - Backbone.PageableCollection#queryParams
       - [Backbone.Collection#initialize](http://backbonejs.org/#Collection-constructor)

       @param {Array.<Object>} [models]

       @param {Object} [options]

       @param {function(*, *): number} [options.comparator] If specified, this
       comparator is set to the current page under server mode, or the #fullCollection
       otherwise.

       @param {boolean} [options.full] If `false` and either a
       `options.comparator` or `sortKey` is defined, the comparator is attached
       to the current page. Default is `true` under client or infinite mode and
       the comparator will be attached to the #fullCollection.

       @param {Object} [options.state] The state attributes overriding the defaults.

       @param {string} [options.state.sortKey] The model attribute to use for
       sorting. If specified instead of `options.comparator`, a comparator will
       be automatically created using this value, and optionally a sorting order
       specified in `options.state.order`. The comparator is then attached to
       the new collection instance.

       @param {-1|1} [options.state.order] The order to use for sorting. Specify
       -1 for ascending order and 1 for descending order.

       @param {Object} [options.queryParam]
    */
    constructor: function (models, options) {

      BBColProto.constructor.apply(this, arguments);

      options = options || {};

      var mode = this.mode = options.mode || this.mode || PageableProto.mode;

      var queryParams = _extend({}, PageableProto.queryParams, this.queryParams,
                                options.queryParams || {});

      queryParams.directions = _extend({},
                                       PageableProto.queryParams.directions,
                                       this.queryParams.directions,
                                       queryParams.directions || {});

      this.queryParams = queryParams;

      var state = this.state = _extend({}, PageableProto.state, this.state,
                                       options.state || {});

      state.currentPage = state.currentPage == null ?
        state.firstPage :
        state.currentPage;

      if (!_isArray(models)) models = models ? [models] : [];
      models = models.slice();

      if (mode != "server" && state.totalRecords == null && !_isEmpty(models)) {
        state.totalRecords = models.length;
      }

      this.switchMode(mode, _extend({fetch: false,
                                     resetState: false,
                                     models: models}, options));

      var comparator = options.comparator;

      if (state.sortKey && !comparator) {
        this.setSorting(state.sortKey, state.order, options);
      }

      if (mode != "server") {
        var fullCollection = this.fullCollection;

        if (comparator && options.full) {
          this.comparator = null;
          fullCollection.comparator = comparator;
        }

        if (options.full) fullCollection.sort();

        // make sure the models in the current page and full collection have the
        // same references
        if (models && !_isEmpty(models)) {
          this.reset(models, _extend({silent: true}, options));
          this.getPage(state.currentPage);
          models.splice.apply(models, [0, models.length].concat(this.models));
        }
      }

      this._initState = _clone(this.state);
    },

    /**
       Makes a Backbone.Collection that contains all the pages.

       @private
       @param {Array.<Object|Backbone.Model>} models
       @param {Object} options Options for Backbone.Collection constructor.
       @return {Backbone.Collection}
    */
    _makeFullCollection: function (models, options) {

      var properties = ["url", "model", "sync", "comparator"];
      var thisProto = this.constructor.prototype;
      var i, length, prop;

      var proto = {};
      for (i = 0, length = properties.length; i < length; i++) {
        prop = properties[i];
        if (!_isUndefined(thisProto[prop])) {
          proto[prop] = thisProto[prop];
        }
      }

      var fullCollection = new (Backbone.Collection.extend(proto))(models, options);

      for (i = 0, length = properties.length; i < length; i++) {
        prop = properties[i];
        if (this[prop] !== thisProto[prop]) {
          fullCollection[prop] = this[prop];
        }
      }

      return fullCollection;
    },

    /**
       Factory method that returns a Backbone event handler that responses to
       the `add`, `remove`, `reset`, and the `sort` events. The returned event
       handler will synchronize the current page collection and the full
       collection's models.

       @private

       @param {Backbone.PageableCollection} pageCol
       @param {Backbone.Collection} fullCol

       @return {function(string, Backbone.Model, Backbone.Collection, Object)}
       Collection event handler
    */
    _makeCollectionEventHandler: function (pageCol, fullCol) {

      return function collectionEventHandler (event, model, collection, options) {

        var handlers = pageCol._handlers;
        _each(_keys(handlers), function (event) {
          var handler = handlers[event];
          pageCol.off(event, handler);
          fullCol.off(event, handler);
        });

        var state = _clone(pageCol.state);
        var firstPage = state.firstPage;
        var currentPage = firstPage === 0 ?
          state.currentPage :
          state.currentPage - 1;
        var pageSize = state.pageSize;
        var pageStart = currentPage * pageSize, pageEnd = pageStart + pageSize;

        if (event == "add") {
          var pageIndex, fullIndex, addAt, colToAdd, options = options || {};
          if (collection == fullCol) {
            fullIndex = fullCol.indexOf(model);
            if (fullIndex >= pageStart && fullIndex < pageEnd) {
              colToAdd = pageCol;
              pageIndex = addAt = fullIndex - pageStart;
            }
          }
          else {
            pageIndex = pageCol.indexOf(model);
            fullIndex = pageStart + pageIndex;
            colToAdd = fullCol;
            var addAt = !_isUndefined(options.at) ?
              options.at + pageStart :
              fullIndex;
          }

          if (!options.onRemove) {
            ++state.totalRecords;
            delete options.onRemove;
          }

          pageCol.state = pageCol._checkState(state);

          if (colToAdd) {
            colToAdd.add(model, _extend({}, options || {}, {at: addAt}));
            var modelToRemove = pageIndex >= pageSize ?
              model :
              !_isUndefined(options.at) && addAt < pageEnd && pageCol.length > pageSize ?
              pageCol.at(pageSize) :
              null;
            if (modelToRemove) {
              runOnceAtLastHandler(collection, event, function () {
                pageCol.remove(modelToRemove, {onAdd: true});
              });
            }
          }
        }

        // remove the model from the other collection as well
        if (event == "remove") {
          if (!options.onAdd) {
            // decrement totalRecords and update totalPages and lastPage
            if (!--state.totalRecords) {
              state.totalRecords = null;
              state.totalPages = null;
            }
            else {
              var totalPages = state.totalPages = ceil(state.totalRecords / pageSize);
              state.lastPage = firstPage === 0 ? totalPages - 1 : totalPages || firstPage;
              if (state.currentPage > totalPages) state.currentPage = state.lastPage;
            }
            pageCol.state = pageCol._checkState(state);

            var nextModel, removedIndex = options.index;
            if (collection == pageCol) {
              if (nextModel = fullCol.at(pageEnd)) {
                runOnceAtLastHandler(pageCol, event, function () {
                  pageCol.push(nextModel, {onRemove: true});
                });
              }
              fullCol.remove(model);
            }
            else if (removedIndex >= pageStart && removedIndex < pageEnd) {
              if (nextModel = fullCol.at(pageEnd - 1)) {
                runOnceAtLastHandler(pageCol, event, function() {
                  pageCol.push(nextModel, {onRemove: true});
                });
              }
              pageCol.remove(model);
            }
          }
          else delete options.onAdd;
        }

        if (event == "reset") {
          options = collection;
          collection = model;

          // Reset that's not a result of getPage
          if (collection == pageCol && options.from == null &&
              options.to == null) {
            var head = fullCol.models.slice(0, pageStart);
            var tail = fullCol.models.slice(pageStart + pageCol.models.length);
            fullCol.reset(head.concat(pageCol.models).concat(tail), options);
          }
          else if (collection == fullCol) {
            if (!(state.totalRecords = fullCol.models.length)) {
              state.totalRecords = null;
              state.totalPages = null;
            }
            if (pageCol.mode == "client") {
              state.lastPage = state.currentPage = state.firstPage;
            }
            pageCol.state = pageCol._checkState(state);
            pageCol.reset(fullCol.models.slice(pageStart, pageEnd),
                          _extend({}, options, {parse: false}));
          }
        }

        if (event == "sort") {
          options = collection;
          collection = model;
          if (collection === fullCol) {
            pageCol.reset(fullCol.models.slice(pageStart, pageEnd),
                          _extend({}, options, {parse: false}));
          }
        }

        _each(_keys(handlers), function (event) {
          var handler = handlers[event];
          _each([pageCol, fullCol], function (col) {
            col.on(event, handler);
            var callbacks = col._events[event] || [];
            callbacks.unshift(callbacks.pop());
          });
        });
      };
    },

    /**
       Sanity check this collection's pagination states. Only perform checks
       when all the required pagination state values are defined and not null.
       If `totalPages` is undefined or null, it is set to `totalRecords` /
       `pageSize`. `lastPage` is set according to whether `firstPage` is 0 or 1
       when no error occurs.

       @private

       @throws {TypeError} If `totalRecords`, `pageSize`, `currentPage` or
       `firstPage` is not a finite integer.

       @throws {RangeError} If `pageSize`, `currentPage` or `firstPage` is out
       of bounds.

       @return {Object} Returns the `state` object if no error was found.
    */
    _checkState: function (state) {

      var mode = this.mode;
      var links = this.links;
      var totalRecords = state.totalRecords;
      var pageSize = state.pageSize;
      var currentPage = state.currentPage;
      var firstPage = state.firstPage;
      var totalPages = state.totalPages;

      if (totalRecords != null && pageSize != null && currentPage != null &&
          firstPage != null && (mode == "infinite" ? links : true)) {

        totalRecords = finiteInt(totalRecords, "totalRecords");
        pageSize = finiteInt(pageSize, "pageSize");
        currentPage = finiteInt(currentPage, "currentPage");
        firstPage = finiteInt(firstPage, "firstPage");

        if (pageSize < 1) {
          throw new RangeError("`pageSize` must be >= 1");
        }

        totalPages = state.totalPages = ceil(totalRecords / pageSize);

        if (firstPage < 0 || firstPage > 1) {
          throw new RangeError("`firstPage must be 0 or 1`");
        }

        state.lastPage = firstPage === 0 ? max(0, totalPages - 1) : totalPages || firstPage;

        if (mode == "infinite") {
          if (!links[currentPage + '']) {
            throw new RangeError("No link found for page " + currentPage);
          }
        }
        else if (currentPage < firstPage ||
                 (totalPages > 0 &&
                  (firstPage ? currentPage > totalPages : currentPage >= totalPages))) {
          throw new RangeError("`currentPage` must be firstPage <= currentPage " +
                               (firstPage ? ">" : ">=") +
                               " totalPages if " + firstPage + "-based. Got " +
                               currentPage + '.');
        }
      }

      return state;
    },

    /**
       Change the page size of this collection.

       Under most if not all circumstances, you should call this method to
       change the page size of a pageable collection because it will keep the
       pagination state sane. By default, the method will recalculate the
       current page number to one that will retain the current page's models
       when increasing the page size. When decreasing the page size, this method
       will retain the last models to the current page that will fit into the
       smaller page size.

       If `options.first` is true, changing the page size will also reset the
       current page back to the first page instead of trying to be smart.

       For server mode operations, changing the page size will trigger a #fetch
       and subsequently a `reset` event.

       For client mode operations, changing the page size will `reset` the
       current page by recalculating the current page boundary on the client
       side.

       If `options.fetch` is true, a fetch can be forced if the collection is in
       client mode.

       @param {number} pageSize The new page size to set to #state.
       @param {Object} [options] {@link #fetch} options.
       @param {boolean} [options.first=false] Reset the current page number to
       the first page if `true`.
       @param {boolean} [options.fetch] If `true`, force a fetch in client mode.

       @throws {TypeError} If `pageSize` is not a finite integer.
       @throws {RangeError} If `pageSize` is less than 1.

       @chainable
       @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
       from fetch or this.
    */
    setPageSize: function (pageSize, options) {
      pageSize = finiteInt(pageSize, "pageSize");

      options = options || {first: false};

      var state = this.state;
      var totalPages = ceil(state.totalRecords / pageSize);
      var currentPage = totalPages ?
          max(state.firstPage, floor(totalPages * state.currentPage / state.totalPages)) :
        state.firstPage;

      state = this.state = this._checkState(_extend({}, state, {
        pageSize: pageSize,
        currentPage: options.first ? state.firstPage : currentPage,
        totalPages: totalPages
      }));

      return this.getPage(state.currentPage, _omit(options, ["first"]));
    },

    /**
       Switching between client, server and infinite mode.

       If switching from client to server mode, the #fullCollection is emptied
       first and then deleted and a fetch is immediately issued for the current
       page from the server. Pass `false` to `options.fetch` to skip fetching.

       If switching to infinite mode, and if `options.models` is given for an
       array of models, #links will be populated with a URL per page, using the
       default URL for this collection.

       If switching from server to client mode, all of the pages are immediately
       refetched. If you have too many pages, you can pass `false` to
       `options.fetch` to skip fetching.

       If switching to any mode from infinite mode, the #links will be deleted.

       @param {"server"|"client"|"infinite"} [mode] The mode to switch to.

       @param {Object} [options]

       @param {boolean} [options.fetch=true] If `false`, no fetching is done.

       @param {boolean} [options.resetState=true] If 'false', the state is not
       reset, but checked for sanity instead.

       @chainable
       @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
       from fetch or this if `options.fetch` is `false`.
    */
    switchMode: function (mode, options) {

      if (!_contains(["server", "client", "infinite"], mode)) {
        throw new TypeError('`mode` must be one of "server", "client" or "infinite"');
      }

      options = options || {fetch: true, resetState: true};

      var state = this.state = options.resetState ?
        _clone(this._initState) :
        this._checkState(_extend({}, this.state));

      this.mode = mode;

      var self = this;
      var fullCollection = this.fullCollection;
      var handlers = this._handlers = this._handlers || {}, handler;
      if (mode != "server" && !fullCollection) {
        fullCollection = this._makeFullCollection(options.models || [], options);
        fullCollection.pageableCollection = this;
        this.fullCollection = fullCollection;
        var allHandler = this._makeCollectionEventHandler(this, fullCollection);
        _each(["add", "remove", "reset", "sort"], function (event) {
          handlers[event] = handler = _.bind(allHandler, {}, event);
          self.on(event, handler);
          fullCollection.on(event, handler);
        });
        fullCollection.comparator = this._fullComparator;
      }
      else if (mode == "server" && fullCollection) {
        _each(_keys(handlers), function (event) {
          handler = handlers[event];
          self.off(event, handler);
          fullCollection.off(event, handler);
        });
        delete this._handlers;
        this._fullComparator = fullCollection.comparator;
        delete this.fullCollection;
      }

      if (mode == "infinite") {
        var links = this.links = {};
        var firstPage = state.firstPage;
        var totalPages = ceil(state.totalRecords / state.pageSize);
        var lastPage = firstPage === 0 ? max(0, totalPages - 1) : totalPages || firstPage;
        for (var i = state.firstPage; i <= lastPage; i++) {
          links[i] = this.url;
        }
      }
      else if (this.links) delete this.links;

      return options.fetch ?
        this.fetch(_omit(options, "fetch", "resetState")) :
        this;
    },

    /**
       @return {boolean} `true` if this collection can page backward, `false`
       otherwise.
    */
    hasPreviousPage: function () {
      var state = this.state;
      var currentPage = state.currentPage;
      if (this.mode != "infinite") return currentPage > state.firstPage;
      return !!this.links[currentPage - 1];
    },

    /**
       Delegates to hasPreviousPage.
    */
    hasPrevious: function () {
      var msg = "hasPrevious has been deprecated, use hasPreviousPage instead";
      typeof console != 'undefined' && console.warn && console.warn(msg);

      return this.hasPreviousPage();
    },

    /**
       @return {boolean} `true` if this collection can page forward, `false`
       otherwise.
    */
    hasNextPage: function () {
      var state = this.state;
      var currentPage = this.state.currentPage;
      if (this.mode != "infinite") return currentPage < state.lastPage;
      return !!this.links[currentPage + 1];
    },

    /**
       Delegates to hasNextPage.
    */
    hasNext: function () {
      var msg = "hasNext has been deprecated, use hasNextPage instead";
      typeof console != 'undefined' && console.warn && console.warn(msg);

      return this.hasNextPage();
    },

    /**
       Fetch the first page in server mode, or reset the current page of this
       collection to the first page in client or infinite mode.

       @param {Object} options {@link #getPage} options.

       @chainable
       @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
       from fetch or this.
    */
    getFirstPage: function (options) {
      return this.getPage("first", options);
    },

    /**
       Fetch the previous page in server mode, or reset the current page of this
       collection to the previous page in client or infinite mode.

       @param {Object} options {@link #getPage} options.

       @chainable
       @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
       from fetch or this.
    */
    getPreviousPage: function (options) {
      return this.getPage("prev", options);
    },

    /**
       Fetch the next page in server mode, or reset the current page of this
       collection to the next page in client mode.

       @param {Object} options {@link #getPage} options.

       @chainable
       @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
       from fetch or this.
    */
    getNextPage: function (options) {
      return this.getPage("next", options);
    },

    /**
       Fetch the last page in server mode, or reset the current page of this
       collection to the last page in client mode.

       @param {Object} options {@link #getPage} options.

       @chainable
       @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
       from fetch or this.
    */
    getLastPage: function (options) {
      return this.getPage("last", options);
    },

    /**
       Given a page index, set #state.currentPage to that index. If this
       collection is in server mode, fetch the page using the updated state,
       otherwise, reset the current page of this collection to the page
       specified by `index` in client mode. If `options.fetch` is true, a fetch
       can be forced in client mode before resetting the current page. Under
       infinite mode, if the index is less than the current page, a reset is
       done as in client mode. If the index is greater than the current page
       number, a fetch is made with the results **appended** to #fullCollection.
       The current page will then be reset after fetching.

       @param {number|string} index The page index to go to, or the page name to
       look up from #links in infinite mode.
       @param {Object} [options] {@link #fetch} options or
       [reset](http://backbonejs.org/#Collection-reset) options for client mode
       when `options.fetch` is `false`.
       @param {boolean} [options.fetch=false] If true, force a {@link #fetch} in
       client mode.

       @throws {TypeError} If `index` is not a finite integer under server or
       client mode, or does not yield a URL from #links under infinite mode.

       @throws {RangeError} If `index` is out of bounds.

       @chainable
       @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
       from fetch or this.
    */
    getPage: function (index, options) {

      var mode = this.mode, fullCollection = this.fullCollection;

      options = options || {fetch: false};

      var state = this.state,
      firstPage = state.firstPage,
      currentPage = state.currentPage,
      lastPage = state.lastPage,
      pageSize = state.pageSize;

      var pageNum = index;
      switch (index) {
        case "first": pageNum = firstPage; break;
        case "prev": pageNum = currentPage - 1; break;
        case "next": pageNum = currentPage + 1; break;
        case "last": pageNum = lastPage; break;
        default: pageNum = finiteInt(index, "index");
      }

      this.state = this._checkState(_extend({}, state, {currentPage: pageNum}));

      options.from = currentPage, options.to = pageNum;

      var pageStart = (firstPage === 0 ? pageNum : pageNum - 1) * pageSize;
      var pageModels = fullCollection && fullCollection.length ?
        fullCollection.models.slice(pageStart, pageStart + pageSize) :
        [];
      if ((mode == "client" || (mode == "infinite" && !_isEmpty(pageModels))) &&
          !options.fetch) {
        this.reset(pageModels, _omit(options, "fetch"));
        return this;
      }

      if (mode == "infinite") options.url = this.links[pageNum];

      return this.fetch(_omit(options, "fetch"));
    },

    /**
       Fetch the page for the provided item offset in server mode, or reset the current page of this
       collection to the page for the provided item offset in client mode.

       @param {Object} options {@link #getPage} options.

       @chainable
       @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
       from fetch or this.
    */
    getPageByOffset: function (offset, options) {
      if (offset < 0) {
        throw new RangeError("`offset must be > 0`");
      }
      offset = finiteInt(offset);

      var page = floor(offset / this.state.pageSize);
      if (this.state.firstPage !== 0) page++;
      if (page > this.state.lastPage) page = this.state.lastPage;
      return this.getPage(page, options);
    },

    /**
       Overidden to make `getPage` compatible with Zepto.

       @param {string} method
       @param {Backbone.Model|Backbone.Collection} model
       @param {Object} [options]

       @return {XMLHttpRequest}
    */
    sync: function (method, model, options) {
      var self = this;
      if (self.mode == "infinite") {
        var success = options.success;
        var currentPage = self.state.currentPage;
        options.success = function (resp, status, xhr) {
          var links = self.links;
          var newLinks = self.parseLinks(resp, _extend({xhr: xhr}, options));
          if (newLinks.first) links[self.state.firstPage] = newLinks.first;
          if (newLinks.prev) links[currentPage - 1] = newLinks.prev;
          if (newLinks.next) links[currentPage + 1] = newLinks.next;
          if (success) success(resp, status, xhr);
        };
      }

      return (BBColProto.sync || Backbone.sync).call(self, method, model, options);
    },

    /**
       Parse pagination links from the server response. Only valid under
       infinite mode.

       Given a response body and a XMLHttpRequest object, extract pagination
       links from them for infinite paging.

       This default implementation parses the RFC 5988 `Link` header and extract
       3 links from it - `first`, `prev`, `next`. Any subclasses overriding this
       method __must__ return an object hash having only the keys
       above. However, simply returning a `next` link or an empty hash if there
       are no more links should be enough for most implementations.

       @param {*} resp The deserialized response body.
       @param {Object} [options]
       @param {XMLHttpRequest} [options.xhr] The XMLHttpRequest object for this
       response.
       @return {Object}
    */
    parseLinks: function (resp, options) {
      var links = {};
      var linkHeader = options.xhr.getResponseHeader("Link");
      if (linkHeader) {
        var relations = ["first", "prev", "next"];
        _each(linkHeader.split(","), function (linkValue) {
          var linkParts = linkValue.split(";");
          var url = linkParts[0].replace(URL_TRIM_RE, '');
          var params = linkParts.slice(1);
          _each(params, function (param) {
            var paramParts = param.split("=");
            var key = paramParts[0].replace(PARAM_TRIM_RE, '');
            var value = paramParts[1].replace(PARAM_TRIM_RE, '');
            if (key == "rel" && _contains(relations, value)) links[value] = url;
          });
        });
      }

      return links;
    },

    /**
       Parse server response data.

       This default implementation assumes the response data is in one of two
       structures:

           [
             {}, // Your new pagination state
             [{}, ...] // An array of JSON objects
           ]

       Or,

           [{}] // An array of JSON objects

       The first structure is the preferred form because the pagination states
       may have been updated on the server side, sending them down again allows
       this collection to update its states. If the response has a pagination
       state object, it is checked for errors.

       The second structure is the
       [Backbone.Collection#parse](http://backbonejs.org/#Collection-parse)
       default.

       **Note:** this method has been further simplified since 1.1.7. While
       existing #parse implementations will continue to work, new code is
       encouraged to override #parseState and #parseRecords instead.

       @param {Object} resp The deserialized response data from the server.
       @param {Object} the options for the ajax request

       @return {Array.<Object>} An array of model objects
    */
    parse: function (resp, options) {
      var newState = this.parseState(resp, _clone(this.queryParams), _clone(this.state), options);
      if (newState) this.state = this._checkState(_extend({}, this.state, newState));
      return this.parseRecords(resp, options);
    },

    /**
       Parse server response for server pagination state updates. Not applicable
       under infinite mode.

       This default implementation first checks whether the response has any
       state object as documented in #parse. If it exists, a state object is
       returned by mapping the server state keys to this pageable collection
       instance's query parameter keys using `queryParams`.

       It is __NOT__ neccessary to return a full state object complete with all
       the mappings defined in #queryParams. Any state object resulted is merged
       with a copy of the current pageable collection state and checked for
       sanity before actually updating. Most of the time, simply providing a new
       `totalRecords` value is enough to trigger a full pagination state
       recalculation.

           parseState: function (resp, queryParams, state, options) {
             return {totalRecords: resp.total_entries};
           }

       If you want to use header fields use:

           parseState: function (resp, queryParams, state, options) {
               return {totalRecords: options.xhr.getResponseHeader("X-total")};
           }

       This method __MUST__ return a new state object instead of directly
       modifying the #state object. The behavior of directly modifying #state is
       undefined.

       @param {Object} resp The deserialized response data from the server.
       @param {Object} queryParams A copy of #queryParams.
       @param {Object} state A copy of #state.
       @param {Object} [options] The options passed through from
       `parse`. (backbone >= 0.9.10 only)

       @return {Object} A new (partial) state object.
     */
    parseState: function (resp, queryParams, state, options) {
      if (resp && resp.length === 2 && _isObject(resp[0]) && _isArray(resp[1])) {

        var newState = _clone(state);
        var serverState = resp[0];

        _each(_pairs(_omit(queryParams, "directions")), function (kvp) {
          var k = kvp[0], v = kvp[1];
          var serverVal = serverState[v];
          if (!_isUndefined(serverVal) && !_.isNull(serverVal)) newState[k] = serverState[v];
        });

        if (serverState.order) {
          newState.order = _invert(queryParams.directions)[serverState.order] * 1;
        }

        return newState;
      }
    },

    /**
       Parse server response for an array of model objects.

       This default implementation first checks whether the response has any
       state object as documented in #parse. If it exists, the array of model
       objects is assumed to be the second element, otherwise the entire
       response is returned directly.

       @param {Object} resp The deserialized response data from the server.
       @param {Object} [options] The options passed through from the
       `parse`. (backbone >= 0.9.10 only)

       @return {Array.<Object>} An array of model objects
     */
    parseRecords: function (resp, options) {
      if (resp && resp.length === 2 && _isObject(resp[0]) && _isArray(resp[1])) {
        return resp[1];
      }

      return resp;
    },

    /**
       Fetch a page from the server in server mode, or all the pages in client
       mode. Under infinite mode, the current page is refetched by default and
       then reset.

       The query string is constructed by translating the current pagination
       state to your server API query parameter using #queryParams. The current
       page will reset after fetch.

       @param {Object} [options] Accepts all
       [Backbone.Collection#fetch](http://backbonejs.org/#Collection-fetch)
       options.

       @return {XMLHttpRequest}
    */
    fetch: function (options) {

      options = options || {};

      var state = this._checkState(this.state);

      var mode = this.mode;

      if (mode == "infinite" && !options.url) {
        options.url = this.links[state.currentPage];
      }

      var data = options.data || {};

      // dedup query params
      var url = _result(options, "url") || _result(this, "url") || '';
      var qsi = url.indexOf('?');
      if (qsi != -1) {
        _extend(data, queryStringToParams(url.slice(qsi + 1)));
        url = url.slice(0, qsi);
      }

      options.url = url;
      options.data = data;

      // map params except directions
      var queryParams = this.mode == "client" ?
        _pick(this.queryParams, "sortKey", "order") :
        _omit(_pick(this.queryParams, _keys(PageableProto.queryParams)),
              "directions");

      var i, kvp, k, v, kvps = _pairs(queryParams), thisCopy = _clone(this);
      for (i = 0; i < kvps.length; i++) {
        kvp = kvps[i], k = kvp[0], v = kvp[1];
        v = _isFunction(v) ? v.call(thisCopy) : v;
        if (state[k] != null && v != null) {
          data[v] = state[k];
        }
      }

      // fix up sorting parameters
      if (state.sortKey && state.order) {
        data[queryParams.order] = this.queryParams.directions[state.order + ""];
      }
      else if (!state.sortKey) delete data[queryParams.order];

      // map extra query parameters
      var extraKvps = _pairs(_omit(this.queryParams,
                                   _keys(PageableProto.queryParams)));
      for (i = 0; i < extraKvps.length; i++) {
        kvp = extraKvps[i];
        v = kvp[1];
        v = _isFunction(v) ? v.call(thisCopy) : v;
        if (v != null) data[kvp[0]] = v;
      }

      if (mode != "server") {
        var self = this, fullCol = this.fullCollection;
        var success = options.success;
        options.success = function (col, resp, opts) {

          // make sure the caller's intent is obeyed
          opts = opts || {};
          if (_isUndefined(options.silent)) delete opts.silent;
          else opts.silent = options.silent;

          var models = col.models;
          if (mode == "client") fullCol.reset(models, opts);
          else {
            fullCol.add(models, _extend({at: fullCol.length},
                                        _extend(opts, {parse: false})));
            self.trigger("reset", self, opts);
          }

          if (success) success(col, resp, opts);
        };

        // silent the first reset from backbone
        return BBColProto.fetch.call(this, _extend({}, options, {silent: true}));
      }

      return BBColProto.fetch.call(this, options);
    },

    /**
       Convenient method for making a `comparator` sorted by a model attribute
       identified by `sortKey` and ordered by `order`.

       Like a Backbone.Collection, a Backbone.PageableCollection will maintain
       the __current page__ in sorted order on the client side if a `comparator`
       is attached to it. If the collection is in client mode, you can attach a
       comparator to #fullCollection to have all the pages reflect the global
       sorting order by specifying an option `full` to `true`. You __must__ call
       `sort` manually or #fullCollection.sort after calling this method to
       force a resort.

       While you can use this method to sort the current page in server mode,
       the sorting order may not reflect the global sorting order due to the
       additions or removals of the records on the server since the last
       fetch. If you want the most updated page in a global sorting order, it is
       recommended that you set #state.sortKey and optionally #state.order, and
       then call #fetch.

       @protected

       @param {string} [sortKey=this.state.sortKey] See `state.sortKey`.
       @param {number} [order=this.state.order] See `state.order`.
       @param {(function(Backbone.Model, string): Object) | string} [sortValue] See #setSorting.

       See [Backbone.Collection.comparator](http://backbonejs.org/#Collection-comparator).
    */
    _makeComparator: function (sortKey, order, sortValue) {
      var state = this.state;

      sortKey = sortKey || state.sortKey;
      order = order || state.order;

      if (!sortKey || !order) return;

      if (!sortValue) sortValue = function (model, attr) {
        return model.get(attr);
      };

      return function (left, right) {
        var l = sortValue(left, sortKey), r = sortValue(right, sortKey), t;
        if (order === 1) t = l, l = r, r = t;
        if (l === r) return 0;
        else if (l < r) return -1;
        return 1;
      };
    },

    /**
       Adjusts the sorting for this pageable collection.

       Given a `sortKey` and an `order`, sets `state.sortKey` and
       `state.order`. A comparator can be applied on the client side to sort in
       the order defined if `options.side` is `"client"`. By default the
       comparator is applied to the #fullCollection. Set `options.full` to
       `false` to apply a comparator to the current page under any mode. Setting
       `sortKey` to `null` removes the comparator from both the current page and
       the full collection.

       If a `sortValue` function is given, it will be passed the `(model,
       sortKey)` arguments and is used to extract a value from the model during
       comparison sorts. If `sortValue` is not given, `model.get(sortKey)` is
       used for sorting.

       @chainable

       @param {string} sortKey See `state.sortKey`.
       @param {number} [order=this.state.order] See `state.order`.
       @param {Object} [options]
       @param {"server"|"client"} [options.side] By default, `"client"` if
       `mode` is `"client"`, `"server"` otherwise.
       @param {boolean} [options.full=true]
       @param {(function(Backbone.Model, string): Object) | string} [options.sortValue]
    */
    setSorting: function (sortKey, order, options) {

      var state = this.state;

      state.sortKey = sortKey;
      state.order = order = order || state.order;

      var fullCollection = this.fullCollection;

      var delComp = false, delFullComp = false;

      if (!sortKey) delComp = delFullComp = true;

      var mode = this.mode;
      options = _extend({side: mode == "client" ? mode : "server", full: true},
                        options);

      var comparator = this._makeComparator(sortKey, order, options.sortValue);

      var full = options.full, side = options.side;

      if (side == "client") {
        if (full) {
          if (fullCollection) fullCollection.comparator = comparator;
          delComp = true;
        }
        else {
          this.comparator = comparator;
          delFullComp = true;
        }
      }
      else if (side == "server" && !full) {
        this.comparator = comparator;
      }

      if (delComp) this.comparator = null;
      if (delFullComp && fullCollection) fullCollection.comparator = null;

      return this;
    }

  });

  var PageableProto = PageableCollection.prototype;

  return PageableCollection;

});

define('lib/truthStatement',["jquery"], function ($) {
    "use strict";
    var TruthStatement = function (statement, conjunction) {
        this.tokens = null;
        this.key = null;
        this.val = null;
        this.operator = null;
        this.conjunction = null;
        //note: order matters here. Put the <>, <=, !=, and <> before the
        //      <, >, and = in the regex. Also, English words need to be
        //      padded with spaces.
        this.validOperators = ['>=', '<=', '<>', '>', '<', '!=', '=', ' in ',
                ' like ', ' contains ', ' startswith ', ' endswith '
            ];
        this.validConjunctions = ['and', 'or'];

        this.parseStatement = function (statement, conjunction) {
            if (statement === "*") {
                this.operator = "*";
                return;
            }
            this.setTokens(statement);
            this.key = this.tokens[0].trim();
            this.setOperator(this.tokens[1].trim());
            this.val = this.tokens[2].trim();
            this.setConjunction(conjunction);
            this.compileSQLToJavascript();
        };

        this.setTokens = function (statement) {
            //regex that splits at *first valid operator:
            var r = new RegExp('([\\S\\s]*?)(' + this.validOperators.join('|') + ')([\\S\\s]*)'),
                tokens = statement.match(r);
            tokens.shift(); //remove top entry
            if (tokens.length != 3) {
                throw new Error("Statement should parse to three tokens");
            }
            this.tokens = tokens;
        };

        this.setOperator = function (operator) {
            operator = operator.toLowerCase().trim();
            // be sure to account for padding in the validOperator list:
            if (this.validOperators.indexOf(operator) == -1 &&
                    this.validOperators.indexOf(' ' + operator + ' ') == -1) {
                throw new Error("Operator must be one of the following: " +
                    this.validOperators.join(', '));
            }
            this.operator = operator;
        };

        this.setConjunction = function (conjunction) {
            conjunction = conjunction.toLowerCase().trim();
            if (this.validConjunctions.indexOf(conjunction) == -1) {
                throw new Error("Conjunction must be 'AND' or 'OR' (case insensitive)");
            }
            this.conjunction = conjunction;
        };

        this._trimCharacter = function (val, character) {
            if (val[0] == character) {
                val = val.substring(1);
            }
            if (val[val.length - 1] == character) {
                val = val.substring(0, val.length - 1);
            }
            return val;
        };

        this.trimSingleQuotes = function (val) {
            return this._trimCharacter(val, "'");
        };
        this.trimPercentages = function (val) {
            return this._trimCharacter(val, "%");
        };
        this.trimParentheses = function (val) {
            val = this._trimCharacter(val, ")");
            return this._trimCharacter(val, "(");
        };

        this.compileSQLToJavascript = function () {
            var i = 0,
                endsWith = false,
                startsWith = false;
            if (this.operator == 'in') {
                this.val = this.trimParentheses(this.val);
                this.val = this.val.split(',');
                for (i = 0; i < this.val.length; i++) {
                    this.val[i] = this.trimSingleQuotes(this.val[i].trim());
                }
            } else if (this.operator == 'like') {
                this.val = this.trimSingleQuotes(this.val);
                startsWith = this.val[this.val.length - 1] == '%';
                endsWith = this.val[0] == '%';
                this.val = this.trimPercentages(this.val);
                if (endsWith && startsWith) {
                    this.operator = 'contains';
                } else if (startsWith) {
                    this.operator = 'startswith';
                } else {
                    this.operator = 'endswith';
                }
            } else {
                this.val = this.trimSingleQuotes(this.val);
            }
        };

        this.truthTest = function (model) {
            if (this.operator == '*') {
                return true;
            }
            var returnVal = false,
                modelVal = model.get(this.key),
                idx = -1;
            if (typeof modelVal === 'undefined' || modelVal == null) {
                return false;
            }
            modelVal = this.convertType(modelVal);
            if (this.operator == '=') {
                returnVal = modelVal == this.val;
            } else if (this.operator == '>') {
                returnVal = modelVal > this.val;
            } else if (this.operator == '>=') {
                returnVal = modelVal >= this.val;
            } else if (this.operator == '<') {
                returnVal = modelVal < this.val;
            } else if (this.operator == '<=') {
                returnVal = modelVal <= this.val;
            } else if (['<>', '!='].indexOf(this.operator) != -1) {
                returnVal = modelVal != this.val;
            } else if (this.operator == 'in') {
                returnVal = this.val.indexOf(modelVal) != -1;
            } else if (this.operator == 'contains') {
                returnVal = modelVal.indexOf(this.val) != -1;
            } else if (this.operator == 'startswith') {
                returnVal = modelVal.indexOf(this.val) == 0;
            } else if (this.operator == 'endswith') {
                idx = modelVal.length - this.val.length;
                returnVal =  modelVal.indexOf(this.val, idx) !== -1;
            }
            return returnVal;
        };

        this.convertType = function (modelVal) {
            var i = 0,
                isNumber = typeof modelVal == "number",
                isString = typeof modelVal == "string",
                converter = isNumber ? this.parseNum : this.parseString;
            if ($.isArray(this.val)) {
                for (i = 0; i < this.val.length; i++) {
                    this.val[i] = converter(this.val[i]);
                }
            } else {
                this.val = converter(this.val);
            }
            if (isString) {
                modelVal = this.parseString(modelVal);
            }
            return modelVal;
        };

        this.parseNum = function (val) {
            return parseInt(val, 10);
        };

        this.parseString = function (val) {
            return val.toString().toLowerCase();
        };

        this.debug = function () {
            console.log("key: ", this.key);
            console.log("operator: ", this.operator);
            console.log("value: ", this.val);
            console.log("conjunction: ", this.conjunction);
            console.log("tokens: ", this.tokens);
        };

        //initialize if user passed in arguments:
        if (statement != null && conjunction != null) {
            this.parseStatement(statement, conjunction);
        }
    };

    return TruthStatement;
});
define('lib/sqlParser',["lib/truthStatement"], function (TruthStatement) {
    "use strict";
    var SqlParser = function (sqlString) {
            var i = 0;
            this.statements = [];
            this.sql = null;
            this.failureFlag = 0;
            this.failureMessage = '';
            this.init = function (sqlString) {
                this.sql = sqlString.toLowerCase().replace("where", "");
                var raw = this.sql.split(/(\s+and\s+|\s+or\s+)/),
                    truthStatement = null;
                //add an "and" to the top of the stack to make processing consistent:
                raw.unshift("and");
                for (i = 0; i < raw.length; i += 2) {
                    raw[i] = raw[i].trim();
                    /*
                     * Fails silently.
                     * TODO: have UI check for failureFlag / Message and give
                     *       user feedback.
                     */
                    try {
                        truthStatement = new TruthStatement(raw[i + 1], raw[i]);
                        this.statements.push(truthStatement);
                    } catch (e) {
                        this.failureFlag = 1;
                        this.failureMessage = "error parsing truth statement: " +  e;
                    }
                }
            };

            this.checkModel = function (model) {
                var i = 0,
                    truthVal = !this.failureFlag,
                    s;
                for (i = 0; i < this.statements.length; i++) {
                    s = this.statements[i];
                    if (s.conjunction == 'and') {
                        truthVal = truthVal && s.truthTest(model);
                    } else {
                        truthVal = truthVal || s.truthTest(model);
                    }
                }
                return truthVal;
            };
            this.init(sqlString);
        };
    return SqlParser;
});
define('collections/baseMixin',["jquery", "lib/sqlParser", "underscore", "backbone"], function ($, SqlParser, _, Backbone) {
    "use strict";
    return {
        dataTypes: {
            'string': 'Text',
            'float': 'Number',
            'integer': 'Number',
            'boolean': 'Checkbox',
            'geojson': 'TextArea',
            'memo': 'TextArea',
            'json': 'TextArea'
        },
        applyFilter: function (sql) {
            var sqlParser = new SqlParser(sql),
                count = 0,
                hidden = false;
            this.each(function (item) {
                if (sqlParser.checkModel(item)) {
                    item.set("isVisible", true);
                } else {
                    item.set("isVisible", false);
                    ++count;
                }
            });
            if (count == this.models.length) {
                hidden = true;
            }
            this.trigger("filtered", { doNotRender: hidden });
        },
        clearFilter: function () {
            this.each(function (item) {
                item.set("isVisible", true);
            });
            this.trigger("filtered", { doNotRender: false });
        },
        getVisibleModels: function () {
            var models = [];
            this.each(function (item) {
                if (item.get("isVisible")) {
                    models.push(item);
                }
            });
            return models;
        },
        setServerQuery: function (parameters) {
            // this.query = "WHERE ";
            // var that = this;
            // _.each(parameters, function (parameter, index) {
            //     if (index > 0) {
            //         that.query += " and ";
            //     }
            //     if (parameter.operation == "=") {
            //         that.query += parameter.name + " = " + parameter.value;
            //     } else {
            //         that.query += parameter.name + " LIKE '%" + parameter.value + "%'";
            //     }
            // });
            this.query = parameters;

        },
        clearServerQuery: function () {
            this.query = null;
        },
        fetch: function (options) {
            //console.log(this.query);
            //override fetch and append query parameters:
            if (this.query) {
                // apply some additional options to the fetch:
                options = options || {};
                options.data = options.data || {};
                options.data = { query: this.query };
            }
            return Backbone.Collection.prototype.fetch.call(this, options);
        },
        fetchFilterMetadata: function () {
            //issues an options query:
            var that = this;
            $.ajax({
                url: this.url + '.json',
                type: 'OPTIONS',
                data: { _method: 'OPTIONS' },
                success: function (data) {
                    console.log("success");
                    that.generateFilterSchema(data.filters);
                }
            });
        },
        generateFilterSchema: function (metadata) {
            var key, val;
            this.filterSchema = {};
            //https://github.com/powmedia/backbone-forms#schema-definition
            for (key in metadata) {
                val = metadata[key];
                //console.log(key);
                this.filterSchema[key] = {
                    type: this.dataTypes[val.type] || 'Text',
                    title: val.label || key,
                };
                if (val.type.indexOf("json") != -1) {
                    this.filterSchema[key].validators = [ this.validatorFunction ];
                }
            }
            this.trigger("filter-form-updated", this.filterSchema);
        }
    };
});

define('collections/basePageable',[
    "underscore",
    "backbone-pageable",
    "collections/baseMixin"
], function (_, BackbonePageable, BaseMixin) {
    "use strict";
    var PageableCollection = BackbonePageable.extend({
        getDataType: function () {
            return this.key;
        },
        getTitle: function () {
            return this.name || "Sites";
        },
        fillColor: "#ed867d",
        size: 23,
        events: {
            'click #toolbar-search': 'doSearch',
            'click #toolbar-clear': 'clearSearch'
        },
        state: {
            currentPage: 1,
            pageSize: 150,
            sortKey: 'id',
            order: -1 // 1 for descending, -1 for ascending
        },

        //  See documentation:
        //  https://github.com/backbone-paginator/backbone-pageable
        queryParams: {
            totalPages: null,
            totalRecords: null,
            sortKey: "ordering",
            pageSize: "page_size",
            currentPage: "page"
        },

        parseState: function (response, queryParams, state, options) {
            return {
                totalRecords: response.count
            };
        },

        parseRecords: function (response, options) {
            return response.results;
        },

        doSearch: function (term, projectID) {
            /*
             * NOTE
             *   - app.js is listening for the search-requested event
             *   - Please see localground/apps/site/api/tests/sql_parse_tests.py
             *     for samples of valid queries.
             */

            this.query ="WHERE name like %" + term +
                        "% OR caption like %" + term +
                        "% OR attribution like %" + term +
                        "% OR owner like %" + term +
                        "% OR tags contains (" + term + ")";
            this.query += " AND project = " + projectID;
            this.fetch({ reset: true });
        },

        clearSearch: function(projectID){
            this.query = "WHERE project = " + projectID;
            this.fetch({ reset: true });
        }

    });
    _.extend(PageableCollection.prototype, BaseMixin);

    // and finally, need to override fetch from BaseMixin in a way that calls the parent class
    _.extend(PageableCollection.prototype, {
        fetch: function (options) {
            //override fetch and append query parameters:
            if (this.query) {
                // apply some additional options to the fetch:
                options = options || {};
                options.data = options.data || {};
                options.data = { query: this.query };
            }
            return BackbonePageable.prototype.fetch.call(this, options);
        }
    });
    return PageableCollection;
});

define(
    'collections/projectUsers',["models/projectUser", "collections/basePageable"],
    function (ProjectUser, BasePageable) {
        "use strict";
        /**
         * @class localground.collections.Projects
         */
        var ProjectUsers = BasePageable.extend({
            model: ProjectUser,
            name: 'ProjectUsers',
            initialize: function (recs, opts) {
                if (!opts.id) {
                    alert("The ProjectUsers collection requires a url parameter upon initialization");
                    return;
                }
                // This had to be made dynamic because there are different users
                // for each project
                this.url = '/api/0/projects/' + opts.id + '/users/';
                BasePageable.prototype.initialize.apply(this, arguments);
            }
        });
        return ProjectUsers;
    }
);

define(
    'models/project',["underscore", "models/base", "models/projectUser", "collections/projectUsers"],
    function (_, Base, ProjectUser, ProjectUsers) {
        "use strict";
        /**
         * A Backbone Model class for the Project datatype.
         * @class Project
         * @see <a href="//localground.org/api/0/projects/">//localground.org/api/0/projects/</a>
         */
        var Project = Base.extend({
            defaults: _.extend({}, Base.prototype.defaults, {
                isActive: false,
                isVisible: false,
                checked: false
            }),
            urlRoot: "/api/0/projects/",
            initialize: function (data, opts) {
                if (this.get("id")) {
                    this.projectUsers = new ProjectUsers(null, { id: this.get("id") });
                }
                Base.prototype.initialize.apply(this, arguments);
            },

            shareWithUser: function (username, authorityID, errorCallback) {
                var projectUser = new ProjectUser(null, { id: this.get("id") }),
                    that = this;
                projectUser.set("user", username);
                projectUser.set("authority", authorityID);
                projectUser.save(null, {
                    success: function () {
                        that.getProjectUsers();
                    },
                    error: errorCallback
                });
            },

            // Apparently, there is not a way to get the array of users
            // from the project object directly
            // using inheritance-based ways
            getProjectUserCount: function () {
                return this.projectUsers.length;
            },

            // we get a collection of users by setting up
            // a temporary dummy user that has nothing inside
            // However, it returns undefined
            getProjectUsers: function () {
                this.projectUsers.fetch({ reset: true });
            },

            // we get a collection of users by setting up
            // a temporary dummy user that has nothing inside
            // However, it returns undefined
            getProjectUserByUsername: function (username) {
                var i, pu, u;
                for (i = 0; i < this.projectUsers.length; i++) {
                    pu = this.projectUsers.at(i);
                    u = pu.get("user");
                    if (u === username) {
                        return pu;
                    }
                }
                return null;
            }

        });
        return Project;
    }
);

define('models/photo',["models/base", "jquery"], function (Base, $) {
    "use strict";
    /**
     * A Backbone Model class for the Photo datatype.
     * @class Photo
     * @see <a href="//localground.org/api/0/photos/">//localground.org/api/0/photos/</a>
     */
    var Photo = Base.extend({
        schema: {
            name: { type: 'TextArea', title: "Name" },
            caption:  { type: 'TextArea', title: "Caption" },
            attribution: { type: 'TextArea', title: "Attribution" },
            tags: { type: 'List', itemType: 'Text' }
        },
        rotate: function (direction) {
            $.ajax({
                url: '/api/0/photos/' + this.id + '/rotate-' + direction + '/.json',
                type: 'PUT',
                success: function(data) {
                    this.set(data);
                }.bind(this),
                notmodified: function(data) { console.error('Photo Not modified'); },
                error: function(data) { console.error('Error: Rotation failed'); }
            });
        },
        //be careful not to overwrite inherited defaults (but OK to extend them):
        defaults: _.extend({}, Base.prototype.defaults, {
            checked: false
        })

    });
    return Photo;
});

define('collections/base',["underscore", "backbone", "collections/baseMixin"],
    function (_, Backbone, CollectionMixin) {
        "use strict";
        /**
         * An "abstract" Backbone Collection; the root of all of the other
         * localground.collections.* classes. Has some helper methods that help
         * Backbone.Collection objects more easily interat with the Local Ground
         * Data API.
         * @class localground.collections.Base
         */
        var Base = Backbone.Collection.extend({
            key: null,
            getDataType: function () {
                return this.key;
            },
            fillColor: "#ed867d",
            size: 23,
            defaults: {
                isVisible: true
            },
            initialize: function (model, opts) {
                _.extend(this, opts);
            },
            parse: function (response) {
                return response.results;
            }

        });
        _.extend(Base.prototype, CollectionMixin);

        return Base;
    });

define('collections/photos',["models/photo", "collections/base", "collections/basePageable"], function (Photo, Base, BasePageable) {
    "use strict";
    /**
     * @class localground.collections.Photos
     */
    var Photos = BasePageable.extend({
        model: Photo,
        overlay_type: 'photo',
        fillColor: "#7084c2",
        size: 12,
        name: 'Photos',
        key: 'photos',
        url: '/api/0/photos/'
    });
    return Photos;
});

define('models/audio',["models/base", "underscore"], function (Base, _) {
    "use strict";
    /**
     * A Backbone Model class for the Audio datatype.
     * @class Audio
     * @see <a href="//localground.org/api/0/audio/">//localground.org/api/0/audio/</a>
     */
    var Audio = Base.extend({
        schema: {
            name: { type: 'TextArea', title: "Name" },
            caption:  { type: 'TextArea', title: "Caption" },
            attribution: { type: 'TextArea', title: "Attribution" },
            tags: { type: 'List', itemType: 'Text' }
        },
        getExtension: function () {
            return _.last(this.get('file_name').split('.'));
        },
        defaults: _.extend({}, Base.prototype.defaults, {
            checked: false
        })
    });
    return Audio;
});

define('collections/audio',["backbone", "models/audio", "collections/base", "collections/basePageable"], function (Backbone, Audio, Base, BasePageable) {
    "use strict";
    /**
     * @class localground.collections.AudioFiles
     */
    var AudioFiles = BasePageable.extend({
        model: Audio,
        overlay_type: 'audio',
        fillColor: "#62929E",
        size: 12,
        key: 'audio',
        name: 'Audio Files',
        url: '/api/0/audio/'
    });
    return AudioFiles;
});

define('models/video',["models/base"], function (Base) {
    "use strict";
    /**
     * A Backbone Model class for the Video datatype.
     * @class Video
     * @see <a href="//localground.org/api/0/video/">//localground.org/api/0/video/</a>
     */
    var Video = Base.extend({
        schema: {
            name: { type: 'Text', title: "Name" },
            caption:  { type: 'TextArea', title: "Caption" },
            attribution: { type: 'Text', title: "Attribution" },
            video_id: {type: 'Text', validators: ['required'] },
            video_provider: {
                type: 'Select',
                validators: ['required'],
                options: {
                    '': '--Select Provider--',
                    vimeo: 'Vimeo',
                    youtube: 'YouTube'
                }
            },
            tags: { type: 'List', itemType: 'Text' }
        },
        getFormSchema: function () {
            return this.schema;
        }
    });
    return Video;
});

define('collections/videos',["models/video", "collections/basePageable"], function (Video, BasePageable) {
    "use strict";
    /**
     * @class localground.collections.VideoFiles
     */
    var Videos = BasePageable.extend({
        model: Video,
        overlay_type: 'video',
        fillColor: "#92374D",
        size: 12,
        key: 'videos',
        name: 'Video Files',
        url: '/api/0/videos/'
    });
    return Videos;
});

define('models/mapimage',["models/base"], function (Base) {
    "use strict";
    /**
     * A Backbone Model class for the MapImage datatype.
     * @class MapImage
     * @see <a href="//localground.org/api/0/map-images/">//localground.org/api/0/map-images/</a>
     */
    var MapImage = Base.extend({
        schema: {
            name: { type: 'TextArea', title: "Name" },
            caption:  { type: 'TextArea', title: "Caption" },
            attribution: { type: 'TextArea', title: "Attribution" },
            tags: { type: 'List', itemType: 'Text' }
        },
        hiddenFields: [
            "geometry",
            "overlay_type",
            "project_id",
            "url",
			"source_print",
            "status"
        ],
        defaults: _.extend({}, Base.prototype.defaults, {
            checked: false
        })
    });
    return MapImage;
});

define('collections/mapimages',["models/mapimage", "collections/base", "collections/basePageable"], function (MapImage, Base, BasePageable) {
    "use strict";
    /**
     * @class localground.collections.MapImages
     */
    var MapImages = BasePageable.extend({
        model: MapImage,
        overlay_type: 'map_image',
        name: 'Map Images',
        key: 'map_images',
        url: '/api/0/map-images/',
        // parse: function (response) {
        //     return response.results;
        // }
    });
    return MapImages;
});

define('models/association',["models/base"], function (Base) {
	"use strict";
	/**
	 * A Backbone Model class for the marker association datatype.
	 * @class Association
	 * @see <a href="//localground.org/api/0/markers/">//localground.org/api/0/markers/</a>
	 */
	var Association = Base.extend({
		initialize: function (data, opts) {
			Base.prototype.initialize.apply(this, arguments);
            /*
            Required:
            model: model to which media is to be attached
            attachmentType: type of attached media ("photos" or "audio")
            attachmentID: attached media id (OPTIONAL)
            */
            var model = data.model,
                attachmentType = data.attachmentType,
                attachmentID = data.attachmentID,
                formID;
            if (!model) {
                console.error("Association requires a 'model' argument.");
                return false;
            }
            if (!attachmentType) {
                console.error("Association requires a 'attachmentType' argument.");
                return false;
            }
            //todo: API change needed to make the model.id param not "id" but object_id.
			if (model.get("overlay_type") === "marker") {
	            this.urlRoot = '/api/0/markers/' + model.id + '/' + attachmentType + '/';
			} else if (model.get("overlay_type").indexOf("form_") != -1) {
                formID = model.get("overlay_type").split("_")[1];
                this.urlRoot = '/api/0/forms/' + formID + '/data/' + model.id + "/" + attachmentType + '/';
			}
            if (attachmentID) {
                this.idAttribute = 'object_id';
                this.set("object_id", attachmentID);
            }
            //console.log(this.urlRoot);
			this.set("ordering", data.ordering || 1);
		}
	});
	return Association;
});

define('models/marker',["models/base",
	"models/association",
    "lib/maps/geometry/point",
    "lib/maps/geometry/polyline",
    "lib/maps/geometry/polygon"
    ], function (Base, Association, Point, Polyline, Polygon) {
    "use strict";
    /**
     * A Backbone Model class for the Marker datatype.
     * @class Marker
     * @see <a href="//localground.org/api/0/markers/">//localground.org/api/0/markers/</a>
     */
    var Marker = Base.extend({
        urlRoot: '/api/0/markers/',
		defaults: _.extend({}, Base.prototype.defaults, {
			color: "CCCCCC" // rough draft color
		}),
        schema: {
            name: { type: 'TextArea', title: "Name" },
            caption:  { type: 'TextArea', title: "Caption" },
            tags: { type: 'List', itemType: 'Text' }
        },
		excludeList: [
            "overlay_type",
            "url",
            "manually_reviewed",
            "geometry",
            "num",
            "display_name",
            "id",
            "project_id",
			"team_photo",
			"site_photo",
			"soil_sketch_1",
			"soil_sketch_2"
        ],
        toTemplateJSON: function () {
            var json = Base.prototype.toTemplateJSON.apply(this, arguments),
				key,
				recs,
				i = 0,
				key1,
				list;
            json.descriptiveText = this.getDescriptiveText();
			if (this.get("children")) {
				for (key in this.get("children")) {
					if (key.indexOf("form_") != -1) {
						recs = this.get("children")[key].data;
						for (i = 0; i < recs.length; i++) {
							list = [];
							for (key1 in recs[i]) {
								if (this.excludeList.indexOf(key1) === -1 &&
										!/(^\w*_detail$)/.test(key1)) {
									list.push({
										key: key1.split("_").join(" "),
										value: recs[i][key1]
									});
								}
							}
							recs[i].list = list;
						}
					}
				}
			}
            return json;
        },

        getCenter: function () {
            var geoJSON = this.get("geometry"),
				point = null,
				polyline = null,
				polygon = null;

            if (!geoJSON) {
                return null;
            }
            if (geoJSON.type === 'Point') {
                point = new Point();
                return point.getGoogleLatLng(geoJSON);
            }
            if (geoJSON.type === 'LineString') {
                polyline = new Polyline();
                return polyline.getCenterPointFromGeoJSON(geoJSON);
            }
            if (geoJSON.type === 'Polygon') {
                polygon = new Polygon();
                return polygon.getCenterPointFromGeoJSON(geoJSON);
            }
            return null;
        },

        getDescriptiveText: function () {
            var messages = [];
            if (this.get("photo_count") > 0) {
                messages.push(this.get("photo_count") + ' photo(s)');
            }
            if (this.get("audio_count") > 0) {
                messages.push(this.get("audio_count") + ' audio clip(s)');
            }
            if (this.get("record_count") > 0) {
                messages.push(this.get("record_count") + ' data record(s)');
            }
            return messages.join(', ');
        },

        attach: function (model, order, callbackSuccess, callbackError) {
            var association = new Association({
                model: this,
                attachmentType: model.getDataTypePlural()
            });
			association.save({ object_id: model.id, ordering: order }, {
				success: callbackSuccess,
				error: callbackError
			});
		},

		detach: function (attachmentType, attachmentID, callback) {
            var association = new Association({
                model: this,
                attachmentType: attachmentType,
                attachmentID: attachmentID
            });
            association.destroy({success: callback});
		},
        getFormSchema: function () {
            var schema = Base.prototype.getFormSchema.call(this);
            schema.children = { type: 'MediaEditor', title: 'children' };
            return schema;
        }
    });
    return Marker;
});

define('collections/markers',["models/marker", "collections/basePageable"],
function (Marker, BasePageable) {
    "use strict";
    /**
     * @class localground.collections.Markers
     */
    var Markers = BasePageable.extend({
        model: Marker,
        overlay_type: 'marker',
        name: 'Sites',
        key: 'markers',
        url: '/api/0/markers/',
        parse: function (response) {
            return response.results;
        },

        doSearch: function (term, projectID) {
            /*
             * NOTE
             *   - app.js is listening for the search-requested event
             *   - Please see localground/apps/site/api/tests/sql_parse_tests.py
             *     for samples of valid queries.
             */

            this.query = "WHERE name like %" + term +
                        "% OR caption like %" + term +
                        "% OR owner like %" + term +
                        "% OR tags contains (" + term + ")";
            this.query += " AND project = " + projectID;
            this.fetch({ reset: true });
        },

        clearSearch: function(projectID){
            this.query = "WHERE project = " + projectID;
            this.fetch({ reset: true });
        }
    });
    return Markers;
});

define('models/record',["models/base",
        "underscore",
	    "models/association"],
    function (Base, _, Association) {
        "use strict";
        /**
         * A Backbone Model class for the Project datatype.
         * @class Project
         * @see <a href="//localground.org/api/0/projects/">//localground.org/api/0/projects/</a>
         */
        var Record = Base.extend({
            /*
             TODO: strip out IDs from JSON, and stash JSON elsewhere.
             */
            defaults: _.extend({}, Base.prototype.defaults, {
                name: ""
            }),
            viewSchema: null,
            initialize: function (data, opts) {
                Base.prototype.initialize.apply(this, arguments);
                if (opts) {
                    this.viewSchema = this._generateSchema(opts.updateMetadata, false);
                }
            },
            url: function () {
                /*
                 Terrible hack to accommodate the Django REST Framework. Before the
                 browser issues a POST, PUT, or PATCH request, it first issues an
                 OPTIONS request to ensure that the request is legal. For some reason,
                 the Local Ground produces an error for this OPTIONS request if a
                 '/.json' footer isn't attached to the end. Hence this function overrides
                 the based url() function in backbone
                 */
                var base =
                    _.result(this, 'urlRoot') ||
                    _.result(this.collection, 'url') || urlError(),
                    url;
                if (this.isNew()) {
                    return base + '.json';
                }
                url = base.replace(/([^\/])$/, '$1/') + encodeURIComponent(this.id) + '/.json';
                return url;
            },

            toTemplateJSON: function () {
                var json = Base.prototype.toTemplateJSON.apply(this, arguments),
                    key;
                json.list = [];
                for (key in this.viewSchema) {
                    if (this.hiddenFields.indexOf(key) === -1 && !/(^\w*_detail$)/.test(key)) {
                        json.list.push({
                            key: this.viewSchema[key].title || key,
                            value: this.get(key)
                        });
                    }
                }
                return json;
            },

            attach: function (model, order, callbackSuccess, callbackError) {
                var association = new Association({
                    model: this,
                    attachmentType: model.getDataTypePlural()
                });
                association.save({ object_id: model.id, ordering: order }, {
                    success: callbackSuccess,
                    error: callbackError
                });
            },

            detach: function (attachmentType, attachmentID, callback) {
                var association = new Association({
                    model: this,
                    attachmentType: attachmentType,
                    attachmentID: attachmentID
                });
                association.destroy({success: callback});
            },
            getFormSchema: function () {
                var fields = this.get("fields"),
                    field,
                    type,
                    name,
                    title,
                    i,
                    options,
                    extras,
                    j,
                    schema = {};
                for (i = 0; i < this.get("fields").length; i++) {
                    field = this.get("fields")[i];
                    field.val = this.get(field.col_name);
                    type = field.data_type.toLowerCase();
                    name = field.col_name;
                    title = field.col_alias;
                    switch (type) {
                    case "rating":
                        options = [];
                        extras = JSON.parse(field.extras);
                        for (j = 0; j < extras.length; j++) {
                            options.push({
                                val: parseInt(extras[j].value, 10),
                                label: extras[j].name
                            });
                        }
                        schema[name] = { type: 'Rating', title: title, options: options };
                        break;
                    case "choice":
                        options = [];
                        extras = JSON.parse(field.extras);
                        for (j = 0; j < extras.length; j++) {
                            options.push(extras[j].name);
                        }
                        schema[name] = { type: 'Select', title: title, options: options, listType: 'Number' };
                        break;
                    case "date-time":
                        schema[name] = {
                            title: title,
                            type: 'DateTimePicker'
                        };
                        break;
                    case "boolean":
                        schema[name] = { type: 'Checkbox', title: title };
                        break;
                    case "integer":
                    case "decimal":
                        schema[name] = { type: 'Number', title: title };
                        break;
                    default:
                        schema[name] = { type: 'TextArea', title: title };
                    }
                }
                schema.children = { type: 'MediaEditor', title: 'children' };
                return schema;
            }

        });
        return Record;
    });

define('collections/records',[
    "underscore",
    "collections/basePageable",
    "models/record",
    "jquery",
    "collections/baseMixin"
], function (_, BasePageable, Record, $, CollectionMixin) {
    "use strict";
    var Records = BasePageable.extend({
        model: Record,
        columns: null,
        key: 'form_?',
        overlay_type: null,
        name: 'Records',
        query: '',
        url: null,
        initialize: function (recs, opts) {
            opts = opts || {};
            $.extend(this, opts);
            if (!this.url) {
                alert("The Records collection requires a url parameter upon initialization");
                return;
            }
            if (!this.key) {
                alert("The Records collection requires a key parameter upon initialization");
                return;
            }
            BasePageable.prototype.initialize.apply(this, arguments);
        },
        state: {
            currentPage: 1,
            pageSize: 200,
            sortKey: 'id',
            order: -1 // -1 for ascending, 1 for descending
        },

        //  See documentation:
        //  https://github.com/backbone-paginator/backbone-pageable
        queryParams: {
            totalPages: null,
            totalRecords: null,
            sortKey: "ordering",
            pageSize: "page_size",
			currentPage: "page"
        },

        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.count
            };
        },

        parseRecords: function (response, options) {
            return response.results;
        },

        doSearch: function (term, projectID, fields) {
            /*
             * NOTE
             *   - app.js is listening for the search-requested event
             *   - Please see localground/apps/site/api/tests/sql_parse_tests.py
             *     for samples of valid queries.
             */
            if (!fields) return;

            this.query = "WHERE " + this.addFieldQuery(fields, term);
            this.query += " AND project = " + projectID
            this.fetch({ reset: true });
        },

        addFieldQuery: function(fields, term){
            var recordQuery = "";
            var fieldQueries = [];

            for (var i = 0; i < fields.length; ++i){
                var type = fields.at(i).get("data_type").toLowerCase();
                var fieldName = fields.at(i).get("col_name").toLowerCase();
                var fieldQuery = "";

                var conditionalSQL = i == 0? " AND " : " OR ";

                switch (type) {
                    case "boolean":
                        if (term.toLowerCase() === "true"){
                            fieldQueries.push(fieldName + " = 1");
                        } else if (term.toLowerCase() === "false") {
                            fieldQueries.push(fieldName + " = 0");
                        }
                        break;
                    case "integer":
                        // Check if it is a number
                        if (!isNaN(term)){
                            fieldQueries.push(fieldName + " = " + term);
                        }
                        break;
                    default:
                        fieldQueries.push(fieldName + " like '%" + term + "%'");
                }
            }
            return fieldQueries.join(" OR ");
        },

        clearSearch: function(projectID){
            this.query = "WHERE project = " + projectID;
            this.fetch({ reset: true });
        }
    });
    _.extend(Records.prototype, CollectionMixin);
    _.extend(Records.prototype, {
        fetch: function (options) {
            options = options || {};
			options.data = options.data || {};
			$.extend(options.data, {
				page_size: this.state.pageSize,
				format: 'json',
				page: this.state.currentPage,
                ordering: this.state.sortKey,
                order: (this.state.order === -1) ? "asc" : "desc"
			});
            if (this.query) {
                $.extend(options.data, {
					query: this.query
				});
            }
            BasePageable.__super__.fetch.apply(this, arguments);
        }
    });
    return Records;
});

define('models/dataType',["underscore", "models/base"], function (_, Base) {
    "use strict";
    var DataType = Base.extend({

        toString: function () {
            return this.get('name');
        }
    });
    return DataType;
});

define('collections/dataTypes',["backbone", "models/dataType"],
    function (Backbone, DataType) {
        "use strict";
        var DataTypes = Backbone.Collection.extend({
            model: DataType,
            name: 'Data Types',
            url: '/api/0/data-types/',
            parse: function (response) {
                return response.results;
            }
        });
        return DataTypes;
    });
define('models/field',["underscore", "collections/dataTypes", "models/base"],
    function (_, DataTypes, Base) {
        'use strict';
        var Field = Base.extend({
            baseURL: null,
            form: null,
            defaults: _.extend({}, Base.prototype.defaults, {
                col_alias: '',
                is_display_field: false,
                display_width: 100,
                is_printable: true,
                ordering: 1
            }),
            schema: {
                data_type: { type: 'Select', options: new DataTypes() },
                col_alias: { type: 'Text', title: 'Column Name' },
                is_display_field: 'Hidden',
                display_width: 'Hidden',
                is_printable: 'Hidden',
                has_snippet_field: 'Hidden',
                ordering: 'Hidden'
            },
            urlRoot: function () {
                if (this.baseURL) {
                    return this.baseURL;
                }
                return '/api/0/forms/' + this.form.get("id") + '/fields/';
            },
            initialize: function (data, opts) {
                // This had to be made dynamic because there are different Fields
                // for each form
                if (this.collection && this.collection.url) {
                    this.baseURL = this.collection.url();
                } else if (opts.id) {
                    this.baseURL = '/api/0/forms/' + opts.id + '/fields/';
                } else if (opts.form) {
                    this.form =  opts.form;
                } else {
                    alert("id initialization parameter required for Field");
                    return;
                }
                this.set('temp_id', parseInt(Math.random(10) * 10000000).toString());
                if (this.get("field")) {
                    this.url = this.urlRoot() + this.get("field") + "/";
                }
                Base.prototype.initialize.apply(this, arguments);
            }/*,
            toJSON: function () {
                var json = Base.prototype.toJSON.call(this);
                if (json.extras !== null) {
                    json.extras = JSON.stringify(json.extras);
                }
                return json;
            }*/
        });
        return Field;
    });

define('collections/fields',["models/field", "collections/basePageable"], function (Field, BasePageable) {
    "use strict";
    /*
    This is a rough draft of the fields file
    It is expected to be revised since it's templated
    after projectUsers in structure.
    */
    var Fields = BasePageable.extend({
        model: Field,
        name: 'Fields',
        baseURL: null,
        form: null,
        sort_key: 'ordering',
        url: function () {
            if (this.baseURL) {
                return this.baseURL;
            }
            return '/api/0/forms/' + this.form.get("id") + '/fields/';
        },
        comparator: function (item) {
            return item.get(this.sort_key);
        },
        getModelByAttribute: function (key, val) {
            return this.find(function (model) { return model.get(key) === val; });
        },
        initialize: function (recs, opts) {
            if (opts.url) {
                this.baseURL = opts.url;
            } else if (opts.id) {
                this.baseURL = '/api/0/forms/' + opts.id + '/fields/';
            } else if (opts.form) {
                this.form = opts.form;
            } else {
                alert("The Fields collection requires a url parameter upon initialization");
                return;
            }
            // This had to be made dynamic because there are different fields
            // for each form
            BasePageable.prototype.initialize.apply(this, arguments);
        }
    });
    return Fields;
});

define('lib/maps/tiles/mapbox',["jquery"], function ($) {
    "use strict";
    var MapBox = function (opts) {
        /*
         * https://api.mapbox.com/styles/v1/lg/cj176x4e400252sk86yda5omv/tiles/256/{z}/{x}/{y}
         */
        //this.id = opts.styleID;
        this.maxZoom = opts.max;
        this.name = opts.name;
        this.url = opts.url.split('{z}')[0].split('//')[1];
        this.tileSize = new google.maps.Size(256, 256);
        this.getTile = function (coord, zoom) {
            var url = '//' + ['', 'a.', 'b.'][parseInt(Math.random() * 3, 10)] + this.url;
            return $('<div></div>').css({
                'width': '256px',
                'height': '256px',
                'backgroundImage': 'url(' + url + zoom + '/' +
                    coord.x + '/' + coord.y + '?access_token=' + MAPBOX_API_KEY + ')'
            }).get(0);
        };

    };
    return MapBox;
});

define('lib/maps/tiles/stamen',["jquery"], function ($) {
    "use strict";
    var Stamen = function (opts) {
        /*
         * http://a.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg
         * http://maps.stamen.com/#terrain/12/37.7706/-122.3782
         */
        this.maxZoom = opts.max;
        this.name = opts.name;
        this.ext = opts.url.split('{y}');
        this.ext = (this.ext.length > 0) ? this.ext[1] : '';
        this.url = opts.url.split('{z}')[0].split('//')[1];
        this.tileSize = new google.maps.Size(256, 256);
        this.getTile = function (coord, zoom) {
            var url = '//' + ['', 'a.', 'b.'][parseInt(Math.random() * 3, 10)] + this.url;
            return $('<div></div>').css({
                'width': '256px',
                'height': '256px',
                'backgroundImage': 'url(' + url + zoom + '/' +
                    coord.x + '/' + coord.y + this.ext + ')'
            }).get(0);
        };
    };
    return Stamen;
});

define('lib/maps/tiles/virginia-dotmap',['jquery'], function ($) {
    "use strict";
    var VirginiaDotMap = function (opts) {
        /*
         * https://demographics.virginia.edu/DotMap/index.html
         * http://demographics.coopercenter.org/Racial-Dot-Map/?q=demographics/Racial-Dot-Map#thedata
         * http://demographics.coopercenter.org/racial-dot-map-access-and-use-policy/
         */
        this.maxZoom = opts.max;
        this.minZoom = opts.min;
        this.name = opts.name;
        this.url = opts.url.split('{z}')[0];
        this.tileSize = new google.maps.Size(256, 256);
        this.colorDotsURL = 'http://demographics.virginia.edu/DotMap/tiles4/';
        this.bwDotsURL = 'http://demographics.virginia.edu/DotMap/tiles5/';
        this.blankURL = 'http://demographics.virginia.edu/DotMap/tiles4/blank.png';
        this.ymin = function (level) {
            switch (level) {
            case 4:
                return 3;
            case 5:
                return 6;
            case 6:
                return 13;
            case 7:
                return 27;
            case 8:
                return 54;
            case 9:
                return 108;
            case 10:
                return 217;
            case 11:
                return 434;
            case 12:
                return 868;
            case 13:
                return 1737;
            default:
                return 0;
            }
        };

        this.ymax = function (level) {
            switch (level) {
            case 4:
                return 7;
            case 5:
                return 14;
            case 6:
                return 28;
            case 7:
                return 57;
            case 8:
                return 114;
            case 9:
                return 228;
            case 10:
                return 457;
            case 11:
                return 914;
            case 12:
                return 1828;
            case 13:
                return 3657;
            default:
                return 0;
            }
        };

        this.tileExists = function (coord, zoom) {
            var tilesPerColumn = (this.ymax(zoom) - this.ymin(zoom)) + 1,
                numTile = ((coord.x - this.xmin(zoom)) * tilesPerColumn) + ((coord.y - this.ymin(zoom))),
                arrayTiles = this.tiles(zoom),
                counter = 0,
                lengthArray = arrayTiles.length,
                i = 0;
            for (i = 0; i < lengthArray; i++) {
                counter = counter + arrayTiles[i];
                if (counter > numTile) {
                    //special case if zoom == 4
                    if (zoom == 4) {
                        if ((i % 2) == 0) {
                            return true;
                        }
                        return false;
                    }
                    if ((i % 2) == 0) {
                        return false;
                    }
                    return true;
                }
            }
            return false;
        };

        this.xmin = function (level) {
            switch (level) {
            case 4:
                return 0;
            case 5:
                return 0;
            case 6:
                return 0;
            case 7:
                return 1;
            case 8:
                return 2;
            case 9:
                return 4;
            case 10:
                return 9;
            case 11:
                return 18;
            case 12:
                return 37;
            case 13:
                return 75;
            default:
                return 0;
            }
        };

        this.getTileUrl = function (coord, zoom) {
            var dotURL = this.url + zoom + '/' + coord.x + '/' + coord.y + '.png',
                blankURL = 'http://demographics.virginia.edu/DotMap/tiles4/blank.png',
                url;
            if (zoom == 4 && coord.x >= 0 && coord.x <= 5 && coord.y >= 3 && coord.y <= 7 && this.tileExists(coord, zoom)) {
                url = dotURL;
            } else if (zoom == 5 && coord.x >= 0 && coord.x <= 10 && coord.y >= 6 && coord.y <= 14 && this.tileExists(coord, zoom)) {
                url = dotURL;
            } else if (zoom == 6 && coord.x >= 0 && coord.x <= 20 && coord.y >= 13 && coord.y <= 28 && this.tileExists(coord, zoom)) {
                url = dotURL;
            } else if (zoom == 7 && coord.x >= 1 && coord.x <= 40 && coord.y >= 27 && coord.y <= 57 && this.tileExists(coord, zoom)) {
                url = dotURL;
            } else if (zoom == 8 && coord.x >= 2 && coord.x <= 80 && coord.y >= 54 && coord.y <= 114 && this.tileExists(coord, zoom)) {
                url = dotURL;
            } else if (zoom == 9 && coord.x >= 4 && coord.x <= 160 && coord.y >= 108 && coord.y <= 228 && this.tileExists(coord, zoom)) {
                url = dotURL;
            } else if (zoom == 10 && coord.x >= 9 && coord.x <= 321 && coord.y >= 217 && coord.y <= 457 && this.tileExists(coord, zoom)) {
                url = dotURL;
            } else if (zoom == 11 && coord.x >= 18 && coord.x <= 643 && coord.y >= 434 && coord.y <= 914 && this.tileExists(coord, zoom)) {
                url = dotURL;
            } else if (zoom == 12 && coord.x >= 37 && coord.x <= 1286 && coord.y >= 868 && coord.y <= 1828 && this.tileExists(coord, zoom)) {
                url = dotURL;
            } else if (zoom == 13 && coord.x >= 75 && coord.x <= 2572 && coord.y >= 1737 && coord.y <= 3657 && this.tileExists(coord, zoom)) {
                url = dotURL;
            } else {
                url = blankURL;
            }
            return url;
        };

        this.getTile = function (coord, zoom, ownerDocument) {
            var url = this.getTileUrl(coord, zoom),
                div = ownerDocument.createElement('div');
            div.style.width = this.tileSize.width + 'px';
            div.style.height = this.tileSize.height + 'px';
            div.style.backgroundColor = '#FFF';
            div.style.backgroundImage = 'url(' + url + ')';
            div.style.backgroundSize = '256px 256px';
            return div;
        };

        this.tiles = function (level) {
            switch (level) {
            case 4:
                return [7,2,1,1,3,3,2,3,2,3,1];
            case 5:
                return [2,3,4,5,2,6,4,1,1,3,8,4,6,4,5,4,5,4,6,3,6,2,7,1];
            case 6:
                return [8,1,10,2,1,3,8,5,1,1,8,8,6,9,8,1,1,5,11,5,15,2,15,2,17,3,12,5,11,6,10,6,10,6,10,7,9,6,11,5,11,6,11,3,12,3,13,2];
            case 7:
                return [15,1,22,1,7,1,20,1,1,1,4,1,1,1,18,2,1,2,1,2,4,1,19,2,1,5,2,2,17,1,1,11,17,2,2,1,1,7,15,2,1,2,2,8,17,2,4,9,19,10,21,10,21,9,23,1,3,4,31,1,30,3,29,3,29,2,65,5,25,8,23,9,22,9,22,10,21,10,21,10,21,11,20,11,20,12,19,12,19,11,21,10,21,10,22,8,23,10,22,9,22,6,25,5,25,4,26,4,28,2];
            case 8:
                return [30,1,121,1,44,1,60,1,9,1,47,1,12,2,3,1,42,1,54,2,3,1,1,1,4,3,8,1,39,1,4,2,2,4,8,1,39,2,4,1,1,3,2,1,6,1,36,1,2,5,2,1,1,1,1,1,1,4,3,1,42,3,1,3,2,3,1,1,3,2,35,1,7,1,3,1,1,8,2,1,31,2,4,1,5,2,2,2,3,2,2,5,32,1,2,3,6,1,1,3,1,1,1,1,2,4,34,2,13,2,1,8,35,3,9,2,1,2,1,10,44,2,2,3,2,3,1,4,38,1,3,1,1,2,2,3,1,6,41,4,1,14,42,4,1,2,1,6,1,4,43,2,1,1,2,2,1,2,1,5,44,5,1,11,44,1,1,2,2,11,46,1,7,4,1,1,47,1,6,5,2,1,61,2,122,1,58,5,58,5,56,6,57,3,59,2,251,10,50,13,48,15,46,16,45,17,44,17,44,17,44,17,44,18,43,18,43,18,43,18,43,18,43,18,43,20,41,20,41,19,42,21,40,22,39,22,39,21,40,20,42,18,43,19,42,19,42,19,43,17,45,16,45,16,45,17,47,17,45,16,44,11,3,3,44,10,50,10,51,10,51,6,55,5,55,5,54,7,54,5,58,2];
            case 9:
                return [61,1,482,1,331,1,241,1,18,1,121,2,92,1,35,2,84,1,120,1,110,1,10,2,30,1,75,1,1,1,6,2,2,1,10,2,2,1,16,1,88,1,1,1,8,2,1,2,16,1,79,1,9,3,4,2,3,3,96,2,15,1,7,1,95,1,10,1,4,1,2,1,5,2,12,1,73,1,5,4,1,1,2,1,4,1,7,2,2,3,12,1,84,1,8,1,3,1,3,2,2,1,1,2,1,2,8,1,83,4,1,1,3,1,1,1,6,3,1,1,4,1,7,1,85,3,9,1,5,4,5,1,8,2,70,1,14,2,11,2,1,3,6,1,71,2,22,2,6,1,5,1,2,2,1,1,2,1,1,2,6,1,63,2,23,1,7,1,6,4,4,3,3,3,65,1,8,1,12,2,6,2,7,2,6,2,1,1,1,1,68,2,4,1,2,1,13,1,7,1,7,2,5,5,1,1,69,1,3,2,1,1,18,1,2,2,4,1,2,2,6,3,72,2,27,2,4,2,1,1,1,3,3,1,1,1,72,4,26,1,9,2,2,3,75,2,19,1,2,1,3,2,4,1,4,2,1,4,4,3,101,1,2,1,1,3,1,2,4,4,89,1,1,1,6,1,2,1,4,1,1,4,5,4,96,2,1,3,4,1,1,4,2,1,1,4,86,1,2,1,1,2,6,1,1,1,4,3,1,6,82,2,18,5,4,10,82,5,7,4,3,5,4,9,84,4,1,3,3,3,3,1,2,1,1,4,1,11,83,2,4,2,2,1,1,1,4,1,1,8,4,6,85,1,1,1,1,1,4,3,6,7,4,7,86,2,5,1,6,1,3,4,3,1,1,5,89,4,8,1,1,1,3,4,3,8,88,1,2,2,3,1,5,1,1,1,1,8,2,6,94,2,4,1,1,9,1,9,94,1,7,3,1,2,1,3,1,2,1,2,1,1,88,1,3,1,8,1,2,4,3,4,2,3,94,1,18,4,2,1,110,1,1,1,2,1,5,1,94,1,14,3,1,3,5,1,106,4,2,3,6,1,243,2,486,1,116,6,115,9,115,2,1,4,114,9,113,10,114,7,115,5,117,4,118,1,1,1,118,1,864,2,9,1,109,19,100,22,99,25,96,26,96,27,94,29,91,31,90,31,90,32,89,31,90,33,88,23,1,8,89,24,1,7,89,33,88,33,88,17,1,7,1,6,89,34,87,34,87,34,87,35,86,35,86,35,86,34,87,35,86,34,87,30,1,3,87,35,86,36,85,38,83,38,83,38,83,37,84,37,84,39,82,40,81,42,79,43,78,43,78,43,78,40,81,39,82,39,82,38,84,36,85,36,86,35,86,36,85,36,85,2,1,33,85,2,1,33,87,34,87,32,89,32,91,4,1,2,1,22,90,3,1,27,90,32,89,32,90,31,90,32,94,31,2,1,91,28,1,1,91,30,90,19,4,8,90,18,8,4,89,20,101,18,103,18,103,17,102,19,101,19,102,14,107,12,109,9,112,9,112,9,111,9,111,10,109,8,1,3,108,8,113,8,113,7,117,4];
            case 10:
                return [121,2,1684,1,1623,1,723,1,240,1,36,2,483,2,426,1,71,2,409,1,240,1,702,1,21,3,62,1,153,1,21,2,29,1,32,2,149,1,18,2,27,1,1,1,6,1,209,1,4,1,16,1,1,1,39,1,180,2,16,1,1,1,4,2,213,3,12,1,10,2,192,2,22,1,9,3,8,2,1,1,193,1,32,1,15,2,191,1,48,1,222,1,4,2,202,1,20,1,16,1,11,2,25,2,146,1,11,3,1,2,9,2,9,1,15,2,8,1,1,1,24,1,149,1,11,2,8,1,4,2,32,1,1,2,26,2,168,1,16,2,6,1,8,2,5,1,11,1,18,1,167,2,24,1,9,1,5,2,2,1,1,1,3,1,1,1,185,3,2,1,31,2,4,1,9,2,15,1,170,3,1,1,5,1,6,1,3,2,13,4,3,1,25,2,170,1,3,1,19,1,11,1,1,1,2,2,28,1,1,1,166,1,1,3,35,1,13,2,16,1,1,1,141,1,31,1,23,3,5,2,13,1,144,2,15,1,29,3,28,1,2,1,1,1,157,2,46,2,25,1,4,4,9,1,19,1,127,2,45,1,1,1,12,1,17,1,1,1,4,1,8,2,1,1,12,2,175,1,15,2,16,1,2,1,9,3,9,2,2,1,208,2,14,4,8,1,3,1,131,1,42,2,13,1,1,1,16,2,161,2,15,2,25,1,15,1,18,1,13,2,1,1,3,1,2,2,137,2,14,2,27,1,31,3,10,4,2,2,1,1,2,2,138,1,8,1,33,2,14,1,16,1,1,1,14,4,144,2,6,2,49,1,16,2,16,2,145,3,10,2,37,1,4,2,10,2,20,2,1,2,146,2,67,2,4,1,15,1,149,1,1,4,51,2,10,2,4,1,3,2,2,1,10,1,148,5,51,1,20,1,163,3,73,1,2,1,4,3,1,1,153,2,37,1,14,2,10,1,9,2,4,2,2,2,9,3,187,1,31,1,2,3,1,2,10,2,1,2,208,1,3,1,3,1,3,1,14,3,206,1,11,1,1,1,4,1,10,6,183,1,28,1,4,3,1,1,1,1,11,6,178,1,4,1,13,1,4,1,9,1,4,1,2,1,1,1,11,6,199,2,1,1,1,1,13,4,1,1,10,7,194,1,1,1,17,1,3,4,7,2,4,2,2,1,173,1,5,1,3,1,1,1,13,1,13,1,1,1,4,2,4,6,191,2,14,2,2,1,11,3,3,11,165,3,39,2,3,1,11,3,1,1,1,11,165,2,38,2,1,5,9,8,1,1,1,2,171,7,16,4,10,2,1,2,1,3,10,10,2,2,170,9,16,2,1,1,1,1,10,1,1,1,12,12,2,1,2,1,167,8,17,1,20,4,4,4,1,15,1,1,165,5,6,5,7,1,2,1,8,1,5,1,3,6,3,2,4,14,168,2,9,4,19,1,3,1,3,11,8,7,1,4,169,2,17,1,2,1,13,3,1,5,4,3,8,7,2,3,169,2,17,2,1,1,14,6,2,1,2,1,11,2,4,1,1,4,169,2,3,1,2,1,12,1,14,7,2,3,11,4,2,3,2,1,174,1,25,2,6,5,9,1,7,1,2,3,177,4,10,1,13,2,6,7,8,1,2,5,3,2,177,5,31,4,1,3,6,3,1,4,1,3,1,2,176,3,1,1,1,2,16,1,3,1,7,4,1,3,7,2,2,3,2,5,176,1,5,3,20,1,6,5,1,3,6,1,4,2,1,1,1,4,1,1,190,1,12,1,3,1,3,1,1,2,1,5,1,2,1,1,4,2,1,1,2,5,189,3,9,1,3,1,2,1,3,1,2,6,3,14,1,2,201,1,5,3,1,1,2,8,7,1,2,6,1,1,190,1,14,1,3,2,4,2,2,4,5,2,4,2,4,1,207,4,3,1,6,3,4,1,4,3,189,1,16,2,4,2,3,2,8,3,1,3,4,1,1,1,180,1,25,2,7,1,11,7,5,3,1,1,187,1,37,7,5,2,227,4,1,3,4,2,229,2,10,1,218,1,4,1,4,1,11,1,219,4,4,4,11,1,186,1,31,1,2,1,3,4,11,1,213,6,6,3,1,1,12,1,968,2,239,2,1934,1,232,3,4,3,231,4,2,4,230,1,1,3,2,4,1,5,225,4,1,3,2,7,229,4,3,7,228,3,2,2,3,1,1,1,227,5,1,2,1,3,230,4,4,2,2,3,1,1,225,3,2,1,5,4,232,5,1,7,229,4,1,8,230,4,1,5,230,7,1,2,236,5,235,1,1,4,234,1,2,1,239,1,3,1,476,2,3649,3,19,2,217,7,10,11,1,5,208,36,205,38,199,3,1,39,198,45,196,48,193,21,1,26,193,12,1,4,1,13,1,19,191,11,1,11,1,28,189,33,1,19,188,54,187,56,1,1,182,1,1,57,182,25,1,5,1,27,1,1,180,25,1,1,4,1,1,25,2,1,180,28,2,3,4,21,183,17,1,15,2,27,179,33,1,3,3,1,1,8,1,11,179,43,1,16,181,27,1,15,1,3,2,12,180,27,3,23,1,10,177,28,2,14,2,5,2,11,177,26,4,15,2,4,2,10,178,27,1,12,2,2,4,4,1,10,178,9,1,34,1,1,3,5,1,8,178,9,3,6,2,6,3,9,1,1,1,3,1,2,2,14,178,10,3,3,1,1,1,17,1,6,2,2,2,10,1,3,178,12,3,1,1,1,1,15,1,9,1,1,1,9,2,6,177,30,1,3,1,29,178,34,1,27,180,31,2,5,3,5,3,9,1,2,178,5,1,18,1,8,4,1,1,1,2,6,3,12,178,31,2,1,4,1,2,21,1,2,176,32,1,29,1,3,175,62,1,3,175,67,174,46,1,20,174,41,1,4,1,20,174,68,173,33,1,5,2,27,173,33,1,34,173,28,1,2,1,5,1,1,1,28,173,39,2,27,173,27,1,1,1,8,1,29,173,28,1,38,174,20,1,7,1,3,1,34,174,28,1,2,2,33,1,1,173,31,1,34,175,66,175,66,175,59,2,5,175,59,2,6,174,68,173,69,172,69,172,70,171,66,1,6,168,74,167,74,167,75,166,75,166,75,166,72,169,73,168,73,168,73,168,74,167,76,165,77,164,78,163,81,160,83,158,84,157,84,157,85,156,85,156,85,156,80,3,2,156,78,163,77,164,77,164,77,164,76,164,76,165,76,167,73,169,71,170,71,170,71,170,71,171,70,171,70,171,70,172,70,171,69,172,4,1,65,171,3,2,66,170,3,3,65,170,2,4,64,171,2,3,66,175,64,1,1,174,63,177,64,177,64,177,1,1,62,180,11,9,41,181,7,12,41,181,4,6,3,4,43,181,4,3,53,180,4,3,54,180,62,179,63,178,63,179,62,179,61,181,2,1,57,181,2,1,59,183,4,1,54,187,7,2,51,7,1,174,6,3,51,189,54,4,1,182,55,3,1,181,56,3,1,181,37,6,14,1,2,181,36,9,9,2,4,180,36,14,10,181,35,17,6,182,36,204,36,202,37,204,36,205,36,205,36,206,33,208,33,207,33,205,2,1,33,204,36,204,29,1,7,203,28,6,3,204,27,214,24,217,23,218,21,220,18,223,18,223,18,223,17,224,17,224,16,224,17,224,16,224,17,223,11,1,1,1,4,220,13,4,5,217,1,1,1,1,10,6,3,221,11,225,4,1,10,226,15,226,14,227,14,228,12,235,6,237,3];
            case 11:
                return [243,2,479,2,6248,1,480,1,6126,2,479,2,2886,1,480,1,555,2,1447,2,479,2,1332,1,480,1,144,2,1779,1,480,1,2845,1,44,3,433,1,46,2,126,1,305,2,42,1,2,1,126,2,349,2,60,1,66,3,297,1,38,2,59,2,12,1,366,1,38,1,57,1,2,2,431,1,44,1,82,1,362,1,34,1,2,2,78,1,362,2,33,1,2,1,440,4,47,2,426,3,2,1,25,1,21,2,428,3,25,2,21,3,431,1,21,4,22,2,384,2,66,3,19,2,3,2,385,1,66,1,511,2,1,1,381,1,98,1,381,1,98,1,454,2,468,1,459,1,110,3,325,1,74,1,24,2,346,1,25,3,4,3,40,2,403,2,23,4,4,1,21,2,52,2,17,2,3,1,49,1,297,1,24,3,16,2,9,2,70,3,53,2,340,1,77,1,4,2,427,2,13,2,30,1,61,2,336,1,33,2,13,2,17,2,36,1,423,2,18,1,12,3,4,1,4,1,11,1,372,1,1,1,81,2,10,1,7,1,373,1,1,1,1,1,5,1,76,1,18,3,373,1,73,2,9,2,18,1,33,1,340,1,2,1,39,1,29,6,7,2,51,2,344,1,4,1,11,1,13,1,7,2,27,2,3,1,61,1,341,2,7,1,63,1,3,1,5,2,445,1,92,1,4,1,332,1,3,2,101,3,33,1,3,1,341,1,70,2,26,2,38,1,399,1,12,1,27,2,290,1,31,1,62,2,47,2,14,1,319,2,30,2,58,1,2,1,58,2,4,2,3,1,409,1,1,1,57,1,10,1,314,3,147,1,10,1,1,1,2,1,58,1,255,3,92,1,1,1,61,1,3,1,22,1,294,3,91,1,29,1,34,1,3,1,10,1,17,2,30,2,349,1,2,1,94,2,4,1,378,1,31,2,60,2,30,1,386,2,33,1,5,1,19,4,1,1,19,2,5,2,447,1,1,5,18,1,6,1,416,1,1,2,60,1,263,1,118,1,33,1,1,2,323,3,84,2,28,1,38,2,323,3,84,1,30,1,37,1,34,1,290,3,29,2,83,1,66,2,3,1,8,1,4,3,276,2,29,3,119,1,1,2,25,3,11,2,6,1,307,2,55,1,67,2,21,2,1,2,7,2,3,1,6,2,277,2,85,1,29,1,34,1,2,2,28,1,2,3,290,2,15,2,67,2,29,1,67,2,1,4,289,4,12,3,98,1,69,4,290,3,13,1,135,1,1,1,32,4,291,4,22,1,76,1,9,1,23,1,43,1,5,3,292,3,20,2,77,1,11,1,22,2,43,1,298,3,134,3,41,1,299,2,4,4,140,1,30,1,303,8,101,1,23,2,11,1,9,1,26,1,297,4,2,3,102,1,21,3,17,2,6,1,21,1,298,7,103,1,41,2,327,5,106,1,41,1,327,5,146,1,4,1,11,4,311,3,145,1,16,5,3,1,308,2,105,1,42,1,1,1,19,1,19,1,3,1,359,1,30,1,22,1,21,1,9,4,5,2,20,1,1,2,374,1,63,1,6,2,1,2,2,2,1,1,20,2,1,1,3,2,448,2,23,1,1,1,421,1,24,1,31,3,430,1,7,1,37,1,2,1,436,1,38,1,417,1,23,2,3,1,9,1,21,7,1,3,424,1,11,1,1,1,2,1,3,1,24,2,1,1,2,5,365,1,68,3,1,1,30,4,1,2,1,1,2,1,365,2,57,1,9,1,9,1,22,7,1,2,360,1,8,2,26,1,10,1,29,1,4,2,26,4,2,5,401,1,6,1,28,1,1,3,1,1,3,1,20,6,1,6,399,1,5,1,2,1,28,1,2,2,28,4,1,6,388,1,53,2,26,3,5,2,389,1,3,1,35,1,8,3,1,1,17,2,10,2,353,1,11,1,67,1,2,1,9,2,12,5,1,3,365,1,18,1,3,1,27,1,31,2,10,1,10,6,1,3,383,2,61,1,1,3,9,2,2,2,2,12,384,1,31,1,1,1,5,1,24,2,9,2,2,10,1,6,330,5,79,1,9,1,23,1,1,2,7,3,2,15,1,1,329,6,81,1,32,4,2,1,3,1,3,1,1,4,6,1,334,3,79,2,3,1,2,1,1,1,1,1,20,5,1,2,1,1,1,1,1,1,8,3,342,1,1,1,77,3,2,1,2,1,1,1,1,1,21,5,1,1,1,2,1,3,4,1,2,1,1,2,342,5,2,2,3,1,38,1,28,1,1,1,2,1,3,1,23,7,1,3,11,1,2,1,341,14,33,6,22,2,3,3,6,1,22,9,1,9,350,15,35,1,29,1,4,1,25,21,6,2,5,1,334,16,34,1,5,1,2,1,26,1,24,3,1,19,6,1,340,14,78,5,13,3,4,12,1,7,2,3,7,1,331,12,37,1,41,8,8,1,3,1,1,1,4,3,1,10,1,4,1,3,1,4,335,6,1,2,13,1,1,1,56,2,9,8,7,1,2,1,8,1,2,10,2,1,3,8,336,6,15,1,1,2,2,2,16,1,4,1,17,2,18,12,21,14,7,2,337,1,22,2,3,1,39,2,15,3,1,3,1,7,3,2,17,14,4,2,1,2,339,1,23,1,48,1,9,2,1,6,4,6,18,13,3,1,2,3,339,2,71,1,5,2,2,3,11,5,18,2,2,9,4,5,339,3,34,1,6,1,26,2,1,3,2,5,1,4,10,1,1,1,18,2,3,3,4,1,4,1,2,2,338,3,36,2,3,1,31,2,1,6,6,1,4,1,24,2,14,1,3,1,413,2,3,6,5,2,28,2,10,2,4,1,2,2,339,2,39,1,33,1,1,7,5,3,1,1,24,3,2,1,6,4,6,1,340,2,7,1,6,1,55,1,1,1,2,6,35,4,436,7,20,1,14,2,8,2,357,1,52,2,14,8,35,2,5,2,357,1,1,2,23,1,28,2,14,3,2,5,19,1,12,3,6,1,1,1,356,3,1,1,66,1,1,10,23,1,2,2,1,3,9,1,355,1,1,2,1,1,66,3,1,3,2,5,15,1,5,1,2,1,3,1,3,1,1,1,1,1,357,2,1,2,2,2,63,4,2,1,4,4,14,1,2,1,5,3,1,2,10,1,1,1,354,1,2,1,2,2,4,1,33,1,8,1,15,2,8,4,15,1,1,1,5,6,4,2,1,1,1,2,2,1,352,2,10,3,32,2,22,3,1,1,1,2,4,3,24,5,6,1,2,3,1,1,351,1,12,2,1,1,56,2,1,1,2,2,4,2,25,4,3,1,2,1,2,2,6,1,347,1,15,1,42,1,14,1,3,1,5,5,14,1,8,3,10,2,1,1,3,2,379,2,25,1,6,1,8,1,3,1,1,1,2,9,5,1,4,1,9,2,4,1,5,2,3,1,1,2,379,2,44,1,2,1,2,9,4,1,5,1,9,2,10,1,2,1,1,4,377,1,1,1,1,1,33,1,15,8,9,5,1,9,2,1,4,2,1,1,4,2,403,1,7,1,12,1,6,9,1,1,16,3,1,4,1,2,1,2,1,1,1,1,4,1,403,1,10,1,2,1,5,1,5,1,1,5,1,4,17,2,4,7,1,2,1,1,3,1,416,1,1,2,11,4,3,4,1,1,22,5,3,2,384,1,30,1,7,3,10,2,5,5,13,2,9,3,9,1,418,4,8,1,1,2,5,2,2,3,11,2,10,3,426,5,6,1,15,3,10,1,11,3,423,4,2,1,22,3,10,1,10,1,1,3,423,4,7,3,16,1,10,2,13,2,378,1,33,2,41,4,3,4,10,1,3,1,359,1,52,2,15,2,26,2,3,4,11,1,2,2,4,1,353,1,93,1,1,4,1,7,14,1,379,1,75,2,2,8,12,2,455,4,2,2,3,2,11,2,455,4,2,1,2,1,1,3,11,1,456,4,19,2,458,2,22,1,456,3,459,1,8,1,480,2,9,1,22,1,438,1,5,2,8,2,1,3,461,1,2,1,13,4,24,1,372,1,80,3,461,1,5,1,6,3,1,1,26,1,427,1,2,6,13,1,1,1,2,1,2,1,449,1,1,6,24,1,24,1,3377,2,479,2,478,3,8191,1,465,2,1,1,9,5,462,5,9,5,462,5,8,1,2,3,461,5,1,1,6,2,468,4,8,1,12,1,2,1,449,1,2,5,6,2,2,2,4,6,2,1,449,3,2,2,4,2,1,1,5,2,2,2,2,3,456,1,7,1,5,2,1,3,1,4,1,2,458,4,1,1,7,1,2,1,2,1,1,5,455,7,10,1,2,1,2,4,455,5,6,3,11,1,456,4,7,2,6,1,459,1,1,5,5,3,4,3,459,1,1,1,1,4,10,1,463,4,13,2,9,1,452,1,1,2,1,2,17,1,1,3,4,1,450,2,1,1,17,7,463,1,11,5,470,2,5,4,1,4,1,2,458,2,2,4,8,4,1,3,459,6,4,2,2,5,2,3,457,2,7,3,1,4,2,2,463,7,3,3,1,5,463,5,1,1,2,1,2,5,462,2,2,4,2,2,3,3,464,1,3,2,1,5,2,2,474,1,2,5,473,9,470,1,2,7,474,4,1,1,476,1,474,1,492,1,472,1,1440,2,14499,5,476,6,38,3,435,9,31,11,10,4,416,13,20,15,1,5,3,9,416,2,1,2,1,38,1,2,3,16,415,5,1,37,1,1,1,7,1,18,409,5,1,15,1,5,1,15,1,7,1,1,2,20,406,2,5,50,1,18,401,1,3,3,3,47,1,23,397,1,1,3,2,78,396,1,1,4,1,50,1,13,1,2,1,12,394,45,1,26,2,1,1,1,1,10,393,44,2,3,1,39,1,1,390,36,2,7,2,1,2,44,387,23,1,9,1,2,2,3,3,1,1,5,1,43,386,22,1,4,1,6,1,2,1,3,3,2,1,2,1,10,2,2,1,30,386,2,1,20,3,6,3,4,1,3,2,4,1,11,2,37,384,11,1,2,1,5,3,6,3,5,1,1,2,16,3,38,382,21,2,6,1,3,1,10,3,11,3,7,1,31,382,2,1,3,1,13,2,21,4,10,2,6,1,35,379,2,2,3,1,3,1,2,1,5,3,19,1,5,1,15,3,36,378,1,3,6,1,11,1,19,1,5,1,1,1,4,4,6,2,37,380,1,1,17,1,19,2,6,2,2,4,8,1,5,1,32,376,22,1,19,1,8,2,3,2,49,374,5,2,27,1,7,1,27,1,3,1,1,3,32,371,36,1,5,1,2,1,1,2,12,1,2,1,14,1,29,3,1,368,15,2,18,1,4,1,5,3,60,2,2,365,1,2,35,1,3,1,1,3,3,1,1,1,14,1,36,1,8,1,1,366,43,2,1,5,7,1,2,3,1,2,2,2,12,2,16,1,5,1,1,2,2,1,2,365,21,1,20,1,5,4,2,11,1,1,4,1,11,1,2,1,23,1,2,7,1,360,21,1,11,1,8,2,4,3,1,15,4,1,7,1,5,2,1,2,23,7,1,360,42,1,5,3,1,10,1,2,4,4,16,3,23,366,42,1,5,2,3,8,2,11,8,1,7,2,23,366,54,5,3,1,1,9,5,1,2,1,1,1,1,1,1,1,3,1,1,2,20,366,33,2,5,1,10,2,12,9,10,1,2,2,4,3,20,365,5,1,27,2,5,1,11,1,10,1,1,5,3,2,2,1,1,1,5,2,7,2,20,2,2,1,1,359,32,2,5,2,4,1,5,1,2,1,3,1,6,4,3,11,1,1,1,1,9,6,18,2,1,358,28,2,2,2,6,1,6,1,1,1,2,1,2,1,7,4,3,10,1,2,2,1,1,1,3,1,6,3,17,363,40,1,3,1,1,1,4,3,2,1,2,2,1,1,1,1,5,5,1,1,1,2,2,1,2,2,8,1,22,363,25,2,17,2,2,3,2,2,14,3,6,1,2,9,3,4,22,362,24,4,16,5,3,3,12,1,1,2,1,1,5,1,2,7,1,2,1,6,1,3,18,361,24,1,19,2,1,1,4,5,1,2,13,2,10,5,2,6,2,1,3,4,13,360,43,1,7,9,1,2,4,1,1,1,3,3,11,2,1,1,4,1,1,1,1,1,4,4,16,357,2,2,46,1,2,7,2,1,4,1,2,1,2,1,10,1,2,1,2,1,2,1,1,1,5,6,19,355,2,1,23,2,27,5,1,1,8,1,1,4,8,2,1,4,2,2,6,6,19,357,23,1,26,10,3,2,4,3,3,1,5,10,6,7,19,356,51,11,1,4,4,1,1,1,3,2,2,1,1,2,2,6,2,1,3,7,5,1,13,356,51,8,1,3,1,2,4,3,2,1,2,5,1,1,1,1,1,8,4,7,2,3,13,356,9,2,41,4,9,1,4,1,4,1,2,6,1,11,4,1,2,4,1,1,2,2,8,1,3,356,4,1,5,1,5,3,13,1,15,1,2,4,21,1,1,7,1,11,6,2,3,2,1,1,10,1,2,357,16,3,8,1,1,1,2,1,19,1,1,3,11,3,6,7,1,3,1,7,5,3,1,3,1,3,2,2,8,356,16,3,7,1,3,1,2,6,17,3,13,1,1,2,2,1,2,1,4,3,1,7,7,1,1,3,3,1,2,1,4,1,4,356,15,8,2,1,2,1,6,5,11,10,11,1,1,7,3,2,1,4,1,5,17,1,3,1,6,358,1,1,12,8,1,1,5,2,2,4,4,1,7,6,2,1,2,1,8,6,1,3,1,4,1,3,3,4,12,1,4,1,3,1,6,356,5,1,11,9,4,4,1,3,3,1,4,1,5,4,2,1,11,5,1,4,1,3,1,4,4,5,10,4,5,5,3,356,6,1,11,8,1,2,1,9,5,1,3,1,4,1,3,1,2,2,5,3,1,2,2,1,3,1,2,1,2,6,2,6,4,1,1,1,4,3,2,4,5,357,10,1,8,14,1,3,1,1,4,2,12,1,3,1,5,3,10,2,1,11,4,1,3,1,5,10,8,355,2,1,19,8,1,7,10,1,14,1,1,4,11,2,1,1,2,3,2,4,3,1,11,6,6,1,3,355,20,3,9,1,2,1,12,1,8,4,2,1,2,4,1,1,2,2,2,1,3,2,10,2,5,1,17,2,5,355,3,1,25,1,2,3,20,2,1,3,1,1,3,10,5,2,8,1,1,3,22,1,1,2,3,358,1,1,25,1,4,2,4,1,15,1,2,2,6,5,1,6,3,2,4,2,1,1,1,2,2,3,15,1,6,1,2,357,1,2,40,1,3,2,8,1,2,1,6,3,11,3,5,1,1,2,5,1,12,1,1,1,4,1,1,2,2,359,4,1,17,1,17,2,3,2,10,2,2,6,8,8,7,1,1,6,1,1,9,1,1,1,3,5,1,360,1,1,2,1,1,1,14,1,14,2,7,2,10,3,1,9,2,1,1,9,9,9,10,2,2,4,2,357,4,2,2,4,27,2,6,3,11,1,2,9,1,9,1,2,9,9,10,2,2,3,3,357,7,9,13,1,9,1,7,3,10,1,2,10,1,3,1,8,1,2,6,6,9,1,1,1,1,1,5,1,3,357,7,2,4,1,1,1,21,1,9,3,5,2,3,6,1,8,1,7,3,2,7,3,2,2,1,1,13,1,2,1,2,358,8,2,3,1,14,1,16,1,13,22,15,1,1,2,1,2,17,1,2,2,2,1,1,352,39,3,2,1,14,1,1,5,5,2,1,1,3,6,12,2,3,1,21,3,4,351,34,1,2,1,6,2,16,5,5,3,3,1,1,1,5,1,9,1,5,1,20,2,6,350,38,1,6,1,18,3,6,2,21,2,5,1,17,4,5,351,33,3,29,1,4,2,1,1,13,1,9,2,8,1,15,2,5,351,35,5,9,1,15,1,13,1,4,1,3,1,2,1,5,1,27,1,5,350,33,1,1,1,4,1,8,1,39,1,1,2,10,1,28,349,37,2,1,1,39,2,3,2,3,3,21,1,17,349,46,2,11,1,19,3,4,1,4,3,20,1,11,1,6,348,52,1,6,2,2,1,14,2,1,3,2,1,3,4,23,1,15,348,39,1,22,1,8,1,9,3,2,8,39,348,17,1,6,1,9,2,29,1,1,1,12,3,4,6,16,1,24,347,34,2,18,1,4,2,18,3,3,3,3,1,23,1,18,347,36,1,11,1,2,5,4,1,1,1,2,3,5,2,2,4,1,1,3,1,26,1,1,1,18,347,19,1,12,2,2,1,1,2,11,1,2,1,5,1,4,4,5,1,1,7,2,2,2,1,1,1,29,1,12,347,23,1,1,1,5,4,1,2,1,1,20,1,4,3,4,1,1,1,1,2,2,7,3,2,24,1,17,347,20,1,10,1,2,3,2,1,23,1,1,3,4,1,1,4,4,2,2,1,1,1,1,1,27,2,14,347,31,2,3,1,3,1,4,1,9,2,1,2,1,2,9,7,1,1,1,1,3,3,29,1,15,347,41,1,4,1,6,4,4,3,9,2,1,3,1,2,6,3,26,3,14,347,43,1,3,1,5,2,3,1,7,1,5,9,35,2,2,2,12,347,10,1,29,1,2,1,4,2,8,2,2,1,8,1,2,1,2,4,35,2,16,347,44,1,3,2,2,3,2,2,4,1,7,1,2,3,57,348,42,3,7,3,1,2,4,2,9,3,8,1,23,1,24,348,33,1,7,1,3,1,5,1,2,3,6,1,2,1,6,2,17,1,17,1,21,348,11,1,25,1,17,4,1,2,2,1,3,1,3,1,14,1,45,348,39,2,12,7,3,4,1,1,3,1,14,3,40,2,1,348,3,2,31,1,2,2,9,1,3,3,3,5,1,1,7,1,19,1,22,1,13,1,1,348,9,1,2,2,1,1,3,1,9,1,20,2,2,4,2,6,8,1,35,1,6,1,13,2,1,347,12,2,18,3,16,1,1,6,1,5,1,1,63,351,11,2,20,3,7,1,5,1,1,1,3,1,1,2,1,4,47,1,5,1,13,350,34,2,2,1,3,3,4,2,3,2,1,1,2,3,47,1,20,350,11,1,24,2,5,1,4,1,1,2,6,1,1,3,25,1,15,2,24,351,36,1,1,1,21,1,20,1,7,1,1,1,6,1,5,1,23,353,7,1,1,3,5,2,23,1,1,2,1,1,2,2,3,3,2,4,40,2,16,1,6,353,6,2,8,1,27,1,1,1,9,1,6,1,39,1,13,1,3,1,7,353,8,1,36,2,2,1,5,1,28,1,30,5,8,351,9,1,9,1,27,1,5,2,31,1,30,7,7,350,41,1,19,1,39,1,11,1,2,7,1,1,2,1,3,350,53,1,1,1,5,1,34,1,17,2,1,5,2,4,5,348,44,1,1,1,1,1,75,1,2,1,5,348,53,1,6,1,64,3,3,1,2,347,48,1,4,1,3,1,11,1,55,3,1,2,4,346,55,1,70,1,9,345,23,1,111,346,95,1,17,1,23,344,96,1,28,2,4,2,2,1,1,344,95,1,10,1,32,342,95,1,34,4,10,337,130,4,1,1,9,336,116,1,11,1,1,1,1,1,1,1,11,335,131,1,1,1,12,335,105,2,1,1,13,1,9,1,14,334,134,1,6,2,4,334,126,1,21,333,129,1,13,1,4,333,131,1,1,1,9,1,5,332,105,1,31,2,9,333,104,2,32,1,7,1,1,333,138,1,4,2,1,335,104,1,29,1,4,1,1,1,1,338,143,338,142,339,144,337,140,2,1,338,142,1,1,337,144,337,145,336,146,335,147,334,148,333,150,331,152,329,118,1,29,1,4,328,154,327,154,327,157,324,160,321,121,1,40,319,159,1,5,316,166,315,166,315,167,314,167,314,168,313,168,313,162,1,5,313,168,313,161,1,7,312,158,6,5,312,159,7,3,312,158,8,2,313,155,326,154,327,153,328,153,329,150,330,152,329,152,329,151,330,151,330,3,2,145,328,1,3,3,1,144,329,1,2,4,4,140,330,1,2,4,4,140,334,5,1,140,336,144,337,3,3,137,339,2,3,137,339,142,339,142,340,4,1,133,1,1,340,5,1,135,340,3,2,136,340,141,342,139,342,139,343,139,342,139,343,1,1,136,342,138,345,4,1,131,345,10,1,126,344,2,1,3,1,2,2,127,343,2,1,5,2,127,344,2,1,4,3,127,343,3,1,3,3,128,343,6,4,130,341,5,6,130,341,4,8,128,341,4,8,128,341,3,9,120,1,4,1,2,342,2,8,128,342,2,10,126,343,2,8,123,2,1,1,2,352,124,1,1,2,1,1,1,349,123,1,1,1,2,2,1,350,124,356,124,356,125,355,126,354,128,353,6,1,121,353,2,3,1,1,121,353,1,4,123,358,27,11,85,359,22,18,82,361,10,1,5,23,80,362,8,2,4,24,81,362,8,1,2,27,81,362,8,29,82,362,8,12,1,1,3,10,84,362,7,11,10,5,86,362,1,2,3,8,105,361,7,7,107,359,8,6,108,360,6,2,1,3,110,358,7,1,3,2,111,357,7,5,114,355,7,2,117,355,126,357,120,1,3,357,123,358,122,359,122,359,5,2,113,365,2,2,113,363,3,3,12,2,99,362,3,3,12,1,101,367,10,2,104,367,7,2,17,1,88,375,16,3,88,374,14,4,89,5,4,19,1,345,13,5,101,364,11,7,77,1,22,369,1,11,76,1,25,379,105,375,106,10,1,365,108,7,1,364,60,1,7,1,40,6,2,363,110,6,2,362,77,5,29,6,2,362,73,13,25,6,1,363,72,16,24,3,1,1,1,362,72,19,13,1,2,5,1,1,2,1,2,362,71,22,15,4,6,362,71,28,10,1,8,363,70,31,16,363,70,35,10,366,70,410,70,411,69,411,69,411,69,407,3,1,68,408,72,409,71,410,71,410,70,411,70,411,71,410,69,413,66,415,66,415,65,416,64,417,64,416,65,415,66,410,3,2,61,2,2,410,47,1,5,1,13,2,1,410,51,1,16,1,1,410,56,3,9,1,2,409,55,8,5,2,1,409,54,12,6,408,54,427,45,1,6,428,48,1,3,429,11,1,36,433,46,435,45,436,44,437,42,439,38,443,36,445,35,446,35,446,31,1,3,446,31,1,3,446,31,1,2,447,34,447,30,1,3,447,33,448,33,448,30,1,1,449,30,1,1,449,31,449,31,450,30,451,30,451,30,448,2,2,21,1,8,447,1,1,18,2,2,3,7,445,3,1,16,12,4,442,1,2,19,10,1,2,2,1,1,440,23,11,4,1,3,443,19,13,2,2,1,436,1,2,1,4,18,462,19,461,2,2,1,1,14,450,1,2,1,2,1,4,1,1,1,1,15,453,3,7,1,3,13,454,2,7,1,2,16,452,6,2,7,1,12,453,9,1,17,454,8,1,18,454,7,1,18,456,17,2,5,458,22,471,11,470,2,2,6,475,5,476,5,479,1];
            case 12:
                return [487,2,959,2,25938,2,959,2,25694,2,959,3,959,1,11533,2,959,2,959,1,1111,2,958,2,4815,2,959,3,958,3,958,2,5546,2,959,2,289,2,8360,2,960,1,11543,1,868,1,88,2,2,2,866,1,93,2,865,1,93,2,253,1,611,2,91,2,253,2,611,2,85,1,259,3,698,1,2,1,255,4,700,2,120,2,133,3,823,2,732,1,77,2,120,2,25,1,733,1,77,1,115,1,5,2,953,1,960,1,164,2,704,1,254,2,959,2,724,1,68,1,6,2,883,3,66,1,6,1,884,3,956,5,954,1,1,5,95,3,853,1,1,2,4,2,94,4,852,1,61,1,42,4,856,1,1,2,54,1,42,3,1,1,856,1,1,2,51,2,46,3,861,1,48,2,45,1,1,1,862,1,43,3,50,2,906,3,40,2,8,3,768,2,133,4,41,2,780,1,134,1,1983,2,959,2,3,1,762,1,197,2,761,1,197,2,761,1,197,2,761,1,1107,2,959,2,937,1,959,2,917,1,222,3,735,1,224,2,651,1,149,1,49,3,758,1,148,2,49,3,746,1,11,1,86,1,806,2,51,4,10,4,82,2,807,2,49,5,10,1,151,2,45,1,694,3,48,6,54,2,106,1,36,3,7,1,99,1,594,1,50,5,55,2,142,4,107,3,592,1,87,3,164,4,108,1,681,2,154,2,9,2,948,2,897,2,185,2,741,2,27,3,62,1,123,2,673,1,67,2,27,4,35,1,921,3,38,1,73,1,846,2,38,1,27,2,9,1,34,1,911,4,20,2,768,1,166,4,20,2,15,1,755,1,163,4,788,1,14,1,153,2,39,2,745,1,7,1,202,2,749,1,172,1,37,1,897,3,19,1,1,2,104,1,680,1,145,2,3,2,1,1,1,1,17,2,103,2,686,1,79,2,58,1,1,1,4,1,18,1,106,1,723,2,27,1,15,2,56,2,132,1,689,1,9,2,51,1,74,1,7,2,823,2,126,2,6,1,12,2,793,2,165,1,890,2,195,1,950,1,673,1,7,1,2,1,275,1,888,4,75,2,681,1,198,3,76,2,824,2,54,2,876,2,25,1,55,3,580,2,293,2,81,2,581,2,62,1,223,2,30,1,639,2,62,2,125,2,831,3,241,2,9,1,1,1,704,2,116,1,5,1,117,3,19,1,819,1,2,1,116,1,651,3,186,1,2,1,138,1,629,4,294,1,25,2,634,5,294,1,21,1,3,2,4,1,117,2,510,5,184,1,3,1,178,1,588,5,312,1,7,1,635,4,244,1,69,1,6,2,121,3,697,1,159,1,36,2,63,2,698,1,195,2,768,1,190,2,9,1,756,1,65,1,123,1,835,2,121,1,1,1,61,1,773,2,120,5,46,2,12,1,842,2,11,1,39,2,1,4,3,1,38,4,11,1,896,1,2,5,2,2,37,2,12,2,901,2,56,2,837,1,121,2,831,2,3,3,648,2,235,2,66,2,2,4,648,4,233,2,70,4,647,5,305,3,647,6,167,3,58,1,727,5,167,2,136,1,651,5,228,2,74,1,69,1,582,4,228,1,144,1,27,2,556,2,59,2,302,2,25,1,10,4,614,5,300,2,23,3,630,3,239,1,3,3,51,3,25,3,13,2,614,3,246,1,46,2,3,3,26,1,15,1,554,3,170,2,135,2,44,3,2,2,17,2,22,1,1,1,554,3,170,2,135,3,56,1,8,3,581,2,230,1,70,1,70,6,581,2,31,2,136,2,59,2,135,3,3,6,580,2,2,2,26,3,136,2,59,1,136,1,5,5,581,2,29,4,197,2,138,1,2,5,581,2,29,3,342,4,583,3,25,1,276,1,65,1,2,4,583,3,297,1,72,5,583,6,44,1,153,2,67,1,98,5,585,5,198,2,18,1,135,1,11,4,586,5,40,1,1,1,155,1,159,1,597,4,223,1,46,2,686,4,269,2,686,3,10,3,257,2,1,1,84,1,600,2,9,6,281,1,60,2,606,16,338,1,606,8,1,7,295,1,649,6,1,1,5,4,201,1,46,4,23,1,73,1,595,5,6,5,204,2,42,1,1,3,37,1,58,1,596,3,1,1,2,1,1,4,206,2,45,2,36,3,12,1,641,3,4,1,1,3,292,2,656,8,211,1,83,1,657,4,1,3,296,2,655,9,211,1,741,8,302,1,28,2,622,6,291,1,34,2,1,4,624,4,289,1,33,1,2,2,1,4,6,2,617,2,331,1,8,2,829,2,128,1,916,1,3,1,79,2,6,1,719,1,150,1,37,1,1,1,41,2,787,2,45,1,63,6,11,1,44,1,2,2,1,1,747,2,146,3,11,1,44,1,3,1,6,3,740,2,127,1,12,1,1,1,3,2,6,1,1,1,46,1,13,2,897,2,959,2,48,1,3,1,892,1,63,2,2,1,841,1,114,2,862,1,16,1,81,1,954,1,5,1,1833,1,76,2,883,2,27,1,47,2,2,1,1,2,6,3,817,1,47,1,9,1,64,2,2,2,5,1,4,1,1,3,872,1,69,1,2,2,9,1,1,2,849,1,26,1,5,2,7,1,48,3,10,2,876,1,69,4,1,1,2,2,1,1,8,1,731,1,136,1,1,1,2,1,3,1,60,1,2,2,2,1,9,1,737,2,155,1,48,2,1,3,1,2,745,3,114,2,18,1,65,4,1,7,4,3,739,3,52,1,82,1,10,1,53,8,4,6,721,1,19,2,74,1,70,2,53,3,1,2,6,6,1,3,802,1,90,1,43,2,1,3,1,2,4,1,1,5,1,3,816,1,57,1,2,1,2,3,3,1,48,1,4,2,2,2,3,5,1,6,810,1,4,1,57,1,66,1,3,2,4,4,2,5,797,1,11,2,62,2,4,1,2,1,58,2,1,1,11,4,887,1,54,1,1,2,11,2,778,2,106,1,56,1,795,2,98,2,1,1,3,1,59,2,801,1,71,1,17,1,43,3,895,1,19,1,31,5,7,1,731,1,22,1,136,1,25,3,24,9,4,2,733,1,44,1,120,1,45,11,3,2,1,1,768,2,63,1,62,1,1,2,21,1,20,12,2,4,768,3,122,1,3,2,1,1,21,2,17,15,1,1,1,1,899,1,2,1,20,2,5,3,5,10,1,2,1,3,1,1,1,1,2,1,768,1,63,1,3,1,62,2,28,18,4,3,1,2,1,3,835,1,11,1,50,3,18,4,5,19,3,3,2,4,830,1,18,1,53,2,14,5,6,12,1,5,1,1,2,2,3,1,3,1,660,2,1,1,1,4,228,1,3,1,16,3,8,8,14,2,1,1,665,10,230,3,2,2,13,1,11,7,12,2,668,8,166,1,66,3,8,1,15,1,4,1,1,3,683,5,169,1,4,1,3,1,4,1,48,1,3,4,7,1,2,1,18,4,685,1,161,2,21,1,42,2,2,2,11,1,3,2,3,1,17,4,689,1,157,2,12,1,3,1,3,1,44,5,5,2,8,1,1,4,9,1,8,3,685,1,159,1,1,1,7,1,57,9,3,1,2,1,2,1,2,1,3,2,14,1,691,1,1,1,1,2,8,1,9,1,135,1,2,1,63,9,2,1,3,2,2,1,22,1,6,1,685,2,3,2,6,3,6,1,77,1,58,1,9,1,6,1,48,10,723,1,1,1,2,1,4,4,2,1,1,1,2,4,69,4,3,3,57,1,1,1,14,1,44,1,2,15,3,1,3,4,3,4,704,11,1,1,1,2,1,1,2,1,2,2,67,1,1,2,2,2,48,2,7,2,62,1,2,2,3,7,1,1,5,15,701,3,3,4,3,1,1,2,1,3,1,1,3,3,71,1,58,1,64,1,1,3,1,21,1,7,1,2,27,1,671,6,1,2,1,2,4,2,1,1,2,2,2,3,70,1,69,1,51,1,1,2,1,5,2,10,1,19,13,2,681,5,2,2,1,1,1,4,1,2,1,1,2,1,1,5,87,1,53,1,52,2,3,3,3,31,13,1,682,2,1,2,3,1,1,1,1,2,2,6,4,2,70,1,12,1,109,1,1,2,4,1,3,2,2,21,1,7,12,2,680,3,2,1,1,3,2,1,1,1,3,1,1,1,1,2,2,1,158,1,1,1,32,1,2,2,9,2,1,5,1,4,1,9,3,7,1,5,5,4,15,1,663,3,1,6,2,2,1,10,159,2,1,1,2,3,27,2,13,1,1,3,3,5,1,8,2,1,1,1,1,1,1,7,689,3,2,1,2,2,3,3,1,2,1,2,76,1,82,1,2,3,1,1,2,3,27,1,13,1,2,1,4,6,1,6,1,4,5,5,6,2,10,1,671,6,1,3,1,2,1,4,167,1,1,1,2,3,3,1,17,1,10,1,10,2,1,2,2,3,1,9,1,6,4,5,3,5,4,6,670,7,1,1,1,2,2,4,145,2,20,7,1,1,3,3,21,1,16,2,4,3,1,15,5,1,9,12,671,1,1,10,2,3,28,1,3,1,137,8,1,4,14,1,29,12,2,1,2,3,5,1,6,1,1,1,3,2,1,6,672,8,1,3,31,1,4,1,6,2,34,1,45,1,45,10,1,4,45,14,2,4,2,3,16,3,674,6,1,1,1,2,36,2,5,1,46,1,34,3,37,8,1,8,1,4,1,1,45,12,2,1,1,2,1,5,693,1,45,2,8,1,79,2,31,3,1,2,2,6,2,1,1,4,2,4,1,1,7,1,37,2,1,9,2,1,1,3,1,5,11,2,4,3,718,1,124,4,3,5,3,3,1,2,2,5,7,2,39,9,2,3,1,8,16,1,727,2,96,1,19,3,4,1,2,2,1,2,1,1,10,1,1,8,38,5,2,4,3,1,1,9,14,3,678,2,144,1,19,1,1,1,4,1,1,1,5,2,9,8,1,3,37,3,2,1,2,3,1,3,2,5,10,1,5,1,681,3,144,1,11,3,4,2,26,9,38,2,6,2,6,1,2,3,2,1,8,1,2,2,1,1,1,2,677,4,162,3,1,2,25,6,38,2,6,2,2,4,1,1,6,1,8,1,5,1,680,5,70,1,13,1,53,3,12,4,3,3,3,1,2,1,1,1,21,2,2,2,36,3,7,1,1,3,9,1,10,1,7,1,677,5,138,1,5,2,1,2,4,3,2,1,1,2,6,1,66,2,32,1,5,1,679,4,76,1,70,4,4,9,73,2,1,1,716,3,75,1,8,1,70,1,1,8,14,1,8,1,49,2,31,1,6,1,826,1,1,1,9,10,72,2,21,3,14,1,1,2,834,1,1,8,11,2,1,1,56,4,20,3,9,1,5,4,679,1,148,1,4,1,1,9,12,2,1,1,4,1,50,4,21,2,15,2,680,2,80,1,71,3,1,7,71,5,4,1,14,1,5,1,12,2,679,3,15,1,14,1,120,5,1,6,71,6,863,1,2,1,5,12,71,6,872,12,43,1,30,2,18,1,854,13,72,3,16,1,824,1,30,7,1,6,72,3,11,1,722,1,105,2,31,3,4,7,86,1,714,1,53,1,57,3,29,3,7,7,41,1,27,3,14,1,2,1,714,1,2,1,136,6,4,9,66,2,732,1,4,1,2,1,134,1,3,1,3,3,2,6,64,3,20,1,713,1,1,1,138,1,3,2,2,4,3,8,47,1,5,2,4,4,734,1,1,1,3,1,133,3,1,1,4,4,5,7,45,1,5,1,7,2,732,1,142,1,1,3,5,2,7,8,31,1,25,2,6,1,3,1,3,1,714,1,2,1,2,3,5,1,130,2,1,1,7,2,9,5,37,1,10,1,2,1,5,2,25,2,719,1,131,3,16,7,29,1,16,3,1,1,4,2,21,2,2,2,720,1,96,1,34,1,18,5,31,1,4,1,11,1,1,2,2,1,1,1,10,1,1,1,7,4,4,1,706,1,6,1,7,1,9,1,66,2,48,1,19,1,1,5,48,5,1,5,14,1,3,4,712,1,25,1,64,3,46,1,1,2,3,1,16,4,50,1,1,5,1,1,12,1,5,2,1,1,709,1,23,1,2,1,1,1,65,1,46,1,2,1,8,1,1,1,10,5,51,1,1,4,19,2,3,1,3,1,727,2,1,1,2,1,114,1,1,1,2,2,5,1,10,4,51,1,1,4,8,1,10,3,13,2,694,1,150,1,8,1,8,4,53,2,10,1,5,1,4,3,708,1,169,5,51,3,22,3,3,1,8,1,726,1,85,2,29,1,7,1,11,8,29,1,18,4,22,3,10,2,813,2,12,1,18,1,11,1,5,9,28,1,19,4,9,1,11,2,8,1,3,3,758,2,51,2,39,1,9,3,1,1,1,11,11,1,29,2,9,1,25,2,759,3,89,1,11,18,9,1,10,1,19,3,22,1,10,4,759,2,96,1,6,7,1,5,45,2,28,1,3,1,1,1,1,2,758,1,72,1,31,6,3,4,20,9,4,3,8,4,6,1,15,1,9,1,2,1,756,1,2,1,4,1,66,1,31,7,1,1,1,5,22,1,13,2,1,4,1,4,6,1,8,1,2,1,15,1,805,1,16,1,39,8,1,1,1,5,38,4,4,5,12,1,3,1,14,1,805,1,42,1,13,7,5,5,2,1,34,3,7,5,2,1,1,2,3,1,8,1,816,1,22,1,28,1,4,8,4,6,35,3,10,7,2,1,6,1,13,1,835,1,12,1,14,6,6,8,34,2,12,6,1,3,1,1,4,1,4,1,870,7,7,7,49,3,2,4,6,1,1,1,843,1,2,3,24,3,11,3,1,2,4,1,46,3,2,2,778,1,77,2,1,1,23,3,15,2,31,2,18,3,22,1,822,1,14,1,1,3,21,4,11,2,6,1,27,3,19,2,1,1,857,2,1,3,17,1,3,1,1,2,11,2,6,5,23,2,21,1,3,1,856,5,45,2,24,1,26,2,853,6,16,1,30,3,23,1,24,4,852,1,5,3,45,2,3,1,47,1,848,6,5,1,47,1,2,1,21,1,27,2,847,6,52,1,25,1,20,1,4,5,846,6,16,2,1,1,34,1,22,2,26,4,849,2,20,1,33,2,21,3,957,4,785,1,68,2,84,2,2,3,7,7,20,1,8,1,824,2,32,1,55,2,7,6,1,1,22,1,6,2,716,1,141,1,54,1,8,5,2,1,30,2,8,1,706,1,188,1,3,1,2,1,1,1,4,2,3,1,1,1,2,2,29,1,911,2,7,1,2,2,4,2,29,2,757,1,152,2,8,3,1,3,1,3,26,1,1,1,912,2,5,1,4,1,3,1,1,4,939,3,2,1,4,3,8,1,1,1,936,5,1,1,17,1,22,1,1,2,909,7,5,1,5,1,4,1,26,2,910,6,18,1,1,1,22,1,912,3,2,1,41,2,914,2,1,2,40,3,915,1,1,1,960,2,45,1,911,4,958,5,917,1,979,1,961,1,65,1,892,1,21,1,922,1,11,1,1,1,24,1,2,1,931,2,17,1,1,1,5,1,1,2,928,1,28,5,920,1,34,1,1,4,49,1,906,4,795,1,164,2,953,1,3,1,926,1,11,1,12,1,2,1,59,1,861,1,1,1,1,1,32,1,14,1,901,1,5,3,2,1,1,1,2,1,30,1,5,1,5,2,901,1,1,1,2,5,1,1,48,1,50,1,845,1,9,1,1,1,51,2,12564,1,960,2,959,2,960,2,957,4,955,2,32707,1,930,3,23,3,1,2,928,4,2,1,21,4,2,1,926,4,2,2,22,1,1,1,1,1,925,5,1,2,20,1,1,2,1,1,1,2,924,5,1,1,1,1,23,2,1,1,926,5,1,2,16,1,7,1,927,1,2,2,4,1,14,2,933,1,2,6,17,3,935,7,17,2,935,7,44,1,5,1,898,1,6,1,1,4,15,2,5,3,11,3,3,3,5,1,902,1,4,5,12,3,5,2,11,4,1,2,2,2,4,1,899,1,1,3,5,3,9,2,3,2,11,2,5,1,1,1,6,4,901,2,1,1,36,2,8,1,4,4,914,1,14,1,12,2,4,1,3,1,3,1,8,1,1,1,935,2,5,1,7,1,1,2,1,1,2,2,917,1,1,1,23,1,11,1,3,2,3,2,912,1,1,1,1,4,3,1,21,1,4,1,4,1,1,3,2,1,912,1,1,4,4,1,22,1,10,2,2,1,910,1,1,1,2,6,30,1,6,1,3,2,912,6,14,3,24,1,910,2,2,5,15,3,936,1,1,5,15,3,938,6,14,1,1,1,14,1,918,1,3,1,2,4,15,1,11,1,2,1,918,1,5,1,1,5,12,1,2,1,11,1,921,1,7,2,951,1,3,1,4,1,1,1,1,2,20,2,926,1,1,2,29,3,924,1,6,1,48,1,904,1,11,1,41,3,905,1,2,1,2,1,2,1,37,2,2,1,1,3,9,1,901,1,4,1,36,3,1,1,1,1,3,2,908,1,41,2,1,1,1,3,953,3,2,2,2,1,928,1,22,3,1,1,1,2,942,2,11,2,3,2,5,1,1,1,1,1,3,1,1,1,925,3,10,3,2,2,4,4,1,1,3,4,923,5,20,6,4,1,1,3,914,2,5,8,17,4,1,2,7,1,918,1,3,7,9,1,7,5,3,1,5,3,915,3,2,2,2,2,10,3,6,5,9,3,914,1,1,1,15,2,2,2,3,1,2,3,929,1,1,1,16,1,2,1,3,2,1,2,6,1,2,1,926,2,6,1,3,1,7,4,3,1,1,4,1,1,927,1,2,6,13,1,3,1,1,5,1,1,926,1,2,7,2,1,12,3,1,3,1,1,931,6,8,1,8,2,1,3,924,1,1,1,7,5,7,2,6,1,1,4,934,7,5,2,9,3,929,1,6,4,5,1,1,1,1,1,8,1,930,1,13,1,7,1,5,2,956,8,946,1,6,5,1,1,948,1,3,1,1,1,1,4,1,4,944,2,4,1,1,9,947,1,1,2,1,2,2,2,943,1,4,2,3,1,2,1,3,2,948,1,2,1,1,1,3,2,949,1,1,2,1920,2,948,1,1945,1,1904,1,5761,4,57799,1,3,1,956,6,2,1,952,5,2,2,81,1,870,5,1,5,77,5,869,3,1,8,69,19,24,3,834,15,1,2,62,22,20,8,832,13,2,5,55,13,1,2,2,2,3,8,13,10,832,2,1,2,2,5,1,1,3,8,40,24,3,2,4,8,7,17,832,3,3,4,2,1,1,1,1,5,1,11,20,35,2,3,7,5,1,25,831,2,4,3,2,3,1,12,2,58,3,2,7,1,1,8,1,2,2,17,830,2,3,3,3,3,1,23,1,25,1,13,2,5,13,2,1,4,3,22,831,2,2,4,3,3,1,11,1,9,1,16,2,15,1,5,5,4,3,1,3,3,1,6,1,1,5,9,1,23,819,3,1,4,3,2,2,17,1,7,3,6,1,2,4,13,4,3,6,3,9,7,10,7,1,1,2,25,814,3,10,1,2,25,2,6,1,3,3,14,2,4,1,3,1,4,3,12,4,1,4,9,3,15,2,10,813,3,10,1,1,19,2,4,2,4,1,6,1,17,1,14,1,14,4,7,3,6,1,27,812,3,10,26,3,2,5,21,1,1,1,13,1,18,3,3,4,30,1,4,811,3,1,1,6,18,1,9,1,4,1,60,3,4,1,3,1,4,1,1,1,27,801,1,8,3,8,18,2,74,2,5,1,15,2,5,1,16,800,4,4,4,8,9,1,9,1,73,3,21,1,6,1,17,793,2,3,5,4,5,2,3,1,78,1,18,1,16,5,1,1,4,1,19,791,2,3,6,5,3,2,70,1,22,2,6,2,1,1,5,1,8,5,3,3,23,791,7,4,74,4,3,2,16,2,9,3,2,1,10,4,2,5,22,787,3,2,6,4,75,4,2,2,15,2,11,2,10,1,2,15,19,786,10,2,77,4,2,2,2,2,12,1,12,1,9,1,4,1,1,6,1,2,1,4,19,785,79,1,6,8,1,2,1,2,28,1,2,1,44,785,5,1,32,1,9,2,22,4,2,2,8,4,1,1,1,7,22,1,1,3,2,1,45,3,1,780,47,3,22,4,2,2,3,1,1,1,3,5,1,5,1,1,24,3,54,778,44,2,1,2,17,1,1,1,3,4,2,1,4,3,3,5,2,5,2,1,1,5,17,1,34,1,9,1,14,774,45,4,16,5,2,4,2,1,3,6,1,5,1,4,1,9,1,1,18,1,34,1,13,1,9,773,45,4,2,1,3,1,9,4,3,7,3,11,2,1,1,2,2,3,1,2,3,2,1,1,2,1,1,2,2,2,4,2,2,1,46,1,9,772,44,2,1,2,2,5,9,6,2,6,3,12,1,1,1,3,1,3,7,4,4,5,4,5,56,772,6,1,29,1,3,1,3,5,2,2,1,2,3,1,3,1,3,4,2,4,2,1,2,7,2,4,1,6,11,1,5,5,2,5,10,1,30,1,17,771,4,2,30,1,3,1,3,9,6,2,3,6,2,1,2,1,2,5,1,6,7,3,1,2,15,1,3,5,14,2,46,4,4,766,2,3,3,2,19,7,7,8,4,3,4,7,1,1,2,1,2,3,1,2,2,6,6,2,21,5,14,4,1,1,45,2,7,768,3,2,16,3,1,6,7,7,1,1,3,4,3,7,1,1,1,2,1,14,2,2,3,2,7,1,12,9,3,2,7,2,57,767,5,1,16,2,3,3,1,2,6,8,6,2,1,1,1,11,4,3,1,5,5,3,1,2,3,2,3,1,7,1,3,7,1,1,5,3,2,1,1,4,37,1,19,766,16,1,5,3,4,4,5,6,11,4,1,6,4,1,4,1,2,2,5,7,3,4,12,10,5,6,2,3,60,763,11,3,5,2,3,4,4,2,6,5,11,3,3,1,2,2,3,2,4,1,2,1,6,8,5,1,11,2,1,7,11,1,2,3,61,764,3,2,1,1,3,3,5,1,6,1,1,1,1,1,8,5,12,1,3,1,8,1,15,10,3,1,14,6,10,5,1,6,54,1,3,763,3,3,4,3,10,1,1,3,6,9,34,21,15,6,6,6,1,1,1,1,1,2,1,2,35,1,1,2,14,2,4,760,1,6,3,7,2,3,3,6,2,1,3,7,2,1,31,2,2,4,2,1,1,1,1,6,5,1,5,1,1,1,3,4,7,7,4,1,2,2,35,1,17,1,1,1,3,758,2,7,2,2,1,3,4,4,3,3,6,1,2,6,17,2,16,6,8,4,2,1,3,2,4,8,9,8,2,1,4,3,37,4,5,1,12,756,2,6,4,1,6,3,7,2,9,7,15,1,19,5,8,3,1,3,3,1,4,9,10,7,7,3,39,1,20,764,2,1,3,1,2,5,6,3,8,1,2,4,18,1,2,1,10,1,1,1,1,4,8,7,5,11,8,9,8,1,2,1,38,3,19,764,8,4,7,1,1,1,8,1,2,4,16,1,18,7,7,1,1,6,3,10,10,8,1,1,6,3,41,1,21,759,1,2,9,1,4,1,19,3,22,2,12,5,12,5,1,1,1,10,4,1,2,4,3,2,1,2,6,3,42,1,3,1,1,1,15,757,5,2,6,1,24,3,19,1,3,1,10,6,9,1,3,6,4,6,7,1,1,1,2,1,7,1,8,1,42,3,20,750,1,1,1,1,7,2,2,1,8,1,18,4,16,1,2,1,17,4,14,4,5,6,6,1,5,3,5,2,2,1,6,2,2,1,2,1,34,2,22,749,4,1,3,5,1,1,7,3,16,1,1,2,15,1,3,4,8,1,3,1,1,2,8,2,2,1,4,2,8,3,7,1,7,1,6,5,4,3,2,6,33,3,26,742,7,1,1,4,4,2,7,1,15,3,21,4,4,1,6,7,3,3,1,1,13,1,1,1,10,1,4,1,2,1,7,3,5,3,2,6,1,1,33,2,26,743,5,5,14,1,7,1,8,2,17,1,10,3,1,2,4,5,3,9,19,1,2,3,4,2,7,2,8,1,2,6,1,3,16,1,13,1,1,1,25,744,7,1,1,1,14,1,6,3,15,1,3,1,15,5,8,4,3,2,1,7,17,2,2,3,4,2,4,2,17,2,2,4,1,1,44,1,10,6,1,736,25,2,3,5,31,1,2,4,3,2,2,2,1,2,2,2,3,6,1,2,2,1,2,1,13,4,7,2,2,1,19,1,2,4,1,2,32,2,19,745,18,1,4,4,1,6,11,2,20,4,6,9,2,1,1,9,1,3,1,3,12,2,1,1,2,1,3,2,2,1,7,1,15,1,2,3,2,2,38,1,10,5,2,739,17,1,10,5,9,1,2,1,12,1,8,4,2,1,1,2,1,7,3,1,2,7,2,2,7,2,5,1,2,3,3,2,1,2,18,3,5,1,2,2,3,2,23,1,9,2,3,2,2,2,5,738,1,5,1,2,31,1,25,1,4,2,1,4,3,5,1,7,1,2,2,3,1,2,3,2,4,1,1,1,1,2,2,6,1,7,2,3,2,1,8,1,11,4,3,2,29,1,4,2,3,2,3,2,5,4,1,731,2,2,1,2,2,1,46,1,7,1,2,1,5,1,3,2,3,21,1,1,4,1,2,2,1,3,1,1,2,6,1,8,1,4,1,2,20,5,1,2,1,1,26,4,4,2,2,3,2,4,3,4,1,731,2,1,2,2,34,3,11,2,8,3,4,2,1,4,4,1,1,6,1,13,2,1,1,2,2,1,1,5,2,13,1,7,22,5,2,2,1,2,24,5,7,3,2,4,3,4,2,730,41,3,11,2,21,2,4,4,2,1,4,10,2,31,2,4,19,6,3,2,1,1,2,1,23,5,3,1,3,2,3,4,2,736,14,1,25,5,22,1,10,1,1,1,2,4,6,38,1,2,1,1,3,2,1,3,7,1,4,3,6,4,2,2,1,1,2,2,31,1,3,2,3,3,2,15,1,720,21,1,17,2,1,3,6,1,14,2,9,4,2,6,3,44,1,1,2,7,5,2,4,3,9,10,32,1,7,2,4,14,1,720,16,1,1,1,21,1,1,2,21,3,11,3,1,7,2,1,3,6,1,31,2,4,1,3,7,2,4,3,7,1,1,6,1,6,39,1,4,14,1,720,43,2,12,1,7,2,3,1,8,2,3,2,1,4,5,6,2,26,2,1,4,9,5,2,4,2,13,12,33,1,9,734,10,1,8,3,41,1,1,2,13,6,6,1,3,6,2,20,2,23,7,1,6,4,1,1,8,7,2,1,30,1,11,732,13,2,4,1,8,1,28,2,5,2,16,6,8,6,2,19,2,24,6,2,6,4,1,1,2,1,6,6,2,1,1,1,28,1,3,1,7,732,10,3,44,2,3,2,19,4,9,5,5,16,1,27,4,3,5,8,1,1,3,1,4,4,2,2,1,1,26,2,12,731,10,2,46,1,13,1,1,1,9,2,10,5,1,1,4,13,1,25,2,2,4,4,1,6,1,2,1,3,1,4,4,3,2,5,30,2,7,731,9,2,54,1,5,5,4,4,8,1,6,1,3,2,2,12,1,3,1,3,1,19,8,3,4,7,1,7,1,1,3,3,1,4,2,2,36,731,63,1,2,5,2,2,5,7,6,1,5,1,1,8,6,2,2,5,1,2,3,19,7,3,3,2,1,1,2,10,4,10,25,1,13,730,63,1,1,7,6,1,1,3,1,1,1,1,13,6,1,1,8,4,3,1,1,1,1,23,5,1,2,2,3,2,3,3,2,6,3,1,3,7,2,2,12,1,6,2,3,1,8,731,9,4,1,1,47,2,2,5,1,1,7,3,21,2,12,1,4,2,1,24,3,3,2,2,3,2,4,7,2,1,8,6,2,2,4,2,4,1,9,1,12,7,1,5,1,717,9,5,3,2,42,2,1,6,1,2,7,3,5,1,8,2,2,1,2,2,4,1,4,3,4,6,1,11,5,5,3,3,2,2,2,6,1,5,4,3,6,7,1,5,31,6,3,721,4,2,1,3,4,1,46,2,1,6,2,10,1,1,5,4,5,3,1,2,2,1,1,3,4,4,3,1,2,1,1,1,1,11,4,27,1,2,12,19,29,3,3,5,1,716,2,2,3,1,50,3,2,4,3,1,1,2,2,8,3,5,3,1,1,1,2,3,1,1,1,4,1,6,1,2,4,1,2,10,4,25,1,3,1,2,13,1,4,13,30,3,2,721,3,2,51,5,2,6,4,1,4,5,5,1,1,1,1,4,2,9,1,1,1,6,5,2,1,1,1,9,1,1,3,20,1,5,1,6,1,3,5,3,6,2,1,1,1,9,30,726,56,4,3,5,5,1,5,4,5,2,3,8,2,10,2,1,5,4,1,8,1,1,4,20,1,5,3,7,1,1,4,2,2,3,3,2,2,6,1,1,6,4,20,727,55,3,6,1,11,2,1,4,5,2,1,4,2,11,1,5,3,14,1,1,7,15,1,5,2,4,2,5,7,1,3,1,1,2,1,2,11,1,5,3,3,1,1,2,16,727,40,1,10,4,21,1,1,7,1,4,1,2,2,3,2,7,3,3,2,1,1,4,2,2,1,4,9,10,1,4,1,5,2,11,2,2,8,7,3,1,6,1,4,1,9,1,17,726,49,5,25,1,2,2,3,6,1,8,2,5,2,3,1,1,6,2,3,2,5,1,2,9,1,2,2,2,1,4,1,1,1,18,5,9,2,1,3,1,8,1,8,1,6,1,10,725,50,5,24,3,2,3,1,5,1,9,1,6,2,1,11,1,3,1,5,2,1,7,1,3,6,1,1,4,1,22,1,13,3,5,4,1,1,2,4,2,18,724,48,8,4,1,6,1,6,1,1,1,2,3,3,14,4,8,8,1,2,1,1,1,9,9,1,2,1,1,2,1,3,5,2,21,1,22,1,1,2,1,1,1,1,3,1,2,19,723,47,10,1,1,3,3,6,1,4,2,3,1,2,1,2,12,3,9,5,2,1,1,12,4,2,5,1,4,1,4,3,5,1,15,1,19,1,9,5,2,1,1,1,2,20,722,5,1,41,3,4,2,7,3,9,1,2,1,2,1,1,1,3,5,1,6,5,10,1,6,5,1,1,1,5,6,1,1,3,7,1,6,2,1,1,1,1,18,1,13,3,7,1,8,1,2,21,721,9,1,38,2,15,3,3,1,3,1,10,10,2,1,3,1,1,16,5,3,3,3,1,2,9,4,1,4,1,1,1,1,3,5,2,12,1,1,1,13,1,5,1,1,2,11,23,720,47,1,7,2,8,3,3,1,6,1,7,3,3,4,2,1,2,19,2,5,1,1,2,1,1,9,4,7,2,1,3,2,1,5,2,14,1,8,1,4,1,3,1,1,4,9,1,2,24,718,68,1,3,1,6,1,6,5,4,1,5,26,3,6,1,4,4,7,3,2,9,5,2,5,1,3,1,2,1,1,1,1,1,3,1,7,1,3,1,10,32,713,4,4,45,4,33,3,2,1,1,2,1,27,2,13,3,6,2,1,1,2,9,6,2,3,2,4,1,4,1,5,1,3,2,1,1,13,34,712,4,6,41,4,1,3,16,1,4,2,9,1,8,2,1,1,2,14,1,1,1,5,2,1,3,3,2,3,2,5,1,1,2,3,8,2,2,2,1,2,1,10,1,8,2,2,4,14,36,710,3,3,46,4,1,2,4,1,2,2,2,5,16,1,13,3,1,11,2,4,5,1,8,2,1,9,5,1,4,1,5,5,1,9,2,8,5,1,3,13,36,716,45,6,1,1,5,2,7,1,19,1,1,2,8,1,2,17,1,1,13,2,1,10,1,3,1,3,2,1,4,5,1,17,8,15,36,716,44,6,9,2,32,2,4,21,1,1,3,4,5,2,1,7,1,7,1,5,1,1,1,26,5,16,7,1,28,723,39,2,2,1,9,1,2,2,24,1,5,2,1,23,4,5,6,1,1,7,1,1,2,4,7,23,4,1,5,17,7,1,3,1,24,712,1,2,6,1,39,3,1,1,1,1,2,1,9,1,9,1,15,1,3,1,2,32,6,11,1,6,1,1,1,3,1,5,2,15,3,3,5,14,2,1,6,3,26,712,5,1,28,1,16,3,2,1,5,6,11,1,2,1,14,1,2,23,1,9,7,4,1,2,1,1,1,2,1,16,3,15,1,3,6,18,5,3,26,711,21,1,13,1,17,1,9,5,12,1,19,34,3,1,2,7,1,1,1,2,2,12,1,4,1,2,1,19,3,18,3,6,26,711,19,5,3,1,29,1,7,2,34,17,1,7,1,6,7,7,1,4,1,1,1,11,2,3,1,2,2,17,4,1,2,15,1,9,12,1,12,711,15,9,49,1,1,1,18,1,1,1,4,2,1,10,2,2,3,5,1,5,8,5,2,1,1,4,1,1,1,12,2,23,5,4,2,14,2,6,4,1,5,2,4,2,2,1,3,711,17,6,5,1,2,1,3,3,1,1,20,1,4,1,3,8,4,1,12,3,6,10,10,1,2,3,1,2,7,4,5,7,1,12,2,25,4,3,4,8,2,2,3,5,4,1,6,4,1,2,2,1,3,711,8,2,8,1,1,3,8,7,1,1,18,2,4,3,10,2,14,5,4,8,7,1,9,2,2,2,9,3,1,1,1,2,2,19,1,23,11,8,2,4,1,4,4,1,1,1,6,1,1,1,2,4,3,713,6,6,5,4,4,1,3,10,14,1,2,1,4,4,13,1,14,3,4,9,1,1,3,1,9,7,2,2,7,1,1,1,5,3,1,40,6,1,1,6,1,1,1,1,1,10,6,3,6,2,1,4,2,714,1,1,8,3,4,3,6,2,1,11,12,14,29,1,5,13,3,1,6,2,1,2,4,2,1,8,7,2,1,40,8,6,1,8,1,6,4,5,2,1,3,5,3,715,16,2,7,1,2,1,1,8,14,4,1,2,3,9,1,4,4,1,6,1,14,4,1,6,1,2,5,2,10,8,1,1,9,15,2,6,1,16,1,1,7,7,1,7,1,6,4,6,2,1,2,1,1,2,4,715,1,2,1,1,24,7,6,1,6,7,1,3,2,13,5,1,4,1,1,1,14,3,2,1,1,7,6,5,6,16,3,10,1,1,1,2,2,6,2,15,6,2,1,1,2,3,1,8,2,5,4,3,1,4,1,3,1,2,3,714,4,5,18,20,3,3,1,2,1,4,4,19,2,1,1,1,2,1,17,11,2,1,2,1,12,1,1,1,1,3,2,4,2,5,2,7,1,10,1,14,1,1,5,2,5,2,1,11,1,3,3,4,2,2,3,2,2,1,4,712,5,2,6,3,7,1,2,2,1,18,3,4,1,7,3,16,2,2,1,4,2,1,8,22,2,2,14,5,2,18,1,5,2,8,2,10,7,1,6,1,2,1,3,1,1,5,1,3,2,2,1,3,1,3,11,720,18,1,3,18,2,2,2,5,1,1,8,12,2,3,1,2,3,2,3,1,4,20,2,3,16,19,2,1,2,15,1,12,8,1,2,3,2,1,2,5,5,1,3,2,1,1,1,1,1,4,10,720,11,1,6,1,4,17,2,2,3,1,6,4,3,10,4,6,4,1,8,12,4,9,14,21,2,9,1,20,11,3,1,1,2,1,2,1,1,5,1,1,1,1,1,4,2,1,1,3,11,717,1,3,22,22,1,1,5,18,5,2,1,2,6,1,7,12,4,3,2,4,3,1,9,14,1,26,2,1,1,10,15,4,2,5,1,3,3,4,3,3,2,1,8,712,2,6,2,2,1,1,1,1,3,1,1,1,9,23,2,2,1,9,2,8,3,7,4,2,1,2,4,1,1,9,2,7,5,1,13,11,1,8,1,7,1,10,7,11,10,1,2,1,5,9,2,2,5,10,5,712,5,2,3,4,1,1,3,4,10,20,2,1,1,1,1,18,3,5,2,2,3,3,1,1,4,12,2,3,1,2,2,1,2,2,8,2,1,12,1,8,1,18,7,11,7,5,2,1,3,11,2,19,1,713,6,2,2,6,2,5,1,1,9,19,1,24,3,5,2,2,1,2,3,2,3,4,1,12,1,8,7,6,1,6,2,3,1,7,2,1,1,3,2,13,3,13,6,1,1,3,1,3,2,2,2,8,3,8,1,4,1,717,8,3,1,2,2,1,3,1,12,1,2,23,1,18,3,1,2,1,1,7,2,3,8,2,3,1,2,3,1,6,10,12,4,2,1,1,3,3,2,5,1,30,6,5,1,28,1,1,1,2,2,2,1,713,8,1,1,3,6,3,1,1,13,38,1,3,7,6,3,2,13,6,5,3,5,2,3,7,1,1,5,3,7,33,5,3,5,2,1,2,2,1,2,22,3,1,1,2,2,716,8,1,2,4,3,4,13,1,1,30,1,12,6,4,5,4,10,2,2,3,5,3,1,1,3,1,1,9,1,2,17,4,1,24,6,5,4,2,1,2,1,2,3,27,4,1,1,1,2,710,3,3,4,1,1,1,5,1,1,1,16,2,1,2,1,18,1,15,4,1,5,3,6,2,10,3,2,3,3,1,1,7,1,10,2,1,15,1,2,30,3,1,1,4,2,1,2,1,2,2,1,2,1,1,4,14,2,1,5,2,1,3,6,712,1,2,7,1,25,2,2,34,6,1,6,1,5,2,10,1,8,6,2,3,1,14,3,1,3,1,6,2,1,4,1,3,3,7,3,9,5,4,2,1,3,4,1,1,9,12,9,2,1,2,5,711,1,3,24,1,10,14,2,3,2,1,1,6,1,7,6,2,6,1,2,1,1,2,16,10,1,4,3,12,2,1,1,11,1,2,1,5,3,6,7,8,5,2,1,6,1,5,8,2,2,3,1,1,9,6,7,710,2,1,1,4,10,1,9,1,1,1,9,6,6,1,4,1,1,1,3,4,1,1,1,3,1,1,9,1,9,4,2,1,10,2,1,8,3,4,1,10,1,11,3,4,4,6,2,1,12,1,3,5,6,2,1,3,16,1,3,3,8,7,6,713,4,4,18,1,12,2,16,2,3,10,5,1,4,2,11,1,13,17,1,25,2,1,3,1,2,7,4,1,5,6,1,6,7,1,4,1,20,2,7,1,1,8,5,715,3,3,22,1,26,2,1,1,2,6,12,3,25,4,1,7,1,3,3,1,1,23,1,2,1,1,2,6,1,1,1,1,2,1,5,1,2,10,2,7,24,2,5,2,2,3,1,6,3,717,1,3,49,3,1,1,1,8,8,2,1,3,9,1,6,1,6,6,2,5,1,1,9,11,1,13,3,8,3,1,2,5,2,2,1,6,2,9,3,1,12,1,11,3,6,4,1,2,4,716,1,2,9,1,2,1,36,3,3,2,3,4,8,2,1,1,1,2,2,2,8,1,2,1,6,2,1,3,1,7,9,1,1,11,1,12,3,2,1,8,3,6,1,8,4,7,21,3,4,4,4,3,1,6,3,714,1,5,47,3,3,1,16,4,2,1,1,5,4,4,12,7,1,5,2,1,3,2,2,7,5,1,2,2,1,1,7,1,2,8,1,1,2,6,2,6,3,2,3,2,5,1,1,1,8,1,6,3,1,3,4,1,2,9,3,715,1,5,3,2,5,1,4,2,24,1,20,2,2,3,2,1,4,5,6,4,15,3,2,1,1,4,1,1,2,12,7,1,1,2,6,12,4,1,2,1,1,2,2,4,4,16,7,1,8,2,1,3,7,3,1,5,3,719,1,1,2,6,8,1,4,1,2,2,10,2,3,2,3,2,22,1,4,6,6,4,13,5,2,5,1,16,1,4,1,1,2,2,3,16,1,2,5,2,3,4,1,12,1,5,10,1,4,9,3,11,2,723,3,5,3,1,8,3,1,1,9,2,2,4,2,4,13,2,4,1,1,2,4,6,5,5,13,1,3,9,1,13,2,2,5,4,1,17,3,1,2,1,3,1,3,16,1,4,10,3,3,4,1,2,1,2,3,10,2,724,2,8,1,1,7,5,7,1,5,3,2,3,2,4,16,4,5,1,1,3,3,6,17,8,1,19,4,3,1,18,1,2,12,21,16,3,1,4,3,11,2,719,1,4,3,3,1,5,19,1,5,2,1,1,3,1,5,3,8,2,2,7,6,1,1,3,1,6,16,2,1,6,2,18,3,4,1,19,16,20,2,1,14,1,1,4,3,10,2,714,4,1,2,17,3,1,1,1,19,1,13,1,2,1,2,1,4,1,1,7,9,1,1,7,18,5,1,21,1,27,1,1,8,1,4,19,2,2,12,2,1,5,3,8,4,714,7,6,1,1,1,14,21,1,11,4,1,2,4,1,2,6,7,1,1,11,1,1,14,2,1,4,1,20,1,18,1,6,2,1,1,2,2,3,3,21,13,1,1,2,1,6,1,1,2,6,5,714,5,1,3,2,2,19,4,1,5,2,7,1,3,2,1,2,3,4,4,1,4,4,1,3,9,10,1,1,14,4,2,22,1,24,1,5,4,1,5,14,1,4,1,1,8,13,8,1,1,2,5,714,12,20,3,3,13,1,2,1,1,6,1,1,1,1,2,1,2,2,2,1,1,3,3,6,3,1,1,6,20,5,1,28,1,23,11,14,2,2,1,1,10,3,2,3,1,2,4,2,4,2,4,715,12,9,2,1,1,7,3,1,9,1,5,1,5,2,6,1,5,1,1,7,5,4,4,7,10,4,1,2,2,57,6,1,6,9,1,10,7,1,10,2,4,3,4,3,3,715,13,6,2,3,1,4,1,3,10,3,5,1,5,2,6,1,6,4,3,1,7,3,1,9,7,2,1,4,1,1,2,15,1,17,1,15,4,5,5,1,1,1,5,7,2,7,1,2,8,1,7,1,3,1,4,3,3,3,4,715,2,2,1,1,7,10,3,2,3,2,10,3,10,4,3,1,1,2,5,7,3,1,6,8,9,4,4,1,3,45,1,3,4,3,5,1,1,1,8,1,1,2,1,13,7,2,11,1,3,4,4,2,1,1,2,11,1,703,15,5,1,1,2,1,1,6,8,1,2,2,5,1,5,3,1,2,3,1,5,1,7,1,1,3,4,4,18,1,2,1,4,46,1,1,2,2,2,1,6,3,8,10,1,5,1,1,1,2,5,1,1,1,1,1,13,1,5,4,2,5,2,708,16,3,6,3,2,2,7,1,12,1,4,1,2,1,15,8,3,5,18,4,4,2,1,14,1,1,3,12,2,1,1,12,3,2,6,1,1,1,8,8,4,3,2,2,3,1,21,2,10,6,2,3,3,701,4,2,25,1,36,2,5,1,1,14,13,1,1,1,5,1,3,4,2,11,9,5,1,3,5,13,2,2,9,2,7,6,5,3,1,3,6,2,18,1,10,7,2,1,1,2,1,702,29,2,15,1,19,3,4,2,3,1,1,1,4,6,7,1,18,1,1,1,2,11,2,1,5,9,5,9,6,3,2,1,8,2,4,4,2,1,5,4,2,1,25,2,9,5,9,702,14,1,6,1,9,1,11,4,7,5,7,4,3,4,8,1,1,4,18,2,3,2,3,1,2,11,9,9,4,3,1,2,5,1,2,8,6,1,5,7,6,6,7,1,18,1,7,7,4,2,5,700,18,1,3,1,24,1,19,4,1,1,2,3,10,4,14,2,17,1,1,7,10,8,5,1,7,5,1,3,9,3,3,1,1,5,2,1,4,2,1,5,31,8,9,702,44,1,6,1,12,5,1,3,2,3,4,2,5,3,15,1,8,1,6,1,1,1,1,8,5,2,1,1,1,6,4,1,14,2,9,3,5,1,2,8,1,1,1,6,3,3,1,1,1,1,13,1,9,8,3,1,5,702,30,1,32,2,1,8,1,1,21,1,18,2,3,5,1,6,7,4,2,2,1,2,4,2,5,3,4,1,4,3,4,1,2,1,4,1,1,1,1,5,2,8,1,2,3,2,1,1,23,1,2,1,1,4,3,3,2,703,50,1,15,7,1,2,6,1,40,2,3,1,1,3,1,2,4,5,1,5,1,1,1,5,1,2,7,1,2,6,3,2,1,2,1,4,2,5,1,1,4,1,9,3,24,1,4,5,1,1,3,2,2,701,23,1,8,1,22,1,13,12,1,1,2,1,10,1,1,2,23,1,5,4,9,3,1,6,5,5,6,3,1,6,3,4,2,2,1,6,2,1,1,1,3,1,9,2,25,1,5,5,4,3,1,701,69,14,2,1,10,4,30,3,14,2,5,7,4,5,4,1,1,3,3,5,6,5,1,3,1,2,3,2,5,1,11,4,10,1,5,2,1,2,5,1,3,700,28,1,34,1,2,11,1,5,10,1,2,4,41,1,12,1,8,3,3,1,4,1,3,2,1,5,2,1,2,1,1,6,2,9,5,1,11,1,1,2,18,1,1,2,1,1,7,699,45,4,12,1,4,3,1,3,2,1,3,4,14,3,8,1,52,4,3,18,1,2,5,1,8,1,2,2,1,1,5,1,12,3,17,1,1,4,10,697,7,1,36,5,17,4,2,1,1,4,1,3,10,1,2,1,1,5,45,1,7,1,4,5,2,11,1,7,1,1,9,1,7,1,3,1,15,5,1,1,16,1,3,2,10,697,36,1,7,1,4,1,19,2,1,10,9,7,1,1,15,2,1,1,3,1,4,1,9,1,8,2,11,6,5,4,4,1,1,6,2,1,13,1,1,1,17,5,1,2,1,1,18,3,5,1,1,1,1,1,1,697,32,1,3,1,3,1,30,1,5,4,6,1,4,8,8,1,2,1,1,2,2,3,1,2,35,9,4,3,6,8,1,1,28,1,3,2,2,6,18,1,1,2,1,1,5,1,3,696,32,1,1,4,1,1,10,1,7,3,16,1,8,3,3,4,20,4,1,2,1,3,29,9,6,3,7,7,21,2,3,1,3,1,2,2,3,1,1,3,4,1,16,3,3,1,6,696,2,2,9,1,21,3,3,1,15,4,5,2,19,1,5,1,1,1,5,1,1,3,12,11,15,1,9,14,4,2,4,1,1,9,19,1,5,2,2,1,1,2,1,1,7,1,1,4,3,1,4,3,11,1,1,1,1,1,1,696,11,1,20,5,1,1,1,3,24,1,10,2,14,2,5,5,6,2,4,4,1,2,1,3,13,3,1,2,7,6,1,8,2,5,2,10,15,1,12,4,2,1,10,2,5,1,5,1,12,1,5,695,13,1,1,1,26,2,4,1,1,1,24,1,1,3,14,4,6,1,3,1,8,1,6,4,3,1,7,1,1,8,1,6,3,1,2,7,1,1,1,16,9,1,4,1,1,1,13,1,4,1,5,2,3,2,1,1,3,1,4,3,17,696,11,1,22,1,6,1,1,1,2,2,11,1,5,1,6,9,15,1,6,4,2,1,2,4,7,3,4,1,5,4,1,3,1,1,3,1,3,1,5,10,1,17,29,2,4,1,4,3,5,3,2,2,3,1,9,1,7,1,1,696,32,3,1,2,8,3,17,5,1,1,2,5,25,1,7,1,5,1,7,8,1,2,1,1,2,2,4,3,7,9,5,14,30,3,2,3,7,1,4,2,7,1,20,694,14,1,18,6,9,3,8,2,6,5,1,1,3,1,1,1,1,1,24,2,10,4,5,1,2,2,1,7,1,5,5,1,5,9,1,1,2,1,1,14,18,1,12,4,1,1,1,1,21,1,20,694,10,1,25,2,7,1,2,2,10,1,6,5,2,1,21,1,1,1,8,3,7,8,6,1,1,3,6,2,2,2,8,10,4,7,1,8,14,2,1,1,12,1,2,2,2,2,5,2,2,1,9,1,1,1,1,1,18,695,9,2,2,1,1,1,19,1,5,1,1,2,2,1,19,4,2,1,2,1,1,1,16,2,1,1,2,9,2,1,2,1,1,4,1,2,1,1,5,2,1,1,11,2,8,7,1,1,1,2,1,7,4,4,12,1,6,1,13,6,3,1,2,3,1,1,11,1,20,695,14,1,20,1,4,1,6,1,5,1,9,2,4,4,1,1,1,1,1,2,4,1,10,5,1,11,3,1,2,3,1,3,1,10,9,4,4,14,1,1,1,3,1,3,5,2,13,2,7,2,9,3,1,2,2,2,2,4,7,1,1,1,7,1,15,696,31,1,1,3,2,1,5,2,17,1,1,1,1,1,1,5,1,1,1,2,15,2,2,1,1,10,6,8,4,8,7,6,2,10,1,2,1,9,1,1,2,1,1,3,14,1,5,4,5,1,5,1,5,7,8,4,9,1,12,695,36,3,2,1,3,1,16,5,1,2,1,9,7,1,7,2,4,11,6,5,5,9,6,1,1,1,1,3,1,16,1,6,1,5,1,3,3,1,18,2,6,4,7,1,4,1,1,1,3,1,4,2,3,2,5,1,3,1,8,694,10,2,22,2,1,4,5,3,9,2,2,1,1,6,1,3,1,6,9,1,1,2,8,3,2,3,1,1,2,2,1,1,1,3,7,9,7,2,1,3,1,14,2,8,1,7,3,1,14,2,2,2,6,2,2,3,5,2,3,7,3,3,4,2,9,1,7,695,4,2,11,1,17,3,1,1,3,1,1,2,2,2,10,9,1,5,1,3,9,1,12,1,3,3,4,3,2,4,5,8,1,1,6,7,1,23,2,2,1,4,19,1,2,2,6,2,2,3,5,3,2,4,2,1,2,2,1,1,4,4,14,695,6,1,20,1,1,1,5,1,3,2,5,2,1,4,8,20,6,2,6,1,11,1,1,1,4,1,1,1,1,5,4,1,2,7,7,3,1,9,3,15,1,8,23,1,6,1,13,2,1,4,2,1,1,2,1,1,6,1,17,694,27,1,11,3,3,1,3,2,2,1,8,5,1,6,1,6,6,1,5,2,3,1,4,1,10,3,2,4,3,2,2,8,6,3,1,9,5,7,2,4,1,2,2,3,31,2,4,2,5,2,4,2,1,5,26,696,25,1,10,5,16,1,2,3,3,8,2,4,5,5,1,2,15,4,1,4,2,8,1,6,8,3,1,8,4,1,1,1,1,15,1,4,36,1,9,2,2,7,6,1,19,696,18,1,1,1,17,1,4,1,14,6,2,6,6,3,1,1,2,1,1,4,14,2,1,4,2,4,1,7,3,4,9,14,1,4,1,3,2,10,2,4,29,1,19,4,1,3,25,695,19,1,23,1,17,4,5,4,5,4,1,1,1,1,2,5,7,2,2,9,1,5,1,5,4,2,11,19,1,2,6,11,1,1,8,1,20,1,2,1,18,5,26,694,1,1,24,1,36,2,1,2,5,1,8,5,5,3,2,2,7,9,2,1,1,2,1,6,3,2,11,14,1,7,2,1,1,3,1,8,1,2,29,1,2,1,12,2,1,7,7,4,16,694,1,1,40,1,7,1,23,1,5,1,1,3,1,2,4,2,1,1,8,13,2,2,1,7,2,2,12,5,1,8,1,5,5,1,4,9,30,1,1,2,10,2,2,11,1,1,5,1,16,695,17,1,31,1,11,1,10,2,6,2,3,2,4,4,3,1,4,1,1,13,4,3,1,2,2,3,5,1,4,19,2,1,5,1,4,7,32,3,10,9,1,7,3,4,15,695,4,2,11,3,1,1,20,1,2,2,19,2,4,2,3,1,2,2,2,3,5,5,1,1,6,5,4,4,3,2,2,3,1,1,1,2,8,20,1,1,7,2,3,1,2,1,1,2,30,1,12,2,3,8,1,4,3,1,1,2,6,1,9,694,2,2,1,1,13,3,44,2,12,2,2,4,1,1,4,7,1,1,4,1,1,2,4,6,2,6,1,1,1,3,6,3,1,19,7,1,1,1,1,1,7,1,36,2,5,1,4,4,5,2,1,1,3,3,16,694,11,1,6,5,19,1,1,1,25,2,8,4,2,2,7,9,1,6,4,6,2,3,1,3,1,1,1,1,7,4,3,3,2,10,8,2,47,1,10,5,3,1,6,1,2,3,15,694,1,1,17,1,18,1,4,1,36,1,2,1,1,1,1,4,4,6,1,9,2,5,5,6,1,2,1,2,1,1,4,14,1,4,2,1,8,1,8,2,26,1,11,1,4,1,6,3,2,1,1,3,6,3,8,1,2,2,3,700,11,4,21,3,33,3,2,1,2,5,5,4,3,15,5,1,1,4,5,1,7,2,3,8,1,1,1,1,6,3,3,1,53,2,8,1,1,1,2,1,9,2,11,1,3,698,14,1,4,1,2,1,12,1,5,1,24,1,7,1,3,2,1,8,3,2,5,2,1,6,2,4,6,7,1,3,2,2,1,6,2,8,1,1,2,8,2,2,9,1,14,2,20,2,5,2,10,1,12,1,12,1,1,1,1,696,1,1,1,1,4,1,4,3,1,1,4,1,14,2,1,2,25,1,8,2,5,9,10,14,1,3,4,4,3,6,6,1,1,7,3,2,3,1,3,1,3,4,40,2,2,5,2,1,4,1,9,1,10,1,11,1,1,703,5,1,2,4,5,1,13,1,1,3,25,2,7,2,5,4,1,2,1,3,1,1,7,4,1,8,8,7,1,3,1,2,6,1,1,7,3,2,11,3,12,3,3,1,22,1,1,1,1,6,5,1,4,1,4,2,5,1,3,3,12,698,2,1,6,2,6,1,2,1,6,1,11,2,24,3,3,1,3,2,5,3,4,4,9,2,2,10,2,3,1,3,1,3,3,6,2,1,3,7,14,1,2,1,14,4,25,1,2,1,1,1,1,4,27,1,9,1,3,696,19,4,16,2,23,4,4,5,7,1,3,1,2,3,10,1,2,10,2,5,2,3,2,1,1,1,1,4,4,2,2,1,16,5,1,2,1,3,40,2,4,1,25,2,10,2,1,698,20,5,2,1,32,1,5,1,5,4,2,3,1,1,1,1,3,2,2,1,15,17,1,5,1,1,2,2,6,3,1,1,1,1,1,1,11,3,5,7,10,1,23,1,2,1,6,1,13,1,20,2,4,1,1,695,6,3,4,2,7,1,1,2,1,2,8,1,25,1,10,2,2,4,3,1,3,2,1,1,13,15,2,1,2,14,3,4,3,1,2,1,1,1,7,3,6,8,8,1,21,1,5,2,22,2,14,1,2,5,1,697,6,1,6,1,10,1,6,1,1,1,1,1,3,1,24,2,6,2,3,5,1,2,3,2,1,1,8,2,1,1,1,14,1,14,1,2,2,1,2,6,6,2,7,1,1,1,7,6,8,3,42,2,1,2,3,1,13,3,1,5,2,695,6,4,13,1,4,1,2,1,7,2,22,1,8,3,3,5,1,1,4,2,1,1,7,4,2,10,4,15,5,1,2,4,1,2,3,1,1,2,8,3,6,1,1,3,6,1,1,4,21,1,17,1,3,2,1,3,1,2,9,1,2,2,3,4,2,696,5,4,3,1,8,5,3,1,1,1,5,4,5,1,1,1,10,1,1,5,4,4,3,5,8,2,2,1,4,2,1,1,1,1,1,7,2,3,1,10,1,4,4,1,1,1,1,1,4,2,15,1,22,3,20,3,6,1,13,2,1,2,2,2,10,4,5,699,5,3,10,2,1,1,1,5,2,3,5,3,5,1,2,1,8,3,1,2,1,2,1,1,2,4,4,3,9,2,5,8,2,9,1,1,1,13,2,1,2,1,1,3,5,5,12,4,6,2,17,1,18,2,5,3,11,2,2,2,2,1,6,1,1,3,1,3,1,1,2,4,1,694,5,2,3,1,3,1,2,5,1,5,2,3,3,6,6,3,6,4,2,7,9,2,1,1,14,1,1,6,2,10,3,13,1,1,3,1,3,1,5,3,10,1,5,1,1,1,2,1,3,1,1,1,35,1,3,5,10,4,1,1,12,2,2,1,4,702,19,1,1,7,7,1,1,3,3,1,3,2,6,1,1,3,2,9,1,1,6,1,5,1,1,2,11,3,2,12,2,10,1,4,10,1,3,1,20,1,5,1,21,1,2,3,9,1,5,1,2,1,1,1,8,4,1,1,1,2,5,1,1,1,1,2,3,2,1,703,6,2,12,2,1,5,11,1,4,1,3,1,5,1,2,1,1,1,2,7,1,1,1,1,12,1,1,1,2,1,1,1,1,2,1,1,2,4,1,13,1,14,1,1,3,2,8,2,48,1,2,1,1,2,12,6,11,4,9,1,3,1,4,2,1,702,1,1,4,1,1,1,4,2,1,2,2,9,9,2,7,1,4,1,3,3,3,1,1,7,5,2,7,2,2,1,1,1,2,1,1,3,1,4,4,4,1,5,1,8,2,5,4,2,53,1,8,1,2,1,12,5,10,2,5,1,16,1,2,701,1,1,3,1,15,4,1,2,2,2,3,2,14,4,10,6,5,2,2,1,2,4,1,1,1,2,3,1,1,8,2,21,18,1,47,1,6,1,3,2,2,1,5,2,1,1,1,6,4,1,2,2,7,1,5,1,11,701,1,1,14,1,2,1,1,1,4,5,1,1,1,1,1,1,13,1,15,5,4,2,3,1,2,7,7,4,1,2,3,9,2,9,2,2,9,1,36,1,1,1,27,1,8,5,1,4,6,1,8,2,6,1,9,701,1,1,13,1,3,5,6,1,5,1,2,1,4,1,23,6,2,2,2,1,1,10,6,8,2,5,1,13,28,1,16,1,1,1,2,2,14,2,12,4,9,3,3,7,9,1,18,700,7,1,3,1,3,1,3,1,1,3,4,2,5,2,1,1,21,2,10,4,1,1,2,1,2,9,3,4,1,5,3,2,2,1,2,3,2,7,3,1,9,2,5,1,6,5,13,1,3,3,14,1,13,7,6,2,4,3,2,2,16,1,7,1,2,701,10,2,4,3,1,1,1,2,5,1,5,3,1,4,8,4,17,9,5,2,3,2,2,13,4,2,2,11,3,3,9,1,2,1,2,1,6,2,2,1,2,4,3,3,4,4,1,1,13,4,8,5,5,3,1,1,5,6,4,1,9,2,3,1,4,708,3,1,3,1,1,3,1,2,2,3,8,1,2,3,1,1,3,2,10,2,15,2,1,4,12,2,1,1,3,2,2,1,1,3,2,1,1,3,2,1,1,6,1,1,5,2,6,1,2,3,1,4,12,2,1,1,10,1,1,6,4,10,1,1,8,4,5,2,2,1,1,1,9,1,18,1,2,706,1,2,13,4,1,2,8,2,2,2,4,4,4,1,6,2,7,1,6,2,1,6,4,1,3,2,1,4,3,4,5,4,1,2,5,3,1,4,5,2,8,1,1,1,1,2,10,1,1,6,11,2,1,3,5,2,3,1,1,3,2,1,5,4,2,3,1,1,1,4,3,2,6,1,2,1,12,2,1,1,1,710,1,1,7,3,1,7,10,4,1,1,2,3,10,2,16,1,3,4,3,3,1,5,1,2,3,8,2,8,2,10,2,3,7,2,5,2,10,2,2,2,6,1,5,3,8,3,1,2,13,5,3,1,2,4,14,2,4,4,3,4,3,705,2,1,2,1,6,11,1,1,5,11,2,1,10,1,2,1,3,1,2,2,9,2,1,1,1,1,2,8,1,12,2,2,1,7,2,10,1,3,5,1,7,1,18,1,8,1,3,1,1,1,13,1,4,1,4,1,3,5,6,2,1,1,2,3,16,4,3,1,1,1,3,710,8,7,9,2,2,3,1,3,1,1,10,1,1,3,19,1,1,1,3,2,1,1,3,2,1,3,3,2,1,3,3,1,3,4,3,4,2,1,2,3,39,1,2,1,5,3,12,1,10,1,1,7,4,1,1,1,1,2,5,1,1,2,3,3,5,3,10,1,1,705,2,2,1,2,4,4,1,1,2,1,10,4,16,1,1,2,3,1,29,2,1,4,1,3,2,1,2,1,3,1,3,3,2,2,2,1,4,3,13,1,24,5,6,1,11,3,10,6,1,1,23,10,2,1,6,1,2,707,2,4,4,1,2,1,1,3,2,1,3,1,4,1,2,1,12,1,5,1,5,1,28,1,3,4,3,4,7,5,3,1,7,3,38,6,4,3,8,3,1,1,5,2,1,1,1,1,2,3,23,11,2,3,7,711,10,5,9,1,4,1,1,1,1,1,3,1,8,1,1,1,5,2,26,2,2,5,4,2,3,2,5,3,12,4,7,1,11,1,8,1,3,1,6,3,3,1,2,1,13,1,2,1,11,1,15,4,2,13,2,2,11,701,6,1,10,3,1,1,5,1,9,3,1,1,2,1,15,2,3,2,22,1,3,4,5,1,3,5,3,6,1,1,6,5,3,1,3,2,13,1,3,1,9,2,1,5,4,1,9,1,3,2,30,2,4,15,12,701,8,1,9,4,1,2,2,1,6,3,1,2,9,2,2,1,10,1,1,3,13,2,7,1,1,3,1,1,8,5,4,1,1,2,3,1,7,1,6,1,14,4,4,1,1,2,5,6,1,1,9,2,7,3,4,1,4,4,5,1,9,1,4,1,1,18,10,700,8,2,12,1,10,1,5,2,9,1,13,1,3,2,5,2,5,2,1,2,2,1,2,1,4,1,7,1,2,1,1,1,1,1,2,4,3,2,7,1,15,1,15,2,5,2,1,3,10,1,1,2,11,3,4,1,8,2,7,3,3,19,2,3,5,700,18,5,2,1,6,2,10,1,3,1,12,1,6,1,11,1,1,5,2,1,1,3,12,2,1,3,2,1,2,1,3,6,1,1,2,1,7,2,7,1,16,2,3,1,2,1,16,1,6,1,4,2,14,1,7,3,2,15,1,9,6,699,18,3,3,1,2,2,4,2,3,1,1,1,2,1,9,1,10,5,10,6,4,2,3,1,1,1,9,2,1,9,2,9,19,1,32,2,2,1,6,5,3,1,1,1,8,1,14,20,1,9,2,1,5,697,9,1,14,4,4,1,27,1,8,2,1,2,2,1,1,2,1,2,13,1,8,7,2,1,2,1,3,4,2,1,11,1,10,1,34,1,4,1,1,3,11,2,18,1,1,4,1,12,3,10,7,696,8,1,2,2,6,1,1,1,2,2,6,1,8,3,24,1,13,2,3,3,2,3,1,3,6,3,2,1,1,2,3,1,4,1,7,1,54,1,4,3,37,1,2,2,3,1,1,2,3,1,2,3,2,4,9,696,20,1,1,1,1,1,1,1,4,1,6,1,4,1,7,1,14,1,7,1,2,2,2,1,2,1,1,3,2,6,6,1,2,2,1,1,3,4,2,1,10,1,6,1,1,1,4,2,12,1,29,1,1,1,48,1,7,4,1,4,9,695,14,1,3,1,7,1,9,1,2,1,19,1,2,1,2,1,3,1,9,1,1,1,3,1,3,3,1,1,1,3,5,1,2,3,2,1,3,2,3,2,7,1,3,1,4,1,1,1,5,3,40,1,36,1,3,2,17,9,4,3,2,694,6,1,11,2,15,2,1,2,8,1,2,1,11,2,23,1,2,1,3,2,9,4,2,4,3,4,13,3,8,1,40,4,34,1,22,8,3,1,1,3,3,693,5,1,1,1,28,1,32,1,19,1,5,3,8,3,2,5,2,1,1,2,9,2,2,5,35,2,12,5,10,2,5,2,5,1,2,2,5,1,20,17,3,692,3,1,2,2,24,1,2,1,2,1,11,1,11,1,33,2,4,2,2,3,1,1,3,3,1,1,10,2,6,7,2,1,42,1,27,1,2,1,1,3,6,1,18,6,2,5,2,3,1,692,9,1,28,1,10,1,2,1,12,1,18,1,1,1,2,1,2,1,1,2,10,6,3,1,2,1,22,3,33,1,5,2,21,1,4,1,3,2,3,1,27,1,2,3,1,1,1,4,1,1,1,1,2,1,1,692,34,2,10,3,2,1,1,2,40,1,1,1,11,3,1,1,3,1,3,2,60,1,14,1,17,1,3,1,2,1,4,4,9,1,9,5,1,1,3,3,7,691,35,2,3,1,4,3,4,1,34,1,7,1,12,1,2,1,6,1,35,1,20,1,2,2,14,1,2,1,18,1,1,1,10,1,2,1,6,2,9,2,1,4,3,3,1,3,1,693,12,1,32,2,34,1,5,5,3,1,9,1,17,2,29,1,23,1,37,3,1,1,2,2,5,3,7,3,6,1,1,1,1,1,3,2,1,1,1,4,2,693,7,1,12,1,12,1,1,1,4,1,7,1,13,3,3,1,17,1,2,1,24,1,3,1,4,2,60,1,1,1,1,3,22,1,3,2,3,1,1,2,3,4,14,2,3,1,1,1,2,1,1,2,2,3,1,1,1,1,1,689,19,2,11,1,2,1,5,1,1,1,9,1,1,4,23,3,4,3,12,1,2,1,76,1,2,6,2,2,16,2,4,1,2,5,5,1,16,2,2,1,7,2,3,2,3,690,50,1,32,3,3,2,1,2,3,1,22,2,33,1,33,4,3,1,4,1,16,2,1,1,4,1,12,1,3,2,4,4,2,1,2,1,2,5,1,695,18,1,28,2,6,1,10,1,13,3,1,1,3,1,2,2,23,1,72,4,2,1,4,1,15,1,1,4,1,1,4,1,6,1,1,3,5,2,1,4,3,2,3,7,1,2,1,688,23,1,17,1,2,1,6,2,2,4,10,1,13,1,13,2,8,1,58,2,20,1,1,4,8,2,2,1,3,4,4,1,1,3,2,1,1,1,2,1,2,1,3,2,3,1,1,1,2,2,1,5,2,2,7,1,6,1,3,685,21,1,18,1,5,2,3,1,5,2,3,1,27,1,1,3,3,2,5,1,1,1,2,1,53,2,22,4,1,1,4,2,3,4,3,3,5,1,1,2,5,1,1,4,4,1,4,2,6,2,8,3,1,1,12,683,36,1,3,2,7,1,7,4,2,1,27,2,96,3,8,1,4,2,4,1,2,1,12,2,1,1,13,1,7,1,3,1,3,8,9,3,5,677,34,2,13,2,5,1,1,1,3,2,25,1,23,1,7,1,66,4,6,1,10,2,3,1,6,1,3,2,1,1,1,1,2,1,5,2,7,1,2,1,5,11,2,2,6,2,6,674,27,2,6,2,1,2,1,1,21,2,25,1,2,1,20,1,60,1,13,1,10,1,1,1,1,1,8,3,12,1,2,1,1,1,13,1,6,1,3,10,2,2,1,1,6,1,1,1,2,1,3,672,35,2,5,1,14,1,2,6,19,1,2,1,1,1,3,1,3,2,32,1,34,2,10,1,14,1,1,1,3,1,3,1,14,1,7,1,1,1,1,1,1,1,18,1,4,2,1,8,1,6,4,2,1,1,1,4,2,671,62,1,24,3,1,2,73,3,5,1,2,1,16,1,1,1,1,2,8,2,15,1,1,7,22,2,2,2,1,4,1,3,1,4,3,1,1,5,5,670,60,1,1,1,2,1,2,2,19,1,8,1,70,1,2,2,19,2,2,1,9,2,1,1,5,1,10,2,3,2,22,6,2,3,1,2,3,1,5,1,4,1,2,2,2,670,55,1,8,1,2,1,23,1,2,2,77,3,8,1,23,1,4,2,1,1,1,2,7,1,2,3,1,1,1,1,2,1,2,1,5,1,9,1,2,3,1,4,3,1,5,1,6,1,1,2,3,669,48,1,14,2,1,2,9,2,11,2,1,1,1,2,1,1,74,1,7,2,1,3,5,1,4,1,11,5,5,1,6,1,1,1,4,4,4,1,1,1,3,1,1,1,5,15,15,2,2,1,2,669,30,1,16,3,29,1,3,1,26,1,23,1,40,1,1,2,2,2,1,2,8,1,1,1,3,1,8,6,1,2,9,2,1,1,1,2,1,3,2,2,2,2,1,2,2,1,7,3,1,3,1,1,14,1,6,672,21,1,8,1,10,3,20,1,16,1,2,3,4,1,17,1,63,5,1,5,18,1,4,1,1,5,2,2,8,3,2,1,2,1,2,4,1,4,1,4,2,2,1,1,4,2,1,5,14,2,1,1,2,1,2,1,1,667,21,1,44,1,99,2,6,1,5,2,2,1,13,2,2,1,4,2,1,2,12,1,1,1,1,1,3,1,2,5,1,2,4,5,1,1,1,1,1,2,1,3,1,2,1,3,9,8,1,1,1,3,1,667,9,1,14,1,5,3,5,1,4,1,20,3,38,1,43,2,28,2,2,1,10,2,1,1,1,3,1,1,22,1,8,2,4,1,4,1,4,4,3,3,2,2,2,3,4,1,7,4,1,3,4,667,24,1,5,1,1,1,1,1,29,1,3,1,62,1,17,1,29,2,15,2,1,2,3,1,4,1,36,2,1,5,1,1,1,2,3,1,9,2,2,1,4,4,1,2,2,1,4,666,29,2,9,1,18,1,4,1,1,3,110,1,4,1,5,1,1,1,4,1,5,1,3,1,1,2,31,1,6,1,1,4,1,3,13,1,2,1,9,1,1,1,7,667,27,2,5,1,3,1,10,1,37,1,10,2,65,1,1,3,28,1,1,1,3,1,31,1,11,1,1,2,3,1,1,4,7,2,2,3,8,1,1,2,8,665,7,1,16,1,3,1,6,1,2,2,48,2,9,1,31,1,18,1,19,1,20,1,1,4,2,1,3,2,11,1,36,2,1,4,1,2,3,3,1,2,1,2,4,1,3,2,1,2,6,667,24,1,31,1,3,1,39,1,56,1,7,2,3,1,38,2,9,1,30,3,3,1,2,4,1,3,1,1,2,3,3,1,6,3,9,665,69,1,94,1,3,1,18,1,1,1,20,1,40,1,8,4,1,3,2,2,1,3,9,4,7,664,65,1,4,1,91,1,3,1,9,1,13,1,19,2,26,1,30,2,2,7,4,1,1,1,1,2,2,1,2,666,16,1,48,1,28,1,75,1,18,1,19,3,4,1,17,1,2,2,12,2,1,1,2,2,2,1,2,2,4,1,3,4,1,1,1,1,2,3,2,672,64,3,26,2,64,1,7,2,34,1,2,1,1,7,3,1,18,1,12,1,1,1,3,3,2,1,4,3,5,1,1,2,4,4,1,2,1,4,1,667,91,1,1,1,75,1,4,2,1,1,11,1,15,7,37,1,3,1,2,1,1,3,6,1,5,4,5,1,3,3,2,670,23,1,64,1,78,1,18,2,16,2,2,1,44,2,4,1,7,3,3,5,1,1,2,1,2,4,1,670,87,3,20,1,49,1,8,1,16,1,9,1,1,1,7,1,10,1,37,1,1,1,5,1,5,2,4,4,1,1,2,2,1,675,25,1,37,1,23,4,17,1,6,1,53,1,28,1,9,2,28,1,15,2,8,1,3,3,3,2,1,4,1,2,2,675,56,1,30,2,26,1,31,1,12,1,4,1,8,1,1,1,1,1,29,3,53,1,2,3,1,1,2,1,3,3,1,3,1,676,63,1,21,1,83,1,25,1,12,3,39,1,3,1,7,1,2,2,3,1,3,1,1,2,4,678,19,1,65,2,32,1,50,1,18,2,5,2,11,2,42,1,9,2,2,3,2,2,1,1,4,1,4,676,48,1,12,1,23,1,33,2,49,1,40,1,34,1,2,2,2,3,7,4,7,1,1,1,2,1,2,1,1,678,9,1,58,1,6,1,8,1,84,1,17,1,57,1,8,1,6,3,1,2,6,3,3,1,1,1,1,678,119,1,87,1,42,1,10,3,8,4,7,2,1,674,209,1,67,4,2,1,1,676,63,1,35,1,23,1,17,1,65,1,62,1,1,1,1,2,3,6,1,675,61,1,30,1,16,1,72,1,22,2,57,1,2,3,9,682,58,2,56,1,89,5,51,1,3,1,1,2,4,1,1,1,5,4,1,674,25,1,79,1,5,1,56,1,79,1,9,1,14,1,9,3,1,674,8,1,96,1,5,1,47,1,57,1,57,1,4,1,2,1,3,674,55,1,55,2,2,1,8,1,48,1,43,1,27,1,2,1,20,1,1,1,2,3,8,1,1,674,107,1,1,1,2,1,3,1,44,2,101,2,4,1,1,1,5,1,1,1,8,672,50,1,30,1,25,2,2,1,82,1,60,1,2,1,5,1,1,1,10,1,5,1,5,672,56,1,18,1,26,1,5,1,52,1,8,1,49,3,32,1,5,1,1,2,16,1,1,3,3,1,1,670,122,1,47,1,32,1,15,1,1,2,6,1,21,1,2,1,1,1,6,1,7,1,8,4,1,1,5,670,103,1,1,1,17,1,36,1,44,1,13,1,1,1,19,1,13,2,12,3,1,1,7,1,1,2,8,668,70,1,7,1,9,1,14,2,56,1,61,1,17,1,14,1,6,1,17,5,7,668,68,1,12,1,79,1,40,1,19,1,33,1,6,1,5,1,12,1,1,2,7,668,3,1,59,1,10,5,3,1,79,1,40,1,20,2,18,1,10,1,27,1,9,1,1,666,71,1,90,2,4,1,41,1,14,1,2,1,7,1,31,1,13,1,2,1,3,1,3,1,4,663,81,1,142,2,1,1,1,2,1,1,1,1,1,2,6,1,44,2,9,661,224,1,3,2,8,1,51,1,11,659,67,1,14,1,33,1,1,1,51,1,47,2,8,1,5,1,1,1,43,1,14,3,5,658,64,1,52,1,14,1,78,1,8,1,13,1,1,2,56,4,1,3,3,656,65,1,154,1,6,1,6,4,38,1,9,1,5,1,2,3,3,1,2,1,1,655,89,1,13,1,15,1,81,1,12,1,6,1,4,1,3,1,6,2,56,1,1,1,2,1,1,4,1,654,89,1,22,1,71,1,30,2,5,1,9,1,1,2,2,1,28,1,27,2,1,2,3,1,4,653,184,1,46,2,1,1,61,2,1,1,6,655,69,1,114,1,43,1,78,654,183,1,44,1,33,1,42,1,1,5,1,648,73,1,224,1,7,2,1,2,1,1,1,647,240,1,20,1,42,1,3,1,6,646,114,1,127,1,52,1,11,1,1,1,9,643,111,1,120,1,6,1,1,2,1,2,1,1,52,3,2,2,15,638,232,1,5,2,2,2,5,1,62,3,5,1,3,637,29,1,210,1,57,1,14,1,4,2,2,1,3,635,307,2,8,3,2,1,6,632,194,1,35,1,37,1,39,1,3,1,5,3,10,630,231,1,72,1,6,1,1,1,5,1,2,1,8,630,187,1,47,1,66,1,2,1,3,1,1,2,5,1,2,2,8,630,308,1,2,4,3,1,4,2,7,629,305,1,1,5,1,2,8,3,6,629,306,1,6,1,15,1,3,628,11,1,301,1,5,1,4,1,4,1,3,628,171,1,134,1,13,5,8,628,305,2,1,1,13,3,9,627,322,1,12,626,322,1,12,626,322,1,12,626,307,1,8,2,4,1,1,3,8,626,318,1,2,6,8,626,321,5,9,626,266,2,53,2,2,1,10,625,267,1,48,1,4,3,12,625,268,1,47,4,1,7,9,624,316,14,8,623,316,12,1,2,7,623,315,2,1,14,6,623,317,17,3,624,315,17,4,625,306,2,6,648,309,651,307,654,156,1,150,654,306,656,305,655,306,655,4,1,168,1,131,656,190,1,114,658,300,661,300,660,301,659,301,1,1,658,11,2,290,658,12,1,288,661,300,662,299,661,300,660,15,1,283,662,6,4,1,1,6,1,280,662,6,4,5,1,1,1,281,664,3,6,6,2,279,657,1,7,3,2,1,11,187,1,87,1,2,658,1,6,5,13,277,659,2,5,6,9,2,1,276,660,2,5,6,9,2,1,270,1,5,661,1,7,4,10,271,1,5,670,7,6,210,1,66,672,7,3,1,1,210,1,65,674,6,2,213,1,61,2,1,675,6,2,278,675,4,8,8,2,5,1,255,1,1,676,3,9,8,3,260,679,4,7,8,2,260,680,3,8,11,1,196,1,60,2,1,678,6,5,269,1,1,680,5,1,4,1,271,679,5,1,3,3,265,1,4,681,8,1,28,1,172,1,64,1,3,681,5,1,2,2,28,3,235,2,2,681,7,3,266,2,2,680,8,4,16,1,249,1,1,681,4,1,2,5,266,1,2,680,5,8,265,1,1,681,5,4,271,681,1,1,4,2,20,2,232,1,18,682,4,2,254,1,17,684,274,1,3,683,2,2,271,1,2,683,1,2,272,1,2,689,269,2,1,686,272,2,2,685,9,1,266,684,3,1,29,1,244,690,27,1,243,685,1,4,13,1,256,687,1,3,12,1,146,1,109,686,1,1,2,1,6,1,2,1,216,1,42,690,8,2,2,2,8,1,248,691,7,3,10,2,247,1,1,690,6,4,9,3,249,689,8,3,9,3,227,2,20,690,3,2,3,4,6,3,11,1,231,1,5,2,1,688,3,3,2,5,4,4,234,1,7,4,6,688,3,3,3,1,1,2,3,5,243,1,1,2,4,1,1,687,3,3,4,1,4,5,246,3,4,687,1,7,7,6,3,1,245,1,2,691,1,3,2,1,4,6,4,1,196,1,51,688,2,5,6,7,3,1,191,2,15,1,6,1,33,686,3,1,1,4,5,8,253,686,2,2,2,4,3,8,15,1,4,2,227,1,5,685,2,1,3,1,5,9,14,2,195,2,45,684,1,1,7,11,3,1,2,1,7,2,241,684,1,2,2,1,2,12,3,1,2,2,250,1,1,680,2,3,4,12,2,3,243,1,8,684,2,1,4,19,3,2,233,2,11,1,1,682,7,18,6,2,238,1,5,684,1,2,4,18,240,2,3,3,4,684,2,1,3,18,7,1,32,1,198,4,3,1,1,1,7,681,6,18,14,1,225,3,6,5,2,681,6,18,1,1,14,1,223,3,5,5,2,684,3,21,166,1,72,1,8,1,1,1,1,685,3,18,1,1,245,2,2,1,1,686,3,20,244,1,3,1,2,687,3,20,2,1,240,2,2,3,2,686,2,18,9,1,151,1,79,2,2,4,1,4,2,685,1,19,12,1,232,10,1,705,6,2,237,1,1,8,2,3,1,699,8,1,236,5,1,5,2,702,4,1,240,3,1,2,1,1,1,5,1,701,158,1,86,15,1,700,246,714,2,1,3,1,13,1,224,715,7,2,4,1,5,3,224,714,9,2,4,1,18,1,213,712,9,1,25,1,213,711,10,1,3,2,234,710,25,1,3,1,221,709,15,1,1,1,13,1,22,2,196,708,8,1,6,2,14,1,22,1,1,1,195,709,7,2,22,1,220,1,1,706,3,1,3,2,3,3,3,2,235,706,5,4,3,2,149,2,90,706,4,6,1,3,152,2,83,3,1,706,4,7,1,4,5,1,24,2,205,1,1,706,1,9,1,1,2,1,30,2,22,1,185,716,11,1,21,2,21,9,4,2,1,3,170,717,8,1,7,1,14,2,15,1,3,23,169,718,30,1,13,33,166,719,26,4,12,37,163,721,22,4,8,44,162,722,19,5,7,47,160,724,16,5,7,49,160,723,16,5,6,50,161,723,15,5,5,52,161,723,15,3,4,54,162,724,13,4,3,55,162,724,7,1,5,61,160,1,1,725,11,1,3,58,160,2,1,725,15,57,160,2,2,725,3,1,9,26,2,3,4,21,163,1,3,724,14,24,15,16,164,1,3,725,12,23,19,12,166,2,3,723,2,4,5,19,28,4,171,2,3,723,2,4,4,19,209,721,3,1,1,4,3,17,212,720,13,15,213,720,4,1,8,14,215,718,2,4,6,16,108,1,102,1,3,719,1,4,7,14,217,718,12,4,2,6,220,717,11,4,4,5,219,717,8,1,2,5,3,9,218,715,2,1,8,12,218,2,7,711,1,5,6,11,222,1,4,710,4,1,3,2,3,10,225,1,2,712,11,6,3,1,227,711,11,1,2,4,232,711,1,4,3,1,6,2,230,1,3,715,4,1,6,1,198,1,26,1,1,2,5,715,238,4,4,715,241,1,3,716,8,2,234,717,9,2,232,717,11,1,10,1,221,717,11,1,10,1,221,717,10,4,228,719,10,5,225,726,5,7,222,730,3,6,225,727,2,7,149,1,75,727,3,7,24,5,120,1,73,727,4,8,23,5,120,1,75,725,4,8,22,5,121,1,77,724,3,8,22,4,121,2,70,1,6,735,19,6,121,2,71,2,7,734,5,2,10,5,34,1,88,2,74,2,6,735,3,1,8,6,33,3,87,2,84,752,32,5,87,1,77,1,7,751,30,7,165,2,3,1,2,1,1,748,28,10,176,747,28,11,154,1,19,748,26,11,156,1,19,12,6,39,1,691,23,13,154,1,26,4,13,728,23,13,1,1,152,1,39,1,4,728,21,16,149,1,3,2,35,1,6,735,12,17,149,1,2,5,42,737,2,23,148,2,1,4,46,760,147,3,1,2,44,1,5,757,148,6,54,753,153,2,47,2,5,751,210,22,1,728,210,752,211,750,134,1,36,1,43,16,1,728,118,3,14,2,36,1,42,15,2,727,119,3,14,2,13,1,65,14,3,726,138,1,13,1,62,1,2,14,2,726,139,1,74,1,5,13,2,726,151,11,9,1,48,12,3,725,151,16,30,1,23,14,1,725,145,26,45,1,2,1,1,13,1,725,144,30,15,1,7,2,17,1,5,13,1,725,143,34,14,1,5,1,9,2,10,1,4,10,2,725,142,37,28,2,7,1,1,1,5,6,1,3,2,724,141,1,1,39,10,2,12,5,1,11,2,4,2,4,1,725,141,46,20,3,3,10,1,4,1,1,1,3,2,725,140,46,29,8,2,4,2,2,2,725,140,50,1,2,17,1,1,1,2,9,7,2,2,726,140,56,13,4,2,4,15,726,57,1,80,61,12,1,3,5,10,1,3,727,56,2,80,64,14,1,12,1,3,727,139,67,22,1,2,730,138,70,20,732,139,73,8,741,138,822,139,822,54,1,82,823,138,822,137,824,136,824,136,824,136,825,108,1,27,823,136,815,6,3,135,817,6,3,134,818,141,819,141,820,141,820,140,821,140,821,33,1,100,1,4,822,33,1,105,822,32,2,105,822,139,822,139,822,29,1,110,821,34,1,103,823,33,2,101,825,135,827,32,1,99,830,130,830,71,1,59,830,130,831,129,832,128,833,123,1,4,833,123,1,4,833,127,834,127,833,128,832,129,832,129,831,123,4,3,830,71,6,45,4,4,821,4,1,1,4,65,3,10,1,15,1,21,1,5,4,3,822,4,1,3,1,65,1,15,5,2,2,5,2,19,2,5,4,2,821,75,1,17,18,12,1,10,827,93,3,1,14,12,1,2,1,7,826,96,1,1,1,1,3,7,2,12,1,3,3,3,3,2,822,98,3,8,6,1,1,7,1,3,3,1,5,1,821,100,2,6,13,9,1,2,5,2,820,107,18,8,6,1,820,8,1,6,1,91,21,4,7,2,819,8,2,96,25,3,5,2,819,9,1,95,31,2,2,1,819,106,854,87,3,14,1,1,855,13,1,74,4,10,858,14,1,2,2,70,5,8,859,15,1,2,1,2,2,66,3,1,4,4,859,9,1,1,1,3,1,6,1,71,867,10,2,2,1,1,1,4,3,70,867,13,2,3,1,2,4,68,868,9,1,6,1,6,1,67,870,8,4,4,1,72,872,8,2,5,1,5,1,66,873,88,873,14,1,70,1,1,874,13,3,6,1,62,876,15,1,67,878,15,1,64,881,75,886,70,891,70,891,69,892,69,892,69,892,69,892,62,1,6,892,61,2,6,892,61,2,6,892,61,2,5,893,60,3,5,893,60,3,4,894,59,4,4,894,60,2,5,894,59,3,4,895,59,3,4,895,59,2,5,895,59,1,5,896,59,1,5,896,59,1,4,897,59,2,3,897,59,2,2,898,59,2,2,898,59,2,1,899,2,1,55,903,58,903,13,1,44,1,2,898,16,1,43,901,17,1,41,901,7,1,6,1,44,902,2,3,2,1,51,902,2,3,9,1,44,903,1,1,8,1,2,1,44,903,2,1,5,3,46,1,1,904,2,2,50,2,1,898,1,5,3,1,36,3,11,1,1,1,1,895,1,1,1,4,4,1,29,4,2,5,9,1,4,895,1,3,7,1,27,5,3,6,13,899,7,1,24,20,10,894,2,3,31,24,4,1,2,890,1,1,2,1,1,3,1,1,28,25,3,895,7,1,1,1,26,27,3,889,1,5,7,1,28,22,1,4,3,4,1,880,1,1,3,1,1,5,3,3,1,1,24,24,3,1,3,5,2,886,1,2,1,4,4,1,23,26,6,3,4,886,1,2,2,4,27,28,4,5,1,890,3,1,30,908,2,5,1,10,1,1,5,4,23,915,1,10,1,2,1,2,28,926,1,2,32,924,3,3,31,924,1,5,2,3,24,924,1,7,2,4,26,900,1,5,1,14,1,3,1,3,1,4,24,908,2,4,1,18,1,1,1,1,23,909,3,15,1,8,25,908,4,24,23,910,2,15,1,6,4,3,17,1,3,2,1,905,2,16,2,5,28,908,4,14,1,5,1,1,2,2,23,907,8,1,1,5,1,1,1,2,4,2,3,2,21,1,2,906,5,1,5,1,1,1,2,4,19,1,12,909,4,4,8,3,34,907,7,1,8,3,19,2,12,1,1,907,14,5,6,1,1,1,7,1,1,1,1,1,12,910,13,5,6,1,9,2,2,2,10,911,13,2,1,2,4,3,10,5,9,913,15,1,6,1,11,4,10,914,31,7,1,2,6,916,29,1,2,1,1,1,1,1,6,937,1,3,14,1,5,945,6,1,10,941,3,3,14,941,3,4,11,950,10,951,10,951,10,952,8,955,5,959,1];
            case 13:
                return [974,2,1918,4,1918,2,103718,2,1919,2,105151,2,1919,5,1916,3,1919,2,46108,1,1918,3,1918,3,1918,2,1919,2,6064,2,1917,1,1,1,1918,1,17312,2,1919,2,1919,2,1920,3,1918,1,1,1,1917,4,1917,3,1919,1,22614,3,1918,3,580,1,1918,2,32082,2,1920,1,1920,1,1920,2,44205,1,3836,2,5,2,1734,1,185,3,1731,2,187,1,1731,2,186,3,1731,1,186,1,1,2,1730,1,187,1,509,1,1222,1,185,3,508,2,1222,2,693,4,1222,2,171,2,519,5,1222,1,172,2,519,5,1396,1,518,6,1401,1,511,6,1402,2,243,1,267,5,1404,1,242,2,1919,2,1919,2,1864,2,53,1,1465,1,156,2,241,4,1517,1,155,2,242,4,1673,1,232,1,1920,1,1919,2,1920,1,2249,3,1409,1,508,3,1918,2,1919,3,3370,1,2057,1,14,2,1767,2,135,1,14,1,1767,3,1,1,1916,1,2,2,1917,4,1917,4,1913,2,1,6,1907,1,4,9,1915,3,193,3,1,2,1705,1,3,4,8,1,2,1,190,6,1710,1,1,1,201,7,1704,1,209,6,1828,1,85,5,1,1,1712,2,3,1,110,1,86,5,1720,1,196,1,2,1,2,1,1712,1,4,1,1,1,103,3,92,1,1,2,1822,3,95,2,1820,4,91,1,1728,1,194,1,1724,1,195,2,1811,6,101,3,1811,6,100,5,1811,4,82,2,18,1,1540,2,268,2,2,2,84,2,1560,2,267,2,1651,1,268,1,1920,1,7808,2,1919,2,1919,2,7,1,1920,2,1523,1,395,4,1521,2,394,4,1521,2,394,4,1521,2,394,3,1522,2,395,2,1522,1,6057,2,1919,2,1920,1,3795,1,1919,2,1919,2,3755,2,444,5,1470,2,449,2,3523,2,98,2,1,1,1517,1,299,2,98,5,1516,1,298,2,100,4,1516,1,298,2,101,2,1517,2,1896,1,22,2,172,1,1613,3,103,5,22,8,164,3,1614,1,104,6,22,5,166,2,1616,2,100,9,21,1,303,2,91,2,1390,2,99,10,325,2,91,2,1389,1,1,1,98,11,325,1,72,4,16,2,199,1,1188,2,1,1,97,11,110,2,287,3,1,1,1405,1,100,9,112,2,287,5,219,1,1185,1,100,4,118,1,285,2,2,2,217,4,1697,4,218,1,1186,1,175,2,2,1,329,1,2,2,1582,2,311,2,18,1,1587,1,310,4,20,1,1896,4,1918,3,1795,1,1919,2,372,2,1484,1,55,3,1,2,125,1,247,3,1482,2,55,4,126,2,247,3,1482,2,55,6,72,1,1649,1,192,7,71,1,1844,4,1916,5,76,2,146,2,1691,3,77,2,55,2,19,2,69,1,1692,1,135,2,19,2,1897,2,1913,5,44,2,1537,1,332,5,44,2,1870,7,76,1,1837,8,1586,1,326,5,1,2,1576,1,29,1,306,3,79,1,1,1,1528,1,2305,2,1497,1,15,1,405,2,1920,1,1499,1,344,2,1913,2,3,3,1869,1,1,3,39,2,3,2,209,1,1361,1,291,2,7,3,44,2,208,2,1663,2,4,1,2,1,246,2,1532,2,122,1,48,1,213,1,1373,1,159,3,118,1,13,1,36,2,212,2,1446,2,55,2,30,2,114,1,1716,1,55,2,31,2,116,1,264,1,1504,2,149,1,16,1,1627,1,19,2,269,1,1649,2,297,1,1876,1,2,1,12,1,26,2,1587,2,331,1,3701,4,391,1,1526,3,391,1,3820,2,1361,1,557,1,1346,1,21,1,2328,7,1914,6,152,4,1362,1,396,5,153,4,1362,1,396,5,1804,3,109,4,1805,3,109,3,1806,2,110,5,1750,1,1,1,163,5,1162,3,585,3,164,2,1163,4,1917,3,125,1,447,2,1341,4,125,2,447,3,60,1,1279,4,124,3,250,2,1665,3,251,3,1663,5,483,2,20,1,2,1,1407,5,482,4,1431,4,233,1,11,1,235,5,1432,1,484,3,39,1,1638,1,239,2,1306,1,379,1,1537,2,2,1,371,1,5,1,278,1,1258,3,1,3,1914,7,640,3,1270,4,1,1,1,2,587,2,51,2,1270,4,1,4,587,2,43,1,7,2,246,2,1021,10,652,1,236,1,1021,5,2,3,367,1,365,1,1177,6,1,2,376,1,1536,8,640,1,1272,6,627,1,14,2,1273,2,491,1,139,1,12,3,1919,1,245,5,1394,1,522,3,1714,1,73,4,127,2,1788,4,1525,1,391,4,1535,1,381,4,18,1,1898,4,3452,1,132,1,247,1,1671,2,246,2,122,2,1546,3,242,1,127,2,1546,2,242,2,3,1,96,1,26,2,1789,3,2,4,93,3,1711,2,103,4,3,7,85,2,1,3,1737,1,79,3,2,8,6,1,78,6,24,1,1792,1,5,8,5,3,76,3,25,3,1800,4,8,1,105,3,1801,3,113,3,1920,2,1918,3,1674,1,1910,1,8,3,1297,2,608,1,1,1,6,5,1297,4,471,1,135,2,5,2,1,3,1297,6,468,3,133,2,5,1,1,5,1297,8,466,3,140,1,2,1,2,1,1296,9,467,1,141,5,1297,2,1,7,609,5,1296,11,610,3,1297,4,2,5,334,4,1573,10,334,3,118,1,1457,8,334,2,1578,8,333,2,273,1,1307,5,456,3,1456,6,456,3,150,1,138,1,1168,4,456,2,289,1,1171,2,803,2,1919,6,1230,1,1,1,605,4,50,1,24,2,1234,2,1,1,602,3,47,2,2,1,1256,3,1,2,2,1,601,2,48,3,1,1,1260,5,491,2,158,5,27,1,1,1,1230,3,482,1,7,5,102,5,51,5,27,1,1,1,1228,1,1,2,1,1,492,1,94,1,8,5,53,2,1143,2,115,1,497,1,93,3,6,3,56,1,30,1,1110,4,341,3,363,4,5,3,36,2,45,1,3,1,1110,4,341,3,270,4,90,3,5,2,38,1,1161,3,341,2,271,3,1,1,134,3,1162,2,342,2,271,3,115,1,17,2,1,1,1,1,1162,3,749,6,1163,4,459,2,141,1,141,9,1164,4,459,3,273,3,7,7,1,1,1164,3,5,1,56,2,274,3,118,3,271,5,7,8,2,1,1163,2,4,4,53,3,274,3,118,2,272,2,11,7,1165,3,60,4,274,3,118,2,284,8,1,1,1162,4,58,6,395,3,278,1,4,7,2,1,1162,4,57,7,395,3,288,3,1165,2,58,5,686,1,1,3,1168,5,52,5,688,1,1,2,1167,6,50,1,553,1,131,1,4,2,1,4,1167,6,741,1,1,3,1,2,1166,6,742,2,1,1,1,2,1167,6,592,1,146,1,1,3,1173,8,396,2,136,1,200,2,4,1,1171,1,2,5,88,1,307,3,333,1,2,4,1173,2,1,7,395,3,334,4,1,1,1173,10,395,3,38,1,271,1,1202,7,1,1,80,1,315,2,1514,8,86,1,630,1,1196,7,446,1,93,2,1373,7,540,2,1372,7,539,2,1374,5,540,2,1374,5,20,5,515,2,4,1,168,1,1201,3,19,9,513,1,174,1,1223,2,1,9,561,1,122,2,1214,2,5,4,1,15,1,1,676,3,1212,10,1,17,1,2,676,2,1213,9,1,4,4,12,676,1,1214,9,2,4,4,1,6,4,591,1,1299,3,1,3,1,2,3,1,12,6,1891,5,1,3,14,7,498,1,2,1,1,1,46,1,1340,6,1,2,13,8,402,1,94,3,1,3,47,1,147,1,1192,5,15,9,497,1,3,4,76,1,1310,4,5,1,9,2,1,4,412,3,90,3,75,1,117,1,1193,5,10,1,3,6,413,3,91,2,75,3,25,1,1284,4,15,3,585,2,1312,3,11,1,2,1,589,2,1313,2,6,1,5,1,1906,7,1,1,2,4,422,1,1483,7,4,5,590,1,1315,7,3,5,593,1,1312,9,1,5,592,1,1314,15,1907,13,423,1,1488,11,1910,11,604,1,56,3,1248,9,582,1,77,5,1248,7,653,3,3,4,1,2,1249,5,579,1,73,3,4,1,1,5,13,1,1236,3,648,1,5,2,6,1,1,3,13,3,1235,2,663,1,17,3,1918,2,1919,2,1659,1,1,1,257,1,1833,1,7,1,2080,2,14,1,1816,1,87,2,1453,1,300,1,79,1,85,1,1574,1,93,2,135,3,22,2,88,1,5,1,1,1,1569,1,90,2,126,1,1,3,2,5,22,1,89,1,12,1,1790,5,23,1,88,1,21,1,1485,3,293,3,122,1,16,2,1480,4,254,1,26,1,3,1,7,2,13,1,126,2,1796,1,93,1,28,2,1795,2,1919,3,1917,4,97,1,1822,1,97,1,7,1,1912,2,1790,2,135,1,3602,1,230,3,1724,1,33,1,162,1,1920,1,1920,1,1909,1,5598,1,2073,3,1767,3,54,1,97,1,9,1,16,2,1737,1,153,1,7,1,5,1,13,4,1751,1,129,1,1,1,6,2,21,1,3,4,1634,1,96,1,157,2,11,1,14,3,1745,1,140,1,5,1,1,1,23,2,1914,1,5,1,1766,1,15,1,97,1,4,1,1734,1,52,1,11,1,2,1,115,1,23,1,1,1,1897,1,3,1,1771,1,139,1,1,2,12,1,1,1,2,1,17,1,1736,1,10,1,6,1,121,1,5,3,5,1,1493,1,277,1,141,3,25,1,1473,1,1,1,415,3,1,1,4,3,1492,1,313,1,96,1,2,1,3,5,3,3,1491,3,270,1,140,3,1,1,1,1,1,1,18,1,1478,4,230,1,1,1,168,1,1,1,1,1,1,2,2,1,2,1,4,5,9,1,1,1,1481,4,106,1,186,1,108,2,1,1,2,2,2,2,1,1,17,3,1482,1,1,1,272,1,128,3,8,1,13,3,1,6,1483,2,292,2,108,3,5,1,15,1,1,1,1,6,1442,1,40,2,149,1,252,1,1,2,3,1,1,1,19,4,5,1,1,2,1605,1,181,1,86,1,7,1,1,1,6,1,16,3,6,4,1877,1,3,1,1,1,4,1,11,1,4,1,1,3,2,1,3,2,1,1,1633,1,122,1,7,2,125,2,7,3,5,1,3,1,1,5,1,1,1750,1,5,1,5,2,2,1,7,1,96,1,10,1,1,1,5,2,9,3,2,3,3,1,2,8,1746,1,140,3,10,2,1,3,6,8,1620,1,10,1,249,1,18,2,2,2,7,6,1,2,1618,2,126,1,1,1,9,1,5,1,123,1,23,6,1597,1,286,1,2,1,28,3,1777,1,109,1,2,1,26,3,1893,1,26,1,1557,1,214,1,113,1,1590,2,1919,2,197,1,2,1,2,1,7,1,122,1,1584,2,200,1,131,1,1747,1,36,1,87,3,1650,1,267,4,1791,1,38,1,66,5,16,2,1895,9,15,2,1462,1,318,1,53,1,57,12,11,1,1465,2,44,1,326,1,2,1,50,17,8,3,1466,2,424,19,7,3,3,1,1552,1,241,2,90,22,6,2,1672,1,125,1,2,1,88,23,6,2,1,1,1539,3,260,1,42,1,41,7,3,14,5,4,1,1,1537,4,253,1,6,1,43,2,38,8,3,8,1,5,4,2,2,2,1541,1,245,1,10,1,47,2,36,8,2,2,1,5,1,1,1,7,3,1,4,1,1797,1,48,2,12,3,19,7,1,5,2,4,4,4,2,2,1811,1,56,5,11,11,1,2,2,3,9,5,6,1,5,1,1537,1,263,1,56,10,7,10,1,4,1,2,9,6,4,1,3,3,1,1,1664,1,7,1,126,1,58,28,2,4,10,5,4,2,1807,2,37,1,5,1,12,28,1,8,7,5,5,3,1,1,1,1,1674,1,23,1,101,1,2,1,38,1,1,2,14,28,3,4,9,5,5,3,3,1,1659,1,145,1,1,1,29,1,1,2,3,3,12,5,2,14,1,1,3,3,2,2,1,1,10,3,7,1,6,1,1696,1,143,5,13,4,3,11,15,1,5,1,4,4,1335,1,1,1,3,1,6,4,457,1,7,1,34,1,3,1,16,5,3,8,29,2,1337,2,3,2,3,1,1,4,502,2,17,2,2,1,1,3,2,5,34,1,1331,1,1,4,1,2,2,2,1,4,462,1,2,1,5,1,2,1,26,2,26,1,1,7,28,1,1336,1,2,3,1,1,2,3,1,4,463,1,61,2,1,1,3,6,26,1,1338,1,1,2,1,1,4,1,1,1,1,1,470,1,50,1,8,1,4,5,1366,3,1,1,1,3,1,3,335,1,133,2,19,2,30,1,14,4,1366,1,1,5,1,1,340,1,17,1,8,1,97,1,8,1,1,1,3,1,15,1,44,5,1367,5,352,1,125,1,1,1,17,1,6,1,37,7,1369,1,370,1,84,1,1,1,6,1,42,1,36,7,1693,4,139,1,22,1,8,1,1,1,45,5,1693,4,25,1,14,1,96,1,13,1,19,1,3,1,43,5,1378,1,314,3,34,1,96,2,1,2,3,1,14,1,22,1,1,1,2,1,18,1,18,5,1694,1,132,2,2,5,2,4,25,1,9,1,1413,1,319,1,19,1,115,1,2,1,2,3,2,1,1,1,10,1,4,1,6,1,12,1,32,1,1390,1,39,1,405,6,1,6,1,1,6,1,10,1,4,1,46,1,13,1,1367,1,3,1,6,1,17,1,291,1,4,1,129,4,1,7,1,2,14,1,1437,1,2,1,6,1,15,1,3,1,308,1,12,1,97,3,1,1,1,1,1,11,1453,1,9,2,16,1,1,1,12,1,155,2,116,1,131,1,1,1,1,3,1,2,1,8,1447,1,8,1,11,1,2,2,6,1,3,1,5,1,1,2,2,1,142,1,1,2,10,1,120,1,128,1,2,2,1,2,1,10,13,1,8,2,14,4,1408,2,15,1,25,1,141,1,1,4,8,2,118,1,32,1,90,1,4,2,1,2,9,7,3,1,2,1,1,1,14,7,8,7,1409,1,1,1,3,2,5,1,5,1,3,1,3,1,5,1,4,1,5,1,141,3,7,2,98,2,14,1,2,1,124,1,5,1,1,1,8,1,3,8,17,11,7,7,1409,1,5,2,1,1,1,1,3,1,1,1,1,1,3,1,5,2,2,1,12,3,134,1,6,1,5,1,99,3,148,1,9,3,1,4,2,4,2,1,11,11,3,15,1416,1,3,1,11,3,19,1,148,1,117,1,128,1,3,1,7,5,1,12,1,23,2,14,1404,1,1,1,1,1,6,1,4,1,8,2,4,1,3,1,2,1,1,1,3,1,9,2,397,2,1,1,4,1,3,35,3,14,3,2,56,1,1344,1,3,1,1,1,5,1,1,1,20,1,17,1,141,2,138,1,104,1,3,1,4,1,4,2,1,1,5,2,3,10,1,4,2,2,3,7,2,1,1,15,2,4,29,1,1366,1,3,1,1,1,3,1,3,1,6,1,1,1,9,1,1,1,3,1,5,1,1,1,4,1,2,1,391,2,5,1,1,1,9,1,1,9,1,7,4,1,1,1,2,5,2,14,1,2,3,5,26,1,1,1,1364,1,4,2,12,1,2,1,3,1,5,1,15,1,4,1,2,1,176,1,106,1,116,2,1,2,8,1,2,2,1,3,2,6,1,4,2,24,4,7,1391,1,2,1,4,1,5,1,1,1,7,1,1,1,1,1,1,1,4,1,4,1,5,1,4,1,1,2,1,1,284,1,106,1,1,1,8,1,2,1,7,1,3,2,1,4,1,7,1,1,3,1,1,15,1,5,3,10,27,2,1364,1,1,1,3,1,1,1,10,1,4,1,7,3,1,1,5,1,10,1,167,1,220,1,3,1,1,1,9,1,14,1,1,3,1,5,2,3,4,21,3,12,26,1,1380,1,9,1,9,1,1,1,2,1,1,1,8,1,144,1,249,2,17,1,2,1,6,7,7,1,2,1,2,18,6,11,25,1,2,1,1361,3,5,1,26,1,14,1,393,2,22,1,6,3,1,3,3,1,3,2,4,17,8,12,3,6,2,1,12,2,1,2,32,1,1326,2,1,1,9,1,1,1,1,2,4,1,3,1,7,2,2,2,2,1,2,1,323,1,2,1,66,1,5,1,1,1,19,1,5,2,2,1,7,1,1,5,4,2,4,9,8,13,3,6,14,3,2,1,32,1,1326,2,1,1,3,1,2,2,4,1,1,1,11,2,2,1,1,1,1,1,1,1,7,1,320,1,4,1,65,1,1,1,27,1,3,3,1,1,10,1,1,2,4,1,2,12,9,2,2,2,2,5,3,5,1380,1,12,1,3,1,4,1,1,1,4,1,3,1,3,1,3,1,1,2,322,2,9,3,1,1,85,1,3,1,2,3,6,1,1,2,1,3,1,1,2,1,2,11,6,1,12,4,2,5,1381,2,12,1,2,1,7,2,2,1,9,1,1,1,152,1,165,1,5,1,4,1,3,1,7,1,57,1,32,2,10,1,3,1,1,2,1,1,2,12,3,7,10,1,4,5,14,1,1365,2,1,1,5,2,4,1,14,1,2,1,1,1,331,2,1,2,4,1,5,1,1,2,84,1,5,1,9,2,1,2,1,1,1,1,4,12,2,8,12,2,2,1,1,2,13,3,20,1,1343,3,4,1,1,1,3,1,3,1,4,2,3,1,2,4,335,2,13,1,65,1,21,3,5,1,6,1,1,1,4,2,1,1,1,12,2,10,10,2,2,5,7,1,5,2,15,6,1345,2,1,1,9,1,5,1,351,1,6,1,1,1,1,1,6,1,36,1,48,1,1,2,5,1,1,2,3,2,2,1,1,11,3,3,2,6,9,3,2,2,9,1,1,2,1,4,9,4,1,6,1340,1,3,7,10,1,10,1,2,1,291,2,44,1,3,1,3,2,4,1,6,5,78,1,1,1,12,2,3,1,2,1,1,11,1,11,11,2,19,1,1,6,2,11,1343,2,1,2,4,1,1,3,3,1,5,1,5,2,295,3,42,1,2,1,2,1,1,1,6,1,7,2,1,2,44,1,32,1,1,1,9,1,2,2,4,2,2,11,2,3,1,1,3,3,31,1,2,21,1342,1,3,10,1,1,1,1,1,1,70,1,7,1,274,1,2,3,2,1,2,1,2,1,4,7,28,1,60,1,3,2,1,2,2,11,6,1,5,3,12,1,17,1,8,2,4,4,2,4,1344,6,1,1,1,3,2,1,1,1,2,1,4,1,1,3,65,1,275,1,1,1,4,1,4,2,5,6,91,1,4,4,1,11,13,3,26,1,10,1,1,2,5,2,2,3,1345,2,1,4,1,5,7,2,1,1,62,2,23,2,253,4,1,8,2,2,1,1,3,3,1,4,91,1,1,1,1,1,1,1,1,13,2,1,1,1,7,2,12,1,34,2,1,1,1348,7,1,2,4,2,2,1,77,1,14,1,70,1,91,1,91,2,1,1,1,2,2,2,3,3,6,7,96,3,1,18,4,1,1,2,1,2,5,2,1,3,34,1,1351,3,1,6,8,1,182,1,70,4,75,3,3,2,5,2,4,4,1,1,2,2,1,3,5,6,101,16,9,4,2,1,1,7,1387,4,7,1,5,1,74,1,1,1,10,1,165,3,75,1,1,8,1,4,5,1,1,2,6,3,3,8,3,1,91,1,1,2,2,16,5,1,4,3,4,7,1386,2,91,1,1,1,177,3,62,1,4,1,3,1,1,1,4,11,6,1,3,3,2,2,4,8,3,1,90,1,1,1,4,16,5,1,4,4,4,8,26,1,8,1,3,1,1456,1,160,3,64,1,2,1,4,2,6,4,1,4,10,1,2,1,1,2,5,7,3,1,14,1,82,16,12,3,2,2,1,7,22,1,13,1,1439,1,250,2,1,2,8,3,1,4,11,1,6,1,4,3,1,2,3,1,14,3,80,8,1,7,5,1,7,3,1,12,32,1,1441,1,249,1,3,1,8,1,3,4,1,1,7,3,1,1,3,1,10,1,2,1,16,3,79,9,1,2,1,4,7,1,1,1,3,2,2,12,33,1,1454,2,233,1,4,1,9,1,4,3,4,1,41,2,1,2,78,4,1,2,6,4,2,1,7,1,2,1,3,13,32,1,1,1,1648,1,39,4,15,3,5,1,3,1,21,1,3,3,1,3,1,1,1,2,2,1,78,5,10,3,10,1,5,9,1,3,31,1,1360,2,289,1,40,1,2,1,13,1,12,1,1,1,19,1,3,6,2,1,5,4,75,5,5,1,5,3,1,2,2,1,2,3,7,7,21,1,11,1,1361,4,289,1,42,1,10,1,16,2,20,1,2,4,1,2,1,1,1,1,82,5,11,4,5,1,9,1,1,6,1397,3,329,1,55,4,1,1,1,2,1,1,2,1,1,1,77,4,12,3,19,6,5,1,22,1,10,1,1,1,1354,5,288,1,23,1,2,2,10,2,54,1,2,6,3,1,2,2,77,3,12,3,13,1,6,1,1,3,4,1,18,1,5,2,3,1,5,1,1354,7,327,1,1,1,4,1,1,1,51,3,5,1,1,1,77,2,14,2,5,1,1,4,4,1,14,1,17,1,10,1,1360,4,1,2,325,4,7,1,51,1,1,1,1,2,3,1,77,3,14,2,11,1,17,1,1390,2,2,4,281,2,25,1,2,3,10,1,2,1,60,2,6,1,1,1,74,4,15,1,3,1,2,2,41,1,15,1,1354,9,142,1,26,1,107,1,31,1,1,1,1,1,8,2,9,1,6,1,3,1,45,1,81,3,17,1,26,1,1392,9,277,1,30,3,1,1,9,3,147,3,1438,7,291,2,3,1,1,2,11,2,5,1,3,2,15,1,134,2,64,1,11,1,1360,6,153,1,140,1,2,1,3,1,10,1,1,1,3,4,1,2,1,1,148,3,1436,6,300,1,10,1,2,1,2,1,1,6,2,1,150,1,3,1,1431,6,151,1,16,1,145,1,1,1,1,9,32,1,17,1,98,3,64,1,1371,1,2,2,311,1,3,3,1,12,146,1,1,2,76,1,1653,1,25,2,1,11,148,3,76,1,1656,1,19,1,4,14,146,3,42,1,1,1,1,1,33,1,1,2,1675,2,1,9,144,3,1,2,41,4,33,1,1,3,1669,1,2,1,2,13,22,1,1,2,2,2,113,7,41,3,1,1,18,1,12,4,1659,1,9,1,3,16,31,1,112,3,1,2,43,3,31,4,1362,1,307,1,4,1,1,12,26,2,1,1,12,1,101,5,1,2,42,2,1,1,31,3,1361,2,307,3,3,12,144,9,50,1,26,2,1361,2,161,1,144,5,4,11,143,7,1,2,8,1,29,1,1399,4,304,8,3,11,144,4,2,4,1438,1,33,1,29,1,241,8,4,11,144,4,2,4,1744,10,2,11,144,2,1,7,1727,1,4,1,11,23,150,2,1746,11,1,10,151,2,38,1,1707,9,1,14,86,1,61,1,1,1,1746,6,1,1,1,1,1,13,146,2,2,1,1746,7,4,1,2,11,147,3,34,1,1647,1,64,2,1,3,1,3,3,11,146,1,1,2,23,1,1658,1,62,1,3,1,4,3,3,12,145,1,1,2,1681,2,63,4,1,1,8,13,173,1,1443,1,210,1,1,1,66,1,12,11,1711,1,115,5,59,1,18,13,140,1,1,2,1456,1,223,2,3,1,60,1,1,2,15,13,83,1,54,1,34,1,5,1,1433,1,274,1,1,2,3,1,12,14,137,1,1469,1,281,1,2,1,3,2,8,4,5,8,134,2,1464,1,10,1,274,2,6,2,8,4,4,2,1,3,1,4,131,3,1480,1,278,1,7,5,7,9,129,1,1,1,43,1,1425,1,4,1,277,1,8,1,6,6,8,9,100,1,11,1,1,1,10,3,1,1,1751,2,7,1,7,6,11,12,121,5,1468,1,280,2,4,1,9,7,11,13,119,2,1475,1,7,1,268,3,1,1,2,1,11,5,12,13,91,1,11,1,14,4,1464,1,284,1,5,2,12,4,15,9,2,1,66,1,50,1,1,1,14,1,1735,2,3,1,1,1,1,1,10,4,16,9,1,3,116,2,21,1,7,1,1444,1,274,1,21,3,18,10,114,4,1459,1,5,1,6,1,1,1,13,1,263,1,2,1,38,6,2,1,75,1,20,1,6,1,12,2,50,3,1438,1,265,1,36,4,1,7,59,1,34,1,1,2,3,1,10,3,51,3,1701,1,3,1,34,5,1,1,2,1,1,1,94,1,6,1,9,3,44,2,5,3,1441,1,300,2,1,4,1,2,62,1,33,1,3,3,6,1,3,1,20,1,20,1,4,1,1642,1,70,1,36,5,2,3,72,1,23,1,3,3,36,1,15,2,2,3,9,1,1425,1,15,1,154,2,98,1,42,4,1,2,1,2,97,1,1,4,9,1,2,2,38,2,2,3,1421,1,49,1,133,4,137,1,5,4,1,2,98,4,2,1,4,2,3,1,1,1,30,1,7,2,3,2,1475,1,129,5,97,1,43,3,1,4,100,1,6,1,1,2,5,1,25,1,12,2,4,1,1423,1,183,4,92,1,6,1,6,1,33,5,107,2,1,1,3,1,1,1,41,2,1422,1,48,1,140,1,94,1,5,1,17,1,25,4,1,4,106,1,2,1,2,1,39,3,8,1,1462,1,5,1,3,1,230,1,21,2,22,2,1,5,102,1,5,2,1,3,38,1,1,2,14,1,1456,1,244,1,5,2,34,4,1,2,108,1,2,2,18,1,21,4,29,1,1438,1,5,1,6,1,228,1,24,1,20,1,1,1,1,4,103,1,2,1,1,1,1,1,43,3,27,1,1693,1,35,1,3,1,109,1,1,1,21,1,21,5,1417,1,301,1,17,1,18,6,108,3,32,1,12,3,1415,1,344,3,107,2,46,3,26,1,1729,2,3,3,103,2,1,1,1,1,45,4,8,1,1703,1,16,1,24,1,2,1,3,3,1,2,60,1,36,2,2,3,46,4,21,1,1,1,1454,1,172,2,99,1,1,4,1,2,1,1,1,4,98,3,1,2,44,4,22,1,1,1,1626,4,63,1,22,1,12,3,1,3,2,7,97,4,1,2,20,1,23,2,18,1,10,1,1623,2,25,1,75,3,1,1,1,3,2,4,57,1,40,1,2,1,47,1,26,1,1,1,1624,2,79,1,20,5,3,1,2,7,8,2,88,1,73,3,1520,3,205,5,2,2,2,17,1,4,22,1,59,1,1,1,19,1,51,4,1519,4,203,2,4,3,3,23,40,1,42,2,45,1,23,6,1518,4,179,1,26,4,3,1,1,3,2,8,1,4,1,1,22,1,62,4,46,1,21,7,1518,3,207,1,1,4,3,1,1,1,3,9,92,2,58,1,6,1,4,1,2,2,1517,3,194,1,13,1,1,2,2,2,2,2,5,7,92,2,70,1,4,1,1516,2,209,1,1,4,1,4,6,7,41,1,4,1,2,2,1,3,17,1,19,2,48,1,19,1,5,1,1518,1,145,1,62,4,4,2,1,1,6,8,42,1,2,4,2,4,1,1,10,2,20,6,13,1,1577,1,9,1,133,1,63,1,1,1,1,1,3,2,10,8,46,1,27,1,7,1,6,7,38,1,31,1,1512,1,215,1,1,1,1,2,1,3,4,1,3,7,77,1,2,1,1,5,4,1,1,5,13,1,16,1,1763,1,1,1,1,1,1,5,2,1,8,8,79,5,10,5,37,1,28,1,1610,1,34,1,80,1,1,2,2,2,3,2,3,1,5,7,78,1,1,2,13,7,26,1,6,1,1640,2,84,1,29,3,1,1,1,1,3,1,12,4,1,2,79,2,16,6,12,3,6,1,17,1,1632,2,112,1,4,1,1,2,2,2,11,1,1,8,4,2,69,4,19,5,5,1,3,1,1,1,1658,2,114,4,1,1,1,1,1,1,1,1,1,1,10,9,74,3,21,12,6,1,1702,1,56,1,9,4,4,1,5,1,9,2,1,5,1,3,70,5,23,9,1,1,20,1,26,1,1671,1,57,1,1,1,1,4,15,1,1,2,2,6,71,2,26,9,1,1,10,1,9,2,1721,1,30,1,2,1,2,4,14,2,3,2,1,1,2,3,99,6,6,1,1,1,1,1,24,1,1740,5,3,2,1,1,16,1,2,4,2,4,98,5,6,4,15,1,1751,2,1,1,1,1,1,1,21,3,4,3,101,5,5,1,1,1,2,1,17,1,1687,1,8,1,51,2,1,1,24,3,3,2,104,4,8,1,1712,1,2,1,51,2,26,1,1,1,5,3,8,1,93,5,5,2,1713,3,52,1,1,2,31,3,104,4,46,1,1518,1,154,2,5,1,47,5,30,1,65,3,39,4,44,1,1644,1,29,2,4,3,44,1,1,1,1,1,1,1,23,2,70,4,40,3,1720,1,2,4,45,1,3,1,27,1,12,2,54,1,1,3,40,3,2,1,1714,1,1,2,5,1,36,1,8,1,2,2,1,1,22,3,15,5,1,1,47,1,1,2,42,2,1719,1,3,3,1,1,90,4,3,1,49,1,51,1,1716,2,1,1,92,3,50,1,53,3,1712,2,3,3,92,1,50,1,53,4,1710,1,2,3,33,1,62,4,47,2,49,1,2,4,1706,1,1,1,3,3,1,1,96,2,48,1,51,5,1718,4,90,4,103,1,1706,1,10,1,2,1,103,1,1791,2,2,1,2,1,3,1,10,1,145,1,56,1,1695,1,1,2,1,1,1,2,1,1,107,1,5,1,44,1,55,3,1693,1,3,3,1,1,2,1,105,1,50,1,42,1,11,5,1693,10,1,1,157,1,50,1,5,3,1692,3,1,2,1,5,35,1,119,1,54,1,1,1,1,3,1693,1,1,5,37,1,4,1,69,1,48,1,54,5,1698,3,41,1,68,3,45,1,1872,2,44,4,1917,4,1915,1,2,4,1708,2,170,2,6,2,17,1,5,1,5,2,1569,1,138,3,178,3,15,3,1,1,2,1,1,5,41,1,17,1,1648,3,178,1,16,4,1,1,2,1,1,1,3,1,59,1,1648,2,65,1,111,1,18,3,5,1,4,1,45,1,15,1,1845,4,3,1,6,1,60,1,1432,2,282,1,110,1,18,1,2,2,71,1,17,1,1412,2,384,1,20,2,8,1,9,1,1872,1,12,1,4,1,22,1,6,2,60,1,1822,3,14,1,8,1,10,1,60,2,1822,2,14,1,6,1,11,2,62,1,1819,4,19,2,3,1,1,1,1,1,3,1,1,2,58,1,1516,1,306,3,16,2,7,1,10,1,54,1,1827,2,12,1,18,1,3,2,1884,1,21,1,14,1,1,1,1,1,1878,4,16,1,21,1,1877,6,5,1,11,1,1,1,20,1,1873,8,4,1,35,1,44,1,4,2,1821,9,89,1,1821,10,13,1,11,1,63,2,1819,10,1,2,33,1,53,2,1820,1,1,5,1,4,41,1,44,2,1823,4,1,1,41,1,48,1,1824,4,1,1,89,3,1823,3,1,2,4,2,83,3,1828,1,5,1,1,1,81,2,1,1,1829,1,3,1,1918,1,2,1,1916,1,4,1,1919,3,1919,2,91,1,1823,1,2,3,1916,5,1916,1,1,1,2,1,2,1,1918,1,1837,1,3878,1,3844,1,2051,1,1784,1,43,2,5686,1,22,1,4,1,48,1,5,2,1863,1,36,1,3,1,10,1,3,3,1861,1,56,3,1915,1,1,4,1857,1,58,7,1914,3,2,3,99,1,1740,1,69,1,4,2,1916,1,2,3,1916,1,2,3,1590,1,329,1,1922,1,1906,1,6,1,3823,1,1870,1,23,1,31,1,120,1,1726,1,2,1,66,1,1845,1,103,2,1802,1,11,2,12,1,67,1,11,1,10,3,1813,2,1,2,4,1,3,1,5,1,1891,1,2,2,5,1,1,3,7,1,1908,7,1,1,100,1,102,1,1689,1,19,2,3,1,103,2,1919,2,50090,1,1920,2,1918,3,1918,4,1918,3,1920,1,1920,3,1917,1,1,1,1914,1,1,2,1914,2,132617,1,1863,1,48,2,6,1,1860,2,2,1,50,2,2,3,1859,2,1,1,5,1,43,3,1,1,1860,7,52,1,1,1,1,1,4,2,1851,7,6,1,47,1,3,1,2,2,1851,7,7,1,1906,7,3,1,1,1,42,1,13,1,1850,3,1,4,51,1,2,1,3,1,5,1,1849,7,58,1,1854,1,1,1,1,4,3,2,3,1,46,1,5,1,1852,3,1,3,6,1,1,1,1907,2,1,2,1,2,3,1,34,1,15,1,1854,1,5,1,1,1,40,3,1875,2,1,1,9,1,29,3,1866,1,4,1,2,1,1,1,2,1,38,4,1874,3,2,1,1,1,35,4,1872,1,1,2,1,1,1,4,35,3,1871,1,1,3,4,2,36,2,1873,1,1,1,1,1,1,2,1,2,1909,1,1,1,1,1,3,4,90,1,11,1,1796,1,13,1,2,6,49,3,23,1,11,1,1,1,1825,2,1,4,31,1,2,1,11,3,27,1,1,1,10,2,10,1,1815,6,28,1,15,3,24,1,8,1,6,3,1814,2,12,5,27,1,1,2,12,2,22,1,1,1,2,2,5,1,5,4,9,1,1803,4,11,5,30,1,24,1,12,1,3,1,13,5,2,1,1802,1,2,1,2,3,15,1,18,1,1,1,8,1,25,2,29,4,2,2,1802,3,2,1,74,2,17,1,12,4,1804,1,80,2,27,1,5,1,1885,2,18,1,6,1,17,1,1819,1,29,1,25,2,9,1,16,1,21,1,1870,2,11,1,16,1,2,2,5,1,5,1,1,1,1907,1,3767,1,3,1,48,1,23,1,6,1,2,1,6,3,1824,1,9,4,8,1,44,1,23,2,2,1,1829,1,3,1,4,3,51,1,9,1,9,1,13,1,1827,4,2,1,10,1,67,2,5,1,1824,1,3,8,55,1,28,1,1820,1,9,6,3,2,62,1,12,1,1828,1,6,9,84,4,1824,7,34,1,51,1,1828,9,30,4,1870,1,8,6,2,1,31,2,1873,1,6,5,34,4,1877,7,33,5,1872,1,3,9,32,1,2,1,1876,8,36,1,1878,3,1,4,29,1,33,1,1836,1,16,3,57,1,4,1,1839,1,7,1,5,6,32,1,1882,6,57,1,1840,1,12,1,4,5,2,1,25,1,4,1,1866,1,15,1,1,1,3824,1,6,1,10,1,1923,1,3,1,1,1,42,2,1859,1,59,3,1852,1,2,1,62,4,3770,1,12,1,98,1,1807,1,109,3,1832,1,84,2,1,1,1810,1,5,1,88,2,13,1,19,1,1802,1,6,1,74,4,5,1,3,4,1823,1,82,1,1,3,7,2,6,1,1826,1,75,1,1,1,3,1,11,1,2,1,1816,1,83,1,5,1,3,2,1911,1,7,2,1,1,1906,1,11,1,6,1,1901,1,1,1,1,1,5,1,1910,1,1,2,5,1,4,1,1860,1,49,1,7,4,1911,2,6,3,27,1,1854,3,23,2,1,1,7,2,12,1,2,1,4,1,6,2,2,1,1851,3,22,4,7,2,11,5,3,2,7,1,1,1,1,1,1850,1,1,1,1,1,20,3,1,1,18,7,3,1,8,2,3,1,1846,1,1,6,41,4,2,2,3,1,8,1,3,2,3,1,1842,5,1,3,40,2,1,2,1,3,17,1,1831,1,13,13,36,5,1,2,21,1,1829,1,12,14,38,1,1,1,5,3,1851,1,7,5,2,6,19,2,15,6,22,2,2,1,1839,6,2,5,19,2,17,6,7,2,15,1,1830,2,8,3,4,4,20,2,17,6,1,1,20,1,1,3,1829,1,2,1,37,4,14,4,1,1,1,1,1853,1,2,1,32,1,7,3,12,6,1860,1,32,1,6,3,7,1,4,4,1860,1,2,1,40,1,7,2,4,2,13,1,1884,1,14,2,4,1,20,2,1852,1,1,1,13,1,7,1,15,4,10,1,3,2,7,1,1894,3,1,1,8,1,7,1,1,1,2,1,1867,3,1,1,26,2,6,1,3,1,1,1,1,2,2,2,3,1,1851,1,5,4,1,1,4,1,28,1,12,1,3,1,1,1,1856,1,6,11,34,1,5,1,3,2,1864,8,1,3,6,1,24,1,3,2,4,2,4,2,1861,6,2,3,18,1,19,1,2,1,3,1,1867,4,3,1,35,2,6,1,1870,3,3,3,16,1,15,1,3,1,1,2,1,1,1851,1,3,1,14,4,1,4,17,1,19,1,1,1,2,1,1868,12,12,2,22,2,1872,10,13,3,18,1,1862,1,14,6,11,2,6,1,17,1,1880,3,16,1,1909,1,15,1,1877,1,54,4,1913,2,2,1,1,1,1,4,1908,4,1,1,2,1,3,3,1905,10,3,1,1894,1,14,2,2,2,1901,1,7,2,2,1,5,3,10,2,1900,1,4,4,2,1,3,6,1900,1,6,3,1,1,3,6,1889,2,14,1,1,3,2,2,4,1,1897,1,9,2,5,1,1,1,1904,1,1,1,12,2,1898,1,21,1,1,1,1885,1,8,1,2,1,7,1,5,1,1906,1,4,1,4,1,1910,1,17,2,1898,1,3,1,2,1,7683,1,1918,1,1898,1,9651,1,5729,1,23043,1,2,3,1916,1,1,3,230799,1,7,1,1912,2,1,1,4,3,1910,5,1,4,6,2,1903,3,1,1,1,4,5,3,1904,2,3,4,4,4,162,2,1740,2,1,1,2,3,3,7,158,7,1738,2,2,3,4,4,1,3,155,9,1738,6,3,6,2,4,148,16,4,7,1726,3,5,7,3,4,140,20,1,15,50,5,1668,3,4,3,1,4,1,7,1,3,1,1,133,32,1,7,44,12,1664,3,2,6,1,3,1,10,5,2,126,17,1,1,1,6,1,4,6,6,40,15,1664,3,3,2,1,2,2,10,1,2,5,3,120,20,1,1,3,1,7,2,9,5,5,3,31,15,1664,8,1,2,3,2,1,1,3,5,7,6,112,23,5,2,6,1,8,1,1,14,26,20,1664,3,2,4,4,2,7,1,10,12,97,33,9,2,9,16,17,3,4,14,1,7,1665,2,2,2,7,1,1,3,1,1,1,1,2,1,9,14,80,5,2,10,1,30,6,2,11,2,2,3,1,7,14,3,1,8,1,12,1,1,1,5,1665,2,1,2,7,5,1,1,13,1,1,5,4,7,2,6,1,5,47,21,2,9,1,31,4,5,15,1,2,5,4,5,4,6,2,12,2,6,3,5,1,3,1664,2,7,6,6,1,2,2,3,9,2,3,1,3,2,13,41,27,1,9,1,31,4,2,1,3,17,3,1,2,3,4,2,1,1,3,8,10,3,7,1,10,1663,2,8,4,1,1,5,2,1,2,3,3,1,5,1,4,1,4,10,3,16,2,8,1,7,77,7,3,19,2,1,2,2,5,14,10,1,1,1,5,3,11,1660,4,8,4,6,3,5,10,1,7,1,1,1,2,5,1,1,4,1,63,2,1,1,17,3,5,1,1,3,10,9,2,16,1,3,2,1,3,4,2,1,1,4,2,9,29,1660,2,1,1,6,6,6,6,2,29,2,4,1,10,2,29,1,1,1,15,1,2,2,12,1,5,4,1,1,1,6,3,1,4,30,1,3,1,2,3,7,5,2,2,3,1,2,1,1,8,2,17,1661,2,1,1,6,6,6,6,2,13,1,3,1,3,1,9,1,3,1,7,2,1,2,24,1,4,3,18,2,8,5,5,1,3,10,7,28,1,5,2,2,2,9,4,5,14,2,4,2,11,1661,4,6,6,6,2,1,2,3,13,4,5,3,9,1,6,3,2,2,7,1,16,1,3,5,10,2,7,1,8,3,6,1,3,11,1,1,1,1,1,1,1,17,1,5,5,4,2,2,1,12,3,2,2,2,8,3,2,1,19,3,1,2,2,5,7,1640,4,5,7,6,3,1,1,4,12,1,1,1,5,4,9,1,6,3,9,3,17,9,5,1,2,2,15,9,2,2,2,15,3,6,1,7,2,2,1,4,7,1,2,17,7,4,5,3,4,1,4,1,17,2,16,1637,4,5,7,7,2,5,15,1,17,3,7,1,4,9,11,2,4,9,7,1,16,9,3,1,2,13,4,19,3,3,6,1,1,20,13,4,1,4,21,2,19,3,3,1629,5,5,1,1,4,6,2,11,20,3,6,2,2,1,2,5,3,9,10,3,3,9,9,2,4,1,8,9,4,14,6,18,12,22,12,1,1,3,1,5,20,2,4,1,2,1,3,1,14,1628,5,22,1,5,12,1,9,4,5,2,5,5,3,1,1,7,5,1,4,3,4,9,7,2,6,1,7,9,6,10,8,11,3,2,14,18,6,1,10,8,4,2,11,2,8,8,8,1,7,1627,5,27,10,1,5,3,5,1,7,1,5,3,6,8,5,4,1,3,5,8,8,1,6,2,7,2,1,5,7,3,4,3,7,8,2,1,20,9,1,8,5,3,2,1,5,9,4,3,21,5,1,1,9,1,7,1626,5,21,2,4,10,2,3,2,8,1,10,5,5,7,7,4,1,1,8,6,16,1,8,4,1,3,24,2,1,3,5,1,18,18,7,6,7,3,2,2,2,3,1,1,1,1,18,4,4,1,16,1625,4,26,13,3,3,1,7,2,8,6,6,6,1,9,2,1,8,2,2,1,14,4,8,2,1,6,26,2,6,1,16,1,1,2,1,9,11,10,4,1,5,2,6,2,25,3,8,1,1,1,6,1624,5,23,15,3,1,2,8,2,8,5,3,1,2,7,2,12,7,2,16,3,10,9,3,2,17,1,3,3,21,2,1,2,2,3,3,7,3,1,1,11,1,1,3,1,5,1,7,1,4,4,17,1,1,1,3,1,6,4,4,1623,5,22,19,3,3,2,2,5,8,2,4,23,42,2,2,2,4,2,20,2,23,4,6,9,2,1,1,10,4,1,4,1,6,1,13,3,1,1,14,2,9,2,7,1623,4,4,1,13,1,3,29,5,8,1,4,18,3,1,76,1,24,6,6,8,1,1,4,4,1,1,3,3,2,1,1,1,2,2,1,3,14,3,4,1,15,1,4,2,2,1,6,1621,5,19,1,2,27,1,1,4,8,1,8,3,7,3,23,1,25,1,30,2,22,4,3,1,5,8,1,1,1,1,2,4,6,2,5,1,1,3,1,3,8,1,4,1,32,2,6,1620,5,16,1,1,32,6,7,2,100,2,23,3,8,9,1,1,5,3,1,1,3,1,1,1,5,2,4,1,3,1,4,6,1,1,7,3,20,2,9,1600,1,18,5,16,5,1,30,4,12,1,82,1,14,1,24,2,8,2,1,5,1,1,6,6,2,1,4,1,2,2,9,3,1,1,1,4,7,6,20,5,6,1599,4,14,6,16,17,3,18,2,12,1,82,1,13,1,25,3,7,9,1,2,1,1,5,1,1,2,2,2,2,1,1,2,8,1,2,3,1,3,1,1,1,2,6,3,21,2,2,1,6,1599,1,1,5,10,7,17,16,4,17,3,15,1,92,1,4,3,20,2,4,1,1,7,1,3,8,1,9,1,2,1,8,5,3,3,1,3,6,5,1,1,17,1,3,3,5,1599,7,9,8,6,4,4,18,1,21,1,16,1,72,2,23,3,19,1,2,3,3,1,3,2,1,3,2,1,2,1,3,2,3,1,2,1,13,10,1,3,3,3,1,4,11,1,1,1,12,1,7,1585,2,8,1,3,5,11,7,5,3,4,55,2,87,1,6,1,4,4,18,4,2,1,6,8,3,1,1,1,2,6,11,1,3,15,2,1,2,5,3,1,7,1,1,2,21,1583,2,8,9,12,5,6,1,2,1,1,133,3,1,2,6,2,11,2,20,4,9,1,1,11,1,1,1,3,2,2,15,14,3,7,4,1,8,2,22,7,1,1585,9,11,4,7,136,7,7,3,9,2,19,6,12,4,2,2,1,2,1,2,1,5,9,1,2,1,3,11,5,8,4,2,11,1,21,1,4,1584,10,11,145,9,6,6,5,2,22,6,4,1,12,7,1,6,10,4,3,10,2,11,4,1,12,2,25,1582,1,1,11,9,128,1,17,11,3,6,7,1,23,4,4,2,12,6,1,2,1,3,12,2,4,30,37,1584,11,9,14,1,132,10,3,5,4,1,24,6,5,1,14,6,1,1,1,3,12,3,4,30,4,1,5,2,24,1574,5,5,11,8,143,2,4,9,3,6,2,3,23,6,5,1,15,4,1,3,12,1,1,4,3,32,1,1,2,1,6,1,24,1573,5,6,2,2,1,9,3,1,41,1,21,1,72,1,6,2,3,9,1,7,2,5,24,4,4,1,16,3,3,1,1,1,11,4,5,35,10,1,23,1573,8,1,2,3,1,2,1,5,6,2,12,1,26,1,4,1,17,1,65,1,11,3,1,1,1,9,2,5,2,7,22,3,2,2,2,1,9,1,5,4,8,5,1,1,3,2,7,3,2,13,1,4,1,10,36,1571,12,1,17,1,45,1,80,4,3,1,6,16,1,6,1,5,1,1,27,1,12,2,5,2,4,2,3,3,1,2,2,1,10,1,2,2,6,3,2,3,3,6,1,1,2,3,36,1571,30,1,2,3,30,2,8,4,14,3,1,1,46,5,5,5,3,2,6,16,1,15,5,1,39,2,1,6,3,3,6,2,11,3,5,2,12,2,1,1,3,1,2,1,36,1570,9,3,2,1,10,2,8,1,30,3,6,5,14,6,38,2,3,8,4,4,4,2,3,2,2,11,1,3,2,14,42,5,1,6,2,4,6,2,11,1,1,1,18,1,6,1,1,2,38,1569,9,5,2,1,19,1,29,1,8,3,10,1,4,6,38,3,3,9,3,5,4,3,1,5,2,12,1,16,3,2,37,11,4,3,2,2,2,1,31,1,9,4,36,8,1,1560,13,1,22,2,29,1,8,1,10,1,5,6,39,1,4,9,3,5,4,3,1,4,4,28,3,1,1,1,4,1,4,1,6,1,13,1,5,2,3,8,2,3,2,1,25,2,7,1,10,2,1,1,2,1,43,1559,24,1,13,4,2,2,1,4,16,1,18,1,1,1,1,1,2,6,35,3,1,3,2,9,3,4,5,7,4,12,2,11,1,2,5,3,3,1,3,1,6,2,24,6,6,3,26,2,2,2,8,1,1,2,1,1,5,2,4,2,18,3,2,1,15,1557,27,3,8,3,2,1,8,2,2,1,19,1,10,4,2,5,32,3,1,4,5,9,2,4,5,8,5,12,2,12,2,3,2,10,3,1,2,2,25,3,4,1,4,3,27,2,1,1,1,1,5,2,5,1,1,2,2,1,4,2,16,6,24,1550,38,1,36,2,10,5,1,4,34,7,5,9,1,5,4,1,1,7,5,12,1,30,2,2,3,1,24,4,2,3,6,1,27,1,1,1,1,1,1,1,2,1,1,1,9,6,1,4,16,4,4,1,21,1549,35,1,39,6,8,8,32,10,4,9,2,4,4,13,1,11,1,34,2,2,25,2,4,3,39,2,2,1,15,1,3,6,13,4,8,4,15,1548,34,2,44,2,6,9,3,3,7,1,18,11,2,9,2,6,2,36,1,20,1,7,1,1,3,2,2,2,5,5,8,4,5,2,41,1,8,1,1,2,4,1,2,2,26,4,15,1547,88,9,3,3,6,3,16,9,1,1,1,18,4,24,1,10,2,15,1,1,3,4,2,4,2,2,1,6,3,5,1,1,4,6,3,2,27,2,22,2,10,1,26,4,16,1546,86,26,16,10,1,3,1,14,5,25,1,3,1,8,1,6,1,7,3,10,2,9,2,10,1,1,1,12,51,1,10,3,26,4,15,1545,20,1,49,2,1,1,6,1,6,25,16,14,1,15,4,25,1,3,2,7,1,13,1,2,1,1,1,9,3,18,4,11,15,1,25,1,23,1,28,2,16,1544,20,2,1,1,44,1,1,3,4,1,2,1,5,6,1,4,3,13,4,2,5,4,1,14,1,15,2,46,1,1,12,8,7,12,5,12,12,2,1,3,23,1,1,1,36,1,14,1,16,1544,11,2,7,2,46,6,3,5,4,13,1,11,6,3,4,4,4,10,2,11,1,3,3,16,2,24,8,1,6,1,1,1,3,3,8,11,3,14,5,1,6,2,2,4,59,2,16,2,15,1543,10,4,6,2,48,3,1,2,2,4,4,12,2,5,1,6,4,5,4,4,3,10,2,10,3,21,1,1,1,8,1,15,5,2,1,2,1,7,1,3,4,1,4,13,1,12,15,1,1,5,59,2,16,1,15,1544,5,1,1,5,8,1,50,5,3,3,4,19,1,1,2,3,4,5,4,15,1,5,1,5,1,12,1,14,4,1,1,1,2,3,1,12,4,3,2,2,1,4,4,2,8,2,6,11,1,1,1,1,1,1,11,1,5,1,2,5,1,2,56,1,32,9,4,1534,2,7,9,3,40,5,2,3,1,1,3,4,4,18,4,1,4,7,5,15,2,4,1,4,2,25,4,4,1,2,1,9,1,6,7,2,1,1,2,1,14,5,3,10,27,10,54,1,32,8,8,1531,3,8,5,5,4,2,30,15,5,1,8,16,8,7,5,17,1,9,2,31,3,2,1,9,1,6,8,2,19,2,1,1,1,12,1,1,24,8,1,3,27,1,20,1,38,8,10,1530,1,7,1,1,4,5,3,3,4,1,23,19,2,2,8,16,7,7,7,20,2,14,1,4,1,1,1,13,4,5,3,4,2,1,10,1,3,1,16,1,3,1,1,12,1,5,3,1,5,1,12,12,54,1,34,5,9,1,3,1537,5,5,4,2,4,2,9,2,7,22,3,1,6,18,1,2,5,10,3,16,1,3,1,6,1,29,3,4,6,4,1,1,4,4,1,5,11,2,1,2,7,20,2,2,1,4,3,2,8,11,53,1,16,1,36,1536,5,6,4,2,4,2,9,1,8,8,1,14,3,1,3,1,3,21,3,11,3,26,1,29,3,6,1,1,1,7,2,2,1,2,4,5,10,1,1,1,1,1,4,22,2,2,1,6,1,1,9,6,2,1,27,1,42,1,1,1,24,1,11,1535,2,1,5,4,6,1,3,2,1,1,6,2,3,1,4,6,1,2,1,13,8,1,1,22,3,1,1,2,1,4,1,3,2,25,1,1,2,21,1,3,4,7,1,5,1,1,2,5,6,4,11,3,1,2,3,15,1,3,8,7,3,3,1,9,32,1,7,1,23,2,6,4,30,1,6,1535,6,4,10,2,8,2,2,1,5,8,2,8,1,4,11,18,5,1,5,5,1,26,3,1,3,8,1,10,2,3,3,15,2,1,2,5,4,3,3,2,8,24,1,3,7,9,2,15,31,1,6,1,33,3,30,2,5,1533,9,2,5,1,4,2,1,2,4,3,8,9,3,11,8,1,1,13,3,3,13,10,1,18,3,2,5,6,3,5,9,15,1,3,1,9,3,1,1,1,2,2,4,1,3,26,9,13,3,8,1,1,73,3,3,1,20,1,5,1,6,1531,16,9,1,1,4,3,1,4,4,6,1,2,1,2,1,10,1,1,7,13,21,8,1,14,4,5,7,4,2,6,9,17,1,12,3,2,9,1,6,22,3,1,5,14,2,6,2,2,72,1,4,1,3,1,19,1,7,1,5,1527,1,1,14,1,2,1,1,6,1,1,7,6,3,10,1,1,2,8,1,2,6,1,2,10,21,9,3,5,1,6,4,6,6,4,2,4,11,16,1,6,1,6,19,6,1,16,5,1,7,5,1,13,1,2,56,1,11,4,39,1,1,1,2,1529,7,4,2,2,2,10,1,1,5,6,4,9,7,8,2,1,5,12,17,11,1,6,4,6,4,4,7,4,2,3,9,1,2,16,1,1,1,2,1,1,2,4,20,5,2,15,18,6,1,1,1,7,1,6,65,2,12,1,10,1,17,3,3,1527,6,4,2,2,2,1,2,7,2,1,5,5,4,9,2,2,2,3,2,3,3,1,1,1,4,11,18,2,1,5,1,1,1,1,1,3,6,7,2,3,10,2,1,3,8,1,1,2,1,21,1,1,2,5,20,2,1,1,1,15,10,1,7,25,18,2,46,1,1,1,38,2,5,1526,6,4,2,3,1,1,2,7,6,2,1,4,4,1,1,2,2,13,1,1,1,21,18,1,4,4,1,1,3,3,2,1,7,1,4,2,1,1,14,1,2,40,26,13,14,3,3,11,1,15,17,1,45,2,4,1,1,4,29,5,4,1526,5,6,1,2,2,1,1,7,2,2,3,1,2,1,5,2,2,3,1,9,1,1,2,3,1,20,23,2,7,2,16,1,16,43,25,16,12,12,1,4,1,16,63,1,4,3,1,4,12,1,14,6,4,1524,6,9,1,10,1,1,1,2,4,3,1,3,4,11,3,1,3,1,3,19,24,1,7,1,34,42,1,1,6,2,7,1,9,2,1,14,9,21,1,6,1,5,69,2,1,6,1,1,10,2,1,1,10,8,4,1520,1,15,3,15,1,2,1,7,4,14,2,4,1,18,4,2,18,1,8,2,33,5,1,12,1,8,1,15,7,3,7,1,1,2,1,3,1,2,1,15,8,17,2,2,1,4,2,5,3,1,15,1,46,1,3,7,6,1,20,4,1,4,2,1,2,1519,1,14,1,2,1,16,1,1,1,9,3,14,2,3,1,1,2,16,3,4,25,2,1,2,30,6,1,10,3,3,1,2,1,13,1,3,5,6,6,11,1,9,8,2,4,15,4,5,2,7,1,1,2,1,61,1,2,3,2,3,6,1,1,1,5,1,13,2,2,5,1,1517,1,18,1,17,1,1,1,1,1,9,3,9,1,3,3,3,1,2,1,16,2,3,25,1,1,5,31,14,1,2,3,1,2,2,1,1,1,10,2,4,3,7,7,20,9,2,3,16,4,3,3,3,1,8,65,4,1,11,9,3,12,2,1,3,3,1513,1,1,2,15,3,4,1,8,1,2,3,11,3,9,1,2,1,2,3,3,1,1,1,15,3,1,25,1,2,4,15,1,4,1,2,2,7,15,5,1,4,1,1,10,2,5,3,6,1,2,3,18,13,1,3,16,4,3,2,1,4,7,67,1,1,1,3,9,9,2,1,1,12,1,2,4,2,1513,3,15,1,1,2,3,3,1,4,1,2,7,1,3,9,5,4,1,2,3,2,2,3,15,22,1,5,8,12,1,1,2,16,15,6,1,3,17,6,2,2,3,3,18,1,2,12,1,3,15,3,1,2,2,1,1,3,8,35,1,34,1,1,8,3,1,10,2,14,3,4,1512,2,14,1,1,1,1,1,4,1,3,1,1,4,11,3,1,6,6,5,1,2,1,1,2,4,15,21,3,1,3,1,4,3,1,1,1,8,1,17,1,1,2,1,11,7,1,6,7,1,7,6,4,1,23,2,1,1,1,8,2,1,18,5,2,2,1,2,8,1,2,72,1,1,9,8,2,17,1,6,1528,2,4,5,4,1,11,1,1,1,2,6,7,7,1,2,2,3,3,1,11,20,1,1,1,3,1,1,3,1,1,2,4,3,4,1,1,16,17,14,15,8,25,4,1,9,20,2,2,2,2,4,6,3,3,1,1,72,8,3,1,4,1,3,2,14,1,6,1528,1,1,1,3,3,5,2,13,5,1,3,7,7,1,1,2,4,3,1,1,1,9,20,2,1,1,2,1,1,1,1,1,2,5,4,2,2,1,17,2,2,2,1,12,9,1,1,21,4,23,2,1,1,2,7,23,1,2,10,5,2,3,1,1,73,8,4,2,6,2,5,2,14,1529,1,1,3,1,1,1,1,4,1,13,9,7,10,1,4,3,1,1,1,9,15,1,3,5,2,3,2,4,6,1,1,1,2,1,12,1,2,1,1,2,4,14,8,1,2,20,4,22,1,1,3,1,11,19,1,3,5,1,4,9,2,1,75,6,4,1,7,1,2,1,19,1530,2,1,1,1,1,3,2,1,1,10,2,2,9,3,1,2,16,3,2,9,25,1,3,6,4,4,1,4,12,2,3,3,2,14,9,1,1,1,1,3,2,15,1,1,1,21,5,1,12,21,7,1,4,7,68,1,1,1,6,3,1,2,1,2,4,2,4,2,26,1518,2,4,1,3,2,1,2,1,1,1,5,3,1,2,4,3,8,2,3,1,20,2,1,7,29,1,1,2,3,1,4,1,1,6,12,1,3,2,4,12,13,1,8,12,1,25,2,2,2,4,3,25,6,2,2,8,9,2,57,1,1,1,8,3,1,3,4,3,1,4,8,1,3,1,14,1517,2,4,1,2,2,3,2,3,4,4,5,4,9,1,27,7,9,1,13,1,2,1,2,1,3,1,9,6,17,1,4,12,11,1,3,1,2,2,3,14,1,21,4,1,3,15,1,1,2,5,2,5,6,2,2,7,5,2,7,2,34,1,32,4,3,1,1,2,2,3,4,2,4,4,15,1514,1,1,2,3,2,5,2,1,2,1,5,3,5,5,12,1,20,1,2,7,33,1,4,2,5,3,16,1,2,14,1,2,14,4,1,1,2,12,2,1,1,3,1,15,5,1,1,1,2,3,1,10,6,1,5,3,7,2,4,1,2,4,1,1,3,2,4,2,54,3,5,1,6,7,1,3,12,2,20,1513,6,1,2,8,6,1,1,2,6,1,1,1,14,1,23,7,21,1,7,6,3,2,2,2,1,4,13,1,2,1,1,16,10,1,4,3,1,2,2,12,1,1,3,1,2,13,8,8,1,3,1,1,1,6,10,6,2,1,2,1,6,2,3,7,3,1,2,1,1,1,51,1,7,1,5,8,2,1,34,1501,1,3,1,3,2,2,1,2,3,1,2,7,1,2,16,2,4,1,1,1,27,1,1,8,9,2,20,3,1,1,2,2,1,8,11,1,4,1,1,2,3,10,11,2,3,2,1,2,3,14,5,15,8,7,6,1,1,7,8,6,4,2,6,3,2,6,2,3,1,2,1,3,1,1,32,1,14,1,1,1,14,5,1,2,1,1,1,1,32,1499,1,6,3,3,1,4,2,6,1,4,16,4,1,2,10,2,18,11,7,1,13,1,2,3,2,3,4,5,2,1,1,3,7,1,4,2,1,2,1,2,3,9,9,7,1,1,1,3,1,1,2,1,1,9,8,14,5,1,5,3,6,1,1,8,8,12,5,1,4,6,1,14,30,1,17,1,6,1,8,9,8,1,30,1500,2,1,2,3,1,1,3,14,2,1,10,8,10,2,18,11,7,2,9,1,1,1,5,1,1,2,1,2,2,9,1,3,6,1,5,2,1,14,1,1,10,1,1,6,3,3,3,2,1,9,8,12,12,3,5,1,2,2,1,5,9,12,4,1,1,9,1,14,30,1,34,7,8,1,19,1,12,1,3,1,1,1491,1,1,5,5,3,10,1,4,1,1,11,7,10,2,18,3,2,4,2,3,4,3,1,1,1,1,5,1,1,3,4,2,1,1,1,1,1,11,7,2,1,1,3,3,2,1,1,3,2,5,12,1,2,7,1,2,8,5,2,1,8,1,2,8,13,4,9,1,2,3,10,11,4,2,1,8,2,13,8,1,21,1,28,2,5,6,49,1,1,1485,11,15,4,7,7,10,8,3,17,12,1,3,3,2,3,1,13,2,1,1,1,1,2,12,2,2,2,4,4,1,5,15,6,12,1,1,4,2,2,6,8,2,1,4,3,3,8,2,3,2,5,2,1,3,3,3,1,1,9,8,5,1,3,8,1,14,2,3,25,1,35,8,13,2,25,2,9,1484,9,1,1,3,2,10,5,6,12,4,9,1,17,9,2,3,2,1,2,1,4,1,1,4,8,7,1,2,2,9,5,6,1,1,1,3,3,16,1,1,3,6,1,4,1,3,6,1,1,2,10,10,1,1,8,4,3,5,1,1,3,3,1,7,10,7,10,7,1,1,1,13,1,5,2,1,24,1,5,1,25,1,3,5,11,3,36,1486,4,1,3,1,1,11,1,3,6,4,12,4,13,3,12,8,4,1,1,2,3,1,6,1,1,1,6,1,2,6,1,2,6,2,1,2,2,1,1,14,3,15,4,24,1,1,9,8,13,4,2,8,4,1,1,8,6,2,3,5,7,1,1,1,2,2,1,3,2,13,2,6,4,1,16,1,10,2,18,1,7,7,47,1490,5,1,1,1,1,11,1,1,1,3,1,1,4,1,13,4,9,7,14,6,18,5,5,3,2,4,2,2,4,1,1,1,1,12,1,5,7,12,5,19,2,1,4,1,8,2,18,3,3,9,6,4,1,1,7,2,3,4,2,1,10,2,1,2,3,13,2,14,13,1,9,3,13,1,3,1,8,2,1,3,4,2,34,1,9,1489,10,5,1,3,2,1,1,1,1,1,18,4,7,1,3,8,9,2,2,5,11,3,5,2,1,2,3,3,1,2,1,2,1,1,1,1,2,1,1,1,5,12,2,1,2,2,3,1,1,1,2,9,2,2,1,20,7,1,14,1,1,3,6,6,2,11,4,4,3,2,3,4,2,5,11,6,5,9,1,1,2,9,1,2,4,2,20,2,13,1,1,1,6,1,8,1,9,1,1,2,6,2,2,1,3,4,19,1487,13,3,2,3,25,1,1,2,4,1,2,12,16,1,8,2,2,4,4,2,2,2,10,1,1,2,2,2,6,12,1,3,2,1,2,1,1,3,1,19,1,16,2,1,5,3,8,5,8,5,1,1,1,7,4,1,3,4,3,3,2,5,2,2,1,2,9,1,3,1,11,7,2,12,2,3,17,1,3,1,14,1,23,2,1,7,1,1,4,1,1,1,4,3,19,12,1,1473,20,3,17,1,8,5,1,1,2,12,16,1,9,1,12,1,14,2,2,1,2,2,4,13,1,5,1,6,1,14,1,1,2,19,1,2,1,8,1,1,1,1,1,1,1,1,13,3,1,9,1,1,4,2,1,1,1,2,1,4,3,4,4,1,1,1,4,1,4,1,1,2,1,1,10,7,2,11,1,5,22,1,24,1,6,2,4,7,1,3,5,3,5,1,19,1488,19,2,23,1,2,9,1,12,14,3,3,2,2,2,1,1,13,1,5,1,2,1,6,1,3,4,2,8,1,1,1,2,1,5,1,1,1,4,1,6,2,5,1,4,1,13,1,4,1,6,2,4,2,2,5,3,13,10,4,1,1,1,1,3,1,5,1,4,7,2,3,2,1,1,1,1,1,3,14,1,1,2,3,9,1,6,6,1,40,1,7,2,2,1,2,8,5,2,3,7,3,1,3,1,8,1,1,1491,34,2,7,9,1,13,12,1,9,7,4,1,3,1,9,1,6,1,1,1,9,10,1,1,3,4,1,24,1,28,1,6,2,1,2,3,1,1,13,6,1,2,4,13,1,4,8,1,4,3,2,3,10,1,10,9,1,7,3,5,16,1,33,1,5,2,1,3,1,2,1,1,1,1,4,6,6,1,11,1490,27,1,7,3,7,8,1,13,18,3,1,4,1,2,4,2,2,1,3,1,3,2,1,1,2,1,2,1,4,1,2,1,3,8,1,3,3,2,1,21,3,23,1,7,1,6,2,1,6,2,12,10,3,3,1,1,3,4,2,1,1,3,13,2,4,1,1,1,3,1,3,5,6,2,2,4,3,6,4,6,17,1,38,1,2,2,2,3,7,4,1,1,1,5,1,2,8,11,1,1,1,1477,1,2,15,1,15,3,1,1,5,4,2,16,18,3,2,3,3,1,3,4,4,2,1,1,1,8,4,2,1,2,1,13,1,1,1,3,1,4,2,14,1,1,1,6,2,32,2,1,1,6,9,3,2,7,4,7,1,4,2,1,3,1,8,2,9,1,1,1,6,7,9,4,3,5,4,6,22,1,20,5,5,2,1,3,1,1,3,5,5,5,1,7,10,1493,32,2,1,1,16,1,1,10,17,4,2,3,8,1,5,1,1,3,4,4,7,3,1,1,3,8,4,2,1,6,1,18,1,22,2,6,3,1,2,14,6,5,1,10,2,13,2,3,2,2,1,1,5,1,4,1,3,2,1,1,4,7,5,15,3,8,3,1,2,2,11,2,24,2,7,3,1,1,3,1,2,4,1,1,4,5,2,6,9,1476,1,10,2,4,8,2,21,1,5,1,22,4,15,2,6,2,1,1,13,2,1,1,1,1,2,5,7,16,3,12,1,14,1,6,2,15,1,8,7,7,1,5,1,14,2,16,1,9,1,4,10,1,3,4,4,2,10,1,2,11,1,2,1,7,4,1,40,4,1,1,2,1,2,3,2,1,1,1,1,6,5,5,3,7,8,1474,1,12,1,5,21,2,2,1,3,2,6,1,22,3,2,1,12,2,9,1,1,3,13,3,2,4,3,2,1,5,2,9,4,27,1,15,1,6,4,5,7,4,1,11,1,13,1,14,1,9,1,1,1,4,10,1,3,4,20,11,2,7,49,3,1,6,1,2,2,1,2,8,2,5,4,6,2,1,6,8,1,1463,1,1,1,10,2,4,16,1,6,3,4,1,5,1,1,1,16,1,6,2,3,1,2,1,8,1,3,1,4,1,3,2,14,2,4,3,4,9,3,5,5,43,2,3,2,2,3,2,1,1,2,12,2,3,2,13,1,18,1,8,2,6,13,2,22,11,1,6,1,2,2,1,49,8,3,2,2,6,3,6,3,10,5,1474,1,4,1,6,1,1,1,2,7,1,8,3,1,1,2,1,11,1,1,1,17,1,6,1,3,3,1,1,9,3,4,1,1,6,9,1,3,2,1,6,6,1,1,3,1,2,2,5,5,49,1,2,2,5,2,5,1,6,1,47,1,5,3,1,35,25,1,2,44,10,3,1,1,16,3,10,5,8,2,1463,2,4,1,6,4,1,16,1,1,1,6,1,9,3,17,1,6,8,1,1,10,2,5,5,13,9,5,7,1,9,1,1,3,1,1,3,1,42,1,5,1,5,2,4,1,13,1,26,1,19,1,1,1,2,30,1,3,12,1,1,1,10,1,1,3,2,40,11,3,2,1,3,4,8,3,9,5,10,1,1461,3,3,1,7,21,1,1,1,4,1,1,2,2,1,31,7,10,5,6,5,16,6,8,15,3,1,3,16,2,29,1,27,1,45,3,3,30,1,1,23,1,7,4,1,39,13,2,2,2,3,3,8,1,1,1,10,4,9,1,1462,8,3,25,1,7,2,2,1,3,1,25,1,2,6,11,1,6,1,2,6,17,2,1,1,1,2,4,2,1,4,1,9,2,1,4,10,1,4,2,5,1,21,2,64,1,11,1,3,32,14,1,1,1,1,1,4,1,4,3,3,43,13,1,1,3,2,3,8,4,9,4,1472,25,3,14,1,5,2,28,10,7,1,3,1,4,2,2,6,9,1,3,1,5,7,3,1,6,1,4,8,1,1,1,9,4,4,1,2,1,89,2,10,1,1,1,1,12,1,7,6,7,12,1,1,2,6,1,3,1,2,1,4,43,12,4,3,5,6,4,9,4,1472,27,3,6,1,9,1,3,1,1,1,13,2,10,11,15,1,2,1,2,2,20,4,1,2,3,1,2,1,1,2,6,6,3,10,1,2,4,2,1,78,1,8,2,2,1,13,3,1,6,1,3,2,3,1,4,6,3,1,4,24,1,2,1,4,2,1,41,6,2,1,8,3,3,7,3,10,3,1472,27,3,1,1,3,1,4,5,2,2,28,12,8,1,2,2,1,1,6,2,18,1,1,6,7,1,9,3,1,15,1,1,1,1,4,80,1,5,1,5,2,5,1,9,1,1,9,3,1,1,5,8,11,9,2,6,1,5,1,5,1,3,42,1,4,1,1,1,2,1,4,3,1,1,2,5,6,7,3,30,2,1440,30,1,5,1,1,1,2,3,1,1,31,4,1,8,10,3,7,2,2,1,13,1,1,6,8,1,1,1,6,9,1,15,3,1,1,89,1,4,1,15,9,5,4,10,1,2,9,3,1,23,1,1,43,1,15,5,2,3,1,1,4,9,3,30,2,1440,24,1,2,1,3,2,2,2,3,4,31,1,1,13,10,3,3,1,3,2,8,1,2,1,1,11,9,3,1,1,3,9,2,14,2,2,1,92,4,15,8,5,7,10,3,1,5,1,1,2,1,23,3,2,57,3,4,2,6,5,1,2,4,29,2,1440,25,2,3,4,1,2,2,1,1,2,15,1,7,1,8,1,1,11,10,5,2,2,3,1,8,1,1,1,2,4,1,7,10,4,7,6,1,16,2,4,1,17,1,83,1,5,7,4,8,7,7,1,1,1,2,4,1,13,1,14,1,2,38,1,16,2,16,3,7,29,1,1440,24,2,4,8,2,1,26,1,8,2,1,2,2,6,16,1,7,1,4,1,9,11,3,1,4,1,6,9,1,22,2,1,1,78,2,9,2,7,7,2,4,4,8,6,7,1,2,1,1,5,1,26,1,4,56,1,2,1,5,1,1,1,4,3,8,1470,24,2,8,4,8,1,14,1,6,1,14,7,9,1,12,3,7,1,5,10,1,2,1,1,4,1,6,8,3,1,1,17,2,1,2,1,1,12,1,1,1,53,4,2,1,2,1,1,2,20,9,4,3,1,1,2,1,5,1,2,8,6,2,3,3,25,2,1,55,2,3,4,8,1,8,1469,24,2,2,1,2,1,3,1,1,3,3,1,7,1,32,5,13,1,8,5,6,2,4,6,1,1,1,4,4,3,8,6,2,1,1,6,1,8,1,3,1,1,2,16,2,53,1,8,1,26,5,4,3,1,1,9,12,1,2,1,2,1,3,30,4,2,38,1,7,1,2,3,3,4,17,1468,19,2,4,1,2,2,3,3,1,7,26,1,28,1,1,2,9,1,7,1,2,5,1,5,2,6,4,2,6,1,2,15,2,4,4,3,2,1,2,16,1,41,2,47,5,1,1,1,5,3,12,12,4,4,1,1,2,19,3,3,1,1,1,3,42,2,2,2,4,4,6,1,13,1465,15,1,2,3,4,5,6,7,9,1,18,1,26,1,1,1,1,2,9,3,3,4,1,11,3,1,5,1,2,1,10,15,4,1,5,3,1,2,1,14,2,93,3,1,1,1,5,3,12,8,1,3,6,1,2,4,3,15,2,7,2,1,51,1,1,2,7,1,13,1465,16,3,5,6,6,3,1,2,3,1,9,3,39,2,1,1,12,4,1,6,2,6,2,1,4,2,3,1,3,1,9,18,2,1,5,5,2,12,2,1,1,39,2,49,2,1,4,1,4,4,11,9,1,4,1,1,1,4,4,3,1,14,4,2,1,4,1,1,48,1,3,3,6,3,13,1464,17,1,3,1,2,5,1,1,5,3,7,2,1,1,5,4,1,1,51,6,2,1,1,4,1,7,6,1,5,1,14,1,1,13,11,1,1,1,1,12,4,90,1,2,3,2,2,8,10,19,7,2,2,12,1,1,2,9,51,4,6,2,14,1464,19,8,3,2,10,2,3,1,3,1,6,1,1,1,37,3,1,2,2,1,3,1,2,4,1,1,3,10,2,1,9,1,3,1,7,1,3,1,1,1,1,12,15,11,1,2,2,2,1,90,6,8,6,2,1,20,3,2,1,2,4,1,1,10,4,9,1,1,6,1,42,5,4,1,2,1,2,1,11,1463,18,8,6,1,8,1,6,1,1,2,1,1,4,1,4,1,35,1,2,1,1,1,1,2,5,4,4,1,1,5,3,1,5,1,3,1,3,4,14,10,18,10,1,1,1,3,3,33,1,56,7,8,3,22,1,2,2,11,3,9,1,1,1,4,1,6,31,1,17,4,5,8,10,1463,18,6,10,1,7,1,4,4,9,1,12,1,26,2,1,1,1,2,5,2,1,2,9,2,2,2,10,3,1,4,1,1,10,1,1,7,1,1,17,16,4,1,1,82,1,5,7,8,2,12,1,23,1,1,4,10,2,11,6,1,23,2,1,2,15,2,6,7,12,1462,12,2,3,7,25,1,6,2,3,1,6,1,1,5,10,1,11,2,1,1,1,2,9,4,1,1,2,2,2,1,2,1,1,4,2,2,1,1,1,11,7,1,2,1,3,8,13,1,2,11,1,3,3,1,1,1,1,27,1,52,1,1,1,4,5,1,2,28,1,7,1,9,1,2,4,8,2,11,3,1,2,1,6,1,2,2,12,1,2,2,1,1,20,8,13,1462,13,1,3,7,14,1,15,1,2,2,9,1,1,3,7,1,3,1,2,1,9,1,26,2,3,4,1,1,1,2,3,10,8,10,1,5,8,2,1,2,2,10,4,33,1,16,1,38,1,1,1,2,8,10,3,19,1,18,4,9,1,9,3,6,5,1,10,1,4,1,22,1,4,4,1,3,13,1462,7,1,7,6,2,4,3,1,14,1,6,3,7,1,8,1,1,2,8,1,2,2,7,1,6,1,21,2,1,5,2,17,8,9,15,2,2,1,1,2,1,2,2,3,2,2,1,6,3,33,1,51,10,8,6,31,1,3,5,8,1,9,1,7,16,2,11,1,13,5,5,1,2,3,12,1462,16,2,5,1,1,2,2,2,13,1,3,1,4,1,3,1,1,1,1,1,4,1,4,1,15,1,7,1,4,3,19,1,1,4,1,13,2,7,7,16,11,4,1,1,5,3,2,17,1,1,2,1,1,1,3,19,1,9,1,39,13,8,4,10,2,21,1,1,5,22,2,2,17,1,3,1,18,1,1,1,1,4,5,1,1,1,1,1,3,1,10,1461,5,2,10,1,3,2,1,1,8,1,1,1,15,1,1,1,13,2,2,1,4,1,15,4,1,2,4,1,19,1,1,4,1,12,1,1,1,5,5,19,11,2,2,1,1,3,3,22,3,2,1,1,1,1,1,4,1,1,1,18,1,1,1,43,9,10,4,4,2,3,1,25,5,21,4,3,1,1,12,1,10,1,4,1,4,3,4,3,1,1,3,1,7,1,9,1462,5,1,11,1,5,2,8,1,12,1,34,1,4,1,5,1,4,1,5,1,17,1,2,20,1,4,5,20,1,1,10,1,3,5,3,21,3,2,4,12,1,1,1,5,1,3,1,46,9,4,2,5,5,7,2,8,1,16,5,2,1,19,3,7,10,1,11,2,2,1,1,2,3,1,2,5,1,1,3,2,16,1462,15,9,3,2,24,1,8,1,3,1,14,3,8,3,28,5,1,16,1,1,8,2,1,7,1,3,1,6,10,2,1,1,2,1,6,12,2,2,3,1,2,3,4,1,1,10,4,55,9,4,2,5,5,6,4,10,1,13,4,6,3,14,3,6,11,1,7,2,2,2,2,1,8,5,5,3,16,1462,16,9,2,2,4,1,13,1,5,1,11,1,5,2,5,2,13,2,28,5,1,1,1,11,1,2,1,2,7,1,2,7,2,3,1,3,1,1,11,1,3,1,1,4,3,1,2,2,1,6,1,1,1,1,1,3,1,2,1,3,3,3,1,3,1,3,3,5,1,50,5,6,3,5,5,5,1,1,4,23,1,1,4,3,4,15,2,6,2,2,3,4,7,4,2,1,1,2,9,4,6,3,15,1462,15,11,1,2,7,1,10,3,1,2,2,2,21,1,6,2,7,1,24,10,1,12,1,7,5,12,6,3,1,1,11,1,3,1,1,1,1,3,5,8,1,2,1,1,1,1,10,1,1,2,1,2,7,55,5,7,3,5,3,7,1,3,1,1,1,15,3,7,4,1,6,15,1,7,1,3,2,4,4,1,3,4,3,2,8,1,1,3,6,1,1,3,13,14,2,11,1,1434,11,2,1,1,2,20,24,1,16,1,8,1,2,1,13,1,15,28,1,1,4,1,1,1,1,7,3,1,3,5,15,5,1,2,1,2,1,1,1,5,1,3,2,1,1,3,1,1,5,6,5,16,1,25,5,13,4,8,2,6,2,14,1,11,2,2,2,8,3,1,2,1,4,14,1,12,2,2,5,1,5,1,7,2,6,4,5,2,1,1,15,15,1,1446,7,1,2,1,1,4,1,11,2,1,2,6,6,1,2,2,19,1,5,1,6,1,1,1,2,2,27,10,1,13,1,5,2,4,1,2,1,9,3,2,2,1,1,6,1,1,4,2,4,11,2,7,1,1,2,2,1,4,1,1,3,10,2,1,1,38,8,13,1,45,1,1,6,8,8,33,1,1,1,2,15,2,5,1,2,1,7,1,17,14,2,1,1,1443,1,1,5,14,4,6,1,6,9,1,6,1,25,1,3,1,10,1,9,1,14,5,2,12,1,24,1,2,1,1,4,3,1,8,10,6,2,6,1,13,1,2,2,10,4,38,7,54,1,7,8,5,1,1,2,1,2,1,1,38,17,1,6,2,26,13,4,12,1,1431,3,8,1,6,1,1,5,3,5,2,1,3,7,1,6,2,17,1,3,1,8,1,33,5,2,12,3,26,6,2,1,8,2,5,2,8,1,5,1,4,1,8,2,1,1,1,1,12,2,4,2,4,1,3,1,22,4,65,1,1,1,2,16,40,9,1,7,1,5,1,34,8,3,12,1,1432,2,9,1,4,1,2,6,2,9,1,6,1,1,1,9,1,24,2,1,1,1,1,28,7,1,1,2,11,1,1,1,8,1,19,6,10,6,2,2,2,4,7,1,13,1,19,1,1,4,4,3,24,3,66,2,1,1,2,2,2,11,12,1,27,9,1,5,2,41,8,4,1443,1,1,1,5,2,1,2,5,1,1,7,2,20,1,26,1,4,4,8,1,17,3,1,7,3,10,1,1,2,4,1,4,1,1,1,17,4,13,5,6,3,7,1,4,1,22,1,7,2,1,2,3,4,20,5,53,1,8,1,5,2,1,1,3,2,1,2,1,2,2,1,2,1,1,2,4,1,1,2,1,2,26,22,1,36,8,3,1442,2,2,1,4,2,1,4,1,28,1,23,1,8,1,4,1,27,11,3,12,1,6,1,3,2,1,1,17,3,20,1,21,1,16,4,14,2,19,1,2,6,41,1,10,1,21,6,2,2,6,8,9,1,22,11,1,3,2,5,1,17,1,18,1453,5,4,7,1,40,2,11,1,4,3,1,1,31,10,4,14,1,1,2,4,7,11,3,2,2,2,1,2,1,3,2,10,1,23,1,14,8,5,1,24,1,2,4,43,1,25,1,7,1,2,4,8,1,2,2,2,5,9,1,18,10,2,1,2,1,1,1,1,3,1,36,1453,54,1,15,1,2,1,6,2,2,1,11,1,13,10,5,12,7,4,6,12,2,1,1,1,1,1,1,5,5,19,1,29,7,28,1,3,1,2,1,2,1,41,1,10,2,18,1,3,2,2,1,1,1,7,1,8,1,1,2,5,1,1,1,20,9,9,22,1,16,1454,60,2,2,1,2,1,4,1,5,2,2,1,3,1,16,1,6,11,4,11,3,2,4,2,1,1,2,2,3,12,2,1,2,1,1,5,1,20,1,24,2,4,1,1,2,1,2,10,1,18,1,4,1,1,2,57,2,15,1,4,3,2,1,5,2,18,1,15,1,3,1,2,8,12,4,1,14,1,2,1,14,1455,54,1,2,1,2,1,2,1,1,2,5,2,2,1,1,2,1,1,2,2,15,1,1,1,1,1,2,6,11,5,2,1,6,1,4,1,5,4,1,10,2,2,2,1,2,15,1,1,1,34,1,1,1,32,1,5,4,2,2,1,1,31,1,11,1,1,1,10,3,12,1,1,6,2,2,2,1,3,1,4,1,11,1,2,2,1,1,3,3,5,3,3,7,12,2,2,2,5,11,1,2,1,15,1453,33,2,1,1,23,6,4,1,2,1,3,2,27,9,11,4,11,1,3,1,5,4,1,11,8,5,1,35,1,11,1,2,1,30,1,3,5,2,4,71,3,1,8,5,1,1,1,10,1,5,8,4,1,1,2,4,1,3,6,1,1,7,2,1,2,3,2,5,4,1,4,1,1,3,16,1454,59,5,1,1,1,2,11,4,10,1,6,10,2,1,14,1,12,2,1,1,7,2,2,15,1,8,1,5,1,2,1,6,1,17,1,28,2,16,1,1,2,2,2,2,1,1,2,1,2,21,1,8,1,13,2,22,4,5,3,1,2,4,4,16,1,3,1,3,6,3,1,3,6,1,1,2,1,2,2,1,6,2,1,5,5,1,4,2,3,1,16,1453,2,1,60,1,4,1,2,1,3,1,4,3,12,1,1,15,16,1,12,1,4,2,3,3,1,16,1,14,1,10,2,17,1,2,1,7,2,3,1,18,1,8,5,5,1,1,1,1,1,46,2,24,3,6,5,2,1,1,3,18,2,6,8,4,1,3,1,11,8,2,1,3,5,1,6,1,20,1453,66,1,1,1,1,1,7,1,3,1,1,1,11,12,38,1,1,1,1,1,4,50,2,12,1,8,1,9,2,8,4,7,2,1,1,6,4,26,1,6,1,9,1,2,2,36,4,1,4,19,2,5,3,5,2,1,1,5,1,4,1,4,5,1,4,2,2,2,12,2,20,1452,33,1,23,2,5,2,14,1,1,1,12,12,15,1,4,1,18,2,2,3,1,1,1,3,1,2,1,5,5,12,1,18,2,12,2,12,1,1,5,1,3,5,3,7,4,1,3,5,2,19,1,5,3,4,1,53,7,21,2,3,1,1,3,6,1,2,7,1,1,2,1,2,3,2,1,2,2,1,2,3,11,2,1,1,18,1450,58,1,8,1,4,1,8,3,1,1,10,2,1,11,9,1,12,2,1,1,15,13,1,8,1,12,1,19,1,13,2,3,1,2,2,1,1,1,1,2,9,1,1,3,3,1,1,5,6,6,1,23,2,1,2,2,1,1,1,3,1,55,1,28,1,1,2,11,6,5,1,6,1,2,2,6,11,1,22,1449,65,2,15,1,8,1,4,14,9,2,11,3,11,3,5,2,1,6,1,1,2,38,1,19,4,3,2,1,12,3,2,1,2,3,9,20,1,7,1,5,3,6,1,8,1,45,2,28,2,15,4,9,2,2,3,6,11,1,1,1,21,1448,60,1,10,1,17,1,4,17,7,3,11,4,5,1,4,3,2,3,1,1,1,7,1,1,1,36,2,17,1,1,8,1,4,3,2,3,1,3,6,2,10,24,1,5,1,4,1,1,1,1,1,11,2,93,3,22,11,2,2,1,20,1448,7,1,2,2,6,1,58,1,13,21,1,1,1,5,4,1,1,2,1,2,1,2,1,1,1,2,1,2,3,8,1,9,4,30,2,2,1,18,2,1,7,3,2,4,3,7,1,1,15,19,1,8,1,68,1,45,1,2,4,2,1,4,1,6,1,6,6,1,5,2,14,1,8,1446,11,2,7,1,57,1,14,20,2,2,1,1,1,10,9,1,1,2,3,2,3,5,1,1,2,4,3,3,2,25,1,1,1,1,1,20,1,1,6,5,1,4,4,3,16,22,1,19,2,1,2,43,2,58,7,1,1,9,1,5,38,1446,11,1,7,1,63,1,8,21,2,3,3,1,1,8,8,1,1,3,3,10,3,9,3,28,3,25,2,15,2,2,3,1,3,1,6,9,2,22,1,9,1,1,2,11,1,31,2,39,1,18,5,1,1,1,2,5,1,2,1,5,3,1,36,1444,7,1,1,3,2,1,3,2,40,1,31,20,5,2,2,1,2,8,2,3,2,4,5,4,1,4,2,9,3,26,1,1,2,1,1,25,1,13,9,3,1,2,3,6,1,19,2,15,1,14,2,4,1,69,4,16,1,16,2,6,1,1,12,1,23,1444,6,6,6,1,6,1,29,1,23,1,13,7,2,2,1,1,1,5,7,2,2,13,6,1,1,1,1,1,1,3,2,1,1,2,3,4,1,2,5,11,1,13,6,1,1,1,1,34,10,7,3,1,1,1,1,14,1,3,1,1,1,17,1,14,2,7,1,38,1,64,2,5,2,2,30,3,3,1443,4,1,1,6,3,1,1,3,4,4,1,1,61,1,1,1,1,5,5,2,1,1,2,1,7,1,2,1,3,2,1,7,5,4,4,2,1,2,1,2,4,6,3,22,2,4,4,3,2,34,7,8,1,1,3,6,1,7,1,4,1,2,1,1,1,3,1,19,1,8,4,11,2,27,1,2,1,28,1,43,2,1,31,1,5,1443,3,3,5,10,5,4,47,1,14,8,6,7,10,3,1,1,1,7,1,2,1,3,6,2,1,4,6,2,1,1,2,1,1,29,1,40,4,1,2,12,1,13,1,4,1,3,2,4,2,9,2,12,1,3,2,15,3,57,1,11,1,3,3,23,1,2,37,2,2,1444,10,8,5,3,62,1,1,3,1,3,1,1,3,2,1,6,8,3,1,1,1,7,5,3,1,1,5,1,1,1,2,2,1,1,4,1,1,1,3,11,1,11,1,6,1,39,3,11,1,4,2,3,1,21,1,1,3,22,5,17,2,30,1,27,1,7,1,3,2,1,4,24,1,1,1,1,10,1,22,1,1,1,5,1439,6,1,74,1,9,4,4,1,8,5,15,7,4,5,2,2,1,1,2,2,1,6,9,7,1,4,1,11,1,3,3,38,2,12,1,29,1,1,3,1,1,16,2,5,2,7,1,42,1,17,1,22,2,1,2,20,2,5,37,2,7,1437,11,1,76,1,2,4,6,1,3,1,2,1,1,4,14,5,1,3,4,10,3,6,10,17,2,3,1,1,1,1,1,1,3,52,1,2,1,14,1,9,3,3,1,16,4,5,1,1,1,2,3,1,1,4,1,14,2,19,1,13,1,7,1,23,1,21,1,2,1,2,49,1437,6,3,1,3,91,1,2,3,14,1,1,1,3,6,4,4,2,2,1,2,2,1,1,5,7,1,1,10,1,1,3,6,2,4,2,54,1,3,1,24,1,2,2,16,2,1,1,8,1,1,1,2,2,1,2,1,1,1,2,11,3,10,1,8,1,4,1,4,1,27,1,28,1,2,1,1,4,3,52,1426,2,1,3,9,1,1,1,1,85,10,13,1,4,5,5,7,3,2,4,4,6,1,1,7,1,7,1,5,1,5,2,56,2,27,2,1,1,16,1,2,2,6,6,1,1,5,2,13,3,8,2,19,1,12,1,8,1,4,1,26,10,2,55,1425,6,9,1,5,80,12,1,1,12,1,4,1,5,1,5,1,2,1,2,5,1,3,1,3,1,1,3,2,6,11,1,9,2,54,3,27,1,1,1,1,1,13,1,11,3,1,3,2,5,18,1,19,1,21,2,7,2,32,9,1,10,1,45,1425,1,1,2,1,1,16,79,9,1,7,1,1,12,2,5,1,3,1,2,2,1,6,1,1,1,5,5,2,8,6,1,2,3,1,1,1,1,2,3,45,1,12,1,5,3,8,1,8,3,15,1,9,1,2,4,1,8,5,1,53,3,5,1,1,1,1,1,31,8,3,10,1,38,1,9,1423,1,2,2,13,80,18,1,2,8,1,1,3,6,11,1,2,5,4,17,4,8,1,1,2,3,5,1,2,1,1,1,30,1,15,2,4,1,1,2,8,1,1,1,6,1,2,1,10,1,4,3,6,1,1,4,1,4,9,3,5,1,5,1,21,1,19,2,5,1,2,2,1,1,31,5,2,3,1,7,2,3,1,44,1421,4,16,18,1,63,10,1,4,1,1,1,4,1,3,2,5,4,11,1,1,1,2,25,4,6,2,8,15,1,23,1,1,1,10,4,8,2,1,1,1,1,2,6,6,1,18,2,2,1,2,2,3,1,1,2,2,1,4,1,3,3,12,1,20,2,18,3,2,3,4,2,1,1,29,5,2,4,1,7,2,2,2,34,1,9,1433,25,2,63,17,1,1,2,6,2,4,4,10,31,13,2,3,4,1,6,43,1,1,2,2,1,1,1,2,4,1,7,29,2,1,1,1,2,4,1,2,1,1,1,1,1,5,6,11,2,20,2,17,2,1,1,1,3,35,1,2,4,2,1,2,9,5,45,1433,89,17,2,1,2,1,1,9,2,3,1,11,33,3,2,5,1,1,2,1,3,1,3,2,1,3,2,36,1,3,2,4,6,1,9,8,1,21,1,15,3,2,1,1,2,1,2,12,1,36,2,1,1,3,1,1,1,2,1,33,7,4,10,1,48,1434,18,2,65,17,1,3,6,1,1,5,6,1,1,1,2,2,1,3,2,1,31,11,1,1,2,3,3,4,1,5,1,40,1,1,1,1,1,1,4,1,9,4,1,26,1,8,1,12,1,2,1,51,6,4,1,1,2,32,1,1,2,1,4,1,1,2,9,1,12,1,12,1,5,2,15,1432,1,1,2,2,80,16,4,1,3,1,3,2,1,4,5,1,2,2,2,5,35,3,1,3,1,3,1,5,1,2,2,1,1,46,3,2,1,9,6,1,1,49,1,3,2,52,7,1,1,34,1,5,4,6,8,1,29,2,15,1433,87,14,1,1,11,2,1,5,5,1,1,1,7,2,37,3,1,2,1,8,2,1,1,46,1,5,2,10,7,1,1,4,1,15,2,15,1,68,9,36,2,3,5,6,6,1,5,2,6,2,31,1445,1,1,43,1,27,1,3,5,1,1,1,3,1,4,1,2,9,5,2,7,1,1,11,2,6,1,22,4,5,8,1,47,3,2,2,12,10,3,2,14,1,5,1,9,1,1,1,5,2,1,2,50,4,4,9,34,3,3,5,6,5,2,3,1,1,2,2,1,7,1,29,1447,42,2,30,11,1,1,1,2,2,3,1,1,4,5,2,5,1,1,1,1,1,1,1,2,8,1,9,1,20,2,7,1,2,4,2,64,12,19,1,2,1,11,1,4,1,1,1,1,1,51,6,5,8,34,1,2,7,3,1,5,3,3,2,4,5,1,4,2,17,2,10,1436,1,7,28,1,15,1,30,16,2,5,6,3,6,1,1,2,17,4,3,3,23,2,3,1,1,6,1,64,11,37,1,3,2,7,1,44,2,1,3,7,8,30,2,4,8,1,1,7,4,3,2,1,2,1,4,1,20,2,2,1,9,1424,1,5,2,1,1,4,3,2,28,3,14,2,30,8,1,2,2,5,1,2,3,1,1,4,1,1,5,4,15,1,1,5,2,1,1,1,23,4,1,1,1,4,1,66,11,23,1,38,2,33,3,9,7,30,1,6,7,9,7,2,2,1,5,2,33,1423,3,2,3,7,3,2,19,1,7,2,10,2,4,2,1,2,27,1,2,9,2,4,5,2,2,13,3,4,6,1,6,3,1,1,2,2,22,2,2,5,3,46,1,19,11,2,1,9,1,4,1,4,1,39,5,30,1,11,7,38,6,1,1,8,6,2,7,2,1,1,26,1,5,1423,2,1,1,1,2,1,1,3,1,1,25,3,17,1,5,2,1,2,17,1,8,1,4,15,2,3,3,14,2,1,15,1,1,2,4,2,26,1,1,2,1,74,9,9,1,15,1,77,9,39,6,11,17,2,24,1,2,1,3,1422,2,1,2,1,4,2,28,4,3,1,5,1,1,1,10,2,1,2,27,1,6,3,2,2,1,1,9,1,1,10,3,2,2,1,12,1,1,5,4,1,22,1,8,69,2,7,2,19,1,44,1,5,1,38,5,41,2,13,10,1,17,2,5,1,2,1,2,1,8,1423,5,1,1,1,2,1,20,2,4,9,6,2,13,6,19,1,10,1,1,2,1,1,1,1,1,5,5,1,1,13,16,3,2,6,25,1,4,1,3,69,5,21,1,9,1,1,1,26,1,54,5,38,2,16,10,1,13,8,1,3,3,2,2,1,6,1423,10,1,25,11,6,2,13,5,3,1,1,1,30,1,3,2,1,2,7,8,2,1,1,1,17,1,2,7,21,1,1,2,4,1,5,68,1,1,2,2,1,1,1,1,1,15,1,13,1,23,1,16,1,37,6,2,3,32,1,18,9,3,11,3,2,2,1,2,16,1423,29,1,1,16,6,3,3,1,7,3,5,1,1,2,27,1,6,3,13,4,18,5,1,2,1,1,2,1,8,1,12,3,12,35,2,15,1,12,3,2,4,3,2,25,1,28,1,7,1,5,1,37,1,1,6,36,1,19,9,2,11,5,6,1,2,2,3,1,1,1,5,1423,28,20,4,1,1,2,3,2,5,1,1,2,4,2,1,1,2,1,32,1,1,1,15,2,4,1,6,3,2,6,4,1,3,1,8,1,13,3,2,4,6,4,1,59,1,1,2,1,2,2,1,15,1,1,1,12,1,30,1,48,4,1,2,12,2,45,7,3,9,5,8,4,3,3,5,1424,14,3,10,19,7,2,5,4,5,10,44,1,12,14,2,1,16,2,13,8,6,29,2,5,3,1,1,11,1,12,8,4,2,11,1,6,1,9,1,2,2,27,1,53,2,10,2,30,1,1,1,13,6,3,10,5,7,4,3,3,5,1423,4,1,11,1,12,1,3,12,10,2,4,3,2,1,2,11,38,6,4,4,5,17,2,2,3,2,23,7,7,2,1,1,1,24,2,5,4,24,2,2,7,10,2,7,1,14,1,27,1,54,3,9,2,1,2,19,3,21,6,4,9,10,2,5,2,4,4,1423,5,1,8,4,15,12,8,1,1,3,2,4,1,10,1,4,27,2,7,5,1,2,4,5,4,18,1,2,1,5,22,8,6,1,3,22,7,1,2,2,3,1,2,4,2,8,1,6,2,1,6,2,1,11,1,1,1,1,1,1,1,41,3,50,2,3,2,9,1,1,3,19,2,4,2,1,3,11,5,6,2,1,6,10,1,13,2,1423,15,6,13,4,1,7,7,1,6,15,1,4,27,2,5,5,2,1,4,9,2,1,6,3,2,1,1,7,2,3,10,1,10,11,8,17,2,1,8,4,4,1,7,1,2,8,2,8,3,18,1,4,1,46,1,47,3,2,5,6,2,1,2,18,2,9,2,11,5,7,1,1,8,8,2,10,4,1424,1,1,2,1,9,5,1,4,9,11,2,2,3,5,1,1,1,15,1,4,1,1,26,2,5,6,1,12,12,1,3,1,1,5,3,2,9,1,1,2,8,12,4,1,3,17,12,4,1,1,2,1,2,1,3,1,3,1,1,5,1,6,3,2,1,1,5,1,2,1,1,18,2,91,7,2,1,1,1,2,1,1,1,39,2,1,5,2,1,6,9,2,1,4,3,9,4,1426,2,1,8,14,7,11,1,1,5,3,1,2,1,22,26,3,1,1,1,6,4,10,12,1,5,3,3,7,5,2,2,1,7,1,1,11,8,18,1,4,1,1,3,3,2,1,2,3,6,1,1,16,2,8,2,1,1,1,3,5,1,6,3,93,8,1,2,3,1,17,1,3,1,20,8,2,1,9,6,8,2,10,2,1431,7,14,8,9,2,1,5,5,3,21,26,10,1,1,2,13,22,4,3,1,4,3,11,1,4,9,6,32,1,2,1,1,1,2,1,1,3,1,2,22,1,5,1,5,2,6,1,2,6,7,1,82,8,19,1,3,2,27,8,7,1,2,3,1,4,5,1,9,4,1428,1,3,8,13,7,8,3,2,5,29,22,33,7,1,11,2,7,1,2,3,8,1,7,1,2,5,9,28,4,2,2,1,3,1,2,1,2,10,4,9,1,16,1,1,2,1,8,5,1,82,11,17,1,16,1,13,7,12,3,3,4,13,4,1431,1,2,1,2,8,1,1,6,7,8,11,4,1,26,17,1,1,1,1,29,2,5,1,4,6,2,1,1,12,2,6,4,8,1,1,6,6,27,6,3,3,1,4,1,1,5,1,5,2,2,3,25,2,1,8,89,10,1,2,13,1,31,8,12,2,4,4,11,5,1430,4,4,9,2,1,2,2,1,6,8,10,2,3,25,19,2,2,16,1,2,1,20,1,9,7,3,6,3,1,3,1,1,1,1,7,1,3,2,9,10,1,13,1,5,1,1,2,1,1,1,3,5,2,1,1,4,4,1,2,20,1,4,6,1,1,1,2,3,2,32,2,48,1,2,10,1,2,15,1,29,8,13,1,5,2,12,1,1,3,1430,1,2,4,1,23,4,2,1,3,3,4,4,2,3,1,18,3,1,5,1,11,4,1,10,1,6,3,32,5,2,1,2,7,1,1,3,9,2,3,1,5,1,5,9,1,22,2,2,3,6,1,1,1,1,9,2,2,21,1,1,1,1,1,7,1,1,1,34,1,15,1,33,1,8,2,1,3,32,1,13,1,1,6,14,1,10,1,5,2,2,1,1432,1,4,1,4,21,3,4,1,3,1,4,2,7,17,10,3,10,16,1,6,3,31,1,1,1,1,2,4,6,2,1,4,2,2,5,2,15,7,1,21,3,2,5,15,8,33,2,1,3,30,3,14,1,35,1,1,2,3,2,50,7,8,1,8,1,14,3,1,1,1431,2,9,1,1,20,2,9,2,4,1,3,19,2,1,1,2,2,2,1,3,2,1,5,55,2,1,4,1,1,4,3,2,1,8,4,2,4,1,15,9,1,4,1,14,3,2,2,1,1,2,1,11,10,34,1,25,1,3,1,5,1,15,2,32,1,1,4,1,1,1,2,5,1,3,2,8,1,17,2,11,2,1,3,8,1,9,2,6,2,6,3,1432,2,12,2,1,5,1,4,2,2,2,1,1,3,1,2,1,3,1,2,42,5,7,2,19,2,41,1,7,2,4,20,1,1,7,1,2,1,26,1,3,2,4,3,1,13,3,2,16,3,9,2,12,3,15,1,20,1,29,1,3,9,6,2,2,1,2,1,6,1,23,1,7,5,8,1,2,1,5,4,6,2,3,6,1428,7,10,1,1,2,6,14,1,1,2,3,2,2,41,3,9,1,5,1,9,1,1,1,43,1,6,1,2,3,3,13,1,5,2,4,1,1,3,1,25,1,6,1,5,2,1,10,3,1,1,4,3,2,3,1,7,3,23,3,66,2,2,9,7,2,3,3,4,1,31,1,2,2,12,1,6,2,7,3,2,7,1425,9,6,9,7,3,1,7,1,2,3,1,44,1,1,2,65,2,5,1,9,4,3,3,1,11,45,1,6,9,1,5,2,11,11,3,49,1,1,1,40,1,2,9,5,2,1,5,1,1,5,1,6,1,4,1,12,1,6,1,1,1,5,1,7,2,6,2,4,1,1,13,1425,4,10,11,6,1,1,11,4,2,5,1,37,1,1,3,9,1,16,4,33,1,1,1,15,4,3,3,1,3,2,6,44,3,5,8,3,4,2,3,1,2,16,3,36,1,14,1,17,2,26,8,4,2,1,4,7,2,3,1,3,1,16,1,23,1,7,4,1,15,1440,13,4,13,1,1,1,2,3,1,1,2,39,3,5,1,1,1,15,2,1,1,1,1,6,1,26,1,1,1,8,1,5,1,2,2,4,1,2,3,5,2,1,1,42,1,1,1,7,8,2,5,2,3,1,1,3,1,1,1,2,1,44,1,1,1,32,1,24,1,1,14,2,4,7,3,4,2,10,1,1,2,1,2,6,1,1,3,13,1,8,19,1440,1,1,15,1,4,1,12,3,2,1,3,38,2,4,3,11,1,7,1,3,3,2,2,26,2,14,2,1,1,6,1,2,1,3,1,1,4,53,3,1,3,3,6,7,1,2,4,40,3,37,1,24,16,3,1,9,3,2,4,12,1,4,2,6,1,7,1,2,1,14,18,1441,16,1,3,3,11,4,1,1,3,37,3,6,3,4,2,1,3,1,3,9,1,2,2,22,1,1,4,14,3,1,1,1,1,2,2,2,11,30,1,21,2,2,3,2,6,4,7,44,2,19,1,44,15,2,2,10,1,12,1,10,1,4,1,3,1,9,2,13,19,1440,17,1,3,3,12,2,7,37,2,5,4,7,1,1,1,40,1,1,4,26,1,3,6,28,6,23,5,2,5,1,1,1,6,1,1,44,2,20,1,41,1,3,12,1,4,7,1,4,1,3,2,1,1,14,1,7,1,12,1,2,1,7,4,1,16,1443,1,1,3,1,11,4,17,1,2,50,2,7,1,37,2,1,1,2,2,11,2,1,4,1,1,1,2,2,1,4,6,1,1,25,2,1,1,2,1,21,3,3,1,2,12,2,1,85,1,2,1,22,14,1,4,5,4,10,3,19,1,2,1,10,4,8,3,3,14,1434,1,10,3,2,4,4,18,2,7,46,1,2,2,1,2,2,3,36,6,9,1,4,3,1,4,1,1,5,1,1,1,1,6,1,2,24,3,1,4,7,2,10,3,1,1,2,18,28,2,53,2,3,1,23,1,1,16,1,2,4,2,23,1,9,1,13,2,10,1,6,12,1426,1,21,1,3,1,4,4,4,1,2,9,1,4,50,1,8,1,19,1,1,1,16,1,2,3,15,7,4,1,5,2,2,3,3,1,38,2,1,1,8,8,1,10,1,1,2,1,83,1,2,1,3,1,25,14,1,4,3,3,3,1,1,3,1,2,27,1,3,1,2,3,21,8,1425,3,13,3,13,4,9,7,1,5,1,2,48,1,6,1,41,2,18,1,1,1,7,1,4,1,1,5,24,3,21,3,5,17,2,1,1,2,22,2,16,1,16,1,21,4,1,5,1,2,23,14,2,2,5,2,6,3,22,1,1,1,6,1,1461,6,8,1,1,3,12,6,8,5,4,1,1,1,2,1,1,3,42,1,1,1,6,1,38,2,1,1,32,1,3,7,24,3,13,4,3,2,6,7,1,2,2,3,4,1,26,1,16,2,36,11,1,2,23,13,11,1,5,1,1,1,27,1,39,1,1426,8,9,1,9,1,3,3,12,4,1,2,2,5,1,4,47,1,41,1,15,1,1,1,5,3,1,1,6,1,5,6,24,3,7,1,11,2,6,7,2,5,50,1,38,2,3,5,2,1,24,12,11,2,6,2,23,1,1469,9,7,3,12,3,15,17,40,1,49,1,1,1,12,3,5,2,5,1,8,5,35,2,17,3,1,5,2,2,26,1,1,1,8,1,30,2,26,5,27,12,11,1,6,2,1,1,5,2,18,2,1,2,1462,7,1,2,8,1,14,2,11,1,2,6,1,9,94,1,12,1,7,1,4,6,5,2,1,1,9,2,42,14,13,1,13,1,8,2,14,3,3,1,8,1,60,12,3,1,15,1,6,2,22,2,17,1,9,1,1434,7,1,2,1,4,7,1,10,2,2,1,4,1,1,2,4,15,52,1,38,3,6,1,19,4,7,4,3,2,1,1,2,1,9,2,2,3,8,1,12,1,2,1,1,5,1,9,25,1,2,3,6,1,3,1,10,4,10,2,60,9,14,1,57,1,2,1,1441,1,1,13,13,2,3,4,5,1,2,12,1,6,3,4,84,1,1,4,2,1,6,1,14,3,7,12,1,3,5,2,2,1,26,1,1,14,28,1,1,1,1,1,12,2,1,1,8,3,73,1,1,8,70,1,2,1,6,2,6,1,1426,15,2,1,8,1,1,1,1,2,1,4,10,20,2,2,1,1,84,5,2,3,17,5,5,3,1,3,1,6,1,4,3,2,13,1,1,4,1,1,9,3,2,3,6,1,2,1,15,1,5,1,2,2,12,4,1,5,68,1,1,2,2,1,9,1,1,6,12,2,51,1,2,1,1,1,2,1,6,3,1432,15,15,2,1,2,1,1,6,1,3,18,1,2,1,1,79,1,8,1,1,4,4,1,1,1,12,6,6,1,2,7,1,8,1,3,17,1,1,1,1,1,10,1,1,3,9,1,20,4,2,3,7,11,1,1,67,9,10,6,5,1,5,3,3,1,1,2,44,1,1,1,13,1,1433,13,17,5,8,1,1,23,4,1,60,1,25,1,1,2,2,1,15,2,1,5,10,16,1,1,14,1,1,1,3,1,13,2,2,1,4,1,18,1,5,1,2,1,1,1,1,1,8,4,2,7,2,1,61,1,3,1,5,1,11,1,1,4,5,2,5,1,4,1,1,3,59,1,1,1,1431,6,3,2,2,1,3,2,1,1,10,4,11,1,1,1,1,8,3,7,92,1,3,2,2,2,10,1,1,7,9,16,2,1,4,3,7,2,2,2,1,2,8,1,4,1,1,1,29,2,1,1,2,1,2,1,1,4,1,1,3,5,2,1,3,3,9,1,50,1,3,1,1,3,13,5,6,1,13,3,54,1,1,1,7,1,4,3,1420,4,7,1,5,2,9,6,11,1,4,9,4,6,1,2,5,1,6,1,36,1,31,1,5,2,2,1,1,2,1,2,1,1,8,10,6,18,8,1,8,1,1,3,3,1,16,1,21,3,3,1,1,1,1,1,6,1,1,2,4,4,2,1,1,1,3,4,61,1,2,2,2,1,11,1,9,1,1,2,5,1,4,2,2,3,34,1,5,1,3,3,1,1,4,1,8,2,1,6,1431,2,1,2,2,1,2,1,3,2,1,6,3,1,3,4,1,1,1,4,1,7,1,8,15,1,68,5,2,1,5,1,1,4,8,3,1,5,7,18,7,3,10,1,20,1,22,2,6,2,2,2,1,10,1,1,3,2,2,1,2,1,64,1,1,3,13,3,3,2,11,2,4,2,2,7,31,2,3,8,15,9,1424,1,6,7,1,5,2,1,1,5,2,4,1,14,1,4,2,2,1,4,1,1,2,2,1,1,5,3,68,2,1,6,2,1,3,11,2,8,6,6,1,11,4,7,2,1,1,4,14,3,6,1,29,3,6,1,1,2,4,2,2,1,1,1,2,1,25,2,20,1,20,2,1,3,11,3,4,2,1,2,9,1,3,1,1,10,33,14,11,7,1,1,1425,2,5,8,2,1,4,2,1,5,5,15,4,1,2,2,2,6,2,2,6,1,71,1,2,1,1,4,6,10,3,8,5,6,2,12,2,6,1,1,2,3,15,1,39,2,2,1,7,1,10,2,7,1,9,1,8,1,3,1,14,3,24,1,1,4,9,1,25,16,25,1,1,11,9,1,5,9,1432,9,1,1,2,13,1,4,2,12,2,3,1,2,1,6,2,2,43,1,36,5,1,2,6,10,3,4,2,1,5,5,2,21,1,1,1,1,20,1,9,1,2,1,26,1,2,1,45,1,3,1,14,1,1,1,1,4,20,3,2,1,1,3,4,1,27,14,5,2,8,1,3,1,3,3,2,7,17,10,1422,1,6,1,3,10,1,11,4,1,3,14,3,5,1,7,4,1,29,3,8,1,1,1,3,1,12,1,15,1,2,4,1,2,1,1,7,9,2,4,8,4,3,17,1,1,2,3,21,1,10,1,2,1,25,2,4,1,23,1,5,1,12,2,15,1,1,10,1,1,18,7,20,1,10,1,1,12,7,3,7,1,2,3,1,5,1,5,16,1,1,9,1422,1,1,1,3,1,10,17,3,3,5,1,2,3,1,3,2,1,3,13,2,2,18,2,2,2,5,4,9,4,26,1,2,1,2,4,1,3,1,1,3,12,1,2,2,1,8,4,2,18,1,1,5,1,18,1,1,1,9,2,21,1,23,2,1,1,11,1,1,2,23,1,1,2,2,12,2,1,6,1,11,7,1,2,6,1,8,3,8,14,1,4,4,2,10,8,1,2,1,3,15,3,1,7,1425,2,3,1,9,18,7,1,2,7,1,1,1,1,2,1,3,1,1,12,1,1,15,5,2,3,4,6,3,1,3,5,10,1,3,1,7,1,5,1,3,3,2,2,6,15,11,4,2,16,1,1,24,2,12,1,46,5,9,2,3,1,13,1,1,2,3,8,1,6,3,1,7,2,13,6,2,3,15,2,1,7,2,2,1,6,4,4,4,2,1,2,7,8,1,3,1,2,15,3,1,1,1,1,1,3,1426,2,1,2,10,20,2,1,3,4,1,2,7,4,1,1,1,13,8,1,2,9,2,5,1,5,3,1,6,2,1,1,22,2,2,4,3,5,2,1,4,15,2,4,4,1,1,5,1,14,1,1,36,1,50,1,1,2,3,4,3,1,1,2,14,1,2,1,1,3,2,10,13,1,13,12,5,3,6,13,2,1,4,2,2,1,1,1,1,1,1,1,1,5,1,1,6,12,2,1,17,4,1,5,1427,5,9,28,1,2,1,4,2,1,1,3,2,11,1,4,6,14,1,7,1,3,2,1,6,1,1,4,22,3,1,4,2,5,7,17,1,4,4,7,1,13,1,2,35,1,51,3,3,1,25,1,1,1,1,1,5,2,1,5,28,1,6,2,7,4,1,1,5,2,2,5,1,8,1,5,3,11,5,12,26,5,1430,3,8,27,2,10,1,2,6,4,4,4,2,19,1,10,2,4,5,1,3,1,15,2,2,1,2,13,1,1,7,24,2,8,1,1,1,12,34,1,6,1,47,1,25,1,7,1,1,1,4,8,45,3,1,1,4,2,1,20,2,1,2,1,1,9,5,6,1,2,29,4,1432,4,6,44,3,6,1,3,1,23,1,12,1,3,4,2,4,1,18,16,9,4,1,15,3,11,3,12,9,1,16,1,6,5,57,1,4,2,17,2,8,4,3,3,2,3,22,2,17,1,2,1,1,1,1,1,1,6,1,16,4,10,5,6,1,1,6,3,6,1,15,4,1433,2,6,40,1,4,2,46,1,1,2,1,6,1,3,1,18,13,1,1,12,4,1,12,4,6,1,4,2,12,12,1,18,1,1,4,2,1,1,4,1,1,52,2,1,1,17,4,6,2,11,1,7,1,13,3,19,2,6,6,1,14,1,1,3,2,2,2,1,3,5,3,1,2,7,8,11,2,6,5,1440,15,2,5,2,16,1,4,1,43,1,2,4,1,31,8,1,1,1,2,5,1,7,1,1,16,3,5,2,3,3,12,14,1,12,1,2,5,2,2,2,4,1,1,24,1,26,3,20,2,2,1,2,1,1,1,12,2,20,2,20,3,1,1,2,5,1,1,1,4,2,7,2,1,3,2,5,1,2,2,1,5,1,1,8,4,5,2,8,1,6,1,1,4,1432,1,6,17,2,1,1,1,3,67,1,1,9,3,21,11,1,2,1,1,9,1,4,1,1,1,6,8,1,5,3,3,3,12,13,1,14,8,1,4,1,1,1,1,27,1,25,4,1,1,5,1,19,3,12,1,18,4,1,1,18,2,1,3,2,2,2,1,1,12,1,1,1,10,6,1,1,5,12,3,1,1,7,1,12,5,1439,17,9,68,1,1,12,1,5,1,1,2,9,1,1,8,1,2,8,1,3,1,4,1,9,1,1,5,2,4,3,1,6,11,4,1,8,1,15,3,2,1,3,6,1,1,2,2,22,1,26,3,1,1,4,2,16,1,1,2,33,5,16,1,1,8,4,1,1,12,1,1,2,10,8,2,12,1,2,4,21,4,1429,1,12,5,1,12,3,2,1,66,9,3,1,1,4,9,1,1,6,5,2,7,10,1,3,1,12,5,13,2,1,2,1,14,15,1,12,2,3,6,4,2,19,1,1,3,5,3,5,1,6,1,3,3,1,2,3,2,17,2,2,1,1,1,13,2,15,5,4,1,9,1,2,6,8,12,2,1,3,10,7,2,6,3,1,3,3,3,20,5,1441,5,4,82,2,1,6,4,6,6,1,7,1,5,3,6,9,1,1,1,16,5,1,1,9,14,1,6,16,2,26,3,15,4,1,2,1,2,2,2,1,1,5,1,3,6,2,1,2,2,2,2,19,1,18,4,13,3,8,1,1,1,6,1,7,1,3,1,4,12,4,11,15,7,26,5,1430,1,10,5,5,10,2,1,2,4,5,1,1,1,1,1,1,10,1,26,2,1,1,1,2,2,1,1,1,16,3,1,2,6,1,6,4,3,7,2,1,1,5,2,2,1,10,3,2,7,9,4,1,16,1,1,2,1,1,2,6,1,1,2,13,1,2,1,27,7,2,2,1,2,8,1,1,1,1,8,24,1,1,1,2,1,1,1,4,1,10,3,10,6,32,1,2,11,4,10,2,1,6,1,7,9,10,1,12,4,1443,3,7,1,1,6,16,1,5,1,1,5,4,13,1,6,2,2,3,2,6,3,1,3,1,29,4,4,8,1,3,5,13,2,1,1,1,7,9,2,3,22,10,2,2,1,9,2,4,1,34,2,1,1,4,1,4,1,1,1,3,4,31,1,5,2,4,1,6,2,8,6,34,1,3,10,2,13,15,3,1,6,1,1,1,1,19,4,1438,2,4,1,13,4,14,2,2,1,1,1,4,1,1,1,4,8,2,3,1,5,6,1,1,2,6,2,1,1,6,24,2,1,2,6,4,1,1,1,6,3,14,1,1,2,2,6,9,2,3,18,1,1,11,3,11,1,47,3,4,1,1,1,2,1,32,2,5,3,5,1,6,1,11,2,36,15,2,3,2,6,20,3,1,2,23,3,1444,2,14,6,2,6,4,1,1,3,5,1,1,1,4,8,1,3,5,1,17,5,6,23,3,1,1,1,1,1,2,4,7,2,1,5,16,1,1,6,9,24,11,3,45,1,10,1,3,3,6,3,40,1,1,4,2,1,5,5,35,1,10,10,2,4,7,1,1,4,20,5,22,4,1445,1,4,1,11,3,1,1,2,7,1,1,2,1,1,2,12,9,1,1,3,2,18,2,11,18,1,2,1,2,7,1,1,2,4,1,5,5,1,1,12,3,3,3,12,20,1,4,55,1,1,1,4,2,2,2,2,1,46,1,1,1,1,1,3,3,3,2,2,1,2,3,1,1,34,1,8,4,1,12,9,1,1,2,17,1,4,5,21,4,1448,1,13,2,6,9,1,4,7,1,4,8,2,4,1,1,5,3,10,1,1,1,9,1,3,6,2,5,2,6,5,1,1,2,1,2,10,4,17,2,15,21,8,1,1,2,20,1,36,1,1,5,9,1,44,3,3,3,5,2,1,2,44,2,1,13,1,1,10,1,9,1,11,5,21,2,1469,1,3,1,3,4,1,2,1,1,12,10,11,1,1,2,7,1,1,1,6,1,12,1,1,16,2,2,1,3,1,2,11,1,19,2,1,1,14,16,1,1,1,4,4,1,1,2,18,1,39,1,2,2,10,1,43,6,2,2,4,8,44,18,4,1,2,1,1,1,9,1,12,2,23,3,1449,2,24,8,14,13,2,1,2,1,1,1,1,2,17,3,12,3,1,13,2,1,3,1,1,3,12,2,2,2,4,1,25,18,1,5,2,1,1,2,1,1,60,1,2,1,46,1,4,1,1,12,1,4,1,4,44,6,1,1,1,6,1,1,1,2,2,1,4,2,7,1,10,3,24,3,1439,1,9,4,7,1,12,2,1,9,8,1,2,14,4,6,10,1,1,1,1,2,2,1,3,1,12,15,5,3,14,7,3,1,11,1,13,28,3,1,4,1,15,1,37,3,2,1,9,1,38,1,2,2,2,10,1,13,42,3,2,1,2,7,2,2,1,3,2,4,1,1,16,3,1464,1,12,3,23,4,1,2,1,3,1,3,1,8,1,3,1,4,3,3,1,4,6,1,4,2,1,1,5,2,1,4,8,1,1,1,2,9,7,1,14,6,3,2,3,1,21,17,2,7,2,2,21,1,39,1,59,2,1,3,3,1,5,9,42,1,4,9,1,2,4,7,2,1,1,1,2,1,9,4,22,1,1,2,1428,1,5,1,4,1,36,1,2,1,7,6,1,10,1,1,3,3,2,1,2,8,2,2,3,2,4,9,3,3,2,1,2,1,3,1,1,1,3,6,4,1,15,5,3,2,1,1,1,3,3,1,16,16,1,6,1,1,1,4,1,2,13,1,42,1,60,6,2,2,2,1,5,6,40,3,5,5,1,5,1,2,4,5,16,5,20,5,1428,3,1,2,4,2,36,5,3,1,2,6,2,9,1,2,1,2,1,10,1,2,4,1,1,2,1,1,2,2,1,13,3,2,10,6,21,1,1,8,1,1,4,1,19,6,1,21,1,1,2,1,1,1,55,1,54,2,3,2,3,2,5,2,4,6,40,2,5,6,2,4,1,4,3,3,6,1,10,2,1,2,18,3,1,3,1428,12,13,1,34,5,2,8,1,6,2,1,1,3,2,1,1,1,1,2,1,1,6,1,2,8,1,8,14,2,1,5,2,1,16,8,1,4,2,2,22,1,6,4,1,3,1,1,2,1,1,4,1,5,6,1,9,1,79,1,13,3,3,1,4,3,10,3,43,2,5,5,2,4,2,2,2,1,3,1,5,1,13,1,2,2,14,2,3,2,1,2,1428,12,13,1,4,1,31,9,1,2,2,6,5,4,1,8,4,1,2,3,3,2,1,2,1,5,9,2,4,3,1,3,5,1,15,12,26,2,3,1,1,8,1,1,3,1,1,2,2,5,57,1,52,2,10,1,9,5,43,2,2,1,1,6,1,1,1,3,1,1,1,2,29,3,13,2,1,4,1,1,1428,2,2,4,5,2,49,7,2,1,1,4,2,2,4,10,1,2,7,2,4,1,6,5,9,2,3,1,3,4,1,1,1,1,16,12,2,2,22,1,3,1,1,14,1,3,2,5,11,1,45,1,63,3,7,6,31,1,16,7,1,1,1,2,35,3,12,10,1431,3,2,1,3,3,1,1,5,2,39,3,1,2,4,7,7,11,6,2,1,1,11,1,1,1,12,1,3,1,5,4,2,1,8,1,7,1,2,1,1,8,3,1,25,1,1,5,1,13,1,6,8,1,97,1,12,3,1,3,3,8,40,1,2,6,1,5,1,1,1,1,26,1,2,2,1,2,5,3,2,1,5,6,1,2,1429,1,1,3,3,1,3,5,1,5,41,3,1,1,6,4,1,13,1,6,3,3,3,2,12,1,8,3,2,1,1,1,6,2,3,1,7,2,16,4,4,2,22,14,3,4,1,2,1,4,11,1,106,8,1,10,30,1,1,1,6,1,2,4,1,2,1,2,2,1,5,1,9,2,7,1,4,1,2,4,6,5,6,2,1,1,1,1,1,1,1430,11,1,2,2,6,42,2,1,2,6,15,1,2,1,5,6,2,21,1,2,3,5,1,6,2,12,4,13,2,1,2,17,2,1,1,1,1,1,1,1,10,6,1,1,4,2,5,71,1,46,9,2,5,1,1,2,1,32,1,8,4,1,1,2,1,1,2,3,2,9,4,12,1,1,2,1,1,7,1,1,4,8,1,1434,1,1,2,2,9,1,1,1,4,22,1,20,3,6,1,1,12,3,1,2,6,5,1,16,1,3,3,2,4,2,2,5,1,15,2,1,3,12,3,18,1,1,1,1,1,5,3,1,6,14,3,116,11,2,1,3,4,2,1,41,11,14,5,1,2,9,6,7,6,8,1,3,1,1433,1,2,6,1,8,1,1,18,1,5,1,16,5,2,1,4,8,2,2,6,6,3,3,1,2,1,2,6,11,2,3,1,1,4,1,3,1,15,3,2,4,9,2,2,2,16,2,2,2,2,6,3,2,9,1,4,3,116,10,4,10,19,1,21,14,2,1,2,2,2,1,1,4,5,1,6,1,1,4,7,7,9,3,1432,3,3,1,1,9,1,4,43,7,2,9,10,6,3,10,6,9,4,2,3,1,4,1,9,1,6,1,1,1,2,2,2,3,8,2,20,3,3,3,2,1,5,1,9,1,3,2,67,1,36,2,12,7,1,1,6,2,1,1,1,4,17,1,15,1,6,3,1,11,2,2,1,1,3,4,1,2,4,1,5,1,2,2,2,1,7,3,9,1,1,1,2,1,1431,3,2,1,6,12,14,1,1,1,6,1,10,1,7,9,3,2,1,3,8,8,5,5,1,1,6,7,1,3,2,3,1,4,1,2,12,2,5,6,2,4,7,1,19,5,1,4,8,1,9,1,4,2,31,1,67,5,13,7,4,1,6,5,16,1,27,12,2,1,2,2,1,4,6,1,1,3,6,2,2,1,8,1,2,1,7,6,1431,1,11,12,31,2,10,8,1,1,4,4,7,7,1,2,1,3,1,4,9,1,1,2,4,1,4,9,16,2,1,1,3,1,1,8,20,2,1,7,2,2,10,1,1,2,1,3,106,8,12,4,2,1,3,1,1,1,3,3,2,5,39,1,1,4,1,1,1,2,4,1,2,1,1,1,1,1,7,3,1,1,1,1,5,3,8,5,2,1,5,1,3,2,1431,2,6,1,2,14,21,2,2,1,7,2,6,12,2,5,7,8,3,2,2,3,23,3,30,2,1,7,17,1,2,9,1,4,12,4,3,2,1,2,92,1,7,7,7,1,1,7,3,1,4,7,2,5,3,1,5,1,26,1,3,10,4,1,2,3,2,1,1,4,1,4,1,1,4,5,8,8,9,1,24,2,1406,2,1,2,2,3,1,7,1,6,2,1,16,1,1,1,3,1,14,4,3,6,3,4,7,7,2,3,3,4,22,3,11,1,2,1,2,1,6,1,7,2,2,3,12,1,1,2,1,18,5,1,6,2,4,6,93,1,4,3,5,1,1,1,6,4,11,6,4,5,37,1,5,2,1,4,8,1,6,7,2,1,1,2,3,3,1,1,1,1,3,8,10,1,13,3,1416,1,2,1,2,2,2,1,1,4,1,11,11,1,6,1,17,1,1,5,1,5,1,1,3,3,4,1,1,8,2,1,4,4,7,2,5,4,4,2,1,3,1,1,3,1,1,1,3,3,2,2,12,2,1,3,10,2,4,1,2,20,1,1,1,2,10,2,1,3,93,2,4,1,7,1,3,1,2,8,10,4,2,1,3,2,21,1,11,1,10,4,1,3,3,2,2,2,2,5,1,1,4,5,1,1,2,2,7,8,10,2,12,3,1416,1,1,1,1,3,1,6,1,5,2,7,10,5,1,2,9,2,9,4,3,2,3,1,1,5,2,14,4,5,6,2,5,5,2,7,4,4,2,2,18,2,1,1,11,1,1,1,1,1,1,1,1,1,1,22,1,1,11,6,40,2,33,2,24,1,3,2,4,2,1,5,1,3,10,4,1,1,1,1,1,1,1,1,18,3,2,1,8,2,6,1,2,1,3,1,1,2,6,1,4,1,1,5,2,2,1,13,5,7,2,2,6,1,14,2,9,3,1405,2,1,3,3,2,1,2,1,7,1,6,7,2,3,3,2,2,15,1,1,1,1,5,1,3,2,1,1,5,2,8,1,5,5,4,1,1,3,3,2,1,3,4,1,1,1,3,2,4,1,5,41,1,2,1,1,7,1,5,1,1,1,7,2,1,10,2,9,1,29,1,2,3,2,1,24,3,3,2,27,3,5,7,7,1,2,2,1,3,1,1,1,1,1,1,3,1,16,1,1,3,2,1,7,2,5,3,9,1,2,3,1,2,1,9,1,14,1,2,5,11,2,2,1,3,15,2,7,1,1,2,1403,6,5,4,2,6,2,4,1,1,5,1,1,2,1,1,2,1,1,4,6,2,6,2,2,9,1,1,2,1,1,24,1,6,1,3,2,2,2,8,1,2,5,4,3,1,35,1,4,1,2,2,1,4,3,5,4,1,3,1,1,1,5,1,3,5,10,1,25,1,2,5,1,1,1,4,12,1,8,8,27,3,5,7,7,1,6,2,1,1,1,1,4,3,16,5,1,1,7,1,7,3,4,1,7,3,1,25,1,4,5,7,3,4,1,2,17,2,9,1,1404,1,10,2,1,8,1,6,1,3,2,2,2,3,2,1,1,2,2,1,2,1,2,1,2,1,7,6,2,3,1,1,1,12,1,3,1,12,1,10,1,8,9,5,1,2,4,1,29,6,1,7,3,3,16,1,1,3,2,5,10,1,24,1,2,3,1,10,20,9,27,3,5,4,3,3,1,1,2,3,5,2,1,3,1,1,1,3,14,1,1,5,16,5,2,5,8,4,1,15,1,4,2,4,3,7,2,4,2,5,15,3,3,1,1409,3,4,3,1,8,1,1,2,1,1,1,1,6,3,3,1,1,2,2,1,1,1,1,3,1,1,1,1,2,4,1,2,1,1,5,3,2,1,7,1,5,3,11,1,3,2,4,1,4,1,10,8,1,1,5,8,1,4,1,2,4,16,13,3,5,1,1,7,2,2,13,37,4,2,2,1,1,1,1,1,1,21,8,25,5,9,1,3,5,2,3,2,1,1,2,7,4,15,6,3,1,14,14,3,17,1,2,4,7,1,1,5,4,2,11,11,5,1,7,1409,16,2,1,2,5,1,6,2,2,2,1,8,1,1,2,1,1,11,3,1,2,4,6,4,1,7,11,1,1,4,2,1,1,1,14,10,5,5,4,3,2,2,7,13,13,3,7,1,2,1,1,1,7,1,4,3,1,4,1,1,1,2,1,4,2,29,2,1,7,20,8,18,3,2,6,8,1,4,1,3,1,3,2,1,4,6,1,1,3,11,1,1,1,3,7,11,2,3,3,1,11,1,17,2,2,1,1,2,9,5,4,24,6,2,1,1,7,1403,1,1,4,1,8,1,2,1,1,1,3,2,2,2,2,1,2,1,6,3,3,1,4,3,1,4,1,3,8,3,7,1,1,9,13,11,2,1,11,9,4,11,2,1,2,1,8,13,13,1,6,2,2,1,7,1,2,6,3,5,2,2,1,31,1,4,3,2,6,18,8,16,3,1,1,4,3,17,1,1,1,1,2,1,4,4,2,1,5,15,9,17,1,4,6,2,20,1,1,1,1,5,7,5,4,2,1,19,7,4,4,1,3,1405,1,1,2,4,5,2,1,2,5,1,2,3,4,1,2,1,2,4,3,1,2,2,1,1,1,1,2,6,8,1,1,2,5,1,2,10,13,10,1,1,7,1,2,10,3,12,15,2,1,10,18,2,4,1,4,1,1,8,2,11,1,1,1,3,2,23,11,28,5,6,2,4,2,1,3,8,1,19,7,1,2,3,9,15,1,3,6,14,1,3,9,2,16,1,5,2,1,1,1,1,8,3,12,16,2,2,1,6,6,1,2,1402,1,4,1,3,5,1,2,2,10,2,3,2,3,1,2,4,2,1,6,2,2,1,1,3,1,1,5,2,1,1,1,1,1,1,6,2,2,1,2,4,11,1,5,2,15,1,1,9,1,2,3,7,2,2,1,1,13,11,17,2,1,1,4,9,1,2,1,4,1,2,2,1,4,3,1,2,1,2,1,21,4,1,7,5,2,17,2,1,3,1,1,4,5,1,4,1,1,11,1,10,1,5,3,1,4,8,4,22,6,18,26,1,1,1,5,3,6,1,17,18,6,4,5,1405,5,2,1,2,5,1,1,2,13,1,1,3,2,1,3,2,1,1,12,2,1,1,2,1,1,1,4,2,3,4,5,1,1,7,14,1,1,3,10,1,2,4,1,25,1,1,1,2,1,3,8,10,22,2,2,5,2,1,2,1,5,7,11,1,4,2,1,16,4,1,7,2,5,23,2,4,9,23,6,2,2,1,2,10,5,4,1,11,2,6,4,5,1,14,3,1,21,1,2,1,1,4,2,1,2,2,14,1,2,18,10,2,3,1407,1,2,4,2,6,2,1,1,21,1,3,1,11,1,1,1,5,3,5,1,3,4,5,4,1,4,6,2,5,1,14,3,1,10,1,18,4,1,2,6,5,2,1,8,12,1,8,4,1,4,1,1,2,2,6,6,5,1,5,3,1,3,1,17,3,1,5,5,1,3,2,12,2,4,2,2,3,1,9,1,1,2,2,6,2,5,1,4,10,2,1,9,6,4,3,16,2,2,2,17,1,7,1,6,12,2,3,6,1,4,13,2,1,19,5,2,3,3,1,1,1,1405,1,1,14,2,10,3,9,3,2,1,7,1,4,1,16,3,2,4,2,5,3,1,6,3,5,1,14,22,2,8,1,1,2,8,9,7,9,3,1,1,7,3,4,4,14,5,6,1,2,25,7,25,8,2,4,1,7,5,1,1,4,10,4,1,1,1,8,9,1,1,6,6,1,34,6,11,1,2,14,1,3,1,7,2,12,4,2,16,4,1,1,3,2,2,4,1405,17,2,10,1,10,1,3,2,11,1,1,2,27,3,3,1,5,1,1,1,6,1,5,1,5,1,1,1,1,22,1,8,1,3,1,6,7,1,6,4,1,1,6,2,3,1,8,2,2,1,3,1,1,1,11,6,5,28,9,10,2,6,1,5,8,4,2,1,4,1,1,7,6,5,7,6,1,2,2,12,3,1,1,4,2,14,1,1,1,18,1,7,2,5,2,2,16,1,5,2,2,1,2,1,15,6,1,2,1,9,6,7,2,1407,18,1,21,1,2,3,7,1,4,3,7,6,14,2,3,6,1,4,21,4,1,17,1,3,4,1,2,1,5,2,5,3,8,2,8,3,4,1,30,5,5,11,1,14,12,9,3,12,6,5,7,2,1,6,7,3,4,11,1,1,1,2,2,2,1,1,1,3,1,1,2,1,2,7,1,37,5,11,15,2,2,2,1,2,4,1,14,3,1,1,2,2,2,9,3,9,1,1408,2,1,15,1,6,1,9,1,7,1,1,2,6,1,4,2,1,1,7,4,15,3,4,3,1,4,22,1,2,23,5,2,4,3,6,2,20,4,2,1,21,1,9,4,9,5,3,1,1,3,1,8,1,4,1,1,2,1,2,12,1,10,2,2,1,11,1,9,5,1,4,2,3,13,2,1,3,4,2,5,1,10,1,12,1,5,2,12,3,2,6,7,1,3,14,1,5,1,1,2,2,1,15,4,6,11,1,5,1,1,1,5,1,2,1,1402,1,1,2,1,3,1,7,5,5,1,16,2,7,3,4,3,1,1,7,1,3,1,10,1,1,2,5,1,1,5,11,1,11,1,4,16,1,6,3,9,5,2,24,1,2,1,17,2,4,2,19,5,6,19,1,2,1,12,1,33,1,1,5,2,2,5,2,13,5,22,1,16,7,4,1,1,2,1,8,1,3,7,3,3,6,1,5,1,7,1,20,3,7,15,5,1412,5,1,3,1,32,3,7,1,2,1,1,1,1,4,32,1,11,2,2,1,1,1,11,1,2,2,1,29,1,2,4,2,19,3,1,6,3,1,13,2,5,1,1,1,17,4,9,9,2,3,1,1,2,2,5,7,2,16,2,1,1,13,7,3,1,6,1,13,4,10,1,1,1,20,1,9,1,1,2,3,7,1,6,1,3,7,1,3,2,1,6,1,6,2,3,1,19,5,8,13,6,6,1,1403,6,1,3,1,1,1,15,1,14,4,7,1,2,1,5,2,8,2,28,1,4,3,1,3,12,1,1,1,4,1,1,29,1,1,1,5,17,12,2,2,17,2,3,1,2,2,11,3,10,9,10,1,5,8,1,12,3,1,1,2,2,11,7,1,1,24,4,17,1,16,1,2,2,3,1,1,1,4,7,4,3,1,2,6,1,2,1,2,15,3,2,2,21,3,8,12,7,6,2,1403,1,1,2,1,2,2,1,2,7,1,13,1,2,1,3,4,1,1,5,4,1,1,3,1,1,1,1,2,5,3,25,1,3,1,3,1,1,1,2,1,1,1,13,1,3,33,1,6,17,10,4,1,9,1,13,1,28,9,9,2,5,8,1,12,1,1,2,15,5,1,1,13,1,14,4,17,1,1,2,1,1,20,1,5,5,9,3,5,1,1,1,1,17,9,19,3,8,11,10,2,5,1401,4,2,9,1,15,1,6,1,4,1,8,2,1,1,4,1,1,2,10,1,24,2,13,2,9,7,1,1,2,30,2,3,20,9,13,1,31,2,11,7,10,1,6,2,3,1,1,1,3,5,2,2,2,2,1,14,6,12,2,1,3,1,1,3,1,8,3,11,1,2,1,1,1,4,1,12,1,14,2,6,3,1,5,5,3,2,9,1,5,9,17,4,10,4,2,6,2,1,5,2,5,1401,1,1,2,2,5,1,2,2,16,1,1,2,3,1,3,1,10,3,10,1,4,1,15,1,1,1,3,1,4,2,14,2,1,4,3,41,4,1,14,3,2,9,13,1,3,4,40,1,18,1,1,3,3,1,4,1,5,2,1,1,1,3,1,12,6,9,1,4,2,1,1,1,1,5,1,2,1,5,2,11,2,24,2,20,8,4,5,1,5,1,4,1,2,1,1,3,1,5,19,2,10,1,2,3,2,4,1,3,4,2,3,2,1,1400,6,2,1,1,1,1,2,1,22,1,2,2,1,1,11,3,1,1,8,2,18,7,9,1,11,1,1,2,5,2,1,1,1,23,1,12,18,4,1,11,9,2,2,1,1,2,1,2,24,1,35,3,1,2,1,2,6,1,2,1,6,4,1,1,4,1,5,2,2,6,5,9,1,4,1,1,1,7,1,11,2,3,1,1,1,4,1,15,1,18,9,5,12,4,4,9,33,4,2,9,4,1,2,3,2,1399,43,1,10,1,3,1,9,1,1,4,12,1,1,9,6,3,1,1,2,1,2,2,2,1,3,2,7,22,2,11,19,5,1,1,2,7,13,4,27,1,10,3,20,1,3,3,14,1,4,1,15,9,5,38,1,7,2,1,2,9,1,3,2,8,2,10,1,2,2,7,22,8,22,2,7,4,1,10,1,4,1,1,8,1398,11,1,2,1,6,1,20,1,11,1,2,1,10,4,1,1,11,1,2,11,1,1,2,1,3,1,1,1,5,1,5,2,6,9,1,7,2,7,2,8,23,4,1,8,5,1,8,2,27,2,14,1,2,1,15,5,19,1,1,2,1,1,11,9,2,41,1,5,1,1,1,1,1,2,1,3,2,1,1,2,2,1,2,2,2,12,1,4,5,2,1,3,18,2,2,8,23,2,7,13,7,1,5,1,5,1395,6,2,1,1,2,5,5,2,34,1,9,1,2,3,12,14,1,2,6,1,4,1,13,11,1,6,1,8,2,7,16,2,1,3,3,3,1,11,34,1,5,2,6,1,10,1,16,3,7,2,1,3,9,1,3,3,5,1,1,12,1,23,1,15,2,3,2,1,2,1,3,2,1,2,3,3,1,2,5,10,1,1,1,2,4,1,4,4,7,1,3,1,4,16,21,1,9,6,1,6,1,1,7,1,8,1397,5,3,1,1,1,2,1,2,2,1,2,1,3,1,4,1,3,1,31,1,2,1,1,1,1,1,10,12,2,2,28,11,1,21,18,1,1,23,25,7,2,6,21,1,3,2,16,7,6,1,2,7,4,14,2,39,2,4,2,1,1,4,3,10,4,2,5,3,3,4,20,1,3,17,1,4,3,1,3,1,12,1,8,3,3,8,7,6,3,1,1,1395,7,3,9,2,1,2,29,3,6,1,3,2,1,5,13,12,1,2,7,2,22,31,11,1,5,15,1,4,2,1,1,1,3,1,5,1,10,2,1,5,1,4,1,1,1,3,2,1,5,2,10,1,1,2,3,3,15,6,1,1,7,2,9,14,1,3,4,12,4,3,1,14,2,3,1,1,9,1,2,2,2,2,1,2,1,1,1,2,1,3,3,1,1,5,3,1,7,1,1,1,4,2,4,11,1,5,1,4,34,10,3,1,1,11,1,1395,7,1,1,3,2,2,3,1,3,1,4,2,24,1,6,3,2,1,3,4,8,1,4,2,3,1,3,3,11,4,15,1,6,6,1,20,10,3,5,18,1,2,1,1,5,1,5,4,3,3,1,12,1,8,6,2,17,3,14,6,2,1,14,1,1,18,5,11,7,2,1,15,2,5,1,1,8,1,1,2,1,1,1,1,1,6,1,3,4,3,4,1,9,2,4,2,5,20,7,3,26,7,2,1,1,3,1,3,2,3,1,3,1,1395,13,2,2,2,2,1,2,1,2,2,5,1,27,4,2,1,1,3,1,2,1,3,2,1,7,3,18,1,3,4,6,1,4,2,3,1,1,1,2,4,2,1,4,10,1,1,7,1,1,3,5,21,1,2,6,1,3,5,1,2,1,15,1,7,6,1,9,1,8,2,16,1,1,6,14,1,1,19,4,2,2,7,8,23,19,2,1,1,3,3,3,2,1,2,5,2,7,3,2,3,5,5,1,15,8,1,25,9,1,7,2,2,1,3,4,1394,7,1,2,4,3,1,4,2,2,1,1,1,5,1,3,1,5,1,14,3,1,2,4,6,1,5,3,4,5,2,5,2,10,1,2,2,1,3,3,2,4,1,3,2,3,4,2,4,3,9,11,6,5,16,5,1,8,5,1,4,2,4,4,7,1,5,2,2,1,1,4,1,3,5,6,1,1,2,5,1,15,5,10,22,6,9,8,1,2,16,2,2,16,1,4,1,1,2,1,1,1,1,6,1,5,1,6,1,5,1,1,2,1,9,3,13,14,1,6,1,14,2,1,9,4,1,4,3,2,2,1,1393,4,2,2,1,3,2,6,1,2,1,6,1,6,1,6,1,3,1,12,4,2,8,1,3,1,2,4,3,10,3,13,6,3,1,2,2,4,3,3,2,2,4,6,5,10,1,1,8,1,1,3,14,3,1,1,3,9,2,3,4,2,1,2,11,1,6,1,6,7,3,11,1,22,2,1,1,10,18,1,2,2,1,1,1,2,9,1,1,4,1,1,1,1,1,1,15,3,1,4,2,5,1,7,3,4,1,11,4,6,2,6,2,2,7,4,3,1,8,7,3,27,2,2,8,4,2,3,2,1,1,2,1,1,1393,1,1,5,2,3,1,6,1,3,1,2,1,2,2,3,1,9,1,3,2,10,1,1,3,1,17,1,1,13,5,11,9,6,4,3,2,15,2,16,10,2,9,1,1,1,1,2,1,2,2,1,1,2,2,2,1,10,3,6,8,1,13,1,1,7,1,22,3,18,28,2,1,3,7,7,4,1,16,13,1,7,1,2,1,6,1,7,2,1,4,6,3,5,4,1,6,5,2,2,6,4,6,8,2,11,1,2,1,6,8,2,1,1,5,1,2,1,1,2,1395,3,5,3,1,2,1,7,1,2,2,2,1,4,1,3,1,4,1,18,2,1,1,1,1,1,14,14,1,5,1,9,9,4,1,2,8,6,1,12,2,13,1,1,4,2,2,2,9,1,2,1,1,3,4,1,6,5,1,18,23,26,2,1,2,17,30,6,5,5,1,2,3,1,18,4,1,6,1,11,1,12,4,2,2,1,2,3,5,3,3,1,8,4,1,3,3,1,5,1,9,5,2,8,8,10,2,3,1,1,2,1,2,1,3,1,1397,1,1,1,4,4,1,1,3,4,1,4,3,16,1,17,3,3,8,1,1,1,1,1,3,12,2,15,9,7,1,1,4,1,3,1,2,1,1,6,1,5,3,11,5,1,2,6,4,1,5,7,2,1,8,23,22,18,1,4,1,2,2,1,3,1,5,12,30,4,8,2,2,1,24,5,2,4,1,1,1,11,2,7,2,1,2,2,1,3,1,2,18,1,3,13,2,1,10,5,5,5,7,10,1,1,5,1,1,2,10,2,1393,2,1,1,1,2,1,1,1,1,2,5,6,2,2,2,1,12,2,17,14,2,6,29,3,3,1,9,1,1,6,1,3,13,5,12,3,1,2,2,1,4,8,8,10,8,1,1,11,3,22,23,1,1,7,1,5,5,1,4,34,3,12,2,23,4,3,1,2,1,1,2,1,2,1,5,2,2,3,7,3,7,16,3,2,8,1,10,5,9,4,6,1,1,3,13,2,5,1,1,1,1,4,7,1391,3,2,3,1,12,2,3,1,2,2,1,1,3,1,5,1,18,12,1,14,5,1,1,2,1,1,3,1,17,2,9,4,1,1,3,4,11,5,19,2,5,6,3,1,1,14,2,1,8,6,6,9,1,5,1,7,5,2,12,3,1,9,1,11,2,3,3,12,1,18,1,36,1,1,7,1,2,2,11,11,1,1,1,1,1,2,6,1,1,1,1,2,1,8,3,4,17,6,2,1,6,3,7,7,21,4,8,1391,1,1,3,1,4,4,2,1,3,3,2,3,1,3,4,2,29,5,3,3,2,2,1,6,6,3,1,2,31,4,5,1,4,2,1,2,1,10,24,9,1,2,2,2,1,1,1,5,2,5,12,1,2,5,3,3,1,13,4,4,12,2,1,33,1,2,1,2,2,1,1,15,1,2,1,34,1,1,3,1,6,1,4,3,6,10,2,1,16,1,2,7,1,5,10,4,5,5,1,4,1,1,1,1,1,3,7,6,11,1,5,1,1,1,2,1,1,1,4,2,2,1391,1,1,6,1,2,1,9,1,3,2,2,2,1,1,3,1,11,1,11,1,5,1,1,2,1,2,8,1,1,5,7,3,1,2,18,3,5,1,1,1,2,2,1,1,6,1,2,14,1,3,17,1,6,8,1,1,9,8,1,2,3,1,1,13,6,1,5,8,1,1,4,3,4,1,3,1,3,21,1,14,1,1,2,5,2,53,2,2,13,2,1,2,4,3,1,4,1,1,2,1,2,1,10,4,1,5,7,3,7,8,1,1,1,12,2,5,5,7,16,2,10,3,3,1391,1,1,1,1,1,1,4,1,10,3,5,2,1,1,4,4,26,5,2,1,3,6,2,2,3,8,19,3,4,1,2,1,1,5,2,1,4,21,18,4,1,10,3,1,5,10,2,3,1,13,11,8,7,3,2,1,1,1,1,1,1,21,6,4,1,5,1,3,4,1,1,57,1,1,5,1,9,1,2,1,4,5,1,1,1,1,1,2,1,1,1,1,1,1,9,4,1,5,5,5,4,1,1,8,2,1,2,1,2,8,2,6,4,5,2,1,13,3,6,1,5,3,2,1391,1,1,3,1,1,2,5,1,1,2,2,4,11,1,3,1,2,2,2,1,12,1,5,5,1,1,1,1,8,6,4,4,20,5,4,1,2,1,1,2,1,2,6,1,2,22,23,2,1,3,9,12,2,4,2,9,12,7,1,10,1,5,2,9,1,8,1,11,4,3,1,2,4,1,2,21,1,40,1,2,9,4,4,1,3,2,2,1,4,1,2,1,10,1,1,8,6,4,4,1,1,8,1,1,1,1,1,1,3,7,2,6,4,3,18,2,5,1,3,2,1,4,2,1391,1,2,2,1,1,2,7,2,2,1,3,1,3,1,10,1,6,1,10,1,6,7,1,5,7,4,4,7,17,1,1,3,2,1,3,1,1,14,1,23,13,1,7,1,1,3,16,4,6,1,4,7,6,3,2,2,1,7,1,17,1,6,1,3,2,6,1,3,1,8,5,1,7,22,2,2,1,1,1,35,2,3,11,3,2,1,4,1,1,2,1,1,7,1,8,12,3,6,3,7,1,2,1,5,5,5,6,2,1,1,3,3,18,2,3,1,14,1390,1,1,3,5,1,1,2,1,9,1,3,1,1,1,2,3,4,2,2,1,3,1,14,13,2,1,4,2,2,1,4,7,3,1,13,1,1,1,1,2,1,4,4,15,3,11,1,1,3,3,11,1,2,3,1,3,19,6,8,2,2,3,3,1,2,2,1,5,10,18,1,19,1,2,1,7,5,2,4,22,3,1,1,32,1,2,1,1,1,3,2,2,12,4,10,1,2,1,1,1,11,1,2,8,3,7,2,1,5,1,1,2,1,2,1,3,4,4,1,1,1,1,3,4,1,5,18,2,8,1,9,1389,5,5,4,1,9,1,1,4,5,1,2,1,26,12,1,2,13,9,14,8,1,1,6,16,4,8,1,2,6,2,4,1,2,4,2,4,1,1,19,7,3,1,7,1,5,11,9,11,1,15,1,11,1,1,5,4,1,1,7,24,2,36,3,1,18,1,3,2,1,2,1,7,1,2,4,1,6,3,2,9,1,8,8,3,3,3,1,1,5,2,2,2,8,1,2,3,2,1,15,1,9,1,9,1392,1,1,2,1,2,1,1,1,2,1,2,2,6,3,10,1,5,2,3,1,14,12,12,5,1,6,1,1,2,1,11,5,2,2,7,11,1,5,1,4,1,4,1,2,6,1,13,1,5,2,1,1,1,2,14,6,1,2,1,1,1,1,8,2,1,14,5,2,3,5,2,31,1,3,1,4,7,19,1,4,1,4,1,30,2,1,3,2,1,2,1,1,11,2,1,4,2,5,4,1,13,1,1,15,1,4,10,1,5,2,2,1,7,2,6,2,1,8,25,1,9,1389,1,2,5,1,2,3,2,1,1,6,14,1,1,1,6,1,17,3,1,7,13,10,20,3,4,1,6,12,1,13,1,1,12,1,14,6,1,2,1,1,13,8,11,19,9,4,1,11,1,3,4,5,2,6,5,4,3,1,2,22,1,2,1,36,1,1,5,2,17,5,1,4,5,1,10,1,4,13,2,6,8,5,1,10,4,3,1,1,3,3,1,6,19,1,1,1,3,2,8,1390,3,1,1,1,5,1,2,1,2,4,1,2,6,2,3,1,33,5,14,3,2,5,1,1,17,4,4,1,6,11,2,3,3,1,3,1,1,2,4,1,5,1,1,2,3,1,9,3,1,3,1,6,4,14,1,3,2,6,2,19,9,11,1,1,4,1,4,14,5,1,6,22,1,5,2,14,1,17,7,1,1,2,13,2,2,9,1,3,2,2,1,2,2,1,3,1,4,4,2,6,1,7,1,1,1,1,2,10,1,2,10,1,1,1,3,1,1,2,1,3,2,2,4,3,13,2,3,2,8,1391,10,1,6,5,3,2,1,4,11,2,24,4,3,1,4,2,1,6,2,4,1,1,16,1,1,2,5,2,5,12,2,5,2,2,1,6,4,1,2,4,3,2,11,7,1,3,2,20,2,3,1,1,1,3,1,19,6,1,2,12,5,1,4,1,2,2,3,5,13,1,1,20,1,5,1,15,4,13,11,2,9,3,1,1,1,2,1,9,3,2,14,2,3,14,4,2,1,1,2,11,2,1,5,2,7,1,2,3,1,2,4,1,2,1,17,2,1,1,4,1,2,1393,1,1,2,1,2,1,5,1,1,4,1,1,1,4,1,6,2,1,3,1,24,1,2,2,1,1,3,13,4,3,1,1,7,3,6,1,9,1,2,1,4,15,1,10,1,4,5,1,2,1,16,10,1,28,1,3,1,10,1,4,2,2,4,10,2,3,1,1,5,2,5,1,2,2,1,7,10,19,1,24,5,2,1,9,23,3,1,2,1,4,3,3,2,5,1,1,14,1,1,13,5,13,1,2,1,3,5,1,2,2,2,1,3,5,6,1,28,1,2,1391,2,3,1,1,1,2,1,2,1,1,1,2,2,1,3,6,2,2,29,1,5,2,4,1,1,4,1,1,3,1,5,4,8,4,14,1,1,5,5,16,1,8,2,1,2,1,2,3,1,2,3,1,11,11,1,32,1,9,1,7,1,21,6,1,7,1,1,10,6,29,2,2,2,14,8,7,23,6,2,1,4,1,2,3,1,4,3,1,14,15,1,18,10,4,2,2,5,1,7,3,29,1392,3,1,2,2,1,1,5,4,1,2,2,1,1,7,1,1,4,2,6,1,15,1,4,2,1,5,1,6,2,1,1,2,2,5,7,3,18,4,4,1,2,10,1,6,1,5,1,1,1,4,1,2,1,1,1,1,15,35,3,2,1,2,3,40,4,1,4,1,1,1,1,1,1,9,4,31,1,12,1,6,4,1,4,8,7,1,14,6,1,1,6,1,1,7,17,7,2,4,1,1,2,5,2,9,1,1,1,1,10,8,12,5,25,1394,2,3,1,2,3,1,1,1,2,1,2,1,3,3,1,2,3,1,1,1,12,1,13,2,1,9,1,3,1,4,1,1,3,4,1,1,9,3,19,3,2,7,1,10,1,4,1,4,1,2,1,1,4,1,3,1,15,36,6,1,2,17,3,20,6,1,3,1,3,12,3,27,1,24,3,2,1,8,2,1,5,2,2,1,11,6,3,1,5,9,1,1,3,1,3,3,4,3,1,3,2,3,5,15,4,2,8,9,9,2,1,1,1,6,23,1394,1,2,1,2,2,1,5,5,3,1,1,1,7,1,23,1,2,12,1,5,2,2,2,2,1,4,13,2,12,1,5,8,1,26,7,2,2,1,3,2,3,1,6,6,1,1,1,2,1,22,1,2,8,18,5,17,11,1,1,38,1,24,1,4,1,13,1,3,1,1,2,1,15,1,2,3,9,8,2,1,7,2,2,5,1,1,1,2,3,1,5,16,2,1,9,11,8,1,1,1,4,2,1,2,5,1,1,2,12,1,1,1391,1,3,2,1,13,2,2,1,6,1,8,1,9,1,8,3,1,1,1,5,1,7,1,1,1,3,5,3,26,1,4,11,1,5,1,19,2,7,4,2,2,1,3,1,2,2,1,7,1,1,2,1,1,24,10,14,7,18,6,1,5,63,1,19,3,8,12,1,2,1,7,1,1,1,4,6,8,1,1,11,2,1,2,2,4,18,1,3,1,3,4,2,1,6,5,4,10,2,6,3,12,1395,2,1,2,2,7,6,6,2,7,1,1,1,3,2,14,1,1,4,3,1,2,9,1,2,3,2,1,4,1,1,21,1,1,3,1,12,1,5,1,19,4,1,1,2,1,2,2,2,1,3,1,2,1,3,2,7,2,2,1,23,1,1,1,3,6,11,5,2,1,19,7,1,2,4,1,4,1,7,1,33,1,12,2,11,1,8,2,1,1,3,15,1,2,1,8,1,5,1,1,4,11,10,2,1,9,4,6,4,1,2,1,2,1,5,4,1,1,6,4,5,6,1,3,2,1,2,3,4,13,1391,5,1,1,1,8,5,11,1,1,1,12,1,1,1,2,3,4,1,1,2,2,4,1,10,2,1,1,3,1,8,3,1,3,1,9,4,1,19,1,7,1,15,1,2,1,1,4,1,3,1,2,9,4,1,3,2,1,1,1,1,1,20,2,7,1,2,2,8,1,2,8,19,6,1,2,10,1,6,2,30,1,34,1,7,8,1,8,2,7,5,4,6,10,5,3,6,1,3,5,5,5,15,5,7,5,1,2,5,3,1,2,2,2,2,4,4,10,1,1,1389,7,4,2,1,3,8,2,1,6,1,1,3,1,2,1,1,3,4,11,1,1,1,1,6,1,10,2,1,2,9,2,1,1,3,4,1,6,6,2,2,1,21,2,12,1,2,3,1,1,1,3,1,1,6,1,6,4,1,6,1,1,1,1,6,3,7,1,3,3,9,1,8,3,1,9,18,11,1,1,13,2,29,1,18,1,15,1,1,1,1,1,4,4,1,7,1,14,5,2,5,1,1,10,5,1,10,2,3,3,5,2,1,1,17,3,9,2,1,3,5,1,3,2,5,6,3,4,1,7,1393,1,1,1,8,1,1,4,1,1,1,7,1,1,4,2,1,1,2,7,3,1,2,1,1,2,3,5,13,1,2,1,1,1,3,1,4,2,7,1,2,1,1,3,1,2,4,1,1,1,20,1,11,1,7,4,1,5,4,2,5,2,1,1,2,6,1,3,2,4,5,2,7,2,3,2,8,2,10,9,20,11,15,2,47,2,15,1,1,1,1,14,1,6,1,10,4,3,7,10,5,3,6,1,1,2,4,1,7,1,13,1,4,3,4,1,6,5,9,3,3,8,2,7,3,1,1391,1,6,1,4,4,3,2,3,7,1,1,4,4,1,1,2,6,1,4,1,6,2,2,2,1,6,1,4,1,1,3,10,1,7,3,2,6,1,1,44,6,1,3,1,1,8,2,3,4,1,3,1,6,1,1,3,2,2,2,6,4,2,1,9,1,9,8,19,1,2,10,65,1,6,1,9,13,2,22,3,3,5,12,5,3,10,2,1,3,6,3,10,1,5,3,8,7,12,12,2,6,1,3,1391,1,1,3,1,2,5,4,1,3,1,2,2,6,1,1,2,4,1,11,3,2,2,2,1,7,2,4,1,1,5,1,1,3,1,1,7,1,10,3,1,5,3,1,44,1,1,6,7,3,1,1,1,1,6,3,1,4,3,1,2,3,2,2,6,4,1,2,3,1,4,1,10,7,21,11,10,1,19,4,51,25,1,9,2,3,6,12,3,1,1,4,3,2,1,1,3,1,1,6,5,1,16,1,9,1,3,5,5,1,1,3,1,12,2,3,2,7,1390,2,7,1,2,3,3,3,1,7,3,3,1,13,1,1,4,1,2,10,2,3,1,1,9,5,16,1,2,6,2,1,44,3,1,2,1,1,1,1,6,6,2,3,2,4,2,4,1,2,3,6,3,1,3,2,2,2,8,1,11,5,5,3,16,11,8,1,19,5,30,2,16,1,1,20,1,15,3,2,1,2,2,12,3,8,1,1,3,4,1,5,17,2,9,1,3,1,2,1,3,3,1,1,2,1,2,21,1,8,1389,1,1,4,2,2,3,2,5,3,1,1,1,5,1,2,1,1,2,7,1,1,1,4,4,1,1,13,3,2,10,3,18,10,1,3,13,1,26,1,1,2,1,1,2,3,3,1,3,3,1,1,5,1,2,3,3,3,2,1,3,6,3,10,8,2,9,1,1,2,7,3,16,11,29,1,1,1,21,1,10,1,15,2,1,18,1,18,2,5,2,12,4,7,8,1,3,3,6,1,1,3,5,1,11,1,5,2,3,1,1,7,2,9,1,6,1,12,1393,3,1,8,1,1,4,2,1,6,2,5,3,1,1,1,1,1,3,3,4,5,1,9,1,1,1,1,9,1,2,1,3,5,5,3,3,4,1,5,3,1,1,1,11,1,13,1,12,9,1,1,6,1,2,1,1,2,4,2,6,5,5,7,1,4,2,1,27,1,6,2,17,10,9,1,19,5,1,2,16,1,17,2,8,2,2,14,1,5,2,15,2,18,5,5,7,9,4,1,3,2,18,3,1,1,4,1,1,4,1,5,1,7,1,12,1,8,1393,1,1,3,3,8,1,10,1,3,1,1,1,4,1,1,1,8,2,13,1,4,12,1,1,1,2,3,1,4,2,5,1,3,1,6,6,1,6,1,1,1,31,5,1,4,11,1,6,1,3,7,2,1,2,11,53,1,1,1,1,10,9,1,19,2,1,1,4,1,2,1,31,1,10,22,1,16,1,20,8,1,4,15,1,1,24,4,2,1,1,1,5,5,1,2,1,2,4,7,2,3,1,8,1392,1,1,2,1,3,1,5,1,3,4,3,1,2,1,5,1,3,2,6,1,1,4,17,1,1,12,5,1,3,1,3,2,13,1,1,3,2,12,1,18,3,9,1,5,1,1,1,11,1,5,2,1,9,2,11,2,1,10,1,8,4,16,2,14,13,25,2,12,1,42,25,1,15,1,17,3,1,1,2,3,2,2,14,9,2,17,2,6,1,6,2,3,7,1,21,1393,2,2,4,2,3,3,1,1,10,1,6,3,1,3,1,1,4,1,9,1,8,2,3,7,1,2,3,2,1,1,1,2,4,1,5,1,8,1,1,15,2,16,8,12,3,13,2,1,10,1,3,1,8,5,1,10,2,9,2,16,3,13,13,48,1,23,2,9,9,1,4,1,28,1,3,1,10,3,4,3,2,1,17,7,2,10,1,6,2,1,3,1,1,5,2,1,15,1,1,1,5,2,8,1392,2,1,3,1,1,1,1,1,5,2,12,1,4,4,1,6,1,3,26,2,7,8,15,3,1,1,2,14,2,14,4,1,4,9,1,2,3,3,2,8,1,1,7,2,15,18,2,8,2,15,4,9,16,31,1,9,1,8,2,20,1,1,1,9,7,5,4,1,1,2,23,1,4,1,9,2,2,1,1,3,1,4,17,2,7,17,10,1,19,1,8,2,7,1390,4,3,1,1,2,1,4,1,1,1,1,2,4,2,1,1,2,1,4,4,6,1,1,1,26,1,1,1,7,3,3,5,1,1,10,1,2,5,3,11,4,3,2,9,8,14,1,3,1,1,1,11,1,1,2,2,7,4,4,18,1,25,4,6,3,1,15,42,1,8,1,1,2,31,15,3,29,1,6,1,1,4,1,1,1,3,1,3,12,1,15,1,1,12,1,2,9,2,1,1,11,1,9,1,2,1,1,1,7,1391,3,1,7,1,13,1,2,1,2,1,5,6,1,1,2,4,9,3,6,3,4,1,6,1,1,2,2,1,2,2,1,1,13,1,2,1,7,10,3,1,3,1,1,9,8,9,2,6,4,10,1,3,2,1,7,5,2,31,1,12,5,1,1,4,5,1,15,46,1,1,1,2,3,1,1,23,1,3,15,4,18,2,15,1,2,5,2,3,2,2,12,1,17,12,2,1,8,4,2,1,9,1,14,1,7,1392,3,1,24,1,1,1,7,1,2,1,3,2,1,2,19,2,7,1,12,2,1,1,4,2,12,2,4,14,3,8,1,1,3,1,5,1,1,14,1,2,3,18,6,2,4,20,2,9,1,14,1,1,2,5,18,1,2,46,1,36,17,1,1,1,32,2,3,5,2,3,4,1,13,1,4,5,1,14,1,2,11,8,8,1,22,1389,1,2,2,1,2,1,1,1,11,1,5,2,11,1,1,2,1,2,3,2,6,1,21,4,4,1,3,6,1,3,2,1,1,1,6,1,2,1,4,2,1,4,1,8,1,1,3,1,1,4,9,3,1,14,5,1,1,7,3,5,6,2,2,27,1,5,1,14,1,1,3,4,17,3,1,29,1,18,1,2,1,8,1,17,1,5,16,2,10,2,5,1,7,1,5,2,2,3,1,2,4,5,16,4,1,24,10,11,28,1394,3,3,12,1,4,2,6,1,2,2,4,1,2,2,1,1,2,1,3,2,22,3,4,2,2,2,1,1,1,4,1,2,8,3,7,6,1,1,3,1,4,2,1,1,1,1,1,3,4,1,4,11,1,8,5,4,1,6,6,1,6,27,2,22,3,4,13,2,7,1,1,11,1,17,1,13,1,1,2,6,2,1,1,23,16,3,17,1,15,2,1,1,2,2,1,6,18,5,1,26,1,2,5,1,1,5,1,2,28,1389,1,3,4,1,19,4,2,2,3,1,1,7,1,1,1,1,14,1,7,1,7,4,3,1,5,1,2,4,4,1,1,1,3,1,1,1,4,1,2,1,3,1,5,4,4,1,2,7,3,1,3,4,1,14,5,1,1,9,1,5,1,2,6,29,1,5,1,14,4,4,8,7,6,32,1,11,1,2,1,1,1,2,1,3,6,19,1,1,18,1,9,1,6,1,17,1,1,1,2,10,1,1,15,7,1,27,8,1,1,2,3,1,27,1395,1,1,1,1,18,3,3,4,3,2,1,1,3,2,1,5,20,1,5,4,3,2,4,1,3,2,5,3,4,2,7,4,2,2,4,3,3,1,1,1,1,6,1,1,4,2,3,5,1,1,1,7,7,8,1,3,1,3,1,1,1,1,3,31,3,2,2,13,3,7,6,2,2,3,7,39,2,4,5,1,2,4,5,19,21,1,12,2,3,1,16,1,2,11,2,1,14,35,5,11,1,1,24,1390,3,2,1,1,1,1,2,1,14,3,5,4,1,1,2,3,2,1,3,1,3,2,16,1,4,1,1,1,1,1,1,2,3,5,4,5,1,1,1,1,6,1,8,3,2,2,4,1,5,1,1,1,1,6,3,1,1,2,1,11,1,5,7,11,1,7,6,2,1,28,5,9,1,5,2,8,9,3,5,46,1,1,8,3,6,16,59,2,2,7,1,2,13,21,1,15,1,1,4,9,1,1,6,4,11,1,4,1394,4,4,8,3,1,1,1,1,2,4,1,6,1,3,3,1,1,2,1,1,3,1,4,1,12,2,3,1,2,1,1,2,3,5,7,1,11,2,10,1,2,1,1,9,1,1,1,1,1,4,5,5,2,5,1,9,7,13,1,4,6,31,4,6,1,1,1,7,1,9,9,4,2,41,1,2,11,1,2,4,1,4,1,15,43,1,8,1,6,2,2,4,2,2,1,1,1,3,8,8,1,17,1,12,3,9,1,1,8,3,17,1390,1,1,1,3,2,6,12,1,2,2,2,12,6,1,21,1,1,1,1,1,5,4,3,5,3,3,1,3,27,5,2,1,3,5,6,3,2,8,1,6,1,1,1,1,6,15,3,2,3,1,1,11,1,1,1,2,2,12,2,20,1,4,1,1,12,46,12,8,4,3,2,3,1,6,59,2,5,1,6,2,1,1,1,2,4,5,1,2,3,27,5,2,1,8,9,2,17,1389,3,8,2,2,7,1,9,1,3,9,6,1,3,1,15,1,3,2,7,2,1,2,4,2,2,1,1,1,2,3,9,2,11,1,2,8,1,1,5,4,5,2,3,5,2,10,1,2,6,16,2,2,6,4,1,6,6,13,3,14,1,2,2,7,10,48,1,1,11,14,9,3,46,1,11,2,5,2,2,8,1,1,2,3,2,4,5,9,1,4,5,10,1,1,1,8,6,1,2,1,2,1,10,1,6,1389,2,5,1,3,1,2,6,1,1,1,3,1,2,3,1,2,2,7,11,1,1,1,13,1,10,4,1,1,6,2,5,1,1,1,5,2,3,1,11,1,3,6,1,3,3,2,2,1,6,1,2,19,1,2,2,2,3,22,1,3,1,8,8,13,2,14,1,2,1,11,8,7,1,38,2,2,7,1,2,3,1,2,2,3,2,2,9,2,60,1,3,1,2,1,1,1,1,6,6,6,5,10,1,2,1,4,2,4,1,4,2,10,1,2,5,1,8,1,4,1,4,2,1,1389,1,6,3,1,8,5,3,1,6,12,37,3,1,2,8,1,6,1,14,1,8,1,2,3,1,10,2,1,6,1,1,1,1,9,1,9,4,2,3,1,2,19,1,12,7,15,2,15,1,8,11,10,1,1,2,7,1,24,4,1,8,6,2,3,6,2,1,1,1,2,3,1,26,1,35,2,2,1,5,2,2,1,9,3,4,12,1,6,3,3,1,4,1,3,1,1,1,7,4,1,6,1,3,1,1,3,6,1,1,1389,1,1,1,1,3,2,11,3,5,2,3,12,32,4,2,6,3,3,1,1,4,1,2,5,10,1,10,1,7,5,15,11,1,6,1,5,5,34,5,15,1,9,1,12,1,3,3,1,8,13,1,9,1,21,5,1,4,1,4,7,2,1,6,1,2,3,54,1,1,1,9,1,10,2,2,1,10,2,2,15,1,2,1,2,1,4,2,2,3,13,6,2,3,1,5,1,1,1,4,1,1,1,1,1389,1,2,21,1,2,1,2,1,1,2,3,2,1,2,2,1,1,1,28,6,1,2,1,4,8,3,5,4,30,4,2,1,5,1,3,1,2,3,2,1,1,2,2,13,7,32,1,1,2,11,7,21,1,4,2,2,5,1,2,39,1,1,1,2,1,2,8,2,2,4,12,7,20,1,1,1,2,1,12,1,1,1,11,4,19,4,7,2,2,1,8,7,1,2,1,2,1,7,4,1,2,12,2,1,4,1,6,3,1,2,1,6,3,1389,1,4,1,1,14,1,2,3,1,1,2,3,2,5,11,1,22,3,2,2,2,4,1,1,7,1,7,1,1,1,32,1,1,1,2,1,4,1,5,1,1,3,1,9,1,10,1,2,3,14,1,33,8,13,1,15,1,1,2,1,1,1,1,29,1,9,1,6,1,1,2,4,1,1,3,4,4,1,8,1,1,4,11,1,8,1,1,1,3,1,10,1,2,1,2,3,6,3,14,2,4,4,2,1,4,2,2,1,5,1,2,21,7,1,3,8,7,2,2,1,1,6,2,4,2,1,2,1401,6,1,1,2,1,1,1,2,1,1,1,2,1,8,3,1,2,1,7,1,1,1,18,6,1,6,8,2,1,2,6,1,33,1,4,2,1,1,4,6,1,2,1,5,1,11,2,1,6,13,1,32,7,14,2,1,1,8,2,1,3,1,2,1,2,9,1,25,1,1,1,7,2,8,3,6,2,1,7,1,1,2,1,2,11,1,7,1,15,3,4,3,2,2,2,7,5,1,4,3,4,1,10,6,9,3,1,4,1,9,8,8,1,4,7,1,1,1,4,3,3,5,2,1,1,1402,6,2,1,2,2,1,2,14,9,5,13,1,2,1,1,1,1,1,1,1,1,9,2,1,3,2,2,4,1,1,25,2,9,1,5,1,5,7,2,4,1,13,10,9,1,1,2,32,3,1,2,1,1,4,1,12,1,2,2,3,1,1,3,1,3,9,1,1,1,20,1,3,1,6,1,2,2,10,3,4,2,4,7,3,1,2,48,2,2,1,1,2,2,2,4,2,2,2,1,5,1,3,1,1,5,4,2,3,7,1,3,2,2,2,2,1,1,2,12,1,2,1,1,7,5,3,12,3,1,2,1,1396,1,4,6,1,3,2,3,2,1,8,1,3,3,3,2,4,1,2,7,1,2,1,4,1,4,2,1,1,2,8,1,1,1,1,2,1,5,3,2,2,1,1,20,2,5,3,1,1,9,4,1,2,1,25,4,6,1,2,4,1,1,19,2,11,3,2,4,15,1,8,1,1,1,5,1,13,2,17,1,3,1,19,3,6,3,2,9,6,17,1,9,4,5,1,4,1,15,1,4,2,2,1,2,7,6,1,1,5,2,3,9,1,4,8,17,4,2,1,1,2,5,3,7,1,1,4,1,2,1,1396,1,2,1,1,1,1,6,1,7,1,1,2,2,6,1,1,2,5,1,6,4,2,2,2,5,1,4,5,3,2,2,3,1,1,1,1,6,1,1,1,5,2,27,3,1,1,1,1,8,1,1,2,1,2,1,1,1,4,1,20,2,5,1,2,1,1,1,9,1,24,3,7,1,15,2,7,2,5,2,36,1,1,1,18,3,5,2,1,10,1,2,4,17,1,9,5,8,2,21,3,4,5,4,1,1,1,3,6,3,1,7,1,1,1,1,5,1,2,2,3,2,2,9,1,2,3,1,2,5,1,1,2,10,4,1,1403,1,1,6,2,1,1,1,1,4,6,1,7,2,4,1,1,1,2,7,1,2,2,7,1,1,6,2,5,1,1,5,1,6,1,33,5,3,2,9,4,5,1,3,20,3,7,4,3,1,37,3,3,1,10,1,1,1,15,2,5,1,1,1,4,1,19,1,6,3,3,3,1,2,3,4,9,17,1,7,1,21,1,1,1,29,5,1,1,1,11,1,1,1,3,2,2,3,4,4,1,1,1,1,2,1,9,2,1,5,1,6,1,1,5,4,2,1,1,13,1399,1,3,1,4,5,1,1,4,1,1,1,1,2,6,1,4,3,3,1,10,3,1,1,1,7,1,3,2,1,4,1,9,2,1,2,1,12,1,24,1,2,2,13,1,1,5,6,1,1,21,3,1,3,1,3,2,1,2,1,30,1,7,5,12,1,1,2,15,5,1,3,3,2,15,5,4,3,1,2,2,4,1,1,2,5,9,15,1,4,8,2,1,3,1,1,1,10,5,28,6,1,14,1,4,1,1,4,3,3,1,2,4,1,1,2,1,1,4,8,2,5,3,1,6,4,1,1,1,8,6,1,1405,6,1,1,4,3,13,1,1,1,7,1,2,6,2,1,1,1,1,6,2,1,2,1,13,1,2,1,1,3,3,32,6,13,5,8,15,2,6,2,2,1,1,4,4,1,1,1,28,2,3,1,2,1,1,2,2,1,29,4,2,3,4,2,15,4,5,6,1,5,1,1,3,4,9,17,1,2,9,5,3,13,3,7,1,5,1,13,7,1,13,3,1,2,1,2,3,2,2,3,4,1,1,3,5,1,1,8,2,4,9,6,3,5,6,1,1409,3,1,3,4,1,10,1,1,1,2,2,2,1,2,2,5,4,3,9,1,1,3,1,7,3,2,6,1,35,8,6,2,5,6,7,9,1,6,1,6,2,2,1,1,5,2,4,9,1,20,3,3,1,2,1,17,2,7,1,8,1,2,5,19,5,5,3,1,9,1,1,1,5,6,23,9,4,3,15,2,5,2,19,2,2,20,3,8,4,3,2,1,5,4,4,1,5,2,3,1,1,9,7,1,1,6,2,3,1,1404,2,1,4,1,2,5,7,1,1,1,1,4,1,6,1,1,1,2,4,2,6,1,4,2,2,12,1,3,12,1,1,1,26,1,1,7,5,3,1,1,2,6,8,8,1,4,1,9,2,5,11,29,2,42,2,3,5,18,7,1,6,1,9,3,3,6,4,1,13,3,2,12,3,1,16,3,18,1,6,2,2,4,1,14,4,3,1,1,1,2,1,2,16,1,4,6,1,1,2,2,1,1,3,3,11,1,2,1,1,4,2,1,1,1395,1,1,1,3,1,1,2,1,3,2,1,5,2,1,2,1,1,1,2,3,2,4,1,3,1,2,1,1,3,2,3,1,1,2,3,1,1,1,3,1,4,5,9,3,5,1,25,2,1,8,6,12,6,11,2,1,1,1,1,9,3,2,13,5,2,22,2,7,1,7,1,8,1,1,2,14,2,3,1,19,1,3,6,1,4,4,4,3,1,3,1,2,1,2,1,8,17,1,1,9,5,1,19,1,1,2,1,1,18,2,3,8,1,9,1,4,3,4,1,1,2,1,4,2,5,1,8,1,2,1,1,4,1,2,1,1,2,3,14,5,1,1399,3,2,1,2,2,1,5,2,2,2,13,9,8,1,2,1,1,1,13,2,1,7,11,1,2,1,2,1,17,1,4,1,2,10,7,10,5,2,2,2,2,4,1,1,2,4,1,8,3,2,14,5,1,21,3,12,1,9,1,4,2,2,2,8,2,3,3,5,1,5,1,1,2,2,1,1,1,1,21,24,14,1,2,8,7,3,15,2,22,1,5,5,1,8,2,1,1,1,3,1,1,4,2,1,6,2,4,1,1,3,1,1,3,2,2,2,1,2,2,5,1,1,1,4,3,1,7,1402,3,1,2,1,1,5,7,1,1,4,12,11,1,3,1,2,4,2,1,2,7,1,2,1,1,5,17,1,17,1,2,1,1,3,2,9,8,10,2,5,1,2,3,4,1,2,1,4,2,7,19,3,3,23,1,11,1,1,1,8,2,8,1,8,2,1,4,6,2,3,1,5,2,2,14,1,6,12,1,4,2,6,19,1,4,1,26,1,22,2,4,4,1,2,3,1,1,2,1,3,1,4,4,1,9,3,1,1,3,1,1,3,3,2,4,1,4,5,4,1,1,1,1,4,4,1,1,6,1,1395,2,1,2,2,4,1,1,1,1,1,5,2,1,1,3,1,8,2,1,16,1,1,1,1,1,1,1,1,1,1,6,1,3,1,1,4,34,3,1,3,3,1,2,6,9,9,2,7,2,2,1,6,1,6,1,5,8,1,3,1,7,3,1,1,3,1,1,34,1,16,3,6,1,1,2,2,3,19,1,1,20,6,1,2,2,2,1,16,15,1,1,2,1,2,13,1,32,4,2,3,1,1,2,3,1,1,1,3,1,1,2,2,6,2,10,1,1,2,3,4,1,2,5,3,4,1,2,2,4,1,1,6,1,4,2,1,1,2,1,1396,1,1,6,8,7,3,2,2,10,10,3,3,3,1,1,1,2,1,29,1,2,1,17,1,1,1,1,6,1,3,2,3,3,2,5,8,3,8,1,2,2,3,5,5,2,3,11,2,10,54,1,2,2,1,1,5,1,1,4,1,2,9,1,2,1,3,1,4,2,2,16,11,5,17,15,6,5,1,3,2,33,4,1,8,7,3,1,1,3,3,11,5,2,2,1,4,1,1,2,2,13,2,6,2,3,1,2,8,1,1,1,3,1,1392,4,2,4,7,3,1,1,1,1,7,4,1,5,19,1,1,1,1,8,2,1,1,1,1,37,3,5,5,3,1,5,2,5,7,3,9,1,3,1,3,1,1,2,6,1,3,9,1,3,1,10,70,1,2,1,10,1,6,2,1,1,2,1,4,12,10,7,18,15,4,1,2,3,2,3,1,5,2,10,1,10,4,2,1,2,1,2,6,7,1,1,1,1,2,17,4,2,1,1,2,2,5,10,3,5,1,5,1,2,3,2,12,1,1393,1,3,7,7,1,2,1,1,1,5,6,2,2,7,1,4,1,5,1,2,3,1,3,3,3,2,1,5,2,1,15,1,16,1,7,3,2,4,13,6,2,11,1,5,2,1,1,11,16,2,7,31,2,4,2,32,2,11,1,2,1,2,1,11,10,8,1,1,1,2,6,19,10,1,2,6,5,2,2,3,2,1,1,1,2,1,5,3,11,2,2,1,1,1,1,1,3,4,3,3,2,4,1,1,9,2,4,1,2,1,1,3,1,3,1,7,11,1,1,1,1,4,3,1,3,3,1,2,1,10,1,1395,2,1,6,5,5,1,2,5,6,2,1,2,1,3,1,1,2,3,1,3,1,6,1,2,2,3,1,4,3,3,15,1,8,1,10,1,6,3,2,6,8,2,1,26,1,2,2,10,14,9,1,72,2,14,1,1,1,5,1,6,7,1,3,6,1,2,1,2,6,2,2,13,10,2,3,7,8,1,1,1,2,1,5,2,1,2,1,2,11,2,11,1,5,1,5,2,12,1,5,5,1,6,1,8,13,3,1,1,6,6,2,10,1,1394,1,1,5,3,1,4,1,2,3,1,1,1,1,3,6,1,3,2,1,4,1,7,1,1,4,2,1,6,1,4,5,2,14,2,19,1,7,12,6,8,4,11,1,8,2,6,1,2,4,1,10,6,1,3,1,28,1,29,2,5,3,3,1,16,2,1,1,1,1,3,1,4,7,1,4,1,1,3,1,5,11,12,8,3,1,10,5,1,2,1,7,1,1,1,1,1,2,3,24,1,6,1,5,2,1,1,4,1,2,1,2,3,2,12,1,2,2,4,3,2,1,1,9,29,1,1392,5,1,4,8,1,1,3,1,1,4,9,1,1,1,1,6,1,1,3,5,1,4,2,2,1,1,1,2,3,5,39,1,1,1,1,3,1,1,1,3,1,2,6,7,5,11,1,4,2,2,3,5,1,2,3,2,9,8,2,1,1,24,1,35,1,1,2,1,2,4,1,10,1,5,1,2,3,3,1,5,8,1,1,2,1,1,1,7,7,1,1,1,1,3,1,9,6,1,1,13,6,3,5,1,1,2,21,1,1,3,13,2,12,1,5,4,1,22,2,1,2,2,10,5,2,19,3,1390,1,2,7,9,5,1,1,1,2,2,2,2,3,6,1,3,1,2,1,5,1,7,1,1,2,3,2,7,1,1,32,5,4,7,4,2,5,7,5,11,1,4,2,2,3,10,1,2,9,33,1,1,1,1,1,1,1,31,1,1,1,1,3,6,1,9,1,6,1,1,2,4,1,5,9,2,1,10,3,1,3,14,11,3,1,10,3,2,3,1,7,3,2,3,6,1,7,8,10,3,10,1,5,1,1,3,4,5,1,7,1,5,1,2,8,1,5,3,3,5,2,1,2,12,1,1393,3,1,2,11,5,2,2,2,3,2,2,17,1,2,1,6,5,1,4,9,3,1,5,6,13,2,1,1,1,1,1,2,2,11,1,2,4,8,6,10,1,4,2,1,6,7,2,3,8,4,1,3,2,18,1,10,1,31,2,1,4,6,1,6,1,1,2,6,1,2,2,1,2,1,1,4,10,2,2,4,2,2,12,1,3,1,1,3,5,1,8,11,4,2,14,1,17,7,11,4,2,1,9,1,3,2,2,1,4,4,1,6,1,1,1,4,1,1,14,12,5,1404,1,1,3,1,3,10,3,7,1,3,1,4,1,1,1,11,1,4,1,2,1,3,2,1,2,3,2,9,8,3,2,2,13,1,1,20,2,1,4,8,6,10,3,6,6,6,2,3,4,17,1,16,1,30,1,8,1,3,3,4,1,3,1,3,1,1,3,9,3,2,2,3,4,1,7,2,2,3,1,6,11,4,1,2,4,2,8,1,3,8,3,4,3,1,12,1,15,8,7,1,1,4,1,1,7,3,3,1,3,1,1,8,2,7,1,5,1,1,9,2,2,1,3,10,2,3,2,1401,1,1,1,2,1,8,6,2,2,2,2,2,3,4,1,4,1,10,3,8,4,11,9,3,2,5,9,2,2,8,1,6,1,5,1,2,4,8,7,9,1,1,1,1,1,5,4,7,2,2,4,18,2,19,1,4,1,32,2,1,1,2,1,7,1,3,4,12,11,1,5,1,4,11,11,4,3,2,2,2,12,4,2,1,5,3,7,1,1,3,5,1,1,1,14,6,7,1,1,7,6,1,4,2,1,1,5,8,2,5,1,1,1,3,1,2,8,3,1,6,1,12,2,9,1,1389,1,1,3,1,1,8,3,1,4,2,2,4,4,21,1,1,1,7,3,1,2,2,1,8,3,1,1,5,4,4,13,7,1,15,4,8,8,6,1,1,1,2,12,9,5,17,2,53,2,3,2,13,1,1,6,13,9,2,1,4,1,2,3,11,8,6,1,2,30,3,1,4,3,1,5,3,6,1,11,4,2,15,8,1,2,1,2,1,1,3,1,6,2,5,4,2,3,1,8,11,1,7,1,4,1,1401,3,9,5,3,1,1,2,5,2,22,3,9,4,13,2,1,3,1,2,8,11,10,2,16,2,1,2,3,2,2,5,5,1,2,3,1,18,1,4,19,1,21,2,2,2,26,2,3,2,1,1,7,1,3,2,1,4,1,1,13,2,1,7,1,1,1,1,3,4,7,1,4,2,12,1,2,3,2,22,1,7,1,2,1,2,1,5,2,20,3,4,13,2,1,3,1,9,1,1,9,2,4,1,1,1,1,1,1,10,1,2,9,1,3,3,2,1,1404,1,2,1,1,1,1,1,6,2,5,4,4,1,14,1,20,2,1,2,13,3,1,5,1,1,7,8,12,2,20,2,1,8,2,1,9,5,1,3,1,4,1,1,3,1,1,4,4,1,14,1,1,1,20,1,2,3,26,1,3,5,4,2,5,4,4,2,6,3,2,2,1,8,7,6,2,1,2,1,9,4,1,1,2,1,3,3,2,12,2,2,2,15,3,6,1,20,4,5,11,1,3,3,1,1,1,9,10,1,3,1,5,12,1,3,5,2,8,3,1404,1,2,2,1,3,2,1,2,4,2,5,3,4,9,1,15,1,2,1,1,1,1,1,2,2,12,4,3,3,7,7,2,3,10,2,24,9,10,4,3,2,8,3,1,3,2,1,2,1,13,2,25,3,21,1,9,4,2,4,1,1,1,1,2,2,15,5,1,11,4,11,8,8,2,2,3,1,2,14,1,2,1,7,1,7,4,1,8,17,4,4,1,1,6,1,5,1,2,3,1,8,1,3,8,2,2,2,5,9,3,1,2,1,6,4,6,1,1405,7,4,6,1,6,1,2,5,1,2,1,1,1,18,3,4,5,4,1,9,2,1,1,2,1,4,1,4,5,2,1,1,1,4,1,8,2,19,2,4,9,4,7,4,2,5,1,1,1,10,1,4,2,8,3,49,1,11,2,3,2,3,1,1,2,1,1,4,2,1,1,4,2,2,4,1,29,4,9,3,3,2,14,3,10,2,6,6,1,11,12,4,4,2,1,1,1,3,2,3,2,2,1,3,11,20,9,12,3,1,1,5,2,1406,6,1,1,2,1,4,9,5,2,2,1,3,1,5,1,15,1,1,1,2,3,4,1,2,2,4,2,2,1,1,1,2,3,6,5,1,1,4,3,4,1,21,1,7,11,2,8,4,2,4,1,3,2,3,1,4,1,4,3,9,1,26,2,29,1,3,2,7,9,1,3,1,1,5,6,1,30,4,10,1,21,4,8,2,8,15,8,2,5,3,3,1,1,15,2,1,11,2,1,13,1,2,1,1,10,3,1,1,3,5,5,6,1,1406,5,1,2,6,10,1,1,4,2,2,1,19,6,3,3,1,2,8,3,1,1,1,2,2,2,1,2,4,3,1,5,3,2,8,2,19,1,4,3,5,14,7,2,4,2,3,1,10,1,9,2,26,2,33,1,1,2,6,15,5,7,1,42,2,22,1,9,4,7,3,2,4,1,5,7,1,3,1,2,2,4,2,1,13,6,1,4,4,1,1,1,1,1,10,1,1,1,4,1,1,7,3,5,4,6,5,2,1407,5,1,2,6,7,11,1,1,2,18,3,1,8,1,2,1,1,5,4,1,1,1,1,2,1,1,2,3,6,4,1,3,1,7,1,1,3,2,1,15,1,4,3,6,11,1,1,5,1,6,1,2,1,13,1,10,4,12,1,10,1,18,2,12,1,1,1,1,2,6,12,2,3,1,1,1,51,4,25,1,2,5,5,1,2,2,2,1,1,4,3,2,6,1,12,16,10,2,4,2,1,4,1,3,2,1,2,3,2,1,10,1,7,3,2,4,1,4,2,1402,1,3,1,1,1,2,2,3,1,4,6,6,1,26,2,1,1,2,4,7,1,4,3,2,5,1,1,6,5,6,1,1,1,9,2,20,8,5,1,1,5,1,3,8,2,10,1,3,1,18,6,39,3,11,5,6,13,2,19,3,63,1,4,5,4,1,3,1,3,11,2,4,1,1,9,3,2,15,6,1,1,1,2,12,1,1,2,1,1,3,1,2,8,1,3,1,2,1,12,4,2,1402,2,2,5,3,1,1,1,1,11,1,1,1,1,6,2,1,1,15,4,6,2,6,14,1,1,1,2,5,2,10,1,1,2,3,1,2,4,1,1,16,7,1,1,5,3,4,1,1,1,8,2,2,2,5,4,21,3,43,2,3,1,1,1,2,1,1,5,1,1,5,1,2,9,2,21,1,13,1,14,2,8,1,18,1,3,1,2,1,4,6,3,1,6,7,1,11,8,6,1,17,3,3,2,2,3,8,4,2,2,1,2,3,8,3,15,2,1,1,2,1402,1,5,1,2,1,4,2,1,1,1,9,1,1,2,1,1,1,4,2,10,1,5,1,1,1,4,1,1,1,1,2,6,8,1,1,3,3,2,2,1,2,1,1,9,1,2,13,1,2,14,6,2,1,4,3,6,1,18,1,2,1,1,1,2,1,17,3,43,3,4,3,2,4,4,3,1,2,1,8,3,15,5,13,2,16,1,2,2,24,2,1,4,2,3,1,5,8,5,5,5,1,1,1,2,3,1,5,10,1,12,7,11,8,2,1,2,1,3,9,3,14,1,2,1,2,1403,1,4,1,2,2,2,2,1,1,2,4,1,4,1,1,1,1,2,1,2,1,2,1,4,3,1,3,10,2,6,1,8,1,1,2,2,1,1,3,1,1,5,2,7,5,2,10,1,5,13,7,9,1,22,2,5,3,2,1,15,1,2,1,43,2,9,6,1,4,4,9,2,11,1,2,1,2,2,15,2,16,1,7,3,1,3,13,7,8,1,11,5,8,3,1,2,1,1,1,1,9,11,1,8,4,1,2,2,3,5,1,1,7,1,3,5,9,1,1,5,12,1,1,1409,2,11,8,1,2,1,1,4,1,4,2,5,1,15,1,3,1,6,3,3,2,1,1,4,3,1,1,1,1,1,3,3,1,1,12,1,3,1,1,1,2,1,2,3,1,12,3,1,1,5,1,1,4,3,2,18,1,1,1,1,1,4,2,8,1,7,1,22,2,20,3,4,3,2,1,1,5,2,4,3,1,1,8,3,9,6,2,1,14,1,8,1,1,1,8,2,3,8,14,1,6,1,2,6,1,2,11,1,6,5,1,2,2,1,9,20,4,11,2,1,2,2,3,1,4,4,6,1,1,7,1,2,14,1402,1,2,1,1,1,1,2,8,3,1,3,1,4,5,1,13,1,1,4,2,1,9,4,5,2,3,1,3,2,3,2,2,2,1,4,2,15,1,1,2,5,1,3,1,1,16,2,6,3,24,3,2,3,2,2,16,4,39,8,2,2,2,15,3,2,1,1,3,2,1,12,4,2,2,2,1,12,2,7,1,2,2,2,4,2,9,16,1,3,7,1,4,5,1,6,1,3,2,1,9,2,1,8,17,1,15,2,1,3,1,1,3,3,7,1,1,1,2,2,1,2,1,3,4,7,1,2,1,4,1401,1,2,2,1,3,1,2,2,2,2,7,2,2,2,2,1,2,11,1,1,4,1,1,1,2,4,3,1,2,2,1,2,1,7,4,7,1,2,4,3,11,1,1,1,4,3,12,14,2,6,2,2,1,24,6,21,1,11,1,28,5,10,6,2,5,2,6,2,2,2,11,6,1,1,1,3,13,2,6,2,1,2,2,3,1,6,22,3,2,5,1,1,7,1,8,18,1,2,10,8,3,17,1,3,1,2,9,3,2,1,9,2,1,1,3,2,4,6,4,1403,7,2,2,2,1,1,2,5,2,6,1,1,2,13,2,1,3,4,1,2,3,2,1,11,1,1,1,2,1,1,1,3,1,1,3,1,4,2,4,1,10,1,1,6,4,1,1,1,3,5,2,13,1,1,2,2,2,22,3,10,1,10,2,1,2,6,1,5,1,8,3,16,5,2,1,4,10,1,2,7,3,1,3,3,10,13,16,1,6,3,2,1,3,6,21,2,5,5,2,1,1,2,5,2,5,20,4,2,2,1,1,8,3,9,3,7,1,2,1,2,5,1,2,3,2,1,8,3,1,6,3,7,3,1402,2,1,2,1,4,6,4,3,2,2,2,10,2,6,7,7,2,1,1,1,1,7,1,2,2,2,1,5,4,3,9,6,5,1,3,6,8,1,5,2,2,10,1,4,2,3,2,20,1,1,1,11,1,20,1,1,1,5,1,7,1,1,1,17,4,2,1,2,15,4,1,2,2,7,12,11,13,1,1,1,2,1,2,1,1,1,1,2,1,1,1,9,7,1,12,2,6,3,1,1,1,2,2,1,14,2,1,14,5,4,2,6,7,7,2,6,1,3,2,2,6,2,2,1,1,4,4,1,1,4,4,2,5,1,1,4,1,1403,2,1,3,1,5,4,3,4,1,1,1,1,1,1,1,8,1,2,1,6,2,1,4,6,5,20,3,2,2,1,4,1,2,10,8,1,2,1,5,1,3,1,6,1,3,19,4,20,1,30,3,1,1,7,1,25,4,6,11,1,1,8,2,3,2,4,10,7,1,1,1,2,4,9,2,1,2,11,1,10,1,3,13,2,1,1,3,1,1,1,2,9,8,1,2,1,4,13,6,7,1,3,1,2,5,16,1,1,2,4,11,1,5,5,2,2,1,4,7,1415,1,1,5,1,4,9,1,9,1,10,4,1,1,1,1,2,1,1,1,3,1,1,1,7,1,9,4,1,9,1,1,8,1,3,15,1,12,21,1,1,3,1,2,5,1,1,3,6,2,28,2,1,3,6,1,24,1,1,4,8,8,5,3,2,2,6,1,4,9,1,1,5,1,1,1,3,2,10,1,1,2,8,6,17,3,1,5,2,1,1,2,2,2,14,4,1,4,1,1,13,8,12,2,1,6,12,1,6,1,2,10,1,6,5,4,5,5,1418,5,2,4,5,1,13,1,11,4,1,2,2,3,3,1,1,1,8,1,4,3,5,5,1,1,1,3,1,1,11,21,1,5,18,1,4,2,1,4,3,2,1,4,6,1,3,2,8,1,12,1,6,1,8,2,16,1,4,5,1,1,8,9,4,2,7,1,9,8,1,5,1,4,1,3,5,1,6,5,5,7,17,2,1,4,24,11,1,3,10,5,1,2,11,1,3,6,4,1,5,1,10,7,2,9,4,6,3,3,1422,1,1,1,3,6,11,1,6,2,6,2,1,6,2,3,1,1,12,1,3,1,3,1,7,4,1,1,2,1,1,2,1,2,1,2,6,5,3,3,3,11,1,2,5,1,9,1,1,1,1,6,1,1,1,5,2,2,9,1,1,1,1,2,6,1,3,1,7,1,1,2,11,2,4,1,20,5,5,12,2,2,18,12,3,4,1,2,1,1,9,3,1,1,1,1,1,2,1,8,2,1,13,5,1,2,20,1,5,12,14,2,1,3,4,1,1,2,6,1,1,1,4,1,1,3,1,4,3,1,2,2,2,2,1,2,1,1,1,10,1,1,4,4,4,2,1413,1,8,4,1,2,1,6,3,2,12,1,7,4,1,5,8,3,9,1,1,1,9,6,4,1,2,1,1,1,1,3,6,4,3,5,4,8,8,1,12,7,4,4,15,1,2,1,10,2,6,1,15,1,2,3,1,2,18,3,3,2,5,9,1,3,16,19,2,2,12,2,2,3,1,10,1,2,6,1,8,4,10,1,1,1,13,2,2,10,9,2,7,1,14,1,1,1,6,12,4,1,5,2,1,19,5,1,1421,2,1,2,1,14,1,1,3,1,9,1,4,1,1,1,1,2,1,8,5,2,1,1,5,1,1,1,2,1,11,4,5,5,2,1,8,3,3,6,6,8,6,1,12,3,1,3,6,1,7,1,8,1,2,1,1,1,9,1,1,2,2,1,1,1,9,1,7,5,9,1,10,3,1,1,8,14,3,2,3,1,5,19,19,5,3,10,13,9,6,2,5,2,6,1,1,1,3,10,10,1,11,1,9,2,1,2,5,12,3,3,3,8,8,6,10,1,1420,1,5,5,1,1,2,1,7,1,20,4,1,1,3,3,1,1,10,1,2,2,1,1,7,3,1,1,2,1,3,2,1,5,7,1,1,1,2,7,1,2,3,1,1,5,1,2,4,2,2,1,8,3,2,1,7,1,16,1,2,3,17,1,18,3,22,2,9,11,5,3,1,2,2,1,7,16,15,1,3,2,1,3,3,2,1,3,11,14,7,2,5,2,2,1,2,2,7,6,17,1,3,3,10,4,1,2,2,14,1,2,5,7,10,3,10,2,1,1,1417,1,4,4,1,5,1,1,24,3,5,2,1,2,2,1,26,4,2,2,1,2,2,5,5,1,3,1,1,1,1,3,2,2,2,1,1,7,1,5,4,2,34,1,9,1,20,1,17,2,22,2,8,1,1,10,7,1,4,1,1,1,5,18,6,1,1,1,6,1,1,1,1,5,6,3,1,2,8,14,15,6,3,2,1,1,3,4,3,1,10,5,3,2,12,1,4,1,1,6,2,2,3,1,9,1,2,1,1,1,12,3,13,1,1411,1,5,3,4,1,1,5,26,1,4,1,1,2,1,3,25,1,4,3,1,14,3,3,2,1,1,2,5,2,5,5,1,7,2,2,9,1,3,1,46,1,1,1,21,2,22,1,10,6,2,1,2,3,1,1,1,2,2,1,3,3,1,2,2,14,1,2,1,2,2,2,1,1,4,2,1,2,1,4,2,1,5,1,1,3,6,14,16,6,2,3,2,1,5,2,2,1,11,5,2,2,13,1,6,5,1,2,1,1,1,4,4,7,5,1,8,3,12,1,1411,1,2,1,3,1,1,1,2,1,1,9,28,3,2,2,1,1,23,2,4,3,1,1,2,2,1,4,1,4,5,1,4,3,4,1,7,1,1,2,1,8,3,1,4,1,8,1,1,1,16,2,25,1,1,1,5,1,15,1,23,1,6,9,5,5,3,1,7,5,2,26,4,11,1,2,4,4,3,1,6,12,1,2,1,4,1,1,4,7,5,1,1,2,3,1,1,3,13,6,3,1,5,1,2,1,10,1,1,2,1,1,3,3,1,1,1,1,2,6,1,2,1,2,9,2,1,2,4,1,2,1,2,1,1,1,1419,3,1,3,2,3,2,1,27,5,15,2,10,1,4,5,3,1,3,2,12,6,1,4,1,1,5,1,1,2,1,9,3,1,4,1,7,1,10,1,1,1,6,1,6,2,2,2,13,3,4,2,12,3,1,1,9,2,5,1,9,1,1,12,2,11,2,3,1,4,2,2,1,12,1,12,2,2,3,1,5,3,3,2,3,3,8,18,3,2,2,9,4,2,7,2,14,8,2,1,4,1,10,2,4,1,6,1,3,1,7,1,1,1,1,4,9,7,2,8,1422,1,1,2,2,5,17,1,2,1,1,2,1,1,1,1,1,5,5,1,1,2,6,1,8,1,2,2,1,8,3,1,3,1,3,1,7,13,2,1,1,17,1,1,4,1,3,3,8,1,3,2,16,1,1,3,5,1,7,5,2,4,1,1,9,1,2,2,10,1,5,1,7,26,3,7,1,3,3,10,1,1,2,5,1,10,4,1,5,1,5,6,8,11,1,8,2,1,3,6,1,9,2,1,20,5,3,1,10,2,2,4,3,1,5,1,2,3,11,5,6,3,1,5,3,5,2,1,2,2,1417,1,5,5,22,1,3,1,1,8,4,1,12,9,2,8,1,1,1,3,1,1,3,2,5,4,4,1,1,6,2,20,3,1,1,3,1,1,4,1,3,1,1,1,2,2,17,1,6,3,5,2,2,2,2,1,3,2,1,1,9,2,5,1,5,1,1,1,2,1,9,25,3,6,2,5,1,10,1,3,2,15,12,1,2,6,5,2,1,18,7,1,1,1,2,1,1,13,17,7,4,3,8,1,2,8,5,2,1,3,22,2,3,6,3,3,1418,1,1,1,11,3,1,2,10,1,3,2,4,2,2,1,3,1,1,4,2,3,8,3,2,5,1,3,1,7,1,2,2,2,13,4,4,3,1,4,1,19,1,4,3,2,2,4,1,1,1,1,2,6,5,1,9,1,6,2,5,1,6,2,1,1,2,5,18,1,2,4,2,1,7,26,2,6,2,21,2,5,1,9,1,1,11,2,1,2,1,1,2,1,5,1,2,10,2,4,9,2,1,5,1,9,13,1,2,9,2,3,3,3,1,2,1,1,1,14,1,2,23,3,3,1,1,10,3,2,1415,1,12,5,3,3,12,2,5,2,1,1,2,3,1,2,1,1,2,2,5,7,1,7,1,5,1,1,2,1,3,1,2,2,3,1,2,4,1,1,4,1,1,1,1,1,5,22,2,12,1,2,2,3,6,2,12,2,12,1,4,2,1,2,13,1,7,6,1,2,1,1,7,1,1,6,1,31,1,2,1,13,1,14,2,2,14,2,3,1,6,16,10,1,2,1,1,5,4,2,2,2,2,2,9,5,1,5,3,8,1,6,1,2,1,11,25,2,8,7,2,1,1420,1,9,1,1,5,2,1,5,1,8,1,1,1,2,1,2,1,1,1,2,3,1,1,1,1,3,1,1,1,3,2,1,1,1,4,1,1,1,1,1,10,2,1,1,3,2,3,4,7,9,3,1,30,1,10,1,3,4,4,10,2,11,5,1,6,13,1,2,1,3,6,2,5,9,5,2,15,1,9,1,6,1,1,1,2,1,11,1,9,2,3,1,1,14,1,1,3,9,1,1,13,7,1,5,3,1,3,8,2,2,3,7,5,2,6,2,15,8,3,28,3,6,1,1,7,1,3,1422,1,1,1,1,1,3,2,1,4,2,1,1,1,11,2,4,4,3,2,4,1,5,2,2,2,2,2,2,5,5,5,1,2,1,2,1,1,8,9,7,3,1,1,1,2,3,18,1,6,2,1,3,3,1,1,1,1,5,3,11,3,1,1,1,1,6,3,5,3,1,1,12,6,1,13,11,1,2,1,1,9,2,12,2,7,3,2,2,9,1,1,3,4,1,1,2,10,10,1,6,2,4,11,3,3,4,3,3,4,2,2,6,3,2,4,1,3,3,13,2,14,9,1,1,1,28,2,5,1,2,12,2,3,1417,1,5,1,2,1,1,7,1,1,13,2,3,2,2,1,2,1,1,1,2,6,1,1,18,8,3,3,4,2,2,9,6,5,3,28,2,1,2,1,1,8,5,3,11,3,3,1,5,4,8,1,1,2,2,1,9,1,1,2,3,11,1,1,12,1,1,9,4,3,3,12,4,4,3,3,8,1,2,3,3,1,2,1,2,2,1,2,7,1,3,1,3,1,5,6,1,5,4,1,1,7,3,3,2,5,2,3,2,10,2,29,11,2,36,2,1,10,1,5,1406,1,2,1,1,1,4,1,2,1,1,1,1,4,1,5,2,1,11,1,1,3,2,2,2,1,1,1,1,1,4,3,1,2,1,2,7,1,2,1,6,8,2,5,3,11,7,3,5,2,1,1,1,26,1,3,1,2,1,4,4,4,8,2,1,3,9,3,14,2,13,1,3,10,12,1,2,1,4,1,1,3,5,3,2,15,1,4,2,5,7,1,1,1,1,2,1,6,6,1,11,5,5,2,1,5,1,1,1,2,1,3,2,6,4,2,2,5,2,15,2,29,11,2,33,1,2,20,1402,3,2,1,2,3,7,4,3,8,7,1,4,3,1,1,1,2,4,2,2,1,2,1,1,1,2,1,14,2,3,10,3,4,1,1,1,9,6,2,1,2,5,7,1,7,2,13,5,7,3,2,12,2,2,4,1,1,2,5,12,2,1,1,18,3,1,7,11,3,4,1,1,2,9,16,5,1,4,2,2,1,3,1,1,3,2,5,1,2,18,8,11,1,1,6,3,3,1,1,8,6,2,11,1,1,2,1,1,15,1,10,4,1,5,3,1,1,1,1,34,21,1404,1,2,1,2,1,1,1,7,6,1,8,19,1,4,1,1,6,1,1,6,2,4,1,3,1,1,1,1,1,1,7,6,3,4,9,3,1,2,1,4,1,7,4,1,2,1,1,1,16,6,7,7,1,8,1,2,2,1,12,14,1,6,2,5,3,5,1,1,2,3,2,1,1,1,1,3,3,1,3,1,2,5,3,1,1,4,1,2,3,1,4,1,3,11,3,1,2,3,2,5,7,19,8,4,4,7,8,2,1,8,5,4,7,9,10,2,1,3,4,2,4,2,1,7,3,3,2,36,19,1401,1,1,2,1,2,1,1,2,1,2,1,5,12,1,2,8,1,5,1,6,1,2,1,3,4,14,4,1,1,1,8,6,2,4,4,1,4,1,2,1,3,2,1,14,2,1,1,2,8,1,5,7,2,4,2,1,3,16,13,13,1,3,2,3,2,5,1,1,2,5,1,4,1,3,2,5,2,2,5,3,4,2,1,1,3,1,5,3,1,2,5,9,3,1,3,3,1,6,8,13,1,3,10,1,5,6,2,2,9,7,4,1,1,4,1,1,4,9,4,1,5,2,1,1,1,1,2,3,6,1,1,4,2,1,3,42,3,9,1,1,4,1401,2,1,1,3,2,1,1,1,3,8,9,1,3,3,1,1,2,3,1,1,1,2,1,2,3,1,1,4,2,2,3,3,1,2,1,4,1,6,9,4,3,2,6,4,1,1,2,1,1,1,4,2,1,3,1,8,1,1,4,6,2,6,1,10,4,2,3,7,2,1,1,3,7,1,4,13,1,3,1,12,4,6,2,5,4,4,4,1,4,2,4,1,10,1,1,1,1,2,1,2,8,5,9,2,1,1,1,4,8,6,1,9,12,1,3,5,1,5,15,1,3,1,1,7,1,12,3,1,6,6,10,55,3,6,2,2,6,1400,1,1,6,1,1,2,3,4,1,2,3,2,8,3,1,2,1,3,1,2,4,3,2,2,1,2,2,5,1,2,1,1,1,8,1,2,3,2,8,7,8,4,4,3,1,5,1,1,1,6,1,1,2,1,3,6,1,2,3,8,1,4,1,1,1,3,2,4,1,2,2,2,1,4,9,1,2,2,1,1,1,3,1,8,2,10,3,11,2,2,3,1,1,4,12,2,9,4,1,6,7,2,13,14,1,1,1,5,1,8,10,1,1,6,1,11,2,1,8,1,1,1,5,7,4,2,1,3,14,5,2,2,9,8,2,2,1,48,10,1402,7,4,1,1,1,3,1,1,14,10,1,6,2,1,2,2,2,7,1,2,3,1,2,3,1,2,1,5,1,1,2,1,1,4,3,1,8,1,2,5,1,5,2,3,2,1,1,4,1,2,1,1,1,1,5,1,2,2,3,4,1,11,2,4,1,7,3,2,1,2,3,1,10,5,2,7,3,9,5,12,1,3,1,1,2,4,11,6,6,2,2,6,11,2,2,1,6,2,1,1,3,7,3,1,1,3,2,5,15,3,1,1,3,1,2,6,2,1,3,1,4,3,7,6,5,1,3,1,14,6,6,1,1,1,1,1,1,7,3,51,10,1400,2,1,4,1,1,1,8,2,13,14,1,3,2,1,1,2,1,1,2,1,1,7,2,3,2,1,1,3,3,1,1,2,1,1,2,4,2,5,3,2,1,3,6,5,4,10,3,3,6,2,2,1,1,17,3,13,4,3,13,6,2,8,1,4,2,4,2,20,2,3,13,7,1,1,7,1,1,4,2,2,2,3,13,2,7,5,3,4,1,1,2,2,1,1,1,1,2,1,5,1,1,1,2,2,2,3,5,1,1,3,2,1,1,1,1,2,2,4,5,8,2,3,21,4,11,42,1,19,6,1,4,1399,3,1,2,1,4,2,3,4,1,3,2,1,2,1,4,11,1,4,3,4,3,2,2,5,1,3,1,7,1,1,1,4,1,1,4,1,5,1,4,2,2,1,8,2,1,1,3,1,1,12,2,1,2,1,1,1,1,1,1,2,2,2,1,16,3,14,1,2,14,1,2,6,1,18,3,21,10,1,1,1,7,3,5,1,3,1,2,4,2,2,3,1,26,3,1,5,1,1,3,1,12,6,3,3,7,2,2,12,5,3,1,3,2,1,1,3,7,3,26,43,1,18,4,3,6,1397,8,1,3,1,4,1,1,1,2,2,11,7,2,14,4,7,2,1,1,4,1,4,2,3,1,3,2,1,1,3,1,1,1,1,2,4,9,9,1,11,1,2,3,2,3,1,4,16,6,6,1,1,2,7,5,2,7,1,1,1,1,46,1,2,4,1,3,1,2,3,4,2,14,4,3,4,27,1,1,4,1,1,4,2,1,1,2,1,8,1,1,4,4,2,5,17,1,1,3,3,2,3,2,1,3,4,2,1,2,2,3,1,24,60,2,5,8,1395,1,1,14,4,2,4,4,1,7,1,7,12,1,1,3,9,4,1,1,1,2,2,1,3,1,2,7,1,2,1,1,1,10,1,4,8,1,1,4,9,2,5,1,17,1,3,4,1,1,1,2,2,2,1,2,1,1,1,1,5,11,2,1,15,1,1,1,3,1,4,1,3,2,17,1,2,1,2,9,1,1,5,4,1,10,2,2,3,7,1,2,2,16,1,7,1,1,3,7,1,10,3,4,4,3,7,1,9,12,2,4,6,1,1,32,3,1,36,1,2,1,24,10,1393,1,3,4,1,4,1,3,3,2,1,6,1,1,1,3,1,1,4,2,3,1,9,2,3,1,4,2,1,1,1,3,2,1,4,1,1,3,1,2,2,4,2,1,2,1,2,3,2,2,5,3,3,1,2,1,2,1,1,3,1,1,1,1,5,1,7,2,2,1,6,1,6,1,1,2,1,2,2,4,1,1,2,1,4,1,4,2,3,8,23,3,2,1,2,3,8,3,3,1,2,3,5,3,1,1,2,3,6,9,1,6,5,3,2,6,1,1,1,21,1,1,1,21,1,4,1,1,3,4,1,1,12,2,1,2,1,9,1,1,1,2,8,5,1,26,3,2,8,2,27,1,23,4,1,8,1392,3,1,1,2,7,3,1,2,1,4,1,1,3,1,3,1,2,14,1,1,6,6,1,1,1,4,1,2,1,1,1,1,1,7,1,2,3,1,8,1,1,1,1,1,2,4,3,2,11,2,2,7,2,1,3,3,12,8,1,1,2,6,3,7,2,7,11,21,2,5,3,2,1,2,9,1,4,2,5,1,4,3,2,2,2,1,1,1,2,1,7,1,5,3,3,1,9,1,1,1,50,4,3,1,3,7,7,1,2,1,6,1,4,7,34,3,1,49,2,12,4,1,8,1393,1,4,2,1,3,1,2,4,1,5,1,2,1,2,3,1,1,4,1,2,4,4,1,1,2,2,3,1,2,5,2,2,2,13,1,2,2,2,5,1,2,1,1,4,3,1,1,1,2,1,11,2,2,2,1,3,11,1,1,2,1,2,1,2,1,1,1,6,1,10,1,9,1,8,2,1,1,1,6,7,1,1,1,2,1,6,2,6,4,1,2,3,1,1,7,1,1,5,1,1,2,2,4,1,4,2,1,3,5,1,14,1,15,1,15,1,7,1,4,1,19,4,7,6,1,1,21,2,3,1,28,1,3,1,1,1,2,1,2,2,3,3,1,1,1,5,5,3,1,4,5,3,1,1,2,7,2,10,6,1,9,1392,1,2,7,3,2,1,1,1,6,1,4,1,5,11,1,4,1,5,5,2,3,3,2,2,1,3,1,2,2,1,1,3,3,1,3,1,6,2,2,1,1,1,2,1,3,1,1,5,2,1,2,2,2,5,3,1,2,1,5,2,1,9,1,34,6,4,1,5,1,4,1,20,1,3,1,1,4,1,5,1,2,7,2,1,6,5,1,3,6,5,23,4,1,1,21,1,25,2,5,3,1,5,4,1,18,1,14,1,22,1,2,3,1,1,3,6,5,1,6,2,2,4,6,1,2,1,2,8,1,10,7,1,1,1,1,1,1,1,2,1393,1,1,5,2,1,1,3,1,2,1,7,3,1,1,3,3,1,1,1,2,1,11,5,1,1,3,1,2,2,1,3,5,1,2,2,5,3,2,1,2,6,3,1,1,1,2,1,1,3,4,2,4,2,8,2,5,6,3,3,4,2,4,4,2,2,6,3,15,5,2,2,4,1,10,1,2,2,9,2,6,1,1,1,2,9,1,3,6,3,1,3,8,5,10,19,5,28,1,26,8,12,1,27,1,19,1,1,3,3,2,3,1,1,1,3,4,1,2,5,1,1,1,1,2,14,18,3,1,3,9,1,1391,2,1,1,2,2,1,7,1,6,1,2,7,2,3,1,2,2,2,1,1,1,1,1,3,5,1,3,5,1,2,1,2,1,2,1,2,1,3,5,4,2,3,6,1,1,1,1,2,1,3,1,1,1,5,2,3,3,6,1,4,3,1,2,2,1,1,2,4,1,3,1,2,1,1,3,5,1,1,2,11,1,7,6,1,2,12,2,5,4,5,5,6,12,3,2,7,1,2,1,1,1,7,9,8,6,1,13,1,5,1,10,1,14,1,25,3,2,1,11,1,7,1,22,1,15,2,2,1,1,4,1,2,1,1,3,5,2,3,7,1,2,1,16,20,7,7,2,1391,2,1,1,1,2,1,1,2,2,1,2,2,5,1,1,3,1,1,3,3,1,1,3,1,1,3,1,2,1,5,9,1,1,1,1,1,1,2,3,6,8,5,1,2,3,7,6,1,2,3,1,1,1,8,1,2,2,5,1,3,1,2,4,1,1,9,2,2,1,3,1,1,1,9,1,4,1,7,6,1,2,2,1,1,2,9,1,3,2,7,1,1,2,8,5,1,5,3,3,2,1,5,1,2,1,4,1,2,10,6,7,1,1,1,11,1,6,2,4,1,5,1,38,7,6,5,2,1,5,1,19,2,10,1,5,2,2,1,3,2,1,2,1,2,2,8,8,2,20,20,7,7,2,1389,1,2,1,1,6,2,9,1,2,5,1,1,3,6,3,2,7,1,2,1,3,1,1,1,2,3,1,4,1,6,1,1,7,9,2,3,1,1,1,2,2,1,3,1,3,1,1,9,1,1,4,2,7,1,2,1,6,2,1,2,7,2,1,8,1,1,1,3,2,2,1,5,1,2,7,1,2,2,2,10,2,10,2,1,2,8,5,1,5,2,1,2,3,1,1,13,13,5,7,1,7,1,13,3,2,1,17,1,22,1,2,8,4,1,3,2,1,1,5,1,1,1,19,2,6,1,2,2,3,2,3,3,3,4,1,2,4,3,3,2,5,1,1,1,9,1,5,1,4,17,1,2,1,1,1,2,2,6,4,1388,3,2,6,2,9,3,1,1,1,2,5,4,5,1,2,2,2,2,2,1,5,1,2,1,1,2,1,5,1,9,6,2,2,3,2,1,1,4,2,1,2,7,4,1,2,5,2,3,13,1,6,2,5,1,3,1,1,1,1,1,2,1,2,9,4,6,10,1,2,1,1,11,1,11,1,12,11,2,3,7,3,7,14,3,1,2,2,1,3,1,13,1,1,1,2,1,5,3,17,4,17,4,1,10,6,1,3,1,4,1,3,1,2,2,11,6,4,1,3,3,4,2,4,1,2,3,1,3,1,1,6,2,3,3,1,2,15,1,3,18,1,18,2,1387,2,1,3,1,2,2,1,4,1,1,9,4,7,3,1,1,4,1,6,1,3,1,4,1,2,2,3,11,9,2,1,1,5,1,6,2,3,4,6,1,1,4,3,1,1,1,3,3,4,1,1,1,1,1,6,1,6,1,2,1,6,1,4,3,3,1,1,1,2,8,4,1,4,1,4,9,1,13,1,4,1,4,12,3,2,6,2,12,3,1,12,1,3,1,1,1,15,1,5,4,1,3,9,1,7,5,17,16,10,1,7,1,1,4,6,1,2,5,4,2,2,4,3,5,5,2,2,5,4,1,1,2,4,1,21,1,3,35,3,1386,2,9,1,4,20,4,4,1,3,2,7,1,3,5,1,1,2,3,1,2,1,1,3,1,15,1,2,1,1,1,12,1,2,8,3,7,1,3,14,2,5,1,3,1,5,2,4,2,1,3,1,3,2,7,4,1,1,1,1,3,1,9,1,14,2,4,1,4,3,1,8,1,5,4,4,15,2,2,5,2,4,2,23,2,1,2,2,1,10,2,5,5,4,1,13,1,3,11,17,8,7,1,1,4,1,2,6,6,1,7,4,1,1,4,5,2,6,1,22,1,2,37,2,1385,3,4,1,2,1,5,21,1,1,5,4,2,6,1,4,5,2,6,1,2,1,1,17,2,1,3,2,1,1,1,1,1,2,3,4,7,4,4,2,2,8,1,3,1,1,1,13,1,4,3,1,10,1,1,3,1,1,5,7,4,4,7,1,2,3,9,1,3,1,1,7,1,2,1,4,2,1,5,2,1,5,2,1,15,2,4,5,1,1,1,4,2,16,2,1,1,22,2,1,1,4,2,8,2,6,9,1,1,16,2,1,2,3,1,7,3,1,2,1,1,5,5,1,11,1,1,2,1,1,3,3,2,1,1,29,1,3,14,2,11,1,2,1,6,2,1384,4,3,1,1,2,4,21,1,2,1,1,1,1,2,1,3,5,1,8,2,1,5,4,5,12,1,2,7,10,2,6,1,1,4,1,2,8,1,13,2,16,1,3,3,1,1,1,1,1,1,1,2,1,3,1,6,4,1,2,4,4,10,1,2,2,12,1,1,2,3,8,8,8,18,4,2,14,2,9,2,6,1,23,3,2,1,1,2,6,1,1,3,5,5,1,1,1,1,13,1,3,1,2,1,1,2,12,2,3,2,5,4,2,3,2,6,3,1,3,1,4,2,21,1,13,14,1,22,2,1385,1,1,2,1,6,7,6,1,21,1,7,1,1,1,1,1,3,2,2,4,1,1,1,4,8,1,3,2,3,13,7,1,6,1,3,1,1,3,7,1,13,1,13,3,1,3,4,3,2,3,2,4,1,4,1,4,7,16,2,5,1,2,1,5,1,1,9,2,1,3,12,1,1,2,1,2,1,10,4,2,14,2,5,1,37,3,1,2,1,2,4,4,8,1,24,1,1,1,1,2,2,3,7,3,6,4,1,1,1,2,1,2,1,4,1,3,5,1,2,2,2,1,1,2,2,1,26,12,2,12,1,4,1,5,1,1388,2,3,3,4,4,5,20,1,2,2,19,3,2,3,1,4,12,1,3,1,1,4,2,4,1,1,16,1,1,1,1,5,4,1,1,2,4,1,19,8,4,3,2,9,2,1,2,1,1,1,1,1,7,1,1,13,2,3,1,9,2,3,26,1,2,1,1,2,5,7,20,1,2,1,3,1,4,1,12,1,18,3,3,2,5,4,7,1,20,1,5,1,4,5,1,1,6,2,6,6,1,1,2,2,2,1,2,2,6,8,2,2,15,2,11,3,1,1,1,11,1,9,1,8,3,2,2,1385,2,2,5,1,1,1,2,1,1,1,2,1,3,2,31,1,4,1,1,1,2,4,1,5,1,1,3,1,7,7,2,10,10,1,5,3,3,3,10,2,3,1,12,1,1,2,2,5,4,1,1,8,2,2,2,3,1,1,1,2,9,5,2,6,2,2,3,5,1,1,3,5,12,1,11,1,5,1,22,1,9,1,2,1,40,2,5,1,5,2,5,2,5,1,5,1,4,1,4,3,12,4,2,1,6,1,4,5,1,1,4,2,1,7,1,1,3,9,1,1,3,1,12,3,13,1,3,10,1,7,1,9,4,2,2,1384,3,1,11,5,1,1,2,2,20,1,4,1,5,1,1,1,2,1,4,4,1,1,1,2,1,1,2,1,10,6,1,1,1,3,1,6,1,1,1,1,13,1,1,2,3,3,1,1,2,2,5,1,19,2,2,1,6,1,1,1,5,8,1,1,1,2,11,1,1,1,1,13,2,1,1,3,2,1,2,5,5,1,6,2,40,1,8,1,1,1,1,1,2,1,36,2,5,1,5,2,11,1,6,2,2,3,3,4,11,2,4,3,4,1,5,1,1,2,1,4,1,2,1,1,1,3,1,2,5,8,2,2,4,1,7,6,14,16,1,2,2,8,1,2,1,2,4,1,1,1384,11,1,7,2,3,1,8,1,6,1,2,3,4,1,2,1,1,1,3,3,1,4,1,4,1,1,3,3,2,1,1,1,3,11,1,7,1,1,1,1,12,1,1,4,2,2,2,2,5,4,14,1,5,1,5,2,1,2,1,1,2,4,1,5,3,1,2,1,13,2,1,2,1,1,2,3,1,1,2,4,3,2,3,2,64,4,38,4,1,6,4,1,5,1,2,1,14,3,3,5,18,1,11,1,1,4,1,3,2,1,1,3,1,2,1,1,1,1,4,3,1,1,1,3,4,1,6,5,1,2,8,1,5,6,1,8,6,14,1,1386,12,4,6,2,4,1,5,1,1,1,13,1,6,1,4,1,1,3,2,5,1,1,1,1,2,4,3,10,1,1,1,2,2,3,3,1,3,1,9,4,2,2,1,2,3,1,4,1,18,1,5,1,4,3,1,7,1,1,1,2,1,3,3,5,10,1,4,3,3,3,1,3,2,2,3,3,2,2,2,1,1,3,58,2,1,2,36,6,1,5,11,2,14,3,3,3,29,1,2,1,1,11,1,2,1,5,1,1,1,1,1,6,1,3,11,9,6,1,1,1,3,18,4,6,1,7,2,1386,12,2,6,1,1,3,5,1,1,1,6,2,2,2,9,1,2,1,4,1,1,1,3,1,6,1,4,3,2,3,1,7,4,4,4,1,1,1,2,1,7,1,1,1,14,1,4,2,15,5,1,1,5,11,3,6,1,1,1,1,1,1,11,3,4,1,1,1,2,4,2,1,3,1,2,2,4,2,2,6,55,4,3,1,35,4,2,6,7,1,4,2,1,1,48,1,2,1,2,8,1,2,1,2,1,4,1,1,2,1,1,2,1,7,11,9,6,1,5,3,1,3,1,3,2,7,2,3,1,10,2,1386,3,1,14,1,1,1,1,4,4,1,9,3,3,2,4,1,8,2,2,1,1,3,1,1,3,1,1,3,6,2,1,4,1,1,2,5,2,1,2,1,5,1,16,6,1,2,3,1,18,2,8,12,3,1,1,4,1,3,1,3,9,3,1,1,1,1,1,2,1,1,1,2,1,3,1,1,6,1,1,12,1,1,54,3,3,2,11,1,6,1,17,1,4,3,1,1,6,2,4,3,1,1,2,1,5,1,37,3,1,1,2,8,1,10,1,5,2,9,11,1,1,7,4,1,4,14,1,1,1,5,2,3,1,8,3,1389,10,4,1,4,1,1,1,3,6,1,5,3,1,1,3,3,11,1,1,1,1,2,1,5,2,3,1,2,3,1,1,1,1,1,1,13,4,1,8,1,5,10,1,5,1,1,19,1,11,11,5,1,2,2,1,2,2,4,7,2,1,2,1,1,1,1,4,1,1,2,2,2,3,1,1,4,1,1,1,1,1,1,1,4,57,1,21,1,18,1,8,2,8,2,1,6,1,7,38,1,3,1,1,2,4,1,1,4,1,2,2,11,1,11,2,1,8,4,3,1,2,1,1,1,1,1,2,4,1,7,1,3,3,4,1,15,1,1386,1,3,4,1,3,4,3,1,1,1,2,1,6,12,1,1,1,1,2,1,3,2,6,11,3,1,1,1,1,2,1,5,2,1,3,1,1,3,2,1,4,2,6,3,3,2,1,7,2,2,1,4,1,4,17,3,1,3,1,1,1,3,1,1,2,3,1,2,1,1,6,3,3,1,10,4,2,3,4,1,1,1,3,2,4,6,6,4,9,1,55,1,41,2,6,8,1,12,2,2,32,2,2,4,1,1,1,7,3,5,1,5,2,3,1,8,9,1,3,2,1,1,1,1,1,1,1,1,1,1,3,4,2,1,2,3,1,3,4,9,2,11,1,3,2,1378,11,1,3,1,1,2,1,3,8,2,3,5,8,2,3,1,7,4,3,3,5,3,1,10,1,1,1,5,1,4,1,2,1,9,2,2,2,5,2,2,3,3,3,3,18,8,1,2,3,7,1,1,1,2,2,1,1,2,1,1,3,3,5,2,4,2,2,1,3,1,1,1,3,2,1,1,1,1,1,1,10,1,14,1,84,1,6,1,13,4,1,1,1,20,5,1,23,1,2,4,3,3,1,4,2,11,2,3,1,1,2,4,10,1,1,1,2,1,4,3,6,6,1,1,1,3,11,17,2,2,1,1380,5,1,5,1,1,1,1,1,1,1,5,1,1,1,7,1,4,4,9,1,5,1,6,2,1,1,2,2,3,1,3,1,1,4,1,3,8,1,1,3,1,5,2,9,2,1,1,1,1,2,3,1,2,1,4,2,1,1,2,3,13,1,1,1,1,9,1,1,1,9,1,1,7,2,2,2,1,2,5,2,4,2,2,3,1,3,1,2,3,6,2,2,1,1,3,1,9,2,2,1,96,1,10,5,1,12,2,1,1,6,7,2,2,1,1,1,16,4,5,22,1,1,1,3,1,3,6,1,3,2,1,2,1,1,2,3,2,4,3,11,8,3,1,6,2,2,1,5,2,1382,1,2,6,2,4,1,18,1,2,2,1,1,8,1,1,1,4,3,7,2,2,1,5,2,3,5,2,1,3,2,4,1,1,3,2,2,9,2,3,1,2,1,1,1,4,1,4,6,1,2,1,2,15,2,1,7,3,6,2,5,5,2,1,1,1,1,14,2,4,1,1,1,3,1,3,1,2,11,11,3,52,3,30,1,12,1,3,1,5,6,1,1,1,11,4,5,4,1,2,3,4,2,3,1,1,2,5,1,3,1,1,4,2,5,1,9,2,4,1,1,1,1,1,2,2,1,1,1,5,1,3,3,1,2,1,6,1,1,1,2,1,12,2,2,4,2,3,11,1,1388,1,1,3,1,4,1,1,1,4,1,2,1,2,1,1,2,6,1,3,2,2,2,7,2,1,1,1,1,3,2,1,2,6,1,7,1,6,1,4,3,1,3,3,3,2,2,1,1,3,2,1,1,1,4,1,2,6,1,2,1,5,1,1,4,2,1,11,15,2,1,1,11,1,1,3,2,10,1,8,1,6,1,8,1,1,2,5,4,2,3,7,1,1,2,50,3,7,3,2,1,31,1,8,1,1,1,9,10,3,4,5,7,1,1,2,4,1,1,1,1,1,2,1,1,2,2,3,2,1,11,2,1,1,1,1,4,2,2,1,4,1,2,3,1,6,6,3,10,1,9,1,5,2,6,1,1402,2,2,3,4,2,1,4,1,1,3,8,1,2,1,1,2,1,1,1,1,6,1,4,2,1,2,6,1,1,2,7,2,1,1,2,1,1,1,2,1,1,3,1,1,1,5,2,2,2,1,2,1,1,3,2,4,2,1,4,1,5,2,2,1,2,1,1,1,3,2,2,3,5,14,3,4,1,1,1,6,5,3,4,2,3,1,1,1,20,1,1,1,2,2,4,1,1,2,1,1,1,1,8,3,1,1,49,3,1,1,6,2,1,1,2,1,30,1,6,1,8,1,3,12,1,3,5,6,1,1,4,1,1,1,1,1,1,2,2,2,4,2,1,1,1,1,1,17,1,8,1,1,2,4,2,13,1,1,4,1,1,5,1,9,1,3,1,7,1,1404,1,1,4,3,3,2,3,1,4,3,8,2,1,4,1,1,1,1,3,1,17,1,8,1,2,5,1,5,2,1,2,6,1,3,4,7,1,2,4,2,2,1,6,4,3,2,7,1,1,1,5,2,1,8,1,5,1,1,1,3,1,7,2,4,1,1,3,2,6,1,1,1,22,6,3,1,2,1,1,1,5,1,1,1,2,1,58,1,5,3,1,1,44,3,4,10,2,3,2,1,2,1,2,2,2,1,3,2,1,1,3,3,1,1,4,4,1,5,1,9,2,2,3,2,1,1,1,6,1,1,3,1,1,4,1,11,2,8,1,10,1,1,1,5,6,14,1,5,1,1379,2,2,3,1,2,1,3,1,2,1,7,1,3,1,2,2,4,3,1,3,9,1,6,2,7,1,1,5,1,4,1,1,1,2,1,1,2,1,1,11,2,13,5,1,2,1,3,2,1,4,3,1,1,1,4,5,5,1,2,4,1,7,2,2,2,5,3,1,2,5,3,4,3,1,4,3,2,1,4,1,8,1,5,1,1,1,3,1,1,2,72,1,11,4,39,4,1,9,3,2,1,1,2,2,1,2,1,4,4,19,1,1,2,3,1,9,1,4,1,3,1,23,2,3,2,3,2,5,2,11,2,5,3,1,3,4,3,6,1,5,2,5,2,1369,1,1,1,1,5,1,2,1,2,1,4,2,5,2,4,1,11,2,11,1,1,1,1,1,1,1,6,2,4,1,1,1,1,3,2,5,1,3,1,1,1,2,1,4,1,1,2,8,1,2,3,1,2,1,1,1,1,1,1,2,2,3,4,1,1,2,7,2,1,1,6,5,1,1,3,2,2,3,1,1,1,6,2,10,1,1,5,1,3,5,4,2,15,1,4,2,9,1,37,2,35,6,38,15,3,1,1,2,2,3,1,5,3,4,2,1,1,10,1,1,1,1,3,2,1,7,1,1,1,3,1,5,1,3,4,3,1,1,3,4,1,1,4,15,1,12,1,8,1,2,1,1,1,1,1,1,2,2,3,3,1,1,1,1,1,3,5,1370,4,1,1,1,2,2,3,1,5,1,12,3,3,1,2,4,11,2,4,1,5,1,2,1,4,5,2,2,2,2,1,6,1,2,2,4,4,2,2,5,5,3,4,3,1,3,5,1,16,1,1,1,1,2,1,1,1,1,2,1,1,2,2,1,1,2,1,9,1,1,1,5,1,1,4,3,1,6,3,4,18,1,2,1,46,2,35,5,1,1,36,1,1,1,1,14,2,1,4,4,3,2,1,9,4,8,7,10,2,2,3,1,1,13,1,2,2,5,3,1,2,1,1,6,5,4,1,8,9,1,2,6,2,2,1,2,1,1,6,3,2,2,1,4,1,1368,12,2,4,1,1,1,3,2,4,1,1,1,4,6,2,2,4,1,16,1,1,1,1,1,2,1,3,3,2,1,2,1,1,6,3,5,2,3,3,7,3,1,1,4,5,1,1,1,2,2,5,1,13,2,6,3,2,2,2,1,2,4,1,6,3,8,5,1,1,1,1,3,1,2,4,2,18,4,84,6,41,9,1,4,5,1,1,5,1,12,1,1,1,12,1,1,1,2,1,4,1,4,1,1,1,2,1,2,2,2,1,12,1,3,1,3,2,9,4,2,1,2,3,5,4,6,2,20,10,1,1,2,2,1367,2,1,7,1,3,1,4,1,2,2,1,1,4,1,1,2,3,1,4,2,3,1,4,1,1,1,6,1,7,1,1,2,1,2,1,1,1,5,1,1,2,1,2,1,1,1,1,1,1,4,2,1,1,1,2,1,3,10,2,4,6,2,1,1,1,1,8,1,9,1,3,1,6,3,2,1,2,1,3,7,1,2,3,6,14,3,5,2,15,3,1,4,14,3,65,3,7,1,13,1,22,8,2,1,1,2,2,1,6,2,4,3,1,5,2,1,4,5,1,4,5,1,1,1,2,2,4,1,1,3,1,5,1,2,3,2,1,3,3,1,1,1,1,1,2,2,1,7,8,2,2,4,1,1,3,4,3,17,1,1,7,1,3,2,1,1372,14,2,2,1,5,1,4,2,3,2,2,2,9,2,2,1,12,5,2,2,2,6,4,1,1,1,1,1,3,3,1,3,1,3,1,1,1,1,1,8,2,6,4,5,13,1,6,3,1,1,6,1,4,1,3,1,1,5,2,1,2,5,2,1,8,1,3,2,16,2,1,1,6,2,4,2,12,1,2,1,29,3,29,1,29,1,22,8,1,2,2,1,3,5,1,3,3,1,3,4,1,1,6,2,1,2,1,3,6,2,4,1,1,3,3,2,1,14,1,1,2,2,2,1,3,4,4,2,1,1,3,1,2,2,1,1,1,4,4,3,1,22,3,7,6,8,9,1353,1,1,5,1,4,2,2,1,7,1,8,1,1,2,2,1,1,1,3,1,1,1,2,2,2,1,1,2,6,2,1,5,2,3,1,2,2,1,3,6,3,1,1,5,4,1,2,1,1,8,4,12,2,1,13,1,4,3,7,1,9,8,6,1,2,1,5,2,8,2,1,1,11,1,1,2,11,1,1,3,1,1,3,1,12,1,27,3,29,1,32,1,3,1,14,13,6,5,1,1,4,1,3,1,1,1,6,5,1,2,1,1,1,2,7,1,4,2,5,14,1,7,7,5,6,4,1,4,1,1,2,2,1,1,1,2,1,2,1,23,1,11,1,1,1,1,2,8,2,2,3,1352,7,2,1,1,2,3,3,3,7,2,1,4,1,1,12,1,2,1,11,7,1,1,1,4,5,2,3,1,2,1,1,3,1,4,3,1,5,3,1,4,4,6,3,1,1,1,29,5,1,2,2,1,3,3,1,1,1,1,11,1,1,3,7,2,6,3,3,1,2,5,7,2,3,3,16,1,37,1,42,1,8,1,2,1,2,1,1,2,15,8,11,4,2,2,3,2,1,2,1,1,1,1,3,9,1,2,7,1,1,1,2,3,2,7,2,2,2,2,2,1,1,2,1,2,7,5,1,1,6,2,2,15,1,1,1,23,1,1,1,6,2,4,3,1,1,4,1,3,2,2,3,1349,10,1,3,3,4,1,3,1,2,1,2,2,1,1,14,8,11,11,1,4,2,1,4,2,1,1,1,1,4,2,6,2,1,1,3,1,4,9,1,1,1,1,1,1,10,1,2,1,12,1,3,1,2,3,2,2,3,2,1,1,1,3,4,1,1,3,1,1,2,3,5,2,5,2,1,1,4,2,1,3,3,2,4,1,4,1,15,1,82,1,1,3,2,2,4,1,2,1,3,1,1,1,11,9,10,1,1,8,2,3,3,2,6,10,1,1,1,1,6,2,1,2,2,2,1,2,2,3,2,3,1,4,3,2,8,1,2,1,1,1,5,11,2,8,1,30,1,2,1,5,2,1,3,2,2,4,1,4,1,1,1,1346,3,1,6,1,1,1,1,1,1,1,14,1,3,1,2,1,5,2,1,1,2,1,2,5,3,1,6,5,1,5,1,3,9,1,1,3,4,1,5,1,4,3,1,2,2,1,3,7,2,4,13,1,11,2,3,1,2,2,2,2,1,5,1,4,3,1,4,1,4,1,7,2,2,1,1,2,11,4,3,1,3,1,2,2,16,1,72,6,7,1,3,2,1,1,2,3,1,1,1,2,13,3,1,1,3,2,4,2,3,1,2,3,1,4,1,4,3,1,7,1,1,9,2,4,4,1,3,2,2,1,3,5,1,3,1,2,18,1,6,3,3,1,6,1,1,2,1,1,3,21,1,2,1,5,1,5,2,2,1,2,2,7,1,5,4,1345,33,1,6,2,2,1,2,1,1,2,5,1,2,1,1,2,6,4,3,3,1,1,2,2,22,1,2,1,1,5,2,13,1,1,2,1,3,1,6,3,18,4,1,5,1,3,1,1,2,6,1,6,3,1,4,1,7,1,13,1,8,1,3,1,20,2,67,5,8,1,1,1,2,1,2,1,2,3,2,1,14,1,10,7,2,8,1,5,4,1,7,1,3,4,1,8,2,1,1,1,1,1,2,1,1,5,1,3,2,3,1,2,2,1,23,1,3,3,3,4,1,2,3,4,1,18,1,12,3,1,1,8,1,3,1,8,2,1347,1,2,14,1,4,1,6,2,11,1,1,2,2,1,7,2,1,1,1,2,3,4,6,2,2,2,1,1,9,1,2,2,10,5,2,14,2,1,1,1,7,1,3,2,4,1,8,2,3,3,3,3,1,6,2,3,1,3,1,5,10,3,9,1,13,1,3,2,17,1,3,6,64,6,9,4,2,3,1,2,1,2,2,1,10,2,5,3,1,4,1,3,1,2,1,3,2,1,2,5,2,1,2,1,2,1,1,1,2,3,2,1,2,1,1,2,1,2,5,1,1,1,1,2,1,1,1,2,2,10,1,3,28,1,3,2,6,6,1,32,3,2,2,18,3,1345,8,1,2,1,4,1,10,2,15,1,1,1,10,3,5,3,4,2,2,1,1,1,1,3,11,1,3,2,8,1,1,1,1,1,2,8,1,3,3,1,4,2,1,2,4,5,18,3,1,7,1,4,1,2,5,3,2,1,9,2,10,2,3,1,8,1,1,1,3,3,24,2,62,7,8,5,1,4,2,2,1,3,10,1,6,1,1,1,2,4,1,8,3,3,1,4,3,1,1,5,4,4,1,1,2,3,1,1,2,1,5,1,3,2,1,16,1,2,30,5,4,6,2,23,2,10,1,21,4,1342,1,4,6,1,5,1,8,1,2,1,1,1,15,1,2,1,7,2,3,1,4,2,2,4,3,1,2,2,13,1,2,4,1,1,6,5,2,1,2,6,1,1,2,5,5,1,4,1,10,1,4,3,5,1,1,7,1,7,2,1,3,4,13,2,6,3,14,1,39,2,47,2,4,8,6,5,3,4,1,3,3,1,15,3,1,9,1,5,5,1,1,1,1,2,4,5,4,2,1,1,1,1,3,1,3,3,5,1,2,1,1,19,3,2,24,1,1,1,4,2,1,2,1,14,1,9,1,17,1,2,1,4,1,11,1,1,6,1341,1,4,3,1,7,2,9,2,4,3,11,1,13,3,6,1,1,1,8,1,1,2,10,1,3,5,6,2,3,1,3,9,1,3,1,6,23,1,8,1,1,1,2,4,1,3,2,1,3,1,2,4,1,2,10,2,1,1,26,1,2,1,4,1,27,3,51,6,1,2,4,4,1,1,5,2,3,1,21,3,1,4,1,1,1,8,2,2,2,1,1,2,1,1,1,5,1,2,5,1,2,1,1,2,1,1,2,1,6,1,2,3,2,6,2,7,1,3,1,4,12,2,3,4,7,1,2,1,2,13,2,9,1,7,2,5,1,3,3,5,1,9,1,5,3,1342,1,2,15,2,9,3,2,1,19,2,3,1,2,1,17,1,13,1,1,2,1,2,1,1,9,1,2,5,2,3,2,3,1,2,1,5,17,1,18,6,5,2,3,2,1,5,10,1,1,3,21,1,3,1,2,1,33,1,4,1,47,1,4,4,4,4,1,1,2,1,1,2,1,1,1,2,2,2,3,1,5,1,1,2,3,1,1,8,1,5,2,2,2,2,2,2,2,1,2,4,1,5,1,1,2,2,1,10,3,1,9,9,1,7,1,2,4,1,3,2,2,2,1,3,2,1,2,2,11,16,1,13,1,2,2,4,3,1,2,6,1,1,2,1,1,3,2,1,1,4,3,1341,8,1,24,1,16,1,3,3,1,3,12,1,3,1,2,1,1,1,8,1,9,1,2,1,2,1,1,2,2,1,2,2,1,2,1,3,2,3,2,3,1,2,2,2,14,1,2,1,17,6,3,5,1,1,1,1,2,1,1,2,6,1,2,1,5,1,1,1,2,1,18,1,1,2,7,1,11,1,12,1,5,1,47,2,5,2,4,11,2,2,3,2,2,1,1,2,1,1,1,1,2,1,6,2,4,1,3,3,3,2,1,2,7,1,3,3,1,3,3,5,1,3,2,5,4,1,7,4,2,7,1,8,1,1,1,2,2,4,1,1,1,4,3,4,1,1,7,4,2,4,2,8,1,8,2,1,2,4,4,3,1,8,1,4,1,3,1,6,4,1340,6,1,6,1,19,2,17,3,1,1,1,1,16,1,14,2,8,1,1,2,4,3,1,1,3,1,2,4,2,3,4,3,3,1,1,1,12,3,1,2,20,3,1,14,2,2,4,1,15,1,17,2,23,1,4,1,4,2,12,1,49,1,4,7,1,2,1,1,4,1,1,2,3,4,1,1,2,1,1,2,3,2,1,2,4,2,1,1,1,3,1,2,9,1,1,7,2,7,1,3,2,4,1,2,9,5,2,7,1,3,1,10,2,7,1,2,2,3,3,1,6,1,2,27,4,5,2,1,2,1,2,3,1,1,2,1,1,1,5,10,4,1338,13,1,4,2,3,1,1,1,5,1,2,2,17,5,1,1,2,2,7,1,4,2,6,1,8,5,5,1,3,4,1,2,3,1,1,5,1,4,2,4,4,1,12,5,1,2,16,1,1,5,1,9,1,4,7,1,4,2,5,1,1,2,2,2,42,1,5,1,15,1,41,1,12,3,1,2,3,3,5,4,2,6,1,2,1,8,3,4,1,5,3,1,2,1,6,5,1,17,1,4,1,2,1,1,1,1,4,8,4,2,1,11,2,2,1,7,4,3,1,3,9,32,1,1,1,1,10,1,1,1,1,1,2,1,1,2,1,1,1,6,2,3,1,2,1,1340,7,1,4,1,7,1,1,1,5,1,1,1,17,2,2,1,1,2,2,2,11,1,5,1,4,1,7,1,1,4,4,1,6,1,5,1,1,3,1,1,2,13,3,2,9,10,15,11,1,6,1,3,7,1,3,3,4,1,3,3,1,1,16,1,22,1,4,1,65,1,5,1,2,5,4,1,6,13,5,1,1,2,1,2,6,4,3,7,5,2,2,1,2,11,2,2,2,2,1,4,2,3,2,5,1,20,2,2,1,4,2,5,2,8,2,2,5,33,1,2,10,1,5,2,2,3,1,5,1,6,1,1339,11,1,2,2,3,4,3,1,1,3,13,1,2,1,2,2,5,1,1,2,7,1,6,1,3,1,2,1,1,1,1,1,6,7,5,2,1,2,5,2,6,3,2,2,3,1,4,1,17,3,4,1,1,2,1,2,13,3,1,1,1,1,1,1,3,1,1,1,2,2,3,1,2,1,3,3,4,3,1,1,26,2,15,3,62,1,13,1,1,9,4,4,1,5,5,1,1,1,1,1,3,1,1,7,5,6,1,1,3,1,1,1,2,15,2,4,3,1,3,4,2,1,2,1,1,5,1,8,1,7,3,5,2,13,1,5,4,2,3,11,1,14,1,1,3,1,8,1,1,1,6,3,3,1,3,1,1,1349,1,1,6,2,3,3,5,1,2,1,15,1,3,1,1,2,1,1,7,2,1,2,2,1,13,3,2,6,2,11,3,3,9,2,1,1,1,1,1,1,1,3,1,4,1,1,1,1,1,1,13,1,1,2,2,10,9,1,3,1,1,3,2,3,2,3,7,1,5,1,1,4,1,2,1,2,10,1,4,1,1,1,8,2,1,1,5,1,4,2,1,2,58,2,3,1,2,1,1,1,3,1,3,6,1,5,1,1,1,15,12,3,1,2,5,4,3,2,3,5,1,13,1,5,1,4,1,1,3,2,5,5,1,4,1,4,1,9,2,6,1,5,1,6,2,4,1,4,1,1,1,2,1,1,1,15,1,3,3,2,12,2,6,4,2,7,1,1,1,1344,1,2,2,1,3,1,2,1,5,1,3,1,1,1,5,1,10,2,1,2,1,1,3,1,1,2,4,3,1,3,7,1,7,10,3,1,2,3,1,5,3,1,3,2,3,1,1,9,5,2,1,1,23,4,1,7,8,2,4,4,1,1,3,1,6,1,2,1,3,2,4,3,2,1,1,2,9,1,11,1,10,1,8,3,3,1,3,1,7,1,1,1,1,1,2,3,8,1,22,2,11,1,1,1,4,23,1,4,1,1,1,1,11,1,2,3,5,3,1,3,5,25,1,2,1,1,7,2,1,8,1,3,2,1,1,4,1,10,1,8,1,9,1,1,1,5,1,4,4,22,2,2,8,1,3,1,3,1,2,7,1,4,2,3,2,1340,1,1,7,1,9,1,1,1,17,4,4,1,2,1,1,1,2,1,2,2,1,2,10,1,6,6,3,1,6,1,1,2,2,1,1,2,4,1,1,1,3,4,3,1,2,4,4,2,23,3,3,8,5,1,1,3,7,1,1,1,1,3,1,3,2,1,2,1,2,1,1,1,1,1,2,4,1,2,1,1,7,1,7,1,12,2,1,1,2,3,1,1,1,1,1,1,5,2,9,1,3,1,2,1,1,5,2,3,29,1,1,1,1,1,7,10,2,13,1,1,2,1,2,1,6,1,3,1,1,2,1,2,2,1,2,5,4,1,2,4,1,11,2,6,8,1,3,2,1,7,2,9,2,38,1,6,1,1,2,5,1,12,1,5,3,1,8,2,1,2,3,10,1,1,1,4,1,3,1,1336,3,1,1,2,2,1,2,2,6,5,9,1,4,3,4,1,5,2,3,4,2,2,1,1,13,4,2,2,5,1,4,1,4,1,7,3,1,1,1,1,6,2,1,1,1,3,1,3,21,1,1,2,3,9,5,1,3,1,8,1,1,1,2,2,1,2,8,3,4,2,2,1,1,4,6,3,8,1,1,2,7,1,5,2,1,1,2,3,5,1,16,1,1,1,2,2,1,2,4,2,19,2,1,7,1,1,8,2,3,4,1,15,5,1,5,2,3,2,3,6,1,2,1,3,7,13,1,7,1,2,2,1,3,2,2,3,1,2,1,54,1,16,1,14,3,1,1,2,1,1,6,1,1,16,1,3,1,7,1,1335,1,1,5,3,1,2,3,1,1,2,4,1,15,3,1,2,1,1,2,1,3,3,1,2,1,2,2,1,12,1,2,1,2,3,2,4,1,1,2,3,2,1,1,1,1,1,1,1,1,1,4,2,5,1,4,9,26,2,4,2,3,1,3,1,11,1,3,1,2,1,3,2,10,3,3,6,12,2,6,3,1,1,5,1,2,1,4,1,2,2,1,1,16,1,7,3,2,1,1,5,14,1,6,1,1,1,1,5,2,1,9,2,1,3,2,1,2,6,2,3,1,1,1,1,2,2,2,1,4,1,1,4,3,1,1,6,2,3,1,1,3,7,1,5,23,7,1,2,3,1,2,2,1,2,1,10,2,5,3,1,2,12,1,2,1,4,1,5,1,13,1,7,5,1,1,1,7,19,1,10,2,1334,1,2,3,2,2,1,3,1,2,2,5,2,16,1,4,3,2,2,1,10,1,1,8,2,5,7,3,1,1,1,4,1,4,1,4,1,1,1,11,1,1,9,1,3,22,1,17,1,10,1,2,1,1,1,13,3,5,2,4,2,13,1,8,1,11,2,2,1,4,1,6,1,11,2,1,1,4,9,4,1,12,1,4,1,3,1,2,1,2,2,1,1,11,1,4,1,1,7,1,3,1,2,2,3,4,1,4,6,1,3,2,6,1,4,1,2,1,1,1,1,1,1,1,2,1,3,4,1,2,1,4,1,10,6,2,3,6,1,4,5,1,2,2,4,1,1,1,2,3,5,2,1,1,30,3,7,4,1,2,4,12,17,1,1,5,1334,2,1,3,2,3,4,2,2,13,1,1,1,12,2,3,3,2,1,1,7,3,3,3,2,1,1,1,1,3,3,2,1,10,4,3,6,3,1,1,2,1,4,1,9,1,1,31,1,17,1,7,1,1,2,1,1,8,6,4,5,4,1,26,1,1,1,5,1,21,2,4,2,1,1,1,1,1,4,1,1,5,1,7,1,3,2,1,1,2,1,1,1,2,1,4,3,11,3,1,1,1,6,1,7,2,1,1,2,1,2,5,2,1,4,1,3,1,7,2,5,2,4,1,2,3,3,9,1,3,1,1,1,10,3,2,1,4,1,6,6,1,1,4,10,1,2,1,3,3,9,1,1,1,2,1,7,2,6,3,7,4,1,2,3,2,2,7,1,1,9,1,9,4,1335,8,1,3,1,5,4,18,1,6,4,2,2,1,10,1,2,1,1,1,1,3,1,2,3,1,4,1,1,13,1,5,2,11,1,4,4,1,1,3,3,26,1,21,1,4,2,1,1,3,1,4,1,9,1,4,2,4,1,1,1,30,1,3,2,9,1,10,1,1,1,8,2,1,3,16,1,1,1,13,1,2,1,16,1,1,2,1,15,2,3,1,2,1,1,3,10,1,5,1,2,1,6,1,1,4,2,3,3,5,2,5,1,3,1,10,2,15,3,1,1,2,1,2,3,2,3,1,19,1,4,1,5,1,3,1,3,1,2,2,8,3,7,1,4,5,1,1,9,1,5,1,4,7,1333,4,1,2,1,5,2,30,1,1,3,9,2,2,6,1,1,1,2,1,2,2,1,2,1,5,1,16,1,2,1,8,4,1,1,2,13,47,2,4,1,6,1,1,1,2,1,2,2,4,2,1,4,3,1,16,1,13,1,2,7,11,1,9,1,1,2,9,2,20,1,8,2,1,5,1,1,5,1,5,2,2,1,1,7,2,2,4,1,1,1,3,1,2,2,1,1,5,2,1,5,1,6,2,1,1,2,3,7,3,1,10,1,23,2,8,2,2,5,2,2,1,2,1,1,2,2,1,5,2,14,2,5,3,6,1,1,4,1,7,6,1,5,1,1,5,15,3,4,3,1,3,1332,3,1,5,1,3,1,3,1,12,1,6,1,6,1,2,2,2,1,4,5,1,1,1,4,2,2,7,2,3,1,1,1,1,2,1,1,4,2,6,2,11,2,1,1,4,1,1,3,1,9,50,1,3,4,1,3,5,1,5,1,5,4,16,1,14,2,4,1,1,4,3,1,24,1,1,1,6,1,5,1,12,1,5,3,1,2,5,1,2,1,9,1,2,5,3,2,2,2,1,1,3,2,1,4,2,3,2,9,1,1,2,1,2,3,2,7,1,5,11,3,8,1,5,1,8,1,7,7,3,2,3,8,2,2,1,1,1,20,2,1,3,4,5,1,8,5,2,5,1,2,10,5,1,3,2,4,8,1335,6,2,2,1,1,2,2,1,1,1,11,1,5,1,3,3,9,10,2,3,6,5,2,2,3,1,2,1,3,1,3,1,7,2,7,3,6,13,51,2,2,1,2,4,2,1,3,1,3,1,6,2,2,1,1,1,20,1,4,1,7,3,5,1,26,1,3,2,1,1,2,2,6,2,5,5,11,2,3,3,1,1,10,1,1,1,1,3,7,3,2,1,3,1,1,4,1,2,3,2,1,1,1,2,3,1,3,1,2,3,2,2,1,2,1,5,2,1,25,1,7,1,10,2,2,4,1,1,1,1,3,3,4,1,1,2,1,5,1,8,1,10,2,2,13,4,2,5,1,2,1,4,6,1,5,7,5,1,6,1335,4,1,7,3,5,1,1,1,10,1,3,1,12,1,3,5,1,3,4,3,5,5,7,3,8,2,1,1,7,1,1,1,1,1,3,1,5,1,1,2,1,1,4,4,32,1,4,2,2,1,10,1,2,3,1,4,4,1,3,1,5,4,2,2,1,2,38,1,46,2,4,1,2,2,5,2,1,3,1,7,12,1,3,4,2,1,3,3,2,3,2,2,1,1,1,2,3,2,1,2,2,1,1,4,1,5,2,8,7,1,5,2,3,2,1,2,1,1,24,1,2,2,2,4,1,1,2,1,2,3,5,1,1,1,3,2,2,4,2,2,2,2,1,10,2,1,5,1,4,5,2,10,4,1,1,1,1,1,1,1,1,10,10,1,3,1332,4,1,4,2,1,1,1,1,2,1,1,1,14,2,11,1,6,5,2,4,2,7,2,2,2,4,2,2,9,3,1,1,5,2,5,1,2,1,3,1,2,2,8,1,1,1,32,1,4,4,12,2,2,1,1,6,13,2,4,2,1,3,17,2,2,1,7,1,3,1,1,2,5,1,16,1,10,3,10,1,8,2,8,12,8,2,3,3,2,1,1,1,1,1,2,1,4,1,1,1,1,2,2,5,1,1,1,1,2,1,2,1,1,3,2,2,1,3,1,4,16,1,1,1,4,1,2,2,2,1,17,1,2,1,1,3,1,2,2,2,1,1,9,1,3,5,2,8,3,18,5,10,4,7,1,1,1,2,1,4,5,2,1,5,2,1,6,5,1,1331,2,1,6,3,1,4,1,4,1,1,7,1,2,2,10,4,2,1,2,4,3,6,1,11,1,4,1,2,2,1,9,2,8,1,4,5,1,1,1,1,1,1,3,2,4,2,2,1,31,1,3,4,1,1,10,8,21,1,5,1,1,1,18,1,1,1,3,1,2,2,3,5,12,1,3,1,1,1,2,1,1,1,7,1,1,2,9,1,8,4,2,1,2,1,1,2,1,2,2,4,1,1,6,2,3,1,1,3,1,1,2,2,2,2,5,1,3,1,1,3,2,8,3,3,2,3,1,4,2,1,5,1,8,4,1,2,7,1,18,1,6,2,3,1,1,2,1,1,6,2,8,2,2,3,1,1,2,5,2,9,1,6,3,7,1,5,2,5,1,1,1,1,1,1,1,7,1,5,1,6,7,1337,7,3,2,3,3,1,2,1,1,1,9,1,12,4,1,2,2,3,5,1,2,6,2,5,2,1,29,1,3,1,1,1,4,2,1,3,5,2,2,4,34,4,13,1,1,1,2,5,14,2,5,1,1,3,1,1,13,1,14,1,1,3,14,2,6,1,2,2,8,6,2,1,4,2,2,1,3,1,2,1,7,2,3,3,1,3,4,1,1,1,4,1,1,3,1,4,8,4,3,15,1,5,3,7,2,1,2,2,1,4,2,1,6,3,6,3,24,1,4,1,4,1,5,1,8,1,1,1,4,2,2,8,1,8,1,6,4,20,1,4,2,3,2,14,6,1,1,2,1,1336,6,2,1,2,1,1,5,1,2,1,9,1,12,3,6,2,2,2,9,2,4,1,2,2,1,1,1,1,2,1,1,1,12,1,2,1,5,5,1,1,1,3,1,2,2,1,2,3,1,1,2,3,51,2,2,1,1,1,1,3,20,1,1,1,5,1,7,1,22,2,13,2,6,1,15,1,1,2,8,3,2,1,7,1,1,1,1,4,1,3,1,4,4,2,6,2,5,1,1,1,1,2,2,1,2,1,1,2,2,2,2,4,3,2,3,1,6,2,2,2,1,1,2,1,1,1,2,6,1,2,14,3,24,2,6,2,14,5,5,8,2,1,1,15,2,21,2,1,2,5,1,3,3,9,6,2,8,1329,1,1,5,1,4,1,2,3,1,2,2,2,2,1,5,1,12,3,9,1,1,2,19,1,4,1,11,1,11,3,1,1,1,2,1,3,5,1,3,1,1,4,1,1,41,1,16,5,19,1,1,1,5,1,8,1,4,1,9,2,6,1,13,3,8,1,8,1,2,1,5,1,5,1,1,3,1,2,4,3,1,2,1,5,1,1,1,5,11,1,6,1,2,2,1,1,2,2,3,2,1,2,1,1,2,1,3,2,5,1,5,2,1,1,4,2,2,4,1,4,1,1,8,1,1,1,5,2,30,6,16,1,5,11,3,2,1,2,1,16,2,3,2,8,2,6,1,2,2,3,2,16,8,1330,5,1,2,1,1,2,1,1,1,5,2,1,1,1,12,1,11,1,8,1,9,1,14,1,8,1,8,1,6,1,1,2,4,3,1,3,4,1,3,2,1,1,1,1,1,2,35,6,12,1,4,3,9,1,9,1,1,1,2,1,5,1,6,1,3,2,16,1,12,3,15,2,8,1,8,3,1,2,1,1,1,2,3,1,3,7,1,4,7,1,2,2,7,1,1,1,1,3,1,1,2,1,2,8,2,1,3,2,5,1,7,1,5,6,1,2,1,1,1,4,4,2,3,2,4,2,29,1,1,3,22,2,2,4,2,2,3,2,1,2,1,19,2,5,1,9,1,2,1,1,2,2,4,1,1,9,2,2,9,1332,13,1,1,1,1,2,8,1,17,1,1,2,3,1,23,1,8,4,11,2,7,1,3,1,7,7,8,3,3,2,34,1,11,1,1,2,3,2,27,1,9,1,2,2,28,1,28,2,9,4,1,1,1,3,1,1,1,2,2,3,2,5,2,1,5,1,4,1,3,1,2,1,3,1,1,1,8,3,1,5,5,2,18,2,2,1,4,1,1,4,1,1,5,2,8,1,25,1,1,1,4,1,1,2,21,1,4,2,1,1,6,1,2,3,1,10,1,7,1,6,1,7,1,1,1,2,1,1,2,1,1,1,1,1,4,8,1,2,1,1,7,1330,1,1,5,2,2,2,4,1,12,1,15,1,1,1,1,1,3,1,7,1,16,1,1,1,3,1,3,1,15,1,5,2,1,2,5,1,4,1,1,3,2,2,1,2,1,2,1,1,1,3,9,1,28,1,1,1,1,3,6,2,1,1,26,2,9,1,4,1,6,1,19,2,1,1,14,2,5,1,13,2,1,2,1,2,1,3,1,2,1,1,4,2,1,4,1,3,4,1,1,1,1,3,5,3,5,1,1,1,6,2,2,3,1,1,4,2,4,1,8,1,5,1,5,1,3,7,3,4,8,1,30,2,1,2,22,1,5,1,1,1,4,4,9,2,2,1,1,4,1,23,1,1,2,2,1,3,2,2,1,6,2,3,4,1334,6,2,2,1,6,1,2,1,21,1,4,2,4,1,29,1,5,1,7,1,6,2,4,2,1,1,3,1,2,1,3,8,2,10,1,1,26,1,11,2,5,1,3,5,5,1,20,2,4,1,38,1,25,2,10,1,2,1,3,1,1,5,3,1,1,3,1,1,2,2,1,2,3,2,1,2,1,4,1,3,3,1,6,1,1,1,1,1,4,4,2,1,17,1,9,2,2,1,1,5,1,2,4,1,1,2,1,1,1,1,2,2,16,1,6,1,2,1,1,1,1,6,4,1,2,3,11,2,3,2,3,1,1,2,2,1,3,6,2,4,1,1,4,5,2,19,1,1357,10,2,7,1,8,1,1,4,3,1,5,2,2,2,1,3,26,1,6,1,4,1,11,1,1,1,2,1,12,1,2,2,1,1,1,2,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,22,1,2,1,1,1,1,2,1,1,6,4,2,2,4,1,28,1,22,1,10,1,15,2,37,1,3,2,1,2,2,1,2,1,2,1,1,1,1,4,2,1,1,1,2,4,2,2,2,1,2,3,1,1,6,1,1,7,1,1,9,1,9,1,2,1,3,1,1,1,4,6,1,1,1,1,1,1,2,2,4,1,20,1,8,4,1,5,1,1,20,7,1,3,1,6,2,1,1,11,6,5,1,1,2,9,1,3,1,12,1,1,2,1344,12,1,2,1,1,1,1,1,9,5,1,1,1,1,6,1,1,1,2,1,13,1,16,1,7,1,4,2,2,1,3,1,1,1,7,1,1,1,1,1,7,1,1,1,1,6,1,1,2,2,2,3,1,4,6,2,29,4,1,1,1,1,1,4,32,1,2,1,15,1,17,1,22,1,10,1,11,4,1,2,2,2,2,1,1,1,1,1,1,1,2,1,1,5,1,2,4,2,1,1,1,1,1,1,3,1,2,3,6,2,1,3,2,4,3,1,2,1,10,6,2,3,2,8,1,2,4,3,23,1,1,1,2,1,5,2,3,5,5,1,16,1,1,9,2,5,2,4,1,1,1,6,4,5,6,9,1,7,1,1,1,9,1,1344,2,1,6,1,1,1,1,1,15,1,1,2,5,1,6,1,10,1,35,1,1,1,9,2,2,1,4,1,6,1,1,1,1,1,1,7,1,1,1,2,3,6,1,1,7,1,14,1,12,5,7,1,13,1,19,1,35,1,23,1,13,1,7,1,1,1,2,2,7,2,4,5,3,2,3,2,1,1,2,1,1,1,3,1,2,1,2,1,1,1,2,1,5,2,5,1,1,1,2,3,1,1,11,5,3,4,1,15,1,1,3,3,5,1,10,1,2,2,1,1,3,1,3,2,1,1,1,2,1,1,1,1,5,1,14,2,1,6,1,9,1,1,1,4,1,1,2,10,7,3,2,6,1,19,1,1343,1,2,26,3,13,1,1,1,12,1,1,1,22,2,2,1,13,1,9,1,3,2,5,10,2,3,3,2,1,1,10,2,14,1,9,7,7,1,12,1,20,1,1,1,1,2,30,1,38,1,8,2,1,2,3,2,2,3,3,5,2,3,5,2,2,1,3,1,1,2,2,1,1,1,6,1,1,4,5,1,4,2,14,2,1,27,1,1,1,2,1,1,4,1,10,1,1,2,6,2,1,1,1,3,1,2,1,3,11,1,8,2,1,4,1,2,1,7,4,2,7,7,1,1,6,10,1,3,1,1,1,9,1,15,2,1333,1,2,1,1,2,1,1,1,18,3,5,1,6,1,1,2,6,1,7,1,14,1,15,1,1,1,5,1,2,1,8,2,2,4,3,1,3,1,2,3,1,3,5,1,4,1,6,1,12,2,2,1,10,3,1,3,10,2,9,3,18,3,1,1,1,1,26,1,20,1,1,1,21,1,5,3,7,1,7,3,1,4,6,5,2,2,1,2,1,3,4,3,1,1,1,3,2,2,5,1,15,1,2,5,1,23,20,1,2,1,3,1,7,3,1,1,2,2,1,2,7,1,10,2,4,1,1,4,1,3,2,6,6,1,2,1,1,3,1,2,6,10,2,1,1,1,1,5,1,4,1,1350,3,1,4,2,18,1,15,1,17,1,26,1,12,1,5,4,4,1,1,1,3,1,2,2,5,1,5,1,1,2,2,2,1,1,6,2,10,2,7,2,4,6,5,1,4,1,11,1,1,1,2,1,12,1,2,2,1,2,28,1,26,1,8,1,10,1,1,2,9,2,1,1,9,4,3,12,2,3,1,1,4,1,1,2,1,2,3,4,5,1,1,2,8,1,3,3,2,1,2,14,5,2,25,1,1,3,11,2,1,3,17,1,2,2,1,8,3,10,5,2,3,5,1,1,5,16,2,1,1,5,1,1,1,7,1,1,1,1339,4,3,9,1,2,3,7,1,1,1,13,3,15,1,21,1,15,2,6,1,1,1,1,1,12,1,1,1,1,1,2,1,10,2,1,1,7,1,12,2,1,1,2,1,1,3,2,2,1,2,10,1,1,1,2,2,8,1,16,1,2,1,2,1,2,1,3,1,21,2,10,1,28,1,1,1,6,1,1,1,8,1,1,2,6,3,2,2,3,9,1,2,1,3,1,1,1,1,3,1,4,6,10,2,4,1,2,1,1,1,3,3,2,4,1,1,1,3,1,1,1,4,1,1,1,1,2,1,24,1,1,2,2,1,11,4,5,1,1,1,8,1,2,2,2,2,1,1,1,4,1,1,1,1,1,8,3,2,1,1,3,7,6,15,2,4,3,9,1,1341,29,5,11,3,41,3,1,1,10,3,2,2,13,1,1,1,2,1,21,1,4,2,10,1,3,1,1,5,1,1,1,3,11,1,32,1,2,1,7,1,21,1,12,1,18,2,8,3,6,3,13,1,4,3,9,1,2,2,1,3,1,1,2,1,1,2,2,1,1,1,1,2,1,5,1,1,2,1,2,1,7,2,1,2,1,1,3,1,2,1,2,10,7,2,1,1,2,2,27,1,7,7,1,1,5,1,12,1,2,1,1,11,2,1,4,3,2,3,1,3,4,6,1,1,4,10,1,4,2,4,2,1351,1,3,1,1,7,1,9,2,2,1,1,1,1,2,1,1,2,1,11,1,2,2,29,1,7,1,4,1,7,1,7,4,2,1,3,1,2,1,1,1,2,1,2,2,5,1,14,2,9,2,1,1,3,7,3,1,1,1,11,1,21,2,12,1,2,2,4,2,19,1,31,2,13,1,2,1,1,2,2,4,11,5,8,7,1,1,1,3,3,2,3,1,1,3,3,2,1,1,3,1,7,3,1,3,5,1,3,9,1,6,1,4,1,1,1,1,1,2,34,4,10,2,19,8,1,2,5,2,2,3,1,4,3,7,6,9,2,3,2,1357,4,2,1,1,1,1,8,1,6,1,5,1,6,3,6,3,32,2,2,1,1,1,2,1,2,1,11,1,12,4,1,1,1,1,3,1,4,2,1,1,1,1,2,1,5,1,4,1,2,1,2,1,6,2,4,8,5,1,15,1,12,1,2,3,7,1,2,2,5,1,22,1,1,1,31,1,20,1,1,3,7,1,2,1,2,1,2,2,11,1,1,4,15,2,3,1,7,1,3,1,2,6,9,1,1,1,1,4,4,1,2,1,4,1,6,3,19,1,4,1,2,2,2,1,3,1,2,1,1,2,2,1,18,1,1,1,1,1,5,14,1,4,2,2,3,1,1,7,1,24,1,1351,1,2,1,7,17,1,4,1,3,3,7,4,15,1,8,1,10,1,2,3,2,1,20,1,8,4,1,1,1,1,9,1,13,2,16,8,2,1,2,1,28,2,5,1,5,4,2,2,3,1,2,1,4,2,8,1,16,1,20,1,23,1,1,2,4,1,8,3,12,1,1,1,2,2,9,1,7,1,4,1,9,1,3,3,8,3,1,1,2,1,1,8,8,1,1,1,5,1,25,1,10,4,3,1,20,1,2,5,2,1,1,7,2,2,1,4,1,1,1,11,2,15,1,5,2,1353,3,1,7,1,28,1,6,2,2,1,6,1,1,1,1,1,29,1,9,3,5,2,5,1,1,1,3,4,20,1,18,1,4,9,3,2,4,1,22,3,1,1,1,1,7,6,11,1,1,1,45,3,22,3,2,1,2,2,4,1,4,2,8,1,1,1,5,1,1,1,19,1,2,1,6,3,2,1,2,3,8,3,5,5,1,2,1,1,6,1,3,1,3,1,15,2,15,1,2,4,2,1,16,1,8,5,1,1,2,1,2,2,1,1,1,6,2,11,2,2,1,4,1,1369,2,1,11,1,3,1,12,1,9,1,6,1,6,1,4,1,4,1,22,1,4,1,10,2,2,5,1,1,10,2,1,2,1,1,2,1,15,2,1,1,4,1,6,1,7,4,2,3,4,1,4,3,23,2,9,3,1,1,2,1,2,2,16,1,5,1,19,2,3,1,3,1,1,3,19,1,1,5,1,2,1,2,1,2,6,2,7,8,1,2,2,2,9,1,3,1,3,1,8,1,5,1,3,1,9,5,1,8,2,1,1,2,27,2,6,1,8,7,4,4,12,4,5,4,2,1,1,1,5,1,1,1,1,6,1,7,1,3,1,2,1,3,3,9,1,6,1,1351,6,2,3,1,1,2,4,1,1,1,9,1,8,1,7,1,1,1,22,1,6,1,30,4,5,1,8,1,4,1,13,1,11,1,6,1,2,1,1,6,15,2,5,2,11,1,1,1,3,2,1,1,5,4,2,4,2,1,6,1,5,1,36,1,2,3,20,1,1,3,1,2,5,2,1,2,12,3,2,3,1,3,3,2,4,1,8,1,2,1,7,7,1,1,10,1,2,1,1,1,1,1,1,6,2,1,30,1,6,1,3,1,12,2,3,1,14,1,2,3,4,2,1,1,2,1,8,1,1,1,1,2,1,10,1,8,1,1,1,2,1,6,1,1362,9,3,1,1,2,1,7,1,14,1,1,1,4,4,1,1,11,1,13,1,4,1,2,1,2,2,1,1,1,1,10,1,19,3,1,1,21,1,5,1,4,1,2,1,3,2,1,4,3,1,12,1,3,1,18,1,4,2,5,1,4,1,1,1,5,1,48,2,20,1,4,2,1,1,3,1,3,1,2,1,3,2,1,2,5,4,1,2,3,3,3,1,11,1,1,4,2,1,3,10,2,1,10,1,2,2,1,9,18,1,11,1,8,2,35,4,4,7,1,1,6,12,2,2,1,3,2,1,2,12,1,1,1,1359,5,1,8,1,16,1,3,1,5,1,1,1,5,1,1,1,7,1,6,1,8,1,3,1,3,2,5,1,1,1,1,2,2,1,6,1,20,3,3,2,3,1,1,1,1,1,8,1,2,1,3,1,1,1,2,1,3,7,2,2,2,2,15,2,1,1,10,2,4,1,4,2,9,2,1,3,1,1,38,2,1,1,9,1,23,1,2,2,1,1,4,1,1,1,1,1,4,5,5,2,4,2,7,1,4,1,1,2,4,3,1,2,1,1,5,1,2,3,1,6,10,1,1,2,2,8,31,1,18,1,1,1,15,3,1,7,4,5,13,3,2,8,3,2,1,3,1,3,1,5,2,3,2,1357,4,4,2,1,8,1,17,2,3,3,12,1,4,1,13,1,9,1,5,1,1,1,11,1,13,1,6,1,1,1,4,1,6,1,18,1,6,6,3,7,14,2,9,1,5,1,7,2,2,2,2,1,3,5,1,1,1,1,20,1,13,1,16,1,1,1,18,1,2,1,8,1,5,1,2,7,3,2,1,1,5,2,16,2,1,6,2,1,1,3,2,6,19,7,33,1,28,1,6,3,1,6,2,3,2,3,13,4,4,7,1,6,1,3,2,8,4,1,2,1353,6,1,11,1,18,7,3,1,4,1,28,1,1,1,10,3,7,5,1,1,2,1,9,2,1,2,4,1,6,1,1,2,6,3,2,1,2,2,9,8,1,1,4,2,23,1,2,2,9,4,2,1,4,1,1,1,1,3,9,2,65,1,2,1,7,1,1,1,10,3,6,1,2,1,1,1,2,3,8,1,3,1,4,5,2,2,2,1,1,1,1,5,3,2,14,6,1,1,68,2,2,2,5,1,1,4,6,1,10,4,4,7,2,5,2,5,4,4,1,2,2,1354,1,1,4,1,5,1,26,1,1,3,2,2,16,1,17,1,8,1,3,2,1,1,11,1,1,1,2,1,5,2,2,3,2,1,1,2,3,1,2,1,4,2,1,7,1,3,10,7,7,1,8,1,17,2,2,2,11,1,1,2,1,2,2,5,3,1,17,1,37,1,37,4,9,2,1,1,21,1,1,2,3,1,3,2,2,4,15,1,1,3,3,5,23,1,44,4,1,15,13,9,13,3,2,2,1,5,1,2,1,2,1,1355,1,1,13,1,1,1,2,1,12,1,2,1,7,4,14,2,13,1,3,1,3,1,4,3,1,4,4,1,4,2,1,1,10,2,2,1,1,4,1,1,6,1,9,1,2,1,16,2,2,1,2,1,15,1,17,5,3,1,12,2,1,10,1,1,66,1,5,1,2,1,3,1,1,5,4,6,4,1,1,3,1,6,1,2,8,1,3,1,2,2,5,1,4,1,2,1,22,2,4,5,14,2,2,1,12,1,34,3,2,6,1,1,1,7,8,2,1,12,9,5,1,3,1,1,1,9,1,1356,3,1,4,1,5,1,1,1,1,2,5,1,3,1,2,1,6,2,2,2,2,1,13,1,4,2,16,1,4,3,1,3,13,2,3,1,5,1,4,1,6,1,2,3,2,1,7,1,1,2,1,1,8,1,5,7,2,1,33,3,5,2,1,3,1,3,4,1,2,3,1,1,3,1,13,1,2,1,50,1,2,2,7,1,2,1,3,1,2,1,1,5,6,1,1,2,3,1,1,1,2,1,4,1,4,1,4,3,5,3,4,3,3,1,15,1,1,2,3,5,15,3,3,1,33,1,10,4,4,1,3,3,4,2,8,1,3,6,2,5,8,1,1,9,1,1,1,4,1,2,1,1357,1,2,10,1,3,2,1,1,4,1,16,1,2,2,15,1,8,1,20,1,14,1,2,1,2,1,6,1,3,2,1,1,1,8,1,3,1,2,5,3,6,1,8,2,1,2,2,1,1,2,9,2,19,1,7,1,1,1,2,1,10,1,1,1,3,4,18,3,30,1,5,1,2,1,10,3,1,2,7,1,8,1,1,3,11,1,1,1,3,1,9,2,1,1,1,3,5,2,1,1,2,1,1,2,22,2,20,2,2,1,5,1,44,3,8,2,1,1,3,2,7,1,4,15,6,2,1,7,2,9,1,1356,2,1,1,2,17,1,16,1,17,1,13,2,2,1,3,1,3,1,1,1,1,4,1,1,1,4,12,1,2,1,5,2,3,1,8,1,1,1,3,2,3,1,2,2,2,1,2,1,1,2,1,1,6,2,2,2,3,3,29,2,5,1,3,1,1,2,1,1,3,1,7,1,1,5,15,1,2,1,15,1,1,2,19,1,12,2,1,2,4,1,4,1,1,1,1,1,19,1,8,2,5,4,4,2,1,1,2,1,8,1,13,1,5,1,3,2,18,2,2,1,39,2,4,1,4,1,4,2,3,4,6,1,8,12,2,1,4,3,4,9,2,1,1,1,1,2,1,2,2,1355,1,1,2,1,11,1,3,1,9,1,6,2,6,1,2,1,2,1,2,1,8,1,1,3,4,1,2,1,3,1,11,1,2,1,3,1,6,3,3,1,1,1,5,1,1,1,24,2,2,1,1,2,1,1,2,1,12,3,1,2,1,1,14,1,1,1,1,1,1,1,5,4,2,1,1,2,4,3,3,2,2,2,6,3,3,1,23,1,1,1,10,1,6,2,13,1,12,1,2,1,8,1,1,2,5,1,2,1,12,3,1,2,1,1,11,4,6,1,3,2,2,2,21,6,16,1,44,1,2,1,2,1,4,1,8,3,3,1,3,1,12,6,1,2,1,1,2,1,3,2,3,9,1,2,1,4,2,7,1,1350,1,1,4,1,1,1,9,1,3,1,1,1,5,1,3,1,2,2,5,1,3,1,13,1,9,1,4,2,1,1,5,2,1,1,1,1,4,2,3,1,9,1,5,1,12,1,2,3,5,3,7,1,2,2,1,1,6,1,4,1,2,1,2,2,17,2,3,1,5,1,1,1,2,1,2,1,5,2,8,1,3,2,1,1,1,1,1,1,1,1,1,1,4,1,10,1,7,1,5,2,1,2,45,1,2,3,1,1,4,1,2,2,11,1,4,1,7,1,2,1,3,2,4,1,4,1,1,1,2,5,19,3,1,2,19,3,68,1,15,4,1,2,1,5,2,1,2,9,1,9,1,4,2,1352,27,1,7,1,9,1,4,1,12,2,1,1,10,5,12,1,1,1,8,1,5,5,2,3,2,4,3,1,6,1,2,1,2,1,9,1,1,1,7,3,2,1,8,1,12,1,5,2,2,1,4,1,1,3,1,1,1,1,2,3,6,1,3,1,4,1,2,1,1,3,2,2,1,1,4,1,1,1,4,1,6,3,9,2,2,1,2,1,12,2,1,1,13,2,9,1,2,1,2,1,1,6,1,2,1,2,1,2,8,2,3,1,3,3,3,2,10,1,5,1,2,1,1,1,1,3,13,1,1,4,1,2,21,1,36,1,3,1,2,1,22,1,7,2,6,2,3,2,4,4,6,1,1,1,1,12,2,1356,7,1,4,2,1,1,5,1,16,1,5,1,5,1,11,1,2,1,7,1,17,1,12,1,1,1,2,1,1,2,2,1,1,1,1,1,3,1,1,2,11,1,12,3,4,1,4,1,3,2,1,1,6,1,4,1,12,5,4,2,3,2,2,2,1,2,2,1,1,2,1,1,2,2,5,2,1,3,4,3,6,1,3,1,2,1,17,5,13,1,1,2,11,1,1,2,6,1,7,3,1,1,2,3,1,2,1,2,2,1,7,1,4,1,1,1,2,2,3,1,1,1,11,1,2,1,6,1,1,2,3,1,6,3,1,2,2,4,59,2,5,2,12,1,15,3,4,1,2,1,2,3,3,1,1,3,1,3,2,23,1,1350,4,1,4,1,2,1,6,2,5,2,16,1,5,3,6,1,6,1,4,1,8,1,2,1,6,1,1,1,3,2,2,3,7,1,3,1,3,1,1,2,2,4,2,1,20,1,1,2,2,1,2,1,7,1,11,1,1,1,2,1,1,1,8,3,5,1,10,5,5,1,4,4,1,1,2,2,5,2,13,2,5,1,7,1,4,3,5,1,25,3,1,1,4,1,1,1,3,1,2,1,5,2,2,2,5,1,4,1,7,2,3,3,1,2,13,1,9,1,4,1,2,1,5,8,1,1,1,1,26,1,30,3,1,2,30,1,2,3,2,2,1,1,2,2,1,1,2,1,2,3,2,3,1,4,1,1,3,1365,3,1,3,1,2,1,2,1,7,1,3,2,12,1,10,2,3,1,11,1,12,1,14,1,6,1,4,1,10,1,2,2,2,3,1,1,2,1,1,4,24,1,1,1,2,1,4,2,4,4,1,2,2,1,1,2,4,2,5,1,3,1,2,1,4,6,1,1,13,1,3,1,5,1,35,2,5,1,9,1,1,2,4,1,8,2,1,1,2,1,16,1,1,2,9,1,4,1,1,1,3,4,2,2,16,1,17,1,3,6,2,2,1,1,27,1,32,1,2,2,30,1,3,2,1,1,2,4,3,8,6,2,2,1,1,2,3,1364,3,1,5,1,7,1,3,1,5,1,10,4,2,1,5,1,3,1,24,1,14,1,1,1,1,1,2,1,2,1,1,1,4,1,4,2,3,2,1,1,1,2,25,4,7,1,1,1,3,1,1,3,4,1,2,6,6,1,1,1,1,1,1,3,4,2,4,2,1,4,1,1,6,1,2,1,1,1,12,1,30,5,6,1,1,1,8,1,12,1,3,5,3,1,3,3,4,1,2,1,1,5,3,1,1,5,1,1,6,3,3,1,1,1,9,1,1,1,7,1,13,8,1,8,14,1,22,2,30,1,26,2,1,1,4,3,2,11,3,2,3,2,1,1369,3,1,7,1,16,1,20,1,3,1,6,1,6,1,8,2,11,2,5,4,10,8,2,2,4,1,5,1,1,2,18,2,2,1,1,2,9,6,4,1,3,2,7,2,3,1,1,2,1,1,1,2,1,1,2,2,1,4,2,1,8,2,1,1,16,1,27,1,5,1,3,1,12,1,11,1,1,1,1,1,15,1,2,1,1,1,1,2,13,1,6,1,2,1,13,1,3,1,20,1,3,1,1,12,15,2,50,2,24,2,2,1,2,3,1,1,3,11,2,5,1,4,2,2,5,8,1,1349,10,2,16,1,1,1,19,1,4,1,11,1,3,1,4,1,1,1,5,2,5,1,3,1,11,2,3,2,1,4,3,1,1,2,8,1,1,2,19,1,10,1,2,1,3,1,7,1,11,1,5,1,2,2,1,1,1,3,4,1,1,3,1,1,1,1,5,3,1,2,1,1,13,1,26,1,22,1,13,1,2,1,10,1,5,1,1,2,15,1,1,1,5,3,1,1,2,2,4,1,8,1,17,1,7,12,62,1,4,1,1,2,12,1,1,1,5,1,3,3,3,10,1,5,5,1,1,3,1,6,1,2,1,1,2,1358,5,1,7,1,5,1,29,2,12,1,5,1,15,2,13,1,7,2,2,1,4,1,3,2,1,2,10,2,22,1,6,1,1,3,11,1,5,1,5,1,4,2,2,2,3,2,1,1,4,1,1,4,7,3,1,1,11,1,1,1,66,1,19,2,2,4,2,1,7,2,9,1,1,1,9,1,3,2,8,1,18,1,1,5,1,5,39,1,17,1,4,1,9,3,7,1,1,1,2,1,3,4,1,1,6,2,1,2,1,1,1,6,1,1,3,4,2,6,1,1,5,1358,4,1,5,1,4,1,20,1,3,1,1,1,6,2,17,2,10,2,3,1,6,1,6,1,10,1,2,1,1,1,1,2,1,1,3,2,17,1,6,1,7,1,1,1,7,1,7,1,23,2,1,5,1,3,1,1,3,2,1,3,10,2,1,1,41,1,11,2,9,1,12,2,2,2,5,1,2,1,1,1,4,3,1,1,2,3,1,2,5,1,1,1,4,1,1,1,4,1,15,2,5,1,2,1,2,1,13,1,5,2,15,2,58,1,1,3,10,1,5,3,15,1,1,1,2,1,4,1,1,4,1,3,2,1,1,4,2,2,1,6,1,1349,6,1,3,3,2,2,6,1,14,2,8,2,18,1,2,1,2,1,5,2,1,1,6,1,1,1,11,1,6,2,1,1,1,1,2,2,3,1,3,1,14,1,12,1,1,1,2,2,11,1,1,1,3,1,4,1,2,2,11,1,2,4,1,5,5,7,2,1,5,2,13,1,20,1,6,1,11,2,21,3,2,3,5,1,1,2,2,1,1,4,1,4,1,1,1,2,50,1,5,1,1,1,1,1,1,1,9,2,1,2,9,2,4,1,2,1,41,1,2,2,3,1,1,1,1,2,3,1,12,1,15,2,2,1,2,1,2,1,1,3,1,1,1,5,3,2,1,2,2,8,2,1349,4,1,8,4,31,1,11,1,28,1,5,1,11,2,1,1,3,1,4,1,1,1,10,2,5,2,2,1,5,1,4,1,1,1,22,1,15,1,5,2,1,1,3,3,4,1,3,4,7,2,4,1,1,1,3,1,3,1,33,1,7,1,11,4,12,2,18,2,1,2,9,1,2,1,10,1,50,1,16,2,9,2,28,1,9,4,2,1,1,3,2,1,34,1,1,1,1,2,1,5,1,7,1,2,3,3,4,2,6,1348,2,1,11,1,34,1,15,1,14,1,13,1,6,1,5,6,2,3,6,1,5,1,3,1,1,1,12,3,1,1,1,1,1,1,3,2,24,1,9,1,1,1,3,1,1,1,5,5,4,5,2,1,1,2,8,1,1,1,4,5,20,1,20,1,16,3,2,1,2,1,1,1,16,3,6,2,15,1,1,1,1,2,30,2,7,1,8,2,12,1,2,2,4,1,5,1,1,1,26,2,9,3,1,3,1,1,1,3,26,1,1,1,1,1,1,2,2,9,2,9,4,3,2,1,1,6,2,1348,1,1,3,1,3,4,36,1,26,1,8,1,2,1,1,2,17,2,3,1,9,4,8,1,3,1,2,1,7,1,1,1,1,4,10,1,1,1,2,2,1,1,6,1,10,1,1,1,5,1,4,3,1,2,3,3,1,4,4,2,10,1,1,1,2,3,1,2,11,1,46,4,3,1,4,3,6,1,5,1,1,3,2,3,3,1,26,1,11,2,1,1,8,1,9,1,3,3,7,1,4,2,1,2,2,1,2,1,2,1,30,1,2,1,9,4,3,5,25,2,1,6,3,3,1,3,3,7,1,5,2,1,1,1,1,1,1,1,1,1352,5,1,8,1,34,2,29,1,1,2,9,1,6,1,8,1,1,1,4,1,2,1,3,1,3,1,9,1,2,2,1,1,3,1,5,1,1,3,2,1,6,1,3,1,1,1,1,1,13,1,5,1,8,1,1,1,3,1,2,2,2,3,1,6,3,3,13,2,1,3,18,1,11,1,14,1,5,1,6,1,2,2,3,1,2,5,11,1,2,3,3,2,29,1,12,2,15,2,9,2,14,5,19,1,15,1,12,1,1,2,3,5,14,1,2,1,1,2,7,5,4,6,1,2,3,2,1,1,2,7,1,2,1,2,4,1,1,1348,10,1,41,1,29,1,9,1,7,3,2,2,1,3,5,1,2,1,3,3,2,1,7,1,1,1,1,3,4,1,1,1,2,1,1,1,5,1,6,2,3,1,2,2,10,1,12,1,6,3,1,1,1,2,2,3,1,1,1,3,4,4,4,1,3,1,1,1,2,3,60,1,1,1,3,1,1,1,2,6,13,1,1,1,8,2,2,1,18,1,3,1,6,2,1,1,4,1,5,1,5,1,2,1,1,2,2,4,16,2,1,1,4,3,6,1,2,1,19,2,9,3,3,1,1,3,23,1,3,10,2,2,1,4,1,3,3,2,1,1,2,2,1,3,3,1,1,2,3,3,2,1345,9,1,5,1,32,2,5,1,9,1,1,1,12,1,7,1,6,2,2,3,1,1,2,1,3,1,1,1,10,3,1,1,1,1,4,2,3,1,7,1,4,1,3,1,3,3,11,1,1,4,4,3,1,2,2,1,1,1,3,2,2,1,1,1,2,3,1,6,2,1,1,4,1,1,3,1,3,2,1,1,4,1,3,1,1,1,20,1,18,1,13,1,7,1,1,1,1,5,2,1,1,1,4,1,11,2,1,1,9,1,33,2,1,1,13,3,1,2,5,4,18,1,2,3,32,1,1,1,3,1,5,1,2,3,2,1,2,1,10,3,1,1,1,2,2,1,4,5,1,3,2,4,1,1,2,2,3,2,1,1,1,3,3,1,1,1,1,5,2,1,2,1,2,1345,8,1,46,2,1,1,2,1,22,1,12,4,4,1,5,3,11,1,14,1,1,1,3,4,1,3,3,2,1,3,9,1,1,1,1,1,3,1,8,1,4,1,13,2,2,6,3,2,1,1,5,5,5,1,1,1,3,1,2,1,49,1,4,1,3,1,1,1,3,1,3,1,2,2,1,1,1,1,7,2,51,2,17,3,1,1,4,1,1,1,6,1,8,1,2,2,1,3,14,1,1,1,5,1,7,1,1,1,2,1,4,1,1,1,9,2,6,1,6,9,1,1,4,2,1,6,1,2,2,2,4,1,1,4,2,3,6,1,1,1,1,6,1,1,1,1348,5,1,4,1,43,3,21,1,1,1,14,8,2,1,2,1,1,3,10,1,13,1,1,1,1,1,5,5,4,1,4,1,7,2,3,1,8,1,1,1,8,1,5,1,1,2,3,1,3,5,5,3,1,1,3,1,2,1,4,2,1,1,2,3,2,1,2,1,4,1,12,1,3,1,28,1,15,1,1,2,1,1,9,1,4,2,3,1,2,1,36,1,5,1,1,1,1,2,5,1,4,3,1,2,2,1,1,2,9,1,5,1,1,2,1,7,4,1,5,1,15,3,4,3,1,2,3,1,4,1,1,3,5,1,6,3,3,2,3,9,1,2,1,2,1,4,9,1,3,1,1,1,2,1,1,3,1,10,1,1346,2,1,3,1,1,1,1,1,1,2,4,1,20,1,8,1,4,2,21,1,1,1,2,1,9,2,4,1,3,1,3,11,7,2,1,1,8,1,5,1,1,2,2,1,1,3,1,1,3,2,5,1,2,1,1,1,1,1,1,3,9,1,4,1,1,1,2,4,4,3,1,2,3,1,2,2,1,1,1,2,2,1,5,2,1,1,1,1,2,1,1,1,2,1,3,1,8,1,1,1,11,1,8,1,5,1,9,1,12,3,10,2,2,1,9,2,2,3,9,1,38,1,3,2,8,4,2,1,12,1,3,1,5,1,1,1,2,8,4,1,15,1,3,2,21,1,1,1,5,1,1,4,1,4,7,4,1,6,1,2,5,1,2,3,1,2,5,4,2,1,2,11,4,3,1,1342,1,1,36,1,8,1,1,1,3,1,2,1,33,1,3,2,8,1,1,3,2,2,1,2,7,1,13,1,1,1,1,1,4,1,2,1,1,1,5,1,6,1,8,2,3,1,10,1,5,3,1,1,3,2,5,1,3,3,2,1,2,1,11,1,7,2,1,5,4,3,1,1,38,1,1,1,18,1,1,3,9,1,2,1,1,3,10,1,37,2,13,3,1,1,5,3,15,4,1,9,1,1,8,3,3,2,10,1,2,1,4,2,2,1,8,1,5,8,1,4,1,1,3,2,3,5,2,1,1,1,4,1,2,2,1,1,1,1,2,1,8,10,1,4,3,2,2,1341,2,1,2,1,6,1,5,1,34,1,15,1,19,2,5,4,6,1,3,3,10,1,6,1,5,1,2,1,14,1,6,1,3,1,5,5,3,3,8,2,2,1,9,2,2,4,2,2,1,1,2,2,2,2,3,1,1,1,6,1,3,4,2,2,8,2,1,1,37,1,11,3,5,1,1,1,1,2,6,1,3,2,2,3,7,1,1,2,37,2,4,1,6,8,3,1,6,1,6,2,4,2,1,2,1,5,2,1,8,3,3,1,6,2,6,2,3,1,3,3,2,1,6,1,1,3,2,1,1,3,1,3,1,2,3,4,1,3,1,6,2,2,1,7,3,1,5,1,1,13,3,1,2,1,3,1340,1,1,8,1,2,1,23,1,6,1,5,1,45,3,1,2,10,2,1,2,6,1,5,1,10,1,1,1,1,2,1,1,2,5,1,2,11,1,2,2,1,2,1,2,1,2,7,1,6,2,5,3,1,4,2,2,8,1,6,1,5,1,4,2,1,4,19,1,48,1,1,2,1,1,1,1,6,1,7,1,1,1,3,1,8,1,7,1,36,1,6,1,2,3,1,2,13,2,4,5,1,5,1,1,7,1,1,2,4,2,2,1,2,1,8,2,1,3,3,1,19,6,1,1,4,1,3,1,2,2,2,6,1,7,1,3,2,1,1,2,4,1,1,3,2,6,11,1340,10,1,2,1,27,1,17,1,2,1,2,1,30,1,3,1,5,1,5,1,21,1,2,2,1,3,1,1,1,1,1,1,5,2,2,2,14,1,4,2,7,2,12,8,3,2,3,2,4,1,4,3,1,1,4,1,2,6,38,1,30,1,1,7,7,2,17,1,34,1,9,1,4,1,2,6,17,1,5,1,1,8,1,3,8,3,3,2,5,1,7,8,2,2,18,1,1,4,2,1,5,1,1,1,1,3,3,1,1,1,3,10,2,1,8,1,1,3,1,5,1,7,2,1,4,1338,5,1,5,1,40,1,24,1,14,1,2,1,12,1,1,1,2,4,3,2,1,1,11,6,1,1,2,2,6,3,2,3,1,1,8,5,1,1,1,2,13,2,7,7,3,1,3,1,5,2,6,1,1,1,10,3,12,1,4,1,12,1,25,1,3,1,9,2,1,3,1,1,22,3,9,1,7,1,33,1,1,1,3,2,17,2,7,4,2,1,2,4,6,2,1,2,2,4,3,2,3,1,3,2,1,2,2,1,2,2,18,1,2,2,6,2,4,2,1,1,5,1,1,1,1,2,1,2,3,1,5,1,1,1,5,14,5,1,4,1337,5,1,35,1,48,1,2,2,9,1,6,2,8,1,1,1,2,2,10,5,5,2,2,2,1,2,1,1,2,2,7,1,3,4,3,1,3,1,18,6,1,1,3,1,7,4,4,1,1,1,24,1,7,2,1,1,28,1,20,6,37,1,26,1,14,1,1,2,1,3,12,1,11,2,3,1,1,4,11,3,16,1,2,6,14,1,5,9,5,1,1,1,1,3,2,3,6,1,1,2,5,1,2,2,1,3,2,14,1,1,1,1,9,1336,20,1,22,1,16,1,31,3,6,1,3,1,5,1,9,3,2,1,7,3,1,1,1,3,1,2,2,1,2,2,3,1,1,1,1,6,1,1,2,1,4,4,2,2,1,1,19,2,1,1,5,2,3,1,2,6,3,2,2,2,7,2,1,2,12,1,6,2,33,1,17,6,9,1,26,1,40,3,4,1,1,1,5,1,4,3,3,1,6,3,4,4,6,1,1,1,20,4,8,1,18,7,9,5,1,2,5,3,13,1,1,2,3,2,1,3,1,5,1,3,2,1,7,1338,2,1,14,1,21,1,2,2,9,1,34,1,2,1,2,2,5,2,21,1,7,3,2,3,5,2,1,2,3,2,1,6,4,1,7,1,1,1,24,2,2,4,1,1,2,1,1,1,2,1,3,1,4,2,8,1,6,3,53,1,14,1,2,4,1,1,7,1,3,1,1,1,10,1,14,1,36,3,4,2,2,2,2,1,4,1,2,2,1,2,8,2,3,2,3,1,2,2,1,2,1,1,2,1,14,1,1,1,1,1,1,2,2,5,17,1,2,8,3,2,2,3,1,1,5,4,9,2,5,1,1,3,1,10,1,1,1,1,1,5,4,1337,4,2,1,2,6,1,2,2,2,1,7,1,17,1,2,1,2,2,34,1,5,1,1,1,1,1,14,1,2,1,1,1,1,1,1,2,10,2,2,1,1,1,1,1,1,10,2,6,4,1,36,1,1,3,1,1,1,1,8,2,7,1,1,1,11,2,54,1,17,1,1,5,10,1,12,1,32,1,17,1,3,4,2,1,8,1,1,1,4,1,1,1,1,1,6,1,1,1,5,6,1,3,8,1,2,1,2,1,2,1,5,2,1,2,2,4,18,7,2,2,5,2,10,3,7,1,2,1,9,2,1,1,1,3,1,1,1,1,3,5,6,1336,5,3,4,1,7,2,7,1,6,1,1,2,1,1,2,2,10,1,27,1,1,1,3,3,32,2,6,1,1,1,2,5,3,12,2,1,2,3,10,1,7,1,20,1,1,2,1,1,3,2,7,1,8,2,3,1,1,1,6,3,36,1,31,1,2,1,1,3,9,1,5,1,60,1,1,1,1,3,3,1,7,1,2,1,7,1,7,1,5,2,1,4,1,1,1,4,2,1,1,2,6,2,6,1,2,1,2,6,1,1,16,3,1,1,1,2,1,1,18,1,18,1,3,1,2,5,2,3,1,2,1,2,1,3,3,2,2,1332,5,2,1,1,12,1,6,2,6,3,15,1,31,2,13,1,12,2,8,2,1,1,3,1,1,1,1,1,2,2,1,2,5,2,1,3,1,3,2,2,1,1,1,3,3,2,8,1,1,2,21,1,5,1,11,1,1,1,5,1,7,1,8,1,19,1,2,1,12,1,31,1,2,1,1,5,8,4,41,1,19,2,1,1,2,3,4,2,3,4,6,1,1,1,7,1,5,3,2,2,3,6,1,1,1,2,4,4,5,1,2,1,2,2,1,2,20,1,3,2,2,1,8,2,7,3,21,6,1,1,2,3,1,2,1,3,1,3,1,3,2,1332,4,1,2,2,3,3,6,1,4,2,19,2,1,2,27,1,6,1,14,1,3,1,8,2,1,1,6,1,1,2,8,1,4,3,3,2,3,1,1,2,1,1,3,4,7,1,4,3,1,1,1,1,6,1,3,1,2,1,6,3,3,1,2,1,7,1,2,2,6,1,1,5,7,1,14,1,55,1,3,6,8,2,9,1,32,1,19,1,1,2,2,3,1,1,3,1,4,4,2,1,5,2,12,1,2,5,2,4,2,2,2,2,5,4,6,1,1,1,1,2,23,1,8,2,5,2,7,3,2,1,14,1,5,1,1,2,1,6,1,1,3,2,2,1,2,5,1,1,4,1326,5,1,2,1,3,1,1,2,13,1,7,1,6,2,1,1,32,1,4,1,20,1,8,1,10,1,3,1,1,1,2,2,3,1,1,1,4,2,4,1,4,2,1,3,4,1,3,1,4,1,1,1,2,3,19,1,1,1,4,3,6,1,12,1,4,1,2,1,12,1,19,1,16,1,4,1,24,1,1,4,9,2,31,1,3,2,10,1,2,1,6,1,2,1,2,3,2,3,1,1,6,1,12,2,9,2,1,1,2,4,2,2,1,6,1,2,2,2,1,6,7,2,1,4,7,1,9,1,1,3,14,2,7,1,3,1,13,4,6,3,2,1,1,2,3,1,1,4,5,1,3,1,6,1324,8,1,5,2,10,1,7,1,16,1,9,1,6,1,31,1,15,1,1,2,3,3,1,1,7,1,4,2,7,2,6,2,1,3,6,1,1,2,9,2,21,1,3,1,2,1,2,1,3,1,11,1,6,4,8,1,2,1,6,2,8,1,51,1,3,2,7,4,1,1,3,1,29,1,5,1,14,1,3,2,1,1,6,2,2,1,8,2,5,1,12,2,3,4,2,25,3,2,1,1,1,4,17,1,2,2,8,2,4,1,6,1,14,2,4,1,3,1,3,1,1,1,5,1,4,8,7,3,5,1323,15,3,6,1,3,1,15,1,3,1,1,1,4,1,2,1,30,1,6,1,4,1,7,1,8,1,1,1,4,2,1,1,1,2,2,1,1,1,4,1,3,2,1,1,12,1,3,1,5,1,3,2,9,1,6,1,2,1,13,4,1,1,8,1,14,1,1,1,8,1,1,1,9,1,35,1,11,1,16,1,7,5,4,1,5,2,22,2,25,1,5,2,4,1,2,1,5,1,5,4,9,2,4,4,1,2,1,4,1,2,1,1,3,3,1,6,4,2,5,1,17,1,2,2,20,1,15,3,8,1,3,2,5,3,1,1,2,2,1,4,2,4,1,1,3,2,5,1320,8,1,4,1,2,1,10,1,1,1,26,3,11,1,7,1,1,1,4,1,8,2,4,1,2,1,13,1,2,2,2,1,2,2,3,1,2,1,3,1,19,2,1,1,2,1,5,1,2,2,21,1,6,1,5,2,6,2,2,1,5,1,6,4,35,1,23,1,14,1,7,1,2,1,14,1,30,1,2,3,30,2,5,1,8,1,5,2,1,2,3,1,7,1,2,2,1,2,3,7,1,1,2,1,1,4,2,4,6,1,11,1,9,1,2,1,1,1,10,3,13,1,9,1,2,1,6,3,1,4,1,3,7,1,1,3,4,1,1,3,1,5,5,1319,10,2,4,1,6,1,1,1,12,1,6,1,9,1,5,1,2,2,3,2,12,2,5,1,2,1,10,1,5,1,1,2,3,1,2,1,5,4,3,3,2,1,24,2,1,2,14,1,14,2,1,2,3,2,5,3,5,2,3,1,4,10,1,1,8,2,1,1,10,1,8,3,58,1,3,4,27,1,3,2,1,1,17,2,1,1,1,1,1,1,11,1,7,1,4,1,3,1,4,5,11,1,3,5,1,4,2,2,1,3,3,2,1,1,8,1,16,1,6,1,4,1,5,1,10,2,1,3,3,1,3,2,1,2,2,1,1,1,1,3,2,2,3,3,3,1,1,6,5,1,1,7,2,1,5,1317,7,1,2,1,15,1,3,1,16,1,7,1,3,2,1,2,3,1,7,1,8,1,4,1,1,1,2,1,1,4,2,1,2,1,5,2,4,2,6,3,1,1,3,6,4,1,16,1,1,5,3,1,8,1,3,2,18,2,8,1,10,1,4,1,1,3,1,2,2,1,1,1,8,2,1,2,6,1,1,1,6,1,3,1,13,1,19,1,10,1,8,1,8,5,23,1,10,1,3,1,15,2,2,3,29,1,2,4,1,4,7,1,3,3,7,1,1,2,1,6,4,1,7,1,20,1,10,1,2,1,10,1,1,2,3,1,2,1,4,1,4,3,1,3,1,1,5,1,2,5,2,1,1,2,5,1,1,10,6,1316,12,2,4,1,9,2,9,1,8,1,1,1,3,1,3,2,10,1,6,2,1,1,10,1,3,1,6,1,4,1,1,2,1,1,5,1,2,1,5,3,3,1,1,2,5,3,15,2,1,4,6,1,1,2,6,1,7,3,3,1,4,2,2,1,1,3,9,2,9,6,5,1,8,3,7,4,9,2,16,1,4,1,1,1,4,2,13,3,4,2,1,1,5,1,1,2,2,1,5,1,10,1,2,1,14,4,10,1,3,1,1,1,3,2,19,2,10,1,3,5,1,2,7,1,1,1,12,2,1,6,3,1,3,1,2,2,29,1,6,1,12,1,2,1,2,1,15,1,10,6,5,1,2,1,1,18,5,1312,9,1,11,1,5,3,12,1,8,2,4,2,7,1,9,1,4,1,12,1,1,1,26,2,2,4,5,1,3,1,1,1,2,1,14,1,8,1,2,1,3,3,1,2,7,1,12,2,3,1,1,1,1,1,20,3,4,1,1,2,7,2,10,4,22,1,1,2,8,1,1,2,8,1,8,1,15,1,39,1,2,1,1,1,13,1,1,1,9,1,12,2,9,1,5,4,1,1,8,2,6,1,1,1,3,3,2,5,1,1,8,5,18,1,24,2,8,2,1,1,1,1,10,1,11,2,1,1,1,2,3,3,1,9,2,7,5,1312,8,2,1,1,7,1,9,1,3,1,19,2,1,1,3,1,1,1,2,4,36,2,11,1,5,1,1,5,3,1,1,1,2,5,4,1,8,2,5,1,10,5,9,1,12,2,2,1,3,1,2,2,1,1,7,1,8,1,1,1,4,1,2,1,6,2,5,1,5,4,7,1,12,2,1,1,7,1,3,3,6,1,28,1,5,2,24,2,1,1,3,2,9,1,4,2,4,1,2,2,25,2,6,3,11,2,11,9,11,3,8,1,4,1,33,1,7,2,1,1,3,3,1,1,2,1,3,2,3,2,2,6,6,2,1,10,1,8,2,1314,11,2,5,2,1,1,6,1,2,1,12,1,4,1,1,1,2,1,1,1,6,1,3,1,7,1,2,1,1,1,7,1,36,2,2,3,7,1,6,2,10,1,3,4,4,2,4,2,11,1,3,1,9,5,28,3,1,1,22,1,8,1,15,1,7,1,5,1,5,2,9,1,6,1,1,1,7,2,11,1,19,1,5,1,2,1,1,3,12,1,4,2,2,2,22,2,9,3,1,1,6,8,6,1,1,10,10,2,25,1,21,1,5,1,4,2,3,2,1,1,2,2,1,2,7,5,2,2,1,1,3,3,2,7,2,1,2,4,1,5,1,1310,9,1,8,2,1,1,5,2,16,1,3,1,1,1,1,1,5,1,1,1,1,1,19,2,39,2,6,1,2,1,9,1,1,2,8,1,1,2,1,2,1,1,1,1,9,2,4,1,6,1,12,4,7,1,2,1,2,1,15,3,47,2,9,1,3,2,1,1,4,1,13,1,1,1,4,1,1,1,6,1,1,1,5,1,27,1,5,1,7,1,5,1,4,4,1,2,20,3,11,2,7,4,1,1,3,2,1,1,1,2,4,1,1,6,33,1,22,1,1,4,1,1,2,1,1,2,4,1,3,6,10,2,4,2,2,2,2,1,1,8,1,1,1,3,1,9,1,1308,8,1,1,1,4,3,10,1,1,1,25,3,1,2,13,2,3,1,3,1,5,1,21,1,14,1,8,1,2,1,9,1,11,2,1,1,12,2,3,1,16,1,3,1,1,4,4,2,1,1,2,1,3,3,8,1,2,4,7,1,3,1,11,1,7,2,13,1,8,1,4,1,2,1,2,1,3,1,3,1,5,2,13,2,21,1,16,1,18,1,2,1,1,5,2,1,19,3,2,1,6,5,7,5,1,1,1,2,2,4,1,2,1,7,6,2,50,2,3,1,5,1,10,2,1,2,9,2,1,1,3,2,1,2,1,6,2,2,1,2,1,1322,10,1,3,1,2,1,19,1,4,1,3,2,3,1,8,1,1,1,5,1,7,1,4,1,1,1,3,1,24,1,10,2,4,3,13,1,31,2,1,1,12,1,9,1,1,1,1,1,14,3,1,1,3,1,9,2,23,1,8,1,1,1,6,1,13,1,5,2,19,1,4,1,2,1,2,1,2,1,20,1,5,1,1,4,3,1,8,1,9,1,1,1,4,2,2,3,5,1,3,1,7,1,1,7,9,3,9,3,1,1,2,10,1,6,1,1,52,6,13,1,3,3,3,1,22,1,2,7,1,4,3,11,1,1307,11,2,33,1,1,4,3,1,2,1,1,3,12,1,11,1,19,1,5,1,13,1,8,2,21,1,4,1,7,1,3,3,2,1,2,1,9,1,2,1,1,1,5,2,4,1,3,1,1,4,2,5,4,1,1,3,2,2,4,1,8,1,27,2,5,1,7,1,69,2,2,1,3,2,12,1,15,1,4,3,2,4,3,1,1,4,1,5,7,5,5,1,1,3,1,2,1,1,1,3,1,6,2,6,5,3,45,2,2,1,8,1,18,1,17,3,1,1,1,11,4,4,1,1,3,1308,30,1,44,2,2,1,3,1,20,1,14,1,4,1,11,1,3,1,4,1,16,1,2,3,5,1,1,4,2,1,7,1,8,1,4,1,11,1,4,1,2,2,2,2,5,1,2,1,2,1,41,1,11,1,9,1,34,1,27,2,3,2,1,1,2,1,1,1,24,2,15,2,3,3,1,3,11,1,4,1,1,2,4,7,2,4,2,3,56,3,3,1,17,2,1,3,7,1,14,2,4,5,2,4,3,4,1,1,1,1310,16,2,16,1,16,1,4,2,21,2,30,2,25,1,1,1,11,1,5,1,7,1,3,1,4,1,2,1,17,1,5,1,14,1,3,2,14,1,14,1,3,1,38,1,4,1,36,1,4,1,24,2,1,1,4,1,5,1,19,1,2,1,5,1,17,2,1,1,10,3,5,1,3,1,2,3,1,5,1,3,1,3,13,1,3,1,33,1,2,1,3,1,24,1,1,1,2,3,4,1,10,1,7,1,1,9,2,1,6,1,2,1310,15,2,13,3,26,1,42,1,12,1,11,1,6,2,1,3,1,2,2,2,5,1,16,1,4,2,21,2,6,1,7,2,7,1,1,2,6,1,52,2,8,1,6,4,4,1,20,1,10,1,24,4,3,2,6,1,46,2,1,1,21,4,1,3,2,2,1,3,2,2,58,1,5,1,7,2,12,3,4,1,8,2,5,1,4,1,1,2,3,2,11,1,1,1311,30,1,1,1,1,1,19,1,1,1,1,1,2,1,2,3,4,1,2,1,20,2,14,1,22,1,1,3,3,1,7,1,14,1,9,1,19,1,5,1,21,1,11,2,20,1,103,1,4,3,5,2,2,1,32,1,17,1,1,2,3,1,4,1,2,2,1,1,6,5,2,1,2,2,3,2,1,1,10,1,28,1,13,1,4,1,5,3,5,3,11,2,2,1,26,1,20,1,1,1308,19,1,14,1,2,2,13,1,14,1,7,1,25,1,36,2,2,1,3,2,25,6,18,1,10,1,7,1,4,1,3,1,9,1,51,1,9,1,12,1,4,1,7,3,38,3,1,1,2,1,2,2,1,1,9,3,38,5,3,1,8,1,3,1,4,5,2,1,1,3,2,2,2,1,10,2,37,3,2,1,11,1,10,1,6,1,7,1,25,1,17,2,2,11,1,1296,9,1,45,1,2,1,1,1,4,4,2,1,3,1,2,1,33,1,2,2,4,1,13,1,1,1,1,2,1,2,1,3,3,1,21,1,1,1,7,1,20,1,15,2,4,1,2,1,51,2,7,1,3,1,5,2,8,1,13,2,17,1,8,1,11,3,1,1,5,2,2,1,5,1,7,1,9,1,1,1,22,3,1,1,6,2,9,1,5,2,4,1,1,1,3,3,9,1,39,6,7,1,7,1,49,3,3,1,2,2,8,1312,27,2,18,1,11,4,3,1,9,1,14,1,7,1,10,2,11,1,6,1,1,1,10,4,19,1,4,1,2,2,20,1,9,1,8,2,1,1,3,2,1,2,6,1,54,1,12,2,6,1,15,1,9,1,1,1,26,1,9,1,3,1,14,1,33,3,1,1,23,1,5,3,3,2,1,1,8,1,40,2,1,2,6,1,4,4,1,1,6,1,13,2,2,1,23,2,3,2,2,2,1,1,6,17,1,1295,8,1,9,1,4,1,8,1,9,2,2,2,21,1,12,1,6,2,13,2,9,1,10,1,4,2,3,1,5,1,1,2,12,1,5,4,11,1,25,1,10,2,1,1,2,1,3,1,3,1,2,1,25,1,33,1,14,1,20,2,16,1,15,1,5,1,2,2,3,1,3,1,22,1,1,1,20,1,10,1,3,2,8,1,7,1,1,1,5,1,1,1,1,1,48,1,8,1,10,1,19,1,32,4,1,2,4,1,3,5,1,5,1,1299,24,1,29,1,1,1,3,3,2,1,12,1,3,1,3,1,3,1,14,3,13,1,11,1,2,1,2,1,15,2,10,1,3,2,4,1,8,1,18,3,8,3,5,1,1,1,1,2,24,1,39,1,2,1,4,1,24,1,16,1,12,1,10,1,5,1,3,1,3,1,3,1,17,2,4,1,18,1,10,2,2,1,3,1,1,1,1,1,2,2,5,1,4,4,8,2,39,6,11,2,3,1,16,1,15,1,16,1,5,1,1,2,4,3,2,6,1,2,1,1,3,2,1,1293,10,2,14,1,3,1,13,1,8,1,8,1,3,1,2,1,19,1,5,1,15,1,4,1,5,1,9,1,1,1,7,2,13,2,17,1,16,1,3,1,7,1,2,1,6,1,2,1,2,1,3,4,1,1,71,1,24,1,11,1,17,1,10,1,2,3,7,1,1,1,2,1,17,2,1,1,2,1,21,1,2,1,6,1,1,1,6,2,8,5,2,1,1,1,5,1,1,3,1,1,38,2,14,1,1,1,19,2,30,1,4,1,3,2,4,3,2,1,2,6,2,2,1,1,2,1293,12,2,1,1,4,1,35,4,19,1,4,3,9,2,1,1,2,1,26,1,1,3,5,1,2,1,1,1,12,1,1,1,5,1,8,3,6,1,3,1,19,1,7,4,8,2,27,1,20,1,22,2,13,1,18,1,21,2,5,1,1,1,6,2,31,1,11,1,20,1,9,1,2,2,11,2,1,1,8,1,3,7,2,1,2,3,1,2,40,4,11,1,7,1,26,4,5,1,3,1,5,3,2,3,2,3,5,2,3,1293,10,1,8,2,4,1,29,1,1,1,1,2,2,1,1,1,1,1,13,3,10,1,20,1,3,2,7,1,1,1,5,1,5,2,8,1,4,1,5,1,9,1,28,1,1,1,7,1,1,2,1,2,2,1,3,2,78,1,17,1,11,1,6,2,14,3,10,2,8,1,1,2,18,3,4,2,23,1,9,2,7,1,4,1,2,4,8,1,1,3,2,3,2,4,4,1,16,1,22,4,15,1,11,2,11,1,6,4,1,1,2,3,1,7,2,2,1,9,6,1,10,1285,13,1,6,1,4,2,14,1,1,1,1,1,12,1,1,2,3,2,6,1,11,2,2,1,3,1,27,3,5,1,13,1,19,1,8,1,1,1,8,1,16,4,13,2,3,3,26,1,4,1,50,1,2,1,2,1,11,1,4,1,11,1,8,2,21,1,6,1,63,3,15,4,5,8,2,4,1,6,1,3,1,1,14,1,25,1,2,1,9,1,36,2,2,13,1,2,1,6,1,2,6,1,11,1284,2,1,29,1,11,1,16,1,3,4,13,1,1,1,7,1,2,1,1,1,8,1,22,3,21,1,5,1,16,1,41,1,3,3,1,1,2,1,1,2,56,1,11,2,5,1,20,2,10,1,22,1,8,1,73,1,6,1,6,6,8,1,1,3,1,12,1,4,12,1,30,1,9,2,35,1,4,2,3,1,1,9,1,5,2,1,3,1,3,2,17,1276,15,1,4,1,1,1,14,1,13,1,10,2,2,1,1,1,16,2,9,1,9,2,22,2,2,1,3,1,6,2,4,2,1,2,4,1,15,1,24,1,20,2,2,1,2,1,1,1,57,1,9,1,8,1,18,1,1,2,7,1,25,2,6,1,1,1,7,1,1,1,76,5,8,6,2,8,1,1,1,1,1,1,1,2,1,1,39,1,47,2,5,3,4,2,1,1,4,1,3,2,5,1,1,8,4,1,2,4,3,1276,14,3,5,1,4,1,9,1,1,1,2,1,5,1,6,1,10,1,67,1,1,1,2,1,2,2,2,3,10,2,17,1,1,1,47,1,8,1,48,1,2,1,12,1,11,2,35,2,23,3,3,1,1,2,18,1,19,1,35,2,1,3,9,5,1,6,1,2,7,2,1,1,38,4,9,1,15,1,21,1,5,1,25,7,4,11,3,1274,12,2,2,1,19,1,13,1,1,1,1,1,1,3,7,2,18,1,7,1,1,1,11,3,2,2,7,1,10,2,1,1,4,1,8,1,13,1,16,1,16,2,24,1,3,1,14,2,42,1,51,1,11,1,29,1,3,1,73,1,3,3,1,1,5,1,2,5,3,3,1,2,2,1,7,2,52,1,32,1,1,1,3,4,25,8,3,6,1,1,1,3,4,1272,3,1,4,1,3,1,2,1,5,1,35,2,7,3,19,1,13,1,2,1,2,1,1,2,24,1,2,1,4,1,14,1,23,1,5,1,11,1,2,1,1,1,1,1,2,1,6,2,2,3,2,3,68,2,15,1,22,1,24,1,6,1,3,1,6,1,3,1,76,1,1,2,7,1,2,2,1,2,4,1,3,1,10,1,2,1,34,1,50,1,1,2,2,3,14,5,7,3,2,3,2,11,5,1271,1,1,1,2,19,1,33,1,8,1,15,1,1,1,2,2,13,1,1,1,6,1,1,1,6,1,7,3,32,1,18,1,18,2,1,3,9,1,6,1,3,1,8,1,68,2,7,1,9,1,3,1,17,1,6,1,16,1,3,1,53,1,17,1,2,1,6,2,2,1,2,1,3,1,6,2,3,1,9,1,46,1,52,8,12,1,1,6,4,1,2,1,5,1,1,12,1,1,3,1,2,1270,3,2,2,1,5,1,3,3,1,1,2,1,5,1,3,1,4,1,13,1,2,2,7,1,2,1,1,1,3,1,14,1,4,2,9,1,12,1,1,2,5,1,18,1,3,2,1,1,1,1,48,1,15,1,1,1,76,2,3,1,2,1,5,2,36,2,8,1,2,1,7,1,2,3,72,1,5,1,2,2,11,1,1,1,12,3,12,1,30,1,1,1,75,7,2,4,5,8,3,5,10,1264,3,4,1,1,1,1,7,2,2,2,1,1,5,1,5,1,3,1,20,1,2,1,1,1,14,1,13,1,9,1,6,1,11,1,3,1,25,1,6,1,20,1,18,1,17,1,3,1,4,1,53,1,16,1,12,1,1,2,10,2,32,1,2,1,5,1,4,1,1,1,8,3,5,1,15,1,1,1,44,8,4,1,5,3,6,2,2,3,43,4,55,1,11,5,1,1,2,4,2,1,1,4,3,1,1,1,1,8,6,1,12,1261,2,2,1,1,2,1,11,1,1,2,39,1,18,1,5,1,4,1,32,1,28,1,5,1,3,1,27,1,8,1,2,1,44,1,61,2,49,3,2,1,1,1,2,1,9,3,1,2,4,1,63,1,1,3,1,1,2,2,4,1,3,2,5,1,6,2,6,1,35,4,64,3,3,1,5,3,4,6,2,1,1,1,2,7,5,2,12,1261,3,1,2,1,7,3,5,1,1,1,21,1,3,1,9,1,3,2,13,1,2,1,3,1,3,1,6,1,6,1,9,1,1,1,16,1,2,1,24,3,17,1,20,2,1,1,11,1,1,1,7,1,2,1,132,3,6,1,3,1,3,1,2,1,2,2,18,2,29,1,20,8,9,1,1,1,12,1,43,3,1,1,62,4,2,2,6,2,2,8,1,2,1,1,2,5,2,4,3,1,4,1,1,1,4,1261,5,2,15,1,25,1,14,1,3,1,16,1,27,2,11,1,3,1,11,1,19,1,3,1,23,1,12,2,17,1,7,1,1,1,121,2,9,2,2,2,4,1,5,1,6,2,15,1,46,1,4,1,1,2,1,3,1,3,3,1,2,1,7,1,2,1,13,1,38,2,58,1,1,1,1,2,3,3,1,4,3,1,2,2,2,5,6,3,1,2,1,3,3,1,1,3,6,1261,3,2,4,1,23,1,51,1,6,1,2,1,5,2,13,1,36,1,11,1,23,2,1,1,9,4,22,1,134,1,2,3,2,4,1,1,1,1,9,1,39,3,18,1,1,1,8,2,1,1,3,4,28,1,98,1,1,7,1,4,2,1,2,3,1,5,4,2,3,2,3,5,4,1,1,4,6,1260,5,1,3,1,48,1,33,1,3,1,5,1,32,1,7,1,9,1,9,1,26,1,1,1,24,1,6,1,4,2,1,1,57,1,15,1,1,1,46,1,9,2,2,3,1,4,11,1,3,1,12,1,45,2,16,2,12,2,113,1,3,4,2,5,1,2,1,3,1,10,4,2,2,6,5,1,10,1261,1,1,57,2,28,1,4,2,1,1,8,1,17,1,5,1,6,1,2,1,5,1,5,1,5,1,5,1,11,1,39,1,1,1,5,1,3,1,1,2,67,1,65,2,1,5,4,1,13,1,1,1,7,2,2,1,25,1,18,2,4,1,2,1,3,1,4,1,2,2,9,1,4,2,35,1,72,1,4,2,4,4,1,4,3,8,6,3,1,2,2,6,1,2,9,1260,8,1,7,1,1,2,7,1,25,1,8,1,23,1,8,1,4,1,91,1,2,1,19,1,1,1,8,1,1,3,1,1,51,1,25,1,53,1,2,2,5,2,6,1,7,1,2,2,51,1,5,2,4,4,8,3,10,1,3,1,21,1,16,1,11,2,58,1,2,1,6,2,5,5,1,8,2,1,3,2,5,2,1,5,3,1,2,1,5,1259,4,1,2,2,42,1,47,1,14,1,12,1,5,1,58,2,9,2,12,1,7,2,1,1,80,1,3,1,10,1,42,3,1,1,10,1,10,1,1,1,54,1,1,1,13,2,5,1,9,1,7,1,60,1,48,5,2,3,1,17,4,2,5,1,1,2,1,7,11,1258,3,1,2,1,1,1,9,2,3,1,20,1,48,2,3,1,8,1,95,1,25,1,1,2,4,1,1,1,7,1,38,1,1,1,36,1,6,2,31,1,2,2,3,1,17,1,80,1,1,1,16,3,45,1,62,2,1,18,2,4,12,2,1,7,2,1,9,1258,2,2,8,1,6,1,4,1,19,2,3,1,9,1,24,1,27,1,51,1,60,1,7,1,77,1,6,1,1,1,12,1,35,1,21,2,58,1,15,1,6,2,15,1,72,2,34,1,1,1,3,1,2,4,2,2,1,3,4,3,3,1,6,1,1,7,3,2,5,2,5,1258,1,1,6,1,1,2,2,1,2,1,1,2,14,1,1,2,14,1,1,1,1,1,38,1,6,1,4,1,2,1,56,1,1,1,22,1,10,1,12,2,7,1,8,1,50,2,2,1,15,1,8,1,2,1,1,1,22,1,31,1,14,1,75,1,5,2,13,1,6,1,105,2,7,3,1,1,1,1,1,2,4,3,1,6,5,3,1,1,2,3,2,1,4,4,4,1259,9,3,7,2,24,1,40,1,60,1,19,1,1,1,3,1,19,1,22,2,62,1,5,1,19,1,9,1,58,1,62,1,33,2,12,1,52,1,69,1,2,1,4,1,5,7,1,1,3,2,2,1,4,4,6,4,4,1257,5,1,5,1,8,3,3,1,52,1,6,2,81,1,3,1,31,1,3,3,107,1,21,2,22,1,4,1,68,2,7,1,3,1,22,1,12,1,6,1,1,1,43,1,10,1,21,2,37,1,2,2,7,3,2,1,6,3,1,2,2,5,5,5,5,1256,3,1,8,1,12,2,3,2,8,1,21,1,30,2,50,1,15,1,25,1,10,1,4,1,4,1,3,1,8,1,38,1,35,1,7,1,6,1,28,4,21,1,7,1,11,2,53,1,34,1,12,1,8,1,5,1,31,1,4,1,5,1,53,2,1,1,1,1,3,5,11,1,13,11,10,1,4,1256,1,1,9,1,1,3,10,1,2,3,62,1,113,1,11,1,9,3,77,1,9,1,19,4,28,1,13,1,153,1,60,1,3,1,4,7,8,2,12,11,4,2,1,2,6,1256,12,1,1,1,5,1,5,2,1,1,50,1,32,1,20,2,69,1,1,1,1,1,2,1,14,1,4,2,6,1,55,1,1,1,5,1,10,1,24,2,23,1,126,1,104,7,5,5,1,3,3,1,5,1,10,11,17,1255,20,1,24,1,27,1,10,1,45,1,1,1,1,1,10,1,59,1,4,3,89,3,38,1,21,2,233,1,1,1,2,1,2,10,1,2,1,1,8,2,5,1,3,7,17,1255,4,2,22,1,26,1,3,1,66,1,77,1,2,1,2,1,1,1,19,2,8,1,65,1,26,1,35,1,3,1,11,1,51,2,31,1,129,1,2,1,7,2,2,3,2,1,9,2,4,1,3,8,17,1255,24,1,4,1,6,1,90,1,72,1,30,1,57,1,18,1,72,1,221,3,31,8,4,2,3,1,12,1253,13,1,46,1,25,1,20,2,21,2,9,1,91,1,54,1,81,1,5,1,4,3,220,1,33,2,2,3,10,1,13,1253,4,1,1,1,1,1,19,1,1,1,4,1,19,1,34,1,15,1,2,1,13,1,5,1,1,1,139,2,35,1,62,1,1,1,3,1,3,1,103,1,126,1,5,2,10,1,8,1,1,3,4,1,1,1,17,1252,12,1,18,1,95,1,22,1,120,3,10,1,93,1,252,1,10,3,24,1252,36,1,71,1,17,1,7,1,175,1,21,1,42,1,7,1,84,1,162,1,9,4,4,2,18,1252,2,1,6,1,4,1,6,1,13,1,51,1,47,1,1,1,65,1,118,1,138,1,3,2,15,1,129,3,1,1,12,6,7,3,1,7,16,1252,29,1,13,1,14,2,25,1,40,1,35,1,111,1,32,1,153,1,151,2,14,1,1,6,3,15,1,1,12,1252,1,1,6,1,1,1,2,1,39,1,28,1,2,1,14,1,25,1,15,1,157,1,73,1,2,1,251,8,3,13,16,1252,62,1,24,1,6,1,6,1,4,1,46,1,146,1,1,1,28,1,29,1,12,1,5,1,85,1,162,1,5,3,1,16,14,1252,29,1,8,1,1,1,1,1,17,1,26,1,6,1,5,1,20,1,5,1,5,1,12,1,9,1,65,1,78,1,24,1,48,2,252,1,5,5,1,11,3,2,12,1252,28,1,35,1,17,2,44,1,14,1,2,1,12,1,2,1,162,4,47,1,76,1,57,2,20,3,100,1,1,2,1,11,3,1,13,1252,34,1,25,1,22,1,65,1,175,2,50,1,79,1,73,5,104,6,1,1,1,3,17,1252,11,1,30,1,6,1,327,1,74,1,4,1,73,5,95,1,6,1,1,5,4,3,18,1251,50,1,103,1,301,1,74,5,95,3,5,1,1,7,1,1,1,1,2,1,14,1252,13,1,50,1,35,1,56,1,218,1,134,1,21,3,95,5,2,1,2,11,2,2,14,1251,56,1,5,1,2,1,7,1,41,1,418,3,94,8,2,14,16,1250,110,2,2,1,44,1,375,2,93,25,1,1,15,1249,9,1,5,1,113,1,12,1,392,1,73,1,1,1,3,1,15,29,13,1249,57,2,1,1,44,1,270,1,8,1,7,1,74,1,140,6,15,30,13,1247,3,1,59,2,92,1,452,5,1,1,13,25,2,4,8,1,4,1247,7,1,3,1,2,1,18,1,52,2,32,1,508,26,2,4,2,1,11,1247,7,1,1,2,19,2,55,1,11,1,18,1,509,34,5,2,4,1247,1,1,1,1,26,1,54,1,203,1,13,1,301,1,17,3,3,4,1,31,3,3,1,1250,2,1,4,2,4,1,40,1,103,1,463,3,4,1,2,34,1,2,2,1249,96,1,8,1,506,1,11,2,1,1,2,37,2,1,2,1249,22,1,582,1,6,1,11,2,3,35,1,1,5,1250,6,3,1,1,1,1,22,1,569,2,5,3,1,1,6,2,2,40,4,1251,3,1,1,4,2,1,5,3,48,1,538,2,1,5,10,1295,12,1,2,2,1,1,3,1,122,1,343,1,118,7,5,2,2,1299,2,1,10,1,1,1,585,1,4,2,2,2,5,1303,15,1,3,1,3,1,568,1,15,1,2,2,2,1305,3,1,13,1,3,1,37,1,249,3,292,1,3,1,2,1310,10,1,44,1,4,1,32,1,216,2,137,1,154,1,5,1,1,1309,16,1,1,1,75,1,215,3,138,1,153,1,6,1309,46,1,264,3,273,1,23,1310,14,1,31,1,4,1,260,2,18,2,42,1,232,1312,2,1,45,1,281,1,8,1,259,1,11,1311,30,1,27,1,283,1,267,1312,14,1,314,1,9,3,16,2,21,1,199,1,1,1,13,2,10,1310,1,1,2,1,27,1,4,1,293,1,14,1,2,2,2,1,4,1,8,1,6,3,4,4,1,2,197,1,16,1,7,1313,4,4,21,2,312,2,4,3,3,2,8,1,8,1,3,2,1,1,4,1,57,1,137,1,16,3,4,1315,4,4,78,1,250,3,3,2,1,1,1,2,5,1,1,2,1,2,12,2,4,1,4,3,142,1,48,1,16,1,5,1,1,1,1,1313,3,7,43,1,199,1,85,1,1,3,1,2,15,2,4,1,6,2,1,1,1,1,223,3,1,1313,3,2,2,3,3,1,272,1,33,1,18,2,3,3,15,1,12,7,222,2,2,1317,99,1,235,1,2,1,30,1,3,1,1,2,222,1324,12,1,84,2,21,1,215,1,3,1,31,2,223,1322,374,1,223,1322,96,1,218,1,5,2,21,1,232,2,20,1322,577,1,21,1321,365,1,220,1,13,1320,353,1,235,2,8,1322,1,1,23,1,197,1,290,1,2,1,79,1,1,1321,21,4,1,1,326,1,247,2,1,1317,21,5,410,2,166,1317,17,1,2,6,409,1,1,1,6,1,4,1,151,1321,17,1,2,4,424,1,145,1,2,2,1,1320,15,1,2,1,4,2,573,1324,15,1,1,1,4,1,245,1,172,1,153,3,1,1324,15,1,423,1,155,1327,14,1,254,1,326,1324,15,2,17,1,26,2,3,2,529,1323,62,2,2,3,500,1,28,1323,15,1,11,5,3,4,27,1,210,1,319,1324,16,2,1,1,6,5,7,1,19,3,384,1,148,1325,15,1,1,1,2,3,3,1,1,4,1,1,2,3,20,3,535,1324,10,10,1,2,5,5,1,3,2,1,406,1,148,1,1,1324,10,10,1,2,4,2,1,2,1,5,1,1,21,1,383,2,148,1326,10,10,1,2,4,10,3,1,20,2,533,1327,7,13,2,2,2,4,1,3,3,2,19,1,1,1,334,1,49,1,1,1,145,1330,5,13,2,1,5,1,1,5,2,2,20,2,222,1,238,1,69,1331,5,13,2,1,3,10,2,1,21,1,368,1,12,1,2,3,1,1,134,4,3,1332,5,4,1,24,2,1,370,2,23,1,14,1,90,2,29,1,12,5,1,1317,1,14,6,29,2,1,370,3,29,1,3,2,1,2,135,3,2,1316,2,12,8,29,372,3,33,1,3,2,89,1,7,1,37,2,2,1318,1,12,9,28,405,1,2,1,3,1,90,1,45,1,2,1319,3,10,1,1,7,22,2,4,405,1,2,1,3,1,73,1,64,1320,3,10,12,19,3,3,330,1,74,1,2,1,129,3,10,1320,2,12,11,19,3,3,404,1,10,1,84,1,37,3,9,1321,2,14,9,19,3,3,25,2,378,1,2,2,2,2,1,2,121,9,2,1323,1,15,8,20,2,3,26,2,380,2,4,1,121,10,3,1339,8,20,2,1,28,2,380,3,124,5,2,2,4,1340,7,4,2,16,31,1,242,1,137,2,3,2,120,3,4,1,4,1341,10,1,3,13,41,1,6,1,368,1,1,3,103,1,21,1,3,1346,7,1,4,11,2,1,416,4,85,1,5,1,31,1,1,1,2,1349,4,1,3,9,1,3,2,1,406,1,8,5,85,1,14,1,21,2,1,1,1,1350,3,1,1,1,1,1,2,5,1,1,1,2,24,1,2,1,392,6,98,1,1,1,6,2,7,1,1,5,2,1350,5,1,4,6,5,1,24,4,2,1,380,1,5,5,5,1,9,1,84,1,9,1,9,5,1,1351,11,4,22,1,7,2,2,2,7,1,25,2,356,2,103,1,6,1,8,1,2,3,1,1351,7,10,2,5,20,2,6,3,3,1,23,5,355,2,119,1,2,1,2,1352,7,19,11,6,2,2,4,5,26,1,482,2,2,1352,3,2,1,18,1,2,11,6,3,1,2,1,2,3,508,1357,4,20,15,6,4,1,3,2,509,1358,3,20,15,7,6,1,1,1,359,1,21,1,127,1359,2,20,10,1,4,7,2,1,3,1,361,1,21,2,2,1,2,2,23,1,94,1360,1,1,2,2,1,15,15,4,2,1,2,2,364,1,24,2,2,1,117,1362,4,18,15,1,2,1,2,2,2,1,13,1,350,2,23,2,120,1362,3,19,4,1,10,1,5,5,227,1,137,1,23,2,99,1,19,5,1,1357,4,1,2,1,2,12,3,1,12,2,5,3,388,1,122,2,2,1358,4,1,5,14,1,1,13,1,6,1,1,1,352,1,34,2,16,1,104,2,2,1359,3,1,1,1,3,5,1,2,2,4,4,1,372,1,25,1,8,2,85,1,40,1358,7,6,3,8,24,1,473,1,16,1,17,1,4,1359,8,5,4,11,23,1,3,1,366,1,4,1,13,1,98,1,13,5,1,1,2,1358,9,3,1,1,2,8,1,1,1,1,4,1,19,1,7,1,363,3,13,2,66,1,2,2,10,2,29,3,1,1,1,1365,1,1,4,3,4,5,3,2,24,1,8,1,3,1,13,3,23,1,319,3,14,1,111,4,4,1364,7,2,5,1,1,2,2,3,51,4,22,1,292,1,10,1,15,3,126,4,4,1364,7,4,2,5,55,7,334,1,4,2,1,1,92,1,31,7,3,1363,7,13,1,1,14,1,37,7,339,1,2,1,93,1,17,1,14,5,3,1363,9,2,1,8,1,1,52,6,335,1,4,1,2,1,14,1,51,1,7,1,29,1,6,1,3,1,10,7,1,1363,10,12,4,1,1,1,24,4,1,1,20,1,340,1,16,3,58,1,34,2,4,2,9,6,1,1364,12,9,4,1,26,5,2,1,234,1,114,1,28,3,57,1,32,3,5,1,9,2,1,4,1,1362,7,1,4,13,29,4,384,1,108,1,2,4,1,1361,8,3,2,12,31,3,17,1,347,2,2,1,12,1,114,3,1,1361,8,2,3,13,44,2,225,1,127,1,4,1,11,1,42,1,70,3,2,1360,10,16,45,1,3,1,219,1,102,2,21,1,1,3,16,1,112,3,2,1361,10,16,49,1,323,1,24,1,16,1,75,1,37,3,2,1361,10,8,1,1,1,3,1,1,6,3,24,1,6,1,9,1,214,1,109,2,21,1,15,1,76,2,36,1,4,1361,3,1,6,10,3,1,1,1,5,2,10,1,13,2,227,2,4,2,104,1,1,1,1,1,21,2,134,1362,1,2,6,9,4,1,6,1,3,1,8,1,12,4,19,1,322,1,20,3,63,1,23,1,1,1,8,3,33,1365,4,1,2,6,26,2,9,1,1,6,17,1,213,1,127,1,1,2,88,1,1,1,8,3,34,1365,4,1,1,6,39,1,237,1,105,1,22,2,88,3,8,3,33,1367,4,8,20,1,382,4,16,1,82,3,33,1368,6,1,1,4,12,1,6,2,9,2,370,5,98,3,25,5,4,1369,3,1,2,1,29,1,250,1,98,1,27,1,1,1,66,1,32,2,26,4,4,1369,1,4,19,1,11,1,6,1,349,1,1,1,18,1,102,1,26,5,3,1367,2,5,19,1,65,1,271,1,32,1,38,1,111,4,2,1367,1,5,50,1,28,2,4,1,272,1,32,1,39,1,88,2,20,4,3,1372,3,1,5,2,34,1,2,1,1,2,26,2,311,2,41,1,107,4,3,1377,17,1,22,1,5,1,358,1,132,4,2,1377,17,1,54,1,354,1,10,1,50,2,47,1378,4,1,3,1,13,2,55,2,361,3,49,2,46,6,2,1370,1,1,5,2,10,1,4,1,10,1,5,1,28,1,2,1,3,1,2,1,350,1,1,2,8,1,51,1,14,1,1,1,31,5,2,1370,7,1,9,3,15,1,32,1,11,1,354,1,7,1,52,1,50,2,2,1370,15,5,49,1,363,1,18,1,43,1,46,3,1,3,2,1368,3,1,1,2,1,2,2,1,4,1,8,1,17,1,19,4,1,3,305,1,76,1,91,1,1,3,3,1368,2,11,11,1,17,3,18,6,307,1,170,2,4,1380,30,1,20,1,1,4,307,1,31,1,144,1381,20,2,3,2,1,1,21,1,1,3,309,2,110,2,12,1,48,1382,21,1,1,6,22,1,1,2,484,1372,1,9,24,4,24,2,265,1,214,1378,2,8,10,1,10,4,27,1,262,3,46,2,78,1,89,1378,1,7,9,3,2,1,1,2,3,4,28,2,5,1,256,2,125,3,1,1,40,2,44,1,1,1371,1,4,1,7,9,3,2,4,1,1,1,4,27,2,1,1,1,4,385,2,1,2,39,2,2,1,38,1381,2,3,1,1,9,5,1,6,1,2,1,1,11,1,14,1,2,1,1,1,391,5,35,6,39,1380,1,2,12,5,3,7,13,3,14,1,1,2,394,2,37,5,39,1380,1,2,12,14,14,5,9,1,438,3,2,1,37,1385,12,9,2,1,15,5,430,1,17,4,3,1,1,1,7,3,24,1385,11,9,9,2,7,6,456,3,6,1,26,3,2,1380,11,10,8,1,7,7,457,1,35,1,3,1380,9,10,5,2,11,7,375,1,80,1,39,1382,8,2,1,8,2,2,4,1,7,7,371,1,33,2,2,1,44,5,35,1,2,1379,5,1,3,3,2,8,1,2,12,8,20,2,351,2,20,1,1,2,7,3,43,6,3,2,7,6,20,1381,1,2,3,4,3,2,1,8,11,9,18,1,1,2,375,2,17,1,35,1,1,1,1,1,2,1,1,4,1,1,2,1,6,3,1,2,2,2,10,1382,4,6,3,12,1,1,6,9,10,1,1,1,5,2,1,2,354,1,16,1,3,1,55,1,2,3,1,3,6,1,7,4,3,3,8,5,1,1376,5,7,3,12,6,10,19,1,1,1,355,1,20,2,50,1,3,1,2,1,1,1,7,2,1,1,10,11,5,4,1,1378,4,7,2,11,2,1,3,11,9,3,6,2,20,1,164,1,84,2,4,1,101,1,53,1,1,1,1,2,9,4,11,11,5,2,2,1376,1,1,3,8,2,1,2,3,1,4,6,11,9,1,2,1,4,3,185,2,6,1,223,1,12,4,2,1,13,1,13,3,1,5,7,1380,2,9,2,1,2,8,5,11,11,2,7,1,19,1,264,1,40,5,81,1,24,1,28,2,1,7,5,3,1,1377,1,8,3,1,1,7,6,12,12,2,25,1,264,1,57,1,44,1,22,1,2,1,46,1,6,1,2,8,3,1378,1,1,1,2,1,8,3,1,2,3,6,12,4,1,8,1,278,2,48,1,12,1,3,2,2,2,66,1,11,3,44,8,1,1,2,1,2,1374,1,14,3,2,9,12,6,2,286,1,51,1,83,5,5,1,3,3,46,8,2,1377,1,14,1,4,8,13,4,1,1,3,2,1,3,1,7,1,9,2,71,4,81,1,32,1,69,3,38,1,78,2,17,1,10,1,34,1,8,1,4,1,3,3,3,1396,7,14,6,5,5,3,173,1,103,2,36,1,66,2,12,1,41,1,35,1,5,3,2,1382,2,7,1,1,1,3,5,15,3,1,1,5,288,1,3,2,71,1,9,2,2,1,3,2,2,3,1,3,7,2,2,2,39,1,47,1378,2,12,2,3,4,16,5,4,300,1,72,5,1,5,9,2,4,1,1,1,4,1,7,3,10,3,3,1,58,1,3,1375,1,1,1,11,1,1,4,1,3,17,5,3,8,1,6,1,7,1,268,1,58,1,21,2,1,1,2,1,1,4,14,1,8,1,5,4,3,1,6,5,59,1,3,1373,1,1,1,4,2,9,2,2,4,17,24,2,14,1,318,1,18,1,1,1,9,1,2,1,30,1,1,1,10,4,17,1,47,1373,1,1,2,3,1,11,1,1,3,18,20,2,1,1,2,1,12,2,371,1,18,2,73,1379,4,8,5,20,20,2,4,4,7,4,377,1,6,1,2,3,64,2,4,1,3,1372,2,18,3,19,20,1,1,1,4,5,7,4,29,2,305,1,3,2,2,1,4,1,18,1,11,2,1,5,66,2,9,1372,2,4,1,5,1,1,3,1,3,19,11,1,9,1,1,1,1,1,2,5,7,4,304,1,35,2,36,4,5,1,62,1,4,1,10,4,2,1364,1,4,2,3,1,4,7,20,6,4,12,3,1,7,9,2,194,2,83,1,58,2,37,5,67,1,4,1,12,1,3,1367,2,3,1,1,2,5,4,22,3,1,2,3,3,3,6,11,8,1,35,1,303,3,35,1,73,1,20,1368,2,6,9,26,3,2,4,3,6,1,3,1,2,6,2,1,3,1,7,1,207,1,121,2,30,2,5,2,7,1,65,1,21,1367,2,5,3,2,4,26,3,5,2,4,12,1,1,2,6,1,2,1,14,1,25,1,1,1,6,2,2,1,282,1,38,1,7,1,75,1,14,1365,1,7,2,2,4,25,4,4,2,5,25,1,8,1,31,1,1,4,2,2,3,1,253,1,1,1,36,1,30,2,71,1,3,1,3,2,7,2,5,2,1,1361,3,9,4,26,2,8,2,2,38,1,28,1,1,2,1,1,146,1,111,1,21,4,3,1,13,2,28,3,69,2,3,3,1,2,11,1368,2,6,1,1,5,37,8,1,1,1,61,1,146,1,134,2,3,1,17,1,99,3,4,5,11,1369,3,5,6,38,5,6,58,1,267,1,20,2,116,4,5,3,7,1,5,3,1,1364,3,4,7,38,4,7,58,1,2,2,278,4,28,1,91,5,5,1,3,1,5,1,5,1367,3,4,6,38,8,2,1,4,60,1,228,1,24,4,20,3,11,1,123,2,1,1,3,2,2,1369,1,1,2,1,2,1,4,37,9,2,1,4,18,1,41,1,62,1,64,1,194,1,76,2,2,6,6,4,3,3,1,1368,2,4,7,37,9,2,2,2,4,2,455,1,3,6,4,6,6,1369,2,4,6,38,8,3,2,3,3,2,4,1,46,1,2,1,1,1,63,1,208,1,126,7,6,8,5,1368,1,2,1,3,5,38,9,2,1,3,4,2,4,1,49,1,1,4,395,8,6,7,3,1,5,1,1,1363,2,1,1,2,6,37,11,5,9,1,1,1,47,2,1,5,290,1,103,8,6,3,1,11,1,1,2,1362,1,5,5,38,25,5,44,1,74,2,199,1,127,8,9,14,1,1362,1,2,8,38,26,4,295,2,14,1,6,1,129,8,10,12,2,1362,1,2,1,1,6,37,2,2,7,2,16,6,10,1,163,1,131,2,136,7,10,12,2,1367,6,42,6,2,16,2,2,2,8,5,32,1,260,1,139,6,10,11,2,1369,1,1,3,42,6,2,6,1,1,3,5,1,4,1,9,4,289,2,138,1,4,5,12,8,2,1372,3,42,5,1,10,1,11,1,1,2,7,2,291,2,128,1,15,3,7,3,5,2,1,4,1,1369,5,37,1,4,1,1,24,1,5,1,7,2,437,2,3,2,3,5,3,1378,1,1,1,38,1,8,3,1,18,1,13,2,19,1,418,1,3,3,2,5,3,2,1,1373,1,1,3,44,4,1,3,1,369,1,100,2,2,3,2,1,2,3,2,1377,4,41,1,1,3,1,3,1,317,3,155,5,3,4,3,1375,4,43,1,4,266,1,54,2,154,1,1,5,3,6,2,1374,3,43,3,5,1,2,305,1,9,1,148,4,4,7,2,8,2,1373,3,39,1,2,9,5,302,3,156,5,3,9,1,9,2,1372,2,37,17,3,301,6,155,4,3,20,2,1371,1,38,6,1,9,5,3,2,294,1,160,2,2,1,3,21,2,1370,1,38,4,4,3,1,2,3,1,1,5,2,288,1,174,21,2,1409,6,1,5,5,7,1,286,2,1,2,1,1,78,1,92,21,2,1409,12,5,282,1,188,5,1,16,4,7,1,1398,5,1,1,2,5,4,26,2,10,1,257,1,173,24,3,1406,5,3,7,3,26,1,3,1,253,1,185,11,1,1420,5,5,6,3,1,1,282,2,183,13,1,2,2,1414,7,3,9,2,283,1,9,1,174,7,1,21,1,1402,8,2,33,1,266,1,4,2,172,31,1,1401,7,1,10,1,284,1,6,2,1,3,149,2,20,31,1,1403,7,1,9,1,23,1,8,1,295,1,117,2,20,1432,1,2,1,1,6,3,6,2,4,1,16,1,242,1,180,2,20,2,1,1428,1,4,1,2,3,3,6,4,1,4,9,4,245,1,180,2,19,1431,3,3,1,1,4,3,8,2,2,1,1,2,7,4,448,1430,4,1,6,1,1,5,3,1,2,4,9,6,22,1,2,1,392,1,29,1430,4,1,6,8,6,3,4,1,3,7,16,2,3,2,29,1,377,2,16,1427,10,2,3,7,1,1,1,2,1,4,8,1,1,1,1,1,17,2,4,2,424,1427,17,5,2,2,3,3,7,8,1,1,2,1,16,3,347,1,76,1425,4,1,4,1,7,2,1,1,5,1,1,1,1,1,11,2,25,4,347,1,75,1424,18,4,5,1,1,2,9,1,21,2,6,3,272,2,74,1,75,1423,18,4,4,6,34,1,4,4,423,1423,18,4,5,8,14,2,20,1,426,1422,19,2,6,2,3,2,13,3,6,2,13,2,426,1421,19,4,10,1,9,9,4,3,1,1,1,1,9,1,427,1420,22,1,4,4,1,3,10,1,2,2,1,1,5,1,1,4,43,4,391,1419,16,2,8,9,23,5,43,7,389,1418,14,3,10,6,1,4,22,3,6,1,35,10,169,1,153,2,62,1418,13,5,10,5,2,1,25,4,3,3,4,1,30,3,1,4,389,1418,12,5,4,2,1,1,2,4,1,4,2,1,22,3,4,1,375,1,58,3,1,1414,2,2,1,2,3,7,5,6,1,1,4,1,1,6,3,1,11,1,2,3,440,3,1,1413,2,6,3,6,5,7,5,4,1,3,5,1,10,8,287,1,151,2,1,1412,2,2,1,3,2,7,6,8,3,5,1,2,6,1,13,1,1,1,259,2,53,1,94,1,32,1,1,1412,6,2,1,8,1,1,4,8,2,4,1,1,20,1,264,5,51,1,69,1,58,1412,3,2,3,11,4,4,2,1,29,1,135,1,102,1,3,1,20,8,112,1,6,1,9,2,44,1,2,1412,2,1,2,1,1,12,1,7,2,1,267,1,3,1,23,2,1,1,2,4,118,1,46,8,1,1412,2,1,3,25,64,1,233,9,116,1,38,15,1,1412,2,1,3,16,1,8,10,4,5,1,1,1,38,5,191,1,45,4,116,1,27,1,4,3,3,4,2,4,1,5,1,1412,2,1,1,17,2,8,5,1,4,2,7,1,1,1,37,5,81,1,121,1,37,1,116,1,28,3,3,3,14,3,1,1412,1,19,1,9,1,1,7,2,3,1,8,1,34,6,42,3,5,1,153,2,165,1,14,3,22,3,1,1412,1,19,1,3,2,3,13,3,8,2,32,6,40,13,153,1,181,1,25,1,1,1432,20,3,1,1,8,3,28,9,38,19,6,5,1,7,116,1,223,1433,16,1,2,3,1,1,38,7,37,24,1,19,161,3,174,1433,16,6,4,1,5,2,28,6,27,4,5,47,162,1,149,2,9,1,13,1434,14,4,4,2,1,2,4,3,4,1,22,4,26,61,160,2,159,1,13,1435,16,1,3,1,10,2,26,4,24,68,156,2,156,3,14,1437,18,1,5,3,2,2,21,2,1,6,24,72,152,2,172,1439,18,1,5,1,3,2,20,10,17,1,5,74,151,2,172,1441,15,3,4,1,24,10,14,86,212,1,110,1442,15,2,4,1,22,11,12,89,212,2,36,1,1,1,70,1442,16,2,24,11,12,93,211,1,36,1,71,1446,10,1,21,1,4,11,12,95,233,1,47,2,37,1447,9,1,24,12,11,97,269,1,50,1447,32,11,12,99,270,1,7,1,40,1448,30,14,10,100,271,1,48,1446,30,13,10,102,279,1,40,1446,29,12,9,104,321,1446,3,1,24,12,8,106,251,1,68,1447,3,1,22,14,8,106,129,1,186,2,2,1446,29,12,3,110,256,1,1,1,38,1,19,1,3,1447,3,1,25,7,4,112,298,2,16,2,4,1449,1,1,23,9,4,112,316,2,4,1449,10,1,1,2,11,9,4,111,86,4,189,1,36,2,4,1449,4,1,5,6,1,2,6,124,88,3,189,1,37,3,2,1449,4,1,4,1,3,6,4,126,87,2,191,1,36,4,2,1449,8,2,3,1,2,2,4,4,2,120,88,1,229,4,2,1450,4,1,2,1,6,1,1,1,4,3,4,118,209,2,107,5,2,1450,13,1,2,1,4,1,6,117,211,1,106,5,3,1450,4,3,4,1,3,2,3,1,6,116,320,5,3,1449,4,6,1,2,2,1,1,1,8,65,3,47,323,4,3,1450,6,3,5,1,10,53,3,8,7,43,325,3,5,1449,14,1,5,1,4,53,7,2,13,38,265,2,59,3,5,1448,7,1,1,1,2,1,1,2,9,51,28,33,267,1,59,4,3,1,1,1449,6,1,1,1,2,4,9,49,32,30,328,6,1,1,1,1449,1,8,7,1,6,48,36,25,331,6,4,1447,2,9,9,50,40,20,102,1,231,5,5,1447,2,10,3,1,4,39,56,8,342,4,5,1446,2,1,1,8,4,1,3,40,226,1,181,2,6,1446,1,1,1,9,3,1,3,39,227,1,181,1,7,1442,1,18,4,40,226,2,108,1,79,1444,2,3,1,10,5,34,171,3,110,1,138,1440,5,4,1,7,7,34,171,1,251,1440,3,1,3,2,5,1,10,32,332,1,89,1,2,1439,3,1,3,3,15,30,38,1,175,1,118,1,89,2,2,1439,1,5,1,3,2,1,7,1,1,1,2,31,212,4,208,1,2,1437,2,11,8,37,212,4,203,2,5,1449,10,34,214,4,203,2,3,1,2,1437,1,10,12,30,335,1,61,1,22,1,2,2,2,2,3,1436,1,10,13,28,27,1,401,1,3,1436,1,3,2,1,1,3,13,26,29,1,406,1435,2,1,18,12,3,12,439,1434,21,9,7,11,10,2,327,1,88,1,9,1435,1,2,1,3,14,9,7,11,3,4,431,1435,1,2,1,2,1,1,6,2,4,10,6,19,423,1,8,1433,1,1,2,2,1,2,6,3,3,35,2,1,423,3,4,1,1,1430,1,1,1,3,3,1,5,3,3,27,2,7,182,5,140,1,40,1,55,5,1,1,3,1,5,1423,1,5,3,2,3,1,2,1,4,25,432,2,1,4,1,2,5,3,2,1422,1,11,2,1,1,1,5,25,94,1,337,2,2,2,1,2,2,2,7,1437,1,2,3,1,1,23,285,1,155,1,2,3,6,1424,3,4,1,2,2,4,5,22,443,4,2,3,2,1421,2,2,1,1,1,5,3,4,5,22,449,3,1,1427,3,1,3,1,3,2,1,1,4,21,440,1,6,1,1,4,1,1425,9,1,3,1,3,1,4,13,5,2,439,1,2,3,4,1,1,1,2,1423,15,1,4,2,2,11,8,2,449,1,3,1421,6,1,2,2,5,3,3,2,3,10,401,1,47,1,7,4,2,1422,1,9,2,1,2,3,4,1,4,6,1,1,36,1,265,1,145,1,7,1,1,3,3,1,1,1430,5,4,2,1,1,1,4,5,28,1,9,1,357,2,5,1,46,2,2,2,2,4,3,2,1,1429,5,5,3,2,5,4,29,1,3,1,2,6,8,1,344,3,49,1,1,3,2,5,2,1,6,1430,2,3,1,3,3,2,6,3,38,1,239,1,112,1,1,2,1,2,52,2,2,8,3,1,1,1431,2,1,3,2,1,1,2,2,7,1,35,1,15,1,227,1,112,1,2,1,57,11,1,1,2,1431,10,3,8,1,51,1,226,3,111,4,57,8,6,1431,12,2,8,1,51,1,225,1,1,1,2,1,109,5,50,1,6,7,5,1432,15,5,2,2,49,2,227,1,171,1,6,3,4,1433,16,4,2,3,323,2,123,3,5,2,5,1434,11,1,3,6,1,2,28,1,2,2,9,1,4,1,228,1,40,1,1,1,4,2,121,3,1,3,6,1,1,1436,16,4,3,1,27,1,2,2,415,1,1,3,7,1437,17,4,4,1,39,1,404,5,8,1437,17,6,3,1,12,1,2,2,1,1,16,1,380,1,28,4,9,1435,20,4,3,1,7,1,4,5,28,2,368,1,42,1435,20,4,2,2,12,1,1,3,16,1,254,1,4,1,87,1,76,1436,18,9,15,2,19,1,1,1,243,1,4,1,5,1,160,1439,19,9,2,1,12,2,19,1,15,1,229,1,171,1438,20,10,17,1,35,1,188,1,209,1440,10,1,8,10,50,3,391,1,5,1441,3,3,5,1,8,12,11,2,8,1,285,2,137,1453,1,2,7,14,10,1,293,1,138,1457,7,14,10,2,19,1,270,1,1,1,139,1459,5,13,29,4,271,2,137,4,1,1456,3,14,29,2,268,2,2,2,138,2,4,1455,3,14,20,1,8,2,25,1,214,2,4,1,20,3,143,2,3,1455,3,15,19,1,8,1,22,7,212,1,25,3,1,1,142,1,3,1456,4,15,18,1,29,10,237,5,141,1,2,1458,4,16,46,11,240,2,141,3,1,1457,4,17,45,11,239,3,142,2,1,1,4,1450,6,18,30,2,13,11,238,3,141,2,1,1,5,1450,6,18,43,12,237,1,1,3,152,1448,7,18,18,1,6,2,15,11,237,6,73,1,80,1447,5,18,26,1,3,1,10,1,1,10,238,1,1,4,140,2,12,1449,3,18,36,16,239,6,82,1,57,3,9,1472,36,15,240,5,81,2,57,6,9,1471,30,1,4,13,64,2,175,6,140,5,2,3,3,1,1,1,2,1469,8,5,20,11,1,1,64,3,175,5,142,3,3,4,2,3,5,1470,5,4,19,12,63,6,174,6,143,1,4,7,6,1,2,1469,5,4,13,1,1,14,64,6,174,4,152,1,1,1,5,2,5,1471,1,10,1,22,65,7,173,4,155,4,2,2,4,1505,63,10,172,1,1,3,153,5,3,1,5,1504,61,12,171,1,2,2,154,3,2,1,3,4,3,1501,60,14,172,1,1,1,154,7,4,3,3,1501,54,20,123,1,49,1,107,1,47,6,5,3,3,2,1,1497,55,21,170,1,78,1,78,4,12,1,5,1494,55,23,169,1,173,1,4,1495,55,24,2,1,186,1,103,1,6,3,1,5,33,1,4,1495,54,25,2,1,133,1,163,1,5,4,36,1497,51,23,305,2,3,4,36,28,1,3,4,80,1,1380,47,26,299,1,7,1,3,4,3,1,30,28,1,1,9,1461,43,1,2,26,1,3,301,6,2,3,2,1,26,1,3,1,3,1,2,19,14,1461,42,31,305,4,34,1,1,1,9,2,2,10,21,1,3,1455,41,2,2,27,2,2,300,1,1,8,28,4,3,2,3,1,4,7,22,4,3,1456,43,32,212,1,86,3,1,2,3,2,33,1,31,2,6,3,6,1457,40,33,294,1,1,5,5,4,65,1,4,4,8,1464,31,35,293,1,1,1,1,4,3,7,66,4,12,1469,23,36,296,4,3,11,63,3,15,1473,13,40,292,1,2,5,1,13,2,1,61,1,18,1474,3,46,292,1,2,5,2,9,2,2,85,1521,296,4,1,10,2,3,2,1,83,1519,100,1,193,13,5,1,81,2,8,1517,232,1,59,8,1,6,1,1,85,2,10,1514,233,1,60,13,89,1,14,1510,295,13,78,1,9,1,7,4,6,1506,221,1,56,2,18,6,1,5,93,6,3,2,2,1505,303,1,1,5,1,1,7,1,34,1,43,1,5,5,8,1504,296,1,68,2,17,1,32,1503,324,1,2,2,36,3,49,47,1,1456,276,1,9,2,36,1,1,2,36,4,16,1,32,1505,283,1,41,1,40,1,14,1,35,1504,380,1,36,1504,236,1,50,1,13,1,23,1,1,1,10,1,2,1,79,1500,268,2,1,2,11,1,2,1,13,1,40,2,81,37,2,1457,236,1,31,5,6,1,5,2,14,1,25,1,14,6,81,33,2,1457,53,1,180,6,28,5,69,7,35,1,8,1,36,32,2,1456,52,2,181,7,27,6,14,1,11,1,42,4,46,3,34,31,3,1455,235,8,27,5,9,1,1,1,13,2,41,1,2,1,13,2,33,2,34,32,2,1455,236,7,1,1,26,5,9,1,15,2,41,3,15,1,6,1,27,1,35,29,4,1454,238,5,30,4,8,1,16,2,95,1,5,1,22,3,3,29,3,1454,242,1,4,1,26,5,20,2,2,4,32,2,59,3,12,1,13,3,3,29,3,1453,123,1,13,1,114,1,1,1,20,3,22,2,2,1,1,1,34,2,83,3,3,2,3,27,4,1452,255,1,20,3,25,2,1,5,2,4,23,3,64,3,16,3,6,1,1,27,4,1452,277,2,16,1,5,22,18,2,38,1,27,1,29,25,5,1451,295,1,5,27,14,2,38,1,1,1,8,2,22,4,7,1,2,2,1,1,5,27,3,1451,291,1,4,1,2,34,16,2,32,4,4,4,4,2,8,1,8,1,10,1,1,2,1,1,5,28,1,1451,296,42,12,1,41,4,10,1,3,1,1,1,8,1,4,1,3,8,2,29,1,1451,289,52,14,1,32,1,5,2,5,2,2,3,4,1,8,1,4,2,2,3,1,1,1,1484,273,1,1,1,10,1,1,57,32,1,14,1,20,1,13,3,1,10,1,27,1,1451,276,2,8,61,28,3,7,1,3,1,1,5,17,1,14,1,1,3,2,3,1,2,1,27,1,1450,278,1,6,66,25,4,11,6,16,3,7,1,7,2,1,4,1,1,3,26,2,1450,278,1,6,68,22,4,2,2,9,4,17,4,10,1,5,3,1,2,1,1,3,1,1,23,2,1450,104,1,125,1,48,1,3,72,8,2,15,3,9,4,17,4,14,1,2,1,1,4,4,24,2,1451,231,1,32,1,17,75,17,2,1,1,1,1,2,1,2,3,1,1,3,1,1,1,16,6,2,1,5,1,4,2,1,3,1,1,3,1,1,15,1,8,2,1450,227,1,53,1,1,77,30,1,20,8,2,1,1,7,1,3,1,7,2,1,3,21,1,1451,227,1,5,1,46,2,2,78,20,5,23,10,2,22,2,1,1,10,1,9,2,1450,227,2,52,91,11,4,23,12,1,22,2,10,3,9,1,1451,228,1,52,94,20,1,15,11,3,20,2,12,1,8,2,1451,280,93,20,2,1,3,13,7,6,31,1,2,2,7,1,1451,280,93,25,1,16,4,6,3,1,18,2,9,1,1,1,7,1,1452,228,1,7,1,41,101,19,1,1,3,18,2,4,19,4,8,2,7,2,1451,117,1,119,3,30,1,8,101,1,4,14,1,2,2,15,2,1,3,3,20,4,1,4,3,1,6,2,1452,100,1,14,3,150,1,1,2,7,110,28,9,3,19,10,7,3,1453,115,1,126,1,28,2,5,113,26,9,2,13,2,1,14,2,1,3,3,1453,110,1,2,3,147,2,8,2,4,115,24,21,21,2,5,1454,111,5,153,1,3,123,18,2,3,4,1,15,18,3,1,1,4,1454,109,1,1,4,149,1,10,125,20,3,5,11,17,1,1,3,1,1,3,1455,109,1,1,4,9,1,123,1,26,128,17,2,7,6,21,4,4,1456,109,7,132,2,25,132,24,4,20,6,2,1458,107,5,105,1,1,1,28,2,25,135,43,1467,105,1,4,1,9,1,145,1,8,138,42,2,3,1460,250,1,25,141,39,1465,250,1,3,2,19,144,27,1475,253,3,19,148,15,1482,276,1644,125,1,150,1645,109,1,166,1644,107,3,164,1,1,1645,106,1,167,1646,108,2,11,1,103,2,47,1647,107,3,164,1646,100,2,6,5,24,1,94,1,30,1,3,1,6,1647,109,1,121,1,39,1649,109,2,122,1,37,1649,108,2,125,2,26,1,6,1651,108,1,156,1,4,1650,265,1,4,1650,98,1,172,1649,98,3,29,1,140,1649,100,3,166,1652,100,2,114,2,52,1650,122,2,92,3,36,1,15,1650,28,1,2,1,92,2,90,3,49,1,2,1649,32,1,185,2,49,1650,30,1,90,1,98,2,47,1633,1,3,2,12,121,2,96,3,46,1634,7,1,2,8,267,1636,11,6,28,1,7,1,2,1,227,1636,12,6,22,1,5,2,9,1,226,1637,14,3,23,1,5,1,5,1,229,1639,39,2,6,1,9,1,223,1640,40,1,6,2,6,2,223,1640,41,1,113,1,125,1640,39,3,111,2,125,1641,39,1,54,1,57,2,125,1641,280,1641,279,1642,70,1,208,1642,54,3,211,1,10,1642,55,2,9,3,80,1,118,2,8,1643,66,3,198,3,8,1643,61,1,3,3,77,1,132,1643,54,1,9,1,1,2,76,1,126,1,6,1643,64,5,71,1,2,1,125,1,7,1644,63,5,201,1,7,1644,64,5,198,2,8,1644,65,2,210,1644,65,3,210,1643,65,2,211,1643,58,3,4,1,7,3,203,1642,58,3,1,2,1,2,7,1,198,2,4,1642,57,2,4,2,2,3,120,1,83,1,1,1646,51,1,3,3,7,5,117,3,85,1646,50,1,2,5,3,1,2,7,200,1650,54,2,8,5,12,1,187,1652,65,4,11,1,176,1,10,1653,57,2,5,2,1,1,13,1,19,1,156,2,6,1656,54,1,1,1,6,4,189,1,6,1659,53,5,5,3,196,1660,51,2,4,3,200,1661,51,3,1,2,2,2,191,4,4,1661,49,2,1,1,87,3,110,1,5,1661,52,1,78,1,9,2,101,3,7,1,4,1662,52,1,22,1,67,1,100,3,6,1,5,1662,57,1,96,1,89,1,2,1,6,1,3,1663,56,1,2,1,93,3,98,2,1,1664,146,2,6,1,1,1,95,3,1,1665,155,2,97,1667,70,1,84,1,98,1667,245,2,7,1667,147,1,97,3,6,1667,233,3,8,4,6,1667,245,5,4,1667,253,1668,151,1,73,1,11,2,14,1667,153,1,71,2,12,1,5,1,8,1667,153,2,99,1667,56,1,97,1,78,1,4,2,14,1666,57,1,97,1,99,1666,89,1,65,1,28,1,41,1,19,1,8,1664,157,1,23,1,4,1,32,2,16,1,19,1663,158,1,24,1,4,3,29,2,16,1,9,1,8,1664,159,1,30,1,30,1,5,1,8,1,10,2,2,1,6,1662,129,1,31,1,60,1,2,1,3,1,9,2,2,11,5,1661,130,1,12,8,12,2,29,1,33,1,2,2,8,3,1,10,4,1662,140,12,11,2,31,1,9,1,22,1,1,2,7,14,3,1663,67,1,64,4,2,17,10,2,30,1,7,1,8,1,8,1,7,2,4,1,4,10,5,1645,3,16,66,1,1,1,60,9,5,1,4,10,1,1,6,2,18,4,6,2,16,1,7,3,5,4,2,1,5,9,5,1645,6,4,1,10,126,9,12,2,1,1,3,7,4,2,10,1,8,4,30,3,6,5,7,9,5,1645,7,2,3,8,66,1,59,6,3,2,10,1,9,12,4,4,1,2,7,5,3,1,25,3,5,6,8,9,2,1646,8,2,6,3,68,1,58,4,8,1,21,10,2,25,26,2,5,4,5,1,3,1657,10,1,77,1,58,3,32,37,24,3,13,2,4,1654,148,3,33,37,24,3,3,1,5,2,2,1,5,1654,149,1,34,38,23,3,3,2,4,2,2,1,4,1654,147,2,1,1,35,6,1,29,23,4,3,3,3,1,1,1,5,1654,36,1,148,8,1,3,2,10,8,6,22,5,4,8,4,8,2,1645,36,1,149,1,3,7,2,6,13,7,7,2,12,6,3,6,4,9,2,1645,36,1,149,1,3,13,14,12,2,2,13,7,2,6,2,10,2,1645,22,1,15,1,153,1,3,7,9,23,4,3,6,3,4,19,1,1645,39,1,157,5,9,1,1,26,5,1,5,2,2,8,1,12,1,1642,24,1,2,2,171,4,9,33,4,1,2,4,2,3,3,12,1,1642,28,3,171,2,9,37,6,1,3,2,3,1655,28,3,182,40,8,17,2,1640,15,3,10,6,3,1,174,44,7,16,1,1640,15,5,10,2,1,1,178,47,5,15,2,1639,15,5,12,1,178,51,4,14,1,1639,15,5,14,1,74,1,100,57,1,10,2,1,1,1638,17,3,90,1,52,2,2,1,41,63,3,4,1,1640,18,3,144,2,1,1,39,1713,167,2,40,1711,168,9,29,1,3,1709,26,1,144,9,26,3,1,1711,34,1,137,11,22,1715,24,1,1,2,6,1,1,1,3,1,133,11,19,1717,23,1,1,7,2,1,1,1,3,1,135,10,18,1717,25,4,1,1,1,5,139,11,15,1718,26,12,5,3,129,13,14,1718,22,1,4,5,1,1,1,4,3,5,131,16,7,1720,18,1,1,3,6,10,2,7,130,6,1,1736,16,2,1,4,4,4,1,1,1,2,6,3,2,1,130,3,4,1735,17,6,5,3,2,1,2,1,5,4,2,1,125,2,10,1735,18,5,4,3,1,2,8,6,1,2,124,1,11,1735,19,4,3,9,6,8,3,4,50,1,78,1736,19,5,1,12,4,9,2,2,131,1735,19,1,1,2,2,5,1,2,2,3,4,9,3,1,129,1737,15,2,1,3,3,5,1,5,1,2,5,8,2,3,107,1,18,1739,14,6,2,1,6,2,1,2,1,1,5,2,2,3,2,1,2,1,108,3,15,1741,14,10,5,2,1,3,2,1,1,1,1,1,1,3,4,1,111,3,13,1743,15,9,4,9,1,6,3,1,5,3,109,1,11,1744,14,8,7,5,1,1,4,5,9,2,120,1745,15,5,2,1,6,4,8,7,106,2,3,7,10,1746,10,5,1,1,2,1,8,3,11,1,1,3,106,1,4,2,1,4,6,1,2,1747,9,1,2,2,1,1,3,1,2,2,2,4,123,1,4,1,9,1,4,1748,12,2,2,1,2,1,6,4,2,1,1,1,124,1,9,2,1,1749,13,1,8,1,3,4,2,1,1,4,5,5,110,2,7,1,1,1752,12,1,2,1,9,7,4,1,5,3,1,3,120,1752,24,8,4,1,6,3,1,1,119,1754,12,3,9,8,3,2,4,1,4,3,90,1,21,1,3,1756,28,3,5,1,78,1,22,2,19,2,3,1757,10,2,16,4,6,1,13,1,62,2,21,3,18,1762,7,5,1,1,14,4,2,1,78,1,24,2,14,1766,9,1,2,2,16,3,1,1,104,2,9,1772,26,1,4,4,103,1782,27,1,3,4,104,1782,30,2,107,1782,29,1,1,2,1,1,104,1782,138,1783,30,1,97,1,9,1783,128,1,9,1783,21,1,104,2,10,1783,126,1,11,1783,28,1,96,2,10,1784,125,2,10,1784,125,2,10,1784,11,4,109,2,12,1783,14,2,1,1,105,3,11,1784,14,1,1,7,100,4,10,1784,14,1,2,2,103,5,8,1,1,1784,8,1,2,1,110,6,7,1,1,1784,83,1,37,6,8,1,1,1784,121,5,11,1784,64,1,56,5,8,1,1,1785,63,2,55,6,8,1,1,1785,63,1,1,1,54,6,9,1786,61,1,1,1,1,1,53,7,8,1787,34,1,83,8,8,1787,31,1,87,7,8,1787,118,8,8,1787,118,8,7,1788,118,8,6,1789,119,6,8,1788,118,7,7,1789,118,7,7,1789,118,6,8,1789,118,6,7,1790,118,5,3,2,3,1790,69,1,48,4,9,1790,118,3,9,1791,82,3,33,3,9,1791,81,4,33,2,9,1792,81,2,34,3,9,1792,117,3,1,3,4,1793,117,6,5,1793,117,6,4,1794,117,8,2,1794,116,1,1,7,1,1795,118,5,3,1795,118,5,2,1796,117,5,3,1799,1,1,112,6,1,1797,3,2,4,1,4,1,102,1804,3,3,2,2,5,1,16,1,83,1805,3,4,2,2,105,1805,7,1,1,4,103,1805,26,2,87,1806,25,3,87,4,2,1800,25,4,4,2,80,3,3,1799,28,4,84,1803,30,6,82,1802,32,5,81,1804,11,3,5,3,4,2,1,1,2,3,75,1,4,1805,11,4,4,1,1,3,2,2,1,3,17,1,66,1804,12,3,9,1,2,5,85,1803,4,8,2,3,11,2,87,1804,4,7,3,2,12,1,1,1,87,1804,2,9,2,2,12,3,87,1814,5,3,9,3,86,1815,6,2,2,3,4,3,86,1807,1,3,6,2,3,6,4,2,87,1807,1,4,5,2,3,7,3,1,87,1809,2,2,3,2,1,3,1,7,91,2,1,1816,1,1,3,2,68,2,23,4,1,1808,1,2,1,5,3,2,67,4,23,4,1,1796,1,11,1,1,1,6,1,1,69,6,22,3,1,2,2,1793,1,11,6,4,57,4,1,1,6,8,19,4,1,3,2,1803,1,1,6,3,56,9,4,10,18,3,2,1,4,1789,1,3,2,9,7,3,54,11,4,11,11,1,4,4,6,1791,1,13,7,2,54,11,5,13,19,1,4,1799,2,2,1,2,6,3,51,14,2,18,1,1,13,1,5,1798,1,1,2,1,5,1,3,3,27,2,18,40,7,1,5,2,4,1799,8,1,4,3,45,44,2,1,8,4,2,1788,1,1,1,8,8,2,51,48,7,3,3,1791,1,9,7,1,51,48,6,1787,1,4,2,3,1,11,2,1,3,1,49,50,6,1788,1,2,3,11,1,3,52,2,1,52,4,1791,4,1,1,4,1,4,1,4,51,55,4,1791,5,3,4,3,2,3,50,56,4,1791,1,1,4,1,1,3,1,4,1,2,51,45,2,8,5,9,2,1767,1,12,1,2,2,1,1,3,1,5,5,1,45,48,2,8,4,10,2,1759,2,3,1,2,1,4,1,10,6,10,47,50,2,7,4,10,3,1765,1,16,3,1,2,7,1,3,42,3,1,50,5,3,5,10,3,1789,3,6,46,52,12,7,6,1773,1,5,1,10,6,2,46,53,11,9,4,1773,1,4,1,12,5,1,46,57,8,11,1,1779,3,9,3,1,2,1,45,1857,5,4,3,1,6,1,47,1854,5,4,1,3,1,4,4,1,43,1817,3,34,1,2,3,2,2,12,44,1832,1,22,1,2,4,3,2,12,41,1832,1,20,1,11,3,1,2,2,1,3,44,1853,1,5,1,5,6,1,3,1,45,1858,4,1,12,1,1,1,42,1852,1,6,4,1,14,1,41,1854,1,7,1,1,2,1,3,2,50,1849,2,1,1,8,1,9,48,1851,1,11,1,8,46,1866,2,8,46,1866,1,9,45,2,1,1,2,1842,1,15,1,11,46,1805,1,49,1,8,1,9,47,1817,1,29,1,7,1,18,1,1,44,1817,2,55,46,1818,3,8,1,37,1,4,1,3,44,1818,5,32,1,16,1,2,45,1,1,1817,5,50,41,1825,5,50,40,1,1,1823,3,55,39,1,3,1820,3,45,1,2,2,1,1,6,29,1,4,3,5,4,2,1811,4,31,1,13,3,1,2,7,29,1,3,3,6,1816,3,32,3,12,5,1,4,4,32,2,1,1,1,1,3,1816,3,48,3,6,2,1,34,1824,3,2,1,30,1,11,1,2,3,6,7,3,31,1820,3,1,3,44,3,8,1,1,38,1,1,1816,12,20,1,6,2,11,2,1,1,8,38,2,3,1813,14,3,1,12,1,8,7,5,6,4,41,1819,7,4,3,3,2,10,2,8,7,1,4,1,23,4,18,1,3,1820,6,2,1,6,6,2,2,3,3,8,10,4,18,1,5,3,16,6,1,1818,6,9,4,1,11,8,32,1,5,2,18,1,1,2,3,1816,8,11,10,10,7,1,5,4,23,1,21,1,3,1815,9,11,10,7,18,1,12,2,5,6,22,2,2,1814,12,3,3,3,9,7,6,1,10,2,12,3,4,4,24,3,1,1814,9,2,1,2,10,1,2,10,5,2,4,3,2,3,5,2,5,11,6,1,17,1818,9,1,16,12,10,8,12,4,1,2,2,4,1,2,2,1,8,1,7,1819,26,11,10,7,1,1,4,1,6,5,1,2,1,5,1,2,1,1,8,2,3,1822,7,1,18,13,5,2,1,4,1,1,14,14,2,5,8,1826,4,4,17,12,5,8,2,1,14,14,2,4,9,1826,2,2,2,1,17,4,1,6,7,8,17,12,5,1,3,1,7,1826,25,10,7,4,7,3,6,1,3,10,19,1827,5,1,21,3,2,1,8,3,6,3,1,6,1,14,3,1,14,1829,4,1,49,2,1,1,2,21,11,1831,3,1,49,1,2,2,1,15,1,4,10,1833,52,1,4,21,6,1,1,1835,43,4,10,4,3,2,1,3,1,4,9,1875,2,7,12,1,1,1,3,1,7,4,8,1883,2,2,13,3,1,1,3,4,9,1890,2,1,9,3,5,2,9,1893,2,1,6,3,7,2,9,1883,3,8,4,1,4,1,1,1,6,1,8,1883,4,7,9,1,1,3,7,1,1,1887,4,9,9,1,11,1887,4,9,20,1902,19,1903,2,1,7,1,6,1902,4,1,4,1,8,1903,19,1903,18,1903,18,1904,15,1909,10,1913,8,1914,6,1919,2];
            default:
                return [0];
            }
        };

    };
    return VirginiaDotMap;
});
define('models/tileset',["models/base", "lib/maps/tiles/mapbox", "lib/maps/tiles/stamen", "lib/maps/tiles/virginia-dotmap"],
    function (Base, MapBox, Stamen, VirginiaDotMap) {
        "use strict";
        var TileSet = Base.extend({
            getClientStyles: function () {
                return this.get("extras") ? this.get("extras").clientStyles : null;
            },
            isCustom: function () {
                return this.getClientStyles() !== null;
            },
            getMapTypeID: function () {
                var sourceName = this.get("source_name").toLowerCase(),
                    mapTypeID = this.get("name");
                if (sourceName === "google" && !this.isCustom()) {
                    mapTypeID = mapTypeID.toLowerCase();
                }
                return mapTypeID;
            },
            getMapType: function () {
                var sourceName = this.get("source_name").toLowerCase();
                switch (sourceName) {
                case "stamen":
                    return new Stamen({
                        url: this.get("base_tile_url"),
                        max: this.get("max_zoom"),
                        name: this.getMapTypeID()
                    });
                case "mapbox":
                    return new MapBox({
                        url: this.get("base_tile_url"),
                        max: this.get("max_zoom"),
                        name: this.getMapTypeID()
                    });
                case "cooper center":
                    return new VirginiaDotMap({
                        url: this.get("base_tile_url"),
                        max: this.get("max_zoom"),
                        min: this.get("min_zoom"),
                        name: this.getMapTypeID()
                    });
                case "google":
                    if (this.isCustom()) {
                        return new google.maps.StyledMapType(
                            this.getClientStyles(),
                            { name: this.getMapTypeID() }
                        );
                    }
                    return null;
                }
                return null;
            }
        });
        return TileSet;
    });

define('collections/tilesets',["underscore", "models/tileset", "collections/base"], function (_, TileSet, Base) {
    "use strict";
    var TileSets = Base.extend({
        model: TileSet,
        name: 'Tilesets',
        key: 'tilesets',
        url: '/api/0/tiles/',
        mapTypes: {},
        mapTypeIDs: [],
        initialize: function (recs, opts) {
            _.extend(this, opts);
            this.on('reset', this.initTiles);
            //this.initTiles();
            Base.prototype.initialize.apply(this, arguments);
        },
        getMapTypeId: function (map) {
            var tileset = this.getTileSetByKey("name", map.getMapTypeId().toLowerCase());
            if (!tileset) {
                return null;
            }
            return tileset.id;
        },
        initTiles: function () {
            try {
                if (google === 'undefined') { return; }
            } catch (e) { return; }
            //iterate through each of the user's basemap tilesets and add it to the map:
            var that = this;
            this.each(function (tileset) {
                var sourceName = tileset.get("source_name").toLowerCase(),
                    mapTypeID = tileset.getMapTypeID();
                switch (sourceName) {
                case "stamen":
                case "cooper center":
                case "mapbox":
                    that.mapTypes[mapTypeID] = tileset.getMapType();
                    that.mapTypeIDs.push(mapTypeID);
                    break;
                case "google":
                    if (tileset.isCustom()) {
                        that.mapTypes[mapTypeID] = that.mapTypes[mapTypeID] = tileset.getMapType();
                    }
                    that.mapTypeIDs.unshift(mapTypeID);
                    break;
                case "default":
                    alert("Error in localground.maps.TileManager: unknown map type: " + sourceName);
                    break;
                }
            });
        }
    });
    return TileSets;
});

define('lib/data/dataManager',["underscore", "marionette", "models/project", "collections/photos",
        "collections/audio", "collections/videos", "collections/mapimages", "collections/markers",
        "collections/records", "collections/fields", "collections/tilesets"],
    function (_, Marionette, Project, Photos, Audio, Videos, MapImages, Markers, Records, Fields, TileSets) {
        'use strict';
        var DataManager = Marionette.ItemView.extend({
            dataDictionary: {},
            formColors: ['#60C7CC', '#CF2045', '#A3A737', '#F27CA5'],
            colorCounter: 0,
            template: false,
            isEmpty: function () {
                return Object.keys(this.dataDictionary).length === 0;
            },
            initialize: function (opts) {
                //todo: remove app dependency and pass in projectID and vent
                _.extend(this, opts);
                if (typeof this.projectID === 'undefined') {
                    window.location = '/';
                    return false;
                }
                if (!this.model) {
                    this.model = new Project({ id: this.projectID });
                    this.model.fetch({ success: this.setCollections.bind(this) });
                } else {
                    this.setCollections();
                }
                this.tilesets = new TileSets();
                this.tilesets.fetch({reset: 'true'});
            },
            setCollections: function () {
                var that = this,
                    extras;
                _.each(this.model.get("children"), function (entry, key) {
                    that.dataDictionary[key] = entry;
                    extras = that.initCollection(key, entry.data, entry.fields, entry.overlay_type);
                    _.extend(that.dataDictionary[key], extras);
                    delete entry.data;
                });
                this.vent.trigger('data-loaded');
            },
            getDataSources: function () {
                var dataSources = [
                    { value: "markers", name: "Sites" }
                ];
                _.each(this.dataDictionary, function (entry, key) {
                    if (key.includes("form_")) {
                        dataSources.push({
                            value: key,
                            name: entry.name
                        });
                    }
                });
                dataSources = dataSources.concat([
                    { value: "photos", name: "Photos" },
                    { value: "audio", name: "Audio" },
                    { value: "videos", name: "Videos" },
                    { value: "map_images", name: "Map Images" }
                ]);
                return dataSources;
            },
            getData: function (key) {
                console.log(key);
                var entry = this.dataDictionary[key];
                if (entry) {
                    return entry;
                }
                throw new Error("No entry found for " + key);
            },
            getCollection: function (key) {
                var entry = this.dataDictionary[key];
                console.log(this.dataDictionary);
                if (entry) {
                    return entry.collection;
                }
                throw new Error("No entry found for " + key);
            },
            initCollection: function (key, data, fieldCollection, overlay_type) {
                switch (key) {
                case "photos":
                    return { collection: new Photos(data) };
                case "audio":
                    return { collection: new Audio(data) };
                case "videos":
                    return { collection: new Videos(data) };
                case "markers":
                    return {
                        collection: new Markers(data),
                        isSite: true
                    };
                case "map_images":
                    return { collection: new MapImages(data) };
                default:
                    // in addition to defining the collection, also define the fields:
                    if (key.indexOf("form_") != -1) {
                        var formID = key.split("_")[1],
                            recordsURL = '/api/0/forms/' + formID + '/data/',
                            fieldsURL = '/api/0/forms/' + formID + '/fields/',
                            records = new Records(data, {
                                url: recordsURL,
                                key: 'form_' + formID,
                                overlay_type: overlay_type
                            }),
                            fields = fieldCollection || new Fields(null, {url: fieldsURL }),
                            that = this;
                        records.fillColor = this.formColors[this.colorCounter++];
                        if (fields.length == 0) {
                            fields.fetch({ reset: true, success: function () {
                                that.attachFieldsToRecords(records, fields);
                            }});
                        } else {
                            this.attachFieldsToRecords(records, fields);
                        }
                        return {
                            collection: records,
                            fields: fields,
                            isCustomType: true,
                            isSite: true
                        };
                    }
                    throw new Error("case not handled");
                    return null;
                }
            },
            attachFieldsToRecords: function (records, fields) {
                // some extra post-processing for custom datatypes so that
                // it's easier to loop through fields and output corresponding
                // values
                records.each(function (record) {
                    fields.each(function (field) {
                        field.set("val", record.get(field.get("col_name")));
                    });
                    record.set('fields', fields.toJSON());
                });
            }
        });
        return DataManager;
    });

define('lib/maps/icon-lookup',['underscore'], function (_) {
    "use strict";
    /*
     * https://icomoon.io/app/#/select
     * https://www.mapbox.com/maki-icons/editor/
    */
    var IconLookup = {
        baseWidth: 15,
        baseHeight: 15
    };
    IconLookup = _.extend(IconLookup, {
        icons: {
            circle: {
                key: "circle",
                name: "Circle",
                path: 'M14,7.5c0,3.5899-2.9101,6.5-6.5,6.5S1,11.0899,1,7.5S3.9101,1,7.5,1S14,3.9101,14,7.5z',
                width: IconLookup.baseWidth * 2,
                height: IconLookup.baseHeight * 2
            },
            circle_hollow: {
                key: "circle_hollow",
                name: "Circle Hollow",
                path: 'M7.5,0C11.6422,0,15,3.3578,15,7.5S11.6422,15,7.5,15 S0,11.6422,0,7.5S3.3578,0,7.5,0z M7.5,1.6666c-3.2217,0-5.8333,2.6117-5.8333,5.8334S4.2783,13.3334,7.5,13.3334 s5.8333-2.6117,5.8333-5.8334S10.7217,1.6666,7.5,1.6666z',
                width: IconLookup.baseWidth * 2,
                height: IconLookup.baseHeight * 2
            },
            pin: {
                key: "pin",
                name: "Pin",
                path: 'M7.5,0C5.0676,0,2.2297,1.4865,2.2297,5.2703 C2.2297,7.8378,6.2838,13.5135,7.5,15c1.0811-1.4865,5.2703-7.027,5.2703-9.7297C12.7703,1.4865,9.9324,0,7.5,0z',
                width: IconLookup.baseWidth * 2,
                height: IconLookup.baseHeight * 2,
                anchor: [IconLookup.baseWidth / 2, IconLookup.baseHeight]
            },
            square: {
                key: "square",
                name: "Square",
                path: 'M13,14H2c-0.5523,0-1-0.4477-1-1V2c0-0.5523,0.4477-1,1-1h11c0.5523,0,1,0.4477,1,1v11C14,13.5523,13.5523,14,13,14z'
            },
            square_hollow: {
                key: "square_hollow",
                name: "Square Hollow",
                path: 'M12.7,2.3v10.4H2.3V2.3H12.7 M13,1H2C1.4477,1,1,1.4477,1,2v11c0,0.5523,0.4477,1,1,1h11c0.5523,0,1-0.4477,1-1V2 C14,1.4477,13.5523,1,13,1L13,1z',
                width: IconLookup.baseWidth * 2,
                height: IconLookup.baseHeight * 2
            },
            triangle: {
                key: "triangle",
                name: "Triangle",
                path: 'M7.5385,2 C7.2437,2,7.0502,2.1772,6.9231,2.3846l-5.8462,9.5385C1,12,1,12.1538,1,12.3077C1,12.8462,1.3846,13,1.6923,13h11.6154 C13.6923,13,14,12.8462,14,12.3077c0-0.1538,0-0.2308-0.0769-0.3846L8.1538,2.3846C8.028,2.1765,7.7882,2,7.5385,2z',
                width: IconLookup.baseWidth * 2,
                height: IconLookup.baseHeight * 2
            },
            triangle_hollow: {
                key: "triangle_hollow",
                name: "Triangle Hollow",
                path: 'M7.5243,1.5004 C7.2429,1.4913,6.9787,1.6423,6.8336,1.8952l-5.5,9.8692C1.0218,12.3078,1.395,12.9999,2,13h11 c0.605-0.0001,0.9782-0.6922,0.6664-1.2355l-5.5-9.8692C8.0302,1.6579,7.7884,1.5092,7.5243,1.5004z M7.5,3.8993l4.1267,7.4704 H3.3733L7.5,3.8993z'
            },
            camera: {
                key: "camera",
                name: "Camera",
                path: 'M6,2C5.446,2,5.2478,2.5045,5,3L4.5,4h-2C1.669,4,1,4.669,1,5.5v5C1,11.331,1.669,12,2.5,12h10 c0.831,0,1.5-0.669,1.5-1.5v-5C14,4.669,13.331,4,12.5,4h-2L10,3C9.75,2.5,9.554,2,9,2H6z M2.5,5C2.7761,5,3,5.2239,3,5.5 S2.7761,6,2.5,6S2,5.7761,2,5.5S2.2239,5,2.5,5z M7.5,5c1.6569,0,3,1.3431,3,3s-1.3431,3-3,3s-3-1.3431-3-3S5.8431,5,7.5,5z M7.5,6.5C6.6716,6.5,6,7.1716,6,8l0,0c0,0.8284,0.6716,1.5,1.5,1.5l0,0C8.3284,9.5,9,8.8284,9,8l0,0C9,7.1716,8.3284,6.5,7.5,6.5 L7.5,6.5z'
            },
            water: {
                key: "water",
                name: "Water Drop",
                path: 'M864.626 473.162c-65.754-183.44-205.11-348.15-352.626-473.162-147.516 125.012-286.87 289.722-352.626 473.162-40.664 113.436-44.682 236.562 12.584 345.4 65.846 125.14 198.632 205.438 340.042 205.438s274.196-80.298 340.040-205.44c57.27-108.838 53.25-231.962 12.586-345.398zM738.764 758.956c-43.802 83.252-132.812 137.044-226.764 137.044-55.12 0-108.524-18.536-152.112-50.652 13.242 1.724 26.632 2.652 40.112 2.652 117.426 0 228.668-67.214 283.402-171.242 44.878-85.292 40.978-173.848 23.882-244.338 14.558 28.15 26.906 56.198 36.848 83.932 22.606 63.062 40.024 156.34-5.368 242.604z',
                baseWidth: 1050,
                baseHeight: 1050,
                viewBox: '-130 -130 1200 1200',
                width: 20,
                height: 20
            },
            cross: {
                key: "cross",
                name: "Cross",
                baseWidth: 1050,
                baseHeight: 1050,
                viewBox: '-130 -130 1200 1200',
                width: 20,
                height: 20,
                path: 'M 1014.66 822.66 c -0.004 -0.004 -0.008 -0.008 -0.012 -0.01 l -310.644 -310.65 l 310.644 -310.65 c 0.004 -0.004 0.008 -0.006 0.012 -0.01 c 3.344 -3.346 5.762 -7.254 7.312 -11.416 c 4.246 -11.376 1.824 -24.682 -7.324 -33.83 l -146.746 -146.746 c -9.148 -9.146 -22.45 -11.566 -33.828 -7.32 c -4.16 1.55 -8.07 3.968 -11.418 7.31 c 0 0.004 -0.004 0.006 -0.008 0.01 l -310.648 310.652 l -310.648 -310.65 c -0.004 -0.004 -0.006 -0.006 -0.01 -0.01 c -3.346 -3.342 -7.254 -5.76 -11.414 -7.31 c -11.38 -4.248 -24.682 -1.826 -33.83 7.32 l -146.748 146.748 c -9.148 9.148 -11.568 22.452 -7.322 33.828 c 1.552 4.16 3.97 8.072 7.312 11.416 c 0.004 0.002 0.006 0.006 0.01 0.01 l 310.65 310.648 l -310.65 310.652 c -0.002 0.004 -0.006 0.006 -0.008 0.01 c -3.342 3.346 -5.76 7.254 -7.314 11.414 c -4.248 11.376 -1.826 24.682 7.322 33.83 l 146.748 146.746 c 9.15 9.148 22.452 11.568 33.83 7.322 c 4.16 -1.552 8.07 -3.97 11.416 -7.312 c 0.002 -0.004 0.006 -0.006 0.01 -0.01 l 310.648 -310.65 l 310.648 310.65 c 0.004 0.002 0.008 0.006 0.012 0.008 c 3.348 3.344 7.254 5.762 11.414 7.314 c 11.378 4.246 24.684 1.826 33.828 -7.322 l 146.746 -146.748 c 9.148 -9.148 11.57 -22.454 7.324 -33.83 c -1.552 -4.16 -3.97 -8.068 -7.314 -11.414 Z'
            },
            plus: {
                key: "plus",
                name: "Plus",
                path: 'M992 384h-352v-352c0-17.672-14.328-32-32-32h-192c-17.672 0-32 14.328-32 32v352h-352c-17.672 0-32 14.328-32 32v192c0 17.672 14.328 32 32 32h352v352c0 17.672 14.328 32 32 32h192c17.672 0 32-14.328 32-32v-352h352c17.672 0 32-14.328 32-32v-192c0-17.672-14.328-32-32-32z',
                baseWidth: 1050,
                baseHeight: 1050,
                viewBox: '-130 -130 1200 1200',
                width: 20,
                height: 20
            },
            mic: {
                key: "mic",
                name: "Microphone",
                path: 'M480 704c88.366 0 160-71.634 160-160v-384c0-88.366-71.634-160-160-160s-160 71.634-160 160v384c0 88.366 71.636 160 160 160zM704 448v96c0 123.71-100.29 224-224 224-123.712 0-224-100.29-224-224v-96h-64v96c0 148.238 112.004 270.3 256 286.22v129.78h-128v64h320v-64h-128v-129.78c143.994-15.92 256-137.982 256-286.22v-96h-64z',
                baseWidth: 1050,
                baseHeight: 1050,
                viewBox: '-130 -130 1200 1200',
                width: 20,
                height: 20
            },
            worm: {
                key: "worm",
                name: "Worm",
                path: 'M5.494,25.875c-0.792,0-1.597-0.172-2.359-0.536c-2.735-1.306-3.902-4.569-2.605-7.309  C1.264,16.479,8.075,2.795,20.752,0.438C28.146-0.93,35.521,1.834,42.69,8.664c4.737,4.511,9.18,6.44,13.198,5.737  c6.396-1.119,11.531-8.768,12.826-11.359c1.359-2.717,4.659-3.818,7.379-2.461c2.717,1.358,3.818,4.661,2.461,7.379  c-0.305,0.61-7.623,14.978-20.771,17.276c-7.649,1.343-15.278-1.559-22.679-8.607c-4.461-4.248-8.604-6.06-12.313-5.381  c-6.107,1.115-10.969,8.683-12.327,11.505C9.516,24.722,7.545,25.875,5.494,25.875z',
                baseWidth: 79.136,
                baseHeight: 32.34375,
                width: 79,
                height: 32
            },
            bug: {
                key: "bug",
                name: "Bug",
                path: 'M1824 1088q0 26-19 45t-45 19h-224q0 171-67 290l208 209q19 19 19 45t-19 45q-18 19-45 19t-45-19l-198-197q-5 5-15 13t-42 28.5-65 36.5-82 29-97 13v-896h-128v896q-51 0-101.5-13.5t-87-33-66-39-43.5-32.5l-15-14-183 207q-20 21-48 21-24 0-43-16-19-18-20.5-44.5t15.5-46.5l202-227q-58-114-58-274h-224q-26 0-45-19t-19-45 19-45 45-19h224v-294l-173-173q-19-19-19-45t19-45 45-19 45 19l173 173h844l173-173q19-19 45-19t45 19 19 45-19 45l-173 173v294h224q26 0 45 19t19 45zm-480-576h-640q0-133 93.5-226.5t226.5-93.5 226.5 93.5 93.5 226.5z',
                baseWidth: 2048,
                baseHeight: 2048,
                width: 20,
                height: 20
            }
        },
        getIcons: function () {
            var icons = [],
                keys = Object.keys(this.icons),
                i;
            for (i = 0; i < keys.length; i++) {
                icons.push(this.getIcon(keys[i]));
            }
            return icons;
        },
        getIcon: function (shape) {
            var icon = IconLookup.icons[shape];
            if (!icon) {
                icon = IconLookup.icons.circle;
            }
            icon.baseWidth = icon.baseWidth || IconLookup.baseWidth;
            icon.baseHeight = icon.baseHeight || IconLookup.baseHeight;
            icon.anchor = icon.anchor || [icon.baseWidth / 2, icon.baseHeight / 2];
            return icon;
        }
    });
    return IconLookup;
});
define('lib/maps/overlays/icon',["marionette", "underscore", "lib/maps/icon-lookup"], function (Marionette, _, IconLookup) {
    "use strict";
    var Icon = Marionette.ItemView.extend({
        fillColor: '#ED867D',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 1,
        strokeOpacity: 1,
        initialize: function (opts) {
            if (opts.shape) {
                _.extend(this, IconLookup.getIcon(opts.shape));
            }
            _.extend(this, opts);
            /*if (!opts.fillColor) {
                delete opts.fillColor;
            }*/
            this.scale = this.getScale();
            this.viewBox = this.viewBox || this.getViewBox();
        },
        getViewBox: function () {
            return (-1 * this.strokeWeight) + ' ' +
                    (-1 * this.strokeWeight) + ' ' +
                    (this.baseWidth + this.strokeWeight + 2) + ' ' +
                    (this.baseHeight + this.strokeWeight + 2);
        },
        getScale: function () {
            var scale = this.width / this.baseWidth;
            //console.log(scale);
            return scale;
        },
        generateGoogleIcon: function () {
            var opts = this.toJSON();
            opts.anchor = new google.maps.Point(this.anchor[0], this.anchor[1]);
            opts.origin =  this.origin || new google.maps.Point(0, 0);
            return opts;
        },
        toJSON: function () {
            return {
                fillColor: this.fillColor,
                fillOpacity: this.fillOpacity,
                strokeColor: this.strokeColor,
                strokeWeight: this.strokeWeight,
                strokeOpacity: this.strokeOpacity,
                path: this.path,
                markerSize: this.width,
                scale: this.getScale(),
                url: this.url,
                //size: new google.maps.Size(this.width, this.height),
                viewBox: this.getViewBox(),
                width: this.width,
                height: this.height
            };
        }
    });
    return Icon;
});
define('models/symbol',['backbone', 'underscore', 'lib/sqlParser', 'lib/maps/overlays/icon'],
    function (Backbone, _, SqlParser, Icon) {
        'use strict';
        /**
         * The top-level view class that harnesses all of the map editor
         * functionality. Also coordinates event triggers across all of
         * the constituent views.
         * @class OverlayGroup
         */
        var Symbol = Backbone.Model.extend({
            isShowingOnMap: false,
            sqlParser: null,
            defaults: {
                fillOpacity: 1,
                width: 20,
                height: 20,
                fillColor: "#4e70d4",
                strokeColor: "#FFFFFF",
                strokeWeight: 1,
                strokeOpacity: 1,
                shape: "circle",
                isShowing: false
            },
            initialize: function (data, opts) {
                _.extend(this, opts);
                Backbone.Model.prototype.initialize.apply(this, arguments);
                this.set("shape", this.get("shape") || "circle");
                this.set("icon", new Icon(this.toJSON()));
                this.set("shape", this.get("icon").key);
                this.modelMap = {};
                if (_.isUndefined(this.get("rule"))) {
                    throw new Error("rule must be defined");
                }
                if (_.isUndefined(this.get("title"))) {
                    throw new Error("title must be defined");
                }
                this.sqlParser = new SqlParser(this.get("rule"));
                this.on("change:width", this.setHeight);
            },
            setHeight: function () {
                this.set("height", this.get("width"));
            },
            getSymbolJSON: function () {
                var symbol = this.clone();
                delete symbol.attributes.icon;
                return symbol.toJSON();
            },
            checkModel: function (model) {
                return this.sqlParser.checkModel(model);
            },
            addModel: function (model) {
                var hash = model.get("overlay_type") + "_" + model.get("id");
                if (_.isUndefined(this.modelMap[hash])) {
                    this.modelMap[hash] = model;
                }
            },
            getModels: function () {
                return _.values(this.modelMap);
            }
        });
        return Symbol;
    });

define('collections/symbols',["models/symbol", "collections/base"], function (Symbol, Base) {
    "use strict";
    /**
     * Note: There is no "Symbols" API Endpoint. This is just a convenience function
     *       for serializing layers
     */
    var Symbols = Base.extend({
        model: Symbol,
        name: 'Symbols',
        key: 'symbols',
        initialize: function (recs, opts) {
            Base.prototype.initialize.apply(this, arguments);
        }
    });
    return Symbols;
});

define('models/layer',["models/base", "models/symbol", "collections/symbols"], function (Base, Symbol, Symbols) {
    "use strict";
    /**
     * A Backbone Model class for the Photo datatype.
     * @class Layer
     * @see <a href="//localground.org/api/0/layers/">//localground.org/api/0/layers/</a>
     * Attributes: id, name, caption, overlay_type, tags, owner, slug, access, symbols
     */
    var Layer = Base.extend({
		defaults: _.extend({}, Base.prototype.defaults, {
            isVisible: false,
            metadata: {
                buckets: 4,
                paletteId: 0,
                fillOpacity: 1,
                width: 20,
                fillColor: "#4e70d4",
                strokeColor: "#ffffff",
                strokeWeight: 1,
                strokeOpacity: 1,
                shape: "circle",
                isShowing: false
            },
            symbols: []
        }),
        symbolMap: null,
        basic: false,
        initialize: function (data, opts) {
			Base.prototype.initialize.apply(this, arguments);
            this.applyDefaults();
            if (data.map_id) {
                this.urlRoot = "/api/0/maps/" + data.map_id + "/layers/";
            } else {
                console.warn("Layer Model Warning: without the map_id, the layer can't be saved to database");
            }
            this.buildSymbolMap();
            //this.on("change:symbols", this.rebuildSymbolMap);
		},
        applyDefaults: function () {
            var currentMetadata = _.clone(this.get("metadata")),
                defaults = _.clone(this.defaults.metadata);
            _.extend(defaults, currentMetadata);
            this.set("metadata", defaults);
        },
		validate: function (attrs) {
            //if symbols is an array or it's null or it's empty, raise an exception:
            if (!_.isArray(attrs.symbols) || _.isNull(attrs.symbols) || attrs.symbols.length == 0) {
                return 'Layer.symbols must be a JSON array with at least one entry';
            }
            //if valid, returns null;
            return null;
		},

        rebuildSymbolMap: function () {
            this.symbolMap = null;
            this.buildSymbolMap();
        },
        buildSymbolMap: function () {
            console.log('building symbol map...', this.get("symbols"));
            //set the basic flag:
            if (this.get("symbols").length == 1) {
                this.basic = true;
            }
            if (!this.symbolMap) {
                this.symbolMap = {};
                var i = 0,
                    symbols = this.get("symbols"),
                    symbol;
                for (i = 0; i < symbols.length; i++) {
                    symbol = symbols[i];
                    symbol.id = symbol.id || (i + 1);
                    this.symbolMap['symbol_' + symbol.id] = new Symbol(symbols[i]);
                }
            }
        },

        getSymbols: function () {
            return new Symbols(_.values(this.symbolMap));
        },
        getSymbolsJSON: function () {
            var symbolsJSON = [];
            this.getSymbols().each(function (symbol) {
                symbolsJSON.push(symbol.getSymbolJSON());
            });
            return symbolsJSON;
        },

        getSymbol: function (id) {
            return this.symbolMap['symbol_' + id];
        },
        setSymbol: function (model) {
            this.symbolMap['symbol_' + model.id] = model;
            this.set("symbols", this.getSymbols().toJSON());
        },

        getSymbolMap: function () {
            return this.symbolMap;
        },

        hideSymbols: function () {
            this.getSymbols().each(function (symbol) {
                symbol.isShowingOnMap = false;
            });
        },

        showSymbols: function () {
            this.getSymbols().each(function (symbol) {
                symbol.isShowingOnMap = true;
            });
        },
        toJSON: function () {
            var json = Base.prototype.toJSON.call(this);

            // extra code to remove icon references
            // to avoid JSON serialization errors:
            json.symbols = JSON.stringify(this.getSymbolsJSON());
            json.metadata = JSON.stringify(json.metadata);

            // serialize filters also:
            if (json.filters !== null) {
                json.filters = JSON.stringify(json.filters);
            }
            return json;
        },
        save: function (attrs, opts) {
            console.log(this.attributes);
            Base.prototype.save.apply(this, arguments);
            console.log("done");
        }
    });
    return Layer;
});
define('collections/layers',["models/layer", "collections/base"], function (Layer, Base) {
    "use strict";
    /**
     * @class localground.collections.Layers
     */
    var Layers = Base.extend({
        model: Layer,
        name: 'Layers',
        key: 'layers',
        initialize: function (recs, opts) {
            opts = opts || {};
            $.extend(this, opts);
            if (!this.mapID) {
                alert("The Layers collection requires a map id upon initialization");
                return;
            }
            this.url = "/api/0/maps/" + this.mapID + "/layers";
            Base.prototype.initialize.apply(this, arguments);
        },
    });
    return Layers;
});

define('models/map',["models/base", "collections/layers"], function (Base, Layers) {
    "use strict";
    var Map = Base.extend({
        getMapBySlug: function (opts) {
            this.urlRoot = "/api/0/maps/" + opts.slug + "/";
            this.fetch({
                success: function () {
                    opts.successCallback();
                },
                error: function () {
                    console.error("map not found for url:", opts.slug);
                    if (opts.errorCallback) {
                        opts.errorCallback();
                    }
                }
            });
        },
        urlRoot: "/api/0/maps/",
        initialize: function (data, opts) {
            Base.prototype.initialize.apply(this, arguments);
            var panelStyles = this.get("panel_styles");
            if (!_.isUndefined(panelStyles) && _.isString(panelStyles)) {
                console.log("serialize");
                this.set("panel_styles", JSON.parse(panelStyles));
            }
            if (data && data.layers) {
                this.set("layers", new Layers(data.layers, {mapID: this.id}));
            }
		},
        defaults: function () {
            return _.extend({}, Base.prototype.defaults, {
                checked: false,
                panel_styles: {
                    display_legend: true,
                    title: {type: "title", font: "Lato", fw: "bold", color: "ffffff", backgroundColor: "4e70d4", size: "15"},
                    subtitle: {type: "subtitle", font: "Lato", fw: "regular", color: "666", backgroundColor: "f7f7f7", size: "12"},
                    paragraph: {type: "paragraph", font: "Lato", fw: "regular", color: "3d3d3d", backgroundColor: "f7f7f7", size: "12"},
                    tags: {type: "tags", font: "Lato", fw: "regular", color: "3d3d3d", backgroundColor: "f7f7f7", size: "10"}
                }
            });
        },

        getLayers: function () {
            if (this.get("layers")) {
                if (!(this.get("layers") instanceof Layers)) {
                    this.set("layers", new Layers(this.get("layers"), {mapID: this.id}));
                }
                return this.get("layers");
            }
            return new Layers([], {mapID: this.id});
        },

        getDefaultLocation: function () {
            return {
                zoom: this.get("zoom"),
                center: {
                    lat: this.get("center").coordinates[1],
                    lng: this.get("center").coordinates[0]
                }
            };
        },

        getDefaultSkin: function () {
            return {
                basemap: this.get("basemap")
            };
        },

        toJSON: function () {
            // ensure that the geometry object is serialized before it
            // gets sent to the server:
            var json = Base.prototype.toJSON.call(this);

            if (json.panel_styles != null) {
                json.panel_styles = JSON.stringify(json.panel_styles);
            }
            if (json.center != null) {
                json.center = JSON.stringify(json.center);
            }
            return json;
        }
    });
    return Map;
});

/**
 * jscolor, JavaScript Color Picker
 *
 * @version 1.4.2
 * @license GNU Lesser General Public License, http://www.gnu.org/copyleft/lesser.html
 * @author  Jan Odvarko, http://odvarko.cz
 * @created 2008-06-15
 * @updated 2013-11-25
 * @link    http://jscolor.com
 */

define('color-picker',[], function () {
  var jscolor = {


	dir : '', // location of jscolor directory (leave empty to autodetect)
	bindClass : 'color', // class name
	binding : true, // automatic binding via <input class="...">
	preloading : true, // use image preloading?


	install : function() {
		jscolor.addEvent(window, 'load', jscolor.init);
	},


	init : function() {
		if(jscolor.binding) {
			jscolor.bind();
		}
		if(jscolor.preloading) {
			jscolor.preload();
		}
	},


	getDir : function() {
		return "/static/backbone/images/jscolor/";
	},


	bind : function() {
		var matchClass = new RegExp('(^|\\s)('+jscolor.bindClass+')\\s*(\\{[^}]*\\})?', 'i');
		var e = document.getElementsByTagName('input');
		for(var i=0; i<e.length; i+=1) {
			var m;
			if(!e[i].color && e[i].className && (m = e[i].className.match(matchClass))) {
				var prop = {};
				if(m[3]) {
					try {
						prop = (new Function ('return (' + m[3] + ')'))();
					} catch(eInvalidProp) {}
				}
				e[i].color = new jscolor.color(e[i], prop);
			}
		}
	},


	preload : function() {
		for(var fn in jscolor.imgRequire) {
			if(jscolor.imgRequire.hasOwnProperty(fn)) {
				jscolor.loadImage(fn);
			}
		}
	},


	images : {
		pad : [ 181, 101 ],
		sld : [ 16, 101 ],
		cross : [ 15, 15 ],
		arrow : [ 7, 11 ]
	},


	imgRequire : {},
	imgLoaded : {},


	requireImage : function(filename) {
		jscolor.imgRequire[filename] = true;
	},


	loadImage : function(filename) {
		if(!jscolor.imgLoaded[filename]) {
			jscolor.imgLoaded[filename] = new Image();
			jscolor.imgLoaded[filename].src = jscolor.getDir()+filename;
		}
	},


	fetchElement : function(mixed) {
		return typeof mixed === 'string' ? document.getElementById(mixed) : mixed;
	},


	addEvent : function(el, evnt, func) {
		if(el.addEventListener) {
			el.addEventListener(evnt, func, false);
		} else if(el.attachEvent) {
			el.attachEvent('on'+evnt, func);
		}
	},


	fireEvent : function(el, evnt) {
		if(!el) {
			return;
		}
		if(document.createEvent) {
			var ev = document.createEvent('HTMLEvents');
			ev.initEvent(evnt, true, true);
			el.dispatchEvent(ev);
		} else if(document.createEventObject) {
			var ev = document.createEventObject();
			el.fireEvent('on'+evnt, ev);
		} else if(el['on'+evnt]) { // alternatively use the traditional event model (IE5)
			el['on'+evnt]();
		}
	},


	getElementPos : function(e) {
		var e1=e, e2=e;
		var x=0, y=0;
		if(e1.offsetParent) {
			do {
				x += e1.offsetLeft;
				y += e1.offsetTop;
			} while(e1 = e1.offsetParent);
		}
		while((e2 = e2.parentNode) && e2.nodeName.toUpperCase() !== 'BODY') {
			x -= e2.scrollLeft;
			y -= e2.scrollTop;
		}
		return [x, y];
	},


	getElementSize : function(e) {
		return [e.offsetWidth, e.offsetHeight];
	},


	getRelMousePos : function(e) {
		var x = 0, y = 0;
		if (!e) { e = window.event; }
		if (typeof e.offsetX === 'number') {
			x = e.offsetX;
			y = e.offsetY;
		} else if (typeof e.layerX === 'number') {
			x = e.layerX;
			y = e.layerY;
		}
		return { x: x, y: y };
	},


	getViewPos : function() {
		if(typeof window.pageYOffset === 'number') {
			return [window.pageXOffset, window.pageYOffset];
		} else if(document.body && (document.body.scrollLeft || document.body.scrollTop)) {
			return [document.body.scrollLeft, document.body.scrollTop];
		} else if(document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
			return [document.documentElement.scrollLeft, document.documentElement.scrollTop];
		} else {
			return [0, 0];
		}
	},


	getViewSize : function() {
		if(typeof window.innerWidth === 'number') {
			return [window.innerWidth, window.innerHeight];
		} else if(document.body && (document.body.clientWidth || document.body.clientHeight)) {
			return [document.body.clientWidth, document.body.clientHeight];
		} else if(document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
			return [document.documentElement.clientWidth, document.documentElement.clientHeight];
		} else {
			return [0, 0];
		}
	},


	URI : function(uri) { // See RFC3986

		this.scheme = null;
		this.authority = null;
		this.path = '';
		this.query = null;
		this.fragment = null;

		this.parse = function(uri) {
			var m = uri.match(/^(([A-Za-z][0-9A-Za-z+.-]*)(:))?((\/\/)([^\/?#]*))?([^?#]*)((\?)([^#]*))?((#)(.*))?/);
			this.scheme = m[3] ? m[2] : null;
			this.authority = m[5] ? m[6] : null;
			this.path = m[7];
			this.query = m[9] ? m[10] : null;
			this.fragment = m[12] ? m[13] : null;
			return this;
		};

		this.toString = function() {
			var result = '';
			if(this.scheme !== null) { result = result + this.scheme + ':'; }
			if(this.authority !== null) { result = result + '//' + this.authority; }
			if(this.path !== null) { result = result + this.path; }
			if(this.query !== null) { result = result + '?' + this.query; }
			if(this.fragment !== null) { result = result + '#' + this.fragment; }
			return result;
		};

		this.toAbsolute = function(base) {
			var base = new jscolor.URI(base);
			var r = this;
			var t = new jscolor.URI;

			if(base.scheme === null) { return false; }

			if(r.scheme !== null && r.scheme.toLowerCase() === base.scheme.toLowerCase()) {
				r.scheme = null;
			}

			if(r.scheme !== null) {
				t.scheme = r.scheme;
				t.authority = r.authority;
				t.path = removeDotSegments(r.path);
				t.query = r.query;
			} else {
				if(r.authority !== null) {
					t.authority = r.authority;
					t.path = removeDotSegments(r.path);
					t.query = r.query;
				} else {
					if(r.path === '') {
						t.path = base.path;
						if(r.query !== null) {
							t.query = r.query;
						} else {
							t.query = base.query;
						}
					} else {
						if(r.path.substr(0,1) === '/') {
							t.path = removeDotSegments(r.path);
						} else {
							if(base.authority !== null && base.path === '') {
								t.path = '/'+r.path;
							} else {
								t.path = base.path.replace(/[^\/]+$/,'')+r.path;
							}
							t.path = removeDotSegments(t.path);
						}
						t.query = r.query;
					}
					t.authority = base.authority;
				}
				t.scheme = base.scheme;
			}
			t.fragment = r.fragment;

			return t;
		};

		function removeDotSegments(path) {
			var out = '';
			while(path) {
				if(path.substr(0,3)==='../' || path.substr(0,2)==='./') {
					path = path.replace(/^\.+/,'').substr(1);
				} else if(path.substr(0,3)==='/./' || path==='/.') {
					path = '/'+path.substr(3);
				} else if(path.substr(0,4)==='/../' || path==='/..') {
					path = '/'+path.substr(4);
					out = out.replace(/\/?[^\/]*$/, '');
				} else if(path==='.' || path==='..') {
					path = '';
				} else {
					var rm = path.match(/^\/?[^\/]*/)[0];
					path = path.substr(rm.length);
					out = out + rm;
				}
			}
			return out;
		}

		if(uri) {
			this.parse(uri);
		}

	},


	//
	// Usage example:
	// var myColor = new jscolor.color(myInputElement)
	//

	color : function(target, prop) {


		this.required = true; // refuse empty values?
		this.adjust = true; // adjust value to uniform notation?
		this.hash = false; // prefix color with # symbol?
		this.caps = true; // uppercase?
		this.slider = true; // show the value/saturation slider?
		this.valueElement = target; // value holder
		this.styleElement = target; // where to reflect current color
		this.onImmediateChange = null; // onchange callback (can be either string or function)
		this.hsv = [0, 0, 1]; // read-only  0-6, 0-1, 0-1
		this.rgb = [1, 1, 1]; // read-only  0-1, 0-1, 0-1
		this.minH = 0; // read-only  0-6
		this.maxH = 6; // read-only  0-6
		this.minS = 0; // read-only  0-1
		this.maxS = 1; // read-only  0-1
		this.minV = 0; // read-only  0-1
		this.maxV = 1; // read-only  0-1

		this.pickerOnfocus = true; // display picker on focus?
		this.pickerMode = 'HSV'; // HSV | HVS
		this.pickerPosition = 'bottom'; // left | right | top | bottom
		this.pickerSmartPosition = true; // automatically adjust picker position when necessary
		this.pickerButtonHeight = 20; // px
		this.pickerClosable = false;
		this.pickerCloseText = 'Close';
		this.pickerButtonColor = 'ButtonText'; // px
		this.pickerFace = 10; // px
		this.pickerFaceColor = 'ThreeDFace'; // CSS color
		this.pickerBorder = 1; // px
		this.pickerBorderColor = 'ThreeDHighlight ThreeDShadow ThreeDShadow ThreeDHighlight'; // CSS color
		this.pickerInset = 1; // px
		this.pickerInsetColor = 'ThreeDShadow ThreeDHighlight ThreeDHighlight ThreeDShadow'; // CSS color
		this.pickerZIndex = 10000;


		for(var p in prop) {
			if(prop.hasOwnProperty(p)) {
				this[p] = prop[p];
			}
		}


		this.hidePicker = function() {
			if(isPickerOwner()) {
				removePicker();
			}
		};


		this.showPicker = function() {
			if(!isPickerOwner()) {
				var top = $(target).offset().top + $(target).height() + 8;
				var left = $(target).offset().left
				drawPicker(left, top);
			}
		};


		this.importColor = function() {
			if(!valueElement) {
				this.exportColor();
			} else {
				if(!this.adjust) {
					if(!this.fromString(valueElement.value, leaveValue)) {
						styleElement.style.backgroundImage = styleElement.jscStyle.backgroundImage;
						styleElement.style.backgroundColor = styleElement.jscStyle.backgroundColor;
						styleElement.style.color = styleElement.jscStyle.color;
						this.exportColor(leaveValue | leaveStyle);
					}
				} else if(!this.required && /^\s*$/.test(valueElement.value)) {
					valueElement.value = '';
					styleElement.style.backgroundImage = styleElement.jscStyle.backgroundImage;
					styleElement.style.backgroundColor = styleElement.jscStyle.backgroundColor;
					styleElement.style.color = styleElement.jscStyle.color;
					this.exportColor(leaveValue | leaveStyle);

				} else if(this.fromString(valueElement.value)) {
					// OK
				} else {
					this.exportColor();
				}
			}
		};


		this.exportColor = function(flags) {
			if(!(flags & leaveValue) && valueElement) {
				var value = this.toString();
				if(this.caps) { value = value.toUpperCase(); }
				if(this.hash) { value = '#'+value; }
				valueElement.value = value;
			}
			if(!(flags & leaveStyle) && styleElement) {
				styleElement.style.backgroundImage = "none";
				styleElement.style.backgroundColor =
					'#'+this.toString();
				styleElement.style.color =
					0.213 * this.rgb[0] +
					0.715 * this.rgb[1] +
					0.072 * this.rgb[2]
					< 0.5 ? '#FFF' : '#000';
			}
			if(!(flags & leavePad) && isPickerOwner()) {
				redrawPad();
			}
			if(!(flags & leaveSld) && isPickerOwner()) {
				redrawSld();
			}
		};


		this.fromHSV = function(h, s, v, flags) { // null = don't change
			if(h !== null) { h = Math.max(0.0, this.minH, Math.min(6.0, this.maxH, h)); }
			if(s !== null) { s = Math.max(0.0, this.minS, Math.min(1.0, this.maxS, s)); }
			if(v !== null) { v = Math.max(0.0, this.minV, Math.min(1.0, this.maxV, v)); }

			this.rgb = HSV_RGB(
				h===null ? this.hsv[0] : (this.hsv[0]=h),
				s===null ? this.hsv[1] : (this.hsv[1]=s),
				v===null ? this.hsv[2] : (this.hsv[2]=v)
			);

			this.exportColor(flags);
		};


		this.fromRGB = function(r, g, b, flags) { // null = don't change
			if(r !== null) { r = Math.max(0.0, Math.min(1.0, r)); }
			if(g !== null) { g = Math.max(0.0, Math.min(1.0, g)); }
			if(b !== null) { b = Math.max(0.0, Math.min(1.0, b)); }

			var hsv = RGB_HSV(
				r===null ? this.rgb[0] : r,
				g===null ? this.rgb[1] : g,
				b===null ? this.rgb[2] : b
			);
			if(hsv[0] !== null) {
				this.hsv[0] = Math.max(0.0, this.minH, Math.min(6.0, this.maxH, hsv[0]));
			}
			if(hsv[2] !== 0) {
				this.hsv[1] = hsv[1]===null ? null : Math.max(0.0, this.minS, Math.min(1.0, this.maxS, hsv[1]));
			}
			this.hsv[2] = hsv[2]===null ? null : Math.max(0.0, this.minV, Math.min(1.0, this.maxV, hsv[2]));

			// update RGB according to final HSV, as some values might be trimmed
			var rgb = HSV_RGB(this.hsv[0], this.hsv[1], this.hsv[2]);
			this.rgb[0] = rgb[0];
			this.rgb[1] = rgb[1];
			this.rgb[2] = rgb[2];

			this.exportColor(flags);
		};


		this.fromString = function(hex, flags) {
			var m = hex.match(/^\W*([0-9A-F]{3}([0-9A-F]{3})?)\W*$/i);
			if(!m) {
				return false;
			} else {
				if(m[1].length === 6) { // 6-char notation
					this.fromRGB(
						parseInt(m[1].substr(0,2),16) / 255,
						parseInt(m[1].substr(2,2),16) / 255,
						parseInt(m[1].substr(4,2),16) / 255,
						flags
					);
				} else { // 3-char notation
					this.fromRGB(
						parseInt(m[1].charAt(0)+m[1].charAt(0),16) / 255,
						parseInt(m[1].charAt(1)+m[1].charAt(1),16) / 255,
						parseInt(m[1].charAt(2)+m[1].charAt(2),16) / 255,
						flags
					);
				}
				return true;
			}
		};


		this.toString = function() {
			return (
				(0x100 | Math.round(255*this.rgb[0])).toString(16).substr(1) +
				(0x100 | Math.round(255*this.rgb[1])).toString(16).substr(1) +
				(0x100 | Math.round(255*this.rgb[2])).toString(16).substr(1)
			);
		};


		function RGB_HSV(r, g, b) {
			var n = Math.min(Math.min(r,g),b);
			var v = Math.max(Math.max(r,g),b);
			var m = v - n;
			if(m === 0) { return [ null, 0, v ]; }
			var h = r===n ? 3+(b-g)/m : (g===n ? 5+(r-b)/m : 1+(g-r)/m);
			return [ h===6?0:h, m/v, v ];
		}


		function HSV_RGB(h, s, v) {
			if(h === null) { return [ v, v, v ]; }
			var i = Math.floor(h);
			var f = i%2 ? h-i : 1-(h-i);
			var m = v * (1 - s);
			var n = v * (1 - s*f);
			switch(i) {
				case 6:
				case 0: return [v,n,m];
				case 1: return [n,v,m];
				case 2: return [m,v,n];
				case 3: return [m,n,v];
				case 4: return [n,m,v];
				case 5: return [v,m,n];
			}
		}


		function removePicker() {
			delete jscolor.picker.owner;
			document.getElementsByTagName('body')[0].removeChild(jscolor.picker.boxB);
		}


		function drawPicker(x, y) {
			if(!jscolor.picker) {
				jscolor.picker = {
					box : document.createElement('div'),
					boxB : document.createElement('div'),
					pad : document.createElement('div'),
					padB : document.createElement('div'),
					padM : document.createElement('div'),
					sld : document.createElement('div'),
					sldB : document.createElement('div'),
					sldM : document.createElement('div'),
					btn : document.createElement('div'),
					btnS : document.createElement('span'),
					btnT : document.createTextNode(THIS.pickerCloseText)
				};
				for(var i=0,segSize=4; i<jscolor.images.sld[1]; i+=segSize) {
					var seg = document.createElement('div');
					seg.style.height = segSize+'px';
					seg.style.fontSize = '1px';
					seg.style.lineHeight = '0';
					jscolor.picker.sld.appendChild(seg);
				}
				jscolor.picker.sldB.appendChild(jscolor.picker.sld);
				jscolor.picker.box.appendChild(jscolor.picker.sldB);
				jscolor.picker.box.appendChild(jscolor.picker.sldM);
				jscolor.picker.padB.appendChild(jscolor.picker.pad);
				jscolor.picker.box.appendChild(jscolor.picker.padB);
				jscolor.picker.box.appendChild(jscolor.picker.padM);
				jscolor.picker.btnS.appendChild(jscolor.picker.btnT);
				jscolor.picker.btn.appendChild(jscolor.picker.btnS);
				jscolor.picker.box.appendChild(jscolor.picker.btn);
				jscolor.picker.boxB.appendChild(jscolor.picker.box);
			}

			var p = jscolor.picker;

			// controls interaction
			p.box.onmouseup =
			p.box.onmouseout = function() { target.focus(); };
			p.box.onmousedown = function() { abortBlur=true; };
			p.box.onmousemove = function(e) {
				if (holdPad || holdSld) {
					holdPad && setPad(e);
					holdSld && setSld(e);
					if (document.selection) {
						document.selection.empty();
					} else if (window.getSelection) {
						window.getSelection().removeAllRanges();
					}
					dispatchImmediateChange();
				}
			};
			if('ontouchstart' in window) { // if touch device
				var handle_touchmove = function(e) {
					var event={
						'offsetX': e.touches[0].pageX-touchOffset.X,
						'offsetY': e.touches[0].pageY-touchOffset.Y
					};
					if (holdPad || holdSld) {
						holdPad && setPad(event);
						holdSld && setSld(event);
						dispatchImmediateChange();
					}
					e.stopPropagation(); // prevent move "view" on broswer
					e.preventDefault(); // prevent Default - Android Fix (else android generated only 1-2 touchmove events)
				};
				p.box.removeEventListener('touchmove', handle_touchmove, false)
				p.box.addEventListener('touchmove', handle_touchmove, false)
			}
			p.padM.onmouseup =
			p.padM.onmouseout = function() { if(holdPad) { holdPad=false; jscolor.fireEvent(valueElement,'change'); } };
			p.padM.onmousedown = function(e) {
				// if the slider is at the bottom, move it up
				switch(modeID) {
					case 0: if (THIS.hsv[2] === 0) { THIS.fromHSV(null, null, 1.0); }; break;
					case 1: if (THIS.hsv[1] === 0) { THIS.fromHSV(null, 1.0, null); }; break;
				}
				holdSld=false;
				holdPad=true;
				setPad(e);
				dispatchImmediateChange();
			};
			if('ontouchstart' in window) {
				p.padM.addEventListener('touchstart', function(e) {
					touchOffset={
						'X': e.target.offsetParent.offsetLeft,
						'Y': e.target.offsetParent.offsetTop
					};
					this.onmousedown({
						'offsetX':e.touches[0].pageX-touchOffset.X,
						'offsetY':e.touches[0].pageY-touchOffset.Y
					});
				});
			}
			p.sldM.onmouseup =
			p.sldM.onmouseout = function() { if(holdSld) { holdSld=false; jscolor.fireEvent(valueElement,'change'); } };
			p.sldM.onmousedown = function(e) {
				holdPad=false;
				holdSld=true;
				setSld(e);
				dispatchImmediateChange();
			};
			if('ontouchstart' in window) {
				p.sldM.addEventListener('touchstart', function(e) {
					touchOffset={
						'X': e.target.offsetParent.offsetLeft,
						'Y': e.target.offsetParent.offsetTop
					};
					this.onmousedown({
						'offsetX':e.touches[0].pageX-touchOffset.X,
						'offsetY':e.touches[0].pageY-touchOffset.Y
					});
				});
			}

			// picker
			var dims = getPickerDims(THIS);
			p.box.style.width = dims[0] + 'px';
			p.box.style.height = dims[1] + 'px';

			// picker border
			p.boxB.style.position = 'absolute';
			p.boxB.style.clear = 'both';
			p.boxB.style.left = x+'px';
			p.boxB.style.top = y+'px';
			p.boxB.style.zIndex = THIS.pickerZIndex;
			p.boxB.style.border = THIS.pickerBorder+'px solid';
			p.boxB.style.borderColor = THIS.pickerBorderColor;
			p.boxB.style.background = THIS.pickerFaceColor;

			// pad image
			p.pad.style.width = jscolor.images.pad[0]+'px';
			p.pad.style.height = jscolor.images.pad[1]+'px';

			// pad border
			p.padB.style.position = 'absolute';
			p.padB.style.left = THIS.pickerFace+'px';
			p.padB.style.top = THIS.pickerFace+'px';
			p.padB.style.border = THIS.pickerInset+'px solid';
			p.padB.style.borderColor = THIS.pickerInsetColor;

			// pad mouse area
			p.padM.style.position = 'absolute';
			p.padM.style.left = '0';
			p.padM.style.top = '0';
			p.padM.style.width = THIS.pickerFace + 2*THIS.pickerInset + jscolor.images.pad[0] + jscolor.images.arrow[0] + 'px';
			p.padM.style.height = p.box.style.height;
			p.padM.style.cursor = 'crosshair';

			// slider image
			p.sld.style.overflow = 'hidden';
			p.sld.style.width = jscolor.images.sld[0]+'px';
			p.sld.style.height = jscolor.images.sld[1]+'px';

			// slider border
			p.sldB.style.display = THIS.slider ? 'block' : 'none';
			p.sldB.style.position = 'absolute';
			p.sldB.style.right = THIS.pickerFace+'px';
			p.sldB.style.top = THIS.pickerFace+'px';
			p.sldB.style.border = THIS.pickerInset+'px solid';
			p.sldB.style.borderColor = THIS.pickerInsetColor;

			// slider mouse area
			p.sldM.style.display = THIS.slider ? 'block' : 'none';
			p.sldM.style.position = 'absolute';
			p.sldM.style.right = '0';
			p.sldM.style.top = '0';
			p.sldM.style.width = jscolor.images.sld[0] + jscolor.images.arrow[0] + THIS.pickerFace + 2*THIS.pickerInset + 'px';
			p.sldM.style.height = p.box.style.height;
			try {
				p.sldM.style.cursor = 'pointer';
			} catch(eOldIE) {
				p.sldM.style.cursor = 'hand';
			}

			// "close" button
			function setBtnBorder() {
				var insetColors = THIS.pickerInsetColor.split(/\s+/);
				var pickerOutsetColor = insetColors.length < 2 ? insetColors[0] : insetColors[1] + ' ' + insetColors[0] + ' ' + insetColors[0] + ' ' + insetColors[1];
				p.btn.style.borderColor = pickerOutsetColor;
			}
			p.btn.style.display = THIS.pickerClosable ? 'block' : 'none';
			p.btn.style.position = 'absolute';
			p.btn.style.left = THIS.pickerFace + 'px';
			p.btn.style.bottom = THIS.pickerFace + 'px';
			p.btn.style.padding = '0 15px';
			p.btn.style.height = '18px';
			p.btn.style.border = THIS.pickerInset + 'px solid';
			setBtnBorder();
			p.btn.style.color = THIS.pickerButtonColor;
			p.btn.style.font = '12px sans-serif';
			p.btn.style.textAlign = 'center';
			try {
				p.btn.style.cursor = 'pointer';
			} catch(eOldIE) {
				p.btn.style.cursor = 'hand';
			}
			p.btn.onmousedown = function () {
				THIS.hidePicker();
			};
			p.btnS.style.lineHeight = p.btn.style.height;

			// load images in optimal order
			switch(modeID) {
				case 0: var padImg = 'hs.png'; break;
				case 1: var padImg = 'hv.png'; break;
			}
			p.padM.style.backgroundImage = "url('"+jscolor.getDir()+"cross.gif')";
			p.padM.style.backgroundRepeat = "no-repeat";
			p.sldM.style.backgroundImage = "url('"+jscolor.getDir()+"arrow.gif')";
			p.sldM.style.backgroundRepeat = "no-repeat";
			p.pad.style.backgroundImage = "url('"+jscolor.getDir()+padImg+"')";
			p.pad.style.backgroundRepeat = "no-repeat";
			p.pad.style.backgroundPosition = "0 0";

			// place pointers
			redrawPad();
			redrawSld();

			jscolor.picker.owner = THIS;
			document.getElementsByTagName('body')[0].appendChild(p.boxB);
		}


		function getPickerDims(o) {
			var dims = [
				2*o.pickerInset + 2*o.pickerFace + jscolor.images.pad[0] +
					(o.slider ? 2*o.pickerInset + 2*jscolor.images.arrow[0] + jscolor.images.sld[0] : 0),
				o.pickerClosable ?
					4*o.pickerInset + 3*o.pickerFace + jscolor.images.pad[1] + o.pickerButtonHeight :
					2*o.pickerInset + 2*o.pickerFace + jscolor.images.pad[1]
			];
			return dims;
		}


		function redrawPad() {
			// redraw the pad pointer
			switch(modeID) {
				case 0: var yComponent = 1; break;
				case 1: var yComponent = 2; break;
			}
			var x = Math.round((THIS.hsv[0]/6) * (jscolor.images.pad[0]-1));
			var y = Math.round((1-THIS.hsv[yComponent]) * (jscolor.images.pad[1]-1));
			jscolor.picker.padM.style.backgroundPosition =
				(THIS.pickerFace+THIS.pickerInset+x - Math.floor(jscolor.images.cross[0]/2)) + 'px ' +
				(THIS.pickerFace+THIS.pickerInset+y - Math.floor(jscolor.images.cross[1]/2)) + 'px';

			// redraw the slider image
			var seg = jscolor.picker.sld.childNodes;

			switch(modeID) {
				case 0:
					var rgb = HSV_RGB(THIS.hsv[0], THIS.hsv[1], 1);
					for(var i=0; i<seg.length; i+=1) {
						seg[i].style.backgroundColor = 'rgb('+
							(rgb[0]*(1-i/seg.length)*100)+'%,'+
							(rgb[1]*(1-i/seg.length)*100)+'%,'+
							(rgb[2]*(1-i/seg.length)*100)+'%)';
					}
					break;
				case 1:
					var rgb, s, c = [ THIS.hsv[2], 0, 0 ];
					var i = Math.floor(THIS.hsv[0]);
					var f = i%2 ? THIS.hsv[0]-i : 1-(THIS.hsv[0]-i);
					switch(i) {
						case 6:
						case 0: rgb=[0,1,2]; break;
						case 1: rgb=[1,0,2]; break;
						case 2: rgb=[2,0,1]; break;
						case 3: rgb=[2,1,0]; break;
						case 4: rgb=[1,2,0]; break;
						case 5: rgb=[0,2,1]; break;
					}
					for(var i=0; i<seg.length; i+=1) {
						s = 1 - 1/(seg.length-1)*i;
						c[1] = c[0] * (1 - s*f);
						c[2] = c[0] * (1 - s);
						seg[i].style.backgroundColor = 'rgb('+
							(c[rgb[0]]*100)+'%,'+
							(c[rgb[1]]*100)+'%,'+
							(c[rgb[2]]*100)+'%)';
					}
					break;
			}
		}


		function redrawSld() {
			// redraw the slider pointer
			switch(modeID) {
				case 0: var yComponent = 2; break;
				case 1: var yComponent = 1; break;
			}
			var y = Math.round((1-THIS.hsv[yComponent]) * (jscolor.images.sld[1]-1));
			jscolor.picker.sldM.style.backgroundPosition =
				'0 ' + (THIS.pickerFace+THIS.pickerInset+y - Math.floor(jscolor.images.arrow[1]/2)) + 'px';
		}


		function isPickerOwner() {
			return jscolor.picker && jscolor.picker.owner === THIS;
		}


		function blurTarget() {
			if(valueElement === target) {
				THIS.importColor();
			}
			if(THIS.pickerOnfocus) {
				THIS.hidePicker();
			}
		}


		function blurValue() {
			if(valueElement !== target) {
				THIS.importColor();
			}
		}


		function setPad(e) {
			var mpos = jscolor.getRelMousePos(e);
			var x = mpos.x - THIS.pickerFace - THIS.pickerInset;
			var y = mpos.y - THIS.pickerFace - THIS.pickerInset;
			switch(modeID) {
				case 0: THIS.fromHSV(x*(6/(jscolor.images.pad[0]-1)), 1 - y/(jscolor.images.pad[1]-1), null, leaveSld); break;
				case 1: THIS.fromHSV(x*(6/(jscolor.images.pad[0]-1)), null, 1 - y/(jscolor.images.pad[1]-1), leaveSld); break;
			}
		}


		function setSld(e) {
			var mpos = jscolor.getRelMousePos(e);
			var y = mpos.y - THIS.pickerFace - THIS.pickerInset;
			switch(modeID) {
				case 0: THIS.fromHSV(null, null, 1 - y/(jscolor.images.sld[1]-1), leavePad); break;
				case 1: THIS.fromHSV(null, 1 - y/(jscolor.images.sld[1]-1), null, leavePad); break;
			}
		}


		function dispatchImmediateChange() {
			if (THIS.onImmediateChange) {
				var callback;
				if (typeof THIS.onImmediateChange === 'string') {
					callback = new Function (THIS.onImmediateChange);
				} else {
					callback = THIS.onImmediateChange;
				}
				callback.call(THIS);
			}
		}


		var THIS = this;
		var modeID = this.pickerMode.toLowerCase()==='hvs' ? 1 : 0;
		var abortBlur = false;
		var
			valueElement = jscolor.fetchElement(this.valueElement),
			styleElement = jscolor.fetchElement(this.styleElement);
		var
			holdPad = false,
			holdSld = false,
			touchOffset = {};
		var
			leaveValue = 1<<0,
			leaveStyle = 1<<1,
			leavePad = 1<<2,
			leaveSld = 1<<3;

		// target
		jscolor.addEvent(target, 'focus', function() {
			if(THIS.pickerOnfocus) { THIS.showPicker(); }
		});
		jscolor.addEvent(target, 'blur', function() {
			if(!abortBlur) {
				window.setTimeout(function(){ abortBlur || blurTarget(); abortBlur=false; }, 0);
			} else {
				abortBlur = false;
			}
		});

		// valueElement
		if(valueElement) {
			var updateField = function() {
				THIS.fromString(valueElement.value, leaveValue);
				dispatchImmediateChange();
			};
			jscolor.addEvent(valueElement, 'keyup', updateField);
			jscolor.addEvent(valueElement, 'input', updateField);
			jscolor.addEvent(valueElement, 'blur', blurValue);
			valueElement.setAttribute('autocomplete', 'off');
		}

		// styleElement
		if(styleElement) {
			styleElement.jscStyle = {
				backgroundImage : styleElement.style.backgroundImage,
				backgroundColor : styleElement.style.backgroundColor,
				color : styleElement.style.color
			};
		}

		// require images
		switch(modeID) {
			case 0: jscolor.requireImage('hs.png'); break;
			case 1: jscolor.requireImage('hv.png'); break;
		}
		jscolor.requireImage('cross.gif');
		jscolor.requireImage('arrow.gif');

		this.importColor();
	}

};
jscolor.install();
return jscolor;
});

define('google-infobubble',["jquery"], function ($) {
	// ==ClosureCompiler==
	// @compilation_level ADVANCED_OPTIMIZATIONS
	// @externs_url http://closure-compiler.googlecode.com/svn/trunk/contrib/externs/maps/google_maps_api_v3.js
	// ==/ClosureCompiler==
	
	/**
	 * @name CSS3 InfoBubble with tabs for Google Maps API V3
	 * @version 0.8
	 * @author Luke Mahe
	 * @fileoverview
	 * This library is a CSS Infobubble with tabs. It uses css3 rounded corners and
	 * drop shadows and animations. It also allows tabs
	 */
	
	/*
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	
	
	/**
	 * A CSS3 InfoBubble v0.8
	 * @param {Object.<string, *>=} opt_options Optional properties to set.
	 * @extends {google.maps.OverlayView}
	 * @constructor
	 */
	function InfoBubble(opt_options) {
		this.extend(InfoBubble, google.maps.OverlayView);
		this.tabs_ = [];
		this.activeTab_ = null;
		this.baseZIndex_ = 100;
		this.isOpen_ = false;
		this.doNotPad = false;
		this.includeCloseButton = true;
		this.closeBubbleExtras = function() {
			if(opt_options.closeBubbleExtras) {
				opt_options.closeBubbleExtras();  
			}
		};

		var options = opt_options || {};

		if (options.zIndex) {
			this.baseZIndex_ = options.zIndex;
		}

		if (options['backgroundColor'] == undefined) {
		  options['backgroundColor'] = this.BACKGROUND_COLOR_;
		}
		
		if (options['header'] == undefined) {
		  options['header'] = this.HEADER_;
		}
	  
		if (options['borderColor'] == undefined) {
		  options['borderColor'] = this.BORDER_COLOR_;
		}
	  
		if (options['borderRadius'] == undefined) {
		  options['borderRadius'] = this.BORDER_RADIUS_;
		}
	  
		if (options['borderWidth'] == undefined) {
		  options['borderWidth'] = this.BORDER_WIDTH_;
		}
	  
		if (options['padding'] == undefined) {
		  options['padding'] = this.PADDING_;
		}
	  
		if (options['arrowPosition'] == undefined) {
		  options['arrowPosition'] = this.ARROW_POSITION_;
		}
	  
		if (options['disableAutoPan'] == undefined) {
		  options['disableAutoPan'] = false;
		}
	  
		if (options['disableAnimation'] == undefined) {
		  options['disableAnimation'] = false;
		}
	  
		if (options['minWidth'] == undefined) {
		  options['minWidth'] = this.MIN_WIDTH_;
		}
	  
		if (options['shadowStyle'] == undefined) {
		  options['shadowStyle'] = this.SHADOW_STYLE_;
		}
	  
		if (options['arrowSize'] == undefined) {
		  options['arrowSize'] = this.ARROW_SIZE_;
		}
	  
		if (options['arrowStyle'] == undefined) {
		  options['arrowStyle'] = this.ARROW_STYLE_;
		}
		if (options['hideCloseButton'] == true) {
			this.includeCloseButton = false; 
		}
	  
		this.buildDom_();
	  
		this.setValues(options);
	}
	window['InfoBubble'] = InfoBubble;
	
	
	/**
	 * Default arrow size
	 * @const
	 * @private
	 */
	InfoBubble.prototype.ARROW_SIZE_ = 15;
	
	
	/**
	 * Default arrow style
	 * @const
	 * @private
	 */
	InfoBubble.prototype.ARROW_STYLE_ = 0;
	
	
	/**
	 * Default shadow style
	 * @const
	 * @private
	 */
	InfoBubble.prototype.SHADOW_STYLE_ = 1;
	
	
	/**
	 * Default min width
	 * @const
	 * @private
	 */
	InfoBubble.prototype.MIN_WIDTH_ = 50;
	
	
	/**
	 * Default arrow position
	 * @const
	 * @private
	 */
	InfoBubble.prototype.ARROW_POSITION_ = 50;
	
	
	/**
	 * Default padding
	 * @const
	 * @private
	 */
	InfoBubble.prototype.PADDING_ = 10;
	
	
	/**
	 * Default border width
	 * @const
	 * @private
	 */
	InfoBubble.prototype.BORDER_WIDTH_ = 1;
	
	
	/**
	 * Default border color
	 * @const
	 * @private
	 */
	InfoBubble.prototype.BORDER_COLOR_ = '#ccc';
	
	
	/**
	 * Default border radius
	 * @const
	 * @private
	 */
	InfoBubble.prototype.BORDER_RADIUS_ = 10;
	
	
	/**
	 * Default background color
	 * @const
	 * @private
	 */
	InfoBubble.prototype.BACKGROUND_COLOR_ = '#fff';
	
	
	/**
	 * Default bubble header div
	 * @private
	 */
	InfoBubble.prototype.HEADER_ = $('<div>DUMMY HEADER</div>');
	
	
	/**
	 * Extends a objects prototype by anothers.
	 *
	 * @param {Object} obj1 The object to be extended.
	 * @param {Object} obj2 The object to extend with.
	 * @return {Object} The new extended object.
	 * @ignore
	 */
	InfoBubble.prototype.extend = function(obj1, obj2) {
	  return (function(object) {
		for (var property in object.prototype) {
		  this.prototype[property] = object.prototype[property];
		}
		return this;
	  }).apply(obj1, [obj2]);
	};
	
	
	/**
	 * Builds the InfoBubble dom
	 * @private
	 */
	InfoBubble.prototype.buildDom_ = function() {
	  var bubble = this.bubble_ = document.createElement('DIV');
	  bubble.style['position'] = 'absolute';
	  bubble.style['zIndex'] = this.baseZIndex_;
	
	  var tabsContainer = this.tabsContainer_ = document.createElement('DIV');
	  tabsContainer.style['position'] = 'relative';
	
	  // Close button
	  /*var close = this.close_ = document.createElement('IMG');
	  close.style['position'] = 'absolute';
	  close.style['width'] = this.px(12);
	  close.style['height'] = this.px(12);
	  close.style['border'] = 0;
	  close.style['zIndex'] = this.baseZIndex_ + 1;
	  close.style['cursor'] = 'pointer';
	  close.src = 'http://maps.gstatic.com/intl/en_us/mapfiles/iw_close.gif';*/
	  
	  var close = this.close_ = document.createElement('i');
	  close.className = 'fa fa-times-circle';
	  close.style['position'] = 'absolute';
	  close.style['zIndex'] = this.baseZIndex_ + 1;
	  close.style['cursor'] = 'pointer';
	
	  var that = this;
	  google.maps.event.addDomListener(close, 'click', function() {
		  that.close();
		  google.maps.event.trigger(that, 'closeclick');
		  that.closeBubbleExtras();
	  });
	
	  // Content area
	  var contentContainer = this.contentContainer_ = document.createElement('DIV');
	  //contentContainer.style['overflowX'] = 'hidden';//'auto';
	  //contentContainer.style['overflowY'] = 'hidden';//'auto';
	  contentContainer.style['cursor'] = 'default';
	  contentContainer.style['clear'] = 'both';
	  contentContainer.style['position'] = 'relative';
	
	  var content = this.content_ = document.createElement('DIV');
	  contentContainer.appendChild(content);
	
	  // Arrow
	  var arrow = this.arrow_ = document.createElement('DIV');
	  arrow.style['position'] = 'relative';
	
	  var arrowOuter = this.arrowOuter_ = document.createElement('DIV');
	  var arrowInner = this.arrowInner_ = document.createElement('DIV');
	
	  var arrowSize = this.getArrowSize_();
	
	  arrowOuter.style['position'] = arrowInner.style['position'] = 'absolute';
	  arrowOuter.style['left'] = arrowInner.style['left'] = '50%';
	  arrowOuter.style['height'] = arrowInner.style['height'] = '0';
	  arrowOuter.style['width'] = arrowInner.style['width'] = '0';
	  arrowOuter.style['marginLeft'] = this.px(-arrowSize);
	  arrowOuter.style['borderWidth'] = this.px(arrowSize);
	  arrowOuter.style['borderBottomWidth'] = 0;
	
	  // Shadow
	  var bubbleShadow = this.bubbleShadow_ = document.createElement('DIV');
	  bubbleShadow.style['position'] = 'absolute';
	
	  // Hide the InfoBubble by default
	  bubble.style['display'] = bubbleShadow.style['display'] = 'none';
	
	  bubble.appendChild(this.tabsContainer_);
	  if(this.includeCloseButton)
		bubble.appendChild(close);
	  bubble.appendChild(contentContainer);
	  arrow.appendChild(arrowOuter);
	  arrow.appendChild(arrowInner);
	  bubble.appendChild(arrow);
	
	  var stylesheet = document.createElement('style');
	  stylesheet.setAttribute('type', 'text/css');
	
	  /**
	   * The animation for the infobubble
	   * @type {string}
	   */
	  this.animationName_ = '_ibani_' + Math.round(Math.random() * 10000);
	
	  var css = '.' + this.animationName_ + '{-webkit-animation-name:' +
		  this.animationName_ + ';-webkit-animation-duration:0.5s;' +
		  '-webkit-animation-iteration-count:1;}' +
		  '@-webkit-keyframes ' + this.animationName_ + ' {from {' +
		  '-webkit-transform: scale(0)}50% {-webkit-transform: scale(1.2)}90% ' +
		  '{-webkit-transform: scale(0.95)}to {-webkit-transform: scale(1)}}';
	
	  stylesheet.textContent = css;
	  document.getElementsByTagName('head')[0].appendChild(stylesheet);
	};
	
	
	/**
	 * Sets the background class name
	 *
	 * @param {string} className The class name to set.
	 */
	InfoBubble.prototype.setBackgroundClassName = function(className) {
	  this.set('backgroundClassName', className);
	};
	InfoBubble.prototype['setBackgroundClassName'] =
		InfoBubble.prototype.setBackgroundClassName;
	
	
	/**
	 * changed MVC callback
	 */
	InfoBubble.prototype.backgroundClassName_changed = function() {
	  this.content_.className = this.get('backgroundClassName');
	};
	InfoBubble.prototype['backgroundClassName_changed'] =
		InfoBubble.prototype.backgroundClassName_changed;
	
	
	/**
	 * Sets the class of the tab
	 *
	 * @param {string} className the class name to set.
	 */
	InfoBubble.prototype.setTabClassName = function(className) {
	  this.set('tabClassName', className);
	};
	InfoBubble.prototype['setTabClassName'] =
		InfoBubble.prototype.setTabClassName;
	
	
	/**
	 * tabClassName changed MVC callback
	 */
	InfoBubble.prototype.tabClassName_changed = function() {
	  this.updateTabStyles_();
	};
	InfoBubble.prototype['tabClassName_changed'] =
		InfoBubble.prototype.tabClassName_changed;
	
	
	/**
	 * Gets the style of the arrow
	 *
	 * @private
	 * @return {number} The style of the arrow.
	 */
	InfoBubble.prototype.getArrowStyle_ = function() {
	  return parseInt(this.get('arrowStyle'), 10) || 0;
	};
	
	
	/**
	 * Sets the style of the arrow
	 *
	 * @param {number} style The style of the arrow.
	 */
	InfoBubble.prototype.setArrowStyle = function(style) {
	  this.set('arrowStyle', style);
	};
	InfoBubble.prototype['setArrowStyle'] =
		InfoBubble.prototype.setArrowStyle;
	
	
	/**
	 * Arrow style changed MVC callback
	 */
	InfoBubble.prototype.arrowStyle_changed = function() {
	  this.arrowSize_changed();
	};
	InfoBubble.prototype['arrowStyle_changed'] =
		InfoBubble.prototype.arrowStyle_changed;
	
	
	/**
	 * Gets the size of the arrow
	 *
	 * @private
	 * @return {number} The size of the arrow.
	 */
	InfoBubble.prototype.getArrowSize_ = function() {
	  return parseInt(this.get('arrowSize'), 10) || 0;
	};
	
	
	/**
	 * Sets the size of the arrow
	 *
	 * @param {number} size The size of the arrow.
	 */
	InfoBubble.prototype.setArrowSize = function(size) {
	  this.set('arrowSize', size);
	};
	InfoBubble.prototype['setArrowSize'] =
		InfoBubble.prototype.setArrowSize;
	
	
	/**
	 * Arrow size changed MVC callback
	 */
	InfoBubble.prototype.arrowSize_changed = function() {
	  this.borderWidth_changed();
	};
	InfoBubble.prototype['arrowSize_changed'] =
		InfoBubble.prototype.arrowSize_changed;
	
	
	/**
	 * Set the position of the InfoBubble arrow
	 *
	 * @param {number} pos The position to set.
	 */
	InfoBubble.prototype.setArrowPosition = function(pos) {
	  this.set('arrowPosition', pos);
	};
	InfoBubble.prototype['setArrowPosition'] =
		InfoBubble.prototype.setArrowPosition;
	
	
	/**
	 * Get the position of the InfoBubble arrow
	 *
	 * @private
	 * @return {number} The position..
	 */
	InfoBubble.prototype.getArrowPosition_ = function() {
	  return parseInt(this.get('arrowPosition'), 10) || 0;
	};
	
	
	/**
	 * arrowPosition changed MVC callback
	 */
	InfoBubble.prototype.arrowPosition_changed = function() {
	  var pos = this.getArrowPosition_();
	  this.arrowOuter_.style['left'] = this.arrowInner_.style['left'] = pos + '%';
	
	  this.redraw_();
	};
	InfoBubble.prototype['arrowPosition_changed'] =
		InfoBubble.prototype.arrowPosition_changed;
	
	
	/**
	 * Set the zIndex of the InfoBubble
	 *
	 * @param {number} zIndex The zIndex to set.
	 */
	InfoBubble.prototype.setZIndex = function(zIndex) {
	  this.set('zIndex', zIndex);
	};
	InfoBubble.prototype['setZIndex'] = InfoBubble.prototype.setZIndex;
	
	
	/**
	 * Get the zIndex of the InfoBubble
	 *
	 * @return {number} The zIndex to set.
	 */
	InfoBubble.prototype.getZIndex = function() {
	  return parseInt(this.get('zIndex'), 10) || this.baseZIndex_;
	};
	
	
	/**
	 * zIndex changed MVC callback
	 */
	InfoBubble.prototype.zIndex_changed = function() {
	  var zIndex = this.getZIndex();
	
	  this.bubble_.style['zIndex'] = this.baseZIndex_ = zIndex;
	  this.close_.style['zIndex'] = zIndex + 1;
	};
	InfoBubble.prototype['zIndex_changed'] = InfoBubble.prototype.zIndex_changed;
	
	
	/**
	 * Set the style of the shadow
	 *
	 * @param {number} shadowStyle The style of the shadow.
	 */
	InfoBubble.prototype.setShadowStyle = function(shadowStyle) {
	  this.set('shadowStyle', shadowStyle);
	};
	InfoBubble.prototype['setShadowStyle'] = InfoBubble.prototype.setShadowStyle;
	
	
	/**
	 * Get the style of the shadow
	 *
	 * @private
	 * @return {number} The style of the shadow.
	 */
	InfoBubble.prototype.getShadowStyle_ = function() {
	  return parseInt(this.get('shadowStyle'), 10) || 0;
	};
	
	
	/**
	 * shadowStyle changed MVC callback
	 */
	InfoBubble.prototype.shadowStyle_changed = function() {
	  var shadowStyle = this.getShadowStyle_();
	
	  var display = '';
	  var shadow = '';
	  var backgroundColor = '';
	  switch (shadowStyle) {
		case 0:
		  display = 'none';
		  break;
		case 1:
		  shadow = '40px 15px 10px rgba(33,33,33,0.3)';
		  backgroundColor = 'transparent';
		  break;
		case 2:
		  shadow = '0 0 2px rgba(33,33,33,0.3)';
		  backgroundColor = 'rgba(33,33,33,0.35)';
		  break;
	  }
	  this.bubbleShadow_.style['boxShadow'] =
		  this.bubbleShadow_.style['webkitBoxShadow'] =
		  this.bubbleShadow_.style['MozBoxShadow'] = shadow;
	  this.bubbleShadow_.style['backgroundColor'] = backgroundColor;
	  if (this.isOpen_) {
		this.bubbleShadow_.style['display'] = display;
		this.draw();
	  }
	};
	InfoBubble.prototype['shadowStyle_changed'] =
		InfoBubble.prototype.shadowStyle_changed;
	
	
	/**
	 * Show the close button
	 */
	InfoBubble.prototype.showCloseButton = function() {
	  this.set('hideCloseButton', false);
	};
	InfoBubble.prototype['showCloseButton'] = InfoBubble.prototype.showCloseButton;
	
	
	/**
	 * Hide the close button
	 */
	InfoBubble.prototype.hideCloseButton = function() {
	  this.set('hideCloseButton', true);
	};
	InfoBubble.prototype['hideCloseButton'] = InfoBubble.prototype.hideCloseButton;
	
	
	/**
	 * hideCloseButton changed MVC callback
	 */
	InfoBubble.prototype.hideCloseButton_changed = function() {
	  this.close_.style['display'] = this.get('hideCloseButton') ? 'none' : '';
	};
	InfoBubble.prototype['hideCloseButton_changed'] =
		InfoBubble.prototype.hideCloseButton_changed;
	
	
	/**
	 * Set the background color
	 *
	 * @param {string} color The color to set.
	 */
	InfoBubble.prototype.setBackgroundColor = function(color) {
	  if (color) {
		this.set('backgroundColor', color);
	  }
	};
	InfoBubble.prototype['setBackgroundColor'] =
		InfoBubble.prototype.setBackgroundColor;
	
	
	/**
	 * backgroundColor changed MVC callback
	 */
	InfoBubble.prototype.backgroundColor_changed = function() {
	  var backgroundColor = this.get('backgroundColor');
	  this.contentContainer_.style['backgroundColor'] = backgroundColor;
	
	  this.arrowInner_.style['borderColor'] = backgroundColor +
		  ' transparent transparent';
	  this.updateTabStyles_();
	};
	InfoBubble.prototype['backgroundColor_changed'] =
		InfoBubble.prototype.backgroundColor_changed;
		
	
	InfoBubble.prototype.setHeaderText = function(headerText) {
		this.set('headerText', headerText);
	};
	InfoBubble.prototype['setHeaderText'] =
		InfoBubble.prototype.setHeaderText;
		
	InfoBubble.prototype.getHeaderText = function() {
	  return this.get('headerText');      
	};
	InfoBubble.prototype['getHeaderText'] = InfoBubble.prototype.getHeaderText;
	
	InfoBubble.prototype.getHeader = function() {
		if(this.get('headerText') && this.get('headerText').length > 2) {
			return ($('<div></div>').css({
					'background-color': '#EEE', 'padding': '0px 5px 0px 5px'
				})
				.append($('<h3 style="margin:0px !important;"></h3>')
						.html(this.get('headerText')))
				.get(0));
		}
		else if(!this.hideCloseButton) {
			return $('<div></div>').css({'height': '15px'}).get(0);
		}
		else {
			return $('<div></div>').css({'display': 'none'}).get(0);	
		}
					
	};
	InfoBubble.prototype['getHeader'] = InfoBubble.prototype.getHeader;
	
	
	InfoBubble.prototype.setFooter = function(footer) {
	  //if (footer) {
		this.set('footer', footer);
	  //}
	};
	InfoBubble.prototype['setFooter'] =
		InfoBubble.prototype.setFooter;
	
	
	InfoBubble.prototype.getFooter = function() {
	  //alert(this.get('footer'));
	  if(this.get('footer') != null)
	  {
		  return ($('<div></div>').css({
				  'background-color': '#FFFFFF',
				  'border-top': 'solid 1px #ccc',
				  'height': '40px',
				  'margin-top': '10px'
			  })
			  .append(this.get('footer'))
		  ).get(0);
	  }
	  //alert('return null!');
	  return null;
					
	};
	InfoBubble.prototype['getFooter'] = InfoBubble.prototype.getFooter;
	
	
	
	/**
	 * Set the border color
	 *
	 * @param {string} color The border color.
	 */
	InfoBubble.prototype.setBorderColor = function(color) {
	  if (color) {
		this.set('borderColor', color);
	  }
	};
	InfoBubble.prototype['setBorderColor'] = InfoBubble.prototype.setBorderColor;
	
	
	/**
	 * borderColor changed MVC callback
	 */
	InfoBubble.prototype.borderColor_changed = function() {
	  var borderColor = this.get('borderColor');
	
	  var contentContainer = this.contentContainer_;
	  var arrowOuter = this.arrowOuter_;
	  contentContainer.style['borderColor'] = borderColor;
	
	  arrowOuter.style['borderColor'] = borderColor +
		  ' transparent transparent';
	
	  contentContainer.style['borderStyle'] =
		  arrowOuter.style['borderStyle'] =
		  this.arrowInner_.style['borderStyle'] = 'solid';
	
	  this.updateTabStyles_();
	};
	InfoBubble.prototype['borderColor_changed'] =
		InfoBubble.prototype.borderColor_changed;
	
	
	/**
	 * Set the radius of the border
	 *
	 * @param {number} radius The radius of the border.
	 */
	InfoBubble.prototype.setBorderRadius = function(radius) {
	  this.set('borderRadius', radius);
	};
	InfoBubble.prototype['setBorderRadius'] = InfoBubble.prototype.setBorderRadius;
	
	
	/**
	 * Get the radius of the border
	 *
	 * @private
	 * @return {number} The radius of the border.
	 */
	InfoBubble.prototype.getBorderRadius_ = function() {
		//alert(this.get('borderRadius'));
	  return parseInt(this.get('borderRadius'), 10) || 5;
	};
	
	
	/**
	 * borderRadius changed MVC callback
	 */
	InfoBubble.prototype.borderRadius_changed = function() {
	  var borderRadius = this.getBorderRadius_();
	  var borderWidth = this.getBorderWidth_();
	
	  this.contentContainer_.style['borderRadius'] =
		  this.contentContainer_.style['MozBorderRadius'] =
		  this.contentContainer_.style['webkitBorderRadius'] =
		  this.bubbleShadow_.style['borderRadius'] =
		  this.bubbleShadow_.style['MozBorderRadius'] =
		  this.bubbleShadow_.style['webkitBorderRadius'] = this.px(borderRadius);
	
	  this.tabsContainer_.style['paddingLeft'] =
		  this.tabsContainer_.style['paddingRight'] =
		  this.px(borderRadius + borderWidth);
	
	  this.redraw_();
	};
	InfoBubble.prototype['borderRadius_changed'] =
		InfoBubble.prototype.borderRadius_changed;
	
	
	/**
	 * Get the width of the border
	 *
	 * @private
	 * @return {number} width The width of the border.
	 */
	InfoBubble.prototype.getBorderWidth_ = function() {
	  return parseInt(this.get('borderWidth'), 10) || 0;
	};
	
	
	/**
	 * Set the width of the border
	 *
	 * @param {number} width The width of the border.
	 */
	InfoBubble.prototype.setBorderWidth = function(width) {
	  this.set('borderWidth', width);
	};
	InfoBubble.prototype['setBorderWidth'] = InfoBubble.prototype.setBorderWidth;
	
	
	/**
	 * borderWidth change MVC callback
	 */
	InfoBubble.prototype.borderWidth_changed = function() {
	  var borderWidth = this.getBorderWidth_();
	
	  this.contentContainer_.style['borderWidth'] = this.px(borderWidth);
	  this.tabsContainer_.style['top'] = this.px(borderWidth);
	
	  this.updateArrowStyle_();
	  this.updateTabStyles_();
	  this.borderRadius_changed();
	  this.redraw_();
	};
	InfoBubble.prototype['borderWidth_changed'] =
		InfoBubble.prototype.borderWidth_changed;
	
	
	/**
	 * Update the arrow style
	 * @private
	 */
	InfoBubble.prototype.updateArrowStyle_ = function() {
	  var borderWidth = this.getBorderWidth_();
	  var arrowSize = this.getArrowSize_();
	  var arrowStyle = this.getArrowStyle_();
	  var arrowOuterSizePx = this.px(arrowSize);
	  var arrowInnerSizePx = this.px(Math.max(0, arrowSize - borderWidth));
	
	  var outer = this.arrowOuter_;
	  var inner = this.arrowInner_;
	
	  this.arrow_.style['marginTop'] = this.px(-borderWidth);
	  outer.style['borderTopWidth'] = arrowOuterSizePx;
	  inner.style['borderTopWidth'] = arrowInnerSizePx;
	
	  // Full arrow or arrow pointing to the left
	  if (arrowStyle == 0 || arrowStyle == 1) {
		outer.style['borderLeftWidth'] = arrowOuterSizePx;
		inner.style['borderLeftWidth'] = arrowInnerSizePx;
	  } else {
		outer.style['borderLeftWidth'] = inner.style['borderLeftWidth'] = 0;
	  }
	
	  // Full arrow or arrow pointing to the right
	  if (arrowStyle == 0 || arrowStyle == 2) {
		outer.style['borderRightWidth'] = arrowOuterSizePx;
		inner.style['borderRightWidth'] = arrowInnerSizePx;
	  } else {
		outer.style['borderRightWidth'] = inner.style['borderRightWidth'] = 0;
	  }
	
	  if (arrowStyle < 2) {
		outer.style['marginLeft'] = this.px(-(arrowSize));
		inner.style['marginLeft'] = this.px(-(arrowSize - borderWidth));
	  } else {
		outer.style['marginLeft'] = inner.style['marginLeft'] = 0;
	  }
	
	  // If there is no border then don't show thw outer arrow
	  if (borderWidth == 0) {
		outer.style['display'] = 'none';
	  } else {
		outer.style['display'] = '';
	  }
	};
	
	
	/**
	 * Set the padding of the InfoBubble
	 *
	 * @param {number} padding The padding to apply.
	 */
	InfoBubble.prototype.setPadding = function(padding) {
	  this.set('padding', padding);
	};
	InfoBubble.prototype['setPadding'] = InfoBubble.prototype.setPadding;
	
	
	/**
	 * Set the padding of the InfoBubble
	 *
	 * @private
	 * @return {number} padding The padding to apply.
	 */
	InfoBubble.prototype.getPadding_ = function() {
	  return parseInt(this.get('padding'), 10) || 0;
	};
	
	
	/**
	 * padding changed MVC callback
	 */
	InfoBubble.prototype.padding_changed = function() {
	  var padding = this.getPadding_();
	  this.contentContainer_.style['padding'] = this.px(padding);
	  this.updateTabStyles_();
	
	  this.redraw_();
	};
	InfoBubble.prototype['padding_changed'] = InfoBubble.prototype.padding_changed;
	
	
	/**
	 * Add px extention to the number
	 *
	 * @param {number} num The number to wrap.
	 * @return {string|number} A wrapped number.
	 */
	InfoBubble.prototype.px = function(num) {
	  if (num) {
		// 0 doesn't need to be wrapped
		return num + 'px';
	  }
	  return num;
	};
	
	
	/**
	 * Add events to stop propagation
	 * @private
	 */
	InfoBubble.prototype.addEvents_ = function() {
	  // We want to cancel all the events so they do not go to the map
	  var events = ['mousedown', 'mousemove', 'mouseover', 'mouseout', 'mouseup',
		  'mousewheel', 'DOMMouseScroll', 'touchstart', 'touchend', 'touchmove',
		  'dblclick', 'contextmenu', 'click'];
	
	  var bubble = this.bubble_;
	  this.listeners_ = [];
	  for (var i = 0, event; event = events[i]; i++) {
		this.listeners_.push(
		  google.maps.event.addDomListener(bubble, event, function(e) {
			e.cancelBubble = true;
			if (e.stopPropagation) {
			  e.stopPropagation();
			}
		  })
		);
	  }
	};
	
	
	/**
	 * On Adding the InfoBubble to a map
	 * Implementing the OverlayView interface
	 */
	InfoBubble.prototype.onAdd = function() {
	  if (!this.bubble_) {
		this.buildDom_();
	  }
	
	  this.addEvents_();
	
	  var panes = this.getPanes();
	  if (panes) {
		panes.floatPane.appendChild(this.bubble_);
		panes.floatShadow.appendChild(this.bubbleShadow_);
	  }
	};
	InfoBubble.prototype['onAdd'] = InfoBubble.prototype.onAdd;
	
	
	/**
	 * Draw the InfoBubble
	 * Implementing the OverlayView interface
	 */
	InfoBubble.prototype.draw = function() {
	  var projection = this.getProjection();
	
	  if (!projection) {
		// The map projection is not ready yet so do nothing
		return;
	  }
	
	  var latLng = /** @type {google.maps.LatLng} */ (this.get('position'));
	
	  if (!latLng) {
		this.close();
		return;
	  }
	
	  var tabHeight = 0;
	
	  if (this.activeTab_) {
		tabHeight = this.activeTab_.offsetHeight;
	  }
	
	  var anchorHeight = this.getAnchorHeight_();
	  var arrowSize = this.getArrowSize_();
	  var arrowPosition = this.getArrowPosition_();
	
	  arrowPosition = arrowPosition / 100;
	
	  var pos = projection.fromLatLngToDivPixel(latLng);
	  var width = this.contentContainer_.offsetWidth;
	  var height = this.bubble_.offsetHeight;
	
	  if (!width) {
		return;
	  }
	
	  // Adjust for the height of the info bubble
	  var top = pos.y - (height + arrowSize);
	
	  if (anchorHeight) {
		// If there is an anchor then include the height
		top -= anchorHeight;
	  }
	
	  var left = pos.x - (width * arrowPosition);
	
	  this.bubble_.style['top'] = this.px(top);
	  this.bubble_.style['left'] = this.px(left);
	
	  var shadowStyle = parseInt(this.get('shadowStyle'), 10);
	
	  switch (shadowStyle) {
		case 1:
		  // Shadow is behind
		  this.bubbleShadow_.style['top'] = this.px(top + tabHeight - 1);
		  this.bubbleShadow_.style['left'] = this.px(left);
		  this.bubbleShadow_.style['width'] = this.px(width);
		  this.bubbleShadow_.style['height'] =
			  this.px(this.contentContainer_.offsetHeight - arrowSize);
		  break;
		case 2:
		  // Shadow is below
		  width = width * 0.8;
		  if (anchorHeight) {
			this.bubbleShadow_.style['top'] = this.px(pos.y);
		  } else {
			this.bubbleShadow_.style['top'] = this.px(pos.y + arrowSize);
		  }
		  this.bubbleShadow_.style['left'] = this.px(pos.x - width * arrowPosition);
	
		  this.bubbleShadow_.style['width'] = this.px(width);
		  this.bubbleShadow_.style['height'] = this.px(2);
		  break;
	  }
	};
	InfoBubble.prototype['draw'] = InfoBubble.prototype.draw;
	
	
	/**
	 * Removing the InfoBubble from a map
	 */
	InfoBubble.prototype.onRemove = function() {
	  if (this.bubble_ && this.bubble_.parentNode) {
		this.bubble_.parentNode.removeChild(this.bubble_);
	  }
	  if (this.bubbleShadow_ && this.bubbleShadow_.parentNode) {
		this.bubbleShadow_.parentNode.removeChild(this.bubbleShadow_);
	  }
	
	  for (var i = 0, listener; listener = this.listeners_[i]; i++) {
		google.maps.event.removeListener(listener);
	  }
	};
	InfoBubble.prototype['onRemove'] = InfoBubble.prototype.onRemove;
	
	
	/**
	 * Is the InfoBubble open
	 *
	 * @return {boolean} If the InfoBubble is open.
	 */
	InfoBubble.prototype.isOpen = function() {
	  return this.isOpen_;
	};
	InfoBubble.prototype['isOpen'] = InfoBubble.prototype.isOpen;
	
	
	/**
	 * Close the InfoBubble
	 */
	InfoBubble.prototype.close = function() {
	  if (this.bubble_) {
		this.bubble_.style['display'] = 'none';
		// Remove the animation so we next time it opens it will animate again
		this.bubble_.className =
			this.bubble_.className.replace(this.animationName_, '');
	  }
	
	  if (this.bubbleShadow_) {
		this.bubbleShadow_.style['display'] = 'none';
		this.bubbleShadow_.className =
			this.bubbleShadow_.className.replace(this.animationName_, '');
	  }
	  this.isOpen_ = false;
	};
	InfoBubble.prototype['close'] = InfoBubble.prototype.close;
	
	
	/**
	 * Open the InfoBubble
	 *
	 * @param {google.maps.Map=} opt_map Optional map to open on.
	 * @param {google.maps.MVCObject=} opt_anchor Optional anchor to position at.
	 */
	InfoBubble.prototype.open = function(opt_map, opt_anchor) {
	  if (opt_map) {
		this.setMap(opt_map);
	  }
	
	  if (opt_anchor) {
		this.set('anchor', opt_anchor);
		this.bindTo('anchorPoint', opt_anchor);
		this.bindTo('position', opt_anchor);
	  }
	
	  // Show the bubble and the show
	  this.bubble_.style['display'] = this.bubbleShadow_.style['display'] = '';
	  var animation = !this.get('disableAnimation');
	
	  if (animation) {
		// Add the animation
		this.bubble_.className += ' ' + this.animationName_;
		this.bubbleShadow_.className += ' ' + this.animationName_;
	  }
	
	  this.redraw_();
	  this.isOpen_ = true;
	
	  var pan = !this.get('disableAutoPan');
	  if (pan) {
		var that = this;
		//that.panToView();
		window.setTimeout(function() {
		  // Pan into view, done in a time out to make it feel nicer :)
		  that.panToView();
		}, 200);
	  }
	};
	InfoBubble.prototype['open'] = InfoBubble.prototype.open;
	
	
	/**
	 * Set the position of the InfoBubble
	 *
	 * @param {google.maps.LatLng} position The position to set.
	 */
	InfoBubble.prototype.setPosition = function(position) {
	  if (position) {
		this.setAnchor(null);
		this.set('position', position);
        console.log(position);
	  }
	};
	InfoBubble.prototype['setPosition'] = InfoBubble.prototype.setPosition;
	
	/* SV added */
	InfoBubble.prototype.setAnchor = function(anchor) {
	  if (anchor) {
		this.set('anchor', anchor);
		this.bindTo('anchorPoint', anchor);
		this.bindTo('position', anchor);
	  } else if (this.get('anchor')) {
		this.set('anchor', null);
		this.unbind('anchorPoint');
		this.unbind('position');
	  }
	};
	InfoBubble.prototype['setAnchor'] = InfoBubble.prototype.setAnchor;
	/* end SV added */
	
	
	/**
	 * Returns the position of the InfoBubble
	 *
	 * @return {google.maps.LatLng} the position.
	 */
	InfoBubble.prototype.getPosition = function() {
	  return /** @type {google.maps.LatLng} */ (this.get('position'));
	};
	InfoBubble.prototype['getPosition'] = InfoBubble.prototype.getPosition;
	
	
	/**
	 * position changed MVC callback
	 */
	InfoBubble.prototype.position_changed = function() {
	  this.draw();
	};
	InfoBubble.prototype['position_changed'] =
		InfoBubble.prototype.position_changed;
	
	
	/**
	 * Pan the InfoBubble into view
	 */
	InfoBubble.prototype.panToView = function() {
	  var projection = this.getProjection();
	
	  if (!projection) {
		// The map projection is not ready yet so do nothing
		return;
	  }
	
	  if (!this.bubble_) {
		// No Bubble yet so do nothing
		return;
	  }
	
	  var map = this.get('map');
	  var latLng = this.getPosition();
	  var pos = projection.fromLatLngToContainerPixel(latLng);
	  var height = $(this.get('content')).height();
	  pos.y -= height/2;
	  latLng = projection.fromContainerPixelToLatLng(pos);
	
	  if (map.getCenter() != latLng) {
		map.setCenter(latLng);
	  }

	};
	InfoBubble.prototype['panToView'] = InfoBubble.prototype.panToView;
	
	
	/**
	 * Converts a HTML string to a document fragment.
	 *
	 * @param {string} htmlString The HTML string to convert.
	 * @return {Node} A HTML document fragment.
	 * @private
	 */
	InfoBubble.prototype.htmlToDocumentFragment_ = function(htmlString) {
	  htmlString = htmlString.replace(/^\s*([\S\s]*)\b\s*$/, '$1');
	  var tempDiv = document.createElement('DIV');
	  tempDiv.innerHTML = htmlString;
	  if (tempDiv.childNodes.length == 1) {
		return /** @type {!Node} */ (tempDiv.removeChild(tempDiv.firstChild));
	  } else {
		var fragment = document.createDocumentFragment();
		while (tempDiv.firstChild) {
		  fragment.appendChild(tempDiv.firstChild);
		}
		return fragment;
	  }
	};
	
	
	/**
	 * Removes all children from the node.
	 *
	 * @param {Node} node The node to remove all children from.
	 * @private
	 */
	InfoBubble.prototype.removeChildren_ = function(node) {
	  if (!node) {
		return;
	  }
	
	  var child;
	  while (child = node.firstChild) {
		node.removeChild(child);
	  }
	};
	
	
	/**
	 * Sets the content of the infobubble.
	 *
	 * @param {string|Node} content The content to set.
	 */
	InfoBubble.prototype.setContent = function(content) {
	  this.set('content', content);
	};
	InfoBubble.prototype['setContent'] = InfoBubble.prototype.setContent;
	
	
	/**
	 * Get the content of the infobubble.
	 *
	 * @return {string|Node} The marker content.
	 */
	InfoBubble.prototype.getContent = function() {
	  return /** @type {Node|string} */ (this.get('content'));
	};
	InfoBubble.prototype['getContent'] = InfoBubble.prototype.getContent;
	
	
	/**
	 * Sets the marker content and adds loading events to images
	 */
	InfoBubble.prototype.content_changed = function() {
		//alert('content changed');
	  if (!this.content_) {
		// The Content area doesnt exist.
		return;
	  }
	
	  this.removeChildren_(this.content_);
	  var header = this.getHeader();
	  var content = this.getContent();
	  var footer = this.getFooter();
	  if (content) {
		if (typeof content == 'string') {
		  content = this.htmlToDocumentFragment_(content);
		}
		if(header)
		  this.content_.appendChild(header);
		this.content_.appendChild(content);
		if(footer) {
		  this.content_.appendChild(footer);
		}
	
		var that = this;
		var images = this.content_.getElementsByTagName('IMG');
		for (var i = 0, image; image = images[i]; i++) {
		  // Because we don't know the size of an image till it loads, add a
		  // listener to the image load so the marker can resize and reposition
		  // itself to be the correct height.
		  google.maps.event.addDomListener(image, 'load', function() {
			that.imageLoaded_();
		  });
		}
		google.maps.event.trigger(this, 'domready');
	  }
	  this.redraw_();
	};
	InfoBubble.prototype['content_changed'] =
		InfoBubble.prototype.content_changed;
	
	
	/**
	 * Image loaded
	 * @private
	 */
	InfoBubble.prototype.imageLoaded_ = function() {
	  var pan = !this.get('disableAutoPan');
	  this.redraw_();
	  if (pan && (this.tabs_.length == 0 || this.activeTab_.index == 0)) {
		this.panToView();
	  }
	
	};
	
	/**
	 * Updates the styles of the tabs
	 * @private
	 */
	InfoBubble.prototype.updateTabStyles_ = function() {
	  if (this.tabs_ && this.tabs_.length) {
		for (var i = 0, tab; tab = this.tabs_[i]; i++) {
		  this.setTabStyle_(tab.tab);
		}
		this.activeTab_.style['zIndex'] = this.baseZIndex_;
		var borderWidth = this.getBorderWidth_();
		var padding = this.getPadding_() / 2;
		this.activeTab_.style['borderBottomWidth'] = 0;
		this.activeTab_.style['paddingBottom'] = this.px(padding + borderWidth);
	  }
	};
	
	
	/**
	 * Sets the style of a tab
	 * @private
	 * @param {Element} tab The tab to style.
	 */
	InfoBubble.prototype.setTabStyle_ = function(tab) {
	  var backgroundColor = this.get('backgroundColor');
	  var borderColor = this.get('borderColor');
	  var borderRadius = this.getBorderRadius_();
	  var borderWidth = this.getBorderWidth_();
	  var padding = this.getPadding_();
	
	  var marginRight = this.px(-(Math.max(padding, borderRadius)));
	  var borderRadiusPx = this.px(borderRadius);
	
	  var index = this.baseZIndex_;
	  if (tab.index) {
		index -= tab.index;
	  }
	
	  // The styles for the tab
	  var styles = {
		'cssFloat': 'left',
		'position': 'relative',
		'cursor': 'pointer',
		'backgroundColor': backgroundColor,
		'border': this.px(borderWidth) + ' solid ' + borderColor,
		'padding': this.px(padding / 2) + ' ' + this.px(padding),
		'marginRight': marginRight,
		'whiteSpace': 'nowrap',
		'borderRadiusTopLeft': borderRadiusPx,
		'MozBorderRadiusTopleft': borderRadiusPx,
		'webkitBorderTopLeftRadius': borderRadiusPx,
		'borderRadiusTopRight': borderRadiusPx,
		'MozBorderRadiusTopright': borderRadiusPx,
		'webkitBorderTopRightRadius': borderRadiusPx,
		'zIndex': index,
		'display': 'inline'
	  };
	
	  for (var style in styles) {
		tab.style[style] = styles[style];
	  }
	
	  var className = this.get('tabClassName');
	  if (className != undefined) {
		tab.className += ' ' + className;
	  }
	};
	
	
	/**
	 * Add user actions to a tab
	 * @private
	 * @param {Object} tab The tab to add the actions to.
	 */
	InfoBubble.prototype.addTabActions_ = function(tab) {
	  var that = this;
	  tab.listener_ = google.maps.event.addDomListener(tab, 'click', function() {
		that.setTabActive_(this);
	  });
	};
	
	
	/**
	 * Set a tab at a index to be active
	 *
	 * @param {number} index The index of the tab.
	 */
	InfoBubble.prototype.setTabActive = function(index) {
	  var tab = this.tabs_[index - 1];
	
	  if (tab) {
		this.setTabActive_(tab.tab);
	  }
	};
	InfoBubble.prototype['setTabActive'] = InfoBubble.prototype.setTabActive;
	
	
	/**
	 * Set a tab to be active
	 * @private
	 * @param {Object} tab The tab to set active.
	 */
	InfoBubble.prototype.setTabActive_ = function(tab) {
	  if (!tab) {
		this.setContent('');
		return;
	  }
	
	  var padding = this.getPadding_() / 2;
	  var borderWidth = this.getBorderWidth_();
	
	  if (this.activeTab_) {
		var activeTab = this.activeTab_;
		activeTab.style['zIndex'] = this.baseZIndex_ - activeTab.index;
		activeTab.style['paddingBottom'] = this.px(padding);
		activeTab.style['borderBottomWidth'] = this.px(borderWidth);
	  }
	
	  tab.style['zIndex'] = this.baseZIndex_;
	  tab.style['borderBottomWidth'] = 0;
	  tab.style['marginBottomWidth'] = '-10px';
	  tab.style['paddingBottom'] = this.px(padding + borderWidth);
	
	  this.setContent(this.tabs_[tab.index].content);
	
	  this.activeTab_ = tab;
	
	  this.redraw_();
	};
	
	
	/**
	 * Set the max width of the InfoBubble
	 *
	 * @param {number} width The max width.
	 */
	InfoBubble.prototype.setMaxWidth = function(width) {
	  this.set('maxWidth', width);
	};
	InfoBubble.prototype['setMaxWidth'] = InfoBubble.prototype.setMaxWidth;
	
	
	/**
	 * maxWidth changed MVC callback
	 */
	InfoBubble.prototype.maxWidth_changed = function() {
	  this.redraw_();
	};
	InfoBubble.prototype['maxWidth_changed'] =
		InfoBubble.prototype.maxWidth_changed;
	
	
	/**
	 * Set the max height of the InfoBubble
	 *
	 * @param {number} height The max height.
	 */
	InfoBubble.prototype.setMaxHeight = function(height) {
	  this.set('maxHeight', height);
	};
	InfoBubble.prototype['setMaxHeight'] = InfoBubble.prototype.setMaxHeight;
	
	
	/**
	 * maxHeight changed MVC callback
	 */
	InfoBubble.prototype.maxHeight_changed = function() {
	  this.redraw_();
	};
	InfoBubble.prototype['maxHeight_changed'] =
		InfoBubble.prototype.maxHeight_changed;
	
	
	/**
	 * Set the min width of the InfoBubble
	 *
	 * @param {number} width The min width.
	 */
	InfoBubble.prototype.setMinWidth = function(width) {
	  this.set('minWidth', width);
	};
	InfoBubble.prototype['setMinWidth'] = InfoBubble.prototype.setMinWidth;
	
	
	/**
	 * minWidth changed MVC callback
	 */
	InfoBubble.prototype.minWidth_changed = function() {
	  this.redraw_();
	};
	InfoBubble.prototype['minWidth_changed'] =
		InfoBubble.prototype.minWidth_changed;
	
	
	/**
	 * Set the min height of the InfoBubble
	 *
	 * @param {number} height The min height.
	 */
	InfoBubble.prototype.setMinHeight = function(height) {
	  this.set('minHeight', height);
	};
	InfoBubble.prototype['setMinHeight'] = InfoBubble.prototype.setMinHeight;
	
	
	/**
	 * minHeight changed MVC callback
	 */
	InfoBubble.prototype.minHeight_changed = function() {
	  this.redraw_();
	};
	InfoBubble.prototype['minHeight_changed'] =
		InfoBubble.prototype.minHeight_changed;
	
	
	/**
	 * Add a tab
	 *
	 * @param {string} label The label of the tab.
	 * @param {string|Element} content The content of the tab.
	 */
	InfoBubble.prototype.addTab = function(label, content) {
	  var tab = document.createElement('DIV');
	  tab.innerHTML = label;
	
	  this.setTabStyle_(tab);
	  this.addTabActions_(tab);
	
	  this.tabsContainer_.appendChild(tab);
	
	  this.tabs_.push({
		label: label,
		content: content,
		tab: tab
	  });
	
	  tab.index = this.tabs_.length - 1;
	  tab.style['zIndex'] = this.baseZIndex_ - tab.index;
	
	  if (!this.activeTab_) {
		this.setTabActive_(tab);
	  }
	
	  tab.className = tab.className + ' ' + this.animationName_;
	
	  this.redraw_();
	};
	InfoBubble.prototype['addTab'] = InfoBubble.prototype.addTab;
	
	/**
	 * Update a tab at a speicifc index
	 *
	 * @param {number} index The index of the tab.
	 * @param {?string} opt_label The label to change to.
	 * @param {?string} opt_content The content to update to.
	 */
	InfoBubble.prototype.updateTab = function(index, opt_label, opt_content) {
	  if (!this.tabs_.length || index < 0 || index >= this.tabs_.length) {
		return;
	  }
	
	  var tab = this.tabs_[index];
	  if (opt_label != undefined) {
		tab.tab.innerHTML = tab.label = opt_label;
	  }
	
	  if (opt_content != undefined) {
		tab.content = opt_content;
	  }
	
	  if (this.activeTab_ == tab.tab) {
		this.setContent(tab.content);
	  }
	  this.redraw_();
	};
	InfoBubble.prototype['updateTab'] = InfoBubble.prototype.updateTab;
	
	
	/**
	 * Remove a tab at a specific index
	 *
	 * @param {number} index The index of the tab to remove.
	 */
	InfoBubble.prototype.removeTab = function(index) {
	  if (!this.tabs_.length || index < 0 || index >= this.tabs_.length) {
		return;
	  }
	
	  var tab = this.tabs_[index];
	  tab.tab.parentNode.removeChild(tab.tab);
	
	  google.maps.event.removeListener(tab.tab.listener_);
	
	  this.tabs_.splice(index, 1);
	
	  delete tab;
	
	  for (var i = 0, t; t = this.tabs_[i]; i++) {
		t.tab.index = i;
	  }
	
	  if (tab.tab == this.activeTab_) {
		// Removing the current active tab
		if (this.tabs_[index]) {
		  // Show the tab to the right
		  this.activeTab_ = this.tabs_[index].tab;
		} else if (this.tabs_[index - 1]) {
		  // Show a tab to the left
		  this.activeTab_ = this.tabs_[index - 1].tab;
		} else {
		  // No tabs left to sho
		  this.activeTab_ = undefined;
		}
	
		this.setTabActive_(this.activeTab_);
	  }
	
	  this.redraw_();
	};
	InfoBubble.prototype['removeTab'] = InfoBubble.prototype.removeTab;
	
	
	/**
	 * Get the size of an element
	 * @private
	 * @param {Node|string} element The element to size.
	 * @param {number=} opt_maxWidth Optional max width of the element.
	 * @param {number=} opt_maxHeight Optional max height of the element.
	 * @return {google.maps.Size} The size of the element.
	 */
	InfoBubble.prototype.getElementSize_ = function(element, opt_maxWidth,
													opt_maxHeight) {
	  var sizer = document.createElement('DIV');
	  sizer.style['display'] = 'inline';
	  sizer.style['position'] = 'absolute';
	  sizer.style['visibility'] = 'hidden';
	
	  if (typeof element == 'string') {
		sizer.innerHTML = element;
	  } else {
		//hack:  work around so iframe doesn't un-necessarily reload!
		//alert($(element).height() + ' - ' + $(element).width());
		//var w = $(element).width() + 15, h = $(element).height();
		//if(this.doNotPad){ w-=15; }
		var w = $(element).width(), h = $(element).height();
		var footer = this.get('footer');
		//alert(h);
		// to incorporate header / footer height:
		if(footer != null) { h += 95; } else { h += 55; } //h += 55;
		//alert(h);
		sizer.appendChild($('<div></div>').css({ 'width': w, 'height': h }).get(0));
		//sizer.appendChild(element.cloneNode(true)); //(original code)
	  }
	
	  document.body.appendChild(sizer);
	  var size = new google.maps.Size(sizer.offsetWidth, sizer.offsetHeight);
	
	  // If the width is bigger than the max width then set the width and size again
	  if (opt_maxWidth && size.width > opt_maxWidth) {
		sizer.style['width'] = this.px(opt_maxWidth);
		size = new google.maps.Size(sizer.offsetWidth, sizer.offsetHeight);
	  }
	
	  // If the height is bigger than the max height then set the height and size
	  // again
	  if (opt_maxHeight && size.height > opt_maxHeight) {
		sizer.style['height'] = this.px(opt_maxHeight);
		size = new google.maps.Size(sizer.offsetWidth, sizer.offsetHeight);
	  }
	
	  document.body.removeChild(sizer);
	  delete sizer;
	  return size;
	};
	
	
	/**
	 * Redraw the InfoBubble
	 * @private
	 */
	InfoBubble.prototype.redraw_ = function() {
	  this.figureOutSize_();
	  this.positionCloseButton_();
	  this.draw();
	};
	
	
	/**
	 * Figure out the optimum size of the InfoBubble
	 * @private
	 */
	InfoBubble.prototype.figureOutSize_ = function() {
	  var map = this.get('map');
	
	  if (!map) {
		return;
	  }
	
	  var padding = this.getPadding_();
	  var borderWidth = this.getBorderWidth_();
	  var borderRadius = this.getBorderRadius_();
	  var arrowSize = this.getArrowSize_();
	
	  var mapDiv = map.getDiv();
	  var gutter = arrowSize * 2;
	  var mapWidth = mapDiv.offsetWidth - gutter;
	  var mapHeight = mapDiv.offsetHeight - gutter - this.getAnchorHeight_();
	  var tabHeight = 0;
	  var width = /** @type {number} */ (this.get('minWidth') || 0);
	  var height = /** @type {number} */ (this.get('minHeight') || 0);
	  var maxWidth = /** @type {number} */ (this.get('maxWidth') || 0);
	  var maxHeight = /** @type {number} */ (this.get('maxHeight') || 0);
	
	  maxWidth = Math.min(mapWidth, maxWidth);
	  maxHeight = Math.min(mapHeight, maxHeight);
	
	  var tabWidth = 0;
	  if (this.tabs_.length) {
		// If there are tabs then you need to check the size of each tab's content
		for (var i = 0, tab; tab = this.tabs_[i]; i++) {
		  var tabSize = this.getElementSize_(tab.tab, maxWidth, maxHeight);
		  var contentSize = this.getElementSize_(tab.content, maxWidth, maxHeight);
	
		  if (width < tabSize.width) {
			width = tabSize.width;
		  }
	
		  // Add up all the tab widths because they might end up being wider than
		  // the content
		  tabWidth += tabSize.width;
	
		  if (height < tabSize.height) {
			height = tabSize.height;
		  }
	
		  if (tabSize.height > tabHeight) {
			tabHeight = tabSize.height;
		  }
	
		  if (width < contentSize.width) {
			width = contentSize.width;
		  }
	
		  if (height < contentSize.height) {
			height = contentSize.height;
		  }
		}
	  } else {
		var content = /** @type {string|Node} */ (this.get('content'));
		if (typeof content == 'string') {
		  content = this.htmlToDocumentFragment_(content);
		}
		if (content) {
		  //var contentSize = {'width': 500, 'height': 300 };
		  //causes too many reloads when usingi
		  var contentSize = this.getElementSize_(content, maxWidth, maxHeight);
	
		  if (width < contentSize.width) {
			width = contentSize.width;
		  }
	
		  if (height < contentSize.height) {
			height = contentSize.height;
		  }
		}
	  }
	
	  if (maxWidth) {
		width = Math.min(width, maxWidth);
	  }
	
	  if (maxHeight) {
		height = Math.min(height, maxHeight);
	  }
	
	  width = Math.max(width, tabWidth);
	
	  if (width == tabWidth) {
		width = width + 2 * padding;
	  }
	
	  arrowSize = arrowSize * 2;
	  width = Math.max(width, arrowSize);
	
	  // Maybe add this as a option so they can go bigger than the map if the user
	  // wants
	  if (width > mapWidth) {
		width = mapWidth;
	  }
	
	  if (height > mapHeight) {
		height = mapHeight - tabHeight;
	  }
	
	  if (this.tabsContainer_) {
		this.tabHeight_ = tabHeight;
		this.tabsContainer_.style['width'] = this.px(tabWidth);
	  }
	
	  this.contentContainer_.style['width'] = this.px(width);
	  //this.contentContainer_.style['height'] = this.px(height);
	};
	
	
	/**
	 *  Get the height of the anchor
	 *
	 *  This function is a hack for now and doesn't really work that good, need to
	 *  wait for pixelBounds to be correctly exposed.
	 *  @private
	 *  @return {number} The height of the anchor.
	 */
	InfoBubble.prototype.getAnchorHeight_ = function() {
	  var anchor = this.get('anchor');
	  if (anchor) {
		var anchorPoint = /** @type google.maps.Point */(this.get('anchorPoint'));
	
		if (anchorPoint) {
		  return -1 * anchorPoint.y;
		}
	  }
	  return 0;
	};
	
	InfoBubble.prototype.anchorPoint_changed = function() {
	  this.draw();
	};
	InfoBubble.prototype['anchorPoint_changed'] = InfoBubble.prototype.anchorPoint_changed;
	
	
	/**
	 * Position the close button in the right spot.
	 * @private
	 */
	InfoBubble.prototype.positionCloseButton_ = function() {
	  var br = this.getBorderRadius_();
	  var bw = this.getBorderWidth_();
	
	  var right = 2;
	  var top = 2;
	
	  if (this.tabs_.length && this.tabHeight_) {
		top += this.tabHeight_;
	  }
	
	  top += bw;
	  right += bw;
	
	  var c = this.contentContainer_;
	  /*if (c && c.clientHeight < c.scrollHeight) {
		// If there are scrollbars then move the cross in so it is not over
		// scrollbar
		right += 15;
	  }*/
	
	  this.close_.style['right'] = this.px(right);
	  this.close_.style['top'] = this.px(top);
	};
	return InfoBubble;
});

define('lib/maps/overlays/infobubbles/base',['jquery',
        'form',
        'marionette',
        'handlebars',
        'google-infobubble',
        'underscore'//,
        //'bootstrap-form-templates'
    ],
    function ($, Form, Marionette, Handlebars, GoogleInfoBubble, _) {
        'use strict';
        /**
         * Manages InfoBubble Rendering
         * @class InfoBubble
         */
        var Base = Marionette.View.extend({
            /**
             * @lends localground.maps.views.InfoBubble#
             */

            /** A google.maps.Map object */
            map: null,

            /** A hook to global application events */
            bubble: null,
            tip: null,
            tipModel: null,
            template: null,
            overlay: null,

            events: {
                'click .btn-primary': 'saveForm',
                'click .btn-secondary': 'hideBubble'
            },

            modelEvents: {
                'show-bubble': 'showBubble',
                'hide-bubble': 'hideBubble',
                'show-tip': 'showTip',
                'hide-tip': 'hideTip'
            },

            /**
             * Initializes
             */
            initialize: function (opts) {
                this.opts = opts;
                $.extend(this, opts);
                this.map = this.app.getMap();
                this.bubble = new GoogleInfoBubble({
                    borderRadius: 5,
                    maxHeight: 385,
                    zIndex: 200,
                    padding: 0,
                    model: opts.model,
                    disableAnimation: true,
                    map: this.map
                });

                this.tip = new GoogleInfoBubble({
                    borderRadius: 5,
                    maxHeight: 385,
                    padding: 0,
                    zIndex: 100,
                    disableAnimation: true,
                    disableAutoPan: true,
                    hideCloseButton: true,
                    map: this.map
                });
                this.listenTo(this.app.vent, 'mode-change', this.refresh);
                this.listenTo(this.app.vent, 'hide-bubbles', this.hideBubble);
                this.listenTo(this.model, 'show-bubble', this.showBubble);
                this.listenTo(this.model, 'change', this.refresh);
                google.maps.event.addListener(this.bubble, 'domready', this.onBubbleRender.bind(this));
            },

            refresh: function () {
                if (this.bubble.isOpen()) {
                    this.showBubble({
                        model: this.bubble.model,
                        latLng: this.bubble.position
                    });
                }
            },

            onBubbleRender: function () {
                //Override this in child class
            },

            showBubble: function () {
                this.tip.close();
                this.app.vent.trigger('hide-bubbles', this.model.id);
                this.renderBubble();
            },

            renderBubble: function () {
                if (this.app.getMode() === "view") {
                    this.renderViewContent();
                } else {
                    this.renderEditContent();
                }
            },

            renderViewContent: function () {
                var template = this.getTemplate("InfoBubbleTemplate"),
                    that = this;
                this.$el = $(template(this.getContext()));
                this.$el.click(function (e) {
                    that.bringToFront(e);
                });
                this.showUpdatedContent();
            },
            bringToFront: function (e) {
                var zIndex;
                zIndex = parseInt(this.bubble.bubble_.style.zIndex, 10);
                this.bubble.bubble_.style.zIndex = zIndex + 1;
                e.preventDefault();
            },
            sendToBack: function (e) {
                var zIndex;
                zIndex = parseInt(this.bubble.bubble_.style.zIndex, 10);
                this.bubble.bubble_.style.zIndex = zIndex - 1;
                e.preventDefault();
            },
            renderEditContent: function () {
                var template = this.getTemplate("InfoBubbleTemplate"),
                    ModelForm = Form.extend({
                        schema: this.model.updateSchema
                    }),
                    context = this.getContext(this.model);
                //console.log(this.model.updateSchema);
                context.mode = 'edit';
                this.setElement($(template(context)));
                this.form = new ModelForm({
                    model: this.model
                }).render();
                this.$el.find('.form').append(this.form.$el);

                this.showUpdatedContent();
            },

            saveForm: function (e) {
                //does validation
                var errors = this.form.commit();
                if (errors) { return; }

                // some JSON post-processing:
                this.bubble.model.setExtras(this.bubble.model.get("extras"));

                this.bubble.model.save(); //does database commit
                this.hideBubble();
                e.preventDefault();
            },
            _show: function (whichBubble) {
                if (this.overlay.getShapeType() === "Point") {
                    whichBubble.open(this.map, this.overlay.getGoogleOverlay());
                } else {
                    whichBubble.setPosition(this.overlay.getCenter());
                    whichBubble.open();
                }
            },
            /*
            showLoadingImage: function () {
                var $loading = $('<div class="loading-container" style="width:300px;height:200px;"><i class="fa fa-spin fa-cog"></i></div>');
                this.bubble.setContent($loading.get(0));
                this._show(this.bubble, data);
            },*/
            showUpdatedContent: function () {
                this.bubble.setContent(this.$el.get(0));
                this._show(this.bubble);
            },
            hideBubble: function (exception) {
                if (!exception || exception !== this.model.id) {
                    this.bubble.close();
                }
            },
            showTip: function () {
                //TODO: remove compatibility hack
                if (this.app.getMode() === "edit" || this.bubble.isOpen()) {
                    return;
                }
                var template = Handlebars.compile(
                    '<div class="bubble-container" style="width: 150px;height:25px;">' +
                        '<div class="tip-container">{{ name }}</div></div>'
                );
                this.tip.setContent(template(this.getContext()));
                this._show(this.tip);

            },
            hideTip: function () {
                this.tip.close();
            },
            getTemplate: function (templateKey) {
                return this.infoBubbleTemplates[templateKey];
            },
            getContext: function () {
                var json = this.model.toTemplateJSON();
                json.name = json.name || json.display_name;
                json.mode = this.app.getMode();
                return json;
            },
            remove: function () {
                this.hideTip();
                this.hideBubble();
            }
        });
        return Base;
    });

!function(a){"use strict";"function"==typeof define&&define.amd?define('slick',["jquery"],a):a(jQuery)}(function(a){"use strict";var b=window.Slick||{};b=function(){function c(c,d){var f,g,e=this;if(e.defaults={accessibility:!0,appendArrows:a(c),arrows:!0,asNavFor:null,prevArrow:'<button type="button" data-role="none" class="slick-prev">Previous</button>',nextArrow:'<button type="button" data-role="none" class="slick-next">Next</button>',autoplay:!1,autoplaySpeed:3e3,centerMode:!1,centerPadding:"50px",cssEase:"ease",customPaging:function(a,b){return'<button type="button" data-role="none">'+(b+1)+"</button>"},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",fade:!1,focusOnSelect:!1,infinite:!0,lazyLoad:"ondemand",onBeforeChange:null,onAfterChange:null,onInit:null,onReInit:null,pauseOnHover:!0,pauseOnDotsHover:!1,responsive:null,rtl:!1,slide:"div",slidesToShow:1,slidesToScroll:1,speed:300,swipe:!0,touchMove:!0,touchThreshold:5,useCSS:!0,vertical:!1},e.initials={animating:!1,dragging:!1,autoPlayTimer:null,currentSlide:0,currentLeft:null,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,$list:null,touchObject:{},transformsEnabled:!1},a.extend(e,e.initials),e.activeBreakpoint=null,e.animType=null,e.animProp=null,e.breakpoints=[],e.breakpointSettings=[],e.cssTransitions=!1,e.paused=!1,e.positionProp=null,e.$slider=a(c),e.$slidesCache=null,e.transformType=null,e.transitionType=null,e.windowWidth=0,e.windowTimer=null,e.options=a.extend({},e.defaults,d),e.originalSettings=e.options,f=e.options.responsive||null,f&&f.length>-1){for(g in f)f.hasOwnProperty(g)&&(e.breakpoints.push(f[g].breakpoint),e.breakpointSettings[f[g].breakpoint]=f[g].settings);e.breakpoints.sort(function(a,b){return b-a})}e.autoPlay=a.proxy(e.autoPlay,e),e.autoPlayClear=a.proxy(e.autoPlayClear,e),e.changeSlide=a.proxy(e.changeSlide,e),e.selectHandler=a.proxy(e.selectHandler,e),e.setPosition=a.proxy(e.setPosition,e),e.swipeHandler=a.proxy(e.swipeHandler,e),e.dragHandler=a.proxy(e.dragHandler,e),e.keyHandler=a.proxy(e.keyHandler,e),e.autoPlayIterator=a.proxy(e.autoPlayIterator,e),e.instanceUid=b++,e.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/,e.init()}var b=0;return c}(),b.prototype.addSlide=function(b,c,d){var e=this;if("boolean"==typeof c)d=c,c=null;else if(0>c||c>=e.slideCount)return!1;e.unload(),"number"==typeof c?0===c&&0===e.$slides.length?a(b).appendTo(e.$slideTrack):d?a(b).insertBefore(e.$slides.eq(c)):a(b).insertAfter(e.$slides.eq(c)):d===!0?a(b).prependTo(e.$slideTrack):a(b).appendTo(e.$slideTrack),e.$slides=e.$slideTrack.children(this.options.slide),e.$slideTrack.children(this.options.slide).detach(),e.$slideTrack.append(e.$slides),e.$slides.each(function(b,c){a(c).attr("index",b)}),e.$slidesCache=e.$slides,e.reinit()},b.prototype.animateSlide=function(b,c){var d={},e=this;e.options.rtl===!0&&e.options.vertical===!1&&(b=-b),e.transformsEnabled===!1?e.options.vertical===!1?e.$slideTrack.animate({left:b},e.options.speed,e.options.easing,c):e.$slideTrack.animate({top:b},e.options.speed,e.options.easing,c):e.cssTransitions===!1?a({animStart:e.currentLeft}).animate({animStart:b},{duration:e.options.speed,easing:e.options.easing,step:function(a){e.options.vertical===!1?(d[e.animType]="translate("+a+"px, 0px)",e.$slideTrack.css(d)):(d[e.animType]="translate(0px,"+a+"px)",e.$slideTrack.css(d))},complete:function(){c&&c.call()}}):(e.applyTransition(),d[e.animType]=e.options.vertical===!1?"translate3d("+b+"px, 0px, 0px)":"translate3d(0px,"+b+"px, 0px)",e.$slideTrack.css(d),c&&setTimeout(function(){e.disableTransition(),c.call()},e.options.speed))},b.prototype.applyTransition=function(a){var b=this,c={};c[b.transitionType]=b.options.fade===!1?b.transformType+" "+b.options.speed+"ms "+b.options.cssEase:"opacity "+b.options.speed+"ms "+b.options.cssEase,b.options.fade===!1?b.$slideTrack.css(c):b.$slides.eq(a).css(c)},b.prototype.autoPlay=function(){var a=this;a.autoPlayTimer&&clearInterval(a.autoPlayTimer),a.slideCount>a.options.slidesToShow&&a.paused!==!0&&(a.autoPlayTimer=setInterval(a.autoPlayIterator,a.options.autoplaySpeed))},b.prototype.autoPlayClear=function(){var a=this;a.autoPlayTimer&&clearInterval(a.autoPlayTimer)},b.prototype.autoPlayIterator=function(){var b=this,c=null!=b.options.asNavFor?a(b.options.asNavFor).getSlick():null;b.options.infinite===!1?1===b.direction?(b.currentSlide+1===b.slideCount-1&&(b.direction=0),b.slideHandler(b.currentSlide+b.options.slidesToScroll),null!=c&&c.slideHandler(c.currentSlide+c.options.slidesToScroll)):(0===b.currentSlide-1&&(b.direction=1),b.slideHandler(b.currentSlide-b.options.slidesToScroll),null!=c&&c.slideHandler(c.currentSlide-c.options.slidesToScroll)):(b.slideHandler(b.currentSlide+b.options.slidesToScroll),null!=c&&c.slideHandler(c.currentSlide+c.options.slidesToScroll))},b.prototype.buildArrows=function(){var b=this;b.options.arrows===!0&&b.slideCount>b.options.slidesToShow&&(b.$prevArrow=a(b.options.prevArrow),b.$nextArrow=a(b.options.nextArrow),b.htmlExpr.test(b.options.prevArrow)&&b.$prevArrow.appendTo(b.options.appendArrows),b.htmlExpr.test(b.options.nextArrow)&&b.$nextArrow.appendTo(b.options.appendArrows),b.options.infinite!==!0&&b.$prevArrow.addClass("slick-disabled"))},b.prototype.buildDots=function(){var c,d,b=this;if(b.options.dots===!0&&b.slideCount>b.options.slidesToShow){for(d='<ul class="'+b.options.dotsClass+'">',c=0;c<=b.getDotCount();c+=1)d+="<li>"+b.options.customPaging.call(this,b,c)+"</li>";d+="</ul>",b.$dots=a(d).appendTo(b.$slider),b.$dots.find("li").first().addClass("slick-active")}},b.prototype.buildOut=function(){var b=this;b.$slides=b.$slider.children(b.options.slide+":not(.slick-cloned)").addClass("slick-slide"),b.slideCount=b.$slides.length,b.$slides.each(function(b,c){a(c).attr("index",b)}),b.$slidesCache=b.$slides,b.$slider.addClass("slick-slider"),b.$slideTrack=0===b.slideCount?a('<div class="slick-track"/>').appendTo(b.$slider):b.$slides.wrapAll('<div class="slick-track"/>').parent(),b.$list=b.$slideTrack.wrap('<div class="slick-list"/>').parent(),b.$slideTrack.css("opacity",0),b.options.centerMode===!0&&(b.options.slidesToScroll=1,0===b.options.slidesToShow%2&&(b.options.slidesToShow=3)),a("img[data-lazy]",b.$slider).not("[src]").addClass("slick-loading"),b.setupInfinite(),b.buildArrows(),b.buildDots(),b.updateDots(),b.options.accessibility===!0&&b.$list.prop("tabIndex",0),b.setSlideClasses("number"==typeof this.currentSlide?this.currentSlide:0),b.options.draggable===!0&&b.$list.addClass("draggable")},b.prototype.checkResponsive=function(){var c,d,b=this;if(b.originalSettings.responsive&&b.originalSettings.responsive.length>-1&&null!==b.originalSettings.responsive){d=null;for(c in b.breakpoints)b.breakpoints.hasOwnProperty(c)&&a(window).width()<b.breakpoints[c]&&(d=b.breakpoints[c]);null!==d?null!==b.activeBreakpoint?d!==b.activeBreakpoint&&(b.activeBreakpoint=d,b.options=a.extend({},b.options,b.breakpointSettings[d]),b.refresh()):(b.activeBreakpoint=d,b.options=a.extend({},b.options,b.breakpointSettings[d]),b.refresh()):null!==b.activeBreakpoint&&(b.activeBreakpoint=null,b.options=a.extend({},b.options,b.originalSettings),b.refresh())}},b.prototype.changeSlide=function(b){var c=this,d=a(b.target),e=null!=c.options.asNavFor?a(c.options.asNavFor).getSlick():null;switch(d.is("a")&&b.preventDefault(),b.data.message){case"previous":c.slideCount>c.options.slidesToShow&&(c.slideHandler(c.currentSlide-c.options.slidesToScroll),null!=e&&e.slideHandler(e.currentSlide-e.options.slidesToScroll));break;case"next":c.slideCount>c.options.slidesToShow&&(c.slideHandler(c.currentSlide+c.options.slidesToScroll),null!=e&&e.slideHandler(e.currentSlide+e.options.slidesToScroll));break;case"index":var f=a(b.target).parent().index()*c.options.slidesToScroll;c.slideHandler(f),null!=e&&e.slideHandler(f);break;default:return!1}},b.prototype.destroy=function(){var b=this;b.autoPlayClear(),b.touchObject={},a(".slick-cloned",b.$slider).remove(),b.$dots&&b.$dots.remove(),b.$prevArrow&&(b.$prevArrow.remove(),b.$nextArrow.remove()),b.$slides.parent().hasClass("slick-track")&&b.$slides.unwrap().unwrap(),b.$slides.removeClass("slick-slide slick-active slick-visible").removeAttr("style"),b.$slider.removeClass("slick-slider"),b.$slider.removeClass("slick-initialized"),b.$list.off(".slick"),a(window).off(".slick-"+b.instanceUid),a(document).off(".slick-"+b.instanceUid)},b.prototype.disableTransition=function(a){var b=this,c={};c[b.transitionType]="",b.options.fade===!1?b.$slideTrack.css(c):b.$slides.eq(a).css(c)},b.prototype.fadeSlide=function(a,b){var c=this;c.cssTransitions===!1?(c.$slides.eq(a).css({zIndex:1e3}),c.$slides.eq(a).animate({opacity:1},c.options.speed,c.options.easing,b)):(c.applyTransition(a),c.$slides.eq(a).css({opacity:1,zIndex:1e3}),b&&setTimeout(function(){c.disableTransition(a),b.call()},c.options.speed))},b.prototype.filterSlides=function(a){var b=this;null!==a&&(b.unload(),b.$slideTrack.children(this.options.slide).detach(),b.$slidesCache.filter(a).appendTo(b.$slideTrack),b.reinit())},b.prototype.getCurrent=function(){var a=this;return a.currentSlide},b.prototype.getDotCount=function(){var e,a=this,b=0,c=0,d=0;for(e=a.options.infinite===!0?a.slideCount+a.options.slidesToShow-a.options.slidesToScroll:a.slideCount;e>b;)d++,c+=a.options.slidesToScroll,b=c+a.options.slidesToShow;return d},b.prototype.getLeft=function(a){var c,d,b=this,e=0;return b.slideOffset=0,d=b.$slides.first().outerHeight(),b.options.infinite===!0?(b.slideCount>b.options.slidesToShow&&(b.slideOffset=-1*b.slideWidth*b.options.slidesToShow,e=-1*d*b.options.slidesToShow),0!==b.slideCount%b.options.slidesToScroll&&a+b.options.slidesToScroll>b.slideCount&&b.slideCount>b.options.slidesToShow&&(b.slideOffset=-1*b.slideCount%b.options.slidesToShow*b.slideWidth,e=-1*b.slideCount%b.options.slidesToShow*d)):0!==b.slideCount%b.options.slidesToShow&&a+b.options.slidesToScroll>b.slideCount&&b.slideCount>b.options.slidesToShow&&(b.slideOffset=b.options.slidesToShow*b.slideWidth-b.slideCount%b.options.slidesToShow*b.slideWidth,e=b.slideCount%b.options.slidesToShow*d),b.options.centerMode===!0&&b.options.infinite===!0?b.slideOffset+=b.slideWidth*Math.floor(b.options.slidesToShow/2)-b.slideWidth:b.options.centerMode===!0&&(b.slideOffset+=b.slideWidth*Math.floor(b.options.slidesToShow/2)),c=b.options.vertical===!1?-1*a*b.slideWidth+b.slideOffset:-1*a*d+e},b.prototype.init=function(){var b=this;a(b.$slider).hasClass("slick-initialized")||(a(b.$slider).addClass("slick-initialized"),b.buildOut(),b.setProps(),b.startLoad(),b.loadSlider(),b.initializeEvents(),b.checkResponsive()),null!==b.options.onInit&&b.options.onInit.call(this,b)},b.prototype.initArrowEvents=function(){var a=this;a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.on("click.slick",{message:"previous"},a.changeSlide),a.$nextArrow.on("click.slick",{message:"next"},a.changeSlide))},b.prototype.initDotEvents=function(){var b=this;b.options.dots===!0&&b.slideCount>b.options.slidesToShow&&a("li",b.$dots).on("click.slick",{message:"index"},b.changeSlide),b.options.dots===!0&&b.options.pauseOnDotsHover===!0&&b.options.autoplay===!0&&a("li",b.$dots).on("mouseenter.slick",b.autoPlayClear).on("mouseleave.slick",b.autoPlay)},b.prototype.initializeEvents=function(){var b=this;b.initArrowEvents(),b.initDotEvents(),b.$list.on("touchstart.slick mousedown.slick",{action:"start"},b.swipeHandler),b.$list.on("touchmove.slick mousemove.slick",{action:"move"},b.swipeHandler),b.$list.on("touchend.slick mouseup.slick",{action:"end"},b.swipeHandler),b.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},b.swipeHandler),b.options.pauseOnHover===!0&&b.options.autoplay===!0&&(b.$list.on("mouseenter.slick",b.autoPlayClear),b.$list.on("mouseleave.slick",b.autoPlay)),b.options.accessibility===!0&&b.$list.on("keydown.slick",b.keyHandler),b.options.focusOnSelect===!0&&a(b.options.slide,b.$slideTrack).on("click.slick",b.selectHandler),a(window).on("orientationchange.slick.slick-"+b.instanceUid,function(){b.checkResponsive(),b.setPosition()}),a(window).on("resize.slick.slick-"+b.instanceUid,function(){a(window).width()!==b.windowWidth&&(clearTimeout(b.windowDelay),b.windowDelay=window.setTimeout(function(){b.windowWidth=a(window).width(),b.checkResponsive(),b.setPosition()},50))}),a(window).on("load.slick.slick-"+b.instanceUid,b.setPosition),a(document).on("ready.slick.slick-"+b.instanceUid,b.setPosition)},b.prototype.initUI=function(){var a=this;a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.show(),a.$nextArrow.show()),a.options.dots===!0&&a.slideCount>a.options.slidesToShow&&a.$dots.show(),a.options.autoplay===!0&&a.autoPlay()},b.prototype.keyHandler=function(a){var b=this;37===a.keyCode?b.changeSlide({data:{message:"previous"}}):39===a.keyCode&&b.changeSlide({data:{message:"next"}})},b.prototype.lazyLoad=function(){function g(b){a("img[data-lazy]",b).each(function(){var b=a(this),c=a(this).attr("data-lazy")+"?"+(new Date).getTime();b.load(function(){b.animate({opacity:1},200)}).css({opacity:0}).attr("src",c).removeAttr("data-lazy").removeClass("slick-loading")})}var c,d,e,f,b=this;b.options.centerMode===!0||b.options.fade===!0?(e=b.options.slidesToShow+b.currentSlide-1,f=e+b.options.slidesToShow+2):(e=b.options.infinite?b.options.slidesToShow+b.currentSlide:b.currentSlide,f=e+b.options.slidesToShow),c=b.$slider.find(".slick-slide").slice(e,f),g(c),1==b.slideCount?(d=b.$slider.find(".slick-slide"),g(d)):b.currentSlide>=b.slideCount-b.options.slidesToShow?(d=b.$slider.find(".slick-cloned").slice(0,b.options.slidesToShow),g(d)):0===b.currentSlide&&(d=b.$slider.find(".slick-cloned").slice(-1*b.options.slidesToShow),g(d))},b.prototype.loadSlider=function(){var a=this;a.setPosition(),a.$slideTrack.css({opacity:1}),a.$slider.removeClass("slick-loading"),a.initUI(),"progressive"===a.options.lazyLoad&&a.progressiveLazyLoad()},b.prototype.postSlide=function(a){var b=this;null!==b.options.onAfterChange&&b.options.onAfterChange.call(this,b,a),b.animating=!1,b.setPosition(),b.swipeLeft=null,b.options.autoplay===!0&&b.paused===!1&&b.autoPlay()},b.prototype.progressiveLazyLoad=function(){var c,d,b=this;c=a("img[data-lazy]").length,c>0&&(d=a("img[data-lazy]",b.$slider).first(),d.attr("src",d.attr("data-lazy")).removeClass("slick-loading").load(function(){d.removeAttr("data-lazy"),b.progressiveLazyLoad()}))},b.prototype.refresh=function(){var b=this,c=b.currentSlide;b.destroy(),a.extend(b,b.initials),b.currentSlide=c,b.init()},b.prototype.reinit=function(){var b=this;b.$slides=b.$slideTrack.children(b.options.slide).addClass("slick-slide"),b.slideCount=b.$slides.length,b.currentSlide>=b.slideCount&&0!==b.currentSlide&&(b.currentSlide=b.currentSlide-b.options.slidesToScroll),b.setProps(),b.setupInfinite(),b.buildArrows(),b.updateArrows(),b.initArrowEvents(),b.buildDots(),b.updateDots(),b.initDotEvents(),b.options.focusOnSelect===!0&&a(b.options.slide,b.$slideTrack).on("click.slick",b.selectHandler),b.setSlideClasses(0),b.setPosition(),null!==b.options.onReInit&&b.options.onReInit.call(this,b)},b.prototype.removeSlide=function(a,b){var c=this;return"boolean"==typeof a?(b=a,a=b===!0?0:c.slideCount-1):a=b===!0?--a:a,c.slideCount<1||0>a||a>c.slideCount-1?!1:(c.unload(),c.$slideTrack.children(this.options.slide).eq(a).remove(),c.$slides=c.$slideTrack.children(this.options.slide),c.$slideTrack.children(this.options.slide).detach(),c.$slideTrack.append(c.$slides),c.$slidesCache=c.$slides,c.reinit(),void 0)},b.prototype.setCSS=function(a){var d,e,b=this,c={};b.options.rtl===!0&&(a=-a),d="left"==b.positionProp?a+"px":"0px",e="top"==b.positionProp?a+"px":"0px",c[b.positionProp]=a,b.transformsEnabled===!1?b.$slideTrack.css(c):(c={},b.cssTransitions===!1?(c[b.animType]="translate("+d+", "+e+")",b.$slideTrack.css(c)):(c[b.animType]="translate3d("+d+", "+e+", 0px)",b.$slideTrack.css(c)))},b.prototype.setDimensions=function(){var a=this;a.options.vertical===!1?a.options.centerMode===!0&&a.$list.css({padding:"0px "+a.options.centerPadding}):(a.$list.height(a.$slides.first().outerHeight(!0)*a.options.slidesToShow),a.options.centerMode===!0&&a.$list.css({padding:a.options.centerPadding+" 0px"})),a.listWidth=a.$list.width(),a.listHeight=a.$list.height(),a.options.vertical===!1?(a.slideWidth=Math.ceil(a.listWidth/a.options.slidesToShow),a.$slideTrack.width(Math.ceil(a.slideWidth*a.$slideTrack.children(".slick-slide").length))):(a.slideWidth=Math.ceil(a.listWidth),a.$slideTrack.height(Math.ceil(a.$slides.first().outerHeight(!0)*a.$slideTrack.children(".slick-slide").length)));var b=a.$slides.first().outerWidth(!0)-a.$slides.first().width();a.$slideTrack.children(".slick-slide").width(a.slideWidth-b)},b.prototype.setFade=function(){var c,b=this;b.$slides.each(function(d,e){c=-1*b.slideWidth*d,a(e).css({position:"relative",left:c,top:0,zIndex:800,opacity:0})}),b.$slides.eq(b.currentSlide).css({zIndex:900,opacity:1})},b.prototype.setPosition=function(){var a=this;a.setDimensions(),a.options.fade===!1?a.setCSS(a.getLeft(a.currentSlide)):a.setFade()},b.prototype.setProps=function(){var a=this;a.positionProp=a.options.vertical===!0?"top":"left","top"===a.positionProp?a.$slider.addClass("slick-vertical"):a.$slider.removeClass("slick-vertical"),(void 0!==document.body.style.WebkitTransition||void 0!==document.body.style.MozTransition||void 0!==document.body.style.msTransition)&&a.options.useCSS===!0&&(a.cssTransitions=!0),void 0!==document.body.style.MozTransform&&(a.animType="MozTransform",a.transformType="-moz-transform",a.transitionType="MozTransition"),void 0!==document.body.style.webkitTransform&&(a.animType="webkitTransform",a.transformType="-webkit-transform",a.transitionType="webkitTransition"),void 0!==document.body.style.msTransform&&(a.animType="msTransform",a.transformType="-ms-transform",a.transitionType="msTransition"),void 0!==document.body.style.transform&&(a.animType="transform",a.transformType="transform",a.transitionType="transition"),a.transformsEnabled=null!==a.animType},b.prototype.setSlideClasses=function(a){var c,d,e,f,b=this;b.$slider.find(".slick-slide").removeClass("slick-active").removeClass("slick-center"),d=b.$slider.find(".slick-slide"),b.options.centerMode===!0?(c=Math.floor(b.options.slidesToShow/2),b.options.infinite===!0&&(a>=c&&a<=b.slideCount-1-c?b.$slides.slice(a-c,a+c+1).addClass("slick-active"):(e=b.options.slidesToShow+a,d.slice(e-c+1,e+c+2).addClass("slick-active")),0===a?d.eq(d.length-1-b.options.slidesToShow).addClass("slick-center"):a===b.slideCount-1&&d.eq(b.options.slidesToShow).addClass("slick-center")),b.$slides.eq(a).addClass("slick-center")):a>=0&&a<=b.slideCount-b.options.slidesToShow?b.$slides.slice(a,a+b.options.slidesToShow).addClass("slick-active"):d.length<=b.options.slidesToShow?d.addClass("slick-active"):(f=b.slideCount%b.options.slidesToShow,e=b.options.infinite===!0?b.options.slidesToShow+a:a,b.options.slidesToShow==b.options.slidesToScroll&&b.slideCount-a<b.options.slidesToShow?d.slice(e-(b.options.slidesToShow-f),e+f).addClass("slick-active"):d.slice(e,e+b.options.slidesToShow).addClass("slick-active")),"ondemand"===b.options.lazyLoad&&b.lazyLoad()},b.prototype.setupInfinite=function(){var c,d,e,b=this;if((b.options.fade===!0||b.options.vertical===!0)&&(b.options.centerMode=!1),b.options.infinite===!0&&b.options.fade===!1&&(d=null,b.slideCount>b.options.slidesToShow)){for(e=b.options.centerMode===!0?b.options.slidesToShow+1:b.options.slidesToShow,c=b.slideCount;c>b.slideCount-e;c-=1)d=c-1,a(b.$slides[d]).clone(!0).attr("id","").prependTo(b.$slideTrack).addClass("slick-cloned");for(c=0;e>c;c+=1)d=c,a(b.$slides[d]).clone(!0).attr("id","").appendTo(b.$slideTrack).addClass("slick-cloned");b.$slideTrack.find(".slick-cloned").find("[id]").each(function(){a(this).attr("id","")})}},b.prototype.selectHandler=function(b){var c=this,d=null!=c.options.asNavFor?a(c.options.asNavFor).getSlick():null,e=parseInt(a(b.target).parent().attr("index"));if(e||(e=0),!(c.slideCount<=c.options.slidesToShow)&&(c.slideHandler(e),null!=d)){if(d.slideCount<=d.options.slidesToShow)return;d.slideHandler(e)}},b.prototype.slideHandler=function(a){var b,c,d,e,f=null,g=this;return g.animating===!0?!1:(b=a,f=g.getLeft(b),d=g.getLeft(g.currentSlide),e=0!==g.slideCount%g.options.slidesToScroll?g.options.slidesToScroll:0,g.currentLeft=null===g.swipeLeft?d:g.swipeLeft,g.options.infinite===!1&&g.options.centerMode===!1&&(0>a||a>g.slideCount-g.options.slidesToShow+e)?(g.options.fade===!1&&(b=g.currentSlide,g.animateSlide(d,function(){g.postSlide(b)})),!1):g.options.infinite===!1&&g.options.centerMode===!0&&(0>a||a>g.slideCount-g.options.slidesToScroll)?(g.options.fade===!1&&(b=g.currentSlide,g.animateSlide(d,function(){g.postSlide(b)})),!1):(g.options.autoplay===!0&&clearInterval(g.autoPlayTimer),c=0>b?0!==g.slideCount%g.options.slidesToScroll?g.slideCount-g.slideCount%g.options.slidesToScroll:g.slideCount-g.options.slidesToScroll:b>g.slideCount-1?0:b,g.animating=!0,null!==g.options.onBeforeChange&&a!==g.currentSlide&&g.options.onBeforeChange.call(this,g,g.currentSlide,c),g.currentSlide=c,g.setSlideClasses(g.currentSlide),g.updateDots(),g.updateArrows(),g.options.fade===!0?(g.fadeSlide(c,function(){g.postSlide(c)}),!1):(g.animateSlide(f,function(){g.postSlide(c)}),void 0)))},b.prototype.startLoad=function(){var a=this;a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.hide(),a.$nextArrow.hide()),a.options.dots===!0&&a.slideCount>a.options.slidesToShow&&a.$dots.hide(),a.$slider.addClass("slick-loading")},b.prototype.swipeDirection=function(){var a,b,c,d,e=this;return a=e.touchObject.startX-e.touchObject.curX,b=e.touchObject.startY-e.touchObject.curY,c=Math.atan2(b,a),d=Math.round(180*c/Math.PI),0>d&&(d=360-Math.abs(d)),45>=d&&d>=0?"left":360>=d&&d>=315?"left":d>=135&&225>=d?"right":"vertical"},b.prototype.swipeEnd=function(b){var c=this,d=null!=c.options.asNavFor?a(c.options.asNavFor).getSlick():null;if(c.dragging=!1,void 0===c.touchObject.curX)return!1;if(c.touchObject.swipeLength>=c.touchObject.minSwipe)switch(a(b.target).on("click.slick",function(b){b.stopImmediatePropagation(),b.stopPropagation(),b.preventDefault(),a(b.target).off("click.slick")}),c.swipeDirection()){case"left":c.slideHandler(c.currentSlide+c.options.slidesToScroll),null!=d&&d.slideHandler(d.currentSlide+d.options.slidesToScroll),c.touchObject={};break;case"right":c.slideHandler(c.currentSlide-c.options.slidesToScroll),null!=d&&d.slideHandler(d.currentSlide-d.options.slidesToScroll),c.touchObject={}}else c.touchObject.startX!==c.touchObject.curX&&(c.slideHandler(c.currentSlide),null!=d&&d.slideHandler(d.currentSlide),c.touchObject={})},b.prototype.swipeHandler=function(a){var b=this;if(!(b.options.swipe===!1||"ontouchend"in document&&b.options.swipe===!1||b.options.draggable===!1||b.options.draggable===!1&&!a.originalEvent.touches))switch(b.touchObject.fingerCount=a.originalEvent&&void 0!==a.originalEvent.touches?a.originalEvent.touches.length:1,b.touchObject.minSwipe=b.listWidth/b.options.touchThreshold,a.data.action){case"start":b.swipeStart(a);break;case"move":b.swipeMove(a);break;case"end":b.swipeEnd(a)}},b.prototype.swipeMove=function(a){var c,d,e,f,b=this;return f=void 0!==a.originalEvent?a.originalEvent.touches:null,c=b.getLeft(b.currentSlide),!b.dragging||f&&1!==f.length?!1:(b.touchObject.curX=void 0!==f?f[0].pageX:a.clientX,b.touchObject.curY=void 0!==f?f[0].pageY:a.clientY,b.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(b.touchObject.curX-b.touchObject.startX,2))),d=b.swipeDirection(),"vertical"!==d?(void 0!==a.originalEvent&&b.touchObject.swipeLength>4&&a.preventDefault(),e=b.touchObject.curX>b.touchObject.startX?1:-1,b.swipeLeft=b.options.vertical===!1?c+b.touchObject.swipeLength*e:c+b.touchObject.swipeLength*(b.$list.height()/b.listWidth)*e,b.options.fade===!0||b.options.touchMove===!1?!1:b.animating===!0?(b.swipeLeft=null,!1):(b.setCSS(b.swipeLeft),void 0)):void 0)},b.prototype.swipeStart=function(a){var c,b=this;return 1!==b.touchObject.fingerCount||b.slideCount<=b.options.slidesToShow?(b.touchObject={},!1):(void 0!==a.originalEvent&&void 0!==a.originalEvent.touches&&(c=a.originalEvent.touches[0]),b.touchObject.startX=b.touchObject.curX=void 0!==c?c.pageX:a.clientX,b.touchObject.startY=b.touchObject.curY=void 0!==c?c.pageY:a.clientY,b.dragging=!0,void 0)},b.prototype.unfilterSlides=function(){var a=this;null!==a.$slidesCache&&(a.unload(),a.$slideTrack.children(this.options.slide).detach(),a.$slidesCache.appendTo(a.$slideTrack),a.reinit())},b.prototype.unload=function(){var b=this;a(".slick-cloned",b.$slider).remove(),b.$dots&&b.$dots.remove(),b.$prevArrow&&(b.$prevArrow.remove(),b.$nextArrow.remove()),b.$slides.removeClass("slick-slide slick-active slick-visible").removeAttr("style")},b.prototype.updateArrows=function(){var a=this;a.options.arrows===!0&&a.options.infinite!==!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.removeClass("slick-disabled"),a.$nextArrow.removeClass("slick-disabled"),0===a.currentSlide?(a.$prevArrow.addClass("slick-disabled"),a.$nextArrow.removeClass("slick-disabled")):a.currentSlide>=a.slideCount-a.options.slidesToShow&&(a.$nextArrow.addClass("slick-disabled"),a.$prevArrow.removeClass("slick-disabled")))},b.prototype.updateDots=function(){var a=this;null!==a.$dots&&(a.$dots.find("li").removeClass("slick-active"),a.$dots.find("li").eq(Math.floor(a.currentSlide/a.options.slidesToScroll)).addClass("slick-active"))},a.fn.slick=function(a){var c=this;return c.each(function(c,d){d.slick=new b(d,a)})},a.fn.slickAdd=function(a,b,c){var d=this;return d.each(function(d,e){e.slick.addSlide(a,b,c)})},a.fn.slickCurrentSlide=function(){var a=this;return a.get(0).slick.getCurrent()},a.fn.slickFilter=function(a){var b=this;return b.each(function(b,c){c.slick.filterSlides(a)})},a.fn.slickGoTo=function(b){var c=this;return c.each(function(c,d){var e=null!=d.slick.options.asNavFor?a(d.slick.options.asNavFor):null;null!=e&&e.slickGoTo(b),d.slick.slideHandler(b)})},a.fn.slickNext=function(){var a=this;return a.each(function(a,b){b.slick.changeSlide({data:{message:"next"}})})},a.fn.slickPause=function(){var a=this;return a.each(function(a,b){b.slick.autoPlayClear(),b.slick.paused=!0})},a.fn.slickPlay=function(){var a=this;return a.each(function(a,b){b.slick.paused=!1,b.slick.autoPlay()})},a.fn.slickPrev=function(){var a=this;return a.each(function(a,b){b.slick.changeSlide({data:{message:"previous"}})})},a.fn.slickRemove=function(a,b){var c=this;return c.each(function(c,d){d.slick.removeSlide(a,b)})},a.fn.slickGetOption=function(a){var b=this;return b.get(0).slick.options[a]},a.fn.slickSetOption=function(a,b,c){var d=this;return d.each(function(d,e){e.slick.options[a]=b,c===!0&&(e.slick.unload(),e.slick.reinit())})},a.fn.slickUnfilter=function(){var a=this;return a.each(function(a,b){b.slick.unfilterSlides()})},a.fn.unslick=function(){var a=this;return a.each(function(a,b){b.slick&&b.slick.destroy()})},a.fn.getSlick=function(){var a=null,b=this;return b.each(function(b,c){a=c.slick}),a}});
define('lib/maps/overlays/infobubbles/marker',['underscore',
        'jquery',
        'color-picker',
        //'text!/static/backbone/js/templates/infoBubble/markerAttachTip.html',
        'lib/maps/overlays/infobubbles/base',
        'slick'], function (_, $, jscolor, /*markerAttachTipTemplate, */ BaseBubble) {
    "use strict";
    /**
     * Class that controls marker point model overlays.
     * Extends @link {localground.maps.overlays.Point}.
     * @class Audio
     */
    var MarkerBubble = BaseBubble.extend({

        events: function () {
            return _.extend({}, BaseBubble.prototype.events, {
                'click .detach': 'detach'
            });
        },

        modelEvents: function () {
            return _.extend({}, BaseBubble.prototype.modelEvents, {
                'show-tip-attaching': 'showTipAttaching'
            });
        },

        renderViewContent: function () {
            BaseBubble.prototype.renderViewContent.apply(this, arguments);
            //controls marker slide show:
            var that = this;
            window.setTimeout(function () {
                $('.marker-container').slick({
                    dots: false
                });
                that.$el.find("button").click(function (e) {
                    that.sendToBack(e);
                });
            }, 200);
        },

        renderEditContent: function () {
            BaseBubble.prototype.renderEditContent.apply(this, arguments);
            this.initColorPicker();
        },

        initColorPicker: function () {
            var colorInput = this.$el.find('.form').find('[name="color"]'),
                picker;
            if (colorInput.get(0) != null) {
                picker = new jscolor.color(colorInput.get(0), {});
                picker.fromString("#" + this.model.get("fillColor"));
            }
        },

        showBubble: function () {
            var that = this;
            that.model.fetch({ success: function () {
                BaseBubble.prototype.showBubble.apply(that, arguments);
            }});
        },

        showTipAttaching: function () {
            var template = _.template('');
            //var template = _.template(markerAttachTipTemplate);
            this.tip.setContent(template(this.getContext()));
            this._show(this.tip);
        },

        detach: function (e) {
            var $a = $(e.currentTarget),
                key = $a.attr("key"),
                modelID = parseInt($a.attr("item-id"), 10),
                that = this;
            this.model.detach(modelID, key, function () {
				$a.parent().parent().remove();
				that.model.fetch();
            });
        }
    });
    return MarkerBubble;
});

define('lib/maps/overlays/point',["jquery", "underscore"], function ($, _) {
    "use strict";
    /**
     * Class that controls marker point model overlays.
     * @class Point
     */
    var Point = function (app, opts) {

        this._googleOverlay = null;
        this.model = null;
        this.map = null;
        this.Shapes = null;

        this.getShapeType = function () {
            return "Point";
        };

        this.initialize = function (app, opts) {
            this.app = app;
            $.extend(this, opts);
            //this.Shapes = _.clone(Point.Shapes); //call to static method.
            this.createOverlay(opts.isShowingOnMap || false);
        };

        this.createOverlay = function (isShowingOnMap) {
            if (this.model.get("geometry") != null && !this._googleOverlay) {
                this._googleOverlay = new google.maps.Marker({
                    position: this.getGoogleGeometryFromModel(),
                    map: isShowingOnMap ? this.map : null
                });
            }
        };

        this.restoreModelGeometry =  function () {
            this._googleOverlay.setPosition(this.getGoogleGeometryFromModel());
        };

        this.hide = function () {
            this._googleOverlay.setMap(null);
        };

        this.show = function () {
            this._googleOverlay.setMap(this.map);
        };

        this.getCenter = function () {
            return this.getGoogleGeometryFromModel();
        };

        this.getBounds = function () {
            var bounds = new google.maps.LatLngBounds();
            bounds.extend(this.getCenter());
            return bounds;
        };

        this.centerOn = function () {
            this.map.panTo(this.getCenter());
        };

        this.zoomTo = function () {
            this.map.setCenter(this.getCenter());
            if (this.map.getZoom() < 17) {
                this.map.setZoom(17);
            }
        };

        /**
         * Method that converts a GeoJSON Point into
         * a google.maps.LatLng object.
         * @param {GeoJSON Point} geoJSON
         * A GeoJSON Point object
         * @returns {google.maps.LatLng}
         * A google.maps.LatLng object
         */
        this.getGoogleGeometryFromModel = function () {
            var geoJSON = this.model.get("geometry");
            return new google.maps.LatLng(
                geoJSON.coordinates[1],
                geoJSON.coordinates[0]
            );
        };

        /**
         * Method that converts a google.maps.Point
         * into a GeoJSON Point object.
         * @param {google.maps.LatLng} googlePoint
         * A Google point object.
         * @see See the Google <a href="https://developers.google.com/maps/documentation/javascript/reference#LatLng">google.maps.LatLng</a>
         * documentation for more details.
         * @returns a GeoJSON Point object
         */
        this.getGeoJSON = function (latLng) {
            return {
                type: 'Point',
                coordinates: [latLng.lng(), latLng.lat()]
            };
        };

        this.clearEditListeners = function () {
            google.maps.event.clearListeners(this._googleOverlay, 'drag');
            google.maps.event.clearListeners(this._googleOverlay, 'dragstart');
            google.maps.event.clearListeners(this._googleOverlay, 'dragend');
		};

        this.makeViewable = function () {
            this._googleOverlay.setOptions({'draggable': false, 'title': ''});
            this.clearEditListeners();
        };

        this.makeEditable = function (model) {
            var that = this;
            this.clearEditListeners();
			this._googleOverlay.setOptions({
                'draggable': true,
                'title': 'Drag this icon to re-position it'
            });
            google.maps.event.addListener(this._googleOverlay, "dragstart", function () {
                that.app.vent.trigger("hide-tip");
                that.app.vent.trigger("hide-bubble", { model: model });
            });

            google.maps.event.addListener(this._googleOverlay, "dragend", function (mEvent) {
                model.trigger('commit-data-no-save');
                model.setGeometryFromOverlay(mEvent.latLng);
                model.save();
                /*if (model.getKey() != "markers") {
                    that.app.vent.trigger("drag-ended", {
                        latLng: mEvent.latLng,
                        model: model
                    });
                } else {
                    that.saveShape(model);
                }*/
            });

            google.maps.event.addListener(this._googleOverlay, "drag", function (mEvent) {
                if (model.getDataTypePlural() != "markers") {
                    that.app.vent.trigger("dragging", {
                        latLng: mEvent.latLng
                    });
                }
            });
        };

        this.saveShape = function (model) {
            model.set("geometry", this.getGeoJSON());
            model.save();
        };

        this.getGeoJSON = function () {
            var latLng = this._googleOverlay.position;
            return {
                type: 'Point',
                coordinates: [latLng.lng(), latLng.lat()]
            };
        };

        this.setIcon = function (icon) {
            this._googleOverlay.setOptions({
                icon: icon
            });
        };

        this.intersects = function (latLng) {
            var r = 10,
                projection = this.app.getOverlayView().getProjection(),
                position = projection.fromLatLngToContainerPixel(latLng),
                currentPosition = projection.fromLatLngToContainerPixel(this._googleOverlay.getPosition()),
                rV = 20,
                rH = 10,
                top,
                bottom,
                left,
                right,
                withinBuffer;

            if (this._googleOverlay.icon && this._googleOverlay.icon.size) {
                rV = this._googleOverlay.icon.size.height;  // vertical radius
                rH = this._googleOverlay.icon.size.width;   // horizontal radius
            }
            top = position.y - rV;
            bottom = position.y + rV;
            left = position.x - rH;
            right = position.x + rH;

            withinBuffer = currentPosition.y  <= bottom + r &&
							   currentPosition.y >= top - 2 * r &&
							   currentPosition.x <= right + r &&
							   currentPosition.x >= left - r;
            if (withinBuffer) {
                return true;
            }
            return false;
        };

        this.initialize(app, opts);

    };
    /**
        STATIC METHOD
        --------------------------------------------------------------------------------------
        Available SVG shapes.
        @see See <a href="//raphaeljs.com/icons/#location">Shape Wizard</a>
        to add more icons.
       
        To generate SVGs from FontAwesome Icon set on Linux:
           1) sudo npm install -g font-awesome-svg-png
           2) sudo apt-get install librsvg2-bin
           3) font-awesome-svg-png --color red --sizes 128,256 //dumps icons into a directory called "red"
    */
    /*Point.Shapes = {
        //MAP_PIN: 'M0-165c-27.618 0-50 21.966-50 49.054C-50-88.849 0 0 0 0s50-88.849 50-115.946C50-143.034 27.605-165 0-165z',
        //SQUARE_PIN: 'M 50 -119.876 -50 -119.876 -50 -19.876 -13.232 -19.876 0.199 0 13.63 -19.876 50 -19.876 Z',
        //SHEILD: 'M42.8-72.919c0.663-7.855 3.029-15.066 7.2-21.675L34.002-110c-5.054 4.189-10.81 6.509-17.332 6.919 c-5.976 0.52-11.642-0.574-16.971-3.287c-5.478 2.626-11.121 3.723-17.002 3.287c-6.086-0.523-11.577-2.602-16.495-6.281 l-16.041 15.398c3.945 6.704 6.143 13.72 6.574 21.045c0.205 3.373-0.795 8.016-3.038 14.018c-1.175 3.327-2.061 6.213-2.667 8.627 c-0.562 2.394-0.911 4.34-1.027 5.801c-0.082 6.396 1.78 12.168 5.602 17.302c2.986 3.745 7.911 7.886 14.748 12.41 c7.482 3.665 13.272 6.045 17.326 7.06c1.163 0.521 2.301 1.025 3.363 1.506C-7.9-5.708-6.766-5.232-5.586-4.713 C-3.034-3.242-1.243-1.646-0.301 0C0.858-1.782 2.69-3.338 5.122-4.713c1.717-0.723 3.173-1.346 4.341-1.896 c1.167-0.494 2.037-0.865 2.54-1.09c0.866-0.414 2.002-0.888 3.376-1.41c1.386-0.527 3.101-1.168 5.144-1.882 c3.951-1.348 6.83-2.62 8.655-3.77c6.634-4.524 11.48-8.595 14.566-12.235c3.958-5.152 5.879-10.953 5.79-17.475 c-0.232-2.922-1.52-7.594-3.85-13.959C43.463-64.631 42.479-69.445 42.8-72.919z',
        //ROUTE: 'M49.986-58.919c-0.51-27.631-16.538-38.612-17.195-39.049l-2.479-1.692l-2.5 1.689c-4.147 2.817-8.449 4.247-12.783 4.247 c-7.178 0-12.051-3.864-12.256-4.032L-0.023-100l-2.776 2.248c-0.203 0.165-5.074 4.028-12.253 4.028 c-4.331 0-8.63-1.429-12.788-4.253l-2.486-1.678l-2.504 1.692c-1.702 1.17-16.624 12.192-17.165 38.907 C-50.211-56.731-43.792-12.754-0.003 0C47.609-13.912 50.23-56.018 49.986-58.919z',
        // OVAL: 'M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0'
        SQUARE: {
            markerSize: 100,
            scale: 1,
            path: 'M50-80c0-11-9-20-20-20h-60c-11 0-20 9-20 20v60c0 11 9 20 20 20h60c11 0 20-9 20-20V-80z',
            anchor: new google.maps.Point(0, -50),
            size: new google.maps.Size(100, 100),
            origin: new google.maps.Point(100, 100),
            viewBox: '-50 -100 100 100'
        },
        MAP_PIN_HOLLOW: {
            markerSize: 30.0,
            scale: 1.6,
            path: 'M16,3.5c-4.142,0-7.5,3.358-7.5,7.5c0,4.143,7.5,18.121,7.5,18.121S23.5,15.143,23.5,11C23.5,6.858,20.143,3.5,16,3.5z M16,14.584c-1.979,0-3.584-1.604-3.584-3.584S14.021,7.416,16,7.416S19.584,9.021,19.584,11S17.979,14.584,16,14.584z',
            anchor: new google.maps.Point(16, 30),
            size: new google.maps.Size(15, 30),
            origin: new google.maps.Point(0, 0),
            viewBox: '6 3 20 30'
        },
        CIRCLE: {
            markerSize: 40.0,
            scale: 1,
            path: 'M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0',
            anchor: new google.maps.Point(0, 0),
            size: new google.maps.Size(40.0, 40.0),
            origin: new google.maps.Point(0, 0),
            viewBox: '-20 -20 40 40'
        },
        SOUND: {
            markerSize: 30.0,
            scale: 1,
            path: 'M4.998,12.127v7.896h4.495l6.729,5.526l0.004-18.948l-6.73,5.526H4.998z M18.806,11.219c-0.393-0.389-1.024-0.389-1.415,0.002c-0.39,0.391-0.39,1.024,0.002,1.416v-0.002c0.863,0.864,1.395,2.049,1.395,3.366c0,1.316-0.531,2.497-1.393,3.361c-0.394,0.389-0.394,1.022-0.002,1.415c0.195,0.195,0.451,0.293,0.707,0.293c0.257,0,0.513-0.098,0.708-0.293c1.222-1.22,1.98-2.915,1.979-4.776C20.788,14.136,20.027,12.439,18.806,11.219z M21.101,8.925c-0.393-0.391-1.024-0.391-1.413,0c-0.392,0.391-0.392,1.025,0,1.414c1.45,1.451,2.344,3.447,2.344,5.661c0,2.212-0.894,4.207-2.342,5.659c-0.392,0.39-0.392,1.023,0,1.414c0.195,0.195,0.451,0.293,0.708,0.293c0.256,0,0.512-0.098,0.707-0.293c1.808-1.809,2.929-4.315,2.927-7.073C24.033,13.24,22.912,10.732,21.101,8.925z M23.28,6.746c-0.393-0.391-1.025-0.389-1.414,0.002c-0.391,0.389-0.391,1.023,0.002,1.413h-0.002c2.009,2.009,3.248,4.773,3.248,7.839c0,3.063-1.239,5.828-3.246,7.838c-0.391,0.39-0.391,1.023,0.002,1.415c0.194,0.194,0.45,0.291,0.706,0.291s0.513-0.098,0.708-0.293c2.363-2.366,3.831-5.643,3.829-9.251C27.115,12.389,25.647,9.111,23.28,6.746z',
            anchor: new google.maps.Point(16, 30),
            size: new google.maps.Size(30.0, 30.0),
            origin: new google.maps.Point(0, 0)
        }
    };*/
    return Point;
});

define('lib/maps/overlays/polyline',["jquery"], function ($) {
    "use strict";
    /**
     * Class that controls marker point model overlays.
     * @class Point
     */
    var Polyline = function (app, opts) {

        this._googleOverlay = null;
        this.model = null;
        this.map = null;

        this.getShapeType = function () {
            return "Polyline";
        };

        this.initialize = function (app, opts) {
            this.app = app;
            $.extend(this, opts);
            this.createOverlay(opts.isShowingOnMap || false);
        };

        this.createOverlay = function (isShowingOnMap) {
            this._googleOverlay = new google.maps.Polyline({
                path: this.getGoogleGeometryFromModel(),
                strokeColor: '#' + this.model.get("strokeColor"),
                strokeOpacity: 1.0,
                strokeWeight: 5,
                map: isShowingOnMap ? this.map : null
            });
        };

        this.redraw = function () {
            this._googleOverlay.setOptions({
                strokeColor: '#' + this.model.get("strokeColor")
            });
        };

        /**
         * An approximation for the center point of a polyline.
         * @param {google.maps.Polyline} googlePolyline
         * @returns {google.maps.LatLng}
         * A latLng corresponding the approximate center of the
         * polyline.
         */
        this.getCenter = function () {
            var coordinates = this._googleOverlay.getPath().getArray();
            return coordinates[Math.floor(coordinates.length / 2)];
        };

        this.centerOn = function () {
            this.map.panTo(this.getCenter());
        };

        this.zoomTo = function () {
            this.map.fitBounds(this.getBounds());
        };

        /**
         * Method that calculates the bounding box of a
         * google.maps.Polyline (in miles)
         * @param {google.maps.Polyline} googlePolyline
         * A Google polyline object.
         * @returns {google.maps.LatLngBounds}
         * The bounding box.
         */
        this.getBounds = function () {
            var bounds = new google.maps.LatLngBounds(),
                coords = this._googleOverlay.getPath().getArray(),
                i = 0;
            for (i; i < coords.length; i++) {
                bounds.extend(coords[i]);
            }
            return bounds;
        };

        this.show = function () {
            this._googleOverlay.setMap(this.map);
        };

        this.hide = function () {
            this._googleOverlay.setMap(null);
        };

        /**
         * Method that converts a google.maps.Polyline
         * into a GeoJSON Linestring object.
         * @param {google.maps.Polyline} googlePolyline
         * A Google polyline object.
         * @see See the Google <a href="https://developers.google.com/maps/documentation/javascript/reference#Polyline">google.maps.Polyline</a>
         * documentation for more details.
         * @returns a GeoJSON Linestring object
         */
        this.getGeoJSON = function () {
            var pathCoords = this._googleOverlay.getPath().getArray(),
                coords = [],
                i = 0;
            for (i; i < pathCoords.length; i++) {
                coords.push([pathCoords[i].lng(), pathCoords[i].lat()]);
            }
            return { type: 'LineString', coordinates: coords };
        };

        /**
         * Method that converts a GeoJSON Linestring into
         * an array of google.maps.LatLng objects.
         * @param {GeoJSON Linestring} geoJSON
         * A GeoJSON Linestring object
         * @returns {Array}
         * An array of google.maps.LatLng objects.
         */
        this.getGoogleGeometryFromModel = function () {
            var geoJSON = this.model.get("geometry"),
                path = [],
                coords = geoJSON.coordinates,
                i = 0;
            for (i; i < coords.length; i++) {
                path.push(new google.maps.LatLng(coords[i][1], coords[i][0]));
            }
            return path;
        };

        /**
         * Method that calculates the length of a
         * google.maps.Polyline (in miles)
         * @param {google.maps.Polyline} googlePolyline
         * A Google polyline object.
         * @returns {Number}
         * The length of the google.maps.Polyline object in miles.
         */
        this.calculateDistance = function () {
            var coords = this._googleOverlay.getPath().getArray(),
                distance = 0,
                i = 1;
            for (i; i < coords.length; i++) {
                distance += google.maps.geometry.spherical.computeDistanceBetween(coords[i - 1], coords[i]);
            }
            return Math.round(distance / 1609.34 * 100) / 100;
        };

        this.makeViewable = function () {
            this._googleOverlay.setOptions({'draggable': false, 'editable': false});
            google.maps.event.clearListeners(this._googleOverlay.getPath());
        };

        this.makeEditable = function (model) {
            var that = this;
            google.maps.event.clearListeners(this._googleOverlay.getPath());
			this._googleOverlay.setOptions({'draggable': false, 'editable': true});
            google.maps.event.addListener(this._googleOverlay.getPath(), 'set_at', function () {
                that.saveShape(model);
            });
            google.maps.event.addListener(this._googleOverlay.getPath(), 'remove_at', function () {
                that.saveShape(model);
            });
            google.maps.event.addListener(this._googleOverlay.getPath(), 'insert_at', function () {
                that.saveShape(model);
            });

            google.maps.event.addListener(this._googleOverlay, 'rightclick', function (e) {
                if (e.vertex === undefined) {
                    return;
                }
                if (that._googleOverlay.getPath().getLength() <= 2) {
                    return;
                }
                that.app.vent.trigger('show-delete-menu', {
                    googleOverlay: that._googleOverlay,
                    point: e.vertex
                });
            });
        };

        this.restoreModelGeometry = function () {
            this._googleOverlay.setPath(this.getGoogleLatLngFromModel());
        };

        this.saveShape = function (model) {
            model.set("geometry", this.getGeoJSON());
            model.save();
        };

        this.intersects = function (latLng) {
            //alert("No yet implemented.");
            return false;
        };

        this.initialize(app, opts);

    };
    return Polyline;
});

define('lib/maps/overlays/polygon',["lib/maps/overlays/polyline"], function (Polyline) {
    "use strict";
    /**
     * Functions to help move from lat/lngs to GeoJSON
     * formats and vice versa
     * @class Polygon
     */
    var Polygon = function (app, opts) {
        Polyline.call(this, app, opts);

        this.getShapeType = function () {
            return "Polygon";
        };

        this.createOverlay = function (isShowingOnMap) {
            this._googleOverlay = new google.maps.Polygon({
                path: this.getGoogleGeometryFromModel(),
                strokeColor: '#' + this.model.get("fillColor"),
                strokeOpacity: 1.0,
                strokeWeight: 5,
                fillColor: '#' + this.model.get("fillColor"),
                fillOpacity: 0.35,
                map: isShowingOnMap ? this.map : null
            });
        };

        this.redraw = function () {
            this._googleOverlay.setOptions({
                strokeColor: '#' + this.model.get("strokeColor"),
                fillColor: '#' + this.model.get("fillColor")
            });
        };
        /**
         * Method that converts a GeoJSON Linestring into
         * an array of google.maps.LatLng objects.
         * @param {GeoJSON Linestring} geoJSON
         * A GeoJSON Linestring object
         * @returns {Array}
         * An array of google.maps.LatLng objects.
         */
        this.getGoogleLatLngFromModel = function () {
            var geoJSON = this.model.get("geometry"),
                path = [],
                coords = geoJSON.coordinates[0],
                i = 0;
            for (i; i < coords.length; i++) {
                path.push(new google.maps.LatLng(coords[i][1], coords[i][0]));
            }
            path.pop();
            return path;
        };

        this.getCenterPoint = function () {
            return this.getBounds().getCenter();
        };

        /**
         * Method that converts a google.maps.Polygon
         * into a GeoJSON Linestring object.
         * @see See the Google <a href="https://developers.google.com/maps/documentation/javascript/reference#Polygon">google.maps.Polygon</a>
         * documentation for more details.
         * @returns a GeoJSON Polygon object
         */
        this.getGeoJSON = function () {
            var pathCoords = this._googleOverlay.getPath().getArray(),
                coords = [],
                i = 0;
            for (i; i < pathCoords.length; i++) {
                coords.push([pathCoords[i].lng(), pathCoords[i].lat()]);
            }
            //add last coordinate again:
            coords.push([pathCoords[0].lng(), pathCoords[0].lat()]);
            return { type: 'Polygon', coordinates: [coords] };
        };

		this.intersects = function (latLng) {
            //alert("No yet implemented.");
            return false;
        };

        this.initialize(app, opts);
    };
    return Polygon;
});
define('lib/maps/overlays/ground-overlay',["lib/maps/overlays/polyline"], function (Polyline) {
    "use strict";
    /**
     * Functions to help move from lat/lngs to GeoJSON
     * formats and vice versa
     * @class Polygon
     */
    var GroundOverlay = function (app, opts) {
        Polyline.call(this, app, opts);
        this.editPolygon = null;
        this.timer = null;
        this.isShowingOnMap = false;
        this.getShapeType = function () {
            return "GroundOverlay";
        };

        this.createOverlay = function (isShowingOnMap) {
            if (typeof isShowingOnMap !== 'undefined') {
                this.isShowingOnMap = isShowingOnMap;
            }
            this._googleOverlay = new google.maps.GroundOverlay(
                this.model.get("overlay_path") || this.model.get("file_path"),
                this.getBoundsFromGeoJSON(),
                {
                    map: this.isShowingOnMap ? this.map : null,
                    opacity: 1,
                    clickable: true
                }
            );
            this.attachGroundOverlayEventHandler();
        };

        this.makeViewable = this.makeEditable = function (model) {
            return true;
        };

        this.hide = function () {
            this._googleOverlay.setMap(null);
            if (this.editPolygon) {
                this.editPolygon.setMap(null);
            }
        };

        this.show = function () {
            this._googleOverlay.setMap(this.map);
            if (this.editPolygon && this.model.get("active")) {
                this.editPolygon.setMap(this.map);
            }
        };

        this.getGoogleLatLngFromModel = function () {
            return null;
        };

        this.getCenter = this.getCenterPoint = function () {
            return this.getBounds().getCenter();
        };

        this.getBounds = function () {
            return this._googleOverlay.getBounds();
        };

        this.getPolygonFromBounds = function () {
            var bounds = this.getBounds(),
                path = [],
                ne = bounds.getNorthEast(),
                sw = bounds.getSouthWest();
            path.push(ne);
            path.push(new google.maps.LatLng(sw.lat(), ne.lng()));
            path.push(sw);
            path.push(new google.maps.LatLng(ne.lat(), sw.lng()));
            return path;
        };

        this.redraw = function () {
            if (this.app.mode == 'edit' && this.model.get("active") && this.model.get("geometry")) {
                if (this.editPolygon) {
                    this.editPolygon.setMap(null);
                }
                this.editPolygon = new google.maps.Rectangle({
                    bounds: this.getBounds(),
                    strokeColor: '#ed867d',
                    strokeOpacity: 1.0,
                    strokeWeight: 4,
                    fillColor: '#FFF',
                    fillOpacity: 0,
                    map: this.map,
                    draggable: true,
                    editable: true
                });
                this.attachPolygonEventHandler();
            } else if (this.editPolygon) {
                this.editPolygon.setMap(null);
            }
        };

        this.attachGroundOverlayEventHandler = function () {
            var that = this;
            google.maps.event.addListener(this._googleOverlay, 'click', function () {
                console.log('clicked.');
                that.app.router.navigate("//" + that.model.getDataTypePlural() + "/" + that.model.get("id"));
            });
        };

        this.attachPolygonEventHandler = function () {
            var that = this;
            google.maps.event.addListener(this.editPolygon, 'bounds_changed', function () {
                that._googleOverlay.setMap(null);
                that.setGeometryFromOverlay();
                that.createOverlay(true);
                if (that.timer) {
                    clearTimeout(that.timer);
                }
                that.timer = setTimeout(function () { that.model.save(); }, 500);
            });
        };

        this.getBoundsFromGeoJSON = function () {
            var coordinates = this.model.get("geometry").coordinates[0],
                north = coordinates[0][1],
                east = coordinates[0][0],
                south = coordinates[2][1],
                west = coordinates[2][0];
            return new google.maps.LatLngBounds(
                new google.maps.LatLng(south, west),
                new google.maps.LatLng(north, east)
            );
        };

        this.getGeoJSONFromBounds = function () {
            var bounds = this.editPolygon.getBounds().toJSON(),
                north = bounds.north,
                south = bounds.south,
                east = bounds.east,
                west = bounds.west;
            return {
                "type": "Polygon",
                "coordinates": [[
                    [east, north],
                    [east, south],
                    [west, south],
                    [west, north],
                    [east, north]
                ]]
            };
        };

        this.setGeometryFromOverlay = function () {
            this.model.set("geometry", this.getGeoJSONFromBounds());
        };

        /**
         * Method that converts a google.maps.Polygon
         * into a GeoJSON Linestring object.
         * @see See the Google <a href="https://developers.google.com/maps/documentation/javascript/reference#Polygon">google.maps.Polygon</a>
         * documentation for more details.
         * @returns a GeoJSON Polygon object
         */
        this.getGeoJSON = function () {
            //note that bounds / polygon is read-only
            return this.model.get("geometry");
        };

		this.intersects = function (latLng) {
            //alert("No yet implemented.");
            return false;
        };

        this.initialize(app, opts);
    };
    return GroundOverlay;
});
define('lib/maps/overlays/base',["marionette",
    "lib/maps/overlays/point",
    "lib/maps/overlays/polyline",
    "lib/maps/overlays/polygon",
    "lib/maps/overlays/ground-overlay",
    "lib/maps/overlays/infobubbles/base",
    "lib/maps/overlays/icon"
    ], function (Marionette, Point, Polyline, Polygon, GroundOverlay, Infobubble, Icon) {
    "use strict";
    /**
     * This class controls the rendering and underlying
     * visibility of Google overlay objects, including points,
     * lines, and polygons
     * @class Overlay
     */
    var Base = Marionette.ItemView.extend({

        map: null,
        model: null,
        _overlay: null,
        template: false,
        displayOverlay: false,

        modelEvents: function () {
            var events = {
                'change:active': 'render',
                'show-marker': 'show',
                'hide-marker': 'hide',
                'zoom-to-overlay': 'zoomTo',
                'reset-overlay': 'restoreModelGeometry'
            };
            if (this.model.get('overlay_type') !== 'map-image') {
                events['change:geometry'] = 'reRender';
            }
            return events;
        },
        /** called when object created */
        initialize: function (opts) {
            _.extend(this, opts);
            this.id = this.model.get('overlay_type') + this.model.get('id');
            this.map = opts.app.getMap();
            this.initInfoBubble(opts);
            this.initOverlayType();
            this.listenTo(this.app.vent, "mode-change", this.redraw);
        },
        initInfoBubble: function (opts) {
            this.infoBubble = new Infobubble(_.extend({overlay: this}, opts));
        },
        getGoogleIcon: function () {
            if (!this._icon) {
                var icon,
                    iconOpts = {
                        //fillColor: '#ed867d', //this.model.get("color")
                        fillOpacity: 1,
                        strokeColor: '#fff',
                        strokeWeight: 1,
                        strokeOpacity: 1,
                        shape: 'circle',
                        fillColor: this.model.collection.fillColor,
                        width: this.model.collection.size,
                        height: this.model.collection.size
                    };
                _.extend(iconOpts, this.iconOpts);
                icon = new Icon(iconOpts);
                this._icon = icon;
            }
            return this._icon.generateGoogleIcon();
        },

        updateOverlay: function () {
            this.getGoogleOverlay().setMap(null);
            this.initOverlayType();
            //this.changeMode();
        },

        initOverlayType: function () {
            var geoJSON = this.model.get("geometry"),
                opts = {
                    model: this.model,
                    map: this.map
                };
            if (geoJSON.type === 'Point') {
                this._overlay = new Point(this.app, opts);
            } else if (geoJSON.type === 'LineString') {
                this._overlay = new Polyline(this.app, opts);
            } else if (geoJSON.type === 'Polygon') {
                if (this.model.get("overlay_type") == "map-image") {
                    this._overlay = new GroundOverlay(this.app, opts);
                } else {
                    this._overlay = new Polygon(this.app, opts);
                }
            } else {
                alert('Unknown Geometry Type');
            }

            this.attachEventHandlers();
        },

        attachEventHandlers: function () {
            var that = this;
            google.maps.event.addListener(this.getGoogleOverlay(), 'click', function () {
                that.app.router.navigate("//" + that.model.getDataTypePlural() + "/" + that.model.get("id"));
            });
            google.maps.event.addListener(this.getGoogleOverlay(), 'mouseover', function () {
                that.infoBubble.showTip();
                that.model.trigger('do-hover');
            });
            google.maps.event.addListener(this.getGoogleOverlay(), 'mouseout', function () {
                that.model.trigger("hide-tip");
                that.model.trigger('clear-hover');
            });
        },

        /** determines whether the overlay is visible on the map. */
        isShowingOnMap: function () {
            return this.getGoogleOverlay().getMap() != null && this.displayOverlay;
        },
        reRender: function () {
            this.render();
        },

        render: function () {
            this.redraw();
            if (this.displayOverlay) {
                this.show();
            }
        },

        /** shows the google.maps overlay on the map. */
        show: function () {
            this.displayOverlay = true;
            this._overlay.displayOverlay = true;
            this._overlay.show();
        },

        /** hides the google.maps overlay from the map. */
        hide: function () {
            this.displayOverlay = false;
            this._overlay.displayOverlay = false;
            this._overlay.hide();
            this.model.trigger("hide-bubble");
            //this.displayOverlay = false;
        },

        onBeforeDestroy: function () {
            this.hide();
            this.infoBubble.remove();
            Base.__super__.remove.apply(this);
        },

        /********************************************************/
        /** DELEGATED METHODS ***********************************/
        /********************************************************/

        /**
         * Returns the overlay's googleOverlay
         * @returns {Object}
         * Either a google.maps.Marker, google.maps.Polyline,
         * google.maps.Polygon, or google.maps.GroundOverlay
         */
        getGoogleOverlay: function () {
            return this._overlay._googleOverlay;
        },

        /** zooms to the google.maps overlay. */
        zoomTo: function () {
            //this._overlay.zoomTo();
            //show bubble already zooms to overlay:
            this.showBubble();
        },

        /** centers the map at the google.maps overlay */
        centerOn: function () {
            this._overlay.centerOn();
        },

        /**
         * Delegates to underlying geometry.
         * @returns {google.maps.LatLng} object
         */
        getCenter: function () {
            return this._overlay.getCenter();
        },

        getBounds: function () {
            return this._overlay.getBounds();
        },

        /*changeMode: function () {
            console.log('changeMode', this.model.get("active"));
            if (this.app.getMode() === "view") {
                this.makeViewable();
            } else {
                this.makeEditable();
            }
        },*/

        makeViewable: function () {
            this._overlay.makeViewable();
        },

        makeEditable: function () {
            if (this.model.get("active")) {
                this._overlay.makeEditable(this.model);
            }
        },

        redraw: function () {
            //implement in child class
        },

        getShapeType: function () {
            return this._overlay.getShapeType();
        },

        intersects: function (latLng) {
            return this._overlay.intersects(latLng);
        },

        restoreModelGeometry: function () {
            this._overlay.restoreModelGeometry();
        }

    });
    return Base;
});
define('lib/maps/overlays/marker',[
    "underscore",
    "lib/maps/overlays/infobubbles/marker",
    "lib/maps/overlays/base"
], function (_, MarkerBubble, Base) {
    "use strict";
    /**
     * Class that controls marker point model overlays.
     * Extends @link {localground.maps.overlays.Overlay}.
     * @class Marker
     */
    var Marker = Base.extend({

        initialize: function (opts) {
            Base.prototype.initialize.apply(this, arguments);
            this.redraw();
        },

        initInfoBubble: function (opts) {
            //TO DO: make one infobubble for entire basemap, not at the marker-level.
            this.infoBubble = new MarkerBubble(_.extend({overlay: this}, opts));
        },

        redraw: function () {
            if (this.getShapeType() === "Point") {
                if (this.model.get("active")) {
                    var icon = {};
                    _.extend(icon, this.getGoogleIcon(), { strokeWeight: 10, strokeOpacity: 0.5 });
                    icon.strokeColor = icon.fillColor;
                    this.getGoogleOverlay().setIcon(icon);
                    if (this.app.mode == 'view') {
                        this._overlay.makeViewable(this.model);
                    } else {
                        this._overlay.makeEditable(this.model);
                    }
                } else {
                    if (this.getGoogleIcon()) {
                        this._overlay.setIcon(this.getGoogleIcon());
                        this._overlay.makeViewable(this.model);
                    }
                }
            } else {
                this._overlay.redraw();
            }
        }

    });
    return Marker;
});
define('lib/maps/marker-overlays',['marionette',
        'underscore',
        'lib/maps/overlays/marker'
    ],
    function (Marionette, _, MarkerOverlay) {
        'use strict';
        /**
         * The top-level view class that harnesses all of the map editor
         * functionality. Also coordinates event triggers across all of
         * the constituent views.
         * @class OverlayGroup
         */
        var MarkerOverlays = Marionette.CollectionView.extend({
            /** A google.maps.Map object */
            map: null,
            childView: MarkerOverlay,
            collectionEvents: {
                'zoom-to-extents': 'zoomToExtents',
                'change:geometry': 'geometryUpdated',
                'show-markers': 'showAll',
                'hide-markers': 'hideAll'
            },

            initialize: function (opts) {
                _.extend(this, opts);
                this.collection = opts.collection;
                this.opts = opts;
                this.map = this.app.getMap();
                this.childViewOptions = opts;
                this.childViewOptions.displayOverlay = opts.displayOverlays;

                this.render();

                google.maps.event.addListenerOnce(this.map, 'idle', function () {
                    if (this.opts.startVisible) {
                        this.showAll();
                    }
                }.bind(this));
            },

            geometryUpdated: function (model) {
                if (!this.children.findByModel(model)) {
                    this.addChild(model, this.childView);
                } else if (!model.get("geometry")) {
                    var view = this.children.findByModel(model);
                    this.removeChildView(view);
                }
            },

            // overriding the "addChild" method so that data elements w/o
            // geometries won't render.
            addChild: function (child, ChildView, index) {
                if (child.get('geometry') != null) {
                    return Marionette.CollectionView.prototype.addChild.call(this, child, ChildView, index);
                }
                return null;
            },

            showAll: function () {
                console.log('showAll');
                this.children.each(function (overlay) {
                    overlay.show();
                });
            },

            hideAll: function () {
                //this._isShowingOnMap = false;
                this.children.each(function (overlay) {
                    overlay.hide();
                });
            },

            remove: function () {
                this.hideAll();
                Marionette.CollectionView.prototype.remove.call(this);
            },

            getBounds: function () {
                var bounds = new google.maps.LatLngBounds();
                this.children.each(function (overlay) {
                    bounds.union(overlay.getBounds());
                });
                return bounds;
            },

            zoomToExtents: function () {
                var bounds = this.getBounds();
                if (!bounds.isEmpty()) {
                    this.map.fitBounds(bounds);
                }
            }

        });
        return MarkerOverlays;
    });

/**
 * @license RequireJS text 2.0.12 Copyright (c) 2010-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/text for details
 */
/*jslint regexp: true */
/*global require, XMLHttpRequest, ActiveXObject,
  define, window, process, Packages,
  java, location, Components, FileUtils */

define('text',['module'], function (module) {
    'use strict';

    var text, fs, Cc, Ci, xpcIsWindows,
        progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
        xmlRegExp = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
        bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,
        hasLocation = typeof location !== 'undefined' && location.href,
        defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, ''),
        defaultHostName = hasLocation && location.hostname,
        defaultPort = hasLocation && (location.port || undefined),
        buildMap = {},
        masterConfig = (module.config && module.config()) || {};

    text = {
        version: '2.0.12',

        strip: function (content) {
            //Strips <?xml ...?> declarations so that external SVG and XML
            //documents can be added to a document without worry. Also, if the string
            //is an HTML document, only the part inside the body tag is returned.
            if (content) {
                content = content.replace(xmlRegExp, "");
                var matches = content.match(bodyRegExp);
                if (matches) {
                    content = matches[1];
                }
            } else {
                content = "";
            }
            return content;
        },

        jsEscape: function (content) {
            return content.replace(/(['\\])/g, '\\$1')
                .replace(/[\f]/g, "\\f")
                .replace(/[\b]/g, "\\b")
                .replace(/[\n]/g, "\\n")
                .replace(/[\t]/g, "\\t")
                .replace(/[\r]/g, "\\r")
                .replace(/[\u2028]/g, "\\u2028")
                .replace(/[\u2029]/g, "\\u2029");
        },

        createXhr: masterConfig.createXhr || function () {
            //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
            var xhr, i, progId;
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject !== "undefined") {
                for (i = 0; i < 3; i += 1) {
                    progId = progIds[i];
                    try {
                        xhr = new ActiveXObject(progId);
                    } catch (e) {}

                    if (xhr) {
                        progIds = [progId];  // so faster next time
                        break;
                    }
                }
            }

            return xhr;
        },

        /**
         * Parses a resource name into its component parts. Resource names
         * look like: module/name.ext!strip, where the !strip part is
         * optional.
         * @param {String} name the resource name
         * @returns {Object} with properties "moduleName", "ext" and "strip"
         * where strip is a boolean.
         */
        parseName: function (name) {
            var modName, ext, temp,
                strip = false,
                index = name.indexOf("."),
                isRelative = name.indexOf('./') === 0 ||
                             name.indexOf('../') === 0;

            if (index !== -1 && (!isRelative || index > 1)) {
                modName = name.substring(0, index);
                ext = name.substring(index + 1, name.length);
            } else {
                modName = name;
            }

            temp = ext || modName;
            index = temp.indexOf("!");
            if (index !== -1) {
                //Pull off the strip arg.
                strip = temp.substring(index + 1) === "strip";
                temp = temp.substring(0, index);
                if (ext) {
                    ext = temp;
                } else {
                    modName = temp;
                }
            }

            return {
                moduleName: modName,
                ext: ext,
                strip: strip
            };
        },

        xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,

        /**
         * Is an URL on another domain. Only works for browser use, returns
         * false in non-browser environments. Only used to know if an
         * optimized .js version of a text resource should be loaded
         * instead.
         * @param {String} url
         * @returns Boolean
         */
        useXhr: function (url, protocol, hostname, port) {
            var uProtocol, uHostName, uPort,
                match = text.xdRegExp.exec(url);
            if (!match) {
                return true;
            }
            uProtocol = match[2];
            uHostName = match[3];

            uHostName = uHostName.split(':');
            uPort = uHostName[1];
            uHostName = uHostName[0];

            return (!uProtocol || uProtocol === protocol) &&
                   (!uHostName || uHostName.toLowerCase() === hostname.toLowerCase()) &&
                   ((!uPort && !uHostName) || uPort === port);
        },

        finishLoad: function (name, strip, content, onLoad) {
            content = strip ? text.strip(content) : content;
            if (masterConfig.isBuild) {
                buildMap[name] = content;
            }
            onLoad(content);
        },

        load: function (name, req, onLoad, config) {
            //Name has format: some.module.filext!strip
            //The strip part is optional.
            //if strip is present, then that means only get the string contents
            //inside a body tag in an HTML string. For XML/SVG content it means
            //removing the <?xml ...?> declarations so the content can be inserted
            //into the current doc without problems.

            // Do not bother with the work if a build and text will
            // not be inlined.
            if (config && config.isBuild && !config.inlineText) {
                onLoad();
                return;
            }

            masterConfig.isBuild = config && config.isBuild;

            var parsed = text.parseName(name),
                nonStripName = parsed.moduleName +
                    (parsed.ext ? '.' + parsed.ext : ''),
                url = req.toUrl(nonStripName),
                useXhr = (masterConfig.useXhr) ||
                         text.useXhr;

            // Do not load if it is an empty: url
            if (url.indexOf('empty:') === 0) {
                onLoad();
                return;
            }

            //Load the text. Use XHR if possible and in a browser.
            if (!hasLocation || useXhr(url, defaultProtocol, defaultHostName, defaultPort)) {
                text.get(url, function (content) {
                    text.finishLoad(name, parsed.strip, content, onLoad);
                }, function (err) {
                    if (onLoad.error) {
                        onLoad.error(err);
                    }
                });
            } else {
                //Need to fetch the resource across domains. Assume
                //the resource has been optimized into a JS module. Fetch
                //by the module name + extension, but do not include the
                //!strip part to avoid file system issues.
                req([nonStripName], function (content) {
                    text.finishLoad(parsed.moduleName + '.' + parsed.ext,
                                    parsed.strip, content, onLoad);
                });
            }
        },

        write: function (pluginName, moduleName, write, config) {
            if (buildMap.hasOwnProperty(moduleName)) {
                var content = text.jsEscape(buildMap[moduleName]);
                write.asModule(pluginName + "!" + moduleName,
                               "define(function () { return '" +
                                   content +
                               "';});\n");
            }
        },

        writeFile: function (pluginName, moduleName, req, write, config) {
            var parsed = text.parseName(moduleName),
                extPart = parsed.ext ? '.' + parsed.ext : '',
                nonStripName = parsed.moduleName + extPart,
                //Use a '.js' file name so that it indicates it is a
                //script that can be loaded across domains.
                fileName = req.toUrl(parsed.moduleName + extPart) + '.js';

            //Leverage own load() method to load plugin value, but only
            //write out values that do not have the strip argument,
            //to avoid any potential issues with ! in file names.
            text.load(nonStripName, req, function (value) {
                //Use own write() method to construct full module value.
                //But need to create shell that translates writeFile's
                //write() to the right interface.
                var textWrite = function (contents) {
                    return write(fileName, contents);
                };
                textWrite.asModule = function (moduleName, contents) {
                    return write.asModule(moduleName, fileName, contents);
                };

                text.write(pluginName, nonStripName, textWrite, config);
            }, config);
        }
    };

    if (masterConfig.env === 'node' || (!masterConfig.env &&
            typeof process !== "undefined" &&
            process.versions &&
            !!process.versions.node &&
            !process.versions['node-webkit'])) {
        //Using special require.nodeRequire, something added by r.js.
        fs = require.nodeRequire('fs');

        text.get = function (url, callback, errback) {
            try {
                var file = fs.readFileSync(url, 'utf8');
                //Remove BOM (Byte Mark Order) from utf8 files if it is there.
                if (file.indexOf('\uFEFF') === 0) {
                    file = file.substring(1);
                }
                callback(file);
            } catch (e) {
                if (errback) {
                    errback(e);
                }
            }
        };
    } else if (masterConfig.env === 'xhr' || (!masterConfig.env &&
            text.createXhr())) {
        text.get = function (url, callback, errback, headers) {
            var xhr = text.createXhr(), header;
            xhr.open('GET', url, true);

            //Allow plugins direct access to xhr headers
            if (headers) {
                for (header in headers) {
                    if (headers.hasOwnProperty(header)) {
                        xhr.setRequestHeader(header.toLowerCase(), headers[header]);
                    }
                }
            }

            //Allow overrides specified in config
            if (masterConfig.onXhr) {
                masterConfig.onXhr(xhr, url);
            }

            xhr.onreadystatechange = function (evt) {
                var status, err;
                //Do not explicitly handle errors, those should be
                //visible via console output in the browser.
                if (xhr.readyState === 4) {
                    status = xhr.status || 0;
                    if (status > 399 && status < 600) {
                        //An http 4xx or 5xx error. Signal an error.
                        err = new Error(url + ' HTTP status: ' + status);
                        err.xhr = xhr;
                        if (errback) {
                            errback(err);
                        }
                    } else {
                        callback(xhr.responseText);
                    }

                    if (masterConfig.onXhrComplete) {
                        masterConfig.onXhrComplete(xhr, url);
                    }
                }
            };
            xhr.send(null);
        };
    } else if (masterConfig.env === 'rhino' || (!masterConfig.env &&
            typeof Packages !== 'undefined' && typeof java !== 'undefined')) {
        //Why Java, why is this so awkward?
        text.get = function (url, callback) {
            var stringBuffer, line,
                encoding = "utf-8",
                file = new java.io.File(url),
                lineSeparator = java.lang.System.getProperty("line.separator"),
                input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), encoding)),
                content = '';
            try {
                stringBuffer = new java.lang.StringBuffer();
                line = input.readLine();

                // Byte Order Mark (BOM) - The Unicode Standard, version 3.0, page 324
                // http://www.unicode.org/faq/utf_bom.html

                // Note that when we use utf-8, the BOM should appear as "EF BB BF", but it doesn't due to this bug in the JDK:
                // http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=4508058
                if (line && line.length() && line.charAt(0) === 0xfeff) {
                    // Eat the BOM, since we've already found the encoding on this file,
                    // and we plan to concatenating this buffer with others; the BOM should
                    // only appear at the top of a file.
                    line = line.substring(1);
                }

                if (line !== null) {
                    stringBuffer.append(line);
                }

                while ((line = input.readLine()) !== null) {
                    stringBuffer.append(lineSeparator);
                    stringBuffer.append(line);
                }
                //Make sure we return a JavaScript string and not a Java string.
                content = String(stringBuffer.toString()); //String
            } finally {
                input.close();
            }
            callback(content);
        };
    } else if (masterConfig.env === 'xpconnect' || (!masterConfig.env &&
            typeof Components !== 'undefined' && Components.classes &&
            Components.interfaces)) {
        //Avert your gaze!
        Cc = Components.classes;
        Ci = Components.interfaces;
        Components.utils['import']('resource://gre/modules/FileUtils.jsm');
        xpcIsWindows = ('@mozilla.org/windows-registry-key;1' in Cc);

        text.get = function (url, callback) {
            var inStream, convertStream, fileObj,
                readData = {};

            if (xpcIsWindows) {
                url = url.replace(/\//g, '\\');
            }

            fileObj = new FileUtils.File(url);

            //XPCOM, you so crazy
            try {
                inStream = Cc['@mozilla.org/network/file-input-stream;1']
                           .createInstance(Ci.nsIFileInputStream);
                inStream.init(fileObj, 1, 0, false);

                convertStream = Cc['@mozilla.org/intl/converter-input-stream;1']
                                .createInstance(Ci.nsIConverterInputStream);
                convertStream.init(inStream, "utf-8", inStream.available(),
                Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);

                convertStream.readString(inStream.available(), readData);
                convertStream.close();
                inStream.close();
                callback(readData.value);
            } catch (e) {
                throw new Error((fileObj && fileObj.path || '') + ': ' + e);
            }
        };
    }
    return text;
});


define('text!apps/presentation/templates/legend-symbol-item.html',[],function () { return '<input class="cb-symbol" type="checkbox" {{#if isShowing}}checked{{/if}} />\n<svg viewBox="{{ icon.viewBox }}" width="{{ width }}" height="{{ height }}">\n    <path fill="{{ icon.fillColor }}" stroke-linejoin="round" stroke-linecap="round" paint-order="stroke"\n          stroke-width="{{ strokeWeight }}" stroke="{{ icon.strokeColor }}" d="{{ icon.path }}"></path>\n</svg>\n<!-- If there is more than one unique item inside the group, give a title\n     Otherwise If there\'s only 1 symbol, then don\'t show this section\n-->\n{{#compare count 1 operator=">"}}\n    <p>{{ title }}</p>\n{{/compare}}\n';});

define('apps/presentation/views/legend-symbol-entry',['marionette',
        'underscore',
        'jquery',
        'handlebars',
        'lib/maps/marker-overlays',
        'text!../templates/legend-symbol-item.html'
    ],
    function (Marionette, _, $, Handlebars, OverlayListView, SymbolTemplate) {
        'use strict';

        var LegendSymbolEntry = Marionette.ItemView.extend({
            tagName: "li",

            events: {
                'change .cb-symbol': 'showHide'
            },

            showHide: function (e) {
                var isChecked = $(e.target).prop('checked');
                if (isChecked) {
                    this.markerOverlays.showAll();
                } else {
                    this.markerOverlays.hideAll();
                }
            },

            show: function (e) {
                this.markerOverlays.showAll();
                if (e) {
                    e.preventDefault();
                }
            },

            hide: function (e) {
                this.markerOverlays.hideAll();
                if (e) {
                    e.preventDefault();
                }
            },

            templateHelpers: function () {
                var width = 25,
                    scale = width / this.model.get("width"),
                    template_items = {
                        width: width,
                        height: this.model.get("height") * scale,
                        strokeWeight: this.model.get("strokeWeight"),
                        count: this.symbolCount,
                        isShowing: this.getIsShowing()
                    };
                return template_items;
            },
            getIsShowing: function () {
                return this.model.get('isShowing') || this.isShowing || false;
            },

            initialize: function (opts) {
                _.extend(this, opts);
                var that = this, matchedCollection;
                this.template = Handlebars.compile(SymbolTemplate);
                this.data = this.app.dataManager.getCollection(this.data_source);
                matchedCollection = new this.data.constructor(null, { url: "dummy" });

                this.data.each(function (model) {
                    if (that.model.checkModel(model)) {
                        matchedCollection.add(model);
                    }
                });

                this.markerOverlays = new OverlayListView({
                    collection: matchedCollection,
                    app: this.app,
                    iconOpts: this.model.toJSON(),
                    isShowing: this.getIsShowing()
                });

                this.listenTo(this.app.vent, "show-all-markers", this.markerOverlays.showAll.bind(this.markerOverlays));
            },

            onRender: function(){
                if (this.getIsShowing()) {
                    this.show();
                }
            }
        });
        return LegendSymbolEntry;
    });


define('text!apps/presentation/templates/legend-layer.html',[],function () { return '<ul class="list-indent-simple">\n    <li>{{ title }}</li>\n</ul>\n<ul class="symbol-container list-indent-simple"></ul>\n';});

define('apps/presentation/views/legend-layer-entry',['marionette',
        'underscore',
        'handlebars',
        'collections/symbols',
        'apps/presentation/views/legend-symbol-entry',
        'text!../templates/legend-layer.html'
    ],
    function (Marionette, _, Handlebars, Symbols, LegendSymbolEntry, LayerTemplate) {
        'use strict';

        var LegendLayerEntry = Marionette.CompositeView.extend({
            childView: LegendSymbolEntry,
            className: "layer-entry",
            childViewContainer: ".symbol-container",
            childViewOptions: function () {
                return {
                    app: this.app,
                    data_source: this.model.get("data_source"),
                    isShowing: this.model.get("metadata").isShowing,
                    symbolCount: this.collection.length
                };
            },
            initialize: function (opts) {
                _.extend(this, opts);
                this.collection = new Symbols(this.model.get("symbols"));
                this.template = Handlebars.compile(LayerTemplate);
            }

        });
        return LegendLayerEntry;
    });


define('text!apps/presentation/templates/legend-container.html',[],function () { return '<div class="legend-top">\n    <p class="legend-top-text">Legend</p>\n    <i class="fa fa-angle-down legend-toggle" aria-hidden="true"></i>\n</div>';});

define('apps/presentation/views/layer-list-manager',["marionette",
        "underscore",
        "handlebars",
        "apps/presentation/views/legend-layer-entry",
        "text!../templates/legend-container.html"
    ],
    function (Marionette, _, Handlebars, LayerEntryView, LegendTemplate) {
        'use strict';
        var LayerListManager = Marionette.CompositeView.extend({
            tagName: 'div',
            template: Handlebars.compile(LegendTemplate),
            initialize: function (opts) {
                _.extend(this, opts);
                console.log("Layer List Manager Called");
            },
            events: {
                'click .legend-toggle': 'toggleLegend',
                'click this': 'toggleLegend'
            },
            childViewOptions: function () {
                return {
                    app: this.app
                };
            },
            childView: LayerEntryView,

            toggleLegend: function () {
                console.log("toggle legend", $('#legend').css('height'));
                if ($('#legend').css('height') == '20px') {
                    $('#legend').css({'height': 'auto', 'width': 'auto'});
                } else {
                    $('#legend').css({'height': '20px', 'width': '90px'});
                }
                
            }
        });
        return LayerListManager;

    });

define('apps/presentation/views/map-header',["underscore",
        "marionette",
        "handlebars"
    ],
    function (_, Marionette, Handlebars) {
        'use strict';
        var MapHeader = Marionette.ItemView.extend({

            template: Handlebars.compile(
                '<h1 style="font-weight: {{ fontWeight }}; color: {{ fontColor }}; font-size: {{ fontSize }}; font-family: {{ fontFamily }};">\
                    {{ name }} \
                </h1> \
                <h2>{{caption}}</h2> \
            '),

            initialize: function (opts) {
                _.extend(this, opts);
                this.render();
            },
            templateHelpers: function () {
                var styles = this.model.get("panel_styles"),
                    opts = {
                        fontFamily: styles.title.font,
                        fontSize: styles.title.size + "px",
                        fontColor: styles.title.color,
                        fontWeight: styles.title.fw
                    };
                return opts;
            },
            onRender: function () {
                this.$el.css({
                    backgroundColor: '#' + this.model.get("panel_styles").title.backgroundColor
                });
            }
        });
        return MapHeader;
    });

define('text!apps/gallery/templates/photo-detail.html',[],function () { return '<!-- VIEW MODE -->\n{{#ifequal mode "view"}}\n    {{#compare screenType "presentation" operator="!="}}\n        <h4>Preview</h4>\n    {{/compare}}\n    <div class="section">\n        <h3>{{ name }}</h3>\n    </div>\n\n    <div class="img-card">\n        <div class="photo-single">\n            <img src="{{this.path_medium}}" />\n        </div>\n        <p class="photo-caption">{{ caption }}</p>\n    </div>\n\n    <div class="section-card">\n        <p>\n        Attribution: {{ attribution }} <br>\n        {{#each tags}}\n            <a class="tag"> {{this}} </a>\n        {{/each}}\n        <!-- Three curly braces if you don\'t want to escape HTML -->\n    </div>\n    {{#compare screenType "presentation" operator="!="}}\n        <div class="save-options">\n            <button class="edit-mode button-tertiary ">Edit</button>\n        </div>\n    {{/compare}}\n{{/ifequal}}\n\n{{#ifequal mode "presentation"}}\n    <div class="section">\n        <h3>{{ name }}</h3>\n        <p style="font-style: italic">{{ caption }}</p>\n    </div>\n    <div class="img-card">\n        <div class="photo-single">\n            <img src="{{this.path_medium}}" />\n        </div>\n        <p class="photo-caption">{{ caption }}</p>\n    </div>\n    <div class="section-card">\n        <p>Tags:\n        {{#each tags}}\n            <!-- <p>{{this}}<br></p> -->\n            <a class="tag"> {{this}} </a>\n        {{/each}}\n        </p>\n        <!-- Three curly braces if you don\'t want to escape HTML -->\n    </div>\n{{/ifequal}}\n\n\n\n<!-- EDIT MODE -->\n{{#ifequal mode "edit"}}\n    <h4>\n        {{#if id}}\n        Edit\n        {{else}}\n        Add New\n        {{/if}}\n        Media Details\n    </h4>\n    {{#ifequal screenType "map"}}\n        {{#if geometry}}\n            <button class="button-secondary delete-marker-button" id="delete-geometry">Remove Location Marker</button>\n        {{else}}\n            <div class="add-lat-lng">\n                <button class="button-secondary add-marker-button" id="add-geometry">\n                    Add Location Marker\n                </button>\n            </div>\n        {{/if}}\n        {{#if lat}}\n            <div class="latlong-container">\n            <p class="latlong" style="font-style: italic">\n                ({{lat}}, {{lng}})\n            </p>\n            </div>\n        {{/if}}\n    {{/ifequal}}\n\n    <div class="img-card single-photo">\n        <div class="photo-container">\n            <img class="edit-photo" src="{{ path_medium }}" />\n        </div>\n        <div class="rotate-message">\n            <p>rotating photo...</p>\n            <i class="fa fa-refresh fa-spin fa-2x"></i>\n        </div>\n    </div>\n\n    <div class="rotate-photo">\n        <a class="rotate-left" rotation="left" ><i rotation="left" class="fa fa-rotate-left" aria-hidden="true"></i></a>\n        <a class="rotate-right" rotation="right" ><i rotation="right" class="fa fa-rotate-right" aria-hidden="true"></i></a>\n    </div>\n\n    <div id="model-form">\n        <!-- Form goes here. To modify the fields that are editable,\n             go to the redesign/models/photo.js / audio.js and modify\n             the form. Instructions re: how to use the Backbone Forms\n             library here:\n             https://github.com/powmedia/backbone-forms#custom-editors\n        -->\n    </div>\n\n    <div class="save-options">\n        <button class="save-model button-primary pull-right">Save</button>\n        <button class="view-mode button-tertiary">Preview</button>\n        <button class="button-tertiary button-warning delete-model">Delete</button>\n    </div>\n{{/ifequal}}\n\n{{#ifequal screenType "map"}}\n    <div class="show-hide hide"></div>\n{{/ifequal}}\n';});


define('text!apps/gallery/templates/audio-detail.html',[],function () { return '<!-- VIEW MODE -->\n{{#ifequal mode "view"}}\n    <h4>Preview</h4>\n    <div class="player-container audio-detail"></div>\n    <br>\n    {{tags}}\n    <br>\n    <div class="save-options">\n        <button class="edit-mode button-tertiary ">Edit</button>\n    </div>\n{{/ifequal}}\n\n\n<!-- EDIT MODE -->\n{{#ifequal mode "edit"}}\n    <h4>\n        {{#if id}}\n        Edit\n        {{else}}\n        Add New\n        {{/if}}\n    </h4>\n    {{#ifequal screenType "map"}}\n        {{#if geometry}}\n        <button class="button-secondary delete-marker-button" id="delete-geometry">Remove Location Marker</button>\n        {{else}}\n        <div class="add-lat-lng">\n            <button class="button-secondary add-marker-button" id="add-geometry">\n                Add Location Marker\n            </button>\n        </div>\n        {{/if}}\n        \n        {{#if lat}}\n            <div class="latlong-container">\n            <p class="latlong" style="font-style: italic">\n                ({{lat}}, {{lng}})\n            </p>\n            </div>\n        {{/if}}\n    {{/ifequal}}\n    <div class="player-container audio-detail">\n\n    </div>\n\n    <div id="model-form">\n        <!-- Form goes here. To modify the fields that are editable,\n            go to the redesign/models/photo.js and/or audio.js and modify\n            the form. Instructions re: how to use the Backbone Forms\n            library here:\n            https://github.com/powmedia/backbone-forms#custom-editors\n        -->\n    </div>\n    <div class = "save-options">\n        <button class="save-model button-primary pull-right">Save</button>\n        <button class="view-mode button-tertiary">Preview</button>\n        <button class="button-tertiary button-warning delete-model">Delete</button>\n    </div>\n{{/ifequal}}\n\n{{#ifequal screenType "map"}}\n    <div class="show-hide hide"></div>\n{{/ifequal}}\n';});


define('text!apps/gallery/templates/video-detail.html',[],function () { return '<!-- VIEW MODE -->\n{{#ifequal mode "view"}}\n    <h4>Preview</h4>\n    <div>\n        {{name}}\n        <br>\n        {{caption}}\n        <br>\n        {{#ifequal video_provider "vimeo"}}\n            <iframe src="https://player.vimeo.com/video/{{video_id}}"\n            width="350" height="200"\n            frameborder="0"\n            webkitallowfullscreen mozallowfullscreen allowfullscreen>\n            </iframe>\n        {{/ifequal}}\n\n\n        {{#ifequal video_provider "youtube"}}\n            <iframe src="https://www.youtube.com/embed/{{video_id}}?ecver=1"\n            width="350" height="200"\n            frameborder="0" allowfullscreen>\n            </iframe>\n        {{/ifequal}}\n    </div>\n    <br>\n    {{tags}}\n    <br>\n    <div class="save-options">\n        <button class="edit-mode button-tertiary ">Edit</button>\n    </div>\n{{/ifequal}}\n\n\n<!-- EDIT MODE -->\n{{#ifequal mode "edit"}}\n    <h4>\n        {{#if id}}\n        Edit\n        {{else}}\n        Add New\n        {{/if}}\n    </h4>\n    {{#ifequal screenType "map"}}\n        {{#if geometry}}\n        <button class="button-secondary delete-marker-button" id="delete-geometry">Remove Location Marker</button>\n        {{else}}\n        <div class="add-lat-lng">\n            <button class="button-secondary add-marker-button" id="add-geometry">\n                Add Location Marker\n            </button>\n        </div>\n        {{/if}}\n\n        {{#if lat}}\n            <div class="latlong-container">\n            <p class="latlong" style="font-style: italic">\n                ({{lat}}, {{lng}})\n            </p>\n            </div>\n        {{/if}}\n    {{/ifequal}}\n    <div>\n            {{#ifequal video_provider "vimeo"}}\n                <iframe src="https://player.vimeo.com/video/{{video_id}}"\n                style="width: 100%" height="250"\n                frameborder="0"\n                webkitallowfullscreen mozallowfullscreen allowfullscreen>\n                </iframe>\n            {{/ifequal}}\n\n\n            {{#ifequal video_provider "youtube"}}\n                <iframe src="https://www.youtube.com/embed/{{video_id}}?ecver=1"\n                style="width: 100%" height="250"\n                frameborder="0" allowfullscreen>\n                </iframe>\n            {{/ifequal}}\n    </div>\n\n    <div id="model-form">\n        <!-- Form goes here. To modify the fields that are editable,\n            go to the redesign/models/photo.js and/or audio.js and modify\n            the form. Instructions re: how to use the Backbone Forms\n            library here:\n            https://github.com/powmedia/backbone-forms#custom-editors\n        -->\n    </div>\n    <div class = "save-options">\n        <button class="save-model button-primary pull-right">Save</button>\n        <button class="view-mode button-tertiary">Preview</button>\n        <button class="button-tertiary button-warning delete-model">Delete</button>\n    </div>\n{{/ifequal}}\n\n{{#ifequal screenType "map"}}\n    <div class="show-hide hide"></div>\n{{/ifequal}}\n';});


define('text!apps/gallery/templates/record-detail.html',[],function () { return '<!-- VIEW MODE -->\n{{#ifequal mode "view"}}\n    {{#compare screenType "presentation" operator="!="}}\n        <h4>Preview</h4>\n    {{/compare}}\n\n    <div class="section">\n        <h3 style="color: #{{paragraph.color}}; font-family: {{paragraph.font}}">{{ name }}</h3>\n\n        {{#if featuredImage}}\n            <img class="photo featured-photo" src=\'{{featuredImage.path_medium}}\'>\n        {{/if}}\n        {{#if caption }}\n            <p style="font-style: italic">{{ caption }}</p>\n        {{/if}}\n\n        {{#if video_count }}\n            <div class="carousel carousel-video" style="background-color: #{{paragraph.backgroundColor}}"></div>\n        {{/if}}\n        {{#if photo_count }}\n            <!-- This is where we need to make changes inside to ensure that featured image is not part of the carousel -->\n            <div class="carousel carousel-photo" style="background-color: #{{paragraph.backgroundColor}}"></div>\n        {{/if}}\n        {{#if audio_count }}\n            <div class="carousel carousel-audio" style="background-color: #{{paragraph.backgroundColor}}"></div>\n        {{/if}}\n    </div>\n\n    {{#if fields }}\n        <table class="preview-properties" style="color: #{{paragraph.color}}; font-family: {{paragraph.font}}; border-color: #{{paragraph.color}}">\n        {{#each fields}}\n            <tr>\n                <td>{{ this.col_alias }}:</td>\n                <td>{{ this.val }}</td>\n            </tr>\n        {{/each}}\n        {{#if tags}}\n            <tr>\n                <td></td>\n                <td>\n                    {{#each tags}}\n                        <a class="tag"> {{this}} </a>\n                    {{/each}}\n                </td>\n            </tr>\n        {{/if}}\n        </table>\n    {{else}}\n        <div class="tag-container">\n        {{#each tags}}\n            <a class="tag"> {{this}} </a>\n        {{/each}}\n        </div>\n    {{/if}}\n    <button class="button button-tertiary streetview">Show Street View</button>\n\n    {{#compare screenType "presentation" operator="!="}}\n        <div class="save-options">\n            <button class="edit-mode button-tertiary">Edit</button>\n        </div>\n    {{/compare}}\n{{/ifequal}}\n\n\n<!-- EDIT MODE -->\n{{#ifequal mode "edit"}}\n    <h4>\n        {{#if id}}\n        Edit\n        {{else}}\n        Add New\n        {{/if}}\n    </h4>\n\n    {{#ifequal screenType "map"}}\n        {{#if geometry}}\n            <button class="button-secondary delete-marker-button" id="delete-geometry">Remove Location Marker</button>\n        {{else}}\n            <div class="add-lat-lng">\n                <button class="button-secondary add-marker-button" id="add-geometry">\n                    Add Location Marker\n                </button>\n            </div>\n        {{/if}}\n        {{#if lat }}\n            <div class="latlong-container">\n            <p class="latlong" style="font-style: italic">\n                ({{lat}}, {{lng}})\n            </p>\n            </div>\n        {{/if}}\n    {{/ifequal}}\n\n    <div id="model-form"></div>\n    \n    <button class="button button-tertiary streetview">Show Street View</button>\n\n    <div class = "save-options">\n        <button class="save-model button-primary pull-right">Save</button>\n        <button class="view-mode button-tertiary" id="preview">Preview</button>\n        <button class="button-tertiary button-warning delete-model" id="delete">Delete</button>\n    </div>\n{{/ifequal}}\n\n{{#ifequal screenType "map"}}\n    <div class="show-hide hide"></div>\n{{/ifequal}}\n';});


define('text!apps/gallery/templates/map-image-detail.html',[],function () { return '<!-- VIEW MODE -->\n{{#ifequal mode "view"}}\n    <h4>Preview</h4>\n    <div class="section">\n        <h3>{{ name }}</h3>\n    </div>\n\n    <div class="img-card">\n        <div class="photo-single">\n            <img src="{{this.overlay_path}}" />\n        </div>\n        <p class="photo-caption">{{ caption }}</p>\n    </div>\n    {{#each tags}}\n        <a class="tag"> {{this}} </a>\n    {{/each}}\n    <br>\n    <div class="save-options">\n        <button class="edit-mode button-tertiary ">Edit</button>\n    </div>\n{{/ifequal}}\n\n\n<!-- EDIT MODE -->\n{{#ifequal mode "edit"}}\n    <h4>\n        {{#if id}}\n        Edit\n        {{else}}\n        Add New\n        {{/if}}\n    </h4>\n    {{#if geometry}}\n        <button class="button-secondary delete-marker-button" id="delete-geometry">Detach Overlay From Map</button>\n    {{else}}\n        <div class="add-bounding-box">\n            <button class="button-secondary add-marker-button" id="add-rectangle">\n                Place Overlay\n            </button>\n        </div>\n    {{/if}}\n    <div class="img-card map-image">\n    {{#if overlay_path}}\n        <img src="{{ overlay_path }}" />\n    {{else}}\n        <img src="{{ file_path }}" />\n    {{/if}}\n    </div>\n\n    <div id="model-form">\n        <!-- Form goes here. To modify the fields that are editable,\n             go to the redesign/models/photo.js and/or audio.js and modify\n             the form. Instructions re: how to use the Backbone Forms\n             library here:\n             https://github.com/powmedia/backbone-forms#custom-editors\n        -->\n    </div>\n    <div class="save-options">\n        <button class="save-model button-primary pull-right">Save</button>\n        <button class="view-mode button-tertiary">Preview</button>\n        <button class="button-tertiary button-warning delete-model">Delete</button>\n    </div>\n{{/ifequal}}\n\n{{#ifequal screenType "map"}}\n    <div class="show-hide hide"></div>\n{{/ifequal}}\n';});


define('text!lib/audio/audio-player.html',[],function () { return '{{#ifequal audioMode "basic"}}\n    <audio controls preload class="audio">\n        <source src="{{file_path}}" type="audio/mpeg" />\n    </audio>\n    <div>\n        <div class="play-ctrls">\n            <div class="play fa fa-play fa-2x" aria-hidden="true"></div>\n        </div>\n    </div>\n{{/ifequal}}\n\n{{#ifequal audioMode "simple"}}\n    <audio controls preload class="audio">\n      <source src="{{file_path}}" type="audio/mpeg" />\n    </audio>\n    <div>\n        <div class="play-ctrls">\n            <!-- i class="fa fa-play play" aria-hidden="true" style="font-size:2em;"></i -->\n            <div class="play fa fa-play fa-3x" aria-hidden="true"></div>\n        </div>\n        <div class="audio-progress">\n            <div class="progress-container">\n                <div class="audio-progress-bar"></div>\n                <div class="audio-progress-duration"></div>\n                <div class="audio-progress-circle"></div>\n            </div>\n            <div class="audio-labels time-current"></div>\n           <!-- <span class="audio-labels time-duration" style="right: 10px;"></span> -->\n        </div>\n    </div>\n{{/ifequal}}\n\n{{#ifequal audioMode "detail"}}\n    <audio controls preload class="audio">\n      <source src="{{file_path}}" type="audio/mpeg" />\n    </audio>\n\n    <div class="audio-container" style="color: #{{paragraph.color}}">\n        <div class="audio-progress">\n            <div class="play-ctrls">\n                <!--   <i class="fa fa-backward fwd-back skip-back" aria-hidden="true" style="color: #{{paragraph.color}}"></i> -->\n          <!-- <i class="fa fa-play fa-2x play" aria-hidden="true" style="color: #{{paragraph.color}}"></i> -->\n                <i class="fa fa-play fa-lg play" aria-hidden="true" style="color: #{{paragraph.color}}"></i>\n                <!-- <i class="play" aria-hidden="true" style="font-size:0.5em; border-color: transparent transparent transparent #{{paragraph.color}}"></i> -->\n         <!--   <i class="fa fa-forward fwd-back skip-fwd" aria-hidden="true" style="color: #{{paragraph.color}}"></i> -->\n            </div>\n            <div class="progress-container">\n                <div class="audio-progress-bar" style="background-color: #{{paragraph.backgroundColor}}; border-color: #{{paragraph.color}}"></div>\n                <div class="audio-progress-duration" style="background-color: #{{paragraph.color}}; border-color: #{{paragraph.color}}"></div>\n                <div class="audio-progress-circle" style="border-color: #{{paragraph.color}}; background-color: #{{paragraph.backgroundColor}}"></div>\n            </div>\n         <!--   <span class="audio-labels time-current" style="left: 10px; color: #{{paragraph.color}};"></span>  -->\n         <!--   <span class="audio-labels time-duration" style="right: 10px; color: #{{paragraph.color}};"></span> -->\n        </div>\n        <div class="info-container">\n            <p class="audio-info" style="color: #{{paragraph.color}}; font-family: {{paragraph.font}}">{{ name }}{{#if caption}}: {{ caption }} {{/if}}</p>\n            <span class="audio-labels time-current" style="float: right; color: #{{paragraph.color}}; font-family: {{paragraph.font}}"></span>\n        </div>\n        \n\n    </div>\n{{/ifequal}}\n';});

define('lib/handlebars-helpers',["handlebars"],
    function (Handlebars) {
        "use strict";
        Handlebars.registerHelper("ifHasQuotes", function (txt, block) {
            if (txt && txt.indexOf("\"") != -1) {
                return block.fn(this);
            }
            return false;
        });
        Handlebars.registerHelper('ifequal', function (lvalue, rvalue, options) {
            if (arguments.length < 3) {
                throw new Error("Handlebars Helper equal needs 2 parameters");
            }
            if (lvalue != rvalue) {
                return options.inverse(this);
            }
            return options.fn(this);
        });

        Handlebars.registerHelper('ifcontains', function (val, chars, block) {
            if (val.indexOf(chars) != -1) {
                return block.fn(this);
            }
        });

        Handlebars.registerHelper('ifnotequal', function (lvalue, rvalue, options) {
            if (arguments.length < 3) {
                throw new Error("Handlebars Helper equal needs 2 parameters");
            }
            if (lvalue == rvalue) {
                return options.inverse(this);
            }
            return options.fn(this);
        });

        Handlebars.registerHelper('ifnot', function (value, options) {
            if (arguments.length < 2) {
                throw new Error("Handlebars Helper ifnot needs 1 parameter");
            }
            if (value){
                return options.inverse(this);
            }
            return options.fn(this);
        });

        Handlebars.registerHelper('compare', function(lvalue, rvalue, options) {

            if (arguments.length < 3)
                throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

            var operator = options.hash.operator || "==";

            var operators = {
                '==':       function(l,r) { return l == r; },
                '===':      function(l,r) { return l === r; },
                '!=':       function(l,r) { return l != r; },
                '<':        function(l,r) { return l < r; },
                '>':        function(l,r) { return l > r; },
                '<=':       function(l,r) { return l <= r; },
                '>=':       function(l,r) { return l >= r; },
                'typeof':   function(l,r) { return typeof l == r; }
            }

            if (!operators[operator])
                throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);

            var result = operators[operator](lvalue,rvalue);

            if( result ) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }

        });

        Handlebars.registerHelper('truncate', function (str, numChars) {
            if (!str) {
                return;
            }
            if (str.length > numChars && str.length > 0) {
                var new_str = str + " ";
                new_str = str.substr(0, numChars);
                new_str = str.substr(0, new_str.lastIndexOf(" "));
                new_str = (new_str.length > 0) ? new_str : str.substr(0, numChars);
                return new Handlebars.SafeString(new_str + '...');
            }
            return str;
        });

        Handlebars.registerHelper("hexToRgb", function (hex, opacity) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            result = result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
            if (result) {
                return "rgba(" + result.r + ", " + result.g + ", " + result.b + ", " + opacity + ")";
            }
            return "";
        });

        Handlebars.registerHelper("highlightIntensity", function (txt) {
            var re = /(d+):/i,
                found = txt.match(re),
                color;
            console.log(found);
            if (!txt) { return ''; }
            if (txt.indexOf("1:") != -1) {
                color = "#F6FEAA";
            } else if (txt.indexOf("2:") != -1) {
                color = "#F7F8A4";
            } else if (txt.indexOf("3:") != -1) {
                color = "#F9F29F";
            } else if (txt.indexOf("4:") != -1) {
                color = "#FAEC99";
            } else if (txt.indexOf("5:") != -1) {
                color = "#FCE694";
            }
            return new Handlebars.SafeString('style="background-color: ' + color + '"');
        });

        Handlebars.registerHelper('times', function (start, end, block) {
            var accum = '', i;
            for (i = start; i < end; ++i) {
                accum += block.fn(i);
            }
            return accum;
        });

        Handlebars.registerHelper("repeat", function (txt, fa_class) {
            if (!txt) { return ''; }

            var found = txt.match(/(\d+):/i),
                bubbles = "",
                count,
                i;
            if (found && found.length > 1) {
                count = found[1];
                for (i = 0; i < count; i++) {
                    bubbles += '<i class="fa ' + fa_class + '"></i>&nbsp;';
                }
            }
            return bubbles;
        });

        Handlebars.registerHelper("paginator", function () {
            var re = /page=(\d+)/i,
                previous = null,
                next = null,
                html = '';
            if (this.previous) { previous = this.previous.match(re); }
            if (this.next) { next = this.next.match(re); }
            if (previous && previous.length > 1) {
                html += '<button class="btn page" style="margin-right:10px" page-num="' + previous[1] + '">' +
                    '<i class="fa fa-angle-double-left"></i> previous' +
                    '</button>';
            }
            if (next && next.length > 1) {
                html += '<button class="btn page" page-num="' + next[1] + '">' +
                    'next <i class="fa fa-angle-double-right"></i>' +
                    '</button>';
            }
            return html;
        });


    });

define('lib/audio/audio-player',["underscore", "marionette", "handlebars", "text!../audio/audio-player.html", "lib/handlebars-helpers"],
    function (_, Marionette, Handlebars, PlayerTemplate) {
        'use strict';

        var AudioPlayer = Marionette.ItemView.extend({
            events: {
                'click .close': 'hide',
                'click .close-modal': 'hide',
                'click .volUp': 'volumeUp',
                'click .volDown': 'volumeDown',
                'click .play' : 'togglePlay',
                'click .skip-fwd' : 'skipForward',
                'click .skip-back' : 'skipBackward',
                'click .progress-container' : 'jumpToTime'
            },
            suspendUIUpdate: false,
            audio: null,
            template: Handlebars.compile(PlayerTemplate),
            initialize: function (opts) {
                opts = opts || {};
                _.extend(this, opts);
                this.render();
                this.audio = this.$el.find(".audio").get(0);
                this.listenTo(this.app.vent, 'audio-carousel-advanced', this.stop);

                // need to attach audio events directly to the element b/c the
                // HTML5 audio events work slightly differently than other element
                // events:
                _.bindAll(this, 'playerDurationUpdate');
                this.$el.find('audio').on('timeupdate', this.playerDurationUpdate);
                this.$el.find('audio').on('ended', this.showPlayButton.bind(this));
            },
            onRender: function () {
                if (!this.$el.find('.progress-container').get(0)) {
                    return;
                }
                // setTimeout necessary b/c need to wait 'til rendered audio player
                // has been attached to the DOM in order to calculate the offset
                setTimeout(this.initDraggable.bind(this), 50);
            },
            initDraggable: function () {
                var $c = this.$el.find('.progress-container'),
                    x = $c.offset().left,
                    w = $c.width(),
                    containment = [x, 0, x + w + 5, 0],
                    that = this;
                this.$el.find(".audio-progress-circle").draggable({
                    axis: "x",
                    containment: containment, //[ x1, y1, x2, y2 ]
                    start: that.seek.bind(that),
                    stop: that.jumpToTime.bind(that)
                });
            },
            templateHelpers: function () {
                var paragraph;
                if (this.panelStyles) {
                    paragraph = this.panelStyles.paragraph;
                }
                return {
                    audioMode: this.audioMode,
                    paragraph: paragraph
                };
            },
            stop: function () {
                this.showPlayButton();
                this.audio.pause();
            },
            showPauseButton: function () {
                this.$el.find(".play").addClass("fa-pause");
            },
            showPlayButton: function () {
                this.$el.find(".play").removeClass("fa-pause");
            },
            togglePlay: function () {
                console.log("play toggle");
                if (this.audio.paused) {
                    this.audio.play();
                    this.showPauseButton();
                } else {
                    this.audio.pause();
                    this.showPlayButton();
                }
            },
            volumeUp: function () {
                this.audio.volume += ((this.audio.volume + 0.1) < 1) ? 0.1 : 0;
            },
            volumeDown: function () {
                this.audio.volume -= ((this.audio.volume - 0.1) > 0) ? 0.1 : 0;
            },
            jumpToTime: function (e) {
                this.suspendUIUpdate = false;
                var $progressContainer = this.$el.find('.progress-container'),
                    posX = $progressContainer.offset().left,
                    w = (e.pageX - posX) / $progressContainer.width();
                this.audio.currentTime = w * this.audio.duration;
                if (this.audio.paused) {
                    this.showPauseButton();
                    this.audio.play();
                }
            },
            seek: function () {
                this.suspendUIUpdate = true;
            },
            skipForward: function () {
                if (this.audio.currentTime < this.audio.duration) {
                    var skipStep = this.audio.duration / 10;
                    this.audio.currentTime += skipStep;
                } else {
                    this.audio.currentTime = this.audio.duration;
                }
            },
            skipBackward: function () {
                if (this.audio.currentTime > 0) {
                    var skipStep = this.audio.duration / 10;
                    this.audio.currentTime -= skipStep;
                } else {
                    this.audio.currentTime = 0;
                }
            },
            playerDurationUpdate: function (e, pos) {
                if (this.suspendUIUpdate) {
                    return;
                }
                if (!pos) {
                    pos = this.audio.currentTime / this.audio.duration * 100 + "%";
                }
                this.$el.find(".audio-progress-duration").width(pos);
                this.$el.find(".audio-progress-circle").css({
                    "left": "calc(" + pos + ")"
                });
                this.$el.find(".time-current").html(this.getCurrentTime());
                this.$el.find(".time-duration").html(this.getDuration());
                e.preventDefault();
            },
            formatTime: function (timeCount) {
                var seconds = timeCount,
                    minutes = Math.floor(seconds / 60);
                minutes = (minutes >= 10) ? minutes : "0" + minutes;
                seconds = Math.floor(seconds % 60);
                seconds = (seconds >= 10) ? seconds : "0" + seconds;
                return minutes + ":" + seconds;
            },
            getDuration: function () {
                return this.formatTime(this.audio.duration);
            },
            getCurrentTime: function () {
                return this.formatTime(this.audio.currentTime);
            }
        });
        return AudioPlayer;
    });


define('text!lib/carousel/carousel-container.html',[],function () { return '{{#if isSpreadsheet}}\n    {{#compare num_children 1 operator="=="}}\n        <div class="carousel-content img-card"></div>\n    {{/compare}}\n\n    {{#compare num_children 1 operator=">"}}\n        <div class="carouselbox spreadsheet">\n            <ol class="carousel-content"></ol>\n        </div>\n        <div class="circle-buttons">\n            <i class="fa fa-circle show-slide" aria-hidden="true" data-index="0"></i>\n            {{#times 1 num_children}}\n                <i class="fa fa-circle-o show-slide" aria-hidden="true" data-index="{{ this }}" data-id="{{this.id}}"></i>\n            {{/times}}\n        </div>\n    {{/compare}}\n{{else}}\n\n    <div class="carouselbox">\n        <ol class="carousel-content"></ol>\n    </div>\n    \n    {{#compare num_children 1 operator=">"}}\n    <div class="circle-buttons">\n        <i class="fa fa-circle show-slide" aria-hidden="true" data-index="0" style="color: #{{paragraph.color}}"></i>\n        {{#times 1 num_children}}\n            <i class="fa fa-circle-o show-slide" aria-hidden="true" data-index="{{ this }}" data-id="{{this.id}}" style="color: #{{../paragraph.color}}"></i>\n        {{/times}}\n    </div>\n    <p class="carousel-caption" style="font-family: {{paragraph.font}}">{{this.caption }}</p>\n    {{/compare}}\n\n{{/if}}\n';});


define('text!lib/carousel/carousel-container-audio.html',[],function () { return '\n{{#if isSpreadsheet}}\n    {{#compare num_children 1 operator="=="}}\n        <div class="carousel-content"></div>\n    {{/compare}}\n\n    {{#compare num_children 1 operator=">"}}\n    <div class="carouselbox spreadsheet audio">\n        <ol class="carousel-content"></ol>\n    </div>\n<!--    \n    <div class="carousel-buttons hover-to-show">\n        <i class="fa fa-chevron-left prev"></i>\n        <i class="fa fa-chevron-right next"></i>\n    </div>\n-->\n    <div class="circle-buttons">\n        <i class="fa fa-circle show-slide" aria-hidden="true" data-index="0"></i>\n        {{#times 1 num_children}}\n            <i class="fa fa-circle-o show-slide" aria-hidden="true" data-index="{{ this }}"></i>\n        {{/times}}\n    </div>\n    {{/compare}}\n{{else}}\n    <div class="carouselbox audio">\n        <ol class="carousel-content"></ol>\n    </div>\n\n    {{#compare num_children 1 operator=">"}}\n    <div class="circle-buttons">\n        <i class="fa fa-circle show-slide" aria-hidden="true" data-index="0"></i>\n        {{#times 1 num_children}}\n            <i class="fa fa-circle-o show-slide" aria-hidden="true" data-index="{{ this }}"></i>\n        {{/times}}\n    </div>\n    {{/compare}}\n\n{{/if}}\n';});


define('text!lib/carousel/carousel-video-item.html',[],function () { return '{{#ifequal video_provider "vimeo"}}\n    <iframe class="photo" src="https://player.vimeo.com/video/{{video_id}}"\n    style="width:100%" height="200"\n    frameborder="0"\n    webkitallowfullscreen mozallowfullscreen allowfullscreen>\n    </iframe>\n{{/ifequal}}\n\n{{#ifequal video_provider "youtube"}}\n    <iframe class="photo" src="https://www.youtube.com/embed/{{video_id}}?ecver=1"\n    style="width:100%" height="200"\n    frameborder="0" allowfullscreen>\n    </iframe>\n{{/ifequal}}\n<p class="carousel-caption" style="color: {{paragraph.color}}; font-family: {{paragraph.font}}">{{this.caption }}</p>';});


define('text!lib/carousel/carousel-photo-item.html',[],function () { return '<div class="photo" style="background: url(\'{{this.path_medium}}\');"></div>\n<div class="carousel-caption-wrapper">\n    <p class="carousel-caption" style="color: {{paragraph.color}}; font-family: {{paragraph.font}}">{{this.caption }}</p>\n<div>\n';});

define('lib/carousel/carousel',["jquery", "underscore", "marionette", "handlebars",
        "lib/audio/audio-player",
        "text!../carousel/carousel-container.html",
        "text!../carousel/carousel-container-audio.html",
        "text!../carousel/carousel-video-item.html",
        "text!../carousel/carousel-photo-item.html"],
    function ($, _, Marionette, Handlebars, AudioPlayer,
              CarouselContainerTemplate, CarouselContainerAudioTemplate, VideoItemTemplate, PhotoItemTemplate) {
        'use strict';
        var Carousel = Marionette.CompositeView.extend({
            events: {
                "click .next": "next",
                "click .prev": "prev",
                "click .show-slide": "jump",
                'mouseover .carouselbox': 'showArrows',
                'mouseout .carouselbox': 'hideArrows'
            },
            counter: 0,
            className: "active-slide",
            mode: "photos",
            childViewContainer: ".carousel-content",
            initialize: function (opts) {
                _.extend(this, opts);
                console.log(this);
                if (this.mode == "photos") {
                    this.template = Handlebars.compile(CarouselContainerTemplate);
                } else if (this.mode == "videos") {
                    this.template = Handlebars.compile(CarouselContainerTemplate);
                } else {
                    this.template = Handlebars.compile(CarouselContainerAudioTemplate);
                }
                this.render();
                //this.$el.addClass('active-slide');
                if (this.collection.length == 1 && this.mode !== "audio") {
                    this.$el.addClass('short');
                }
                this.navigate(0);
            },

            showArrows: function () {
                if (this.mode === "audio" || this.collection.length === 1) {
                    return;
                }
                var $leftArrow, $rightArrow;
                if (this.timeout) {
                    clearTimeout(this.timeout);
                    this.timeout = null;
                } else {
                    $leftArrow = $('<i class="fa fa-chevron-left prev"></i>');
                    $rightArrow = $('<i class="fa fa-chevron-right next"></i>');
                    this.$el.find('.carouselbox').append($leftArrow).append($rightArrow);
                }
            },
            hideArrows: function () {
                if (this.mode === "audio" || this.collection.length === 1) {
                    return;
                }
                var that = this;
                this.timeout = setTimeout(function () {
                    that.$el.find('.fa-chevron-left, .fa-chevron-right').remove();
                    that.timeout = null;
                }, 100);
            },
            childViewOptions: function () {
                return {
                    mode: this.mode,
                    app: this.app,
                    num_children: this.collection.length,
                    parent: this,
                    panelStyles: this.panelStyles
                };
            },
            getChildView: function () {
                return Marionette.ItemView.extend({
                    initialize: function (opts) {
                        _.extend(this, opts);
                        if (this.mode == "photos") {
                            this.template = Handlebars.compile(PhotoItemTemplate);
                        } else if (this.mode == "videos") {
                            this.template = Handlebars.compile(VideoItemTemplate);
                        } else {
                            this.template = Handlebars.compile("<div class='player-container audio-detail'></div>");
                        }
                    },
                    templateHelpers: function () {
                        console.log(this);
                        var paragraph;
                        if (this.panelStyles) {
                            paragraph = this.panelStyles.paragraph;
                        }
                        return {
                            num_children: this.num_children,
                            mode: this.mode, 
                            paragraph: paragraph
                        };
                    },
                    tagName: "li",
                    onRender: function () {
                        if (this.mode == "audio") {
                            var player = new AudioPlayer({
                                model: this.model,
                                audioMode: "detail",
                                app: this.app,
                                panelStyles: this.panelStyles
                            });
                            this.$el.find('.player-container').append(player.$el);
                        }
                    }
                });
            },

            templateHelpers: function () {
                console.log(this);
                var paragraph;
                if (this.panelStyles) {
                    paragraph = this.panelStyles.paragraph;
                }
                return {
                    num_children: this.collection.length,
                    isSpreadsheet: this.app.screenType === "spreadsheet",
                    paragraph: paragraph
                };
            },

            navigate: function () {
                if (this.mode == "audio") {
                    this.app.vent.trigger('audio-carousel-advanced');
                }
                var $items = this.$el.find('.carousel-content li'),
                    amount = this.collection.length;
                $items.removeClass('current').hide();
                if (this.counter < 0) {
                    this.counter = amount - 1;
                }
                if (this.counter >= amount) {
                    this.counter = 0;
                }
                this.updateCircles();
                $($items[this.counter]).addClass('current').show();
            },

            resetCurrentFrame: function () {
                //needed to stop playing iFrame videos:
                this.children.findByIndex(this.counter).render();
            },

            next: function () {
                this.resetCurrentFrame();
                this.counter += 1;
                this.navigate();
            },

            prev: function () {
                this.resetCurrentFrame();
                this.counter -= 1;
                this.navigate();
            },

            updateCircles: function () {
                var $items = this.$el.find('.show-slide'),
                    $clicked = $($items[this.counter]);
                $items.removeClass("fa-circle");
                $items.not($clicked).addClass("fa-circle-o");
                $clicked.addClass("fa-circle");
            },

            jump: function (e) {
                this.resetCurrentFrame();
                this.counter = parseInt($(e.target).attr("data-index"), 10);
                this.navigate();
            }
        });
        return Carousel;
    });


define('text!apps/gallery/templates/table.html',[],function () { return '{{#ifequal dataType "photos"}}  \n    <td><img src="{{ path_medium }}" class="thumbnail-img"></td>\n{{/ifequal}}\n\n{{#ifequal dataType "audio"}}\n    <td><i class="fa fa-2x fa-volume-up" aria-hidden="true"></i></td>\n{{/ifequal}}\n\n{{#ifequal dataType "videos"}}\n    <td>\n        {{#ifequal video_provider "vimeo"}}\n            <i class="fa fa-2x fa-vimeo" aria-hidden="true"></i>\n        {{ else }}\n            <i class="fa fa-2x fa-youtube" aria-hidden="true"></i>\n        {{/ifequal}}\n    </td>\n{{/ifequal}}\n\n<td>{{ name }}</td>\n<td>{{ caption }}</td>\n<td>{{ tags }}</td>\n<td>{{ overlay_type }}</td>\n<td>{{ owner }}</td>\n\n';});


define('text!apps/gallery/templates/thumb.html',[],function () { return '{{#ifequal dataType "photos"}}\n    <a href="#/{{ dataType }}/{{id}}">\n        <div class="card-img-preview" style="background-image: url(\'{{ path_medium }}\');" />\n    </a>\n    <h1>\n        {{ name }}\n    </h1>\n    {{#if coords}}<p class="coords">{{ coords }}</p>{{/if}}\n    <h2>\n        {{owner}}\n    </h2>\n\n\n{{/ifequal}}\n\n{{#ifequal dataType "audio"}}\n<a href="#/{{ dataType }}/{{id}}" id="audio-card">\n    <div class="player-container audio-simple">\n\n    </div>\n\n    <h1>\n        {{ name }}\n    </h1>\n    {{#if coords}}<p class="coords">{{ coords }}</p>{{/if}}\n    <h2>\n        {{owner}}\n    </h2>\n</a>\n{{/ifequal}}\n\n\n{{#ifequal dataType "videos"}}\n<a href="#/{{ dataType }}/{{id}}" class="video-simple">\n    <div class="video-simple">\n        {{#ifequal video_provider "vimeo"}}\n            <iframe src="https://player.vimeo.com/video/{{video_id}}"\n            style="width:100%" height="200"\n            frameborder="0"\n            webkitallowfullscreen mozallowfullscreen allowfullscreen>\n            </iframe>\n        {{/ifequal}}\n\n        {{#ifequal video_provider "youtube"}}\n            <iframe src="https://www.youtube.com/embed/{{video_id}}?ecver=1"\n            style="width:100%" height="200"\n            frameborder="0" allowfullscreen>\n            </iframe>\n        {{/ifequal}}\n    </div>\n\n    <h1>\n        {{ name }}\n    </h1>\n    {{#if coords}}<p class="coords">{{ coords }}</p>{{/if}}\n    <h2>\n        {{owner}}\n    </h2>\n</a>\n{{/ifequal}}\n\n{{#ifcontains dataType "markers"}}\n    <div class="card-site-field">\n\n        <a href="#/{{ dataType }}/{{id}}">\n\n            <table>\n                   <tr>\n                       <td>Name</td>\n                       <td>{{ this.name }}</td>\n                   </tr>\n\n                   <tr>\n                       <td>Caption</td>\n                       <td>{{truncate this.caption 42}}</td>\n                   </tr>\n\n                   <tr>\n                       <td>Tags</td>\n                       <td>{{ this.tags }}</td>\n                   </tr>\n\n                   <tr>\n                       <td>Coordinates</td>\n                       <td>{{ coords }}</td>\n                   </tr>\n            </table>\n\n            <h1>\n                {{ name }}\n            </h1>\n            <h2>\n                {{owner}}\n            </h2>\n\n        </a>\n    </div>\n{{/ifcontains}}\n\n{{#ifcontains dataType "form_"}}\n    <div class="card-site-field">\n\n        <a href="#/{{ dataType }}/{{id}}">\n            <table>\n\n                {{#each fields}}\n                    <tr>\n                        <td>{{ this.col_alias }}</td>\n                        <td>{{ this.val }}</td>\n                    </tr>\n                {{/each}}\n                <tr>\n                    <td>Coordinates</td>\n                    <td>{{ coords }}</td>\n                </tr>\n            </table>\n\n            <h1>\n                {{display_name}}\n            </h1>\n            <h2>\n                {{owner}}\n            </h2>\n\n        </a>\n    </div>\n{{/ifcontains}}\n';});

define ('apps/gallery/views/media-browser-child-view',[
    "underscore",
    "marionette",
    "handlebars",
    "lib/audio/audio-player",
    "text!../templates/table.html",
    "text!../templates/thumb.html"],
    function (_, Marionette, Handlebars, AudioPlayer, TableTemplate, ThumbTemplate) {
        'use strict';

        var MediaBrowserChildView = Marionette.ItemView.extend({
            initialize: function (opts) {
                _.extend(this, opts);
                this.render();
            },
            getTemplate: function () {
                if (this.parent.viewMode == "thumb") {
                    return Handlebars.compile(ThumbTemplate);
                }
                return Handlebars.compile(TableTemplate);
            },
            events: {
                'click .card-img-preview' : 'doSelection',
                'click .audio-simple' : 'doSelection',
                'click .video-simple' : 'doSelection',
                'click td' : "doSelection"
            },

            doSelection: function (e) {
                if (this.tagName === "tr") {
                    this.selectedClass(e, this.parent.$el.find("tr"));
                } else {
                    this.selectedClass(e, this.parent.$el.find(".column"));
                }
            },
            selectedClass: function (e, $columns) {
                var hasPrevModel, previousModel, currentModel,
                    startIndex, endIndex, i, currModel, currColumn;

                // 1) if neither SHIFT nor CMD selected, clear everything:
                if (!e.metaKey && !e.shiftKey) {
                    $columns.removeClass("selected-card");
                    this.model.collection.each(function (model) {
                        model.set("isSelected", false);
                    });
                }

                // 2) Then either select or deselect current element:
                if (this.$el.hasClass("selected-card")) {
                    this.$el.removeClass("selected-card");
                    this.model.set("isSelected", false);
                } else {
                    this.$el.addClass("selected-card");
                    this.model.set("isSelected", true);
                }

                // 3) then, if shift key selected, select everything in between:
                if (e.shiftKey) {
                    hasPrevModel = true;
                    if (this.parent.lastSelectedModel == null) {
                        hasPrevModel = false;
                    }

                    if (hasPrevModel) {
                        previousModel = this.parent.lastSelectedModel;
                        currentModel = this.model;
                        if (this.model.collection.indexOf(previousModel) <
                                this.model.collection.indexOf(currentModel)) {
                            startIndex = this.model.collection.indexOf(previousModel);
                            endIndex = this.model.collection.indexOf(currentModel);
                        } else {
                            endIndex = this.model.collection.indexOf(previousModel);
                            startIndex = this.model.collection.indexOf(currentModel);
                        }

                        for (i = startIndex + 1; i < endIndex + 1; i++) {
                            currModel = this.model.collection.models[i];
                            currColumn = $columns.eq(i);
                            currColumn.addClass("selected-card");
                            currModel.set("isSelected", true);
                        }
                    }
                }

                // 4) Finally, remember lastSelectedModel:
                if (this.$el.hasClass("selected-card")) {
                    this.parent.lastSelectedModel = this.model;
                } else {
                    this.parent.lastSelectedModel = null;
                }
                e.preventDefault();
            },

            onRender: function () {
                var player;
                if (this.currentMedia == "audio") {
                    player = new AudioPlayer({
                        model: this.model,
                        audioMode: "simple",
                        app: this.app
                    });
                    this.$el.find(".player-container").html(player.$el);
                }
            },

            templateHelpers: function () {
                return {
                    dataType: this.currentMedia
                };
            }
        });
        return MediaBrowserChildView;
    });


define('text!apps/gallery/templates/media-list-add.html',[],function () { return '<div class="filter">\n    <form class="modal-search-form">\n        <input type="text" id="searchTerm" value="{{searchTerm}}" placeholder="Filter data and media">\n    \t<button id="toolbar-search"><i class="fa fa-search" aria-hidden="true"></i></button>\n    </form>\n    <button id="card-view-button-modal" class="button-secondary database-view-buttons-modal"><i class="fa fa-th" aria-hidden="true"></i></button>\n    <button id="table-view-button-modal" class="button-secondary database-view-buttons-modal active"><i class="fa fa-bars" aria-hidden="true"></i></button>\n    <button id="media-videos" class="button-secondary fetch-btn" data-value="videos">Videos</button>\n    <button id="media-audio" class="button-secondary fetch-btn" data-value="audio">Audio</button>\n    <button id="media-photos" class="button-secondary fetch-btn" data-value="photos">Photos</button>\n</div>\n\n\n{{#ifequal viewMode "thumb"}}\n<div class="container-wrapper">\n    <div class="container" id="gallery-main">\n        <br>\n        <div id="loading-animation">\n            <i class="fa fa-cog fa-5x fa-spin"></i>\n        </div>\n    </div>\n</div>\n{{/ifequal}}\n\n\n\n{{#ifequal viewMode "table"}}\n<div class="container">\n    <div id="table-view-modal" class="database-views-modal" style="display: block;">\n        <table>\n            <thead>\n                <tr>\n                    <th></th>\n                    <th>Name</th>\n                    <th>Description</th>\n                    <th>Tags</th>\n                    <th>Kind</th>\n                    <th>Author</th>\n                </tr>\n            </thead>\n\n            <tbody id="gallery-main">\n            </tbody>\n        </table>\n        <br>\n        <div id="loading-animation">\n            <i class="fa fa-cog fa-5x fa-spin"></i>\n        </div>\n    </div>\n</div>\n{{/ifequal}}\n';});

define('apps/gallery/views/media_browser',[
    "jquery",
    "underscore",
    "marionette",
    "handlebars",
    "collections/photos",
    "collections/audio",
    "collections/videos",
    "apps/gallery/views/media-browser-child-view",
    "text!../templates/media-list-add.html"],
    function ($, _, Marionette, Handlebars, Photos, Audio, Videos,
            MediaBrowserChildView, ParentTemplate) {
        'use strict';
        var BrowserView = Marionette.CompositeView.extend({
            currentMedia: "photos",
            lastSelectedModel: null,
            viewMode: "thumb",
            childView: MediaBrowserChildView,
            childViewContainer: "#gallery-main",
            searchTerm: null,
            events: {
                "click .fetch-btn" : "fetchMedia",
                'click #card-view-button-modal' : 'displayCards',
                'click #table-view-button-modal' : 'displayTable',
                'click #toolbar-search': 'doSearch'
            },

            initialize: function (opts) {
                _.extend(this, opts);
                Marionette.CompositeView.prototype.initialize.call(this);
                this.template = Handlebars.compile(ParentTemplate);
                this.displayMedia();

                this.listenTo(this.app.vent, 'search-requested', this.doSearch);
                this.listenTo(this.app.vent, 'clear-search', this.clearSearch);
            },

            templateHelpers: function () {
                return {
                    viewMode: this.viewMode,
                    searchTerm: this.searchTerm
                };
            },

            childViewOptions: function () {
                return {
                    app: this.app,
                    currentMedia: this.currentMedia,
                    lastSelectedModel: this.lastSelectedColumn,
                    parent: this,
                    tagName: this.determineChildViewTagName(this.viewMode),
                    className: this.determineChildViewClassName(this.viewMode)
                };
            },

            determineChildViewTagName: function (vm) {
                if (vm == "thumb") {
                    return "div";
                }
                return "tr";
            },

            determineChildViewClassName: function (vm) {
                if (vm == "thumb") {
                    return "column";
                }
                return "table";
            },

            displayCards: function () {
                this.viewMode = "thumb";
                this.render();
                this.hideLoadingMessage();
            },

            displayTable: function () {
                this.viewMode = "table";
                this.render();
                this.hideLoadingMessage();
            },

            hideLoadingMessage: function () {
                this.$el.find("#loading-animation").empty();
            },

            displayMedia: function () {
                if (this.currentMedia == 'photos') {
                    this.collection = new Photos();
                } else if (this.currentMedia == 'audio') {
                    this.collection = new Audio();
                } else {
                    this.collection = new Videos();
                }
                this.collection.setServerQuery("WHERE project = " + this.app.getProjectID());
                this.collection.fetch({reset: true});
                this.listenTo(this.collection, 'reset', this.render);
                this.listenTo(this.collection, 'reset', this.hideLoadingMessage);
            },

            doSearch: function (e) {
                this.searchTerm = this.$el.find("#searchTerm").val();
                this.collection.doSearch(this.searchTerm, this.app.getProjectID());
                e.preventDefault();
            },

            clearSearch: function () {
                this.collection.clearSearch(this.app.getProjectID());
            },

            fetchMedia: function (e) {
                this.currentMedia = $(e.target).attr('data-value');
                this.collection = this.app.dataManager.getCollection(this.currentMedia);
                this.displayMedia();
                e.preventDefault();
            },

            addModels: function () {
                var selectedModels = [];
                this.collection.each(function (model) {
                    if (model.get("isSelected")) {
                        selectedModels.push(model);
                    }
                });
                this.parentModel.trigger('add-models-to-marker', selectedModels);
            }

        });
        return BrowserView;

    });


define('text!apps/gallery/templates/create-media.html',[],function () { return '<div class="alert failure-message ">There were errors when uploading your files. See below.</div>\n<div class="alert warning-message"></div>\n<div id="dropzone">\n    <div id="nothing-here">\n        <h4>Drag files here or</h4>\n        <button type="button" class="button-tertiary" id="upload-button">\n            Select files from your computer\n        </button>        \n    </div>\n</div>\n<input id="fileupload" type="file" name="media_file" multiple="">\n';});


define('text!apps/gallery/templates/new-media.html',[],function () { return '{{#ifequal mode "begin"}}\n    <div class="file-container">\n        <div class="img-polaroid thumbnail">\n            <div class="img-container">\n                <img class="preview" src="{{ imageSerial }}" />\n            </div>\n            <p>\n                {{ file_name }}<br>\n                {{ file_size }}<br>\n            </p>\n        </div>\n        <div class="progress">\n            <div class="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" style="width: 10%;"></div>\n        </div>\n    </div>\n{{/ifequal}}\n\n{{#ifequal mode "end"}}\n    <div class="file-container">\n        <div class="img-polaroid thumbnail">\n            <div class="img-container">\n                <div class="badge success-icon">\n                    <i class="fa fa-check"></i>\n                </div>\n                <img class="preview" src="{{ imageSerial }}" />\n            </div>\n            <p>\n                {{ file_name }}<br>\n                {{ file_size }}<br>\n                <a href="#" class="delete">delete</a>\n            </p>\n        </div>\n    </div>\n{{/ifequal}}\n\n{{#ifequal mode "error"}}\n    <div class="file-container">\n        <div class="img-polaroid thumbnail">\n            <div class="img-container">\n                <div class="failure-icon">\n                    <i class="fa fa-exclamation"></i>\n                </div>\n                <img class="preview" src="{{ imageSerial }}" />\n            </div>\n           <div class="error-holder">{{ errorMessage }}</div>\n        </div>\n    </div>\n{{/ifequal}}';});

(function(a){"use strict";var b=function(a,c,d){var e=document.createElement("img"),f,g;return e.onerror=c,e.onload=function(){g&&b.revokeObjectURL(g),c(b.scale(e,d))},window.Blob&&a instanceof Blob||window.File&&a instanceof File?f=g=b.createObjectURL(a):f=a,f?(e.src=f,e):b.readFile(a,function(a){e.src=a})},c=window.createObjectURL&&window||window.URL&&URL||window.webkitURL&&webkitURL;b.scale=function(a,b){b=b||{};var c=document.createElement("canvas"),d=Math.max((b.minWidth||a.width)/a.width,(b.minHeight||a.height)/a.height);return d>1&&(a.width=parseInt(a.width*d,10),a.height=parseInt(a.height*d,10)),d=Math.min((b.maxWidth||a.width)/a.width,(b.maxHeight||a.height)/a.height),d<1&&(a.width=parseInt(a.width*d,10),a.height=parseInt(a.height*d,10)),!b.canvas||!c.getContext?a:(c.width=a.width,c.height=a.height,c.getContext("2d").drawImage(a,0,0,a.width,a.height),c)},b.createObjectURL=function(a){return c?c.createObjectURL(a):!1},b.revokeObjectURL=function(a){return c?c.revokeObjectURL(a):!1},b.readFile=function(a,b){if(window.FileReader&&FileReader.prototype.readAsDataURL){var c=new FileReader;return c.onload=function(a){b(a.target.result)},c.readAsDataURL(a),c}return!1},typeof define!="undefined"&&define.amd?define('load-image',[],function(){return b}):a.loadImage=b})(this);
(function(a){"use strict";var b=window.MozBlobBuilder||window.WebKitBlobBuilder||window.BlobBuilder,c=/^image\/(jpeg|png)$/,d=function(a,e,f){f=f||{};if(a.toBlob)return a.toBlob(e,f.type),!0;if(a.mozGetAsFile){var g=f.name;return e(a.mozGetAsFile(c.test(f.type)&&g||(g&&g.replace(/\..+$/,"")||"blob")+".png",f.type)),!0}return a.toDataURL&&b&&window.atob&&window.ArrayBuffer&&window.Uint8Array?(e(d.dataURItoBlob(a.toDataURL(f.type))),!0):!1};d.dataURItoBlob=function(a){var c,d,e,f,g,h;a.split(",")[0].indexOf("base64")>=0?c=atob(a.split(",")[1]):c=decodeURIComponent(a.split(",")[1]),d=new ArrayBuffer(c.length),e=new Uint8Array(d);for(f=0;f<c.length;f+=1)e[f]=c.charCodeAt(f);return g=new b,g.append(d),h=a.split(",")[0].split(":")[1].split(";")[0],g.getBlob(h)},typeof define!="undefined"&&define.amd?define('canvas-to-blob',[],function(){return d}):a.canvasToBlob=d})(this);
/*
 * jQuery UI Widget 1.10.3+amd
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/jQuery.widget/
 */

(function (factory) {
    if (typeof define === "function" && define.amd) {
        // Register as an anonymous AMD module:
        define('jquery.ui.widget',["jquery"], factory);
    } else {
        // Browser globals:
        factory(jQuery);
    }
}(function( $, undefined ) {

var uuid = 0,
	slice = Array.prototype.slice,
	_cleanData = $.cleanData;
$.cleanData = function( elems ) {
	for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
		try {
			$( elem ).triggerHandler( "remove" );
		// http://bugs.jquery.com/ticket/8235
		} catch( e ) {}
	}
	_cleanData( elems );
};

$.widget = function( name, base, prototype ) {
	var fullName, existingConstructor, constructor, basePrototype,
		// proxiedPrototype allows the provided prototype to remain unmodified
		// so that it can be used as a mixin for multiple widgets (#8876)
		proxiedPrototype = {},
		namespace = name.split( "." )[ 0 ];

	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
		return !!$.data( elem, fullName );
	};

	$[ namespace ] = $[ namespace ] || {};
	existingConstructor = $[ namespace ][ name ];
	constructor = $[ namespace ][ name ] = function( options, element ) {
		// allow instantiation without "new" keyword
		if ( !this._createWidget ) {
			return new constructor( options, element );
		}

		// allow instantiation without initializing for simple inheritance
		// must use "new" keyword (the code above always passes args)
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};
	// extend with the existing constructor to carry over any static properties
	$.extend( constructor, existingConstructor, {
		version: prototype.version,
		// copy the object used to create the prototype in case we need to
		// redefine the widget later
		_proto: $.extend( {}, prototype ),
		// track widgets that inherit from this widget in case this widget is
		// redefined after a widget inherits from it
		_childConstructors: []
	});

	basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	basePrototype.options = $.widget.extend( {}, basePrototype.options );
	$.each( prototype, function( prop, value ) {
		if ( !$.isFunction( value ) ) {
			proxiedPrototype[ prop ] = value;
			return;
		}
		proxiedPrototype[ prop ] = (function() {
			var _super = function() {
					return base.prototype[ prop ].apply( this, arguments );
				},
				_superApply = function( args ) {
					return base.prototype[ prop ].apply( this, args );
				};
			return function() {
				var __super = this._super,
					__superApply = this._superApply,
					returnValue;

				this._super = _super;
				this._superApply = _superApply;

				returnValue = value.apply( this, arguments );

				this._super = __super;
				this._superApply = __superApply;

				return returnValue;
			};
		})();
	});
	constructor.prototype = $.widget.extend( basePrototype, {
		// TODO: remove support for widgetEventPrefix
		// always use the name + a colon as the prefix, e.g., draggable:start
		// don't prefix for widgets that aren't DOM-based
		widgetEventPrefix: existingConstructor ? basePrototype.widgetEventPrefix : name
	}, proxiedPrototype, {
		constructor: constructor,
		namespace: namespace,
		widgetName: name,
		widgetFullName: fullName
	});

	// If this widget is being redefined then we need to find all widgets that
	// are inheriting from it and redefine all of them so that they inherit from
	// the new version of this widget. We're essentially trying to replace one
	// level in the prototype chain.
	if ( existingConstructor ) {
		$.each( existingConstructor._childConstructors, function( i, child ) {
			var childPrototype = child.prototype;

			// redefine the child widget using the same prototype that was
			// originally used, but inherit from the new version of the base
			$.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
		});
		// remove the list of existing child constructors from the old constructor
		// so the old child constructors can be garbage collected
		delete existingConstructor._childConstructors;
	} else {
		base._childConstructors.push( constructor );
	}

	$.widget.bridge( name, constructor );
};

$.widget.extend = function( target ) {
	var input = slice.call( arguments, 1 ),
		inputIndex = 0,
		inputLength = input.length,
		key,
		value;
	for ( ; inputIndex < inputLength; inputIndex++ ) {
		for ( key in input[ inputIndex ] ) {
			value = input[ inputIndex ][ key ];
			if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
				// Clone objects
				if ( $.isPlainObject( value ) ) {
					target[ key ] = $.isPlainObject( target[ key ] ) ?
						$.widget.extend( {}, target[ key ], value ) :
						// Don't extend strings, arrays, etc. with objects
						$.widget.extend( {}, value );
				// Copy everything else by reference
				} else {
					target[ key ] = value;
				}
			}
		}
	}
	return target;
};

$.widget.bridge = function( name, object ) {
	var fullName = object.prototype.widgetFullName || name;
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = slice.call( arguments, 1 ),
			returnValue = this;

		// allow multiple hashes to be passed on init
		options = !isMethodCall && args.length ?
			$.widget.extend.apply( null, [ options ].concat(args) ) :
			options;

		if ( isMethodCall ) {
			this.each(function() {
				var methodValue,
					instance = $.data( this, fullName );
				if ( !instance ) {
					return $.error( "cannot call methods on " + name + " prior to initialization; " +
						"attempted to call method '" + options + "'" );
				}
				if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
					return $.error( "no such method '" + options + "' for " + name + " widget instance" );
				}
				methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue && methodValue.jquery ?
						returnValue.pushStack( methodValue.get() ) :
						methodValue;
					return false;
				}
			});
		} else {
			this.each(function() {
				var instance = $.data( this, fullName );
				if ( instance ) {
					instance.option( options || {} )._init();
				} else {
					$.data( this, fullName, new object( options, this ) );
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	defaultElement: "<div>",
	options: {
		disabled: false,

		// callbacks
		create: null
	},
	_createWidget: function( options, element ) {
		element = $( element || this.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.uuid = uuid++;
		this.eventNamespace = "." + this.widgetName + this.uuid;
		this.options = $.widget.extend( {},
			this.options,
			this._getCreateOptions(),
			options );

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();

		if ( element !== this ) {
			$.data( element, this.widgetFullName, this );
			this._on( true, this.element, {
				remove: function( event ) {
					if ( event.target === element ) {
						this.destroy();
					}
				}
			});
			this.document = $( element.style ?
				// element within the document
				element.ownerDocument :
				// element is window or document
				element.document || element );
			this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
		}

		this._create();
		this._trigger( "create", null, this._getCreateEventData() );
		this._init();
	},
	_getCreateOptions: $.noop,
	_getCreateEventData: $.noop,
	_create: $.noop,
	_init: $.noop,

	destroy: function() {
		this._destroy();
		// we can probably remove the unbind calls in 2.0
		// all event bindings should go through this._on()
		this.element
			.unbind( this.eventNamespace )
			// 1.9 BC for #7810
			// TODO remove dual storage
			.removeData( this.widgetName )
			.removeData( this.widgetFullName )
			// support: jquery <1.6.3
			// http://bugs.jquery.com/ticket/9413
			.removeData( $.camelCase( this.widgetFullName ) );
		this.widget()
			.unbind( this.eventNamespace )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetFullName + "-disabled " +
				"ui-state-disabled" );

		// clean up events and states
		this.bindings.unbind( this.eventNamespace );
		this.hoverable.removeClass( "ui-state-hover" );
		this.focusable.removeClass( "ui-state-focus" );
	},
	_destroy: $.noop,

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key,
			parts,
			curOption,
			i;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.widget.extend( {}, this.options );
		}

		if ( typeof key === "string" ) {
			// handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
			options = {};
			parts = key.split( "." );
			key = parts.shift();
			if ( parts.length ) {
				curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
				for ( i = 0; i < parts.length - 1; i++ ) {
					curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
					curOption = curOption[ parts[ i ] ];
				}
				key = parts.pop();
				if ( value === undefined ) {
					return curOption[ key ] === undefined ? null : curOption[ key ];
				}
				curOption[ key ] = value;
			} else {
				if ( value === undefined ) {
					return this.options[ key ] === undefined ? null : this.options[ key ];
				}
				options[ key ] = value;
			}
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var key;

		for ( key in options ) {
			this._setOption( key, options[ key ] );
		}

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				.toggleClass( this.widgetFullName + "-disabled ui-state-disabled", !!value )
				.attr( "aria-disabled", value );
			this.hoverable.removeClass( "ui-state-hover" );
			this.focusable.removeClass( "ui-state-focus" );
		}

		return this;
	},

	enable: function() {
		return this._setOption( "disabled", false );
	},
	disable: function() {
		return this._setOption( "disabled", true );
	},

	_on: function( suppressDisabledCheck, element, handlers ) {
		var delegateElement,
			instance = this;

		// no suppressDisabledCheck flag, shuffle arguments
		if ( typeof suppressDisabledCheck !== "boolean" ) {
			handlers = element;
			element = suppressDisabledCheck;
			suppressDisabledCheck = false;
		}

		// no element argument, shuffle and use this.element
		if ( !handlers ) {
			handlers = element;
			element = this.element;
			delegateElement = this.widget();
		} else {
			// accept selectors, DOM elements
			element = delegateElement = $( element );
			this.bindings = this.bindings.add( element );
		}

		$.each( handlers, function( event, handler ) {
			function handlerProxy() {
				// allow widgets to customize the disabled handling
				// - disabled as an array instead of boolean
				// - disabled class as method for disabling individual parts
				if ( !suppressDisabledCheck &&
						( instance.options.disabled === true ||
							$( this ).hasClass( "ui-state-disabled" ) ) ) {
					return;
				}
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}

			// copy the guid so direct unbinding works
			if ( typeof handler !== "string" ) {
				handlerProxy.guid = handler.guid =
					handler.guid || handlerProxy.guid || $.guid++;
			}

			var match = event.match( /^(\w+)\s*(.*)$/ ),
				eventName = match[1] + instance.eventNamespace,
				selector = match[2];
			if ( selector ) {
				delegateElement.delegate( selector, eventName, handlerProxy );
			} else {
				element.bind( eventName, handlerProxy );
			}
		});
	},

	_off: function( element, eventName ) {
		eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) + this.eventNamespace;
		element.unbind( eventName ).undelegate( eventName );
	},

	_delay: function( handler, delay ) {
		function handlerProxy() {
			return ( typeof handler === "string" ? instance[ handler ] : handler )
				.apply( instance, arguments );
		}
		var instance = this;
		return setTimeout( handlerProxy, delay || 0 );
	},

	_hoverable: function( element ) {
		this.hoverable = this.hoverable.add( element );
		this._on( element, {
			mouseenter: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-hover" );
			},
			mouseleave: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-hover" );
			}
		});
	},

	_focusable: function( element ) {
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-focus" );
			},
			focusout: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-focus" );
			}
		});
	},

	_trigger: function( type, event, data ) {
		var prop, orig,
			callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		// the original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		return !( $.isFunction( callback ) &&
			callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
			event.isDefaultPrevented() );
	}
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
	$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
		if ( typeof options === "string" ) {
			options = { effect: options };
		}
		var hasOptions,
			effectName = !options ?
				method :
				options === true || typeof options === "number" ?
					defaultEffect :
					options.effect || defaultEffect;
		options = options || {};
		if ( typeof options === "number" ) {
			options = { duration: options };
		}
		hasOptions = !$.isEmptyObject( options );
		options.complete = callback;
		if ( options.delay ) {
			element.delay( options.delay );
		}
		if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ effectName ] ) {
			element[ effectName ]( options.duration, options.easing, callback );
		} else {
			element.queue(function( next ) {
				$( this )[ method ]();
				if ( callback ) {
					callback.call( element[ 0 ] );
				}
				next();
			});
		}
	};
});

}));

/*
 * jQuery File Upload Plugin 5.10.0
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*jslint nomen: true, unparam: true, regexp: true */
/*global define, window, document, Blob, FormData, location */

(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // Register as an anonymous AMD module:
        define('jquery.fileupload',[
            'jquery',
            'jquery.ui.widget'
        ], factory);
    } else {
        // Browser globals:
        factory(window.jQuery);
    }
}(function ($) {
    'use strict';

    // The FileReader API is not actually used, but works as feature detection,
    // as e.g. Safari supports XHR file uploads via the FormData API,
    // but not non-multipart XHR file uploads:
    $.support.xhrFileUpload = !!(window.XMLHttpRequestUpload && window.FileReader);
    $.support.xhrFormDataFileUpload = !!window.FormData;

    // The fileupload widget listens for change events on file input fields defined
    // via fileInput setting and paste or drop events of the given dropZone.
    // In addition to the default jQuery Widget methods, the fileupload widget
    // exposes the "add" and "send" methods, to add or directly send files using
    // the fileupload API.
    // By default, files added via file input selection, paste, drag & drop or
    // "add" method are uploaded immediately, but it is possible to override
    // the "add" callback option to queue file uploads.
    $.widget('blueimp.fileupload', {

        options: {
            // The namespace used for event handler binding on the dropZone and
            // fileInput collections.
            // If not set, the name of the widget ("fileupload") is used.
            namespace: undefined,
            // The drop target collection, by the default the complete document.
            // Set to null or an empty collection to disable drag & drop support:
            dropZone: $(document),
            // The file input field collection, that is listened for change events.
            // If undefined, it is set to the file input fields inside
            // of the widget element on plugin initialization.
            // Set to null or an empty collection to disable the change listener.
            fileInput: undefined,
            // By default, the file input field is replaced with a clone after
            // each input field change event. This is required for iframe transport
            // queues and allows change events to be fired for the same file
            // selection, but can be disabled by setting the following option to false:
            replaceFileInput: true,
            // The parameter name for the file form data (the request argument name).
            // If undefined or empty, the name property of the file input field is
            // used, or "files[]" if the file input name property is also empty,
            // can be a string or an array of strings:
            paramName: undefined,
            // By default, each file of a selection is uploaded using an individual
            // request for XHR type uploads. Set to false to upload file
            // selections in one request each:
            singleFileUploads: true,
            // To limit the number of files uploaded with one XHR request,
            // set the following option to an integer greater than 0:
            limitMultiFileUploads: undefined,
            // Set the following option to true to issue all file upload requests
            // in a sequential order:
            sequentialUploads: false,
            // To limit the number of concurrent uploads,
            // set the following option to an integer greater than 0:
            limitConcurrentUploads: undefined,
            // Set the following option to true to force iframe transport uploads:
            forceIframeTransport: false,
            // Set the following option to the location of a redirect url on the
            // origin server, for cross-domain iframe transport uploads:
            redirect: undefined,
            // The parameter name for the redirect url, sent as part of the form
            // data and set to 'redirect' if this option is empty:
            redirectParamName: undefined,
            // Set the following option to the location of a postMessage window,
            // to enable postMessage transport uploads:
            postMessage: undefined,
            // By default, XHR file uploads are sent as multipart/form-data.
            // The iframe transport is always using multipart/form-data.
            // Set to false to enable non-multipart XHR uploads:
            multipart: true,
            // To upload large files in smaller chunks, set the following option
            // to a preferred maximum chunk size. If set to 0, null or undefined,
            // or the browser does not support the required Blob API, files will
            // be uploaded as a whole.
            maxChunkSize: undefined,
            // When a non-multipart upload or a chunked multipart upload has been
            // aborted, this option can be used to resume the upload by setting
            // it to the size of the already uploaded bytes. This option is most
            // useful when modifying the options object inside of the "add" or
            // "send" callbacks, as the options are cloned for each file upload.
            uploadedBytes: undefined,
            // By default, failed (abort or error) file uploads are removed from the
            // global progress calculation. Set the following option to false to
            // prevent recalculating the global progress data:
            recalculateProgress: true,

            // Additional form data to be sent along with the file uploads can be set
            // using this option, which accepts an array of objects with name and
            // value properties, a function returning such an array, a FormData
            // object (for XHR file uploads), or a simple object.
            // The form of the first fileInput is given as parameter to the function:
            formData: function (form) {
                return form.serializeArray();
            },

            // The add callback is invoked as soon as files are added to the fileupload
            // widget (via file input selection, drag & drop, paste or add API call).
            // If the singleFileUploads option is enabled, this callback will be
            // called once for each file in the selection for XHR file uplaods, else
            // once for each file selection.
            // The upload starts when the submit method is invoked on the data parameter.
            // The data object contains a files property holding the added files
            // and allows to override plugin options as well as define ajax settings.
            // Listeners for this callback can also be bound the following way:
            // .bind('fileuploadadd', func);
            // data.submit() returns a Promise object and allows to attach additional
            // handlers using jQuery's Deferred callbacks:
            // data.submit().done(func).fail(func).always(func);
            add: function (e, data) {
                data.submit();
            },

            // Other callbacks:
            // Callback for the submit event of each file upload:
            // submit: function (e, data) {}, // .bind('fileuploadsubmit', func);
            // Callback for the start of each file upload request:
            // send: function (e, data) {}, // .bind('fileuploadsend', func);
            // Callback for successful uploads:
            // done: function (e, data) {}, // .bind('fileuploaddone', func);
            // Callback for failed (abort or error) uploads:
            // fail: function (e, data) {}, // .bind('fileuploadfail', func);
            // Callback for completed (success, abort or error) requests:
            // always: function (e, data) {}, // .bind('fileuploadalways', func);
            // Callback for upload progress events:
            // progress: function (e, data) {}, // .bind('fileuploadprogress', func);
            // Callback for global upload progress events:
            // progressall: function (e, data) {}, // .bind('fileuploadprogressall', func);
            // Callback for uploads start, equivalent to the global ajaxStart event:
            // start: function (e) {}, // .bind('fileuploadstart', func);
            // Callback for uploads stop, equivalent to the global ajaxStop event:
            // stop: function (e) {}, // .bind('fileuploadstop', func);
            // Callback for change events of the fileInput collection:
            // change: function (e, data) {}, // .bind('fileuploadchange', func);
            // Callback for paste events to the dropZone collection:
            // paste: function (e, data) {}, // .bind('fileuploadpaste', func);
            // Callback for drop events of the dropZone collection:
            // drop: function (e, data) {}, // .bind('fileuploaddrop', func);
            // Callback for dragover events of the dropZone collection:
            // dragover: function (e) {}, // .bind('fileuploaddragover', func);

            // The plugin options are used as settings object for the ajax calls.
            // The following are jQuery ajax settings required for the file uploads:
            processData: false,
            contentType: false,
            cache: false
        },

        // A list of options that require a refresh after assigning a new value:
        _refreshOptionsList: [
            'namespace',
            'dropZone',
            'fileInput',
            'multipart',
            'forceIframeTransport'
        ],

        _isXHRUpload: function (options) {
            return !options.forceIframeTransport &&
                ((!options.multipart && $.support.xhrFileUpload) ||
                $.support.xhrFormDataFileUpload);
        },

        _getFormData: function (options) {
            var formData;
            if (typeof options.formData === 'function') {
                return options.formData(options.form);
            } else if ($.isArray(options.formData)) {
                return options.formData;
            } else if (options.formData) {
                formData = [];
                $.each(options.formData, function (name, value) {
                    formData.push({name: name, value: value});
                });
                return formData;
            }
            return [];
        },

        _getTotal: function (files) {
            var total = 0;
            $.each(files, function (index, file) {
                total += file.size || 1;
            });
            return total;
        },

        _onProgress: function (e, data) {
            if (e.lengthComputable) {
                var total = data.total || this._getTotal(data.files),
                    loaded = parseInt(
                        e.loaded / e.total * (data.chunkSize || total),
                        10
                    ) + (data.uploadedBytes || 0);
                this._loaded += loaded - (data.loaded || data.uploadedBytes || 0);
                data.lengthComputable = true;
                data.loaded = loaded;
                data.total = total;
                // Trigger a custom progress event with a total data property set
                // to the file size(s) of the current upload and a loaded data
                // property calculated accordingly:
                this._trigger('progress', e, data);
                // Trigger a global progress event for all current file uploads,
                // including ajax calls queued for sequential file uploads:
                this._trigger('progressall', e, {
                    lengthComputable: true,
                    loaded: this._loaded,
                    total: this._total
                });
            }
        },

        _initProgressListener: function (options) {
            var that = this,
                xhr = options.xhr ? options.xhr() : $.ajaxSettings.xhr();
            // Accesss to the native XHR object is required to add event listeners
            // for the upload progress event:
            if (xhr.upload) {
                $(xhr.upload).bind('progress', function (e) {
                    var oe = e.originalEvent;
                    // Make sure the progress event properties get copied over:
                    e.lengthComputable = oe.lengthComputable;
                    e.loaded = oe.loaded;
                    e.total = oe.total;
                    that._onProgress(e, options);
                });
                options.xhr = function () {
                    return xhr;
                };
            }
        },

        _initXHRData: function (options) {
            var formData,
                file = options.files[0],
                // Ignore non-multipart setting if not supported:
                multipart = options.multipart || !$.support.xhrFileUpload,
                paramName = options.paramName[0];
            if (!multipart || options.blob) {
                // For non-multipart uploads and chunked uploads,
                // file meta data is not part of the request body,
                // so we transmit this data as part of the HTTP headers.
                // For cross domain requests, these headers must be allowed
                // via Access-Control-Allow-Headers or removed using
                // the beforeSend callback:
                options.headers = $.extend(options.headers, {
                    'X-File-Name': file.name,
                    'X-File-Type': file.type,
                    'X-File-Size': file.size
                });
                if (!options.blob) {
                    // Non-chunked non-multipart upload:
                    options.contentType = file.type;
                    options.data = file;
                } else if (!multipart) {
                    // Chunked non-multipart upload:
                    options.contentType = 'application/octet-stream';
                    options.data = options.blob;
                }
            }
            if (multipart && $.support.xhrFormDataFileUpload) {
                if (options.postMessage) {
                    // window.postMessage does not allow sending FormData
                    // objects, so we just add the File/Blob objects to
                    // the formData array and let the postMessage window
                    // create the FormData object out of this array:
                    formData = this._getFormData(options);
                    if (options.blob) {
                        formData.push({
                            name: paramName,
                            value: options.blob
                        });
                    } else {
                        $.each(options.files, function (index, file) {
                            formData.push({
                                name: options.paramName[index] || paramName,
                                value: file
                            });
                        });
                    }
                } else {
                    if (options.formData instanceof FormData) {
                        formData = options.formData;
                    } else {
                        formData = new FormData();
                        $.each(this._getFormData(options), function (index, field) {
                            formData.append(field.name, field.value);
                        });
                    }
                    if (options.blob) {
                        formData.append(paramName, options.blob, file.name);
                    } else {
                        $.each(options.files, function (index, file) {
                            // File objects are also Blob instances.
                            // This check allows the tests to run with
                            // dummy objects:
                            if (file instanceof Blob) {
                                formData.append(
                                    options.paramName[index] || paramName,
                                    file,
                                    file.name
                                );
                            }
                        });
                    }
                }
                options.data = formData;
            }
            // Blob reference is not needed anymore, free memory:
            options.blob = null;
        },

        _initIframeSettings: function (options) {
            // Setting the dataType to iframe enables the iframe transport:
            options.dataType = 'iframe ' + (options.dataType || '');
            // The iframe transport accepts a serialized array as form data:
            options.formData = this._getFormData(options);
            // Add redirect url to form data on cross-domain uploads:
            if (options.redirect && $('<a></a>').prop('href', options.url)
                    .prop('host') !== location.host) {
                options.formData.push({
                    name: options.redirectParamName || 'redirect',
                    value: options.redirect
                });
            }
        },

        _initDataSettings: function (options) {
            if (this._isXHRUpload(options)) {
                if (!this._chunkedUpload(options, true)) {
                    if (!options.data) {
                        this._initXHRData(options);
                    }
                    this._initProgressListener(options);
                }
                if (options.postMessage) {
                    // Setting the dataType to postmessage enables the
                    // postMessage transport:
                    options.dataType = 'postmessage ' + (options.dataType || '');
                }
            } else {
                this._initIframeSettings(options, 'iframe');
            }
        },

        _getParamName: function (options) {
            var fileInput = $(options.fileInput),
                paramName = options.paramName;
            if (!paramName) {
                paramName = [];
                fileInput.each(function () {
                    var input = $(this),
                        name = input.prop('name') || 'files[]',
                        i = (input.prop('files') || [1]).length;
                    while (i) {
                        paramName.push(name);
                        i -= 1;
                    }
                });
                if (!paramName.length) {
                    paramName = [fileInput.prop('name') || 'files[]'];
                }
            } else if (!$.isArray(paramName)) {
                paramName = [paramName];
            }
            return paramName;
        },

        _initFormSettings: function (options) {
            // Retrieve missing options from the input field and the
            // associated form, if available:
            if (!options.form || !options.form.length) {
                options.form = $(options.fileInput.prop('form'));
            }
            options.paramName = this._getParamName(options);
            if (!options.url) {
                options.url = options.form.prop('action') || location.href;
            }
            // The HTTP request method must be "POST" or "PUT":
            options.type = (options.type || options.form.prop('method') || '')
                .toUpperCase();
            if (options.type !== 'POST' && options.type !== 'PUT') {
                options.type = 'POST';
            }
        },

        _getAJAXSettings: function (data) {
            var options = $.extend({}, this.options, data);
            this._initFormSettings(options);
            this._initDataSettings(options);
            return options;
        },

        // Maps jqXHR callbacks to the equivalent
        // methods of the given Promise object:
        _enhancePromise: function (promise) {
            promise.success = promise.done;
            promise.error = promise.fail;
            promise.complete = promise.always;
            return promise;
        },

        // Creates and returns a Promise object enhanced with
        // the jqXHR methods abort, success, error and complete:
        _getXHRPromise: function (resolveOrReject, context, args) {
            var dfd = $.Deferred(),
                promise = dfd.promise();
            context = context || this.options.context || promise;
            if (resolveOrReject === true) {
                dfd.resolveWith(context, args);
            } else if (resolveOrReject === false) {
                dfd.rejectWith(context, args);
            }
            promise.abort = dfd.promise;
            return this._enhancePromise(promise);
        },

        // Uploads a file in multiple, sequential requests
        // by splitting the file up in multiple blob chunks.
        // If the second parameter is true, only tests if the file
        // should be uploaded in chunks, but does not invoke any
        // upload requests:
        _chunkedUpload: function (options, testOnly) {
            var that = this,
                file = options.files[0],
                fs = file.size,
                ub = options.uploadedBytes = options.uploadedBytes || 0,
                mcs = options.maxChunkSize || fs,
                // Use the Blob methods with the slice implementation
                // according to the W3C Blob API specification:
                slice = file.webkitSlice || file.mozSlice || file.slice,
                upload,
                n,
                jqXHR,
                pipe;
            if (!(this._isXHRUpload(options) && slice && (ub || mcs < fs)) ||
                    options.data) {
                return false;
            }
            if (testOnly) {
                return true;
            }
            if (ub >= fs) {
                file.error = 'uploadedBytes';
                return this._getXHRPromise(
                    false,
                    options.context,
                    [null, 'error', file.error]
                );
            }
            // n is the number of blobs to upload,
            // calculated via filesize, uploaded bytes and max chunk size:
            n = Math.ceil((fs - ub) / mcs);
            // The chunk upload method accepting the chunk number as parameter:
            upload = function (i) {
                if (!i) {
                    return that._getXHRPromise(true, options.context);
                }
                // Upload the blobs in sequential order:
                return upload(i -= 1).pipe(function () {
                    // Clone the options object for each chunk upload:
                    var o = $.extend({}, options);
                    o.blob = slice.call(
                        file,
                        ub + i * mcs,
                        ub + (i + 1) * mcs
                    );
                    // Store the current chunk size, as the blob itself
                    // will be dereferenced after data processing:
                    o.chunkSize = o.blob.size;
                    // Process the upload data (the blob and potential form data):
                    that._initXHRData(o);
                    // Add progress listeners for this chunk upload:
                    that._initProgressListener(o);
                    jqXHR = ($.ajax(o) || that._getXHRPromise(false, o.context))
                        .done(function () {
                            // Create a progress event if upload is done and
                            // no progress event has been invoked for this chunk:
                            if (!o.loaded) {
                                that._onProgress($.Event('progress', {
                                    lengthComputable: true,
                                    loaded: o.chunkSize,
                                    total: o.chunkSize
                                }), o);
                            }
                            options.uploadedBytes = o.uploadedBytes +=
                                o.chunkSize;
                        });
                    return jqXHR;
                });
            };
            // Return the piped Promise object, enhanced with an abort method,
            // which is delegated to the jqXHR object of the current upload,
            // and jqXHR callbacks mapped to the equivalent Promise methods:
            pipe = upload(n);
            pipe.abort = function () {
                return jqXHR.abort();
            };
            return this._enhancePromise(pipe);
        },

        _beforeSend: function (e, data) {
            if (this._active === 0) {
                // the start callback is triggered when an upload starts
                // and no other uploads are currently running,
                // equivalent to the global ajaxStart event:
                this._trigger('start');
            }
            this._active += 1;
            // Initialize the global progress values:
            this._loaded += data.uploadedBytes || 0;
            this._total += this._getTotal(data.files);
        },

        _onDone: function (result, textStatus, jqXHR, options) {
            if (!this._isXHRUpload(options)) {
                // Create a progress event for each iframe load:
                this._onProgress($.Event('progress', {
                    lengthComputable: true,
                    loaded: 1,
                    total: 1
                }), options);
            }
            options.result = result;
            options.textStatus = textStatus;
            options.jqXHR = jqXHR;
            this._trigger('done', null, options);
        },

        _onFail: function (jqXHR, textStatus, errorThrown, options) {
            options.jqXHR = jqXHR;
            options.textStatus = textStatus;
            options.errorThrown = errorThrown;
            this._trigger('fail', null, options);
            if (options.recalculateProgress) {
                // Remove the failed (error or abort) file upload from
                // the global progress calculation:
                this._loaded -= options.loaded || options.uploadedBytes || 0;
                this._total -= options.total || this._getTotal(options.files);
            }
        },

        _onAlways: function (jqXHRorResult, textStatus, jqXHRorError, options) {
            this._active -= 1;
            options.textStatus = textStatus;
            if (jqXHRorError && jqXHRorError.always) {
                options.jqXHR = jqXHRorError;
                options.result = jqXHRorResult;
            } else {
                options.jqXHR = jqXHRorResult;
                options.errorThrown = jqXHRorError;
            }
            this._trigger('always', null, options);
            if (this._active === 0) {
                // The stop callback is triggered when all uploads have
                // been completed, equivalent to the global ajaxStop event:
                this._trigger('stop');
                // Reset the global progress values:
                this._loaded = this._total = 0;
            }
        },

        _onSend: function (e, data) {
            var that = this,
                jqXHR,
                slot,
                pipe,
                options = that._getAJAXSettings(data),
                send = function (resolve, args) {
                    that._sending += 1;
                    jqXHR = jqXHR || (
                        (resolve !== false &&
                        that._trigger('send', e, options) !== false &&
                        (that._chunkedUpload(options) || $.ajax(options))) ||
                        that._getXHRPromise(false, options.context, args)
                    ).done(function (result, textStatus, jqXHR) {
                        that._onDone(result, textStatus, jqXHR, options);
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        that._onFail(jqXHR, textStatus, errorThrown, options);
                    }).always(function (jqXHRorResult, textStatus, jqXHRorError) {
                        that._sending -= 1;
                        that._onAlways(
                            jqXHRorResult,
                            textStatus,
                            jqXHRorError,
                            options
                        );
                        if (options.limitConcurrentUploads &&
                                options.limitConcurrentUploads > that._sending) {
                            // Start the next queued upload,
                            // that has not been aborted:
                            var nextSlot = that._slots.shift();
                            while (nextSlot) {
                                if (!nextSlot.isRejected()) {
                                    nextSlot.resolve();
                                    break;
                                }
                                nextSlot = that._slots.shift();
                            }
                        }
                    });
                    return jqXHR;
                };
            this._beforeSend(e, options);
            if (this.options.sequentialUploads ||
                    (this.options.limitConcurrentUploads &&
                    this.options.limitConcurrentUploads <= this._sending)) {
                if (this.options.limitConcurrentUploads > 1) {
                    slot = $.Deferred();
                    this._slots.push(slot);
                    pipe = slot.pipe(send);
                } else {
                    pipe = (this._sequence = this._sequence.pipe(send, send));
                }
                // Return the piped Promise object, enhanced with an abort method,
                // which is delegated to the jqXHR object of the current upload,
                // and jqXHR callbacks mapped to the equivalent Promise methods:
                pipe.abort = function () {
                    var args = [undefined, 'abort', 'abort'];
                    if (!jqXHR) {
                        if (slot) {
                            slot.rejectWith(args);
                        }
                        return send(false, args);
                    }
                    return jqXHR.abort();
                };
                return this._enhancePromise(pipe);
            }
            return send();
        },

        _onAdd: function (e, data) {
            var that = this,
                result = true,
                options = $.extend({}, this.options, data),
                limit = options.limitMultiFileUploads,
                paramName = this._getParamName(options),
                paramNameSet,
                paramNameSlice,
                fileSet,
                i;
            if (!(options.singleFileUploads || limit) ||
                    !this._isXHRUpload(options)) {
                fileSet = [data.files];
                paramNameSet = [paramName];
            } else if (!options.singleFileUploads && limit) {
                fileSet = [];
                paramNameSet = [];
                for (i = 0; i < data.files.length; i += limit) {
                    fileSet.push(data.files.slice(i, i + limit));
                    paramNameSlice = paramName.slice(i, i + limit);
                    if (!paramNameSlice.length) {
                        paramNameSlice = paramName;
                    }
                    paramNameSet.push(paramNameSlice);
                }
            } else {
                paramNameSet = paramName;
            }
            data.originalFiles = data.files;
            $.each(fileSet || data.files, function (index, element) {
                var newData = $.extend({}, data);
                newData.files = fileSet ? element : [element];
                newData.paramName = paramNameSet[index];
                newData.submit = function () {
                    newData.jqXHR = this.jqXHR =
                        (that._trigger('submit', e, this) !== false) &&
                        that._onSend(e, this);
                    return this.jqXHR;
                };
                return (result = that._trigger('add', e, newData));
            });
            return result;
        },

        // File Normalization for Gecko 1.9.1 (Firefox 3.5) support:
        _normalizeFile: function (index, file) {
            if (file.name === undefined && file.size === undefined) {
                file.name = file.fileName;
                file.size = file.fileSize;
            }
        },

        _replaceFileInput: function (input) {
            var inputClone = input.clone(true);
            $('<form></form>').append(inputClone)[0].reset();
            // Detaching allows to insert the fileInput on another form
            // without loosing the file input value:
            input.after(inputClone).detach();
            // Avoid memory leaks with the detached file input:
            $.cleanData(input.unbind('remove'));
            // Replace the original file input element in the fileInput
            // collection with the clone, which has been copied including
            // event handlers:
            this.options.fileInput = this.options.fileInput.map(function (i, el) {
                if (el === input[0]) {
                    return inputClone[0];
                }
                return el;
            });
            // If the widget has been initialized on the file input itself,
            // override this.element with the file input clone:
            if (input[0] === this.element[0]) {
                this.element = inputClone;
            }
        },

        _onChange: function (e) {
            var that = e.data.fileupload,
                data = {
                    files: $.each($.makeArray(e.target.files), that._normalizeFile),
                    fileInput: $(e.target),
                    form: $(e.target.form)
                };
            if (!data.files.length) {
                // If the files property is not available, the browser does not
                // support the File API and we add a pseudo File object with
                // the input value as name with path information removed:
                data.files = [{name: e.target.value.replace(/^.*\\/, '')}];
            }
            if (that.options.replaceFileInput) {
                that._replaceFileInput(data.fileInput);
            }
            if (that._trigger('change', e, data) === false ||
                    that._onAdd(e, data) === false) {
                return false;
            }
        },

        _onPaste: function (e) {
            var that = e.data.fileupload,
                cbd = e.originalEvent.clipboardData,
                items = (cbd && cbd.items) || [],
                data = {files: []};
            $.each(items, function (index, item) {
                var file = item.getAsFile && item.getAsFile();
                if (file) {
                    data.files.push(file);
                }
            });
            if (that._trigger('paste', e, data) === false ||
                    that._onAdd(e, data) === false) {
                return false;
            }
        },

        _onDrop: function (e) {
            var that = e.data.fileupload,
                dataTransfer = e.dataTransfer = e.originalEvent.dataTransfer,
                data = {
                    files: $.each(
                        $.makeArray(dataTransfer && dataTransfer.files),
                        that._normalizeFile
                    )
                };
            if (that._trigger('drop', e, data) === false ||
                    that._onAdd(e, data) === false) {
                return false;
            }
            e.preventDefault();
        },

        _onDragOver: function (e) {
            var that = e.data.fileupload,
                dataTransfer = e.dataTransfer = e.originalEvent.dataTransfer;
            if (that._trigger('dragover', e) === false) {
                return false;
            }
            if (dataTransfer) {
                dataTransfer.dropEffect = dataTransfer.effectAllowed = 'copy';
            }
            e.preventDefault();
        },

        _initEventHandlers: function () {
            var ns = this.options.namespace;
            if (this._isXHRUpload(this.options)) {
                this.options.dropZone
                    .bind('dragover.' + ns, {fileupload: this}, this._onDragOver)
                    .bind('drop.' + ns, {fileupload: this}, this._onDrop)
                    .bind('paste.' + ns, {fileupload: this}, this._onPaste);
            }
            this.options.fileInput
                .bind('change.' + ns, {fileupload: this}, this._onChange);
        },

        _destroyEventHandlers: function () {
            var ns = this.options.namespace;
            this.options.dropZone
                .unbind('dragover.' + ns, this._onDragOver)
                .unbind('drop.' + ns, this._onDrop)
                .unbind('paste.' + ns, this._onPaste);
            this.options.fileInput
                .unbind('change.' + ns, this._onChange);
        },

        _setOption: function (key, value) {
            var refresh = $.inArray(key, this._refreshOptionsList) !== -1;
            if (refresh) {
                this._destroyEventHandlers();
            }
            $.Widget.prototype._setOption.call(this, key, value);
            if (refresh) {
                this._initSpecialOptions();
                this._initEventHandlers();
            }
        },

        _initSpecialOptions: function () {
            var options = this.options;
            if (options.fileInput === undefined) {
                options.fileInput = this.element.is('input:file') ?
                        this.element : this.element.find('input:file');
            } else if (!(options.fileInput instanceof $)) {
                options.fileInput = $(options.fileInput);
            }
            if (!(options.dropZone instanceof $)) {
                options.dropZone = $(options.dropZone);
            }
        },

        _create: function () {
            var options = this.options,
                dataOpts = $.extend({}, this.element.data());
            dataOpts[this.widgetName] = undefined;
            $.extend(options, dataOpts);
            options.namespace = options.namespace || this.widgetName;
            this._initSpecialOptions();
            this._slots = [];
            this._sequence = this._getXHRPromise(true);
            this._sending = this._active = this._loaded = this._total = 0;
            this._initEventHandlers();
        },

        destroy: function () {
            this._destroyEventHandlers();
            $.Widget.prototype.destroy.call(this);
        },

        enable: function () {
            $.Widget.prototype.enable.call(this);
            this._initEventHandlers();
        },

        disable: function () {
            this._destroyEventHandlers();
            $.Widget.prototype.disable.call(this);
        },

        // This method is exposed to the widget API and allows adding files
        // using the fileupload API. The data parameter accepts an object which
        // must have a files property and can contain additional options:
        // .fileupload('add', {files: filesList});
        add: function (data) {
            if (!data || this.options.disabled) {
                return;
            }
            data.files = $.each($.makeArray(data.files), this._normalizeFile);
            this._onAdd(null, data);
        },

        // This method is exposed to the widget API and allows sending files
        // using the fileupload API. The data parameter accepts an object which
        // must have a files property and can contain additional options:
        // .fileupload('send', {files: filesList});
        // The method returns a Promise object for the file upload call.
        send: function (data) {
            if (data && !this.options.disabled) {
                data.files = $.each($.makeArray(data.files), this._normalizeFile);
                if (data.files.length) {
                    return this._onSend(null, data);
                }
            }
            return this._getXHRPromise(false, data && data.context);
        }

    });

}));

/*
 * jQuery File Upload Image Processing Plugin 1.0.6
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2012, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*jslint nomen: true, unparam: true, regexp: true */
/*global define, window, document */

(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // Register as an anonymous AMD module:
        define('jquery.fileupload-ip',[
            'jquery',
            'load-image',
            'canvas-to-blob',
            './jquery.fileupload'
        ], factory);
    } else {
        // Browser globals:
        factory(
            window.jQuery,
            window.loadImage,
            window.canvasToBlob
        );
    }
}(function ($, loadImage, canvasToBlob) {
    'use strict';

    // The File Upload IP version extends the basic fileupload widget
    // with image processing functionality:
    $.widget('blueimpIP.fileupload', $.blueimp.fileupload, {

        options: {
            // The regular expression to define which image files are to be
            // resized, given that the browser supports the operation:
            resizeSourceFileTypes: /^image\/(gif|jpeg|png)$/,
            // The maximum file size of images that are to be resized:
            resizeSourceMaxFileSize: 20000000, // 20MB
            // The maximum width of the resized images:
            resizeMaxWidth: undefined,
            // The maximum height of the resized images:
            resizeMaxHeight: undefined,
            // The minimum width of the resized images:
            resizeMinWidth: undefined,
            // The minimum height of the resized images:
            resizeMinHeight: undefined,

            // The add callback is invoked as soon as files are added to the fileupload
            // widget (via file input selection, drag & drop or add API call).
            // See the basic file upload widget for more information:
            add: function (e, data) {
                $(this).fileupload('resize', data).done(function () {
                    data.submit();
                });
            }
        },

        // Resizes the image file at the given index and stores the created blob
        // at the original position of the files list, returns a Promise object:
        _resizeImage: function (files, index, options) {
            var that = this,
                file = files[index],
                deferred = $.Deferred(),
                canvas,
                blob;
            options = options || this.options;
            loadImage(
                file,
                function (img) {
                    var width = img.width,
                        height = img.height;
                    canvas = loadImage.scale(img, {
                        maxWidth: options.resizeMaxWidth,
                        maxHeight: options.resizeMaxHeight,
                        minWidth: options.resizeMinWidth,
                        minHeight: options.resizeMinHeight,
                        canvas: true
                    });
                    alert(canvas);
                    if (width !== canvas.width || height !== canvas.height) {
                        canvasToBlob(canvas, function (blob) {
                            if (!blob.name) {
                                if (file.type === blob.type) {
                                    blob.name = file.name;
                                } else if (file.name) {
                                    blob.name = file.name.replace(
                                        /\..+$/,
                                        '.' + blob.type.substr(6)
                                    );
                                }
                            }
                            files[index] = blob;
                            deferred.resolveWith(that);
                        }, file);
                    } else {
                        deferred.resolveWith(that);
                    }
                }
            );
            return deferred.promise();
        },

        // Resizes the images given as files property of the data parameter,
        // returns a Promise object that allows to bind a done handler, which
        // will be invoked after processing all images is done:
        resize: function (data) {
            //alert('resizing...');
            var that = this,
                options = $.extend({}, this.options, data),
                resizeAll = $.type(options.resizeSourceMaxFileSize) !== 'number',
                isXHRUpload = this._isXHRUpload(options);
            $.each(data.files, function (index, file) {
                if (isXHRUpload && that._resizeSupport &&
                        (options.resizeMaxWidth || options.resizeMaxHeight ||
                            options.resizeMinWidth || options.resizeMinHeight) &&
                        (resizeAll || file.size < options.resizeSourceMaxFileSize) &&
                        options.resizeSourceFileTypes.test(file.type)) {
                    that._processing += 1;
                    if (that._processing === 1) {
                        that.element.addClass('fileupload-processing');
                    }
                    that._processingQueue = that._processingQueue.pipe(function () {
                        var deferred = $.Deferred();
                        that._resizeImage(
                            data.files,
                            index,
                            options
                        ).done(function () {
                            that._processing -= 1;
                            if (that._processing === 0) {
                                that.element
                                    .removeClass('fileupload-processing');
                            }
                            deferred.resolveWith(that);
                        });
                        return deferred.promise();
                    });
                }
            });
            return this._processingQueue;
        },

        _create: function () {
            $.blueimp.fileupload.prototype._create.call(this);
            this._processing = 0;
            this._processingQueue = $.Deferred().resolveWith(this).promise();
            this._resizeSupport = canvasToBlob && canvasToBlob(
                document.createElement('canvas'),
                $.noop
            );
        }

    });

}));

define('apps/gallery/views/create-media',[
    "jquery",
    "marionette",
    "backbone",
    "handlebars",
    "models/photo",
    "models/audio",
    "text!../templates/create-media.html",
    "text!../templates/new-media.html",
    'load-image',
    'canvas-to-blob',
    'jquery.fileupload-ip'
], function ($, Marionette, Backbone, Handlebars, Photo, Audio, CreateMediaTemplate, NewMediaItemTemplate, loadImage) {
    'use strict';

    var CreateMediaView = Marionette.CompositeView.extend({
        models: [],
        template: Handlebars.compile(CreateMediaTemplate),
        getChildView: function () {
            return Marionette.ItemView.extend({
                initialize: function (opts) {
                    _.extend(this, opts);
                    this.file = this.model.get("file");
                    this.data = this.model.get("data");
                    this.options = opts.parent.options;
                    this.doPost();
                },
                mode: "begin",
                template: Handlebars.compile(NewMediaItemTemplate),
                modelEvents: {
                    'change:id': 'showSuccess'
                },
                events: {
                    'click .delete': 'deleteModel'
                },
                tagName: "div",
                templateHelpers: function () {
                    return {
                        mode: this.mode,
                        file_name: this.formatFilename(this.file.name),
                        file_size: this.formatFileSize(this.file.size),
                        errorMessage: this.errorMessage,
                        imageSerial: this.imageSerial
                    };
                },
                getUrl: function (baseURL, ext) {
                    ext = ext.toLowerCase();
                    var isAudio = this.options.audioTypes.indexOf(ext) != -1,
                        url = 'photos/';
                    if (this.options.dataType == 'map_images') {
                        url = 'map-images/';
                    } else if (isAudio) {
                        url =  'audio/';
                    }
                    return baseURL + url;
                },
                getApiUrl: function (ext) {
                    return this.getUrl('/api/0/', ext);
                },
                deleteModel: function (e) {
                    this.model.destroy();
                    e.preventDefault();
                },
                showPreview: function (file) {
                    //load image function defined in fileupload-ip.js
                    if (this.options.previewSourceFileTypes.test(file.type)) {
                        this.renderBlob(file);
                    } else {
                        var $preview = file.context.find('.preview');
                        $('<div class="audio-holder"><i class="fa fa-headphones fa-5x"></i></div>')
                            .insertAfter($preview);
                        $preview.remove();
                    }
                },
                renderBlob: function (file) {
                    var that = this;
                    return ((loadImage && loadImage(
                        file,
                        function (img) {
                            that.imageSerial = img.toDataURL("image/jpeg");
                            that.render();
                        },
                        {
                            maxWidth: that.options.previewMaxWidth,
                            maxHeight: that.options.previewMaxHeight,
                            canvas: true
                        }
                    )));
                },
                doPost: function () {
                    this.data.url = this.getApiUrl(this.file.ext);
                    this.render();
                    //a hack to coordinate between upload manager and child model
                    this.file.context = this.$el;
                    this.file.model = this.model;
                    //end hack
                    this.showPreview(this.file);
                    this.data.media_file = this.data.files;
                    var that = this;
                    this.data.submit()
                        .error(function (result, textStatus, jqXHR) {
                            that.handleServerError(that.data.files[0], result, textStatus, jqXHR);
                        });
                    return true;
                },
                formatFilename: function (filename) {
                    if (filename.length > 25) {
                        return filename.substring(0, 12) +
                                '...' +
                                filename.substring(filename.length - 10, filename.length);
                    }
                    return filename;
                },
                formatFileSize: function (bytes) {
                    if (typeof bytes !== 'number') {
                        return '';
                    }
                    if (bytes >= 1000000000) {
                        return (bytes / 1000000000).toFixed(2) + ' GB';
                    }
                    if (bytes >= 1000000) {
                        return (bytes / 1000000).toFixed(2) + ' MB';
                    }
                    return (bytes / 1000).toFixed(2) + ' KB';
                },
                handleServerError: function (file, result, textStatus, jqXHR) {
                    this.mode = "error";
                    this.errorMessage = 'Error uploading ' + file.name + ": " + result.responseText;
                    this.parent.errorCount += 1;
                },
                showSuccess: function () {
                    this.mode = "end";
                    this.render();
                    this.parent.models.push(this.model);
                }
            });
        },
        childViewContainer: "#dropzone",
        events: {
            'click #upload-button': 'triggerFileInputButton'
        },
        collectionEvents: {
            "destroy": "showInitMessage"
        },
        triggerFileInputButton: function (e) {
            this.$el.find("#fileupload").trigger('click');
            e.preventDefault();
        },
        templateHelpers: function () {
            return {
                count: this.collection.length
            };
        },
        defaults: {
            dataType: "default",
            acceptFileTypes: 'png, jpg, jpeg, gif, audio\/x-m4a, m4a, mp3, m4a, mp4, mpeg, video\/3gpp, 3gp, aif, aiff, ogg, wav',
            imageTypes: 'png, jpg, jpeg, gif',
            audioTypes: 'audio\/x-m4a, m4a, mp3, m4a, mp4, mpeg, video\/3gpp, 3gp, aif, aiff, ogg, wav',
            isIframe: false
        },

        childViewOptions: function () {
            return {
                parent: this
            };
        },
        getOptions: function () {
            return {
                maxFileSize: undefined,
                minFileSize: undefined,
                maxNumberOfFiles: 20,
                previewSourceFileTypes: /^image\/(gif|jpeg|png)$/,
                imageFileTypes: /^image\/(gif|jpeg|png)$/,
                audioFileTypes: /^audio\/(x-m4a|mp3|m4a|mp4|mpeg|wav)$/,
                previewSourceMaxFileSize: 5000000, // 5MB
                previewMaxWidth: 800,
                previewMaxHeight: 800,
                autoUpload: true,
                imageTypes: this.defaults.imageTypes.split(', '),
                audioTypes: this.defaults.audioTypes.split(', '),
                acceptFileTypes: this.defaults.acceptFileTypes.split(', ')
            };
        },
        onShow: function () {
            var that = this;
            this.$el.find('#fileupload').fileupload({
                dataType: 'json',
                autoUpload: true,
                dropZone: this.$el.find("#dropzone"),
                add: that.onAdd.bind(that),
                done: that.done.bind(that),
                stop: that.stop.bind(that),
                progress: function (e, data) {
                    data.files[0].context.find('.progress-bar').css(
                        'width',
                        parseInt(data.loaded / data.total * 100, 10) + '%'
                    );
                },
                submit: function (e, data) {
                    data.formData = that.getFormData();
                }
            });

            //section for uploading by dragging files from your desktop:
            this.$el.find("#dropzone").bind({
                dragover: function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var dropZone = that.$el.find('#dropzone'),
                        timeout = window.dropZoneTimeout;
                    if (!timeout) {
                        dropZone.addClass('in hover');
                    } else {
                        clearTimeout(timeout);
                    }
                    window.dropZoneTimeout = setTimeout(function (e) {
                        window.dropZoneTimeout = null;
                        dropZone.removeClass('in hover');
                        return false;
                    }, 500);
                },
                drop: function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
            });
        },
        initialize: function (opts) {
            _.extend(this, opts);
            this.collection = new Backbone.Collection();
            var that = this;
            this.options = this.getOptions();
            if (opts.dataType) {
                this.options.dataType = opts.dataType;
            }
            $('#warning-message-text').empty();
            this.render();
            console.log(this.$el.find("#fileupload"));
            this.$el.find('#fileupload').fileupload({
                dataType: 'json',
                autoUpload: true,
                dropZone: this.$el.find("#dropzone"),
                add: that.onAdd.bind(that),
                done: that.done.bind(that),
                stop: that.stop.bind(that),
                progress: function (e, data) {
                    data.files[0].context.find('.progress-bar').css(
                        'width',
                        parseInt(data.loaded / data.total * 100, 10) + '%'
                    );
                },
                submit: function (e, data) {
                    data.formData = that.getFormData();
                }
            });

            //section for uploading by dragging files from your desktop:
            this.$el.find("#dropzone").bind({
                dragover: function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var dropZone = this.$el.find('#dropzone'),
                        timeout = window.dropZoneTimeout;
                    if (!timeout) {
                        dropZone.addClass('in hover');
                    } else {
                        clearTimeout(timeout);
                    }
                    window.dropZoneTimeout = setTimeout(function (e) {
                        window.dropZoneTimeout = null;
                        dropZone.removeClass('in hover');
                        return false;
                    }, 500);
                },
                drop: function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
            });
        },
        dragover: function (e) {
            e.stopPropagation();
            e.preventDefault();
            var dropZone = this.$el.find('#dropzone'),
                timeout = window.dropZoneTimeout;
            if (!timeout) {
                dropZone.addClass('in hover');
            } else {
                clearTimeout(timeout);
            }
            window.dropZoneTimeout = setTimeout(function (e) {
                window.dropZoneTimeout = null;
                dropZone.removeClass('in hover');
                return false;
            }, 500);
        },
        errorCount: 0,
        successCount: 0,
        stop: function () {
            if (this.successCount > 0) {
                this.$el.find('.success-message').show();
            } else {
                this.$el.find('.success-message').hide();
            }
            if (this.errorCount > 0) {
                this.$el.find('.failure-message').show();
            } else {
                this.$el.find('.failure-message').hide();
            }
            //reset counters:
            this.errorCount = 0;
            this.successCount = 0;
        },

        getFormData: function () {
            return {
                project_id: this.app.getProjectID(),
                csrfmiddlewaretoken: this.app.getCookie('csrftoken')
            };
        },

        hasError: function (file) {
            var pieces = file.name.split('.'),
                ext = pieces[pieces.length - 1];
            file.ext = ext;
            if (file.error) {
                return file.error;
            }
            if (this.options.acceptFileTypes.indexOf(file.type.toLowerCase()) == -1 &&
                    this.options.acceptFileTypes.indexOf(ext.toLowerCase()) == -1) {
                return 'acceptFileTypes';
            }
            if (this.options.maxFileSize &&
                    file.size > this.options.maxFileSize) {
                return 'maxFileSize';
            }
            if (typeof file.size === 'number' &&
                    file.size < this.options.minFileSize) {
                return 'minFileSize';
            }
            return null;
        },
        validate: function (data) {
            var that = this,
                valid = !!data.files.length;
            $.each(data.files, function (index, file) {
                file.error = that.hasError(file);
                if (file.error) {
                    valid = false;
                }
            });
            return valid;
        },

        showOmittedFiles: function (data) {
            var omitted = 0,
                messages = [],
                message = "The following files were ignored because they are not supported  by the file uploader:<br>";
            $.each(data.files, function (index, file) {
                if (file.error) {
                    if (file.error == 'acceptFileTypes') {
                        ++omitted;
                        messages.push(file.name + ": " + file.type);
                    }
                }
            });
            if (omitted > 0) {
                message += messages.join(", ");
                this.$el.find('.warning-message').html(message).show();
            }
        },

        showInitMessage: function () {
            if (this.collection.length == 0) {
                this.$el.find('#nothing-here').show();
                this.$el.find('#dropzone').css('border', 'dashed 1px #CCC');
            }
        },

        onAdd: function (e, data) {
            var that = this,
                model;
            this.$el.find('#nothing-here').hide();
            this.$el.find('#dropzone').css('border', 'none');
            //validate files:
            this.validate(data);
            this.showOmittedFiles(data);
            $.each(data.files, function (index, file) {
                if (file.error) {
                    //continue to next iteration: return true;
                    that.showInitMessage();
                    return true;
                }
                if (that.options.previewSourceFileTypes.test(file.type)) {
                    model = new Photo({
                        file: file,
                        data: data
                    });
                } else {
                    model = new Audio({
                        file: file,
                        data: data
                    });
                }
                that.collection.add(model);
            });
        },

        done: function (e, data) {
            var attributes = data.result,
                model = data.files[0].model,
                sourceCollection = null;
            model.set(attributes);
            if (model.get("overlay_type") == "photo") {
                sourceCollection = this.app.dataManager.getData("photos").collection;
            } else {
                sourceCollection = this.app.dataManager.getData("audio").collection;
            }
            model.urlRoot = sourceCollection.url;
            delete model.attributes.data;
            delete model.attributes.file;
            sourceCollection.unshift(model); //add to top
        },

        addModels: function () {
            var selectedModels = [];
            this.collection.each(function (model) {
                // if (model.get("isSelected")) {
                    selectedModels.push(model);
                // }
            });
            this.parentModel.trigger('add-models-to-marker', selectedModels);
        }
    });
    return CreateMediaView;

});


define('text!apps/gallery/templates/media-browser-layout.html',[],function () { return '<nav>\n    <ul>\n        <li id="upload-tab-li">\n            <a href="#" class="add-media-tabs" id="upload-tab">\n                Upload\n            </a>\n        </li>\n        <li id="database-tab-li">\n            <a href="#" class="add-media-tabs" id="database-tab">\n                Select from Database\n            </a>\n        </li>\n    </ul>\n</nav>\n\n<section id="uploader"></section>\n    \n<section id="media_browser"></section>\n    \n';});

define('apps/gallery/views/add-media',["marionette",
        "handlebars",
        "apps/gallery/views/media_browser",
     //   "apps/gallery/views/media-browser-uploader",
        "apps/gallery/views/create-media",
        "text!../templates/media-browser-layout.html",
        "models/layer"
    ],
    function (Marionette, Handlebars, MediaBrowserView, UploaderView, AddMediaModalTemplate)  {
        'use strict';
        // More info here: http://marionettejs.com/docs/v2.4.4/marionette.layoutview.html
        var AddMediaModal = Marionette.LayoutView.extend({
            template: Handlebars.compile(AddMediaModalTemplate),
            activeRegion: null,
            initialize: function (opts) {
                _.extend(this, opts);
                this.render();
            },

            events: {
                'click #upload-tab' : 'showUploader',
                'click #database-tab' : 'showDatabase'
            },

            regions: {
                uploaderRegion: "#uploader",
                mediaBrowserRegion: "#media_browser"
            },
            onRender: function () {
                // only load views after the LayoutView has
                // been rendered to the screen:

               /* var upld = new SelectMapView({ app: this.app });
                this.menu.show(upld);
                */
                this.upld = new UploaderView({
                    app: this.app,
                    parentModel: this.parentModel
                });
                this.uploaderRegion.show(this.upld);
                this.uploaderRegion.$el.hide();

                this.mb = new MediaBrowserView({
                    app: this.app,
                    parentModel: this.parentModel
                });
                this.mediaBrowserRegion.show(this.mb);
                this.$el.find("#database-tab-li").addClass("active");

                //sets proper region from which to call addModel()
                this.activeRegion = "mediaBrowser";


            },

            showUploader: function (e) {
                this.mediaBrowserRegion.$el.hide();
                this.uploaderRegion.$el.show();
                this.$el.find("#database-tab-li").removeClass("active");
                this.$el.find("#upload-tab-li").addClass("active");
                this.activeRegion = "uploader";
                if (e) {
                    e.preventDefault();
                }
            },

            showDatabase: function (e) {
                this.uploaderRegion.$el.hide();
                this.mediaBrowserRegion.$el.show();
                this.$el.find("#upload-tab-li").removeClass("active");
                this.$el.find("#database-tab-li").addClass("active");
                this.activeRegion = "mediaBrowser";
                if (e) {
                    e.preventDefault();
                }
            },
            addModels: function () {
                if (this.activeRegion == "mediaBrowser") {
                    console.log("read mb.addModels()");
                    this.mb.addModels();
                } else if (this.activeRegion == "uploader") {
                    this.upld.addModels();
                }
            }
        });
        return AddMediaModal;
    });

/*!
 * Pikaday
 *
 * Copyright © 2014 David Bushell | BSD & MIT license | https://github.com/dbushell/Pikaday
 */

(function (root, factory)
{
    'use strict';

    var moment;
    if (typeof exports === 'object') {
        // CommonJS module
        // Load moment.js as an optional dependency
        try { moment = require('moment'); } catch (e) {}
        module.exports = factory(moment);
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('external/pikaday-forked',['require'],function (req)
        {
            // Load moment.js as an optional dependency
            var id = 'moment';
            try { moment = req(id); } catch (e) {}
            return factory(moment);
        });
    } else {
        root.Pikaday = factory(root.moment);
    }
}(this, function (moment)
{
    'use strict';

    /**
     * feature detection and helper functions
     */
    var hasMoment = typeof moment === 'function',

    hasEventListeners = !!window.addEventListener,

    document = window.document,

    sto = window.setTimeout,

    addEvent = function(el, e, callback, capture)
    {
        if (hasEventListeners) {
            el.addEventListener(e, callback, !!capture);
        } else {
            el.attachEvent('on' + e, callback);
        }
    },

    removeEvent = function(el, e, callback, capture)
    {
        if (hasEventListeners) {
            el.removeEventListener(e, callback, !!capture);
        } else {
            el.detachEvent('on' + e, callback);
        }
    },

    trim = function(str)
    {
        return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g,'');
    },

    hasClass = function(el, cn)
    {
        return (' ' + el.className + ' ').indexOf(' ' + cn + ' ') !== -1;
    },

    addClass = function(el, cn)
    {
        if (!hasClass(el, cn)) {
            el.className = (el.className === '') ? cn : el.className + ' ' + cn;
        }
    },

    removeClass = function(el, cn)
    {
        el.className = trim((' ' + el.className + ' ').replace(' ' + cn + ' ', ' '));
    },

    isArray = function(obj)
    {
        return (/Array/).test(Object.prototype.toString.call(obj));
    },

    isDate = function(obj)
    {
        return (/Date/).test(Object.prototype.toString.call(obj)) && !isNaN(obj.getTime());
    },

    isWeekend = function(date)
    {
        var day = date.getDay();
        return day === 0 || day === 6;
    },

    isLeapYear = function(year)
    {
        // solution by Matti Virkkunen: http://stackoverflow.com/a/4881951
        return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
    },

    getDaysInMonth = function(year, month)
    {
        return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    },

    setToStartOfDay = function(date)
    {
        if (isDate(date)) date.setHours(0,0,0,0);
    },

    compareDates = function(a,b)
    {
        // weak date comparison (use setToStartOfDay(date) to ensure correct result)
        return a.getTime() === b.getTime();
    },

    extend = function(to, from, overwrite)
    {
        var prop, hasProp;
        for (prop in from) {
            hasProp = to[prop] !== undefined;
            if (hasProp && typeof from[prop] === 'object' && from[prop] !== null && from[prop].nodeName === undefined) {
                if (isDate(from[prop])) {
                    if (overwrite) {
                        to[prop] = new Date(from[prop].getTime());
                    }
                }
                else if (isArray(from[prop])) {
                    if (overwrite) {
                        to[prop] = from[prop].slice(0);
                    }
                } else {
                    to[prop] = extend({}, from[prop], overwrite);
                }
            } else if (overwrite || !hasProp) {
                to[prop] = from[prop];
            }
        }
        return to;
    },

    fireEvent = function(el, eventName, data)
    {
        var ev;

        if (document.createEvent) {
            ev = document.createEvent('HTMLEvents');
            ev.initEvent(eventName, true, false);
            ev = extend(ev, data);
            el.dispatchEvent(ev);
        } else if (document.createEventObject) {
            ev = document.createEventObject();
            ev = extend(ev, data);
            el.fireEvent('on' + eventName, ev);
        }
    },

    adjustCalendar = function(calendar) {
        if (calendar.month < 0) {
            calendar.year -= Math.ceil(Math.abs(calendar.month)/12);
            calendar.month += 12;
        }
        if (calendar.month > 11) {
            calendar.year += Math.floor(Math.abs(calendar.month)/12);
            calendar.month -= 12;
        }
        return calendar;
    },

    /**
     * defaults and localisation
     */
    defaults = {

        // bind the picker to a form field
        field: null,

        // automatically show/hide the picker on `field` focus (default `true` if `field` is set)
        bound: undefined,

        // position of the datepicker, relative to the field (default to bottom & left)
        // ('bottom' & 'left' keywords are not used, 'top' & 'right' are modifier on the bottom/left position)
        position: 'bottom left',

        // automatically fit in the viewport even if it means repositioning from the position option
        reposition: true,

        // the default output format for `.toString()` and `field` value
        format: 'YYYY-MM-DD',

        // the toString function which gets passed a current date object and format
        // and returns a string
        toString: null,

        // used to create date object from current input string
        parse: null,

        // the initial date to view when first opened
        defaultDate: null,

        // make the `defaultDate` the initial selected value
        setDefaultDate: false,

        // first day of week (0: Sunday, 1: Monday etc)
        firstDay: 0,

        // the default flag for moment's strict date parsing
        formatStrict: false,

        // the minimum/earliest date that can be selected
        minDate: null,
        // the maximum/latest date that can be selected
        maxDate: null,

        // number of years either side, or array of upper/lower range
        yearRange: 10,

        // show week numbers at head of row
        showWeekNumber: false,

        // Week picker mode
        pickWholeWeek: false,

        // used internally (don't config outside)
        minYear: 0,
        maxYear: 9999,
        minMonth: undefined,
        maxMonth: undefined,

        startRange: null,
        endRange: null,

        isRTL: false,

        // Additional text to append to the year in the calendar title
        yearSuffix: '',

        // Render the month after year in the calendar title
        showMonthAfterYear: false,

        // Render days of the calendar grid that fall in the next or previous month
        showDaysInNextAndPreviousMonths: false,

        // Allows user to select days that fall in the next or previous month
        enableSelectionDaysInNextAndPreviousMonths: false,

        // how many months are visible
        numberOfMonths: 1,

        // when numberOfMonths is used, this will help you to choose where the main calendar will be (default `left`, can be set to `right`)
        // only used for the first display or when a selected date is not visible
        mainCalendar: 'left',

        // Specify a DOM element to render the calendar in
        container: undefined,

        // Blur field when date is selected
        blurFieldOnSelect : true,

        // internationalization
        i18n: {
            previousMonth : 'Previous Month',
            nextMonth     : 'Next Month',
            months        : ['January','February','March','April','May','June','July','August','September','October','November','December'],
            weekdays      : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
            weekdaysShort : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
        },

        // Theme Classname
        theme: null,

        // events array
        events: [],

        // callback function
        onSelect: null,
        onOpen: null,
        onClose: null,
        onDraw: null
    },


    /**
     * templating functions to abstract HTML rendering
     */
    renderDayName = function(opts, day, abbr)
    {
        day += opts.firstDay;
        while (day >= 7) {
            day -= 7;
        }
        return abbr ? opts.i18n.weekdaysShort[day] : opts.i18n.weekdays[day];
    },

    renderDay = function(opts)
    {
        var arr = [];
        var ariaSelected = 'false';
        if (opts.isEmpty) {
            if (opts.showDaysInNextAndPreviousMonths) {
                arr.push('is-outside-current-month');

                if(!opts.enableSelectionDaysInNextAndPreviousMonths) {
                    arr.push('is-selection-disabled')
                }

            } else {
                return '<td class="is-empty"></td>';
            }
        }
        if (opts.isDisabled) {
            arr.push('is-disabled');
        }
        if (opts.isToday) {
            arr.push('is-today');
        }
        if (opts.isSelected) {
            arr.push('is-selected');
            ariaSelected = 'true';
        }
        if (opts.hasEvent) {
            arr.push('has-event');
        }
        if (opts.isInRange) {
            arr.push('is-inrange');
        }
        if (opts.isStartRange) {
            arr.push('is-startrange');
        }
        if (opts.isEndRange) {
            arr.push('is-endrange');
        }
        return '<td data-day="' + opts.day + '" class="' + arr.join(' ') + '" aria-selected="' + ariaSelected + '">' +
                 '<button class="pika-button pika-day" type="button" ' +
                    'data-pika-year="' + opts.year + '" data-pika-month="' + opts.month + '" data-pika-day="' + opts.day + '">' +
                        opts.day +
                 '</button>' +
               '</td>';
    },

    renderWeek = function (d, m, y) {
        // Lifted from http://javascript.about.com/library/blweekyear.htm, lightly modified.
        var onejan = new Date(y, 0, 1),
            weekNum = Math.ceil((((new Date(y, m, d) - onejan) / 86400000) + onejan.getDay()+1)/7);
        return '<td class="pika-week">' + weekNum + '</td>';
    },

    renderRow = function(days, isRTL, pickWholeWeek, isRowSelected)
    {
        return '<tr class="pika-row' + (pickWholeWeek ? ' pick-whole-week' : '') + (isRowSelected ? ' is-selected' : '') + '">' + (isRTL ? days.reverse() : days).join('') + '</tr>';
    },

    renderBody = function(rows)
    {
        return '<tbody>' + rows.join('') + '</tbody>';
    },

    renderHead = function(opts)
    {
        var i, arr = [];
        if (opts.showWeekNumber) {
            arr.push('<th></th>');
        }
        for (i = 0; i < 7; i++) {
            arr.push('<th scope="col"><abbr title="' + renderDayName(opts, i) + '">' + renderDayName(opts, i, true) + '</abbr></th>');
        }
        return '<thead><tr>' + (opts.isRTL ? arr.reverse() : arr).join('') + '</tr></thead>';
    },

    renderTitle = function(instance, c, year, month, refYear, randId)
    {
        var i, j, arr,
            opts = instance._o,
            isMinYear = year === opts.minYear,
            isMaxYear = year === opts.maxYear,
            html = '<div id="' + randId + '" class="pika-title" role="heading" aria-live="assertive">',
            monthHtml,
            yearHtml,
            prev = true,
            next = true;

        for (arr = [], i = 0; i < 12; i++) {
            arr.push('<option value="' + (year === refYear ? i - c : 12 + i - c) + '"' +
                (i === month ? ' selected="selected"': '') +
                ((isMinYear && i < opts.minMonth) || (isMaxYear && i > opts.maxMonth) ? 'disabled="disabled"' : '') + '>' +
                opts.i18n.months[i] + '</option>');
        }

        monthHtml = '<div class="pika-label">' + opts.i18n.months[month] + '<select class="pika-select pika-select-month" tabindex="-1">' + arr.join('') + '</select></div>';

        if (isArray(opts.yearRange)) {
            i = opts.yearRange[0];
            j = opts.yearRange[1] + 1;
        } else {
            i = year - opts.yearRange;
            j = 1 + year + opts.yearRange;
        }

        for (arr = []; i < j && i <= opts.maxYear; i++) {
            if (i >= opts.minYear) {
                arr.push('<option value="' + i + '"' + (i === year ? ' selected="selected"': '') + '>' + (i) + '</option>');
            }
        }
        yearHtml = '<div class="pika-label">' + year + opts.yearSuffix + '<select class="pika-select pika-select-year" tabindex="-1">' + arr.join('') + '</select></div>';

        if (opts.showMonthAfterYear) {
            html += yearHtml + monthHtml;
        } else {
            html += monthHtml + yearHtml;
        }

        if (isMinYear && (month === 0 || opts.minMonth >= month)) {
            prev = false;
        }

        if (isMaxYear && (month === 11 || opts.maxMonth <= month)) {
            next = false;
        }

        if (c === 0) {
            html += '<button class="pika-prev' + (prev ? '' : ' is-disabled') + '" type="button">' + opts.i18n.previousMonth + '</button>';
        }
        if (c === (instance._o.numberOfMonths - 1) ) {
            html += '<button class="pika-next' + (next ? '' : ' is-disabled') + '" type="button">' + opts.i18n.nextMonth + '</button>';
        }

        return html += '</div>';
    },

    renderTable = function(opts, data, randId)
    {
        return '<table cellpadding="0" cellspacing="0" class="pika-table" role="grid" aria-labelledby="' + randId + '">' + renderHead(opts) + renderBody(data) + '</table>';
    },


    /**
     * Pikaday constructor
     */
    Pikaday = function(options)
    {
        var self = this,
            opts = self.config(options);

        self._onMouseDown = function(e)
        {
            if (!self._v) {
                return;
            }
            e = e || window.event;
            var target = e.target || e.srcElement;
            if (!target) {
                return;
            }

            if (!hasClass(target, 'is-disabled')) {
                if (hasClass(target, 'pika-button') && !hasClass(target, 'is-empty') && !hasClass(target.parentNode, 'is-disabled')) {
                    self.setDate(new Date(target.getAttribute('data-pika-year'), target.getAttribute('data-pika-month'), target.getAttribute('data-pika-day')));
                    if (opts.bound) {
                        sto(function() {
                            self.hide();
                            if (opts.blurFieldOnSelect && opts.field) {
                                opts.field.blur();
                            }
                        }, 100);
                    }
                }
                else if (hasClass(target, 'pika-prev')) {
                    self.prevMonth();
                }
                else if (hasClass(target, 'pika-next')) {
                    self.nextMonth();
                }
            }
            if (!hasClass(target, 'pika-select')) {
                // if this is touch event prevent mouse events emulation
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                    return false;
                }
            } else {
                self._c = true;
            }
        };

        self._onChange = function(e)
        {
            e = e || window.event;
            var target = e.target || e.srcElement;
            if (!target) {
                return;
            }
            if (hasClass(target, 'pika-select-month')) {
                self.gotoMonth(target.value);
            }
            else if (hasClass(target, 'pika-select-year')) {
                self.gotoYear(target.value);
            }
        };

        self._onKeyChange = function(e)
        {
            console.log("self._onKeyChange", e.keyCode);
            e = e || window.event;

            if (self.isVisible()) {
                console.log(self.isVisible());

                switch(e.keyCode){
                    case 13:
                        break;
                    case 27:
                        if (opts.field) {
                            opts.field.blur();
                        }
                        break;
                    case 37:
                        //e.preventDefault();
                        console.log("Subtract day by 1");
                        self.adjustDate('subtract', 1);
                        break;
                    case 38:
                        self.adjustDate('subtract', 7);
                        break;
                    case 39:
                        self.adjustDate('add', 1);
                        break;
                    case 40:
                        self.adjustDate('add', 7);
                        break;
                }
            }
        };

        self._onInputChange = function(e)
        {
            var date;
            if (e.firedBy === self) {
                return;
            }
            if (opts.parse) {
                console.log('PARSE:', opts.parse);
                date = opts.parse(opts.field.value, opts.format);
            } else if (hasMoment) {
                console.log('hasMoment');
                date = moment(opts.field.value, opts.format, opts.formatStrict);
                date = (date && date.isValid()) ? date.toDate() : null;
            }
            else {
                'date parse';
                date = new Date(Date.parse(opts.field.value));
            }
            if (isDate(date)) {
              self.setDate(date);
            }
            if (!self._v) {
                self.show();
            }
        };

        self._onInputFocus = function()
        {
            self.show();
        };

        self._onInputClick = function()
        {
            console.log('clicked');
            self.show();
        };

        self._onInputBlur = function()
        {
            console.log('self._onInputBlur');
            // IE allows pika div to gain focus; catch blur the input field
            var pEl = document.activeElement;
            do {
                if (hasClass(pEl, 'pika-single')) {
                    return;
                }
            }
            while ((pEl = pEl.parentNode));

            if (!self._c) {
                self._b = sto(function() {
                    self.hide();
                }, 50);
            }
            self._c = false;
        };

        self._onClick = function(e)
        {
            console.log('self._onClick');
            e = e || window.event;
            var target = e.target || e.srcElement,
                pEl = target;
            if (!target) {
                return;
            }
            if (!hasEventListeners && hasClass(target, 'pika-select')) {
                if (!target.onchange) {
                    target.setAttribute('onchange', 'return;');
                    addEvent(target, 'change', self._onChange);
                }
            }
            do {
                if (hasClass(pEl, 'pika-single') || pEl === opts.trigger) {
                    return;
                }
            }
            while ((pEl = pEl.parentNode));
            if (self._v && target !== opts.trigger && pEl !== opts.trigger) {
                self.hide();
            }
        };

        self.el = document.createElement('div');
        self.el.className = 'pika-single' + (opts.isRTL ? ' is-rtl' : '') + (opts.theme ? ' ' + opts.theme : '');

        addEvent(self.el, 'mousedown', self._onMouseDown, true);
        addEvent(self.el, 'touchend', self._onMouseDown, true);
        addEvent(self.el, 'change', self._onChange);
        addEvent(document, 'keydown', self._onKeyChange);

        if (opts.field) {
            if (opts.container) {
                opts.container.appendChild(self.el);
            } else if (opts.bound) {
                document.body.appendChild(self.el);
            } else {
                opts.field.parentNode.insertBefore(self.el, opts.field.nextSibling);
            }
            addEvent(opts.field, 'change', self._onInputChange);

            if (!opts.defaultDate) {
                if (hasMoment && opts.field.value) {
                    opts.defaultDate = moment(opts.field.value, opts.format).toDate();
                } else {
                    opts.defaultDate = new Date(Date.parse(opts.field.value));
                }
                opts.setDefaultDate = true;
            }
        }

        var defDate = opts.defaultDate;

        if (isDate(defDate)) {
            if (opts.setDefaultDate) {
                self.setDate(defDate, true);
            } else {
                self.gotoDate(defDate);
            }
        } else {
            self.gotoDate(new Date());
        }

        if (opts.bound) {
            this.hide();
            self.el.className += ' is-bound';
            addEvent(opts.trigger, 'click', self._onInputClick);
            addEvent(opts.trigger, 'focus', self._onInputFocus);
            addEvent(opts.trigger, 'blur', self._onInputBlur);
        } else {
            this.show();
        }
    };


    /**
     * public Pikaday API
     */
    Pikaday.prototype = {


        /**
         * configure functionality
         */
        config: function(options)
        {
            if (!this._o) {
                this._o = extend({}, defaults, true);
            }

            var opts = extend(this._o, options, true);

            opts.isRTL = !!opts.isRTL;

            opts.field = (opts.field && opts.field.nodeName) ? opts.field : null;

            opts.theme = (typeof opts.theme) === 'string' && opts.theme ? opts.theme : null;

            opts.bound = !!(opts.bound !== undefined ? opts.field && opts.bound : opts.field);

            opts.trigger = (opts.trigger && opts.trigger.nodeName) ? opts.trigger : opts.field;

            opts.disableWeekends = !!opts.disableWeekends;

            opts.disableDayFn = (typeof opts.disableDayFn) === 'function' ? opts.disableDayFn : null;

            var nom = parseInt(opts.numberOfMonths, 10) || 1;
            opts.numberOfMonths = nom > 4 ? 4 : nom;

            if (!isDate(opts.minDate)) {
                opts.minDate = false;
            }
            if (!isDate(opts.maxDate)) {
                opts.maxDate = false;
            }
            if ((opts.minDate && opts.maxDate) && opts.maxDate < opts.minDate) {
                opts.maxDate = opts.minDate = false;
            }
            if (opts.minDate) {
                this.setMinDate(opts.minDate);
            }
            if (opts.maxDate) {
                this.setMaxDate(opts.maxDate);
            }

            if (isArray(opts.yearRange)) {
                var fallback = new Date().getFullYear() - 10;
                opts.yearRange[0] = parseInt(opts.yearRange[0], 10) || fallback;
                opts.yearRange[1] = parseInt(opts.yearRange[1], 10) || fallback;
            } else {
                opts.yearRange = Math.abs(parseInt(opts.yearRange, 10)) || defaults.yearRange;
                if (opts.yearRange > 100) {
                    opts.yearRange = 100;
                }
            }

            return opts;
        },

        /**
         * return a formatted string of the current selection (using Moment.js if available)
         */
        toString: function(format)
        {
            format = format || this._o.format;
            if (!isDate(this._d)) {
                return '';
            }
            if (this._o.toString) {
              return this._o.toString(this._d, format);
            }
            if (hasMoment) {
              return moment(this._d).format(format);
            }
            return this._d.toDateString();
        },

        /**
         * return a Moment.js object of the current selection (if available)
         */
        getMoment: function()
        {
            return hasMoment ? moment(this._d) : null;
        },

        /**
         * set the current selection from a Moment.js object (if available)
         */
        setMoment: function(date, preventOnSelect)
        {
            if (hasMoment && moment.isMoment(date)) {
                this.setDate(date.toDate(), preventOnSelect);
            }
        },

        /**
         * return a Date object of the current selection
         */
        getDate: function()
        {
            return isDate(this._d) ? new Date(this._d.getTime()) : null;
        },

        /**
         * set the current selection
         */
        setDate: function(date, preventOnSelect) {
            if (!date) {
                this._d = null;

                if (this._o.field) {
                    this._o.field.value = '';
                    fireEvent(this._o.field, 'change', { firedBy: this });
                }

                return this.draw();
            }
            if (typeof date === 'string') {
                date = new Date(Date.parse(date));
            }
            if (typeof date === 'object') {
              var utc = date.getTime() + (date.getTimezoneOffset() * 60000 + 500);
              date = new Date(utc)
            }
            console.log('date set', date);
            if (!isDate(date)) {
                return;
            }

            var min = this._o.minDate,
                max = this._o.maxDate;

            if (isDate(min) && date < min) {
                date = min;
            } else if (isDate(max) && date > max) {
                date = max;
            }

            this._d = new Date(date.getTime());
            setToStartOfDay(this._d);
            this.gotoDate(this._d);

            if (this._o.field) {
                this._o.field.value = this.toString();
                fireEvent(this._o.field, 'change', { firedBy: this });
            }
            if (!preventOnSelect && typeof this._o.onSelect === 'function') {
                this._o.onSelect.call(this, this.getDate());
            }
        },

        /**
         * change view to a specific date
         */
        gotoDate: function(date)
        {
            var newCalendar = true;

            if (!isDate(date)) {
                return;
            }

            if (this.calendars) {
                var firstVisibleDate = new Date(this.calendars[0].year, this.calendars[0].month, 1),
                    lastVisibleDate = new Date(this.calendars[this.calendars.length-1].year, this.calendars[this.calendars.length-1].month, 1),
                    visibleDate = date.getTime();
                // get the end of the month
                lastVisibleDate.setMonth(lastVisibleDate.getMonth()+1);
                lastVisibleDate.setDate(lastVisibleDate.getDate()-1);
                newCalendar = (visibleDate < firstVisibleDate.getTime() || lastVisibleDate.getTime() < visibleDate);
            }

            if (newCalendar) {
                this.calendars = [{
                    month: date.getMonth(),
                    year: date.getFullYear()
                }];
                if (this._o.mainCalendar === 'right') {
                    this.calendars[0].month += 1 - this._o.numberOfMonths;
                }
            }

            this.adjustCalendars();
        },

        adjustDate: function(sign, days) {

            var day = this.getDate() || new Date();
            var difference = parseInt(days)*24*60*60*1000;

            var newDay;

            if (sign === 'add') {
                newDay = new Date(day.valueOf() + difference);
            } else if (sign === 'subtract') {
                newDay = new Date(day.valueOf() - difference);
            } else {
                newDay = new Date(day.valueOf());
            }

            this.setDate(newDay);
        },

        adjustCalendars: function() {
            this.calendars[0] = adjustCalendar(this.calendars[0]);
            for (var c = 1; c < this._o.numberOfMonths; c++) {
                this.calendars[c] = adjustCalendar({
                    month: this.calendars[0].month + c,
                    year: this.calendars[0].year
                });
            }
            this.draw();
        },

        gotoToday: function()
        {
            this.gotoDate(new Date());
        },

        /**
         * change view to a specific month (zero-index, e.g. 0: January)
         */
        gotoMonth: function(month)
        {
            if (!isNaN(month)) {
                this.calendars[0].month = parseInt(month, 10);
                this.adjustCalendars();
            }
        },

        nextMonth: function()
        {
            this.calendars[0].month++;
            this.adjustCalendars();
        },

        prevMonth: function()
        {
            this.calendars[0].month--;
            this.adjustCalendars();
        },

        /**
         * change view to a specific full year (e.g. "2012")
         */
        gotoYear: function(year)
        {
            if (!isNaN(year)) {
                this.calendars[0].year = parseInt(year, 10);
                this.adjustCalendars();
            }
        },

        /**
         * change the minDate
         */
        setMinDate: function(value)
        {
            if(value instanceof Date) {
                setToStartOfDay(value);
                this._o.minDate = value;
                this._o.minYear  = value.getFullYear();
                this._o.minMonth = value.getMonth();
            } else {
                this._o.minDate = defaults.minDate;
                this._o.minYear  = defaults.minYear;
                this._o.minMonth = defaults.minMonth;
                this._o.startRange = defaults.startRange;
            }

            this.draw();
        },

        /**
         * change the maxDate
         */
        setMaxDate: function(value)
        {
            if(value instanceof Date) {
                setToStartOfDay(value);
                this._o.maxDate = value;
                this._o.maxYear = value.getFullYear();
                this._o.maxMonth = value.getMonth();
            } else {
                this._o.maxDate = defaults.maxDate;
                this._o.maxYear = defaults.maxYear;
                this._o.maxMonth = defaults.maxMonth;
                this._o.endRange = defaults.endRange;
            }

            this.draw();
        },

        setStartRange: function(value)
        {
            this._o.startRange = value;
        },

        setEndRange: function(value)
        {
            this._o.endRange = value;
        },

        /**
         * refresh the HTML
         */
        draw: function(force)
        {
            if (!this._v && !force) {
                return;
            }
            var opts = this._o,
                minYear = opts.minYear,
                maxYear = opts.maxYear,
                minMonth = opts.minMonth,
                maxMonth = opts.maxMonth,
                html = '',
                randId;

            if (this._y <= minYear) {
                this._y = minYear;
                if (!isNaN(minMonth) && this._m < minMonth) {
                    this._m = minMonth;
                }
            }
            if (this._y >= maxYear) {
                this._y = maxYear;
                if (!isNaN(maxMonth) && this._m > maxMonth) {
                    this._m = maxMonth;
                }
            }

            randId = 'pika-title-' + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 2);

            for (var c = 0; c < opts.numberOfMonths; c++) {
                html += '<div class="pika-lendar">' + renderTitle(this, c, this.calendars[c].year, this.calendars[c].month, this.calendars[0].year, randId) + this.render(this.calendars[c].year, this.calendars[c].month, randId) + '</div>';
            }

            this.el.innerHTML = html;

            if (opts.bound) {
                if(opts.field.type !== 'hidden') {
                    sto(function() {
                        opts.trigger.focus();
                    }, 1);
                }
            }

            if (typeof this._o.onDraw === 'function') {
                this._o.onDraw(this);
            }

            if (opts.bound) {
                // let the screen reader user know to use arrow keys
                opts.field.setAttribute('aria-label', 'Use the arrow keys to pick a date');
            }
        },

        adjustPosition: function()
        {
            var field, pEl, width, height, viewportWidth, viewportHeight, scrollTop, left, top, clientRect;

            if (this._o.container) return;

            this.el.style.position = 'absolute';

            field = this._o.trigger;
            pEl = field;
            width = this.el.offsetWidth;
            height = this.el.offsetHeight;
            viewportWidth = window.innerWidth || document.documentElement.clientWidth;
            viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;

            if (typeof field.getBoundingClientRect === 'function') {
                clientRect = field.getBoundingClientRect();
                left = clientRect.left + window.pageXOffset;
                top = clientRect.bottom + window.pageYOffset;
            } else {
                left = pEl.offsetLeft;
                top  = pEl.offsetTop + pEl.offsetHeight;
                while((pEl = pEl.offsetParent)) {
                    left += pEl.offsetLeft;
                    top  += pEl.offsetTop;
                }
            }

            // default position is bottom & left
            if ((this._o.reposition && left + width > viewportWidth) ||
                (
                    this._o.position.indexOf('right') > -1 &&
                    left - width + field.offsetWidth > 0
                )
            ) {
                left = left - width + field.offsetWidth;
            }
            if ((this._o.reposition && top + height > viewportHeight + scrollTop) ||
                (
                    this._o.position.indexOf('top') > -1 &&
                    top - height - field.offsetHeight > 0
                )
            ) {
                top = top - height - field.offsetHeight;
            }

            this.el.style.left = left + 'px';
            this.el.style.top = top + 'px';
        },

        /**
         * render HTML for a particular month
         */
        render: function(year, month, randId)
        {
            var opts   = this._o,
                now    = new Date(),
                days   = getDaysInMonth(year, month),
                before = new Date(year, month, 1).getDay(),
                data   = [],
                row    = [];
            setToStartOfDay(now);
            if (opts.firstDay > 0) {
                before -= opts.firstDay;
                if (before < 0) {
                    before += 7;
                }
            }
            var previousMonth = month === 0 ? 11 : month - 1,
                nextMonth = month === 11 ? 0 : month + 1,
                yearOfPreviousMonth = month === 0 ? year - 1 : year,
                yearOfNextMonth = month === 11 ? year + 1 : year,
                daysInPreviousMonth = getDaysInMonth(yearOfPreviousMonth, previousMonth);
            var cells = days + before,
                after = cells;
            while(after > 7) {
                after -= 7;
            }
            cells += 7 - after;
            var isWeekSelected = false;
            for (var i = 0, r = 0; i < cells; i++)
            {
                var day = new Date(year, month, 1 + (i - before)),
                    isSelected = isDate(this._d) ? compareDates(day, this._d) : false,
                    isToday = compareDates(day, now),
                    hasEvent = opts.events.indexOf(day.toDateString()) !== -1 ? true : false,
                    isEmpty = i < before || i >= (days + before),
                    dayNumber = 1 + (i - before),
                    monthNumber = month,
                    yearNumber = year,
                    isStartRange = opts.startRange && compareDates(opts.startRange, day),
                    isEndRange = opts.endRange && compareDates(opts.endRange, day),
                    isInRange = opts.startRange && opts.endRange && opts.startRange < day && day < opts.endRange,
                    isDisabled = (opts.minDate && day < opts.minDate) ||
                                 (opts.maxDate && day > opts.maxDate) ||
                                 (opts.disableWeekends && isWeekend(day)) ||
                                 (opts.disableDayFn && opts.disableDayFn(day));

                if (isEmpty) {
                    if (i < before) {
                        dayNumber = daysInPreviousMonth + dayNumber;
                        monthNumber = previousMonth;
                        yearNumber = yearOfPreviousMonth;
                    } else {
                        dayNumber = dayNumber - days;
                        monthNumber = nextMonth;
                        yearNumber = yearOfNextMonth;
                    }
                }

                var dayConfig = {
                        day: dayNumber,
                        month: monthNumber,
                        year: yearNumber,
                        hasEvent: hasEvent,
                        isSelected: isSelected,
                        isToday: isToday,
                        isDisabled: isDisabled,
                        isEmpty: isEmpty,
                        isStartRange: isStartRange,
                        isEndRange: isEndRange,
                        isInRange: isInRange,
                        showDaysInNextAndPreviousMonths: opts.showDaysInNextAndPreviousMonths,
                        enableSelectionDaysInNextAndPreviousMonths: opts.enableSelectionDaysInNextAndPreviousMonths
                    };

                if (opts.pickWholeWeek && isSelected) {
                    isWeekSelected = true;
                }

                row.push(renderDay(dayConfig));

                if (++r === 7) {
                    if (opts.showWeekNumber) {
                        row.unshift(renderWeek(i - before, month, year));
                    }
                    data.push(renderRow(row, opts.isRTL, opts.pickWholeWeek, isWeekSelected));
                    row = [];
                    r = 0;
                    isWeekSelected = false;
                }
            }
            return renderTable(opts, data, randId);
        },

        isVisible: function()
        {
            return this._v;
        },

        show: function()
        {
            if (!this.isVisible()) {
                this._v = true;
                this.draw();
                removeClass(this.el, 'is-hidden');
                if (this._o.bound) {
                    addEvent(document, 'click', this._onClick);
                    this.adjustPosition();
                }
                if (typeof this._o.onOpen === 'function') {
                    this._o.onOpen.call(this);
                }
            }
        },

        hide: function()
        {
            var v = this._v;
            if (v !== false) {
                if (this._o.bound) {
                    removeEvent(document, 'click', this._onClick);
                }
                this.el.style.position = 'static'; // reset
                this.el.style.left = 'auto';
                this.el.style.top = 'auto';
                addClass(this.el, 'is-hidden');
                this._v = false;
                if (v !== undefined && typeof this._o.onClose === 'function') {
                    this._o.onClose.call(this);
                }
            }
        },

        /**
         * GAME OVER
         */
        destroy: function()
        {
            this.hide();
            removeEvent(this.el, 'mousedown', this._onMouseDown, true);
            removeEvent(this.el, 'touchend', this._onMouseDown, true);
            removeEvent(this.el, 'change', this._onChange);
            if (this._o.field) {
                removeEvent(this._o.field, 'change', this._onInputChange);
                if (this._o.bound) {
                    removeEvent(this._o.trigger, 'click', this._onInputClick);
                    removeEvent(this._o.trigger, 'focus', this._onInputFocus);
                    removeEvent(this._o.trigger, 'blur', this._onInputBlur);
                }
            }
            if (this.el.parentNode) {
                this.el.parentNode.removeChild(this.el);
            }
        }

    };

    return Pikaday;

}));


define('text!lib/forms/templates/date-time-template.html',[],function () { return '<input class="datepicker input-small-custom" value="{{ dateString }}" type="text" />\n<br>\n<table class="time-table">\n    <tr>\n        <td>\n        <input class="hours" value="{{ hoursString }}" type="number" min="01" max="12"/>\n        </td>\n        <td>\n        <input class="minutes" value="{{ minutesString }}" type="number"  min="00" max="59"/>\n        </td>\n        <td>\n        <input class="seconds" value="{{ secondsString }}" type="number"  min="00" max="59"/>\n        </td>\n        <td>\n        <select class="am_pm">\n          <option value="AM" {{#ifnot isPm}}selected{{/ifnot}}>AM</option>\n          <option value="PM" {{#if isPm}}selected{{/if}}>PM</option>\n        </select>\n\n        </td>\n    </tr>\n    <tr>\n        <td>\n            hours\n        </td>\n        <td>\n            minutes\n        </td>\n        <td>\n            seconds\n        </td>\n        <td>\n        </td>\n    </tr>\n</table>\n\n<!-- Somehow, we have to figure out how to make this AM/PM work because\n    12AM is 0 military and 12PM is 12 military\n    could be achieved by doing 12 modulo (%) but have 0 become 12\n    along with the general 24 modulo to ensure accurate hours\n-->\n';});


define('text!lib/forms/templates/media-editor-template.html',[],function () { return '<h2 style="margin:20px 30px 0px 0px;">Add Media aa{{ selected_photo }}</h2>\n<div class="attached-media-container">\n    <div class="upload-spot" id="left-panel-upload">\n        <button id="add-media-button" class="click-to-open" data-modal="modal-add-media"><i class="fa fa-plus" aria-hidden="true"></i></button>\n    </div>\n    {{#each children.photos.data}}\n        <div class="attached-container photo-attached">\n            <div class="attached-media" style="background: url(\'{{this.path_medium}}\');"></div>\n            <div class="attached-media-overlay">\n                <div class="hover-to-show {{#ifequal ../featured_image this.id}}featured{{/ifequal}}">\n                    <i class="fa {{#ifequal ../featured_image this.id}}fa-star{{else}}fa-star-o{{/ifequal}} featured" title="Click to select / unselect featured image" data-id="{{this.id}}" data-type="photos" media-name="{{this.name}}"></i>\n                    <i class="fa fa-times close detach_media" aria-hidden="true" data-id="{{this.id}}" data-type="photos" media-name="{{this.name}}"></i>\n                    <p>Featured</p>\n                </div>\n            </div>\n        </div>\n    {{/each}}\n    {{#each children.audio.data}}\n        <div class="attached-container audio-attached">\n            <div class="player-container audio-basic" data-id="{{this.id}}">\n                <!-- So far, a blank grey canvas came but there is not yet any audio player stuff coming in -->\n            </div>\n            <div class="attached-media-overlay">\n                <div class="hover-to-show">\n                    <i class="fa fa-times close detach_media" aria-hidden="true" data-id="{{this.id}}" data-type="audio" media-name="{{this.name}}"></i>\n                </div>\n            </div>\n        </div>\n    {{/each}}\n    {{#each children.videos.data}}\n        <div class="attached-container photo-attached">\n            <div class="attached-media" data-id="{{this.id}}">\n                {{#ifequal this.video_provider "vimeo"}}\n                    <iframe src="https://player.vimeo.com/video/{{this.video_id}}"\n                    style="width:100%;height:100%"\n                    frameborder="0">\n                    </iframe>\n                {{/ifequal}}\n        \n                {{#ifequal this.video_provider "youtube"}}\n                    <iframe src="https://www.youtube.com/embed/{{this.video_id}}?ecver=1"\n                    style="width:100%;height:100%"\n                    frameborder="0">\n                    </iframe>\n                {{/ifequal}}\n            </div>\n            <div class="attached-media-overlay video-hover">\n                <div class="hover-to-show video-hover">\n                    <i class="fa fa-times close detach_media" aria-hidden="true" data-id="{{this.id}}" data-type="videos" media-name="{{this.name}}"></i>\n                </div>\n            </div>\n        </div>\n    {{/each}}\n</div>\n';});

define('lib/forms/backbone-form-editors',[
    "jquery",
    "backbone",
    "handlebars",
    "models/association",
    "models/audio",
    "apps/gallery/views/add-media",
    "lib/audio/audio-player",
    "external/pikaday-forked",
    "https://cdnjs.cloudflare.com/ajax/libs/date-fns/1.28.5/date_fns.min.js",
    "text!../forms/templates/date-time-template.html",
    "text!../forms/templates/media-editor-template.html",
    "form"
], function ($, Backbone, Handlebars, Association, Audio, AddMedia, AudioPlayer,
             Pikaday, dateFns, DateTimeTemplate, MediaTemplate) {
    "use strict";

    Backbone.Form.editors.Rating = Backbone.Form.editors.Select.extend({
        getValue: function () {
            var value = this.$el.val();
            return parseInt(value, 10);
        }
    });

    Backbone.Form.editors.DatePicker = Backbone.Form.editors.Text.extend({

        initialize: function (options) {
            Backbone.Form.editors.Text.prototype.initialize.call(this, options);
            this.$el.addClass('datepicker input-small-custom');
        },
        getValue: function () {
            var value = this.$el.val();
            return value;
        },
        render: function () {
            Backbone.Form.editors.Text.prototype.render.apply(this, arguments);
            var picker = new Pikaday({
                field: this.$el[0],
                format: "YYYY-MM-DDThh:mm",
                toString: function (date, format) {
                    return dateFns.format(date, format);
                }
            });
            return this;
        }
    });

    Backbone.Form.editors.DateTimePicker = Backbone.Form.editors.Base.extend({
        tagName: "div",
        picker: null,
        format: "YYYY-MM-DD",
        initialize: function (options) {
            options.schema.validators = [this.dateTimeValidator];
            Backbone.Form.editors.Text.prototype.initialize.call(this, options);
            var template = Handlebars.compile(DateTimeTemplate);
            if (!this.value) {
                this.$el.append(template({
                    hoursString: "00",
                    minutesString: "00",
                    secondsString: "00"
                }));
                return;
            }
            var hours = parseInt(dateFns.format(this.value, 'HH'));
            var isPm = hours >= 12 ? true: false;
            var ds = dateFns.format(this.value, this.format);
            console.log('initialize:', ds);
            this.$el.append(template(
                {
                    dateString: ds,
                    hoursString: dateFns.format(this.value, 'hh'),
                    minutesString: dateFns.format(this.value, 'mm'),
                    secondsString: dateFns.format(this.value, 'ss'),
                    am_pm_String: dateFns.format(this.value, 'a'),
                    hours: hours,
                    isPm: isPm
                })
            );
        },
        dateTimeValidator: function (value, formValues) {
            try {
                var d = new Date(value);
                if (d == "Invalid Date") {
                    return {
                        type: 'date',
                        message: 'Invalid date / time value. Format is: YYYY-MM-DDThh:mm:ss. Please try again.'
                    };
                }
            } catch (ex) {
                return {
                    type: 'date',
                    message: 'Invalid date / time value. Format is: YYYY-MM-DDThh:mm:ss. Please try again.'
                };
            }
            return null;
        },
        getValue: function () {
            //contatenate the date and time input values
            var date = dateFns.format(this.$el.find('input.datepicker').val(), this.format),
                dateStr = this.$el.find('.datepicker').val(),
                am_pm = this.$el.find('.am_pm').val(),
                hours = this.$el.find('.hours').val(),
                hours00 = hours.substr(hours.length - 2),
                hourInt = parseInt(hours00, 10),
                minutes = this.$el.find('.minutes').val(),
                minutes00 = minutes.substr(minutes.length - 2),
                minuteInt = parseInt(minutes00, 10),
                seconds = this.$el.find('.seconds').val(),
                seconds00 = seconds.substr(seconds.length - 2),
                secondInt = parseInt(seconds00, 10),
                val;

            if (am_pm == "PM") {
                hourInt = hourInt < 12 ? hourInt + 12 : 12;
                hours00 = String(hourInt);
            } else {
                if (hourInt < 10) {
                    hours00 = "0" + String(hourInt);
                } else if (hourInt == 12) {
                    hours00 = "00";
                }
            }

            if (minuteInt < 10) {
                minutes00 = "0" + String(minuteInt);
            } else if (minuteInt == 0) {
                minutes00 = "00";
            }

            if (secondInt < 10) {
                seconds00 = "0" + String(secondInt);
            } else if (secondInt == 0) {
                seconds00 = "00";
            }

            if (dateStr === ''){
                return null;
            }

            if (date === '1969-12-31') {
                return '';
            }

            val = date + "T" + hours00 + ":" + minutes00 + ":" + seconds00;
            console.log('getValue:', val);
            return val;
        },
        render: function () {
            Backbone.Form.editors.Base.prototype.render.apply(this, arguments);
            var that = this;
            this.picker = new Pikaday({
                field: this.$el.find('.datepicker')[0],
                format: this.format,
                blurFieldOnSelect: false,
                defaultDate: this.$el.find('.datepicker').val(),
                onSelect: function (date, format) {
                },
                toString: function (date, format) {
                    var s = dateFns.format(date, format);
                    if (s === '1969-12-31') {
                        return "";
                    }
                    return s;
                }
            });
            //this.picker.setDate(this.value);
            return this;
        }
    });

    Backbone.Form.editors.MediaEditor = Backbone.Form.editors.Base.extend({

        events: {
            'click #add-media-button': 'showMediaBrowser',
            'click .detach_media': 'detachModel',
            'click .fa-star-o': 'addStar',
            'click .fa-star': 'removeStar'
        },

        tagName: "div",

        initialize: function (options) {
            Backbone.Form.editors.Base.prototype.initialize.call(this, options);
            this.app = this.form.app;
            this.listenTo(this.model, 'add-models-to-marker', this.attachModels);
            this.template = Handlebars.compile(MediaTemplate);
        },
        attachModels: function (models) {
            var errors = this.form.commit({ validate: true }),
                that = this;
            if (errors) {
                console.log("errors: ", errors);
                return;
            }
            this.model.save(null, {
                success: function () {
                    that.attachMedia(models);
                }
            });
            this.app.vent.trigger('hide-modal');
        },
        /*
        * Attach Media and Detach Model calls the following that causes
        * the current unsaved values of fields in HTML form to be reset to stored values:
        *
        * that.model.fetch({reset: true});
        */
        attachMedia: function (models) {
            var that = this,
                i,
                ordering,
                fetch = function () {
                    that.model.fetch({reset: true});
                };
            for (i = 0; i < models.length; ++i) {
                ordering = this.model.get("photo_count") + this.model.get("audio_count");
                this.model.attach(models[i], (ordering + i + 1));
            }
            //fetch and re-render model:
            if (models.length > 0) { setTimeout(fetch, 800); }
        },
        detachModel: function (e) {
            var $elem = $(e.target),
                attachmentType = $elem.attr("data-type"),
                attachmentID = $elem.attr("data-id"),
                that = this;
            this.model.detach(attachmentType, attachmentID, function () {
                that.model.fetch({reset: true});
            });
        },
        showMediaBrowser: function (e) {
            var addMediaLayoutView = new AddMedia({
                app: this.app,
                parentModel: this.model
            });
            this.app.vent.trigger("show-modal", {
                title: 'Media Browser',
                width: 1100,
                height: 400,
                view: addMediaLayoutView,
                saveButtonText: "Add",
                showSaveButton: true,
                saveFunction: addMediaLayoutView.addModels.bind(addMediaLayoutView),
            });
            addMediaLayoutView.showUploader();
            e.preventDefault();
        },
        getValue: function () {
            return null;
        },
        render: function () {
            //re-render the child template:
            this.$el.empty().append(this.template({
                children: this.model.get("children"),
                featured_image: this.getFeaturedImage()
            }));
            Backbone.Form.editors.Base.prototype.render.apply(this, arguments);
            this.renderAudioPlayers();
            this.enableMediaReordering();
            return this;
        },
        getFeaturedImage: function () {
            var extras = this.model.get("extras") || {};
            return extras.featured_image;
        },
        renderAudioPlayers: function () {
            var audio_attachments = [],
                that = this,
                player,
                $elem;
            if (this.model.get("children") && this.model.get("children").audio) {
                audio_attachments = this.model.get("children").audio.data;
            }
            _.each(audio_attachments, function (item) {
                $elem = that.$el.find(".audio-basic[data-id='" + item.id + "']")[0];
                player = new AudioPlayer({
                    model: new Audio(item),
                    audioMode: "basic",
                    app: that.app
                });
                $elem.append(player.$el[0]);
            });
        },
        enableMediaReordering: function () {
            var sortableFields = this.$el.find(".attached-media-container"),
                that = this,
                newOrder,
                attachmentType,
                attachmentID,
                association;
            sortableFields.sortable({
                helper: this.fixHelper,
                items : '.attached-container',
                update: function (event, ui) {
                    newOrder = ui.item.index();
                    attachmentType = ui.item.find('.detach_media').attr("data-type");
                    attachmentID = ui.item.find('.detach_media').attr("data-id");
                    association = new Association({
                        model: that.model,
                        attachmentType: attachmentType,
                        attachmentID: attachmentID
                    });
                    association.save({ ordering: newOrder}, {patch: true});
                }
            }).disableSelection();
        },

        fixHelper: function (e, ui) {
            //not sure what this does:
            ui.children().each(function () {
                $(this).width($(this).width());
            });
            return ui;
        },
        removeStars: function () {
            this.$el.find(".hover-to-show.featured").removeClass("featured");
            this.$el.find("i.fa-star").removeClass("fa-star").addClass("fa-star-o");
        },
        addStar: function (e) {
            this.removeStars();
            var $elem = $(e.target),
                extras = this.model.get("extras") || {};
            $elem.removeClass("fa-star-o").addClass("fa-star");
            $elem.parent().addClass("featured");
            extras.featured_image = parseInt($elem.attr("data-id"), 10);
            this.model.save({extras: JSON.stringify(extras)}, {patch: true, parse: false});
            this.model.set("extras", extras);
        },
        removeStar: function () {
            this.removeStars();
            var extras = this.model.get("extras") || {};
            delete extras.featured_image;
            this.model.save({extras: JSON.stringify(extras)}, {patch: true, parse: false});
            this.model.set("extras", extras);
        }
    });
});

define('lib/forms/backbone-form',[
    "jquery",
    "backbone",
    "underscore",
    "form",
    "form-list",
    "lib/forms/backbone-form-editors"
], function ($, Backbone, _) {
    "use strict";
    var DataForm = Backbone.Form.extend({
        initialize: function (options) {
            _.extend(this, options);
            Backbone.Form.prototype.initialize.call(this, options);
        },
        render: function () {
            Backbone.Form.prototype.render.call(this);
            this.removeLabelFromMediaEditor();
            return this;
        },
        removeLabelFromMediaEditor: function () {
            //super hacky; not proud of this:
            this.$el.find("label").each(function () {
                if ($(this).attr("for").indexOf("children") != -1) {
                    $(this).remove();
                }
            });
        }
    });
    return DataForm;
});

define('apps/gallery/views/data-detail',[
    "jquery",
    "underscore",
    "handlebars",
    "marionette",
    "collections/photos", "collections/audio", "collections/videos",
    "text!../templates/photo-detail.html",
    "text!../templates/audio-detail.html",
    "text!../templates/video-detail.html",
    "text!../templates/record-detail.html",
    "text!../templates/map-image-detail.html",
    "lib/audio/audio-player",
    "lib/carousel/carousel",
    "lib/maps/overlays/icon",
    "lib/forms/backbone-form"
], function ($, _, Handlebars, Marionette, Photos, Audio, Videos, PhotoTemplate, AudioTemplate, VideoTemplate, SiteTemplate,
        MapImageTemplate, AudioPlayer, Carousel, Icon, DataForm) {
    "use strict";
    var MediaEditor = Marionette.ItemView.extend({
        events: {
            'click .view-mode': 'switchToViewMode',
            'click .edit-mode': 'switchToEditMode',
            'click .save-model': 'saveModel',
            'click .delete-model': 'deleteModel',
            'click .hide': 'hideMapPanel',
            'click .show': 'showMapPanel',
            'click .rotate-left': 'rotatePhoto',
            'click .rotate-right': 'rotatePhoto',
            "click #add-geometry": "activateMarkerTrigger",
            "click #delete-geometry": "deleteMarkerTrigger",
            "click #add-rectangle": "activateRectangleTrigger",
            "click .streetview": 'showStreetView'
        },
        getTemplate: function () {
            console.log(this.dataType);
            if (this.dataType == "photos") {
                return Handlebars.compile(PhotoTemplate);
            }
            if (this.dataType == "audio") {
                return Handlebars.compile(AudioTemplate);
            }
            if (this.dataType == "videos") {
                return Handlebars.compile(VideoTemplate);
            }
            if (this.dataType == "map_images") {
                return Handlebars.compile(MapImageTemplate);
            }
            return Handlebars.compile(SiteTemplate);
        },
        featuredImageID: null,
        initialize: function (opts) {
            _.extend(this, opts);
            this.bindFields();
            this.dataType = this.dataType || this.app.dataType;
            Marionette.ItemView.prototype.initialize.call(this);
            this.listenTo(this.app.vent, 'save-model', this.saveModel);
            this.listenTo(this.app.vent, 'streetview-hidden', this.updateStreetViewButton);
        },
        activateRectangleTrigger: function () {
            $('body').css({ cursor: 'crosshair' });
            this.app.vent.trigger("add-new-marker", this.model);
            this.app.vent.trigger("add-rectangle", this.model);
        },

        activateMarkerTrigger: function () {
            if (this.$el.find('#drop-marker-message').get(0)) {
                //button has already been clicked
                return;
            }
            this.$el.find("#add-marker-button").css({
                background: "#4e70d4",
                color: "white"
            });
            this.$el.find(".add-lat-lng").append("<p id='drop-marker-message'>click on the map to add location</p>");
            //Define Class:
            var that = this, MouseMover, $follower, mm;
            MouseMover = function ($follower) {
                var icon;
                this.generateIcon = function () {
                    var template, shape;
                    template = Handlebars.compile('<svg viewBox="{{ viewBox }}" width="{{ width }}" height="{{ height }}">' +
                        '    <path fill="{{ fillColor }}" paint-order="stroke" stroke-width="{{ strokeWeight }}" stroke-opacity="0.5" stroke="{{ fillColor }}" d="{{ path }}"></path>' +
                        '</svg>');
                    shape = that.model.get("overlay_type");
                    // If clicking an add new and click on marker, there is no overlay_type found
                    //*
                    // If outside, then save the model
                    // and add it to the end of the list so the marker
                    // so that new markers can be added seamlessly
                    if (shape.indexOf("form_") != -1) {
                        shape = "marker";
                    }
                    //*/
                    else {
                        console.log("The current form of adding marker on empty form is buggy");
                    }
                    icon = new Icon({
                        shape: shape,
                        strokeWeight: 6,
                        fillColor: that.model.collection.fillColor,
                        width: that.model.collection.size,
                        height: that.model.collection.size
                    }).generateGoogleIcon();
                    icon.width *= 1.5;
                    icon.height *= 1.5;
                    $follower.html(template(icon));
                    $follower.show();
                };
                this.start = function () {
                    this.generateIcon();
                    $(window).bind('mousemove', this.mouseListener);
                };
                this.stop = function (event) {
                    $(window).unbind('mousemove');
                    $follower.remove();
                    that.app.vent.trigger("place-marker", {
                        x: event.clientX,
                        y: event.clientY
                    });
                };
                this.mouseListener = function (event) {
                    $follower.css({
                        top: event.clientY - icon.height * 3 / 4 + 4,
                        left: event.clientX - icon.width * 3 / 4
                    });
                };
            };

            //Instantiate Class and Add UI Event Handlers:
            $follower = $('<div id="follower"></div>');
            $('body').append($follower);
            mm = new MouseMover($follower);
            $(window).mousemove(mm.start.bind(mm));
            $follower.click(mm.stop);
            this.app.vent.trigger("add-new-marker", this.model);
        },

        deleteMarkerTrigger: function () {
            this.commitForm();
            this.app.vent.trigger("delete-marker", this.model);
        },

        bindFields: function () {
            if (!this.model || !this.model.get("overlay_type")) {
                return;
            }
            var i, f;
            if (this.model.get("overlay_type").indexOf("form_") != -1) {
                for (i = 0; i < this.model.get("fields").length; i++) {
                    /* https://github.com/powmedia/backbone-forms */
                    f = this.model.get("fields")[i];
                    f.val = this.model.get(f.col_name);
                }
            }
        },

        modelEvents: {
            "change:children": "render",
            "commit-data-no-save": "commitForm"
        },
        switchToViewMode: function () {
            this.app.mode = "view";
            this.app.vent.trigger('mode-change');
            this.render();
        },
        switchToEditMode: function () {
            this.app.mode = "edit";
            this.app.vent.trigger('mode-change');
            this.render();
        },
        switchToAddMode: function () {
            this.app.mode = "add";
            this.render();
        },
        templateHelpers: function () {
            var lat, lng, paragraph;
            if (this.model.get("geometry") && this.model.get("geometry").type === "Point") {
                lat =  this.model.get("geometry").coordinates[1].toFixed(4);
                lng =  this.model.get("geometry").coordinates[0].toFixed(4);
            }

            if (this.panelStyles) {
                paragraph = this.panelStyles.paragraph;
                this.$el.find('#marker-detail-panel').css('background-color', '#' + paragraph.backgroundColor);
                this.$el.find('.active-slide').css('background', 'paragraph.backgroundColor');
            }

            return {
                mode: this.app.mode,
                dataType: this.dataType,
                audioMode: "detail",
                name: this.model.get("name") || this.model.get("display_name"),
                screenType: this.app.screenType,
                lat: lat,
                lng: lng,
                paragraph: paragraph,
                featuredImage: this.getFeaturedImage(),
                photo_count: this.getPhotos().length,
                audio_count: this.getAudio().length,
                video_count: this.getVideos().length,
            };
        },

        getFeaturedImage: function () {
            if (!this.model.get("children") || !this.model.get("extras") || !this.model.get("children").photos) {
                return null;
            }
            var featuredID = this.model.get("extras").featured_image,
                photoData = this.model.get("children").photos.data,
                i;
            for (i = 0; i < photoData.length; ++i) {
                if (photoData[i].id === featuredID) {
                    return photoData[i];
                }
            }
            return null;
        },
        getPhotos: function () {
            var children = this.model.get("children") || {},
                featuredImage = this.getFeaturedImage(),
                photos = children.photos ? new Photos(children.photos.data) : new Photos([]);
            if (featuredImage) {
                photos.remove(photos.get(featuredImage.id));
            }
            return photos;
        },
        getAudio: function () {
            var children = this.model.get("children") || {};
            return children.audio ? new Audio(children.audio.data) : new Audio([]);
        },
        getVideos: function () {
            var children = this.model.get("children") || {};
            return children.videos ? new Videos(children.videos.data) : new Videos([]);
        },
        viewRender: function () {
            //any extra view logic. Carousel functionality goes here
            var c,
                photos = this.getPhotos(),
                videos = this.getVideos(),
                audio = this.getAudio(), 
                that = this;
                console.log(audio);
            if (this.panelStyles) {
                var panelStyles = this.panelStyles;
            }

            if (photos.length > 0) {
                c = new Carousel({
                    model: this.model,
                    app: this.app,
                    featuredImage: this.getFeaturedImage(),
                    mode: "photos",
                    collection: photos,
                    panelStyles: panelStyles
                });
                this.$el.find(".carousel-photo").append(c.$el);
            }
            if (videos.length > 0) {
                c = new Carousel({
                    model: this.model,
                    app: this.app,
                    mode: "videos",
                    collection: videos,
                    panelStyles: panelStyles
                });
                this.$el.find(".carousel-video").append(c.$el);
            }
            if (audio.length > 0) {
                /*
                c = new Carousel({
                    model: this.model,
                    app: this.app,
                    mode: "audio",
                    collection: audio,
                    panelStyles: panelStyles
                });
                */
                audio.forEach(function (audioTrack) {
                    c = new AudioPlayer({
                        model: audioTrack,
                        app: that.app,
                        panelStyles: panelStyles,
                        audioMode: "detail",
                        className: "audio-detail"
                    });
                    that.$el.find(".carousel-audio").append(c.$el);
                });                
            }
        },
        editRender: function () {
            if (this.form) {
                this.form.remove();
            }
            this.form = new DataForm({
                model: this.model,
                schema: this.model.getFormSchema(),
                app: this.app
            }).render();
            this.$el.find('#model-form').append(this.form.$el);
        },

        onRender: function () {
            if (this.app.mode == "view" || this.app.mode == "presentation") {
                this.viewRender();
            } else {
                this.editRender();
            }
            if (this.dataType == "audio") {
                var player = new AudioPlayer({
                    model: this.model,
                    audioMode: "detail",
                    app: this.app
                });
                this.$el.find(".player-container").append(player.$el);
            }

        },

        rotatePhoto: function (e) {
            var $elem = $(e.target),
                rotation = $elem.attr("rotation");
            this.$el.find(".rotate-message").show();
            this.$el.find(".edit-photo").css({
                filter: "brightness(0.4)"
            });
            this.model.rotate(rotation);
        },
        commitForm: function () {
            var errors = this.form.commit({ validate: true });
            if (errors) {
                console.log("errors: ", errors);
                return;
            }
        },

        saveModel: function () {
            var that = this,
                isNew = this.model.get("id") ? false : true;
            this.commitForm();
            this.model.save(null, {
                success: function (model, response) {
                    //perhaps some sort of indication of success here?
                    that.app.vent.trigger('success-message', "The form was saved successfully");
                    if (!isNew) {
                        model.trigger('saved');
                    } else {
                        model.collection.add(model);
                    }
                },
                error: function (model, response) {

                    that.app.vent.trigger('error-message', "The form has not saved");
                    that.$el.find("#model-form").append("error saving");
                }
            });
        },
        deleteModel: function (e) {
            var that = this;
            if (!confirm("Are you sure you want to delete this entry?")) {
                return;
            }
            this.model.destroy({
                success: function () {
                    //trigger an event that clears out the deleted model's detail:
                    that.app.vent.trigger('hide-detail');
                }
            });
            e.preventDefault();
        },
        doNotDisplay: function () {
            this.$el.html("");
        },
        hideMapPanel: function (e) {
            $(e.target).removeClass("hide").addClass("show");
            this.app.vent.trigger('hide-detail');
            e.preventDefault();
        },
        showMapPanel: function (e) {
            $(e.target).removeClass("show").addClass("hide");
            this.app.vent.trigger('unhide-detail');
            e.preventDefault();
        },
        showStreetView: function (e) {
            var $elem = $(e.target);
            if ($elem.html() === "Show Street View") {
                this.app.vent.trigger('show-streetview', this.model);
                $elem.html('Show Map');
            } else {
                $elem.html('Show Street View');
                this.app.vent.trigger('hide-streetview');
            }
            e.preventDefault();
        },
        updateStreetViewButton: function () {
            this.$el.find('.streetview').html('Show Street View');
        }
    });
    return MediaEditor;
});

/**AppUtilities defines a set of mixin properties that perform many of the same functions as the old
 *'sb' object, minus event aggregation.  I'm separating it out into this file just to keep track of what
 *to keep a centralized record of these function to perhaps remove later (possibly getMap/setMap, things
 *like that
 */
define('lib/appUtilities',["jquery"],
    function ($) {
        "use strict";
        return {

            addMessageListeners: function(){
                this.listenTo(this.vent, 'success-message', this.showSuccessMessage);
                this.listenTo(this.vent, 'warning-message', this.showWarningMessage);
                this.listenTo(this.vent, 'error-message', this.showFailureMessage);
            },

            saveState: function (key, obj, replace) {
                this.saveToLocalStorage(key, obj, replace);
            },
            restoreState: function (key) {
                return this.getFromLocalStorage(key);
            },
            getFromLocalStorage: function (key) {
                var cache = localStorage.mapplication;
                if (!cache) { return null; }
                try {
                    cache = JSON.parse(cache);
                } catch (e) {
                    return null;
                }
                //console.log(cache);
                return cache[key];
            },
            saveToLocalStorage: function (key, object, replace) {
                var cache = localStorage.mapplication;
                cache = !cache ? {} : JSON.parse(cache);
                cache[key] = cache[key] || {};
                if (replace) {
                    cache[key] = object;
                } else {
                    $.extend(cache[key], object);
                }
                localStorage.mapplication = JSON.stringify(cache);
            },
            setMap: function (map) {
                //not sure if this makes sense to do here
                this.map = map;
            },
            getMap: function () {
                //not sure if this makes sense to do here
                return this.map;
            },
            setMode: function (mode) {
                this.mode = mode;
                this.vent.trigger('mode-change');
            },
            getMode: function () {
                return this.mode;
            },
            setOverlayView: function (overlayView) {
                this.overlayView = overlayView;
            },
            getOverlayView: function () {
                return this.overlayView;
            },
            csrfSafeMethod: function (method) {
                // these HTTP methods do not require CSRF protection
                return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
            },
            sameOrigin: function (url) {
                // test that a given url is a same-origin URL
                // url could be relative or scheme relative or absolute
                var host = document.location.host,
                    protocol = document.location.protocol,
                    sr_origin = '//' + host,
                    origin = protocol + sr_origin;
                // Allow absolute or scheme relative URLs to same origin
                return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
                    (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
                    // or any other URL that isn't scheme relative or absolute i.e relative.
                    !(/^(\/\/|http:|https:).*/.test(url));
            },
            setCsrfToken: function (xhr, settings) {
                if (!this.csrfSafeMethod(settings.type) && this.sameOrigin(settings.url)) {
                    var csrf = this.getCookie('csrftoken');
                    xhr.setRequestHeader("X-CSRFToken", csrf);
                    xhr.setRequestHeader("HTTP_X_CSRFTOKEN", csrf);
                }
            },
            getCookie: function (name) {
                var cookieValue, cookies, i, cookie;
                if (document.cookie && document.cookie != '') {
                    cookies = document.cookie.split(';');
                    for (i = 0; i < cookies.length; i++) {
                        cookie = $.trim(cookies[i]);
                        // Does this cookie string begin with the name we want?
                        if (cookie.substring(0, name.length + 1) == (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            },
            getProjectFromParam: function () {
                var id = this.getParameterByName('project_id');
                if (id) {
                    return this.projects.get(id);
                }
                return null;
            },
            getProjectFromLocalStorage: function () {
                var id = this.restoreState('project_id');
                if (id) {
                    return this.projects.get(id);
                }
                return null;
            },
            getProjectID: function () {
                var id = this.getParameterByName('project_id'),
                    redirectURL = "/";
                if (!id) {
                    id = this.restoreState('project_id');
                } else {
                    this.setProjectID(id);
                }
                if (!id) {
                    console.log("You're not logged in. Redirecting to: " + redirectURL);
                    //window.location = redirectURL;
                    return false;
                }
                return id;
            },
            setProjectID: function (id) {
                this.saveState('project_id', id, true);
            },
            selectProject: function () {
                //TODO: Deprecate
                //1. get project from request parameter:
                this.selectedProject = this.getProjectFromParam();
                //2. get project from localStorage:
                if (!this.selectedProject) {
                    this.selectedProject = this.getProjectFromLocalStorage();
                }
                //3. pick one:
                if (!this.selectedProject) {
                    this.selectedProject = this.projects.at(0);
                }
                if (!this.selectedProject) {
                    console.log("You're not logged in. Redirecting...");
                    window.location = window.location.host + "/accounts/login/?next=" + window.location;
                } else {
                    //save to local storage:
                    this.saveState("project_id", this.selectedProject.id, true);
                }
            },
            showLoadingMessage: function () {
                //console.log("show loading message");
            },
            hideLoadingMessage: function () {
                //console.log("hide loading message");
            },
            handleDatabaseError: function (options, response) {
                var responseJSON,
                    message = "";
                try {
                    responseJSON = JSON.parse(response.responseText);
                    message = responseJSON.non_field_errors[0];
                } catch (e) {
                    message = "Unknown error";
                }
                this.vent.trigger('database-error', {
                    message: message
                });
            },

            showSuccessMessage: function (message) {
                console.log("Success Message Called");
                if ($(".success-message").length == 0) {
                    $('body').append($('<div class="success-message"></div>'));
                }
                $(".success-message").html(message).fadeIn(200).delay(3000).fadeOut(1500);
            },

            showFailureMessage: function (message) {
                if ($(".failure-message").length == 0) {
                    $('body').append($('<div class="failure-message"></div>'));
                }
                $(".failure-message").html(message).fadeIn(200).delay(3000).fadeOut(1500);
            },

            showWarningMessage: function (message) {
                if ($(".warning-message").length == 0) {
                    $('body').append($('<div class="warning-message"></div>'));
                }
                $(".warning-message").html(message).fadeIn(200).delay(3000).fadeOut(1500);
            },

            initAJAX: function (options) {
                // adding some global AJAX event handlers for showing messages and
                // appending the Django authorization token:
                console.log('init ajax');
                var that = this;
                $.ajaxSetup({
                    beforeSend: function (xhr, settings) {
                        that.showLoadingMessage();
                        that.setCsrfToken(xhr, settings);
                    },
                    complete: this.hideLoadingMessage,
                    statusCode: {
                        400: that.handleDatabaseError.bind(this, options),
                        401: that.handleDatabaseError.bind(this, options),
                        500: that.handleDatabaseError.bind(this, options)
                    }
                });
            },
            getParameterByName: function (name, url) {
                if (!url) {
                    url = window.location.href;
                }
                name = name.replace(/[\[\]]/g, "\\$&");
                var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                    results = regex.exec(url);
                if (!results) {
                    return null;
                }
                if (!results[2]) {
                    return '';
                }
                return decodeURIComponent(results[2].replace(/\+/g, " "));
            }
        };
    });

define('apps/presentation/presentation-app',[
    "marionette",
    "backbone",
    "apps/presentation/router",
    "lib/maps/basemap",
    "lib/data/dataManager",
    "models/map",
    'collections/layers',
    //"apps/presentation/views/marker-overlays",
    "apps/presentation/views/layer-list-manager",
    "apps/presentation/views/map-header",
    "apps/gallery/views/data-detail",
    "lib/appUtilities",
    "lib/handlebars-helpers"
], function (Marionette, Backbone, Router, Basemap, DataManager, Map, Layers,
             LegendView, MapHeaderView, DataDetail, appUtilities) {
    "use strict";
    var PresentationApp = Marionette.Application.extend(_.extend(appUtilities, {
        regions: {
            container: ".main-panel",
            titleRegion: "#presentation-title",
            legendRegion: "#legend",
            mapRegion: "#map-panel",
            sideRegion: "#marker-detail-panel"
        },
        screenType: "presentation",
        showLeft: false,
        mode: "view",
        start: function (options) {
            // declares any important global functionality;
            // kicks off any objects and processes that need to run
            Marionette.Application.prototype.start.apply(this, [options]);
            this.initAJAX(options);
            this.router = new Router({ app: this});
            Backbone.history.start();

            //map slug needs to be in the url:
            var slug = Backbone.history.getFragment();
            /*if (slug === "") {
                alert("map slug must be included");
                return;
            }*/
            this.fetchMap(slug);
            this.listenTo(this.vent, 'fetch-map', this.fetchMap);
            this.listenTo(this.vent, 'data-loaded', this.loadRegions);
            this.listenTo(this.vent, 'show-detail', this.showMediaDetail);
            this.addMessageListeners();
        },
        fetchErrors: false,
        getMode: function () {
            return "view";
        },

        fetchMap: function (slug) {
            this.slug = slug;
            this.model = new Map();
            this.model.getMapBySlug({
                slug: this.slug,
                successCallback: this.getData.bind(this),
                errorCallback: this.getSlugFromLocalStorage.bind(this)
            });
        },

        getData: function () {
            this.saveState("presentation", {slug: this.slug });
            this.setProjectID(this.model.get("project_id"));
            this.dataManager = new DataManager({ vent: this.vent, projectID: this.getProjectID() });
            console.log(this.model.get("panel_styles").display_legend);
        },

        getSlugFromLocalStorage: function () {
            if (this.fetchErrors) {
                alert("map slug must be included");
            }
            this.fetchErrors = true;
            var newSlug = this.restoreState("presentation").slug;
            if (newSlug !== this.slug) {
                this.router.navigate("//" + newSlug);
            } else {
                alert("map slug must be included");
            }
        },

        loadRegions: function () {
            this.showMapTitle();
            this.showBasemap();
            if (this.model.get("panel_styles").display_legend === false) {
                this.hideLegend();
            } else {
                this.showLegend();
            }
        },

        showBasemap: function () {
            this.basemapView = new Basemap({
                app: this,
                activeMapTypeID: this.model.get("basemap"),
                zoom: this.model.get("zoom"),
                center: {
                    lat: this.model.get("center").coordinates[1],
                    lng: this.model.get("center").coordinates[0]
                },
                showSearchControl: false,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.SMALL,
                    position: google.maps.ControlPosition.LEFT_BOTTOM
                },
                streetViewControlOptions: {
                    position: google.maps.ControlPosition.LEFT_BOTTOM
                },
                rotateControlOptions: {
                    position: google.maps.ControlPosition.LEFT_BOTTOM
                }
            });
            this.mapRegion.show(this.basemapView);
        },

        showMapTitle: function () {
            this.mapHeaderView = new MapHeaderView({ model: this.model });
            this.titleRegion.show(this.mapHeaderView);
        },

        instantiateLegendView: function () {
            this.legendView = new LegendView({
                app: this,
                collection: new Layers(
                    this.model.get("layers"),
                    { mapID: this.model.get("id") }
                ),
                model: this.model
            });
            this.legendRegion.show(this.legendView);
        },

        hideLegend: function () {
            this.instantiateLegendView();
            this.legendRegion.$el.hide();
            this.legendRegion.show(this.legendView);
            this.vent.trigger('show-all-markers');
        },
        showLegend: function () {
            this.instantiateLegendView();
            this.legendRegion.$el.show();
        },

        updateDisplay: function () {
            var className = "none";
            if (this.showLeft) {
                className = "left";
            }
            this.container.$el.removeClass("left none");
            this.container.$el.addClass(className);
            this.basemapView.redraw({
                time: 500
            });
        },
        showMediaDetail: function (opts) {
            var dataEntry = this.dataManager.getData(opts.dataType),
                collection = dataEntry.collection,
                model = collection.get(opts.id);
            if (opts.dataType == "markers" || opts.dataType.indexOf("form_") != -1) {
                if (!model.get("children")) {
                    model.fetch({"reset": true});
                }
            }
            if (opts.dataType.indexOf("form_") != -1) {
                model.set("fields", dataEntry.fields.toJSON());
            }
            model.set("active", true);
            this.vent.trigger('highlight-marker', model);
            console.log(opts, opts.dataType, dataEntry, this.model);
            this.detailView = new DataDetail({
                model: model,
                app: this,
                dataType: opts.dataType,
                panelStyles: this.model.get('panel_styles')
            });


            var paragraph = this.model.get('panel_styles').paragraph;
            if (paragraph) {
                console.log(paragraph.color);
               $('#marker-detail-panel').css('background-color', '#' + paragraph.backgroundColor);
            }
        
            this.sideRegion.show(this.detailView);
            this.unhideDetail();
        },

        unhideDetail: function () {
            this.showLeft = true;
            this.updateDisplay();
        }
    }));
    return PresentationApp;
});

var configPath = (configPath || '') + 'require-config';
require([configPath], function () {
    'use strict';
    require(["jquery", "apps/presentation/presentation-app"], function ($, PresentationApp) {
        $(function () {
            var presentationApp = new PresentationApp();
            presentationApp.start();
        });
    });
});



define("apps/presentation/kickoff", function(){});
