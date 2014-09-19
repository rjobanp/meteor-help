Meteor.startup(function() {
  Session.set('allLinks.sort', [["rating.average", "desc"]]);
});

Template.sort.helpers({
  sortedBy: function(sortType) {
    var sortSpec = Session.get('allLinks.sort');
    return sortSpec && sortSpec.length && sortSpec[0][0].split('.')[0] === sortType
  },
  orderedBy: function(sortType) {
    var sortSpec = Session.get('allLinks.sort');
    return sortSpec && sortSpec.length && sortSpec[0][1] === sortType
  }
});

Template.sort.events({
  'click .sort-by': function(e,t) {
    var currentSort = Session.get('allLinks.sort');
    currentSort[0][0] = $(e.currentTarget).data('sort') + '.average';
    Session.set('allLinks.sort', currentSort);
  },
  'click .order-by': function(e,t) {
    var currentSort = Session.get('allLinks.sort');
    currentSort[0][1] = $(e.currentTarget).data('sort');
    Session.set('allLinks.sort', currentSort);
  },
});