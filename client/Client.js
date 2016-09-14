
import './Client.html';

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
			
		// Start of call
		Meteor.call('simpleFunction', {
			city1: 'Jämsä',
			city2: 'Tampere'
			}, (err, res) =>{
				if (err){
					alert(err);
				} else {
					// No errors in input!
					console.log(res);
				}
		});
		// End of call
	},
});