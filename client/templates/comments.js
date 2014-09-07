Template.comment.created = function() {
  this.editing = new ReactiveVar(false);
}

Template.comment.helpers({
  editing: function() {
    return Template.instance().editing.get()
  }
});

Template.comment.events({
  'click .remove-comment': function() {
    Meteor.call('removeComment', this._id);
  },
  'click .edit-comment': function(e,t) {
    t.editing.set(true);
    Deps.afterFlush(function() {
      t.$('.edit-comment-text').focus();
    });
  },
  'blur .edit-comment-text': function(e,t) {
    if ( t.data.comment !== e.currentTarget.value ) {
      var params = {
        $set: {
          comment: e.currentTarget.value
        }
      };
      Meteor.call('updateComment', this._id, params);
    }
    t.editing.set(false);
  }
});

Template.comment.destroyed = function() {
  this.editing = null;
}