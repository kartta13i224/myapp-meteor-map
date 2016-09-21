//import { Meteor } from 'meteor/meteor';



Meteor.startup(() => {
  // Create map database
		
		/*
		if (suomi_gps)
			suomi_gps._dropCollection();
		*/
		
		suomi_gps = new Mongo.Collection('suomi_gps');
		console.log("METEORITE ON AUKI");
		// Code ran only once, commented for future purposes if recreating it.
		
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
	
	// Koodi palauttaa tietokannassa olevan listan kaikista eri kaupungeista.
	'getCityList'({}){
		
		// Etsii MongoDB:stä listan kaupungeista joilla on eri nimi ja niiltä löytyy 
		var distinctCities = _.uniq(suomi_gps.find({},{
			sort: {place1: 1}, fields: {place1: true}
			}).fetch().map(function(x){
				return x.place1;
		}), true);
	
		return distinctCities;
	},
	
	// Ottaa sisäänsä kahden kaupungin tiedot ja laskee niiden välisen lyhimmän välimatkan.
	'calculateDistance'({city1, city2}){
		
		// Haetaan kaikki data mongosta ja sijoitetaan listaan.
		var cities = suomi_gps.find().fetch();
		
		// Karsitaan aluepaikkaan sitoutuneet edestakaisuudet.
		// Place1 = aloitus paikka, Place2 = seuraava paikka.
		// if ("Place1 = Seuraava paikka, Place1 = aloituspaikka" == totta) DELET THIS
		for (var cityLoop = 0; cityLoop < cities.length; cityLoop++){
			if (cities[cityLoop].place2 == "city1"){
				cities.splice(cityLoop, 1);
				cityLoop--;
			}
		}
		
		// Tulostus client päälle testiksi.
		return cities;
		
		
		
		
		// Aloitetaan katselmointi ensimmäisestä pisteestä aloittaen. Loop.
		// Kun jonkin pisteen seuraavat ehdot kaikki täyttyvät, piste karsitaan pois (DELET THIS):
		// - Kyseisen pisteen jokainen reitti on katselmoitu lävitse.
		// - Kyseisen pisteen jokaisen päässä olevan pisteen reitit on katselmoitu lävitse.
		// - Kyseisten edelliste mainitsemien pisteiden reitit ovat todettu pitemmiksi kuin muut vaihtoehdot.
		
		// Kun lyhin reitti on löydetty, saadaan se Path muuttujan kautta tulostettua,
		// aloittaen päätöspisteestä.
		
	
		
		/*
			Place1 = City1
			Place2 = City2
			
			place1
			suomi_gps.insert({place1:"Oulu",place2:"Kajaani",dist:180});
			suomi_gps.insert({place1:"Oulu",place2:"Kuopio",dist:290});
			suomi_gps.insert({place1:"Oulu",place2:"Vaasa",dist:320});
			
			
			
			!place2
			suomi_gps.insert({place1:"Jämsä",place2:"Kuopio",dist:203});
			suomi_gps.insert({place1:"Jämsä",place2:"Mikkeli",dist:167});
			suomi_gps.insert({place1:"Jämsä",place2:"Tampere",dist:100});
			suomi_gps.insert({place1:"Jämsä",place2:"Helsinki",dist:225});
			
		*/
		
		// place = place of the object.
		// known = if the is known and checked. F = false, T = true.
		// Dt = Total Distance from starting point.
		// Path = From which place the Total Distance is calculated from.
		/*
		var distList = [
			{place:"", known:"F", Dt:"", Path:""},
			{place:"", known:"F", Dt:"", Path:""},
			{place:"", known:"F", Dt:"", Path:""},	
			{place:"", known:"F", Dt:"", Path:""},
		
		];
		*/
		
	}
	
	
	
});
