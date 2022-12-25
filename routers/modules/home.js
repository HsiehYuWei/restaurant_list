const express = require('express')
const router = express.Router()
// 準備引入路由模組
const Restaurant = require('../../models/restaurant')

//render 首頁
router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .sort({_id: 'asc'})
    .then(restaurants => res.render('index', { restaurants }))
    .catch(err => console.error(error))
})

//搜尋功能
router.get('/search', (req, res) => {

  const keywords = req.query.keywords
  const sort = req.query.sort
  const reataurantType = req.query.keywords.toLowerCase()


  const sortData = {
    0: {_id: 'asc'},
    atoz: {name: 'asc'},
    ztoa: {name: 'desc'},
    category: { category: 'asc'},
    location: {location: 'asc'}
  }

  const sortSelected = { [sort]: true }
  // console.log(sortData[sort])
  Restaurant.find({})
    .lean()
    .sort(sortData[sort])
    .then(restaurants => {
      const restaurantFilter = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(reataurantType) ||
        restaurant.category.includes(reataurantType)
      )
      if(keywords) {
        res.render('index', { restaurants: restaurantFilter, keyword: keywords, sortSelected })
      } else {
        res.render('index', { restaurants: restaurantFilter, sortSelected })
      }

    })
    .catch(err => console.log(error))
})

// 匯出路由器
module.exports = router