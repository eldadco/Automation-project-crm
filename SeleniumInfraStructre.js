
const { Builder, By, Key, until } = require('selenium-webdriver');

const path = require('chromedriver').path;

const chrome = require('selenium-webdriver/chrome');
let service = new chrome.ServiceBuilder(path).build();
chrome.setDefaultService(service);

class seleniumInfra {
    constructor(logger) {
        this.driver = new Builder().forBrowser('chrome').build(); 
        this.logger = logger
    }
    async getURL(Url) {
        await this.driver.get(Url)
        await this.driver.manage().window().maximize()
        await this.driver.sleep(3000)
    }
    async URLvalidation(pageName) {
        try {
            console.log(await this.driver.wait(until.urlContains(pageName.toLowerCase()), 8000))
           
            console.log("Test pass Url is valid")
            this.logger.debug("Test pass Url is valid")
            return true
        } catch (error) {
            console.log(error);
                console.log("Test failed Url is not valid")
                this.logger.error("Test failed Url is not valid")
                return false 
        }
    }

    async isElementExists(locatorType, locatorValue) {
        try {
            let element = await this.findEelem(locatorType, locatorValue)
            if (element) {
                return await true
            }
            else {
                throw "element is not defined "
            }
        }
        catch (error) {
            console.error(error)

            return await false
        }


    }


    async findEelem(LocatorType, LocatorValue, fromElement = this.driver) {
        try {
            let element = await fromElement.findElement(By[LocatorType](LocatorValue))
            return element
        }
        catch (error) {
            console.log(`element can not found with locatorType: ${LocatorType} and ${LocatorValue}`)
            this.logger.error(`element can not found with locatorType: ${LocatorType} and ${LocatorValue}`)        
        }
    }

    async findElementListBy(locatorType, locatorValue, fromElement = this.driver) {
        try {
            let elements = await fromElement.findElements(By[locatorType](locatorValue))
            return await elements
        }
        catch (error) {
            console.error(`${error} can not find elements of locatorType: ${locatorType} and locatorValue: ${locatorValue}`)
            this.logger.error(`${error} can not find elements of locatorType: ${locatorType} and locatorValue: ${locatorValue}`)
        }
    }



    async clickElement(locatorType, locatorValue, elem, fromElement = this.driver) {
      
        let element
        try {
            if (elem) {
                this.driver.sleep(2000)
                await elem.click()
            }
            else {
                element = await this.findEelem(locatorType, locatorValue, fromElement)
               this.driver.sleep(2000)
                await element.click()
                console.log('Clicked on element with ' + locatorType + " == " + locatorValue)
                this.logger.debug('Clicked on element with ' + locatorType + " == " + locatorValue)
            }
            await this.driver.sleep(2000)

        }
        catch (error) 
        {
            console.error('Got error while trying to click on element with ' + locatorType + " : " + locatorValue)
            this.logger.error('Got error while trying to click on element with ' + locatorType + " : " + locatorValue)
        }

    }
    async getTextFromElement(locatorType, locatorValue, elem, fromElement = this.driver) {
        let text
        try {
            if (elem) {
                text = await elem.getText()
                return await text
            }

            else {
                let element = await this.findEelem(locatorType, locatorValue, fromElement)
                text = await element.getText()
                return text

            }
        }

        catch (error) {
            console.error("can not get text from element " + error)
             this.logger.error("can not get text from element " + error)   

        }


    }

    async write(data, locatorType, locatorValue, element, fromElement) {
        try {
            if (element) {
                
                await element.sendKeys(data)


            }
            else {
                let elem = await this.findEelem(locatorType, locatorValue, fromElement)
                await elem.sendKeys(data)

            }

            console.log(`${data} has written into the input`)
            this.logger.debug(`${data} has written into the input`)
        }
        catch (error) {
            console.error("can not send keys" +error)
            this.logger.error("can not send keys" +error)



        }
    }

    async clearElementField(locatorType, locatorValue, element, fromElement) {
        try {
            if (element) {
                await element.clear()
                return
            }
            let elem = await this.findEelem(locatorType, locatorValue, fromElement)
            if (elem) {
                await elem.clear()
                return
            }
            else {
                throw "error - can not clear unexist element"
            }
        }
        catch (error) {
            console.error(error)
        }
    }
    async Sleep(n)
    {
       await this.driver.sleep(n)
    }



    async close() {
        await this.driver.quit()
        console.log("The page quit")
        this.logger.info("The page quit")
    }


}


module.exports = seleniumInfra