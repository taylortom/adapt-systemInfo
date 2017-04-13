// LICENCE https://github.com/adaptlearning/adapt_authoring/blob/master/LICENSE
define(function(require){
  var _ = require('underscore');
  var Origin = require('core/origin');
  var OriginView = require('core/views/originView');
  var FrameworkInfoView = require('./frameworkInfoView');
  var ServerInfoView = require('./serverInfoView');

  var SystemInfoView = OriginView.extend({
    tagName: 'div',
    className: 'systemInfo',

    render: function() {
      OriginView.prototype.render.apply(this, arguments);
      this.$('.info .container').append(new ServerInfoView().$el);
      this.$('.info .container').append(new FrameworkInfoView().$el);
    },

    postRender: function() {
      this.setViewToReady();
    }
  }, {
    template: 'systemInfo'
  });

  return SystemInfoView;
});
