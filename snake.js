const pixelSize = 30;
const tilesX = 25;
const tilesY = 20;

let speedTimer;
let treatTimer;
let coordsTimer;
let movement;
let coords = [];

play = true;

// GAME VARIABLES AND FUNCTIONS
game = {
  // Snake movement interval in milliseconds
  startSpeed: 140,
  // Snake speed timer interval in milliseconds
  startSpeedTimer: 10000,
  // Snake starting size
  startSize: 3,
  // Snake starting direction
  startDirection: "UP",
  // Snake horizontal starting location
  snakeX: Math.floor(tilesX / 2) * pixelSize,
  // Snake vertical starting location
  snakeY: 0,
  // Treat relocation interval in milliseconds
  startTreatTimer: 15000,
  // Treat horizontal starting location
  treatX: Math.floor(tilesX / 2) * pixelSize,
  // Treat vertical starting location
  treatY: pixelSize * 4,

  // Game board width in pixels
  width: tilesX * pixelSize,
  // Game board height in pixels
  height: tilesY * pixelSize,
  // Game board border
  border: "1px solid #1a1a1a",
  background: "white",
  text: "black",

  // Start and stop the game with spacebar
  pause: () => {
    if (event.keyCode == 32) {
      if (play == true) {
        game.stop();
      } else if (play == false) {
        game.start();
      }
    }
  },
  // Start the game
  start: () => {
    clearInterval(movement);
    movement = setInterval(snake.move, snake.speed);
    document.addEventListener("keydown", snake.changeDirection);
    treatTimer.resume();
    speedTimer.resume();
    play = true;
  },
  // Pause the game
  stop: () => {
    clearInterval(movement);
    document.removeEventListener("keydown", snake.changeDirection);
    treatTimer.pause();
    speedTimer.pause();
    play = false;
  },
  // Reset the game to initial state
  reset: () => {
    snake.speed = game.startSpeed;
    snake.direction = game.startDirection;
    snake.x = game.snakeX;
    snake.y = game.snakeY;
    snake.size = game.startSize;
    document.getElementById("score").remove();
    document.getElementById("snake-head").remove();
    document.getElementById("treat").remove();
    document.getElementsByClassName("snake-part").remove();
    clearInterval(movement);
    coords = [];
  }
};

// SNAKE VARIABLES AND FUNCTIONS
snake = {
  color: "black", // Snake head color
  childColor: "green", // Snake body color

  size: game.startSize,
  direction: game.startDirection,
  timer: game.startSpeedTimer,
  speed: game.startSpeed,
  x: game.snakeX,
  y: game.snakeY,

  // Handles snake movement
  move: () => {
    let s = document.getElementById("snake-head");
    if (snake.direction == "UP") {
      snake.y += pixelSize;
    } else if (snake.direction == "RIGHT") {
      snake.x += pixelSize;
    } else if (snake.direction == "LEFT") {
      snake.x -= pixelSize;
    } else if (snake.direction == "DOWN") {
      snake.y -= pixelSize;
    }

    // Checks if snake collides with treat or wall
    if (treat.x == snake.x && treat.y == snake.y) {
      snake.treat();
      treat.reTreat();
    } else if (
      snake.x >= game.width ||
      snake.x < 0 ||
      snake.y >= game.height ||
      snake.y < 0
    ) {
      console.log("RAN INTO A WALL");
      restart();
    }

    // Checks if snake head collides with body
    for (i = 0; i < coords.length; i++) {
      if (snake.x == coords[i].x && snake.y == coords[i].y) {
        console.log("TOUCHED YOURSELF");
        restart();
      }
    }

    snake.draw();

    s.style.left = snake.x + "px";
    s.style.bottom = snake.y + "px";
    // console.log("Snake X: " + snake.x + " Y: " + snake.y);
    // console.log(coords);
  },
  // Creates and removes snake parts if necessary
  draw: () => {
    let sp = document.getElementsByClassName("snake-part");
    draw.snakeBit();

    if (sp.length > snake.size) {
      document.getElementById("game").removeChild(sp[0]);
      coords.shift();
    }
    if (game.startSize > snake.size) {
      draw.snakeBit();
      snake.size += 1;
    }
  },
  // Snake movement direction handler
  changeDirection: event => {
    if (event.keyCode == 38 && snake.direction != "DOWN") {
      snake.direction = "UP";
    } else if (event.keyCode == 39 && snake.direction != "LEFT") {
      snake.direction = "RIGHT";
    } else if (event.keyCode == 37 && snake.direction != "RIGHT") {
      snake.direction = "LEFT";
    } else if (event.keyCode == 40 && snake.direction != "UP") {
      snake.direction = "DOWN";
    }
  },
  // Speeds up the snake
  changeSpeed: () => {
    if (snake.speed >= 140) {
      snake.speed -= 3;
    } else if (snake.speed >= 120) {
      snake.speed -= 2;
    } else if (snake.speed > 100) {
      snake.speed -= 1;
    } else {
      snake.speed -= 0;
    }
    speedTimer.resume();
    clearInterval(movement);
    movement = setInterval(snake.move, snake.speed);
    console.log("Speed: " + snake.speed);
  },
  // Effects of colliding with treat
  treat: () => {
    snake.size += 1;
    draw.snakeBit();
    draw.updateScore();
  },
  // Maps coordinates for collision detection
  coordinate: (x, y) => {
    this.x = x;
    this.y = y;
    coords.push({
      x: this.x,
      y: this.y
    });
    // console.log("Added coords " + "X: " + x + " Y: " + y);
  }
};

//TREAT VARIABLES AND FUNCTIONS
treat = {
  color: "olivedrab",

  nr: 0, // Number of treats
  timer: game.startTreatTimer,
  x: game.treatX,
  y: game.treatY,

  // Generates a new treat in a random location
  reTreat: () => {
    let t = document.getElementById("treat");
    treat.x = Math.ceil(Math.random() * tilesX) * pixelSize - pixelSize;
    treat.y = Math.ceil(Math.random() * tilesY) * pixelSize - pixelSize;

    // Runs the function again if treat collides with snake
    for (i = 0; i < coords.length; i++) {
      if (treat.x == coords[i].x && treat.y == coords[i].y) {
        treat.reTreat();
      }
    }

    if (treat.x == snake.x && treat.y == snake.y) {
      treat.reTreat();
    }

    t.style.left = treat.x + "px";
    t.style.bottom = treat.y + "px";
    treatTimer.resume();
    // console.log("Treat X: " + treat.x + " Y: " + treat.y);
  }
};

//DOM ELEMENTS
draw = {
  game: () => {
    let b = document.createElement("div");
    b.setAttribute("id", "game");
    b.setAttribute(
      "style",
      "position:absolute; top:0; left:0; bottom:0; right:0; margin: auto;"
    );
    b.style.width = game.width + "px";
    b.style.height = game.height + "px";
    b.style.background = game.background;
    b.style.border = game.border;
    b.style.color = game.text;

    document.body.appendChild(b);
  },
  score: () => {
    let sc = document.createElement("div");
    sc.setAttribute("id", "score");
    sc.setAttribute(
      "style",
      "position:absolute; width:max-content; height:max-content; top:0; right:0; bottom:0; left:0; margin: auto; padding:5px; text-align:center;font-size:5em; opacity:0.8;"
    );
    sc.style.color = game.text;
    document.getElementById("game").appendChild(sc);
    score = 0;
    sc.innerHTML = score;
  },
  updateScore: () => {
    let sc = document.getElementById("score");
    if (score <= 10) {
      score += 2;
    } else if (score <= 20) {
      score += 3;
    } else if (score <= 40) {
      score += 4;
    } else if (score <= 60) {
      score += 5;
    } else if (score <= 80) {
      score += 6;
    } else if (score <= 120) {
      score += 7;
    } else if (score <= 150) {
      score += 8;
    } else if (score <= 180) {
      score += 9;
    } else if (score <= 210) {
      score += 10;
    } else if (score <= 240) {
      score += 11;
    } else {
      score += 12;
    }

    sc.innerHTML = score;
  },
  // Handles creating the snake head
  snakeHead: () => {
    let s = document.createElement("div");
    s.setAttribute("id", "snake-head");
    s.setAttribute(
      "style",
      "position:absolute; z-index:99; border-radius:10%;"
    );
    s.style.width = pixelSize + "px";
    s.style.height = pixelSize + "px";
    s.style.background = snake.color;
    s.style.border = snake.border;

    s.style.left = snake.x + "px";
    s.style.bottom = snake.y + "px";
    document.getElementById("game").appendChild(s);
    // console.log("Snake drawn!");
  },
  // Handles creating snake body parts
  snakeBit: () => {
    let s = document.createElement("span");
    s.setAttribute("class", "snake-part");
    s.setAttribute("style", "position:absolute; border-radius:15%");
    s.style.width = pixelSize + "px";
    s.style.height = pixelSize + "px";
    s.style.background = snake.childColor;
    if (snake.direction == "UP") {
      s.style.left = snake.x + "px";
      s.style.bottom = snake.y - pixelSize + "px";
      snake.coordinate(snake.x, snake.y - pixelSize);
    } else if (snake.direction == "RIGHT") {
      s.style.left = snake.x - pixelSize + "px";
      s.style.bottom = snake.y + "px";
      snake.coordinate(snake.x - pixelSize, snake.y);
    } else if (snake.direction == "LEFT") {
      s.style.left = snake.x + pixelSize + "px";
      s.style.bottom = snake.y + "px";
      snake.coordinate(snake.x + pixelSize, snake.y);
    } else if (snake.direction == "DOWN") {
      s.style.left = snake.x + "px";
      s.style.bottom = snake.y + pixelSize + "px";
      snake.coordinate(snake.x, snake.y + pixelSize);
    }
    document.getElementById("game").appendChild(s);
  },
  // Handles creating the treat
  treat: () => {
    let t = document.createElement("div");
    t.setAttribute("id", "treat");
    t.setAttribute("style", "position:absolute; border-radius:50%;");
    t.style.width = pixelSize + "px";
    t.style.height = pixelSize + "px";
    t.style.background = treat.color;

    treat.nr = treat.startNr;
    treat.x = game.treatX;
    treat.y = game.treatY;

    t.style.left = treat.x + "px";
    t.style.bottom = treat.y + "px";

    document.getElementById("game").appendChild(t);
    // console.log("Treat X: " + treat.x + " Treat Y: " + treat.y);
  }
};

// Timer with pause and resume function
function Timer(callback, delay) {
  var timerId,
    start,
    remaining = delay;

  this.pause = () => {
    window.clearTimeout(timerId);
    remaining -= new Date() - start;
  };

  this.resume = () => {
    start = new Date();
    window.clearTimeout(timerId);
    timerId = window.setTimeout(callback, remaining);
    remaining = delay;
  };
  this.resume();
}

// Treat relocation timer
treatTimer = new Timer(() => {
  treat.reTreat();
}, treat.timer);

// Snake speed timer
speedTimer = new Timer(() => {
  snake.changeSpeed();
}, snake.timer);

// Removes DOM elements
Element.prototype.remove = function() {
  this.parentElement.removeChild(this);
};
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
  for (var i = this.length - 1; i >= 0; i--) {
    if (this[i] && this[i].parentElement) {
      this[i].parentElement.removeChild(this[i]);
    }
  }
};

// Adds coords to all snake bits (unused)
addAllCoords = () => {
  let sp = document.getElementsByClassName("snake-part");
  if (coords.length > 0) {
    coords = [];
  }
  for (i = 0; i < sp.length; i++) {
    let x = parseInt(sp[i].style.left, 10);
    let y = parseInt(sp[i].style.bottom, 10);
    snake.coordinate(x, y);
    // console.log("All coords added");
  }
};

restart = () => {
  game.reset();
  initialize();
};

initialize = () => {
  draw.score();
  draw.snakeHead();
  draw.treat();
  game.start();
  console.log("Initialized!");
};

window.onload = () => {
  document.addEventListener("keydown", game.pause);
};

draw.game();
initialize();
