import React from 'react';


// 'i' value chain

/* Square
–––––––––––––––––––––––––––––––––––––––––––––––––– */

const Square = (props) => {
	return (
		<button className={`square ${props.winner ? 'winning-line' : ''} `} onClick={props.onClick}>
			{props.value}
		</button>
	)
} 

/* Board
–––––––––––––––––––––––––––––––––––––––––––––––––– */

class Board extends React.Component {
 
  renderSquare(i, winner) {
    console.log(this.props)
  	return (
    	<Square 
    		value = {this.props.squares[i]} 
        // 2: i is a param, then passed to the onclick here. this.props === ref to the board props
    		onClick = {() => this.props.onClick(i)}
        id = {`sq_${i}`}
        winner = {winner}
        key = {i}
    	/>
    )
  }

  createSquares() {
  	const board = []
  	const boardSize = 3
  	let num = 0

		for (let row = 0; row < boardSize; row++) {
			let squaresArr = []
			for (let col = 0; col < boardSize; col++) {
        // check if the square is a winning square
        let isWon = false
        if (this.props.winningLine && this.props.winningLine.includes(num)) {
          isWon = true
        }
        // 1: num === i, defined here
				squaresArr.push(this.renderSquare(num++, isWon))
			}
			board.push(<div className='board-row' key={row}>{squaresArr}</div>)
		}
		return board
  }

  render() {
    return (
      <div id='board-wrap'>
        {this.createSquares()}
      </div>
    )
  }
}

/* Game
–––––––––––––––––––––––––––––––––––––––––––––––––– */

const initialState = {
  history: [{
    squares: Array(9).fill(null)
  }],
  moveNumber: 0,
  xIsNext: true,
  gameOver: false
}

export default class Game extends React.Component {

	constructor(props) {
		super(props)
		this.state = initialState
	}

  clearState() {
    this.setState({
      ...initialState
    })
  }

	componentDidUpdate() {
  	console.log('componentDidUpdate:', this.state)
  }

  // CLICK EVENT
  handleClick(i) {
    const history = this.state.history.slice()
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    const position = {col: i % 3 + 1, row: Math.floor(i / 3) + 1 }

    // if the game is won or the square has content of 'X / 0', do nothing
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    // determine what character should be rendered in the square
    squares[i] = this.state.xIsNext ? 'X' : 'O'

    this.setState({
      history: history.concat([{
        squares: squares,
        position: position
      }]),
      moveNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(move) {
  	this.setState({
      moveNumber: move,
      xIsNext: (move % 2) === 0,
    });
  }

  render() {
    const history = this.state.history
    const current = history[this.state.moveNumber]
    const winner = calculateWinner(current.squares)
    const draw = calculateDraw(current.squares)

    // show the history
    const moves = history.map((elem, moveIndex) => {
    	// eval move to be truthy or not
      let desc 
      if (moveIndex) {
        desc = `Go to move #${moveIndex}, (Position: ${history[moveIndex].position.row}, ${history[moveIndex].position.col})`
      } else {
        desc = 'Go to game start, (Position: 0, 0)'
      }

      return (
        <li key={moveIndex}>
          <button className={`move-list ${this.state.moveNumber === moveIndex ? 'selected' : ''}`} onClick={() => this.jumpTo(moveIndex)}>{desc}</button>
        </li>
      )
    })

    let status
    let winningLine
    let restart = false
    if (winner) {
      status = `The winner is: ${winner.val}`
      winningLine = winner.line
      restart = true
    } else if (draw) {
      status = `It's a draw!`
      restart = true
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
      restart = false
    }

    return (
      <div className="game">
        <Board
          squares = {current.squares}
          // 3: i referenced in board component is then passed to the handleclick func
          onClick = {i => this.handleClick(i)}
          winningLine = {winningLine}
        />

        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>

        {restart ? <button onClick={()=> this.clearState()}>Restart</button> : ''}
        
      </div>
    )
  }
}


/* calc winner
–––––––––––––––––––––––––––––––––––––––––––––––––– */

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    // if a is a truthy value (X or O) and it is also equal to squares b, and c, then return the val
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        val: squares[a],
        line: lines[i]   
      }
    }
  }
}

function calculateDraw(squares) {

  const squareCount = squares.length
  let count = 0
  for (var i = 0; i < squareCount; i++) {
    if (squares[i]) {
      count++
      if (count === squareCount) {
        return true
      }
    }
  }
}