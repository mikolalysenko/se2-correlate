"use strict"

var zeros = require("zeros")
var ops = require("ndarray-ops")
var getPixels = require("get-pixels")
var se2corr = require("../se2corr.js")
var render = require("ndarray-canvas")
var savePixels = require("save-pixels")

getPixels("robot.png", function(err, robotPixels) {
  getPixels("maze.png", function(err, mazePixels) {
    var robot = ops.neqseq(robotPixels.pick(undefined, undefined, 3), 0)
    var maze = ops.ltseq(mazePixels.pick(undefined, undefined, 0), 128)

    var voxels = zeros([64, 256, 256])
    se2corr(voxels, robot, maze)

    //Display stuff
    var createVolumeRenderer = require("raymarch")
    var shell = require("gl-now")()
    var camera = require("game-shell-orbit-camera")(shell)
    var glm = require("gl-matrix")

    camera.lookAt([3,0,0], [0,0,0], [0,1,0])

    var viewer

    shell.on("gl-init", function() {
      viewer = createVolumeRenderer(shell.gl, voxels)
    })

    shell.on("gl-render", function() {
      viewer.projection = glm.mat4.perspective(new Float32Array(16), Math.PI/4.0, shell.width/shell.height, 0.01, 1000.0)
      viewer.view = camera.view()
      viewer.draw()
    })
  })
})