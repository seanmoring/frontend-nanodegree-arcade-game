// There is some commonality between the Enemy class
// and the Player class, so I am creating a superclass
// GamePiece that will contain the common parts and allow for more code re-use
var GamePiece = function(x, y, image) {
    // All pieces on the game board will have an x,y position
    this.x = x;
    this.y = y;

    // All pieces on the game board will also need to maintain their initial
    // x,y position in order to deal with game resets
    this.initialX = x;
    this.initialY = y;

    // All pieces on the game board have an image and the logic for drawing it
    // is the same for all classes
    this.image = image;
}

GamePiece.prototype.reset = function() {
    this.x = this.initialX;
    this.y = this.initialY;
}

// Draw the GamePiece on the screen
GamePiece.prototype.render = function() {
    ctx.drawImage(Resources.get(this.image), this.x, this.y);
}

var Gem = function(x, y, colour) {
    if (colour == "blue") {
        GamePiece.call(this, x, y, 'images/Gem Blue.png');
    }
    if (colour == "green") {
        GamePiece.call(this, x, y, 'images/Gem Green.png');
    }
    if (colour == "orange") {
        GamePiece.call(this, x, y, 'images/Gem Orange.png');
    }
    this.visible = true;
}

// Set up the superclass look up accosting to the prototypical
// class pattern
Gem.prototype = Object.create(GamePiece.prototype);
Gem.prototype.constructor = Gem;

Gem.prototype.playerPickup = function(player) {
    if ((this.x == player.x) && (this.y == player.y)) {
        this.visible = false;
    }
}

// Extending the render function so that the gem is
// only drawn if it is visible
Gem.prototype.render = function() {
    if (this.visible) {
        GamePiece.prototype.render.call(this);
    }
}

Gem.prototype.reset = function() {
    // let the super classes' reset handle the common
    // logic of the reset
    GamePiece.prototype.reset.call(this);

    // in this method, we just need to worry
    // about reseting the values specific to this
    // class back to their original states
    this.visible  = true;
}


// Enemies our player must avoid
var Enemy = function(lane, speed) {
    GamePiece.call(this, 0, lane, 'images/enemy-bug.png');
    this.speed = speed;
}

// Set up the superclass look up according to the prototypical
// class pattern
Enemy.prototype = Object.create(GamePiece.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = (this.x + (this.speed*dt)) % 505;
}



// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // Call the constructor of the super class
    // the initial x and y position were obtained
    // through trial and error.
    GamePiece.call(this, 200, 320, 'images/char-boy.png');
    
    // on construction the player object will be in a position
    // where none of the max constraints on his movement apply
    this.maxLeft  = false;
    this.maxRight = false;
    this.maxUp    = false;
    this.maxDown  = false;
}

// Set up the superclass look up accosting to the prototypical
// class pattern
Player.prototype = Object.create(GamePiece.prototype);
Player.prototype.constructor = Enemy;


Player.prototype.update = function() {
}

Player.prototype.reset = function() {
    // let the super classes' reset handle the common
    // logic of the reset
    GamePiece.prototype.reset.call(this);

    // in this method, we just need to worry
    // about reseting the values specific to this
    // class back to their original states
    this.maxLeft  = false;
    this.maxRight = false;
    this.maxUp    = false;
    this.maxDown  = false;
}

Player.prototype.handleInput = function(x) {

    if ((x == 'up') && (this.maxUp == false)) {
        // if we get an up command and there's still
        // room to move up... then move up
        this.y = this.y - 82;

        // adjust the maxDown variable
        // because we're not at the downward most
        // position anymore
        if (this.maxDown) {
            this.maxDown = false;
        }

        // If we've hit the top, then set maxUp to true
        if (this.y == (this.initialY - (4*82))) {
            this.maxUp = true;
        }
    }
    else if ((x == 'down') && (this.maxDown == false)) {
        // if we are commanded down and there's still room to move,
        // then move down
        this.y = this.y + 82;

        // since we've moved off the maxUp position
        // toggle maxUp
        if (this.maxUp) {
            this.maxUp = false;
        }

        // if we are now in the bottom most position
        // set maxDown to be true
        if (this.y == (this.initialY + 82)) {
            this.maxDown = true;
        }
    } else if ((x == 'left') && (this.maxLeft == false)) {
        // if we're commanded left and there's room to move
        // left then move left
        this.x = this.x - 100;

        // if we were in the max right position, we're not
        // anymore because we've moved left, so set maxRight
        // accordingly
        if (this.maxRight) {
            this.maxRight = false;
        }

        // if we've moved into the maxLeft position then
        // set the maxLeft variable accordingly
        if (this.x == (this.initialX - 200)) {
            this.maxLeft = true;
        }
    } else if ((x == 'right') && (this.maxRight == false)) {
        // if we're commanded right and there's room to move
        // right then move right
        this.x = this.x + 100;

        // if we were in the maxLeft position, we're not
        // anymore because we've now moved right, so set maxLeft
        // accordingly
        if (this.maxLeft) {
            this.maxLeft = false;
        }

        // if we've moved into the maxRight position,
        // then set the variable accordingly.
        if (this.x == (this.initialX + 200)) {
            this.maxRight = true;
        }
    }
}

Player.prototype.inSameRow = function(enemy) {

    // this is a little terse; what's happening is the sprites and the player will be in the same lane even though their
    // respective y values are a little off. Enemies with a y value of 230 and Players with a y value of 238 are in the bottom lane.
    // Enemies with a y value of 140 and Players with a y value are in the middle lane. Enemies with a y value of 60 and Players with
    // with a y value of 74 are in the top lane.
    return (((enemy.y == 230) && (this.y == 238)) || ((enemy.y == 140) && (this.y == 156)) || ((enemy.y == 60) && (this.y == 74)));
}

Player.prototype.inSameColumn = function(enemy) {

    // calculate the bounds of the enemy and the player
    var enemyLeft = enemy.x - 46;
    var enemyRight = enemy.x + 46;
    var playerLeft = player.x - 38;
    var playerRight = player.x + 38;

    // unless the enemy's gone past the player or has not
    // yet reached the player, then there will be a collision.
    return !((enemyLeft > playerRight) || (enemyRight < playerLeft));    
}

Player.prototype.collideWithEnemy = function(enemy) {
    // if the Player is in the same row and column as an enemy then they've collided.
    if (this.inSameRow(enemy) && this.inSameColumn(enemy)) {
        return true;
    }
    // if the tests above aren't satisfied, then there was no
    // collision.
    return false;
}

Player.prototype.pickupGem = function(gem) {
    gem.playerPickup(this);
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [
    new Enemy(230,60),
    new Enemy(60, 180),
    new Enemy(140, 300),
    new Enemy(60, 240)
];

var allGems = [
    new Gem(0, 238, "blue"),
    new Gem(100, 156, "green"),
    new Gem(300, 74, "orange"),
    new Gem(200, 74, "green"),
    new Gem(400, 156, "orange")
];

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
