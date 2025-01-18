// DOM Elements
const welcomeCard = document.getElementById('welcomeCard');
const closeWelcome = document.getElementById('closeWelcome');
const emailInput = document.getElementById('emailInput');
const emailError = document.getElementById('emailError');
const generateButton = document.getElementById('generateButton');
const buttonText = generateButton.querySelector('.button-text');
const buttonLoader = generateButton.querySelector('.button-loader');
const emailList = document.getElementById('emailList');
const loadingIndicator = document.getElementById('loadingIndicator');
const resultsSection = document.getElementById('resultsSection');
const copyAllButton = document.getElementById('copyAllButton');
const downloadButton = document.getElementById('downloadButton');
const toast = document.getElementById('toast');
const toastMessage = toast.querySelector('.toast-message');

// Stats Elements
const statsCard = document.getElementById('statsCard');
const totalAliasesElement = document.getElementById('totalAliases');
const dotCountElement = document.getElementById('dotCount');
const prefixCountElement = document.getElementById('prefixCount');
const suffixCountElement = document.getElementById('suffixCount');

// Settings Elements
const dotVariationsCheckbox = document.getElementById('dotVariations');
const prefixVariationsCheckbox = document.getElementById('prefixVariations');
const suffixVariationsCheckbox = document.getElementById('suffixVariations');
const yearVariationsCheckbox = document.getElementById('yearVariations');
const maxVariationsSlider = document.getElementById('maxVariations');
const maxVariationsValue = document.getElementById('maxVariationsValue');

// Settings Controls
const settingsButton = document.getElementById('settingsButton');
const settingsMenu = document.getElementById('settingsMenu');
const closeSettings = document.getElementById('closeSettings');
const themeToggle = document.getElementById('themeToggle');
const viewToggle = document.getElementById('viewToggle');

// User Manual Functionality
const userManualButton = document.getElementById('userManualButton');
const userManualModal = document.getElementById('userManualModal');
const closeManual = document.getElementById('closeManual');

userManualButton.addEventListener('click', (e) => {
    e.preventDefault();
    userManualModal.classList.add('show');
    // Add a nice animation to the email icon
    const emailIcon = userManualButton.querySelector('.material-icons-round');
    emailIcon.style.transform = 'scale(1.2) rotate(-10deg)';
    setTimeout(() => {
        emailIcon.style.transform = 'scale(1) rotate(0deg)';
    }, 300);
});

closeManual.addEventListener('click', () => {
    userManualModal.classList.remove('show');
});

// Close modal when clicking outside
userManualModal.addEventListener('click', (e) => {
    if (e.target === userManualModal) {
        userManualModal.classList.remove('show');
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && userManualModal.classList.contains('show')) {
        userManualModal.classList.remove('show');
    }
});

// Set default preferences (always start in light mode)
document.documentElement.setAttribute('data-theme', 'light');
document.documentElement.setAttribute('data-view', localStorage.getItem('view') || 'expanded');
document.documentElement.setAttribute('data-color-scheme', localStorage.getItem('colorScheme') || 'default');

// Initialize UI state
const updateUIState = () => {
    // Theme state
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('.theme-icon');
        const themeText = themeToggle.querySelector('.option-text');
        
        if (themeIcon) {
            themeIcon.textContent = currentTheme === 'dark' ? 'light_mode' : 'dark_mode';
        }
        if (themeText) {
            themeText.textContent = currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
        }
    }

    // View state
    const currentView = document.documentElement.getAttribute('data-view');
    if (viewToggle) {
        const viewIcon = viewToggle.querySelector('.material-icons-round');
        const viewText = viewToggle.querySelector('span:last-child');
        
        if (viewIcon) {
            viewIcon.textContent = currentView === 'compact' ? 'view_agenda' : 'view_compact';
        }
        if (viewText) {
            viewText.textContent = currentView === 'compact' ? 'Expanded View' : 'Compact View';
        }
    }
};

// Initialize UI
updateUIState();

// Initialize checkbox states from localStorage or set defaults
const initCheckbox = (checkbox, key) => {
    const savedState = localStorage.getItem(key);
    // Only Dot Variations should be checked by default
    const defaultState = key === 'dotVariations' ? true : false;
    checkbox.checked = savedState === null ? defaultState : savedState === 'true';
};

// Initialize all checkboxes
initCheckbox(dotVariationsCheckbox, 'dotVariations');
initCheckbox(prefixVariationsCheckbox, 'prefixVariations');
initCheckbox(suffixVariationsCheckbox, 'suffixVariations');
initCheckbox(yearVariationsCheckbox, 'yearVariations');

// Initialize slider value
const savedMaxVariations = localStorage.getItem('maxVariations');
if (savedMaxVariations) {
    maxVariationsSlider.value = savedMaxVariations;
    maxVariationsValue.textContent = savedMaxVariations;
} else {
    maxVariationsSlider.value = '100';
    maxVariationsValue.textContent = '100';
    localStorage.setItem('maxVariations', '100');
}

// Add event listeners for variation checkboxes
dotVariationsCheckbox.addEventListener('change', (e) => {
    localStorage.setItem('dotVariations', e.target.checked);
});

prefixVariationsCheckbox.addEventListener('change', (e) => {
    localStorage.setItem('prefixVariations', e.target.checked);
});

suffixVariationsCheckbox.addEventListener('change', (e) => {
    localStorage.setItem('suffixVariations', e.target.checked);
});

yearVariationsCheckbox.addEventListener('change', (e) => {
    localStorage.setItem('yearVariations', e.target.checked);
});

// Update max variations value display
maxVariationsSlider.addEventListener('input', () => {
    maxVariationsValue.textContent = maxVariationsSlider.value;
});

// Validate email input
function isValidGmail(email) {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
}

// Show toast message
function showToast(message, duration = 3000) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Copy text to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!');
    } catch (err) {
        showToast('Failed to copy to clipboard');
    }
}

// Download aliases as text file
function downloadAliases(aliases) {
    const content = aliases.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gmail-aliases.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Aliases downloaded!');
}

// Common prefixes (from Android app)
const commonPrefixes = [
    'the', 'mr', 'ms', 'dr', 'real', 'official', 'its', 'im', 'original', 'contact',
    'business', 'pro', 'premium', 'vip', 'main', 'my', 'our', 'your', 'their', 'his',
    'her', 'its', 'cool', 'best', 'top', 'prime', 'elite', 'super', 'ultra', 'mega',
    'max', 'mini', 'global', 'local', 'world', 'web', 'net', 'cyber', 'digital', 'smart',
    'tech', 'first', 'last', 'next', 'new', 'old', 'young', 'fresh', 'true', 'pure',
    'just', 'only', 'all', 'every'
];

// Common suffixes (from Android app)
const commonSuffixes = [
    'official', 'real', 'original', 'main', 'primary', 'backup', 'alt', 'alternative',
    'business', 'work', 'personal', 'private', 'public', 'contact', 'support', 'help',
    'info', 'admin', 'office', 'sales', 'marketing', 'dev', 'test', 'demo', 'temp',
    'pro', 'plus', 'premium', 'vip', 'basic', 'free', 'paid', 'secure', 'verified',
    'team', 'group', 'staff', 'member', 'user', 'client', 'customer', 'guest',
    'web', 'online', 'digital', 'tech', 'net', 'cyber', 'cloud', 'mobile', 'app',
    'service', 'system', 'network', 'global', 'local', 'world', 'zone', 'area', 'region'
];

// Generate dot variations
function generateDotVariations(localPart) {
    const variations = new Set([localPart]);
    const chars = localPart.split('');
    
    // Function to generate combinations of positions for dots
    function generateCombinations(arr, r) {
        const combinations = [];
        const data = new Array(r);
        
        function backtrack(start, index) {
            if (index === r) {
                combinations.push([...data]);
                return;
            }
            
            for (let i = start; i < arr.length; i++) {
                data[index] = arr[i];
                backtrack(i + 1, index + 1);
            }
        }
        
        backtrack(0, 0);
        return combinations;
    }
    
    // Generate positions where dots can be inserted
    const positions = [];
    for (let i = 1; i < chars.length; i++) {
        positions.push(i);
    }
    
    // Generate all possible combinations of dot positions
    for (let numDots = 1; numDots < chars.length; numDots++) {
        const dotCombinations = generateCombinations(positions, numDots);
        
        dotCombinations.forEach(combination => {
            const newVariation = [...chars];
            combination.forEach((pos, index) => {
                newVariation.splice(pos + index, 0, '.');
            });
            variations.add(newVariation.join(''));
        });
    }

    // Add variations with dots between each character
    variations.add(chars.join('.'));
    
    // Generate variations with multiple consecutive dots
    for (let i = 1; i < chars.length; i++) {
        const withDoubleDot = [...chars];
        withDoubleDot.splice(i, 0, '..');
        variations.add(withDoubleDot.join(''));
        
        const withTripleDot = [...chars];
        withTripleDot.splice(i, 0, '...');
        variations.add(withTripleDot.join(''));
    }

    return [...variations];
}

// Generate plus variations
function generatePlusVariations(localPart) {
    const variations = new Set();
    const commonLabels = [
        'alias', 'filter', 'newsletter', 'social', 'shopping',
        'work', 'personal', 'business', 'spam', 'important',
        'bills', 'receipts', 'subscriptions', 'notifications',
        'backup', 'main', 'alt', 'temp', 'test', 'info',
        'contact', 'support', 'admin', 'sales', 'marketing',
        'dev', 'help', 'noreply', 'account', 'service'
    ];

    commonLabels.forEach(label => {
        variations.add(`${localPart}+${label}`);
        // Add number variations
        variations.add(`${localPart}+${label}1`);
        variations.add(`${localPart}+${label}2`);
        variations.add(`${localPart}+${label}01`);
    });

    return [...variations];
}

// Generate email aliases
function generateAliases(email) {
    const [localPart, domain] = email.split('@');
    let aliases = new Set();

    // Add original email
    aliases.add(email);

    // Generate dot variations
    if (dotVariationsCheckbox.checked) {
        const dotVariations = generateDotVariations(localPart);
        dotVariations.forEach(variation => {
            aliases.add(`${variation}@${domain}`);
            
            // Combine dot variations with plus variations
            if (prefixVariationsCheckbox.checked) {
                const plusVariations = generatePlusVariations(variation);
                plusVariations.forEach(plusVariation => {
                    aliases.add(`${plusVariation}@${domain}`);
                });
            }
        });
    }

    // Generate plus variations for original email
    if (prefixVariationsCheckbox.checked) {
        const plusVariations = generatePlusVariations(localPart);
        plusVariations.forEach(variation => {
            aliases.add(`${variation}@${domain}`);
        });
    }

    // Remove any invalid variations and duplicates
    aliases = new Set([...aliases].filter(alias => {
        const [local] = alias.split('@');
        // Only allow variations with dots and plus signs
        return local.split('').every(char => 
            char === '.' || 
            char === '+' || 
            char.match(/[a-zA-Z0-9]/) ||
            local.startsWith(localPart.split('+')[0].replace(/\./g, ''))
        );
    }));

    // Convert to array and limit by maxVariations
    let aliasArray = [...aliases];
    const maxVariations = parseInt(maxVariationsSlider.value);
    return aliasArray.slice(0, maxVariations);
}

// Generate suffix variations
function generateSuffixVariations(localPart) {
    const variations = new Set();
    
    commonSuffixes.forEach(suffix => {
        variations.add(`${localPart}.${suffix}`);
        variations.add(`${localPart}_${suffix}`);
        variations.add(`${localPart}${suffix}`);
    });
    
    return Array.from(variations);
}

// Generate year variations
function generateYearVariations(localPart) {
    const variations = new Set();
    const currentYear = new Date().getFullYear();
    const years = [];
    
    // Add last 5 years and next 2 years
    for (let year = currentYear - 5; year <= currentYear + 2; year++) {
        years.push(year);
        years.push(year.toString().slice(-2)); // Add 2-digit year
    }
    
    years.forEach(year => {
        variations.add(`${localPart}${year}`);
        variations.add(`${localPart}.${year}`);
        variations.add(`${localPart}_${year}`);
    });
    
    return Array.from(variations);
}

// Update statistics
function updateStats(aliases) {
    const baseEmail = emailInput.value.trim().split('@')[0];
    const dotCount = aliases.filter(email => {
        const localPart = email.split('@')[0];
        return localPart.includes('.') && !localPart.includes('_') && 
               !commonPrefixes.some(p => localPart.startsWith(p)) &&
               !commonSuffixes.some(s => localPart.endsWith(s));
    }).length;

    const prefixCount = aliases.filter(email => {
        const localPart = email.split('@')[0];
        return commonPrefixes.some(prefix => 
            localPart.startsWith(prefix + '.') || 
            localPart.startsWith(prefix + '_') || 
            localPart.startsWith(prefix)
        );
    }).length;

    const suffixCount = aliases.filter(email => {
        const localPart = email.split('@')[0];
        return commonSuffixes.some(suffix => 
            localPart.endsWith('.' + suffix) || 
            localPart.endsWith('_' + suffix) || 
            localPart.endsWith(suffix)
        );
    }).length;

    totalAliasesElement.textContent = aliases.length;
    dotCountElement.textContent = dotCount;
    prefixCountElement.textContent = prefixCount;
    suffixCountElement.textContent = suffixCount;
}

// Handle generate button click
generateButton.addEventListener('click', () => {
    const email = emailInput.value.trim();
    
    if (!email) {
        showToast('Please enter an email address');
        return;
    }
    
    if (!isValidGmail(email)) {
        showToast('Please enter a valid Gmail address');
        return;
    }
    
    generateButton.disabled = true;
    buttonText.textContent = 'Generating...';
    buttonLoader.style.display = 'block';

    emailList.innerHTML = '';
    resultsSection.style.display = 'none';

    setTimeout(() => {
        const aliases = generateAliases(email);
        
        aliases.forEach(alias => {
            emailList.appendChild(createEmailItem(alias));
        });

        updateStats(aliases);

        resultsSection.style.display = 'block';

        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        generateButton.disabled = false;
        buttonText.textContent = 'Generate Aliases';
        buttonLoader.style.display = 'none';
        
        copyAllButton.onclick = () => copyToClipboard(aliases.join('\n'));
        
        downloadButton.onclick = () => downloadAliases(aliases);
        
    }, 1000); // Simulate processing time
});

// Add input validation
emailInput.addEventListener('input', () => {
    const email = emailInput.value.trim();
    const errorElement = document.getElementById('emailError');
    
    if (!isValidGmail(email)) {
        errorElement.textContent = 'Please enter a valid Gmail address';
        generateButton.disabled = true;
    } else {
        errorElement.textContent = '';
        generateButton.disabled = false;
    }
});

// Settings menu handlers
if (settingsButton) {
    settingsButton.addEventListener('click', () => {
        settingsMenu.classList.add('show');
    });
}

if (closeSettings) {
    closeSettings.addEventListener('click', () => {
        settingsMenu.classList.remove('show');
    });
}

// Close settings when clicking outside
document.addEventListener('click', (e) => {
    if (settingsMenu && !settingsMenu.contains(e.target) && !settingsButton.contains(e.target)) {
        settingsMenu.classList.remove('show');
    }
});

// Theme toggle handler
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Update the icon and text
        const themeIcon = themeToggle.querySelector('.theme-icon');
        const themeText = themeToggle.querySelector('.option-text');
        
        if (themeIcon) {
            themeIcon.textContent = newTheme === 'dark' ? 'light_mode' : 'dark_mode';
        }
        if (themeText) {
            themeText.textContent = newTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
        }
    });
}

// View toggle handler
if (viewToggle) {
    viewToggle.addEventListener('click', () => {
        const currentView = document.documentElement.getAttribute('data-view');
        const newView = currentView === 'compact' ? 'expanded' : 'compact';
        document.documentElement.setAttribute('data-view', newView);
        localStorage.setItem('view', newView);
        updateUIState();
    });
}

// Color scheme handlers
document.querySelectorAll('.scheme-option').forEach(button => {
    button.addEventListener('click', () => {
        const scheme = button.dataset.scheme;
        document.documentElement.setAttribute('data-color-scheme', scheme);
        localStorage.setItem('colorScheme', scheme);
        showToast(`Color scheme changed to ${scheme}`);
    });
});

// Create email item element
function createEmailItem(email) {
    const emailCard = document.createElement('div');
    emailCard.className = 'email-card';

    const emailContent = document.createElement('div');
    emailContent.className = 'email-content';

    const emailText = document.createElement('span');
    emailText.className = 'email-text';
    emailText.textContent = email;

    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.title = 'Copy to clipboard';
    copyButton.innerHTML = '<span class="material-icons-round">content_copy</span>';
    
    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(email).then(() => {
            showToast('Email copied to clipboard!');
        }).catch(() => {
            showToast('Failed to copy email');
        });
    });

    emailContent.appendChild(emailText);
    emailContent.appendChild(copyButton);
    emailCard.appendChild(emailContent);

    return emailCard;
}
