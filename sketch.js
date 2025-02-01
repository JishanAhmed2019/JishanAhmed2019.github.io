// Global variables
let canvas; // p5 canvas element
let balls = [];
const numBalls = 100;
const containerRadius = 250;
const ballRadius = 15;
let angleY = 0;
let angleX = 0;

// Variables for CCapture (optional)
let capturer;
let isCapturing = false;

function setup() {
  console.log('p5.js setup started');

  // Create a fixed-size canvas 800 x 600 with WEBGL renderer
  canvas = createCanvas(800, 600, WEBGL);
  
  // Attach the canvas to the div with id "sketch-holder"
  let holder = select('#sketch-holder');
  if (holder) {
    canvas.parent(holder);
    console.log('Canvas successfully attached to #sketch-holder');
  } else {
    console.error('ERROR: No element with id "sketch-holder" found!');
  }
  
  // Set frame rate to 60 fps
  frameRate(60);
  
  // Set perspective and camera
  perspective(PI / 3, width / height, 0.1, 10000);
  // Set the camera closer (z=700) so the sphere appears larger.
  camera(0, 0, 700, 0, 0, 0, 0, 1, 0);
  console.log("Camera set to: (0, 0, 700)");

  // Initialize CCapture (optional, for recording)
  capturer = new CCapture({
    format: 'webm',
    framerate: 60,
    verbose: true
  });
  
  // Create the balls for the simulation
  for (let i = 0; i < numBalls; i++) {
    balls.push(new Ball());
  }
}

function draw() {
  background(20);

  // On-screen instructions (drawn in screen space)
  push();
    resetMatrix();
    fill(255);
    textSize(16);
    text("Press 'r' to toggle recording", 20, 30);
  pop();

  // Set up lights for a shiny appearance
  ambientLight(80);
  directionalLight(255, 255, 255, 0.5, 0.5, -1);
  pointLight(255, 255, 255, 0, -300, 300);

  // Increase rotation angles for dynamic effect
  angleY += 0.3;
  angleX += 0.15;
  rotateY(angleY);
  rotateX(angleX);

  // Draw the container sphere in wireframe mode
  push();
    noFill();
    stroke(150);
    strokeWeight(1);
    sphere(containerRadius);
  pop();

  // Update and display each ball
  for (let ball of balls) {
    ball.update();
    ball.display();
  }

  // Capture the current frame if recording is enabled
  if (isCapturing) {
    capturer.capture(canvas.elt);
  }
}

// Toggle recording by pressing the "r" key
function keyPressed() {
  if (key === 'r' || key === 'R') {
    if (!isCapturing) {
      console.log("Recording started.");
      isCapturing = true;
      capturer.start();
    } else {
      console.log("Recording stopped.");
      isCapturing = false;
      capturer.stop();
      capturer.save(); // Triggers a download of the video file
    }
  }
}

// Ball class definition
class Ball {
  constructor() {
    // Set a random position inside the container sphere using spherical coordinates.
    let r = random(0, containerRadius - ballRadius);
    let theta = random(0, TWO_PI);
    let phi = random(0, PI);
    this.pos = createVector(
      r * sin(phi) * cos(theta),
      r * sin(phi) * sin(theta),
      r * cos(phi)
    );

    // Set a random 3D velocity vector
    this.vel = p5.Vector.random3D();
    this.vel.mult(random(1, 3));

    // Choose a random bright color
    this.c = color(random(100, 255), random(100, 255), random(100, 255));

    // Store positions for a fading trail effect
    this.trail = [];
    this.maxTrail = 50;
  }

  update() {
    // Update position by adding velocity
    this.pos.add(this.vel);

    // Collision detection: reflect the velocity if the ball goes outside the sphere
    if (this.pos.mag() + ballRadius > containerRadius) {
      let n = this.pos.copy().normalize();
      let vDotN = this.vel.dot(n);
      this.vel.sub(n.copy().mult(2 * vDotN));
      this.pos = n.copy().mult(containerRadius - ballRadius);
    }

    // Save the current position for the trail effect
    this.trail.push(this.pos.copy());
    if (this.trail.length > this.maxTrail) {
      this.trail.shift();
    }
  }

  display() {
    // Draw the fading trail
    noFill();
    strokeWeight(2);
    for (let i = 0; i < this.trail.length - 1; i++) {
      let alphaVal = map(i, 0, this.trail.length - 1, 0, 255);
      stroke(red(this.c), green(this.c), blue(this.c), alphaVal);
      let p1 = this.trail[i];
      let p2 = this.trail[i + 1];
      line(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
    }

    // Draw the shiny ball
    push();
      translate(this.pos.x, this.pos.y, this.pos.z);
      noStroke();
      specularMaterial(this.c);
      shininess(100);
      sphere(ballRadius);
    pop();
  }
}
