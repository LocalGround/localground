
/**
 * Function definitions for presentation actions
 */

localground.presentation.unselectedArguments = function ($stepData, stepIndex, stepArgVal) {
     $stepData.append('<span class="'+this.argValueClassName+'" val=""></span>');
}

localground.presentation.unselected = function ($args) {
    //do nothing
}

localground.presentation.unselectedRewind = function($args) {
    //do nothing
}




localground.presentation.showViewArguments = function ($stepData, stepIndex, stepArgVal) {
    var $dd = $('<select class="dd-view-list ' + this.argValueClassName + '" style="float:right"></select>');
    $.each(self.views, function () {
        $dd.append(
            $('<option></option>').val(this.id).html(this.name)
        );
    });
    if(stepArgVal) {
        $dd.val(stepArgVal);
    }
    $stepData.append($dd);
}

localground.presentation.showView = function ($args) {
    //hook into the view logic, just 'click' the corresponding view
    $('#view-' + $args.find('select').val()).parent().click()
}

localground.presentation.showViewRewind = function ($args) {
    //blerp porp
}





localground.presentation.changeBasemapArguments = function ($stepData, stepIndex, stepArgVal) {
    var $dd = $('<select class="dd-basemap-list ' + this.argValueClassName + '" style="float:right"></select>');
    $.each(self.overlayConfigArray, function () {
        $dd.append(
            $('<option></option>').val(this.id).html(this.name)
        );
    });
    if(stepArgVal) {
        $dd.val(stepArgVal);
    }
    $stepData.append($dd);
}

localground.presentation.changeBasemap = function($args) {
    var overlayInfo = self.getOverlaySourceInfo('name', $args.find('select option:selected').text());
    var currentId = self.map.getMapTypeId();
    $args.prop('old-map-id',currentId);
    var overlayId = (overlayInfo.sourceName == 'google') ? overlayInfo.providerID : overlayInfo.name;
    self.map.setMapTypeId(overlayId);
}


localground.presentation.changeBasemapRewind = function($args) {
    var oldId = $args.prop('old-map-id');
    self.map.setMapTypeId(oldId);
}



localground.presentation.focusArguments = function ($stepData, stepIndex, stepArgVal) {
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
    $stepData.append($('<textarea class="' + this.argValueClassName +'"></textarea>'))


}


localground.presentation.focus = function ($args) {

}

localground.presentation.focusRewind = function($args) {
    
}



