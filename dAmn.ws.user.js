// ==UserScript==
// @name           dAmn.ws
// @namespace      botdom.com
// @description    Make the official client use WebSockets
// @author         Henry Rapley <photofroggy@gmail.com>
// @version        0.0.1
// @include        http://chat.deviantart.com/chat/*
// ==/UserScript==


var dAmnWebSocket = function(  ) {

    // Make some magic happen.
    
    /**
     * WebSocket plugin object.
     * deviantART's dAmn client uses "Plugin" objects to implement different
     * kinds of transports. As such, this is an object which aims to satisfy
     * the interface expected by the client. Later on, we override all of the
     * client's alternative Plugin objects, replacing them with our own object.
     * This way, the client has no choice but to use the WebSocket transport
     * layer.
     */
    var dAmn_WebSocket_Plugin = function() {
        this.name = 'WebSocket';
        this.objName = 'dAmnWebSocket';
        
        /**
         * Execute a command on the plugin.
         * The given `cmd` object contains an argument and a command. The
         * command tells the plugin what it should be doing, and the arugment
         * is any additional information that may be required for the command
         * to work.
         */
        this.doCmd = function( cmd ) {
        
            switch( cmd.cmd ) {
                case 'connect':
                    // connect here...
                    break;
                case 'disconnect':
                    // disconnect here...
                    break;
                case 'send':
                    // Send a packet...
                    break;
                case 'ping':
                    // Send a ping packet...
                    // Seems redundant...
                    break;
            }
        
        };
        
        /**
         * Load the plugin.
         * This seems to be used to load whatever plugin is used to manage the
         * transport, and is not used to initialise a connection of any sort.
         * In order for the client to work properly with this plugin object,
         * we may have to create an HTML element of some sort to trick the
         * client into thinking we are actually using something so silly.
         */
        this.load = function(  ) {
            this.loadCount++;
            var d = new Date();
            this.begin_ts = d.getTime();
            
            dAmn_Client_PluginArea.innerHTML = '<div id="'+this.objName+'"></div>';
            
            // this.setTimer( 1 ); // this is used because of reasons I see...
            // Maybe just do tryAccess and then throw errors based on that?
            // If we can't use WebSockets maybe fall back to the other
            // transports somehow.
        }
        
        /**
         * Check if we can access the plugin.
         * Because we're using WebSockets, just check if WebSockets are
         * implemented in the browser.
         */
        this.tryAccess = function(  ) {
            if(window["WebSocket"]) {
                return true;
            }
            return false;
        };
        
        /**
         * Called when the client thinks we have timed out for some reason.
         * I think maybe when the plugin doesn't load quickly enough? Can't
         * really tell though. If I'm correct, this should never be called.
         * Unless we simply can't use WebSockets.
         * 
         * Make this method cause the client to fall back to Flash somehow.
         */
        this.timeout = function(  ) {
            
            var d = new Date();
            var elapsed = d.getTime() - dAmn_Plugin.begin_ts;
            if( isNaN(elapsed) )
                elapsed = 0;
            dAmn_Plugin.log("WebSocket timeout");
            
        
        }
    }


};


var dwsel = document.createElement("script");
dwsel.id = "damnwebsocket"
dwsel.appendChild(document.createTextNode("(" + dAmnWebSocket.toString() + ")();"))
document.getElementsByTagName("head")[0].appendChild(dwsel)
