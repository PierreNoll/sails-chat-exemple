module.exports = {


  friendlyName: 'Delete users',


  description: 'Delete the users selected',


  inputs: {

    selectedUser:{
      type:'ref',
      required:true
    }

  },


  exits: {

    emptyArray:{
      description: `Aucune demande selectionnée pour validation`,
      responseType: 'badRequest',
    },

    invalid: {
      responseType: 'badRequest',
      description: 'The provided informations are invalid.',
      extendedDescription: 'If this request was sent from a graphical user interface, the request '+
      'parameters should have been validated/coerced _before_ they were sent.'
    },

  },


  fn: async function (inputs, exits) {

    if (!inputs.selectedUser) {
      throw 'emptyArray'
    };

    await Utilisateur.destroy({
      where:{id: {in: inputs.selectedUser}}
    }).
    intercept({name: 'UsageError'}, 'invalid');

    return exits.success();

  }


};
