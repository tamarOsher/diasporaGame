
let diceResult = null;
let currentPlayerIndex = 0;
let intervalId;
let isTimerRunning = false; 

document.getElementById('backButton').addEventListener('click', function () {
    window.location.href = './first.html'; // ניתוב לעמוד הראשי
});
function placePlayerOnStartingCell(playerDiv) {
    const startingCell = document.querySelector(`#cell-1`);
    if (startingCell) {
        playerDiv.style.position = 'absolute';


        const centerX = startingCell.offsetLeft + (startingCell.offsetWidth / 2) - (playerDiv.offsetWidth / 2);
        const centerY = startingCell.offsetTop + (startingCell.offsetHeight / 2) - (playerDiv.offsetHeight / 2);

        playerDiv.style.left = `${centerX}px`;
        playerDiv.style.top = `${centerY}px`;
    } else {
        console.error("No starting slot found.");
    }
}

function rollDiceAndMovePlayers() {
    console.log(diceResult);
    if (diceResult === null) {
        console.error("No die was thrown. Make sure the die is rolled first.z");
        return;
    }

    const players = document.querySelectorAll('.player');
    if (players.length === 0) {
        console.error("No players found.");
        return;
    }

    function movePlayer(playerDiv, steps) {
        let currentCellId = parseInt(playerDiv.dataset.cellId);
        let newCellId = currentCellId + steps;

        if (newCellId > 40) {
            newCellId = newCellId % 40;
            if (newCellId === 0) newCellId = 40;
        }

        playerDiv.dataset.cellId = newCellId;
        const newCell = document.querySelector(`#cell-${newCellId}`);
        if (newCell) {
            const centerX = newCell.offsetLeft + (newCell.offsetWidth / 2) - (playerDiv.offsetWidth / 2);
            const centerY = newCell.offsetTop + (newCell.offsetHeight / 2) - (playerDiv.offsetHeight / 2);

            playerDiv.style.left = `${centerX}px`;
            playerDiv.style.top = `${centerY}px`;

            checkSpecialCells(newCellId); // בדוק אם יש פעולה מיוחדת במשבצת החדשה
        } else {
            console.error(`square${newCellId} not found`);
        }
    }



    function moveToNextPlayer() {
        if (players.length === 0) {
            console.error("No players found.");
            return;
        }

        // הזזת השחקן הנוכחי
        const currentPlayer = players[currentPlayerIndex];
        movePlayer(currentPlayer, diceResult);

        // עדכון האינדקס לשחקן הבא
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length; // איפוס האינדקס בסיום מחזור השחקנים
    }


    moveToNextPlayer();
}


function startTimer(duration, display) {
    var timer = duration * 1000;

    // בדוק אם יש כבר טיימר פעיל ונקה אותו
    if (intervalId) {
        clearInterval(intervalId);
    }
    isTimerRunning = true;
    // הפעל טיימר חדש
    intervalId = setInterval(function () {
        var minutes = parseInt(timer / 60000, 10);
        var seconds = parseInt((timer % 60000) / 1000, 10);
        var milliseconds = parseInt(timer % 1000, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        milliseconds = milliseconds < 100 ? "0" + milliseconds : milliseconds;

        display.textContent = minutes + ":" + seconds + ":" + milliseconds;

        if ((timer -= 10) < 0) {
            clearInterval(intervalId);
            display.textContent = "2:00:000";

            openAlertModal("Time is up!");
            isTimerRunning = true;

            timer = duration * 1000;

            // הוסף מאזין אירועים מחדש להפעלת הטיימר לאחר סיום
            display.addEventListener('click', function () {
                startTimer(duration, display);
                display.removeEventListener('click', arguments.callee);
            });
        }
    }, 10);

    return intervalId;
}


document.addEventListener("DOMContentLoaded", function () {
    const players = JSON.parse(localStorage.getItem('players'));

    if (players && players.length > 0) {
        let playerOrderMessage = "The order of players is:\n";

        players.forEach((player, index) => {
            playerOrderMessage += `${index + 1}. ${player.name}\n`;
        });

        openAlertModal(playerOrderMessage);
    } else {
        console.error('לא נמצאו שחקנים ב-localStorage.');
    }

    const diceElement = document.getElementById('dice');
    diceElement.addEventListener('click', rollDice)
    });


    function checkSpecialCells(playerPosition) {
        const regularCells = [2, 4, 6, 10, 12, 14, 16, 20, 22, 24, 26, 30, 32, 34, 36, 40];
        const communityChallengeCells = [5, 15, 25, 35];
        const personalChallengeCells = [11, 31];
        const milestoneCells = [7, 9, 17, 19, 27, 29, 37, 39];
        const immigrationCells = [3, 8, 13, 18, 23, 28, 33, 38];
    
        if (regularCells.includes(playerPosition)) {
            openAlertModal(`A. Historical Event Square:
        ✪ Draw a corresponding historical event card and read it aloud.
        ✪ Present one or more Jewish values cards in response to the event.
        ✪ Explain how the value(s) address the event (1 minute to explain).
        ✪ If the explanation is logical and convincing, the player receives a "Jewish Resilience" coin.`);
        } else if (communityChallengeCells.includes(playerPosition)) {
            openAlertModal(`B. Community Challenge Square:
        ✪ Draw a community challenge card and read it aloud.
        ✪ All players participate in a discussion on how to respond to the event (2 minutes).
        ✪ The player who landed on the square summarizes the agreed-upon solution.
        ✪ If the solution is logical and convincing, the player receives 2 "Jewish Resilience" coins, and all other players receive one.`);
        } else if (personalChallengeCells.includes(playerPosition)) {
            openAlertModal(`C. Personal Challenge Square:
        ✪ Draw a personal challenge card and read it aloud.
        ✪ Explain how they would handle the situation (1 minute to explain).
        ✪ If the explanation is logical and convincing, the player receives 2 "Jewish Resilience" coins.`);
        } else if (milestoneCells.includes(playerPosition)) {
            openAlertModal(`D. Milestone Square:
        ✪ Draw a milestone card and read the historical event aloud.
        ✪ Receive a "Jewish Resilience" coin without needing to present a solution.
        ✪ All players briefly discuss the significance of the event.`);
        } else if (immigrationCells.includes(playerPosition)) {
            openAlertModal(`E. Aliyah Square:
        ✪ Draw an Aliyah card and read it aloud.
        ✪ Present a solution to the Aliyah challenge (1 minute to explain).
        ✪ If the solution is logical and convincing, the player receives 2 "Jewish Resilience" coins and advances 2 additional steps.`);
        } else {
            openAlertModal("You have landed on an unrecognized square. Please check the board.");
        }
    }


function openAlertModal(message) {
    const modal = document.getElementById("alertModal");
    const alertText = document.getElementById("alertText");
    const closeModal = document.getElementById("closeModal");
    const closeButton = document.getElementById("closeButton");

    alertText.innerText = message;
    modal.style.display = "flex"; // מציג את המודאל

    // סגירת המודאל בלחיצה על ה-X
    closeModal.onclick = function () {
        modal.style.display = "none";
    };

    closeButton.onclick = function () {
        modal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            modal.style.display = "none";
        }
    });
}
 function rollDice() {
    if (isTimerRunning) {
        openAlertModal("The timer is on! The die cannot be rolled.");
        return; // אם הטיימר פועל, עצור את הפונקציה כאן
    }
    const diceFaces = [
        './assets/dice-1.png',
        './assets/dice-2.png',
        './assets/dice-3.png',
        './assets/dice-4.png',
        './assets/dice-5.png',
        './assets/dice-6.png'
    ];
    const diceContainer = document.getElementById('dice');
    const resultDisplay = document.getElementById('result');
    const diceImage = document.getElementById('diceImage');

    diceContainer.classList.add('rolling');

    let rollInterval = setInterval(() => {
        const randomFace = Math.floor(Math.random() * diceFaces.length);
        diceImage.src = diceFaces[randomFace];
    }, 50);
    setTimeout(() => {
        clearInterval(rollInterval);
        const finalFaceIndex = Math.floor(Math.random() * diceFaces.length);
        diceImage.src = diceFaces[finalFaceIndex];
        diceContainer.classList.remove('rolling');
        diceResult = finalFaceIndex + 1;
        rollDiceAndMovePlayers();
    }, 1000);

}

window.onload = function () {
    const diceContainer = document.getElementById('dice');
    var oneMinute = 60,
        display = document.querySelector('#timer');


    display.addEventListener('click', function () {
        startTimer(oneMinute, display);

        display.removeEventListener('click', arguments.callee);
    });

    var players = JSON.parse(localStorage.getItem('players')) || [];
    var playersContainer = document.getElementById('players');

    players.forEach(function (player) {
        var playerDiv = document.createElement('div');
        playerDiv.className = 'player';
        playerDiv.dataset.cellId = '1';
        playerDiv.innerHTML = `<img src="${player.soldier}" alt="חייל"><p>${player.name}</p>`;
        playersContainer.appendChild(playerDiv);
        placePlayerOnStartingCell(playerDiv);
    });
}
