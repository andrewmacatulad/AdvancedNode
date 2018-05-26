const Page = require("./helpers/page");
const mongoose = require("mongoose");
const Blog = mongoose.model("Blog");

let page;

beforeEach(async () => {
  page = await Page.build();

  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await page.close();
});

describe("When logged in", async () => {
  beforeEach(async () => {
    await page.login();
    await page.click("a.btn-floating");
  });

  test("Can see blog create form", async () => {
    const label = await page.getContentsOf("form label");

    expect(label).toEqual("Blog Title");
  });

  describe("For valid inputs", async () => {
    beforeEach(async () => {
      await Blog.remove({ title: "Title 1" });
      await page.type(".title input", "Title 1");
      await page.type(".content input", "Content 1");

      await page.click("form button");
    });

    test("Submitting takes user to review screen", async () => {
      const text = await page.getContentsOf("h5");

      expect(text).toEqual("Please confirm your entries");
    });

    // This will check if the saving of blog post run well
    test("Submitting then saving adds blog to index page", async () => {
      await page.click("button.green");
      await page.waitFor(".card");

      const title = await page.getContentsOf(".card-title");
      const content = await page.getContentsOf("p");
      expect(title).toEqual("Title 1");
      expect(content).toEqual("Content 1");
    });
  });
  // For invalid inputs in form
  describe("And using invalid inputs", async () => {
    beforeEach(async () => {
      await page.click("form button");
    });
    test("the form shows an error message", async () => {
      const titleError = await page.getContentsOf(".title .red-text");
      const contentError = await page.getContentsOf(".content .red-text");

      expect(titleError).toEqual("You must provide a value");
      expect(contentError).toEqual("You must provide a value");
    });
  });
});

// If not logged in you can't create blog posts then check the errors
describe("When user is not logged in", async () => {
  const actions = [
    {
      method: "get",
      path: "/api/blogs"
    },
    {
      method: "post",
      path: "/api/blogs",
      data: {
        title: "Title 1",
        content: "Content 1"
      }
    }
  ];

  test("Blog related actions are prohibited", async () => {
    const results = await page.execRequests(actions);

    for (let result of results) {
      expect(result).toEqual({ error: "You must log in!" });
    }
  });

  /* Test before the refactor
  test("User cannnot create blog posts", async () => {
    const result = await page.post("/api/blogs", {
      title: "Title 1",
      content: "Content 1"
    });
    // const result = await page.evaluate(() => {
    //   return fetch("/api/blogs", {
    //     method: "POST",
    //     credentials: "same-origin",
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({ title: "Title 1", content: "Content 1" })
    //   }).then(res => res.json());
    // });

    expect(result).toEqual({ error: "You must log in!" });
  });

  test("User cannot get a list of posts", async () => {
    const result = await page.get("/api/blogs");
    // const result = await page.evaluate(() => {
    //   return fetch("/api/blogs", {
    //     method: "GET",
    //     credentials: "same-origin",
    //     headers: {
    //       "Content-Type": "application/json"
    //     }
    //   }).then(res => res.json());
    // });

    expect(result).toEqual({ error: "You must log in!" });
  });
  */
});
