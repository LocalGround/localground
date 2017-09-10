/* ============================================================
 * bootstrap-dropdown.js v1.3.0
 * http://twitter.github.com/bootstrap/javascript.html#dropdown
 * ============================================================
 * Copyright 2011 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


(function( $ ){

  var d = 'a.menu, .dropdown-toggle'

  function clearMenus() {
    //alert($(this).get(0));
    //alert('clearing');
    $(d).parent('li').removeClass('open')
  }

  $(function () {
    $('body').dropdown( '[data-dropdown] a.menu, [data-dropdown] .dropdown-toggle' )
    $('body').bind("click", clearMenus)
  })

  /* MODIFIED DROPDOWN PLUGIN DEFINITION
   * ========================== */
  
  $.fn.dropdown = function ( selector ) {
    
    return this.each(function () {
      $(this).delegate(selector || d, 'click', function (e) {
        e.stopImmediatePropagation()
        var $li = $(this).parent('li');
        $.each($(this).parent('li').siblings(), function() {
          $(this).removeClass('open')  
        });
        $li.toggleClass('open');
        return false
      })
    });
    //return false;
  }

})( window.jQuery || window.ender )