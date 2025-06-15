/// Function to show notifications
function showNotification(message, type = 'success') {
    const notification = document.getElementById("notification");
    
    // Remove existing classes
    notification.classList.remove('show', 'success', 'error');
    
    // Set message and type
    notification.textContent = message;
    notification.classList.add('show', type);
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Function to validate form fields
function validateField(field, errorElement, condition, errorMessage) {
    if (!condition) {
        field.classList.add('error');
        errorElement.classList.add('show');
        errorElement.textContent = errorMessage;
        return false;
    } else {
        field.classList.remove('error');
        errorElement.classList.remove('show');
        return true;
    }
}

// Function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to validate Indonesian phone number
function isValidPhoneNumber(phone) {
    // Indonesian phone number validation (starts with 08 or +62)
    const phoneRegex = /^08[1-9][0-9]{6,9}$/;
    return phoneRegex.test(phone.replace(/\s|-/g, ''));
}

// Function to validate password strength
function isValidPassword(password) {
    return password.length >= 6 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /[0-9]/.test(password);
}

// Function to show loading state
function showLoading(button) {
    button.disabled = true;
    button.innerHTML = '<span class="loading"></span> Mendaftar...';
}

// Function to hide loading state
function hideLoading(button) {
    button.disabled = false;
    button.innerHTML = 'Daftar';
}

// Function to format phone number as user types
function formatPhoneNumber(value) {
    // Remove all non-digits
    let cleaned = value.replace(/\D/g, '');
    
    // Handle +62 prefix
    if (cleaned.startsWith('62')) {
        cleaned = '0' + cleaned.substring(2);
    }
    
    // Ensure it starts with 0
    if (!cleaned.startsWith('0')) {
        cleaned = '0' + cleaned;
    }
    
    // Format as 0812-3456-7890
    if (cleaned.length > 4 && cleaned.length <= 8) {
        return cleaned.replace(/(\d{4})(\d+)/, '$1-$2');
    } else if (cleaned.length > 8) {
        return cleaned.replace(/(\d{4})(\d{4})(\d+)/, '$1-$2-$3');
    }
    
    return cleaned;
}

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const registerForm = document.getElementById('registerForm');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const passwordInput = document.getElementById('password');
    const agreeTermsInput = document.getElementById('agreeTerms');
    const togglePasswordBtn = document.getElementById('passwordToggle');
    
    // Get error elements
    const fullNameError = document.getElementById('fullNameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const passwordError = document.getElementById('passwordError');
    const termsError = document.getElementById('termsError');

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            this.innerHTML = '<i class="fas fa-eye"></i>';
        } else {
            passwordInput.type = 'password';
            this.innerHTML = '<i class="fas fa-eye-slash"></i>';
        }
    });

    // Phone number formatting
    phoneInput.addEventListener('input', function() {
        const cursorPosition = this.selectionStart;
        const oldValue = this.value;
        const newValue = formatPhoneNumber(this.value);
        
        this.value = newValue;
        
        // Maintain cursor position
        if (newValue.length > oldValue.length) {
            this.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
        } else {
            this.setSelectionRange(cursorPosition, cursorPosition);
        }
    });

    // Real-time validation for full name
    fullNameInput.addEventListener('blur', function() {
        const fullName = this.value.trim();
        validateField(
            fullNameInput,
            fullNameError,
            fullName.length >= 3,
            'Nama harus minimal 3 karakter.'
        );
    });

    fullNameInput.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            const fullName = this.value.trim();
            if (fullName.length >= 3) {
                this.classList.remove('error');
                fullNameError.classList.remove('show');
            }
        }
    });

    // Real-time validation for email
    emailInput.addEventListener('blur', function() {
        const email = this.value.trim();
        validateField(
            emailInput,
            emailError,
            email && isValidEmail(email),
            'Masukkan email yang valid.'
        );
    });

    emailInput.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            const email = this.value.trim();
            if (email && isValidEmail(email)) {
                this.classList.remove('error');
                emailError.classList.remove('show');
            }
        }
    });

    // Real-time validation for phone
    phoneInput.addEventListener('blur', function() {
        const phone = this.value.trim();
        validateField(
            phoneInput,
            phoneError,
            phone && isValidPhoneNumber(phone),
            'Masukkan nomor handphone yang valid (contoh: 0812-3456-7890).'
        );
    });

    phoneInput.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            const phone = this.value.trim();
            if (phone && isValidPhoneNumber(phone)) {
                this.classList.remove('error');
                phoneError.classList.remove('show');
            }
        }
    });

    // Real-time validation for password
    passwordInput.addEventListener('blur', function() {
        const password = this.value;
        validateField(
            passwordInput,
            passwordError,
            isValidPassword(password),
            'Password minimal 6 karakter dengan huruf besar, kecil, dan angka.'
        );
    });

    passwordInput.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            const password = this.value;
            if (isValidPassword(password)) {
                this.classList.remove('error');
                passwordError.classList.remove('show');
            }
        }
    });

    // Terms and conditions validation
    agreeTermsInput.addEventListener('change', function() {
        if (this.checked) {
            termsError.classList.remove('show');
        }
    });

    // Form submission
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const fullName = fullNameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const password = passwordInput.value;
        const agreeTerms = agreeTermsInput.checked;
        const submitButton = this.querySelector('button[type="submit"]');

        // Validate all fields
        const isNameValid = validateField(
            fullNameInput,
            fullNameError,
            fullName.length >= 3,
            'Nama harus minimal 3 karakter.'
        );

        const isEmailValid = validateField(
            emailInput,
            emailError,
            email && isValidEmail(email),
            'Masukkan email yang valid.'
        );

        const isPhoneValid = validateField(
            phoneInput,
            phoneError,
            phone && isValidPhoneNumber(phone),
            'Masukkan nomor handphone yang valid (contoh: 0812-3456-7890).'
        );

        const isPasswordValid = validateField(
            passwordInput,
            passwordError,
            isValidPassword(password),
            'Password minimal 6 karakter dengan huruf besar, kecil, dan angka.'
        );

        const isTermsValid = validateField(
            agreeTermsInput,
            termsError,
            agreeTerms,
            'Anda harus menyetujui syarat dan ketentuan.'
        );

        // If any validation fails, show notification and stop
        if (!isNameValid || !isEmailValid || !isPhoneValid || !isPasswordValid || !isTermsValid) {
            showNotification('Mohon perbaiki kesalahan pada form.', 'error');
            return;
        }

        // Show loading state
        showLoading(submitButton);

        // Simulate API call
        setTimeout(() => {
            // Hide loading state
            hideLoading(submitButton);

            // Check if email already exists (simulation)
            const existingEmails = ['test@example.com', 'admin@alfagift.com'];
            const existingPhones = ['0812-3456-7890', '0821-1234-5678'];
            
            if (existingEmails.includes(email.toLowerCase())) {
                showNotification('Email sudah terdaftar. Silakan gunakan email lain.', 'error');
                emailInput.classList.add('error');
                emailError.textContent = 'Email sudah terdaftar.';
                emailError.classList.add('show');
                return;
            }

            if (existingPhones.includes(phone) || existingPhones.includes(phone.replace(/\D/g, ''))) {
                showNotification('Nomor handphone sudah terdaftar. Silakan gunakan nomor lain.', 'error');
                phoneInput.classList.add('error');
                phoneError.textContent = 'Nomor handphone sudah terdaftar.';
                phoneError.classList.add('show');
                return;
            }

            // Show success notification
            showNotification('Pendaftaran berhasil! Mengalihkan ke halaman masuk...', 'success');

            // Reset form
            registerForm.reset();
            
            // Remove any error states
            [fullNameInput, emailInput, phoneInput, passwordInput].forEach(input => {
                input.classList.remove('error');
            });
            [fullNameError, emailError, phoneError, passwordError, termsError].forEach(error => {
                error.classList.remove('show');
            });

            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }, 1500); // Simulate network delay
    });

    // Clear errors when user starts typing
    [fullNameInput, emailInput, phoneInput, passwordInput].forEach(input => {
        input.addEventListener('focus', function() {
            // Remove notification if it's showing an error
            const notification = document.getElementById('notification');
            if (notification.classList.contains('error')) {
                notification.classList.remove('show');
            }
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            console.log('Mencari:', query);
            showNotification(`Mencari: "${query}"`, 'success');
        }
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
});

// Additional utility functions
function sanitizeInput(input) {
    return input.trim().replace(/[<>]/g, '');
}

// Export functions for potential use in other scripts
window.AlfagiftRegister = {
    showNotification,
    validateField,
    isValidEmail,
    isValidPhoneNumber,
    isValidPassword,
    sanitizeInput,
    formatPhoneNumber
};