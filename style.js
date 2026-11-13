const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;

let snake;
let apple;
let bomb;
let direction;
let score;
let gameover;

function randomPostion() {
    return {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box;

    };
    
}

function restartGame() {
    snake = [
        { x: 200, y: 200},
        { x: 180, y: 200},
        { x: 160, y: 200}
    ];

    direction = "RIGHT";
    score = 0;
    gameover = false;

    apple = randomPostion();
    bomb = randomPostion();

    document.getElementById("score").innerText = "Score: 0";


}


document.addEventListener("keydown", function(event){
    
}
)