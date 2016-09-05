import { Images } from '../api/images.js';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

Session.set('imageLimit', 8);

$(window).scroll(function(event){
	// test if we are near the bottom of the window, if yes, load additional images
	if ($(window).scrollTop() + $(window).height() >= $(document).height()){
		Session.set('imageLimit', Session.get('imageLimit') + 4);
	}
});

Accounts.ui.config({
	passwordSignupFields: "USERNAME_AND_EMAIL",
});

Template.images.helpers({
	images(){
		if(Session.get("userFilter")){
			return Images.find({createdBy:Session.get("userFilter")});
		}
		else{
			return Images.find({},{sort:{createdOn:-1, rating:-1}, limit:Session.get('imageLimit')});
		}
	},
	filtering_images:function(){
		if (Session.get("userFilter")){
			return true;
		}
		return false;
	},
	getFilterUser:function(){
		if (Session.get('userFilter')){
			let user = Meteor.users.findOne({_id:Session.get('userFilter')});
			return user.username;
		}
	},
	getUser:function(user_id){
		let user = Meteor.users.findOne({_id:user_id});
		if (user){
			return user.username;
		}
		else {
			return 'anon';
		}
	},
});

Template.body.helpers({username:function(){
		if (Meteor.user()){
			return Meteor.user().username;
		}
		else {
			return "unknown user..";
		}
	}
});


Template.images.events({
	'click .js-image':function(event){
		$(event.target).css('width', '50px');
	},
	'click .js-del-image':function(event){
	   var image_id = this._id;
	   console.log(image_id);
	   // use jquery to hide the image component
	   // then remove it at the end of the animation
	   $("#"+image_id).hide('slow', function(event){
	    Images.remove({'_id':image_id});
	   });
	   console.log(Images.find().count());
	},
	'click .js-rate-image':function(event){
		let rating = $(event.currentTarget).data('userrating');
		let image_id = this.id;
		Images.update({_id:image_id}, {$set:{rating:rating}})
	},
	'click .js-show-image-form':function(event){
		$('#image_add_form').modal('show');
	},
	'click .js-set-image-filter':function(event){
		Session.set("userFilter", this.createdBy);
	},
	'click .js-remove-image-filter':function(event){
		Session.set("userFilter", null);
	},
});

Template.image_add_form.events({
	'submit .js-add-image':function(event){
		let img_src, img_alt;
		img_src = event.target.img_src.value;
		img_alt = event.target.img_alt.value;
		if (Meteor.user()){
			Images.insert({
				img_src:img_src,
				img_alt:img_alt,
				createdOn:new Date(),
				createdBy:Meteor.user()._id,
			});
		}	
		$('#image_add_form').modal('dismiss');
		return false;
	},
});
