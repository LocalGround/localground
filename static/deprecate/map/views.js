/**
 * Created by zmmachar on 6/3/14.
 */

localground.viewer.prototype.initViewsMenu = function () {
    var that = this;
    $('#viewList').empty();
    if (self.views && self.views.length > 0) {
        $.each(self.views, function () {
            var viewID = this.id;
            var $span = $('<span></span>').html(this.name);
            var $rb = $('<input type="radio" class="radio_view" />')
                .attr('id', 'view-' + viewID)
                .val(viewID);
            $rb.change(function () {
                return self.toggleViewData.call(that, parseInt($(this).val()), 'views', $(this).prop('checked'), true);
            });
            $rb.checked = false;
            var $li = $('<li class="view-option"></li>')
                .append($rb).append($span)
                .click(function () {
                    //kind of a weird hack, but it works:
                    $('.view-option').css('border-width', '');
                    $('.view-option').css('background-color', '');
                    $(this).css('border-width', '2px');
                    $(this).css('background-color', '#ADFFAD');
                    var $rb = $(this).find('input');
                    $rb.prop('checked', !$rb.prop('checked'));
                    $rb.trigger('change');
                    return false;
                });


            $('#viewList').append($li);

            $('#view-download-list').append("<li><a href='/api/0/views/" + viewID +
                "/?format=csv'>" + this.name + "</li>");
        });

    }
    if(self.currentViewID != null) {
        $('#view-' + self.currentViewID).parent().click();
    }
    //triggers the inner tab to actually load.  Setting class=active doesn't seem to do this
    $('#view-list-tab').click();

};

localground.viewer.prototype.toggleViewData = function (groupID, groupType, is_checked, turn_on_everything) {

    //remove data from project:
    for (var key in self.managers) {
        //
        self.managers[key].removeAll(self.currentViewID);
    }
    //don't want to show a view in addition to projects and get things mixed up
    $('.cb_project').prop('checked', false);


    //self.resetBounds();
    if($('.radio_view:checked').length == 0) {
        $('#map_toolbar').hide();
    }
    self.initFilterData();

    self.getProjectData(groupID, groupType, is_checked, turn_on_everything);

    this.currentViewID = groupID;

    return true;
};

localground.viewer.prototype.loadSaveView = function () {
    //1. get list of views:
    var that = this;
    var $sel = $('#dd_views');
    $sel.empty();
    $sel.append($('<option></option>').attr('value', 'create_new').html('---Create New---'));
    $.each(self.views, function () {
        $sel.append(
            $('<option></option>').val(this.id).html(this.name)
        );
    });
    $sel.change(function () {
        if ($(this).val() === "create_new") {
            $('#new-view-fields').show();
        } else {
            $('#new-view-fields').hide();
        }
    });
    if (self.currentViewID != null) {
        $sel.val(self.currentViewID);
        $('#new-view-fields').hide();
    } else {
        $('#new-view-fields').show();
    }

    //2. populate fields:
    var geoJSON = {
		type: 'Point',
		coordinates: [
				this.map.getCenter().lng(),
				this.map.getCenter().lat()
		]
	};
    $('#entities').val(self.populateEntities);
    $('#view-center').val(JSON.stringify(geoJSON));
    //TODO: figure out the context of "this" here
	$('#view-basemap').val(this.getMapTypeId());
	$('#view-zoom').val(this.map.getZoom());


    //3. show dialog:
    $('#save_dialog').find('.close').unbind('click');
    $('#close-view-button').unbind('click');
    $('#save-view-button').unbind('click');

    $('#close-view-button').click(function () {
        $('#save_dialog').modal('hide');
    });
    $('#save_dialog').find('.close').click(function () {
        $('#close-view-button').trigger('click');
    });
    $('#save-view-button').click(function () {
        self.saveView();
    });

    $('#save_dialog').modal('show');


};



localground.viewer.prototype.populateEntities = function () {

    var entities = [];
    $.each(self.managers, function (k, v) {
        var overlays = v.getTurnedOnOverlayIDsWithNames();
        if (overlays.length > 0) {
            entities.push({
                overlay_type: v.overlay_type,
                entities: overlays
            });
        }
    })
    return JSON.stringify(entities);

}

localground.viewer.prototype.saveView = function () {
    var val = $('#dd_views').val();
    if (val === "create_new") {
        self.createView();
    } else {
        self.updateView();

    }

};

localground.viewer.prototype.updateView = function () {
    $.ajax({
        //
        url: '/api/0/views/' + $('#dd_views').val() + '/.json',
        type: 'PATCH',
        data: {
            entities: $('#entities').val(),
            center: $('#view-center').val(),
			basemap: $('#view-basemap').val(),
			zoom: $('#view-zoom').val()
        },
        success: function (data) {
            $('#close-view-button').click();
            self.resetViews();

        },
        notmodified: function (data) {
            console.error('Not modified');
        },
        error: function (data) {
            console.error('Error: ' + JSON.stringify(data));
        }
    });
}

localground.viewer.prototype.createView = function () {
    $('#new-view-error').hide();
    var newViewName = $("#new-view-name").val();
    if (self.makeViewFieldsValid()) {
        $.ajax({
            //
            url: '/api/0/views/',
            type: 'POST',
            data: {
                name: newViewName,
                description: $("#new-view-description").val(),
                tags: $("#new-view-tags").val(),
                slug: $("#new-view-slug").val(),
                entities: $('#entities').val(),
                center: $('#view-center').val(),
                basemap: $('#view-basemap').val(),
                zoom: $('#view-zoom').val()
            },
            success: function (data) {
                //reset the modal window
                $('#new-view-fields label').css('color', '');
                $('.new-view-field').val('');
                $('#close-view-button').click();
                self.resetViews(newViewName);

            },
            notmodified: function (data) {
                console.error('Not modified');
            },
            error: function (data) {
                console.error('Error: ' + JSON.stringify(data));
            }
        });
    } else {
        $('#new-view-error').fadeIn(500);
    }
}

//Return true if able to make view fields valid
localground.viewer.prototype.makeViewFieldsValid = function () {
    var isValid = true;
    var $name = $('#new-view-name');
    if ($name.val() === "") {
        $("#" + $name.prop('id') + "-label").css('color', 'red');
        isValid = false;
    } else {
        $("#" + $name.prop('id') + "-label").css('color', '');
    }

    var $slug = $('#new-view-slug');
    if ($slug.val() === "") {
        $slug.val($name.val());
    }
    $slug.val($slug.val().replace(/ /g, '-'));

    return isValid;
}

//TODO: slightly worried this might be a race condition on the server.  Maybe just update manually?
localground.viewer.prototype.resetViews = function(newViewName) {
    $.ajax({

        url: '/api/0/views/.json',
        type: 'GET',
        success: function (data) {
            self.views = data.results;
            if(newViewName) {
                //TODO: fix assumption that view names are unique, probably
                var currentView = self.views.filter(function(view) {if(view.name===newViewName)return view})[0];
                if(currentView != null) {
                    self.currentViewID = currentView.id;
                }
            }
            self.initViewsMenu();


        },

        error: function (data) {
            console.error("Failed to retrieve updated views");
        }
    });
}