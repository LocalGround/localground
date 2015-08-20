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
                expect(model.defaults.has_snippet_field).toBe(true);
                expect(model.defaults.ordering).toBe(1);
                expect(function () {
                    model = new Field(null, {});
                }).toThrow();
            });

            it("Generates a valid form schema", function () {
                spyOn(Field.prototype, 'fetchOptions');
                model = new Field(null, { urlRoot: '/api/0/forms/2/fields/' });
                expect(Object.keys(model.getFormSchema()).length).toBe(7);
                expect(model.fetchOptions).toHaveBeenCalled();
            });

            it("Triggers the 'schema-ready' event after fetching options", function () {
                var spy;
                model = new Field(null, { urlRoot: '/api/0/forms/2/fields/' });
                spy = jasmine.createSpy('event');
                model.on('schema-ready', spy);
                model.fetchOptions();
                expect(spy).toHaveBeenCalled();
                expect(model.schema.data_type.options.length).toBe(8);
            });

        });
    });