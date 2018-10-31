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

  },


  fn: async function (inputs, exits) {

    sails.sockets.blast('new_msg',
    {
      msg: inputs.msg,
      sender: inputs.sender
    });

    sails.log('Done')

    return exits.success();

  }


};
