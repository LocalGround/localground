define(["backgrid", "lib/table/formatters"], function(Backgrid, LatFormatter) {
    var LatCell = Backgrid.Cell.extend({
		formatter: LatFormatter,
	});
	return LatCell;
});

define(["backgrid", "lib/table/formatters"], function(Backgrid, LngFormatter) {
    var LngCell = Backgrid.Cell.extend({
		formatter: LatFormatter
	});
	return LngCell;
});