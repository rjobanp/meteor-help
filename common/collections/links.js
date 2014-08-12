Links = new Meteor.Collection('links');

if (typeof Schema === 'undefined')
  Schema = {};

Schema.RankObject = new SimpleSchema({
  average: {
    type: Number
  },
  values: {
    type: [Number] // [ #1stars, #2stars, #3stars, #4stars, #5stars ]
  }
});

Schema.ImageObject = new SimpleSchema({
  profile: {
    type: String,
    optional: true
  }
});

Schema.Link = new SimpleSchema({
  name: {
    type: String
  },
  type: {
    type: String,
    allowedValues: ['article', 'blog', 'tutorial', 'series', 'course']
  },
  url: {
    type: String,
    regEx: SimpleSchema.RegEx.Url
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
  images: {
    type: Schema.ImageObject,
    optional: true
  },
  active: {
    type: Boolean
  },
  paid: {
    type: Boolean,
    optional: true
  },
  noLongerRelevant: {
    type: Boolean,
    optional: true
  },
  videos: {
    type: Boolean,
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