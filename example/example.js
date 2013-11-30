"use strict"

//Display stuff
var createVolumeRenderer = require("raymarch")
var shell = require("gl-now")()
var camera = require("game-shell-orbit-camera")(shell)
var glm = require("gl-matrix")

//Correlation
var zeros = require("zeros")
var ops = require("ndarray-ops")
var getPixels = require("get-pixels")
var se2corr = require("../se2corr.js")
var render = require("ndarray-canvas")

shell.on("gl-init", function() {
  getPixels("robot.png", function(err, robotPixels) {
    getPixels("maze.png", function(err, mazePixels) {
      var robot = ops.neqseq(robotPixels.pick(undefined, undefined, 3), 0).transpose(1,0)
      var maze = ops.ltseq(mazePixels.pick(undefined, undefined, 0), 128)

      var voxels = zeros([64, 256, 256])
      se2corr(voxels, robot, maze)
      
      camera.lookAt([3,0,0], [0,0,0], [0,1,0])

      var viewer = createVolumeRenderer(shell.gl, voxels)

      shell.on("gl-render", function() {
        viewer.projection = glm.mat4.perspective(new Float32Array(16), Math.PI/4.0, shell.width/shell.height, 0.01, 1000.0)
        viewer.view = camera.view()
        viewer.draw()
      })

      var robotCanvas = render(null, ops.mulseq(robot, 255))
      robotCanvas.style.position = "absolute"
      robotCanvas.style.top = "15px"
      robotCanvas.style.left = "15px"
      document.body.appendChild(robotCanvas)

      var mazeCanvas = render(null, ops.mulseq(maze, 255))
      mazeCanvas.style.position = "absolute"
      mazeCanvas.style.top = (robot.shape[1] + 30) + "px"
      mazeCanvas.style.left = "15px"
      document.body.appendChild(mazeCanvas)
    })
  })
})