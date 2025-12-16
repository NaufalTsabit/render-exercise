//const http = require('http')
const express = require('express')
var morgan = require('morgan')
const app = express()

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(p => Number(p.id)))
    : 0
  return String(maxId + 1)
}

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
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.filter(person => person.id === id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  const check = persons.find(person => person.name === body.name)

  if (!body.name || !body.number) {
    return response.status(404).json({
      error: 'name or number missing'
    })
  } else if (check) {
    return response.status(404).json({
      error: 'name must be unique'
    })
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)

  response.json(person)
})
//const app = http.createServer((request, response) => {
//  response.writeHead(200, {"content-type": 'application/json'})
//  response.end(JSON.stringify(notes))
//})

const PORT = process.env.port || 3001
app.listen(PORT)

console.log(`server running on port ${PORT}`)