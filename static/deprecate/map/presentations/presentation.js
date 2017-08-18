/**
 * Created by zmmachar on 5/20/14.
 * Deals with the messier user-interface portions of the presentation, along with saving and loading
 * Leaves function implementation to the presentation-functions file
 *
 *
 */


localground.presentation = (function () {

    /**
    * presentation-level private variable declarations
    */
    var stepTypes = {"unselected": "Choose Action", "showView": "Show View", "focus": "Focus",
        "changeBasemap": "Change map"};

    var $stepTable = $('#presentation-steps tbody');

    var currentPresentationID =null;


    var argValueClassName = 'step-arg-value';

    var currentStep = 0;


    /**
     * public method initialize just sets up the presentation environment
     * @param opts - unused
     */
    this.initialize = function (opts) {

        populatePresentationList.call(this),

        $stepTable.sortable();
        var that = this;


        /**
         * Hooking up button callbacks
         */
        $('#add-step').click(function () {
            addStep();
        });
        $('#start-presentation').click(function () {
            startPresentation.call(that);
        });
        $('#save-presentation').click(function() {
            loadSaveDialog.call(that);
        })

    };

    /**
     * Add a step to the presentation table
     * @param stepFunc (optional) function to add to table, defaults to 'choose function'
     * @param stepArgVal (optional) argument associated with function, defaults to nothing
     */
    function addStep (stepFunc, stepArgVal) {
        var $stepList = $stepTable;

        var $row = $('<tr class="presentation-step"></tr>');

        var $stepType = $('<select class="dd-step-type" style="float:left"></select>');
        $.each(stepTypes, function (key, value) {
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
            loadStepArguments.call(that, $stepType, $stepData, $stepList.children().length - 1);
        });

        $stepList.append($row);

    };

    /**
     * Load the list of arguments associated with a step type
     * @param $stepFunction type of step to add (function)
     * @param $stepData (optional) value of step argument to load
     * @param stepIndex (optional) position of step in the step table
     */
    function loadStepArguments ($stepFunction, $stepData, stepIndex) {
        $stepData.empty();
        var func = $stepFunction.val() + "Arguments";
        this[func].call(this, $stepData, stepIndex);
    };

    /**
     * Load the presentation controls
     */
    var startPresentation = function () {
        var steps = $stepTable.children();
        currentStep = 0;
        showStep.call(this, steps[currentStep])
        $('#presentation-controls').slideDown();
        var that = this;
        $('#step-forward').click(function () {

            if (currentStep < steps.length - 1) {
                $(steps[currentStep]).css('background-color', '');
                currentStep++;
                showStep.call(that, steps[currentStep]);
            }

        });
        $('#step-back').click(function () {

            if (currentStep > 0) {
                $(steps[currentStep]).css('background-color', '');
                //that.rewindStep.call(that, steps[currentStep]);
                currentStep = getLastViewTransitionIndex(currentStep - 1);
                showStep.call(that, steps[currentStep]);
            }
        });
        $('#stop-presentation').click(function () {
            stopPresentation.call(that, steps[currentStep]);
        });


    };


    /**
     * Remove the presentation controls, de-highlight current step
     * @param finalStep step on which the presentation has ended
     */
    var stopPresentation = function (finalStep) {
        currentStep = 0;
        $('#presentation-controls').slideUp();
        $(finalStep).css('background-color', '');
        $('#step-forward').unbind('click');
        $('#step-back').unbind('click');
        $('#stop-presentation').unbind('click');
    };

    /**
     * Hook to call a presentation function
     * @param step step to call (for example showView X or focus Y);
     */
    var showStep = function (step) {
        $(step).css('background-color', '#ADFFAD');
        var func = $(step).find('.step-function select').val();
        var $args = $(step).find('.step-argument');
        this[func].call(this, $args);
    };

    /**
     * Currently deprecated method to perform a rewind operation
     * @param step
     */
    this.rewindStep = function(step) {
        var func = $(step).find('.step-function select').val() + 'Rewind';
        var $args = $(step).find('.step-argument');
        this[func].call(this, $args);

    };

    /**
     * return the most recent view transition, from the given index
     * @param stepIndex current stepIndex
     * @returns {*|jQuery} the view ID of the previous view
     */
    this.getStepContext = function (stepIndex) {
        var index = getLastViewTransitionIndex.call(this, stepIndex);
        return $($stepTable.children()[index]).find('.step-argument select').val();
    };

    /**
     * Returns the INDEX of the most recent view transition
     * @param stepIndex current step index
     * @returns index of previous view transition, or 0
     */
    var getLastViewTransitionIndex = function (stepIndex) {
        for (var i = stepIndex; i >= 0; i--) {
            var step = $stepTable.children()[i];
            if ($(step).find('.step-function select') && $(step).find('.step-function select').val() == "showView") {
                return i;
            }
        }
        return 0;
    };

    /**
     * Set up the modal save dialog for presentations
     */
    var loadSaveDialog = function() {
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
        if (currentPresentationID != null) {
            $sel.val(currentPresentationID);
            $('#new-presentation-fields').hide();
        } else {
            $('#new-presentation-fields').show();
        }

        //2. generate code:
        $('#presentation-code').val(generatePresentationCode.call(this));
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
            savePresentation.call(that);
        });

        $('#save-presentation-dialog').modal('show');


    }

    /**
     * common function to dispatch either the create or update operations
     */
    var savePresentation = function() {
        var val = $('#dd_presentation').val();
        if (val === "create_new") {
            createPresentation.call(this);
        } else {
            updatePresentation.call(this);

        }
    }

    /**
     * creates a new presentation on the server
     */
    var createPresentation = function() {
        $('#new-presentation-error').hide();
        var that = this;
        if (makePresentationFieldsValid()) {
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
                    resetPresentations.call(that, newPresentationId);

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

    /**
     * updates an existing presentation on the server
     */
    var updatePresentation = function() {
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
                resetPresentations.call(that);

            },
            notmodified: function (data) {
                console.error('Not modified');
            },
            error: function (data) {
                console.error('Error: ' + JSON.stringify(data));
            }
        });
    }

    /**
     * parses the current function table and returns the corresponding presentation 'code'
     * @returns {*}
     */
    var generatePresentationCode = function() {
        var steps = $stepTable.children();
        var jsonCode = [];
        var that = this;
        $.each(steps, function(index, step) {
            var func = $(step).find('.step-function select').val();
            var args = $(step).find('.'+argValueClassName).val();
            var obj = {};
            obj[func] = args;
            jsonCode.push(obj)
        });
        return JSON.stringify(jsonCode);

    }

    /**
     * make sure that a well-formed form is being submitted to the server
     * @returns {boolean}
     */
    var makePresentationFieldsValid = function() {
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

    };

    /**
     * Reload the presentation list
     * @param newPresentationId the id of the presentation which has been added
     */
    var resetPresentations = function(newPresentationId) {
        var that = this;
        $.ajax({
            url: "/api/0/presentations/.json",
            type: "GET",
            success: function(data) {
                self.presentations = data.results;
                if(newPresentationId) {
                    currentPresentationID = newPresentationId;
                    populatePresentationList.call(that);
                }
            }

        })
    };

    /**
     * load the presentation list
     */
    var populatePresentationList = function() {
        var $presentationList = $('#presentation-list');
        $presentationList.empty();
        var that = this;
        $.each(self.presentations, function(index, presentation) {
            var $option = $('<li><a href="#">' + presentation.name + '</a></li>').val(presentation.id);
            $option.click(function() {
                loadPresentation.call(that,$(this).val());
            });
            $presentationList.append($option);
        });
    }

    /**
     * Load a particular presentation (fill out the step table with the appropriate steps
     * @param presentationID Id of the presentation to be loaded
     */
    var loadPresentation = function(presentationID) {
        currentPresentationID = presentationID;
        $stepTable.empty();
        var that = this;
        var presentation = self.presentations.filter(function(presentation) {
            if(presentation.id == presentationID) return presentation;
        });
        if(presentation && presentation.length > 0) {
            presentation = presentation[0];
            var code = presentation.code;
            $.each(code, function(index, step) {
                var key = Object.keys(step)[0];
                addStep.call(that, key, step[key]);
            });
        }
    }

    return this;
});



