const mongoose = require('mongoose')

const url = process.env.DB_URL

mongoose.set('strictQuery', false)
mongoose.connect(url)
            .then(res => console.log('Successfully connected to MongoDB'))
            .catch(({ message }) => console.log(`Error: ${message}`))


const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Name field must not be less than 3 characters'],
    required: true
  },
  number: {
    type: String,
    minLength: [8, 'Number field must not be less than 8 characters'],
    required: true, 
    validate: {
      validator: validateNumber = (value) => {
        const index = value.indexOf('-')
        if(index === 2 || index === 3) return true;
        return false
      },
      message: "Number field must be in the format '01-2345678' or '012-345678'"
    }
  }
})

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Contact', contactSchema)
