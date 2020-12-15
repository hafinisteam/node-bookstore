const _ = require("lodash");
const faker = require("faker");
const path = require("path");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);

module.exports = {
  up: async () => {
    try {
      await db.Book.deleteMany({})
      const authors = await db.Author.find({});
      const format = await db.BookFormat.find({});
      const files = await readdir(
        path.resolve() + "/media/static/assets/upload"
      );
      const hiddenFileRegex = /(^|\/)\.[^\/\.]/g;
      const images = files.filter((item) => !hiddenFileRegex.test(item));
      const books = [...Array(5)].map(() => ({
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        thumbnails: [_.sample(images)],
        authors: [_.sample(authors)._id],
        prices: [
          {
            price: faker.random.number(),
            format: _.sample(format)._id,
          },
        ],
        quantity: 1
      }))
      const res = await db.Book.insertMany(books)
      if(res){
        console.log("Book seeding successfully")
      }
    } catch (error) {
      console.log(error);
    }
  },
};
