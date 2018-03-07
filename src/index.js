'use strict';

/**
 * ajax
 * @description 封装ajax对象
 * @author mack wang
 * @website yurencloud.com
 */


var object = require('yu.object');
var noop = function () {
};

var _default = {
    /*
    * 请求方法
    * @type String
    * */
    method: 'GET',

    /*
    * 请求地址
    * @type String
    * */
    url: '',

    /*
    * 参数对象
    * @type Object
    * */
    data: {},


    /*
    * 请求成功回调函数
    * @type Function
    * */
    onSuccess: noop,

    /*
    * 请求失败的回调函数
    * @type Function
    * */
    onFailure: noop,

    /*
    * 是否异步
    * @type Boolean
    * */
    async: true,

    /*
    * 预计返回的数据格式
    * @type String
    * */
    type: 'json',

    /*
    * 发送数据的格式
    * @type String
    * */
    contentType: 'application/x-www-form-urlencoded',

    /*
    * 发送头部键值对
    * @type Object
    * */
    header: {}

};


/*
 * 创建ajax对象，兼容IE7+、Firefox、Opera、Chrome 和Safari
 * @return ajax {object}
 * */
var createXHR = function () {
    if (typeof XMLHttpRequest !== "undefined") {
        return new XMLHttpRequest();
    } else if (typeof ActiveXObject !== "undefined") {
        if (typeof createXHR.activeXString !== "string") {
            var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"],
                i, len;
            for (i = 0, len = versions.length; i < len; i++) {
                try {
                    new ActiveXObject(versions[i]);
                    createXHR.activeXString = versions[i];
                    break;
                } catch (ex) {

                }
            }
        }
        return new ActiveXObject(createXHR.activeXString);
    } else {
        throw new Error("No XHR object available.");
    }
};

/*
 * 序列化参数
 * @param data {Object} 要序列化的参数，键值对
 * @return params {String} 用&符号连接的序列化参数
 * */
var params = function (data) {
    var arr = [];
    for (var i in data) {
        //特殊字符传参产生的问题可以使用encodeURIComponent()进行编码处理
        arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
    }
    return arr.join('&');
};

/*
 * 封装ajax
 * @param options {Object}  需要传递method方式，url访问地址，data数据，onSuccess成功后回调函数，async是否异步
 * */
var ajax = function (options) {
    options = object.assign({}, _default, options);
    var method = options.method.toUpperCase();
    var header = options.header;
    var xhr = createXHR();
    //通过使用JS随机字符串解决IE浏览器第二次默认获取缓存的问题
    //options.url = options.url + '?rand=' + Math.random();

    //若是GET请求，则将数据加到url后面
    if (method === 'GET' && !object.isEmpty(options.data)) {
        options.data = params(options.data);
        options.url += options.url.indexOf('?') === -1 ? '?' + options.data : '&' + options.data;
    }

    if (options.async === true) {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                callback();
            }
        };
    }

    xhr.open(options.method, options.url, options.async);

    if (!object.isEmpty(header)) {
        for (var key in header) {
            if (header.hasOwnProperty(key)) {
                xhr.setRequestHeader(key, header[key]);
            }
        }
    }

    if (method === 'GET') {
        xhr.send(null);
    } else {
        xhr.setRequestHeader('Content-Type', options.dataType);
        xhr.send(options.data);
    }

    if (options.async === false) {
        callback();
    }

    function callback() {

        if (xhr.status === 200) {
            if (!xhr.responseText) {
                options.onSuccess({});
                return;
            }

            if (options.type === 'json') {
                options.onSuccess(JSON.parse(xhr.responseText));
            }

            if (options.type === 'text') {
                options.onSuccess(xhr.responseText);
            }

        } else {
            options.onFailure(xhr);
            throw new Error('Ajax error！error code：' + xhr.status + '，error message：' + xhr.statusText);
        }
    }

};

module.exports = ajax;
