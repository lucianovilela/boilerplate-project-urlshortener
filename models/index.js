const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

var uri = `mongodb://admin:${process.env.DB_PASSWORD}@cluster0-shard-00-00.mrzgo.mongodb.net:27017,cluster0-shard-00-01.mrzgo.mongodb.net:27017,cluster0-shard-00-02.mrzgo.mongodb.net:27017/portaoeletronico?ssl=true&replicaSet=atlas-k6rsc8-shard-0&authSource=admin&retryWrites=true&w=majority`;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('open', () => console.log('Mongoose connected.'));
mongoose.connection.on('error', err => console.log(`Mongoose could not connect: ${err}`));

const urlSchema = mongoose.Schema({
  original_url: String,
  short_url: Number
});

autoIncrement.initialize(mongoose.connection);
urlSchema.plugin(autoIncrement.plugin, {
  model: 'URL',
  field: 'short_url',
  startAt: 1,
  incrementBy: 1
});

module.exports = mongoose.model('shortenurl', urlSchema);