// LICENCE https://github.com/adaptlearning/adapt_authoring/blob/master/LICENSE
define(function(require) {
  var Backbone = require('backbone');
  var Origin = require('core/origin');
  var OriginView = require('core/views/originView');

  var InfoView = OriginView.extend({
    tagName: 'div',
    settings: {
      autoRender: false
    },

    events: {
      'click .btn': 'onButtonClicked'
    },

    initialize: function(options) {
      OriginView.prototype.initialize.apply(this, arguments);
      this.model = new Backbone.Model();
    },

    preRender: function() {
      this.getData('installed', _.bind(function(data) {
        this.model.set({
          git: data.git,
          installed: data.version
        });
        this.render();
      }, this));
    },

    updateButton: function(newLabel, animate) {
      var $btn = this.$('.btn');
      $btn.text(newLabel);
      if(animate === true) $btn.addClass('animate');
      else $btn.removeClass('animate');
    },

    getData: function(endRoute, cb) {
      var done = _.bind(function(data, status) {
        if(status === 'error') {
          return Origin.Notify.alert({
            type: 'error',
            text: data.responseJSON.error
          });
        }
        // don't nest if there's only one value
        if(Object.values(data).length === 1) {
          data = Object.values(data)[0];
        }
        cb(data);
      }, this);
      $.getJSON(this.getRoutePrefix() + endRoute, done).fail(done);
    },

    getRoutePrefix: function() {
      return 'api/updater/' + this.route + '/';
    }
  }, {
    template: 'systemInfo'
  });

  Handlebars.registerHelper('formatGitData', function(data) {
    var isGitHub = data.remote && data.remote.search('github.com') > -1;
    if(!isGitHub) {
      return '<em><strong>' + data.commit + '</strong></em> on <em><strong>' + data.branch + '</strong></em>';
    }
    var match = data.remote.match(/github.com:?\/(.+)\/(.+)\.git/);
    var ownerName = match[1];
    var repoName = match[2];
    var repoURL = 'https://github.com/' + ownerName + '/' + repoName;
    // we know GitHub's URL structure, so can add hyperlinks
    return linkHTML(repoURL + '/commit/' + data.commit, data.commit) + ' on ' +
      linkHTML(repoURL + '/tree/' + data.branch, data.branch);
  });

  function linkHTML(link, label) {
    return '<a class="git" href="' + link + '" target="_blank">' + label + '</a>';
  }

  return InfoView;
});
