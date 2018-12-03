/**
 * cloud.setup.js
 *
 * Configuration for this Sails app's generated browser SDK ("Cloud").
 *
 * Above all, the purpose of this file is to provide endpoint definitions,
 * each of which corresponds with one particular route+action on the server.
 *
 * > This file was automatically generated.
 * > (To regenerate, run `sails run rebuild-cloud-sdk`)
 */

Cloud.setup({

  /* eslint-disable */
  methods: {"confirmEmail":{"verb":"GET","url":"/email/confirm","args":["token"]},"getDiscussion":{"verb":"GET","url":"/api/v1/dashboard/get-discussion/:idDiscussion","args":["idDiscussion"]},"getDiscussions":{"verb":"GET","url":"/api/v1/dashboard/get-discussions","args":[]},"getUnreadMessages":{"verb":"GET","url":"/api/v1/dashboard/get-unread-messages/:discussionId","args":["discussionId"]},"getConnexionStatus":{"verb":"GET","url":"/api/v1/dashboard/get-connexion-status","args":[]},"getDiscussionMembers":{"verb":"GET","url":"/api/v1/dashboard/get-discussion-members/:discussionId","args":["discussionId"]},"logout":{"verb":"GET","url":"/api/v1/account/logout","args":[]},"updatePassword":{"verb":"PUT","url":"/api/v1/account/update-password","args":["password"]},"updateProfile":{"verb":"PUT","url":"/api/v1/account/update-profile","args":["fullName","emailAddress"]},"updateBillingCard":{"verb":"PUT","url":"/api/v1/account/update-billing-card","args":["stripeToken","billingCardLast4","billingCardBrand","billingCardExpMonth","billingCardExpYear"]},"login":{"verb":"PUT","url":"/api/v1/entrance/login","args":["emailAddress","password","rememberMe"]},"signup":{"verb":"POST","url":"/api/v1/entrance/signup","args":["emailAddress","password","fullName"]},"sendPasswordRecoveryEmail":{"verb":"POST","url":"/api/v1/entrance/send-password-recovery-email","args":["emailAddress"]},"updatePasswordAndLogin":{"verb":"POST","url":"/api/v1/entrance/update-password-and-login","args":["password","token"]},"deliverContactFormMessage":{"verb":"POST","url":"/api/v1/deliver-contact-form-message","args":["emailAddress","topic","fullName","message"]},"postMessage":{"verb":"POST","url":"/api/v1/dashboard/post-message","args":["msg","discussion"]},"createNewDiscussion":{"verb":"POST","url":"/api/v1/dashboard/create-new-discussion","args":["usersId","title"]},"resetUnreadMessages":{"verb":"PATCH","url":"/api/v1/dashboard/reset-unread-messages","args":["discussionId"]},"updateDiscussionTitle":{"verb":"PATCH","url":"/api/v1/dashboard/update-discussion-title","args":["discussionId","newTitle"]},"addMembersToDiscussion":{"verb":"POST","url":"/api/v1/dashboard/add-members-to-discussion","args":["usersId","discussionId"]},"validerInscription":{"verb":"POST","url":"/api/v1/admin/valider-inscription","args":["selectedInscription"]},"removeInscriptionDemande":{"verb":"POST","url":"/api/v1/admin/remove-inscription-demande","args":["selectedInscription"]}}
  /* eslint-enable */

});
