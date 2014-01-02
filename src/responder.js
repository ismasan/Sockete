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
    match: function (request) {{

      // Duck out early if easy checks fail.
      if (request.request_type != this.event_type || !this.message) {
        return false;
      }

      // Predicate matching.
      if (typeof this.message === 'function') {
        return this.message(request.message);
      }

      // Regexp matching.
      if (typeof this.message.test === 'function') {
        return this.message.test(request.message);
      }

      // String compare.
      return this.message === request.message; 
    },
    
    response: function (client) {
      return new Sockete.Response(client, this.__response_type, this.__response_message);
    }
  }
  
  
})();