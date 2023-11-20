// Import the 'dictionary' array from an external module

import { dictionary } from './dictionary.js';

// Function to check the validity of a word entered by the user
function checkWord() {
    // Prompt the user for a 5-character word with no symbols or spaces
    let givenWord = prompt('Enter a word with 5 characters (no symbols or spaces)');
    let answer = '';

    // Validate the length of the entered word
    while (givenWord.length !== 5) {
        alert('Word must be 5 characters');
        givenWord = prompt('Enter a word with 5 characters (no symbols or spaces)');
    }

    // Validate each character in the entered word
    for (let i = 0; i < givenWord.length; i++) {
        if (/^[a-z]$/i.test(givenWord.charAt(i))) {
            answer += givenWord.charAt(i);
        } else {
            alert('Invalid characters added');
            return checkWord();
        }
    }

    // Check if the validated word is in the dictionary
    if (dictionary.includes(answer)) {
        return answer;
    } else {
        alert('Invalid word');
        return checkWord(); 
    }
}

// Initialize the game by checking and obtaining a valid word from the user
let word = checkWord();
let secretWord = [word];

// Define the initial game state
const state = {
    secret: secretWord[0],
    grid: Array(6).fill().map(() => Array(5).fill('')),
    currentRow: 0, 
    currentCol: 0,
};

// Function to update the game grid on the HTML page
function updateGrid() {
    // Loop through the grid and update the content of each box
    for(let i = 0; i < state.grid.length; i++) {
        for(let j = 0; j < state.grid[i].length; j++) {
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

    for(let i = 0; i < 6; i++) {
        for(let j = 0; j < 5; j++) {
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
          if(isWordValid(word)){
          revealWord(word);
          state.currentRow++;
          state.currentCol = 0;
          }
        
        else{
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

    // Loop through each letter in the word and apply animations
    for(let i = 0; i < 5; i++) {
        const box = document.getElementById(`box${row}${i}`);
        const letter = box.textContent;

        setTimeout(() => {
            if(letter === state.secret[i]) {
                box.classList.add('right');
            } else if(state.secret.includes(letter)) {
                box.classList.add('wrong');
            } else {
                box.classList.add('empty');
            }
        }, ((i+1) * animation_duration) / 2);

        box.classList.add('animated');
        box.style.animationDelay = `${(i * animation_duration) / 2}ms`;
    }

    // Check if the player has won or the game is over
    const isWinner = state.secret === guess;
    const isGameOver = state.currentRow === 5;

    setTimeout(() => {
        if(isWinner) {
            alert("Congratulations! ");
        } else if(isGameOver) {
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
    if(state.currentCol === 5) return;
    state.grid[state.currentRow][state.currentCol] = letter;
    state.currentCol++;
}

// Function to remove a letter from the grid at the current position
function removeLetter() {
    if(state.currentCol === 0) return;
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