//jenkinsController
(function(jenkinsController) {
  var bodyParser = require('body-parser'),
    EventStore = require('eventstore-client'),
    request = require('request');

  jenkinsController.init = function(app, config) {
    app.post('/api/jenkinsJob/hook', bodyParser.json(), function(req, res) {
      var translator = require('./translators/jenkinsTranslator');
      var events = translator.translateNotification(req.body);
      /*var es = new EventStore(config.eventStoreBaseUrl, config.eventStoreUser, config.eventStorePassword);

            es.pushEvents(JSON.stringify(events), function(error, response, body) {
            if (error) {
            console.log(error);
            } else {
            console.log('Posted to eventstore.');
            console.log(response.statusCode);
            }
            });*/
      events = JSON.stringify(events);
      var authorization = 'Basic ' + new Buffer('admin' + ':' + 'changeit').toString('base64');
      var eventStoreUrl = 'http://localhost:2113' + '/streams/jenkinsjob';
      var options = {
        url: eventStoreUrl,
        body: events,
        rejectUnauthorized: false,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/vnd.eventstore.events+json',
          'Content-Length': events.length,
          'Authorization': this.authorization
        }
      };
      request.post(options, function(error, response, body) {
        res.json({
          message: 'Your jenkins notification is in queue to be added to CommitStream.' + ' ' + response.statusCode
        });
        res.end();
      });
      /*res.json({
        message: 'Your jenkins notification is in queue to be added to CommitStream.'
      });
      res.end();*/
    });
    //just for fun delete after
    app.get('/api/jenkinsJob/query', function(req, res) {
      var jenkinsEventsToApiResponse = require('./translators/jenkinsEventsToApiResponse')
      var stream = 'job-';
      var params = {
        jobName: req.query.jobName,
        pageSize: req.query.pageSize || 5
      };

      var eventStoreUrl = 'http://localhost:2113/streams/' +
        stream +
        params.jobName +
        '/head/backward/' +
        params.pageSize +
        '?embed=content';

      var options = {
        url: eventStoreUrl,
        rejectUnauthorized: false,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      };

      request.get(options, function(error, response, body) {
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