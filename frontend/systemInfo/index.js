// LICENCE https://github.com/adaptlearning/adapt_authoring/blob/master/LICENSE
define(function(require) {
  var Origin = require('core/origin');
  var SystemInfoView = require('./views/systemInfoView');
  var SystemInfoSidebarView = require('./views/systemInfoSidebarView');

  Origin.on('globalMenu:systemInfo:open', function() {
    Origin.router.navigate('#/systemInfo', {trigger: true});
  });

  Origin.on('origin:dataReady login:changed', function() {
    var permissions = ["*/*:create","*/*:read","*/*:update","*/*:delete"];
    Origin.permissions.addRoute('systemInfo', permissions);
    if (Origin.permissions.hasPermissions(permissions)) {
      Origin.globalMenu.addItem({
        "location": "global",
        "text": Origin.l10n.t('app.systeminformation'),
        "icon": "fa-tachometer",
        "callbackEvent": "systemInfo:open"
      });
    }
  });

  Origin.on('router:systemInfo', function(location, subLocation, action) {
    Origin.trigger('location:title:update', {
      title: Origin.l10n.t('app.systeminformation')
    });
    Origin.sidebar.addView(new SystemInfoSidebarView().$el);
    Origin.contentPane.setView(SystemInfoView);
  });
});
