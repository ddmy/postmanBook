export default axios => ({
  list: _ => axios.post("/couriers/list"),
  record: params => axios.post("/couriers/record", params),
  history: params => axios.post("/couriers/history", params),
  deleteRecord: recordId => axios.delete(`/couriers/delete/${recordId}`),
  detail: recordId => axios.post(`/couriers/detail/${recordId}`),
  search: params => axios.post("/couriers/history/search", params)
})
