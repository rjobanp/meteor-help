AutoForm.hooks({
  newLinkForm: {
    after: {
      "insertLink": function(error, result) {
        if ( error ) {
          Alerts.add('Error adding new content.');
        } else if ( result ) {
          var link = Links.findOne(result);
          link ? Router.go('link', {slug: link.slug}) : Router.go('home');
        }
      }
    }
  },
  editLinkForm: {
    after: {
      "updateLink": function(error, result) {
        if ( error ) {
          Alerts.add('Error editing content.');
        } else if ( result ) {
          var link = Links.findOne(result);
          link ? Router.go('link', {slug: link.slug}) : Router.go('home');
        }
      }
    }
  }
});