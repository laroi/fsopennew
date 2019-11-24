const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config();
const Entry = require('./models/entry')
app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'));
morgan.token('type', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))



app.get('/api/persons', (req, res, next) => {
    Entry.find({}).then(result => {      
        res.json(result.map(x=>x.toJSON()))
    })
    .catch(error => next(error))
})
app.get('/info', (req, res, next) => {
        Entry.count({}).then(result => {      

    res.send(`<p>phonebook has info for ${result} people </p> <p>${new Date()}</p>`)
        })
})
app.get('/api/persons/:id', (req, res, next) => {
    Entry.findOne({_id:req.params.id}).then(result => {
        if (result) {
            res.json(result);
        } else {
            res.status(404).send();
        }
    })
    .catch(error => next(error))
})
app.delete('/api/persons/:id', (req, res, next) => {

    Entry.findByIdAndRemove(req.params.id).then(result => {
        if (result) {
            res.status(204).send();
        } else {
            res.status(404).send();
        }
    })
    .catch(error => next(error))

})
app.post('/api/persons', (req, res, next)=> {
    const number = req.body.phoneNumber;
    const name = req.body.name;
    if (!number) {
        res.status(400).send({error: "number is not provided"})
        return;
    }

    const phoneObj = new Entry({name: name, phoneNumber:number});
    phoneObj.save()
    .then(x=> {
        console.log(x.toJSON());
        res.status(201).send(x.toJSON());
    })
    .catch(error => next(error))
})
app.put('/api/persons/:id', (req, res, next)=> {
    const number = req.body.number;
    const name = req.body.name;
    if (!number) {
        res.status(400).send({error: "number is not provided"})
        return;
    }
    Entry.findByIdAndUpdate(req.params.id, {name:name, phoneNumber:number}, {new: true})
    .then(x=> {
        res.json(x.toJSON());
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.name)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }
    else if (error.name === 'ValidationError') {  
        return response.status(400).json({ error: error.message })
    }
  next(error)
}

app.use(errorHandler);
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
