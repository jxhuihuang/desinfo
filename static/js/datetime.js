// 将时间转成 UTC 时间
function convertToUtc(str, format) {
    if (typeof (format) === 'undefined') format = 'YYYY-MM-DD HH:mm:ss';
    if (str) return moment(str).utc().format(format);
    return str;
}

// 将 UTC 时间转成本地时间
function convertToLocal(str, format) {
    if (typeof (format) === 'undefined') format = 'YYYY-MM-DD HH:mm:ss';
    if (str) return moment(moment.utc(str).toDate()).format(format);
    return str;
}