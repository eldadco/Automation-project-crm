const BasePage = require("./BasePage")
const ClientsPage = require('./ClientsPage')
const ActionsPage = require('./ActionsPage')
const HomePage = require('./HomePage')
class AnalyticsPage {
    constructor(selenium) {
        this.selenium = selenium
        this.HomePage = new HomePage(this.selenium)
    }

    //This method navigate to Analytics page
    async navigateToAnalyticsPage() {
        await this.selenium.getURL("https://lh-crm.herokuapp.com/analytics")
        console.log("Navigate to Analytics page")
        await this.selenium.Sleep(5000)
    }

    //Returns the requested figure
    async AnalyticsDataPull(text) {

        let arr = await this.selenium.findElementListBy('className', 'badge')
        let temp
        for (let a of arr) {
            temp = await this.selenium.getTextFromElement('className', 'badge-text', null, a)
            if (temp == text) {
                let num = await this.selenium.getTextFromElement('className', 'badge-val', null, a)
                return num
            }
        }
        throw "The text parameter is not ok , the text can be : Outstanding Clients/Emails Sent"
    }
}


module.exports = AnalyticsPage