class myHeader extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  // Simulação de estado (pode vir do localStorage ou uma API)
  /*
  isLoggedIn() {
    return localStorage.getItem('user_logged') === 'true';
  }

  login() {
    localStorage.setItem('user_logged', 'true');
    this.render(); // Re-renderiza para atualizar o botão
  }

  logout() {
    localStorage.setItem('user_logged', 'false');
    this.render();
  }
    */
    

  render() {
    //const logged = this.isLoggedIn();
    
    this.innerHTML = `
      <header style="color: white; padding: 1rem; display: flex; justify-content: space-between;">
        <a href="login.html">Login</a>
        <a href="createRecipe.html">create recipe</a>
      </header>
    `;

    // Adiciona os eventos após 
    /*
    const btn = logged ? this.querySelector('#logout-btn') : this.querySelector('#login-btn');
    btn.onclick = () => logged ? this.logout() : this.login();
    */
  }
}

// Regista a tag personalizada
customElements.define('my-header', myHeader);
