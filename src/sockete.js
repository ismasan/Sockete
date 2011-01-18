var Sockete = (function () {
  
  return {
    mock: function () {
      window['WebSocket'] = Sockete.Client;
    },
    logEvent: function(evt) {
      if(!window['console']) return false;
      console.log(evt, '[Sockete.Response] ' + evt.type + ' : ' + evt.data);
    },
    settings: {
      // Needed so we can attach user event callbacks before connecting
      connection_delay: 10
    }
  };
})();