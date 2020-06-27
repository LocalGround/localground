define(["jquery",
        "marionette",
        "underscore",
        "handlebars",
        "handsontable",
        "text!../templates/spreadsheet.html",
        "lib/media/audio-viewer",
        "lib/media/photo-video-viewer",
        'lib/spreadsheet/views/add-field',
        'lib/spreadsheet/views/edit-field',
        "lib/spreadsheet/views/context-menu",
        'lib/spreadsheet/views/custom-cell-renderers'
    ],
    function ($, Marionette, _, Handlebars, Handsontable, SpreadsheetTemplate,
            AudioViewer, PhotoVideoViewer, AddField, EditField, ContextMenu,
            CustomCellRenderers) {
        'use strict';
        var Spreadsheet = Marionette.ItemView.extend({
            /**
            NOTE: HERE ARE THE OPEN SOURCE DOCS:
            https://docs.handsontable.com/4.0.0/ColumnSorting.html#sort
            */
            template: function () {
                return Handlebars.compile(SpreadsheetTemplate);
            },
            invalidCells: {},
            table: null,
            className: 'spreadsheet-panel',
            show_hide_deleteColumn: true,
            events: {
                'click .column-opts' : 'showContextMenu',
                'click #add-row': 'addRow'
            },
            collectionEvents: {
                'reset': 'renderSpreadsheet'
            },
            initialize: function (opts) {
                _.extend(this, opts);
                this.height = this.height || $(window).height() - 170,
                this.popover = this.app.popover;
                this.secondaryModal = this.app.secondaryModal;
                Marionette.ItemView.prototype.initialize.call(this);
                this.registerBooleanSelectMenuEditor();

                //this.listenTo(this.collection, 'reset', this.renderSpreadsheet);
                this.listenTo(this.fields, 'reset', this.renderSpreadsheet);
                this.listenTo(this.fields, 'update', this.renderSpreadsheet);
                this.listenTo(this.fields, 'add', this.renderSpreadsheet);

                this.addAppVentListeners();
            },
            addAppVentListeners: function () {
                this.listenTo(this.app.vent, 'search-requested', this.doSearch);
                this.listenTo(this.app.vent, 'clear-search', this.clearSearch);
                this.listenTo(this.app.vent, "render-spreadsheet", this.renderSpreadsheet);
                this.listenTo(this.app.vent, "field-updated", this.renderSpreadsheet);
                this.listenTo(this.app.vent, "add-field", this.addField);
                this.listenTo(this.app.vent, "edit-field", this.editField);
                this.listenTo(this.app.vent, "delete-field", this.deleteField);
            },
            onShow: function () {
                this.renderSpreadsheet();
            },
            //
            // Arranging the columns
            // For now, I only want to arrange without any saving
            // for this current draft
            columnMoveBefore: function(col_indexes_to_be_moved, destination_index){
                var media_column_index = this.fields.length + 4; //change to whatever one is valid
                var pre_field_index = 2;
                if (col_indexes_to_be_moved.indexOf(media_column_index) != -1 || destination_index >= media_column_index) {
                    console.error('Cannot move your column behind the media column');
                    return false;
                } else if (col_indexes_to_be_moved.indexOf(pre_field_index) != -1 || destination_index <= pre_field_index){
                    console.error('Cannot move your column before the ID and lat/lng');
                    return false;
                }
            },

            columnMoveAfter: function(col_indexes_to_be_moved, destination_index){
                var media_column_index = this.fields.length + 4, //change to whatever one is valid
                    pre_field_index = 2,
                    i = 0,
                    currentOrdering,
                    oldPosition,
                    newPosition,
                    fieldIndex,
                    field;
                if (col_indexes_to_be_moved.indexOf(media_column_index) != -1 || destination_index >= media_column_index ||
                        col_indexes_to_be_moved.indexOf(pre_field_index) != -1 || destination_index <= pre_field_index) {
                    return false;
                }

                for (i = 0; i < col_indexes_to_be_moved.length; i++) {
                    fieldIndex = col_indexes_to_be_moved[i] - 3;
                    field = this.fields.at(fieldIndex);
                    oldPosition = field.get("ordering") + 2;
                    if (oldPosition < destination_index) {
                        --destination_index;
                    }
                    newPosition = destination_index - 2 + i;
                    console.log('setting field order to:', newPosition);

                    field.set("ordering", newPosition);
                    field.save({"ordering": newPosition}, { patch: true, wait: true });
                }
            },
            deleteRows: function (startIndex, numRows) {
                const models = [];
                for (let i = startIndex; i < startIndex + numRows; i++) {
                    const model = this.getModelFromCell(null, i);
                    models.push(this.getModelFromCell(null, i));
                }
                const doDelete = confirm(
                    'Are you sure you want to delete the records associated with the following id numbers: #' +
                    models.map(model => model.id).join(', #') + '? This cannot be undone.'
                );
                if (doDelete) {
                    models.forEach(model => model.destroy());
                    //calls handsontable event to delete rows:
                    this.table.alter("remove_row", startIndex, numRows);
                    if (this.collection.length === 0) {
                        this.renderSpreadsheet();
                    }
                    //event that notifies the rest of the app to respond:
                    this.app.vent.trigger('record-has-been-deleted');
                }
            },
            renderSpreadsheet: function () {
                console.log('rendering spreadsheet...');
                const data = this.collection.map(model => {
                    var rec = model.toJSON();
                    if (rec.tags) {
                        rec.tags = rec.tags.join(", ");
                    }
                    return rec;
                });
                if (this.table) {
                    this.table.destroy();
                    this.table = null;
                }

                if (data.length == 0) {
                    // Render spreadsheet should be called after every removal of rows
                    this.$el.find('#grid').html(`
                        <div class="empty-message">
                            <p>This dataset is currently empty.</p>
                            <a href="#" id="add-row" class="button-tertiary add-new"
                                data-type="dataset_77" screen-type="table">
                                <i class="fa fa-plus add-feature-icon" aria-hidden="true"></i>Insert Row
                            </a>
                        </div>`
                    ).css({height: 'calc(100vh - 220px)'});
                    return;
                }
                const that = this;
                this.table = new Handsontable(this.$el.find('#grid').get(0), {
                    data: data,
                    autoRowSize: true,
                    undo: true,
                    manualColumnResize: true,
                    manualColumnMove: true,
                    //contextMenu: this.contextMenuDefault,
                    //rowHeaders: true,
                    autoInsertRow: true,
                    sortIndicator: true,
                    columnSorting: true,
                    height: this.height,
                    fixedRowsTop: 0,
                    colWidths: this.getColumnWidths(),
                    rowHeights: 55,
                    colHeaders: this.getColumnHeaders(),
                    columns: this.getColumns(),
                    maxRows: this.collection.length,
                    stretchH: "all",
                    afterValidate: function (isValid, value, rowIndex, prop, source) {
                        // because of limitations in Hansontable, we need to
                        // manually track which cells are valid / invalid:
                        console.log('afterValidate', that.table);
                        if (!isValid) {
                            var model = that.getModelFromCell(null, rowIndex);
                            if (!that.invalidCells[model.id]) {
                                that.invalidCells[model.id] = [];
                            }
                            that.invalidCells[model.id].push(prop)
                            if (prop === 'lat' || prop === 'lng') {
                                that.invalidCells[model.id].push('geometry');
                            }
                        }
                    },
                    //afterChange: function (changes, source) {
                    beforeChange: function (changes, source) {
                        //console.log('afterChange', that.table);
                        that.saveChanges(changes, source);
                        // if (changes && changes[0] && changes[0].length > 1 && changes[0][1] === "video_provider") {
                        //     that.table.render();
                        // }
                    }
                });
                this.table.addHook('beforeOnCellMouseDown', (event, cellObject, TD) => {
                    if (event.button === 2){
                        console.log(cellObject.col);
                        // abridged context menu for first three and last two columns:
                        if (cellObject.col < 3 || cellObject.col >= this.fields.length + 3) {
                            this.table.updateSettings({
                                contextMenu: this.getContextMenuReadOnly()
                            });
                        } else {
                            this.table.updateSettings({
                                contextMenu: this.getContextMenuDefault()
                            });
                        }
                    }
                });
                if (this.fields) {
                    this.table.addHook('beforeColumnMove', this.columnMoveBefore.bind(this));
                    this.table.addHook('afterColumnMove', this.columnMoveAfter.bind(this));
                }
            },
            getContextMenuReadOnly: function () {
                return {
                    callback: this.handleMenuEvents.bind(this),
                    items: {
                        "insert_row_bottom": {name: 'Insert row at bottom'},
                        "delete_row": {name: 'Delete row(s)'},
                    }
                };
            },
            getContextMenuDefault: function () {
                return {
                    callback: this.handleMenuEvents.bind(this),
                    items: {
                        "insert_column_before": {name: 'Insert column before'},
                        "insert_column_after": {name: 'Insert column after'},
                        "hsep1{\d+}": "---------",
                        "edit_column": {name: 'Edit column'},
                        "delete_column": {name: 'Delete column'},
                        "hsep2{\d+}": "---------",
                        "insert_row_bottom": {name: 'Insert row at bottom'},
                        "delete_row": {name: 'Delete row(s)'},
                    }
                };
            },
            handleMenuEvents: function (key, selection, clickEvent) {
                const fieldIndex = selection.end.col - 3; //to account for admin columns
                if (key === 'insert_column_before') {
                    this.addField(fieldIndex + 1);
                } else if (key === 'insert_column_after') {
                    this.addField(fieldIndex + 2);
                } else if (key === 'edit_column') {
                    this.editField(fieldIndex);
                } else if (key === 'delete_column') {
                    this.deleteField(fieldIndex);
                } else if (key === 'insert_row_bottom') {
                    this.addRow();
                } else if (key === 'delete_row') {
                    //note: handles multiple row deletes:
                    const startIndex = Math.min(selection.start.row, selection.end.row);
                    const numRows = Math.abs(selection.start.row - selection.end.row) + 1;
                    this.deleteRows(startIndex, numRows);
                }
            },
            saveChanges: function (changes, source) {
                //sync with collection:
                if (!source) {
                    return;
                }
                source = source.split(".");
                source = source[source.length - 1];
                var i, idx, key, oldVal, newVal, model, geoJSON;
                if (_.contains([
                            "edit",
                            "autofill",
                            "fill",
                            "undo",
                            "redo",
                            "paste"
                        ], source)) {
                    if (source === "paste") {
                        console.log(changes);
                    }
                    var changedModels = {};
                    for (i = 0; i < changes.length; i++) {
                        idx = changes[i][0];
                        key = changes[i][1];
                        oldVal = changes[i][2];
                        newVal = changes[i][3];
                        if (oldVal === newVal) {
                            continue;
                        }
                        //Note: relies on the fact that the first column is the ID column
                        //      see the getColumns() function below
                        model = this.getModelFromCell(null, idx);
                        if (!changedModels[model.id]) {
                            changedModels[model.id] = {
                                model: model,
                                changedAttributes: {}
                            };
                        }
                        if (key === 'lat' || key === 'lng') {
                            //SV TODO: To handle polygons and polylines, only set latLng if current
                            //          geometry is null of of type "Point." Still TODO.
                            // Good article: https://handsontable.com/blog/articles/4-ways-to-handle-read-only-cells
                            model.set(key, newVal);
                            if (model.get("lat") && model.get("lng")) {
                                geoJSON = model.setPointFromLatLng(model.get("lat"), model.get("lng"));
                                changedModels[model.id].changedAttributes.geometry = JSON.stringify(geoJSON);
                            } else {
                                changedModels[model.id].changedAttributes.geometry = null;
                            }
                        } else {
                            changedModels[model.id].changedAttributes[key] = newVal;
                        }
                    }
                    // Commit to database all at once:
                    for (key in changedModels) {
                        var m = changedModels[key].model,
                            changedAttributes = changedModels[key].changedAttributes,
                            invalidAttributes = this.invalidCells[m.id] || [];
                        //remove any staged changes that are invalid:
                        invalidAttributes.forEach(function (prop) {
                            delete changedAttributes[prop];
                        });
                        if (Object.values(changedAttributes) === 0) {
                            continue;
                        }
                        m.set(changedAttributes);
                        m.save(changedAttributes, {
                            patch: true,
                            wait: true,
                            success: () => {
                                //coordinates change with rebinning of symbol in LayerListChildView:
                                m.trigger('record-updated', m);
                                //this.table.render();
                            }
                        });
                    }
                    //clear out invalidCells:
                    this.invalidCells = {};
                }
            },
            getModelFromCell: function (table, index) {
                table = table || this.table;
                const modelID = table.getDataAtRowProp(index, 'id');
                return this.collection.get(modelID);
            },

            htmlLinkRenderer: function (instance, td, rowIndex, colIndex, prop, value, cellProperties) {
                var htmlLink = "<a href='" + value + "' >" + value + "</a>"
                td.innerHTML = htmlLink;
                return td;
            },

            photoVideoListRenderer: function (instance, td, row, col, prop, value, cellProperties) {
                td.innerHTML = '';
                const model = this.getModelFromCell(instance, row);
                if (model) {
                    this.photoVideoViewer = new PhotoVideoViewer({
                        app: this.app,
                        collection: model.getPhotoVideoCollection(this.app.dataManager),
                        templateType: 'spreadsheet',
                        detachMedia: this.detachMediaModel.bind(this)
                    });
                    $(td).append(this.photoVideoViewer.$el);
                }
                return td;
            },
            
            detachMediaModel: function (model) {
                alert('detach: ' + model.get('name'));
            },

            audioListRenderer: function (instance, td, row, col, prop, value, cellProperties) {
                td.innerHTML = '';
                const model = this.getModelFromCell(instance, row);
                if(model){
                    this.audioView = new AudioViewer({
                        app: this.app,
                        collection: model.getAudioCollection(this.app.dataManager),
                        templateType: 'spreadsheet',
                        detachMedia: this.detachMediaModel.bind(this)
                    });
                    $(td).append(this.audioView.$el);
                }
                return td;
            },

            mediaCountRenderer: function (instance, td, row, col, prop, value, cellProperties) {
                var model = this.getModelFromCell(instance, row);
                const photoCount = model.get("attached_photos_ids") ? model.get("attached_photos_ids").length : 0;
                const audioCount = model.get("attached_audio_ids") ? model.get("attached_audio_ids").length : 0;
                const videoCount = model.get("attached_videos_ids") ? model.get("attached_videos_ids").length : 0;
                td.innerHTML = '';
                if (photoCount) {
                    td.innerHTML += `<p>photos: ${photoCount}</p>`
                }
                if (audioCount) {
                    td.innerHTML += `<p>audio files: ${audioCount}</p>`
                }
                if (videoCount) {
                    td.innerHTML += `<p>videos: ${videoCount}</p>`
                }
                return td;

            },

            getMenuTemplate: function (index) {
                return `<a class="fa fa-ellipsis-v column-opts" fieldIndex="${index}" aria-hidden="true"></a>`;
            },

            getColumnHeaders: function () {
                const cols = [
                    "ID", // + this.getMenuTemplate(0),
                    "Lat", // + this.getMenuTemplate(1),
                    "Lng" // + this.getMenuTemplate(2)
                ];

                for (var i = 0; i < this.fields.length; ++i) {
                    const menuButton = this.show_hide_deleteColumn ? this.getMenuTemplate(i + 3) : '';
                    cols.push(
                        '<span class="hide-overflow">' +
                        this.fields.at(i).get("col_alias") +
                        '</span>' +
                        menuButton
                    );
                }
                cols.push("Photos & Videos");
                cols.push("Audio Files");
                return cols;
            },
            getColumnWidths: function () {
                const cols = [65, 75, 75];
                this.fields.forEach(field => {
                    if (field.get('data_type') === 'integer') {
                        cols.push(120);
                    } else if (field.get('data_type') === 'text') {
                        cols.push(250);
                    } else {
                        cols.push(150);
                    }
                })
                cols.push(350);  // photos column
                cols.push(210);  // audio column
                return cols;
            },

            doSearch: function (term) {

                // If form exist, do search with 3 parameters, otherwise, do search with two parameters]
                this.collection.doSearch(term, this.app.getProjectID(), this.fields);

            },

            clearSearch: function () {
                this.collection.clearSearch(this.app.getProjectID());
            },

            getColumns: function () {
                if (!this.fields) {
                    return null;
                }
                var cols = [
                    { data: "id", readOnly: true },
                    { data: "lat", type: "numeric", format: '0.00000' },
                    { data: "lng", type: "numeric", format: '0.00000' }
                ];
                for (var i = 0; i < this.fields.length; ++i) {
                    // Make sure to add in the "-" symbol after field name to delete column
                    const field = this.fields.at(i);
                    var type = field.get("data_type").toLowerCase();
                    var field_format = "";
                    var field_dateFormat = "";
                    var field_correctFormat = false;
                    var renderer = null;
                    var editor = null;
                    var entry = null;
                    switch (type) {
                        case "boolean":
                            // entry = {
                            //     type:  "checkbox"
                            // };
                            entry = {
                                type:  "text",
                                editor: "boolean-select-menu-editor",
                                renderer: this.booleanRenderer.bind(this),
                                selectOptions: [
                                    {'label' : 'No value', 'val': ''},
                                    {'label' : 'Yes', 'val': true},
                                    {'label' : 'No', 'val': false}
                                ]
                            };
                            break;
                        case "integer":
                            entry = {
                                type:  "numeric"
                            };
                            break;
                        case "decimal":
                            entry = {
                                type:  "numeric",
                                format: "0,0.000"
                            };
                            break;
                        case "choice":
                            try {
                                const extras = field.get("extras");
                                const choiceOpts = extras.choices.map(
                                    choice => choice.name
                                );
                                entry = {
                                    type:  "text",
                                    editor: "select",
                                    selectOptions: choiceOpts
                                };
                            } catch (e) {
                                console.error(e);
                                entry = {
                                    type:  "text"
                                };
                            }
                            break;
                        case "date-time":
                            entry = {
                                type:  "date",
                                dateFormat: "YYYY-MM-DDThh:mm",
                                correctFormat: true
                            };
                            break;
                        case "rating":
                            entry = {
                                type:  "numeric",
                                editor: "select-menu-editor",
                                renderer: this.ratingRenderer.bind(this),
                                selectOptions: this.fields.at(i).get("extras") || []
                            };
                            break;
                        default:
                            entry = {
                                type:  "text"
                            };
                    }
                    _.extend(entry, {
                        data: this.fields.at(i).get("col_name")
                    });
                    cols.push(entry);
                };

                cols.push(
                    { data: "media", renderer: this.photoVideoListRenderer.bind(this), readOnly: true, disableVisualSelection: true },
                    { data: "media", renderer: this.audioListRenderer.bind(this), readOnly: true, disableVisualSelection: true },
                );
                return cols;
            },

            showContextMenu: function (e) {
                const src = e.target;
                const headerLink = src.parentNode;
                const columnID = parseInt($(src).attr('fieldIndex'));
                this.popover.update({
                    $source: e.target,
                    view: new ContextMenu({
                        app: this.app,
                        collection: this.collection,
                        table: this.table,
                        fields: this.fields,
                        field: this.fields.at(columnID - 3),
                        columnID: columnID,
                        headerLink: headerLink
                    }),
                    placement: 'bottom',
                    width: '180px'
                });
                if (e) {
                   e.stopImmediatePropagation();
                   e.preventDefault();
                }
            },
            refreshHeaders: function () {
                this.table.updateSettings({
                    colHeaders: this.getColumnHeaders()
                });
            },

            addRow: function (top) {
                const dm = this.app.dataManager;
                dm.addRecordToCollection(this.collection, () => {
                    this.renderSpreadsheet();
                    this.$el.find('.wtHolder').scrollTop(top ? 0 : 10000); //scroll to either top or bottom
                });
            },

            addField: function (ordering) {
                const addFieldForm = new AddField({
                    app: this.app,
                    dataset: this.collection,
                    sourceModal: this.secondaryModal,
                    ordering: ordering
                });

                this.secondaryModal.update({
                    app: this.app,
                    view: addFieldForm,
                    title: 'Add New Column',
                    width: '350px',
                    height: '250px',
                    showSaveButton: true,
                    saveFunction: addFieldForm.saveField.bind(addFieldForm),
                    showDeleteButton: false
                });
                this.secondaryModal.show();
                this.popover.hide();
            },

            editField: function (fieldIndex) {
                const editFieldForm = new EditField({
                    app: this.app,
                    model: this.fields.at(fieldIndex),
                    dataset: this.collection,
                    sourceModal: this.secondaryModal
                });

                this.secondaryModal.update({
                    app: this.app,
                    view: editFieldForm,
                    title: 'Edit Column',
                    width: '300px',
                    showSaveButton: true,
                    saveFunction: editFieldForm.saveField.bind(editFieldForm),
                    showDeleteButton: false
                });
                this.secondaryModal.show();
                this.popover.hide();
            },

            deleteField: function (fieldIndex) {
                const field = this.fields.at(fieldIndex);
                if (!confirm(`Do you want to delete the "${field.get('col_alias')}" field? This cannot be undone, and may affect other maps and layers in your project.`)){
                    return;
                }
                field.destroy({
                    wait: true,
                    success: (e) => {
                        this.renderSpreadsheet();
                        this.app.dataManager.reloadDatasetFromServer(this.collection);
                    },
                    error: (model, response) => {
                        console.error(response);
                        try {
                            const error = JSON.parse(response.responseText);
                            const dependencies = error.dependencies.join("</li></li>")
                            const message = `
                                ${error.error_message}:<ul><li>${dependencies}</li></ul>`;
                            this.app.vent.trigger('error-message', message);
                        } catch(e) {
                            this.app.vent.trigger('error-message', 'The column could not be deleted: unknown error');
                        }
                    }
                });
                this.popover.hide();
            }
        });
        _.extend(Spreadsheet.prototype, CustomCellRenderers);
        return Spreadsheet;
    });
