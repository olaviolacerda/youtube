module.exports = {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
  port: process.env.PORT || 5858,
  tokenSecret: process.env.TOKEN_SECRET || 'secret'
}
