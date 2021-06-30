import React, { useEffect, useState } from 'react'
import phoneBookService from './services/phonebook'

const Filter = ({ filter, handleFilter }) => {
  return (
    <p>
      filter shown with
      <input value={filter} onChange={handleFilter} />
    </p>
  )
}
const ErrorMessage = ({ message, changeClass }) => {
  return message === null ? null : (
    <div className={`error ${changeClass}`}>{message}</div>
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

const Persons = ({ showPerson, handleDelete }) => (
  <div>
    {showPerson.name} {showPerson.number}
    <button onClick={handleDelete}>delete</button>
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setnewName] = useState('')
  const [newNumber, setnewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [changeClass, setChangeClass] = useState('success')
  useEffect(() => {
    phoneBookService.getAll().then((person) => setPersons(person))
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
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with the new one?`
        )
      ) {
        const updatedObject = { ...isPresent, number: newNumber }

        phoneBookService
          .update(isPresent.id, updatedObject)
          .then((newNumberObject) => {
            setPersons(
              persons.map((person) =>
                person.id !== newNumberObject.id ? person : newNumberObject
              )
            )
            setMessage(
              `New number of ${updatedObject.name} is ${updatedObject.number}`
            )
            setnewName('')
            setnewNumber('')
            setTimeout(() => setMessage(null), 3000)
          })
          .catch(() => {
            setChangeClass('fail')
            setMessage(
              `Information of ${updatedObject.name} has already been removed from the server`
            )
            phoneBookService
              .getAll()
              .then((currentData) => setPersons(currentData))
            setTimeout(() => {
              setMessage(null)
              setChangeClass('success')
            }, 3000)
          })
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
        date: new Date(),
      }
      phoneBookService
        .create(newPerson)
        .then((currentPerson) => {
          setPersons(persons.concat(currentPerson))
          setMessage(`Added ${currentPerson.name}`)
          setnewName('')
          setnewNumber('')
          setTimeout(() => setMessage(null), 3000)
        })
        .catch((error) => {
          console.log(error.response.data)
          setChangeClass('fail')
          setMessage(error.response.data.error)
          setTimeout(() => {
            setMessage(null)
            setChangeClass('success')
          }, 3000)
        })
    }
  }
  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      phoneBookService.deletePerson(id).then(() => {
        phoneBookService.getAll().then((newPersons) => setPersons(newPersons))
        setChangeClass('delete')
        setMessage(`Deleted ${name}`)
        setnewName('')
        setnewNumber('')
        setTimeout(() => setMessage(null), 3000)
      })
    }
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <ErrorMessage message={message} changeClass={changeClass} />
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
        <Persons
          showPerson={person}
          key={person.name}
          handleDelete={() => handleDelete(person.id, person.name)}
        />
      ))}
    </div>
  )
}
export default App
