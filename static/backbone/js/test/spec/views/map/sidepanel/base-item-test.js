define(["jquery", "underscore"], function ($, _) {
    'use strict';
    var item;
    return {
        genericChecks: function (name, overlay_type, BaseClass, ItemTemplate) {
            var that,
                initItem = function (scope) {
                    var model = scope.getModelByOverlayType(overlay_type);
                    model.set("isVisible", false);
                    model.set("isShowingOnMap", false);
                    return new BaseClass({
                        app: scope.app,
                        model: model,
                        template: _.template(ItemTemplate)
                    });
                };
            beforeEach(function () {
                spyOn(BaseClass.prototype, "onRender").and.callThrough();
                spyOn(BaseClass.prototype, "saveState").and.callThrough();

                // model events:
                spyOn(BaseClass.prototype, "showItem").and.callThrough();
                spyOn(BaseClass.prototype, "hideItem").and.callThrough();
                spyOn(BaseClass.prototype, "checkItem").and.callThrough();
                spyOn(BaseClass.prototype, "uncheckItem").and.callThrough();

                // global events:
                spyOn(BaseClass.prototype, "setEditMode").and.callThrough();

                // collection events:
                spyOn(BaseClass.prototype, "refreshItem").and.callThrough();

                // ui events:
                spyOn(BaseClass.prototype, "deleteItem");
                spyOn(BaseClass.prototype, "toggleCheckbox").and.callThrough();
                spyOn(BaseClass.prototype, "toggleElement").and.callThrough();
                spyOn(BaseClass.prototype, "triggerToggleCheckbox").and.callThrough();
                spyOn(BaseClass.prototype, "zoomTo");
                spyOn(BaseClass.prototype, "showTip");
                spyOn(BaseClass.prototype, "hideTip");
                spyOn(BaseClass.prototype, "dropListener");
                spyOn(BaseClass.prototype, "dragListener");
            });

            afterEach(function () {
                $('.deleteme').remove();
            });

            describe(name + ": Test that it initializes correctly", function () {
                it("Loads correctly", function () {
                    that = this;
                    expect(function () {
                        item = initItem(that);
                    }).not.toThrow();
                });

                /*it("Listens for changeMode", function () {
                    item = initItem(this);
                    this.app.vent.trigger("mode-change");
                    expect(BaseClass.prototype.changeMode).toHaveBeenCalled();
                });*/

                it("Listens for model events", function () {
                    item = initItem(this);
                    item.model.trigger('show-item');
                    expect(BaseClass.prototype.showItem).toHaveBeenCalled();
                    item.model.trigger('hide-item');
                    expect(BaseClass.prototype.hideItem).toHaveBeenCalled();
                });

                it("Listens for application & collection events", function () {
                    item = initItem(this);
                    item.app.vent.trigger('mode-change');
                    expect(BaseClass.prototype.setEditMode).toHaveBeenCalled();
                    item.model.collection.trigger('refresh');
                    expect(BaseClass.prototype.refreshItem).toHaveBeenCalled();
                });

                it("Listens for UI events", function () {
                    item = initItem(this);
                    $(document.body).append($('<div class="deleteme"></div>').append(item.render().$el));
                    $('.fa-trash-o').trigger('click');
                    expect(BaseClass.prototype.deleteItem).toHaveBeenCalled();
                    $('.cb-data').trigger('click');
                    expect(BaseClass.prototype.toggleCheckbox).toHaveBeenCalled();
                    $('.data-item').trigger('click');
                    expect(BaseClass.prototype.triggerToggleCheckbox).toHaveBeenCalled();
                    $('a').trigger('click');
                    expect(BaseClass.prototype.zoomTo).toHaveBeenCalled();
                    $('.data-item').trigger('mouseover');
                    expect(BaseClass.prototype.showTip).toHaveBeenCalled();
                    $('.data-item').trigger('mouseout');
                    expect(BaseClass.prototype.hideTip).toHaveBeenCalled();

                    if (item.model.get("overlay_type") == "map-image") { return; }

                    // drag event handlers only for point data:
                    $('.item-icon').trigger('dragend');
                    expect(BaseClass.prototype.dropListener).toHaveBeenCalled();
                    $('.item-icon').trigger('drag');
                    expect(BaseClass.prototype.dragListener).toHaveBeenCalled();
                });

                it("Saves and restores state", function () {
                    item = initItem(this);
                    item.state._isShowingOnMap = true;
                    item.saveState();
                    item = initItem(this);
                    expect(item.isShowingOnMap()).toBeTruthy();
                    item.state._isShowingOnMap = false;
                    item.saveState();
                    item = initItem(this);
                    expect(item.isShowingOnMap()).toBeFalsy();
                });

                it("onRender updates mode", function () {
                    //spyOn(BaseClass.prototype, "onRender");
                    item = initItem(this);
                    item.render();
                    expect(BaseClass.prototype.onRender).toHaveBeenCalled();
                    expect(BaseClass.prototype.setEditMode).toHaveBeenCalled();
                });

                it("toggle element works", function () {
                    item = initItem(this);
                    item.toggleElement(true);
                    expect(item.model.get('showingOnMap')).toBeTruthy();
                    item.toggleElement(false);
                    expect(item.model.get('showingOnMap')).toBeFalsy();
                });

                it("sets edit mode", function () {
                    item = initItem(this);
                    item.render();
                    item.app.setMode("view");
                    item.setEditMode();
                    expect(item.$el.find('.editable').get(0)).not.toBeDefined();
                    item.app.setMode("editable");
                    item.setEditMode();
                    expect(item.$el.find('.editable').get(0)).toBeDefined();
                });

                it("refreshes item", function () {
                    item = initItem(this);
                    item.render();
                    item.refreshItem();
                    expect(BaseClass.prototype.toggleCheckbox).toHaveBeenCalled();
                });

                it("toggle checkbox triggers successfully", function () {
                    item = initItem(this);
                    item.render();
                    item.triggerToggleCheckbox();
                    expect(BaseClass.prototype.toggleElement).toHaveBeenCalled();
                });

                it("show & hide methods work", function () {
                    item = initItem(this);
                    expect(BaseClass.prototype.toggleElement).not.toHaveBeenCalled();
                    expect(BaseClass.prototype.saveState).not.toHaveBeenCalled();
                    expect(BaseClass.prototype.checkItem).not.toHaveBeenCalled();
                    expect(BaseClass.prototype.uncheckItem).not.toHaveBeenCalled();

                    item.showItem();
                    item.hideItem();

                    expect(BaseClass.prototype.toggleElement).toHaveBeenCalled();
                    expect(BaseClass.prototype.saveState).toHaveBeenCalled();
                    expect(BaseClass.prototype.checkItem).toHaveBeenCalled();
                    expect(BaseClass.prototype.uncheckItem).toHaveBeenCalled();
                });

            });
        }
    };
});