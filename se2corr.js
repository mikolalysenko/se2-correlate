"use strict"

var rotate = require("image-rotate")
var correlate = require("ndarray-convolve").correlate

function SE2Correlate(out, a, b) {
  var nangles = out.shape[0]
  var bx = b.shape[0]/2.0
  var by = b.shape[1]/2.0
  var ox = (out.shape[1] - a.shape[0])/2.0
  var oy = (out.shape[2] - a.shape[1])/2.0
  for(var i=0; i<nangles; ++i) {
    var theta = 2.0 * Math.PI * i / nangles
    var slice = out.pick(i)
    rotate(slice, b, theta, bx, by, ox, oy)
    correlate(slice, a)
  }
  return out
}