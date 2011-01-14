test('it replaces native WebSocket', function () {
  MockWebSocket.start();
  console.log(WebSocket._mocking)
  ok(WebSocket._mocking);
});

module('Successful connection', {
  setup: function () {
    MockWebSocket.start();
  }
});

asyncTest('it triggers onopen when connecting', function () {
  var socket = new WebSocket('http://fake.host');
  var called = false;
  socket.onopen = function (evt) {
    called = true;
  }
  setTimeout(function(){
    ok(called, 'onopen callback was executed');
    start();
  }, 12);
  
});

test('it triggers onmessage when calling _trigger', function () {
  var socket = new WebSocket('http://fake.host');
  var msg;
  socket.onmessage = function (evt) {
    msg = evt.data;
  }
  socket._trigger('Hello world');
  same(msg, 'Hello world');
});

test('it logs history of sent messages', function () {
  var socket = new WebSocket('http://fake.host');
  socket.send('Gengis Khan');
  socket.send('Kublai Khan');
  same(MockWebSocket.history[0].data, 'Gengis Khan');
  same(MockWebSocket.history[1].data, 'Kublai Khan');
});