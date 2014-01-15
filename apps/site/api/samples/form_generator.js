function generateForm(action, url, $form) {
    //first, query the API to get the available options:
    $.ajax({
        url: url,
        type: "POST",
        async: false,
        data: {
            '_method': 'OPTIONS'
        },
        dataType: 'json',
        crossDomain: true,
        error: function(x, e) {
            var msg = "HTTP " + x.status + " error: " + x.responseText;
            $form.html(msg);
            prettyPrint(); 
        },
        success: function(result){
            //then, build the form, based on the available options:
            buildForm(result, action, $form);
        }
    });
}

function buildForm(result, action, $form) {
    $form.empty();
    for(k in result.actions[action]) {
        var val = result.actions[action][k];
        
        //only render writable form fields:
        if (!val.read_only) {
            $div = $('<div></div>').addClass("form-group")
                .append($('<label></label>')
                            .addClass("col-sm-2 control-label")
                            .html((val.label || k) + ":")
                ).append(
                    $("<div></div>").addClass("col-sm-10").append(
                        renderControl(k, val)
                    )
                );
            if (val.help_text) {
                $div.find(".col-sm-10").append($("<small></small>").html(val.help_text));
            }
            $form.append($div);
        }
    }
}


function generateUpdateForm(url, $form) {
    generateForm('PUT', url, $form);
    //now populate form fields with values:
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        crossDomain: true,
        error: function(x, e) {
            var msg = "HTTP " + x.status + " error: " + x.responseText;
            $("#put-code-results").html(msg);
            prettyPrint(); 
        },
        success: function(result) {
            for(k in result) {
                $form.find('#' + k).val(result[k]);
            }
            renderFormJSON($form);
            prettyPrint(); 
        }
    });
}

function renderControl(k, val){
    switch(val.type) {
        case "memo":
            return $('<textarea></textarea>')
                    .addClass("form-control")
                    .css({width: "300px", height: "50px"})
                    .attr("id", k)
                    .attr("name", k)
                    .attr("placeholder", "Enter " + (val.label || k));
        case "point":
            var $span = $('<ispan></span');
            $span.append(
                $('<input type="text"/>')
                    .addClass("form-control")
                    .css({width: "150px"})
                    .attr("id", "lat")
                    .attr("name", "lat")
                    .attr("placeholder", "Enter latitude")
            );
            $span.append(
                $('<input type="text"/>')
                    .addClass("form-control")
                    .css({width: "150px"})
                    .attr("id", "lng")
                    .attr("name", "lng")
                    .attr("placeholder", "Enter longitude")
            );
            return $span;
        default:
            return $('<input type="text"/>')
                    .addClass("form-control")
                    .css({width: "300px"})
                    .attr("id", k)
                    .attr("name", k)
                    .attr("placeholder", "Enter " + (val.label || k));
    }
}

function renderFormJSON($form) {
    var txt = JSON.stringify($form.serializeObject(), null, 2);
    $("#put-code-json").html(txt);
    prettyPrint(); 
}

