define([
		"models/record",
		"lib/table/formatters/lat",
		"lib/table/formatters/lng",
		"lib/table/cells/delete"
	], function(Record, LatFormatter, LngFormatter, DeleteCell) {
    var Records = Backbone.Collection.extend({
        model: Record,
		columns: null,
		name: 'Records',
        url: "http://localground/api/0/forms/9/data/",
		initialize: function (opts) {
			Backbone.Model.prototype.initialize.apply(this, arguments);
			
			this.columns = [
				{
					name: "id", 
					label: "ID",
					editable: false,
					cell: Backgrid.IntegerCell.extend({
						orderSeparator: ''
					})
				},
				{
					name: "delete", 
					label: "delete",
					editable: false,
					cell: DeleteCell
				},
				{
					name: "project_id",
					label: "Project ID",
					cell: "integer" 
				},
				{
					name: "geometry",
					label: "Latitude",
					cell: Backgrid.Cell.extend({
						formatter: LatFormatter
					}),
					editable: true
				},
				{
					name: "geometry",
					label: "Longitude",
					cell: Backgrid.Cell.extend({
						formatter: LngFormatter
					}),
					editable: true
				},
				{
					name: "name",
					label: "Name",
					cell: "string"
				},
				{
					name: "average_gpa",
					label: "Average GPA",
					cell: "number"
				}		  
			];
		
		},
		parse : function(response) {
            return response.results;
        },
    });
    return Records;
});
