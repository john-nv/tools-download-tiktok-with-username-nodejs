```
The tools can be further developed in different branches, and there may be significant or minor changes to it.
```

# Step to step
### Setup project
```
git clone https://github.com/john-nv/tools-download-tiktok-with-username-nodejs.git
cd tools-download-tiktok-with-username-nodejs
npm i
```
### what to do

```
├── @username         <= system automatically generates based on (list video download)
├── index.js
├── nameVideo.txt     <= auto save title video
├── package.json
├── package-lock.json
├── .env              <= change url for you
└── readme.txt
```

change the url inside the .env file

```
URL_USERNAME='url for you'
```

### start tool

```
node index.js 
```

see progress in browser

Default is off => ```({ headless: true })```

if you want to see leave it as false

```
const browser = await puppeteer.launch({ headless: true });
```