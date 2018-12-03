module.exports = {


  friendlyName: 'Close discussion',


  description: 'Update the status to close for the discussion specified',


  inputs: {

    discussionId:{
      type:'string'
    }

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    await Discussion.update({id:inputs.discussionId})
    .set({status:false});

    sails.sockets.broadcast(inputs.discussionId.toString(),'discussionClosed',
    {
      discussionId:inputs.discussionId,
      sender: this.req.me.fullName,
    });


    return exits.success();

  }


};
