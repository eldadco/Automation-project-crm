const SeleniumInfra = require("./SeleniumInfraStructre");
class BasePage {  
  constructor()
  {
    this.selenium = new SeleniumInfra();
    
  }
}
module.exports = BasePage;