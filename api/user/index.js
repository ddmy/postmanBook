export default axios => ({
  info: _ => axios.get("/user"),
  login: params => axios.post("/login", params),
  logout: _ => axios.post("/logout"),
  sts: _ => axios.post("/sts")
})
