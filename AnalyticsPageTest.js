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

    async test() {

        await thisg.homepage.NavigateToHomePage()
        await this.checkOutstandingClients()
        await this.checkEmailSent()
        await this.updateAndCheckIfIncrease('Baroh', 'Cohen', 'Israel', 'Eldad', 'MaradonaCohen@gamil.com')
        await this.stabilityCheckOfUpdate(10)
        await this.testSelenium.close()
    }

    //This method count the number of outstanding client(sold=no) and check if the number is equal to the number on the analytics page
    async checkOutstandingClients() {
        await this.homepage.Navigate('Analytics')
        let outstandingNumber = await this.AnalyticsPage.AnalyticsDataPull('Outstanding Clients')
        await this.homepage.Navigate('Clients')
        await this.clientsPage.Search('No', 'Sold')
        let count = await this.clientsPage.ValidateSearchResults('No', 'Sold') //count the outstanding clients
        console.log(outstandingNumber == count ? `Test-Pass - The number of outstandig Clients on analytics page is correct :${outstandingNumber}` : `Test Failed - The number of outstandig Clients on analytics page is not correct ,value: ${outstandingNumber} , count: ${count}`)

    }

    //This method count the number of clients with email sent and compare between the counter to the number on analytics page 
    async checkEmailSent() {
        await this.homepage.Navigate('Analytics')
        let emailTypes = ['A', 'B', 'C', 'D']
        let emailSentNumber = await this.AnalyticsPage.AnalyticsDataPull('Emails Sent')
        let count = 0
        for (let type of emailTypes) {
            await this.homepage.Navigate('Clients')
            await this.clientsPage.Search(type, 'Email Type')
            count += await this.clientsPage.ValidateSearchResults(type, 'Email Type') //count all the customers that recieved mail
        }
        console.log(emailSentNumber == count ? "Test-Passed - The number of Emails sent on analytics page is correct" : `Test Failed - The number of Emails sent on analytics page is not correct , number of email sents on analytics = ${emailSentNumber} and the counter on the clientsPage is =${count}`)
    }

    //This method accept details,add client and return true if the outstanding clients increased by one false otherwise 
    async updateAndCheckIfIncrease(fname, lname, country, owner, email) {
        try {
            await this.homepage.Navigate('Analytics')
            let outstandingNumber = await this.AnalyticsPage.AnalyticsDataPull('Outstanding Clients')
            await this.homepage.Navigate('Actions')
            await this.ActionsPage.AddClient(fname, lname, country, owner, email)
            outstandingNumber = parseInt(outstandingNumber) + 1
            await this.homepage.Navigate('Analytics')
            let newOutstandingNumber = await this.AnalyticsPage.AnalyticsDataPull('Outstanding Clients')
            if (outstandingNumber == newOutstandingNumber) {
                console.log("Test Passed => the outstanding clients number are increased by one")
                return true
            }
            else {
                console.log("Test failed => the outstanding clients number are not increased")
                return false
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    //This method will check stability of the method UpdateAndCheckIfIncrease and print the results 
    async stabilityCheckOfUpdate(n) {
        let flag = true
        let i = 0
        while (i < n && flag) {
            flag = await this.updateAndCheckIfIncrease(`Oren${i}`, 'mor', 'Israel', 'shon', `Mario${i}shon@gamil.com`)
            i++
        }
        console.log(flag ? "The stability Test has passed" : "The stability Test has failed")
    }

}
const AnalyticsTest = new AnalyticsPageTest()
AnalyticsTest.test()
