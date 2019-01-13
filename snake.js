const pixelSize = 25;
const tilesX = 25;
const tilesY = 20;


let speedTimer;
let treatTimer;
let movement;
play = true;


let coords = [];



// OBJECTS

game = {
  width: tilesX * pixelSize,
  height: tilesY * pixelSize,
  border: "1px solid #1a1a1a",

  startSpeed: 200,
  startDirection: "UP",
  startX: Math.floor(tilesX / 2) * pixelSize,
  startY: 0,
  startSize: 1,

  pause: () => {
    if (event.keyCode == 32) {
      if (play == true) {
        game.stop();
      } else if (play == false) {
        game.start();
      }
    }
  },
  start: () => {
    clearInterval(movement);
    movement = setInterval(snake.move, snake.speed);
    document.addEventListener("keydown", snake.changeDirection);
    treatTimer.resume();
    speedTimer.resume();
    play = true;
  },
  stop: () => {
    clearInterval(movement);
    document.removeEventListener("keydown", snake.changeDirection);
    treatTimer.pause();
    speedTimer.pause();
    play = false;
  },
  reset: () => {
    snake.speed = game.startSpeed;
    snake.direction = game.startDirection;
    snake.x = game.startX;
    snake.y = game.startY;
    snake.size = game.startSize;
    document.getElementById("score").remove();
    document.getElementById("snake-head").remove();
    document.getElementById("treat").remove();
    document.getElementsByClassName("snake-part").remove();
    clearInterval(movement);
    coords = [];
  }
};

snake = {
  color: "black",
  childColor: "green",

  size: 1,
  direction: game.startDirection,
  timer: 10000,
  speed: game.startSpeed,
  x: game.startX,
  y: game.startY,

  move: () => {
    let s = document.getElementById("snake-head");
    if (snake.direction == "UP") {
      snake.y += pixelSize;
      snake.draw();
    } else if (snake.direction == "RIGHT") {
      snake.x += pixelSize;
      snake.draw();
    } else if (snake.direction == "LEFT") {
      snake.x -= pixelSize;
      snake.draw();
    } else if (snake.direction == "DOWN") {
      snake.y -= pixelSize;
      snake.draw();
    }

    if (treat.x == snake.x && treat.y == snake.y) {
      snake.treat();
      treat.reTreat();
    } else if (snake.x >= game.width || snake.x < 0 || snake.y >= game.height || snake.y < 0) {
      // alert("GAME OVER!");
      console.log("game over");
      restart();
    }

    let head = coords.length - 1;
    for (i = 0; i < head; i++) {
      if (coords[i].x == coords[head].x && coords[i].y == coords[head].y) {
        alert("GAME OVER!");
        console.log("game over");
        // restart(); 
      }
    }
    coords.shift();
    s.style.left = snake.x + "px";
    s.style.bottom = snake.y + "px";


    // console.log("Snake X: " + snake.x + " Y: " + snake.y);
    console.log(coords, head);
  },
  draw: () => {
    let sp = document.getElementsByClassName("snake-part");

    draw.snakeBit();
    if (sp.length >= snake.size) {
      sp[0].parentNode.removeChild(sp[0]);
    }


  },
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
    // speedTimer.resume();
    clearInterval(movement);
    movement = setInterval(snake.move, snake.speed);
    console.log("Speed: " + snake.speed);
  },
  treat: () => {
    snake.size += 1;
    draw.snakeBit();
    draw.updateScore();
  },
  coordinate: (x, y) => {

    this.x = x;
    this.y = y;

    coords.push({
      x: this.x,
      y: this.y
    });
  }
}

treat = {

  startX: Math.floor(tilesX / 2) * pixelSize,
  startY: pixelSize * 4,
  color: "olivedrab",

  nr: 0,
  x: 0,
  y: 0,
  timer: 15000,

  reTreat: () => {
    let t = document.getElementById("treat");
    treat.x = Math.ceil(Math.random() * tilesX) * pixelSize - pixelSize;
    treat.y = Math.ceil(Math.random() * tilesY) * pixelSize - pixelSize;
    t.style.left = treat.x + "px";
    t.style.bottom = treat.y + "px";
    treatTimer.resume();
    console.log("Treat X: " + treat.x + " Y: " + treat.y);
  },
};

//DRAW
draw = {
  game: () => {
    let b = document.createElement("div");
    b.setAttribute("id", "game");
    b.setAttribute("style", "position:absolute; top:0; left:0; bottom:0; right:0; margin: auto;");
    b.style.width = game.width + "px";
    b.style.height = game.height + "px";
    b.style.border = game.border;

    document.body.appendChild(b);
  },
  score: () => {
    let sc = document.createElement("div");
    sc.setAttribute("id", "score");
    sc.setAttribute("style", "position:absolute; width:max-content; height:max-content; top:0; right:0; bottom:0; left:0; margin: auto; padding:5px; border:1px solid white; text-align:center;font-size:5em; color:black; opacity:0.8;");

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
  snakeHead: () => {
    let s = document.createElement("div");
    s.setAttribute("id", "snake-head");
    s.setAttribute("style", "position:absolute; z-index:99;");
    s.style.width = pixelSize + "px";
    s.style.height = pixelSize + "px";
    s.style.background = snake.color;
    s.style.border = snake.border;

    // snake.size = 1;
    // snake.speed = game.startSpeed;
    // snake.direction = game.startDirection;
    // snake.x = game.startX;
    // snake.y = game.startY;

    s.style.left = snake.x + "px";
    s.style.bottom = snake.y + "px";
    snake.coordinate(snake.x, snake.y);
    document.getElementById("game").appendChild(s);
    // console.log("Snake drawn!");
  },

  snakeBit: () => {
    let s = document.createElement("span");
    let c = coords.length - 1;
    s.setAttribute("class", "snake-part");
    s.setAttribute("style", "position:absolute;");
    s.style.width = pixelSize + "px";
    s.style.height = pixelSize + "px";
    s.style.background = snake.childColor;

    snake.coordinate(snake.x, snake.y);

    // s.style.left = snake.x + "px";
    s.style.left = coords[c].x + "px";
    // s.style.bottom = snake.y + "px";
    s.style.bottom = coords[c].y + "px";


    document.getElementById("game").appendChild(s);
  },
  treat: () => {
    let t = document.createElement("div");
    t.setAttribute("id", "treat");
    t.setAttribute("style", "position:absolute; border-radius:50%;");
    t.style.width = pixelSize + "px";
    t.style.height = pixelSize + "px";
    t.style.background = treat.color;

    treat.nr = treat.startNr;
    treat.x = treat.startX;
    treat.y = treat.startY;

    t.style.left = treat.x + "px";
    t.style.bottom = treat.y + "px";

    document.getElementById("game").appendChild(t);
    // console.log("Treat drawn!");
    console.log("Treat X: " + treat.x + " Treat Y: " + treat.y);
  }
}

let score = treat.nr;

function Timer(callback, delay) {
  var timerId, start, remaining = delay;

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
}


treatTimer = new Timer(() => {
  treat.reTreat();
}, treat.timer);

speedTimer = new Timer(() => {
  snake.changeSpeed();
}, snake.timer);

Element.prototype.remove = function () {
  this.parentElement.removeChild(this);
}

NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
  for (var i = this.length - 1; i >= 0; i--) {
    if (this[i] && this[i].parentElement) {
      this[i].parentElement.removeChild(this[i]);
    }
  }
}

restart = () => {
  game.reset();
  initialize();
}

initialize = () => {
  draw.game();
  draw.score();
  draw.snakeHead();
  draw.treat();
  game.start();
  console.log("Initialized!");
};

window.onload = () => {
  document.addEventListener("keydown", game.pause);
}

initialize();