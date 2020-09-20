'use strict'

let deck = []
let playerOne = []
let playerTwo = []
let board = []
let startingTile

/// DOM elements
const game = document.querySelector('#game')

// Create Name func
const fixTileName = (arr) => arr.join('-')

/// creating Image func
/// src would be either domino_back or domino_tiles
const createImage = (tiles, src, domEl) => {
  tiles.map((tile) => {
    const img = document.createElement('img')
    img.src = `./assets/${src}/${fixTileName(tile)}.jpg`
    domEl.appendChild(img)
  })
}

//Create Element
function createAppend(tag, content, domEl) {
  const element = document.createElement(tag)
  if (Array.isArray(content)) {
    content.map((c) => element.append(c))
  } else {
    element.append(content)
  }
  domEl.appendChild(element)
}

// Game Logic Funcs
const createDeck = (deck) => {
  for (let i = 0; i <= 6; i++) {
    for (let j = i; j <= 6; j++) {
      deck.push([i, j])
    }
  }

  return deck
}

const shuffleSelect = (deck, array, numElem) => {
  for (let i = 0; i < numElem; i++) {
    let index = Math.floor(Math.random() * deck.length)
    array.unshift(deck[index])
    deck.splice(index, 1)
  }
}

const selectTiles = (deck, playerOne, playerTwo) => {
  shuffleSelect(deck, playerOne, 7)
  shuffleSelect(deck, playerTwo, 7)
}

const findValidTile = (deck, playerTiles, boardTiles) => {
  let validTileFound = false
  let validTile = []

  while (!validTileFound && deck.length > 0) {
    validTile = playerTiles.find((tile) => {
      return (
        tile[0] === boardTiles[0][0] ||
        tile[0] === boardTiles[boardTiles.length - 1][1] ||
        tile[1] === boardTiles[0][0] ||
        tile[1] === boardTiles[boardTiles.length - 1][1]
      )
    })

    validTile === undefined
      ? deck.length > 0
        ? shuffleSelect(deck, playerTiles, 1)
        : (validTileFound = true)
      : (validTileFound = true)
  }
  return validTile
}

const handDisplay = (array) => {
  let display
  if (array.length > 0) {
    display = array.reduce(
      (display, element) =>
        (display +=
          element !== undefined ? `<${element[0]}:${element[1]}> ` : ''),
      ''
    )
  }
  return display
}

const gameLogic = (board, playerTiles, validTile, pass) => {
  if (validTile !== undefined) {
    const validTileIndex = playerTiles.indexOf(validTile)
    playerTiles.splice(validTileIndex, 1)

    if (validTile[0] === board[0][0]) {
      let rotated = validTile.reverse()
      board.unshift(rotated)
    } else if (validTile[1] === board[0][0]) {
      board.unshift(validTile)
    } else if (validTile[0] === board[board.length - 1][1]) {
      board.push(validTile)
    } else {
      const rotated = validTile.reverse()
      board.push(rotated)
    }
  } else {
    pass.push(1)
  }
}

const gamePlay = (deck, board, playerOne, playerTwo) => {
  let numPass = []
  while (playerOne.length > 0 && playerTwo.length > 0 && numPass.length !== 2) {
    const validTilePlayerOne = findValidTile(deck, playerOne, board)
    gameLogic(board, playerOne, validTilePlayerOne, numPass)

    createAppend('p', `Bob played: ${handDisplay([validTilePlayerOne])}`, game)
    createAppend('p', `Board is now : ${handDisplay(board)}`, game)
    createAppend(
      'p',
      '___________________________________________________________',
      game
    )
    numPass = []

    if (playerOne.length > 0) {
      const validTilePlayerTwo = findValidTile(deck, playerTwo, board)
      gameLogic(board, playerTwo, validTilePlayerTwo, numPass)

      createAppend(
        'p',
        `Alice played: ${handDisplay([validTilePlayerTwo])}`,
        game
      )
      createAppend('p', `Board is now : ${handDisplay(board)}`, game)
    } else {
      createAppend(
        'p',
        `Bob won the game!!! Congrats. And Alice's tiles are : ${handDisplay(
          playerTwo
        )} `,
        game
      )
    }

    if (playerTwo.length === 0) {
      createAppend(
        'p',
        `Alice won the game!! Congrats!! Bob's tiles are : ${handDisplay(
          playerOne
        )}`,
        game
      )
    }

    if (deck.length === 0) {
      createAppend('p', 'Deck is out of tile', game)
      createAppend('p', `Bob's tiles are ${handDisplay(playerOne)}`, 'p', game)
      createAppend('p', `Alice's tiles are ${handDisplay(playerTwo)}`, game)
      let totalTileOne = [...playerOne]
      let totalTileTwo = [...playerTwo]
      const totalPlayerOne = totalTileOne.reduce(
        (tile, sum) => (sum += tile[0] + tile[1]),
        0
      )
      const totalPlayerTwo = totalTileTwo.reduce(
        (tile, sum) => (sum += tile[0] + tile[1]),
        0
      )

      if (totalPlayerOne < totalPlayerTwo) {
        createAppend(
          'p',
          `Bob win the game. Yay Cheers. And he has ${handDisplay(playerOne)}`,
          game
        )
      } else {
        createAppend(
          'p',
          `Alice win the game. Yay Cheers. And he has ${handDisplay(
            playerTwo
          )}`,
          game
        )
      }
    }
    createAppend(
      'p',
      '___________________________________________________________',
      game
    )
  }
}

const gameBoard = () => {
  createAppend('p', 'Game Started', game)

  createDeck(deck)
  createAppend('p', 'Deck is ready.', game)
  createAppend(
    'p',
    '___________________________________________________________',
    game
  )

  selectTiles(deck, playerOne, playerTwo)
  createAppend('p', `Bob's hand is ${handDisplay(playerOne)}`, game)
  createAppend('p', `Alice's hand is,${handDisplay(playerTwo)}`, game)
  createAppend(
    'p',
    '___________________________________________________________',
    game
  )

  shuffleSelect(deck, board, 1)
  createAppend(
    'p',
    `Game is starting with the tile ${handDisplay(board)}`,
    game
  )
  createAppend('p', `GamePlay Tiles in deck are ${handDisplay(deck)}`, game)

  gamePlay(deck, board, playerOne, playerTwo)
}

gameBoard()
