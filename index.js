require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('data', function getData(req) {
    if (req.method === 'POST' || req.method === "PUT") {
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

app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
        .catch(error => next(error))
});

app.get('/info', (request, response, next) => {
    Person.countDocuments({}, (err, count) => {
        response.send(
            `<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`
        )
    });
});

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            response.json(person)
        })
        .catch(error => next(error))
});

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end();
        })
        .catch(error => next(error));
});

app.post('/api/persons', (request, response, next) => {
    const body = request.body;

    const person = new Person({
        name: body.name,
        number: body.number,
    });

    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch((error) => {
            next(error);
        });
});

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body;

    const person = {
        name: body.name,
        number: body.number,
    };

    Person.findByIdAndUpdate(request.params.id, person, { runValidators: true, context: 'query', new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error));
});

const errorHandler = (error, request, response, next) => {
    console.log('--------errorHandler-------- ')
    console.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }
    next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})