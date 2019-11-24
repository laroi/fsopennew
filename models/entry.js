const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const url = process.env.MONGODB_URI;
console.log('connecting to', url);
mongoose.connect(url, { useNewUrlParser: true })
    .then(() => {    console.log('connected to MongoDB');  })  .catch((error) => {    console.log('error connecting to MongoDB:', error.message);  });
const entrySchema = new mongoose.Schema({ 
    name: {type:  String, required: true, unique: true},
    phoneNumber: {type: String, required: true, minlength:8, unique: true},
});

entrySchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});
entrySchema.plugin(uniqueValidator);
module.exports = mongoose.model('Entry', entrySchema);
