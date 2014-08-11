/* Useful Websites:
 * http://backgridjs.com/ref/column.html#getting-the-column-definitions-from-the-server
 http://stackoverflow.com/questions/13358477/override-backbones-collection-fetch
*/
define([
		"jquery",
		"backgrid",
		"lib/table/formatters/lat",
		"lib/table/formatters/lng",
		"lib/table/cells/delete"
	], function($, Backgrid, LatFormatter, LngFormatter, DeleteCell) {
	var Columns = Backgrid.Columns.extend({
		url: null,
		excludeList: [
				"overlay_type",
				"url"
			],
		initialize: function(opts){
			opts = opts || {};
			$.extend(this, opts)
			if (this.url == null) {
				alert("opts.url cannot be null");
			}
		},
		fetch: function(opts) {
			/* Queries the Django REST Framework OPTIONS
			 * page, which returns the API's schema as well
			 * as the filterable columns.
		     */
			var that = this;
			
			$.ajax({
				 // Note: the json must be appended in order for the OPTIONS 
				 // query to return JSON (it ignores the 'format' parameter)
				url: this.url + '.json',
				type: 'OPTIONS',
				data: { _method: 'OPTIONS' },
				success: function(data) {
					var cols = that.getColumnsFromData(data.actions['POST']);
					that.reset(cols);
				}
			});
		},
		getColumnsFromData: function(fields) {
			var that = this;
			var cols = [
				this.getDeleteCell()
			];
			$.each(fields, function(k, opts){
				if (k == 'geometry') {
					cols.push(that.getLatCell());
					cols.push(that.getLngCell());
				}
				else if(that.excludeList.indexOf(k) == -1) {
					cols.push(that.getDefaultCell(k, opts));
				}
			});
			return cols;
		},
		getDeleteCell: function(){
			return { name: "delete", label: "delete", editable: false, cell: DeleteCell };
		},
		getLatCell: function(){
			return {
				name: "geometry",
				label: "Latitude",
				cell: "number",
				formatter: LatFormatter,
				editable: true,
			}
		},
		getLngCell: function(){
			return {
				name: "geometry",
				label: "Longitude",
				cell: "number",
				formatter: LngFormatter,
				editable: true,
			}
		},
		getDefaultCell: function(name, opts){
			//alert(opts.type + " - " + Columns.cellTypeByNameLookup[opts.type]);
			return {
				name: name,
				label: name,
				editable: !opts.read_only,
				cell: Columns.cellTypeByNameLookup[opts.type] || "string"
			}
		}
	},
	//static methods are the second arguments:
	{
		cellTypeByNameLookup: {
			"integer": "integer",
			"field": "string",
			"boolean": "boolean",
			"decimal": Backgrid.NumberCell,
			"date-time": Backgrid.DatetimeCell,
			"rating": "integer",
			"string": "string",
			"float": Backgrid.NumberCell
		},
		cellTypeByIdLookup: {
			"1": "string",
			"2": "integer",
			"3": Backgrid.DatetimeCell,
			"4": "boolean",
			"5": Backgrid.NumberCell,
			"6": "integer"
		}	
	});
	return Columns;
});
