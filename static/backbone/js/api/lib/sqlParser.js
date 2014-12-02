define(["jquery"], function ($) {
    "use strict";

    var TruthStatement = function (statement, conjunction) {
            this.key = null;
            this.val = null;
            this.operator = "and";
            this.conjunction = null;
            this.parseStatement = function (statement, conjunction) {
                //note: order matters here. Put the <>, <=, and <> before the
                //      <, >, and = in the regex.
                var tokens = statement.split(/(>=|<=|<>|>|<|=|in|like|contains|startswith|endswith)/);
                this.key = tokens[0].trim();
                this.operator = tokens[1].trim();
                this.val = tokens[2].trim();
                this.conjunction = conjunction;
                this.compileSQLToJavascript();
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

            this.compileSQLToJavascript = function () {
                var i = 0,
                    endsWith = false,
                    startsWith = false;
                if (this.operator == 'in') {
                    this.val = this.trimParentheses(this.val);
                    this.val = this.val.split(',');
                    for (i = 0; i < this.val.length; i++) {
                        this.val[i] = this.trimSingleQuotes(this.val[i].trim());
                    }
                } else if (this.operator == 'like') {
                    this.val = this.trimSingleQuotes(this.val);
                    startsWith = this.val[this.val.length - 1] == '%';
                    endsWith = this.val[0] == '%';
                    this.val = this.trimPercentages(this.val);
                    if (endsWith && startsWith) {
                        this.operator = 'contains';
                    } else if (startsWith) {
                        this.operator = 'startswith';
                    } else {
                        this.operator = 'endswith';
                    }
                } else {
                    this.val = this.trimSingleQuotes(this.val);
                }
            };
            this.truthTest = function (model) {
                //console.log(this);
                var returnVal = false,
                    modelVal = model.get(this.key),
                    idx = -1;
                if (typeof modelVal === 'undefined' || modelVal == null) {
                    return false;
                }
                modelVal = this.convertType(modelVal);

                if (this.operator == '=') {
                    returnVal = modelVal == this.val;
                } else if (this.operator == '>') {
                    returnVal = modelVal > this.val;
                } else if (this.operator == '>=') {
                    returnVal = modelVal >= this.val;
                } else if (this.operator == '<') {
                    returnVal = modelVal < this.val;
                } else if (this.operator == '<=') {
                    returnVal = modelVal <= this.val;
                } else if (this.operator == '<>') {
                    returnVal = modelVal != this.val;
                } else if (this.operator == 'in') {
                    returnVal = this.val.indexOf(modelVal) != -1;
                } else if (this.operator == 'contains') {
                    returnVal = modelVal.indexOf(this.val) != -1;
                } else if (this.operator == 'startswith') {
                    returnVal = modelVal.indexOf(this.val) == 0;
                } else if (this.operator == 'endswith') {
                    idx = modelVal.length - this.val.length;
                    returnVal =  modelVal.indexOf(this.val, idx) !== -1;
                }
                //console.log(returnVal, modelVal, this.val, this.operator);
                return returnVal;
            };

            this.convertType = function (modelVal) {
                var i = 0,
                    isNumber = typeof modelVal == "number",
                    isString = typeof modelVal == "string",
                    converter = isNumber ? this.parseNum : this.parseString;
                if ($.isArray(this.val)) {
                    for (i = 0; i < this.val.length; i++) {
                        this.val[i] = converter(this.val[i]);
                    }
                } else {
                    this.val = converter(this.val);
                }
                if (isString) {
                    modelVal = this.parseString(modelVal);
                }
                return modelVal;
            };

            this.parseNum = function (val) {
                return parseInt(val, 10);
            };

            this.parseString = function (val) {
                return val.toString().toLowerCase();
            };

            this.parseStatement(statement, conjunction);
        },
        SqlParser = function (sqlString) {
            var i = 0;
            this.statements = [];
            this.sql = null;
            this.init = function (sqlString) {
                this.sql = sqlString.toLowerCase().replace("where", "");
                var raw = this.sql.split(/(\s+and\s+|\s+or\s+)/),
                    truthStatement = null;
                raw.unshift("and");
                for (i = 0; i < raw.length; i += 2) {
                    raw[i] = raw[i].trim();
                    try {
                        truthStatement = new TruthStatement(raw[i + 1], raw[i]);
                        this.statements.push(truthStatement);
                    } catch (e) {
                        console.log("error parsing truth statement: ", e);
                    }
                }
            };

            this.checkModel = function (model) {
                var i = 0,
                    truthVal = true,
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