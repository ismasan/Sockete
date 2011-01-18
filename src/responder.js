(function () {
  
  /* Responder objects store responses to matched requests
  ---------------------------------------------------------*/
  
  function guardResponseNotSet(responder) {
    if( responder.response ) 
      throw('Response for ' + responder.message + ' has already been set to ' + responder.response.toString())
  }
  
  Sockete.Responder = function (event_type, message) {
    this.event_type = event_type;
    this.message = message;
  }
  
  Sockete.Responder.prototype = {
    response: null,
    // Configuration API
    respond: function (message) {
      guardResponseNotSet(this);
      this.response = new Sockete.Response('message', message);
      return this;
    },
    fail: function (message) {
      guardResponseNotSet(this);
      this.response = new Sockete.Response('close', message);
      return this;
    },
    // Public methods
    match: function (request) {
      return request.request_type == this.event_type;
    }
  }
  
  
})();