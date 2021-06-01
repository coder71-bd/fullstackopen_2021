import React from 'react'

const Header = ({name}) => <h2>{name}</h2>

const Part = ({part}) => {
  const {name, exercises} = part
  return <p>{name} {exercises}</p>
}

const Content = ({parts}) => {
  return (
    <div>
      {parts.map(part =>
        <Part key={part.id} part={part} />
      )}
    </div>
  )
}
const Total = ({parts}) => {
  const total = parts.reduce((acc, val) => {
    return acc + val.exercises
  }, 0)
  return <strong>total of {total} exercises</strong>
}

const Course = ({course}) => {
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default Course