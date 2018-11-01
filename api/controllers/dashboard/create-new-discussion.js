module.exports = {


  friendlyName: 'Create new discussion',


  description: '',


  inputs: {

    usersId:{
      type:'ref'
    },

    title:{
      type:'string',
      required:false,
      defaultsTo:''
    }

  },


  exits: {

    invalid: {
      responseType: 'badRequest',
      description: 'The provided users are invalid.',
      extendedDescription: 'If this request was sent from a graphical user interface, the request '+
      'parameters should have been validated/coerced _before_ they were sent.'
    },

  },


  fn: async function (inputs, exits) {

    for (var i = 0; i < inputs.usersId.length; i++) {
      if (!await User.findOne({id : inputs.usersId[i]})) {
        throw 'invalid';
      }
    }

    var newDiscussion = await Discussion.create(Object.assign({
      title:inputs.title,
    }))
    .fetch();

    for (var i = 0; i < inputs.usersId.length; i++) {
      await UserDiscussion.create(Object.assign({
        userId:inputs.usersId[i],
        discussionId: newDiscussion.id,
        user:inputs.usersId[i],
        discussion:newDiscussion.id,
      }))
    }

    sails.sockets.blast('new_discussion',
    {
      newDiscussion:newDiscussion
    });

  return exits.success({newDiscussion:newDiscussion});

}


};
