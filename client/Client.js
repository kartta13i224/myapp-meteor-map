
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
        return Options.find();
    },
    'isSelected': function(option){
      var selected = Selected.findOne('SELECTED') ? Selected.findOne('SELECTED').selected : '';
      return option === selected ? 'selected' : '';
    },
	'categories2': function(){
        return Options2.find();
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
	
	
Template.info.events({
	'click .test'(event, instance){
			
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
		/*
		Meteor.call('getCityList', {}, (err, res) =>{
				if (err){
					alert(err);
				} else {
					// No errors in input!
					console.log(res);
				}
		});
		*/
		// End of call
	},
});