import axios from 'axios'
import baseApi from './base'
import userApi from './user'
import couriersApi from './couriers'

const api = {
  user: userApi(axios),
  base: baseApi(axios),
  couriers: couriersApi(axios)
}
export default api