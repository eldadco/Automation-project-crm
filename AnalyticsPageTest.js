const BasePage = require("./BasePage")
const homePage = require("./HomePage")
const actionsPage = require("./ActionsPage")
const ClientsPage = require("./ClientsPage")
const AnalyticsPage = require("./AnalyticsPage")

class AnalyticsPageTest {
    constructor() {
        this.testSelenium = new BasePage().selenium
        this.ActionsPage = new actionsPage(this.testSelenium)
        this.clientsPage = new ClientsPage(this.testSelenium)
        this.AnalyticsPage = new AnalyticsPage(this.testSelenium)
        this.homepage = new homePage(this.testSelenium)

    }
    async Analytics() {
        await this.AnalyticsPage.navigateToAnalyticsPage()
    }
    async Test() {
        
        await this.AnalyticsPage.navigateToAnalyticsPage()
        // await this.CheckOutstandingClients()
        // await this.CheckEmailSents()
        // await this.UpdateAndCheckIfIncrease('Mar','Cohen','Israel','Eldad','MaradonaCohen@gamil.com')
        await this.StabilityCheckOfUpdate(10)
        await this.testSelenium.close()
    }
    //This method count the number of outstanding client(sold=no) and check if the number is equal to the number on the analytics page
    async CheckOutstandingClients() {
        let num = await this.AnalyticsPage.AnalyticsDataPull('Outstanding Clients')
        await this.homepage.Navigate('Clients')
        await this.clientsPage.Search('No', 'Sold')
        let count = await this.clientsPage.ValidateSearchResults('No', 'Sold')
        console.log(num == count ? "Test-Pass - The number of outstandig Clients on analytics page is correct" : "Test Failed - The number of outstandig Clients on analytics page is not correct ")

    }
    //This method count the number of clients with email sent and compare between the counter to the number on analytics page 
    async CheckEmailSents() {
        await this.AnalyticsPage.navigateToAnalyticsPage()
        let types = ['A', 'B', 'C', 'D']
        let num = await this.AnalyticsPage.AnalyticsDataPull('Emails Sent')
        let sum = 0
        for (let type of types) {
            await this.homepage.Navigate('Clients')
            await this.clientsPage.Search(type, 'Email Type')

            sum += await this.clientsPage.ValidateSearchResults(type, 'Email Type')
        }
        console.log(num == sum ? "Test-Passed - The number of Emails sent on analytics page is correct" : `Test Failed - The number of Emails sent on analytics page is not correct , number of email sents on analytics = ${num} and the counter on clients is =${sum}`)

    }
    //This method accept details,add client and return true if the outstanding clients increased by one false otherwise 
    async UpdateAndCheckIfIncrease(fname, lname, country, owner, email)
    {
        try{
            await this.AnalyticsPage.navigateToAnalyticsPage()
        let num = await this.AnalyticsPage.AnalyticsDataPull('Outstanding Clients')
        await  this.homepage.Navigate('Actions')
        await this.ActionsPage.AddClient(fname, lname, country, owner, email)
        num = parseInt(num) + 1
        await this.AnalyticsPage.navigateToAnalyticsPage()
        let new_num = await this.AnalyticsPage.AnalyticsDataPull('Outstanding Clients')
        if (num == new_num) {
            console.log("Test Passed => the outstanding clients number are increased by one")
            return true
        }
        else {
            console.log("Test failed => the outstanding clients number are not increased")
            return false
        }
    }
        catch(error)
        {
            console.error(error)
        }
}        

    //This method will check stability of the method UpdateAndCheckIfIncrease and print the results 
    async StabilityCheckOfUpdate(n) {
        let flag = true
        let i = 0
        while (i < n && flag)
        {
            if(i==2)
            {
                console.log("")
            }

            flag = await this.UpdateAndCheckIfIncrease(`ee${i}`, 'shon', 'Israel', 'shon', `Mario${i}shon@gamil.com`)
            i++
        }
        console.log(flag ? "The stability Test has passed" : "The stability Test has failed")
    }

}
const AnalyticsTest = new AnalyticsPageTest()
AnalyticsTest.Test()
