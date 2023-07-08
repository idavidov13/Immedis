class HomePage {
  getUsername() {
    return cy.get('input[name="username"]');
  }

  getPassword() {
    return cy.get('input[name="password"]');
  }

  getSignInButton() {
    return cy.contains("div", "Sign In");
  }

  getSignUpButton() {
    return cy.contains("div", "Sign Up");
  }

  getForgottenPasswordHyperlink() {
    return cy.get('a[href="/Forgot"]');
  }
}

export default HomePage;
