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
    ga('send', 'pageview');
    Session.set('sidebar', false);
  }
});

linkListController = RouteController.extend({
  onBeforeAction: function () {
    if ( this.params && this.params.type ) {
      Session.set('allLinks.types', [this.params.type]);
    } else {
      Session.set('allLinks.types', null);
    }
    this.next();
  },
  waitOn: function() {
    var params = {
      sort: Session.get('allLinks.sort'),
      limit: Session.get('allLinks.limit'),
      skip: Session.get('allLinks.skip'),
      types: Session.get('allLinks.types'),
      nameRegex: Session.get('allLinks.nameRegex')
    }
    return [
      RouterSubs.subscribe('allLinks', params)
    ]
  }
});

Router.route('/', {
  name: 'home',
  template: 'home',
  controller: linkListController
});

Router.route('/l/:slug', {
  name: 'link',
  template: 'linkPage',
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

    Session.set('allLinks.nameRegex', '');
    $('.search-input').val('');
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
      Alerts.add('Sorry, you can not edit that content');
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
      Alerts.add('You must be logged in to add new content');
    } else {
      this.render();
    }

    Session.set('allLinks.nameRegex', '');
    $('.search-input').val('');
  }
});

Router.route('/t/:type', {
  name: 'type',
  template: 'home',
  controller: linkListController
});