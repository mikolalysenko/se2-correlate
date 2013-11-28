"use strict"

var zeros = require("zeros")
var ops = require("ndarray-ops")
var getPixels = require("get-pixels")
var se2corr = require("../se2corr.js")

getPixels("/robot.png", function(err, robotPixels) {
  getPixels("/maze.png", function(err, mazePixels) {
    var robot = ops.neqs(robotPixels.pick(undefined, undefined, 0), 255)
    var maze = ops.neqs(mazePixels.pick(undefined, undefined, 0), 255)

    var voxels = zeros([64, 512, 512])
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