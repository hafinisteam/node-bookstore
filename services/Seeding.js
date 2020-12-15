const seeder = require("mongoose-seed");
require('dotenv').config()

const initSeeder = function(data, loadModels, clearModels){
  seeder.connect(process.env.MONGO_URI, function () {
    seeder.loadModels(loadModels);
    seeder.clearModels(clearModels, function () {
      seeder.populateModels(data, function () {
        seeder.disconnect();
        console.log("Seeding data succesfully");
      });
    });
  });
}

module.exports = initSeeder