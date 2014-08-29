Template.link.events({
  'click .link': function() {
    Router.go('link', {slug: this.slug});
  }
});