# l-moment

#### 介绍
**精简moment.js第三方库，提供最基本的时间格式化、相对时间、日历时间以及倒计时等一般项目所需时间处理需求。避免在项目中有限的时间处理引入比较大的三方库。**

**Based on the implementation of the moment.js third-party library, provides the most basic time formatting, relative time, calendar time and countdown time processing interface**

#### 安装


    `npm install lmoment --save`
    
    `yarn add lmoment --save`

#### 使用说明

**- 时间格式转换(format time)**

	Y: year; 
	M: month; 
	D: day;
	H: hour;
	m: minute; 
	s: second; 
	d: date
	 
格式化方法：

	lmoment().format("d") // Monday/星期一

    lmoment().format("YYYY")  // 201*

    lmoment().format("YYYY/MM" // 201*/**

    lmoment().format("YYYY-MM-DD HH:mm") // 201*-**-** **:** 

    lmoment().format("YYYY-MM-DD HH:mm:ss") // 201*-**-** **:**:ss

    lmoment("2020/12/01 12:00:12").format("YYYY-MM-DD HH:mm:ss")
	
**- 相对时间处理(relative time)**

	`type(类型): ['year', 'month', 'date', 'hour', 'minute', 'second']`
	
	lmoment().relative("year").fromNow() // *years ago/ *年前
		
	lmoment("2021/12/01 12:00:12").relative("year").fromNow() // relateive year from current time/从当前时间计算相对时间
		
	lmoment().relative("year").from(date)     // *years ago/after / *年后/前
		
	lmoment().relative("month").from(date)    // *month ago/after / *月后/前
		
	lmoment().relative("date").from(date)     // *date ago/after / *天后/前
		
	lmoment().relative("hour").from(date)     // *hour ago/after / *小时后/前
		
	lmoment().relative("minute").from(date)   // *minute ago/after / *分后/前
		
	lmoment().relative("seconds").from(date)  // *seconds ago/after / *秒后/前
		
**日历时间(calendar time)**

	lmoment().calendar() // today HH:mm/ 今天 **：**

	lmoment().before(1).calendar() // yesterday HH:mm/ 昨天 **：**

	lmoment().before(2).calendar() // the day before yesterday HH:mm/ 前天 **：**

	lmoment().after(1).calendar() // tomorrow HH:mm/ 明天 **：**

	lmoment().after(2).calendar() // the day after tomorrow HH:mm/ 后天 **：**

	lmoment().after('beyond two weeks').calendar()； // YYYY/MM/DD HH:ss

** 倒计时时间(countdown time)**

	lmoment().countdown(endTime, duration, interValCallback, endCountdownCallback);

	exp:

	lmoment().countdown("2020-02-08 13:54:53", 1000, function (date) {
		document.body.innerHTML = `<div>${date.d}days${date.h}hours${date.m}minutes${date.s}seconds</div>`
	}, function () {
		alert("end of countdown")
	})

#### 参与贡献
