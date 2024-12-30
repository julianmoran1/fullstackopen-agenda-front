/* eslint-disable react/prop-types */

const PersonForm = ({submitPerson, newName, handleNameChange, newNumber, handleNumberChange}) => {
  return (
    <form onSubmit={submitPerson}>
    <div>
      name: <input
      value={newName}
      onChange={handleNameChange}
      />
    </div>
    <div>
      number: <input
      value={newNumber}
      onChange={handleNumberChange}
      />
    </div>
    <div>
      <button type='submit'>add</button>
    </div>
  </form>
  )
}

export default PersonForm