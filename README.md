se2-correlate
=============
Computes the cross correlation for 2D images over the group of rigid motions.

## Install

    npm install se2-correlate

## Example

```javascript
"use strict"

var zeros = require("zeros")
var ops = require("ndarray-ops")
var getPixels = require("get-pixels")
var se2corr = require("se2-correlate")

getPixels("robot.png", function(err, robotPixels) {
  getPixels("maze.png", function(err, mazePixels) {
    var robot = ops.neqseq(robotPixels.pick(undefined, undefined, 3), 0)
    var maze = ops.ltseq(mazePixels.pick(undefined, undefined, 0), 128)

    var obstacle = zeros([64, 256, 256])
    ops.gtseq(se2corr(obstacle, robot, maze), 1.0)

    //Obstacle is now the configuration space obstacle fo the robot
  })
})
```

[Here is an interactive visualization](https://mikolalysenko.github.io/se2-correlate)


## `require("se2-correlation")(out, a, b)`
Computes the cross correlation of two 2D images over the group of rigid motions.  The value of the output at a given pixel is determined by,

```latex
out(\theta, x, y) = \int \limits_{R^2} a( \cos(\theta) u, \sin(\theta) v) b(u, v) d u \: dv
```

In the discretized version, the rotations are sampled uniformly.  The input bitmaps are centered and rotations are performed about the center point in each case.  The output correlation is also centered

* `out` is a 3D array with shape `[n, p, q]`
* `a` is a 2D ndarray
* `b` is also a 2D ndarray

**Returns** `out`

## Credit
(c) 2013 Mikola Lysenko. MIT License