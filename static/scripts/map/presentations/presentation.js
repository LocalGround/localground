/**
 * Created by zmmachar on 5/20/14.
 * Deals with the messier user-interface portions of the presentation, along with saving and loading
 * Leaves function implementation to the presentation-functions file
 * TODO: implement rewind methods for current steps
 * TODO: move constants into consts variable
 */

var consts = {};

localground.presentation = function () {

}


localground.presentation.initialize = function (opts) {
    /**
     * presentation-level variable declarations
     */
    this.stepTypes = {"unselected": "Choose Action", "showView": "Show View", "focus": "Focus",
        "changeBasemap": "Change map"};
    this.$stepTable = $('#presentation-steps tbody');
    this.$stepTable.sortable();
    this.currentPresentationID = null;
    this.populatePresentationList.call(this);
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

localground.presentation.addStep = function (stepFunc, stepArgVal) {
    var $stepList = this.$stepTable;

    var $row = $('<tr class="presentation-step"></tr>');

    var $stepType = $('<select class="dd-step-type" style="float:left"></select>');
    $.each(this.stepTypes, function (key, value) {
        $stepType.append(
            $('<option></option>').val(key).html(value)
        );
    });
    if(stepFunc) {
        $stepType.val(stepFunc);
    }
    var $stepData = $('<td class="step-function"></td>');
    $stepData.append($stepType);

    var that = this;

    $row.append($stepData);


    var $stepData = $('<td class="step-argument"></td>');

    this[$stepType.val() + 'Arguments'].call(this, $stepData, $stepList.children().length, stepArgVal);

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

        if (currentStep < steps.length - 1) {
            $(steps[currentStep]).css('background-color', '');
            currentStep++;
            that.showStep.call(that, steps[currentStep]);
        }

    });
    $('#step-back').click(function () {

        if (currentStep > 0) {
            $(steps[currentStep]).css('background-color', '');
            //that.rewindStep.call(that, steps[currentStep]);
            currentStep = that.getLastViewTransitionIndex(currentStep - 1);
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
    var $args = $(step).find('.step-argument');
    this[func].call(this, $args);
}

localground.presentation.rewindStep = function(step) {
    var func = $(step).find('.step-function select').val() + 'Rewind';
    var $args = $(step).find('.step-argument');
    this[func].call(this, $args);

}

localground.presentation.getStepContext = function (stepIndex) {
    var index = this.getLastViewTransitionIndex.call(this, stepIndex);
    return $(this.$stepTable.children()[index]).find('.step-argument select').val();
}

localground.presentation.getLastViewTransitionIndex = function (stepIndex) {
    for (var i = stepIndex; i >= 0; i--) {
        step = this.$stepTable.children()[i];
        if ($(step).find('.step-function select') && $(step).find('.step-function select').val() == "showView") {
            return i;
        }
    }
    return 0;
}

localground.presentation.loadSaveDialog = function() {
    //1. get list of presentations:
    var $sel = $('#dd_presentation');
    $sel.empty();
    $sel.append($('<option></option>').attr('value', 'create_new').html('---Create New---'));
    $.each(self.presentations, function () {
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
        $sel.val(this.currentPresentationID);
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
    var val = $('#dd_presentation').val();
    if (val === "create_new") {
        this.createPresentation.call(this);
    } else {
        this.updatePresentation.call(this);

    }
}

localground.presentation.createPresentation = function() {
    $('#new-presentation-error').hide();
    var that = this;
    if (this.makePresentationFieldsValid()) {
        $.ajax({
            //
            url: '/api/0/presentations/.json',
            type: 'POST',
            data: {
                name: $("#new-presentation-name").val(),
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
                var newPresentationId = data.id;
                that.resetPresentations.call(that, newPresentationId);

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

localground.presentation.resetPresentations = function(newPresentationId) {
    var that = this;
    $.ajax({
        url: "/api/0/presentations/.json",
        type: "GET",
        success: function(data) {
            self.presentations = data.results;
            if(newPresentationId) {
                that.currentPresentationID = newPresentationId;
                that.populatePresentationList.call(that);
            }
        }

    })
}

localground.presentation.populatePresentationList = function() {
    var $presentationList = $('#presentation-list');
    $presentationList.empty();
    var that = this;
    $.each(self.presentations, function(index, presentation) {
        var $option = $('<li><a href="#">' + presentation.name + '</a></li>').val(presentation.id);
        $option.click(function() {
            that.loadPresentation.call(that,$(this).val());
        });
        $presentationList.append($option);
    });
}

localground.presentation.loadPresentation = function(presentationID) {
    this.currentPresentationID = presentationID;
    this.$stepTable.empty();
    var that = this;
    var presentation = self.presentations.filter(function(presentation) {
        if(presentation.id == presentationID) return presentation;
    });
    if(presentation && presentation.length > 0) {
        presentation = presentation[0];
        var code = presentation.code;
        $.each(code, function(index, step) {
            var key = Object.keys(step)[0];
            that.addStep.call(that, key, step[key]);
        });
    }
}



