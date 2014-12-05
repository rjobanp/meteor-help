GlobalSubs = new SubsManager();

RouterSubs = new SubsManager();

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',

  waitOn: function() {
    return [
      GlobalSubs.subscribe('userData'),
      GlobalSubs.subscribe('userLinks'),
      GlobalSubs.subscribe('userRankings')
    ]
  },

  onAfterAction: function() {
    if (Meteor.isClient) {
      ga('send', 'pageview');
      Session.set('sidebar', false);
    }
  }
});

linkListController = RouteController.extend({
  onBeforeAction: function () {
    if (Meteor.isClient) {
      if ( this.params && this.params.type ) {
        Session.set('allLinks.types', [this.params.type]);
      } else {
        Session.set('allLinks.types', null);
      }
    }
    this.next();
  },
  waitOn: function() {
    if (Meteor.isClient) {
      var params = {
        sort: Session.get('allLinks.sort'),
        limit: Session.get('allLinks.limit'),
        skip: Session.get('allLinks.skip'),
        types: Session.get('allLinks.types'),
        nameRegex: Session.get('allLinks.nameRegex')
      }
    } else {
      var params = {
        sort: [["rating.average", "desc"]],
        limit: 100
      }
    }
    return [
      RouterSubs.subscribe('allLinks', params)
    ]
  }
});

Router.route('/', {
  name: 'home',
  template: 'home',
  fastRender: true,
  controller: linkListController
});

Router.route('/l/:slug', {
  name: 'link',
  template: 'linkPage',
  fastRender: true,
  waitOn: function() {
    return [
      RouterSubs.subscribe('linkBySlug', this.params.slug)
    ]
  },
  data: function() {
    return Links.findOne({slug: this.params.slug})
  },
  onBeforeAction: function() {
    if ( this.ready() ) {
      RouterSubs.subscribe('linkComments', this.data()._id);
      this.next();
    }
    if (Meteor.isClient) {
      Session.set('allLinks.nameRegex', '');
      $('.search-input').val('');
    }
  }
});

Router.route('/edit/:slug', {
  name: 'editLink',
  template: 'editLink',
  waitOn: function() {
    return [
      RouterSubs.subscribe('linkBySlug', this.params.slug)
    ]
  },
  data: function() {
    return Links.findOne({slug: this.params.slug})
  },
  action: function() {
    if ( !Meteor.user() || !this.data().linkOwner(Meteor.user()) ) {
      Router.go('home');
      if (Meteor.isClient) {
        Alerts.add('Sorry, you can not edit that content');
      }
    } else {
      this.render();
    }
  }
});

Router.route('/new', {
  name: 'newLink',
  template: 'newLink',
  action: function() {
    if ( !Meteor.user() ) {
      Router.go('home');
      if (Meteor.isClient) {
        Alerts.add('You must be logged in to add new content');
      }
    } else {
      this.render();
    }
    if(Meteor.isClient) {
      Session.set('allLinks.nameRegex', '');
      $('.search-input').val('');
    }
  }
});

Router.route('/t/:type', {
  name: 'type',
  template: 'home',
  fastRender: true,
  controller: linkListController
});