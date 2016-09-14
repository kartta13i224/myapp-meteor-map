//import { Meteor } from 'meteor/meteor';



Meteor.startup(() => {
  // Create map database
		suomi_gps = new Mongo.Collection('suomi_gps');
		console.log("METEORITE ON AUKI");
		// Code ran only once, commented for future purposes if recreating it.
		//suomi_gps._dropCollection();
		/*
		suomi_gps.insert({place1:"Oulu",place2:"Kajaani",dist:180});
		suomi_gps.insert({place1:"Oulu",place2:"Kuopio",dist:290});
		suomi_gps.insert({place1:"Oulu",place2:"Vaasa",dist:320});
		suomi_gps.insert({place1:"Kajaani",place2:"Oulu",dist:180});
		suomi_gps.insert({place1:"Kajaani",place2:"Kuopio",dist:170});
		suomi_gps.insert({place1:"Kajaani",place2:"Joensuu",dist:230});
		suomi_gps.insert({place1:"Kuopio",place2:"Oulu",dist:290});
		suomi_gps.insert({place1:"Kuopio",place2:"Kajaani",dist:170});
		suomi_gps.insert({place1:"Kuopio",place2:"Joensuu",dist:130});
		suomi_gps.insert({place1:"Kuopio",place2:"Vaasa",dist:380});
		suomi_gps.insert({place1:"Kuopio",place2:"Jämsä",dist:203});
		suomi_gps.insert({place1:"Vaasa",place2:"Oulu",dist:320});
		suomi_gps.insert({place1:"Vaasa",place2:"Kuopio",dist:380});
		suomi_gps.insert({place1:"Vaasa",place2:"Tampere",dist:240});
		suomi_gps.insert({place1:"Joensuu",place2:"Kajaani",dist:230});
		suomi_gps.insert({place1:"Joensuu",place2:"Kuopio",dist:130});
		suomi_gps.insert({place1:"Joensuu",place2:"Mikkeli",dist:210});
		suomi_gps.insert({place1:"Joensuu",place2:"Imatra",dist:200});
		suomi_gps.insert({place1:"Mikkeli",place2:"Kuopio",dist:160});
		suomi_gps.insert({place1:"Mikkeli",place2:"Joensuu",dist:210});
		suomi_gps.insert({place1:"Mikkeli",place2:"Imatra",dist:140});
		suomi_gps.insert({place1:"Mikkeli",place2:"Helsinki",dist:230});
		suomi_gps.insert({place1:"Mikkeli",place2:"Jämsä",dist:167});
		suomi_gps.insert({place1:"Jämsä",place2:"Kuopio",dist:203});
		suomi_gps.insert({place1:"Jämsä",place2:"Mikkeli",dist:167});
		suomi_gps.insert({place1:"Jämsä",place2:"Tampere",dist:100});
		suomi_gps.insert({place1:"Jämsä",place2:"Helsinki",dist:225});
		suomi_gps.insert({place1:"Tampere",place2:"Vaasa",dist:240});
		suomi_gps.insert({place1:"Tampere",place2:"Jämsä",dist:100});
		suomi_gps.insert({place1:"Tampere",place2:"Turku",dist:150});
		suomi_gps.insert({place1:"Tampere",place2:"Helsinki",dist:170});
		suomi_gps.insert({place1:"Imatra",place2:"Joensuu",dist:200});
		suomi_gps.insert({place1:"Imatra",place2:"Helsinki",dist:260});
		suomi_gps.insert({place1:"Imatra",place2:"Mikkeli",dist:140});
		suomi_gps.insert({place1:"Turku",place2:"Tampere",dist:150});
		suomi_gps.insert({place1:"Turku",place2:"Helsinki",dist:160});
		suomi_gps.insert({place1:"Helsinki",place2:"Mikkeli",dist:230});
		suomi_gps.insert({place1:"Helsinki",place2:"Jämsä",dist:225});
		suomi_gps.insert({place1:"Helsinki",place2:"Tampere",dist:170});
		suomi_gps.insert({place1:"Helsinki",place2:"Imatra",dist:260});
		suomi_gps.insert({place1:"Helsinki",place2:"Turku",dist:160});
		*/
});

// Laskenta koodi.
Meteor.methods({
	'getCityList'({city1, city2}){
		var distinctCities = _.uniq(suomi_gps.find({},{
			sort: {place1: 1}, fields: {place1: true}
			}).fetch().map(function(x){
				return x.place1;
		}), true);
	
		console.log(city1 + " ja " + city2);
		return distinctCities;
	}
});
