export default axios => ({
  list: _ => axios.post('/couriers/list'),
  record: params => axios.post('/couriers/record', params),
  history: params => axios.post('/couriers/history', params)
})