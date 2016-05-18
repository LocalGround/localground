define(["collections/audio"], function (Audio){
  'use strict';
  describe("Audio Collection: Test Set Server Query and Clear Server Query", function () {
      it("Testing setServerQuery and clearServerQuery", function () {
          var audio = new Audio();
          audio.add([
              { name: 'my first model', id: 1, project_id: 1 },
              { name: 'my second model', id: 2, project_id: 2 },
              { name: 'my third model', id: 3, project_id: 3 }
          ]);
          expect(audio.length).toBe(3);

          var query = "WHERE id = 1";
          audio.setServerQuery(query);
          expect(audio.query).toBe(query);

          audio.clearServerQuery();
          expect(audio.query).toBe(null);
      });
  });

  describe("Audio Collection: Check if pagination is implemented.", function () {
      it("Testing if inherits from PageableCollection", function () {
          var audio = new Audio();
          expect(audio.state).toBeDefined();
          expect(audio.queryParams).toBeDefined();
          expect(audio.parseState).toBeDefined();
          expect(audio.parseRecords).toBeDefined();
      });
  });

});
