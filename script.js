const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;
const gridSize = 20;

let snake = [];
let apple = null;
let bomb = null;
let direction;
let score = 0;
let gameState = "menu";
let bombExpiresAt = 0;
let currentSpeed = 240;
let gameTimer = null;
const MIN_SPEED = 100;
const SPEED_STEP = 8;

const highscoreText = document.getElementById("highscore");
const scoreText = document.getElementById("score");
const menu = document.getElementById("menu");

function loadImage(paths) {
    const img = new Image();
    let index = 0;

    img.onerror = function () {
        if (index < paths.length - 1) {
            index++;
            img.src = paths[index];
        }
    };

    img.src = paths[index];
    return img;
}

const snakeHead = loadImage([
    "images/SNAKE-HEAD.png",
    "SNAKE-HEAD.png"
]);

const snakeBody = loadImage([
    "images/SNAKE-BODY.png",
    "SNAKE-BODY.png"
]);

const appleImage = loadImage([
    "images/APPLE.png",
    "APPLE.png"
]);

const bombImage = loadImage([
    "images/BOMB.png",
    "BOMB.png"
]);

let highscore = Number(localStorage.getItem("snakeHighscore")) || 0;
highscoreText.innerText = "High Score: " + highscore;

function randomPosition() {
    let position;

    do {
        position = {
            x: Math.floor(Math.random() * gridSize) * box,
            y: Math.floor(Math.random() * gridSize) * box
        };
    } while (
        snake.some(part => part.x === position.x && part.y === position.y) ||
        (apple && apple.x === position.x && apple.y === position.y)
    );

    return position;
}

function showMenu(title, message, buttonText) {
    document.getElementById("menu-title").innerText = title;
    document.getElementById("menu-message").innerText = message;
    document.getElementById("menu-button").innerText = buttonText;
    menu.style.display = "flex";
}

function updateScore() {
    scoreText.innerText = "Score: " + score;
}

function updateSpeed() {
    if (gameTimer) {
        clearInterval(gameTimer);
    }

    gameTimer = setInterval(gameLoop, currentSpeed);
}

function startGame() {
    snake = [
        { x: 200, y: 200 },
        { x: 180, y: 200 },
        { x: 160, y: 200 }
    ];

    direction = "RIGHT";
    score = 0;
    bomb = null;
    bombExpiresAt = 0;
    currentSpeed = 240;
    apple = randomPosition();

    gameState = "playing";
    updateScore();
    menu.style.display = "none";
    updateSpeed();
    draw();
}

document.addEventListener("keydown", function(event) {
    if (gameState !== "playing") return;

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
    }

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

function endGame() {
    gameState = "over";

    if (score > highscore) {
        highscore = score;
        localStorage.setItem("snakeHighscore", highscore);
        highscoreText.innerText = "High Score: " + highscore;
    }

    showMenu(
        "GAME OVER",
        "Your Score: " + score + " | Best: " + highscore,
        "Play Again"
    );

    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (apple) {
        if (appleImage.complete && appleImage.naturalWidth) {
            ctx.drawImage(appleImage, apple.x, apple.y, box, box);
        } else {
            ctx.fillStyle = "red";
            ctx.fillRect(apple.x, apple.y, box, box);
        }
    }

    if (bomb) {
        if (bombImage.complete && bombImage.naturalWidth) {
            ctx.drawImage(bombImage, bomb.x, bomb.y, box, box);
        } else {
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(bomb.x + 10, bomb.y + 10, 9, 0, Math.PI * 2);
            ctx.fill();
        }
    }



    if (!snake || snake.length === 0) return;

    snake.forEach(function(part, index) {
        const image = index === 0 ? snakeHead : snakeBody;

        if (image.complete && image.naturalWidth) {
            ctx.drawImage(image, part.x, part.y, box, box);
        } else {
            ctx.fillStyle = index === 0 ? "#22c55e" : "#86efac";
            ctx.fillRect(part.x, part.y, box - 2, box - 2);
        }
    });
}

function gameLoop() {
    if (gameState !== "playing") return;

    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;
    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;

    const newHead = { x: headX, y: headY };

    if (headX < 0 || headY < 0 || headX >= canvas.width || headY >= canvas.height) {
        endGame();
        return;
    }

    const ateApple = headX === apple.x && headY === apple.y;
    const bodyToCheck = ateApple ? snake : snake.slice(0, -1);

    for (let part of bodyToCheck) {
        if (newHead.x === part.x && newHead.y === part.y) {
            endGame();
            return;
        }
    }
    snake.unshift(newHead);

    if (ateApple) {
        score++;
        updateScore();
        apple = randomPosition();
        currentSpeed = Math.max(MIN_SPEED, currentSpeed - SPEED_STEP);
        updateSpeed();
    } else {
        snake.pop();
    }


    if (bomb && headX === bomb.x && headY === bomb.y) {
        snake = snake.slice(0, Math.max(1, Math.ceil(snake.length / 2)));
        bomb = null;
        bombExpiresAt = 0;
    }

    if (bomb && Date.now() >= bombExpiresAt) {
        bomb = null;
        bombExpiresAt = 0;
    }

    if (!bomb && Math.random() < 0.002) {
        bomb = randomPosition();
        bombExpiresAt = Date.now() + 3000;
    }

    draw();
}

showMenu("SNAKE GAME", "Eat apples and avoid bombs!", "Start Game");
updateSpeed();
draw();
