(function () {
  
  Sockete.Server = function (url) {
    this.url = url;
  }
  
  Sockete.Server.prototype = {
    responders: [],
    // Configuration DSL
    onmessage: function (message) {
      var responder = new Sockete.Responder('message', message);
      this.responders.push(responder);
      return responder;
    },
    
    // Client API
    request: function (request, callback) {
      if (responder = this.findResponder(request)) {
        callback( responder.response );
      } else {
        switch(request.request_type) {
         case 'open': // shold let client open connection
          callback(new Sockete.Response('open'));
         break;
         case 'close': // shold let client open connection
           callback(new Sockete.Response('close'));
         break;
         default:
          callback( new Sockete.Response('close', '[Sockete.Server] No response configured for ' + request.toString()))
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
  
  var servers = [];
  
  Sockete.Server.configure = function (url, config) {
    var server = new Sockete.Server(url);
    config.apply(server);
    servers.push(server);
    return server;
  }
  
  Sockete.Server.find = function (url) {
    for(var i=0, t=servers.length;i<t;i++) {
      if( servers[i].match(url) ) return servers[i];
    }
    return null;
  }
  
  
})();