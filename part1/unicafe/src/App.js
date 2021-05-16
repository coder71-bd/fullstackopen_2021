import React, { useState } from 'react';

const Button = ({handleClick, text}) => <button onClick={handleClick}>{text}</button>

const StatisticLine = ({text, value}) => <div>{text} {value}</div>

const Statistics = (props) => {
  let totalClick = props.good + props.neutral + props.bad
  let average = props.totalFeedback / totalClick || 0
  let positivePercantage = (props.good / totalClick) * 100 || 0
  if(totalClick === 0) return <div>No feedback given</div>
  return (
    <>
      <StatisticLine text='good' value={props.good} />
      <StatisticLine text='neutral' value={props.neutral} />
      <StatisticLine text='bad' value={props.bad} />
      <StatisticLine text='all' value={totalClick} />
      <StatisticLine text='average' value={average} />
      <StatisticLine text='positive' value={`${positivePercantage} %`} />
    </>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [totalFeedback, setTotalFeedback] = useState(0)
 
  const goodClick = () => {
    setGood(good + 1)
    setTotalFeedback(totalFeedback + 1)
  } 
  const neutralClick = () => setNeutral(neutral + 1)
  const badClick = () => {
    setBad(bad + 1)
    setTotalFeedback(totalFeedback - 1)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={goodClick} text='good' />
      <Button handleClick={neutralClick} text='neutral' />
      <Button handleClick={badClick} text='bad' />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} totalFeedback={totalFeedback} />
    </div>
  )
}

export default App;
