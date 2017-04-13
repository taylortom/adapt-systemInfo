// LICENCE https://github.com/adaptlearning/adapt_authoring/blob/master/LICENSE
define(function(require) {
  var _ = require('underscore');
  var Backbone = require('backbone');
  var Origin = require('core/origin');
  var InfoView = require('./infoView');

  var FrameworkInfoView = InfoView.extend({
    className: 'frameworkInfo',
    route: 'framework',

    checkForUpdate: function() {
      var self = this;
      this.updateButton(Origin.l10n.t('app.checking'), true);
      this.getData('latest', _.bind(function(data) {
        this.model.set({
          latest: data,
          isUpdateAvailable: this.model.get('installed') !== data
        });
        this.render();
      }, this));
    },

    updateFramework: function() {
      Origin.Notify.confirm({
        type: 'warning',
        text: Origin.l10n.t('app.confirmframeworkupdate'),
        destructive: true,
        callback: _.bind(function(isConfirmed) {
          if(!isConfirmed) return;
          this.updateButton(Origin.l10n.t('app.updating'), true);
          $.ajax(this.getRoutePrefix() + 'update', {
            method: 'PUT',
            data: { version: this.model.get('latest') },
            success: _.bind(this.onUpdateSuccess, this),
            error: _.bind(this.onUpdateError, this)
          });
        }, this)
      });
    },

    /**
    * Events
    */

    onButtonClicked: function(event) {
      event && event.preventDefault();
      if(this.model.get('isUpdateAvailable')) this.updateFramework();
      else this.checkForUpdate();
    },

    onUpdateSuccess: function(data) {
      var newVersion = Object.values(data)[0];
      Origin.Notify.alert({
        type: 'success',
        text: Origin.l10n.t('app.frameworkupdatesuccess', { version: newVersion })
      });
      this.model.set({
        installed: newVersion,
        latest: newVersion,
        isUpdateAvailable: false
      });
      this.render();
    },

    onUpdateError: function(data) {
      var self = this;
      // add a timer in case we get an error before the previous confirm has closed
      setTimeout(function() {
        Origin.Notify.alert({
          type: 'error',
          text: Origin.l10n.t('app.frameworkupdateerror', { error: data.responseJSON.error })
        });
        self.render();
      }, 300);
    }
  }, {
    template: 'frameworkInfo'
  });

  return FrameworkInfoView;
});
