class HomePage {
    constructor(selenium) {
        this.selenium = selenium
    }

    async NavigateToHomePage() {
        await this.selenium.getURL("https://lh-crm.herokuapp.com")
    }
    async Navigate(PageName) {
        await this.selenium.clickElement('css', `input[value="${PageName}"]`)
        console.log(`Navigate to ${PageName}`)
        await this.selenium.Sleep(3000)
    }


}


module.exports = HomePage