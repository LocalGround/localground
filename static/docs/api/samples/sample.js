var username = null;
var password = null;
var url = null;

function beforeSend(xhr){
    xhr.setRequestHeader("Authorization",
        "Basic " + btoa(username + ":" + password));
}

function setCredentials() {
    username = $("#username").val();
    password = $("#password").val();
    $.ajaxSetup({
        beforeSend: function(xhr){
            xhr.setRequestHeader("Authorization",
                "Basic " + btoa(username + ":" + password));
        }
    });
    setURLs();
}
function setURLs() {
    url = "http://" + document.domain + "/api/0/photos/";
    $('.url').val(url);
    if (username && username.length > 0) {
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            async: false,
            crossDomain: true,
            success: function(result) {
                if(result.results.length > 0) {
                    $('.detail').val(url + result.results[0].id + "/");
                    generateForm('POST', $('#url-post').val(), $('#post-code'));
                    generateUpdateForm('PUT', $('#url-put').val(), $('#put-code'));
                    generateUpdateForm('PUT', $('#url-patch').val(), $('#patch-code'));
                }
            }
        });    
    }
}

function init(){
    setCredentials();
    $('#options-code').html(getOptions.toString());
    $('#list-code').html(getList.toString());
    $('#delete-code').html(deleteData.toString());
    prettyPrint();
}

function initWidgets() {
    //Bootstrap Tabs
    $('#put-tabs a, #patch-tabs a').click(function (e) {
        e.preventDefault()
        $(this).tab('show')
    });
    $('#put-tabs a').on('shown.bs.tab', function (e) {
        renderFormJSON($("#put-code"), $("#put-code-json"));
    });
    $('#patch-tabs a').on('shown.bs.tab', function (e) {
        renderFormJSON($("#patch-code"), $("#patch-code-json"));
    });
    $('#put-tabs a:first, , #patch-tabs a:first').tab('show');
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

function patchData() {
    var url = $('#url-patch').val();
    updateData('PATCH', url, $('#patch-code'), $("#patch-code-results"));
}

function deleteData(url){
    url = url + "/.json";
    var $results = $('#delete-code-results');
    $.ajax({
        url: url,
        type: 'DELETE',
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
            //go and get a new resource to mess with...
            setURLs();
        }
    });  
}
