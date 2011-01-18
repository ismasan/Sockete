// var s = new WebSocket('ws://test.com');
// s.onclose = function(evt) {console.log(evt)}

var ok_server = Sockete.Server.configure('ws://ok.host', function () {
  this.onmessage('blah').respond('Ok buddy!');
  this.onmessage('Wrong message').fail('So sorry');
});

var fail_server = Sockete.Server.configure('ws://fail.host', function () {
  this.onconnect().fail('Nope!')
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
    equal(response, 'Ok buddy!', 'readyState is 1 so socket is open');
    start();
  }, 12);
});


asyncTest('it closes socket if server configured to fail on connect', function () {
  var socket = new WebSocket('ws://fail.host');
  var called = false;
  equal(socket.readyState, 0, 'socket state is connecting');
  
  socket.onclose = function () {
    called = true;
  }
  setTimeout(function(){
    ok(called, 'onclose callback was executed');
    equal(socket.readyState, 3, 'readyState is 3 so socket is closed');
    start();
  }, 12);
  
});

// 
// test('it logs history of sent messages', function () {
//   var socket = new WebSocket('http://fake.host');
//   socket.send('Gengis Khan');
//   socket.send('Kublai Khan');
//   same(MockWebSocket.history[0].data, 'Gengis Khan');
//   same(MockWebSocket.history[1].data, 'Kublai Khan');
// });