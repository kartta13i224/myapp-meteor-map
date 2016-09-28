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
		city1 is starting point and cit2 is ending point.
	*/
	'calculateDistance'({city1, city2}){
		
		//console.log("City1: " + city1);
		//console.log("City2: " + city2);
		
		// MOCK DATA
		city1 = "Turku";
		city2 = "Kajaani";
		
		
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
					
					//console.log(Nbs);
					return Nbs;
				},
				/*
				// Dijkstra algorithm function. Takes in the "table" object for calculations.
				Dijkstra: function(distList){
					
					// Logical test, if null, don't do anything.
					if (distList == null){
						return;
					}
					
					// If no known="F" exists, exists = true, else exists = false.
					var exists = false;
					while (!exists){
						
						// Find the next closest city to view from.
						var nextCity = null; // Stores the array number of the closest city.
						var comparisonDist = Infinity; // Sets comparad distance as Infinity by default.
						
						// Loops through the distList checking the next shortest city that is not known (T) yet.
						for (var i = 0; i < distList.length; i++){
							
							
							// Check that the city is not known (already checked).
							if (distList[i].known != "T"){
								//console.log("Trying not known city number " + i);
								// Check that it has shorter distance than comparisonDist.
								if (distList[i].Dt < comparisonDist){
									comparisonDist = distList[i].Dt;
									//console.log("Found a closer city!");
									nextCity = i;
								}
							}
						}

						// The next city to view: distList[nextCity]
						//console.log(distList[nextCity]);
						
<<<<<<< HEAD
						
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
						
						
						// Logical test.
						if (nextCity != null){

							// This will be used to calculate new distances.
							var tempDistance = distList[nextCity].Dt;
							
							// Look through the city's neighbours.
							for (var i = 0; i < distList[nextCity].Nbs.length; i++){
								// Calculate the distance sum for the current Neighbour.
								var tempDistance = distList[nextCity].Dt + distList[nextCity].Nbs[i].dist;								
								//console.log("Starting to view neighbour number " + i);
								
								// For each neighbour, check it's current distance (Dt) in distList
								// with the distance as neighbour. If it's less, update the following fields
								// in the distList:
								// .Dt = new shortest distance
								// .Path = array location from the current viewed city.
								for (var j = 0; j < distList.length; j++){

									// Check that names match and distance is less than calculated.
									if (distList[nextCity].Nbs[i].toCity == distList[j].place
									&& tempDistance < distList[j].Dt){
										/*
										console.log("Name same and distance accepted!");
										console.log("Current neighbour data: ");
										console.log(distList[nextCity].Nbs[i]);
										console.log("Current neighbour viewed: ");
										console.log(distList[j]);
										*/
										
										
										// NOTE: Also check that the Neighbour is NOT the city that we are coming from.
										var isThePlaceWeCameFrom = false; // By default, the neighbour is not the place we came from.
										
										// Check that the Path value is in readable format (is an integer, not X or SP).
										// if (distList[nextCity].Path != "X" && distList[nextCity].Path != "SP"){
										if (Number.isInteger(distList[nextCity].Path)){
											//console.log("Passed X && SP test!");
											if (distList[distList[nextCity].Path].place == distList[nextCity].Nbs[i].toCity){
												//console.log("Place is where we came from!");
												isThePlaceWeCameFrom = true; // Found neighbour is a city we came from, set to true!
											}
										}
										
										// If the neighbour is not the place we came from, add the new information.
										if (!isThePlaceWeCameFrom){

											// Add new distance to the neighbour's distList object (sum on current dist+)
											distList[j].Dt = tempDistance;
											// distList[j].Path = distList[nextCity].place; Physical name into .Path
											distList[j].Path = nextCity;
											//console.log("Changed city data: " + j);
											//console.log(distList[j]);
										}

										
									}
									
								}
							}
							
							//console.log("Set to known.");
							distList[nextCity].known = "T";

						}

						// By default after calculations, set that no known="F" cities exists.
						exists = true;

						// Check if known="F" cities exists, if there is even one, set to true.
						for (var i = 0; i < distList.length; i++){
							if (distList[i].known == "F"){
								//console.log("Found false!");
								exists = false;
								break;
							}
						}
					}
					
					return distList;
					
=======
					}					
>>>>>>> origin/master
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
		// Path = From which place the Total Distance is calculated from
		// (Shown as integer = location in the array).
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
		// FIND functions are found above.
		FIND = find();
		
		// Loop through all the different cities and push them into distList as seperate objects.
		// NOTE: Does not check if the city already exists in distList.
		// It expects that distinctCities has no duplicate entries.
		for (var cityLoop = 0; cityLoop < distinctCities.length; cityLoop++){
			// For each different city, create temporary object and for it's Neighbours array (Nbs), call FIND.Neighbours() function.
			// Sets all cities known to F (false) as they have not been processed and X meaning infinite distance.
			var tempPlace;
			// If the current object in distinctCities is the starting point, set it's distance to 0 (Dt as 0) and Path as SP (StartingPoint).
			if (distinctCities[cityLoop] == city1){
				tempPlace = {place:distinctCities[cityLoop], known:"F", Dt:0, Path:"SP", Nbs:FIND.Neighbours(distinctCities[cityLoop])};
			}
			else {
				tempPlace = {place:distinctCities[cityLoop], known:"F", Dt:Infinity, Path:"X", Nbs:FIND.Neighbours(distinctCities[cityLoop])};
			}
			
			distList.push(tempPlace);
		}
		
		// console.log(distList); // Console Log distList after initialization.
		// END INITIALIZATION
		
		
		// Do Dijkstra Algorithm.
		distList = FIND.Dijkstra(distList);				
		//console.log(distList); // Console Log distList after Dijkstra calculation

		// When all the calculations are done, shortest route can be found by printing the Path values
		// in reverse, starting from ending location.
		
		var lastPoint = null; // Store array location of the ending point (city2).
		for (var i = 0; i < distList.length; i++){
			if (distList[i].place == city2){
				lastPoint = i;
			}
		}

		var route = []; // route array which stores the shortest path.
		var totalDist = distList[lastPoint].Dt; // stores the total shortest distance (km).
		var tempDist = totalDist; // stores temporary distance, used for calculating distance between each route.
		var tempObj; // temporary object used to push into route array.
		
		// Create the shortest path into route array.
		// Do as long as the Path == SP is found (StartingPoint)
		while(distList[lastPoint].Path != "SP"){

			// Calculate distance between lastPoint and it's nextPoint.
			// Dijkstra stores total Distance value in Dt, so substract each other.
			tempDist = distList[lastPoint].Dt - distList[distList[lastPoint].Path].Dt;
			//console.log("Value of tempDist: " + tempDist);
			// Add data into temporary Object, the place of the lastPoint and Distance.
			tempObj = {place:distList[lastPoint].place, dist:tempDist}
			
			route.push(tempObj);
			lastPoint = distList[lastPoint].Path;
		}
		
		// Create result object which has the route array and totalDistance.
		result = {route, totalDist};
		
		
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

		// Return the result to client.
		return result;
		
		
		
	

		
		

	},
	'CreateStuffInDatabase': function() {
		console.log(suomi_gps);
		suomi_gps.remove({});
		console.log(suomi_gps);
		//suomi_gps = new Mongo.Collection('suomi_gps');
		//console.log(suomi_gps);
		
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
		
	}
	
	
	
});
