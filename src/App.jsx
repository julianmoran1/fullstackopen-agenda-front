import { useEffect, useState } from 'react'
import './App.css'
import Filter from './Filter'
import PersonForm from './PersonForm'
import Person from './Person'
// import axios from 'axios'

import personService from './services/persons'

function App() {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterNames, setFilterNames] = useState('')
  const [filtered, setFiltered] = useState([])
  const [confirmOperation, setConfirmOperation] = useState(false)
  const [confirmMessage, setConfirmMessage] = useState('')

  useEffect(() => {
    personService.getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [persons])

  const confirmOperationMessage = (message) => {
    setConfirmOperation(true)
    setConfirmMessage(message)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setFilterNames(event.target.value)
    const filtered = persons.filter(person => person.name.includes(filterNames))
   setFiltered(filtered)
  }

  const submitPerson = (event) => {
    event.preventDefault()
    const repetead = persons.filter(person => person.name.toLowerCase() === newName.toLowerCase())
    if (repetead.length !== 0) {
      const id = repetead[0].id;
      const updatedPerson = { ...repetead[0], number: newNumber };

      if (window.confirm(`${newName} ya está en la agenda, ¿quieres actualizar el número?`)) {
        personService.update(id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== id ? person : returnedPerson));
            setNewName('');
            setNewNumber('');
          })
          .catch(error => {
            console.error('Error al actualizar la persona:', error);
          });
      }
      return;
    }
    const newPerson = {
      name: newName,
      number: newNumber,
    }
    setPersons([...persons, newPerson])
    setNewName('')
    setNewNumber('')

    personService.create(newPerson)
    .then(returnedPerson => {
      setPersons([...persons, returnedPerson])
    })

    setConfirmOperation(true)
    confirmOperationMessage(`Persona ${newPerson.name} añadida correctamente`)
    setTimeout(() => {
      setConfirmOperation(false)
    }, 5000)
  }

  const deletePerson = (id) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar a la persona con ID ${id}?`)) {
      personService.deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
          setConfirmOperation(true)
          confirmOperationMessage(`Persona eliminada correctamente`)
          setTimeout(() => {
            setConfirmOperation(false)
          }, 5000)
        })
        .catch(error => {
          console.error('Error al eliminar la persona:', error);
        });
    }
  }
  return (
      <div>
      <h2>Phonebook</h2>
      {confirmOperation && <div>{confirmMessage}</div>}

      <Filter filterNames={filterNames} handleFilter={handleFilter} />
      <PersonForm submitPerson={submitPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />

      <h2>Numbers</h2>
      {filterNames.length <= 2 && persons.map(((person) => <Person key={person.id} person={person} deletePerson={deletePerson} />))}
      {filterNames.length > 2 && filtered.map(person => <Person key={person.id} person={person} />)}
    </div>
  )
}

export default App
