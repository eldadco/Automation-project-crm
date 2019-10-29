const BasePage = require("./BasePage");
const ClientsPage = require("./ClientsPage")
const HOMEPAGE = require('./HomePage')
//const AnalyticsPage= require('./Analytics')

class ClientsPageTest {
    constructor() {
        this.basepage = new BasePage()
        this.testSelenium = this.basepage.selenium
        this.logger = this.basepage.logger
        this.clientsPage = new ClientsPage(this.testSelenium, this.logger)
        this.homePage = new HOMEPAGE(this.testSelenium)
    }

    async test() {
         await this.homePage.NavigateToHomePage()
         await this.homePage.Navigate('Clients')
        await this.checkSearch('Alexander Berington', 'Name')
        await this.checkSearch('France', 'Country')
        await this.checkSearch('Eldadcohen@aaa.com', 'Email')
        await this.checkSearch('Hull Conrad', 'Owner')
        await this.checkSearch('YES', 'Sold')
        await this.checkSearch('A', 'Email Type')
        await this.checkUpdate('Leo Messi', 'name', 'Leo Ronaldo')
        await this.checkUpdate('Leo Ronaldo', 'name', 'Leo Messi')
        await this.checkUpdate('Leo Messi', 'Country', 'Israel')
        await this.checkUpdate('Leo Messi', 'Email', 'Jack@walla.com')
        await this.negativeCheckUpdateCountry('Leo Messi', 'Country', "123456")
        await this.testSelenium.close()

    }
    //This method will test the search functionality .
    //The searchby argument can be: Name,Country,Email,Owner,Sold,Email Type
    async checkSearch(input, searchby) {

        if (await this.clientsPage.Search(input, searchby)) {
            await this.clientsPage.ValidateSearchResults(input, searchby)
        }

         return

    }

    //This method will tests the update functionallity , update:name/country/email of specific client and validate that the update happened
    //This method works only if there is one unique Client Name !!! 
    async checkUpdate(clientName, field, changeto,isNegativeTest) {

        let isExist = await this.clientsPage.Search(clientName, 'name')
        if (isExist) {
            let flag = await this.clientsPage.updateDetails(field, changeto)
           if(!isNegativeTest)
           {
                console.log(flag ? `Test passed the update work as expected , The ${field} of ${clientName} was update succssesfully to ${changeto}` : `Test failed -the update work as expected , The ${field} of ${clientName} was not  update succssesfully to ${changeto}`)
                this.logger.info(flag ? `Test passed the update work as expected , The ${field} of ${clientName} was update succssesfully to ${changeto}` : `The ${field} of ${clientName} was not  update succssesfully to ${changeto}`)
           }
            return flag
        }
    }

    //This method will test the update negatively with update an non-exist country 
    async negativeCheckUpdateCountry(clientName, field, changeto) {
    
        let flag = await this.checkUpdate(clientName, field, changeto,true)
        if(flag)
        {
            console.log("Test failed non exist country was update")
            this.logger.error("Test failed non exist country was update")
        }
        else
        {
            this.logger.info("Test - negativeCheckUpdateCountry - passed")
            console.log("Test - negativeCheckUpdateCountry - passed")
        }  
         
    

    }
}


let clientPageTest = new ClientsPageTest()
clientPageTest.test()

