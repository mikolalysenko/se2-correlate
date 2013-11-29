se2-correlation
===============
Computes the cross correlation for 2D images over the group of rigid motions.

## Install

    npm install se2-correlation

## Example

```javascript
```

## `require("se2-correlation")(out, a, b)`


```javascript
out[r, i, j] = dot(rotate(a, 2 * pi r / n), shift(b, i, j))
```

* `out` is a 3D array with shape `[n, p, q]`
* `a`
* `b`

**Returns**

## Credit
(c) 2013 Mikola Lysenko. MIT License