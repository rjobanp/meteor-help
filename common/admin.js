AdminConfig = {
  name: 'Meteor Help',
  collections: {
    Links: {
      tableColumns: [
        {label: 'Name', name: 'name'},
        {label: 'Slug', name: 'slug'},
        {label: 'claimedOwners', name: 'claimedOwnerIds'},
        {label: 'owners', name: 'ownerIds'}
      ]
    },
    Comments: {
      auxCollections: ['Links'],
      tableColumns: [
        {label: 'User', name:'userInfo.githubUsername'},
        {label:'Link', name:'linkId', collection: 'Links', collection_property:'name'}
      ]
    },
    Rankings: {
      auxCollections: ['Links'],
      tableColumns: [
        {label: 'UserId', name:'userId'},
        {label: 'Ranking', name: 'value'},
        {label: 'Type', name: 'type'},
        {label:'Link', name:'linkId', collection: 'Links', collection_property:'name'}
      ]
    },
  }
};