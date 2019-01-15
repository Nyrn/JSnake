const pixelSize = 30;
const tilesX = 25;
const tilesY = 20;

let overlay;
let play;
let movement;
let levelTimer;
let treatTimer;
let coords = [];

// GAME VARIABLES AND FUNCTIONS
game = {
  // Difficulty level (must be at least 1)
  startLevel: 1,
  // Snake movement by pixelSize interval in milliseconds
  startSpeed: 140,
  // Snake starting size (not including snake head)
  startSize: 1,
  // Snake starting direction
  startDirection: "UP",
  // Snake horizontal starting location
  snakeX: Math.floor(tilesX / 2) * pixelSize,
  // Snake vertical starting location
  snakeY: 0,
  // Level snake speed interval reduction in milliseconds
  // Runs length of game.colors array times (currently 21)
  levelSpeed: 2,
  // Level change interval in milliseconds
  levelInterval: 12000,
  // Treat relocation interval in milliseconds
  treatTimer: 15000,
  // Treat horizontal starting location
  treatX: Math.ceil(Math.random() * tilesX) * pixelSize - pixelSize, //Math.floor(tilesX / 2) * pixelSize,
  // Treat vertical starting location
  treatY: Math.ceil(Math.random() * tilesY) * pixelSize - pixelSize, //pixelSize * 4,
  // Game board width in pixels
  width: tilesX * pixelSize,
  // Game board height in pixels
  height: tilesY * pixelSize,

  // Snake head color
  snakeHeadColor: "black",
  // Snake body color
  snakeBodyColor: "green",
  // Treat color
  treatColor: "olivedrab",
  // Board background ,text color, border
  background: "white",
  text: "black",
  border: "1px solid ",
  boxShadow: "0 0 20px ",
  // Board border and box shadow colors
  colors: [
    "#57bb8a",
    "#63b682",
    "#73b87e",
    "#84bb7b",
    "#94bd77",
    "#a4c073",
    "#b0be6e",
    "#c4c56d",
    "#d4c86a",
    "#e2c965",
    "#f5ce62",
    "#f3c563",
    "#e9b861",
    "#e6ad61",
    "#ecac67",
    "#e9a268",
    "#e79a69",
    "#e5926b",
    "#e2886c",
    "#e0816d",
    "#dd776e"
  ],

  // Overlay background, text color, border, opacity
  overlayColor: "white",
  overlayTextColor: "black",
  overlayBorder: "1px solid silver",
  overlayOpacity: "0.9",
  // Speeds up the snake
  updateLevel: () => {
    snake.speed = game.startSpeed - level * game.levelSpeed;
    draw.updateColor();

    if (play == true) {
      levelTimer.resume();
      clearInterval(movement);
      movement = setInterval(snake.move, snake.speed);
    }

    console.log("Level: " + level + " Speed: " + snake.speed);
  },
  // Start and stop the game with spacebar
  pause: () => {
    if (event.keyCode == 32) {
      if (play == true) {
        game.stop();
        draw.overlay();
      } else if (play == false) {
        game.start();
        if (overlay == true) {
          document.getElementById("overlay").remove();
          overlay = false;
        }
      }
    }
  },
  // Start the game
  start: () => {
    clearInterval(movement);
    movement = setInterval(snake.move, snake.speed);
    document.addEventListener("keydown", snake.directionHandler);
    treatTimer.resume();
    levelTimer.resume();
    play = true;
  },
  // Pause the game
  stop: () => {
    clearInterval(movement);
    document.removeEventListener("keydown", snake.directionHandler);
    treatTimer.pause();
    levelTimer.pause();
    play = false;
  },
  // Reset the game to initial state
  reset: () => {
    if (best < score) {
      best = score;
      bestLevel = level;
    }
    score = 0;
    level = game.startLevel;
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

let score = 0;
let best = 0;
let level = game.startLevel;
let bestLevel = game.startLevel;

// SNAKE VARIABLES AND FUNCTIONS
snake = {
  size: game.startSize,
  direction: game.startDirection,
  timer: game.levelInterval,
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
      // console.log("Ran into a wall");
      restart();
    }

    // Checks if snake head collides with body
    for (i = 0; i < coords.length; i++) {
      if (snake.x == coords[i].x && snake.y == coords[i].y) {
        // console.log("Touched yourself");
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
  directionHandler: event => {
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
  // Number of treats
  timer: game.treatTimer,
  x: game.treatX,
  y: game.treatY,

  // Generates a new treat in a random location
  reTreat: () => {
    let t = document.getElementById("treat");
    treat.x = Math.ceil(Math.random() * tilesX) * pixelSize - pixelSize;
    treat.y = Math.ceil(Math.random() * tilesY) * pixelSize - pixelSize;

    // Generates a new treat if treat collides with snake body
    for (i = 0; i < coords.length; i++) {
      if (treat.x == coords[i].x && treat.y == coords[i].y) {
        treat.reTreat();
      }
    }
    // Generates a new treat if treat collides with snake head
    if (treat.x == snake.x && treat.y == snake.y) {
      treat.reTreat();
    }

    // Puts treat in generated location
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
    b.style.boxShadow = game.boxShadow;

    document.body.appendChild(b);
  },
  overlay: () => {
    //Container
    let ov = document.createElement("div");
    ov.setAttribute("id", "overlay");
    ov.setAttribute(
      "style",
      "position:absolute; width:90%; height:90%; top:0; right:0; bottom:0; left:0; margin: auto; padding:5px; text-align:center; z-index: 100; border-radius:10%;"
    );
    ov.style.background = game.overlayColor;
    ov.style.color = game.overlayTextColor;
    ov.style.border = game.overlayBorder;
    ov.style.opacity = game.overlayOpacity;

    document.getElementById("game").appendChild(ov);
    //Container for overlay
    let ovContainer = document.createElement("div");
    ovContainer.setAttribute("id", "overlay-container");
    ovContainer.setAttribute(
      "style",
      "position:absolute; width: max-content; height:max-content; right:0; bottom:0; top:0; left:0; margin: auto; padding:5px; text-align:center; z-index: 100;"
    );
    document.getElementById("overlay").appendChild(ovContainer);
    //overlay "How to play" h1
    let ovHow = document.createElement("h1");
    ovHow.setAttribute(
      "style",
      "width:max-content; height:max-content; border-bottom:1px solid silver; padding: 0.5rem; right:0; left:0; margin: auto;"
    );
    ovHow.innerHTML = "HOW TO PLAY";
    document.getElementById("overlay-container").appendChild(ovHow);
    // overlay first p
    let ovHowText1 = document.createElement("p");
    ovHowText1.setAttribute(
      "style",
      "width:auto; margin:0 auto; padding: 0.5rem; margin-top:0.5rem;"
    );
    ovHowText1.innerHTML = "<strong>JSnake</strong> is a classical snake game.";
    document.getElementById("overlay-container").appendChild(ovHowText1);
    // overlay second p
    let ovHowText2 = document.createElement("p");
    ovHowText2.setAttribute(
      "style",
      "width:auto; margin:0 auto; padding: 0.5rem;"
    );
    ovHowText2.innerHTML = "";
    document.getElementById("overlay-container").appendChild(ovHowText2);
    // overlay third p
    let ovHowText3 = document.createElement("p");
    ovHowText3.setAttribute(
      "style",
      "width:auto; margin:0 auto; padding: 0.2rem;"
    );
    ovHowText3.innerHTML =
      "<strong>Move</strong> with <strong>ARROW KEYS</strong>.";
    document.getElementById("overlay-container").appendChild(ovHowText3);
    // overlay fourth p
    let ovHowText4 = document.createElement("p");
    ovHowText4.setAttribute(
      "style",
      "width:auto; margin:0 auto; padding: 0.2rem; margin-top:1rem;"
    );
    ovHowText4.innerHTML =
      "<strong>Pause</strong> and <strong>resume</strong> the game with <strong>SPACEBAR</strong>.";
    document.getElementById("overlay-container").appendChild(ovHowText4);
    // Overlay fifth p
    let ovHowTex5 = document.createElement("p");
    ovHowTex5.setAttribute(
      "style",
      "width:auto; margin:0 auto; padding: 0.2rem; margin-top:1rem;"
    );
    ovHowTex5.innerHTML = "Press <strong>SPACEBAR</strong> to begin!";
    document.getElementById("overlay-container").appendChild(ovHowTex5);
    // Overlay About h1
    let ovAbout = document.createElement("h1");
    ovAbout.setAttribute(
      "style",
      "width:max-content; margin:0 auto; border-bottom:1px solid silver; padding: 0.5rem; margin-top:2rem;"
    );
    ovAbout.innerHTML = "About";
    document.getElementById("overlay-container").appendChild(ovAbout);
    // Overlay About p
    let ovAbout1 = document.createElement("p");
    ovAbout1.setAttribute(
      "style",
      "width:auto; bottom:0; margin:0 auto; padding: 1rem;"
    );
    ovAbout1.innerHTML = "Made with <strong>Javascript</strong>";
    document.getElementById("overlay-container").appendChild(ovAbout1);
    // Overlay About a with link
    let ovAbout2 = document.createElement("a");
    ovAbout2.setAttribute(
      "style",
      "width:auto; bottom:0; margin:0 auto; padding: 0; text-decoration:none;"
    );
    ovAbout2.setAttribute("href", "https://github.com/Nyrn");
    ovAbout2.innerHTML = "<i>by <strong>Nyrn</strong></i>";
    document.getElementById("overlay-container").appendChild(ovAbout2);

    //Displays best score
    let bestScore = document.createElement("div");
    bestScore.setAttribute("id", "best-score");
    bestScore.setAttribute(
      "style",
      "position:absolute; width: max-content; height:max-content; right:10%; bottom:5%; font-size:2rem; text-align:center; z-index: 100; "
    );
    bestScore.innerHTML = "Best: ";

    let bestScoreNum = document.createElement("span");
    bestScoreNum.style.color = game.colors[bestLevel - 1];
    bestScoreNum.innerHTML = best;

    document.getElementById("overlay").appendChild(bestScore);
    document.getElementById("best-score").appendChild(bestScoreNum);

    //Displays the current level
    let currentLevel = document.createElement("div");
    currentLevel.setAttribute("id", "current-level");
    currentLevel.setAttribute(
      "style",
      "position:absolute; width: max-content; height:max-content; left:10%; bottom:5%; font-size:2rem; text-align:center; z-index: 100; "
    );
    currentLevel.innerHTML = "Level: ";

    let currentLevelNum = document.createElement("span");
    currentLevelNum.style.color = game.colors[level - 1];
    currentLevelNum.innerHTML = level;

    document.getElementById("overlay").appendChild(currentLevel);
    document.getElementById("current-level").appendChild(currentLevelNum);

    overlay = true;
    play = false;
  },
  // Score DOM element
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
  // Updates current score
  updateScore: () => {
    let sc = document.getElementById("score");
    score += Math.ceil((level / 2) * snake.size);

    sc.innerHTML = score;
  },
  // Updates the color of board border and box-shadow
  updateColor: () => {
    let b = document.getElementById("game");

    b.style.border = game.border + game.colors[level - 1];
    b.style.boxShadow = game.boxShadow + game.colors[level - 1];
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
    s.style.background = game.snakeHeadColor;
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
    s.style.background = game.snakeBodyColor;
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
    t.style.background = game.treatColor;

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
levelTimer = new Timer(() => {
  if (level < game.colors.length) {
    level += 1;
    game.updateLevel();
  }
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
  }
  // console.log("All coords added");
};

restart = () => {
  game.reset();
  initialize();
};

initialize = () => {
  draw.overlay();
  draw.score();
  game.updateLevel();
  draw.snakeHead();
  draw.treat();
  game.stop();
  console.log("Initialized!");
};

window.onload = () => {
  document.addEventListener("keydown", game.pause);
};

draw.game();
initialize();
