// ==UserScript==
// @name           dAmn.ws
// @namespace      botdom.com
// @description    Make the official client use WebSockets
// @author         Henry Rapley <photofroggy@gmail.com>
// @version        0.0.2
// @include        http://chat.deviantart.com/chat/*
// ==/UserScript==


var dAmnWebSocket = function(  ) {

    // Make some magic happen.
    
    /**
     * Change the way the client is initialised, yaaay.
     */
    var dAmnWS_Init = function( pluginarea, plugin, logfunc  ) {
        if (Browser.isIE && !(document.documentMode > 7)) {
            alert("A newer version of Internet Explorer is required to use deviantART Chat.");
            return;
        }

        try{
            dAmn_Client_LogCallback = logfunc ;
            
            dAmn_Client_PluginArea    = dAmn_GetElement(pluginarea);
            dAmn_Client_PluginArea.style.width  ='0px';
            dAmn_Client_PluginArea.style.height ='0px';
            
            dAmn_Log( 'Browser: ' + navigator.userAgent );
        
            if ( !plugin  || plugin == 'default' ) {
                if (-1 != navigator.userAgent.search('Gecko')) {
                    dAmn_Plugins = {
                         begin:                    new dAmn_WebSocket_Plugin()
                        ,'WebSocket':              new dAmn_Plugin_XPCOM()
                        ,'Mozilla Extension':      new dAmn_Plugin_Flash()
                        ,Flash:                    new dAmn_Plugin_Java()
                    }
                } else  {
                    dAmn_Plugins = {     begin:         new dAmn_WebSocket_Plugin()
                                        ,'WebSocket':   new dAmn_Plugin_Flash()
                                        ,Flash:         new dAmn_Plugin_Java()
                                    }
                }                        
                dAmn_Log('Defaulting to '+dAmn_Plugins['begin'].name+' plugin');
            } else {
                switch( plugin ) {
                    case 'WebSocket':
                        dAmn_Plugins = { begin:    new dAmn_WebSocket_Plugin() };
                    case 'XPCOM':
                        dAmn_Plugins = { begin:    new dAmn_Plugin_XPCOM() };
                        break;
                    case 'Flash':
                        dAmn_Plugins = { begin:    new dAmn_Plugin_Flash() };
                        break;
                    case 'Java':
                        dAmn_Plugins = { begin:    new dAmn_Plugin_Java() };
                        break;
                    default:
                        throw "invalid plugin";
                }                                
                dAmn_Log('Forced to '+dAmn_Plugins['begin'].name+' plugin');
            }
            
            dAmn_Plugin = new dAmn_PluginObj(dAmn_Plugins['begin']);
            dAmn_Plugin.load();
            
        } 
        catch(e)
        {
            alert('dAmn_Init() failed! : ' + dAmn_ExceptionPrint(e));
        }
    };
    
    
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
        
            if( !cmd || !this.clientObj )
                return;
            
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
            
            this.setTimer( 1 );
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
         * Make the client fall back to other transports if we can't use
         * WebSockets. If we can, then tell the client we are ready to connect.
         */
        this.timeout = function(  ) {
            
            var d = new Date();
            var elapsed = d.getTime() - dAmn_Plugin.begin_ts;
            if( isNaN(elapsed) )
                elapsed = 0;
            
            if( !this.tryAccess() ) {
                dAmn_Plugin.log("WebSocket timeout");
                dAmn_Plugin.tryNext('WebSocket unavailable');
                return;
            }
            
            // If we get here, we are ready to connect.
            dAmn_DoCommand( 'init', 'init_arg' );
        
        }
    }


};


var dwsel = document.createElement("script");
dwsel.id = "damnwebsocket"
dwsel.appendChild(document.createTextNode("(" + dAmnWebSocket.toString() + ")();"))
document.getElementsByTagName("head")[0].appendChild(dwsel)
