// LICENCE https://github.com/adaptlearning/adapt_authoring/blob/master/LICENSE
define(function(require) {
  var Origin = require('core/origin');
  var SidebarItemView = require('modules/sidebar/views/sidebarItemView');
  var SystemInfoSidebarView = SidebarItemView.extend({
    preRender: function() {
      this.model = new Backbone.Model();
    }
  }, {
    template: 'systemInfoSidebar'
  });
  return SystemInfoSidebarView;
});
