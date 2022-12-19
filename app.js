const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose') //載入 mongoose
const restaurantList = require('./restaurant.json').results

//僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// 取得資料庫連線狀態
const db = mongoose.connection

// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})

// 連線成功
db.once('open', () =>{
  console.log('mongodb connected')
})

const app = express()
const port = 3000

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs'}))
app.set('view engine', 'hbs')
app.use(express.static('public'))

mongoose.connect(process.env.MONGOOSE_URI, { useNewUrlParser: true, useUnifiedTopology: true }) //連線到mongoDB

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