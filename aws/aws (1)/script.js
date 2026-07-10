/* DevVista — Home Page JS + Enhanced 8-Step Wizard Engine */
'use strict';

// ── TEMPLATE DATA ────────────────────────────────────────────────────────────
const TEMPLATES = [
  { id: 't1', name: 'NEXUS', cls: 'nexus', badge: 'DEVELOPER', for: 'Cloud & DevOps Professionals',
    desc: 'Technical powerhouse for cloud engineers. System architecture diagrams, Terraform snippets, certification showcase, and 5 color themes.',
    feats: ['System Architecture Diagrams', 'Terraform IaC Code Generator', '5 Professional Color Themes', 'Interactive Skills Radar Chart'], path: 't1/', thumb: 't1_thumb.png' },
  { id: 't2', name: 'FORGE', cls: 'forge', badge: 'CREATIVE', for: 'Software Developers',
    desc: 'Developer-native portfolio with terminal animations, JSON code-block skills, GitHub repo-card projects, and IDE dark aesthetic.',
    feats: ['Terminal Console Hero Animation', 'JSON Syntax-Highlighted Skills', 'GitHub-Style Repo Cards', '4 Color Theme Variants'], path: 't2/', thumb: 't2_thumb.png' },
  { id: 't3', name: 'PRISM', cls: 'prism', badge: 'BUSINESS', for: 'Freelancers & Consultants',
    desc: 'Light, conversion-focused template for client-facing professionals. Services grid, portfolio gallery, testimonials, and CTA contact.',
    feats: ['Clean Light Professional Theme', 'Services & Testimonials Sections', 'Client Portfolio Gallery', 'Project Type & Budget Selector'], path: 't3/', thumb: 't3_thumb.png' }
];

const FEATURES = [
  { i: 'fas fa-mouse-pointer', t: 'No Coding Required', d: 'Fill in a guided form with your info, skills, and projects. No HTML or CSS knowledge needed.' },
  { i: 'fas fa-paint-brush', t: 'Built-In Theme Switcher', d: 'Every template ships with multiple colour variants — switch themes without touching a single line of code.' },
  { i: 'fas fa-cloud-upload-alt', t: 'Static Web Hosting', d: 'Optimised for fast static web hosts. Upload your portfolio and go live globally in minutes.' },
  { i: 'fas fa-bolt', t: 'Instant Live Preview', d: 'See your changes reflected in real-time as you fill in the data entry wizard before launching.' },
  { i: 'fas fa-mobile-alt', t: 'Mobile-First Responsive', d: 'Fluid layouts that look perfect on every screen — from 320px phones to 4K displays.' },
  { i: 'fas fa-envelope', t: 'Interactive Contact Form', d: 'Contact forms connect to your custom API or backend endpoint for real email delivery.' }
];

const THEME_COLORS = [
  { name: 'Blue', value: '#2563eb' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Violet', value: '#7c3aed' },
  { name: 'Rose', value: '#e11d48' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Orange', value: '#ea580c' },
  { name: 'Pink', value: '#db2777' },
];

// ── Utility ───────────────────────────────────────────────────────────────────
function esc(s) {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── Auth Navigation & Actions ───────────────────────────────────────────────
function renderAuthNav() {
  const container = document.getElementById('authNav');
  if (!container) return;
  const userStr = localStorage.getItem('devvista_user');
  if (userStr) {
    try {
      const u = JSON.parse(userStr);
      container.innerHTML = `
        <span class="user-badge" style="color:var(--t);font-size:.85rem;font-weight:600;display:inline-flex;align-items:center;gap:6px">
          <i class="fas fa-user-circle" style="color:var(--p)"></i> ${esc(u.name)}
        </span>
        <a href="#" onclick="logoutUser(event)" class="nav-logout" style="color:var(--m);font-size:.83rem;margin-left:8px"><i class="fas fa-sign-out-alt"></i> Logout</a>
      `;
    } catch (e) {
      localStorage.removeItem('devvista_user');
    }
  } else {
    container.innerHTML = `
      <a href="login.html?redirect=index.html" class="nav-login" style="color:var(--t);font-size:.85rem;font-weight:600"><i class="fas fa-sign-in-alt"></i> Sign In</a>
    `;
  }
}
window.renderAuthNav = renderAuthNav;

function logoutUser(e) {
  e.preventDefault();
  localStorage.removeItem('devvista_user');
  renderAuthNav();
  toast('👋 Logged out successfully');
}
window.logoutUser = logoutUser;

// ── Standalone HTML Builder ──────────────────────────────────────────────────
async function downloadStandaloneHTML() {
  const tpl = TEMPLATES.find(t => t.id === W.tplId);
  if (!tpl) return;
  try {
    const res = await fetch(tpl.path + 'index.html');
    if (!res.ok) throw new Error('Could not fetch template file.');
    let html = await res.text();
    
    // Normalize and serialize data for injection
    const mapped = {
      ...W.data,
      skills:         W.data.skills.filter(s => s.name).map(s => ({ name: s.name, level: s.level, icon: _icon(s.name), cat: _cat(s.name) })),
      experience:     W.data.experience.filter(e => e.company),
      education:      W.data.education.filter(e => e.degree),
      certifications: W.data.certifications.filter(c => c.name),
      projects:       W.data.projects.filter(p => p.name),
      template:       W.tplId
    };

    // Inject data directly into template local storage loader replacement
    const jsonStr = "'" + JSON.stringify(mapped).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
    html = html.replace(/localStorage\.getItem\(['"]devvista_data['"]\)/g, jsonStr);
    
    // Trigger download
    const blob = new Blob([html], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `portfolio_${(W.data.name || 'devvista').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast('💾 Standalone portfolio downloaded!');
  } catch (e) {
    toast('❌ Error building standalone: ' + e.message);
  }
}
window.downloadStandaloneHTML = downloadStandaloneHTML;

// ── RENDER HOME PAGE ──────────────────────────────────────────────────────────

// -- Template Preview Mockups
function tplPreview(id) {
  if (id === 't1') return [
    '<div class="mk-term">',
    '  <div class="mk-bar">',
    '    <span class="mk-dot" style="background:#ff5f57"></span>',
    '    <span class="mk-dot" style="background:#febc2e"></span>',
    '    <span class="mk-dot" style="background:#28c840"></span>',
    '    <span class="mk-bar-lbl">~/portfolio -- bash</span>',
    '  </div>',
    '  <div class="mk-body">',
    '    <div class="mk-tline"><span class="mk-gt">&gt;</span> <span class="mk-cmd">whoami</span></div>',
    '    <div class="mk-tname">YOUR NAME</div>',
    '    <div class="mk-tline"><span class="mk-attr">role:</span> <span class="mk-str">"Cloud Developer|"</span></div>',
    '    <div class="mk-tsocs"><span class="mk-tsoc"><i class="fab fa-github"></i> GitHub</span><span class="mk-tsoc">in</span><span class="mk-tsoc">Email</span></div>',
    '    <div class="mk-tbtn-row"><span class="mk-tbtn">View Projects</span> <span class="mk-tbtn" style="background:rgba(255,255,255,.07);color:#94a3b8">Contact</span></div>',
    '  </div>',
    '</div>'
  ].join('');
  if (id === 't2') return [
    '<div class="mk-forge">',
    '  <div class="mk-bar mk-bar-gh">',
    '    <span class="mk-dot" style="background:#30363d"></span>',
    '    <span class="mk-dot" style="background:#30363d"></span>',
    '    <span class="mk-dot" style="background:#30363d"></span>',
    '    <span class="mk-bar-lbl" style="color:#58a6ff;margin-left:8px">github.com/dev</span>',
    '  </div>',
    '  <div class="mk-body">',
    '    <div class="mk-gh-user"><div class="mk-gh-avatar"></div><div><div class="mk-gh-name">yourname</div><div class="mk-gh-sub">Software Developer</div></div></div>',
    '    <div class="mk-gh-repos">',
    '      <div class="mk-gh-repo"><span class="mk-rdot" style="background:#f1e05a"></span>portfolio-app<span class="mk-rstar">42</span></div>',
    '      <div class="mk-gh-repo"><span class="mk-rdot" style="background:#3178c6"></span>api-toolkit<span class="mk-rstar">18</span></div>',
    '    </div>',
    '    <div class="mk-contrib-row">' + Array(24).fill(0).map(function() {
        return '<span class="mk-contrib" style="background:rgba(57,211,83,' + (Math.random()*.85+.1).toFixed(2) + ')"></span>';
      }).join('') + '</div>',
    '  </div>',
    '</div>'
  ].join('');
  return [
    '<div class="mk-prism">',
    '  <div class="mk-prism-hd">',
    '    <div class="mk-prism-av"></div>',
    '    <div><div class="mk-prism-nm">YOUR NAME</div><div class="mk-prism-ttl">Freelancer &amp; Consultant</div></div>',
    '  </div>',
    '  <div class="mk-prism-tags"><span>UI/UX</span><span>Strategy</span><span>Branding</span></div>',
    '  <div class="mk-prism-services">',
    '    <div class="mk-prism-svc"><i class="fas fa-check" style="color:#0d9488;font-size:.55rem"></i> Web Design</div>',
    '    <div class="mk-prism-svc"><i class="fas fa-check" style="color:#0d9488;font-size:.55rem"></i> Consulting</div>',
    '  </div>',
    '  <div class="mk-prism-cta">Get in Touch</div>',
    '</div>'
  ].join('');
}

const _idx = function(t) { return TEMPLATES.indexOf(t) + 1; };
document.getElementById('tplGrid').innerHTML = TEMPLATES.map(t => `
<div class="tpl-card rv">
  <div class="tpl-prev prev-${t.cls}">
    <img src="${t.thumb}" alt="${t.name} template preview" class="tpl-thumb-img" loading="lazy">
    <span class="tpl-badge badge-${t.cls}">${t.badge}</span>
  </div>
  <div class="tpl-info">
    <div class="tpl-num">TEMPLATE 0${_idx(t)}</div>
    <div class="tpl-name">${t.name}</div>
    <div class="tpl-for"><i class="fas fa-user-circle"></i>${t.for}</div>
    <p class="tpl-desc">${t.desc}</p>
    <div class="tpl-feats">${t.feats.map(f => `<div class="tpl-feat"><i class="fas fa-check-circle"></i>${f}</div>`).join('')}</div>
    <div class="tpl-btns">
      <a href="${t.path}" class="btn-prev" target="_blank">Preview →</a>
      <button class="btn-use" onclick="openWizard('${t.id}','${t.name}','${t.path}')"><i class="fas fa-magic"></i> Use Template</button>
    </div>
  </div>
</div>`).join('');

document.getElementById('featGrid').innerHTML = FEATURES.map(f => `
<div class="feat rv"><i class="${f.i}"></i><h3>${f.t}</h3><p>${f.d}</p></div>`).join('');

renderAuthNav();

// ── SCROLL REVEAL ─────────────────────────────────────────────────────────────
const obs = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('show'); obs.unobserve(e.target); }
}), { threshold: .1 });
document.querySelectorAll('.rv').forEach(el => obs.observe(el));

// ── NAV ───────────────────────────────────────────────────────────────────────
window.addEventListener('scroll', () =>
  document.getElementById('nav').classList.toggle('scrolled', scrollY > 50), { passive: true });
document.getElementById('mBtn').onclick = () =>
  document.getElementById('navLinks').classList.toggle('open');

// ── TOAST ─────────────────────────────────────────────────────────────────────
function toast(msg, dur = 2800) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('on');
  setTimeout(() => el.classList.remove('on'), dur);
}

// ═════════════════════════════════════════════════════════════════════════════
//  WIZARD ENGINE — 8 STEPS
// ═════════════════════════════════════════════════════════════════════════════
const STEP_LABELS = ['Profile', 'Contact', 'Skills', 'Experience', 'Education', 'Projects', 'Theme', 'Launch'];

let W = {
  tplId: 't1', tplName: 'NEXUS', tplPath: 't1/', step: 0,
  data: {
    name: '', title: '', bio: '', location: '', photo: '', cvUrl: '', cvName: '', website: '',
    email: '', phone: '', linkedin: '', github: '', twitter: '', instagram: '', devto: '',
    available: true,
    skills: [], experience: [], education: [], certifications: [], projects: [],
    themeColor: '#2563eb', wizTheme: 'dark'
  }
};

// ── Icon & Category auto-detect ───────────────────────────────────────────────
const _icon = n => {
  n = (n || '').toLowerCase();
  if (n.includes('python')) return 'fab fa-python';
  if (n.includes('javascript') || n === 'js') return 'fab fa-js';
  if (n.includes('typescript') || n === 'ts') return 'fab fa-js';
  if (n.includes('react') || n.includes('next')) return 'fab fa-react';
  if (n.includes('vue')) return 'fab fa-vuejs';
  if (n.includes('angular')) return 'fab fa-angular';
  if (n.includes('node')) return 'fab fa-node-js';
  if (n.includes('aws') || n.includes('amazon')) return 'fab fa-aws';
  if (n.includes('docker')) return 'fab fa-docker';
  if (n.includes('java') && !n.includes('javascript')) return 'fab fa-java';
  if (n.includes('linux')) return 'fab fa-linux';
  if (n.includes('git')) return 'fab fa-github';
  if (n.includes('php')) return 'fab fa-php';
  if (n.includes('css')) return 'fab fa-css3';
  if (n.includes('html')) return 'fab fa-html5';
  if (n.includes('kubernetes') || n === 'k8s') return 'fas fa-dharmachakra';
  if (n.includes('terraform')) return 'fas fa-code-branch';
  if (n.includes('database') || n.includes('sql') || n.includes('mongo')) return 'fas fa-database';
  return 'fas fa-code';
};

const _cat = n => {
  n = (n || '').toLowerCase();
  if (['aws', 'lambda', 's3', 'ec2', 'cloud', 'azure', 'gcp', 'cloudfront', 'dynamodb', 'rds'].some(k => n.includes(k))) return 'cloud';
  if (['tensorflow', 'ml', 'ai', 'sklearn', 'pytorch', 'keras', 'neural', 'bert'].some(k => n.includes(k))) return 'ai';
  if (['docker', 'terraform', 'kubernetes', 'k8s', 'linux', 'jenkins', 'bash', 'git'].some(k => n.includes(k))) return 'tools';
  return 'dev';
};

// ── Open / Close ──────────────────────────────────────────────────────────────
window.openWizard = (id, name, path) => {
  const userStr = localStorage.getItem('devvista_user');
  if (!userStr) {
    toast('🔒 Please sign in or create an account to start customization.');
    setTimeout(() => {
      window.location.href = `login.html?redirect=index.html`;
    }, 1200);
    return;
  }
  W.tplId = id; W.tplName = name; W.tplPath = path; W.step = 0;
  const saved = localStorage.getItem('devvista_data');
  if (saved) try {
    const p = JSON.parse(saved);
    W.data = {
      ...W.data, ...p,
      skills: p.skills || [], projects: p.projects || [],
      experience: p.experience || [], education: p.education || [],
      certifications: p.certifications || []
    };
  } catch (e) { /* ignore corrupt data */ }
  document.getElementById('wizTplBadge').textContent = name;
  renderWizStep();
  document.getElementById('wizard').classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeWizard = () => {
  document.getElementById('wizard').classList.remove('open');
  document.body.style.overflow = '';
};

// Close on overlay click
document.getElementById('wizard').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeWizard();
});

// ── Validation ────────────────────────────────────────────────────────────────
function validateStep() {
  if (W.step === 0) {
    const name = document.getElementById('wf-name')?.value?.trim();
    const title = document.getElementById('wf-title')?.value?.trim();
    if (!name) { markError('wf-name', 'Full name is required'); return false; }
    if (!title) { markError('wf-title', 'Professional title is required'); return false; }
  }
  return true;
}

function markError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('field-error');
  el.addEventListener('input', () => el.classList.remove('field-error'), { once: true });
  toast('⚠️ ' + msg);
  el.focus();
}

// ── Navigation ────────────────────────────────────────────────────────────────
window.wizNav = dir => {
  if (dir === 1 && !validateStep()) return;
  saveCurrentStep();
  if (dir === 1 && W.step === STEP_LABELS.length - 1) { launchPortfolio(); return; }
  W.step = Math.max(0, Math.min(STEP_LABELS.length - 1, W.step + dir));
  renderWizStep();
};

// ── Render Step ───────────────────────────────────────────────────────────────
function renderWizStep() {
  // Apply wizard theme (dark / light)
  const box = document.querySelector('.wiz-box');
  box.classList.toggle('wiz-light', W.data.wizTheme === 'light');

  // Progress bar
  const pct = (W.step / (STEP_LABELS.length - 1)) * 100;
  document.getElementById('wizFill').style.width = pct + '%';
  document.getElementById('wizInfo').textContent = `Step ${W.step + 1} of ${STEP_LABELS.length}`;

  // Step pills
  document.getElementById('wizStepsRow').innerHTML = STEP_LABELS.map((l, i) =>
    `<span class="ws${i === W.step ? ' active' : i < W.step ? ' done' : ''}">${i < W.step ? '✓' : (i + 1) + '.'} ${l}</span>`
  ).join('');

  // Render step content
  const renders = [stepProfile, stepContact, stepSkills, stepExperience, stepEducation, stepProjects, stepTheme, stepLaunch];
  document.getElementById('wizBody').innerHTML = renders[W.step]();
  document.getElementById('wizBody').scrollTop = 0;

  // Footer buttons
  const prev = document.getElementById('wizPrev');
  const next = document.getElementById('wizNext');
  prev.style.visibility = W.step === 0 ? 'hidden' : 'visible';
  if (W.step === STEP_LABELS.length - 1) {
    next.innerHTML = '<i class="fas fa-rocket"></i> Launch Portfolio';
    next.className = 'wiz-btn wiz-next launch-btn';
  } else {
    next.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
    next.className = 'wiz-btn wiz-next';
  }

  // Wire range sliders live display
  document.querySelectorAll('.sr-range').forEach(r => {
    r.oninput = () => r.nextElementSibling.textContent = r.value + '%';
  });
}

// ═════════════════════════════════════════════════════════════════════════════
//  STEP RENDERERS
// ═════════════════════════════════════════════════════════════════════════════

// ── Step 1: Profile ───────────────────────────────────────────────────────────
function stepProfile() {
  const d = W.data;
  const hasPhoto = !!d.photo;
  return `
<h3 class="wiz-step-title"><i class="fas fa-user-circle"></i> Personal Profile</h3>
<p class="wiz-step-sub">This info appears in your portfolio header. Fields marked <span class="req">*</span> are required.</p>

<div class="photo-upload-area">
  <div class="photo-ring${hasPhoto ? ' has-photo' : ''}" id="photoPreview"
       style="${hasPhoto ? `background-image:url(${d.photo})` : ''}"
       onclick="document.getElementById('photoInput').click()" title="Click to upload photo">
    ${hasPhoto ? '' : '<i class="fas fa-camera"></i><span>Upload Photo</span>'}
    <div class="photo-overlay"><i class="fas fa-camera"></i></div>
  </div>
  <div class="photo-meta">
    <div class="photo-meta-title">Profile Photo</div>
    <div class="photo-meta-sub">Recommended: square image · JPG, PNG, WebP · Max 5 MB</div>
    <div class="photo-actions">
      <button class="photo-upload-btn" type="button" onclick="document.getElementById('photoInput').click()">
        <i class="fas fa-upload"></i> ${hasPhoto ? 'Change Photo' : 'Upload Photo'}
      </button>
      ${hasPhoto ? `<button class="photo-remove-btn" type="button" onclick="removePhoto()"><i class="fas fa-trash"></i> Remove</button>` : ''}
    </div>
  </div>
  <input type="file" id="photoInput" accept="image/*" style="display:none" onchange="handlePhotoUpload(this)">
</div>

<div class="wiz-fields">
  <div class="wf">
    <label>Full Name <span class="req">*</span></label>
    <input id="wf-name" placeholder="e.g. Alex Johnson" value="${esc(d.name)}">
  </div>
  <div class="wf">
    <label>Professional Title <span class="req">*</span></label>
    <input id="wf-title" placeholder="e.g. Cloud Architect & Developer" value="${esc(d.title)}">
  </div>
  <div class="wf full">
    <label>Short Bio</label>
    <textarea id="wf-bio" rows="3" placeholder="A brief, impactful professional summary...">${esc(d.bio)}</textarea>
  </div>
  <div class="wf">
    <label><i class="fas fa-map-marker-alt"></i> Location</label>
    <input id="wf-location" placeholder="e.g. New York, USA" value="${esc(d.location)}">
  </div>
  <div class="wf">
    <label><i class="fas fa-globe"></i> Personal Website</label>
    <input id="wf-website" placeholder="https://yourwebsite.com" value="${esc(d.website)}">
  </div>
  <div class="wf full">
    <label><i class="fas fa-file-pdf"></i> Resume / CV (PDF)</label>
    <div class="cv-upload-zone" id="cvZone" onclick="document.getElementById('cvInput').click()">
      <input type="file" id="cvInput" accept=".pdf,application/pdf" style="display:none" onchange="handleCvUpload(this)">
      ${d.cvUrl
        ? `<div class="cv-uploaded"><i class="fas fa-file-pdf cv-icon"></i><span id="cvLabel">${esc(d.cvName || 'resume.pdf')}</span><button type="button" onclick="event.stopPropagation();removeCv()" class="cv-remove"><i class="fas fa-times"></i> Remove</button></div>`
        : `<div class="cv-placeholder"><i class="fas fa-cloud-upload-alt"></i><span>Click to upload your CV / Resume · PDF only · Max 10 MB</span></div>`
      }
    </div>
  </div>
</div>`;
}

// ── Step 2: Contact & Social ──────────────────────────────────────────────────
function stepContact() {
  const d = W.data;
  return `
<h3 class="wiz-step-title"><i class="fas fa-link"></i> Contact & Social Links</h3>
<p class="wiz-step-sub">How visitors can reach you and follow your work. Fill only the ones that apply.</p>
<div class="wiz-fields">
  <div class="wf">
    <label><i class="fas fa-envelope"></i> Email</label>
    <input id="wf-email" type="email" placeholder="you@email.com" value="${esc(d.email)}">
  </div>
  <div class="wf">
    <label><i class="fas fa-phone"></i> Phone</label>
    <input id="wf-phone" placeholder="+1 000 000 0000" value="${esc(d.phone)}">
  </div>
  <div class="social-divider">Professional Networks</div>
  <div class="wf">
    <label><i class="fab fa-linkedin"></i> LinkedIn URL</label>
    <input id="wf-linkedin" placeholder="linkedin.com/in/yourprofile" value="${esc(d.linkedin)}">
  </div>
  <div class="wf">
    <label><i class="fab fa-github"></i> GitHub URL</label>
    <input id="wf-github" placeholder="github.com/yourhandle" value="${esc(d.github)}">
  </div>
  <div class="social-divider">Social & Content</div>
  <div class="wf">
    <label><i class="fab fa-x-twitter"></i> Twitter / X</label>
    <input id="wf-twitter" placeholder="@yourhandle or x.com/handle" value="${esc(d.twitter)}">
  </div>
  <div class="wf">
    <label><i class="fab fa-instagram"></i> Instagram</label>
    <input id="wf-instagram" placeholder="instagram.com/yourhandle" value="${esc(d.instagram)}">
  </div>
  <div class="wf">
    <label><i class="fab fa-dev"></i> Dev.to</label>
    <input id="wf-devto" placeholder="dev.to/yourhandle" value="${esc(d.devto)}">
  </div>
  <div class="wf full">
    <label class="wf-check">
      <input type="checkbox" id="wf-avail"${d.available ? ' checked' : ''}>
      I am currently open to new opportunities
    </label>
  </div>
</div>`;
}

// ── Step 3: Skills ────────────────────────────────────────────────────────────
function stepSkills() {
  const rows = W.data.skills.map((s, i) => `
<div class="skill-row" data-i="${i}">
  <input class="sr-name wf" placeholder="Skill name (e.g. Docker, React, Python)" value="${esc(s.name)}">
  <select class="sr-level wf-select">
    <option value="Beginner" ${s.level === 'Beginner' ? 'selected' : ''}>Beginner</option>
    <option value="Intermediate" ${s.level === 'Intermediate' || !s.level || typeof s.level === 'number' ? 'selected' : ''}>Intermediate</option>
    <option value="Advanced" ${s.level === 'Advanced' ? 'selected' : ''}>Advanced</option>
  </select>
  <button class="sr-del" type="button" onclick="removeSkill(${i})"><i class="fas fa-times"></i></button>
</div>`).join('');
  return `
<h3 class="wiz-step-title"><i class="fas fa-tools"></i> Skills & Technologies</h3>
<p class="wiz-step-sub">Add your key skills with proficiency levels. Icons are auto-detected from the skill name. Leave empty to use template defaults.</p>
<div class="skill-rows" id="skillRows">${rows}</div>
<button class="wiz-add-btn" type="button" onclick="addSkill()"><i class="fas fa-plus"></i> Add Skill</button>`;
}

// ── Step 4: Work Experience ───────────────────────────────────────────────────
function stepExperience() {
  const rows = W.data.experience.map((exp, i) => `
<div class="exp-row" data-i="${i}">
  <div class="exp-row-top">
    <div class="exp-row-fields">
      <input class="exp-company wf" placeholder="Company / Organization" value="${esc(exp.company)}">
      <input class="exp-role wf" placeholder="Job Title / Role" value="${esc(exp.role)}">
    </div>
    <div class="exp-row-right">
      <input class="exp-period wf" placeholder="Jan 2022 – Present" value="${esc(exp.period)}">
      <button class="sr-del" type="button" onclick="removeExp(${i})"><i class="fas fa-times"></i></button>
    </div>
  </div>
  <textarea class="exp-desc wf" rows="2" placeholder="Key responsibilities and achievements...">${esc(exp.desc)}</textarea>
</div>`).join('');
  return `
<h3 class="wiz-step-title"><i class="fas fa-briefcase"></i> Work Experience</h3>
<p class="wiz-step-sub">List your professional experience, most recent first. Leave empty to skip this section.</p>
<div class="exp-rows" id="expRows">${rows}</div>
<button class="wiz-add-btn" type="button" onclick="addExp()"><i class="fas fa-plus"></i> Add Experience</button>`;
}

// ── Step 5: Education & Certifications ───────────────────────────────────────
function stepEducation() {
  const eduRows = W.data.education.map((e, i) => `
<div class="edu-row" data-i="${i}">
  <input class="edu-degree wf" placeholder="Degree / Qualification (e.g. B.Sc. Computer Science)" value="${esc(e.degree)}">
  <input class="edu-inst wf" placeholder="Institution / University" value="${esc(e.institution)}">
  <input class="edu-year wf" placeholder="Year" value="${esc(e.year)}">
  <button class="sr-del" type="button" onclick="removeEdu(${i})"><i class="fas fa-times"></i></button>
</div>`).join('');

  const certRows = W.data.certifications.map((c, i) => `
<div class="cert-row" data-i="${i}">
  <input class="cert-name wf" placeholder="Certification Name (e.g. GCP Associate Developer)" value="${esc(c.name)}">
  <input class="cert-issuer wf" placeholder="Issuer (e.g. Google Cloud)" value="${esc(c.issuer)}">
  <input class="cert-year wf" placeholder="Year" value="${esc(c.year)}">
  <button class="sr-del" type="button" onclick="removeCert(${i})"><i class="fas fa-times"></i></button>
</div>`).join('');

  return `
<h3 class="wiz-step-title"><i class="fas fa-graduation-cap"></i> Education & Certifications</h3>
<p class="wiz-step-sub">Add your academic background and professional certifications.</p>

<div class="edu-section">
  <div class="edu-section-hd"><i class="fas fa-university"></i> Education</div>
  <div class="edu-rows" id="eduRows">${eduRows}</div>
  <button class="wiz-add-btn" type="button" onclick="addEdu()"><i class="fas fa-plus"></i> Add Education</button>
</div>

<div class="edu-section" style="margin-top:26px">
  <div class="edu-section-hd"><i class="fas fa-certificate"></i> Certifications</div>
  <div class="cert-rows" id="certRows">${certRows}</div>
  <button class="wiz-add-btn" type="button" onclick="addCert()"><i class="fas fa-plus"></i> Add Certification</button>
</div>`;
}

// ── Step 6: Projects ──────────────────────────────────────────────────────────
function stepProjects() {
  const rows = W.data.projects.map((p, i) => `
<div class="proj-row" data-i="${i}">
  <div class="pr-head">
    <input class="pr-name wf" placeholder="Project name" value="${esc(p.name)}">
    <button class="sr-del" type="button" onclick="removeProject(${i})"><i class="fas fa-times"></i></button>
  </div>
  <textarea class="pr-desc wf" rows="2" placeholder="Brief description of what you built and its impact...">${esc(p.desc)}</textarea>
  <input class="pr-tags wf" placeholder="Tags (comma-separated): React, DevOps, Python" value="${esc((p.tags || []).join(', '))}">
  <input class="pr-url wf" placeholder="Project URL (optional): https://github.com/..." value="${esc(p.url || '')}">
</div>`).join('');
  return `
<h3 class="wiz-step-title"><i class="fas fa-code-branch"></i> Projects</h3>
<p class="wiz-step-sub">Showcase your best work. Add up to 6 projects. Leave empty to use template defaults.</p>
<div class="proj-rows" id="projRows">${rows}</div>
${W.data.projects.length < 6
    ? '<button class="wiz-add-btn" type="button" onclick="addProject()"><i class="fas fa-plus"></i> Add Project</button>'
    : '<p class="wiz-step-sub" style="color:#f59e0b;margin-top:10px"><i class="fas fa-info-circle"></i> Maximum 6 projects reached.</p>'}`;
}

// ── Step 7: Theme & Appearance ────────────────────────────────────────────────
function stepTheme() {
  const d = W.data;
  return `
<h3 class="wiz-step-title"><i class="fas fa-palette"></i> Theme & Appearance</h3>
<p class="wiz-step-sub">Choose your portfolio accent color and wizard display mode. This color is passed to your template on launch.</p>

<div class="theme-block">
  <div class="theme-block-label">PORTFOLIO ACCENT COLOR</div>
  <div class="theme-colors">
    ${THEME_COLORS.map(c => `
    <button class="theme-swatch${d.themeColor === c.value ? ' active' : ''}"
      type="button" style="background:${c.value}" onclick="setThemeColor('${c.value}')" title="${c.name}">
      ${d.themeColor === c.value ? '<i class="fas fa-check"></i>' : ''}
    </button>`).join('')}
  </div>
  <div class="theme-preview-bar">
    <div class="tp-dot" style="background:${d.themeColor}"></div>
    <div class="tp-bar" style="border-left:3px solid ${d.themeColor};background:${d.themeColor}18"></div>
    <button class="tp-btn" type="button" style="background:${d.themeColor}">Button Preview</button>
    <code class="tp-hex">${d.themeColor}</code>
  </div>
</div>

<div class="theme-block" style="margin-top:20px">
  <div class="theme-block-label">WIZARD DISPLAY MODE</div>
  <div class="wiz-mode-row">
    <button class="wiz-mode-btn${d.wizTheme === 'dark' ? ' active' : ''}" type="button" onclick="setWizTheme('dark')">
      <i class="fas fa-moon"></i>
      <span>Dark Mode</span>
    </button>
    <button class="wiz-mode-btn${d.wizTheme === 'light' ? ' active' : ''}" type="button" onclick="setWizTheme('light')">
      <i class="fas fa-sun"></i>
      <span>Light Mode</span>
    </button>
  </div>
</div>`;
}

// ── Step 8: Launch ────────────────────────────────────────────────────────────
function stepLaunch() {
  const d = W.data;
  const tpl = TEMPLATES.find(t => t.id === W.tplId);
  const sl  = d.skills.filter(s => s.name).length;
  const exl = d.experience.filter(e => e.company).length;
  const edl = d.education.filter(e => e.degree).length;
  const cl  = d.certifications.filter(c => c.name).length;
  const pl  = d.projects.filter(p => p.name).length;
  const socials = [d.linkedin, d.github, d.twitter, d.youtube, d.instagram, d.devto].filter(Boolean).length;

  const ls = (icon, label, val, fallback) => `
<div class="ls-item">
  <span><i class="fas fa-${icon}"></i> ${label}</span>
  <b>${val || `<em class="ls-empty">${fallback || 'not set'}</em>`}</b>
</div>`;

  return `
<div class="launch-wrap">
  <div class="launch-icon"><i class="fas fa-check-circle"></i></div>
  <h3 class="wiz-step-title" style="justify-content:center;margin-bottom:6px">Ready to Launch!</h3>
  <p class="wiz-step-sub" style="text-align:center;margin-bottom:22px">
    Review your details below, then click <b>Launch Portfolio</b> to open your customised template.
  </p>

  <div class="launch-summary">
    <div class="ls-group-label">IDENTITY</div>
    ${ls('user', 'Name', d.name, 'not set')}
    ${ls('briefcase', 'Title', d.title, 'not set')}
    ${ls('map-marker-alt', 'Location', d.location, 'not set')}
    ${ls('camera', 'Photo', d.photo ? '<span class="ls-check"><i class="fas fa-check"></i> Uploaded</span>' : '', 'not uploaded')}
    ${ls('file-pdf', 'CV / Resume', d.cvUrl ? `<span class="ls-check"><i class="fas fa-check"></i> ${esc(d.cvName || 'Uploaded')}</span>` : '', 'not uploaded')}
    <div class="ls-group-label">CONTACT</div>
    ${ls('envelope', 'Email', d.email, 'not set')}
    ${ls('share-alt', 'Social Links', socials + ' connected', '')}
    <div class="ls-group-label">CONTENT</div>
    ${ls('tools', 'Skills', sl + ' added' + (sl ? '' : '<em class="ls-empty"> (template defaults)</em>'), '')}
    ${ls('briefcase', 'Experience', exl + ' added' + (exl ? '' : '<em class="ls-empty"> (template defaults)</em>'), '')}
    ${ls('graduation-cap', 'Education', edl + ' added', '')}
    ${ls('certificate', 'Certifications', cl + ' added', '')}
    ${ls('code-branch', 'Projects', pl + ' added' + (pl ? '' : '<em class="ls-empty"> (template defaults)</em>'), '')}
    <div class="ls-group-label">TEMPLATE</div>
    ${ls('layer-group', 'Template', tpl ? tpl.name : '—', '')}
    <div class="ls-item">
      <span><i class="fas fa-palette"></i> Accent Color</span>
      <b><span class="ls-color-chip" style="background:${d.themeColor}"></span>${d.themeColor}</b>
    </div>
  </div>

  <div class="launch-actions" style="display:flex;flex-direction:column;gap:12px;align-items:center;margin-top:20px">
    <button class="btn-submit" type="button" onclick="downloadStandaloneHTML()" style="width:auto;padding:12px 28px;font-size:.9rem;border-radius:8px">
      <i class="fas fa-file-download"></i> Download Standalone HTML Portfolio
    </button>
    <button class="export-btn" type="button" onclick="exportData()" style="padding:8px 16px;font-size:.78rem">
      <i class="fas fa-download"></i> Export Raw JSON Data
    </button>
  </div>
  
  <div class="theme-block" style="margin-top:20px;text-align:left">
    <div class="theme-block-label" style="margin-bottom:8px"><i class="fas fa-rocket"></i> Portfolio Deployment Options</div>
    <p style="font-size:.82rem;color:var(--m);line-height:1.6">
      1. <b>Download HTML</b>: Get a single fully-configured portfolio file with all your custom details built-in.
      <br>2. <b>Instant Hosting</b>: Upload this HTML file directly to free hosting platforms such as Netlify, Vercel, or GitHub Pages.
    </p>
  </div>
</div>`;
}

// ═════════════════════════════════════════════════════════════════════════════
//  SAVE CURRENT STEP
// ═════════════════════════════════════════════════════════════════════════════
function saveCurrentStep() {
  const g = id => document.getElementById(id)?.value?.trim() || '';
  const d = W.data;

  switch (W.step) {
    case 0: // Profile
      d.name = g('wf-name'); d.title = g('wf-title'); d.bio = g('wf-bio');
      d.location = g('wf-location'); d.website = g('wf-website');
      // photo / cvUrl / cvName are saved directly by their file handlers
      break;

    case 1: // Contact
      d.email = g('wf-email'); d.phone = g('wf-phone');
      d.linkedin = g('wf-linkedin'); d.github = g('wf-github');
      d.twitter = g('wf-twitter'); d.youtube = g('wf-youtube');
      d.instagram = g('wf-instagram'); d.devto = g('wf-devto');
      d.available = document.getElementById('wf-avail')?.checked ?? true;
      break;

    case 2: // Skills
      d.skills = [];
      document.querySelectorAll('.skill-row').forEach(r => {
        const name = r.querySelector('.sr-name').value.trim();
        const level = r.querySelector('.sr-level').value;
        if (name) d.skills.push({ name, level });
      });
      break;

    case 3: // Experience
      d.experience = [];
      document.querySelectorAll('.exp-row').forEach(r => {
        const company = r.querySelector('.exp-company').value.trim();
        const role    = r.querySelector('.exp-role').value.trim();
        const period  = r.querySelector('.exp-period').value.trim();
        const desc    = r.querySelector('.exp-desc').value.trim();
        if (company || role) d.experience.push({ company, role, period, desc });
      });
      break;

    case 4: // Education + Certifications
      d.education = [];
      document.querySelectorAll('.edu-row').forEach(r => {
        const degree      = r.querySelector('.edu-degree').value.trim();
        const institution = r.querySelector('.edu-inst').value.trim();
        const year        = r.querySelector('.edu-year').value.trim();
        if (degree) d.education.push({ degree, institution, year });
      });
      d.certifications = [];
      document.querySelectorAll('.cert-row').forEach(r => {
        const name   = r.querySelector('.cert-name').value.trim();
        const issuer = r.querySelector('.cert-issuer').value.trim();
        const year   = r.querySelector('.cert-year').value.trim();
        if (name) d.certifications.push({ name, issuer, year });
      });
      break;

    case 5: // Projects
      d.projects = [];
      document.querySelectorAll('.proj-row').forEach(r => {
        const name = r.querySelector('.pr-name').value.trim();
        const desc = r.querySelector('.pr-desc').value.trim();
        const tags = r.querySelector('.pr-tags').value.split(',').map(t => t.trim()).filter(Boolean);
        const url  = r.querySelector('.pr-url').value.trim();
        if (name) d.projects.push({ name, desc, tags, url });
      });
      break;

    case 6: // Theme — saved directly by click handlers
      break;
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  CRUD OPERATIONS
// ═════════════════════════════════════════════════════════════════════════════

// Skills
window.addSkill = () => {
  saveCurrentStep();
  W.data.skills.push({ name: '', level: 'Intermediate' });
  renderWizStep();
  setTimeout(() => { const ins = document.querySelectorAll('.sr-name'); if (ins.length) ins[ins.length - 1].focus(); }, 60);
};
window.removeSkill = i => { saveCurrentStep(); W.data.skills.splice(i, 1); renderWizStep(); };

// Experience
window.addExp = () => {
  saveCurrentStep();
  W.data.experience.push({ company: '', role: '', period: '', desc: '' });
  renderWizStep();
  setTimeout(() => { const ins = document.querySelectorAll('.exp-company'); if (ins.length) ins[ins.length - 1].focus(); }, 60);
};
window.removeExp = i => { saveCurrentStep(); W.data.experience.splice(i, 1); renderWizStep(); };

// Education
window.addEdu = () => {
  saveCurrentStep();
  W.data.education.push({ degree: '', institution: '', year: '' });
  renderWizStep();
  setTimeout(() => { const ins = document.querySelectorAll('.edu-degree'); if (ins.length) ins[ins.length - 1].focus(); }, 60);
};
window.removeEdu = i => { saveCurrentStep(); W.data.education.splice(i, 1); renderWizStep(); };

// Certifications
window.addCert = () => {
  saveCurrentStep();
  W.data.certifications.push({ name: '', issuer: '', year: '' });
  renderWizStep();
  setTimeout(() => { const ins = document.querySelectorAll('.cert-name'); if (ins.length) ins[ins.length - 1].focus(); }, 60);
};
window.removeCert = i => { saveCurrentStep(); W.data.certifications.splice(i, 1); renderWizStep(); };

// Projects
window.addProject = () => {
  if (W.data.projects.length >= 6) return;
  saveCurrentStep();
  W.data.projects.push({ name: '', desc: '', tags: [], url: '' });
  renderWizStep();
  setTimeout(() => { const ins = document.querySelectorAll('.pr-name'); if (ins.length) ins[ins.length - 1].focus(); }, 60);
};
window.removeProject = i => { saveCurrentStep(); W.data.projects.splice(i, 1); renderWizStep(); };

// ═════════════════════════════════════════════════════════════════════════════
//  FILE UPLOADS
// ═════════════════════════════════════════════════════════════════════════════

// Photo upload
window.handlePhotoUpload = input => {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { toast('⚠️ Photo must be under 5 MB'); return; }
  if (!file.type.startsWith('image/')) { toast('⚠️ Please select an image file'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    W.data.photo = e.target.result;
    // Update ring in-place (avoids losing other field values)
    const ring = document.getElementById('photoPreview');
    if (ring) {
      ring.style.backgroundImage = `url(${e.target.result})`;
      ring.classList.add('has-photo');
      ring.innerHTML = '<div class="photo-overlay"><i class="fas fa-camera"></i></div>';
    }
    // Update button
    const actions = document.querySelector('.photo-actions');
    if (actions) {
      actions.innerHTML = `
        <button class="photo-upload-btn" type="button" onclick="document.getElementById('photoInput').click()">
          <i class="fas fa-upload"></i> Change Photo
        </button>
        <button class="photo-remove-btn" type="button" onclick="removePhoto()"><i class="fas fa-trash"></i> Remove</button>`;
    }
    toast('✅ Photo uploaded!');
  };
  reader.readAsDataURL(file);
};

window.removePhoto = () => { W.data.photo = ''; renderWizStep(); };

// CV / Resume upload
window.handleCvUpload = input => {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 10 * 1024 * 1024) { toast('⚠️ CV file must be under 10 MB'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    W.data.cvUrl  = e.target.result;
    W.data.cvName = file.name;
    const zone = document.getElementById('cvZone');
    if (zone) {
      zone.innerHTML = `
        <input type="file" id="cvInput" accept=".pdf,application/pdf" style="display:none" onchange="handleCvUpload(this)">
        <div class="cv-uploaded">
          <i class="fas fa-file-pdf cv-icon"></i>
          <span id="cvLabel">${esc(file.name)}</span>
          <button type="button" onclick="event.stopPropagation();removeCv()" class="cv-remove">
            <i class="fas fa-times"></i> Remove
          </button>
        </div>`;
    }
    toast('✅ CV uploaded!');
  };
  reader.readAsDataURL(file);
};

window.removeCv = () => { W.data.cvUrl = ''; W.data.cvName = ''; renderWizStep(); };

// ═════════════════════════════════════════════════════════════════════════════
//  THEME CONTROLS
// ═════════════════════════════════════════════════════════════════════════════

window.setThemeColor = color => {
  W.data.themeColor = color;
  renderWizStep();
};

window.setWizTheme = theme => {
  W.data.wizTheme = theme;
  document.querySelector('.wiz-box').classList.toggle('wiz-light', theme === 'light');
  renderWizStep();
};

// ═════════════════════════════════════════════════════════════════════════════
//  EXPORT & LAUNCH
// ═════════════════════════════════════════════════════════════════════════════

window.exportData = () => {
  saveCurrentStep();
  const payload = { ...W.data, template: W.tplId, exportedAt: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `devvista-${(W.data.name || 'portfolio').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('✅ Data exported successfully!');
};

function launchPortfolio() {
  saveCurrentStep();
  if (!W.data.name && !W.data.title) {
    toast('⚠️ Please fill in at least your name and title first!');
    W.step = 0; renderWizStep(); return;
  }
  const mapped = {
    ...W.data,
    skills:         W.data.skills.filter(s => s.name).map(s => ({ name: s.name, level: s.level, icon: _icon(s.name), cat: _cat(s.name) })),
    experience:     W.data.experience.filter(e => e.company),
    education:      W.data.education.filter(e => e.degree),
    certifications: W.data.certifications.filter(c => c.name),
    projects:       W.data.projects.filter(p => p.name),
    template:       W.tplId
  };
  localStorage.setItem('devvista_data', JSON.stringify(mapped));
  toast('🚀 Launching your portfolio!');
  setTimeout(() => window.open(W.tplPath, '_blank'), 400);
}


// =============================================================================
//  HERO CANVAS -- Interactive Particle Network
// =============================================================================
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const NUM_PTS = 55, CONN_DIST = 130, CLR = '37,99,235';
  let W = 0, H = 0, pts = [];
  const mouse = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    pts = Array.from({ length: NUM_PTS }, function() { return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - .5) * .45,
      vy: (Math.random() - .5) * .45,
      r:  Math.random() * 1.5 + .8
    }; });
  }

  // Listen on hero section so canvas pointer-events:none doesn't block clicks
  var hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('mousemove', function(e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    }, { passive: true });
    hero.addEventListener('mouseleave', function() {
      mouse.x = -9999; mouse.y = -9999;
    }, { passive: true });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    var i, j, p, dx, dy, md, d;
    for (i = 0; i < pts.length; i++) {
      p = pts[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      dx = p.x - mouse.x; dy = p.y - mouse.y;
      md = Math.sqrt(dx*dx + dy*dy);
      if (md < 100 && md > 0) { p.x += (dx/md)*1.6; p.y += (dy/md)*1.6; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + CLR + ',.55)';
      ctx.fill();
    }
    for (i = 0; i < pts.length; i++) {
      for (j = i + 1; j < pts.length; j++) {
        dx = pts[i].x - pts[j].x; dy = pts[i].y - pts[j].y;
        d = Math.sqrt(dx*dx + dy*dy);
        if (d < CONN_DIST) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = 'rgba(' + CLR + ',' + (.14 * (1 - d/CONN_DIST)).toFixed(3) + ')';
          ctx.lineWidth = .6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  draw();
})();
