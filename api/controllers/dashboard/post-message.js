module.exports = {


  friendlyName: 'Post message',


  description: '',


  inputs: {

    msg:{
      type:'string'
    },
    sender:{
      type:'string'
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
      sender:this.req.me.id,
      author:this.req.me.id
    }))
    .intercept({name: 'UsageError'}, 'invalid');

    await sails.sockets.blast('new_msg',
    {
      msg: inputs.msg,
      sender: inputs.sender
    });

    return exits.success();

  }


};
