const Sequelize = require('sequelize')
const databaseUrl = process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/postgres'
const db = new Sequelize(databaseUrl)
const express = require('express')
const app = express()
const port = process.env.PORT || 4000
const { Router } = require('express')
const router = new Router()
const bodyParser = require('body-parser')
const bodyParserMiddleWare = bodyParser.json()

const movies = [
  { title: 'Finding Nemo', yearOfRelease: 2003, synopsis: 'some synopsis' },
  { title: 'Finding Dory', yearOfRelease: 2016, synopsis: 'some other synopsis' },
  { title: 'Vaiana', yearOfRelease: 2016, synopsis: 'other synopsis' }
]

const Movie = db.define('movie', {
  title: {
    type: Sequelize.STRING,
    field: 'movie_title'
  },
  yearOfRelease: {
    type: Sequelize.INTEGER,
    field: 'year_of_release'
  },
  synopsis: {
    type: Sequelize.STRING,
    field: 'synopsis'
  }
})

db.sync()
  .then(console.log('Database schema has been updated'))
  .then(Promise.all(movies.map((movie) => Movie.create(movie))))
  .catch(console.error)

app
  .use(bodyParserMiddleWare)
  .use(router)

router.post('/movies', (req, res, next) => {
  Movie.create(req.body)
    .then(movie => res.json(movie))
    .catch(next)
})

router.get('/movies', (req, res, next) => {
  Movie.findAll()
    .then(movies => res.send(movies))
    .catch(next)
})

router.get('/movies/:id', (req, res, next) => {
  Movie.findByPk(req.params.id)
    .then(movie => res.send(movie))
    .catch(next)
})

router.put('/movies/:id', (req, res, next) => {
  Movie.findByPk(req.params.id)
    .then(movie => movie
      .update(req.body)
      .then(movie => res.json(movie)))
    .catch(next)
})

router.delete('/movies/:id', (req, res, next) => {
  Movie.findByPk(req.params.id)
    .then(movie => movie.destroy())
    .then(res.send(req.params))
    .catch(next)
})





app.listen(port, () => console.log(`Listening on port ${port}`))






