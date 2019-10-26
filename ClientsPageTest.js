const BasePage = require("./BasePage");
const ClientsPage = require("./ClientsPage")
const HOMEPAGE = require('./HomePage')
//const AnalyticsPage= require('./Analytics')

class ClientsPageTest {
    constructor() {
        this.testSelenium = new BasePage().selenium
        this.clientsPage = new ClientsPage(this.testSelenium)
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

        let isExist = await this.clientsPage.Search(input, searchby)
        if (isExist) {
            await this.clientsPage.ValidateSearchResults(input, searchby)

        }

        return

    }

    //This method will test the update functionallity , update:name/country/email of specific client and validate that the update happened
    //This method work just if there is one unique Client Name !!! 
    async checkUpdate(clientName, field, changeto) {

        let isExist = await this.clientsPage.Search(clientName, 'name')
        if (isExist) {
            let flag = await this.clientsPage.UpdateDetails(field, changeto)
            console.log(flag ? 'Test passed the update work as expected ' : 'Test failed -the update does not work as expected')
            return flag
        }
    }

    //This method will test the update negatively with update an non-exist country 
    async negativeCheckUpdateCountry(clientName, field, changeto) {

        let flag = await this.checkUpdate(clientName, field, changeto)
        console.log(flag ? "Test failed non exist country was update" : "Test passed")
    }
}


let clientPageTest = new ClientsPageTest()
clientPageTest.test()

