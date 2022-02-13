'use strict'

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
	}
	const winningCombinations = [
		['a1', 'a2', 'a3'],
		['b1', 'b2', 'b3'],
		['c1', 'c2', 'c3'],

		['a1', 'b1', 'c1'],
		['a2', 'b2', 'c2'],
		['a3', 'b3', 'c3'],

		['c1', 'b2', 'a3'],
		['a1', 'b2', 'c3'],
	]
	const gameDrawRule = ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3']

	const resetBtns = [
		document.getElementById('resetBtn'),
		document.getElementById('closeIcon'),
		document.getElementById('playAgainButton'),
	]

	const turnAnnouncement = document.querySelector('#turnAnnouncement')
	const winnerAnnouncement = document.querySelector('#winnerAnnouncement')

	//Keeping track of the game:

	const theGame = {
		playerXturn: true,
		playerOturn: false,
		playerXmoves: [],
		playerOmoves: [],

		allPlayerMoves: [],

		gameWinner: '',
		gameOver: false,
	}

	//checking if game is over

	function checkIfGameOver() {
		for (let combination of winningCombinations) {
			if (
				combination.every((gridInC) => theGame.playerXmoves.includes(gridInC))
			) {
				theGame.gameWinner = 'Player X wins!'
				theGame.gameOver = true

				createWinLines(winningCombinations.indexOf(combination), combination)
				gameOverDeclaration()
			} else if (
				combination.every((gridInC) => theGame.playerOmoves.includes(gridInC))
			) {
				theGame.gameWinner = 'Player O wins!'
				theGame.gameOver = true
				createWinLines(winningCombinations.indexOf(combination), combination)
				gameOverDeclaration()
			}
		}
		if (
			gameDrawRule.every((gridthere) =>
				theGame.allPlayerMoves.includes(gridthere)
			)
		) {
			theGame.gameOver = true
			theGame.gameWinner = "It's a draw"
			gameOverDeclaration()
		}
	}

	//declaring the game as over
	function gameOverDeclaration() {
		winnerAnnouncement.textContent = theGame.gameWinner
		turnAnnouncement.textContent = 'Game Over!'
		setTimeout(function () {
			document.querySelector('#gameOverModal').classList.remove('hide')
		}, 1000)
	}

	//resetting game

	function resetGame() {
		theGame.playerXturn = true
		theGame.playerOturn = false
		theGame.playerXmoves = []
		theGame.playerOmoves = []
		theGame.allPlayerMoves = []
		theGame.gameWinner = ''
		theGame.gameOver = false
		turnAnnouncement.textContent = "Player X's turn"
		document.querySelector('#gameOverModal').classList.add('hide')

		for (let grid in gameboardGrids) {
			while (gameboardGrids[grid].firstChild) {
				gameboardGrids[grid].removeChild(gameboardGrids[grid].firstChild)
			}
		}
	}

	for (let btn in resetBtns) {
		resetBtns[btn].addEventListener(
			'click',
			() => {
				resetGame()
			},
			false
		)
	}

	//Creating win lines

	function createWinLines(combinationIndex, combination) {
		let targetedGrids = [
			gameboardGrids[combination[0]],
			gameboardGrids[combination[1]],
			gameboardGrids[combination[2]],
		]
		console.log('comI: ' + combinationIndex)

		targetedGrids.forEach((e) => {
			let createLine = document.createElement('div')
			if (
				combinationIndex === 0 ||
				combinationIndex === 1 ||
				combinationIndex === 2
			) {
				console.log('im here 0')
				createLine.classList.add('win-line', 'win-line-horizontal')
			} else if (
				combinationIndex === 3 ||
				combinationIndex === 4 ||
				combinationIndex === 5
			) {
				console.log('im here 3')
				createLine.classList.add('win-line', 'win-line-vertical')
			} else if (combinationIndex === 6) {
				createLine.classList.add('win-line-diagonal-A3', 'win-line')
			} else if (combinationIndex === 7) {
				createLine.classList.add('win-line', 'win-line-diagonal-A1')
			}
			e.appendChild(createLine)
			console.log(
				'A3: ' + createLine.classList.contains('win-line-diagonal-A3')
			)
			console.log(
				'A1: ' + createLine.classList.contains('win-line-diagonal-A1')
			)
			console.log('H: ' + createLine.classList.contains('win-line-horizontal'))
			console.log('V: ' + createLine.classList.contains('win-line-horizontal'))
		})
	}

	//Public methods and properties:
	return {
		grids: gameboardGrids,
		theGame: theGame,
		turnAnnouncement,
		winnerAnnouncement,
		checkIfGameOver,
	}
})()

// **********************Playing****************************
let GamePlay = (function () {
	function gameMoves(targetGrid, gridCode) {
		if (GameBoard.theGame.gameOver === false) {
			function writeXorO(xo, targetGrid) {
				let wXO = document.createElement('p')
				wXO.classList.add('xoro')
				wXO.innerText = xo
				targetGrid.appendChild(wXO)
			}
			if (targetGrid.firstChild) {
				console.log('invalid move')
			} else {
				if (GameBoard.theGame.playerXturn === true) {
					writeXorO('X', targetGrid)
					GameBoard.theGame.playerXmoves.push(gridCode)
					GameBoard.theGame.allPlayerMoves.push(gridCode)
					GameBoard.theGame.playerXturn = false
					GameBoard.theGame.playerOturn = true
					GameBoard.turnAnnouncement.textContent = "Player O's turn"
				} else if (GameBoard.theGame.playerOturn === true) {
					writeXorO('O', targetGrid)
					GameBoard.theGame.playerOmoves.push(gridCode)
					GameBoard.theGame.allPlayerMoves.push(gridCode)
					GameBoard.theGame.playerXturn = true
					GameBoard.theGame.playerOturn = false
					GameBoard.turnAnnouncement.textContent = "Player X's turn"
				} else {
					console.log('error')
				}
			}
		}
		GameBoard.checkIfGameOver()
		if (GameBoard.theGame.gameOver) {
			console.log(GameBoard.theGame.gameWinner)
			console.log(GameBoard.winnerAnnouncement)
		}
	}
	for (let grid in GameBoard.grids) {
		GameBoard.grids[grid].addEventListener(
			'click',
			() => {
				gameMoves(GameBoard.grids[grid], grid)
			},
			false
		)
	}
})()

// **********************Players****************************

//Factory function to create players

let players = (function () {
	//the players
	const playerFactory = (playerName, playerType) => {
		return {
			playerName: playerName,
			playerType: playerType,
		}
	}
	let playerX = playerFactory('Player X', 'Human')
	let playerO = playerFactory('Player O', 'Human')

	//opening and closing player choice modal
	const playerChoiceModal = document.querySelector('#playerChoice')
	const openPlayerChoice = document.querySelector('#playerChoiceBtns')
	const closePlayerChoiceModal = document.querySelector(
		'#closePlayerChoiceModal'
	)

	openPlayerChoice.addEventListener('click', () => {
		playerChoiceModal.classList.remove('hide')
	})

	closePlayerChoiceModal.addEventListener(
		'click',
		() => {
			playerChoiceModal.classList.add('hide')
		},
		false
	)

	//saving player preferences: modal selectors
	const playerXTypeInput = document.querySelector('#typeOfPlayerX')
	const playerOTypeInput = document.querySelector('#typeOfPlayerO')
	const playerXNameInput = document.querySelector('#playerXName')
	const playerONameInput = document.querySelector('#playerOName')
	const savePlayerPreferencesBtn = document.querySelector(
		'#savePlayerPreferencesBtn'
	)

	//only allow name input if player is human and set player type
	const allowNameWhenHuman = function (type, fieldset) {
		let playerNameSetting =
			fieldset === 'X' ? playerXNameInput.value : playerONameInput.value
		if (type === 'Computer') {
			document.querySelector('#fielsetName' + fieldset).classList.add('hide')
			playerNameSetting = 'Player ' + fieldset //makes sure name doesnt change when type is computer
		} else if (type === 'Human') {
			document.querySelector('#fielsetName' + fieldset).classList.remove('hide')
		}
	}
	playerXTypeInput.addEventListener(
		'change',
		() => {
			allowNameWhenHuman(playerXTypeInput.value, 'X')
		},
		false
	)
	playerOTypeInput.addEventListener(
		'change',
		() => {
			allowNameWhenHuman(playerOTypeInput.value, 'O')
		},
		false
	)

	//Displaying Player Names on the board buttons:selectors & Updating the player's names
	let updateNameOnBoard = function () {
		const playerXNameDisplaySelector = document.querySelector(
			'#playerXNameDiyplayBtn'
		)
		const playerONameDisplaySelector = document.querySelector(
			'#playerONameDiyplayBtn'
		)
		playerXNameDisplaySelector.innerText = playerX.playerName
		playerONameDisplaySelector.innerText = playerO.playerName
	}

	savePlayerPreferencesBtn.addEventListener(
		'click',
		() => {
			if (playerXNameInput.value) {
				playerX.playerName = playerXNameInput.value
			}
			if (playerONameInput.value) {
				playerO.playerName = playerONameInput.value
			}
			playerO.playerName = playerONameInput.valueplayerX.playerType =
				playerXTypeInput.value
			playerO.playerType = playerOTypeInput.value
			updateNameOnBoard()
			playerChoiceModal.classList.add('hide')
		},
		false
	)

	return {
		playerX,
		playerO,
	}
})()

//Automated computer play
