define(["backbone", "underscore", "lib/maps/data/dataManager", "collections/projects", "lib/appUtilities", "../../test/spec-helper"],
    function (Backbone, _, DataManager, Projects, appUtilities) {
        'use strict';

        /**
         * Note, these tests do not test:
         *  - updateCollection ('cause it's private)
         *  - fetchProjects ('cause it queries the api)
         *  - fetchDataByProjectID ('cause it queries the api)
         *  TODO: there's a way to fake a server w/Backbone + Jasmine. Look into it.
         */
        var app = _.extend({}, appUtilities);
        _.extend(app, {
            vent: _.extend({}, Backbone.Events)
        });
        describe("DataManager: Tests data manager initialization", function () {
            var dm = null;
            it("Can initialize with empty Projects collection", function () {
                expect(function () {
                    dm = new DataManager({
                        app: app,
                        projects: new Projects()
                    });
                }).not.toThrow();
            });
        });

        describe("DataManager: Tests adding and removing of project data", function () {
            var dm = new DataManager({
                app: app,
                projects: new Projects()
            });
            it("Adds new project data successfully, using updateCollections and getCollection", function () {
                //add first project:
                expect(dm.getCollection("photos")).not.toBeDefined();
                expect(dm.getCollection("audio")).not.toBeDefined();
                dm.updateCollections(this.projects.at(0));
                expect(dm.getCollection("photos").length).toEqual(3);
                expect(dm.getCollection("audio").length).toEqual(3);

                //add second project:
                expect(dm.getCollection("form_1")).not.toBeDefined();
                expect(dm.getCollection("markers")).not.toBeDefined();
                dm.updateCollections(this.projects.at(1));
                expect(dm.getCollection("form_1").length).toEqual(3);
                expect(dm.getCollection("markers").length).toEqual(3);
            });

            it("Removes project data successfully (tests removeDataByProjectID, removeDataByProjectID)", function () {
                expect(dm.app.getActiveProjectID()).toEqual(2);

                //remove project 2:
                expect(dm.getCollection("form_1").length).toEqual(3);
                expect(dm.getCollection("markers").length).toEqual(3);
                dm.removeDataByProjectID(2);
                expect(dm.getCollection("form_1").length).toEqual(0);
                expect(dm.getCollection("markers").length).toEqual(0);

                //check that project 1 is now the active project:
                expect(dm.app.getActiveProjectID()).toEqual(1);
            });
        });

        describe("DataManager: Tests data filters", function () {
            var dm = new DataManager({
                    app: app,
                    projects: new Projects()
                }),
                getCount = function (collections) {
                    var count = 0;
                    _.map(collections, function (collection) {
                        collection.each(function (model) {
                            if (model.get("isVisible")) {
                                ++count;
                            }
                        });
                    });
                    return count;
                };
            it("All models are visible when no filter is applied", function () {
                //add data:
                dm.updateCollections(this.projects.at(0));
                dm.updateCollections(this.projects.at(1));

                //before filter applied, expect all models to be visible (count == 12):
                expect(getCount(dm.collections)).toEqual(12);
            });
            it("Select models are visible when filter is applied", function () {
                //filter for tags that exist just within one collection ("animal"):
                dm.applyFilter("where tags contains animal");
                expect(getCount(dm.collections)).toEqual(3);

                //filter for tags that exist across collections ("tag1"):
                dm.applyFilter("where tags contains 'tag1'");
                expect(getCount(dm.collections)).toEqual(5);

                //invalid filter:
                dm.applyFilter("where 'tag1'");
                expect(getCount(dm.collections)).toEqual(0);

                //clear filter:
                dm.clearFilter();
                expect(getCount(dm.collections)).toEqual(12);
            });

            /** To Test:
             *saveState
             *restoreState
             */
        });

        describe("DataManager: Tests save state", function () {
            var dm = new DataManager({
                    app: app,
                    projects: new Projects()
                }),
                state;
            it("Test save and restore state under various conditions...", function () {

                //save state and check that there are no active projects:
                dm.saveState();
                state = dm.app.restoreState("dataManager");
                expect(_.difference(state.projectIDs, []).length).toEqual(0);

                //add data:
                dm.updateCollections(this.projects.at(0));
                dm.updateCollections(this.projects.at(1));

                //save state and check that the 2 active projects have been saved:
                dm.saveState();
                state = dm.app.restoreState("dataManager");
                expect(_.difference(state.projectIDs, [1, 2]).length).toEqual(0);

                //now remove a project and re-issue state commands:
                dm.removeDataByProjectID(2);
                dm.saveState();
                state = dm.app.restoreState("dataManager");
                expect(_.difference(state.projectIDs, [1]).length).toEqual(0);

            });
        });
    });
