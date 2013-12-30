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
    setTimeout(connect, Sockete.settings.connection_delay);
    
    Sockete.clients.push(this);
    this.__sockete_id = Sockete.clients.length;
  }
  
  
})();
