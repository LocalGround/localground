define([], function () {
    "use strict";

    var TruthStatement = function (statement, conjunction) {
            this.key = null;
            this.val = null;
            this.operator = "and";
            this.conjunction = null;
            this.parseStatement = function (statement, conjunction) {
                var tokens = statement.split(/(=|>|<|>=|<=|<>|in|like)/);
                this.key = tokens[0].trim();
                this.operator = tokens[1].trim();
                this.val = tokens[2].trim();
                this.conjunction = conjunction;
                this.javascriptify();
            };

            this._trimCharacter = function (val, character) {
                if (val[0] == character) {
                    val = val.substring(1);
                }
                if (val[val.length - 1] == character) {
                    val = val.substring(0, val.length - 1);
                }
                return val;
            };

            this.trimSingleQuotes = function (val) {
                return this._trimCharacter(val, "'");
            };
            this.trimPercentages = function (val) {
                return this._trimCharacter(val, "%");
            };
            this.trimParentheses = function (val) {
                val = this._trimCharacter(val, ")");
                return this._trimCharacter(val, "(");
            };

            this.javascriptify = function () {
                var i = 0,
                    endsWith = false,
                    startsWith = false;
                if (this.operator == 'in') {
                    this.val = this.trimParentheses(this.val);
                    this.val = this.val.split(',');
                    for (i = 0; i < this.val.length; i++) {
                        this.val[i] = this.trimSingleQuotes(this.val[i].trim());
                    }
                    console.log(this.val);
                } else if (this.operator == 'like') {
                    this.val = this.trimSingleQuotes(this.val);
                    startsWith = this.val[this.val.length - 1] == '%';
                    endsWith = this.val[0] == '%';
                    this.val = this.trimPercentages(this.val);
                    if (endsWith && startsWith) {
                        this.operator = 'contains';
                    } else if (startsWith) {
                        this.operator = 'startsWith';
                    } else {
                        this.operator = 'endsWith';
                    }
                } else {
                    this.val = this.trimSingleQuotes(this.val);
                }
            };

            this.parseStatement(statement, conjunction);
        },
        SqlParser = function (sqlString) {
            var i = 0;
            this.statements = [];
            this.sql = null;
            this.init = function (sqlString) {
                this.sql = sqlString.toLowerCase().replace("where", "");
                var raw = this.sql.split(/(\s+and\s+|\s+or\s+)/);
                raw.unshift("and");
                for (i = 0; i < raw.length; i += 2) {
                    raw[i] = raw[i].trim();
                    this.statements.push(new TruthStatement(raw[i + 1], raw[i]));
                }
            };

            this.check = function (model, truthStatement) {
                var returnVal = false,
                    modelVal = model.get(truthStatement.key).toString().toLowerCase(),
                    idx = -1;
                if (truthStatement.operator == '=') {
                    returnVal = modelVal == truthStatement.val;
                } else if (truthStatement.operator == '>') {
                    returnVal = modelVal > truthStatement.val;
                } else if (truthStatement.operator == '>=') {
                    returnVal = modelVal >= truthStatement.val;
                } else if (truthStatement.operator == '<') {
                    returnVal = modelVal < truthStatement.val;
                } else if (truthStatement.operator == '<=') {
                    returnVal = modelVal <= truthStatement.val;
                } else if (truthStatement.operator == '<>') {
                    returnVal = modelVal != truthStatement.val;
                } else if (truthStatement.operator == 'in') {
                    returnVal = truthStatement.val.indexOf(modelVal) != -1;
                } else if (truthStatement.operator == 'contains') {
                    returnVal = modelVal.indexOf(truthStatement.val) != -1;
                } else if (truthStatement.operator == 'startsWith') {
                    returnVal = modelVal.indexOf(truthStatement.val) == 0;
                } else if (truthStatement.operator == 'endsWith') {
                    idx = modelVal.length - truthStatement.val.length;
                    returnVal =  modelVal.indexOf(truthStatement.val, idx) !== -1;
                }
                return returnVal;
            };

            this.checkModel = function (model) {
                var i = 0,
                    truthVal = true,
                    s;
                for (i = 0; i < this.statements.length; i++) {
                    s = this.statements[i];
                    if (s.conjunction == 'and') {
                        truthVal = truthVal && this.check(model, s);
                    } else {
                        truthVal = truthVal || this.check(model, s);
                    }
                }
                return truthVal;
            };
            this.init(sqlString);
        };
    return SqlParser;
});