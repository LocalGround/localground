define(["collections/photos"], function (Photos){
  'use strict';
    describe("Photos Collection: Test Set Server Query and Clear Server Query", function () {
        it("Testing setServerQuery and clearServerQuery", function () {
            var photos = new Photos();
            photos.add([
                { name: 'my first model', id: 1, project_id: 1 },
                { name: 'my second model', id: 2, project_id: 2 },
                { name: 'my third model', id: 3, project_id: 3 }
            ]);
            expect(photos.length).toBe(3);

            var query = "WHERE id = 1";
            photos.setServerQuery(query);
            expect(photos.query).toBe(query);

            photos.clearServerQuery();
            expect(photos.query).toBe(null);
        });
    });
    describe("Photos Collection: Check if pagination is implemented.", function () {
        it("Testing if inherits from PageableCollection", function () {
            var photos = new Photos();
            expect(photos.state).toBeDefined();
            expect(photos.queryParams).toBeDefined();
            expect(photos.parseState).toBeDefined();
            expect(photos.parseRecords).toBeDefined();
        });
    });

});
