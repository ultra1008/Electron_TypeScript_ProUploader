/**
 * Math Extensions
 */
;(function () {
    window.Math.toRadians = function (degrees) {
        return degrees * (Math.PI / 180);
    };

    window.Math.toDegrees = function (radians) {
        return radians * (180 / Math.PI);
    };
}());
