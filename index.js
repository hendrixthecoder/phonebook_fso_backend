const express = require('express')
const morgan = require('morgan')
const app = express()

const cors = require('cors');
app.use(cors());

app.use(express.json())
morgan.token('body', req => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req,res) => {
    res.status(200).send(persons)
})

app.get('/info', (req,res) => {
    const number = persons.length
    date = new Date().toString()
    res.send(`
        <p>Phonebook currently has info for ${number} people</p>
        <p>${date}</p>
    `)
})

app.get('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    person ? res.json(person) : res.status(400).send('Person not found or deleted')
})

app.delete('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if(person) {
        persons.filter(person => person.id !== id)
        res.status(204).end()
    }else {
        res.status(404).send('Person not found or has already been deleted')
    }
    
})

const generateId = () => {
    return Math.round(Math.random() * (100000 - 1) + 1);
}

app.post('/api/persons', (req,res) => {
    const body = req.body
    const { name, number } = body

    if(!name || !number){
        return res.status(400).json({
            "error" : "Incomplete data"
        })
    }

    const exist = persons.filter(p => p.name === name)

    if (exist.length) return res.status(400).json({"error":"Name already exists"})

    const person = {
        "id": generateId(),
        "name": body.name,
        "number": body.number
    }

    persons.concat(person)
    res.json(person)

})



const PORT = 3500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)