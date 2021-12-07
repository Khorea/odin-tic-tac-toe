const playerFactory = (playerID, symbol) => {
    let wins = 0;
    let loses = 0;
    return { playerID, symbol, wins, loses };
}

const player1 = playerFactory(1, 'X');
const player2 = playerFactory(2, 'O');

const ticTacToe = ((player1, player2) => {
    let board = [[0, 0, 0],
                 [0, 0, 0],
                 [0, 0, 0]];
    const gameStates = {
        "in progress": 1,
        finished: 2,
    }
    let gameState = gameStates["in progress"];
    let currentPlayer = player1;

    const isMoveValid = (positionI, positionJ) => {
        return (board[positionI][positionJ] === 0) ? true : false;
    }

    const playerWon = () => {
        playerID = currentPlayer.playerID;
        if (board[0][0] === board[0][1] && 
            board[0][1] === board[0][2] &&
            board[0][2] === playerID) return true;

        if (board[1][0] === board[1][1] && 
            board[1][1] === board[1][2] &&
            board[1][2] === playerID) return true;

        if (board[2][0] === board[2][1] && 
            board[2][1] === board[2][2] &&
            board[2][2] === playerID) return true;

        if (board[0][0] === board[1][0] && 
            board[1][0] === board[2][0] &&
            board[2][0] === playerID) return true;

        if (board[0][1] === board[1][1] && 
            board[1][1] === board[2][1] &&
            board[2][1] === playerID) return true;
   
        if (board[0][2] === board[1][2] && 
            board[1][2] === board[2][2] &&
            board[2][2] === playerID) return true;
   
        if (board[0][0] === board[1][1] && 
            board[1][1] === board[2][2] &&
            board[2][2] === playerID) return true;
   
        if (board[2][0] === board[1][1] && 
            board[1][1] === board[0][2] &&
            board[0][2] === playerID) return true;

        return false;
    }

    const isTie = () => {
        let result = true;
        board.forEach(row => row.forEach(cell => {
            if (cell === 0) {
                result = false;
            }
        }));
        return result;
    }

    const switchPlayer = () => {
        if (currentPlayer.playerID === player1.playerID) {
            currentPlayer = player2;
        } else {
            currentPlayer = player1;
        }
    }

    const makeMove = (positionI, positionJ) => {
        if (!isMoveValid(positionI, positionJ)) return false;
        else {
            board[positionI][positionJ] = currentPlayer.playerID;
            return true;
        }
    }

    const playRound = (positionI, positionJ) => {
        if (gameState === gameStates.finished) {
            resetGame();
        }

        if (makeMove(positionI, positionJ)) {
            if (playerWon()) {
                gameState = gameStates.finished;
                currentPlayer.wins++;
                if (currentPlayer.playerID === player1.playerID) {
                    player2.loses++;
                } else {
                    player1.loses++;
                }
                return currentPlayer.symbol;
            } else if (isTie()) {
                resetGame();
                return 'tie';
            }
            switchPlayer();
            return '';
        }
    }

    const playPCRound = () => {
        let positionI = 0;
        let positionJ = 0;
        while (!isMoveValid(positionI, positionJ)) {
            positionJ = (positionJ + 1) % 3;
            if (positionJ === 0) positionI++;
        }
        return playRound(positionI, positionJ)
    }

    const resetGame = () => {
        gameState = gameStates["in progress"];
        board = [[0, 0, 0],
                 [0, 0, 0],
                 [0, 0, 0]];
        currentPlayer = player1;
    }

    const getBoardCell = (positionI, positionJ) => {
        return board[positionI][positionJ];
    }

    return {
        playRound,
        playPCRound,
        resetGame,
        getBoardCell,
    };
})(player1, player2);

function updateUI() {
    boardCells.forEach((cell) => {
        const cellValue = ticTacToe.getBoardCell(cell.dataset.i, cell.dataset.j);
        if (cellValue === player1.playerID) {
            cell.textContent = player1.symbol;
        } else if (cellValue === player2.playerID) {
            cell.textContent = player2.symbol;
        } else {
            cell.textContent = '';
        }
    })
}

const content = document.querySelector('.content');
const footer = document.querySelector('.footer');
const overlay = document.querySelector('.overlay');
const winner = document.querySelector('.winner');
const boardCells = document.querySelectorAll('.cell');
boardCells.forEach(cell => cell.addEventListener('click', (e) => {
    let result = ticTacToe.playRound(e.target.dataset.i, e.target.dataset.j);
    if (result != '' && result != 'tie') {
        content.classList.add('blur');
        footer.classList.add('blur');
        winner.textContent = result;
        overlay.classList.add('active');
    } else if (vsComputer === true && result != 'tie') {
        result = ticTacToe.playPCRound();
        if (result != '') {
            content.classList.add('blur');
            footer.classList.add('blur');
            winner.textContent = result;
            overlay.classList.add('active');
        }
    }
    updateUI();
}));

overlay.addEventListener('click', () => {
    content.classList.remove('blur');
    footer.classList.remove('blur');
    overlay.classList.remove('active');
    ticTacToe.resetGame();
    updateUI();
});

const restartButton = document.querySelector('.restart');
restartButton.addEventListener('click', () => {
    ticTacToe.resetGame();
    updateUI();
});

let vsComputer = false;

const vsPlayer = document.querySelector('.vs-player');
const vsPC = document.querySelector('.vs-pc');

vsPlayer.addEventListener('click', () => {
    if (vsComputer === true) {
        vsComputer = false;
        ticTacToe.resetGame();
        updateUI();
        vsPlayer.classList.add('selected');
        vsPC.classList.remove('selected');
    }
});

vsPC.addEventListener('click', () => {
    if (vsComputer === false) {
        vsComputer = true;
        ticTacToe.resetGame();
        updateUI();
        vsPC.classList.add('selected');
        vsPlayer.classList.remove('selected');
    }
});
