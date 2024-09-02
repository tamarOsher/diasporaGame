
const soldierImages = [
    './assets/Designer__1_-removebg-preview.png',
    './assets/Designer__2_-removebg-preview.png',
    './assets/Designer__3_-removebg-preview.png',
    './assets/Designer__4_-removebg-preview (1).png',
    './assets/Designer__5_-removebg-preview.png',
    './assets/Designer__6_-removebg-preview.png',
    './assets/Designer__7_-removebg-preview.png'
    // הוסף כאן את נתיבי התמונות שלך
];
document.getElementById('backButton').addEventListener('click', function () {
    window.location.href = './start.html'; // ניתוב לעמוד הראשי
});
function createPlayerInputs() {
    const playerCount = parseInt(document.getElementById('playerCount').value, 10);
    const overlay = document.getElementById('overlay');
    const playerNamesContainer = document.getElementById('playerNames');

    // סגור את ה-overlay
    overlay.style.display = 'none';

    if (!isNaN(playerCount) && playerCount > 0 && playerCount <= soldierImages.length) {
        // יצירת שדות הכנסת שמות
        playerNamesContainer.innerHTML = '<h2>Enter the names of the participants</h2>';

        for (let i = 0; i < playerCount; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `A player's name${i + 1}`;
            input.id = `playerName${i + 1}`;
            playerNamesContainer.appendChild(input);
        }

        const button = document.createElement('button');
        button.innerText = 'show soldiers';
        button.onclick = () => displaySoldiers(playerCount);
        playerNamesContainer.appendChild(button);

        playerNamesContainer.style.display = 'block';
    } else {
        alert('The number of participants is incorrect or there are more participants than the soldiers photos.');
    }
}
function createPlayerInputsGroup() {
    const playerCount = parseInt(document.getElementById('playerCount').value, 10);
    const overlay = document.getElementById('overlay');
    const playerNamesContainer = document.getElementById('playerNames');

    // סגור את ה-overlay
    overlay.style.display = 'none';

    if (!isNaN(playerCount) && playerCount > 0 && playerCount <= soldierImages.length) {
        // יצירת שדות הכנסת שמות
        playerNamesContainer.innerHTML = '<h2>Enter the group names</h2>';

        for (let i = 0; i < playerCount; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `A group name${i + 1}`;
            input.id = `playerName${i + 1}`;
            playerNamesContainer.appendChild(input);
        }

        const button = document.createElement('button');
        button.innerText = 'show soldiers';
        button.onclick = () => displaySoldiers(playerCount);
        playerNamesContainer.appendChild(button);

        playerNamesContainer.style.display = 'block';
    } else {
        alert('The number of groups is incorrect or there are more participants than the soldiers photos.');
    }
}
function displaySoldiers(playerCount) {
    const soldiersContainer = document.getElementById('soldiers');
    const playerNamesContainer = document.getElementById('playerNames');
    const gamePage = document.getElementById('gamePage');
const players=[];
    soldiersContainer.innerHTML = '';

    playerNamesContainer.style.display = 'none';

    gamePage.style.display = 'block';

    const shuffledImages = soldierImages.slice(0, playerCount).sort(() => Math.random() - 0.5);

    for (let i = 0; i < playerCount; i++) {
        const playerName = document.getElementById(`playerName${i + 1}`).value;

        if (playerName) {
            const soldierDiv = document.createElement('div');
            soldierDiv.className = 'soldier';

            const img = document.createElement('img');
            img.src = shuffledImages[i];
            img.alt = 'soldier';

            const name = document.createElement('p');
            name.innerText = playerName;

            soldierDiv.appendChild(img);
            soldierDiv.appendChild(name);

            soldiersContainer.appendChild(soldierDiv);
            players.push({ name: playerName, soldier: shuffledImages[i],id: i,currentCell:1});

        }

    }
    localStorage.setItem('players', JSON.stringify(players));

}

function goToGamePage() {
    window.location.href = './play.html'; 
}
function goToGamePageGroup() {
    window.location.href = './play-group.html'; 
}