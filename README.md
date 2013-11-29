se2-correlation
===============
Computes the cross correlation for 2D images over the group of rigid motions.

## Install

    npm install se2-correlation

## Example

```javascript
var getPixels = require("get-pixels")
var zeros
```

## `require("se2-correlation")(out, a, b)`
Computes the cross correlation of two 2D images over the group of rigid motions.  The value of the output at a given pixel is determined by,

```latex
out(\theta, x, y) = \int \limits_{R^2} a( \cos(\theta) u, \sin(\theta) v) b(u, v) d u \: dv
```

Where `n` is the number of rotational samples, and the rotations and translations are performed about center of each image, which are initially aligned at (i=0,j=0).  The highe



* `out` is a 3D array with shape `[n, p, q]`
* `a` is a 2D ndarray
* `b` is also a 2D ndarray

**Returns**

## Credit
(c) 2013 Mikola Lysenko. MIT License