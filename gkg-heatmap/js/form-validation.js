// Form validation and enhancement script
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('gkgForm');
    const emailInput = document.getElementById('email');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const includeAllInput = document.getElementById('includeAll');
    const includeAnyInput = document.getElementById('includeAny');
    const submitBtn = document.querySelector('.submit-btn');

    // Set today's date as max for date inputs
    const today = new Date().toISOString().split('T')[0];
    startDateInput.max = today;
    endDateInput.max = today;

    // Set default date range (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const defaultStartDate = thirtyDaysAgo.toISOString().split('T')[0];
    
    startDateInput.value = defaultStartDate;
    endDateInput.value = today;

    // Email validation
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Date validation
    function validateDates() {
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);
        const minDate = new Date('2013-04-01');
        const maxDate = new Date(today);

        if (startDate < minDate || endDate < minDate) {
            return 'Dates must be on or after April 1, 2013';
        }

        if (startDate > maxDate || endDate > maxDate) {
            return 'Dates cannot be in the future';
        }

        if (startDate > endDate) {
            return 'Start date must be before or equal to end date';
        }

        return null;
    }

    // Search criteria validation
    function validateSearchCriteria() {
        const includeAll = includeAllInput.value.trim();
        const includeAny = includeAnyInput.value.trim();

        if (!includeAll && !includeAny) {
            return 'You must specify at least one search criterion in either "Include ALL OF" or "Include AT LEAST ONE OF"';
        }

        return null;
    }

    // Show error message
    function showError(input, message) {
        input.classList.add('invalid');
        let errorElement = input.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            input.parentNode.insertBefore(errorElement, input.nextSibling);
        }
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    // Clear error message
    function clearError(input) {
        input.classList.remove('invalid');
        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    // Real-time validation
    emailInput.addEventListener('blur', function() {
        if (this.value && !validateEmail(this.value)) {
            showError(this, 'Please enter a valid email address');
        } else {
            clearError(this);
        }
    });

    emailInput.addEventListener('input', function() {
        if (this.classList.contains('invalid') && validateEmail(this.value)) {
            clearError(this);
        }
    });

    startDateInput.addEventListener('change', function() {
        const dateError = validateDates();
        if (dateError) {
            showError(this, dateError);
        } else {
            clearError(this);
            clearError(endDateInput);
        }
    });

    endDateInput.addEventListener('change', function() {
        const dateError = validateDates();
        if (dateError) {
            showError(this, dateError);
        } else {
            clearError(this);
            clearError(startDateInput);
        }
    });

    // Clear search criteria errors when typing
    [includeAllInput, includeAnyInput].forEach(input => {
        input.addEventListener('input', function() {
            if (this.classList.contains('invalid')) {
                const searchError = validateSearchCriteria();
                if (!searchError) {
                    clearError(includeAllInput);
                    clearError(includeAnyInput);
                }
            }
        });
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Clear all previous errors
        document.querySelectorAll('.form-control').forEach(input => {
            clearError(input);
        });

        let isValid = true;
        const errors = [];

        // Validate email
        if (!emailInput.value.trim()) {
            showError(emailInput, 'Email address is required');
            isValid = false;
        } else if (!validateEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate dates
        const dateError = validateDates();
        if (dateError) {
            showError(startDateInput, dateError);
            isValid = false;
        }

        // Validate search criteria
        const searchError = validateSearchCriteria();
        if (searchError) {
            showError(includeAllInput, searchError);
            isValid = false;
        }

        if (!isValid) {
            // Scroll to first error
            const firstError = document.querySelector('.form-control.invalid');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Processing Request...';
        submitBtn.disabled = true;

        // Simulate form submission (in real implementation, this would submit to the PERL script)
        setTimeout(() => {
            // Show success message
            showSuccessMessage();
            
            // Reset loading state
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Generate Heatmap';
            submitBtn.disabled = false;

            // In a real implementation, you would submit the form data to the PERL backend:
            // this.submit();
        }, 2000);
    });

    function showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div class="success-content">
                <h3>Request Submitted Successfully!</h3>
                <p>Your heatmap generation request has been submitted. You will receive an email at <strong>${emailInput.value}</strong> with your results, typically within 10 minutes.</p>
                <p>The email will contain:</p>
                <ul>
                    <li>Interactive heatmap visualization (HTML file)</li>
                    <li>CSV data file for GIS software</li>
                    <li>Processing summary and statistics</li>
                </ul>
            </div>
        `;

        // Style the success message
        successMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            max-width: 500px;
            width: 90%;
        `;

        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(successMessage);

        // Add styles for success message content
        const style = document.createElement('style');
        style.textContent = `
            .success-content h3 {
                color: #48bb78;
                margin-bottom: 1rem;
            }
            .success-content p {
                margin-bottom: 1rem;
                color: #4a5568;
            }
            .success-content ul {
                margin-left: 1.5rem;
                color: #4a5568;
            }
            .success-content li {
                margin-bottom: 0.5rem;
            }
        `;
        document.head.appendChild(style);

        // Close on overlay click
        overlay.addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.body.removeChild(successMessage);
        });

        // Auto close after 10 seconds
        setTimeout(() => {
            if (document.body.contains(successMessage)) {
                document.body.removeChild(overlay);
                document.body.removeChild(successMessage);
            }
        }, 10000);
    }

    // Keyword input enhancements
    function enhanceKeywordInput(input) {
        input.addEventListener('input', function() {
            // Auto-format keywords (trim spaces around commas)
            let value = this.value;
            value = value.replace(/\s*,\s*/g, ', ');
            if (value !== this.value) {
                const cursorPos = this.selectionStart;
                this.value = value;
                this.setSelectionRange(cursorPos, cursorPos);
            }
        });

        // Add placeholder enhancements
        input.addEventListener('focus', function() {
            if (this.id === 'includeAll') {
                this.placeholder = 'e.g., Nigeria, Vladimir Putin, WATER_SECURITY';
            } else if (this.id === 'includeAny') {
                this.placeholder = 'e.g., FOOD_SECURITY, CLIMATE_CHANGE';
            } else if (this.id === 'exclude') {
                this.placeholder = 'e.g., Barack Obama, Edward Snowden';
            }
        });

        input.addEventListener('blur', function() {
            this.placeholder = 'Enter keywords separated by commas';
        });
    }

    // Enhance all keyword inputs
    [includeAllInput, includeAnyInput, document.getElementById('exclude')].forEach(enhanceKeywordInput);

    // Add tooltips for complex fields
    addTooltips();

    function addTooltips() {
        const tooltipData = {
            'weighting': 'Choose how to weight location importance in your heatmap',
            'email': 'Results will be sent to this email address',
            'startDate': 'GKG data is available from April 1, 2013',
            'endDate': 'Latest date allowed is today'
        };

        Object.keys(tooltipData).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.title = tooltipData[id];
            }
        });
    }
});