export const getLoginTemplate = () => {
  return `
    <div class="bg">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
        <div class="shape shape-5"></div>
      </div>
    </div>

    <div class="login-container">
      <div class="login-card">
        <div class="card-decoration">
          <div class="deco-line line-1"></div>
          <div class="deco-line line-2"></div>
          <div class="deco-line line-3"></div>
        </div>
        
        <div class="login-header">
          <div class="logo">
            <img src="https://learn.reboot01.com/assets/img/logo.png" alt="Reboot01 Logo" style="width: 80px; height: auto;">
          </div>
          <h2>GraphQL</h2>
          <p>Your academic command center</p>
        </div>
        
        <form class="login-form" id="login-form">
          <div class="form-group">
            <div class="input-wrapper">
              <div class="input-decoration"></div>
              <input type="text" id="identifier" name="identifier" required autocomplete="username">
              <label for="identifier">Username or Email</label>
            </div>
          </div>

          <div class="form-group">
            <div class="input-wrapper password-wrapper">
              <div class="input-decoration"></div>
              <input type="password" id="password" name="password" required autocomplete="current-password">
              <label for="password">Password</label>
              <button type="button" class="password-toggle" id="passwordToggle" aria-label="Toggle password visibility">
                <span class="toggle-icon"></span>
              </button>
            </div>
            <span class="error-message" id="login-error"></span>
          </div>

          <div class="form-options">
            <a href="https://learn.reboot01.com/?action=forgot-password" class="forgot-password">Forgot password?</a>
          </div>

          <button type="submit" class="login-btn">
            <span class="btn-bg"></span>
            <span class="btn-text">Login</span>
            <span class="btn-loader">
              <div class="loader-dot dot-1"></div>
              <div class="loader-dot dot-2"></div>
              <div class="loader-dot dot-3"></div>
            </span>
          </button>
        </form>
      </div>
    </div>
  `;
}

export const getProfileTemplate = () => {
  return `
    <header class="main-header">
        <div class="header-left">
            <img src="https://learn.reboot01.com/assets/img/logo.png" alt="Logo" class="header-logo">
            <span id="header-title" class="header-title">GraphQL Intra Dashboard</span>
        </div>
        <button id="logout" class="logout-btn">Logout</button>
    </header>

    <section id="profile-section">
      <div class="welcome-message-card card">
          <div class="welcome-content">
              <div class="welcome-text">
                  <h1 id="login-name" class="welcome-title">Welcome, Yousif Muhammad</h1>
                  <p class="welcome-subtitle">
                      Analyze your Statistics, monitor your Skill Progress, and review your XP graph.
                  </p>
              </div>
              
              <div class="welcome-nav-container">
                  <span class="nav-label">Quick Navigation</span>
                  <div class="welcome-nav">
                      <button class="nav-btn btn-stats">Statistics</button>
                      <button class="nav-btn btn-progress">Skill Progress</button>
                      <button class="nav-btn btn-graphs">XP Graph</button>
                  </div>
              </div>
          </div>
      </div>

      <div id="stats-summary" class="card blended-info-card">
          <div class="blended-grid">
              <div class="blended-column">
                  <div class="stat-content-wrapper">
                      <span class="blended-label">Current Level</span>
                      <span id="display-level" class="blended-value-hero loading-text">Loading...</span>
                  </div>
              </div>

              <div class="blended-column">
                  <div class="stat-content-wrapper">
                      <span class="blended-label">Current Rank</span>
                      <div class="rank-container">
                          <span id="display-rank" class="blended-rank loading-text">Loading...</span>
                          <span id="rank-progress" class="rank-subtext loading-text">Loading...</span>
                      </div>
                  </div>
              </div>

              <div class="blended-column">
                  <div class="stat-content-wrapper">
                      <span class="blended-label">Audit Ratio</span>
                      <span id="display-ratio" class="blended-value-large gold-text loading-text">Loading...</span>
                      <div class="ratio-bar-wrapper">
                          <p id="ratio-message" class="ratio-hint">Gathering data...</p>
                      </div>
                  </div>
              </div>

              <div class="blended-column">
                  <div class="stat-content-wrapper">
                      <div class="milestone-icon">🏆</div>
                      <div class="detail-text">
                          <span class="blended-label">Last Victory</span>
                          <span id="display-last-project" class="detail-val loading-text">Loading...</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <div id="skills-section" class="card blended-info-card">
        <div class="skill-header">
            <h2 class="blended-label" style="text-align: center; width: 100%; margin-bottom: 4vh;">Skill Progress</h2>
        </div>
        <div id="radar-container" class="skills-flex-container">
            <div class="loading-text">Synchronizing Skill Tree...</div>
        </div>
      </div>

      <div id="xp-timeline-section" class="card blended-info-card">
          <div class="skill-header">
              <h2 class="blended-label" style="text-align: center;">XP Graph</h2>
              <div class="slider-container" style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 20px;">
                  <span class="blended-label" style="font-size: 12px; opacity: 0.7;">Date Points:</span>
                  <input type="range" id="date-density-slider" min="2" max="8" value="4" step="1" style="cursor: pointer;">
                  <span id="slider-val" class="blended-label" style="font-size: 12px; color: #ffbc00;">4</span>
              </div>
          </div>
          <div id="xp-graph-container">
              <div class="loading-text">Generating Timeline...</div>
          </div>
      </div>
    </section>
  `;
}
