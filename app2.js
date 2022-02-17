// game with AI (still trying)

'use strict';

// **********************Game Board****************************

let GameBoard = (function () {
	const gameboardGrids = {
		a1: document.querySelector('#A1'),
		a2: document.querySelector('#A2'),
		a3: document.querySelector('#A3'),
		b1: document.querySelector('#B1'),
		b2: document.querySelector('#B2'),
		b3: document.querySelector('#B3'),
		c1: document.querySelector('#C1'),
		c2: document.querySelector('#C2'),
		c3: document.querySelector('#C3'),
	};
	const winningCombinations = [
		['a1', 'a2', 'a3'],
		['b1', 'b2', 'b3'],
		['c1', 'c2', 'c3'],

		['a1', 'b1', 'c1'],
		['a2', 'b2', 'c2'],
		['a3', 'b3', 'c3'],

		['c1', 'b2', 'a3'],
		['a1', 'b2', 'c3'],
	];
	const gameDrawRule = ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3'];

	//Reset btns: in this module, they only reset the board. Also used in GamePlayHumansAndComputers module.
	const resetBtns = [
		document.getElementById('resetBtn'),
		document.getElementById('closeIcon'), // this is the only reset button that will reset the players as well (see GamePlayHumansAndComputers module)
		document.getElementById('playAgainButton'),
	];

	const turnAnnouncement = document.querySelector('#turnAnnouncement');
	const winnerAnnouncement = document.querySelector('#winnerAnnouncement');

	//Keeping track of the game:

	const theGame = {
		playerXturn: true,
		playerOturn: false,
		playerXmoves: [],
		playerOmoves: [],

		allPlayerMoves: [],

		gameWinner: '',
		gameOver: false,
	};

	//checking if game is over

	function checkIfGameOver() {
		for (let combination of winningCombinations) {
			if (combination.every((gridInC) => theGame.playerXmoves.includes(gridInC))) {
				theGame.gameWinner = 'Player X wins!';
				theGame.gameOver = true;
				createWinLines(winningCombinations.indexOf(combination), combination);
				gameOverDeclaration();
			} else if (combination.every((gridInC) => theGame.playerOmoves.includes(gridInC))) {
				theGame.gameWinner = 'Player O wins!';
				theGame.gameOver = true;
				createWinLines(winningCombinations.indexOf(combination), combination);
				gameOverDeclaration();
			}
		}

		if (gameDrawRule.every((gridthere) => theGame.allPlayerMoves.includes(gridthere))) {
			if (theGame.gameOver === false) {
				theGame.gameOver = true;
				theGame.gameWinner = "It's a draw";
				gameOverDeclaration();
			} else {
				gameOverDeclaration();
			}
		}
	}

	//declaring the game as over
	function gameOverDeclaration() {
		winnerAnnouncement.textContent = theGame.gameWinner;
		turnAnnouncement.textContent = 'Game Over!';
		setTimeout(function () {
			document.querySelector('#gameOverModal').classList.remove('hide');
			PageDecorationBehaviour.getDecorationDarker();
		}, 750);
	}

	//resetting game

	function resetGame() {
		theGame.playerXturn = true;
		theGame.playerOturn = false;
		theGame.playerXmoves = [];
		theGame.playerOmoves = [];
		theGame.allPlayerMoves = [];
		theGame.gameWinner = '';
		theGame.gameOver = false;
		turnAnnouncement.textContent = "Player X's turn";
		document.querySelector('#gameOverModal').classList.add('hide');
		PageDecorationBehaviour.getDecorationLighter();

		for (let grid in gameboardGrids) {
			while (gameboardGrids[grid].firstChild) {
				gameboardGrids[grid].removeChild(gameboardGrids[grid].firstChild);
			}
		}
	}

	for (let btn in resetBtns) {
		resetBtns[btn].addEventListener(
			'click',
			() => {
				resetGame();
			},
			false
		);
	}
	savePlayerPreferencesBtn.addEventListener(
		'click',
		() => {
			resetGame();
		},
		false
	);

	//Creating win lines

	function createWinLines(combinationIndex, combination) {
		let targetedGrids = [
			gameboardGrids[combination[0]],
			gameboardGrids[combination[1]],
			gameboardGrids[combination[2]],
		];

		targetedGrids.forEach((e) => {
			let createLine = document.createElement('div');
			if (combinationIndex === 0 || combinationIndex === 1 || combinationIndex === 2) {
				createLine.classList.add('win-line', 'win-line-horizontal');
			} else if (combinationIndex === 3 || combinationIndex === 4 || combinationIndex === 5) {
				createLine.classList.add('win-line', 'win-line-vertical');
			} else if (combinationIndex === 6) {
				createLine.classList.add('win-line-diagonal-A3', 'win-line');
			} else if (combinationIndex === 7) {
				createLine.classList.add('win-line', 'win-line-diagonal-A1');
			}
			e.appendChild(createLine);
		});
	}

	//Public methods and properties:
	return {
		grids: gameboardGrids,
		theGame: theGame,
		resetBtns,
		winningCombinations,
		turnAnnouncement,
		winnerAnnouncement,
		checkIfGameOver,
	};
})();

// **********************GAME PLAY : What happens when human or computer plays****************************
let GamePlay = (function () {
	function gameMoves(targetGrid, gridCode) {
		if (GameBoard.theGame.gameOver === false) {
			function writeXorO(xo, targetGrid) {
				let wXO = document.createElement('p');
				wXO.classList.add('xoro');
				wXO.innerText = xo;
				targetGrid.appendChild(wXO);
			}
			if (targetGrid.firstChild) {
				console.log('invalid move');
			} else {
				if (GameBoard.theGame.playerXturn === true) {
					writeXorO('X', targetGrid);
					PageDecorationBehaviour.changeDecorationColor('X');
					GameBoard.theGame.playerXmoves.push(gridCode);
					GameBoard.theGame.allPlayerMoves.push(gridCode);
					GameBoard.theGame.playerXturn = false;
					GameBoard.theGame.playerOturn = true;
					GameBoard.turnAnnouncement.textContent = "Player O's turn";
				} else if (GameBoard.theGame.playerOturn === true) {
					writeXorO('O', targetGrid);
					PageDecorationBehaviour.changeDecorationColor('O');
					GameBoard.theGame.playerOmoves.push(gridCode);
					GameBoard.theGame.allPlayerMoves.push(gridCode);
					GameBoard.theGame.playerXturn = true;
					GameBoard.theGame.playerOturn = false;
					GameBoard.turnAnnouncement.textContent = "Player X's turn";
				} else {
					console.log('error');
				}
			}
		}
		GameBoard.checkIfGameOver();
	}
	return { gameMoves };
})();

// **********************Players****************************

//Factory function to create players

let Players = (function () {
	//the players
	const playerFactory = (playerName, playerType) => {
		return {
			playerName: playerName,
			playerType: playerType,
		};
	};
	let playerX = playerFactory('Human', 'Human');
	let playerO = playerFactory('Human', 'Human');

	//opening and closing player choice modal
	const playerChoiceModal = document.querySelector('#playerChoice');
	const openPlayerChoice = document.querySelector('#playerChoiceBtns');
	const closePlayerChoiceModal = document.querySelector('#closePlayerChoiceModal');

	openPlayerChoice.addEventListener('click', () => {
		playerChoiceModal.classList.remove('hide');
		PageDecorationBehaviour.getDecorationDarker();
	});

	closePlayerChoiceModal.addEventListener(
		'click',
		() => {
			playerChoiceModal.classList.add('hide');
			PageDecorationBehaviour.getDecorationLighter();
		},
		false
	);

	//saving player preferences: modal selectors
	const playerXTypeInput = document.querySelector('#typeOfPlayerX');
	const playerOTypeInput = document.querySelector('#typeOfPlayerO');
	const playerXNameInput = document.querySelector('#playerXName');
	const playerONameInput = document.querySelector('#playerOName');
	const savePlayerPreferencesBtn = document.querySelector('#savePlayerPreferencesBtn');

	//only allow name input if player is human
	const allowNameWhenHuman = function (type, fieldset) {
		if (type === 'Computer') {
			document.querySelector('#fielsetName' + fieldset).classList.add('hide');
		} else if (type === 'Human') {
			document.querySelector('#fielsetName' + fieldset).classList.remove('hide');
		}
	};
	playerXTypeInput.addEventListener(
		'change',
		() => {
			allowNameWhenHuman(playerXTypeInput.value, 'X');
		},
		false
	);
	playerOTypeInput.addEventListener(
		'change',
		() => {
			allowNameWhenHuman(playerOTypeInput.value, 'O');
		},
		false
	);

	//Displaying Player Names on the board buttons:selectors & Updating the player's names
	let updateNameOnBoard = function () {
		const playerXNameDisplaySelector = document.querySelector('#playerXNameDiyplayBtn');
		const playerONameDisplaySelector = document.querySelector('#playerONameDiyplayBtn');

		playerXNameDisplaySelector.innerText = playerX.playerName;
		playerONameDisplaySelector.innerText = playerO.playerName;
	};

	savePlayerPreferencesBtn.addEventListener(
		'click',
		() => {
			//if the player has put in a name, that will be saved. if not, it is either 'Human' or 'Computer'
			if (playerXTypeInput.value === 'Human') {
				if (playerXNameInput.value) {
					playerX.playerName = playerXNameInput.value;
				} else {
					playerX.playerName = 'Human';
				}
			} else if (playerXTypeInput.value === 'Computer') {
				playerX.playerName = 'Computer';
			}
			if (playerOTypeInput.value === 'Human') {
				if (playerONameInput.value) {
					playerO.playerName = playerONameInput.value;
				} else {
					playerO.playerName = 'Human';
				}
			} else if (playerOTypeInput.value === 'Computer') {
				playerO.playerName = 'Computer';
			}
			playerX.playerType = playerXTypeInput.value;
			playerO.playerType = playerOTypeInput.value;
			updateNameOnBoard();
			playerChoiceModal.classList.add('hide');
		},
		false
	);

	return {
		playerX,
		playerO,
		savePlayerPreferencesBtn,
		playerXTypeInput,
		playerOTypeInput,
		updateNameOnBoard,
	};
})();

// **********************GAME PLAY: Humans and Computers making moves****************************

let GamePlayHumansAndComputers = (function () {
	//generating random computer move
	function generateRandomMove() {
		let allMoves = ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3'];
		let allMovesPossible = [];

		for (let move in allMoves) {
			if (!GameBoard.theGame.allPlayerMoves.includes(allMoves[move])) {
				allMovesPossible.push(allMoves[move]);
			}
		}

		let getRandomIndex = Math.floor(Math.random() * allMovesPossible.length);
		let targetedGrid = allMovesPossible[getRandomIndex];

		return [GameBoard.grids[targetedGrid], allMovesPossible[getRandomIndex]]; //returns the targeted grid, and the corresponding key
	}

	function computerPlay() {
		let theMove = generateRandomMove();
		GamePlay.gameMoves(theMove[0], theMove[1]);
		GameBoard.checkIfGameOver();
	}

	//generating AI move
	let generateAIMove = function (XorO) {
		let allMoves = ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3'];
		let allMovesPossible = [];
		for (let move in allMoves) {
			if (!GameBoard.theGame.allPlayerMoves.includes(allMoves[move])) {
				allMovesPossible.push(allMoves[move]);
			}
		}
		let theAIplayerMoves = XorO === "X" ? GameBoard.theGame.playerXmoves : GameBoard.theGame.playerOmoves;
		let theAIopponentMoves = XorO === "X" ? GameBoard.theGame.playerOmoves : GameBoard.theGame.playerXmoves;

		function minMax() {
			if (allMovesPossible.length === 0) {
				return { score: 0 }
			}
			for (let combination of GameBoard.winningCombinations) {
				if (combination.every((gridInC) => theAIopponentMoves.includes(gridInC))) {
					return { score: -10 };
				} else if (combination.every((gridInC) => theAIplayerMoves.includes(gridInC))) {
					return { score: 10 }
				}
			}
		}

		let moveScores = [];

		for (let availableMove in allMovesPossible) {
			let availMove = {};
			availMove.grid = availableMove;

		}
		// helpful video: https://www.youtube.com/watch?v=x_Je9i3aKNk



	}

	// 	for (let move in allMoves) {
	// 		if (!GameBoard.theGame.allPlayerMoves.includes(allMoves[move])) {
	// 			allMovesPossible.push(allMoves[move]);
	// 		}
	// 	}

	// 	let getRandomIndex = Math.floor(Math.random() * allMovesPossible.length);
	// 	let targetedGrid = allMovesPossible[getRandomIndex];

	// 	return [GameBoard.grids[targetedGrid], allMovesPossible[getRandomIndex]]; //returns the targeted grid, and the corresponding key
	// }

	// function computerPlay() {
	// 	let theMove = generateRandomMove();
	// 	GamePlay.gameMoves(theMove[0], theMove[1]);
	// 	GameBoard.checkIfGameOver();
	// }

	//Player types
	let playerXisComputer = false;
	let playerOisComputer = false;
	let playerXisAI = false;
	let playerOisAI = false;

	//Logic that checks type of player. If X is computer, it makes the first move. If both are computers, it starts the game.
	function ifXorXandOisComputer() {
		if (playerXisComputer === true && playerOisComputer === false) {
			//makes the first computer move
			setTimeout(function () {
				computerPlay();
			}, 200);
		} else if (playerXisComputer === true && playerOisComputer === true) {
			let timerID = setInterval(setDelayedMove, 300);
			function setDelayedMove() {
				computerPlay();
				if (GameBoard.theGame.gameOver === true) {
					clearInterval(timerID);
				}
			}
		}
	}

	//Event listener that check type of player. If X is computer, it makes the first move. If both are computers, it starts the game.

	Players.savePlayerPreferencesBtn.addEventListener('click', () => {
		Players.playerXTypeInput.value === 'Computer' ? ((playerXisComputer = true) && (playerXisAI = false)) : (playerXisComputer = false);
		Players.playerOTypeInput.value === 'Computer' ? ((playerOisComputer = true) && (playerOisAI = false)) : (playerOisComputer = false);
		Players.playerXTypeInput.value === 'AI' ? (playerXisAI = true) && (playerXisComputer = false) : (playerXisAI = false);
		Players.playerOTypeInput.value === 'AI' ? (playerOisAI = true) && (playerOisComputer = false) : (playerOisAI = false);
		console.log(typeof Players.playerXTypeInput.value)
		console.log(Players.playerOTypeInput.value)

		ifXorXandOisComputer();
	});

	//Event listener to user's clicks on the Board. If both are humans, it lets them play. If one is a computer, it sets the move after the user
	for (let grid in GameBoard.grids) {
		GameBoard.grids[grid].addEventListener(
			'click',
			() => {
				if (
					(playerXisComputer === true && playerOisComputer === false) ||
					(playerXisComputer === false && playerOisComputer === true)
				) {
					GamePlay.gameMoves(GameBoard.grids[grid], grid);
					setTimeout(function () {
						computerPlay();
					}, 50);
				} else if (playerXisComputer === false && playerOisComputer === false) {
					GamePlay.gameMoves(GameBoard.grids[grid], grid);
				}
			},
			false
		);
	}
	//Event listener to re-start game according to player type
	let gameResettingBtns = [GameBoard.resetBtns[0], GameBoard.resetBtns[2]];
	for (let btn of gameResettingBtns) {
		btn.addEventListener(
			'click',
			() => {
				ifXorXandOisComputer();
			},
			false
		);
	}

	//Event listener to reset players
	let playerResetting = GameBoard.resetBtns[1];
	playerResetting.addEventListener(
		'click',
		() => {
			Players.playerX.playerType = 'Human';
			Players.playerO.playerType = 'Human';
			Players.playerX.playerName = 'Human';
			Players.playerO.playerName = 'Human';
			playerXisComputer = false;
			playerOisComputer = false;
			Players.updateNameOnBoard();
		},
		false
	);

	//Public variables
	return {
		playerXisComputer,
		playerOisComputer,
	}
})();

// **********************PAGE BACKGROUND DECORATION****************************

let PageDecorationBehaviour = (function () {
	// when modals are open, page background decoration gets darker
	let decorativeXandO = document.querySelectorAll('.decorationLetter');
	function getDecorationDarker() {
		for (let element of decorativeXandO) {
			element.classList.add('darkerDeco');
		}
	}
	function getDecorationLighter() {
		for (let element of decorativeXandO) {
			element.classList.remove('darkerDeco');
		}
	}

	//when user plays, decoration changes color
	let decorativeX = document.querySelectorAll('.decorationLetterX');
	let decorativeO = document.querySelectorAll('.decorationLetterO');

	function changeDecorationColor(XorO) {
		let deco = XorO === 'X' ? decorativeX : decorativeO;
		for (let element of deco) {
			element.classList.add('brighterDeco');
		}
		setTimeout(() => {
			for (let element of deco) {
				element.classList.remove('brighterDeco');
			}
		}, 250);
	}

	return {
		getDecorationDarker,
		getDecorationLighter,
		changeDecorationColor,
	};
})();




let generateAIMove = function (XorO) {
	let allMoves = ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3'];
	let allMovesPossible = [];
	for (let move in allMoves) {
		if (!GameBoard.theGame.allPlayerMoves.includes(allMoves[move])) {
			allMovesPossible.push(allMoves[move]);
		}
	}
	let theAIplayerMoves = XorO === "X" ? GameBoard.theGame.playerXmoves : GameBoard.theGame.playerOmoves;
	let theAIopponentMoves = XorO === "X" ? GameBoard.theGame.playerOmoves : GameBoard.theGame.playerXmoves;

	console.log("allMovesPossible: " + allMovesPossible)

	if (allMovesPossible.length === 0) {
		return { score: 0 }
	}
	for (let combination of GameBoard.winningCombinations) {
		if (combination.every((gridInC) => theAIopponentMoves.includes(gridInC))) {
			return { score: -1 };
		} else if (combination.every((gridInC) => theAIplayerMoves.includes(gridInC))) {
			return { score: 1 }
		}
	}

}