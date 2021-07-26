!function(t,e){if("object"==typeof exports&&"object"==typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n=e();for(var r in n)("object"==typeof exports?exports:t)[r]=n[r]}}(this,function(){return r={},a.m=n=[function(t,e,n){"use strict";n.r(e);var a={isDate:function(t,e){if(void 0===t||"Invalid Date"==new Date(t))return e},isEmptyString:function(t,e){if(void 0===t||0===t.trim().length)return e},isArray:function(t,e){if("[object array]"!==Object.prototype.toString.call(t))return e},isObject:function(t,e){if("[object object]"!==Object.prototype.toString.call(t)||"{}"!==JSON.stringify(t))return e}};function r(){this.cache=[]}r.prototype.add=function(t,e,n){var r=t.split(":");this.cache.push(function(){var t=r.shift();return r.unshift(e),r.push(n),a[t].apply(null,r)})},r.prototype.start=function(){for(var t,e=this.cache,n=0;t=e[n++];){var r=t();if(r)return r}};var i=r,o=function(){return navigator&&-1<("Netscape"==navigator.appName?navigator.language:navigator.browserLanguage).indexOf("en")?"en":"zh"},s={en_months:["January","February","March","April","May","June","July","August","September","October","November","December"],en_weekDays:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],zh_months:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],zh_weekDays:["星期天","星期一","星期二","星期三","星期四","星期五","星期六"]};function u(t,e){this.lan=e||o(),this.date=t?new Date(t):new Date,this.needReplaceType=["HH","MM","mm","ss","DD"],this.zh_weekDays=s.zh_weekDays,this.zh_months=s.zh_months,this.en_weekDays=s.en_weekDays,this.en_months=s.en_months,this.countData={},this.clearCb=null,this.hooks={defaultFormat:"YYYY/MM/DD HH:mm:ss d"}}u.prototype.getCurrentDates=function(t){return{Y:t.getFullYear(),M:t.getMonth()+1,D:t.getDate(),d:t.getDay(),H:t.getHours(),m:t.getMinutes(),s:t.getSeconds()}},u.prototype.replaceDate=function(t,e){if(e[t[0]]+"")return-1<this.needReplaceType.indexOf(t)&&e[t[0]]<10?"0"+e[t[0]]:"d"===t[0]?this[this.lan+"_weekDays"][this.date.getDay()]:String(e[t[0]]).slice(0,t.length)},u.prototype.format=function(t,e){e=e||this.date;var n=new i,r=this.getCurrentDates(e);n.add("isEmptyString",t,"is empty");var a=n.start(),o=this;if(a)return t=this.hooks.defaultFormat,this.format(t)||new Date(e);return e=t.replace(/(Y{1,})|(M{1,})|(D{1,})|(H{1,})|(m{1,})|(s{1,})|(d{1,})/g,function(){return o.replaceDate(arguments[0],r)})},u.prototype.relative=function(s){var u=this.date,c=this;return{from:function(t){t=new Date(t)||new Date;var e=c.getCurrentDates(u),n=c.getCurrentDates(t),r=Math.abs(e.Y-n.Y),a=new Date(t).getTime()-new Date(u).getTime(),o=a<0?"后":"前",i=function(t,e){t=new Date(t),e=new Date(e);var n=t.getDate()+t.getHours()/24+t.getMinutes()/24/60<=e.getDate()+e.getHours()/24+e.getMinutes()/24/60?0:-1;return 12*(e.getYear()-t.getYear())+e.getMonth()-t.getMonth()+n}(t,u);switch(s){case"year":return i<0&&(o="前",i=Math.abs(i)),i<12?i+"月"+o:r+"年"+o;case"month":return i<0&&(i=Math.abs(i)),i+"月"+o;case"date":return Math.abs(parseInt(a/1e3/60/60/24,10))+"天"+o;case"hour":return Math.abs(parseInt(a/1e3/60/60,10))+"小时"+o;case"minute":return Math.abs(parseInt(a/1e3/60,10))+"分钟"+o;case"seconds":return Math.abs(parseInt(a/1e3,10))+"秒"+o}},fromNow:function(){return this.from(new Date)}}},u.prototype.countdown=function(t,e,n,r){this.clearCb=r;var a=new i;a.add("isDate",t,"to param is not a date");var o=a.start();if(o||0<=(new Date).getTime()-new Date(t).getTime())throw this.clear(r),new Error(o||"倒计时已结束");this.interval(e,this.countDownRange.bind(this,t,n))},u.prototype.countDownRange=function(t,e){var n=(new Date).getTime(),r=new Date(t).getTime()-n,a=parseInt(r/1e3/60/60/24,10),o=parseInt(r/1e3/60/60%24,10),i=parseInt(r/1e3/60%60,10),s=parseInt(r/1e3%60,10);return e&&e({d:a,h:o,m:i,s:s}),0===a&&0===o&&0===i&&0===s&&this.clear(),this.countData={days:a,hours:o,minutes:i,seconds:s}},u.prototype.interval=function(t,e){!t||t<1?e.call(null):this.timer=setInterval(function(){e.call(null)},t)},u.prototype.clear=function(){clearInterval(this.timer),this.timer=null,this.clearCb&&this.clearCb(),this.clearCb=null},u.prototype.before=function(n){var r=this.date,a=this;return{calendar:function(){var t=a.calendarBeforeFormat(n,r),e=a.countDownRange(t);return a.calendarFormat(e,t)}}},u.prototype.after=function(n){var r=this.date,a=this;return{calendar:function(){var t=a.calendarAfterFormat(n,r),e=a.countDownRange(t);return a.calendarFormat(e,t)}}},u.prototype.calendarAfterFormat=function(t,e){var n=new Date(e).getTime();return n+864e5*t},u.prototype.calendarBeforeFormat=function(t,e){var n=new Date(e).getTime();return n-864e5*t},u.prototype.calendarFormat=function(t,e){var n,r,a=t.days,o=this[this.lan+"_weekDays"],i=o.concat(o),s=this.getCurrentDates(new Date(this.date)).d;this.getCurrentDates(new Date(e));return(a<0?1===(a=Math.abs(a))?"昨天":2===a?"前天":o[n=s-a]&&0!=n?o[n]:i[o.length+n]?"上周"+i[o.length+n]:this.format("YYYY/MM/DD ",new Date(e)):0===a?"今天":1===a?"明天":2===a?"后天":i[r=s+a]&&i[r]<o.length?i[r]:r<i.length?"下周"+i[r]:this.format("YYYY/MM/DD ",new Date(e)))+this.format("HH:mm ",new Date(e))},u.prototype.calendar=function(){return"今天"+this.format("HH:mm")};e.default=function(t){return new u(t)}}],a.c=r,a.d=function(t,e,n){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},a.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)a.d(n,r,function(t){return e[t]}.bind(null,r));return n},a.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="",a(a.s=0);function a(t){if(r[t])return r[t].exports;var e=r[t]={i:t,l:!1,exports:{}};return n[t].call(e.exports,e,e.exports,a),e.l=!0,e.exports}var n,r});