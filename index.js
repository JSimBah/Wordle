// Import the 'dictionary' array from an external module
import { dictionary } from './dictionary.js';

// Define the initial game state
const state = {
    // Select a random word from the dictionary as the secret word
    secret: dictionary[Math.floor(Math.random() * dictionary.length)],
    grid: Array(6)
        .fill()
        .map(() => Array(5).fill('')), // Initialize the game grid
    currentRow: 0,
    currentCol: 0,
};

// Function to update the game grid on the HTML page
function updateGrid() {
    for (let i = 0; i < state.grid.length; i++) {
        for (let j = 0; j < state.grid[i].length; j++) {
            const box = document.getElementById(`box${i}${j}`);
            box.textContent = state.grid[i][j];
        }
    }
}

// Function to create and draw a box in the game grid
function drawBox(container, row, col, letter = '') {
    const box = document.createElement('div');
    box.className = 'box';
    box.id = `box${row}${col}`;
    box.textContent = letter;

    container.appendChild(box);
    return box;
}

// Function to create and draw the entire game grid
function drawGrid(container) {
    const grid = document.createElement('div')
    grid.className = 'grid';

    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            drawBox(grid, i, j);
        }
    }
    container.appendChild(grid);
}

// Function to register keyboard events for the game
function registerKeyboardEvents() {
    document.body.onkeydown = (e) => {
        const key = e.key;
        if (key === 'Enter') {
            if (state.currentCol === 5) {
                const word = getCurrentWord();
                if (isWordValid(word)) {
                    revealWord(word);
                    state.currentRow++;
                    state.currentCol = 0;
                } else {
                    alert('Not a valid Word.');
                }
            }
        }
        if (key === 'Backspace') {
            removeLetter();
        }
        if (isLetter(key)) {
            addLetter(key);
        }
        updateGrid();
    };
}

// Function to retrieve the current word being formed on the grid
function getCurrentWord() {
    return state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
}

// Function to check if a word is valid by comparing it to the dictionary
function isWordValid(word) {
    return dictionary.includes(word);
}

// Function to reveal the word and update the game display
function revealWord(guess) {
    const row = state.currentRow;
    const animation_duration = 500;

    for (let i = 0; i < 5; i++) {
        const box = document.getElementById(`box${row}${i}`);
        const letter = box.textContent;

        setTimeout(() => {
            if (letter === state.secret[i]) {
                box.classList.add('right');
            } else if (state.secret.includes(letter)) {
                box.classList.add('wrong');
            } else {
                box.classList.add('empty');
            }
        }, ((i + 1) * animation_duration) / 2);
        box.classList.add('animated');
        box.style.animationDelay = `${(i * animation_duration) / 2}ms`;
    }
    const isWinner = state.secret === guess;
    const isGameOver = state.currentRow === 5;

    setTimeout(() => {
        if (isWinner) {
            alert("Congratulations! ");
        } else if (isGameOver) {
            alert(`Better luck next time! The word was ${state.secret}.`)
        }
    }, 3 * animation_duration);
}

// Function to check if a key is a valid letter
function isLetter(key) {
    return key.length === 1 && key.match(/[a-z]/i);
}

// Function to add a letter to the grid at the current position
function addLetter(letter) {
    if (state.currentCol === 5) return;
    state.grid[state.currentRow][state.currentCol] = letter;
    state.currentCol++;
}

// Function to remove a letter from the grid at the current position
function removeLetter() {
    if (state.currentCol === 0) return;
    state.grid[state.currentRow][state.currentCol - 1] = '';
    state.currentCol--;
}

// Function to initialize the game by drawing the grid and registering events
function startup() {
    const game = document.getElementById('game');
    drawGrid(game);
    registerKeyboardEvents();
}

// Start the game when the page loads
startup()
