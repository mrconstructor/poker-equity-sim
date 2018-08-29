import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class Board extends React.Component {
  
  render() {
    return (
    
      <div className="board">

        <div className="street">
          <div className="street-name">Flop:</div>
            {(this.props.cards.length >= 3) ? [
              renderCard(this.props.cards[0]),
              renderCard(this.props.cards[1]),
              renderCard(this.props.cards[2]),
              ] : [
                renderCard(-1),
                renderCard(-1),
                renderCard(-1)
                ]}
        </div>

        <div className="street">
          <div className="street-name">Turn:</div>
            {(this.props.cards.length >= 4) ? [
              renderCard(this.props.cards[3]),
              ] : renderCard(-1)}
        </div>

        <div className="street">
          <div className="street-name">River:</div>
            {(this.props.cards.length >= 5) ? [
              renderCard(this.props.cards[4]),
              ] : renderCard(-1)}
        </div>

      </div>

    );
  }
}

class Simulator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deck: this.getNewDeck(),
      dealerDeck: {
        deck: null,
        nextCardIndex: 0,
      },
      numHoleCards: 2,
      numPlayers: 2,
      playerHands: [
        [],
        []
      ],
      boardCards: []
    }

    this.dealerDeck = null;
    this.playerHands = null;
    this.boardCards = [];
    this.numPlayers = 2;
    this.numHoleCards = 2;
    this.nextCardIndex = 0;
  }

  dealNew() {
    this.dealerDeck = this.getShuffled(this.getNewDeck());
    this.playerHands = Array(this.state.numPlayers);
    this.boardCards = [];
    this.nextCardIndex = 0;

    let nextCardIndex = 0;
    console.log("Hole cards: " + this.state.numHoleCards);
    console.log("num players: " + this.playerHands.length);

    for (let i = 0; i < this.playerHands.length; i++) {
      this.playerHands[i] = [];
    }

    console.log("playerHands: ", this.playerHands);
    for (let i = 0; i < this.state.numHoleCards; i++) {
      for (let j = 0; j < this.playerHands.length; j++) {
        let card = this.dealerDeck[this.nextCardIndex];
        this.playerHands[j].push(card);
        this.nextCardIndex++;
      }
    }

    this.dealCommonCards(3);
    this.dealCommonCards(1);
    this.dealCommonCards(1);

    this.setState({
      dealerDeck: {
        deck: this.dealerDeck,
        nextCardIndex: this.nextCardIndex
      },
      playerHands: this.playerHands,
      boardCards: this.boardCards,
    });
  }

  dealCommonCards(numCards) {
    for (let i = 0; i < numCards; i++) {
      this.boardCards.push(this.dealerDeck[this.nextCardIndex]);
      this.nextCardIndex++;
    }
  }

  render() {
    //<button>Select hand 1</button>
    //<button>Select hand 2</button>


    const cards = this.state.deck.map((card, index) => {
      return (
        <span key={index}>{renderCard(card)}</span>
      );
    });

    const players = this.state.playerHands.map((player, index) => {
      return (
        <div key={index} className="player-seat">
          <div className="player-name">Player {index + 1}</div>
          <div>
            {renderCard(player[0])}
            {renderCard(player[1])}
          </div>
        </div>
      );
    });

    return (
      <div>
        <h1>Next steps</h1>
        <ul>
          <li class="done">Press to simulate one deal (player 1 and 2, as well as flop turn river</li>
          <li>Tell who won (only counting high cards)</li>
          <li>Support some more hands, one pair, two pairs, etc...</li>
          <li>Separate dealing hole cards and board</li>
          <li>Allow rerunning the board deal (after reshuffling remaining cards)</li>

          <li>Let user pick hands for both players</li>
        </ul>
        <div>
          Flop: {renderCard(-1)} <input /><input />
        </div>
        <div>

          <label htmlFor="hand1">Hand 1</label><input id="hand1" type="text" />
          <label htmlFor="hand2">Hand 2</label><input id="hand2" type="text" />
          <button onClick={this.start}>Simulate</button>
          <button onClick={this.stop}>Stop</button>
          <button onClick={() => this.dealNew()}>Deal hand</button>


          <div className="game-room">
            <div>{players}</div>

            <Board cards={this.boardCards} />
          </div>
          
          <div>
            <div>Deck {getRandomInt(0, 0)}</div>

            <div><button onClick={() => this.shuffle()}>Shuffle</button></div>
            <div>{cards}</div>
          </div>
        </div>
      </div>
    );
  }


  shuffle() {
    let deck = this.state.deck.slice();
    deck = this.getShuffled(deck);
    this.setState({
      deck: deck,
    });
  }

  start() {
    // TODO make asynchronous etc
    for (let i = 0; i < 1000; i++) {
      this.simulateGame();
    }
  }

  getNewDeck() {
    const deck = Array(52);
    for (let i = 0; i < deck.length; i++) {
      deck[i] = i;
    }
    return deck;
  }

  simulateGame() {
    
    //const deck = this.getNewDeck();
    //return this.getShuffled(deck);
    // TODO shuffle deck
  }

  getShuffled(deck) {
    const a = Array(deck.length);
    for (let i = 0; i < a.length; i++) {
      a[i] = i;
    }
    
    const drawn = Array(deck.length).fill(null);
    const shuffled = Array(deck.length);
    let cardsLeft = shuffled.length;

    for (let i = 0; i < shuffled.length; i++) {
      if (cardsLeft < 1) {
        console.log("Error no cards left to draw from");
      }
      const picked = getRandomInt(0, cardsLeft-1);

      let index = 0;
      let cardsSkipped = 0;

      let found = false;
      do {
        while (drawn[index]) {
          index++;
        }
        if (cardsSkipped === picked) {
          found = true;
          break;
        }
        cardsSkipped++;
        index++;
      } while (index < shuffled.length);

      if (!found) {
        console.log("Error: couldn't find card to draw");
      }
      if (drawn[index]) {
        console.log("Error: Drawing same card twice (with index: " + picked + ")");
      }
      //console.log("Drawing available card index: " + picked + " (index " + index + " overall)");

      cardsLeft--;
      drawn[index] = true;
      shuffled[i] = deck[index];
    }

    return shuffled;
  }

  

}

ReactDOM.render(
  <Simulator />,
  document.getElementById('root')
);


function renderCard(cardIndex, cardKey) {
  const card = indexToCardName(cardIndex);

  const classes = {
    'h': 'hearts',
    'd': 'diamonds',
    'c': 'clubs',
    's': 'spades',
  }

  let cardClass;
  let cardValue;
  if (cardIndex < 0) {
    cardClass = 'unknown';
    cardValue = '?';
  } else {
    cardClass = classes[card[1]];
    cardValue = card[0];
  }

  return (
    <span key={cardKey} className={cardClass + " card clickable"}>{cardValue}</span>
  );
}



function indexToSuit(i) {
  if (i >= 0 && i <= 12) {
    return 'h';
  } else if (i >= 13 && i <= 25) {
    return 'd';
  } else if (i >= 26 && i <= 38) {
    return 'c';
  } else {
    return 's';
  }
}

function indexToCardName(i) {
  if (i < 0 || i > 51) {
    console.log("error, invalid card index: " + i);
  }

  // 0-12 hearts, 13-25 diamonds, 26-38 clubs, 39-51 spades
  let suit;
  let value;
  if (i >= 0 && i <= 12) {
    suit = 'h';
    value = i;
  } else if (i >= 13 && i <= 25) {
    suit = 'd';
    value = i - 13;
  } else if (i >= 26 && i <= 38) {
    suit = 'c';
    value = i - 26;
  } else {
    suit = 's';
    value = i - 39;
  }

  const valueNotation = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  return [valueNotation[value], suit];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}