const {Builder, By, Key, until} = require('selenium-webdriver');

module.exports = async function fetchData(hkod) {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    await driver.get('https://iett.istanbul/RouteDetail?hkod='+hkod);
    let element = await driver.findElement(By.xpath('/html'));
    let text = await element.getAttribute('innerHTML');
    return text;
  } finally {
    await driver.quit();
  }
};