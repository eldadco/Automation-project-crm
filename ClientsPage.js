class ClientsPage {
    constructor(selenium) {
        this.selenium = selenium
    }

    async navigateToClientsPage() {
        await this.selenium.getURL("https://lh-crm.herokuapp.com/client")
        console.log("Navigate to Clients page")
    }

    /*This method gets an input to search and the field to search by
    searchBy can be: Name, Country, Email, Owner, Sold, EmailType
    Return value: true if client exist, false otherwise
    */

    async Search(input, searchBy) {
        await this.selenium.write(searchBy, 'className', 'select-css')
        await this.clear('css', 'div.clients-component  div.search-clients  input[type=text]')
        await this.selenium.write(input, 'css', 'div.clients-component  div.search-clients  input[type=text]')
        await this.selenium.Sleep(5000)
        let flag = await this.selenium.isElementExists('css', 'tr.clientDetails')
        if (flag) {
            console.log("There is at least one result")
            return true
        }
        console.log("There is not results")
        return false
    }

    // This method get the search by input and return his column number on the table (The indexs in the array are same as at the table)
    _sortColumns(searchBy) {
        let details = ['null', 'First Name', 'Last Name', 'Country', 'Email', 'Owner', 'Sold', 'Contact Date', 'Email Type']
        for (let i = 1; i < details.length; i++) {
            if (details[i].toLowerCase() == searchBy) {
                return i
            }
        }
        throw "The search by parameter is not correct"
    }


    //This method gets input and searchby and print if the results are match to the input  or not
    //The method also return the number of results 
    async ValidateSearchResults(input, searchBy) {
        searchBy = searchBy.toLowerCase()
        try {

            let pagesnum = await this.selenium.getTextFromElement('css', 'div.page-numbers span:nth-child(4)')
            input = input.split(" ").join("")
            let ismatch = true
            let i = 1
            let counter = 0
            while (i <= pagesnum && ismatch) {

                let arr = await this.selenium.findElementListBy('css', 'tr.clientDetails') // Contain all the results of the current page

                ismatch = await this.Ismatch(arr, input, searchBy)
                counter += arr.length
                await this.selenium.clickElement('css', 'div.page-numbers img:nth-child(5)')
                i++
            }
            console.log(ismatch ? "Test passed -> All the results are good and match to the input " : "Test failed -> Not all results are good and match to the input ")

            return counter
        }
        catch (error) {
            console.log(error)
        }
    }
    //This method will update details of specsific client and validate that the datails change as expected 
    // The suggest is that there is just one client with this name the using on arr is for one record and because the method ismatch accept array 

    async UpdateDetails(field, changeto) {
        try {
            let arr
            await this.selenium.clickElement('css', 'tr.clientDetails')
            field = field.toLowerCase()
            let flag
            switch (field) {
                case "name":
                    await this.selenium.clearElementField('css', 'input#name')
                    await this.selenium.write(changeto, 'css', 'input#name')
                    await this.selenium.clickElement('className', 'update-client-popup-btn')
                    await this.selenium.clickElement('className', 'cancel-client-popup-btn')
                    await this.selenium.clearElementField('css', "div.clients-component  div.search-clients  input[type=text]")
                    flag = await this.Search(changeto, 'name')
                    if (flag) {
                        arr = await this.selenium.findElementListBy('css', 'tr.clientDetails')
                        changeto = changeto.split(" ").join("")
                        flag = await this.Ismatch(arr, changeto, 'name')
                    }
                    console.log(flag ? "Name has update successfully" : "Name has not update successfully")
                    return
                case "country":
                    await this.selenium.clearElementField('css', 'input#country')
                    await this.selenium.write(changeto, 'css', 'input#country')
                    await this.selenium.clickElement('className', 'update-client-popup-btn')
                    arr = await this.selenium.findElementListBy('css', 'tr.clientDetails')
                    flag = await this.Ismatch(arr, changeto, field)
                    break
                case 'email':
                    await this.selenium.clearElementField('css', 'input#email')
                    await this.selenium.write(changeto, 'css', 'input#email')
                    await this.selenium.clickElement('className', 'update-client-popup-btn')
                    arr = await this.selenium.findElementListBy('css', 'tr.clientDetails')
                    flag = await this.Ismatch(arr, changeto, field)
                    break
            }
            console.log(flag ? "Client details was update succsesfully" : "Client details was not update succsesfully")
            return flag
        }
        catch (error) {
            console.error(error)
        }
    }

    //This method will check if all results at the current page are match to the input 
    async Ismatch(arr, input, searchBy) {
        let index
        try {
            if (searchBy !== 'name') {
                index = this._sortColumns(searchBy)
            }

            for (let a of arr) {
                if (searchBy == 'name') {
                    let fname = await this.selenium.getTextFromElement('css', 'tr.clientDetails th:nth-child(1)', null, a)
                    let lname = await this.selenium.getTextFromElement('css', 'tr.clientDetails th:nth-child(2)', null, a)
                    if (input !== fname + lname) {
                        return false
                    }
                }
                else {
                    let field = await this.selenium.getTextFromElement('css', `tr.clientDetails th:nth-child(${index})`, null, a)
                    field = field.split(" ").join("")
                    if (field.toLowerCase() !== input.toLowerCase()) {
                        return false
                    }
                }
            }
            return true
        }
        catch (error) {
            console.error(error)
        }
    }


    async clear(locatortype, locatorvalue) {
        await this.selenium.Sleep(2000)
        await this.selenium.clearElementField(locatortype, locatorvalue)
    }
}

module.exports = ClientsPage