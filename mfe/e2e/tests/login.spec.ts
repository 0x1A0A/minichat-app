import { NightwatchAPI, NightwatchTests } from "nightwatch";

const URL = "http://localhost:3000";

const home: NightwatchTests = {
  "Login Successful": async () => {
    await browser
      .url(URL)
      .setValue("[placeholder='Username']", "nightwatch")
      .perform(function (this: NightwatchAPI) {
        const actions = this.actions({ async: true });

        return actions.keyDown(this.Keys["ENTER"]).keyUp(this.Keys["ENTER"]);
      })
      .assert.visible("nav")
      .end();
  },

  "Login and Logout": async () => {
    await browser
      .url(URL)
      .setValue("[placeholder='Username']", "nightwatch")
      .perform(function (this: NightwatchAPI) {
        const actions = this.actions({ async: true });

        return actions.keyDown(this.Keys["ENTER"]).keyUp(this.Keys["ENTER"]);
      })
      .assert.visible("nav")
      .click("[data-testid='user-icon']")
      .element.findByText("Logout")
      .click();

    await browser.element.findByText("Login").assert.visible();

    await browser.end();
  },
};

export default home;
