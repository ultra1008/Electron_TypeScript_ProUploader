﻿/**
 * Number Extensions
 */
;(function () {
    "use strict";

    window.Number.prototype.round = function (decimals) {
        return Number((Math.round(this + "e" + decimals) + "e-" + decimals));
    }
}());

