// Define different levels of the game with symbols
const levels = [
    { name: 'easy', symbols: ['A', 'B', 'C', 'D', 'E', 'F'] },
    { name: 'medium', symbols: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J','K','L','M'] },
    { name: 'hard', symbols: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q','R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'] },
];
const sounds = {
    background : new Audio('sounds/Background.mp3'),
    flip: new Audio('sounds/Flipping.mp3'),
    match: new Audio('sounds/ping_sound_effec.mp3'),
    win: new Audio('sounds/Winn.mp3'),
};

// Game state variables
let currentLevel = 'easy'; // Default level
let symbols = [];

let cards = [];
let flippedCards = [];
let moves = 0;
let matchedPairs = 0;
let timer;
let startTime;
let totalTime = 0;
let isBackgroundMusicMuted = false;


// Function to toggle mute/unmute for background music
function toggleMute() {
    isBackgroundMusicMuted = !isBackgroundMusicMuted;

    // Set the mute state for the background music
    sounds.background.muted = isBackgroundMusicMuted;

    // Update the button text
    const muteButton = document.getElementById('muteButton');
    muteButton.textContent = isBackgroundMusicMuted ? 'Unmute' : 'Mute';
   // if (isBackgroundMusicMuted) {
       // muteButton.textContent = 'Unmute';
   // } else {
       // muteButton.textContent = 'Mute'  }
}

// Function to start the game
function startGame() {
// Play the background music
sounds.background.loop = true;
sounds.background.play();



    // Get the selected level from the dropdown
    const levelDropdown = document.getElementById('level');
    currentLevel = levelDropdown.value;

 // Find the level configuration based on the selected level
    const level = levels.find(level => level.name === currentLevel);
          //let level;
          //let levelFound = false;
          //for (let i = 0; i < levels.length && !levelFound; i++) {
          //if (levels[i].name === currentLevel) {
          //level = levels[i];
          //levelFound = true;  }}
     

 // Double the symbols array for the pairs and shuffle them    
    symbols = shuffleArray(level.symbols.concat(level.symbols));  
          // for (let i = symbols.length - 1; i > 0; i--) {
          // const j = Math.floor(Math.random() * (i + 1));
          // [symbols[i], symbols[j]] = [symbols[j], symbols[i]]; }

// Create card objects with symbol, flipped, and matched properties  
    cards = symbols.map((symbol, index) => ({ symbol, isFlipped: false, isMatched: false }));
         //cards = [];
         //for (let index = 0; index < symbols.length; index++) {
        //const symbol = symbols[index];
        //const card = {
        //symbol: symbol,
         //isFlipped: false,
           // isMatched: false };
        //cards.push(card);}

    // Shuffle the card array to randomize their positions 
    shuffleArray(cards);

    // Render the initial state of the game 
    renderGame();

    // Start the timer  
    startTimer();
}

// Function to render the game state
function renderGame() {
    // Get the game container element from the HTML
    const gameContainer = document.getElementById('game-container');

    // Clear any previous content in the game container
    gameContainer.innerHTML = '';

    // Iterate through the cards and create visual elements for each card
    cards.forEach((card, index) => {
        // Create a new card element
        const cardElement = document.createElement('div');

        // Add a CSS class to style the card
        cardElement.classList.add('card');

        // Set a custom attribute to identify the card's position
        cardElement.dataset.index = index;

        // Display the symbol if the card is flipped, otherwise show nothing
        if (card.isFlipped) {
            // Show the symbol on the card
            cardElement.innerHTML = card.symbol;
        } else {
            // If the card is not flipped, leave it empty
            cardElement.innerHTML = '';
        }

        // Add a click event listener to the card
        cardElement.addEventListener('click', () => flipCard(index));

        // Add the card to the game container on the webpage
        gameContainer.appendChild(cardElement);
    });
}


// Function to handle flipping a card
function flipCard(index) {
    // Check if the flipped cards are less than 2 and the selected card is not already flipped
    if (flippedCards.length < 2 && !cards[index].isFlipped) {
        // Flip the selected card  
        cards[index].isFlipped = true;

        // Add the index of the flipped card to the flippedCards array   
        flippedCards.push(index);

        // Render the updated game state   
        renderGame();

        // If two cards are flipped, check for a match after a delay
        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 1000);
        }
    }

    sounds.flip.play();
}

// Function to check if two flipped cards match
function checkMatch() {
    const [index1, index2] = flippedCards;
    moves++;

    // Check if the symbols on the flipped cards match
    if (cards[index1].symbol === cards[index2].symbol) {
        // Mark the cards as matched
        cards[index1].isMatched = true;
        cards[index2].isMatched = true;
        matchedPairs++;
        sounds.match.play();

        // If all pairs are matched, end the game  
        if (matchedPairs === symbols.length / 2) {
            endGame();
            return; // Added to stop counting time when the game ends
        }
    } else {
        // If no match, flip the cards back after a delay  
        cards[index1].isFlipped = false;
        cards[index2].isFlipped = false;
    }

    // Clear the flippedCards array and render the updated game state
    flippedCards = [];
    renderGame();
}

// Function to start the timer
function startTimer() {
    // Get the current time when the timer starts
    startTime = new Date().getTime();

    // Set up an interval to update the timer every second  
    timer = setInterval(() => {
        // Get the current time
        const currentTime = new Date().getTime();

        // Calculate the total time elapsed in seconds
        totalTime = Math.floor((currentTime - startTime) / 1000);

        // Update the game info, including the timer
        updateGameInfo();
    }, 1000);
}

// Function to end the game
function endGame() {
    // Clear the timer interval
    clearInterval(timer);

    // Update the game info one last time
    updateGameInfo();

    // Display the win screen
    const winScreen = document.getElementById('win-screen');
    winScreen.style.display = 'flex';
    sounds.win.play();
}

// Function to restart the game
function restartGame() {
    // Reset game variables
    currentLevel = 'easy';
    matchedPairs = 0;
    moves = 0;
    totalTime = 0;
    flippedCards = [];

    // Start a new game
    startGame();

    // Hide the win screen
    const winScreen = document.getElementById('win-screen');
    winScreen.style.display = 'none';
}

// Function to update game info on the screen
function updateGameInfo() {
    // Get elements to display total time and moves
    const totalTimeElement = document.getElementById('total-time');
    const totalMovesElement = document.getElementById('total-moves');

    // Update the displayed total time and moves
    totalTimeElement.textContent = formatTime(totalTime);
    totalMovesElement.textContent = moves;
}

// Function to format time as MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Check if remainingSeconds is less than 10
    if (remainingSeconds < 10) {
        // If true, append a '0' before remainingSeconds
        return `${minutes}:0${remainingSeconds}`;
    } else {
        // If false, simply concatenate remainingSeconds
        return `${minutes}:${remainingSeconds}`;
    }
}

// Function to shuffle the elements in an array
function shuffleArray(array) {
    // Shuffle the elements in the array using Fisher-Yates algorithm
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialize the game when the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateGameInfo(); // Initialize game info on page load
});