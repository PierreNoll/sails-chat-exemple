parasails.registerPage('welcome', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    msg: '',
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);

    io.socket.headers = {
      "x-csrf-token": this._csrf,
    };


  },
  mounted: async function() {

    io.socket.get('/api/v1/dashboard/get-previous-messages/'+this.me.id, function(results){
      for (var i = 0; i < results.messages.length; i++) {
        $('#messages').append('<p class="m-0"><strong>'+results.messages[i].author.fullName+' :</strong> '+results.messages[i].message+'</p>');
      }
      $("html, body").animate({ scrollTop: $(document).height() }, 1000);
    })

    var self=this;
    io.socket.on('new_msg', function(results) {
      $('#messages').append('<p class="m-0 alert-success"><strong>'+results.sender+' :</strong> '+results.msg+'</p>');
      setTimeout(function () {
        $("p").removeClass('alert-success')
      }, 2000);
    });

  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    sendMsg : function(){
      $("html, body").animate({ scrollTop: $(document).height() }, 1000);
      io.socket.post('/api/v1/dashboard/post-message', {sender:this.me.fullName, msg: this.msg}, function(res, jrws){
        console.log(res, jrws);
      });
      this.msg='';
    }

  }
});
