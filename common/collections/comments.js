Comments = new Meteor.Collection('comments');

if (typeof Schema === 'undefined')
  Schema = {};

Schema.Comment = new SimpleSchema({
  userId: {
    type: String
  },
  linkId: {
    type: String
  },
  comment: {
    type: String
  },
  createdAt: {
    type: Number,
    autoValue: function() {
      if (this.isInsert) {
        return +moment();
      } else if (this.isUpsert) {
        return {$setOnInsert: +moment()};
      } else {
        this.unset();
      }
    }
  },
  active: {
    type: Boolean
  }
});

Comments.attachSchema(Schema.Comment);