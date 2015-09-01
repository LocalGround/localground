define(["backgrid"], function (Backgrid) {
    "use strict";
    var CoordinateCellEditor = Backgrid.InputCellEditor.extend({
        saveOrCancel: function (e) {
            /**
            * Note: this method pretty much breaks encapsulation b/c the
            * lat and lng column need to know about each other to update geoJSON
            * ...and also because it's relying on column names that have a particular
            * naming convention ("latitude" and "longitude").
            */
            this.columnName = this.column.get("name");
            var formatter = this.formatter,
                model = this.model,
                column = this.column,
                command = new Backgrid.Command(e),
                blurred = e.type === "blur",
                val,
                geom,
                newValue,
                lat,
                lng;

            if (command.moveUp() || command.moveDown() || command.moveLeft() || command.moveRight() ||
                    command.save() || blurred) {

                e.preventDefault();
                e.stopPropagation();

                val = this.$el.val();
                newValue = formatter.toRaw(val, model);
                if (_.isUndefined(newValue)) {
                    model.trigger("backgrid:error", model, column, val);
                } else {
                    geom = model.get("geometry");
                    switch (this.columnName) {
                    case "latitude":
                        try { lng = geom.coordinates[0]; } catch (ex) { lng = 0; }
                        lat = newValue;
                        break;
                    case "longitude":
                        try { lat = geom.coordinates[1]; } catch (ex1) { lat = 0; }
                        lng = newValue;
                        break;
                    }
                    if (!lat && !lng) {
                        model.set("geometry", null);
                    } else {
                        model.set("geometry", { "type": "Point", "coordinates": [lng, lat] });
                    }
                    model.trigger("backgrid:edited", model, column, command);
                }
            } else if (command.cancel()) { //esc
                // undo
                e.stopPropagation();
                model.trigger("backgrid:edited", model, column, command);
            }
        }
    });
    return CoordinateCellEditor;
});