define(["collections/base"],
    function (Base) {
        'use strict';
        describe("Base Collection: Tests that Base Layers collection can be created, manipulated", function () {
            it("Can add model instances as objects and arrays", function () {
                var base = new Base();
                expect(base.length).toBe(0);

                base.add({ name: 'my first model', id: 1, project_id: 1 });
                expect(base.length).toBe(1);

                base.add([
                    { name: 'my second model', id: 2, project_id: 2 },
                    { name: 'my third model', id: 3, project_id: 3 }
                ]);
                expect(base.length).toBe(3);
            });
        });

        describe("Base Collection: Test filtering", function () {
            it("Testing applyFilter and clearFilter", function () {
                var base = new Base();
                base.add([
                    { name: 'my first model', id: 1, project_id: 1 },
                    { name: 'my second model', id: 2, project_id: 2 },
                    { name: 'my third model', id: 3, project_id: 3 }
                ]);
                expect(base.length).toBe(3);
                base.applyFilter('project_id = 1');
                expect(base.getVisibleModels().length).toBe(1);
                base.clearFilter();
                expect(base.getVisibleModels().length).toBe(3);
            });
        });
    });
