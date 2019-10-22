const BasePage = require("./BasePage");
const HomePage = require("./HomePage")
class HomeTest
{

    constructor()
    {
        this.testSelenium = new BasePage().selenium
        this.HomePage = new HomePage(this.testSelenium)
    }
    
    async main()
    {
     
       await  this.HomePage.NavigateToHomePage()
        await this.HomePage.Navigate('Clients')
        await this.HomePage.ValidateNavigate('Clients')
    }

}

let hometest=new HomeTest()
hometest.main()
