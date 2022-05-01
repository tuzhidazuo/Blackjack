


//Challenge 5: Blackjack

let blackjackGame = {
    'you': {'div': '#your-box', 'scoreSpan': '#your-blackjack-result', 'score': 0},
    'dealer': {'div': '#dealer-box', 'scoreSpan': '#dealer-blackjack-result', 'score': 0},
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
    'cardsMap': {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': [1, 11]},
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'turnsOver': false,
}


const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];
const hitSound = new Audio('static/sounds/swish.m4a')
const winSound = new Audio('static/sounds/cash.mp3')
const lossSound = new Audio('static/sounds/aww.mp3')

document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);
document.querySelector('#blackjack-stand-button').addEventListener('click', dealerBot);
document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);

function blackjackHit() {
    if (blackjackGame['isStand'] === false) {
        let randomCard = randomCards()
        showCard(YOU, randomCard);
        updateScore(YOU, randomCard);
        showScore(YOU)
    }
}

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}


async function dealerBot() {
    blackjackGame['isStand'] = true;
    while (DEALER['score'] < 16) {
        let randomCard = randomCards();
        showCard(DEALER, randomCard);
        updateScore(DEALER, randomCard);
        showScore(DEALER);
        await sleep(1000)
    }
    if (blackjackGame['turnsOver'] === false) {
        showResult(computerWinner());
        blackjackGame['turnsOver'] = true;
    }
    
}


function showCard(activePlayer, Card) {
    if (activePlayer['score'] < 21) {
        let carImage = document.createElement('img');
        carImage.src = `static/images/${Card}.png`;
        document.querySelector(activePlayer['div']).appendChild(carImage);
        hitSound.play();
    } else{

    }
}


function blackjackDeal() {
    if (blackjackGame['turnsOver'] === true && blackjackGame['isStand'] === true) {
        clearAllCards(YOU);
        clearAllCards(DEALER);
        YOU['score'] = 0;
        DEALER['score'] = 0;
    
        document.querySelector(YOU['scoreSpan']).textContent = YOU['score'];
        document.querySelector(DEALER['scoreSpan']).textContent = DEALER['score'];
    
        document.querySelector(YOU['scoreSpan']).style.color = 'white'
        document.querySelector(DEALER['scoreSpan']).style.color = 'white'
    
        document.querySelector('#blackjack-result').textContent = "Let's play!";
        document.querySelector('#blackjack-result').style.color = 'black';
        
        blackjackGame['isStand'] = false;
        blackjackGame['turnsOver'] = false;
    }

}


function clearAllCards(activePlayer) {
    let AllCards = document.querySelector(activePlayer['div']).querySelectorAll('img');
    //AllCards[0].remove()
    for (i=0; i<AllCards.length; i++) {
        AllCards[i].remove();
    }
}


function randomCards() {
    let ranNum0_12 = Math.floor(Math.random() * 13);
    return blackjackGame['cards'][ranNum0_12];
}


function updateScore(activePlayer, card) {
    if (card === 'A') {
        if (activePlayer['score'] + blackjackGame['cardsMap'][card][1]<=21) {
            activePlayer['score'] += blackjackGame['cardsMap'][card][1];
        } else {
            activePlayer['score'] += blackjackGame['cardsMap'][card][0];
        }
    } else {
        activePlayer['score'] += blackjackGame['cardsMap'][card];
    }
    
}


function showScore(activePlayer) {
    if (activePlayer['score'] <= 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    } else {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST'; 
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    }
}

function computerWinner() {
    let winner;
    if (YOU['score'] <= 21){
        if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21) {
            winner = YOU;
            blackjackGame['wins']++;
        } else if (YOU['score'] < DEALER['score'] && DEALER['score'] <= 21) {
            winner = DEALER;
            blackjackGame['losses']++;
        } else if (YOU['score'] === DEALER['score']) { 
            winner = 'Nobody';
            blackjackGame['draws']++;
        }
    } else {
        if (DEALER['score'] <= 21) {
            winner = DEALER;
            blackjackGame['losses']++;          
        } else {
            winner = 'Nobody';
            blackjackGame['draws']++;
        }
    } 
    return winner;
}

function showResult(winner) {
    let showedMsg, showedColor;
    if (winner === YOU) {
        showedMsg = 'You Win!';
        showedColor = 'green';
        document.querySelector('#wins').textContent = blackjackGame['wins'];
        winSound.play();
    } else if (winner === DEALER) {
        showedMsg = 'You Lost!'
        showedColor = 'red';
        document.querySelector('#losses').textContent = blackjackGame['losses'];
        lossSound.play();
    } else {
        showedMsg = 'Drew';
        showedColor = 'yellow';
        document.querySelector('#draws').textContent = blackjackGame['draws'];
    }
    document.querySelector('#blackjack-result').textContent = showedMsg;
    document.querySelector('#blackjack-result').style.color = showedColor;
    //document.getElementById('blackjack-result').textContent = showedMsg;
    //document.getElementById('blackjack-result').style.color = showedColor;
}