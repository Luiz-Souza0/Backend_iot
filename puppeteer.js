const puppeteer = require('puppeteer');

async function getTemperatureFromWeb() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.bbc.com/weather/3451190');
    
    // Get the temperature data from the page
    const temperature = await page.evaluate(() => {
        return document.querySelector('.wr-value--temperature--c').innerText;
    });
    
    await browser.close();
    
    // Return the temperature data
    return temperature;
}

module.exports = { getTemperatureFromWeb };
