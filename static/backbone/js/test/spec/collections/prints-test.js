define(["collections/prints"], function (Prints){
  'use strict';
  describe("Prints Collection: Test Set Server Query and Clear Server Query", function () {
      it("Testing setServerQuery and clearServerQuery", function () {
          var prints = new Prints();
          prints.add([
              { map_title: 'my first model', id: 1, project_id: 1 },
              { map_title: 'my second model', id: 2, project_id: 2 },
              { map_title: 'my third model', id: 3, project_id: 3 }
          ]);
          expect(prints.length).toBe(3);

          var query = "WHERE id = 1";
          prints.setServerQuery(query);
          expect(prints.query).toBe(query);

          prints.clearServerQuery();
          expect(prints.query).toBe(null);
      });
  });
  describe("Prints Collection: Check if pagination is implemented.", function () {
          it("Testing if inherits from PageableCollection", function () {
              var prints = new Prints();
              expect(prints.state).toBeDefined();
              expect(prints.queryParams).toBeDefined();
              expect(prints.parseState).toBeDefined();
              expect(prints.parseRecords).toBeDefined();
          });
      });

  });
