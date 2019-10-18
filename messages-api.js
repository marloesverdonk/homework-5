const express = require('express')
const port = 3000
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

let numberOfRequests = 0

app.use((req, res, next) => {
  numberOfRequests++
  numberOfRequests >= 6 ?
    res.status(429).send({
      "message": "Too many Requests"
    })
    : next()
})

app.post('/messages', (req, res) => {
  console.log(req.body.text)
  req.body.text && req.body.text !== "" ?
    res.send({
      "message": "Message received loud and clear"
    })
    : res.status(400).send({
      "message": "Bad request"
    })
})

app.listen(port, () => console.log(`listening on port ${port}`))