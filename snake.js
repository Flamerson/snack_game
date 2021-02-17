const board_border = 'black';
const board_background = "white";
const snake_col = 'lightblue';
const snake_border = 'darkblue';

// the snake drawing in px
let snake = [ 
    {x: 200, y: 200}, 
    {x: 190, y: 200}, 
    {x: 180, y: 200}, 
    {x: 170, y: 200}, 
    {x: 160, y: 200}
]

let score = 0;
// true if changin direction
let changing_direction = false;
// food drop
let food_x;
let food_y;
//horizontal velocity
let dx = 10;
// vertical velocity
let dy = 0;

// Get the canvas element
const snakeboard = document.getElementById("stage");
// return a two dimensional drawing context
const snakeboard_ctx = snakeboard.getContext("2d");
//start game
main();

DeadName();


gen_food();

//waiting the player press an key
document.addEventListener("keydown", change_direction );

// function called to keep running game
function main() {
    if (has_game_ended()) return;

    changing_direction = false;
    setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        move_snake();
        drawSnake();
        //call main again
        main();
    }, 100)
}

function DeadName() {
    // get the components from html for show dead in screen
    var Rename = document.getElementById("Dead");
    var buton = document.getElementById("Btn");
    setInterval(function(){
        if ( has_game_ended() == false ){
            Rename.style.display = "none";
            buton.style.display = "none";
        } else {
            Rename.style.display = "block";
            buton.style.display = "inline";
        }
    },100);
}



//draw a border around the canvas
function clearCanvas() {
    // select the colour to fill the drawing
    snakeboard_ctx.fillStyle = board_background;
    // select the colour for the border of the canvas
    snakeboard_ctx.strokestyle = board_border;
    // draw a "filled" rectangle to cover the entire canvas
    snakeboard_ctx.fillRect(0,0, snakeboard.width, snakeboard.height);
    // Draw a "border" around the entire canvas
    snakeboard_ctx.strokeRect(0,0, snakeboard.width , snakeboard.height);
}

// Draw one snake part 
function drawSnake() {
    // draw each part
    snake.forEach(drawSnakePart)
}

function drawFood() {
    snakeboard_ctx.fillStyle = 'lightgreen';
    snakeboard_ctx.strokestyle = 'darkgreen';
    snakeboard_ctx.fillRect(food_x, food_y, 10, 10);
    snakeboard_ctx.strokeRect(food_x, food_y, 10, 10);
}

// draw one snake part
function drawSnakePart(snakePart) {

    //set the colour of the snake part
    snakeboard_ctx.fillStyle = snake_col;
    //set the border colour of the snake part
    snakeboard_ctx.strokestyle = snake_border;
    // the part is located
    snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    //draw a border around the snake part
    snakeboard_ctx.strokeRect(snakePart.x , snakePart.y, 10 ,10 );
}

function has_game_ended() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > snakeboard.width - 10;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > snakeboard.height - 10;
    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall
}

function random_food(min, max) {
    return Math.round((Math.random() * (max-min) + min) / 10) * 10;
}

function gen_food() {
    // generate a random number the food x-coordinate
    food_x = random_food(0, snakeboard.width - 10);
    // generate a random number the food y-coordinate
    food_y = random_food(0, snakeboard.height - 10);
    // if the new food location is where the snake currently is , generate a new food location
    snake.forEach(function has_snake_eaten_food(part) {
        const has_eaten = part.x == food_x && part.y == food_y;
        if (has_eaten) gen_food();
    });
}

function change_direction(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    // prevent the snake from reversing

    if (changing_direction) return;
    changing_direction = true;
    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;
    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }
}


function move_snake() {
    //create the new snake's head
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    // add the new head to the beginnig of snake body
    snake.unshift(head);
    const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
    if (has_eaten_food) {
        // increase score
        score += 10;
        // display score on screen
        document.getElementById('score').innerHTML = score;
        // generate new food location
        gen_food();
    }else {
        //remove the last part of snake body
        snake.pop();

    }
}
