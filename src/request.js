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