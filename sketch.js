let canvas;
let angleY = 0;
let angleX = 0;
let capturer;
let isCapturing = false;

function setup() {
  console.log('p5.js setup started');
  
  // Create a fixed-size canvas (600 x 400) with WEBGL
  canvas = createCanvas(600, 400, WEBGL);
  
  // Attach the canvas to the container with id "sketch-holder"
  let holder = select('#sketch-holder');
  if (holder) {
    canvas.parent(holder);
    console.log('Canvas successfully attached to #sketch-holder');
  } else {
    console.error('ERROR: No element with id "sketch-holder" found!');
  }
  
  // Set the frame rate to 60 fps
  frameRate(60);
  
  // Initialize CCapture (optional, for recording)
  capturer = new CCapture({
    format: 'webm',
    framerate: 60,
    verbose: true
  });
}

function draw() {
  background(20);

  // Set up lights for a shiny look
  ambientLight(80);
  directionalLight(255, 255, 255, 0.5, 0.5, -1);
  pointLight(255, 255, 255, 0, -300, 300);

  // Increase rotation angles
  angleY += 0.3;
  angleX += 0.15;
  
  // Apply rotations
  rotateY(angleY);
  rotateX(angleX);
  
  // Draw a wireframe container sphere (for context)
  push();
    noFill();
    stroke(150);
    strokeWeight(1);
    sphere(250); // containerRadius from your original code
  pop();
  
  // Draw a solid sphere inside to show rotation clearly
  push();
    fill(150, 100, 250);
    noStroke();
    sphere(100);
  pop();

  // Capture the frame if recording is enabled
  if (isCapturing) {
    capturer.capture(canvas.elt);
  }
}

// Toggle recording when "r" key is pressed
function keyPressed() {
  if (key === 'r' || key === 'R') {
    if (!isCapturing) {
      isCapturing = true;
      capturer.start();
      console.log("Recording started");
    } else {
      isCapturing = false;
      capturer.stop();
      capturer.save(); // Downloads the video file
      console.log("Recording stopped");
    }
  }
}
