Session.setDefault('sidebar', false);

Template.layout.events({
  'click [data-toggle="offcanvas"]': function () {
    Session.set('sidebar', !Session.get('sidebar'));
  }
});

Template.registerHelper('sidebar', function() {
    return Session.equals('sidebar', true);
});

Template.sidebar.helpers({
  route: function(routeName) {
    var path = Router.current().path.split('/');
    return (path[path.length-1] === routeName) ? 'active' : ''
  }
});