const steps = {
  dashboard: null,
  helpers: null,
  review: null,
};

const screens = {
  dashboard: document.getElementById('screen-dashboard'),
  helpers: document.getElementById('screen-helpers'),
  selection: document.getElementById('screen-selection'),
  completed: document.getElementById('screen-completed'),
  confirmation: document.getElementById('screen-confirmation'),
  payment: document.getElementById('screen-payment'),
  reviews: document.getElementById('screen-reviews'),
  leaderboard: document.getElementById('screen-leaderboard'),
};

const navButtons = document.querySelectorAll('[data-screen]');
const selectedNameElement = document.getElementById('selectedName');
const selectedRatingElement = document.getElementById('selectedRating');
const btnFindHelpers = document.getElementById('btnFindHelpers');
const btnReleasePayment = document.getElementById('btnReleasePayment');
const confirmHelper = document.getElementById('confirmHelper');
const confirmSeeker = document.getElementById('confirmSeeker');
const progressText = document.getElementById('progressText');
const progressSummary = document.getElementById('progressSummary');

const screenOrder = ['dashboard', 'helpers', 'selection', 'completed', 'confirmation', 'payment', 'reviews', 'leaderboard'];
const unlocked = {
  dashboard: true,
  helpers: false,
  selection: false,
  completed: false,
  confirmation: false,
  payment: false,
  reviews: false,
  leaderboard: false,
};

let currentHelper = 'Amit Sharma';
let currentRating = '4.9';
let currentStatus = 'Open';
// Compute relevant start and scheduled date/time (defaults: start in 30m, scheduled end in 2h)
const jobScheduleElem = document.getElementById('jobSchedule');
const assignedScheduleElem = document.getElementById('assignedSchedule');

function formatDate(d) {
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatTime(d) {
  const t = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  // convert 'AM'/'PM' to 'a.m'/'p.m'
  return t.replace(/AM|PM/, (m) => m.toLowerCase().replace('am', 'a.m').replace('pm', 'p.m'));
}

const defaultStart = new Date(Date.now() + 30 * 60 * 1000);
const defaultEnd = new Date(Date.now() + 2 * 60 * 60 * 1000);
const dateStr = formatDate(defaultStart);
const startStr = formatTime(defaultStart);
const endStr = formatTime(defaultEnd);
const jobSchedule = `${dateStr} :- ${startStr} - ${endStr}`;
if (jobScheduleElem) jobScheduleElem.textContent = jobSchedule;
if (assignedScheduleElem) assignedScheduleElem.textContent = 'To be assigned';

function updateNavigation() {
  navButtons.forEach((button) => {
    const key = button.dataset.screen.replace('screen-', '');
    button.disabled = !unlocked[key];
    button.classList.toggle('disabled', !unlocked[key]);
    button.classList.toggle('btn-outline-secondary', !unlocked[key]);
    button.classList.toggle('btn-outline-primary', unlocked[key]);
  });
}

function showScreen(screenId) {
  const step = screenId.replace('screen-', '');
  if (!unlocked[step]) {
    return;
  }
  Object.values(screens).forEach((screen) => {
    screen.classList.remove('active-screen');
  });
  screens[step].classList.add('active-screen');
  navButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.screen === screenId);
  });
  updateProgress(step);
}

function updateStepIndicator(step) {
  // No visual step badges are used in the current layout.
}

function updateProgress(step = 'dashboard') {
  const index = screenOrder.indexOf(step) + 1;
  const percent = (index / screenOrder.length) * 100;
  progressText.textContent = `${index} of ${screenOrder.length} steps`;
  progressSummary.textContent = `Step ${index} of ${screenOrder.length}`;
  const progressBar = document.querySelector('.progress-bar');
  if (progressBar) {
    progressBar.style.width = `${percent}%`;
  }
}

function unlockStep(step) {
  if (!unlocked[step]) {
    unlocked[step] = true;
    updateNavigation();
  }
}

function selectHelper(name) {
  currentHelper = name;
  currentRating = name === 'Priya Verma' ? '4.8' : name === 'Rohan Das' ? '4.7' : '4.9';
  selectedNameElement.textContent = currentHelper;
  selectedRatingElement.textContent = currentRating;
  unlockStep('selection');
  // When a helper is selected, show the selection screen and populate assigned schedule
  if (assignedScheduleElem) assignedScheduleElem.textContent = jobSchedule;
  showScreen('screen-selection');
}

function completeTask() {
  currentStatus = 'Completed';
  unlockStep('completed');
  showScreen('screen-completed');
}

function updateReleaseButton() {
  btnReleasePayment.disabled = !(confirmHelper.checked && confirmSeeker.checked);
}

function releasePayment() {
  unlockStep('payment');
  unlockStep('reviews');
  showScreen('screen-payment');
}

function finishReviews() {
  unlockStep('leaderboard');
  showScreen('screen-leaderboard');
}

navButtons.forEach((button) => {
  button.addEventListener('click', () => showScreen(button.dataset.screen));
});

btnFindHelpers.addEventListener('click', () => {
  unlockStep('helpers');
  showScreen('screen-helpers');
});

updateNavigation();
showScreen('screen-dashboard');
