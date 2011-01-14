var MockWebSocket = (function () {
  
  var _history = [];
  var _settings = {
    successful_connection: true
  };
  
  function merge(one, two) {
    for(var i in one) two[i] = one[i];
    return two;
  }
  
  var Event = function (type, data) {
    this.data = data || '';
    this.date = new Date();
  }
  
  var Mock = function (url) {
    var url = url;
    
    this.onopen = function () {
      
    }
    
    this.onmessage = function (evt) {
      
    }
    
    this.onclose = function () {
      
    }
    
    this.send = function (data) {
      _history.push(new Event('message', data));
    }
    
    this._trigger = function (data) {
      this.onmessage(new Event('message', data));
    }
    
    var self = this;
    
    function connect () {
      if (_settings.successful_connection) {
        self.onopen(new Event('open'));
      } else {
        self.onclose(new Event('close'));
      }
    }
    
    setTimeout(connect, 10);
  }
  
  Mock._mocking = true;
  
  return {
    start: function (opts) {
      var opts = opts || {};
      _settings = merge(_settings, opts);
      window['WebSocket'] = Mock;
    },
    history: _history
  }
})();