const migration = require('./migrations')

async function start(){
  const mongoose = await require('./db/mongoose')()
  await migration.Author.up()
  await migration.BookFormat.up()
  await migration.Book.up()
  mongoose.connection.close()
}

start()