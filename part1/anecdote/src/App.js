import React, { useState } from 'react';
const Button = ({handleClick, text}) =>  <button onClick={handleClick}>{text}</button>
function App() {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
  ]
  const [selected, setSelected] = useState(0)
  const changeIndex = () => setSelected(Math.floor(Math.random() * anecdotes.length))
  const [updateVotes, setUpdateVotes] = useState({
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0
  })
  const changeVotes = () => {
    updateVotes[selected] += 1
    setUpdateVotes({...updateVotes})
  }
  const dataArray = []
  for(let key in updateVotes) {
    dataArray.push(updateVotes[key])
  }
  const maxVote = Math.max(...dataArray)
  const indexOfMaxVote = dataArray.indexOf(maxVote)

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <div>{anecdotes[selected]}</div>
      <div>has {updateVotes[selected]} votes</div>
      <Button handleClick={changeVotes} text='vote' />
      <Button handleClick={changeIndex} text='next anecdote' />
      <h1>Anecdote with most votes</h1>
      <div>{anecdotes[indexOfMaxVote]}</div>
      <div>has {maxVote} votes</div>
    </div>
  )
}

export default App;
