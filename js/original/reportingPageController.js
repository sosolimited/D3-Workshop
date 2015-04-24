/*
File: reportingPageController.js
Description: function to set controls, click handlers, etc. on page.
Author: JC Nesci
*/

var reportingPageController = (function(){

	var that = {};

	var setup = function() {

		$('#generate-graph').prop('disabled', true);
		$('#delete-graph').prop('disabled', true);

		$('#generate-graph').click(function(event){
			// console.log("CLICK Generate graph");
			var startDate = $("#start").val();
			var endDate = $("#end").val();

			emptyGraphContainerDateRange();

			reportingGraphView.createGraph( "dateRange", reportingData.getDateRangeGraphData( startDate, endDate ) );
			$('#delete-graph').prop('disabled', false);
		});

		$('#delete-graph').click(function(event){
			console.log("CLICK Delete graph");
			emptyGraphContainerDateRange();
		});

		// Normal end date for datepicker is today, but and max end date is the Superbowl.
		var todayDate = new Date();
		var superbowlDate = new Date("2015-02-01");
		var endDate;
		todayDate < superbowlDate ? endDate = todayDate.getFullYear()+"-"+(todayDate.getMonth()+1)+"-"+todayDate.getDate() : endDate = "2015-02-01";
		$('#daterange .input-daterange').datepicker({
		    format: "yyyy-mm-dd",
		    startDate: "2015-01-09",
		    endDate: endDate
		}).on("changeDate", function(event) {
			if ( $(this).find("#start").val() != "" && $(this).find("#end").val() != ""
					&& new Date($(this).find("#start").val()) <= new Date($(this).find("#end").val()) ) {
				// console.log("BOTH DATES EXIST");
				$('#generate-graph').prop('disabled', false);
			} else {
				$('#generate-graph').prop('disabled', true);
			}
		});
	}

	// Empty container for single day graphs.
	var emptyGraphContainer = function() {
		$("#graph-container").empty();
	}

	// Empty container for daterange graphs.
	var emptyGraphContainerDateRange = function() {
		$("#graph-container-daterange").empty();
		$('#delete-graph').prop('disabled', true);
	}

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// Start.
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	setup();

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// Public Interface.
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	that.emptyGraphContainer = emptyGraphContainer;

	return that;

})();
