define(["models/field",
        "../../../test/spec-helper"],
    function (Field) {
        'use strict';
        describe("Field Model: Test initialization", function () {
            var model;
            it("Loads correctly if initialization params have been properly set.", function () {
                expect(function () {
                    model = new Field(null, { urlRoot: '/api/0/forms/2/fields/' });
                }).not.toThrow();
                expect(model instanceof Field).toBeTruthy();
                expect(model.defaults.col_alias).toBe('New Column Name');
                expect(model.defaults.data_type).toBe('text');
                expect(model.defaults.is_display_field).toBe(true);
                expect(model.defaults.is_printable).toBe(true);
                expect(model.defaults.has_snippet_field).toBe(false);
                expect(model.defaults.ordering).toBe(1);
                expect(function () {
                    model = new Field(null, {});
                }).toThrow();
            });

            it("Generates a valid form schema", function () {
                model = new Field(null, { urlRoot: '/api/0/forms/2/fields/' });
                expect(function () {
                    model.getFormSchema();
                }).toThrow();
                expect(Object.keys(model.getFormSchema(this.dataTypes)).length).toBe(7);
                expect(model.schema.data_type.options.length).toBe(8);
            });

            it("Generates the required model attributes for a BackGrid Column model", function () {
                model = new Field(
                    { id: 1, form: 2, col_alias: "Tags", col_name: "tags", display_width: 100, ordering: 1, data_type: "text" },
                    { urlRoot: '/api/0/forms/2/fields/' }
                );
                expect(model.get("label")).toBe(model.get("col_alias"));
                expect(model.get("name")).toBe(model.get("col_name"));
                expect(model.get("cell")).not.toBeNull();
                expect(model.get("headerCell")).not.toBeNull();
            });

        });
    });