export default axios => ({
  info: _ => axios.get('/user'),
  login: params => axios.post('/login', params)
})