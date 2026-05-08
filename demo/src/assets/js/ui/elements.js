class myHeader extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  isLoggedIn() {
    return localStorage.getItem('user_logged') === 'true';
  }

  logout() {
    localStorage.removeItem('user_logged');
    this.render();
  }

  render() {
    const logged = this.isLoggedIn();

    this.innerHTML = `
      <header style="padding: 1rem; display: flex; justify-content: space-between; align-items: center;">
        
        <div>
          ${
            logged
              ? `<a href="explore.html" id="logo" style="font-family: Roboto; color: #FF7A00; font-weight: bold; font-size: 1.5em">PratoFácil</a>`
              : `<a href="login.html">Login</a>`
          }
        </div>

        <div style="display: flex; gap: 15px; align-items: center;">
          
          <a href="createRecipe.html" title="Create Recipe">
            <i data-lucide="plus"></i>
          </a>

          ${
            logged
              ? `<button id="logout-btn" title="Logout">
                   <i data-lucide="log-out"></i>
                 </button>`
              : ''
          }

        </div>
      </header>
    `;

    lucide.createIcons();

    if (logged) {
      this.querySelector('#logout-btn').onclick = () => this.logout();
    }
  }
}

customElements.define('my-header', myHeader);

class myLogo extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <div>
        <p id="logo">PratoFácil</p>
      </div>
    `;

  }
}

customElements.define('my-logo', myLogo);

class myFooter extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <footer style="
        background-color: #333333;
        color: #FFFFFF;
        text-align: center;
        padding: 30px 20px;
        margin-top: 50px;
        border-top: 3px solid #FF7A00;
        font-family: Roboto, sans-serif;
        line-height: 1.7;
      ">
        <p style="margin: 0; font-size: 1em; font-weight: 600;">
          © 2026 MasterChefAOA
        </p>

        <p style="margin: 10px 0 0; font-size: 0.95em;">
          This project is open-source and licensed under the
          <a 
            href="https://opensource.org/licenses/MIT"
            target="_blank"
            style="color: #FF7A00; text-decoration: none; font-weight: 600;"
          >
            MIT License
          </a>.
        </p>

        <p style="margin: 8px 0 0; font-size: 0.95em;">
          This website is only a demo version.
          View the real project here:
          <a 
            href="https://github.com/costa-chilaladev/PratoFacil.git"
            target="_blank"
            style="color: #FF7A00; text-decoration: none; font-weight: 600;"
          >
            GitHub Repository
          </a>
        </p>
      </footer>
    `;
  }
}

customElements.define('my-footer', myFooter);

