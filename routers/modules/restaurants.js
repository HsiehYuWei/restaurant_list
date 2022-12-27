const express = require('express')
const router = express.Router()
// 準備引入路由模組
const Restaurant = require('../../models/restaurant')

//新增功能畫面(新增在詳細餐廳資料及修改資料的新增資料功能)
router.get('/new', (req, res) => {
  return res.render('new')
})

//新增功能
router.post('/', (req, res) => {
  Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//render 餐廳詳細資訊
router.get('/:restaurant_id', (req, res) => {
  const restaurantId = req.params.restaurant_id
  // console.log(restaurantId)
  Restaurant.findById(restaurantId)
    .lean()
    .then(restaurants => res.render('show', { restaurants: restaurants }))
    .catch(err => console.log(error))
})

//編輯資料畫面
router.get('/:restaurant_id/edit', (req, res) => {
  const restaurantId = req.params.restaurant_id
  // console.log(restaurantId)
  Restaurant.findById(restaurantId)
    .lean()
    .then(restaurants => res.render('edit', { restaurants }))
    .catch(err => console.log(error))
})

//編輯資料功能
router.put('/:restaurant_id', (req, res) => {
  const restaurantId = req.params.restaurant_id

  return Restaurant.findByIdAndUpdate(restaurantId, req.body)
    .then(() => res.redirect(`/restaurants/${restaurantId}`))
    .catch(err => console.log(error))
})

//刪除功能
router.delete('/:restaurant_id', (req, res) => {
  const restaurantId = req.params.restaurant_id
  return Restaurant.findById(restaurantId)
    .then(restaurants => restaurants.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 匯出路由器
module.exports = router