/*
TODO John: finish tests
*/

define([], function () {
    'use strict';
    var collection;
    /*
     * Overriding the initialization function so that this test doesn't
     * have to rely on the Google Maps API
     */
    return {
        genericChecks: function (opts) {
            describe("Collection: BaseMixin Methods", function () {
                it("Testing + if inherits from PageableCollection", function () {
                    collection = this.getModelByOverlayType(opts.overlay_type).collection;
                    expect(collection.state).toBeDefined();
                    expect(collection.queryParams).toBeDefined();
                    expect(collection.parseState).toBeDefined();
                    expect(collection.parseRecords).toBeDefined();
                });

                it("Testing setServerQuery and clearServerQuery", function () {
                    collection = this.getModelByOverlayType(opts.overlay_type).collection;
                    expect(collection.length).toBe(3);

                    var query = "WHERE id = 1";
                    collection.setServerQuery(query);
                    expect(collection.query).toBe(query);

                    collection.clearServerQuery();
                    expect(collection.query).toBe(null);
                });

                it("Testing applyFilter and clearFilter", function () {
                    var query = opts.query || 'project_id = 1';
                    collection = this.getModelByOverlayType(opts.overlay_type).collection;
                    expect(collection.length).toBe(3);
                    collection.applyFilter(query);
                    expect(collection.getVisibleModels().length).toBe(2);
                    collection.clearFilter();
                    expect(collection.getVisibleModels().length).toBe(3);
                });

                it("getTitle returns title", function () {
                    expect(1).toEqual(1);
                });

                it("getDataType returns data_type of collection (plural)", function () {
                    expect(1).toEqual(1);
                });

                it("getModelType returns data_type of model in collection (singular)", function () {
                    expect(1).toEqual(1);
                });

                it("getFields returns fields collection (if custom type)", function () {
                    expect(1).toEqual(1);
                });

                it("getIsCustomType returns true if custom type, false otherwise", function () {
                    expect(1).toEqual(1);
                });

                it("getIsCustomType returns true if markers", function () {
                    expect(1).toEqual(1);
                });

                it("getIsCustomType returns true if custom type, false otherwise", function () {
                    expect(1).toEqual(1);
                });

                it("getIsMedia returns true if collection is photos, audio, videos, or map_images", function () {
                    expect(1).toEqual(1);
                });

                it("getModel gets the selected model from the collection or creates a new one if it doesn't exist", function () {
                    expect(1).toEqual(1);
                });

                it("createNewModel creates a new model", function () {
                    expect(1).toEqual(1);
                });

            });
        }
    };
});
