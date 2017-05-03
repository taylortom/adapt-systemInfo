// LICENCE https://github.com/adaptlearning/adapt_authoring/blob/master/LICENSE
define(function(require) {
  var _ = require('underscore');
  var Origin = require('core/origin');
  var SidebarItemView = require('modules/sidebar/views/sidebarItemView');
  var SystemInfoSidebarView = SidebarItemView.extend({
    preRender: function() {
      this.model = new Backbone.Model();


      this.listenTo(Origin, 'systemInfoSidebar:addButton', this.addSidebarButton);
    },

    postRender: function() {
      var CLASSNAME = 'systemInfo';
      this.addSidebarButton({
        name: CLASSNAME,
        title: Origin.l10n.t('app.systeminformation'),
        event: CLASSNAME + ":open"
      });
    },

    addSidebarButton: function(data) {
      _.defaults(data, {
        icon: 'fa-chevron-right'
      });
      var template = Handlebars.templates['systemInfoSidebarButton'];
      this.$el.append(template(data));
      this.$('.button-' + data.name).click(this.onButtonclick);
    },

    onButtonclick: function(event) {
      event && event.preventDefault();
      var eventName = $(event.currentTarget).attr('data-event');
      if(eventName) Origin.trigger(eventName);
    }
  }, {
    template: 'systemInfoSidebar'
  });
  return SystemInfoSidebarView;
});
