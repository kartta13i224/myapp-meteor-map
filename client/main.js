//import { Template } from 'meteor/templating';
//import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

suomi_gps= new Mongo.Collection('suomi_gps');

if(Meteor.isServer){
    console.log("Hello server!");
}

if(Meteor.isClient){
    console.log("Hello client");
	
	
	Template.hello.onCreated(function helloOnCreated(){
		Session.set('cityText', 'ALOITUS TEKSTI');
	});
	
	
	Template.hello.helpers({
		
		city(){
			return Session.get('cityText');
		},
	});
	
	
	Template.hello.events({
		'click .test'(event, instance){
			console.log(Session.get('cityText'));
			Session.set('cityText', 'MUUTTUNUT TEKSTI');
			console.log(Session.get('cityText'));
		},

	});
	
}







