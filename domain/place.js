// importando os packages que precisamos
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

// schema
const PlaceSchema = new Schema({
    name: String,

    address: {
      lat: Number,
      lat: Number,
      address: String,
      city: String,
      state: String,
      zip_code: String
    },
    
    photo_url: String,

    sombra: Boolean,
    agua: Boolean,
    seguro: Boolean,
    pet_solto: Boolean,
    limpo: Boolean,
    banheiro: Boolean,
    conveniencias: Boolean
  })

// // gerar o hash do password antes de salvar
// PlaceSchema.pre('save', function (next) {
//     const place = this
  
//     // gerar o hash apenas se o password mudou o para um novo usuário
//     if (!place.isModified('password')) { return next() }
  
//     // gerando o hash
//     const hash = bcrypt.hashSync(user.password)
  
//     // trocando o password pelo hash
//     user.password = hash
//     next()
// })
  
// // method to compare a given password with the database hash
// UserSchema.methods.comparePassword = function (password) {
//     const user = this
//     return bcrypt.compareSync(password, user.password)
// }

// exportando a entidade
module.exports = mongoose.model('Place', PlaceSchema)