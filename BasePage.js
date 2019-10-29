const SeleniumInfra = require("./SeleniumInfraStructre");
const LOGGER = require('./logger')
class BasePage {  
  constructor(name)
  {
    this.logger = new LOGGER(name).logger
    this.selenium = new SeleniumInfra(this.logger);
  }
}
module.exports = BasePage;