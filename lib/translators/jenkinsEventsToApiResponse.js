(function() {
  var _ = require('underscore'),
    moment = require('moment');

  module.exports = function(entries) {
    var builds = _.map(entries, function(entry) {
      var e = entry.content.data;
      return {
        name: e.name,
        urlJob: e.build.full_url,
        buildNumber: e.build.number,
        phase: e.build.phase,
        status: e.build.status,
        success: (e.build.status == 'SUCCESS'),
        noStarted: !(e.build.phase == 'STARTED')
      };
    });
    var response = {
      events: builds
    };
    return response;
  };
})();