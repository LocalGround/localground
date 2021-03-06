var rootDir = "../../../";
define([
    "backbone",
    rootDir + "lib/shared-views/share-settings"
],
    function (Backbone, ShareSettings) {
        'use strict';
        const initTitleCardMenu = function (scope) {

            // 1) add spies for all relevant objects:
            spyOn(ShareSettings.prototype, 'initialize').and.callThrough();
            spyOn(ShareSettings.prototype, 'render').and.callThrough();

            // 2) add dummy HTML elements:
            scope.fixture = setFixtures('<div></div>');

            // 3) initialize Toolbar:
            scope.shareSettings = new ShareSettings({
                app: scope.app,
                activeMap: scope.dataManager.getMaps().at(0)
            });
            scope.shareSettings.render();
        };

        describe("ShareSettings", function () {
            beforeEach(function () {
                initTitleCardMenu(this);
            });

            it("initialize works", function() {
                expect(this.shareSettings).toEqual(jasmine.any(ShareSettings));
                expect(this.shareSettings.linkMode).toEqual('link');
            });

            it("should render view correctly", function () {
                expect(this.shareSettings.$el).toContainElement('.share-options_container');
                expect(this.shareSettings.$el).toContainElement('.link_container');
                expect(this.shareSettings.$el).not.toContainElement('.embed_container');
                expect(this.shareSettings.$el).toContainElement('.link-embed_header');
                expect(this.shareSettings.$el.find('#link-text').val()).toEqual(this.shareSettings.activeMap.get('sharing_url'));

                this.shareSettings.$el.find('.embed-button').click();
                expect(this.shareSettings.$el.find('#embed-text').val()).toEqual(
                    `<iframe src="${this.shareSettings.activeMap.get('sharing_url')}" style="width: 950px; height: 350px; margin-left: auto; margin-right: auto; display: block; border: none;"></iframe>`
                );


            });
            
            it("showLinkText() works", function() {

                // linkMode is set to 'link' and remains 'link' when you 
                // click '.link-button' on the page
                expect(this.shareSettings.linkMode).toEqual('link');
                this.shareSettings.$el.find('.link-button').click();
                expect(this.shareSettings.linkMode).toEqual('link');

                // set linkMode to 'embed'. Clicking '.link-button' changes it back to 'link'
                this.shareSettings.linkMode = 'embed';
                this.shareSettings.$el.find('.link-button').click();
                expect(this.shareSettings.linkMode).toEqual('link');

            });

            it("showEmbedText() works", function() {
                expect(this.shareSettings.linkMode).toEqual('link');
                this.shareSettings.$el.find('.embed-button').click();
                expect(this.shareSettings.linkMode).toEqual('embed');
                this.shareSettings.$el.find('.embed-button').click();
                expect(this.shareSettings.linkMode).toEqual('embed');
                this.shareSettings.$el.find('.link-button').click();
                expect(this.shareSettings.linkMode).toEqual('link');
            });

            it("saveShareSettings() works", function() {
                expect(this.shareSettings.activeMap.get('metadata').accessLevel).toEqual(2);
                this.shareSettings.$el.find('input[name=rb]:checked').val(1);
                this.shareSettings.$el.find('#password-input').val('testpassword777');

                this.shareSettings.saveShareSettings();
                expect(this.shareSettings.activeMap.get('metadata').accessLevel).toEqual(1);
                expect(this.shareSettings.activeMap.get('password')).toEqual('testpassword777');
            });

            it("togglePWVisibility() works", function() {

                expect(this.shareSettings.$el.find('#password-input').prop('type')).toEqual('password');
                expect(this.shareSettings.$el.find('.toggle-pw-visibility')).toHaveClass('fa-eye');
                expect(this.shareSettings.$el.find('.toggle-pw-visibility')).not.toHaveClass('fa-eye-slash');

                this.shareSettings.$el.find('.toggle-pw-visibility').click();

                expect(this.shareSettings.$el.find('#password-input').prop('type')).toEqual('text');
                expect(this.shareSettings.$el.find('.toggle-pw-visibility')).not.toHaveClass('fa-eye');
                expect(this.shareSettings.$el.find('.toggle-pw-visibility')).toHaveClass('fa-eye-slash');

                this.shareSettings.$el.find('.toggle-pw-visibility').click();

                expect(this.shareSettings.$el.find('#password-input').prop('type')).toEqual('password');
                expect(this.shareSettings.$el.find('.toggle-pw-visibility')).toHaveClass('fa-eye');
                expect(this.shareSettings.$el.find('.toggle-pw-visibility')).not.toHaveClass('fa-eye-slash');

            });
        });
    });
