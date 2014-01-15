var username = "svw";
var password = "123";

function beforeSend(xhr){
    xhr.setRequestHeader("Authorization",
        "Basic " + btoa(username + ":" + password));
}

function init(){
    $.ajaxSetup({
        beforeSend: function(xhr){
            xhr.setRequestHeader("Authorization",
                "Basic " + btoa(username + ":" + password));
        }
    });
    $('#list-code').html(getList.toString());
    $('#options-code').html(getOptions.toString());
    generateForm('POST', $('#url-post').val(), $('#post-code'));
    generateUpdateForm($('#url-put').val(), $('#put-code'));
    prettyPrint();
}

function initTabs() {
    $('#put-tabs a').click(function (e) {
        e.preventDefault()
        $(this).tab('show')
    });
    $('#put-tabs a').on('shown.bs.tab', function (e) {
        renderFormJSON($("#put-code"));
    });
    $('#put-tabs a:first').tab('show');
}

function getOptions() {
    var url = $("#url-options").val() + "/.json";
    $.ajax({
        url: url,
        type: 'POST',
        data: {
            '_method': 'OPTIONS'
        },
        dataType: 'json',
        crossDomain: true,
        error: function(x, e) {
            var msg = "HTTP " + x.status + " error: " + x.responseText;
            $("#options-code-results").html(msg);
            prettyPrint(); 
        },
        success: function(result) {
            var txt = JSON.stringify(result, null, 2);
            $("#options-code-results").html(txt);
            prettyPrint(); 
        }
    });
}
    
function getList(url) {
    url = url + "/.json";
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        crossDomain: true,
        error: function(x, e) {
            var msg = "HTTP " + x.status + " error: " + x.responseText;
            $("#list-code-results").html(msg);
            prettyPrint(); 
        },
        success: function(result) {
            var txt = JSON.stringify(result, null, 2);
            $("#list-code-results").html(txt);
            prettyPrint(); 
        }
    });
}

    
function updateData(action, url, $form, $results) {
    url = url + "/.json";
    $.ajax({
        url: url,
        type: action,
        data: $form.serializeObject(),
        dataType: 'json',
        crossDomain: true,
        error: function(x, e) {
            var msg = "HTTP " + x.status + " error: " + x.responseText;
            $results.html(msg);
            prettyPrint(); 
        },
        success: function(result) {
            var txt = JSON.stringify(result, null, 2);
            $results.html(txt);
            prettyPrint(); 
        }
    });
}

function postData() {
    var url = $('#url-post').val();
    updateData('POST', url, $('#post-code'), $("#post-code-results"));
}

function putData() {
    var url = $('#url-put').val();
    updateData('PUT', url, $('#put-code'), $("#put-code-results"));
}
