module.exports = {


  friendlyName: 'Update discussion title',


  description: 'Update the title of the discussion and broadcast an event to all members of that discussion',


  inputs: {

    discussionId:{
      type:'number'
    },

    newTitle:{
      type:'string'
    }

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    await Discussion.update({id:inputs.discussionId})
    .set({title:inputs.newTitle});

    sails.sockets.broadcast(inputs.discussionId.toString(),'new_title',
    {
      newTitle: inputs.newTitle,
      discussionId:inputs.discussionId,
      sender: this.req.me.fullName,
    });

    return exits.success();

  }


};
