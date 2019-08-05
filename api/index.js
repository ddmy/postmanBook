import axios from 'axios'
import baseApi from './base'
import userApi from './user'

const api = {
  user: userApi(axios),
  base: baseApi(axios)
}
export default api