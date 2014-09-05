Comments = new Meteor.Collection('comments');

if (typeof Schema === 'undefined') {
  Schema = {};
}

Meteor.startup(function() {
  if ( Meteor.isServer ) {
    Comments._ensureIndex({linkId: 1});
    Comments._ensureIndex({userId: 1});
    Comments._ensureIndex({linkId: 1, createdAt: -1});
  }
});

Schema.userInfo = new SimpleSchema({
  name: {
    type: String,
    autoValue: function() {
      return Meteor.user().profile.name;
    }
  },
  avatarUrl: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    autoValue: function() {
      return "https://avatars.githubusercontent.com/u/" + Meteor.user().services.github.id;
    }
  },
  githubUsername: {
    type: String,
    autoValue: function() {
      return Meteor.user().services.github.username;
    }
  },
  emailMd5: {
    type: String,
    autoValue: function() {
      return md5(Meteor.user().services.github.email);
    }
  }
});

Schema.Comment = new SimpleSchema({
  userId: {
    type: String,
    autoValue: function() {
      return Meteor.userId();
    }
  },
  userInfo: {
    type: Schema.userInfo
  },
  linkId: {
    type: String
  },
  comment: {
    type: String,
    label: "My Review"
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
    return Links.findOne(this.linkId);
  },
  commentOwner: function(userId) {
    return userId === this.userId;
  },
  createdAtFormatted: function() {
    return moment(this.createdAt).fromNow();
  }
});