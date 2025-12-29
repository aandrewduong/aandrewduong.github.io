// Dark Mode Functionality
function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
  const icon = document.querySelector(".theme-toggle i");
  if (icon) icon.className = isDark ? "fas fa-sun text-xl" : "fas fa-moon text-xl";
}

// Active Link Highlighting
function updateActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('a.nav-link').forEach(link => {
    const linkPath = link.getAttribute('href');
    if (currentPath === linkPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('text-academic-link');
    } else {
      link.classList.remove('text-academic-link');
    }
  });
}

// Initialize Theme
(function() {
  const savedTheme = localStorage.getItem("theme");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = savedTheme === "dark" || (!savedTheme && systemDark);
  if (isDark) {
    document.documentElement.classList.add("dark");
    updateThemeIcon(true);
  }
})();

// Scroll Reveal Animation
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, observerOptions);

// Smooth Page Transition Logic
document.addEventListener('DOMContentLoaded', () => {
  // Initialize reveals
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  
  // Update nav
  updateActiveNavLink();

  const links = document.querySelectorAll('a.nav-link, a[href$=".html"]');
  const main = document.querySelector('main');

  if (!main) return;

  links.forEach(link => {
    link.addEventListener('click', e => {
      const destination = link.href;
      
      // Safety checks for external links, same-page hashes, new tabs, etc.
      const isInternal = link.hostname === window.location.hostname || !link.hostname;
      const isAnchor = link.hash !== '';
      const isNewTab = link.target === '_blank';
      const isModifier = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;

      if (!destination || !isInternal || isAnchor || isNewTab || isModifier) {
        return;
      }

      // Don't transition if it's the exact same page
      const currentUrl = window.location.href.split('#')[0].split('?')[0].replace(/\/$/, "");
      const targetUrl = destination.split('#')[0].split('?')[0].replace(/\/$/, "");
      
      if (currentUrl === targetUrl || currentUrl + "/index.html" === targetUrl || currentUrl === targetUrl + "/index.html") {
        return;
      }

      // Prevent default navigation
      e.preventDefault();
      
      // Trigger out-animations
      link.classList.add('tab-pulse');
      main.classList.add('fade-out');
      
      // Navigate after animation finishes (500ms to match CSS)
      setTimeout(() => {
        window.location.href = destination;
      }, 500);
    });
  });
});
