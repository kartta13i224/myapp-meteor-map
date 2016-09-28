
import './Client.html';

/*
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
*/
Template.leadForm.onCreated(function helloOnCreated(){
	Session.set('dropdownValue', "Please Select 1");
	Session.set('dropdownValue2', "Please Select 2");
	Session.set('foundDistance', null);
	Template.TestUtilsTemplate.__eventMaps[0]["click .fetchCities"].call({templateInstance: function() {}}, {preventDefault : function() {}});
});

Template.leadForm.helpers({
	'dropdownValue': function() {
		return Session.get('dropdownValue');
	},
	'dropdownValue2': function() {
		return Session.get('dropdownValue2');
	},
	'dropdowntList': function() {
		return Session.get('allCities');
	},
	'resultValue': function() {
		return Session.get('foundDistance');
	}
});
   
  /*
Template.dropdowntListItems.rendered = function(){
    $('.menu').dropdown(); //gets called N times
}; 
	*/
	
Template.dropdowntListItems.events({
	'click .itemLink': function(event, template) {
		Session.set('dropdownValue', template.data);
		Session.set('foundDistance', null);
		if (Session.get('dropdownValue2') != 'Please Select 2') {
			Template.TestUtilsTemplate.__eventMaps[0]["click .findDistance"].call({templateInstance: function() {}}, {preventDefault : function() {}});
		}
	},

});

Template.dropdowntListItems2.events({
	'click .itemLink2': function(event, template) {
		Session.set('dropdownValue2', template.data);
		Session.set('foundDistance', null);
		if (Session.get('dropdownValue') != 'Please Select 1') {
			Template.TestUtilsTemplate.__eventMaps[0]["click .findDistance"].call({templateInstance: function() {}}, {preventDefault : function() {}});
		}
	},

});
	
	// TODO: Send request between the two cities (auto or via button press?)
	// TODO: Show the path result in a sensible format (Starting City - km - Ending City
	// and the full path: City1 - km - City2 - km - City3 etc.)
	// TODO: If two same cities are selected, do not send request:
	// Instead show result like this (eg.): City1 - 0 km - City1
	// Or show error to user to not to select same cities.
	// TODO: Clean Client.js and Client.html of unnecessary stuff.
	
Template.TestUtilsTemplate.events({
	'click .createData'(event, instance) {
		Meteor.call('CreateStuffInDatabase');
	},
	
	'click .findDistance': function(event, template) {
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
		var startCity = Session.get('dropdownValue')
		var distanceCity = Session.get('dropdownValue2')
		
		// for optimation
		if (startCity == distanceCity) {
				var result = {
					route:[
						{place:startCity, dist:"0"}
					],
					totalDist: "0"
				};
				
			Session.set('foundDistance', result);

			return;
		}
	
		Meteor.call('calculateDistance', {
			city1: startCity,
			city2: distanceCity
			}, (err, res) =>{
				if (err){
					alert(err);
				} else {
					// No errors in input!
					var tempObj;
					var route = [];
					for (var i = res.route.length-1; i >= 0; i--) {
						tempObj = {place:res.route[i].place, dist:res.route[i].dist};
						route.push(tempObj);
					}
					res.route = route;
					Session.set('foundDistance', res);
				}
		});
	},
	
	'click .fetchCities': function(event, instance){
		// Start of call
		
		// Returns a list of cities in an array.
		// Example: res[0] = Tampere, res[1] = Helsinki etc.
		Meteor.call('getCityList', {}, (err, res) =>{
			if (err){
				alert(err);
			} else {
				// No errors in input!
				Session.set('allCities', res);
			}
		});
		
		// End of call
	},
});
		