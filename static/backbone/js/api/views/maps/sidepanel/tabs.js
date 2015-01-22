define(["marionette",
        "underscore",
        "jquery",
        "text!" + templateDir + "/sidepanel/tabs.html",
        "jquery.bootstrap"],
    function (Marionette, _, $, TabsTemplate) {
        'use strict';
        /**
         * Maintains tab state
         * @class Tabs
         */
        var Tabs = Marionette.View.extend({
            events: {
                'click a': 'remember'
            },
            id: 'v-tabs',
            tagName: 'ul',
            className: 'nav nav-tabs',
            activeTabID: null,
            template: _.template(TabsTemplate),
            initialize: function (opts) {
                this.app = opts.app;
                this.restoreState();
            },
            render: function () {
                this.$el.html(this.template());
            },
            onShow: function () {
                $('#' + this.activeTabID).tab('show');
            },
            remember: function (e) {
                this.activeTabID = $(e.target).attr("id");
                this.saveState();
            },
            saveState: function () {
                var state = { activeTabID: this.activeTabID };
                this.app.saveState(this.id, state, false);
            },
            restoreState: function () {
                var state = this.app.restoreState(this.id) || {};
                this.activeTabID = state.activeTabID || 'data-tab';
            }
        });
        return Tabs;
    });
