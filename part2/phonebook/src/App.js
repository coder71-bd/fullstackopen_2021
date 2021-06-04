import React, { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([{ name: 'Arto Hellas' }])
  const [newName, setnewName] = useState('')

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
        date: new Date().toISOString(),
      }
      setPersons(persons.concat(newPerson))
      setnewName('')
    }
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleName} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map((person) => (
        <div key={person.name}>{person.name}</div>
      ))}
    </div>
  )
}
export default App
