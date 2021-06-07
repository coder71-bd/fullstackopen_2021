import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ filter, handleFilter }) => {
  return (
    <p>
      filter shown with
      <input value={filter} onChange={handleFilter} />
    </p>
  )
}

const Input = (props) => {
  return (
    <div>
      {props.text}:{' '}
      <input value={props.value} onChange={props.handleChange} required />
    </div>
  )
}
const PersonForm = (props) => {
  return (
    <form onSubmit={props.addName}>
      <Input
        text={'name'}
        value={props.newName}
        handleChange={props.handleName}
      />
      <Input
        text={'number'}
        value={props.newNumber}
        handleChange={props.handleNumber}
      />
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ showPerson }) => (
  <div>
    {showPerson.name} {showPerson.number}
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setnewName] = useState('')
  const [newNumber, setnewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios.get('http://localhost:3001/persons').then((person) => {
      setPersons(person.data)
    })
  }, [])
  const handleFilter = (e) => {
    setFilter(e.target.value)
  }
  const newFilteredPerson = () => {
    if (filter !== '') {
      let filtered = persons.filter(
        (person) =>
          person.name.toLowerCase().search(filter.toLowerCase()) !== -1
      )
      if (filtered.length !== 0 && filtered !== undefined) {
        return filtered
      } else {
        return []
      }
    } else {
      return persons
    }
  }
  const handleNumber = (e) => {
    setnewNumber(e.target.value)
  }
  const handleName = (e) => {
    setnewName(e.target.value)
  }

  const addName = (event) => {
    event.preventDefault()
    const isPresent = persons.find((person) => person.name === newName)
    if (isPresent) {
      alert(`${newName} is already added to phonebook`)
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
        date: new Date(),
      }
      axios
        .post('http://localhost:3001/persons', newPerson)
        .then((response) => {
          setPersons(persons.concat(newPerson))
          setnewName('')
          setnewNumber('')
        })
    }
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilter={handleFilter} />
      <h3>add a new</h3>
      <PersonForm
        addName={addName}
        newName={newName}
        handleName={handleName}
        newNumber={newNumber}
        handleNumber={handleNumber}
      />
      <h3>Numbers</h3>
      {newFilteredPerson().map((person) => (
        <Persons showPerson={person} key={person.name} />
      ))}
    </div>
  )
}
export default App
