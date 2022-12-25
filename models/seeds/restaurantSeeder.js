const Restaurant = require('../restaurant')
const restaurantList = require('../../restaurant.json').results
const db = require('../../confing/mongoose')


db.once('open', () => {
  console.log('mongodb connected')

  Restaurant.create(restaurantList)
    .then(() => {
      console.log("restaurantSeeder done!")
      db.close()
    })
    .catch(err => console.log(err))
})