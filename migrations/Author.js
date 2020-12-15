const faker = require('faker')

module.exports = {
  up: async () => {
    try {
      const data = [...Array(10)].map((_, i) => ({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      }));
      await db.Author.deleteMany({})
      const res = await db.Author.insertMany(data)
      if(res){
        console.log("Author seeding successfully")
      }
    } catch (error) {
      console.log(error)
    }
  }
}
