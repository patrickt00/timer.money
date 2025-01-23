// Theme Toggle
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Load saved theme with error handling
    function loadTheme() {
        try {
            const savedTheme = localStorage.getItem('theme') || 'light';
            html.setAttribute('data-theme', savedTheme);
        } catch (e) {
            console.warn('Could not load theme from localStorage:', e);
            html.setAttribute('data-theme', 'light');
        }
    }

    // Toggle theme with error handling
    themeToggle.addEventListener('click', () => {
        try {
            const currentTheme = html.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        } catch (e) {
            console.warn('Could not save theme to localStorage:', e);
        }
    });

    // DOM Elements
    const amountInput = document.getElementById('amount');
    const periodSelect = document.getElementById('period');
    const currencySelect = document.getElementById('currency');
    const realTimeDisplay = document.getElementById('real-time');
    const timerDisplay = document.getElementById('timer');
    const perHour = document.getElementById('per-hour');
    const perDay = document.getElementById('per-day');
    const perWeek = document.getElementById('per-week');
    const perMonth = document.getElementById('per-month');
    const perYear = document.getElementById('per-year');

    // Constants for calculations
    const HOURS_PER_DAY = 8;
    const DAYS_PER_WEEK = 5;
    const WEEKS_PER_MONTH = 4;
    const MONTHS_PER_YEAR = 12;

    // Currency symbols with fallback
    const currencySymbols = {
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'PLN': 'zł',
        'JPY': '¥',
        'CNY': '¥',
        'AUD': '$',
        'CAD': '$',
        'CHF': 'Fr',
        'HKD': '$',
        'NZD': '$',
        'SEK': 'kr',
        'KRW': '₩',
        'SGD': '$',
        'NOK': 'kr',
        'MXN': '$',
        'INR': '₹',
        'RUB': '₽',
        'ZAR': 'R',
        'TRY': '₺'
    };

    let startTime = new Date();
    let baseAmount = 0;
    let currentPeriod = 'hour';
    let currentCurrency = 'USD';

    // Load saved settings with error handling
    function loadSavedSettings() {
        try {
            const savedSettings = JSON.parse(localStorage.getItem('salarySettings'));
            if (savedSettings) {
                if (savedSettings.amount) {
                    amountInput.value = savedSettings.amount;
                    baseAmount = parseFloat(savedSettings.amount) || 0;
                }
                if (savedSettings.period && periodSelect.querySelector(`option[value="${savedSettings.period}"]`)) {
                    periodSelect.value = savedSettings.period;
                    currentPeriod = savedSettings.period;
                }
                if (savedSettings.currency && currencySelect.querySelector(`option[value="${savedSettings.currency}"]`)) {
                    currencySelect.value = savedSettings.currency;
                    currentCurrency = savedSettings.currency;
                }
                startTime = new Date();
                updateCalculations();
            }
        } catch (e) {
            console.warn('Could not load settings from localStorage:', e);
            startTime = new Date();
            updateCalculations();
        }
    }

    // Save settings with error handling
    function saveSettings() {
        try {
            const settings = {
                amount: amountInput.value,
                period: periodSelect.value,
                currency: currencySelect.value
            };
            localStorage.setItem('salarySettings', JSON.stringify(settings));
        } catch (e) {
            console.warn('Could not save settings to localStorage:', e);
        }
    }

    // Format number with currency and fallback
    function formatCurrency(amount) {
        const symbol = currencySymbols[currentCurrency] || currentCurrency;
        return `${symbol}${amount.toFixed(2)}`;
    }

    // Convert any period to per hour rate
    function getHourlyRate(amount, period) {
        switch (period) {
            case 'hour':
                return amount;
            case 'day':
                return amount / HOURS_PER_DAY;
            case 'week':
                return amount / (HOURS_PER_DAY * DAYS_PER_WEEK);
            case 'month':
                return amount / (HOURS_PER_DAY * DAYS_PER_WEEK * WEEKS_PER_MONTH);
            case 'year':
                return amount / (HOURS_PER_DAY * DAYS_PER_WEEK * WEEKS_PER_MONTH * MONTHS_PER_YEAR);
            default:
                return 0;
        }
    }

    // Format time to HH:MM:SS
    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // Update timer display
    function updateTimer() {
        if (!startTime || baseAmount <= 0) {
            timerDisplay.textContent = '00:00:00';
            return;
        }
        const currentTime = new Date();
        const secondsElapsed = Math.floor((currentTime - startTime) / 1000);
        timerDisplay.textContent = formatTime(secondsElapsed);
    }

    // Update all calculations
    function updateCalculations() {
        const hourlyRate = getHourlyRate(baseAmount, currentPeriod);
        
        // Update all period displays
        perHour.textContent = formatCurrency(hourlyRate);
        perDay.textContent = formatCurrency(hourlyRate * HOURS_PER_DAY);
        perWeek.textContent = formatCurrency(hourlyRate * HOURS_PER_DAY * DAYS_PER_WEEK);
        perMonth.textContent = formatCurrency(hourlyRate * HOURS_PER_DAY * DAYS_PER_WEEK * WEEKS_PER_MONTH);
        perYear.textContent = formatCurrency(hourlyRate * HOURS_PER_DAY * DAYS_PER_WEEK * WEEKS_PER_MONTH * MONTHS_PER_YEAR);
    }

    // Update real-time earnings
    function updateRealTimeEarnings() {
        if (!startTime || baseAmount <= 0) return;
        
        const hourlyRate = getHourlyRate(baseAmount, currentPeriod);
        const secondRate = hourlyRate / 3600; // Convert hourly rate to per second
        
        const currentTime = new Date();
        const secondsElapsed = (currentTime - startTime) / 1000;
        const earned = secondRate * secondsElapsed;
        
        realTimeDisplay.textContent = formatCurrency(earned);
        updateTimer();
    }

    // Event Listeners
    amountInput.addEventListener('input', () => {
        baseAmount = parseFloat(amountInput.value) || 0;
        startTime = baseAmount > 0 ? new Date() : null;
        updateCalculations();
        updateTimer();
        saveSettings();
    });

    periodSelect.addEventListener('change', () => {
        currentPeriod = periodSelect.value;
        startTime = new Date();
        updateCalculations();
        updateTimer();
        saveSettings();
    });

    currencySelect.addEventListener('change', () => {
        currentCurrency = currencySelect.value;
        updateCalculations();
        updateTimer();
        saveSettings();
    });

    // Initialize
    loadTheme();
    loadSavedSettings();

    // Update real-time earnings every 100ms
    setInterval(updateRealTimeEarnings, 100);
}); 