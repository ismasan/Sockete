(function () {
  
  /* Response object
  ------------------------------------*/
  Sockete.Response = function(event_type, message) {

    this.type = event_type;
    this.data = message;

    function textStatus () {
      return event_type == 'open' ? 'success' : 'fail';
    }

    this.toString = function () {
      return '[' + textStatus() + '] ' + message;
    }
  }
  
  
})();