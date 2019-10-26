const BasePage = require("./BasePage")
const actionsPage = require("./ActionsPage")
const ClientsPage = require("./ClientsPage")
const AnalyticsPage = require("./AnalyticsPage")
const HOMEPAGE = require('./HomePage')

class ActionsPageTest {
    constructor() {
        this.testSelenium = new BasePage().selenium
        this.ActionsPage = new actionsPage(this.testSelenium)
        this.clientsPage = new ClientsPage(this.testSelenium)
        this.AnalyticsPage = new AnalyticsPage(this.testSelenium)
        this.homepage = new HOMEPAGE(this.testSelenium)
    }
    async test() {
        await this.homepage.NavigateToHomePage()
        await this.checkAddClient("Erez", "Cohen", "Israel", "Jhon", 'Eldadcohen@aaa.com')
        await this.checkAndValidateEmailUpdate("Erez Cohen", "Email Type", 'A')
        await this.checkAndValidateSoldUpdate("Erez Cohen", 'Sold')
        await this.negativeSoldUpdate()
        await this.testSelenium.close()
    }

    //This method will Add new client and check if the succsesfull pop up appear and the user add to the clients page's table 
    async checkAddClient(Fname, Lname, Country, Owner, Email) {
        await this.homepage.Navigate('Actions')
        await this.ActionsPage.AddClient(Fname, Lname, Country, Owner, Email)
        let isgoodpopup = await this.ActionsPage.CheckPopUp()
        await this.homepage.Navigate('Clients')
        let isadded = await this.clientsPage.Search(`${Fname} ${Lname}`, 'name')
        console.log(isadded && isgoodpopup ? "Test passed -> Client has been added as expected" : "Test failed -> Client has not been added")
    }

    //This method will update Email type that was empty and check if the number of emails sent on the analytics page has increased by one 
    async checkAndValidateEmailUpdate(name, field, emailtype) {
        try {
            await this.homepage.Navigate('Analytics')
            let emailsSentsNumber = await this.AnalyticsPage.AnalyticsDataPull("Emails Sent") // will contain the number before update
            await this.homepage.Navigate('Actions')
            await this.ActionsPage.Update(name, field, emailtype)
            await this.homepage.Navigate('Analytics')
            let newEmailsSentsNumber = await this.AnalyticsPage.AnalyticsDataPull("Emails Sent")
            emailsSentsNumber = parseInt(emailsSentsNumber) + 1
            console.log(`The number before the update: ${emailsSentsNumber - 1} The number after the update : ${newEmailsSentsNumber}`)
            console.log(emailsSentsNumber == newEmailsSentsNumber ? "Test passed =>The number of emails sent on the analytics page has increased as expected" : "Test failed =>The number of emails sent on the analytics page hasn't increased as expected")
        }
        catch (error) {
            console.log(error)
        }
    }

    //This method will update sold to user that unsolded and check if the number of outstanding clients on the analytics page has decreased by one 
    async checkAndValidateSoldUpdate(name, field, emailtype) {
        try {
            await this.homepage.Navigate('Analytics')
            let outstandingNumber = await this.AnalyticsPage.AnalyticsDataPull("Outstanding Clients") // will contain the number before update
            await this.homepage.Navigate('Actions')
            await this.ActionsPage.Update(name, field, emailtype)
            await this.homepage.Navigate('Analytics')
            let newOutStandingNumber = await this.AnalyticsPage.AnalyticsDataPull("Outstanding Clients")
            outstandingNumber = outstandingNumber - 1
            console.log(outstandingNumber == newOutStandingNumber ? "Test passed =>The number of Outstanding clients on the analytics page has decreased as expected " : "Test failed =>The number of outsanding clients on the analytics page hasn't decreased as expected ")
        }

        catch (error) {
            console.log(error)
        }
    }

    //This method will click on sold without insert client name and check if the error popup appear 
    async negativeSoldUpdate() {
        await this.homepage.Navigate('Actions')
        await this.ActionsPage.Update("", 'Sold')
        let isExists = await this.ActionsPage.CheckPopUp()
        console.log(isExists ? "Test failed" : "Test passed")
    }

}
let ActionPageTest = new ActionsPageTest()


ActionPageTest.test()