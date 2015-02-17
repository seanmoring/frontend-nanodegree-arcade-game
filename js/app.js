// Enemies our player must avoid
var Enemy = function(lane, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = 0;
    this.y = lane;	
    this.speed = speed;

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

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.x = 200;
    this.y = 320;
    this.player = 'images/char-boy.png';
}

Player.prototype.update = function() {
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.player), this.x, this.y); 
}

Player.prototype.handleInput = function(x) {
    //console.log(x);
    if (x == 'up') {
        this.y = this.y - 85;
        console.log(this.y);
    } else if (x == 'down' ) {
        this.y = this.y + 85;
    } else if (x == 'left' ) {
        this.x = this.x - 100;
    } else if (x == 'right' ) {
        this.x = this.x + 100;
    }
}

Player.prototype.inSameRow = function(enemy) {
    //console.log(enemy.y);
    return ((enemy.y == 230) && (this.y == 235));
}

Player.prototype.inSameColumn = function(enemy) {
    return (enemy.x == this.x);
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
var allEnemies = [new Enemy(230,1)]; //new Enemy(60, 1), new Enemy(140, 5), new Enemy(230, 3), new Enemy(60, 3)];
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
