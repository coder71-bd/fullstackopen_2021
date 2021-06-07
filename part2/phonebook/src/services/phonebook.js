import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
  return axios.get(baseUrl).then((response) => response.data)
}

const create = (newPersonObject) => {
  return axios.post(baseUrl, newPersonObject).then((response) => response.data)
}
const deletePerson = (id) => {
  return axios.delete(`${baseUrl}/${id}`).then((respone) => respone)
}

const phoneBookService = { getAll, create, deletePerson }

export default phoneBookService
