var search = _.debounce(function(text) {
  Session.set('allLinks.nameRegex', text && (text.length > 0) ? ('\\b' + text) : '');
}, 300);

Template.header.events({
  'input .search-input': function(e,t) {
    var text = $(e.currentTarget).val();
    search(text);
  },
  'click .logout-button': function() {
    Meteor.logout(function(e) {
      if ( e ) {
        Alerts.add('Sorry! There was an error logging out.');
      }
    });
  },
  'click .login-github-button': function() {
    Meteor.loginWithGithub({
      requestPermissions: ['user:email']
    }, function(e) {
      if ( e ) {
        Alerts.add('Sorry! There was an error logging in.');
      }
    });
  }
});