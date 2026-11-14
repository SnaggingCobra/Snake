const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;

let snake;
let apple;
let bomb;
let direction;
let score;
let gameover;

const appleImage = new Image();
appleImage.src = "APPLE.png";

const bombImage = new Image();
bombImage.src = "BOMB.png";

const snakeHeadImage = new Image();
snakeHeadImage.src = "SNAKE-HEAD.png";

const snakeBodyImage = new Image();
snakeBodyImage.src = "SNAKE-BODY.png";

function randomPosition() {
    return {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box
    };
}

function endGame() {
    gameover = true;
}

function restartGame() {
    snake = [
        { x: 200, y: 200 },
        { x: 180, y: 200 },
        { x: 160, y: 200 }
    ];

    direction = "RIGHT";
    score = 0;
    gameover = false;

    apple = randomPosition();
    bomb = randomPosition();

    document.getElementById("score").innerText = "Score: 0";
}


document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp" && direction !== "DOWN") {
        direction = "UP";
    }
    else if (event.key === "ArrowDown" && direction !== "UP") {
        direction = "DOWN";
    }
    else if (event.key === "ArrowLeft" && direction !== "RIGHT") {
        direction = "LEFT";
    }
    else if (event.key === "ArrowRight" && direction !== "LEFT") {
        direction = "RIGHT";
    }
});


function draw() {
    if (gameover) return;

    ctx.clearRect(0, 0, 400, 400);

    ctx.drawImage(appleImage, apple.x, apple.y, box, box);
    ctx.drawImage(bombImage, bomb.x, bomb.y, box, box);

    snake.forEach(function(part, index) {
        const image = index === 0 ? snakeHeadImage : snakeBodyImage;
        ctx.drawImage(image, part.x, part.y, box, box);
    });

    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;
    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;

    let newHead = { x: headX, y: headY };

    if (headX < 0 || headY < 0 || headX >= 400 || headY >= 400) {
        endGame();
        return;
    }

    for (let part of snake) {
        if (newHead.x === part.x && newHead.y === part.y) {
            endGame();
            return;
        }
    }

    snake.unshift(newHead);

    if (headX === apple.x && headY === apple.y) {
        score++;
        document.getElementById("score").innerText = "Score: " + score;
        apple = randomPosition();
    } else {
        snake.pop();
    }

    if (headX === bomb.x && headY === bomb.y) {
        snake = snake.slice(0, Math.max(1, Math.ceil(snake.length / 2)));
        bomb = randomPosition();
    }
}


restartGame();
setInterval(draw, 120);
