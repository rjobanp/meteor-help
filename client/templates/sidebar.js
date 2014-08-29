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
  },
  'click .home-button': function() {
    Router.go('home');
  },
  'click .new-link-button': function() {
    Router.go('newLink');
  }
});

Template.sidebar.helpers({
  route: function(routeName) {
    return (Router.current().route.name === routeName) ? 'active' : ''
  }
});