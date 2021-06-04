import React, { useState } from 'react'

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

const Persons = ({ showPerson }) => {
  return (
    <div>
      {showPerson.map((person) => (
        <div key={person.name}>
          {person.name} {person.number}
        </div>
      ))}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' },
  ])
  const [newName, setnewName] = useState('')
  const [newNumber, setnewNumber] = useState('')
  const [filter, setFilter] = useState('')

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
  console.log(newFilteredPerson())
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
        date: new Date().toISOString(),
      }
      setPersons(persons.concat(newPerson))
      setnewName('')
      setnewNumber('')
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
      <Persons showPerson={newFilteredPerson()} />
    </div>
  )
}
export default App
