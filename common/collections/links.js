Links = new Meteor.Collection('links');

if (typeof Schema === 'undefined')
  Schema = {};

Schema.ImageObject = new SimpleSchema({
  profile: {
    type: String,
    optional: true
  }
});

Schema.RankObject = new SimpleSchema({
  average: {
    type: Number,
    autoValue: function() {
      if (this.isInsert) {
        return 0
      }
    }
  },
  total: {
    type: Number,
    autoValue: function() {
      if (this.isInsert) {
        return 0
      }
    }
  },
  count: {
    type: Number,
    autoValue: function() {
      if (this.isInsert) {
        return 0
      }
    }
  }
});

Schema.Link = new SimpleSchema({
  name: {
    type: String
  },
  types: {
    type: [String],
    allowedValues: ['article', 'website', 'video', 'wiki', 'styleguide', 'blog', 'tutorial', 'series', 'course'],
    optional: true
  },
  url: {
    type: String,
    regEx: SimpleSchema.RegEx.Url
  },
  ownerIds: {
    type: [String]
  },
  claimedOwnerIds: {
    type: [String]
    autoValue: function() {
      if (this.isInsert) {
        return [];
      }
    }
  },
  description: {
    type: String,
    optional: true
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
  images: {
    type: Schema.ImageObject,
    optional: true
  },
  active: {
    type: Boolean,
    autoValue: function() {
      if (this.isInsert) {
        return true;
      }
    }
  },
  noLongerRelevant: {
    type: Boolean,
    optional: true
  },
  tags: {
    type: [String],
    allowedValues: ['paid', 'video']
    optional: true
  },
  rating: {
    type: Schema.RankObject
  },
  difficulty: {
    type: Schema.RankObject
  }
});

Links.attachSchema(Schema.Link);

Links.helpers({
  userRating: function() {
    return userRankingForLink('rating', Meteor.userId(), this._id);
  },
  userDifficulty: function() {
    return userRankingForLink('difficulty', Meteor.userId(), this._id);
  },
  comments: function() {
    return Comments.find({
      linkId: this._id,
      active: true
    });
  },
  rankings: function() {
    return Rankings.find({
      linkId: this._id,
      active: true
    });
  }
});