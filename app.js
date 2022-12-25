const express = require('express')
const exphbs = require('express-handlebars')
const Restaurant = require('./models/restaurant')
const restaurantList = require('./restaurant.json').results
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const router = require('./routers')

require('./confing/mongoose')




const app = express()
const port = 3000

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs'}))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(router)



app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})