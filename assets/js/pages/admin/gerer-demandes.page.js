parasails.registerPage('gerer-demandes', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    fieldsInscription: [
      {
        key: 'selectionner',
      },
      {
        key: 'fullName',
        sortable: true
      },
      {
        key: 'emailAddress',
        sortable: true
      },
      {
        key: 'emailStatus',
        sortable: true
      },
      {
        key: 'updatedAt',
        label: 'Dernière modification',
        sortable: true,
        formatter:'formatter'
      },
    ],
    itemsInscription : [
    ],
    filterInscription: null,

    //Data for the form to add a contributeur
    // Main syncing/loading state for this page.
    syncing: false,

    // Form data
    formData: {
      selectedInscription:[],
     },

    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `formData`.
    formErrors: { /* … */ },

    // A set of validation rules for our form.
    // > The form will not be submitted if these are invalid.
    formRulesInscription: {
    },


    // Modals for add / remove contributeurs
    show:false,
    showRm: false,
    showAjaxButton:false,
    showSend:false,

    // Server error state for the form
    cloudErrorInscription: '',

    // CountDown for the alerts
    dismissSecs: 3,
    dismissCountDownSuccessInscription: 0,
    dismissCountDownSuccessRmInscription:0,
    dismissCountDown:0,

    timeout:3000
  },


  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function (){
    _.extend(this, window.SAILS_LOCALS);

    // Make this.itemXxx global to the function beforeMount so that we can refer to it into the callback
    var itemsInscription = this.itemsInscription;

    function callback(value){
      itemsInscription.push({
        selectionner:value.id,
        fullName: value.fullName,
        emailAddress: value.emailAddress,
        emailStatus: value.emailStatus,
        updatedAt:value.updatedAt,
      })
    };

    _.forEach(this.demandesInscription ,callback);


  },
  mounted: async function() {


  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    formatter(value){
      var ts = new Date(value);
      var dateString = ts.toLocaleString();
      return dateString
    },

    submittedFormInscription: async function() {
      this.showAlert('successInscription');
      this.formData.selectedInscription=[];
      window.setTimeout(function wait(){window.location.reload();}, this.timeout)
    },

    submittedFormRmInscription: async function() {
      this.showAlert('successRmInscription');
      this.formData.selectedInscription=[];
      window.setTimeout(function wait(){window.location.reload();}, this.timeout)
    },

    countDownChanged (dismissCountDown) {
      this.dismissCountDown=dismissCountDown;
    },
    
    showAlert (type) {
      if (type === 'successInscription') {
        this.dismissCountDownSuccessInscription = this.dismissSecs
        this.dismissCountDown=this.dismissSecs;
      } else if (type === 'successRmInscription') {
        this.dismissCountDownSuccessRmInscription = this.dismissSecs
        this.dismissCountDown=this.dismissSecs;
      }
    },

  },


});
