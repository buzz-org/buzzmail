// const urlParams = new URLSearchParams(window.location.search);
// const provider = parseInt(urlParams.get('provider')) || 0;
// console.log("Provider Code:", provider);

// function initializePage() {
//     if (provider === 1) {
//         showManualSignupForm();
//     } else if (provider === 2) {
//         initializeGoogleSignIn();
//     } else if (provider === 3) {
//         initializeMicrosoftSignIn();
//     }
// }

// async function initializeMicrosoftSignIn() {
//     const url = new URL(window.location.href);
//     // const accessToken = hash.get("access_token");
//     const authCode = url.searchParams.get("code");

//     if (authCode) {
//         console.log("Authorization Code:", authCode);
//         // Normally you'd send this to your backend for token exchange
//         // showError("Received authorization code. Exchange on server side.", "success");
//         return;
//     }

//     const oauth2Endpoint = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";

//     // Construct the full redirect URL
//     const params = new URLSearchParams({
//         client_id: "your_clientid",
//         response_type: "code",
//         redirect_uri: "http://localhost:5173/oauth.html",
//         response_mode: "query",
//         scope: "openid profile email User.Read",
//         // state: "12345"
//     });
    
//     // Redirect the browser to Google OAuth login
//     window.location.href = `${oauth2Endpoint}?${params.toString()}`;
//     // console.log(`${oauth2Endpoint}?${params.toString()}`);    
// }

// async function initializeGoogleSignIn() {
//     const url = new URL(window.location.href);
//     // const accessToken = hash.get("access_token");
//     const authCode = url.searchParams.get("code");

//     if (authCode) {
//         console.log("Authorization Code:", authCode);
//         // Normally you'd send this to your backend for token exchange
//         // showError("Received authorization code. Exchange on server side.", "success");
//         return;
//     }

//     const oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

//     // Construct the full redirect URL
//     const params = new URLSearchParams({
//         client_id: "696572883970-o16smmvn0c0mq9jl6kbeloosortdf6in.apps.googleusercontent.com",
//         redirect_uri: "http://localhost:5173/oauth.html",
//         response_type: "code",
//         scope: "email profile openid",
//         include_granted_scopes: "true",
//         state: "pass-through-value"
//     });

//     // Redirect the browser to Google OAuth login
//     window.location.href = `${oauth2Endpoint}?${params.toString()}`;
//     // console.log(`${oauth2Endpoint}?${params.toString()}`);
// }

// function showSignupFormWithOAuthData() {
//     document.getElementById('oauthButtonContainer').classList.add('hidden');
//     document.getElementById('signupForm').classList.remove('hidden');
//     document.getElementById('oauthInfo').classList.remove('hidden');

//     document.getElementById('displayEmail').textContent = userData.email;
//     document.getElementById('displayName').textContent = userData.name;
//     document.getElementById('usernameInput').value = userData.username;

//     if (userData.profilePicture) {
//         const preview = document.getElementById('profilePicturePreview');
//         preview.innerHTML = `<img src="${userData.profilePicture}" alt="Profile">`;
//     }

//     document.getElementById('emailGroup').classList.add('hidden');
//     document.getElementById('nameGroup').classList.add('hidden');
// }

// function showManualSignupForm() {
//     document.getElementById('signupForm').classList.remove('hidden');
//     document.getElementById('emailGroup').classList.remove('hidden');
//     document.getElementById('nameGroup').classList.remove('hidden');
// }

// document.getElementById('uploadBtn').addEventListener('click', () => {
//     document.getElementById('profilePictureInput').click();
// });

// document.getElementById('profilePictureInput').addEventListener('change', (e) => {
//     const file = e.target.files[0];
//     if (file) {
//         const reader = new FileReader();
//         reader.onload = (event) => {
//             userData.profilePicture = event.target.result;
//             const preview = document.getElementById('profilePicturePreview');
//             preview.innerHTML = `<img src="${event.target.result}" alt="Profile">`;
//         };
//         reader.readAsDataURL(file);
//     }
// });

// document.getElementById('emailInput').addEventListener('input', (e) => {
//     const email = e.target.value;
//     if (email.includes('@')) {
//         const username = email.split('@')[0];
//         document.getElementById('usernameInput').value = username;
//         userData.username = username;
//     }
// });

// document.getElementById('sendOtpBtn').addEventListener('click', () => {
//     const email = document.getElementById('emailInput').value;
//     if (!email || !email.includes('@')) {
//         showError('Please enter a valid email address');
//         return;
//     }

//     userData.email = email;

//     console.log('Sending OTP to:', email);

//     document.getElementById('otpGroup').classList.remove('hidden');
//     document.getElementById('sendOtpBtn').textContent = 'Resend OTP';
//     showError('OTP sent to your email (demo mode)', 'success');
// });

// document.getElementById('passwordToggleBtn').addEventListener('click', function() {
//     togglePasswordVisibility('passwordInput', this);
// });

// document.getElementById('confirmPasswordToggleBtn').addEventListener('click', function() {
//     togglePasswordVisibility('confirmPasswordInput', this);
// });

// function togglePasswordVisibility(inputId, button) {
//     const input = document.getElementById(inputId);
//     const eyeIcon = button.querySelector('.eye-icon');
//     const eyeOffIcon = button.querySelector('.eye-off-icon');

//     if (input.type === 'password') {
//         input.type = 'text';
//         eyeIcon.style.display = 'none';
//         eyeOffIcon.style.display = 'block';
//     } else {
//         input.type = 'password';
//         eyeIcon.style.display = 'block';
//         eyeOffIcon.style.display = 'none';
//     }
// }

// document.getElementById('registrationForm').addEventListener('submit', (e) => {
//     e.preventDefault();

//     const password = document.getElementById('passwordInput').value;
//     const confirmPassword = document.getElementById('confirmPasswordInput').value;

//     if (password !== confirmPassword) {
//         showError('Passwords do not match');
//         return;
//     }

//     if (password.length < 8) {
//         showError('Password must be at least 8 characters long');
//         return;
//     }

//     if (provider === 1) {
//         const name = document.getElementById('nameInput').value;
//         if (!name) {
//             showError('Please enter your full name');
//             return;
//         }
//         userData.name = name;

//         if (!document.getElementById('otpGroup').classList.contains('hidden')) {
//             const otp = document.getElementById('otpInput').value;
//             if (!otp || otp.length !== 6) {
//                 showError('Please enter a valid 6-digit OTP');
//                 return;
//             }
//         }
//     }

//     userData.password = password;

//     console.log('Registration data:', userData);

//     showError('Registration successful! Redirecting...', 'success');

//     setTimeout(() => {
//         window.close();
//     }, 2000);
// });

// document.getElementById('closeBtn').addEventListener('click', () => {
//     // window.close();
// });

// document.getElementById('themeToggle').addEventListener('click', () => {
//     document.body.classList.toggle('dark-mode');
// });

// function showError(message, type = 'error') {
//     const errorDiv = document.getElementById('errorMessage');
//     errorDiv.textContent = message;
//     errorDiv.style.display = 'block';
//     errorDiv.style.color = type === 'success' ? 'var(--success-color)' : 'var(--error-color)';
// }

// initializePage();

class OAuthManager {
    constructor() {
        this.urlParams = new URLSearchParams(window.location.search);
        this.provider = parseInt(this.urlParams.get('provider')) || localStorage.getItem('provider') || 0;
        localStorage.setItem('provider', this.provider);
        this.url = new URL(window.location.href);
        this.authCode = this.url.searchParams.get("code") || '';
        this.userData = {};
        this.ws = null;
        this.clientConfig = null;

        this.initializeWebSocket();
        this.initializeEventListeners();
    }

    initializeWebSocket() {
        this.ws = new WebSocket('ws://localhost:5173');

        this.ws.onopen = () => {
            console.log('WebSocket connected');
            this.requestSignupToken();
        };

        this.ws.onmessage = (event) => {
            const response = JSON.parse(event.data);
            console.log('WebSocket message received:', response);

            if (response.status === 'completed' && response.phpOutput?.serprotoken) {
                this.handleSignupTokenResponse(response.phpOutput.serprotoken);
            } else if (response.status === 'completed' && response.phpOutput?.exchangemail) {
                this.handleExchangeAuthResponse(response);
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        this.ws.onclose = () => {
            console.log('WebSocket disconnected');
        };
    }

    requestSignupToken() {
        // if (!this.authCode) {
            const data = {
                action: "serprotoken",
                serproid: this.provider
            };

            this.sendJSON(data);
        // }
    }

    sendJSON(data) {
        if (this.ws && this.ws.readyState == WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
            console.log('Sent:', data);
        } else {
            console.error('WebSocket not connected, readyState:', this.ws ? this.ws.readyState : 'null');
        }
    }

    handleSignupTokenResponse(serprotoken) {
        if (serprotoken.status === 'success') {
            this.clientConfig = serprotoken;

            console.log('Client config received:', this.clientConfig);
            this.initializePage();
        }
    }

    handleExchangeAuthResponse(exchangeauth) {
        window.opener.postMessage(exchangeauth, "*");
        this.handleClose();
    }

    initializePage() {
        console.log('this.provider:', this.provider);
        if (this.provider == 1) {
            this.initializeGoogleSignIn();
        } else if (this.provider == 2) {
            this.initializeMicrosoftSignIn();
        }
    }

    async initializeMicrosoftSignIn() {
        if (this.authCode) {
            console.log("Authorization Code:", this.authCode);
            this.exchangeAuthCode(this.authCode);
            return;
        }

        if (!this.clientConfig) {
            console.log('Waiting for client config...');
            return;
        }

        const oauth2Endpoint = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";

        const params = new URLSearchParams({
            client_id: this.clientConfig.clientId,
            response_type: "code",
            redirect_uri: this.clientConfig.redirectUri,
            response_mode: "query",
            scope: "openid profile email User.Read",
        });

        window.location.href = `${oauth2Endpoint}?${params.toString()}`;
    }

    async initializeGoogleSignIn() {
        if (this.authCode) {
            console.log("Authorization Code:", this.authCode);
            this.exchangeAuthCode(this.authCode);
            return;
        }

        if (!this.clientConfig) {
            console.log('Waiting for client config...');
            return;
        }

        const oauth2Endpoint = this.clientConfig.auth_uri;

        const params = new URLSearchParams({
            client_id: this.clientConfig.clientId,
            redirect_uri: this.clientConfig.redirect[0],
            response_type: "code",
            access_type: "offline",
            scope: this.clientConfig.cliscope,
            prompt: "select_account consent",
            state: ""
        });

        window.location.href = `${oauth2Endpoint}?${params.toString()}`;
    }

    exchangeAuthCode(authCode) {
        const data = {
            action: "exchangemail",
            authCode: this.authCode,
            serproid: this.provider
        };

        this.sendJSON(data);
    }

    showSignupFormWithOAuthData() {
        document.getElementById('oauthButtonContainer').classList.add('hidden');
        document.getElementById('signupForm').classList.remove('hidden');
        document.getElementById('oauthInfo').classList.remove('hidden');

        document.getElementById('displayEmail').textContent = this.userData.email;
        document.getElementById('displayName').textContent = this.userData.name;
        document.getElementById('usernameInput').value = this.userData.username;

        if (this.userData.profilePicture) {
            const preview = document.getElementById('profilePicturePreview');
            preview.innerHTML = `<img src="${this.userData.profilePicture}" alt="Profile">`;
        }

        document.getElementById('emailGroup').classList.add('hidden');
        document.getElementById('nameGroup').classList.add('hidden');
    }

    showManualSignupForm() {
        document.getElementById('signupForm').classList.remove('hidden');
        document.getElementById('emailGroup').classList.remove('hidden');
        document.getElementById('nameGroup').classList.remove('hidden');
    }

    handleProfilePictureUpload() {
        document.getElementById('profilePictureInput').click();
    }

    handleProfilePictureChange(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                this.userData.profilePicture = event.target.result;
                const preview = document.getElementById('profilePicturePreview');
                preview.innerHTML = `<img src="${event.target.result}" alt="Profile">`;
            };
            reader.readAsDataURL(file);
        }
    }

    handleEmailInput(e) {
        const email = e.target.value;
        if (email.includes('@')) {
            const username = email.split('@')[0];
            document.getElementById('usernameInput').value = username;
            this.userData.username = username;
        }
    }

    handleSendOtp() {
        const email = document.getElementById('emailInput').value;
        if (!email || !email.includes('@')) {
            this.showError('Please enter a valid email address');
            return;
        }

        this.userData.email = email;

        console.log('Sending OTP to:', email);

        document.getElementById('otpGroup').classList.remove('hidden');
        document.getElementById('sendOtpBtn').textContent = 'Resend OTP';
        this.showError('OTP sent to your email (demo mode)', 'success');
    }

    togglePasswordVisibility(inputId, button) {
        const input = document.getElementById(inputId);
        const eyeIcon = button.querySelector('.eye-icon');
        const eyeOffIcon = button.querySelector('.eye-off-icon');

        if (input.type === 'password') {
            input.type = 'text';
            eyeIcon.style.display = 'none';
            eyeOffIcon.style.display = 'block';
        } else {
            input.type = 'password';
            eyeIcon.style.display = 'block';
            eyeOffIcon.style.display = 'none';
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();

        const password = document.getElementById('passwordInput').value;
        const confirmPassword = document.getElementById('confirmPasswordInput').value;

        if (password !== confirmPassword) {
            this.showError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            this.showError('Password must be at least 8 characters long');
            return;
        }

        if (this.provider === 1) {
            const name = document.getElementById('nameInput').value;
            if (!name) {
                this.showError('Please enter your full name');
                return;
            }
            this.userData.name = name;

            if (!document.getElementById('otpGroup').classList.contains('hidden')) {
                const otp = document.getElementById('otpInput').value;
                if (!otp || otp.length !== 6) {
                    this.showError('Please enter a valid 6-digit OTP');
                    return;
                }
            }
        }

        this.userData.password = password;

        console.log('Registration data:', this.userData);

        this.showError('Registration successful! Redirecting...', 'success');

        setTimeout(() => {
            window.close();
        }, 2000);
    }

    handleClose() {
        window.close();
    }

    handleThemeToggle() {
        document.body.classList.toggle('dark-mode');
    }

    showError(message, type = 'error') {
        const errorDiv = document.getElementById('errorMessage');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        errorDiv.style.color = type === 'success' ? 'var(--success-color)' : 'var(--error-color)';
    }

    initializeEventListeners() {
        // document.getElementById('uploadBtn').addEventListener('click', () => {
        //     this.handleProfilePictureUpload();
        // });

        document.getElementById('profilePictureInput').addEventListener('change', (e) => {
            this.handleProfilePictureChange(e);
        });

        document.getElementById('emailInput').addEventListener('input', (e) => {
            this.handleEmailInput(e);
        });

        // document.getElementById('sendOtpBtn').addEventListener('click', () => {
        //     this.handleSendOtp();
        // });

        // document.getElementById('passwordToggleBtn').addEventListener('click', function() {
        //     window.oauthManager.togglePasswordVisibility('passwordInput', this);
        // });

        // document.getElementById('confirmPasswordToggleBtn').addEventListener('click', function() {
        //     window.oauthManager.togglePasswordVisibility('confirmPasswordInput', this);
        // });

        document.getElementById('registrationForm').addEventListener('submit', (e) => {
            this.handleFormSubmit(e);
        });

        // document.getElementById('closeBtn').addEventListener('click', () => {
        //     this.handleClose();
        // });

        document.getElementById('themeToggle').addEventListener('click', () => {
            this.handleThemeToggle();
        });
    }
}

window.oauthManager = new OAuthManager();
