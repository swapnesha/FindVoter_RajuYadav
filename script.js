let votersData = [];
let filteredResults = [];

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Load voters data
    loadVotersData();
    
    // Allow search on Enter key
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                searchVoters();
            }
        });
    }
});

// Function to load voters data from JSON file
async function loadVotersData() {
    try {
        console.log('⏳ Attempting to load votersJSON.json...');
        
        const response = await fetch('votersJSON.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        votersData = await response.json();
        console.log('✓ Data loaded successfully from votersJSON.json');
        console.log('Total voters:', votersData.length);
        console.log('Sample voter:', votersData[0]);
        
        showResultInfo(`✓ Data loaded successfully. Total voters: ${votersData.length}`, 'info');
    } catch (error) {
        console.error('✗ Error loading voters data:', error);
        console.error('Error details:', {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        
        showResultInfo(
            '⚠️ Error loading data. Please ensure votersJSON.json is in the same directory as index.html and refresh the page.',
            'error'
        );
    }
}

// Main search function
function searchVoters() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    const searchType = document.querySelector('input[name="searchType"]:checked').value;

    console.log('🔍 Search initiated:', { searchTerm, searchType, totalVotersLoaded: votersData.length });

    if (!searchTerm) {
        showResultInfo('Please enter a search term', 'error');
        clearResults();
        return;
    }

    if (votersData.length === 0) {
        console.warn('⚠️ No data loaded. Total voters:', votersData.length);
        showResultInfo('❌ Data not loaded yet. Please refresh the page and wait for "Data loaded successfully" message.', 'error');
        return;
    }

    filteredResults = filterVoters(searchTerm, searchType);

    console.log('✓ Search completed. Results found:', filteredResults.length);
    console.log('Filtered results:', filteredResults.slice(0, 3)); // Log first 3 results
    
    if (filteredResults.length === 0) {
        console.warn('⚠️ No voters found for:', searchTerm);
        showResultInfo(`No voters found matching "${searchTerm}". Try a different name or voter ID.`, 'error');
        clearResults();
    } else {
        showResultInfo(`Found ${filteredResults.length} voter(s) matching "${searchTerm}"`, 'success');
        displayResults(filteredResults);
    }
}

// Filter voters based on search term and type
function filterVoters(searchTerm, searchType) {
    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    console.log('Filtering with:', { searchTerm, searchType, totalVoters: votersData.length });
    
    return votersData.filter((voter, index) => {
        let isMatch = false;
        
        // English name fields (lowercase for comparison)
        const eFirstName = (voter.e_first_name || '').trim().toLowerCase();
        const eMiddleName = (voter.e_middle_name || '').trim().toLowerCase();
        const eLastName = (voter.e_last_name || '').trim().toLowerCase();
        
        // English name fields (original for exact match)
        const eFirstNameOriginal = (voter.e_first_name || '').trim();
        const eMiddleNameOriginal = (voter.e_middle_name || '').trim();
        const eLastNameOriginal = (voter.e_last_name || '').trim();
        
        // Local (Marathi/Hindi) script name fields (lowercase for comparison)
        const lFirstName = (voter.l_first_name || '').trim().toLowerCase();
        const lMiddleName = (voter.l_middle_name || '').trim().toLowerCase();
        const lLastName = (voter.l_last_name || '').trim().toLowerCase();
        
        // Local script fields (original for exact Unicode match)
        const lFirstNameOriginal = (voter.l_first_name || '').trim();
        const lMiddleNameOriginal = (voter.l_middle_name || '').trim();
        const lLastNameOriginal = (voter.l_last_name || '').trim();
        
        switch (searchType) {
            case 'voterID':
                // Search by Voter ID or Voter Card ID
                const voterId = String(voter.id || '').trim();
                const voterCardId = String(voter.vcardid || '').trim();
                const searchId = searchTerm.trim();
                isMatch = (voterId.includes(searchId) || voterId === searchId) ||
                         (voterCardId.includes(searchId) || voterCardId === searchId);
                break;
            
            case 'name':
                // Search by name fields (both English and Local script)
                isMatch = matchName(lowerSearchTerm, searchTerm, eFirstName, eMiddleName, eLastName, eFirstNameOriginal, eMiddleNameOriginal, eLastNameOriginal,
                                   lFirstName, lMiddleName, lLastName, lFirstNameOriginal, lMiddleNameOriginal, lLastNameOriginal);
                break;
            
            case 'all':
            default:
                // Search by Voter ID, Voter Card ID, or name (both English and Local)
                const voterIdStr = String(voter.id || '').trim();
                const voterCardIdStr = String(voter.vcardid || '').trim();
                
                // Check ID match (Voter ID or Voter Card ID)
                const idMatch = (voterIdStr.includes(searchTerm.trim()) || voterIdStr === searchTerm.trim()) ||
                               (voterCardIdStr.includes(searchTerm.trim()) || voterCardIdStr === searchTerm.trim());
                
                // Check name match (English and Local)
                const nameMatch = matchName(lowerSearchTerm, searchTerm, eFirstName, eMiddleName, eLastName, eFirstNameOriginal, eMiddleNameOriginal, eLastNameOriginal,
                                           lFirstName, lMiddleName, lLastName, lFirstNameOriginal, lMiddleNameOriginal, lLastNameOriginal);
                
                isMatch = idMatch || nameMatch;
                break;
        }
        
        // Log first few matches for debugging
        if (isMatch && index < 10) {
            console.log(`Match found: ${voter.e_first_name} ${voter.e_last_name} / ${voter.l_first_name} ${voter.l_middle_name} ${voter.l_last_name} (ID: ${voter.id})`);
        }
        
        return isMatch;
    });
}

// Helper function to match names (handles multi-word searches)
function matchName(lowerSearchTerm, originalSearchTerm, eFirstName, eMiddleName, eLastName, eFirstNameOriginal, eMiddleNameOriginal, eLastNameOriginal,
                   lFirstName, lMiddleName, lLastName, lFirstNameOriginal, lMiddleNameOriginal, lLastNameOriginal) {
    
    // Split search term by spaces for multi-word searches like "शिवराज अनिल यादव"
    const searchWords = originalSearchTerm.trim().split(/\s+/).filter(w => w.length > 0);
    
    // If multi-word search (e.g., "Shivaraj Yadav" or "शिवराज यादव")
    if (searchWords.length > 1) {
        // Try to match words against name fields (first, middle, last)
        const allNameFields = [eFirstName, eMiddleName, eLastName, lFirstName, lMiddleName, lLastName];
        const allNameFieldsOriginal = [eFirstNameOriginal, eMiddleNameOriginal, eLastNameOriginal, 
                                      lFirstNameOriginal, lMiddleNameOriginal, lLastNameOriginal];
        
        // Check if all search words can be matched to name fields
        let allWordsMatched = true;
        for (let word of searchWords) {
            const wordLower = word.toLowerCase();
            let foundMatch = false;
            
            // Try to find this word in any name field
            for (let i = 0; i < allNameFields.length; i++) {
                if (allNameFields[i].includes(wordLower) || allNameFieldsOriginal[i].includes(word)) {
                    foundMatch = true;
                    break;
                }
            }
            
            if (!foundMatch) {
                allWordsMatched = false;
                break;
            }
        }
        
        if (allWordsMatched) {
            return true;
        }
        
        // Also try matching against concatenated names
        const concatEnglish = `${eFirstName} ${eMiddleName} ${eLastName}`.toLowerCase();
        const concatLocal = `${lFirstNameOriginal} ${lMiddleNameOriginal} ${lLastNameOriginal}`;
        return concatEnglish.includes(originalSearchTerm) || concatLocal.includes(originalSearchTerm);
    }
    
    // Single word search (original logic)
    const englishMatch = eFirstName.includes(lowerSearchTerm) ||
           eMiddleName.includes(lowerSearchTerm) ||
           eLastName.includes(lowerSearchTerm) ||
           eFirstNameOriginal.includes(originalSearchTerm) ||
           eMiddleNameOriginal.includes(originalSearchTerm) ||
           eLastNameOriginal.includes(originalSearchTerm);
    
    const localMatch = lFirstName.includes(lowerSearchTerm) ||
           lMiddleName.includes(lowerSearchTerm) ||
           lLastName.includes(lowerSearchTerm) ||
           lFirstNameOriginal.includes(originalSearchTerm) ||
           lMiddleNameOriginal.includes(originalSearchTerm) ||
           lLastNameOriginal.includes(originalSearchTerm);
    
    return englishMatch || localMatch;
}

// Display search results
function displayResults(results) {
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = '';

    results.forEach((voter, index) => {
        const voterCard = createVoterCard(voter, index + 1);
        resultContainer.appendChild(voterCard);
    });
}

// Create a voter card element
function createVoterCard(voter, resultNumber) {
    const card = document.createElement('div');
    card.className = 'voter-card';

    const fullName = buildFullName(voter);
    const voterID = voter.id || 'N/A';

    card.innerHTML = `
        <div class="voter-header">
            <div class="voter-name">
                #${resultNumber}. ${fullName}
            </div>
            <div class="voter-id">ID: ${voterID}</div>
        </div>
        
        <div class="voter-details">
            ${createDetailItem('Booth ID', voter.boothid || 'N/A')}
            ${createDetailItem('Booth No', voter.booth_no || 'N/A')}
            ${voter.l_boothaddress ? createDetailItem('Booth Address', voter.l_boothaddress) : ''}
            ${voter.l_address ? createDetailItem('Address', voter.l_address) : ''}
            ${createDetailItem('Voter Card ID', voter.vcardid || 'N/A')}
            ${voter.mobile_no1 ? createDetailItem('Mobile 1', voter.mobile_no1) : ''}
            ${voter.mobile_no2 ? createDetailItem('Mobile 2', voter.mobile_no2) : ''}
            ${voter.emailid ? createDetailItem('Email', voter.emailid) : ''}
        </div>
    `;

    return card;
}

// Create a detail item HTML
function createDetailItem(label, value) {
    return `
        <div class="detail-item">
            <div class="detail-label">${label}</div>
            <div class="detail-value">${value}</div>
        </div>
    `;
}

// Build full name from components (both English and Local)
function buildFullName(voter) {
    const firstName = voter.e_first_name || '';
    const middleName = voter.e_middle_name || '';
    const lastName = voter.e_last_name || '';
    
    const englishName = [firstName, middleName, lastName]
        .filter(name => name.trim() !== '')
        .join(' ')
        .trim() || 'Unknown';
    
    // Also include local script name if available
    const lFirstName = voter.l_first_name || '';
    const lMiddleName = voter.l_middle_name || '';
    const lLastName = voter.l_last_name || '';
    
    const localName = [lFirstName, lMiddleName, lLastName]
        .filter(name => name.trim() !== '')
        .join(' ')
        .trim();
    
    if (localName && localName !== englishName) {
        return `${englishName} (${localName})`;
    }
    
    return englishName;
}

// Show result information message
function showResultInfo(message, type) {
    const resultInfo = document.getElementById('resultInfo');
    resultInfo.textContent = message;
    resultInfo.className = `result-info ${type}`;
}

// Clear search results
function clearResults() {
    document.getElementById('resultContainer').innerHTML = 
        `<div class="empty-state">
            <div class="empty-state-icon">🔍</div>
            <h2>No Results</h2>
            <p>Try searching with a different name or voter ID</p>
        </div>`;
}

// Clear search functionality
function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.querySelector('input[name="searchType"][value="all"]').checked = true;
    document.getElementById('resultContainer').innerHTML = 
        `<div class="empty-state">
            <div class="empty-state-icon">📋</div>
            <h2>Voter Search System</h2>
            <p>Enter a voter ID or name to search</p>
        </div>`;
    document.getElementById('resultInfo').className = 'result-info';
    document.getElementById('resultInfo').textContent = '';
    filteredResults = [];
    console.log('🔄 Search cleared');
}

// Test function - shows sample voters (for debugging)
function testSearch() {
    console.log('📋 === VOTER DATA TEST ===');
    console.log('Total voters loaded:', votersData.length);
    
    if (votersData.length === 0) {
        console.warn('❌ No data loaded! votersJSON.json may not have loaded correctly.');
        alert('❌ No data loaded. Please check:\n1. votersJSON.json is in the same folder as index.html\n2. Refresh the page\n3. Check browser console (F12) for errors');
        return;
    }
    
    console.log('\n--- First 5 Voters ---');
    for (let i = 0; i < Math.min(5, votersData.length); i++) {
        const v = votersData[i];
        console.log(`${i+1}. ${v.e_first_name} ${v.e_middle_name} ${v.e_last_name} (ID: ${v.id})`);
    }
    
    console.log('\n--- Test Searches ---');
    const testNames = [votersData[0].e_first_name, votersData[1].e_first_name, votersData[0].id];
    testNames.forEach(name => {
        const results = votersData.filter(v => {
            const fn = (v.e_first_name || '').toLowerCase().trim();
            const mn = (v.e_middle_name || '').toLowerCase().trim();
            const ln = (v.e_last_name || '').toLowerCase().trim();
            const id = String(v.id || '').trim();
            const searchStr = String(name).toLowerCase().trim();
            return fn.includes(searchStr) || mn.includes(searchStr) || ln.includes(searchStr) || id.includes(searchStr);
        });
        console.log(`Search for "${name}": ${results.length} results`);
    });
    
    alert('✓ Check console (F12) for voter data and test results');
}
