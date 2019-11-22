const mongoose = require('mongoose');
if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3];
const phone = process.argv[4];

const phonebookSchema = new mongoose.Schema({
  id: String,
  name: String,
  phoneNumber: String,
})

const Entry = mongoose.model('Entry', phonebookSchema)
const database = 'phonebook'
console.log(password)
const url = `mongodb+srv://akbar:${password}@cluster0-qspqu.mongodb.net/${database}?retryWrites=true&w=majority`;
console.log(url)
mongoose.connect(url, { useNewUrlParser: true })

if (name && phone) {
    const phoneObj = new Entry({name: name, phoneNumber:phone});
    phoneObj.save()
    .then(x=> {
        console.log(`added ${name} number ${phone}`)
         mongoose.connection.close()
 
    });    
} else {
Entry.find({}).then(result => {
  result.forEach(note => {
    console.log(`${note.name} - ${note.phoneNumber}`)
  })
  mongoose.connection.close()
})
}
