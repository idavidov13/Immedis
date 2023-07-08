class UserPage {
  getCreateNewUser() {
    return cy.contains('a[href="/Users/Create"]', "Create New");
  }

  getUserNameField() {
    return cy.get("#Name");
  }

  getCreateNewUserButton() {
    return cy.get('input[type="submit"][value="Create"].btn.btn-default');
  }
}

export default UserPage;
