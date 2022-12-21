const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose') //載入 mongoose
const restaurantList = require('./restaurant.json').results
const Restaurant = require('./models/restaurant')
const bodyParser = require('body-parser')

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
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect(process.env.MONGOOSE_URI, { useNewUrlParser: true, useUnifiedTopology: true }) //連線到mongoDB\

//render 首頁
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(err => console.error(error))
})

//新增功能畫面
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

//新增功能
app.post('/restaurants', (req, res) => {
  Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//搜尋功能
app.get('/search', (req, res) => {
  const keywords = req.query.keywords
  const reataurantType = req.query.keywords.toLowerCase()
  

  Restaurant.find({})
    .lean()
    .then(restaurants => {
      const restaurantFilter = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(reataurantType) ||
        restaurant.category.includes(reataurantType)
      )
      res.render('index', { restaurants: restaurantFilter, keyword: keywords })
    })
    .catch(err => console.log(error))
})

//render 餐廳詳細資訊
app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurantId = req.params.restaurant_id
  // console.log(restaurantId)
  Restaurant.findById(restaurantId)
    .lean()
    .then(restaurants => res.render('show', { restaurants: restaurants }))
    .catch(err => console.log(error))
})

//編輯資料畫面
app.get('/restaurants/:restaurant_id/edit', (req, res) => {
  const restaurantId = req.params.restaurant_id
  // console.log(restaurantId)
  Restaurant.findById(restaurantId)
    .lean()
    .then(restaurants => res.render('edit', { restaurants }))
    .catch(err => console.log(error))
})

//編輯資料功能
app.put('/restaurants/:restaurant_id', (req, res) => {
  const restaurantId = req.params.restaurant_id

  return Restaurant.findByIdAndUpdate(restaurantId, req.body)
    .then(() => res.redirect(`/restaurants/${restaurantId}`))
    .catch(err => console.log(error))
})

//刪除功能
app.post('/restaurants/:restaurant_id/delete', (req, res) => {
  const restaurantId = req.params.restaurant_id
  return Restaurant.findById(restaurantId)
    .then(restaurants => restaurants.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})