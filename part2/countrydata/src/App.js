import React, { useState, useEffect } from 'react'
import axios from 'axios'
const App = () => {
  const [countries, setcountries] = useState([])
  const [filter, setFilter] = useState('')
  const [view, setview] = useState(countries)
  useEffect(() => {
    axios.get('https://restcountries.eu/rest/v2/all').then((promise) => {
      setcountries(promise.data)
      setview(promise.data)
    })
  }, [])
  const handleFilter = (e) => {
    setFilter(e.target.value)
    setview(countries)
  }

  const filteredCountries = () => {
    if (filter !== '') {
      let filtered = view.filter(
        (country) =>
          country.name.toLowerCase().search(filter.toLowerCase()) !== -1
      )
      if (filtered.length !== 0 && filtered !== undefined) {
        return filtered
      } else {
        return []
      }
    } else {
      return []
    }
  }
  const handleButton = (e) => {
    let viewFilter = filteredCountries().filter(
      (country) => country.name === e.target.id
    )
    setview(viewFilter)
  }
  return (
    <div>
      <div>
        find countries
        <input value={filter} onChange={handleFilter} />
      </div>
      <div>
        {filteredCountries().length > 10
          ? 'Too many matches, specify another filter'
          : ''}
      </div>
      <div>
        {filteredCountries().length <= 10
          ? filteredCountries().length === 1
            ? filteredCountries().map((country) => (
                <div key={country.population}>
                  <h1>{country.name}</h1>
                  <div>
                    <div>capital {country.capital}</div>
                    <div>population {country.population}</div>
                  </div>
                  <h2>languages</h2>
                  <ul>
                    {country.languages.map((lang) => (
                      <li key={lang.name}>{lang.name}</li>
                    ))}
                  </ul>
                  <img
                    src={country.flag}
                    alt={`flag of ${country.name}`}
                    width="150px"
                  />
                </div>
              ))
            : filteredCountries().map((country) => {
                return (
                  <div key={country.name}>
                    {country.name}
                    <button id={country.name} onClick={handleButton}>
                      show
                    </button>
                  </div>
                )
              })
          : ''}
      </div>
    </div>
  )
}

export default App
