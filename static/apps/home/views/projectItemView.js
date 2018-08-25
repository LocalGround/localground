define(["marionette",
        "underscore",
        "jquery",
        "handlebars",
        "text!../templates/project-item.html"],
    function (Marionette, _, $, Handlebars, ItemTemplate) {
        'use strict';

        var ProjectItemView = Marionette.ItemView.extend({
            timeStamp: null,
            dateCreated: null,
            currentDate: null,
            lastEditedString: null,
            initialize: function (opts) {
                _.extend(this, opts);
                Marionette.ItemView.prototype.initialize.call(this);
                this.currentDate = new Date();
                this.timeStamp = new Date(this.model.get("time_stamp") + "Z");
                this.dateCreated = new Date(this.model.get("date_created") + "Z");
                this.lastEditedString = this.lastEdited();
            },

            template: Handlebars.compile(ItemTemplate),
            events: {
                'click .action': 'shareModal'
            },

            className: "project-card",

            modelEvents: {
                // When data from Item view changes anywhere and anytime,
                // re-render to update
                "change": "render"
            },

            shareModal: function (e) {
                //tell the home-app to show the share-project modal:
                this.app.vent.trigger('share-project', { model: this.model });
                if (e) {
                    e.preventDefault();
                }
            },

            templateHelpers: function () {
                return {
                    projectUsers: this.model.projectUsers.toJSON(),
                    timeAgo: this.lastEditedString

                };
            },

            deleteProjectView: function () {
                if (!confirm("Are you sure you want to delete this project?")) {
                    return;
                }
                this.model.destroy();

            },
            /*
              Find out how liong since a project was last edited
            */
            lastEdited: function(){
                var lastEditString = "";
                var addPlural = "";
                //
                var timeStampYear = this.timeStamp.getFullYear();
                var timeStampMonth = this.timeStamp.getMonth();
                var timeStampDay = this.timeStamp.getDate();

                var currentYear = this.currentDate.getFullYear();
                var currentMonth = this.currentDate.getMonth();
                var currentDay = this.currentDate.getDate();

                // Intent to give positive difference
                // to ensure no negative values come up
                var diffYears = currentYear - timeStampYear;
                var diffMonths = currentMonth - timeStampMonth;
                var diffDays = currentDay - timeStampDay;

                if (diffMonths < 0){
                    diffMonths += 12;
                    diffYears --;
                }

                if (diffDays < 0){
                    diffDays += this.daysPerMonth(this.currentDate);
                    diffMonths --;
                }

                if (diffYears > 0 && !(diffMonths < 0)){
                    addPlural = diffYears > 1 ? "s" : "";
                    lastEditString = diffYears + " Year" + addPlural + " ago";
                }
                else if (diffMonths > 0 && !(diffDays < 0)){
                    addPlural = diffMonths > 1 ? "s" : "";
                    lastEditString = diffMonths + " Month" + addPlural + " ago";
                }
                else if (diffDays > 0){
                    addPlural = diffDays > 1 ? "s" : "";
                    lastEditString = diffDays + " Day" + addPlural + " ago";
                }
                else {
                    lastEditString = "Today";
                }
                return lastEditString;
            },

            daysPerYear: function(date){
                var numDaysPerYear = 365
                if (date.getFullYear() % 4 == 0){
                    numDaysPerYear + 1;
                }
                return numDaysPerYear;
            },
            /*
              Guide to days per month in zero-index order (0-11)
              28 / 29 days -> 1
              30 days -> 3, 5, 8, 10
              31 days -> 0, 2, 4, 6, 7, 9, 11
            */
            daysPerMonth: function(date){
                var month = date.getMonth();
                var days_per_month = 0;

                if (month == 1){
                    if (this.daysPerYear(date) == 366){
                        days_per_month = 29;
                    } else {
                        days_per_month = 28;
                    }
                } else if (month == 3 ||
                    month == 5 ||
                    month == 8 ||
                    month == 10){
                    days_per_month = 30;
                } else {
                    days_per_month = 31;
                }
                return days_per_month;

            },


            /*
              Functions exclusively used for unit testing
            */

            setTimeStamp: function(_date){
                this.timeStamp = _date;
            }

        });
        return ProjectItemView;
    });
