;(function () {
    /**
     * Total scroll height/width extensions
     * http://api.jquery.com/outerHeight/
     */
    jQuery.fn.outerScrollHeight = function (includeMargin) {
        var element = this[0];
        var $element = $(element);
        var totalHeight = element.scrollHeight; // includes padding
        totalHeight += $element.outerHeight(includeMargin) - $element.innerHeight();
        return totalHeight;
    };

    jQuery.fn.outerScrollWidth = function (includeMargin) {
        var element = this[0];
        var $element = $(element);
        var totalWidth = element.scrollWidth; // includes padding
        totalWidth += $element.outerWidth(includeMargin) - $element.innerWidth();
        return totalWidth;
    };

    /**
     * Returns the real untransformed offset of an element since offset()
     * uses getBoundingClientRect() internally
     */
    jQuery.fn.getOffset = function () {
        var el = this[0];
        var x = 0;
        var y = 0;

        while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            x += el.offsetLeft;
            y += el.offsetTop;
            el = el.offsetParent;
        }

        return { top: y, left: x };
    }

    /**
     * Dynamically load a cached script
     * http://api.jquery.com/jquery.getScript/
     * 
     * @example
     * $.cachedScript("test.js").then(function(script, textStatus) {
     *      console.log( textStatus );
     * });
     * 
     */
    jQuery.cachedScript = function (url, options) {
        // allow user to set any option except for dataType, cache, and url
        options = $.extend(options || {},
            {
                dataType: "script",
                cache: true,
                url: url
            });

        // Use $.ajax() since it is more flexible than $.getScript
        // Return the jqXHR object so we can chain callbacks
        return jquery.ajax(options);
    };

    /**
     * Timeout function
     * http://www.ryancoughlin.com/2009/01/22/jquery-timeout-function/
     * 
     * @example
     * $('.myelement').fadeIn().idle(2000).fadeOut('slow');
     * 
     */
    jQuery.fn.idle = function (time) {
        return this.each(function () {
            var i = $(this);
            i.queue(function () {
                setTimeout(function () {
                        i.dequeue();
                    },
                    time);
            });
        });
    };

    /**
     * AutoComplete/Change event work-around
     */
    $(document).on({
            focus: function () {
                this.__previousvalue = this.value;
            },
            change: function () {
                this.__previousvalue = this.value;
            },
            blur: function () {
                if (this.__previousvalue != this.value) {
                    $(this).change();
                }
            }
        },
        "input[type=text]");
}());
