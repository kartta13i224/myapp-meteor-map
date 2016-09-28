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
	
	
	// Method takes two cities names and then calculates the shortest route between them,
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
	'calculateDistance'({city1, city2}){
		
		console.log("City1: " + city1);
		console.log("City2: " + city2);
		
		// Fetches all the map routing data from MongoDB
		var cities = suomi_gps.find().fetch();
		
		// Has functions that makes it possible to search and find data from the MongoDBs result.
		var find = function(){
			return {
				
				// Search given city's neighbours into an array.
				Neighbours: function(city){
					
					var Nbs = [];
					for (var cityLoop = 0; cityLoop < cities.length; cityLoop++){
						// If given city matches the place1, add it's neighbour to list.
						if (cities[cityLoop].place1 == city){
							// Creates a temporary neighbour object and fills it with the necessary data:
							// What neighbouring city is it and what is the distance.
							var neighbour = {toCity:cities[cityLoop].place2, dist:cities[cityLoop].dist};
							
							// Push it into an array.
							Nbs.push(neighbour)
						}
					}
					console.log(Nbs);
					return Nbs;
				},
				/*
				// Dijkstra algorithm function. Takes in the "table" object for calculations.
				Dijkstra: function(distList){
					
					// Logical test, if null, don't do anything.
					if (distList == null){
						return;
					}
					
					
					// Find the next closest city to view from.
					var nextCity; // Stores the array number of the closest city.
					var comparisonDist = Infinity;
					for (var i = 0; i < distList.length; i++){
						if (distList[i].known == "F"){
							if (distList[i].Dt < comparisonDist){
								comparisonDist = distList[i].Dt;
									
								nextCity = i;
							}
						}
					}

					// The next city to view: distList[nextCity]
					console.log(distList[nextCity]);
					
					for (var i = 0; i < distList[nextCity].Nbs){
						
					}					
				}
				*/
			}
		}
		
		// INITIALIZING...
		
		
		// Splices off unnecessary entries that will not be used in the calculations (reduces loops in algorithms)
		// Place1 = starting city, Place2 = next city (neighbour)
		// if next city has a connection to starting city, going back and forth between cities is never the shortest route.		
		for (var cityLoop = 0; cityLoop < cities.length; cityLoop++){
			if (cities[cityLoop].place2 == city1){
				console.log("Takaisinpäin katselmointi poistettu!");
				cities.splice(cityLoop, 1);
				cityLoop--;
			}
		}
		
		
		// Get list of distinctCities from MongoDB, which will be used to fill into distList later.
		var distinctCities = _.uniq(suomi_gps.find({},{
			sort: {place1: 1}, fields: {place1: true}
			}).fetch().map(function(x){
				return x.place1;
		}), true);
		
		// Create "table" which will be used for Dijksta calculations.
		// The "table" object consists from following parts:
		
		// place = place of the object.
		// known = if the is known and checked. F = false, T = true.
		// Dt = Total Distance from starting point. X means infinite.
		// Path = From which place the Total Distance is calculated from.
		// Nbs = array of Neighbours
		
		/*
		var distList = [
			{place:"", known:"F", Dt:"", Path:"", Nbs:[]},
			{etc.}
		];
		
		// Neighbour array's construction.
		// toCity = from which city
		// dist = distance from the named city
		
		Nbs = [
			{toCity:"", dist:""}
		]
		*/
		
		var distList = [];
		
		// Create find() function. It will be called later in the loops.
		FIND = find();
		
		// Loop through all the different cities and push them into distList as seperate objects.
		// NOTE: Does not check if the city already exists in distList.
		// It expects that distinctCities has no duplicate entries.
		for (var cityLoop = 0; cityLoop < distinctCities.length; cityLoop++){
			// For each different city, create temporary object and for it's Neighbours array (Nbs), call FIND.Neighbours() function.
			// Sets all cities known to F (false) as they have not been processed and X meaning infinite distance.
			var tempPlace;
			// If the current object in distinctCities is the starting point, set it to known (T as true) and distance (Dt as 0).
			if (distinctCities[cityLoop] == city1){
				tempPlace = {place:distinctCities[cityLoop], known:"T", Dt:0, Path:"", Nbs:FIND.Neighbours(distinctCities[cityLoop])};
			}
			else {
				tempPlace = {place:distinctCities[cityLoop], known:"F", Dt:Infinity, Path:"", Nbs:FIND.Neighbours(distinctCities[cityLoop])};
			}
			
			distList.push(tempPlace);
		}

		// END INITIALIZATION
		
		
		
		
		
		
		console.log(distList);

		

		// When all the calculations are done, shortest route can be found by printing the Path values
		// in reverse, starting from ending location.

		
		
		// Return the result to client.
		return distList;
		
		
		
	

		
		

	}
	
	
	
});
