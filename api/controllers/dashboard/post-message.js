module.exports = {


  friendlyName: 'Post message',


  description: '',


  inputs: {

    msg:{
      type:'string'
    },
    discussion:{
      type:'number',
      required:true
    }

  },


  exits: {

    invalid: {
      responseType: 'badRequest',
      description: 'The provided message is invalid.',
      extendedDescription: 'If this request was sent from a graphical user interface, the request '+
      'parameters should have been validated/coerced _before_ they were sent.'
    },

  },


  fn: async function (inputs, exits) {

    await Message.create(Object.assign({
      message:inputs.msg,
      userId:this.req.me.id,
      userFullName:this.req.me.fullName,
      discussionId:inputs.discussion,
      user:this.req.me.id,
      discussion:inputs.discussion
    }))
    .intercept({name: 'UsageError'}, 'invalid');

    sails.sockets.broadcast(inputs.discussion.toString(),'new_msg',
    {
      msg: inputs.msg,
      discussion:inputs.discussion,
      sender: this.req.me.fullName,
    });

    return exits.success();

  }


};
