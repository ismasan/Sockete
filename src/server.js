(function () {
  
  Sockete.Server = function (url) {
    this.url = this.URL = url;
    this.responders = [];
  }
  
  Sockete.Server.prototype = {
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
      var response;
      if (responder = this.findResponder(request)) {
        response = responder.response(request.client);
      } else {
        switch(request.request_type) {
         case 'open': // should let client open connection
          response = new Sockete.Response(request.client, 'open');
         break;
         case 'close': // should let client open connection
           response = new Sockete.Response(request.client, 'close');
         break;
         default:
          response = new Sockete.Response(request.client, 'close', '[Sockete.Server] No response configured for ' + request.toString());
         break; 
        }
      }
      Sockete.logRound(this, request, response)
      callback( response );
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
    config.apply(server, []);
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