export default axios => ({
  list: _ => axios.post('/couriers/list')
})