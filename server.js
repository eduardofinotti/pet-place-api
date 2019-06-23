// CONFIGURAÇÃO BÁSICA
// ======================================

// IMPORTANDO OS PACKAGES --------------------
const express = require('express') // importando o express
const app = express() // definindo nosso app para usar o express
const bodyParser = require('body-parser') // importando body-parser
const morgan = require('morgan') // vamos usar para logar as requests
const mongoose = require('mongoose') // para trabalhar com nossa database
const port = process.env.PORT || 8000 // configurando a porta do serviço
const cjson = require('circular-json');

// DOMAINS
// ======================================
const Place = require('./domain/place')

const axios = require('axios');
var stringify = require('json-stringify-safe');

//mongoose.connect('mongodb://root:123456a@ds127429.mlab.com:27429/user', { useNewUrlParser: true })
//mongoose.set('useCreateIndex', true);

// CONFIGURANDO O SERVIÇO ---------------------
// usando o parser para pegar a informação do POST
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// configurando as chamadas CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization')
    next()
})

// logando as requisições no console
app.use(morgan('dev'))

// pegando uma instância do express router
const router = express.Router()

router.use(function (req, res, next) {
    next() 
})

// acesse GET http://localhost:8000/api/health
router.get('/health', (req, res) => {
    res.json({ message: 'API OK!' })
})

var middlewarePost = function (req, res, next) {
    console.log(req.body.name + req.body.address.lat + req.body.address.lon)
    
    var place = new Place()
    place.name = req.body.name
    place.address.lat = req.body.address.lat
    place.address.lon = req.body.address.lon
    
    console.log( place.name +  place.address.lat +  place.address.lon)
    // if(req.body.password.length >= 6){
    //   next()
    // }else{
    //   res.status(400).json({message:"A senha deve ter 6 caracteres."}) 
    // }
}

// rotas terminadas em /places
router.route('/places')
// criar usuário (POST http://localhost:8000/api/places)
.post(middlewarePost, function (req, res) { 
  // criar uma nova instância do Usuário
  var place = new Place()

   // informações do usuário (na request)
   place.name = req.body.name
   place.address.lat = req.body.address.lat
   place.address.lon = req.body.address.lon

  // salvar e verificar erros
  user.save(function (err) {
      if (err) {
          // usuário duplicado
          if (err.code === 11000) {
              return res.json({
              success: false,
              message: 'Um usuário com esse username já existe.'
              })
          } else {
              return res.send(err)
          }
      }
      res.json({ message: 'Usuário criado!' }).send()
  })
})

// returna todos os usuários (GET http://localhost:8000/api/users)
.get(function (req, res) {
  User.find(function (err, users) {
    if (err) res.send(err)
    // retorna os usuários
    res.json(users)
  })
})

// as rotas serão prefixadas com /api
app.use('/api', router)

// INICIANDO O SERVIÇO
// ===============================
app.listen(port)