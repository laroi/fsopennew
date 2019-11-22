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



app.get('/api/persons', (req, res) => {
    Entry.find({}).then(result => {      
        res.json(result.map(x=>x.toJSON()))
    })

})
app.get('/info', (req, res) => {
        Entry.count({}).then(result => {      

    res.send(`<p>phonebook has info for ${result} people </p> <p>${new Date()}</p>`)
        })
})
app.get('/api/persons/:id', (req, res) => {
    Entry.findOne({_id:req.params.id}).then(result => {
        if (result) {
            res.json(result);
        } else {
            res.status(404).send();
        }

    })
})
app.delete('/api/persons/:id', (req, res) => {
    Entry.remove({_id:req.params.id}).then(result => {
        if (result) {
            res.status(204).send();
        } else {
            res.status(404).send();
        }
    })

})
app.post('/api/persons', (req, res)=> {
    const number = req.body.number;
    const name = req.body.name;
    if (!number) {
        res.status(400).send({error: "number is not provided"})
        return;
    }
    const phoneObj = new Entry({name: name, phoneNumber:number});
    phoneObj.save()
    .then(x=> {
        res.status(201).send();
    })
})
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
