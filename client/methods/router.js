GlobalSubs = [
  Meteor.subscribe('userData'),
  Meteor.subscribe('userLinks'),
  Meteor.subscribe('userRankings')
];

Router.configure({
  layoutTemplate: 'layout',

  waitOn: function() {
    return GlobalSubs;
  }
});

Router.map(function() {

  this.route('home', {
    path: '/',
    template: 'home',
    waitOn: function() {
      var params = {
        sort: Session.get('allLinks.sort'),
        limit: Session.get('allLinks.limit'),
        skip: Session.get('allLinks.skip'),
        types: Session.get('allLinks.types')
      }
      return [
        Meteor.subscribe('allLinks', params)
      ]
    }
  });

  this.route('link', {
    path: '/l/:slug',
    template: 'linkPage',
    waitOn: function() {
      return [
        Meteor.subscribe('linkBySlug', this.params.slug)
      ]
    },
    data: function() {
      return Links.findOne({slug: this.params.slug})
    }
  });

  this.route('newLink', {
    path: '/new',
    template: 'newLink',
    action: function() {
      if ( !Meteor.user() ) {
        Router.go('home');
        Alerts.add('You must be logged in to add a new link');
      } else {
        this.render();
      }
    }
  });

});