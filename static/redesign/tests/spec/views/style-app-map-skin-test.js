var rootDir = "../../";
define([
    rootDir + "apps/style/views/left/skin-view",
    rootDir + "tests/spec/views/style-app-show-hide-panel"
],
    function (SkinView, Helper) {
        'use strict';
        var skinView, fixture, initView;
        initView = function (scope) {
            skinView = new SkinView({
                app: scope.app
            });
            skinView.render();
            fixture = setFixtures('<div></div>').append(skinView.$el);
        };

        describe("When MapView is initialized", function () {
            beforeEach(function () {
                initView(this);
            });
        });

        describe("Panel Show / Hide Tests", function () {
            Helper.genericChecks({ ClassType: SkinView });
        });
    });
