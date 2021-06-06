import React, { useState, useEffect } from 'react'
import axios from 'axios'
const App = () => {
  const [countries, setcountries] = useState([])
  const [filter, setFilter] = useState('')
  const [view, setview] = useState(countries)
  const [weather, setWeather] = useState([])

  useEffect(() => {
    axios.get('https://restcountries.eu/rest/v2/all').then((response) => {
      setcountries(response.data)
      setview(response.data)
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
  let capitalCity = 'dhaka'
  if (filteredCountries().length === 1) {
    capitalCity = filteredCountries()
      .map((country) => country.capital)
      .join()
  }

  useEffect(() => {
    const api_key = process.env.REACT_APP_API_KEY
    const params = {
      appid: api_key,
      q: capitalCity,
    }

    axios
      .get('http://api.openweathermap.org/data/2.5/weather', { params })
      .then((response) => {
        setWeather(response.data)
      })
  }, [capitalCity])

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
            ? filteredCountries().map((country) => {
                return (
                  <div key={country.population}>
                    <h1>{country.name}</h1>
                    <div>
                      <div>capital {country.capital}</div>
                      <div>population {country.population}</div>
                    </div>
                    <h2>Spoken languages</h2>
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
                    <h2>Weather in {country.capital}</h2>
                    <div>
                      <p>
                        <strong>temperature:</strong> {weather.main.temp}{' '}
                        Celsius
                      </p>
                      {weather.weather.map((image) => (
                        <img
                          key={image.id}
                          src={`http://openweathermap.org/img/wn/${image.icon}@2x.png`}
                          alt={image.description}
                        />
                      ))}
                      <p>
                        <strong>wind:</strong> {weather.wind.speed} mph
                        direction {weather.wind.deg} deg
                      </p>
                    </div>
                  </div>
                )
              })
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
