export const isLeapYear = function(year) {
    return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
}

export const language = function() {
    var lang = "";
    if (!navigator) return "zh";
    let languageNavigator = navigator.appName == 'Netscape' ? navigator.language : navigator.browserLanguage;
    if (languageNavigator.indexOf('en') > -1) {
        lang = "en"
    } else {
        lang = "zh"
    }
    return lang
}

