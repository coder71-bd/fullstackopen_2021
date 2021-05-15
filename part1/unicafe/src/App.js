import React, { useState } from 'react';

const Button = ({handleClick, text}) => <button onClick={handleClick}>{text}</button>

const DisplayTotal = ({text, totalPoints}) => <div>{text} {totalPoints}</div>

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const [positive, setPositive] = useState(0)
  const [zero, setZero] = useState(0)
  const [negative, setNegative] = useState(0)

  const goodClick = () => {
    setGood(good + 1)
    setPositive(positive + 1)
  }
  const neutralClick = () => {
    setNeutral(neutral + 1)
    setZero(0)
  } 
  const badClick = () => {
    setBad(bad + 1)
    setNegative(negative - 1)
  }

  let totalFeedback = positive + zero + negative
  let totalClick = good + neutral + bad
  let average = totalFeedback / totalClick || 0
  let positivePercantage = (good / totalClick) * 100 || 0
  
  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={goodClick} text='good' />
      <Button handleClick={neutralClick} text='neutral' />
      <Button handleClick={badClick} text='bad' />
      <h1>statistics</h1>
      <DisplayTotal text='good' totalPoints={good} />
      <DisplayTotal text='neutral' totalPoints={neutral} />
      <DisplayTotal text='bad' totalPoints={bad} />
      <DisplayTotal text='all' totalPoints={totalClick} />
      <DisplayTotal text='average' totalPoints={average} />
      <DisplayTotal text='positive' totalPoints={`${positivePercantage} %`} />
    </div>
  )
}

export default App;
