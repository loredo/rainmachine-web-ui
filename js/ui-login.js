/*
 *	Copyright (c) 2015 RainMachine, Green Electronics LLC
 *	All rights reserved.
 */

window.ui = window.ui || {};

(function(_login) {

    var loginPasswordElem = null;
    var loginRememberMeElem = null;
    var loginButtonElem = null;
    var errorContainerElem = null;

    _login.login = function(callback) {

        var accessToken = Storage.restoreItem("access_token");

        if(accessToken && accessToken !== "") {
            API.setAccessToken(accessToken);
            APIAsync.setAccessToken(accessToken);
        }

        var provision = API.getProvision();
        if(provision && !provision.statusCode) {
            return callback();
        }

        if(!loginButtonElem) {
            loginPasswordElem = $("#loginPassword");
            loginRememberMeElem = $("#loginRememberMe");
            loginButtonElem = $("#loginButton");
            errorContainerElem = $("#loginError");
        }

        //Added for demo
        var host = window.location.hostname;
        if (host == "192.168.12.174" || host == "demo.labs.rainmachine.com") {
            accessToken = API.auth("", true);
            if(accessToken) {
                document.body.className = "";
                Storage.saveItem("access_token", accessToken);
                API.setAccessToken(accessToken);
                APIAsync.setAccessToken(accessToken);
                return callback();
            }
        }

        loginButtonElem.onclick = function() {

            makeHidden(errorContainerElem);

            var info = {
                pwd: loginPasswordElem.value,
                remember: loginRememberMeElem.checked
            };

            accessToken = API.auth(info.pwd, info.remember);
            if(accessToken) {
                document.body.className = "";
                Storage.saveItem("access_token", accessToken);
                API.setAccessToken(accessToken);
                APIAsync.setAccessToken(accessToken);
                setTimeout(callback, 0);
            }else {
                makeVisible(errorContainerElem);
                errorContainerElem.innerHTML = "Invalid password";
            }
        };

        loginPasswordElem.onkeypress = function(event) {
            if(event.keyCode == 13) {
                loginButtonElem.click();
            }
        };

        document.body.className = "login";
    };

} (window.ui.login = window.ui.login || {}));
