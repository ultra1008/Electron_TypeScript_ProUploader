/**
 * Matrix extension methods
 * https://github.com/STRd6/matrix.js
 */

/**
 * Return a new matrix from a CSS transform matrix
 * @name fromCssMatrix
 * @memberOf Matrix#
 *
 * @param {string} cssMatrix The transform value typically returned from 
 * getComputedStyle(el).transform.
 * 
 * @returns A new matrix initalized with the CSS values.
 * @type Matrix
 */
Matrix.fromCssMatrix = function (cssMatrix) {
    try {
        var m = cssMatrix.split('matrix(')[1].split(')')[0].split(',');
        if (m) {
            for (var i = 0; i < m.length; i++) {
                m[i] = parseFloat(m[i]);
            }
            return Matrix(m[0], m[1], m[2], m[3], m[4], m[5]);
        } else {
            return Matrix.IDENTITY;
        }
    } catch(e) {
        return Matrix.IDENTITY;
    }
}

/**
 * Get the transform matrix from a style definition
 * @name getTransformMatrix
 * @memberOf Matrix#
 * 
 * @returns A new matrix initalized with the CSS style values.
 * @type Matrix
 */
Matrix.getTransformMatrix = function (style) {
    var transform = style.transform;
    return Matrix.fromCssMatrix(transform);
}

/**
 * Get the transform origin from a style definition
 * @name getTransformOrigin
 * @memberOf Matrix#
 * 
 * @returns A new point with the transformation origin applied.
 * @type Point
 */
Matrix.getTransformOrigin = function (style) {
    var to = style.transformOrigin.split(" ");
    to.forEach(function (item, index) {
        to[index] = parseFloat(item);
    });

    return Point(to[0], to[1]);
}

/**
 * Gets the individual transform properties from the supplied matrix
 * @name getTransformProperties
 * @memberOf Matrix#
 * 
 * @returns A new object containing the transformation components.
 */
Matrix.getTransformProperties = function (m) {
    var o = {
        tx: Number(m.tx),
        ty: Number(m.ty),
        rad: Math.atan2(Number(m.b), Number(m.a)),
        scalex: Math.sqrt(m.a * m.a + m.b * m.b),
        scaley: Math.sqrt(m.c * m.c + m.d * m.d)
    };

    return o;
}
