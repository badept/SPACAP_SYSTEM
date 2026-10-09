(function () {
  'use strict';

  const AUTH_KEY = 'acacyOneAuthenticated';
  const LOGIN_PAGE = 'login.html';

  const hasSession = () => window.name === AUTH_KEY
    || sessionStorage.getItem(AUTH_KEY) === 'true'
    || localStorage.getItem(AUTH_KEY) === 'true';

  const currentFile = () => window.location.pathname.split('/').pop() || 'index.html';
  const isLoginPage = currentFile().toLowerCase() === LOGIN_PAGE;

  if (!isLoginPage) {
    if (!hasSession()) {
      const destination = currentFile() + window.location.search + window.location.hash;
      window.location.replace(`${LOGIN_PAGE}?next=${encodeURIComponent(destination)}`);
      return;
    }

    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('[data-logout]').forEach(button => {
        button.addEventListener('click', () => {
          if (window.name === AUTH_KEY) window.name = '';
          sessionStorage.removeItem(AUTH_KEY);
          localStorage.removeItem(AUTH_KEY);
          window.location.assign(LOGIN_PAGE);
        });
      });
    });
    return;
  }

  const translations = {
    vi: {
      story: 'Một cổng truy cập duy nhất cho các sản phẩm số Acacy — từ hệ thống vận hành đến hệ thống phân tích kinh doanh.',
      support: 'Hỗ trợ kỹ thuật',
      welcome: 'Chào mừng đến với Acacy ONE',
      description: 'Đăng nhập một lần để truy cập các dự án, hệ thống, dashboard và sản phẩm số được cấp quyền.',
      login: 'Đăng nhập với Acacy ID',
      continue: 'Tiếp tục vào Acacy ONE',
      remember: 'Ghi nhớ thiết bị này',
      forgot: 'Quên mật khẩu?',
      privacy: 'Chính sách bảo mật',
      terms: 'Điều khoản sử dụng',
      technical: 'Hỗ trợ kỹ thuật',
      loading: 'Đang mở Acacy ONE…'
    },
    en: {
      story: 'The single gateway to access Acacy digital products — from operational systems to business intelligence systems.',
      support: 'Technical support',
      welcome: 'Welcome to Acacy ONE',
      description: 'Sign in once to access your authorized projects, systems, dashboards, and digital products.',
      login: 'Login with Acacy ID',
      continue: 'Continue to Acacy ONE',
      remember: 'Remember this device',
      forgot: 'Forgot password?',
      privacy: 'Privacy Policy',
      terms: 'Terms of Use',
      technical: 'Technical Support',
      loading: 'Opening Acacy ONE…'
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    const rememberDevice = document.getElementById('remember-device');
    const loginMessage = document.getElementById('login-message');
    let currentLanguage = localStorage.getItem('acacyOneLanguage') || 'vi';

    const getDestination = () => {
      const requestedPage = new URLSearchParams(window.location.search).get('next');
      if (!requestedPage) return 'index.html';
      const isLocalPage = /^[a-z0-9._-]+\.html(?:[?#][a-z0-9=&%_#.-]*)?$/i.test(requestedPage)
        && !requestedPage.includes('..');
      return isLocalPage ? requestedPage : 'index.html';
    };

    const applyLanguage = language => {
      currentLanguage = translations[language] ? language : 'vi';
      document.documentElement.lang = currentLanguage;
      localStorage.setItem('acacyOneLanguage', currentLanguage);

      document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.dataset.i18n;
        if (translations[currentLanguage][key]) element.textContent = translations[currentLanguage][key];
      });

      document.querySelectorAll('[data-language]').forEach(button => {
        const isActive = button.dataset.language === currentLanguage;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });

      if (hasSession()) loginButton.querySelector('span').textContent = translations[currentLanguage].continue;
    };

    document.querySelectorAll('[data-language]').forEach(button => {
      button.addEventListener('click', () => applyLanguage(button.dataset.language));
    });

    loginButton.addEventListener('click', () => {
      loginButton.disabled = true;
      loginButton.classList.add('loading');
      loginButton.querySelector('span').textContent = translations[currentLanguage].loading;
      loginMessage.textContent = translations[currentLanguage].loading;

      if (rememberDevice.checked) {
        localStorage.setItem(AUTH_KEY, 'true');
        sessionStorage.removeItem(AUTH_KEY);
      } else {
        sessionStorage.setItem(AUTH_KEY, 'true');
        localStorage.removeItem(AUTH_KEY);
      }

      // window.name keeps the session alive when these static files are opened
      // directly with file://, where browser storage can be isolated per file.
      window.name = AUTH_KEY;

      window.setTimeout(() => window.location.assign(getDestination()), 450);
    });

    applyLanguage(currentLanguage);
  });
}());
