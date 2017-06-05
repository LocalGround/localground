/*
  Data Detail Test goes here
*/

var rootDir = "../../";
define([
    "handlebars",
    rootDir + "apps/spreadsheet/views/main",
    rootDir + "models/form",
    rootDir + "collections/photos",
    rootDir + "collections/audio",
    rootDir + "collections/markers",
    rootDir + "collections/records",
    rootDir + "lib/carousel/carousel",
    rootDir + "apps/gallery/views/data-detail",
    "tests/spec-helper"
],
    function (Handlebars, Spreadsheet, Form, Photos, Audio,
              Markers, Records, Carousel, DataDetail) {
        //
        //
        //
        'use strict';
        var fixture;
        var newDataDetail;

        var setupDataDetail;

        /* Fixtures will need to be polished so that it is inserted cleanly for rendering purposes

        The example below is a dirty way of having a fixture based on data detail

        <div><!-- VIEW MODE -->
<input type="text" id="datepicker">


<!-- EDIT MODE -->
    <h4>
        Edit
    </h4>

            <div class="add-lat-lng">
                <button class="button-secondary add-marker-button" id="add-marker-button">
                    Add Location Marker
                </button>
            </div>


    <div class="confirmation success-message">Saved Successfully ✓</div>

    <div id="model-form">
        <!-- Form Inserted Here -->
    <form>     <div data-fieldsets=""><fieldset data-fields="">          <div>      <label for="c66_rating_1">Rating 1</label>      <div>        <span data-editor=""><select id="c66_rating_1" name="rating_1"><option value="1">One</option><option value="2">Two</option></select></span>        <div data-error=""></div>        <div></div>      </div>    </div><div>      <label for="c66_choice_1">Choice 1</label>      <div>        <span data-editor=""><select id="c66_choice_1" name="choice_1"><option>Alpha</option><option>Beta</option></select></span>        <div data-error=""></div>        <div></div>      </div>    </div><div>      <label for="c66_choice_2">Choice 2</label>      <div>        <span data-editor=""><select id="c66_choice_2" name="choice_2"><option>Charlie</option><option>Delta</option></select></span>        <div data-error=""></div>        <div></div>      </div>    </div><div>      <label for="c66_new_rating">New Rating</label>      <div>        <span data-editor=""><select id="c66_new_rating" name="new_rating"><option value="1">A</option><option value="2">B</option><option value="3">C</option></select></span>        <div data-error=""></div>        <div></div>      </div>    </div><div>      <label for="c66_new_choice">New Choice</label>      <div>        <span data-editor=""><select id="c66_new_choice" name="new_choice"><option>Hello</option><option>World</option><option>Test</option></select></span>        <div data-error=""></div>        <div></div>      </div>    </div></fieldset></div>          </form></div>

    <h2 style="margin:20px 20px 4px;">Add Media</h2>
    <div class="attached-media-container ui-sortable">
        <div class="upload-spot" id="left-panel-upload">
            <button id="add-media-button" class="click-to-open" data-modal="modal-add-media"><i class="fa fa-plus" aria-hidden="true"></i></button>
        </div>
    </div>

    <div class="save-options">
        <button class="save-model button-primary">Save</button>
        <button class="view-mode button-tertiary" id="preview">Preview</button>
        <button class="button-tertiary button-warning delete-model" id="delete">Delete</button>
    </div>

    <div class="show-hide hide"></div>
</div>
        */

        var initSpies = function(scope){
            spyOn(DataDetail.prototype, "initialize").and.callThrough();
            spyOn(DataDetail.prototype, "render").and.callThrough();
            //
            spyOn(DataDetail.prototype, "viewRender").and.callThrough();
            spyOn(DataDetail.prototype, "editRender").and.callThrough();
            spyOn(DataDetail.prototype, "onRender");
            //
            spyOn(DataDetail.prototype, "saveModel").and.callThrough();
            spyOn(DataDetail.prototype, "deleteModel").and.callThrough();
            spyOn(DataDetail.prototype, "attachModels").and.callThrough();
            spyOn(DataDetail.prototype, "detachModel").and.callThrough();
            spyOn(DataDetail.prototype, "activateMarkerTrigger").and.callThrough();
            spyOn(DataDetail.prototype, "deleteMarkerTrigger").and.callThrough();
            //
            spyOn(DataDetail.prototype, "showMediaBrowser").and.callThrough();
            spyOn(DataDetail.prototype, "showMapPanel").and.callThrough();
            spyOn(DataDetail.prototype, "hideMapPanel").and.callThrough();
            spyOn(DataDetail.prototype, "doNotDisplay").and.callThrough();
            //
            spyOn(DataDetail.prototype, "rotatePhoto").and.callThrough();
            spyOn(DataDetail.prototype, "sortMediaTable").and.callThrough();
            spyOn(DataDetail.prototype, "fixHelper").and.callThrough();
            spyOn(DataDetail.prototype, "templateHelpers").and.callThrough();
            //
            spyOn(DataDetail.prototype, "switchToEditMode").and.callThrough();
            spyOn(DataDetail.prototype, "switchToViewMode").and.callThrough();
            spyOn(DataDetail.prototype, "switchToAddMode").and.callThrough();
            spyOn(DataDetail.prototype, "attachMedia").and.callThrough();

        };

        describe("Data Detail: Initialization Test", function(){
            beforeEach(function(){
                initSpies(this);
            });

            it("Data Detail successfully created", function(){
                newDataDetail = new DataDetail({
                    app: this.app
                });
                expect(newDataDetail).toEqual(jasmine.any(DataDetail));
            });
        });

    }
);
