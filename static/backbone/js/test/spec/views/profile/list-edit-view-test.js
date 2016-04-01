define([
    "jquery",
    "views/profile/listEditView",
    "profile-app",
    "../../../../test/spec-helper"
],
    function ($, ListEditView, profileApp) {
        'use strict';

        function initApp(scope) {
            var $sandbox = $('<div id="sandbox"></div>'),
                $r1 = $('<div id="region1"></div>'),
                $r2 = $('<div id="region2"</div>'),
                $r3 = $('<div id="region3"></div>');
            $(document.body).append($sandbox);
            $sandbox.append($r1).append($r2).append($r3);
            profileApp.start(scope.profileOpts); // defined in spec-helpers:
            console.log(profileApp);
        }
        describe("ListEditView: Initializes", function () {
            beforeEach(function () {
                initApp(this);
            });

            afterEach(function () {
                $("#sandbox").remove();
            });

            it("Application initializes subviews successfully", function () {
                expect(profileApp.listEditView).not.toBeNull();
                expect(profileApp.filterView).not.toBeNull();
                expect(profileApp.mainView).not.toBeNull();
                expect(profileApp.sideBarView).not.toBeNull();
            });

        });
    });
