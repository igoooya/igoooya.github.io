class Player {
    constructor(name) {
        this.name = name;
        this.roundScore = 0;
        this.totalScore = 0;
    }

    rollDice() {
        const die1 = Math.floor(Math.random() * 6) + 1;
        const die2 = Math.floor(Math.random() * 6) + 1;
        this.calculateScore(die1, die2);
        return { die1, die2 };
    }

    calculateScore(die1, die2) {
        if (die1 === 1 || die2 === 1) {
            this.roundScore = 0;
        } else if (die1 === die2) {
            this.roundScore = (die1 + die2) * 2;
        } else {
            this.roundScore = die1 + die2;
        }
        this.totalScore += this.roundScore;
    }
}

const player = new Player('Player');
const computer = new Player('Computer');
let rolls = 0;

function animateDiceRoll(die1Element, die2Element, finalRoll) {
    let counter = 0;
    let interval = 50; // start interval in ms
    const maxCounter = 15; // number of image changes

    const animate = () => {
        const random1 = Math.floor(Math.random() * 6) + 1;
        const random2 = Math.floor(Math.random() * 6) + 1;
        die1Element.src = `images/d${random1}.svg`;
        die2Element.src = `images/d${random2}.svg`;

        counter++;
        interval += 20; // increase interval to slow down

        if (counter < maxCounter) {
            setTimeout(animate, interval);
        } else {
            die1Element.src = `images/d${finalRoll.die1}.svg`;
            die2Element.src = `images/d${finalRoll.die2}.svg`;
        }
    };

    animate();
}

function updateScoreTable(round, playerScore, computerScore) {
    const scoreBody = document.getElementById('score-body');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${round}</td>
        <td>${playerScore}</td>
        <td>${computerScore}</td>
    `;
    scoreBody.appendChild(newRow);

    document.getElementById('player-total-score').textContent = player.totalScore;
    document.getElementById('computer-total-score').textContent = computer.totalScore;
}

document.getElementById('roll-button').addEventListener('click', () => {
    if (rolls < 3) {
        document.getElementById('roll-button').disabled = true; // Disable the button

        const playerRoll = player.rollDice();
        const computerRoll = computer.rollDice();

        animateDiceRoll(document.getElementById('player-die1'), document.getElementById('player-die2'), playerRoll);
        animateDiceRoll(document.getElementById('computer-die1'), document.getElementById('computer-die2'), computerRoll);

        setTimeout(() => {
            updateScoreTable(rolls + 1, player.roundScore, computer.roundScore);

            rolls++;

            if (rolls === 3) {
                setTimeout(() => {
                    const winner = player.totalScore > computer.totalScore ? 'Player' : 'Computer';
                    document.getElementById('winner').textContent = winner;
                    const gameOverMessage = document.getElementById('game-over-message');
                    gameOverMessage.classList.add('show');
                    setTimeout(() => {
                        gameOverMessage.classList.remove('show');
                    }, 1500); // Duration of the animation
                }, 0); // Add a short delay before showing the alert
            }

            document.getElementById('roll-button').disabled = false;
        }, (10 * 25) + 3000); // Adjust timeout to match the total animation time
    }
});

document.getElementById('reset-button').addEventListener('click', () => {
    const resetMessage = document.getElementById('reset-message');
    resetMessage.classList.add('show');
    setTimeout(() => {
        resetMessage.classList.remove('show');
        
        player.totalScore = 0;
        computer.totalScore = 0;
        rolls = 0;

        document.getElementById('player-die1').src = 'images/d1.svg';
        document.getElementById('player-die2').src = 'images/d1.svg';
        document.getElementById('computer-die1').src = 'images/d1.svg';
        document.getElementById('computer-die2').src = 'images/d1.svg';

        document.getElementById('score-body').innerHTML = ''; // Clear the score table
        document.getElementById('player-total-score').textContent = 0;
        document.getElementById('computer-total-score').textContent = 0;
    }, 1500); // Duration of the animation
});
