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
  { title: 'Finding Nemo', yearOfRelease: 2003, synopsis: 'Nemo is a fish' },
  { title: 'Finding Dory', yearOfRelease: 2016, synopsis: 'Dory is a fish' },
  { title: 'Vaiana', yearOfRelease: 2016, synopsis: 'Vaiana is a girl' }
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
  const limit = req.query.limit || 2
  const offset = req.query.offset || 0
  Movie.findAndCountAll({ limit, offset })
    .then(result => res.send({movies: result.rows, total: result.count}))
    .catch(error => next(error))
})

router.get('/movies/:id', (req, res, next) => {
  Movie.findByPk(req.params.id)
    .then(movie => movie ?
      res.send(movie) :
      res.status(404).end())
    .catch(next)
}) 

router.put('/movies/:id', (req, res, next) => {
  Movie.findByPk(req.params.id)
    .then(movie => movie ?
      movie
        .update(req.body)
        .then(movie => res.json(movie)) :
      res.status(404).end())
    .catch(next)
})

router.delete('/movies/:id', (req, res, next) => {
  Movie.destroy({where: {id: req.params.id}})
      .then(movie => movie ?
        res.status(204).end() :
        res.status(404).end())
    .catch(next)
})


app.listen(port, () => console.log(`Listening on port ${port}`))






