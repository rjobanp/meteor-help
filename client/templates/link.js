imageUrls = new ReactiveDict;

var insertImageForLink = function(self) {
  if ( self.data.openGraphId && !imageUrls.get(self.data._id) ) {
    HTTP.get('https://graph.facebook.com/' + self.data.openGraphId, function(err, res) {
      if ( res && res.data.image ) {
        imageUrls.set(self.data._id, res.data.image[0].url);
      }
    });
  }
}

Template.registerHelper('linkImage', function(link) {
  return link && imageUrls.get(link._id);
});

Template.linkPage.events({
  'click .claim-owner': function (e,t) {
    e.preventDefault();
    Meteor.call('claimLinkOwner', this._id);
  }
});

Template.link.created = function() {
  insertImageForLink(this);
}

Template.linkPage.created = function() {
  document.title = this.data.name + ' - ' + 'Meteor Help';
  insertImageForLink(this);
}

Template.linkPage.destroyed = function() {
  document.title = 'Meteor Help';
}

Template.linkPage.helpers({
  encodedUrl: function() {
    return encodeURI('http://meteorhelp.com/l/' + this.slug);
  },
  encodedName: function() {
    return encodeURIComponent(this.name);
  },
  encodedBlurb: function() {
    return encodeURIComponent('Check out "' + this.name + '" on @MeteorHelp !');
  }
});

Template.registerHelper('tagsOptions', function() {
  return [
    {label: 'Paid', value: 'paid-content'},
    {label: 'Video', value: 'video-content'},
    {label: 'Email', value: 'email-list'},
    {label: 'Audio', value: 'audio-content'}
  ]
});
Template.registerHelper('typesOptions', function() {
  return [
    {label: 'article', value: 'article'},
    {label: 'video', value: 'video'},
    {label: 'book', value: 'book'},
    {label: 'wiki', value: 'wiki'},
    {label: 'blog', value: 'blog'},
    {label: 'news', value: 'news'},
    {label: 'tutorial', value: 'tutorial'},
    {label: 'questions', value: 'questions'},
    {label: 'course', value: 'course'},
    {label: 'list', value: 'list'},
    {label: 'slides', value: 'slides'}
  ]
});