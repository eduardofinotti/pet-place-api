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

mongoose.connect('mongodb://root:123456a@ds241977.mlab.com:41977/pet-place', { useNewUrlParser: true })
mongoose.set('useCreateIndex', true);

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

var middleware = function (req, res, next) {

    //if(req.query.cidade != null || req.query.cidade != "" || req.query.cidade != undefined){
        
    if(!req.query.lat || !req.query.lon){
        res.status(403).json({message: "Latitude e Longitude devem ser informados!"})
    }else{
        next()
    }
} 

var middlewarePost = function (req, res, next) {

    if (!req.body.name ||
        !req.body.address.lat ||
        !req.body.address.lat ||
        !req.body.address.address ||
        !req.body.address.city ||
        !req.body.address.state ||
        !req.body.address.zip_code ||
        !req.body.photo_url ||
        !req.body.others_informations){
            res.status(400).send({message: "Dados faltando!"})
            return
    }
    next()
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
        place.address.address = req.body.address.address
        place.address.city = req.body.address.city
        place.address.state = req.body.address.state
        place.address.zip_code = req.body.address.zip_code
        place.photo_url = req.body.photo_url
        place.agua = req.body.agua
        place.seguro = req.body.seguro
        place.pet_solto = req.body.pet_solto
        place.limpo = req.body.limpo
        place.banheiro = req.body.banheiro
        place.conveniencias = req.body.conveniencias
        place.others_informations = req.body.others_informations

        // salvar e verificar erros
        place.save(function (err, result) {
            if (err) {
                // usuário duplicado
                if (err.code === 11000) {
                    return res.json({
                    success: false,
                    message: 'Um Place com esses dados já existe.'
                    })
                } else {
                    return res.send(err)
                }
            }
            res.json(
                    {
                        message: 'Place criado!', 
                        id: result._id }).send()
                    }
        )
    })

    // returna todos os usuários (GET http://localhost:8000/api/places)
    .get(function (req, res) {

        if(!req.query.lat || !req.query.lon){
            Place.find(function (err, place) {
                if (err) res.send(err)
                // retorna os usuários
                res.json(place)
            })

        }else{
            var lat = req.query.lat 
            var lon = req.query.lon
            
            lat = parseFloat(lat)
            lon = parseFloat(lon)

            // 0.04504504505 = 5km
            var minLat = lat - 0.04504504505
            var minLon = lon - 0.04504504505

            var maxLat = lat + 0.04504504505
            var maxLon = lon + 0.04504504505

            // lat > minLat && lat < maxLat && lon > minLon && lon < maxLon
            Place.find( { 
                $and: [ 
                    { "address.lat": { $gte: minLat } }, 
                    { "address.lat": { $lte: maxLat } }, 
                    { "address.lon": { $gte: minLon } }, 
                    { "address.lon": { $lte: maxLon } } 
                ] 
            }, (err, place )=> {
                
                if (res.status(200)){
                    var element = []

                    for (let index = 0; index < place.length; index++) {
                        element.push({
                            id: place[index].id,
                            name: place[index].name,
                            lat: place[index].address.lat,
                            lon: place[index].address.lon
                        })
                    }
    
                    res.status(200).json({places: element})
                }                
            })

        }
    })

router.route('/place/:id')
    // retorna o usuário com o id (GET http://localhost:8000/api/places/:id)
    .get(function (req, res) {
        Place.findById(req.params.id, function (err, place) {
            if (err) res.send(err)
            // retorna o place
            res.json(place)
        })
    })

// rotas terminadas em /places
router.route('/places/sugestion')
    // returna todos os usuários (GET http://localhost:8000/api/places/sugestion)
    .get(middleware, function (req, res) {

        var lat = req.query.lat 
        var lon = req.query.lon
        
        lat = parseFloat(lat)
        lon = parseFloat(lon)

        // 0.00900900901 = 1km
        var minLat = lat - 0.00900900901
        var minLon = lon - 0.00900900901

        var maxLat = lat + 0.00900900901
        var maxLon = lon + 0.00900900901

        // lat > minLat && lat < maxLat && lon > minLon && lon < maxLon
        Place.find( { 
            $and: [ 
                { "address.lat": { $gte: minLat } }, 
                { "address.lat": { $lte: maxLat } }, 
                { "address.lon": { $gte: minLon } }, 
                { "address.lon": { $lte: maxLon } } 
            ] 
        }, (err, place )=> {
            
            if (res.status(200)){
                var element = []

                for (let index = 0; index < place.length; index++) {
                    element.push({
                        id: place[index].id,
                        name: place[index].name,
                        address: place[index].address.address,
                        city: place[index].address.city,
                        lat: place[index].address.lat,
                        lon: place[index].address.lon
                    })
                }

                res.status(200).json({sugestion: element})
            }                
        })
        
    })

module.exports = app

// as rotas serão prefixadas com /api
app.use('/api', router)

// INICIANDO O SERVIÇO
// ===============================
app.listen(port)

exports = module.exports = app;
