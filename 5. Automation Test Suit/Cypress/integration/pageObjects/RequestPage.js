class RequestPage {
  getCreateNewRequest() {
    return cy.contains('a[href="/GetBook/Create"]', "Create New");
  }

  getUserID() {
    return cy.get("#UserId");
  }

  getBookID() {
    return cy.get("#BookId");
  }

  getCreateNewRequestButton() {
    return cy.get('input[type="submit"][value="Create"].btn.btn-default');
  }
}

export default RequestPage;
