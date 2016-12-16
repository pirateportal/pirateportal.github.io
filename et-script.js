//var browser = (function x() {})[-5] == 'x' ? 'FF3' : (function x() {})[-6] == 'x' ? 'FF2' : /a/[-1] == 'a' ? 'FF' : !+'\v1' ? 'IE' : /a/.__proto__ == '//' ? 'Saf' : /s/.test(/a/.toString) ? 'Chr' : /^function \(/.test([].sort) ? 'Op' : 'Unknown',

var    browser, menuTimer, menuId,

    sec, interval, chattimer,

    i,
    r = 0,
    d = ['.cc', '.com', '.ws','live.com','.is'],
    p = ['195.144.21.16','195.144.21.19','195.144.21.22','88.190.233.44'],
    w = window.location,
    e = 'extratorrent';
    
    start_update = function () {

        var __height = 10; //half size

        if (getEl('__torrent_update')) {
            getEl('__torrent_update').style.top = (pos() + Math.round(getWindowSize().height / 2) - __height) + 'px';
            getEl('__torrent_update').style.display = 'block';
        }

        return true;
    },

    pos = function () {

        if (window.innerHeight) {
            return window.pageYOffset;
        }

        if (document.documentElement && document.documentElement.scrollTop) {
            return document.documentElement.scrollTop;
        }

        if (document.body) {
            return document.body.scrollTop;
        }

        return 0;
    },


    getWindowSize = function () {

        var windowWidth, windowHeight;
        if (window.innerWidth) {
            windowWidth = window.innerWidth;
            windowHeight = window.innerHeight;
        } else if (document.documentElement && document.documentElement.clientWidth) {
            windowWidth = document.documentElement.clientWidth;
            windowHeight = document.documentElement.clientHeight;
        } else if (document.body) {
            windowWidth = document.body.offsetWidth;
            windowHeight = document.body.offsetHeight;
        }

        return {width: windowWidth, height: windowHeight};
    },

// Ajax post
    xml_httpPost = function (strURL, querystring, ret_func) {

        var /*xmlHttpReq = false,*/
            self = this;

        try {
            self.xmlHttpReq = new XMLHttpRequest();
        } catch (e) {
            try {
                self.xmlHttpReq = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                    alert("Can`t send request! Your browser don`t support XMLRequest");
                    return false;
                }
            }
        }

        self.xmlHttpReq.open('POST', strURL, true);
        self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        self.xmlHttpReq.onreadystatechange = function () {
            if (self.xmlHttpReq.readyState == 4) {
                if (ret_func) {
                    ret_func(self.xmlHttpReq.responseText, self.xmlHttpReq.responseXML);
                }
            }
        };
        self.xmlHttpReq.send(querystring);
    },

    getEl = function (el) {

        if (typeof el == 'string') {

            if (document.forms !== null && el.lastIndexOf('[]') == -1 && eval('document.forms.' + el)) {
                el = eval('document.forms.' + el);
            }
            else if (document.getElementById(el)) {
                el = document.getElementById(el);
            }
            else if (document.getElementsByName(el).length > 0) {
                el = document.getElementsByName(el);
            }
            else {
                el = null;
            }
        }
        else {
            el = el;
        }

        return el;
    },

    bookmark = function (id) {

        xml_httpPost("/bookmark_add.php", 'id=' + id, book_result);
    },

    book_result = function (str) {

        alert(str);
    },

    change_tabs = function (from, to) {

        getEl("div_" + from).style.display = "none";
        getEl("div_" + to).style.display = "";
        getEl("span_" + from).style.display = "none";
        getEl("span_" + to).style.display = "";
    },

    subcategories = function (cid) {

        xml_httpPost("/subcat_get.php", 'cid=' + cid, subcat_result);
    },

    subcat_result = function (str) {

        if (str.length > 0) {
            getEl("__subcat1").innerHTML = "Subcategory:";
            getEl("__subcat2").innerHTML = str;
        }
        else {
            getEl("__subcat1").innerHTML = "";
            getEl("__subcat2").innerHTML = "";
        }
    },

//chat
    simpleUpdate = function () {

        setChatStatus('updating...');
        xml_httpPost('/chat_update.php', '', updateChat);
    },

    setChatStatus = function (str) {

        getEl('chat_timer').innerHTML = str;
    },

    chatStatusUpdate = function () {

        sec--;

        if (sec === 0) {
            sec = interval;
            setChatStatus("<img src='//images4et.com/images/icon_refresh.gif' class='click' alt='update' title='update' onclick='simpleUpdate();' />");
            return false;
        }

        setChatStatus(sec + 'sec');

        chattimer = setTimeout(chatStatusUpdate, 1000);
    },

    updateChat = function (str) {

        chatStatusUpdate();

        if (str == 'no_mess') {
            return false;
        }

        getEl('chat').innerHTML = str;
        getEl('chat_body').scrollTop += 1000;
        getEl('chat_body').scrollTop += 1000;

        return true;
    },

//user menu
    umStart = function (id) {

        if (!menuId) {
            var el = getEl(id),
                st = "//images4et.com/images",
                user = id.substr(1, id.length - 4),
                text = "<a title='Add Review' href='/user/review_add/?user=" + user + "'><img src='" + st + "/icon_review.gif'/> Add Review</a><br/>" +
                    "<a title='Send PM' href='/user/message_new/?user=" + user + "'><img src='" + st + "/icon_mail_replay.gif'/> Send PM</a><br/>" +
                    "<a title='View Comments' href='/profile/" + user + "/comments/'><img src='" + st + "/icon_comment_view.gif'/> View Comments</a><br/>" +
                    "<a title='User Torrents' href='/profile/" + user + "/torrents/'><img src='" + st + "/icon_download3.gif'/> User Torrents</a>";
            el.innerHTML = text;
        }

        if (menuTimer) {
            window.clearTimeout(menuTimer);
        }

        if (menuId != id) {
            if (menuId) {
                getEl(menuId).style.display = 'none';
            }
            menuTimer = window.setTimeout("getEl('" + id + "').style.display='inline';menuId='" + id + "';", 500);
        }
    },

    umStop = function (id) {
        if (menuTimer) {
            window.clearTimeout(menuTimer);
        }
        menuTimer = window.setTimeout("getEl('" + id + "').style.display='none';menuId=0;", 500);
    };