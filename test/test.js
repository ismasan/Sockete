
// var s = new WebSocket('ws://test.com');
// s.onclose = function(evt) {console.log(evt)}

var ok_server = Sockete.Server.configure('ws://ok.host', function () {
  
  this.onmessage('blah').respond('Ok buddy!');
  
  this.onmessage('Wrong message').fail('So sorry');
  
  // this.onconnect().fail('Nope!')
});

module('Mock server', {
  setup: function () {
    Sockete.mock();
  }
});

asyncTest('it triggers onopen when connecting', function () {
  var socket = new WebSocket('ws://ok.host');
  var called = false;
  socket.onopen = function (evt) {
    called = true;
  }
  setTimeout(function(){
    ok(called, 'onopen callback was executed');
    equal(socket.readyState, 1, 'readyState is 1');
    start();
  }, 12);
  
});

asyncTest('it matches messages on successful message', function () {
  var socket = new WebSocket('ws://ok.host');
  var response = null;
  socket.onmessage = function (evt) {
    response = evt.data;
  }
  setTimeout(function(){
    socket.send('blah');
    equal(response, 'Ok buddy!', 'readyState is 1');
    start();
  }, 12);
});

// test('it triggers onmessage when calling _trigger', function () {
//   var socket = new WebSocket('http://fake.host');
//   var msg;
//   socket.onmessage = function (evt) {
//     msg = evt.data;
//   }
//   socket._trigger('Hello world');
//   same(msg, 'Hello world');
// });
// 
// test('it logs history of sent messages', function () {
//   var socket = new WebSocket('http://fake.host');
//   socket.send('Gengis Khan');
//   socket.send('Kublai Khan');
//   same(MockWebSocket.history[0].data, 'Gengis Khan');
//   same(MockWebSocket.history[1].data, 'Kublai Khan');
// });