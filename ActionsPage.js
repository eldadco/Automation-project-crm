class ActionsPage {
    constructor(selenium) {
        this.selenium = selenium


    }
    //This method navigate to actions page
    async navigateToActionsPage() {
        await this.selenium.getURL("https://lh-crm.herokuapp.com/actions")
        await this.selenium.Sleep(4000)
        console.log("Nevigate to Actions page")
    }

    //This method return true if a succsesfull pop-up appear false otherwise 
    async CheckPopUp() {
        if (await this.selenium.isElementExists('className', 'success-pop-up')) {
            console.log("The succsesfull pop up appear")
            return true
        }
        else if (await this.selenium.isElementExists('className', 'error-pop-up')) {
            console.log("Error pop up appear")
            return false
        }
        else {
            console.log("There is not popup message")
            return false
        }
    }

    //This method update client details 
    async Update(ClientName, Action, ActionValue) {
        try {
            await this.selenium.write(ClientName, 'css', 'div.client-input input[list="names"]')

            switch (Action) {
                // remember after ending write the cases to set(navigate at first nd at the end) the isequal and datapull functions !!!!!!!!
                case ("Transfer ownership"):
                    await this.selenium.write(ActionValue, 'css', 'th input[list="owner"]')
                    await this.selenium.clickElement('css', 'th input[value="Transfer"]')
                    break;
                case ("Email Type"):

                    await this.selenium.write(ActionValue, 'css', 'th input[list="emailType"]')
                    await this.selenium.clickElement('css', 'th input[value="Send"]')
                    break;
                case ("Sold"):
                    await this.selenium.clickElement('css', 'th input[value="Sold"]')
                    break;
            }


        }

        catch (error) {
            console.error(error)

        }
    }

    //This method add a new client 
    async AddClient(fname, lname, country, owner, email) {
        await this.selenium.write(fname, "id", "firstName")
        await this.selenium.write(lname, "id", "lastName")
        await this.selenium.write(country, "id", "country")
        await this.selenium.write(owner, "css", "input#owner")
        await this.selenium.write(email, "id", "email")
        await this.selenium.clickElement('className', 'add-client-btn')



    }
}

module.exports = ActionsPage

