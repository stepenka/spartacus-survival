/* global loadImage createCanvas noStroke background
  fill circle mouseX mouseY constrain width height
  collideCircleCircle noLoop
*/
let backgroundImage;
let playerSprite;
let enemySprite;
let health = 100;
let time = 0

const healthSpan = document.querySelector("#health");
const doneSpan = document.querySelector("#done");
const timeSpan = document.querySelector("#time")

function preload() {
  backgroundImage = loadImage(
    "https://cdn.glitch.com/53425554-0002-4013-9c81-3be8968bd80c%2Fsand.jpg?v=1608110644671"
  );
  playerSprite = loadImage(
    "https://cdn.glitch.com/53425554-0002-4013-9c81-3be8968bd80c%2Fgladiator.png?v=1608109851745"
  );
  enemySprite = loadImage(
    "https://cdn.glitch.com/53425554-0002-4013-9c81-3be8968bd80c%2Flions.png?v=1608109992298"
  );
}

setInterval(function(){
  time +=1}, 1000)

function setup() {
  game.initialize();
}

function draw() {
  game.update();
}

function mouseMoved() {
  game.mouseMoved();
}

class Field {
  constructor(width, height, color) {
    Object.assign(this, { width, height, color });
  }
  clear() {
    background(backgroundImage);
  }
  clamp(x, y) {
    return { x: constrain(x, 0, this.width), y: constrain(y, 0, this.height) };
  }
}

class Agent {
  constructor(x, y, speed, target, diameter) {
    Object.assign(this, { x, y, speed, target, diameter });
  }
  move(field) {
    const [dx, dy] = [this.target.x - this.x, this.target.y - this.y];
    const distance = Math.hypot(dx, dy);
    if (distance > 1) {
      const step = this.speed / distance;
      Object.assign(this, field.clamp(this.x + step * dx, this.y + step * dy));
    }
  }
  collidesWith(other) {
    return collideCircleCircle(
      this.x,
      this.y,
      this.diameter,
      other.x,
      other.y,
      other.diameter
    );
  }
}

class Player extends Agent {
  constructor(x, y, speed, target) {
    super(x, y, speed, target, 10);
  }
  draw() {
    image(playerSprite, this.x, this.y, this.diameter * 2, 40);
  }
}

class Enemy extends Agent {
  constructor(x, y, speed, target) {
    super(x, y, speed, target, 20);
  }
  draw() {
    image(enemySprite, this.x, this.y, this.diameter * 3, 40);
  }
}

const game = {
  initialize() {
    createCanvas(400, 400);
    this.field = new Field(width, height, "lightgreen");
    this.mouse = { x: 0, y: 0 };
    this.player = new Player(20, 20, 2.5, this.mouse);
    this.enemies = [
      new Enemy(4, 5, 2, this.player),
      new Enemy(94, 95, 1.5, this.player),
      new Enemy(400, 503, 1.8, this.player)
    ];
  },
  mouseMoved() {
    Object.assign(this.mouse, { x: mouseX, y: mouseY });
  },
  checkForCollisions() {
    for (let enemy of this.enemies) {
      if (enemy.collidesWith(this.player)) {
        health -= 1;
      }
    }
  },
  update() {
    this.field.clear();
    for (let agent of [this.player, ...this.enemies]) {
      agent.move(this.field);
      agent.draw();
    }
    this.checkForCollisions();
    timeSpan.textContent = time + " seconds"
    healthSpan.textContent = health;
    if (health <= 0) {
     doneSpan.textContent = "GAME OVER" 
      noLoop();
    }
  }
};
