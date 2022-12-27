const mongoose = require('mongoose') //載入 mongoose

//僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGOOSE_URI, { useNewUrlParser: true, useUnifiedTopology: true }) //連線到mongoDB

// 取得資料庫連線狀態
const db = mongoose.connection


// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})

// 連線成功
db.once('open', () => {
  console.log('mongodb connected')
})

module.exports = db