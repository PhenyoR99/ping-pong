// Setup the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 10;
const PADDLE_SPEED = 5;

// Game variables
let leftPaddleY = (canvas.height - PADDLE_HEIGHT) / 2;
let rightPaddleY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 0;
let ballSpeedY = 0;
let difficulty = 1; // 1 = Easy, 2 = Medium, 3 = Hard
let gameInterval = null;
let leftScore = 0;
let rightScore = 0;

// Audio elements
const hitSound = document.getElementById('hitSound');
const scoreSound = document.getElementById('scoreSound');
const gameOverSound = document.getElementById('gameOverSound');

// Draw the paddles, ball, and scores
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw left paddle
    ctx.fillStyle = 'black';
    ctx.fillRect(0, leftPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);
    
    // Draw right paddle
    ctx.fillRect(canvas.width - PADDLE_WIDTH, rightPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);
    
    // Draw ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, BALL_SIZE, 0, Math.PI * 2);
    ctx.fillStyle = 'yellow'; // Ball color changed to yellow
    ctx.fill();
    ctx.closePath();
    
    // Draw scores
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${leftScore}`, 10, 30);
    ctx.textAlign = 'right';
    ctx.fillText(`Score: ${rightScore}`, canvas.width - 10, 30);
}

// Update game state
function update() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    
    // Ball collision with top/bottom walls
    if (ballY <= BALL_SIZE || ballY >= canvas.height - BALL_SIZE) {
        ballSpeedY = -ballSpeedY;
    }
    
    // Ball collision with paddles
    if (ballX <= PADDLE_WIDTH + BALL_SIZE && ballY >= leftPaddleY && ballY <= leftPaddleY + PADDLE_HEIGHT) {
        ballSpeedX = -ballSpeedX;
        hitSound.play(); // Play hit sound
    }
    
    if (ballX >= canvas.width - PADDLE_WIDTH - BALL_SIZE && ballY >= rightPaddleY && ballY <= rightPaddleY + PADDLE_HEIGHT) {
        ballSpeedX = -ballSpeedX;
        hitSound.play(); // Play hit sound
    }
    
    // Ball out of bounds (reset)
    if (ballX < 0) {
        rightScore++;
        scoreSound.play(); // Play score sound
        if (rightScore >= 5) { // For example, first to 5 points wins
            gameOver('Right player wins!');
        } else {
            resetBall();
        }
    }
    
    if (ballX > canvas.width) {
        leftScore++;
        scoreSound.play(); // Play score sound
        if (leftScore >= 5) { // For example, first to 5 points wins
            gameOver('Left player wins!');
        } else {
            resetBall();
        }
    }
}

// Reset ball speed based on difficulty
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    resetBallSpeed();
}

// Reset ball speed based on difficulty
function resetBallSpeed() {
    const baseSpeed = 4;
    ballSpeedX = baseSpeed * difficulty * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = baseSpeed * difficulty * (Math.random() > 0.5 ? 1 : -1);
}

// Handle paddle movement
function movePaddle(event) {
    switch (event.key) {
        case 'w':
            if (leftPaddleY > 0) {
                leftPaddleY -= PADDLE_SPEED;
            }
            break;
        case 's':
            if (leftPaddleY < canvas.height - PADDLE_HEIGHT) {
                leftPaddleY += PADDLE_SPEED;
            }
            break;
        case 'ArrowUp':
            if (rightPaddleY > 0) {
                rightPaddleY -= PADDLE_SPEED;
            }
            break;
        case 'ArrowDown':
            if (rightPaddleY < canvas.height - PADDLE_HEIGHT) {
                rightPaddleY += PADDLE_SPEED;
            }
            break;
    }
}

// Start the game
function startGame() {
    resetBallSpeed();
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        draw();
        update();
    }, 1000 / 60); // 60 FPS
}

// Stop the game
function stopGame() {
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null;
    }
}

// Change difficulty
function changeDifficulty(event) {
    difficulty = parseInt(event.target.value);
    if (gameInterval) {
        resetBallSpeed();
    }
}

// Handle game over
function gameOver(message) {
    stopGame();
    alert(message);
    gameOverSound.play(); // Play game over sound
}

// Add event listeners
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('stopButton').addEventListener('click', stopGame);
document.getElementById('difficulty').addEventListener('change', changeDifficulty);
document.addEventListener('keydown', movePaddle);
