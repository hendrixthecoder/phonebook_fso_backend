const mongoose = require('mongoose')

const url = process.env.DB_URL

mongoose.set('strictQuery', false)
mongoose.connect(url)
            .then(res => console.log('Successfully connected to MongoDB'))
            .catch(({ message }) => console.log(`Error: ${message}`))


const contactSchema = new mongoose.Schema({
  name: String,
  number: Number
})

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Contact', contactSchema)
