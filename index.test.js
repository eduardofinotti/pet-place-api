const test = require('tape')
const supertest = require('supertest')
const server = require('./server')

test('GET /api/health', (t) => {
    supertest(server)
        .get('/api/health')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            t.assert(res.status === 200, "Status 200")
            t.end()
        })
})

test('POST /api/places', function (t) {
    var newThing = {
        "name": "Parque BBB",
        "address": 
        {
            "lat": -27.63612904504,
            "lon": -48.68630804505,
            "address": "Rua dos cocos",
            "city": "Fpolis",
            "state": "SC",
            "zip_code": "88099-783"
        },
        "photo_url": "s",
        "sombra": true,
        "agua": true,
        "seguro": false,
        "pet_solto": true,
        "limpo": true,
        "banheiro": false,
        "conveniencias": true,
        "others_informations": "Casa"
    }
    supertest(server)
      .post('/api/places')
      .send(newThing)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        t.assert(res.status === 200, "Status 200")
        t.end()
    })
})



// test('GET /api/tempo?city=london&prevision=0', (t) => {
//     supertest(index.app)
//         .get('/api/tempo?city=london&prevision=0')
//         .expect('Content-Type', /json/)
//         .expect(200)
//         .end((err, res) => {
//             t.error(err, 'Sem erros')
//             t.assert(res.body.status === 200, "Status 200")
//             t.assert(res.body.previsions[0] == undefined, "weather_state Ok")
//             t.end()
//         })
// })

// test('GET /api/tempo?city=london', (t) => {
//     supertest(index.app)
//         .get('/api/tempo?city=london')
//         .expect('Content-Type', /json/)
//         .expect(200)
//         .end((err, res) => {
//             t.error(err, 'Sem erros')
//             t.assert(res.body.status === 200, "Status 200")
//             t.assert(res.body.previsions[0].weather_state != null, "weather_state Ok")
//             t.end()
//         })
// })

// test('GET /api/tempo', (t) => {
//     supertest(index.app)
//         .get('/api/tempo')
//         .expect('Content-Type', /json/)
//         .expect(403)
//         .end((err, res) => {
//             t.error(err, 'Sem erros')
//             t.assert(res.status === 403, "Status 403")
//             t.end()
//         })
// })

test.onFinish(() => process.exit(0));


