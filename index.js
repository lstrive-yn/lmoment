import Validate from "./validate";
import { isLeapYear, language } from "./utils";
import config from "./config";

// 相对时间
// 倒计时
// 日历时间
function Moment(date, en) {
    this.lan = en || language();
    this.date = date ? new Date(date) : new Date();
    this.needReplaceType = ["HH", 'MM', "mm", "ss", "DD"];

    this.zh_weekDays = config.zh_weekDays;
    this.zh_months = config.zh_months;
    this.en_weekDays = config.en_weekDays;
    this.en_months = config.en_months;

    this.countData = {};
    this.clearCb = null;
    this.hooks = {
        defaultFormat: "YYYY/MM/DD HH:mm:ss d"
    };
}

Moment.prototype.getCurrentDates = function (argDate) {
    let years = argDate.getFullYear();
    let months = argDate.getMonth() + 1;
    let date = argDate.getDate();
    let day = argDate.getDay();
    let hours = argDate.getHours();
    let minutes = argDate.getMinutes();
    let seconds = argDate.getSeconds();
    return {
        Y: years,
        M: months,
        D: date,
        d: day,
        H: hours,
        m: minutes,
        s: seconds
    }
}

// 格式化替换参数
Moment.prototype.replaceDate = function (arg, currentDateData) {
    if (currentDateData[arg[0]]+'') {
        // 判断是否需要加前缀0的日期; 
        if (this.needReplaceType.indexOf(arg) > -1 && currentDateData[arg[0]] < 10) {
            return arg = "0" + currentDateData[arg[0]]
        }
        if(arg[0] === 'd') {  // 返回星期
            return this[this.lan + '_weekDays'][this.date.getDay()];
        }
        return String(currentDateData[arg[0]]).slice(0, arg.length);
    }
}

// 时间格式化
Moment.prototype.format = function (formatString, date) {
    // 判断格式是不是字符串或者为空
    date = date || this.date;
    let validate = new Validate();
    let currentDateData = this.getCurrentDates(date);
    validate.add("isEmptyString", formatString, "is empty");
    let errMsg = validate.start();
    let self = this;
    if (errMsg) {
        // 为空返回默认格式的时间字符串
        formatString = this.hooks.defaultFormat;
        return this.format(formatString) || new Date(date); // TODO:考虑返回哪一种
    } else {
        const dateReg = /(Y{1,})|(M{1,})|(D{1,})|(H{1,})|(m{1,})|(s{1,})|(d{1,})/g;
        date = formatString.replace(dateReg, function () {
            return self.replaceDate(arguments[0], currentDateData);
        })
        return date;
    }
}

function monDiff(startTime, endTime) { 
    startTime = new Date(startTime);    
    endTime = new Date(endTime);    
    var date2Mon;     
    var startDate = startTime.getDate() + startTime.getHours() / 24 + startTime.getMinutes() / 24 / 60;       
    var endDate = endTime.getDate() + endTime.getHours() / 24 + endTime.getMinutes() / 24 / 60;   
    if (endDate >= startDate) {
        date2Mon = 0;
    } else {
        date2Mon = -1;
    }
    return (endTime.getYear() - startTime.getYear()) * 12 + endTime.getMonth() - startTime.getMonth() + date2Mon;
}

// 相对时间
Moment.prototype.relative = function (type) {
    const { date } = this;
    let self = this;
    return {
        from: function (fromDate) {
            fromDate = new Date(fromDate) || new Date();
            let startDateDate = self.getCurrentDates(date);
            let fromDateData = self.getCurrentDates(fromDate);

            const offsetY = Math.abs(startDateDate.Y - fromDateData.Y);
            const offset = new Date(fromDate).getTime() - new Date(date).getTime();

            let extText = offset < 0 ? "后" : "前";
            let diffMonth = monDiff(fromDate, date);

            switch (type) {
                case "year":
                    if (diffMonth < 0) {
                        extText = "前"
                        diffMonth = Math.abs(diffMonth);
                    }
                    return diffMonth < 12 ? diffMonth + "月" + extText : offsetY + "年" + extText
                case "month":
                    if (diffMonth < 0) { diffMonth = Math.abs(diffMonth)}
                    return diffMonth + "月" + extText;
                case "date":
                    return Math.abs(parseInt(offset / 1000 / 60 / 60 / 24, 10)) + "天" + extText;
                case "hour":
                    return Math.abs(parseInt(offset / 1000 / 60 / 60, 10)) + "小时" + extText;
                case "minute":
                    return Math.abs(parseInt(offset / 1000 / 60, 10)) + "分钟" + extText;
                case "seconds":
                    return Math.abs(parseInt(offset / 1000, 10)) + "秒" + extText;
                default:
                    break;
            }
        },
        fromNow: function() {
            return this.from(new Date());
        }
    }
}

// 倒计时
Moment.prototype.countdown = function (endTime, duration, intervalCb, clearCb) {
    this.clearCb = clearCb;
    
    let validator = new Validate();
    // validator.add("isDate", from, "from param is not a date");
    validator.add("isDate", endTime, "to param is not a date");
    let errMsg = validator.start();

    if (errMsg || new Date().getTime() - new Date(endTime).getTime() >= 0) {
        this.clear(clearCb); // 清除倒计时
        throw new Error(errMsg || "倒计时已结束");
    }
    this.interval(duration, this.countDownRange.bind(this, endTime, intervalCb));
}

Moment.prototype.countDownRange = function (endTime, cb) {
    let fromDate = new Date().getTime();
    let toDate = new Date(endTime).getTime();
    let rangeDate = toDate - fromDate;
    let days = parseInt(rangeDate / 1000 / 60 / 60 / 24, 10),
        hours = parseInt(rangeDate / 1000 / 60 / 60 % 24, 10),
        minutes = parseInt(rangeDate / 1000 / 60 % 60, 10),
        seconds = parseInt(rangeDate / 1000 % 60, 10);
   
    cb && cb({ d: days, h: hours, m: minutes, s: seconds });
    if(days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
        this.clear();
    }
    return this.countData = { days, hours, minutes, seconds };
}

Moment.prototype.interval = function (duration, fn) {
    if (!duration || duration < 1) {
        fn.call(null);
    } else {
        this.timer = setInterval(() => {
            fn.call(null)
        }, duration)
    }
}

Moment.prototype.clear = function () {
    clearInterval(this.timer);
    this.timer = null;

    // 倒计时结束回调函数
    this.clearCb && this.clearCb();
    this.clearCb = null;
}

// 日历时间
// 之前 之后
Moment.prototype.before = function (num) {
    const { date } = this;
    const self = this;
    return {
        calendar: function () {
            let formatCalendarData = self.calendarBeforeFormat(num, date);
            let formatRangeDate = self.countDownRange(formatCalendarData);
            return self.calendarFormat(formatRangeDate, formatCalendarData);
        }
    }
}
// // 之后
Moment.prototype.after = function (num) {
    const { date } = this;
    let self = this;
    return {
        calendar: function () {
            let formatCalendarData = self.calendarAfterFormat(num, date);
            let formatRangeDate = self.countDownRange(formatCalendarData);
            return self.calendarFormat(formatRangeDate, formatCalendarData);
        }
    }
}

Moment.prototype.calendarAfterFormat = function (num, date) {
    let nowDate = new Date(date).getTime();
    return nowDate = nowDate + 1000 * 60 * 60 * 24 * num;
}

Moment.prototype.calendarBeforeFormat = function (num, date) {
    let nowDate = new Date(date).getTime();
    return nowDate = nowDate - 1000 * 60 * 60 * 24 * num;
}

Moment.prototype.calendarFormat = function (formatRangeDate, formatCalendarData) {
    let { days } = formatRangeDate;
    let weekDays = this[this.lan + '_weekDays'];
    const weekDaysRange = weekDays.concat(weekDays);
    let { d } = this.getCurrentDates(new Date(this.date));
    const formatDate = this.getCurrentDates(new Date(formatCalendarData));
    console.log(formatDate);
    let extText = "前";
    
    if (days < 0) {
        days = Math.abs(days);
        if (days === 1) {
            extText = "昨天";
        } else if (days === 2) {
            extText = "前天";
        } else {
            let currentDay = d - days;
            if (weekDays[currentDay] && currentDay != 0) {
                extText = weekDays[currentDay];
            }else if (weekDaysRange[weekDays.length + currentDay]) { // 控制在一周范围之内
                extText = "上周" + weekDaysRange[weekDays.length + currentDay];
            }else {
                extText = this.format("YYYY/MM/DD ", new Date(formatCalendarData));
            }
        }
    } else {
        if (days === 0) {
            extText = "今天";
        } else if (days === 1) {
            extText = "明天";
        } else if (days === 2) {
            extText = "后天";
        } else {
            let currentDay = d + days;
            if (weekDaysRange[currentDay] && weekDaysRange[currentDay] < weekDays.length) {
                extText = weekDaysRange[currentDay];
            }else if (currentDay < weekDaysRange.length) { // 控制在一周范围之内
                extText = "下周" + weekDaysRange[currentDay];
            }else {
                extText = this.format("YYYY/MM/DD ", new Date(formatCalendarData));
            }
        }
    }
    return extText + this.format("HH:mm ", new Date(formatCalendarData));
}

Moment.prototype.calendar = function() {
    return "今天" + this.format("HH:mm")
}


function lmoment(date) {
    console.log("start");
    return new Moment(date);
}

// typeof exports === 'object' && typeof module !== 'undefined' ? 
//     module.exports = lmoment :
//         typeof define === 'function' && define.amd ? define(lmoment) :
//             global.lmoment = lmoment;

export default lmoment;