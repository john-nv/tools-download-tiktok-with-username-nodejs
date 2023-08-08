const { url } = require("inspector");
const fs = require('fs');
const puppeteer = require("puppeteer-extra");
const stealthPlugin = require("puppeteer-extra-plugin-stealth")();
require('dotenv').config();

["chrome.runtime", "navigator.languages"].forEach(a =>
  stealthPlugin.enabledEvasions.delete(a)
);
puppeteer.use(stealthPlugin);

main();
async function main() {
  const browser = await puppeteer.launch({ headless: true }); // => default true
  const page = await browser.newPage();

  await page.evaluateOnNewDocument(() => {
    delete navigator.__proto__.webdriver;
  });

  //We stop images and stylesheet to save data
  await page.setRequestInterception(true);

  page.on('request', (request) => {
    if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
      request.abort();
    } else {
      request.continue();
    }
  })

  await page.goto(process.env.URL_USERNAME);
  let username = page.url().slice(23,).replace(/[-:.\/*<>|?]/g, "");
  if (username.length < 1) return console.log(' >>> NOT FOUND URL USERNAME <<< ')

  //scroll down until no more videos
  await autoScroll(page);

  const urls = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('div.tiktok-1qb12g8-DivThreeColumnContainer.eegew6e2 > div > div > div > a')).map((items) => {
      return items.href
    });
  });

  let videoDes = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('div.tiktok-1qb12g8-DivThreeColumnContainer.eegew6e2 > div > div > div > a')).map((items) => {
      return items.innerText;
    });
  });

  console.log(urls)
  console.log(videoDes)

  for (var i = videoDes.length; i--;) {
    videoDes[i] = videoDes[i] + "\r\n";
  };
  fs.appendFile('nameVideo.txt', videoDes + '', function (err) {
    if (err) throw err;
    console.log('Descriptions Saved!');
  });
  console.log('now it downloading ' + urls.length + ' video')
  for (var i = 0; i < urls.length; i++) {
    function getRandomNumber() {
      var random = Math.floor(Math.random() * (500 - 300 + 1)) + 300;
      return random;
    };
    function getHighNumber() {
      var random = Math.floor(Math.random() * (500 - 300 + 1)) + 1150;
      return random;
    };
    await page.waitForTimeout(getHighNumber());
    await page.goto('https://snaptik.app/');
    await page.waitForTimeout(getRandomNumber());

    await page.waitForSelector('input[name="url"]');
    await page.type('input[name="url"]', (urls[i]), { delay: 50 });
    let link = (urls[i]).slice(-19)
    await page.waitForTimeout(getRandomNumber());
    await page.click('.button-go');
    await page.waitForTimeout(getHighNumber());
    await page.waitForXPath('//*[@id="download"]/div/div[2]/a[1]');
    const featureArticle = (await page.$x('//*[@id="download"]/div/div[2]/a[1]'))[0];
    const text = await page.evaluate(el => {
      return el.href;
    }, featureArticle);
    var noWaterMark = text
    const content = decodeURIComponent(noWaterMark);


    const https = require('https');
    const ds = require('fs');

    const path = './' + username + '/';
    try {
      if (!ds.existsSync(path)) {
        ds.mkdirSync(path)
      }
    } catch (err) {
      console.error(err)
    }

    const request = https.get(content, function (response) {
      if (response.statusCode === 200) {
        console.log(link)
        var file = ds.createWriteStream(path + 'video-' + i + 'id-' + link + '.mp4');
        response.pipe(file);
        console.log(file.path + ' Saved!')

        const fs = require('fs');

        fs.appendFile('nameVideo.txt', file.path + "\r\n", function (err) {
          if (err) throw err;
          console.log('Done');
        });
      }
    });
    ;
  };


  browser.close();
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}