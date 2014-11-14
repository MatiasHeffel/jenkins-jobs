//jenkinsController
(function(jenkinsController) {
  var bodyParser = require('body-parser'),
    EventStore = require('eventstore-client'),
    request = require('request');

  jenkinsController.init = function(app, config) {
    app.post('/api/jenkinsJob/hook', bodyParser.json(), function(req, res) {
      var translator = require('./translators/jenkinsTranslator');
      var events = JSON.stringify(translator.translateNotification(req.body));

      var es = new EventStore({
        baseUrl: config.eventStoreBaseUrl,
        username: config.eventStoreUser,
        password: config.eventStorePassword
      });

      es.stream.post({
        name: "jenkinsjob",
        events: events
      }, function(error, response) {
        res.json({
          message: 'Your jenkins notification is in queue to be added to CommitStream.' + ' ' + response.statusCode
        });
        res.end();
      });
    });
    //just for fun delete after
    app.get('/api/jenkinsJob/query', function(req, res) {
      var jenkinsEventsToApiResponse = require('./translators/jenkinsEventsToApiResponse')

      var stream = 'job-' + req.query.jobName;
      var count = req.query.pageSize || 5;

      var es = new EventStore({
        baseUrl: config.eventStoreBaseUrl,
        username: config.eventStoreUser,
        password: config.eventStorePassword
      });

      es.stream.get({
        name: stream,
        count: count
      }, function(error, response) {
        var events = [];
        if (response.body) {
          events = JSON.parse(response.body);
        }
        var jenkinsBuilds = jenkinsEventsToApiResponse(events.entries);
        res.set("Content-Type", "application/json");
        res.send(jenkinsBuilds);
      });
    });
  };
})(module.exports)