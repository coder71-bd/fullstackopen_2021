import React from 'react'

const Header = (props) => {
  return ( 
      <h1>
        {props.course}
      </h1>
  )
}
const Part = (props) => {
  return (
    <p>
      {props.parts} {props.exercises}
    </p>
  )
}
const Content = (props) => {
  return (
    <div>
      <Part parts={props.courseParts[0].part} exercises={props.courseParts[0].exercises}/>

      <Part parts={props.courseParts[1].part} exercises={props.courseParts[1].exercises}/>

      <Part parts={props.courseParts[1].part} exercises={props.courseParts[1].exercises}/>
    </div>
  )
}

const Total = (props) => {
  return (
    <p>
      Number of exercises {props.courseParts[0].exercises + props.courseParts[1].exercises + props.courseParts[2].exercises}
    </p>
  )
}

const App = () => {
  const course = {
    courseName : 'Half Stack application development',
    courseParts : [
      {
        part : 'Fundamentals of React',
        exercises : 10
      },
      {
        part : 'Using props to pass data',
        exercises : 7
      },
      {
        part : 'State of a component',
        exercises : 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.courseName} />
      <Content courseParts={course.courseParts}/>
      <Total courseParts={course.courseParts} />
    </div>
  )
}

export default App
