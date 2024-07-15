// config.js
const dotenv = require("dotenv");

dotenv.config();

class Config {
  constructor() {
    if (Config.instance) {
      return Config.instance;
    }

    Config.instance = this;

    this.PORT = process.env.PORT || 3000;
    this.DB_HOST = process.env.DB_HOST || "localhost";
    this.DB_USER = process.env.DB_USER || "user";
    this.DB_PASSWORD = process.env.DB_PASSWORD || "password";
    this.DB_NAME = process.env.DB_NAME || "meme_gallery";
  }

  static getInstance() {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }
}

module.exports = Config.getInstance();
