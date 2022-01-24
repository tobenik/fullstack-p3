const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
};

const password = process.argv[2]

const url = `mongodb+srv://fullstackwd:${password}@cluster0.whslk.mongodb.net/Cluster0?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3){
    Person.find({}).then(result => {
        console.log('phonebook:');
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      })
} else if (process.argv.length === 5) {
    const note = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })
    
    note.save().then(result => {
      console.log(`added ${result.name} ${result.number} to phonebook!`)
      mongoose.connection.close()
    })
} else {
    console.log('wrong amount of arguments!');
};