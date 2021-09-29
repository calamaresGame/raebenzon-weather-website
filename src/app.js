const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
// console.log(__dirname)
// console.log(path.join(__dirname,'../public'))

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config 
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Set up handlebars engine and views location
app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))


app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Rae Benzon'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Rae Benzon'
    })
})
app.get('/help', (req,res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Rae Benzon'

    })
})
// app.get('', (req, res) => {
//     res.send('<h1> Weather </h1> ')
// })

// app.get('/help',(req,res) => {
//     res.send ([{
//         name: 'RAE BENZON'
//     }, {
//         name: 'CARLA CATAPANG'
//     }])
// })



// app.get('/about',(req,res) => {
//     res.send('<h1> About </h1>')
// })

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({error})
        }

     forecast(latitude, longitude, (error, forecastData) => {
         if(error) {
             return res.send({error })
         }
       res.send ({
           forecast:forecastData,
           location,
           address: req.query.address
            })
         })
       })

    })
//     res.send({
//         forecast: 'It is snowing',
//         location: 'Philadelphia',
//         address: req.query.address
//    })

app.get('/products', (req, res) => {
    if(!req.query.search){
       return res.send({
            error:'You must provide a search term'
        })
  }
    console.log(req.query.search)
    res.send({
        products:[]
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Rae Benzon',
        errorMessage:'Help article not found.'
    })

})

 app.get('*', (req, res) => {
     res.render('404', {
         title: '404',
         name: 'Rae Benzon',
         errorMessage:'Page not found.'
     })

 })


// app.com
// app.com/help
// app.com/about

app.listen(port, () => {
    console.log('Server is up on port .' + port )
})



