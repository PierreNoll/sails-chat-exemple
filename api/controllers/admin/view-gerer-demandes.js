module.exports = {


  friendlyName: 'View gerer demandes',


  description: 'Display "Gerer demandes" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/admin/gerer-demandes'
    }

  },


  fn: async function (inputs, exits) {

    // Recupere les demandes d'inscription
    //var demandesInscription = await DemandInscription.find({emailStatus: 'confirmed'});
    var demandesInscription = await DemandInscription.find();


    // Respond with view.
    return exits.success({demandesInscription:demandesInscription});

  }


};
