/**
 * Created by zmmachar on 5/20/14.
 */

localground.presentation = function () {

}


localground.presentation.initialize = function(opts) {
    this.stepTypes = {"unselected":"Choose Action","showView":"Show View", "doNothing":"Do Nothing"};
    this.$stepTable = $('#presentation-steps tbody');
    this.$stepTable.sortable();
    var that = this;
    $('#add-step').click(function() {
        that.addStep.call(that);
    });
    $('#start-presentation').click(function() {
       that.startPresentation.call(that);
    });

}

localground.presentation.addStep = function() {
    var $stepList = this.$stepTable;

    var $row = $('<tr class="presentation-step"></tr>');

    var $stepType = $('<select class="dd-step-type" style="float:left"></select>');
    $.each(this.stepTypes, function(key, value) {
         $stepType.append(
            $('<option></option>').val(key).html(value)
        );
    });
    var $stepData = $('<td class="step-function"></td>');
    $stepData.append($stepType);

    var that = this;

    $row.append($stepData);


    var $stepData = $('<td class="step-argument"></td>');
    //$viewData.append($dd);
    $row.append($stepData);
    //$li.append($st).append($dd);
    $stepType.change(function() {
        that.loadStepArguments.call(that, $stepType, $stepData);
    });

    $stepList.append($row);

}

localground.presentation.loadStepArguments = function($stepType, $stepData) {
    $stepData.empty();
    var func = $stepType.val() + "Arguments";
    this[func].call(this,$stepData);

}

localground.presentation.startPresentation = function() {
    var steps = this.$stepTable.children();
    var currentStep = 0;
    this.showStep.call(this, steps[currentStep])
    $('#presentation-controls').slideDown();
    var that = this;
    $('#step-forward').click(function() {
        $(steps[currentStep]).css('background-color','');
        if(currentStep < steps.length - 1) {
            currentStep++;
            that.showStep.call(that, steps[currentStep]);
        }

    });
    $('#step-back').click(function() {
        $(steps[currentStep]).css('background-color','');
        if(currentStep > 0) {
            currentStep--;
            that.showStep.call(that, steps[currentStep]);
        }
    });
    $('#stop-presentation').click(function() {
        that.stopPresentation.call(that, steps[currentStep]);
    });


}

localground.presentation.stopPresentation = function(currentStep) {
    this.currentStep = 0;
    $('#presentation-controls').slideUp();
    $(currentStep).css('background-color','');
    $('#step-forward').unbind('click');
    $('#step-back').unbind('click');
    $('#stop-presentation').unbind('click');
}

localground.presentation.showStep = function(step) {
    $(step).css('background-color', '#ADFFAD');
    var func = $(step).find('.step-function select').val();
    if(func != "unselected") {
        var $args = $(step).find('.step-argument');
        this[func].call(this, $args);
    }
}

localground.presentation.unselectedArguments = function($stepData) {
    //do Nothing
}


localground.presentation.doNothingArguments = function($stepData) {
    $stepData.append("<span>N/A</span>");
}

localground.presentation.showViewArguments = function($stepData) {
    var $dd = $('<select class="dd-view-list" style="float:right"></select>');
    $.each(self.views, function () {
        $dd.append(
            $('<option></option>').val(this.id).html(this.name)
        );
    });
    $stepData.append($dd);
}

localground.presentation.doNothing = function($args) {
    console.log('doNothing');
}

localground.presentation.showView = function($args) {
    //hook into the view logic, just 'click' the corresponding view
    $('#view-' + $args.find('select').val()).parent().click()
}

