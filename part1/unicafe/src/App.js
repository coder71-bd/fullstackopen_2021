import React, { useState } from 'react';
const Button = ({handleClick, text}) => <button onClick={handleClick}>{text}</button>
const DisplayTotal = ({text, totalPoints}) => <div>{text} {totalPoints}</div>
const App = () => {
  const [totalGood, setTotalGood] = useState(0)
  const [totalNeutral, setTotalNeutral] = useState(0)
  const [totalBad, setTotalBad] = useState(0)

  const goodClick = () => setTotalGood(totalGood + 1)
  const neutralClick = () => setTotalNeutral(totalNeutral + 1)
  const badClick = () => setTotalBad(totalBad + 1)
  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={goodClick} text='good' />
      <Button handleClick={neutralClick} text='neutral' />
      <Button handleClick={badClick} text='bad' />
      <h1>statistics</h1>
      <DisplayTotal text='good' totalPoints={totalGood} />
      <DisplayTotal text='neutral' totalPoints={totalNeutral} />
      <DisplayTotal text='bad' totalPoints={totalBad} />
    </div>
  )
}

export default App;
