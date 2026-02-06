let votersData = [];
let filteredResults = [];

// Load voters data on page load
document.addEventListener('DOMContentLoaded', loadVotersData);

// Allow search on Enter key
document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchVoters();
    }
});

// Function to load voters data from JSON file
async function loadVotersData() {
    try {
        const response = await fetch('votersJSON.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        votersData = await response.json();
        showResultInfo(`Data loaded successfully. Total voters: ${votersData.length}`, 'info');
    } catch (error) {
        console.error('Error loading voters data:', error);
        showResultInfo('Error loading voters data. Please make sure votersJSON.json is in the same directory.', 'error');
    }
}

// Main search function
function searchVoters() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    const searchType = document.querySelector('input[name="searchType"]:checked').value;

    if (!searchTerm) {
        showResultInfo('Please enter a search term', 'error');
        clearResults();
        return;
    }

    if (votersData.length === 0) {
        showResultInfo('Data not loaded yet. Please refresh the page.', 'error');
        return;
    }

    filteredResults = filterVoters(searchTerm, searchType);

    if (filteredResults.length === 0) {
        showResultInfo(`No voters found matching "${searchTerm}"`, 'error');
        clearResults();
    } else {
        showResultInfo(`Found ${filteredResults.length} voter(s) matching "${searchTerm}"`, 'success');
        displayResults(filteredResults);
    }
}

// Filter voters based on search term and type
function filterVoters(searchTerm, searchType) {
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return votersData.filter(voter => {
        switch (searchType) {
            case 'voterID':
                // Search only by ID
                return voter.id.toString().includes(searchTerm);
            
            case 'name':
                // Search by name fields
                const firstName = (voter.e_first_name || '').toLowerCase();
                const middleName = (voter.e_middle_name || '').toLowerCase();
                const lastName = (voter.e_last_name || '').toLowerCase();
                const fullName = `${firstName} ${middleName} ${lastName}`.toLowerCase();
                
                return firstName.includes(lowerSearchTerm) ||
                       middleName.includes(lowerSearchTerm) ||
                       lastName.includes(lowerSearchTerm) ||
                       fullName.includes(lowerSearchTerm);
            
            case 'all':
            default:
                // Search by ID or name
                const voterID = voter.id.toString().includes(searchTerm);
                const voterName = (
                    (voter.e_first_name || '').toLowerCase().includes(lowerSearchTerm) ||
                    (voter.e_middle_name || '').toLowerCase().includes(lowerSearchTerm) ||
                    (voter.e_last_name || '').toLowerCase().includes(lowerSearchTerm)
                );
                
                return voterID || voterName;
        }
    });
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
            ${createDetailItem('Age', voter.age || 'N/A')}
            ${createDetailItem('Sex', voter.sex || 'N/A')}
            ${createDetailItem('Booth ID', voter.boothid || 'N/A')}
            ${createDetailItem('Booth No', voter.booth_no || 'N/A')}
            ${createDetailItem('Assembly Name', voter.e_assemblyname || 'N/A')}
            ${createDetailItem('Village', voter.e_village || 'N/A')}
            ${createDetailItem('House No', voter.house_no || 'N/A')}
            ${createDetailItem('Address', voter.e_address || 'N/A')}
            ${createDetailItem('Family ID', voter.familyid || 'N/A')}
            ${createDetailItem('Voted', voter.voted || 'N/A')}
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

// Build full name from components
function buildFullName(voter) {
    const firstName = voter.e_first_name || '';
    const middleName = voter.e_middle_name || '';
    const lastName = voter.e_last_name || '';
    
    return [firstName, middleName, lastName]
        .filter(name => name.trim() !== '')
        .join(' ')
        .trim() || 'Unknown';
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
}
