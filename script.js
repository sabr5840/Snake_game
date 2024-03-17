document.getElementById('try-again').addEventListener('click', tryAgain);
document.getElementById('pause').addEventListener('click', pauseGame); // Tilføj event listener til pauseknappen

const ROWS = 20;
const COLS = 30;

let snake;
let food;
let score;
let direction;
let interval;

const gameBoard = document.getElementById('game-board');
gameBoard.style.gridTemplateColumns = `repeat(${COLS}, 20px)`;
gameBoard.style.gridTemplateRows = `repeat(${ROWS}, 20px)`;

// Queue
let snakeQueue = [];
let queueStart = 0; 
let queueEnd = 0;   

function enqueue(item) {
    snakeQueue[queueEnd++] = item;
}

function dequeue() {
    if (isEmpty()) {
        return undefined;
    }
    const item = snakeQueue[queueStart];
    delete snakeQueue[queueStart++];
    return item;
}

function isEmpty() {
    return queueStart === queueEnd;
}

// Start the game
initializeGame();

function tryAgain() {
    initializeGame();
}

function initializeGame() {
    console.log("Initializing game...");
    snake = [{ x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) }];
    enqueue(snake[0]); 
    food = generateFoodPosition();
    score = 0;
    direction = 'right';
    interval = setInterval(moveSnake, 200);
    render();
    document.addEventListener('keydown', changeDirection);
    console.log("Game initialized.");
}

function moveSnake() {
    const head = { ...snake[0] };
    switch (direction) {
        case 'up':
            head.y -= 1;
            break;
        case 'down':
            head.y += 1;
            break;
        case 'left':
            head.x -= 1;
            break;
        case 'right':
            head.x += 1;
            break;
    }

    
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
        clearInterval(interval);
        alert('Game Over! Your Score: ' + score);
        return;
    }

     if (snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y)) {
        clearInterval(interval);
        alert('Game Over! Your Score: ' + score);
        return;
    }

    if (head.x === food.x && head.y === food.y) {
        score++;
        food = generateFoodPosition();
    } else {
        dequeue(); // remove the last pos 
    }

    if (snakeQueue.some(segment => segment.x === head.x && segment.y === head.y)) {
        clearInterval(interval);
        alert('Game Over! Your Score: ' + score);
        return;
    }

    snake.unshift(head); // Add head
    enqueue({ x: head.x, y: head.y }); // add the pos of head 
    render();
}

function generateFoodPosition() {
    let foodX, foodY;
    do {
        foodX = Math.floor(Math.random() * COLS);
        foodY = Math.floor(Math.random() * ROWS);
    } while (snake.some(segment => segment.x === foodX && segment.y === foodY));
    return { x: foodX, y: foodY };
}

function render() {
    gameBoard.innerHTML = '';
    
    snake.forEach(segment => {
        const snakeSegment = document.createElement('div');
        snakeSegment.className = 'cell snake';
        snakeSegment.style.gridColumn = `${segment.x + 1}`;
        snakeSegment.style.gridRow = `${segment.y + 1}`;
        gameBoard.appendChild(snakeSegment);
    });

    const foodCell = document.createElement('div');
    foodCell.className = 'cell food';
    foodCell.style.gridColumn = `${food.x + 1}`;
    foodCell.style.gridRow = `${food.y + 1}`;
    gameBoard.appendChild(foodCell);
}

function changeDirection(event) {
    switch (event.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
}

let isPaused = false;

function pauseGame() {
    if (isPaused) {
        interval = setInterval(moveSnake, 200);
        document.getElementById('pause').innerText = "Pause Game";
    } else {
        clearInterval(interval);
        document.getElementById('pause').innerText = "Resume Game";
    }
    isPaused = !isPaused;
}
