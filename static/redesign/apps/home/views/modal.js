
/*
  This file serves as prototype to test out code,
  but the problem was that it is placed inside index
  instead of project list template

  as of now, I do not know how to import
  javascript files inside templates.

  so for rapid-prototype purposes, all the code is copied and pasted
  to main.js under the function showModal
*/

// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("add-project");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
