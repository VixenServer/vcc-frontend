const VCC_CONFIG = {
  API_BASE: 'https://vcc-backend-1be3.onrender.com',
  SITE_NAME: 'VCC Social Toolkit',
  CURRENCY: '৳',
  VERSION: '1.0.0'
};

const Auth = {
  getToken: () => localStorage.getItem('vcc_token'),
  getUser: () => JSON.parse(localStorage.getItem('vcc_user') || 'null'),
  setSession: (token, user) => {
    localStorage.setItem('vcc_token', token);
    localStorage.setItem('vcc_user', JSON.stringify(user));
  },
  clear: () => {
    localStorage.removeItem('vcc_token');
    localStorage.removeItem('vcc_user');
  },
  isLoggedIn: () => !!localStorage.getItem('vcc_token')
};

async function apiCall(endpoint, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = Auth.getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(VCC_CONFIG.API_BASE + endpoint, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function toast(msg, type = 'info') {
  const colors = { success: '#00ff9d', error: '#ff4466', info: '#00cfff', warn: '#ffcc00' };
  const t = document.createElement('div');
  t.style.cssText = `
    position:fixed; bottom:24px; right:24px; z-index:9999;
    background:#0a1520; border:1px solid ${colors[type]};
    border-left:3px solid ${colors[type]};
    color:${colors[type]}; padding:12px 20px;
    font-family:'Rajdhani',sans-serif; font-size:14px; font-weight:600;
    letter-spacing:1px; min-width:250px;
    animation: slideIn 0.3s ease;
  `;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

function requireLogin() {
  if (!Auth.isLoggedIn()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}
