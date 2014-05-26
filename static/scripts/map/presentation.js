/**
 * Created by zmmachar on 5/20/14.
 */

localground.presentation = function () {

}


localground.presentation.initialize = function (opts) {
    /**
     * presentation-level variable declarations
     */
    this.stepTypes = {"unselected": "Choose Action", "showView": "Show View", "showObject": "Show Object",
        "doNothing": "Do Nothing"};
    this.$stepTable = $('#presentation-steps tbody');
    this.$stepTable.sortable();
    this.presentations = [{id:3, name:"bob"},{id:4, name:"bub"},{id:5, name:"bib"}];
    this.currentPresentationID = null;
    this.argValueClassName = 'step-arg-value';
    var that = this;

    /**
     * Hooking up button callbacks
     */
    $('#add-step').click(function () {
        that.addStep.call(that);
    });
    $('#start-presentation').click(function () {
        that.startPresentation.call(that);
    });
    $('#save-presentation').click(function() {
        that.loadSaveDialog.call(that);
    })

}

localground.presentation.addStep = function () {
    var $stepList = this.$stepTable;

    var $row = $('<tr class="presentation-step"></tr>');

    var $stepType = $('<select class="dd-step-type" style="float:left"></select>');
    $.each(this.stepTypes, function (key, value) {
        $stepType.append(
            $('<option></option>').val(key).html(value)
        );
    });
    var $stepData = $('<td class="step-function"></td>');
    $stepData.append($stepType);

    var that = this;

    $row.append($stepData);


    var $stepData = $('<td class="step-argument"></td>');
    this.unselectedArguments($stepData, $stepList.children().length);
    //$viewData.append($dd);
    $row.append($stepData);
    //$li.append($st).append($dd);
    $stepType.change(function () {
        that.loadStepArguments.call(that, $stepType, $stepData, $stepList.children().length - 1);
    });

    $stepList.append($row);

}

localground.presentation.loadStepArguments = function ($stepType, $stepData, stepIndex) {
    $stepData.empty();
    var func = $stepType.val() + "Arguments";
    this[func].call(this, $stepData, stepIndex);

}

localground.presentation.startPresentation = function () {
    var steps = this.$stepTable.children();
    var currentStep = 0;
    this.showStep.call(this, steps[currentStep])
    $('#presentation-controls').slideDown();
    var that = this;
    $('#step-forward').click(function () {
        $(steps[currentStep]).css('background-color', '');
        if (currentStep < steps.length - 1) {
            currentStep++;
            that.showStep.call(that, steps[currentStep]);
        }

    });
    $('#step-back').click(function () {
        $(steps[currentStep]).css('background-color', '');
        if (currentStep > 0) {
            currentStep--;
            that.showStep.call(that, steps[currentStep]);
        }
    });
    $('#stop-presentation').click(function () {
        that.stopPresentation.call(that, steps[currentStep]);
    });


}

localground.presentation.stopPresentation = function (currentStep) {
    this.currentStep = 0;
    $('#presentation-controls').slideUp();
    $(currentStep).css('background-color', '');
    $('#step-forward').unbind('click');
    $('#step-back').unbind('click');
    $('#stop-presentation').unbind('click');
}

localground.presentation.showStep = function (step) {
    $(step).css('background-color', '#ADFFAD');
    var func = $(step).find('.step-function select').val();
    if (func != "unselected") {
        var $args = $(step).find('.step-argument');
        this[func].call(this, $args);
    }
}

localground.presentation.getStepContext = function (stepIndex) {
    for (var i = stepIndex; i >= 0; i--) {
        step = this.$stepTable.children()[i];
        if ($(step).find('.step-function select') && $(step).find('.step-function select').val() == "showView") {
            return $(step).find('.step-argument select').val();
        }
    }
    return null;
}

localground.presentation.loadSaveDialog = function() {
    //1. get list of views:
    var $sel = $('#dd_presentation');
    $sel.empty();
    $sel.append($('<option></option>').attr('value', 'create_new').html('---Create New---'));
    $.each(this.presentations, function () {
        $sel.append(
            $('<option></option>').val(this.id).html(this.name)
        );
    });
    $sel.change(function () {
        if ($(this).val() === "create_new") {
            $('#new-presentation-fields').show();
        } else {
            $('#new-presentation-fields').hide();
        }
    });
    if (this.currentPresentationID != null) {
        $sel.val(self.currentPresentationID);
        $('#new-presentation-fields').hide();
    } else {
        $('#new-presentation-fields').show();
    }

    //2. generate code:
    $('#presentation-code').val(this.generatePresentationCode.call(this));
    //3. show dialog:
    $('#save-presentation-dialog').find('.close').unbind('click');
    $('#close-presentation-button').unbind('click');
    $('#save-presentation-button').unbind('click');

    $('#close-presentation-button').click(function () {
        $('#save-presentation-dialog').modal('hide');
    });
    $('#save-presentation-dialog').find('.close').click(function () {
        $('#close-presentation-button').trigger('click');
    });
    var that = this;
    $('#save-presentation-button').click(function () {
        that.savePresentation.call(that);
    });

    $('#save-presentation-dialog').modal('show');


}

localground.presentation.savePresentation = function() {
    var val = $('#dd_presentations').val();
    if (val === "create_new") {
        this.createPresentation.call(this);
    } else {
        this.updatePresentation.call(this);

    }
}

localground.presentation.createPresentation = function() {
    $('#new-presentation-error').hide();
    var newPresentationName = $("#new-presentation-name").val();
    if (this.makePresentationFieldsValid()) {
        $.ajax({
            //
            url: '/api/0/presentations/',
            type: 'POST',
            data: {
                name: newPresentationName,
                description: $("#new-presentation-description").val(),
                tags: $("#new-presentation-tags").val(),
                slug: $("#new-presentation-slug").val(),
                code: $('#presentation-code').val()
            },
            success: function (data) {
                //reset the modal window
                $('#new-presentation-fields label').css('color', '');
                $('.new-presentation-field').val('');
                $('#close-presentation-button').click();
                self.resetViews(newPresentationName);

            },
            notmodified: function (data) {
                console.error('Not modified');
            },
            error: function (data) {
                console.error('Error: ' + JSON.stringify(data));
            }
        });
    } else {
        $('#new-presentation-error').fadeIn(500);
    }
}

localground.presentation.updatePresentation = function() {
    var that = this;
    $.ajax({
        //
        url: '/api/0/presentations/' + $('#dd_presentation').val() + '/.json',
        type: 'PATCH',
        data: {
            code: $('#presentation-code').val()
        },
        success: function (data) {
            $('#close-presentation-button').click();
            that.resetPresentations.call(that);

        },
        notmodified: function (data) {
            console.error('Not modified');
        },
        error: function (data) {
            console.error('Error: ' + JSON.stringify(data));
        }
    });
}

localground.presentation.generatePresentationCode = function() {
    var steps = this.$stepTable.children();
    var jsonCode = [];
    var that = this;
    $.each(steps, function(index, step) {
        var func = $(step).find('.step-function select').val();
        var args = $(step).find('.'+that.argValueClassName).val();
        var obj = {};
        obj[func] = args;
        jsonCode.push(obj)
    });
    return JSON.stringify(jsonCode);
    
}

localground.presentation.makePresentationFieldsValid = function() {
    var isValid = true;
    var $name = $('#new-presentation-name');
    if ($name.val() === "") {
        $("#" + $name.prop('id') + "-label").css('color', 'red');
        isValid = false;
    } else {
        $("#" + $name.prop('id') + "-label").css('color', '');
    }
    var $slug = $('#new-presentation-slug');
    if ($slug.val() === "") {
        $slug.val($name.val());
    }
    $slug.val($slug.val().replace(/ /g, '-'));

    return isValid;

}

localground.presentation.resetPresentations = function() {
    //TODO: implement this
}


/**
 * Function definitions for presentation actions
 */

localground.presentation.unselectedArguments = function ($stepData, stepIndex) {
     $stepData.append('<span class="'+this.argValueClassName+'" val=""></span>');
}


localground.presentation.doNothingArguments = function ($stepData, stepIndex) {
    $stepData.append('<span class="'+this.argValueClassName+'" val="">N/A</span>');
}


localground.presentation.showViewArguments = function ($stepData, stepIndex) {
    var $dd = $('<select class="dd-view-list ' + this.argValueClassName + '" style="float:right"></select>');
    $.each(self.views, function () {
        $dd.append(
            $('<option></option>').val(this.id).html(this.name)
        );
    });
    $stepData.append($dd);
}

localground.presentation.showObjectArguments = function ($stepData, stepIndex) {
    /**
    var currentViewId = parseInt(this.getStepContext.call(this, stepIndex));
    if (currentViewId != null) {
        var currentView = self.views.filter(function (view) {
            if (view.id === currentViewId) return view;
        })[0];

        var entities = $.parseJSON(currentView.entities);

        $.each(entities, function (index, entity) {
            $.each(entity.ids, function (idx, id) {
                console.log($('#' + entity.overlay_type + '_' + id));

            });

        });

        console.log('hey');

    }
     **/
    $stepData.append($('<textarea class="step-arg-value"></textarea>'))


}

localground.presentation.doNothing = function ($args) {
    console.log('doNothing');
}

localground.presentation.showView = function ($args) {
    //hook into the view logic, just 'click' the corresponding view
    $('#view-' + $args.find('select').val()).parent().click()
}

localground.presentation.showObject = function ($args) {

}

