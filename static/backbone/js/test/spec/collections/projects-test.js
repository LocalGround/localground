define(["collections/projects"], function (Projects){
  'use strict';
  describe("Projects Collection: Test Set Server Query and Clear Server Query", function () {
      it("Testing setServerQuery and clearServerQuery", function () {
          var projects = new Projects();
          projects.add([
              { name: 'my first model', id: 1 },
              { name: 'my second model', id: 2 },
              { name: 'my third model', id: 3 }
          ]);
          expect(projects.length).toBe(3);

          var query = "WHERE id = 1";
          projects.setServerQuery(query);
          expect(projects.query).toBe(query);

          projects.clearServerQuery();
          expect(projects.query).toBe(null);
      });
  });
  describe("Projects Collection: Check if pagination is implemented.", function () {
      it("Testing if inherits from PageableCollection", function () {
          var projects = new Projects();
          expect(projects.state).toBeDefined();
          expect(projects.queryParams).toBeDefined();
          expect(projects.parseState).toBeDefined();
          expect(projects.parseRecords).toBeDefined();
      });
  });

});
