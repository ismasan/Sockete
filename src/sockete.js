var Sockete = (function () {
  
  function log_enabled () {
    return window['console'] && Sockete.settings.log;
  }
  
  return {
    mock: function () {
      window['WebSocket'] = Sockete.Client;
    },
    logEvent: function(evt) {
      if(!log_enabled()) return false;
      console.log(evt, '[Sockete.Response] - client ' + evt.currentTarget.__sockete_id + ' | ' + evt.type + ' : ' + evt.data);
    },
    logRound: function (server, request, response) {
      if(!log_enabled()) return false;
      console.log('[Sockete] client '+request.client.__sockete_id+':'+request.toString()+' => server '+server.URL+':'+response.toString());
    },
    settings: {
      // Needed so we can attach user event callbacks before connecting
      connection_delay: 10,
      // Logging switch
      log: true
    }
  };
})();