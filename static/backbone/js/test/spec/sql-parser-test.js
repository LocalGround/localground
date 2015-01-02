define(["lib/sqlParser"], function (SQLParser) {
    describe("SQL parser test", function () {
        var sqlParser;
        beforeEach(function () {
            console.log('before each');
            sqlParser = new SQLParser("name = photo");
        });
        it("should be true", function () {
            //player.play(song);
            //expect(player.currentlyPlayingSong).toEqual(song);
        
            //demonstrates use of custom matcher
            expect(1).toBeTruthy();
        });
    
    });
});
