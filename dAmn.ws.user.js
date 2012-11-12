// ==UserScript==
// @name           dAmn.ws
// @namespace      botdom.com
// @description    Make the official client use WebSockets
// @author         Henry Rapley <photofroggy@gmail.com>
// @version        1.0.0
// @include        http://chat.deviantart.com/chat/*
// ==/UserScript==


var dAmnWebSocket = function(  ) {
    
    /**
     * WebSocket plugin object.
     * deviantART's dAmn client uses "Plugin" objects to implement different
     * kinds of transports. As such, this is an object which aims to satisfy
     * the interface expected by the client.
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
        
            if( !cmd )
                return;
            
            switch( cmd.cmd ) {
                case 'connect':
                    // connect here...
                    this.sock = new WebSocket('ws://chat.openflock.com:3902/chat/ws');
                    
                    this.sock.onopen = function( event ) {
                        dAmn_Plugin.log('Proxy open');
                        dAmn_DoCommand( 'connect', 'dAmn@chat.openflock.com' );
                    };
                    
                    this.sock.onmessage = function( event ) {
                        dAmn_DoCommand( 'data', decodeURIComponent(event.data.split('+').join(' ')) );
                    };
                    
                    this.sock.onclose = function( event ) {
                        dAmn_Plugin.log('WebSocket closed');
                        dAmn_DoCommand( 'disconnect' );
                    };
                    
                    break;
                case 'disconnect':
                    if( this.sock == null )
                        break;
                    this.sock.close();
                    break;
                case 'send':
                    if( this.sock == null )
                        break;
                    var p = dAmn_ParsePacket(cmd.arg);
                    if( p.cmd == 'login' ) {
                        if( p.param != 'login' ) {
                            dAmn_Client_Username = p.param;
                        } else {
                            dAmn_DoCommand('done');
                            return;
                        }
                    }
                    this.sock.send(encodeURIComponent(cmd.arg).split(' ').join('+'));
                    break;
                case 'ping':
                    break;
            }
            
            dAmn_DoCommand('done');
            
        
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
            document.dAmnWebSocket = {};
            dAmn_Plugin.getClientObj();
            this.sock = null;
            
            if( this.tryAccess() ) {
                setTimeout(function( ) { dAmn_DoCommand('init', 'init_arg'); }, 1);
            }
            
            this.setTimer(1000);
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
         * Make the client fall back to other transports if we can't use
         * WebSockets. If we can, then tell the client we are ready to connect.
         */
        this.timeout = function(  ) {
            
            dAmn_Plugin.log("WebSocket timeout");
            
            for( var k in dAmn_Plugins ) {
                if( !dAmn_Plugins.hasOwnProperty(k) )
                    continue;
                
                if( dAmn_Plugins[k].name == 'Flash' ) {
                    dAmn_Plugin = dAmn_Plugins[k];
                    break;
                }
            }
            
            dAmn_Client_ReConnect();
        
        };
        
    }
    
    // Hijack the client to connect to a proxy.
    var wsp = new dAmn_WebSocket_Plugin;
    dAmn_Plugin = new dAmn_PluginObj( wsp );
    dAmn_Plugin.load();
    dAmn_Client_ReConnect();

};


var dwsel = document.createElement("script");
dwsel.id = "damnwebsocket"
dwsel.appendChild(document.createTextNode("(" + dAmnWebSocket.toString() + ")();"))
document.getElementsByTagName("head")[0].appendChild(dwsel)
