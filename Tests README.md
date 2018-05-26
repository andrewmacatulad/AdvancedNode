# Launch test in chroma

    const browser = await puppeteer.launch({
      headless: false
    });

# WaitFor Statements

await page.waitFor("a[href='/auth/logout']");

const text = await page.$eval("a[href='/auth/logout']", el => el.innerHTML);

# GLOBAL JEST

# setup.js

require("../models/User");

const mongoose = require("mongoose");
const keys = require("../config/keys");

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true });

# package.json jest

"jest": {
"setupTestFrameworkScriptFile": "./tests/setup.js"
},

# Proxies

    return new Proxy(customPage, {
      get: function(target, property) {
        return customPage[property] || browser[property] || page[property];
      }
    });

# Reusable functions

async getContentsOf(selector) {
return this.page.$eval(selector, el => el.innerHTML);
}

# Bypass login Oauth in Jest test

# page.js

const sessionFactory = require("../factories/sessionFactory");
const userFactory = require("../factories/userFactory");
const puppeteer = require("puppeteer");

class CustomPage {
static async build() {
const browser = await puppeteer.launch({
headless: false
});

    const page = await browser.newPage();
    const customPage = new CustomPage(page);

    return new Proxy(customPage, {
      get: function(target, property) {
        return customPage[property] || browser[property] || page[property];
      }
    });

}
constructor(page) {
this.page = page;
}

async login() {
const user = await userFactory();
const { session, sig } = sessionFactory(user);

    await this.page.setCookie({ name: "session", value: session });
    await this.page.setCookie({ name: "session.sig", value: sig });
    await this.page.goto("localhost:3000");
    await this.page.waitFor("a[href='/auth/logout']");

}

async getContentsOf(selector) {
return this.page.$eval(selector, el => el.innerHTML);
}
}

# Test.js

const Page = require("./helpers/page");

let page;
beforeEach(async () => {
page = await Page.build();
await page.goto("localhost:3000");
});

afterEach(async () => {
await page.close();
});

await page.login();

const text = await page.getContentsOf("a[href='/auth/logout']");
expect(text).toEqual("Logout");

# Factory Function

# User factory

This user factory will get the user and save
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = () => {
return new User({}).save();
};

# Session factory

<!-- Keygrip and buffer so you can extract info just by getting the user id from passport -->

const Buffer = require("safe-buffer").Buffer;
const Keygrip = require("keygrip");
const keys = require("../../config/keys");
const keygrip = new Keygrip([keys.cookieKey]);

<!-- This will get the sessionobject from the passport which in this case the user id -->

module.exports = user => {
const sessionObject = {
passport: {
user: user.\_id.toString()
}
};

<!-- Now get the session by extracting from the user.id -->

const session = Buffer.from(JSON.stringify(sessionObject)).toString("base64");

<!-- This to get the session sig -->

const sig = keygrip.sign("session=" + session);

return { session, sig };
};

# Breakdown of logging in oauth test

<!-- The build is for creating a page -->

static async build() {

<!-- This is for launching the browser using puppeteer -->

    const browser = await puppeteer.launch({
      headless: false
    });

<!-- This will open a new browser for test -->

    const page = await browser.newPage();

<!-- This Custompage so you can use it on proxy and pass in properties etc -->

    const customPage = new CustomPage(page);

<!-- This is the proxy it will pass in the customPage as the target -->

    return new Proxy(customPage, {
      get: function(target, property) {

<!-- First check in the customPage if there is a property in the customPage -->

<!-- If no property there search the browser from the puppeteer properties -->

<!-- Last if the first two didn't have the property you are searching for use the page -->

        return customPage[property] || browser[property] || page[property];
      }
    });

}

<!-- The constructor so you will not use this.page everytime -->

constructor(page) {
this.page = page;
}

<!-- This will be the function so you can call it page.login in the test.js -->

async login() {

<!-- Get the user from the userFactory and the sessesions and sig in the sessionfactory -->

    const user = await userFactory();
    const { session, sig } = sessionFactory(user);

<!-- This will set the session cookie on the browser you are testing -->

    await this.page.setCookie({ name: "session", value: session });

<!-- This will set the session sig cookie on the browser you are testing -->

    await this.page.setCookie({ name: "session.sig", value: sig });

<!-- This will set the url of the browser you going to go -->

    await this.page.goto("localhost:3000");

<!-- The waitfor is for the logout property first before the testing will begin -->

    await this.page.waitFor("a[href='/auth/logout']");

}

<!-- Reusable function so you can set html commands easy -->

async getContentsOf(selector) {
return this.page.$eval(selector, el => el.innerHTML);
}

# SET TIMEOUT

jest.setTimeout(30000);

# YML TO JSON

<!-- YML -->

color: 'red'
languagesIKnow:
english: Very well
tagalog: Very well
CountToFive: - 1 - 2 - 3 - 4

<!-- JSON -->

{
"color": "red",
"languagesIKnow": {
"english": "Very well",
"tagalog": "Very well"
},
"CountToFive": [
1,
2,
3,
4
]
}

# .travis.yml Setup

language: node_js
node_js:

* "8"
  dist: trusty
  services:
  -mongodb
  -redis-server
  env:
* NODE_ENV=ci
