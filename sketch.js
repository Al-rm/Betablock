  //GLOBAL VAR
let screenRes, canvas, fps, menu, game = {};
let debugDiv = document.getElementById("debug");
var Engine = Matter.Engine,
    Runner = Matter.Runner,
    Events = Matter.Events,
    Detector = Matter.Detector,
    Composite = Matter.Composite,
    Bodies = Matter.Bodies,
    Collision = Matter.Collision,
    Pairs = Matter.Pairs,
    Render = Matter.Render;
let fontText, fontTitle;
  //preload assets
function preload() {
  fontText = loadFont('./game/assets/font/fontText.otf');
  fontTitle = loadFont('./game/assets/font/FontTitle.otf');
  cursorAim = loadImage('./game/assets/cursor_aim.png');
}
  //setup canvas
function setup() {
  screenRes = [windowWidth*.5, windowHeight*.95];
  canvas = createCanvas(screenRes[0],screenRes[1]);
  game = new GAME();
  menu = new MENU();
  background(33);

  function addBodiesEvents(event) {
    Composite.add(game.engine.world, event.object)
  }
  Events.on(game.engine, "afterAdd", addBodiesEvents);
}
  //eventListeners
// function mouseDragged() {
//   // shoot();
//}
function mousePressed() {
  if (game.state == "Running") {
    if(pad.isGrabbing) {
      pad.releaseBall(particles[0], mouseX)
    } else {
      stage.createBall()
      pad.isAiming = true;
      pad.isGrabbing = true;
    }
  } else {
    menu.checkClick();
  }
}
function keyPressed() {
  // console.log(event)
  if (key == ' '){
    game.pause();
  }
  if (key == 'Control') {
    pad.aim();
  }
}
//RENDER GAME
function draw() {
 
  textFont(fontText);
  if (game.state === "Running") {
    game.update();
    game.show();
  } else {
    menu.show();
  }
}
