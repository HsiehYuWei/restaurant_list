const express = require('express')
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json').results
const app = express()
const port = 3000
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))

//render reataurant
app.get('/', (req, res) => {

  res.render('index', { restaurantList })
})

//search
app.get('/search', (req, res) => {
  const keywords = req.query.keywords
  const reataurantType = req.query.keywords.toLowerCase()
  
  const restaurantFilter = restaurantList.filter(restaurant => 
    restaurant.name.toLowerCase().includes(reataurantType) ||
    restaurant.category.includes(reataurantType)
  )
  res.render('index', { restaurantList: restaurantFilter, keyword: keywords })
})

//render restaurant info
app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurantId = req.params.restaurant_id
  const restaurant = restaurantList.find(restaurant => 
    restaurant.id === Number(restaurantId)
  )
  
  res.render('show', {restaurant})
})


app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})