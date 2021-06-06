import React, { useState, useEffect } from 'react'
import axios from 'axios'

const FilteredCountries = ({ country, handleButton }) => {
  return (
    <div>
      {country.name}
      <button id={country.name} onClick={handleButton}>
        show
      </button>
    </div>
  )
}

const CountryStats = ({ country }) => {
  const { name, capital, population, languages, flag } = country
  return (
    <>
      <h1>{name}</h1>
      <div>
        <div>capital {capital}</div>
        <div>population {population}</div>
      </div>
      <h2>Spoken languages</h2>
      <ul>
        {languages.map((lang) => (
          <li key={lang.name}>{lang.name}</li>
        ))}
      </ul>
      <img src={flag} alt={`flag of ${name}`} width="150px" />
    </>
  )
}
const WeatherIcons = ({ icon }) => {
  return (
    <>
      {icon.map((image) => (
        <img
          key={image.id}
          src={`http://openweathermap.org/img/wn/${image.icon}@2x.png`}
          alt={image.description}
        />
      ))}
    </>
  )
}

const CountryWeather = ({ weather }) => {
  const { name, main, wind } = weather
  return (
    <>
      <h2>Weather in {name}</h2>
      <div>
        <p>
          <strong>temperature:</strong> {main.temp} Celsius
        </p>
        <WeatherIcons icon={weather.weather} />
        <p>
          <strong>wind:</strong> {wind.speed} mph direction {wind.deg} deg
        </p>
      </div>
    </>
  )
}

const FullSatsOfACountry = ({ currentCountry, handleButton, weather }) => {
  return (
    <div>
      {currentCountry.length <= 10
        ? currentCountry.length === 1
          ? currentCountry.map((country) => {
              return (
                <div key={country.population}>
                  <CountryStats country={country} />
                  <CountryWeather weather={weather} />
                </div>
              )
            })
          : currentCountry.map((country) => {
              return (
                <FilteredCountries
                  key={country.name}
                  country={country}
                  handleButton={handleButton}
                />
              )
            })
        : ''}
    </div>
  )
}

const WarningText = (props) => {
  return <div>{props.countryList.length > 10 ? `${props.text}` : ''}</div>
}

const InputButton = ({ filter, handleFilter }) => {
  return (
    <div>
      <div>
        find countries
        <input value={filter} onChange={handleFilter} />
      </div>
    </div>
  )
}

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
      <InputButton filter={filter} handleFilter={handleFilter} />
      <WarningText
        countryList={filteredCountries()}
        text={'Too many matches, specify another filter'}
      />
      <FullSatsOfACountry
        currentCountry={filteredCountries()}
        handleButton={handleButton}
        weather={weather}
      />
    </div>
  )
}

export default App
