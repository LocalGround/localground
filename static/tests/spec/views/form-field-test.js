var rootDir = "../../";
define([
    "jquery",
    rootDir + "views/create-form",
    rootDir + "views/field-child-view",
    rootDir + "models/field",
    "tests/spec-helper"
],
    function ($, CreateForm, FieldChildView, Field) {
        'use strict';
        var fixture, formView, fieldView, initSpies, createExistingFieldView, createNewFieldView;

        initSpies = function (scope) {
            //error catch functions
            spyOn(FieldChildView.prototype, 'initialize').and.callThrough();
            spyOn(FieldChildView.prototype, 'render').and.callThrough();
            spyOn(FieldChildView.prototype, 'doDelete').and.callThrough();
            spyOn(FieldChildView.prototype, 'validateField').and.callThrough();

            spyOn(FieldChildView.prototype, 'setRatingsFromModel').and.callThrough();
            spyOn(FieldChildView.prototype, 'saveNewRating').and.callThrough();
            spyOn(FieldChildView.prototype, 'removeRating').and.callThrough();
            spyOn(FieldChildView.prototype, 'updateRatingList').and.callThrough();
            spyOn(FieldChildView.prototype, 'addNewRating').and.callThrough();
            spyOn(FieldChildView.prototype, 'saveRatingsToModel').and.callThrough();

            spyOn(FieldChildView.prototype, 'setChoicesFromModel').and.callThrough();
            spyOn(FieldChildView.prototype, 'saveNewChoice').and.callThrough();
            spyOn(FieldChildView.prototype, 'removeChoice').and.callThrough();
            spyOn(FieldChildView.prototype, 'updateChoiceList').and.callThrough();
            spyOn(FieldChildView.prototype, 'addNewChoice').and.callThrough();
            spyOn(FieldChildView.prototype, 'saveChoicesToModel').and.callThrough();

            spyOn(Field.prototype, 'destroy');
            spyOn(Field.prototype, 'isValid');

            spyOn(scope.app.vent, 'trigger').and.CallThrough();

        };

        createExistingFieldView = function (scope) {
            console.log('createExistingFieldView');
            var opts = {};
            _.extend(opts, scope.form.toJSON(), {
                model: scope.form.fields.at(0),
                parent: new CreateForm({
                    model: scope.form,
                    app: scope.app
                })
            });
            console.log(opts);
            fieldView = new FieldChildView(opts);
            fieldView.render();
        };

        createNewFieldView = function (scope) {
            var opts = {};
            _.extend(opts, scope.form.toJSON(), {
                model: new Field({}, {id: scope.form.id }),
                parent: new CreateForm({
                    model: scope.form,
                    app: scope.app
                })
            });
            fieldView = new FieldChildView(opts);
            fieldView.render();
        };

        describe("Create Form Fields: Initialization Tests", function () {
            beforeEach(function () {
                initSpies(this);
            });

            it("Same number of fields successfully created", function () {
                expect(FieldChildView.prototype.initialize).toHaveBeenCalledTimes(0);
                expect(FieldChildView.prototype.render).toHaveBeenCalledTimes(0);
                formView = new CreateForm({
                    model: this.form,
                    app: this.app
                });
                fixture = setFixtures('<div></div>').append(formView.$el);
                expect(FieldChildView.prototype.initialize).toHaveBeenCalledTimes(5);
                expect(FieldChildView.prototype.render).toHaveBeenCalledTimes(5);
            });

             it("Creates field and sets variables", function () {
                var opts = {};
                _.extend(opts, this.form.toJSON(), {
                    model: this.form.fields.at(0),
                    parent: new CreateForm({
                        model: this.form,
                        app: this.app
                    })
                });
                expect(FieldChildView.prototype.initialize).toHaveBeenCalledTimes(5);
                fieldView = new FieldChildView(opts);
                expect(FieldChildView.prototype.initialize).toHaveBeenCalledTimes(6);
                expect(fieldView.model).toBe(this.form.fields.at(0));
            });
        });

        describe("Create Form Fields: Render Tests", function () {
            beforeEach(function () {
                initSpies(this);
            });
            it("Renders child HTML", function () {
                var opts = {}, field = this.form.fields.at(0);
                _.extend(opts, this.form.toJSON(), {
                    model: field,
                    parent: new CreateForm({
                        model: this.form,
                        app: this.app
                    })
                });
                expect(FieldChildView.prototype.render).toHaveBeenCalledTimes(5);
                fieldView = new FieldChildView(opts);
                fieldView.render();
                expect(FieldChildView.prototype.render).toHaveBeenCalledTimes(6);

                //check HTML in DOM:
                console.log(fieldView.$el.html());
                expect(fieldView.$el).toEqual("tr");
                expect(fieldView.$el).toContainElement(".fa-grip");
                expect(fieldView.$el).toContainElement("input.fieldname");
                expect(fieldView.$el).toContainElement("td.form-reorder");
                expect(fieldView.$el).toContainElement("span.fieldType");
                expect(fieldView.$el).toContainElement("a.delete-field");
                expect(fieldView.$el).toContainElement(".display-field");
                expect(fieldView.model.get("is_display_field")).toBe(true);
                expect(fieldView.$el.find('.display-field').is(":checked")).toBeTruthy();
                expect(fieldView.$el.attr('id')).toBe(field.id.toString());
                expect(fieldView.$el.find('select')).not.toExist();
                expect(fieldView.$el.find('input.fieldname').val().trim()).toBe(field.get("col_alias"));
                expect(fieldView.$el.find('span.fieldType').html().trim()).toBe(field.get("data_type"));
                expect(fieldView.$el.find('input.fieldname').val()).toBe(field.get("col_alias"));
            });

            it("If isn't a display field, don't check box", function () {
                var opts = {}, field = this.form.fields.at(1);
                _.extend(opts, this.form.toJSON(), {
                    model: field,
                    parent: new CreateForm({
                        model: this.form,
                        app: this.app
                    })
                });
                fieldView = new FieldChildView(opts);
                fieldView.render();
                expect(fieldView.$el).toContainElement(".display-field");
                expect(fieldView.model.get("is_display_field")).toBe(false);
                expect(fieldView.$el.find('.display-field').is(":checked")).toBeFalsy();
            });

            it("Don't delete when user cancels confirm dialog", function () {
                var opts = {}, field = this.form.fields.at(0);
                _.extend(opts, this.form.toJSON(), {
                    model: field,
                    parent: new CreateForm({
                        model: this.form,
                        app: this.app
                    })
                });
                spyOn(window, 'confirm').and.returnValue(false);
                expect(FieldChildView.prototype.doDelete).toHaveBeenCalledTimes(0);
                expect(Field.prototype.destroy).toHaveBeenCalledTimes(0);
                fieldView = new FieldChildView(opts);
                fieldView.render();
                fixture = setFixtures('<div></div>').append(fieldView.$el);
                fieldView.$el.find('a.delete-field').trigger('click');
                expect(FieldChildView.prototype.doDelete).toHaveBeenCalledTimes(1);
                expect(Field.prototype.destroy).toHaveBeenCalledTimes(0);
            });

            it("Delete when user cancels confirm dialog", function () {
                var opts = {}, field = this.form.fields.at(0);
                _.extend(opts, this.form.toJSON(), {
                    model: field,
                    parent: new CreateForm({
                        model: this.form,
                        app: this.app
                    })
                });
                spyOn(window, 'confirm').and.returnValue(true);
                expect(FieldChildView.prototype.doDelete).toHaveBeenCalledTimes(0);
                expect(Field.prototype.destroy).toHaveBeenCalledTimes(0);
                fieldView = new FieldChildView(opts);
                fieldView.render();
                fixture = setFixtures('<div></div>').append(fieldView.$el);
                expect(fieldView.$el).toBeInDOM();
                fieldView.$el.find('a.delete-field').trigger('click');
                expect(FieldChildView.prototype.doDelete).toHaveBeenCalledTimes(1);
                expect(Field.prototype.destroy).toHaveBeenCalledTimes(1);
                expect(fieldView.$el).not.toBeInDOM();
            });

            it("If fieldname is blank, it shows an error", function () {
                createExistingFieldView(this);
                expect(FieldChildView.prototype.validateFields).toHaveBeenCalledTimes(0);
                fixture = setFixtures("<div></div>").append(fieldView.$el);
                fixture.find(".fieldname").val("").trigger('blur');
                fieldView.validateField();
                //fieldView.saveField();
                expect(FieldChildView.prototype.validateFields).toHaveBeenCalledTimes(1);
                expect(fieldView.$el.hasClass("failure-message")).toBeTruthy();
                expect($(fieldView.$el.find('span')[0]).html()).toBe("Field Name Missing");
            });

            it("If fieldtype is blank, it shows an error", function () {
                createNewFieldView(this);
                fieldView.$el.find("select").val("-1");
                fieldView.validateField(1);
                //fieldView.saveField(1);
                expect(fieldView.$el.hasClass("failure-message")).toBeTruthy();
                expect($(fieldView.$el.find('span')[0]).html()).toBe("Field Name Missing");
                expect($(fieldView.$el.find('span')[1]).html()).toBe("Field Type Missing");
            });
        });


        describe("Create Form Fields: Radio button switch test", function () {
            beforeEach(function () {
                initSpies(this);
            });
            it("Renders child HTML", function () {
                var opts = {}, field = this.form.fields.at(1);
                _.extend(opts, this.form.toJSON(), {
                    model: field,
                    parent: new CreateForm({
                        model: this.form,
                        app: this.app
                    })
                });
                fieldView = new FieldChildView(opts);
                fieldView.render();
                fixture = setFixtures('<div></div>').append(fieldView.$el);
                expect(fieldView.model.get("is_display_field")).toBeFalsy();
                expect(fieldView.$el.find('.display-field').is(":checked")).toBeFalsy();
                fieldView.$el.find('.display-field').trigger('click');
                fieldView.saveField();
                expect(fieldView.$el.find('.display-field').is(":checked")).toBeTruthy();
            });
        });

        describe("Create Form Fields: Ratings Test", function(){
            beforeEach(function(){
                initSpies(this);
                var opts = {}, field = this.form.fields.at(3);
                _.extend(opts, this.form.toJSON(), {
                    model: field,
                    parent: new CreateForm({
                        model: this.form,
                        app: this.app
                    })
                });
                fieldView = new FieldChildView(opts);
                fieldView.render();
                fixture = setFixtures('<div></div>').append(fieldView.$el);

            });

            it("Successfully loads the ratings list onto the field", function(){

                var field = this.form.fields.at(3);
                expect(fieldView.model).toEqual(field);

                expect(fieldView.model.get("extras")).toEqual(field.get("extras"));
                expect(fixture.find(".rating-row").length).toEqual(field.get("extras").length);
                expect(fixture.find(".rating-row").length).toEqual(3);

            });

            it("Shows the HTML elements of the ratings", function(){
                var field = this.form.fields.at(3);

                var rating_rows = fixture.find(".rating-row");
                var extras = field.get("extras");
                for (var i = 0; i < rating_rows.length; ++i){
                    var rating_name = $(rating_rows[i]).find(".rating-name").val();
                    var rating_value = $(rating_rows[i]).find(".rating-value").val();
                    expect(rating_name).toEqual(extras[i].name);
                    expect(rating_value).toEqual(extras[i].value.toString());
                }
            });

            it ("Successfully adds a new rating to the list", function(){

                var field = this.form.fields.at(3);
                fixture.find(".add-new-rating").trigger("click");
                var extras = field.get("extras");
                var rating_rows = fixture.find(".rating-row");


                $(rating_rows[3]).find(".rating-name").val("Test");
                $(rating_rows[3]).find(".rating-value").val(5);
                fieldView.updateRatingList();

                extras = field.get("extras");
                var lastIndexRating = extras[extras.length - 1];
                console.log(lastIndexRating);
                console.log(extras);
                expect(field.get("extras").length).toEqual(4);
                expect($(rating_rows[3]).find(".rating-name").val()).toEqual(lastIndexRating.name);
                expect($(rating_rows[3]).find(".rating-value").val()).toEqual(lastIndexRating.value.toString());


            });

            it ("Successfully removes a rating from the list", function(){
                spyOn(window, 'confirm').and.returnValue(true);
                var field = this.form.fields.at(3);
                var rating_rows = fixture.find(".rating-row");

                $(rating_rows[2]).find(".remove-rating").trigger("click");

                var extras = field.get("extras");
                expect(field.get("extras").length).toEqual(2);

            });

            it ("Edits Existing Rating", function(){

                var field = this.form.fields.at(3);
                var rating_rows = fixture.find(".rating-row");


                var original_name = $(rating_rows[2]).find(".rating-name").val();
                var original_value = $(rating_rows[2]).find(".rating-value").val();


                $(rating_rows[2]).find(".rating-name").val("Hello World");
                $(rating_rows[2]).find(".rating-value").val(10);

                fieldView.updateRatingList();

                var extras = field.get("extras");
                var lastIndexRating = extras[extras.length - 1];

                expect($(rating_rows[2]).find(".rating-name").val()).toEqual(lastIndexRating.name);
                expect($(rating_rows[2]).find(".rating-value").val()).toEqual(lastIndexRating.value.toString());

                expect($(rating_rows[2]).find(".rating-name").val()).not.toEqual(original_name);
                expect($(rating_rows[2]).find(".rating-value").val()).not.toEqual(original_value.toString());

            });

            it ("Detects user input error", function(){

                var field = this.form.fields.at(3);
                fixture.find(".add-new-rating").trigger("click");
                var extras = field.get("extras");
                var rating_rows = fixture.find(".rating-row");


                fieldView.updateRatingList();
                fieldView.validateField();

                extras = field.get("extras");
                var lastIndexRating = extras[extras.length - 1];
                console.log(lastIndexRating);
                console.log(extras);

                expect(lastIndexRating.errorRatingName).toBeTruthy();
                expect(lastIndexRating.errorRatingValue).toBeTruthy();

            });

            it ("Successfully saves the rating list", function(){
                var field = this.form.fields.at(3);
                var rating_rows = fixture.find(".rating-row");

                var original_extras = _.clone(field.get("extras"));

                $(rating_rows[0]).find(".rating-name").val("Javascript");
                $(rating_rows[0]).find(".rating-value").val(30);

                $(rating_rows[1]).find(".rating-name").val("Web Engineer");
                $(rating_rows[1]).find(".rating-value").val(20);

                $(rating_rows[2]).find(".rating-name").val("Hello World");
                $(rating_rows[2]).find(".rating-value").val(10);

                fieldView.updateRatingList();
                fieldView.saveField();

                var extras = field.get("extras");

                // Equals changes made

                for (var i = 0; i < extras.length; ++i){
                    expect($(rating_rows[i]).find(".rating-name").val()).toEqual(extras[i].name);
                    expect($(rating_rows[i]).find(".rating-value").val()).toEqual(extras[i].value.toString());

                    expect($(rating_rows[i]).find(".rating-name").val()).not.toEqual(original_extras[i].name);
                    expect($(rating_rows[i]).find(".rating-value").val()).not.toEqual(original_extras[i].value.toString());
                }

            });
        });

        describe("Create Form Fields: Choices Test", function(){
            beforeEach(function(){
                initSpies(this);
                var opts = {}, field = this.form.fields.at(4);
                _.extend(opts, this.form.toJSON(), {
                    model: field,
                    parent: new CreateForm({
                        model: this.form,
                        app: this.app
                    })
                });
                fieldView = new FieldChildView(opts);
                fieldView.render();
                fixture = setFixtures('<div></div>').append(fieldView.$el);

            });

            it("Successfully loads the choices list onto the field", function(){

                var field = this.form.fields.at(4);
                expect(fieldView.model).toEqual(field);

                expect(fieldView.model.get("extras")).toEqual(field.get("extras"));
                expect(fixture.find(".choice-row").length).toEqual(field.get("extras").length);
                expect(fixture.find(".choice-row").length).toEqual(3);

            });

            it("Shows the HTML elements of the choices", function(){

                var field = this.form.fields.at(4);

                var choice_rows = fixture.find(".choice-row");
                var extras = field.get("extras");
                for (var i = 0; i < choice_rows.length; ++i){
                    var choice_name = $(choice_rows[i]).find(".choice").val();
                    expect(choice_name).toEqual(extras[i].name);
                }

            });

            it ("Successfully adds a new choice to the list", function(){

                var field = this.form.fields.at(4);
                fixture.find(".add-new-choice").trigger("click");
                var extras = field.get("extras");
                var choice_rows = fixture.find(".choice-row");


                $(choice_rows[3]).find(".choice").val("Test");
                fieldView.updateChoiceList();

                extras = field.get("extras");
                var lastIndexchoice = extras[extras.length - 1];
                console.log(lastIndexchoice);
                console.log(extras);
                expect(field.get("extras").length).toEqual(4);
                expect($(choice_rows[3]).find(".choice").val()).toEqual(lastIndexchoice.name);

            });

            it ("Successfully removes a choice from the list", function(){

                spyOn(window, 'confirm').and.returnValue(true);
                var field = this.form.fields.at(4);
                var choice_rows = fixture.find(".choice-row");

                $(choice_rows[2]).find(".remove-choice").trigger("click");

                var extras = field.get("extras");
                expect(field.get("extras").length).toEqual(2);

            });

            it ("Edits Existing Choice", function(){

                var field = this.form.fields.at(4);
                var choice_rows = fixture.find(".choice-row");


                var original_name = $(choice_rows[2]).find(".choice").val();


                $(choice_rows[2]).find(".choice").val("Hello World");

                fieldView.updateChoiceList();

                var extras = field.get("extras");
                var lastIndexchoice = extras[extras.length - 1];

                expect($(choice_rows[2]).find(".choice").val()).toEqual(lastIndexchoice.name);

                expect($(choice_rows[2]).find(".choice").val()).not.toEqual(original_name);

            });

            it ("Detects user input error", function(){

                var field = this.form.fields.at(4);
                fixture.find(".add-new-choice").trigger("click");
                var extras = field.get("extras");
                var choice_rows = fixture.find(".choice-row");


                fieldView.updateChoiceList();
                fieldView.validateField();

                extras = field.get("extras");
                var lastIndexchoice = extras[extras.length - 1];
                console.log(lastIndexchoice);
                console.log(extras);

                expect(lastIndexchoice.errorRatingName).toBeTruthy();


            });

            it ("Successfully saves the choice list", function(){

                var field = this.form.fields.at(4);
                var choice_rows = fixture.find(".choice-row");

                var original_extras = _.clone(field.get("extras"));

                $(choice_rows[0]).find(".choice").val("Javascript");

                $(choice_rows[1]).find(".choice").val("Web Engineer");

                $(choice_rows[2]).find(".choice").val("Hello World");

                fieldView.updateChoiceList();
                fieldView.saveField();

                var extras = field.get("extras");

                // Equals changes made

                for (var i = 0; i < extras.length; ++i){
                    expect($(choice_rows[i]).find(".choice").val()).toEqual(extras[i].name);
                    expect($(choice_rows[i]).find(".choice").val()).not.toEqual(original_extras[i].name);
                }


            });
        });

        describe("Create Form Fields: Validate Field Test", function(){
            it("Check that all validation passes without errors", function(){
                expect(1).toEqual(0);
            });
        });
    });