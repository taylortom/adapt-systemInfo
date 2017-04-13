// LICENCE https://github.com/adaptlearning/adapt_authoring/blob/master/LICENSE
define(function(require) {
  var InfoView = require('./infoView');

  var ServerInfoView = InfoView.extend({
    className: 'serverInfo',
    route: 'server'
  }, {
    template: 'serverInfo'
  });

  return ServerInfoView;
});
