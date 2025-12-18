//const http = require('http')
require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const Person = require('./models/person')
const app = express()

const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({error: 'malformatted id'})
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({error: error.message})
  }

  next(error)
}

morgan.token('body', function getBody (req) {
  const test = JSON.stringify(req.body)
  return test
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>')
  
})

app.get('/info', async (req, res) => {
  const count = await Person.countDocuments({})
  console.log(count)

  res.send(`
    <p> Phonebook has info for ${count} people</p>
    <p> ${new Date} </p>
  `)
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    if(person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.json(result)
    })
    .catch(error => next(error))
})

const update = app.put('/api/persons/:id', (req, res, next) => {
  const {name, number} = req.body
  Person.findById(req.params.id)
    .then(p => {
      p.name = name
      p.number = number
      return p.save().then(updatedPerson => {
        res.json(updatedPerson)      
      })
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const {name, number} = req.body
  const check = Person.find({name:name})

  if (!name || !number) {
    return res.status(404).json({
      error: 'name or number missing'
    })
  } else if (check) {
    update
  } 
  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
  .catch(error => next(error))
})

//const app = http.createServer((req, res) => {
//  res.writeHead(200, {"content-type": 'application/json'})
//  res.end(JSON.stringify(notes))
//})

const PORT = process.env.PORT 
app.listen(PORT)

app.use(errorHandler)

console.log(`server running on port ${PORT}`)