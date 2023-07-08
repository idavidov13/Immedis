class BookPage {
  getCreateNewBook() {
    return cy.contains('a[href="/Books/Create"]', "Create New");
  }

  getBookNameField() {
    return cy.get("#Name");
  }

  getBookAuthorField() {
    return cy.get("#Author");
  }
  getBookGenreField() {
    return cy.get("#Genre");
  }
  getBookQuantityField() {
    return cy.get("#Quontity");
  }

  getCreateNewBookButton() {
    return cy.get('input[type="submit"][value="Create"].btn.btn-default');
  }
}

export default BookPage;
