import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
  return axios.get(baseUrl).then((response) => response.data)
}

const create = (newPersonObject) => {
  return axios.post(baseUrl, newPersonObject).then((response) => response.data)
}

const update = (id, objectWithnewNumber) => {
  return axios
    .put(`${baseUrl}/${id}`, objectWithnewNumber)
    .then((response) => response.data)
}

const deletePerson = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}

const phoneBookService = { getAll, create, deletePerson, update }

export default phoneBookService
