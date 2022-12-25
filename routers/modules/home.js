const express = require('express')
const router = express.Router()
// 準備引入路由模組
const Restaurant = require('../../models/restaurant')

//render 首頁
router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(err => console.error(error))
})

//搜尋功能
router.get('/search', (req, res) => {

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

// 匯出路由器
module.exports = router