export default axios => ({
  postmans: _ => axios.get('/postmans')
})