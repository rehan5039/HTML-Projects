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

// Generate dot variations
function generateDotVariations(localPart) {
    const positions = [];
    for (let i = 1; i < localPart.length; i++) {
        positions.push(i);
    }
    
    const variations = new Set([localPart]);
    const maxDots = Math.min(3, positions.length); // Limit to 3 dots max
    
    for (let i = 1; i <= maxDots; i++) {
        const combos = getCombinations(positions, i);
        for (const combo of combos) {
            let variation = localPart;
            let offset = 0;
            for (const pos of combo) {
                variation = variation.slice(0, pos + offset) + '.' + variation.slice(pos + offset);
                offset++;
            }
            variations.add(variation);
        }
    }
    
    return Array.from(variations);
}

// Generate prefix variations
function generatePrefixVariations(localPart) {
    const prefixes = ['info', 'contact', 'admin', 'support', 'no.reply', 'noreply'];
    return prefixes.map(prefix => `${prefix}+${localPart}`);
}

// Generate suffix variations
function generateSuffixVariations(localPart) {
    const suffixes = ['work', 'personal', 'social', 'shopping', 'spam'];
    return suffixes.map(suffix => `${localPart}+${suffix}`);
}

// Generate year variations
function generateYearVariations(localPart) {
    const currentYear = new Date().getFullYear();
    const years = [
        currentYear,
        currentYear - 1,
        currentYear + 1
    ];
    return years.map(year => `${localPart}${year}`);
}

// Get combinations helper function
function getCombinations(arr, k) {
    const combinations = [];
    
    function backtrack(start, combo) {
        if (combo.length === k) {
            combinations.push([...combo]);
            return;
        }
        
        for (let i = start; i < arr.length; i++) {
            combo.push(arr[i]);
            backtrack(i + 1, combo);
            combo.pop();
        }
    }
    
    backtrack(0, []);
    return combinations;
}

// Create email card element
function createEmailCard(email) {
    const card = document.createElement('div');
    card.className = 'email-card';
    
    const emailText = document.createElement('span');
    emailText.className = 'email-text';
    emailText.textContent = email;
    
    const copyButton = document.createElement('button');
    copyButton.className = 'action-button';
    copyButton.innerHTML = '<span class="material-icons-round">content_copy</span>';
    copyButton.addEventListener('click', () => copyToClipboard(email));
    
    card.appendChild(emailText);
    card.appendChild(copyButton);
    return card;
}

// Generate email aliases
function generateAliases(email) {
    const [localPart, domain] = email.split('@');
    let aliases = new Set([email]);
    
    if (dotVariationsCheckbox.checked) {
        const dotVariations = generateDotVariations(localPart);
        dotVariations.forEach(variation => aliases.add(`${variation}@${domain}`));
    }
    
    if (prefixVariationsCheckbox.checked) {
        const prefixVariations = generatePrefixVariations(localPart);
        prefixVariations.forEach(variation => aliases.add(`${variation}@${domain}`));
    }
    
    if (suffixVariationsCheckbox.checked) {
        const suffixVariations = generateSuffixVariations(localPart);
        suffixVariations.forEach(variation => aliases.add(`${variation}@${domain}`));
    }
    
    if (yearVariationsCheckbox.checked) {
        const yearVariations = generateYearVariations(localPart);
        yearVariations.forEach(variation => aliases.add(`${variation}@${domain}`));
    }
    
    // Convert to array and limit to max variations
    return Array.from(aliases).slice(0, maxVariationsSlider.value);
}

// Update statistics
function updateStats(aliases) {
    const email = emailInput.value;
    const [localPart] = email.split('@');
    
    const dotCount = aliases.filter(alias => alias.includes('.')).length;
    const prefixCount = aliases.filter(alias => alias.includes('+')).length;
    const suffixCount = aliases.filter(alias => 
        alias.includes('+') && alias.indexOf(localPart) === 0
    ).length;
    
    totalAliasesElement.textContent = aliases.length;
    dotCountElement.textContent = dotCount;
    prefixCountElement.textContent = prefixCount - suffixCount;
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
    
    // Show loading state
    generateButton.disabled = true;
    generateButton.querySelector('.button-text').style.opacity = '0';
    generateButton.querySelector('.button-loader').style.display = 'block';
    
    // Clear previous results
    emailList.innerHTML = '';
    
    setTimeout(() => {
        const aliases = generateAliases(email);
        
        // Update stats
        updateStats(aliases);
        
        // Create email cards
        aliases.forEach(alias => {
            emailList.appendChild(createEmailCard(alias));
        });
        
        // Show results
        resultsSection.style.display = 'block';
        
        // Reset button state
        generateButton.disabled = false;
        generateButton.querySelector('.button-text').style.opacity = '1';
        generateButton.querySelector('.button-loader').style.display = 'none';
        
        // Setup copy all button
        copyAllButton.onclick = () => copyToClipboard(aliases.join('\n'));
        
        // Setup download button
        downloadButton.onclick = () => downloadAliases(aliases);
        
    }, 1000); // Simulate processing time
});

// Add input validation
emailInput.addEventListener('input', () => {
    const email = emailInput.value.trim();
    const errorElement = document.getElementById('emailError');
    
    if (email && !isValidGmail(email)) {
        errorElement.textContent = 'Please enter a valid Gmail address';
        generateButton.disabled = true;
    } else {
        errorElement.textContent = '';
        generateButton.disabled = false;
    }
});

// Welcome card functionality
closeWelcome.addEventListener('click', function() {
    welcomeCard.style.display = 'none';
    localStorage.setItem('welcomeCardClosed', 'true');
});

if (localStorage.getItem('welcomeCardClosed') === 'true') {
    welcomeCard.style.display = 'none';
}
