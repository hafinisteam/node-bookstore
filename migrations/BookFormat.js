module.exports = {
  up: async () => {
    try {
      const data = [
        {
          name: "Hardcover",
        },
        {
          name: "Paperpack",
        },
        {
          name: "Kindle",
        },
      ];
      await db.BookFormat.deleteMany({})
      const res = await db.BookFormat.insertMany(data)
      if(res){
        console.log("BookFormat seeding successfully")
      }
    } catch (error) {
      console.log(error)
    }
  }
}