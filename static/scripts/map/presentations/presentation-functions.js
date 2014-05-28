
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



//horrifying
localground.presentation.focusArguments = function ($stepData, stepIndex, stepArgVal) {
    var $dd = $('<select class="dd-focus-list ' + this.argValueClassName + '" style="float:right"></select>');
    var currentViewId = this.getStepContext(stepIndex);
    var that = this;
    if(!currentViewId) {
        $stepData.append($('<p class="' + this.argValueClassName +'">No view loaded</p>'))
    } else {
        var currentView = self.views.filter(function(view) {if(view.id == currentViewId) return view});
        if(!currentView || !currentView.length > 0) {
            $stepData.append($('<p class="' + this.argValueClassName +'">No elements for focus</p>'))
        } else {
            currentView = currentView[0];
            $.each(currentView.entities, function (index, entity) {
                var overlay_type = entity.overlay_type;
                //get overlay elements of the correct overlay_type
                $.each(currentView.children, function(index, child) {
                    $.each(child.data, function(index, datum) {
                        $dd.append(
                            $('<option></option>').val(datum.overlay_type + ':' +  datum.id).html(datum.name)
                        );
                    });
                });

                //$dd.append(
                //    $('<option></option>').val(this.id).html(this.name)
                //);
            });
            if(stepArgVal) {
                $dd.val(stepArgVal);
            }
            $stepData.append($dd);
        }
    }




}


localground.presentation.focus = function ($args) {
    var argValue = $args.find('select').val();
    argValue = argValue.split(':');
    var overlayType = argValue[0];
    var overlayId = argValue[1];
    switch(overlayType) {
        case 'photo':
            overlayType = 'photos';
            break;
        case 'marker':
            overlayType = 'markers';
            break;
    }
    $('#' + overlayType + '_' + overlayId + ' div a').click();
}

localground.presentation.focusRewind = function($args) {

}



