const BasePage = require("./BasePage");
const ClientsPage = require("./ClientsPage")
//const AnalyticsPage= require('./Analytics')

class ClientsPageTest {
    constructor() {
        this.testSelenium = new BasePage().selenium
        this.clientsPage = new ClientsPage(this.testSelenium)
    }

    async test()
    {
        await this.clientsPage.navigateToClientsPage()
        await this.CheckSearch('Alexander Berington', 'Name')
        await this.CheckSearch('France', 'Country')
        await this.CheckSearch('Eldadcohen@aaa.com', 'Email')
        await this.CheckSearch('Hull Conrad', 'Owner')
        await this.CheckSearch('YES', 'Sold')
        await this.CheckSearch('A', 'Email Type')
        await this.CheckUpdate('Leo Messi', 'name', 'Leo Ronaldo')
        await this.CheckUpdate('Leo Ronaldo', 'name', 'Leo Messi')
        await this.CheckUpdate('Leo Messi', 'Country', 'Israel')
        await this.CheckUpdate('Leo Messi', 'Email', 'Jack@walla.com')
        await this.NegativeCheckUpdateCountry('Leo Messi', 'Country', "123456")
        await this.testSelenium.close()



    }
    //This method will test the search functionality .
    //The searchby argument can be: Name,Country,Email,Owner,Sold,Email Type
    async CheckSearch(input, searchby) {
       
        
        let isExist = await this.clientsPage.Search(input, searchby)
        if (isExist) {
            await this.clientsPage.ValidateSearchResults(input, searchby)

        }

        return

    }
    
    //This method will test the update functionallity , update:name/country/email of specific client and validate that the update happened
    //This method work just if there is one unique Client Name !!! 
    async CheckUpdate(Clientname, field, changeto) {
        await this.clientsPage.navigateToClientsPage()
        let isExist = await this.clientsPage.Search(Clientname, 'name')
        if (isExist) {
            let flag=await this.clientsPage.UpdateDetails(field, changeto)
            return flag
        }
    }

    //This method will test the update negatively with update an non-exist country 
    async NegativeCheckUpdateCountry(Clientname, field, changeto) {
        
        let flag=await this.CheckUpdate(Clientname, field, changeto)
            console.log(flag ?  "Test failed non exist country added" : "Test passed " )      
    }   
}


let clientPageTest = new ClientsPageTest()
clientPageTest.test()

