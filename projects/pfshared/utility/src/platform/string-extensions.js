/**
 * String Extensions
 */
;(function () {
    window.String.format = function (source, params) {
        var toString = function (obj, format) {
            var ctor = function (o) {
                if (typeof o == "number")
                    return Number;
                else if (typeof o == "boolean")
                    return Boolean;
                else if (typeof o == "string")
                    return String;
                else
                    return o.constructor;
            }(obj);
            var proto = ctor.prototype;
            var formatter = typeof obj != "string" ? proto ? proto.format || proto.toString : obj.format || obj.toString : obj.toString;
            if (formatter)
                if (typeof format == "undefined" || format == "")
                    return formatter.call(obj);
                else
                    return formatter.call(obj, format);
            else
                return "";
        };
        if (arguments.length == 1)
            return function () {
                return String.format.apply(null, [source].concat(Array.prototype.slice.call(arguments, 0)));
            };
        if (arguments.length == 2 && typeof params != "object" && typeof params != "array") {
            params = [params];
        }
        if (arguments.length > 2) {
            params = Array.prototype.slice.call(arguments, 1);
        }
        source = source.replace(/\{\{|\}\}|\{([^}: ]+?)(?::([^}]*?))?\}/g,
            function (match, num, format) {
                if (match == "{{")
                    return "{";
                if (match == "}}")
                    return "}";
                if (typeof params[num] != "undefined" && params[num] !== null) {
                    return toString(params[num], format);
                } else {
                    return "";
                }
            });
        return source;
    };

    window.String.hashCode = function (value) {
        var hash = 0;
        var charCode;
        if (value.length == 0) {
            return hash;
        }
        for (var i = 0; i < value.length; i++) {
            charCode = value.charCodeAt(i);
            hash = ((hash << 5) - hash) + charCode;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    };

    window.String.isNullOrEmpty = function (value) {
        var isNullOrEmpty = true;
        if (value) {
            if (typeof (value) == "string") {
                if (value.length > 0) {
                    isNullOrEmpty = false;
                }
            }
        }
        return isNullOrEmpty;
    };

    window.String.isNullOrWhiteSpace = function (value) {
        if (window.String.isNullOrEmpty(value)) {
            return true;
        }
        return value.replace(/\s/g, "").length < 1;
    };
}());