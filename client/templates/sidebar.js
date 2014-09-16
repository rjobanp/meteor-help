Template.sidebar.events({
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

Template.sidebar.helpers({
  route: function(routeName) {
    var path = Router.current().path.split('/');
    return (path[path.length-1] === routeName) ? 'active' : ''
  }
});