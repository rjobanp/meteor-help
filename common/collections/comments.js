Comments = new Meteor.Collection('comments');

if (typeof Schema === 'undefined')
  Schema = {};

Schema.userInfo = new SimpleSchema({
  name: {
    type: String
  },
  avatarUrl: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true
  },
  githubUsername: {
    type: String,
    optional: true
  },
  emailMd5: {
    type: String,
    optional: true
  }
});

Schema.Comment = new SimpleSchema({
  userId: {
    type: String
  },
  userInfo: {
    type: Schema.userInfo
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
  updatedAt: {
    type: Number,
    autoValue: function() {
      if (this.isUpdate) {
        return +moment();
      }
    },
    denyInsert: true,
    optional: true
  },
  active: {
    type: Boolean,
    autoValue: function() {
      if (this.isInsert) {
        return true;
      }
    }
  }
});

Comments.attachSchema(Schema.Comment);

Comments.helpers({
  link: function() {
    return Links.findOne(this.linkId)
  },
  user: function() {
    return Meteor.users.findOne(this.userId)
  }
});