class Greetings {
  english() {
    return "Fuck";
  }
  tagalog() {
    return "Gago";
  }
}

class MoreGreetings {
  russian() {
    return "Cyka Blat";
  }
  malays() {
    return "Pignoys";
  }
}
const greetings = new Greetings();
const moreGreetings = new MoreGreetings();

const allGreetings = new Proxy(moreGreetings, {
  get: function(target, property) {
    return target[property] || greetings[property];
  }
});

console.log(allGreetings.english());

class Page {
  goto() {
    console.log("Going to another page");
  }
  setCookie() {
    console.log("Setting a cookie");
  }
}

class CustomPage {
  static build() {
    const page = new Page();
    const customPage = new CustomPage(page);

    const superPage = new Proxy(customPage, {
      get: function(target, property) {
        return target[property] || page[property];
      }
    });
    return superPage;
  }
  constructor(page) {
    this.page = page;
  }

  login() {
    this.page.goto("localhost:3000");
    this.page.setCookie();
  }
}

// const buildPage = () => {
//   const page = new Page();
//   const customPage = new CustomPage(page);

//   const superPage = new Proxy(customPage, {
//     get: function(target, property) {
//       return target[property] || page[property];
//     }
//   });
//   return superPage;
// };

// buildPage()

const superPage = CustomPage.build();

superPage.login();
superPage.goto();
