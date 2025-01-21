// DOM Elements
const amountInput = document.getElementById('amount');
const periodSelect = document.getElementById('period');
const currencySelect = document.getElementById('currency');
const realTimeDisplay = document.getElementById('real-time');
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

// Currency symbols
const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    PLN: 'zł',
    JPY: '¥',
    CNY: '¥',
    AUD: '$',
    CAD: '$',
    CHF: 'Fr',
    HKD: '$',
    NZD: '$',
    SEK: 'kr',
    KRW: '₩',
    SGD: '$',
    NOK: 'kr',
    MXN: '$',
    INR: '₹',
    RUB: '₽',
    ZAR: 'R',
    TRY: '₺'
};

let startTime;
let baseAmount = 0;
let currentPeriod = 'hour';
let currentCurrency = 'USD';

// Load saved settings
function loadSavedSettings() {
    const savedSettings = JSON.parse(localStorage.getItem('salarySettings'));
    if (savedSettings) {
        amountInput.value = savedSettings.amount;
        periodSelect.value = savedSettings.period;
        currencySelect.value = savedSettings.currency;
        
        baseAmount = parseFloat(savedSettings.amount) || 0;
        currentPeriod = savedSettings.period;
        currentCurrency = savedSettings.currency;
        
        startTime = new Date();
        updateCalculations();
    }
}

// Save settings
function saveSettings() {
    const settings = {
        amount: amountInput.value,
        period: periodSelect.value,
        currency: currencySelect.value
    };
    localStorage.setItem('salarySettings', JSON.stringify(settings));
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

// Format number with currency
function formatCurrency(amount) {
    const symbol = currencySymbols[currentCurrency];
    return `${symbol}${amount.toFixed(2)}`;
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
}

// Event Listeners
amountInput.addEventListener('input', () => {
    baseAmount = parseFloat(amountInput.value) || 0;
    startTime = new Date();
    updateCalculations();
    saveSettings();
});

periodSelect.addEventListener('change', () => {
    currentPeriod = periodSelect.value;
    startTime = new Date();
    updateCalculations();
    saveSettings();
});

currencySelect.addEventListener('change', () => {
    currentCurrency = currencySelect.value;
    updateCalculations();
    saveSettings();
});

// Initialize
loadSavedSettings();

// Update real-time earnings every 100ms
setInterval(updateRealTimeEarnings, 100); 