let feld;
let oldfeld;
let nn;
let player;
let isTrain = false;
let button;
let saveButton;
let beginButton;
let nnJSON;
let tree;
let beginner = false;
let zugtiefeSlider;
let zugtiefeSpan;
let counter;

function preload() {
  nnJSON = loadJSON("nn.json");
}

function setup() {
  let canvas = createCanvas(700, 800);
  canvas.parent('canvascontainer');
  //canvas.position(100, 0);
  //frameRate(1);
  background(200);
  button = select('#play');
  button.mousePressed(toggleButton);
  saveButton = select('#save');
  saveButton.mousePressed(saveNn);
  beginButton = select('#beginner');
  beginButton.mousePressed(changeBeginner);
  zugtiefeSlider = select('#zugtiefeSlider');
  zugtiefeSpan = select('#zugtiefe');
  //nn = new NeuralNetwork(126, 63, 2, 0.1);
  nn = NeuralNetwork.deserialize(nnJSON);
  startGame();
}

function changeBeginner() {
  beginner = !beginner;
  if (beginner) {
    beginButton.html('you start');
  } else {
    beginButton.html('computer starts');
  }
}

function saveNn() {
  saveJSON(nn, 'nn.json');
}

function toggleButton() {
  isTrain = !isTrain;
  if (isTrain) {
    button.html('play');
  } else {
    button.html('train');
  }
  startGame();
}

function startGame() {
  feld = new Spielfeld(6, 7);
  counter = 0;
  player = beginner;
}


function draw() {
  if (isTrain) {
    if(feld.calcValue() != 0 || counter >= 42){
      train();
      startGame();
    }
    feld.invert(player);
    tree = new GameTree(feld);
    feld = tree.makeTurn(4);
    feld.invert(player);
    player = !player;
    ++counter;
    feld.draw();
    /*for (let i = 0; i < 10; ++i) {
      selfPlay();
    }*/
  } else {
    if (feld.calcValue() == -1) {
      textSize(64);
      fill(0, 102, 153);
      text('you win!', width / 2, height / 2);
    } else if (feld.calcValue() == 1) {
      textSize(64);
      fill(0, 102, 153);
      text('you loose!', width / 2, height / 2);
    } else if (counter >= 42) {
      textSize(64);
      fill(0, 102, 153);
      text('draw!', width / 2, height / 2);
    } else {
      if (player) {
        background(200);
        fill(250, 250, 0);
        ellipse(mouseX, mouseY, 90, 90);
        if (mouseIsPressed && mouseY < 200) {
          feld.turn(floor(mouseX / 100), player);
          player = !player;
          background(200);
          feld.draw();
        }
      } else {
        var time = millis();
        while (millis() - time < 500) {
          //console.log(millis() - time);
        }
        tree = new GameTree(feld);
        let zugtiefe = 2*zugtiefeSlider.value();
        zugtiefeSpan.html(zugtiefe);
        feld = tree.makeTurn(zugtiefe);
        player = !player;
        ++counter;
      }
      feld.draw();
    }
  }
}

function train() {
  let spielfeld;
  let target;
  let input;
  for (let i = 0; i < 10; ++i) {
    spielfeld = new Spielfeld(6, 7);
    spielfeld.play();
    target = spielfeld.getTarget();
    input = spielfeld.makeArray();
    nn.train(input, target);
  }
  //test();
}

function test() {
  feld = new Spielfeld(6, 7);
  feld.play();
  feld.draw();
  console.log(feld.calcValue(), heuristic(feld));
}
