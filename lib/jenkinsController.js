//jenkinsController
(function(jenkinsController) {
  var bodyParser = require('body-parser'),
    EventStore = require('eventstore-client');

  jenkinsController.init = function(app, config) {
    app.post('api/jenkinsHook', bodyParser.json(), function(req, res) {
      var translator = require('./translators/jenkinsTranslator');
      var events = translator.translateNotification(req.body);
      var es = new EventStore(config.eventStoreBaseUrl, config.eventStoreUser, config.eventStorePassword);

      es.pushEvents(JSON.stringify(events), function(error, response, body) {
        if (error) {
          console.log(error);
        } else {
          console.log('Posted to eventstore.');
          console.log(response.statusCode);
        }
      });
      res.json({
        message: 'Your jenkins notification is in queue to be added to CommitStream.'
      });
      res.end();
    });
  };
})(module.exports)