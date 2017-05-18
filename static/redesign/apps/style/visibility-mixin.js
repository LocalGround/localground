define([], function () {
    "use strict";
    /*
     * Since the show / hide panel functionality is the same across the views,
     * we'll use the "mixin" pattern to consolidate functionality.
     */
    return {
        events: {
            'click .hide-panel': 'hideSection',
            'click .show-panel': 'showSection'
        },
        hideSection: function (e) {
            this.isShowing = false;
            this.saveState();
            this.render();
            if (e) {
                e.preventDefault();
            }
        },
        showSection: function (e) {
            this.isShowing = true;
            this.saveState();
            this.render();
            if (e) {
                e.preventDefault();
            }
        },
        templateHelpers:  function () {
            return {
                isShowing: this.isShowing
            };
        },
        saveState: function () {
            this.app.saveState(this.stateKey, {
                isShowing: this.isShowing
            });
        },
        restoreState: function () {
            var state = this.app.restoreState(this.stateKey);
            if (state) {
                this.isShowing = state.isShowing;
            } else {
                this.isShowing = true;
            }
        }
    };
});