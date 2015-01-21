define(["lib/truthStatement"], function (TruthStatement) {
    "use strict";
    var SqlParser = function (sqlString) {
            var i = 0;
            this.statements = [];
            this.sql = null;
            this.failureFlag = 0;
            this.failureMessage = '';
            this.init = function (sqlString) {
                this.sql = sqlString.toLowerCase().replace("where", "");
                var raw = this.sql.split(/(\s+and\s+|\s+or\s+)/),
                    truthStatement = null;
                //add an "and" to the top of the stack to make processing consistent:
                raw.unshift("and");
                for (i = 0; i < raw.length; i += 2) {
                    raw[i] = raw[i].trim();
                    /*
                     * Fails silently.
                     * TODO: have UI check for failureFlag / Message and give
                     *       user feedback.
                     */
                    try {
                        truthStatement = new TruthStatement(raw[i + 1], raw[i]);
                        this.statements.push(truthStatement);
                    } catch (e) {
                        this.failureFlag = 1;
                        this.failureMessage = "error parsing truth statement: " +  e;
                    }
                }
            };

            this.checkModel = function (model) {
                var i = 0,
                    truthVal = !this.failureFlag,
                    s;
                for (i = 0; i < this.statements.length; i++) {
                    s = this.statements[i];
                    if (s.conjunction == 'and') {
                        truthVal = truthVal && s.truthTest(model);
                    } else {
                        truthVal = truthVal || s.truthTest(model);
                    }
                }
                return truthVal;
            };
            this.init(sqlString);
        };
    return SqlParser;
});