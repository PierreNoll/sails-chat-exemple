module.exports = {


  friendlyName: 'Post message',


  description: '',


  inputs: {

    msg:{
      type:'string'
    }

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    sails.sockets.blast('new_msg', {
      msg: inputs.msg
    });

    sails.log('Done')

    return exits.success();

  }


};
