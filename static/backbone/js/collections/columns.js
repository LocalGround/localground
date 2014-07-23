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
		url: 'http://localground/api/0/forms/9/data/.json', //depends on the table selected
		cellTypeLookup: {
			"integer": "integer",
			"field": "string",
		},
		
		fetch: function(opts) {
			/* Queries the Django REST Framework OPTIONS
			 * page, which returns the API's schema as well
			 * as the filterable columns.
		     */
			//alert('fetch: ' + this.url);
			var that = this;
			$.ajax({
				url: this.url,
				type: 'OPTIONS',
				data: {
					_method: 'OPTIONS',
					format: 'json'
				},
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
				else {
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
			return {
				name: name,
				label: name,
				editable: !opts.read_only,
				cell: this.cellTypeLookup[opts.type] || "string"
			}
		}
	});
	return Columns;
});
