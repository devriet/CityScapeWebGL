/**
 * Created by Hans Dulimarta.
 */
let canvas;
let gl;
let allObjs = [];

var projUnif;
var projMat, viewMat;

function main() {
  setupEventHandlers();
  canvas = document.getElementById("my-canvas");

  /* setup window resize listener */
  window.addEventListener('resize', resizeWindow);

  gl = WebGLUtils.create3DContext(canvas, null);
  ShaderUtils.loadFromFile(gl, "vshader.glsl", "fshader.glsl")
  .then (prog => {
    /* put all one-time initialization logic here */
    gl.useProgram (prog);
    gl.clearColor (0, 0, 0, 1);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.cullFace(gl.BACK);

    /* the vertex shader defines TWO attribute vars and ONE uniform var */
    let posAttr = gl.getAttribLocation (prog, "vertexPos");
    let colAttr = gl.getAttribLocation (prog, "vertexCol");
    Object3D.linkShaderAttrib({
      positionAttr: posAttr,
      colorAttr: colAttr
    });
    let modelUnif = gl.getUniformLocation (prog, "modelCF");
    projUnif = gl.getUniformLocation (prog, "projection");
    viewUnif = gl.getUniformLocation (prog, "view");
    Object3D.linkShaderUniform({
      projection: projUnif,
      view: viewUnif,
      model: modelUnif
    });
    gl.enableVertexAttribArray (posAttr);
    gl.enableVertexAttribArray (colAttr);
    projMat = mat4.create();
    gl.uniformMatrix4fv (projUnif, false, projMat);
    viewMat = mat4.lookAt(mat4.create(),
      vec3.fromValues (2, 4, 2),  // eye coord
      vec3.fromValues (0, 0, 1),  // gaze point
      vec3.fromValues (0, 0, 1)   // Z is up
    );
    gl.uniformMatrix4fv (viewUnif, false, viewMat);

    /* recalculate new viewport */
    resizeWindow();

    createObject();

    /* initiate the render request */
    window.requestAnimFrame(drawScene);
  });
}

function drawScene() {
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

  /* in the following three cases we rotate the coordinate frame by 1 degree */
  for (var k = 0; k < allObjs.length; k++)
    allObjs[k].draw(gl);

}

function createObject() {
/*    var o = new Sphere(gl, 1, 4);
    allObjs.push(o);*/
  var r;
  var o;
  for (let i = 0; i < 10; i ++) {
    for (let j = 0; j < 10; j++) {
      r = Math.random()*2;
      if (r < 1) {
        o = new PolygonalPrism(gl,
            {
              topRadius: (Math.random()*0.5 + 0.25),
              bottomRadius: (Math.random()*0.5 + 0.25),
              numSides: (Math.random()*9 + 3),
              height: (Math.random()*0.5 + 0.75)
            });
      } else {
        o = new Cone(gl,
            {
              radius: (Math.random()*0.25 + 0.25),
              height: (Math.random()*0.5 + 0.75)
            });
      }
      mat4.translate (o.coordFrame, o.coordFrame, vec3.fromValues(i-5, j-5, 0));
      allObjs.push(o);
    }
  }
/*  let obj = new PolygonalPrism(gl,
      {
        topRadius: 0.5,
        bottomRadius: 0.5,
        numSides: 8,
        height: 1,
        //topColor: vec3.fromValues(1,0,0),
        //bottomColor: vec3.fromValues(1,1,1)
      });
  let cone = new Cone(gl, {
    radius: 0.4,
    height: 1.2
  });
  mat4.translate (cone.coordFrame, cone.coordFrame, vec3.fromValues(1, 0, 0));
  allObjs.push(obj, cone);*/
}

function setupEventHandlers() {
    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 37) {
            //turn left
            viewMat[0][0] -= 0.2;
            //alert('Left was pressed');
        }
        else if(event.keyCode == 38) {
            //move forward
            viewMat[1][1] += 0.2;
            //alert('Up was pressed');
        }
        else if(event.keyCode == 39) {
            //turn right
            viewMat[2][2] += 0.2;
            //alert('Right was pressed');
        }
        else if(event.keyCode == 40) {
            //move backward
            viewMat[3][3] -= 0.2;
            //alert('Down was pressed');
        }
        else if(event.keyCode == 87) {
            //nose up
            //transy -= 0.2;
            alert('w was pressed');
        }
        else if(event.keyCode == 65) {
            //bank left
            //transy -= 0.2;
            alert('a was pressed');
        }
        else if(event.keyCode == 83) {
            //nose down
            //transy -= 0.2;
            alert('s was pressed');
        }
        else if(event.keyCode == 68) {
            //bank right
            //transy -= 0.2;
            alert('d was pressed');
        }
    });
}

function resizeWindow() {
  let w = window.innerWidth - 16;
  let h = 0.75 * window.innerHeight;
  canvas.width = w;
  canvas.height = h;
  mat4.perspective (projMat, glMatrix.toRadian(60), w/h, 0.05, 20);
  gl.uniformMatrix4fv (projUnif, false, projMat);
  gl.viewport(0, 0, w, h);
}
