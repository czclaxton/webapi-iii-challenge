const knex = require("knex");

// const production = process.env.NODE_ENV || "development";
const knexConfig = require("../knexfile.js");

module.exports = knex(knexConfig.development);
