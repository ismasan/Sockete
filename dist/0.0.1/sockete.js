/*  mock_websocket.js, version 0.0.1
*  (c) 2011 Ismael Celis (@ismasan)
*
*  Released under MIT license.
*/
var Sockete = (function () {
  
  return {
    mock: function () {
      window['WebSocket'] = Sockete.Client;
    },
    logEvent: function(evt) {
      if(!window['console']) return false;
      console.log(evt, '[Sockete.Response] - client ' + evt.currentTarget.__sockete_id + ' | ' + evt.type + ' : ' + evt.data);
    },
    settings: {
      // Needed so we can attach user event callbacks before connecting
      connection_delay: 10
    }
  };
})();
(function () {
  
  // A request is sent from the client to the server and it
  // knows about the client and request type ('open', 'message', 'close')
  
  Sockete.Request = function (client, request_type, message) {
    this.client = client;
    this.request_type = request_type;
    this.message = message;
  }
  
  Sockete.Request.prototype = {
    toString: function () {
      return '[Sockete.Request] ' + this.request_type + ' : ' + this.message;
    }
  }
  
  
})();
(function () {
  
  /* Response object
  ------------------------------------*/
  Sockete.Response = function(client, event_type, message) {

    this.type = event_type;
    this.data = message;
    this.currentTarget = client;

    function textStatus () {
      return event_type == 'open' ? 'success' : 'fail';
    }

    this.toString = function () {
      return '[' + textStatus() + '] ' + message;
    }
  }
  
  
})();
(function () {
  
  // WebSocket mock. It is important that it implements the same API and public attributes
  // so we only add those to the prototype.
  Sockete.clients = [];
  
  Sockete.Client = function (url) {
    
    // Stubs
    this.onmessage = function (evt) {
      Sockete.logEvent(evt);
    }
    this.onclose = function (evt) {
      Sockete.logEvent(evt);
    }
    this.onopen = function (evt) {
      Sockete.logEvent(evt);
    }
    
    var url = url;
    
    this.__server = null;
    
    this.readyState = 0; // 'connecting' http://dev.w3.org/html5/websockets/#websocket
    
    var self = this;
    
    this.close = function () {
      readyState(2);
      var request = new Sockete.Request(self, 'close');
      self.__server.request(request, dispatch);
    }
    
    this.send = function (msg) {
      if(this.readyState != 1) return false;
      var request = new Sockete.Request(self, 'message', msg);
      self.__server.request(request, dispatch);
      return true;
    }
    
    function readyState (state) {
      self.readyState = state;
    }
    
    function dispatch (response) {
      // Store history here, or something
      switch(response.type) {
        case 'open': readyState(1); break;
        case 'close': readyState(3); break;
      }
      self['on'+response.type](response);
    }
    
    function connect () {
      self.__server = Sockete.Server.find(url);
      if (!self.__server) throw('[Sockete.Client#connect] No server configured for URL ' + url)
      var request = new Sockete.Request(self, 'open')
      self.__server.request(request, dispatch);
    }
    setTimeout(connect, Sockete.settings.connecttion_delay);
    
    Sockete.clients.push(this);
    this.__sockete_id = Sockete.clients.length;
  }
  
  
})();
(function () {
  
  /* Responder objects store responses to matched requests
  ---------------------------------------------------------*/
  
  function guardResponseNotSet(responder) {
    if( responder.__response_type ) 
      throw('Response for ' + responder.message + ' has already been set to ' + responder.__response_type + ' with ' + responder.__response_message)
  }
  
  Sockete.Responder = function (event_type, message) {
    this.event_type = event_type;
    this.message = message;
  }
  
  Sockete.Responder.prototype = {
    __response_type: null,
    __response_message: null,
    // Configuration API
    respond: function (message) {
      guardResponseNotSet(this);
      this.__response_type = 'message';
      this.__response_message = message;
      return this;
    },
    fail: function (message) {
      guardResponseNotSet(this);
      this.__response_type = 'close';
      this.__response_message = message;
      return this;
    },
    // Public methods
    match: function (request) {
      return request.request_type == this.event_type;
    },
    
    response: function (client) {
      return new Sockete.Response(client, this.__response_type, this.__response_message);
    }
  }
  
  
})();
(function () {
  
  Sockete.Server = function (url) {
    this.url = this.URL = url;
  }
  
  Sockete.Server.prototype = {
    responders: [],
    addResponder: function (type, msg) {
      var responder = new Sockete.Responder(type, msg);
      this.responders.push(responder);
      return responder;
    },
    // Configuration DSL
    onmessage: function (message) {
      return this.addResponder('message', message);
    },
    onconnect: function () {
      return this.addResponder('open', '');
    },
    
    // Client API
    request: function (request, callback) {
      console.log(this.url, 'RESPONDED WITH', request)
      if (responder = this.findResponder(request)) {
        console.log('SERVER ', this.url)
        callback( responder.response(request.client) );
      } else {
        switch(request.request_type) {
         case 'open': // shold let client open connection
          callback(new Sockete.Response(request.client, 'open'));
         break;
         case 'close': // shold let client open connection
           callback(new Sockete.Response(request.client, 'close'));
         break;
         default:
          callback( new Sockete.Response(request.client, 'close', '[Sockete.Server] No response configured for ' + request.toString()))
         break; 
        }
      }
    },
    
    // URL matching
    // Should do regexes, tokens, etc.
    match: function (url) {
      return url == this.url; 
    },
    
    findResponder: function (request) {
      for(var i=0, t=this.responders.length;i<t;i++) {
        if( this.responders[i].match(request) ) return this.responders[i];
      }
      return null;
    }
  }
  
  Sockete.servers = [];
  
  Sockete.Server.configure = function (url, config) {
    var server = new Sockete.Server(url);
    config.apply(server);
    Sockete.servers.push(server);
    return server;
  }
  
  Sockete.Server.find = function (url) {
    for(var i=0, t=Sockete.servers.length;i<t;i++) {
      if( Sockete.servers[i].match(url) ) return Sockete.servers[i];
    }
    return null;
  }
  
  
})();
