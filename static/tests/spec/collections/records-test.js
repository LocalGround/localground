var rootDir = "../../";
define([
    rootDir + "models/record",
    rootDir + "collections/records"
],
    function (Record, Records) {
        'use strict';
        const initSpies = function (scope) {
            spyOn(Records.prototype, 'initialize').and.callThrough();
            spyOn(Records.prototype, 'getDependentLayers').and.callThrough();
            scope.opts = {
                fields: scope.dataset_3.fields,
                isCustomType: true,
                isSite: true,
                key: scope.dataset_3.dataType,
                url: scope.dataset_3.url,
                projectID: scope.dataManager.getProject().id
            }
        };

        describe("RecordsCollection initialization:", function () {
            beforeEach(function () {
                initSpies(this);
            });

            it('initialize() works', function () {
                expect(Records.prototype.initialize).toHaveBeenCalledTimes(0);
                const records = new Records(null, this.opts);
                expect(Records.prototype.initialize).toHaveBeenCalledTimes(1);
            });

        });

    });
