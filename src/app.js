import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.send('hello')
})

app.listen(4400, () => {
  console.log('Is running on http://localhost4400')
})