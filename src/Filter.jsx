/* eslint-disable react/prop-types */

const Filter = ({filterNames, handleFilter}) => {
  return (
    <>
    <h3>Filter</h3>
    Filter <input
        value={filterNames}
        onChange={handleFilter}
        />
    </>
  )
}

export default Filter