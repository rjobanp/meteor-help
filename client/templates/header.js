var search = _.debounce(function(text) {
  Session.set('allLinks.nameRegex', text && (text.length > 0) ? ('\\b' + text) : '');
}, 300);

Template.header.events({
  'input .search-input': function(e,t) {
    var text = $(e.currentTarget).val();
    search(text);
  }
});