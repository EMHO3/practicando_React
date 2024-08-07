import { useState } from 'react'
import confetti from "canvas-confetti"
import { Square } from './componentes/Square'
import { TURNO,combos_ganadores } from './constantes'
// import './App.css'

function App() {

  const [board,setBoard]=useState(()=>{
    const boardFromStorage=window.localStorage.getItem('board')
    return boardFromStorage? JSON.parse(boardFromStorage):
    Array(9).fill(null
  )})
  const [turn,setTurn]=useState(()=>{
    const turnFromStorage=window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNO.X
  })

  const [winner,setWinner]=useState(null)//null no hay ganador;false=empate
  const checkWinner=(boardToCheack)=>{
    for(const combo of combos_ganadores){
      const [a,b,c]=combo
      if(
        boardToCheack[a]&&boardToCheack[a]===boardToCheack[b]&&
        boardToCheack[a]===boardToCheack[c]
      ){
        return boardToCheack[a]
      }
    }
    //si no hay ganador
    return null
  }
  const resetGame=()=>{
    setBoard(Array(9).fill(null))
    setTurn(TURNO.X)
    setWinner(null)
  }
  const checkEndGame=(newBoard)=>{
    return newBoard.every((square) => square!==null)
  }

  const updateBoard=(index)=>{
    //no actualizamos si ya tiene algo
    if(board[index] || winner) return
    //actualizar tablero
    const newBoard=[...board]
    newBoard[index]=turn
    setBoard(newBoard)
    //cambia el turno
    const newTurno=turn===TURNO.X ? TURNO.O:TURNO.X
    setTurn(newTurno)
    //guardar aqui la partida
    window.localStorage.setItem('board',JSON.stringify(newBoard))
    window.localStorage.setItem('turn',turn)

    //revisando si hay ganador
    const winnerActual=checkWinner(newBoard)
    if(winnerActual){
      confetti()
      setWinner(winnerActual)
    }else if(checkEndGame(newBoard)){
      setWinner(false)//empate
    }
  }

  return (
    <main className='board'>
      <h1>Michi</h1>
      <button onClick={resetGame}>Reiniciar juego</button>
      <section className='game'>
        {
          board.map((square,index) => {
            return (
              <Square key={index}  index={index} updateBoard={updateBoard}>{square}</Square>
            )
          })
        }
      </section>
      <section className='turn'>
        <Square isSelected={turn===TURNO.X}>{TURNO.X}</Square>
        <Square isSelected={turn===TURNO.O}>{TURNO.O}</Square>
      </section>
      {
        winner !== null&&(
          <section className='winner'>
            <div className='text'>
              <h2>
                {
                  winner===false?'empate':'gano:'
                }
              </h2>
              <header className='win'>
                {winner && <Square>{winner}</Square>}
              </header>
              <footer>
                <button onClick={resetGame}>Empezar de nuevo</button>
              </footer>
            </div>
          </section>
        )
      }
    </main>
  )
}

export default App
