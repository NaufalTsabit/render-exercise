//const http = require('http')
require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const Person = require('./models/person')
const app = express()

morgan.token('body', function getBody (req) {
  const test = JSON.stringify(req.body)
  return test
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
  
})

app.get('/info', (request, response) => {
  const date = new Date
  const qty = persons.length

  response.send(`
    <p> Phonebook has info for ${qty} people</p>
    <p> ${date} </p>
  `)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(note => {
    response.json(note)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.filter(person => person.id === id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  //const check = persons.find(person => person.name === body.name)

  if (!body.name || !body.number) {
    return response.status(404).json({
      error: 'name or number missing'
    })
  } //else if (check) {
    //return response.status(404).json({
      //error: 'name must be unique'
    //})
  //}
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})
//const app = http.createServer((request, response) => {
//  response.writeHead(200, {"content-type": 'application/json'})
//  response.end(JSON.stringify(notes))
//})

const PORT = process.env.PORT 
app.listen(PORT)

console.log(`server running on port ${PORT}`)