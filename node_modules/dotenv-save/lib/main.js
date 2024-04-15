'use strict';

var fs = require('fs');

module.exports = {
    options: function(options) {
        var opts = options || {};

        if(!opts.path) {
            opts.path = '.env';
        }

        if(!opts.encoding) {
            opts.encoding = 'utf8';
        }

        if(typeof opts.silent == 'undefined') {
            opts.silent = false;
        }

        return opts;
    },

    set: function(key, value, opts) {
        var options = this.options(opts);
        var parsedObj = this._load(options);
        if(parsedObj) {
            parsedObj[key] = {
                value: value,
                original: value
            };

            fs.writeFileSync(options.path, Object.keys(parsedObj).map(function(objKey) {
                return objKey + '=' + parsedObj[objKey].original;
            }).join('\n'), {encoding: options.encoding});
            return true;
        }

        return false;
    },

    _load: function(options) {
        try {
            // specifying an encoding returns a string instead of a buffer
            return this.parse(fs.readFileSync(options.path, { encoding: options.encoding }));
        }
        catch(e) {
            if(!options.silent) {
                console.error(e);
            }

            return null;
        }
    },

    config: function(options) {
        return this.load(options);
    },

    /*
    * Main entry point into dotenv. Allows configuration before loading .env and .env.$NODE_ENV
    * @param {Object} options - valid options: path ('.env'), encoding ('utf8')
    * @returns {Boolean}
    */
    load: function (opts) {
        var options = this.options(opts);
        var parsedObj = this._load(options);

        if(parsedObj) {
            Object.keys(parsedObj).forEach(function (key) {
                process.env[key] = process.env[key] || parsedObj[key].value;
            });

            return true;
        }

        return false;
    },

    /*
    * Parses a string or buffer into an object
    * @param {String|Buffer} src - source to be parsed
    * @returns {Object}
    */
    parse: function (src) {
        var obj = {};

        // convert Buffers before splitting into lines and processing
        src.toString().split('\n').forEach(function (line) {
            // matching "KEY' and 'VAL' in 'KEY=VAL'
            var keyValueArr = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/);

            // matched?
            if(keyValueArr !== null) {
                var key = keyValueArr[1];

                // default undefined or missing values to empty string
                var value = keyValueArr[2] ? keyValueArr[2] : '';

                // expand newlines in quoted values
                var len = value ? value.length : 0;
                if(len > 0 && value.charAt(0) === '\"' && value.charAt(len - 1) === '\"') {
                    value = value.replace(/\\n/gm, '\n');
                }

                // remove any surrounding quotes and extra spaces
                value = value.replace(/(^['"]|['"]$)/g, '').trim();

                // is this value a variable?
                if(value.charAt(0) === '$') {
                    var possibleVar = value.substring(1);
                    value = obj[possibleVar] ? obj[possibleVar].value : process.env[possibleVar] || '';
                }

                // varaible can be escaped with a \$
                if(value.substring(0, 2) === '\\$') {
                    value = value.substring(1);
                }

                obj[key] = {
                    value: value,
                    original: keyValueArr[2] || ''
                };
            }
        });

        return obj;
    }
};
