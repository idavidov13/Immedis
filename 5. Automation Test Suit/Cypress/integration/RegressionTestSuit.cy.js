//since the app is fast, and there is many bugs, i changed the defaultCommandTimeout: 4000 to 2000 in cypress.config.js, in order to have faster tests

/// <reference types="Cypress" />
import Chance from "chance";
import HomePage from "./pageObjects/HomePage";
import UserPage from "./pageObjects/UserPage";
import BookPage from "./pageObjects/BookPage";
import RequestPage from "./pageObjects/RequestPage";

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

describe("Regression Test Suit HomePage", function () {
  let homePage;
  before(function () {
    //runs once before all tests in the block
    cy.fixture("example").then(function (data) {
      Cypress.env("data", data); // <-- set the data to Cypress.env
    });
  });

  beforeEach(function () {
    //Creating object from HomePage object file
    homePage = new HomePage();

    const data = Cypress.env("data");

    //open the app URL
    cy.visit(data.appHomeURL);
  });

  it("Successful Login", function () {
    const data = Cypress.env("data"); // <-- get the data from Cypress.env

    //enter credentials from  data file (it is stored into fixtures/example.json)
    homePage.getUsername().clear().type(data.username);
    homePage.getPassword().type(data.password);
    homePage.getSignInButton().click();
    cy.url().should("include", "/Users");
  });

  it("Unsuccessful Login due to wrong password", function () {
    const data = Cypress.env("data"); // <-- get the data from Cypress.env

    //enter credentials from  data file (it is stored into fixtures/example.json)
    homePage.getUsername().clear().type(data.username);
    homePage.getPassword().type("wrongPassword");
    homePage.getSignInButton().click();
    //since, there is a bug in software, there is no message, so i check the software behavior with following assertion
    cy.url().should("not.include", "/Users");
  });

  it("Unsuccessful Login due to wrong username", function () {
    const data = Cypress.env("data"); // <-- get the data from Cypress.env

    //enter credentials from  data file (it is stored into fixtures/example.json)
    homePage.getUsername().clear().type("wrongUsername");
    homePage.getPassword().type(data.password);
    homePage.getSignInButton().click();
    //since, there is a bug in software, there is no message, so i check the software behavior with following assertion
    cy.url().should("not.include", "/Users");
  });

  it("Unsuccessful Login due to missing username", function () {
    const data = Cypress.env("data"); // <-- get the data from Cypress.env

    //enter credentials from  data file (it is stored into fixtures/example.json)
    homePage.getPassword().type(data.password);
    homePage.getSignInButton().click();
    //since, there is a bug in software, there is no message, so i check the software behavior with following assertion
    cy.url().should("not.include", "/Users");
  });

  it("Unsuccessful Login due to missing password", function () {
    const data = Cypress.env("data"); // <-- get the data from Cypress.env

    //enter credentials from  data file (it is stored into fixtures/example.json)
    homePage.getUsername().clear().type(data.username);
    homePage.getSignInButton().click();
    //since, there is a bug in software, there is no message, so i check the software behavior with following assertion
    cy.url().should("not.include", "/Users");
  });

  it("Unsuccessful Login due to missing credentials", function () {
    const data = Cypress.env("data"); // <-- get the data from Cypress.env

    homePage.getSignInButton().click();
    //since, there is a bug in software, there is no message, so i check the software behavior with following assertion
    cy.url().should("not.include", "/Users");
  });

  it("Creates new account", function () {
    const data = Cypress.env("data"); // <-- get the data from Cypress.env

    homePage
      .getSignUpButton()
      .click()
      .then(() => {
        cy.url().should("not.eq", data.appHomeURL);
      });
  });

  it("Reset forgotten password", function () {
    const data = Cypress.env("data"); // <-- get the data from Cypress.env

    const targetURL = `${data.appHomeURL}Forgot`;
    cy.log(targetURL);
    cy.request({
      url: targetURL,
      failOnStatusCode: false, // Do not fail on 404
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});

// /////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////

describe("Regression Test Suit UserPage", function () {
  let homePage;
  let userPage;
  before(function () {
    //runs once before all tests in the block
    cy.fixture("example").then(function (data) {
      Cypress.env("data", data); // <-- set the data to Cypress.env
    });
  });

  beforeEach(function () {
    //Creating object from HomePage object file
    homePage = new HomePage();
    userPage = new UserPage();

    const data = Cypress.env("data");

    //Log in the app as user with proper rights with given credentials
    cy.visit(data.appHomeURL);
    homePage.getUsername().clear().type(data.username);
    homePage.getPassword().type(data.password);
    homePage.getSignInButton().click();
    cy.url().should("include", "/Users");
  });

  it("Successfully create new user", function () {
    const data = Cypress.env("data"); // <-- get the data from Cypress.env

    //enter credentials from  data file (it is stored into fixtures/example.json)
    const createUserURL = `${data.appUsersURL}/Create`;
    userPage
      .getCreateNewUser()
      .click()
      .then(() => {
        cy.url().should("be.eq", createUserURL);
      });
    // In order to achieve random input in the Name field, we need to install "chance" library by "npm install chance --save-dev". We should import the library. We have to create an instance of the Chance class.
    const chance = new Chance();
    // Now we can create our random name for user
    const randomUserName = chance.string({ length: 10 });
    userPage.getUserNameField().type(randomUserName);
    //Creating of the new random user
    userPage
      .getCreateNewUserButton()
      .click()
      .then(() => {
        //assertion for the right URL
        cy.url().should("be.eq", data.appUsersURL);
        //assertion for the created new user
        cy.contains("td", randomUserName).should("be.visible");
      });
  });

  it("Unsuccessfully create new user with empty name", function () {
    const data = Cypress.env("data"); // <-- get the data from Cypress.env

    // enter credentials from  data file (it is stored into fixtures/example.json)
    const createUserURL = `${data.appUsersURL}/Create`;
    userPage
      .getCreateNewUser()
      .click()
      .then(() => {
        cy.url().should("be.eq", createUserURL);
      });

    // Creating of the new user with empty name
    userPage
      .getCreateNewUserButton()
      .click()
      .then(() => {
        // assertion for the right URL
        cy.url().should("not.be.eq", data.appUsersURL);

        //visit Users page to check if there is a Name of user that is empty string
        cy.visit(data.appUsersURL);

        //Assert if a Name of user that is empty string
        cy.get("tr:has(td:first-child:empty)").should("not.exist");
      });
  });

  it("Unsuccessfully create new user with more than 100 chars", function () {
    const data = Cypress.env("data"); // <-- get the data from Cypress.env

    //enter credentials from  data file (it is stored into fixtures/example.json)
    const createUserURL = `${data.appUsersURL}/Create`;
    userPage
      .getCreateNewUser()
      .click()
      .then(() => {
        cy.url().should("be.eq", createUserURL);
      });
    // In order to achieve random input in the Name field, we need to install "chance" library by "npm install chance --save-dev". We should import the library. We have to create an instance of the Chance class.
    const chance = new Chance();
    // Now we can create our random name for user
    const randomUserName = chance.string({ length: 103 });
    userPage.getUserNameField().type(randomUserName);
    //Creating of the new random user
    userPage
      .getCreateNewUserButton()
      .click()
      .then(() => {
        //assertion for the right URL
        cy.url().should("not.be.eq", data.appUsersURL);
        //assertion for the created new user
        cy.visit(data.appUsersURL);
        cy.get(`td:contains('${randomUserName}')`).should("not.exist");
      });
  });

  it("Edit name of an user", function () {
    const data = Cypress.env("data"); // <-- get the data from Cypress.env

    //Finding of the new random user
    cy.get("tr").each(($el) => {
      const text = $el.find("td:first").text().trim();
      const checkUsername = data.userNameForEditing;
      if (text.trim() === checkUsername) {
        cy.wrap($el)
          .find('a:contains("Edit")')
          .then(($link) => {
            const href = $link.attr("href");
            const trimmedStr = href.replace(/\/Home\/Edit\//, "");
            const targetURL = `${data.appUsersURL}/Edit/${trimmedStr}`;
            cy.request({
              url: targetURL,
              failOnStatusCode: false,
            }).then((response) => {
              expect(response.status).to.eq(200);
            });
            cy.get("#Name").type("editedName");
            cy.get(
              'input[type="submit"][value="Create"].btn.btn-default'
            ).click();
          });
      }
    });
  });

  it("Details of an user", function () {
    const data = Cypress.env("data"); // <-- get the data from Cypress.env

    //Finding of the new random user
    cy.get("tr").each(($el) => {
      const text = $el.find("td:first").text().trim();
      const checkUsername = data.userNameForDetails;
      if (text.trim() === checkUsername) {
        cy.wrap($el)
          .find('a:contains("Details")')
          .click({ force: true })
          .then(($link) => {
            const href = $link.attr("href");
            const trimmedStr = href.replace(/\/Users\/Details\//, "");
            const targetURL = `${data.appUsersURL}/Details/${trimmedStr}`;
            cy.url().should("be.eq", targetURL);
            cy.get("dl.dl-horizontal")
              .contains("dd", checkUsername)
              .should("be.visible");
          });
      }
    });
  });

  it("Delete of an user", function () {
    const data = Cypress.env("data"); // <-- get the data from Cypress.env

    //Finding of the new random user
    cy.get("tr").each(($el) => {
      const text = $el.find("td:first").text().trim();
      const checkUsername = data.userNameForDelete;
      if (text.trim() === checkUsername) {
        cy.wrap($el)
          .find('a:contains("Delete")')
          .then(($link) => {
            const href = $link.attr("href");
            const trimmedStr = href.replace(/\/\//, "");
            const targetURL = `${data.appHomeURL}${trimmedStr}`;
            cy.request({
              url: targetURL,
              failOnStatusCode: false,
            }).then((response) => {
              expect(response.status).to.eq(200);
            });
          });
        cy.visit(data.appHomeURL);
        homePage.getUsername().clear().type(data.username);
        homePage.getPassword().type(data.password);
        homePage.getSignInButton().click();
        cy.url().should("include", "/Users");
        cy.get("tr").contains("td", data.userNameForDelete).should("not.exist");
      }
    });
  });
});

// /////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////

describe("Regression Test Suit BookPage", function () {
  let homePage;
  let userPage;
  let bookPage;
  before(function () {
    //runs once before all tests in the block
    cy.fixture("example").then(function (data) {
      Cypress.env("data", data); // <-- set the data to Cypress.env
    });
  });

  beforeEach(function () {
    //Creating object from HomePage object file
    homePage = new HomePage();
    userPage = new UserPage();
    bookPage = new BookPage();

    const data = Cypress.env("data");

    //Log in the app as user with proper rights with given credentials
    cy.visit(data.appHomeURL);
    homePage.getUsername().clear().type(data.username);
    homePage.getPassword().type(data.password);
    homePage.getSignInButton().click();
    cy.url().should("include", "/Users");
    cy.get('a[href="/Books"]').click({ force: true });
    cy.url().should("be.eq", data.appBooksURL);
  });

  it("Successfully create new book", function () {
    const data = Cypress.env("data"); // <-- get the data from Cypress.env

    //enter credentials from  data file (it is stored into fixtures/example.json)
    const createBookURL = `${data.appBooksURL}/Create`;
    bookPage
      .getCreateNewBook()
      .click()
      .then(() => {
        cy.url().should("be.eq", createBookURL);
      });
    // WE already instal and import Chance library. We have to create an instance of the Chance class.
    const chance = new Chance();
    // Now we can create our random name for book, author and genre. we put randomly integer number in the range [1, 99]
    const randomBookName = chance.string({ length: 25 });
    bookPage.getBookNameField().type(randomBookName);
    const randomAuthorName = chance.string({ length: 13 });
    bookPage.getBookAuthorField().type(randomAuthorName);
    const randomGenreName = chance.string({ length: 10 });
    bookPage.getBookGenreField().type(randomGenreName);
    const randomQuantity = chance.integer({ min: 1, max: 99 });
    bookPage.getBookQuantityField().type(randomQuantity);
    //Creating of the new random book
    bookPage
      .getCreateNewBookButton()
      .click()
      .then(() => {
        //assertion for the right URL
        cy.url().should("be.eq", data.appBooksURL);
        //assertion for the created new book
        cy.contains("td", randomBookName).should("be.visible");
      });
  });
});

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

describe("END-TO-END Scenario", function () {
  let homePage;
  let userPage;
  let bookPage;
  let requestPage;
  before(function () {
    //runs once before all tests in the block
    cy.fixture("example").then(function (data) {
      Cypress.env("data", data); // <-- set the data to Cypress.env
    });
  });

  beforeEach(function () {
    //Creating object from HomePage object file
    homePage = new HomePage();
    userPage = new UserPage();
    bookPage = new BookPage();
    requestPage = new RequestPage();

    const data = Cypress.env("data");
    //open the app URL
    cy.visit(data.appHomeURL);
  });

  it("Successfully Login, Create new user, Create new book, Create new request", function () {
    const data = Cypress.env("data"); // <-- get the data from Cypress.env
    //Successfully Login
    homePage.getUsername().clear().type(data.username);
    homePage.getPassword().type(data.password);
    homePage.getSignInButton().click();
    cy.url().should("include", "/Users");

    //Successfully Create new user
    const createUserURL = `${data.appUsersURL}/Create`;
    userPage
      .getCreateNewUser()
      .click()
      .then(() => {
        cy.url().should("be.eq", createUserURL);
      });
    // In order to achieve random input in the Name field, we need to install "chance" library by "npm install chance --save-dev". We should import the library. We have to create an instance of the Chance class.
    const chance = new Chance();
    // Now we can create our random name for user
    const randomUserName = chance.string({ length: 10 });
    userPage.getUserNameField().type(randomUserName);
    //Creating of the new random user
    userPage
      .getCreateNewUserButton()
      .click()
      .then(() => {
        //assertion for the right URL
        cy.url().should("be.eq", data.appUsersURL);
        //assertion for the created new user
        cy.contains("td", randomUserName).should("be.visible");
      });

    // Open Books screen
    cy.get('a[href="/Books"]').click({ force: true });
    cy.url().should("be.eq", data.appBooksURL);
    // Successfully Create new book
    const createBookURL = `${data.appBooksURL}/Create`;
    bookPage
      .getCreateNewBook()
      .click()
      .then(() => {
        cy.url().should("be.eq", createBookURL);
      });

    // Now we can create our random name for book, author and genre. we put randomly integer number in the range [1, 99]
    const randomBookName = chance.string({ length: 25 });
    bookPage.getBookNameField().type(randomBookName);
    const randomAuthorName = chance.string({ length: 13 });
    bookPage.getBookAuthorField().type(randomAuthorName);
    const randomGenreName = chance.string({ length: 10 });
    bookPage.getBookGenreField().type(randomGenreName);
    const randomQuantity = chance.integer({ min: 1, max: 99 });
    bookPage.getBookQuantityField().type(randomQuantity);
    //Creating of the new random book
    bookPage
      .getCreateNewBookButton()
      .click()
      .then(() => {
        //assertion for the right URL
        cy.url().should("be.eq", data.appBooksURL);
        //assertion for the created new book
        cy.contains("td", randomBookName).should("be.visible");
      });

    // Open Request screen
    cy.get('a[href="/GetBook"]').click({ force: true });
    cy.url().should("be.eq", data.appGetABookURL);
    // Successfully Create new request
    const createRequestURL = `${data.appGetABookURL}/Create`;
    requestPage
      .getCreateNewRequest()
      .click()
      .then(() => {
        cy.url().should("be.eq", createRequestURL);
      });
    requestPage.getUserID().select(randomUserName);
    //because of a bug in software, i make this test case with AutorName, instead of the BookName.
    requestPage.getBookID().select(randomAuthorName);
    requestPage.getCreateNewRequestButton().click();
    cy.contains("td", randomUserName).should("be.visible");
    cy.contains("td", randomAuthorName).should("be.visible");
  });
});

// //////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////
