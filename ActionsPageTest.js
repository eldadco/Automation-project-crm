const BasePage = require("./BasePage")
const actionsPage = require("./ActionsPage")
const ClientsPage = require("./ClientsPage")
const AnalyticsPage = require("./AnalyticsPage")
const homepage = require('./HomePage')

class ActionsPageTest {
    constructor() {
        this.testSelenium = new BasePage().selenium
        this.ActionsPage = new actionsPage(this.testSelenium)
        this.clientsPage = new ClientsPage(this.testSelenium)
        this.AnalyticsPage = new AnalyticsPage(this.testSelenium)
        this.homepage = new homepage(this.testSelenium)
    }

    async Action()
    {
        await this.ActionsPage.navigateToActionsPage();

      
    }

    async Test()
    {
       
        await this.Action()
        await this.CheckAddClient("Bar", "Cohen", "Israel", "Jhon", 'Eldadcohen@aaa.com')
        await this.CheckAndValidateEmailUpdate("Bar Cohen", "Email Type", 'A')
        await this.CheckAndValidateSoldUpdate("Baraq Cohen", 'Sold')
        await this.NegativeSoldUpdate()
        await this.testSelenium.close()
    }

    //This method will Add new client and check if the succsesfull pop up appear and the user add to the clients page's table 
    async CheckAddClient(Fname, Lname, Country, Owner, Email)
    {

        await this.ActionsPage.AddClient(Fname, Lname, Country, Owner, Email)
        let isgoodpopup = await this.ActionsPage.CheckPopUp()
        await this.homepage.Navigate('Clients')
        let isadded =await this.clientsPage.Search(`${Fname} ${Lname}`,'name')
        console.log(isadded && isgoodpopup ? "Test passed -> Client has been added as expected" : "Test failed -> Client has not been added")
    }

    //This method will update Email type that was empty and check if the number of emails sent on the analytics page has increased by one 
    async CheckAndValidateEmailUpdate(name,field,emailtype) {
        try {
            await this.AnalyticsPage.navigateToAnalyticsPage()
            let perviousnum = await this.AnalyticsPage.AnalyticsDataPull("Emails Sent") // will contain the number before update
            await this.Action()
            await this.ActionsPage.Update(name,field,emailtype)
            await this.AnalyticsPage.navigateToAnalyticsPage()
            let newnum = await this.AnalyticsPage.AnalyticsDataPull("Emails Sent")
            perviousnum = parseInt(perviousnum) + 1
            console.log(`The number before the update: ${newnum-1} The number after the update : ${newnum}`)
            console.log(perviousnum == newnum? "Test passed =>The number of emails sent on the analytics page has increased as expected":"Test failed =>The number of emails sent on the analytics page hasn't increased as expected")
        }
        catch (error) {
            console.log(error)
        }
    }

    //This method will update sold to user that unsolded and check if the number of outstanding clients on the analytics page has decreased by one 
    async CheckAndValidateSoldUpdate(name,field,emailtype) {
        try {
            await this.AnalyticsPage.navigateToAnalyticsPage()
            let perviousnum = await this.AnalyticsPage.AnalyticsDataPull("Outstanding Clients") // will contain the number before update
            await this.Action()
            await this.ActionsPage.Update(name,field,emailtype)
            await this.AnalyticsPage.navigateToAnalyticsPage()
            let newnum = await this.AnalyticsPage.AnalyticsDataPull("Outstanding Clients")
            perviousnum = perviousnum - 1
            console.log(perviousnum == newnum ? "Test passed =>The number of Outstanding clients on the analytics page has decreased as expected " : "Test failed =>The number of outsanding clients on the analytics page hasn't decreased as expected ")
        }

        catch (error) {
            console.log(error)
        }
    }

    //This method will click on sold without insert client name and check if the error popup appear 
    async NegativeSoldUpdate() {
        await this.homepage.Navigate('Actions')
        await this.ActionsPage.Update("", 'Sold')
        let flag = await this.ActionsPage.CheckPopUp()
        console.log(flag ? "Test failed" : "Test passed")
    }

}
let ActionPageTest = new ActionsPageTest()

ActionPageTest.Test()