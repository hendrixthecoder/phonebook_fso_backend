require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.static('dist'));

const cors = require('cors');
app.use(cors());

app.use(express.json())
morgan.token('body', req => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const Contact = require('./models/contact')

app.get('/api/persons', (req,res) => {
    Contact.find({}).then(contacts => res.json(contacts))
})

app.get('/info', (req,res) => {

    Contact.find({}).then(result => {
        res.send(`
            <p>Phonebook has info for ${result.length} people</p>
            <p>This request was made on ${new Date()}</p>
        `)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    Contact.findById(req.params.id)
            .then(result => result ? res.json(result) : res.status(404).end())
            .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Contact.findByIdAndRemove(req.params.id)
            .then(result => result ? res.status(204).end() : res.status(404).send({ error: "Note doesn't exist or has been deleted" }))
            .catch(error => next(error))
})

app.post('/api/persons', (req,res) => {
    const body = req.body
    const { name, number } = body

    if(!name || !number){
        return res.status(400).json({
            "error" : "Incomplete data"
        })
    }

    const person = new Contact({
        "name": body.name,
        "number": body.number
    })

    person.save().then(result => res.json(person));

})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    
    const person = {
        name: body.name,
        number: body.number
    }

    Contact.findByIdAndUpdate(req.params.id, person, { new: true })
            .then(result => result ? res.json(result) : res.status(404).send({ error: "Contact not found or has been deleted"}))
            .catch(error => next(error))
})


const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.log(error.message);

    if(error.name === "CastError") return res.status(400).send({ error: "Malformatted ID" })
    next(error)
}

app.use(errorHandler)