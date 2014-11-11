(function(jenkinsTranslator) {
  var _ = require('underscore'),
    uuid = require('uuid-v4');

  jenkinsTranslator.translateNotification = function(notificationEvent) {
    return [{
      eventId: uuid(),
      eventType: 'jenkins-event',
      data: notificationEvent
    }];
  };
})(module.exports);