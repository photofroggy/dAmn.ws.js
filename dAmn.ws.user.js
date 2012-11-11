// ==UserScript==
// @name           dAmn.ws
// @namespace      botdom.com
// @description    Make the official client use WebSockets
// @author         Henry Rapley <photofroggy@gmail.com>
// @version        0.0.0
// @include        http://chat.deviantart.com/chat/*
// ==/UserScript==


var dAmnWebSocket = function(  ) {

    // Make some magic happen.

};


var dwsel = document.createElement("script");
dwsel.id = "damnwebsocket"
dwsel.appendChild(document.createTextNode("(" + dAmnWebSocket.toString() + ")();"))
document.getElementsByTagName("head")[0].appendChild(dwsel)
