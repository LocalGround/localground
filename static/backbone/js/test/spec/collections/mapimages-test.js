define(["collections/mapimages"], function (MapImages){
  'use strict';
  describe("Map Images Collection: Test Set Server Query and Clear Server Query", function () {
      it("Testing setServerQuery and clearServerQuery", function () {
          var mapimages = new MapImages();
          mapimages.add([
              { name: 'my first model', id: 1, project_id: 1 },
              { name: 'my second model', id: 2, project_id: 2 },
              { name: 'my third model', id: 3, project_id: 3 }
          ]);
          expect(mapimages.length).toBe(3);

          var query = "WHERE id = 1";
          mapimages.setServerQuery(query);
          expect(mapimages.query).toBe(query);

          mapimages.clearServerQuery();
          expect(mapimages.query).toBe(null);
      });
  });
  describe("Map Images Collection: Check if pagination is implemented.", function () {
      it("Testing if inherits from PageableCollection", function () {
          var mapimages = new MapImages();
          expect(mapimages.state).toBeDefined();
          expect(mapimages.queryParams).toBeDefined();
          expect(mapimages.parseState).toBeDefined();
          expect(mapimages.parseRecords).toBeDefined();
      });
  });

});
