/*
File: reportingData.js
Description: Loads & polls data from Soso's Client API for creating the dashboard items.
Author: JC Nesci
*/

var reportingData = (function() {

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// Variables.
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	var that = {};
	var countsInterval = null;
	// countsData is the data used for barcharts.
	var countsData = {};
	var isFirstDataLoad = true;
	// Teams in the Divisional Round.
	var teamsDivisional = [	"packers",
													"seahawks",
													"colts",
													"patriots",
													"ravens",
													"broncos",
													"panthers",
													"cowboys" ];
	// Teams in the Conference Championships.
	var teamsConference =	[	"packers",
													"seahawks",
													"colts",
													"patriots" ];
	// Teams in the Superbowl Final.
	var teamsFinal = 			[ "seahawks",
													"patriots" ];

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// Functions.
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	var loadAllData = function() {

		d3.json("data/originalData-temp1.json", function(error, data) {

			countsJSON = data;
			countsData = parseCountsJSON( countsJSON );
			displayGraphs();

		});

	}

	var parseCountsJSON = function( iCountsJSON ) {

		var temp = {};

		// Add all objects properties to contain different graph data here.
		temp.graphDataDays = createGraphDataDays( iCountsJSON );

	  return temp;
	}

	var createGraphDataDays = function( iCountsJSON ) {

		// Build graph data for each day,
		// which contains daily total count, and array of counts for each team that day.
		var days = {};
		for ( stream in iCountsJSON ) {
			var streamName = stream;
			var streamObj = iCountsJSON[ stream ];
			var teamName = iCountsJSON[ stream ].team;
			for ( day in streamObj.days ) {
				var dayObj = streamObj.days[day];
				var dayDate = new Date( dayObj.day )
				// Only use data starting from January 9th, 2015 (when good data starts).
				if ( dayDate > new Date( "2015-01-08" ) ) {
					var desiredTeams;
					if ( dayDate <= new Date( "2015-01-11" ) ) { desiredTeams = teamsDivisional; }
					else if ( dayDate >= new Date( "2015-01-12" ) && dayDate <= new Date( "2015-01-18" ) ) { desiredTeams = teamsConference; }
					else if ( dayDate >= new Date( "2015-01-19" ) ) { desiredTeams = teamsFinal; }
					desiredTeams = teamsDivisional;
					// Display teams that are in the set of desired teams at the date of the current data.
					// (ie. if data is from Jan. 11th, there were 8 active teams at that time,
					// whereas on Jan. 15th, there were 4 active teams.)
					if ( _.indexOf( desiredTeams, teamName ) != -1 ) {

						if ( !days.hasOwnProperty(dayObj.day) ) {
							days[ dayObj.day ] = {};
							days[ dayObj.day ].day = dayObj.day;
							days[ dayObj.day ].dayTotal = 0;
							days[ dayObj.day ].graphData = [];
						}
						days[ dayObj.day ].dayTotal += parseInt(dayObj.count);
						var curStreamData = {};
						curStreamData.stream = streamName;
						curStreamData.team = teamName;
						curStreamData.count = dayObj.count;
						days[ dayObj.day ].graphData.push( curStreamData );

					}
				}
			}
		}

		// Transform into an array for sorting by date, from newest to oldest.
		var data = [];
		for ( day in days ) {
			data.push( days[day] );
		}
		data.sort(function(a,b){
			return new Date(b.day) - new Date(a.day);
		});

		// For each day, sort teams by count value.
		for (var i = 0; i < data.length; i++) {
			data[i].graphData.sort(function(a,b){
				return parseInt(b.count) > parseInt(a.count);
			});
		}

		// console.log("- - - - - - - -");
		// console.log("data:");
		// console.log(data);

		return data;
	}

	var displayGraphs = function() {

		for ( dayData in countsData.graphDataDays ) {
			reportingGraphView.createGraph( "singleDay", countsData.graphDataDays[dayData] );
		}

	}

	// Aggregate multiple days of graphData together, as specified by provided date range.
	var getDateRangeGraphData = function( iStartDate, iEndDate ) {
		// console.log( "reportingData- getDateRangeGraphData- iStartDate: "+ iStartDate );
		// console.log( "reportingData- getDateRangeGraphData- iEndDate: "+ iEndDate );

		var startDate = new Date(iStartDate);
		var endDate = new Date(iEndDate);

		var aggregatedDay = {};
		aggregatedDay.day = iStartDate +" to "+ iEndDate;
		aggregatedDay.dayTotal = 0;
		aggregatedDay.graphData = [];

		for ( c in countsData.graphDataDays ) {
			var dayObj = countsData.graphDataDays[c];
			var dayString = dayObj.day;

			if ( ( new Date(dayString) >= startDate ) && ( new Date(dayString) <= endDate ) ) {
				aggregatedDay.dayTotal += dayObj.dayTotal;

				for ( s in dayObj.graphData ){
					var streamObj = dayObj.graphData[s];
					var streamString = dayObj.graphData[s].stream;

					// If this stream/team doesn't exist in aggregate data yet, copy it there.
					var streamInAD = _.find( aggregatedDay.graphData, function(i){ return i.stream == streamString } );
					if ( streamInAD == undefined ) { aggregatedDay.graphData.push( _.clone(streamObj) ); }
					// If it does exists already, add current day's count to aggregate's count.
					else {
						streamInAD.count = parseInt(streamInAD.count) + parseInt(streamObj.count);
					}
				}

			}
		}

		// Sort teams by count value.
		aggregatedDay.graphData.sort(function(a,b){
			return parseInt(b.count) > parseInt(a.count);
		});

		// console.log( "aggregatedDay:" );
		// console.log( aggregatedDay );

		return aggregatedDay;
	}

	var clearCountsInterval = function() {
		clearInterval( countsInterval );
	}

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// Public Interface.
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	that.loadAllData = loadAllData;
	that.clearCountsInterval = clearCountsInterval;
	that.getDateRangeGraphData = getDateRangeGraphData;

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	return that;

}());

