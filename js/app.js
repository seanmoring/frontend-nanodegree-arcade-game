// Enemies our player must avoid
var Enemy = function(lane, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = 0;
    this.y = lane;	
    this.speed = speed;

    // We'll need to store the initial x and y position if the game is to be reset 
    // in the event of a collision
    this.initialX = this.x;
    this.initialY = this.y;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = (this.x + this.speed) % 505;
    //this.y = this.y + 10;
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Enemy.prototype.reset = function() {
    this.x = this.initialX;
    this.y = this.initialY;
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {

    // setting the x and y position
    this.x = 200;
    this.y = 320;

    // setting the initial x and y position for the 
    // situations where we need a game reset
    this.initialX = this.x;
    this.initialY = this.y;

    // on construction the player object will be in a position 
    // where none of the max constraints on his movement apply
    this.maxLeft = false;
    this.maxRight = false;
    this.maxUp = false;
    this.maxDown = false;

    this.player = 'images/char-boy.png';
}

Player.prototype.update = function() {
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.player), this.x, this.y); 
}

Player.prototype.reset = function() {
    this.x = this.initialX;
    this.y = this.initialY;
}

Player.prototype.handleInput = function(x) {
   
    if ((x == 'up') && (this.maxUp == false)) {
        this.y = this.y - 82;
        if (this.maxDown) {
            this.maxDown = false;
        }
        if (this.y == (this.initialY - (4*82))) {
            this.maxUp = true; 
        }
    } else if ((x == 'down') && (this.maxDown == false)) {
        this.y = this.y + 82;
        if (this.maxUp) {
            this.maxUp = false;
        }
        if (this.y == (this.initialY + 82)) {
            this.maxDown = true;
        }
    } else if ((x == 'left') && (this.maxLeft == false)) { 
        this.x = this.x - 100;
        if (this.maxRight) {
            this.maxRight = false;
        }
        if (this.x == (this.initialX - 200)) {
            this.maxLeft = true;
        }
    } else if ((x == 'right') && (this.maxRight == false)) {
        this.x = this.x + 100;
        if (this.maxLeft) {
            this.maxLeft = false;
        }
        if (this.x == (this.initialX + 200)) {
            this.maxRight = true;
        }
    }
}

Player.prototype.inSameRow = function(enemy) {
    return (((enemy.y == 230) && (this.y == 238)) || ((enemy.y == 140) && (this.y == 156)) || ((enemy.y == 60) && (this.y == 74)));
}

Player.prototype.inSameColumn = function(enemy) {
    return ((enemy.x > this.x) && ((enemy.x - this.x ) <= enemy.speed ));  
}

Player.prototype.collideWithEnemy = function(enemy) {
    //console.log("is collision?");    
    //console.log(enemy);
    if (this.inSameRow(enemy) && this.inSameColumn(enemy)) {
        console.log("COLLISION!");
        return true;
    }
    return false; 
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(230,1), new Enemy(60, 3), new Enemy(140, 5), new Enemy(230, 2), new Enemy(60, 4)];
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
