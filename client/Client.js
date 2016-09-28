
import './Client.html';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});

Template.leadForm.helpers({
    'categories': function(){
        //return Options.find();
		return Session.get('startCity');
    },
    'isSelected': function(option){
      var selected = Selected.findOne('SELECTED') ? Selected.findOne('SELECTED').selected : '';
      return option === selected ? 'selected' : '';
    },
	'categories2': function(){
        //return Options2.find();
		return Session.get('destinationCity');
    },
    'isSelected2': function(option2){
      var selected2 = Selected2.findOne('SELECTED2') ? Selected2.findOne('SELECTED2').selected2 : '';
      return option2 === selected2 ? 'selected2' : '';
    }
  });

  Template.leadForm.events({
    'click #addOption': function () {
      Options.insert({option: Fake.sentence(3)});
    },
    'change #leadSource2': function(event, template){
      Selected.update('SELECTED', {selected: event.target.value});
    },
	    'click #addOption2': function () {
      Options2.insert({option: Fake.sentence(5)});
    },
    'change #leadSource2': function(event, template){
      Selected2.update('SELECTED2', {selected2: event.target.value});
    }
  })



Template.info.onCreated(function helloOnCreated(){
	
	Session.set('cityText', 'ALOITUS TEKSTI');
});


Template.info.helpers({		
	city(){
		return Session.get('cityText');
	},
	
});
	
	// TODO: List the cities into the two combo/selection boxes.
	// TODO: Send request between the two cities (auto or via button press?)
	// TODO: Show the path result in a sensible format (Starting City - km - Ending City
	// and the full path: City1 - km - City2 - km - City3 etc.)
	// TODO: If two same cities are selected, do not send request:
	// Instead show result like this (eg.): City1 - 0 km - City1
	// Or show error to user to not to select same cities.
	// TODO: Clean Client.js and Client.html of unnecessary stuff.
	
Template.info.events({
	'click .test'(event, instance){
		
	// Returning the shortest path and the total distance in between, using following format:
	/*
		result = {
			route:[
				{place:"1st city's name", dist:"distance from the last place in km"},
				{etc.}
			]
			totalDist:"Total distance in km"
		}
	*/
		Meteor.call('calculateDistance', {
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
			
			
		// Start of call
		
		// Returns a list of cities in an array.
		// Example: res[0] = Tampere, res[1] = Helsinki etc.
		Meteor.call('getCityList', {}, (err, res) =>{
				if (err){
					alert(err);
				} else {
					// No errors in input!
					console.log(res);
					Session.set('startCity', res);
					Session.set('destinationCity', res);
				}
		});
		
		// End of call
	},
});

Template.TestUtilsTemplate.events({
	'click .createData'(event, instance) {
		Meteor.call('CreateStuffInDatabase');
	}
});
		