import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Images = new Mongo.Collection('images');

Images.allow({
	insert:function(userId, doc){
		if (Meteor.user()){
			if (userId != doc.createdBy){
				return false;
			}
			else {
				return true;
			}
		}
		return false;
	},
	remove:function(userId, doc){
		console.log('Test remove');
		return true;
	},
	update:function(userId, doc){
		console.log('Update');
		return true;
	},
});