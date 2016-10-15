define(["jquery"], function ($) {
    "use strict";
    var TruthStatement = function (statement, conjunction) {
        this.tokens = null;
        this.key = null;
        this.val = null;
        this.operator = null;
        this.conjunction = null;
        //note: order matters here. Put the <>, <=, !=, and <> before the
        //      <, >, and = in the regex. Also, English words need to be
        //      padded with spaces.
        this.validOperators = ['>=', '<=', '<>', '>', '<', '!=', '=', ' in ',
                ' like ', ' contains ', ' startswith ', ' endswith '
            ];
        this.validConjunctions = ['and', 'or'];

        this.parseStatement = function (statement, conjunction) {
            this.setTokens(statement);
            this.key = this.tokens[0].trim();
            this.setOperator(this.tokens[1].trim());
            this.val = this.tokens[2].trim();
            this.setConjunction(conjunction);
            this.compileSQLToJavascript();
        };

        this.setTokens = function (statement) {
            //regex that splits at *first valid operator:
            var r = new RegExp('([\\S\\s]*?)(' + this.validOperators.join('|') + ')([\\S\\s]*)'),
                tokens = statement.match(r);
            tokens.shift(); //remove top entry
            if (tokens.length != 3) {
                throw new Error("Statement should parse to three tokens");
            }
            this.tokens = tokens;
        };

        this.setOperator = function (operator) {
            operator = operator.toLowerCase().trim();
            // be sure to account for padding in the validOperator list:
            if (this.validOperators.indexOf(operator) == -1 &&
                    this.validOperators.indexOf(' ' + operator + ' ') == -1) {
                throw new Error("Operator must be one of the following: " +
                    this.validOperators.join(', '));
            }
            this.operator = operator;
        };

        this.setConjunction = function (conjunction) {
            conjunction = conjunction.toLowerCase().trim();
            if (this.validConjunctions.indexOf(conjunction) == -1) {
                throw new Error("Conjunction must be 'AND' or 'OR' (case insensitive)");
            }
            this.conjunction = conjunction;
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
            } else if (['<>', '!='].indexOf(this.operator) != -1) {
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

        this.debug = function () {
            console.log("key: ", this.key);
            console.log("operator: ", this.operator);
            console.log("value: ", this.val);
            console.log("conjunction: ", this.conjunction);
            console.log("tokens: ", this.tokens);
        };

        //initialize if user passed in arguments:
        if (statement != null && conjunction != null) {
            this.parseStatement(statement, conjunction);
        }
    };

    return TruthStatement;
});