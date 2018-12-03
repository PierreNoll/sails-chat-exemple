module.exports = {


  friendlyName: 'Remove inscription demand',


  description: '',


  inputs: {

    selectedInscription:{
      description:'Array contenant les id des demandes d\'inscription selectionnées pour validation.',
      type:'ref',
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

    if (!inputs.selectedInscription) {
      throw 'emptyArray'
    }

    var usersToValide = await DemandInscription.destroy({
      where:{id: {in: inputs.selectedInscription}}
    }).intercept({name: 'UsageError'}, 'invalid');

    return exits.success();

  }


};
