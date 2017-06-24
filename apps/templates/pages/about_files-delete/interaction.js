window.onload=function() {
	// Get the modal
	var btn = document.getElementsByClassName("click-to-open");
	var span = document.getElementsByClassName("close");
	var modal = document.getElementsByClassName("modal");


	for (var i = 0; i < btn.length; i++) {
        var thisBtn = btn[i];
        thisBtn.addEventListener("click", function(){
            var modal = document.getElementById(this.dataset.modal);
            modal.style.display = "block";
        }, false);
	}

	// When the user clicks on <span> (x), close the modal
	for (i = 0; i < span.length; i++) {
		span[i].onclick = function() {
			for (var i = 0; i < modal.length; i++) {
		    	modal[i].style.display = "none";
		    }
		}
	}
		// When the user clicks anywhere outside of the modal, close it
		window.onclick = function(event) {
		    if (event.target == modal) {
		        modal.style.display = "none";
		    }
		}
    }

    function openTab(evt, tabname, tabnames, tabcontent, parentTrue, displayType) {
        // Declare all variables
        var i, tablinks;

        // Get all elements with class="tabcontent" and hide them
        tabcontent = document.getElementsByClassName(tabcontent);
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        // Get all elements with class="tablinks" and remove the class "active"
        tablinks = document.getElementsByClassName(tabnames);

        if (parentTrue){ 
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].parentElement.className = tablinks[i].parentElement.className.replace(" active", "");
            }
            evt.currentTarget.parentElement.className += " active";
        }else{
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }
            evt.currentTarget.className += " active";
        }
        // Show the current tab, and add an "active" class to the link that opened the tab
        document.getElementById(tabname).style.display = displayType;
    }


function toggleVisibility(id1, id2 ) {
    var e = document.getElementById(id1);
    var f = document.getElementById(id2);
    if (e.style.display == 'block' || e.style.display=='')
    {
        e.style.display = 'none';
        f.style.display = 'block';

    }
    else 
    {
        e.style.display = 'block';
        f.style.display = 'none';
    }
}


function toggleText(button, buttonText1, buttonText2){
    if (button.innerHTML == buttonText2){
        button.innerHTML = buttonText1;
    }else{
        button.innerHTML = buttonText2;
    };
}

function addClass(obj, classToAdd){
    obj.className += classToAdd;
}

function replaceClass(obj, classToReplace){
    obj.className = classToReplace;
}

function hide(id1){
    var e = document.getElementById(id1); 
    e.style.display = 'none'; 
}

function show(id1){
    var e = document.getElementById(id1); 
    e.style.display = 'block'; 
}


function toggleOpacity(id1, value1, value2){
     var e = document.getElementById(id1); 

     if (e.style.opacity == value1 || e.style.opacity=='') {
        e.style.opacity = value2;
     }else{
        e.style.opacity = value1;
     };
}


function addSite(id1, id2, id3, button){
	//get the ids of the the 3 divs that make up the left panel.
    var e = document.getElementById(id1);
    var f = document.getElementById(id2);
    var g = document.getElementById(id3);
    var h = document.getElementById(button);

    e.style.display = 'block';
    f.style.display = 'none';
    g.style.display = 'none';
    h.style.display = 'none';
}

function acceptLocation(id1, id2, button, rightMarker){
	//get the ids of the the 3 divs that make up the left panel.
    var e = document.getElementById(id1);
    var f = document.getElementById(id2);
    var g = document.getElementById(button);


    e.style.display = 'block';
    f.style.display = 'none';
    g.style.display = 'block';
    g.innerHTML = 'Preview';


}

function uploadMedia(muffinClass){

    var muffins = document.getElementsByClassName(muffinClass);
    var uploadSpot = document.getElementById("left-panel-upload");
    var uploadButton = document.getElementById("upload-media-button");

    for (i = 0; i < muffins.length; i++) {
        muffins[i].style.display = 'inline-block';
    }

    uploadSpot.style.display = 'inline-block';
    uploadSpot.style.width = '100px';
    uploadSpot.style.padding = '4px';
    uploadSpot.style.height = '100px';
    uploadSpot.style.margin = '20px 20px 20px 10px';
    uploadButton.style.fontSize = "2em";
    uploadButton.style.padding = "16px 0 0";
}

function openPlacePane(id1){

    var e = document.getElementById(id1);	

    e.style.flex = 'none'; 
}


function show(child){
    var e = document.getElementById(child);
     e.style.display = 'block';   
}

function addNewRule(child1, child2, child3){
    var e = document.getElementById(child1);
    var f = document.getElementById(child2);
    var g = document.getElementById(child3);
    if 	(e.style.display == 'block'){
    	f.style.display = 'block';
    	g.style.display = 'block';
    }else{
    	e.style.display = 'block';
    }
     
}

function layerSwitch(id1, id2) {
    
    var layers = document.getElementById(id1);
    var defaultPinEdit = document.getElementById(id2);	


    if (layers.style.display == 'block' || layers.style.display=='')
    {
        layers.style.display = 'none';
        defaultPinEdit.style.display = '';

    }
    else 
    {
        layers.style.display = '';
        defaultPinEdit.style.display = 'none';
    }
}

function clearMarkers(markerSet){
    setMapOnAll(null, markerSet);
}

function setMapOnAll(map, markerSet) {
    for (var i = 0; i < markerSet.length; i++) {
      markerSet[i].setMap(map);
    }
}

function changeText(id, replacement){
     var ddl = document.getElementById(id);  
    ddl.innerHTML = replacement;
}

function hideMarkers(markerSet){
    for (var i = 0; i < markerSet.length; i++) {
      markerSet[i].setVisible(false);
    }    
}


function showMarkers(markerSet){
    for (var i = 0; i < markerSet.length; i++) {
      markerSet[i].setVisible(true);
    }    
}



function addPin(){
    var location = [37.865141, -122.311384, "Callope", "#84d9f1"];
    var categVisMarker = new google.maps.Marker({
        position: new google.maps.LatLng(location[0], location[1]),
        map: map,
     });
     categVisMarker.setMap(map);  
}

function clearSelectedPins(){
    muralTag = document.getElementById('mural-title');       
    replaceClass(muralTag, '');
    sculptureTag = document.getElementById('sculpture-title');       
    replaceClass(sculptureTag, '');
}


function newPin(artType, dataType){

    console.log( artType);
    console.log( dataType);

     var ddl = document.getElementById(artType);
     var selectedArtType = ddl.options[ddl.selectedIndex].value;

     var ddl = document.getElementById(dataType);
     var selectedDataType = ddl.options[ddl.selectedIndex].value;

     var muralLocation;
     var color;


     if (selectedArtType == 'Mural' && (selectedDataType == 'continuous-variable' || selectedDataType == 'continuous-variable-second')){
        //This means that mural is selected for filter
        hideMarkers(muralsBasic);
        hide('basic-mural-legend');
        show('Mural');
        muralTag = document.getElementById('mural-title');
        addClass(muralTag, ' selected');
        sculptureTag = document.getElementById('sculpture-title');
        replaceClass(sculptureTag, '');

       

        muralLocation = [[37.870722,-122.278611, "Night", "rgb(31, 89, 153)", 'M-2,0a2,2 0 1,0 4,0a2,2 0 1,0 -4,0'], 
            [37.870194, -122.284556, "hills", "rgb(31, 89, 153)", 'M-2,0a2,2 0 1,0 4,0a2,2 0 1,0 -4,0'],
            [37.867414, -122.29488, "REALM", "rgb(31, 89, 153)", 'M-2,0a2,2 0 1,0 4,0a2,2 0 1,0 -4,0'],
            [37.867825, -122.291947, "Vivir Sin Fronteras", "rgb(31, 89, 153)", 'M-2,0a2,2 0 1,0 4,0a2,2 0 1,0 -4,0'],
            [37.85505, -122.282984, "unique and everyday kids", "rgb(31, 89, 153)", 'M-2,0a2,2 0 1,0 4,0a2,2 0 1,0 -4,0'],
            [37.854362, -122.271281, "Ashby", "rgb(34, 114, 180)", 'M-2,0a2,2 0 1,0 4,0a2,2 0 1,0 -4,0'],
            [37.853991, -122.273718, "Malcolm X", "rgb(31, 89, 153)", 'M-2,0a2,2 0 1,0 4,0a2,2 0 1,0 -4,0'], 
            [37.852783, -122.266013, "La Pena", "rgb(31, 89, 153)", 'M-2,0a2,2 0 1,0 4,0a2,2 0 1,0 -4,0']]; 

        for (i = 0; i < muralLocation.length; i++) {
            muralsColor[i] = new google.maps.Marker({
                position: new google.maps.LatLng(muralLocation[i][0], muralLocation[i][1]),
                map: map,
                icon: {
                    path: muralLocation[i][4],
                    scale: 5,
                    fillColor: muralLocation[i][3],
                    fillOpacity:1,
                    strokeColor: muralLocation[i][3],
                    strokeWeight: 7
                },
            });
        } 
     }else if (selectedArtType == 'Sculpture' && (selectedDataType == 'continuous-variable' || selectedDataType == 'continuous-variable-second')){
        hideMarkers(sculpturesBasic);
        hide('basic-sculpture-legend');
        show('Sculpture')
        sculptureTag = document.getElementById('sculpture-title');
        addClass(sculptureTag, ' selected');
        muralTag = document.getElementById('mural-title');       
        replaceClass(muralTag, '');

        console.log(selectedArtType)
        console.log('HIIIIIII')

        muralLocation = [[37.866799, -122.304215, "Berkeley big people", "rgb(31, 89, 153)", 'M -2,-2 2,2 M 2,-2 -2,2'], 
            [37.865141, -122.311384, "Callope", "#84d9f1", 'M -2,-2 2,2 M 2,-2 -2,2'], 
            [37.862808, -122.317534, "Guardian", "rgb(34, 114, 180)", 'M -2,-2 2,2 M 2,-2 -2,2'], 
            [37.856271, -122.271123, "Fired Clay", "#84d9f1", 'M -2,-2 2,2 M 2,-2 -2,2'], 
            [37.856446, -122.254319, "Bookshelves", "rgb(31, 89, 153)", 'M -2,-2 2,2 M 2,-2 -2,2'],
            [37.860647, -122.256426, "Willard Bench", "#84d9f1", 'M -2,-2 2,2 M 2,-2 -2,2']]; 

        for (i = 0; i < muralLocation.length; i++) {
            sculptureColor[i] = new google.maps.Marker({
                position: new google.maps.LatLng(muralLocation[i][0], muralLocation[i][1]),
                map: map,
                icon: {
                    path: muralLocation[i][4],
                    scale: 5,
                    fillColor: muralLocation[i][3],
                    fillOpacity:1,
                    strokeColor: muralLocation[i][3],
                    strokeWeight: 7
                },
            });
        } 

     }else if (selectedArtType == 'Sculpture' && (selectedDataType == 'no-variable' || selectedDataType == 'no-variable-second')){
        show('basic-sculpture-legend');
        hide('untitled-layer');
        hideMarkers(markers);

        console.log('sculpturezzzzzzz')
        muralLocation = [
            [37.866799, -122.304215, 'big-people-feature'],
            [37.865141, -122.311384, 'callope-feature'],
            [37.862808, -122.317534, 'guardian-feature'],
            [37.856271, -122.271123, 'clay-sculpture-feature'],
            [37.856446, -122.254319, 'bookshelves-feature'],
            [37.860647, -122.256426, 'bench']];  
        for (i = 0; i < muralLocation.length; i++) {
            sculpturesBasic[i] = new google.maps.Marker({
                position: new google.maps.LatLng(muralLocation[i][0], muralLocation[i][1]),
                map: map,
                icon: {
                  path: 'M-2,0a2,2 0 1,0 4,0a2,2 0 1,0 -4,0',
                  scale: 5,
                  fillColor: '#ed867d',
                  fillOpacity:1,
                  strokeColor: '#f6f6f6',
                    strokeWeight: 2
                },
            });
        } 
    }else if (selectedArtType == 'Mural' && (selectedDataType == 'no-variable' ||selectedDataType == 'no-variable-second')){
        show('basic-mural-legend');
        hide('untitled-layer');
        hideMarkers(markers);
        muralLocation = [
            [37.870722,-122.278611, 'night-feature'], 
            [37.870194, -122.284556, 'hills-feature'],
            [37.867414, -122.29488, 'realm-feature'],
            [37.867825, -122.291947, 'sin-fronteras-feature'],
            [37.85505, -122.282984, 'everyday-feature'],
            [37.854362, -122.271281, 'ashby-feature'],
            [37.853991, -122.273718, 'malcolm-x-feature'],
            [37.852783, -122.266013, 'la-pena-feature']];
        for (i = 0; i < muralLocation.length; i++) {
            muralsBasic[i] = new google.maps.Marker({
                position: new google.maps.LatLng(muralLocation[i][0], muralLocation[i][1]),
                map: map,
                icon: {
                  path: 'M-2,0a2,2 0 1,0 4,0a2,2 0 1,0 -4,0',
                  scale: 5,
                  fillColor: '#ed867d',
                  fillOpacity:1,
                  strokeColor: '#f6f6f6',
                    strokeWeight: 2
                },
            });
        } 
    }
}




function highlight(highlightClass){
    var highlightitems = document.getElementsByClassName(highlightClass);

    for (i = 0; i < highlightitems.length; i++) {
        highlightitems[i].style.color = 'white';
        highlightitems[i].style.background = '#4285f4';
    }
}


function addNewLayer(id1){
	 var ddl = document.getElementById(id1);
	 var selectedValue = ddl.options[ddl.selectedIndex].value;

	 layers = document.getElementById(selectedValue);
	 layers.style.display = 'block';
}


function switchByClass(classes, id1) {
    
    classItems = [];

    for (i = 0; i < classes.length; i++) {
        classItems[i] = document.getElementsByClassName(classes[i]);
    };

     var ddl = document.getElementById(id1);
     var selectedValue = ddl.options[ddl.selectedIndex].value;

    for (i = 0; i < classes.length; i++) {
        if (classes[i] == selectedValue){
            for (j = 0; j < classItems[i].length; j++) {
                classItems[i][j].style.display = '';
            }
        }else{
            for (j = 0; j < classItems[i].length; j++) {
                classItems[i][j].style.display = 'none';
            }            
        }
    }
}


function addText(caption, obj){
    obj.value = caption;
}


function clearFeature(id){
    window.scrollTo(0, 0);
}


function changePhoto(url, obj){
    obj.src = url;
}

function changeClass(sharedClass, id){
    var dropdown = document.getElementById(id);  
    var className = dropdown.options[dropdown.selectedIndex].value;
    var targetDiv = document.querySelectorAll('.fa-circle.legend-preview');
    if (targetDiv.length > 0){
        for (i = 0; i < targetDiv.length; i++) {
            targetDiv[i].className = " fa-times";
            targetDiv[i].className += " fa";
            targetDiv[i].className += " marker-icon";
            targetDiv[i].className += " legend-preview";
        }        
    }else{
        var targetDiv = document.querySelectorAll('.fa-times.legend-preview');
        for (i = 0; i < targetDiv.length; i++) {
            targetDiv[i].className = " fa-circle";
            targetDiv[i].className += " fa";
            targetDiv[i].className += " marker-icon";
            targetDiv[i].className += " legend-preview";
        }
    }


}


function selectListItem(obj){
    obj.parentElement.style.background = '#7B9BE1';
    obj.style.color = '#fff';
    obj.childNodes[1].style.color = "#fff";
}




