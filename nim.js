let currentRow = null;
let playerTurn = true; // True = Player's turn, False = AI's turn

function showMessage(msg) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = msg; // Mettre à jour le texte
    messageDiv.style.display = 'block'; // Afficher le message

    // Faire disparaître le message après 2 secondes
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 2000);
}

function checkWin() {
    let matchsticks = 0;
    document.querySelectorAll('.row img').forEach(img => {
        if (img.style.visibility !== 'hidden') {
            matchsticks++;
        }
    });
    if (matchsticks === 0) {
        if (!playerTurn) {
            showMessage("Félicitations ! Vous avez gagné.");
        } else {
            showMessage("Dommage ! Vous avez pris la dernière allumette. Vous avez perdu.");
        }
        document.getElementById('restart').click();
    }
}

function updateTurnInfo() {
    const turnInfoDiv = document.getElementById('turn-info');
    if (playerTurn) {
        turnInfoDiv.textContent = "C'est votre tour.";
    } else {
        turnInfoDiv.textContent = "C'est le tour de l'ordinateur.";
    }
}

function aiTurn() {
    setTimeout(() => {
        let totalMatchsticks = 0;
        document.querySelectorAll('.row img').forEach(img => {
            if (img.style.visibility !== 'hidden') {
                totalMatchsticks++;
            }
        });

        let nimSum = calculateNimSum();
        let rowToTakeFrom = null;
        let matchsticksToTake = 0;

        // Calculer le nombre d'allumettes visibles dans chaque tas
        let visibleCounts = [];
        document.querySelectorAll('.row').forEach(row => {
            let visibleCount = row.querySelectorAll('img[style*="visibility: visible"]').length;
            visibleCounts.push(visibleCount);
        });

        // Chercher un coup perdant pour l'IA (position gagnante pour le joueur)
        let losingMove = findLosingMove(visibleCounts);

        if (losingMove !== null) {
            rowToTakeFrom = document.querySelectorAll('.row')[losingMove.rowIndex];
            matchsticksToTake = losingMove.countToTake;
        } else {
            // Si aucun coup perdant n'est trouvé, jouer de manière heuristique
            let maxVisibleCount = Math.max(...visibleCounts);
            let rowIndex = visibleCounts.findIndex(count => count === maxVisibleCount);
            rowToTakeFrom = document.querySelectorAll('.row')[rowIndex];
            matchsticksToTake = maxVisibleCount - 1; // Prendre un de moins pour laisser un nombre impair
        }

        // Effectuer le coup calculé par l'IA
        if (rowToTakeFrom !== null && matchsticksToTake > 0) {
            let matchsticksTaken = 0;
            rowToTakeFrom.querySelectorAll('img').forEach(img => {
                if (img.style.visibility !== 'hidden' && matchsticksTaken < matchsticksToTake) {
                    img.style.visibility = 'hidden';
                    matchsticksTaken++;
                }
            });
            checkWin();
            playerTurn = true;
            updateTurnInfo();
        }
        playSound(); // Jouer le son
    }, 1000); // Délai de 1 seconde avant que l'IA joue
}

function findLosingMove(visibleCounts) {
    // Chercher une position où il reste un seul tas avec une allumette
    for (let i = 0; i < visibleCounts.length; i++) {
        if (visibleCounts[i] === 1) {
            return { rowIndex: i, countToTake: 1 };
        }
    }

    // Chercher une position où il reste deux tas avec une allumette chacun
    for (let i = 0; i < visibleCounts.length; i++) {
        for (let j = i + 1; j < visibleCounts.length; j++) {
            if (visibleCounts[i] === 1 && visibleCounts[j] === 1) {
                return { rowIndex: i, countToTake: 2 };
            }
        }
    }

    return null; // Aucun coup perdant trouvé
}
function calculateNimSum() {
    let nimSum = 0;
    document.querySelectorAll('.row').forEach(row => {
        let visibleCount = row.querySelectorAll('img[style*="visibility: visible"]').length;
        nimSum ^= visibleCount;
    });
    return nimSum;
}

document.querySelectorAll('.row img').forEach(img => {
    img.addEventListener('click', (e) => {
        if (!playerTurn) return; // Ignore clicks if it's not the player's turn

        const row = e.target.parentElement.dataset.row;
        if (e.target.classList.contains('selected')) {
            e.target.src = "/img/matchstick.png"; // Change l'image à l'image de base
            e.target.classList.remove('selected'); // Désélectionne l'allumette
            const isSelectedInRow = [...e.target.parentElement.children].some(img => img.classList.contains('selected'));
            if (!isSelectedInRow) {
                currentRow = null;
            }
        } else if (currentRow === null || currentRow === row) {
            e.target.src = "/img/selected_matchstick.png"; // Change l'image à l'image sélectionnée
            e.target.classList.add('selected'); // Sélectionne l'allumette
            currentRow = row;
        } else {
            alert("Vous ne pouvez prendre des allumettes que d'un seul tas par tour.");
        }
    });
});

function playSound() {
    let sound = new Audio('/sounds/matchsound.mp3');
    sound.play();
}

document.getElementById('end-turn').addEventListener('click', () => {
    let selectedMatchsticks = document.querySelectorAll('.selected').length;
    if (selectedMatchsticks > 0) {
        document.querySelectorAll('.selected').forEach(img => {
            img.style.visibility = 'hidden';
            img.classList.remove('selected');
        });
        currentRow = null;
        checkWin();
        if (playerTurn) {
            playerTurn = false;
            updateTurnInfo();
            aiTurn();
        }
        playSound(); // Jouer le son
    } else {
        alert("Vous devez sélectionner au moins une allumette.");
    }
});

document.getElementById('restart').addEventListener('click', () => {
    document.querySelectorAll('.row img').forEach(img => {
        img.src = "/img/matchstick.png";
        img.style.visibility = 'visible';
        img.classList.remove('selected');
    });
    currentRow = null;
    playerTurn = true;
    playSound(); // Jouer le son
});


// Sélectionner toutes les images d'allumettes
const matchsticks = document.querySelectorAll('img[alt="allumette"]');

// Fonction pour ajouter la classe .red au curseur
function makeCursorRed() {
    document.getElementById('cursor').classList.add('red');
}

// Fonction pour retirer la classe .red du curseur
function removeCursorRed() {
    document.getElementById('cursor').classList.remove('red');
}

// Ajouter les écouteurs d'événements pour chaque allumette
matchsticks.forEach(matchstick => {
    matchstick.addEventListener('mouseenter', makeCursorRed);
    matchstick.addEventListener('mouseleave', removeCursorRed);
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('mouseenter', makeCursorRed);
        button.addEventListener('mouseleave', removeCursorRed);
    }
    );
});

// N'oubliez pas d'initialiser l'information du tour au démarrage du jeu :
document.addEventListener('DOMContentLoaded', () => {
    updateTurnInfo(); // Initialise l'information du tour lorsque la page est chargée
});