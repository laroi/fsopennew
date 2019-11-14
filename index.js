const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
app.use(bodyParser.json())
morgan.token('type', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))
let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
}
 ]


app.get('/api/persons', (req, res) => {
  res.json(persons)
})
app.get('/info', (req, res) => {
    res.send(`<p>phonebook has info for ${persons.length} people </p> <p>${new Date()}</p>`)
})
app.get('/api/persons/:id', (req, res) => {
    const person = persons.find(x=>x.id===parseInt(req.params.id, 10));
    if (person) {
        res.json(person);
    } else {
        res.status(404).send();
    }
})
app.delete('/api/persons/:id', (req, res) => {
    const index = persons.findIndex(x=>x.id===parseInt(req.params.id, 10));
    console.log(persons[index]);
    if (index > 0) {
        persons.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).send();
    }
})
app.post('/api/persons', (req, res)=> {
    const number = req.body.number;
    const name = req.body.name;
    if (!number) {
        res.status(400).send({error: "number is not provided"})
        return;
    }
    exists = persons.findIndex(x=>x.number===number)
    if (exists > -1) {
        res.status(409).send({error: 'number already exists'})
        return;
    }
    persons.push({id: Math.floor(Math.random() * 1000), name: name, number: number});
    res.status(201).send();
})
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
