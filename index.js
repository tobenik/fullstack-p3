const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

morgan.token('data', function getData (req) {
    if (req.method === 'POST'){
        return JSON.stringify(req.body);
    } else {
        return null;
    }
  })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
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

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`);
});

app.get('/api/persons/:id', (request, response) => {
    const personId = Number(request.params.id);
    const person = persons.find((p) => p.id === personId);
    if (!person) {
        response.status(404).end();
    } else {
        response.json(person);
    };
});

app.delete('/api/persons/:id', (request, response) => {
    const personId = Number(request.params.id);
    persons = persons.filter(p => p.id !== personId);

    response.status(204).end();
});

app.post('/api/persons', (request, response) => {
    const person = request.body;
    if (!person.name || !person.number) {
        return response.status(400)
            .json({ error: "person must have name and number" });
    } else if (persons.find(p => p.name === person.name)) {
        return response.status(400)
            .json({ error: "person already exists" });
    } else {
        const newId = Math.floor(Math.random()*9999);
        persons.push(
            {
                "id": newId,
                "name": person.name,
                "number": person.number
            }
        )
        response.status(200).end();
    }

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})