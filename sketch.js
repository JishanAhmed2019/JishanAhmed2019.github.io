let canvas;
let angle = 0;
let capturer;
let isCapturing = false;

function setup() {
  // Create the canvas and attach it to the div with id "sketch-holder"
  canvas = createCanvas(600, 400, WEBGL);
  canvas.parent('sketch-holder');
  
  // Set a frame rate for smoother animation
  frameRate(60);
  
  // Initialize CCapture (optional – for recording the simulation)
  capturer = new CCapture({
    format: 'webm',
    framerate: 60,
    verbose: true
  });
}

function draw() {
  background(200);

  // Apply a rotation for animation
  rotateY(angle);
  angle += 0.01;
  
  // Draw a sphere
  fill(150, 100, 250);
  noStroke();
  sphere(100);
  
  // If recording is enabled, capture the frame
  if (isCapturing) {
    capturer.capture(canvas.elt);
  }
}

// Toggle recording when "r" key is pressed (optional)
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
