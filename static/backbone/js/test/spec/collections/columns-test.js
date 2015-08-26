define(["collections/columns",
        "models/field",
        "../../../test/spec-helper"],
    function (Columns, Field) {
        'use strict';
        describe("Columns Collection: Test initialization", function () {
            var columns;
            beforeEach(function () {
                spyOn(Columns.prototype, 'addAdministrativeColumns');
            });
            it("Loads correctly if initialization params have been properly set.", function () {
                expect(function () {
                    columns = new Columns(null, {
                        url: '/api/0/forms/2/fields/'
                    });
                }).not.toThrow();

                expect(function () {
                    columns = new Columns();
                }).toThrow();
            });

            it("Fires the addAdministrativeColumns method on 'reset'", function () {
                columns = new Columns(null, { url: '/api/0/forms/2/fields/' });
                columns.fetch({reset: true});
                expect(Columns.prototype.addAdministrativeColumns).toHaveBeenCalled();
            });
        });

        describe("Columns Collection: Post-processing after fetch works correctly", function () {
            var columns, json, entry, fields;
            it("Adds the required admininistrative columns when addAdministrativeColumns is called", function () {
                columns = new Columns(null, { url: '/api/0/forms/2/fields/' });
                columns.fetch({reset: true});
                expect(columns.at(0).get("name")).toBe("delete");
                expect(columns.at(1).get("name")).toBe("latitude");
                expect(columns.at(2).get("name")).toBe("longitude");
            });

            it("Adds the required fields to the user-defined columns", function () {
                expect(columns.at(3).get("name")).toBe("project_id");
                expect(columns.at(4).get("name")).toBe("tags");
                expect(columns.at(5).get("name")).toBe("photo");
                expect(columns.at(6).get("name")).toBe("audio");
            });

            it("Returns a dictionary of columns when the toJSON() method is called", function () {
                json = columns.toJSON();
                expect(json.length).toBe(7);
                var entry = json[6];
                fields = ["col_alias", "col_name", "data_type", "display_width", "ordering", "name", "label"];
                _.each(fields, function (key) {
                    expect(entry[key]).toBeDefined();
                });
            });
        });
    });