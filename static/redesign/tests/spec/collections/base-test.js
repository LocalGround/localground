define([], function () {
    'use strict';
    var collection;
    /*
     * Overriding the initialization function so that this test doesn't
     * have to rely on the Google Maps API
     */
    return {
        genericChecks: function (opts) {
            describe("Collection: Check if variables exist", function () {
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
            });
        }
    };
});