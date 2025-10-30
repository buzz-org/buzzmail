// import './style.css';
// import { EmailClient } from './src/EmailClient.js';
class EmailClient {
  constructor() {
    this.currentFolder = 'inbox';
    this.selectedEmails = new Set();
    this.emails = this.generateSampleEmails();
    this.isDarkTheme = false;
    
    // DOM elements
    this.elements = {};

    this.initLogin();
  }

  initLogin() {
    // this.connectWebSocket();
    this.setupLoginHandlers();
  }

  setupLoginHandlers() {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const loginThemeToggle = document.getElementById('loginThemeToggle');

    // Check for saved theme preference
    // const savedTheme = localStorage.getItem('email-theme');
    // if (savedTheme === 'dark') {
    //   this.toggleThemeLogin();
    // }

    if (loginThemeToggle) {
      loginThemeToggle.addEventListener('click', () => this.toggleThemeLogin());
    }

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

      //   if (!email || !password) {
      //     alert('Please fill in all fields');
      //     return;
      //   }

        loginBtn.classList.add('loading');
        loginBtn.disabled = true;

        setTimeout(() => {
          this.isLoggedIn = true;
          document.getElementById('loginScreen').style.display = 'none';
          document.getElementById('app').style.display = 'flex';

          this.init();

          document.body.dataset.page = 'home';
          loginBtn.classList.remove('loading');
          loginBtn.disabled = false;
        }, 1500);
      });
    }

    const forgotPassword = document.querySelector('.forgot-password');
    if (forgotPassword) {
      forgotPassword.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Forgot password functionality would be implemented here');
      });
    }
  }

  init() {
    this.bindElements();
    this.bindEvents();
    this.renderEmails();
    this.updateBadges();
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('email-theme');
    if (savedTheme === 'dark') {
      this.toggleTheme();
    }
  }

  bindElements() {
    this.elements = {
      menuToggle: document.getElementById('menuToggle'),
      sidebar: document.getElementById('sidebar'),
      themeToggle: document.getElementById('themeToggle'),
      searchInput: document.getElementById('searchInput'),
      composeBtn: document.getElementById('composeBtn'),
      composeModal: document.getElementById('composeModal'),
      closeComposeModal: document.getElementById('closeComposeModal'),
      sendEmailBtn: document.getElementById('sendEmailBtn'),
      saveDraftBtn: document.getElementById('saveDraftBtn'),
      selectAllBtn: document.getElementById('selectAllBtn'),
      refreshBtn: document.getElementById('refreshBtn'),
      archiveBtn: document.getElementById('archiveBtn'),
      deleteBtn: document.getElementById('deleteBtn'),
      emailList: document.getElementById('emailList'),
      emailCount: document.getElementById('emailCount'),
      inboxBadge: document.getElementById('inboxBadge'),
      draftsBadge: document.getElementById('draftsBadge'),
      composeTo: document.getElementById('composeTo'),
      composeSubject: document.getElementById('composeSubject'),
      composeMessage: document.getElementById('composeMessage'),
      userAvatar: document.getElementById('userAvatar'),
      userDropdown: document.getElementById('userDropdown'),
      closeUserDropdown: document.getElementById('closeUserDropdown'),
      logoutBtn: document.getElementById('logoutBtn'),
      signOutBtn: document.getElementById('signOutBtn'),
      userEmail: document.getElementById('userEmail')
    };
  }

  bindEvents() {
    // Menu toggle
    this.elements.menuToggle?.addEventListener('click', () => this.toggleSidebar());

    // Theme toggle
    this.elements.themeToggle?.addEventListener('click', () => this.toggleTheme());

    // Search functionality
    this.elements.searchInput?.addEventListener('input', (e) => this.handleSearch(e.target.value));

    // Folder navigation
    document.querySelectorAll('.nav-item[data-folder]').forEach(item => {
      item.addEventListener('click', () => this.switchFolder(item.dataset.folder));
    });

    // Compose modal
    this.elements.composeBtn?.addEventListener('click', () => this.openComposeModal());
    this.elements.closeComposeModal?.addEventListener('click', () => this.closeComposeModal());
    this.elements.composeModal?.addEventListener('click', (e) => {
      if (e.target === this.elements.composeModal) {
        this.closeComposeModal();
      }
    });

    // Email actions
    this.elements.sendEmailBtn?.addEventListener('click', () => this.sendEmail());
    this.elements.saveDraftBtn?.addEventListener('click', () => this.saveDraft());
    this.elements.selectAllBtn?.addEventListener('click', () => this.toggleSelectAll());
    this.elements.refreshBtn?.addEventListener('click', () => this.refreshEmails());
    this.elements.archiveBtn?.addEventListener('click', () => this.archiveSelected());
    this.elements.deleteBtn?.addEventListener('click', () => this.deleteSelected());

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

    // User dropdown
    this.elements.userAvatar?.addEventListener('click', () => this.toggleUserDropdown());
    this.elements.closeUserDropdown?.addEventListener('click', () => this.closeUserDropdown());
    this.elements.logoutBtn?.addEventListener('click', () => this.logout());
    // this.elements.signOutBtn?.addEventListener('click', () => this.logout());

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (this.elements.userDropdown?.classList.contains('active') &&
          !e.target.closest('.user-menu-container')) {
        this.closeUserDropdown();
      }
    });
  }

  generateSampleEmails() {
    const sampleEmails = [
      {
        id: 1,
        sender: 'Instagram',
        subject: 'achhuthebald, catch up on moments you\'ve missed',
        preview: 'time.pass.artist, sudarshan.creations and 15 others shared photos and videos.',
        time: '10:57 PM',
        folder: 'inbox',
        unread: true,
        starred: false,
        important: false
      },
      {
        id: 2,
        sender: 'LinkedIn',
        subject: 'Updates to our terms',
        preview: 'See what\'s new and how to manage your data',
        time: 'Sep 27',
        folder: 'inbox',
        unread: true,
        starred: false,
        important: false
      },
      {
        id: 3,
        sender: 'LinkedIn',
        subject: 'HARSHITH KUMAR, follow Bill Gates - Co-chair at Gates Foundation',
        preview: 'See your network\'s latest updates and connect with professionals',
        time: 'Sep 26',
        folder: 'inbox',
        unread: false,
        starred: true,
        important: false
      },
      {
        id: 4,
        sender: 'Instagram',
        subject: 'achhuthebald, see pooja_garimella, joleyvj and more in your feed',
        preview: 'New people have shared photos and videos that you might like',
        time: 'Sep 25',
        folder: 'inbox',
        unread: false,
        starred: false,
        important: false
      },
      {
        id: 5,
        sender: 'Eric at StackBlitz',
        subject: 'How is your first week with Bolt.new?',
        preview: 'I\'d love to hear your feedback on Bolt so far and help with any questions',
        time: 'Sep 25',
        folder: 'inbox',
        unread: true,
        starred: false,
        important: true
      },
      {
        id: 6,
        sender: 'Joel @ ngrok',
        subject: '[ngrok news] New AI gateway early access, new shape of gateway things',
        preview: 'Exciting updates to our AI gateway platform and new features coming soon',
        time: 'Sep 24',
        folder: 'inbox',
        unread: false,
        starred: false,
        important: false
      },
      {
        id: 7,
        sender: 'Eric at Bolt.new',
        subject: 'The Untold Story of the AI Gold Rush (Premieres TODAY @ 8am PT!!)',
        preview: 'A Netflix-style documentary about the AI revolution and what it means for developers',
        time: 'Sep 24',
        folder: 'inbox',
        unread: false,
        starred: false,
        important: false
      },
      {
        id: 8,
        sender: 'Kaggle',
        subject: 'Register for Our 5-Day AI Agents Intensive Course With Google',
        preview: 'Hi KUMAR H., Learn to build AI agents that can reason, plan, and execute complex tasks',
        time: 'Sep 23',
        folder: 'inbox',
        unread: false,
        starred: false,
        important: false
      },
      {
        id: 9,
        sender: 'Google Maps',
        subject: 'You reached a new record: 10 reviews on Google!',
        preview: 'Let\'s celebrate your impact by sharing your experiences with the community',
        time: 'Sep 23',
        folder: 'inbox',
        unread: false,
        starred: false,
        important: false
      },
      {
        id: 10,
        sender: 'InfinityFree',
        subject: 'Your new InfinityFree account has been created',
        preview: 'InfinityFree Hi 150305@sdmc.edu.in, Welcome to InfinityFree! Your hosting account is ready',
        time: 'Sep 23',
        folder: 'inbox',
        unread: false,
        starred: false,
        important: false
      },
      {
        id: 11,
        sender: 'GitHub',
        subject: '[GitHub] A third-party OAuth application has been added to your account',
        preview: 'Hi there, Bolt.new by StackBlitz has been added to your GitHub account',
        time: 'Sep 23',
        folder: 'inbox',
        unread: false,
        starred: false,
        important: false
      }
    ];

    // Add some drafts and sent items
    sampleEmails.push(
      {
        id: 100,
        sender: 'Me',
        subject: 'Meeting notes from yesterday',
        preview: 'Here are the key points we discussed in our team meeting...',
        time: 'Sep 28',
        folder: 'drafts',
        unread: false,
        starred: false,
        important: false
      },
      {
        id: 101,
        sender: 'Me',
        subject: 'Project proposal draft',
        preview: 'I\'ve been working on the new project proposal and wanted to share my initial thoughts...',
        time: 'Sep 27',
        folder: 'drafts',
        unread: false,
        starred: false,
        important: false
      },
      {
        id: 102,
        sender: 'Me',
        subject: 'Thank you for the interview',
        preview: 'I wanted to thank you for taking the time to speak with me yesterday...',
        time: 'Sep 26',
        folder: 'sent',
        unread: false,
        starred: false,
        important: false
      }
    );

    return sampleEmails;
  }

  renderEmails() {
    const filteredEmails = this.getFilteredEmails();
    const emailList = this.elements.emailList;
    
    if (!emailList) return;

    if (filteredEmails.length === 0) {
      emailList.innerHTML = `
        <div class="loading">
          <i class="fas fa-inbox"></i>
          No emails in ${this.currentFolder}
        </div>
      `;
      return;
    }

    emailList.innerHTML = filteredEmails.map(email => `
      <div class="email-item ${email.unread ? 'unread' : ''}" data-email-id="${email.id}">
        <input type="checkbox" class="email-checkbox" data-email-id="${email.id}">
        <i class="email-star ${email.starred ? 'fas starred' : 'far'} fa-star" data-email-id="${email.id}"></i>
        <div class="email-sender">${email.sender}</div>
        <div class="email-content">
          <span class="email-subject">${email.subject}</span>
          <span class="email-preview">- ${email.preview}</span>
        </div>
        <div class="email-time">${email.time}</div>
      </div>
    `).join('');

    // Bind email item events
    this.bindEmailEvents();
    this.updateEmailCount();
  }

  bindEmailEvents() {
    // Email checkboxes
    document.querySelectorAll('.email-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const emailId = parseInt(e.target.dataset.emailId);
        if (e.target.checked) {
          this.selectedEmails.add(emailId);
        } else {
          this.selectedEmails.delete(emailId);
        }
        this.updateToolbarButtons();
      });
    });

    // Star toggles
    document.querySelectorAll('.email-star').forEach(star => {
      star.addEventListener('click', (e) => {
        e.stopPropagation();
        const emailId = parseInt(e.target.dataset.emailId);
        this.toggleStar(emailId);
      });
    });

    // Email clicks
    document.querySelectorAll('.email-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.type === 'checkbox' || e.target.classList.contains('email-star')) {
          return;
        }
        const emailId = parseInt(item.dataset.emailId);
        this.openEmail(emailId);
      });
    });
  }

  getFilteredEmails() {
    let filtered = this.emails.filter(email => email.folder === this.currentFolder);
    
    // Apply search filter if there's a search term
    const searchTerm = this.elements.searchInput?.value.toLowerCase();
    if (searchTerm) {
      filtered = filtered.filter(email => 
        email.subject.toLowerCase().includes(searchTerm) ||
        email.sender.toLowerCase().includes(searchTerm) ||
        email.preview.toLowerCase().includes(searchTerm)
      );
    }

    return filtered.sort((a, b) => {
      // Sort by unread first, then by time
      if (a.unread && !b.unread) return -1;
      if (!a.unread && b.unread) return 1;
      return b.id - a.id; // Newer emails first
    });
  }

  switchFolder(folder) {
    this.currentFolder = folder;
    this.selectedEmails.clear();
    
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    document.querySelector(`[data-folder="${folder}"]`)?.classList.add('active');
    
    this.renderEmails();
    this.updateToolbarButtons();
  }

  toggleSidebar() {
    this.elements.sidebar?.classList.toggle('open');
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.setAttribute('data-theme', this.isDarkTheme ? 'dark' : 'light');
    
    // Update theme toggle icon
    const icon = this.elements.themeToggle?.querySelector('i');
    if (icon) {
      icon.className = this.isDarkTheme ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    // Save preference
    localStorage.setItem('email-theme', this.isDarkTheme ? 'dark' : 'light');
  }

  toggleThemeLogin() {
        const body = document.body;
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
        const loginThemeToggle = document.getElementById('loginThemeToggle');
        loginThemeToggle.querySelector('i').className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('email-theme', newTheme);
  }

  handleSearch(searchTerm) {
    this.renderEmails();
  }

  openComposeModal() {
    this.elements.composeModal?.classList.add('active');
    this.elements.composeTo?.focus();
  }

  closeComposeModal() {
    this.elements.composeModal?.classList.remove('active');
    // Clear form
    if (this.elements.composeTo) this.elements.composeTo.value = '';
    if (this.elements.composeSubject) this.elements.composeSubject.value = '';
    if (this.elements.composeMessage) this.elements.composeMessage.value = '';
  }

  sendEmail() {
    const to = this.elements.composeTo?.value;
    const subject = this.elements.composeSubject?.value;
    const message = this.elements.composeMessage?.value;
    
    if (!to || !subject || !message) {
      alert('Please fill in all fields');
      return;
    }

    // Simulate sending email
    const newEmail = {
      id: Date.now(),
      sender: 'Me',
      subject: subject,
      preview: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
      time: 'Just now',
      folder: 'sent',
      unread: false,
      starred: false,
      important: false
    };

    this.emails.unshift(newEmail);
    this.closeComposeModal();
    
    // Show success message
    this.showToast('Email sent successfully!', 'success');
  }

  saveDraft() {
    const subject = this.elements.composeSubject?.value;
    const message = this.elements.composeMessage?.value;
    
    if (!subject && !message) {
      return;
    }

    const newDraft = {
      id: Date.now(),
      sender: 'Me',
      subject: subject || '(no subject)',
      preview: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
      time: 'Just now',
      folder: 'drafts',
      unread: false,
      starred: false,
      important: false
    };

    this.emails.unshift(newDraft);
    this.closeComposeModal();
    this.updateBadges();
    
    this.showToast('Draft saved successfully!', 'success');
  }

  toggleSelectAll() {
    const filteredEmails = this.getFilteredEmails();
    const checkboxes = document.querySelectorAll('.email-checkbox');
    const allSelected = filteredEmails.every(email => this.selectedEmails.has(email.id));
    
    if (allSelected) {
      // Deselect all
      filteredEmails.forEach(email => this.selectedEmails.delete(email.id));
      checkboxes.forEach(cb => cb.checked = false);
    } else {
      // Select all
      filteredEmails.forEach(email => this.selectedEmails.add(email.id));
      checkboxes.forEach(cb => cb.checked = true);
    }
    
    this.updateToolbarButtons();
  }

  refreshEmails() {
    this.showToast('Refreshing emails...', 'info');
    // Simulate refresh delay
    setTimeout(() => {
      this.renderEmails();
      this.showToast('Emails refreshed!', 'success');
    }, 1000);
  }

  archiveSelected() {
    if (this.selectedEmails.size === 0) return;
    
    this.selectedEmails.forEach(emailId => {
      const email = this.emails.find(e => e.id === emailId);
      if (email) {
        email.folder = 'archived';
      }
    });
    
    this.selectedEmails.clear();
    this.renderEmails();
    this.updateToolbarButtons();
    this.showToast(`${this.selectedEmails.size} emails archived`, 'success');
  }

  deleteSelected() {
    if (this.selectedEmails.size === 0) return;
    
    const count = this.selectedEmails.size;
    this.emails = this.emails.filter(email => !this.selectedEmails.has(email.id));
    this.selectedEmails.clear();
    this.renderEmails();
    this.updateToolbarButtons();
    this.updateBadges();
    this.showToast(`${count} emails deleted`, 'success');
  }

  toggleStar(emailId) {
    const email = this.emails.find(e => e.id === emailId);
    if (email) {
      email.starred = !email.starred;
      this.renderEmails();
    }
  }

  openEmail(emailId) {
    const email = this.emails.find(e => e.id === emailId);
    if (email) {
      email.unread = false;
      this.renderEmails();
      this.updateBadges();
      // In a real app, this would open the email detail view
      console.log('Opening email:', email);
    }
  }

  updateToolbarButtons() {
    const hasSelection = this.selectedEmails.size > 0;
    
    if (this.elements.archiveBtn) {
      this.elements.archiveBtn.style.opacity = hasSelection ? '1' : '0.5';
      this.elements.archiveBtn.disabled = !hasSelection;
    }
    
    if (this.elements.deleteBtn) {
      this.elements.deleteBtn.style.opacity = hasSelection ? '1' : '0.5';
      this.elements.deleteBtn.disabled = !hasSelection;
    }
  }

  updateEmailCount() {
    const filteredEmails = this.getFilteredEmails();
    const totalCount = this.emails.filter(e => e.folder === this.currentFolder).length;
    
    if (this.elements.emailCount) {
      this.elements.emailCount.textContent = `1-${Math.min(50, filteredEmails.length)} of ${totalCount}`;
    }
  }

  updateBadges() {
    // Update inbox badge
    const inboxUnread = this.emails.filter(e => e.folder === 'inbox' && e.unread).length;
    if (this.elements.inboxBadge) {
      this.elements.inboxBadge.textContent = inboxUnread;
      this.elements.inboxBadge.style.display = inboxUnread > 0 ? 'block' : 'none';
    }
    
    // Update drafts badge
    const draftsCount = this.emails.filter(e => e.folder === 'drafts').length;
    if (this.elements.draftsBadge) {
      this.elements.draftsBadge.textContent = draftsCount;
      this.elements.draftsBadge.style.display = draftsCount > 0 ? 'block' : 'none';
    }
  }

  handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      this.elements.searchInput?.focus();
    }
    
    // C for compose
    if (e.key === 'c' && !e.target.matches('input, textarea')) {
      this.openComposeModal();
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
      this.closeComposeModal();
    }
    
    // R for refresh
    if (e.key === 'r' && !e.target.matches('input, textarea')) {
      e.preventDefault();
      this.refreshEmails();
    }
  }

  showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Add toast styles
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      padding: '12px 24px',
      borderRadius: '8px',
      color: 'white',
      backgroundColor: type === 'success' ? '#198754' : type === 'error' ? '#dc3545' : '#0d6efd',
      zIndex: '9999',
      transform: 'translateY(100px)',
      opacity: '0',
      transition: 'all 0.3s ease'
    });
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.transform = 'translateY(100px)';
      toast.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }

  toggleUserDropdown() {
    this.elements.userDropdown?.classList.add('active');
  }

  closeUserDropdown() {
    this.elements.userDropdown?.classList.remove('active');
  }

  logout() {
    this.closeUserDropdown();
    this.isLoggedIn = false;

    document.getElementById('app').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';

    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
  }
}

// Initialize the chat application when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.mailApp = new EmailClient();
});
