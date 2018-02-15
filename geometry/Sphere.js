/**
 * Created by Hans Dulimarta on 2/1/17.
 */
class Sphere extends Object3D {
    /**
     * Create a 3D sphere with tip at the Z+ axis and base on the XY plane
     * @param {Object} gl      the current WebGL context
     * @param {Number} radius  radius of the sphere
     * @param {Number} subDiv  number of recursive subdivisions
     * @param {vec3}   [col1]  color #1 to use
     */
    vertices = 0.0;

    constructor (gl, RADIUS, subDiv, col1) {
        super(gl);
        /* if colors are undefined, generate random colors */
        if (typeof col1 === "undefined") col1 = vec3.fromValues(Math.random(), Math.random(), Math.random());

        this.RADIUS = RADIUS;
        let seedA = vec3.fromValues(1, 1, 1);
        vec3.normalize(seedA, seedA);
        vec3.scale (seedA, seedA, RADIUS);
        let seedB = vec3.fromValues(-1, -1, 1);
        vec3.normalize(seedB, seedB);
        vec3.scale (seedB, seedB, RADIUS);
        let seedC = vec3.fromValues(-1, 1, -1);
        vec3.normalize(seedC, seedC);
        vec3.scale (seedC, seedC, RADIUS);
        let seedD = vec3.fromValues(1, -1, -1);
        vec3.normalize(seedD, seedD);
        vec3.scale (seedD, seedD, RADIUS);

        /* TODO: complete the rest of the code here */
        build(seedA, seedB, seedC, subDiv); // correct seeds?
        build(seedD, seedB, seedA, subDiv); // correct seeds?
        build(seedC, seedB, seedD, subDiv); // correct seeds?
        build(seedD, seedA, seedC, subDiv); // correct seeds?
        // TODO: draw triangles from vertices[]
/*        index = [];
/!*        let start = s * props.numSides;
        for (let k = 0; k < props.numSides; k++) {
            index.push(start + k, start + k + props.numSides);
        }*!/
        index.push(start, start + props.numSides);*/
        let buff = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buff);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint16Array.from(this.vertices), gl.STATIC_DRAW);
        this.primitives.push({type: gl.TRIANGLES, buffer: buff, numPoints: this.vertices.length});
    }

}

function build(p1, p2, p3, radius, callsLeft) {
    if (callsLeft == 0) {
        this.vertices.push(p1, p2, p3);
    } else {
        let p4 = vec3.fromValues((p1.x-p2.x)/2.0,(p1.y-p2.y)/2.0,(p1.z-p2.z)/2.0);
        let p5 = vec3.fromValues((p3.x-p2.x)/2.0,(p3.y-p2.y)/2.0,(p3.z-p2.z)/2.0);
        let p6 = vec3.fromValues((p1.x-p3.x)/2.0,(p1.y-p3.y)/2.0,(p1.z-p3.z)/2.0);
        vec3.normalize(p4,p4);
        vec3.normalize(p5,p5);
        vec3.normalize(p6,p6);
        vec3.scale(p4, p4, radius);
        vec3.scale(p5, p5, radius);
        vec3.scale(p6, p6, radius);
        build(p1,p4,p6,radius,callsLeft-1);
        build(p4,p2,p5,radius,callsLeft-1);
        build(p6,p5,p3,radius,callsLeft-1);
        build(p4,p5,p6,radius,callsLeft-1);
    }
}