define(["underscore",
        "collections/markers",
        "models/marker",
        "../../test/spec-helper"],
    function (_, Markers, Marker) {
        'use strict';

        var getMatchedCount = function (collections) {
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

        /**
         * Note, these tests do not test:
         *  - updateCollection ('cause it's private)
         *  - fetchProjects ('cause it queries the api)
         *  - fetchDataByProjectID ('cause it queries the api)
         *  TODO: there's a way to fake a server w/Backbone + Jasmine. Look into it.
         */
        describe("DataManager: Tests data manager initialization", function () {
            var dm;
            it("Can initialize with empty Projects collection", function () {
                var that = this;
                expect(function () {
                    dm = that.dataManager;
                }).not.toThrow();
            });
        });

        describe("DataManager: Tests adding and removing of project data", function () {
            it("Adds new project data successfully, using updateCollections and getCollection", function () {
                var dm = this.dataManager;

                //add first project:
                expect(dm.getCollection("photos")).not.toBeDefined();
                expect(dm.getCollection("audio")).not.toBeDefined();
                dm.updateCollections(this.projects.at(0));
                expect(dm.getCollection("photos").length).toEqual(3);
                expect(dm.getCollection("audio").length).toEqual(3);
                expect(dm.getCollection("map_images").length).toEqual(3);

                //add second project:
                expect(dm.getCollection("form_1")).not.toBeDefined();
                expect(dm.getCollection("markers")).not.toBeDefined();
                dm.updateCollections(this.projects.at(1));
                expect(dm.getCollection("form_1").length).toEqual(3);
                expect(dm.getCollection("markers").length).toEqual(3);
            });

            it("Removes project data successfully (tests removeDataByProjectID, removeDataByProjectID)", function () {
                var dm = this.dataManager;
                dm.updateCollections(this.projects.at(0));
                dm.updateCollections(this.projects.at(1));
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
            it("All models are visible when no filter is applied", function () {
                var dm = this.dataManager;
                //add data:
                dm.updateCollections(this.projects.at(0));
                dm.updateCollections(this.projects.at(1));

                //before filter applied, expect all models to be visible (count == 15):
                expect(getMatchedCount(dm.collections)).toEqual(15);
            });

            it("Select models are visible when filter is applied", function () {
                var dm = this.dataManager;
                dm.updateCollections(this.projects.at(0));
                dm.updateCollections(this.projects.at(1));

                //filter for tags that exist just within one collection ("animal"):
                dm.applyFilter("where tags contains animal");
                expect(getMatchedCount(dm.collections)).toEqual(3);

                //filter for tags that exist across collections ("tag1"):
                dm.applyFilter("where tags contains 'tag1'");
                expect(getMatchedCount(dm.collections)).toEqual(6);

                //invalid filter:
                dm.applyFilter("where 'tag1'");
                expect(getMatchedCount(dm.collections)).toEqual(0);

                //clear filter:
                dm.clearFilter();
                expect(getMatchedCount(dm.collections)).toEqual(15);
            });

            /** To Test:
             *saveState
             *restoreState
             */
        });

        describe("DataManager: Tests save state", function () {
            var state;
            it("Test save and restore state under various conditions...", function () {
                var dm = this.dataManager;
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

        describe("DataManager: Tests event listeners / handlers", function () {
            it("Test projects.trigger(\"toggleProject\"). Only tests \"Off\" functionality", function () {
                var dm = this.dataManager;
                //add data:
                dm.updateCollections(this.projects.at(0));
                dm.updateCollections(this.projects.at(1));

                //uncheck selectedProjects:
                expect(dm.selectedProjects.length).toEqual(2);
                this.projectsLite.trigger("toggleProject", 1, false);
                expect(dm.selectedProjects.length).toEqual(1);
                this.projectsLite.trigger("toggleProject", 2, false);
                expect(dm.selectedProjects.length).toEqual(0);

                //To spoof fetching, take a look at this blog post:
                ////blog.katworksgames.com/2013/03/30/bb_model_test_jasmine/
            });

            it("Test vent.trigger(\"set-active-project\")", function () {
                var dm = this.dataManager;
                //add data:
                dm.updateCollections(this.projects.at(0));
                dm.updateCollections(this.projects.at(1));

                //uncheck selectedProjects:
                dm.app.vent.trigger("set-active-project", { id: 1 });
                expect(dm.app.getActiveProjectID()).toEqual(1);
                dm.app.vent.trigger("set-active-project", { id: 2 });
                expect(dm.app.getActiveProjectID()).toEqual(2);
            });

            it("Test vent.trigger(\"marker-added\")", function () {
                var dm = this.dataManager;
                //add data:
                dm.updateCollections(this.projects.at(0));

                //uncheck selectedProjects:
                expect(dm.getCollection("markers")).not.toBeDefined();
                dm.app.vent.trigger("marker-added", {
                    key: "markers",
                    models: [new Marker({"id": 1, "project_id": 1, name: "New marker"})],
                    name: "Markers",
                    Collection: Markers
                });
                expect(dm.getCollection("markers").length).toEqual(1);
            });

            it("Test vent.trigger(\"apply-filter\") and vent.trigger(\"clear-filter\")", function () {
                var dm = this.dataManager;
                //make sure that filter calls via event triggers are working:
                dm.updateCollections(this.projects.at(0));
                dm.updateCollections(this.projects.at(1));
                expect(getMatchedCount(dm.collections)).toEqual(15);
                dm.app.vent.trigger("apply-filter", "where name = cat or name = Map 1");
                expect(getMatchedCount(dm.collections)).toEqual(2);
                dm.app.vent.trigger("clear-filter");
                expect(getMatchedCount(dm.collections)).toEqual(15);
            });
        });
    });
