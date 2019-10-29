class AnalyticsPage {
    constructor(selenium) {
        this.selenium = selenium
    }

    //This method navigate to Analytics page
    async navigateToAnalyticsPage() {
        await this.selenium.getURL("https://lh-crm.herokuapp.com/analytics")
        console.log("Navigate to Analytics page")
        await this.selenium.Sleep(5000)
    }

    //Returns the requested figure
    async AnalyticsDataPull(text) {
        let detailsBar = await this.selenium.findElementListBy('className', 'badge')
        let tempText
        for (let detail of detailsBar) {
            tempText = await this.selenium.getTextFromElement('className', 'badge-text', null, detail)
            if (tempText == text) {
                let value= await this.selenium.getTextFromElement('className', 'badge-val', null, detail)
                return value
            }
        }
        throw "The text parameter is not ok , the text can be : Outstanding Clients/Emails Sent"
    }
}


module.exports = AnalyticsPage