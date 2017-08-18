define([
    "underscore",
    "marionette",
    "backbone",
    "apps/spreadsheet/router",
    "views/toolbar-global",
    "apps/gallery/views/toolbar-dataview",
    "lib/data/dataManager",
    "apps/spreadsheet/views/main",
    "apps/spreadsheet/views/tabs",
    "lib/appUtilities",
    "lib/handlebars-helpers"
], function (_, Marionette, Backbone, Router, ToolbarGlobal, ToolbarDataView,
             DataManager, SpreadsheetView, TabView, appUtilities) {
    "use strict";
    var SpreadsheetApp = Marionette.Application.extend(_.extend(appUtilities, {
        regions: {
            spreadsheetRegion: ".main-panel",
            toolbarMainRegion: "#toolbar-main",
            toolbarDataViewRegion: "#toolbar-dataview",
            tabViewRegion: "#tab-panel"
        },

        currentCollection: null,
        dataType: "markers",
        screenType: "spreadsheet",
        start: function (options) {
            // declares any important global functionality;
            // kicks off any objects and processes that need to run
            Marionette.Application.prototype.start.apply(this, [options]);
            this.initAJAX(options);
            this.router = new Router({ app: this});
            Backbone.history.start();

            this.listenTo(this.vent, 'data-loaded', this.loadRegions);
            this.listenTo(this.vent, 'show-list', this.showSpreadsheet);
            this.addMessageListeners();
            console.log('starting!!');
        },

        initialize: function (options) {
            Marionette.Application.prototype.initialize.apply(this, [options]);
            this.selectedProjectID = this.getProjectID();
            this.dataManager = new DataManager({ vent: this.vent, projectID: this.getProjectID() });
            console.log("initialize");
        },
        loadRegions: function () {
            //initialize toobar view
            console.log("Loading Regions");
            this.restoreAppState();
            var data;
            try {
                data = this.dataManager.getData(this.dataType);
            } catch (e) {
                this.dataType = "markers";
                data = this.dataManager.getData(this.dataType);
            }
            this.toolbarView = new ToolbarGlobal({
                app: this
            });
            this.toolbarDataView = new ToolbarDataView({
                app: this
            });
            this.spreadsheetView = new SpreadsheetView({
                app: this,
                collection: data.collection,
                fields: data.fields
            });
            this.tabView = new TabView({
                app: this
            });

            //load views into regions:
            this.toolbarMainRegion.show(this.toolbarView);
            this.toolbarDataViewRegion.show(this.toolbarDataView);
            this.spreadsheetRegion.show(this.spreadsheetView);
            this.tabViewRegion.show(this.tabView);
        },

        showSpreadsheet: function (dataType) {
            this.dataType = dataType;
            this.saveAppState();
            var data;
            try {
                data = this.dataManager.getData(this.dataType);
            } catch (e) {
                this.dataType = "markers";
                data = this.dataManager.getData(this.dataType);
            }
            this.spreadsheetView = new SpreadsheetView({
                app: this,
                collection: data.collection,
                fields: data.fields
            });
            this.spreadsheetRegion.show(this.spreadsheetView);

        },
        saveAppState: function () {
            this.saveState("dataView", {
                dataType: this.dataType
            }, true);
        },
        restoreAppState: function () {
            var state = this.restoreState("dataView");
            if (state) {
                this.dataType = state.dataType;
            } else if (this.dataManager) {
                this.dataType = this.dataManager.getDataSources()[1].value;
            }
            //console.log('restored', this.dataType);
        }
    }));
    return SpreadsheetApp;
});


/*
// Rough draft plans to making a visible tab group
// Tested out using google inspector
<aside id="tab-panel" class="spreadsheet-tab-panel">
    <table>
    <!-- Probably a good start, but a div portion might be more suitable
         with horizontal alignment and some formatting
    -->
        <tbody>
            <tr>
            <!-- This is where all of the data group types should go if taken as HTML table format -->
                <td>Test 1</td>
                <td>Test 2</td>
                <td>Test 3</td>
                <td>Test 4</td>
            </tr>
        </tbody>
    </table>
</aside>
*/
