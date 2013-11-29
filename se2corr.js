"use strict"

var cwise = require("cwise")
var cops = require("ndarray-complex")
var ops = require("ndarray-ops")
var fft = require("ndarray-fft")
var scratch = require("ndarray-scratch")
var rotate = require("image-rotate")

module.exports = se2Correlate

var shiftConjugate = cwise({
  args: [ "array", "array", "index", "scalar", "scalar", "shape" ],
  pre: function(re, im, idx, dx, dy, shape) {
    this.cos = Math.cos
    this.sin = Math.sin
    this.wx = 2.0 * Math.PI * dx / shape[0]
    this.wy = 2.0 * Math.PI * dy / shape[1]
  },
  body: function(a, b, idx, dx, dy, shape) {
    var w = this.wx * idx[0] + this.wy * idx[1]
    var c = Math.cos(w)
    var s = Math.sin(w)
    var k1 = a * (c + s)
    var k2 = c * (b - a)
    var k3 = s * (a + b)
    a = k1 - k3
    b = -(k1 + k2)
  }
})

function se2Correlate(out, a, b) {
  //Pretransform b
  var br = scratch.malloc([ out.shape[1], out.shape[2] ])
  var bi = scratch.malloc([ out.shape[1], out.shape[2] ])
  ops.assigns(br, 0.0)
  ops.assign(br.hi(b.shape[0], b.shape[1]), b)
  ops.assigns(bi, 0.0)
  fft(1, br, bi)
  shiftConjugate(br, bi, -b.shape[0]/2.0, -b.shape[1]/2.0)
  
  //Scratch imaginary component
  var im = scratch.malloc([ out.shape[1], out.shape[2] ])

  //Loop over angles
  var nangles = out.shape[0]
  for(var i=0; i<nangles; ++i) {
    var theta = 2.0 * Math.PI * i / nangles
    
    var re = out.pick(i)
    rotate(re, a, theta)
    
    ops.assigns(im, 0.0)
    fft(1, re, im)
    cops.muleq(re, im, br, bi)
    fft(-1, re, im)
  }

  //Free scratch data
  scratch.free(im)
  scratch.free(bi)
  scratch.free(br)
  
  return out
}