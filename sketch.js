let canvas;
let angle = 0;
let capturer;
let isCapturing = false;

function setup() {
  console.log('p5.js setup started');
  
  // Create a 600x400 canvas with WEBGL renderer
  canvas = createCanvas(600, 400, WEBGL);
  
  // Attach the canvas to the div with id "sketch-holder"
  let holder = select('#sketch-holder');
  if (holder) {
    canvas.parent(holder);
    console.log('Canvas successfully attached to #sketch-holder');
  } else {
    console.error('ERROR: No element with id "sketch-holder" found!');
  }
  
  // Set a smooth frame rate
  frameRate(60);
  
  // Initialize CCapture (optional – used if you press "r" to record)
  capturer = new CCapture({
    format: 'webm',
    framerate: 60,
    verbose: true
  });
}

function draw() {
  background(200);
  
  // Rotate the sphere along the Y-axis
  rotateY(angle);
  angle += 0.01;
  
  // Draw a sphere with a radius of 100
  fill(150, 100, 250);
  noStroke();
  sphere(100);
  
  // If recording is enabled, capture the current frame
  if (isCapturing) {
    capturer.capture(canvas.elt);
  }
}

// Toggle recording on key press ("r")
function keyPressed() {
  if (key === 'r' || key === 'R') {
    if (!isCapturing) {
      isCapturing = true;
      capturer.start();
      console.log("Recording started");
    } else {
      isCapturing = false;
      capturer.stop();
      capturer.save();
      console.log("Recording stopped");
    }
  }
}
