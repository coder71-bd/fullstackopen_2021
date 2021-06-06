import React, { useState, useEffect } from 'react'
import axios from 'axios'
const App = () => {
  const [countries, setcountries] = useState([])
  const [filter, setFilter] = useState('')
  useEffect(() => {
    axios.get('https://restcountries.eu/rest/v2/all').then((promise) => {
      setcountries(promise.data)
    })
  }, [])
  const handleFilter = (e) => {
    setFilter(e.target.value)
  }

  const filteredCountries = () => {
    if (filter !== '') {
      let filtered = countries.filter(
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
            : filteredCountries().map((country) => (
                <div key={country.name}>{country.name}</div>
              ))
          : ''}
      </div>
    </div>
  )
}

export default App
