var assert = require('assert'),
  proxyquire = require('proxyquire'),
  sinon = require('sinon'),
  requestStub = {},
  EventStore = require('eventstore-client'),
  jenkinsController = proxyquire('../lib/jenkinsController', {
    'request': requestStub
  }),
  es = new EventStore('http://localhost:1234', 'admin', 'changeit');

describe('jenkinsController', function() {
  describe('getNotification', function() {
    before(function() {
      requestStub.post = sinon.stub().callsArgWith(1, null, {});
    });
    it('should translate the notification and send to EventStore', function(done) {
      //toDo
      done();
    });
  });
});