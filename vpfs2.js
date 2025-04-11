document.addEventListener('DOMContentLoaded', function() {
    // Shared functionality
    const FIRS_KEY = 'firCases';
    
    // Initialize storage if empty
    if(!localStorage.getItem(FIRS_KEY)) {
        localStorage.setItem(FIRS_KEY, JSON.stringify([]));
    }

    // FIR Form Submission (for index.html)
    if(document.getElementById('firForm')) {
        const firForm = document.getElementById('firForm');
        const trackingSection = document.getElementById('trackingSection');
        const firNumberSpan = document.getElementById('firNumber');

        firForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const firData = {
                id: Date.now(),
                firNumber: generateFIRNumber(),
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                incidentDate: document.getElementById('incidentDate').value,
                location: document.getElementById('location').value,
                description: document.getElementById('description').value,
                suspect: document.getElementById('suspect').value,
                status: "Under Investigation",
                createdAt: new Date().toISOString()
            };

            saveFIR(firData);
            
            firNumberSpan.textContent = firData.firNumber;
            firForm.reset();
            trackingSection.classList.remove('hidden');
        });
    }

    // Dashboard Functionality (for dashboard.html)
    if(document.getElementById('casesBody')) {
        loadCases();
        setupFilters();
        setupModal();
    }

    // Logout Button
    if(document.getElementById('logoutBtn')) {
        document.getElementById('logoutBtn').addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }

    function generateFIRNumber() {
        const today = new Date();
        return `${today.getFullYear()}${String(today.getMonth()+1).padStart(2,'0')}${String(today.getDate()).padStart(2,'0')}-${Math.floor(1000+Math.random()*9000)}`;
    }

    function saveFIR(firData) {
        const cases = JSON.parse(localStorage.getItem(FIRS_KEY));
        cases.push(firData);
        localStorage.setItem(FIRS_KEY, JSON.stringify(cases));
    }

    function loadCases(filterStatus = 'all') {
        const cases = JSON.parse(localStorage.getItem(FIRS_KEY));
        const tbody = document.getElementById('casesBody');
        tbody.innerHTML = '';

        cases.forEach(caseItem => {
            if(filterStatus !== 'all' && caseItem.status !== filterStatus) return;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${caseItem.firNumber}</td>
                <td>${caseItem.name}</td>
                <td>${new Date(caseItem.incidentDate).toLocaleDateString()}</td>
                <td>
                    <span class="status-badge status-${caseItem.status.toLowerCase().replace(' ', '-')}">
                        ${caseItem.status}
                    </span>
                </td>
                <td>
                    <button class="action-btn view-btn" data-id="${caseItem.id}">View</button>
                    <button class="action-btn update-btn" data-id="${caseItem.id}">Update</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function setupFilters() {
        document.getElementById('statusFilter').addEventListener('change', function(e) {
            loadCases(e.target.value);
        });
    }

    function setupModal() {
        const modal = document.getElementById('caseModal');
        const closeBtn = modal.querySelector('.close');
        
        document.addEventListener('click', function(e) {
            if(e.target.classList.contains('view-btn') || e.target.classList.contains('update-btn')) {
                const caseId = e.target.dataset.id;
                showCaseDetails(caseId);
            }
        });

        closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
        window.addEventListener('click', (e) => {
            if(e.target === modal) modal.classList.add('hidden');
        });
    }

    function showCaseDetails(caseId) {
        const cases = JSON.parse(localStorage.getItem(FIRS_KEY));
        const caseData = cases.find(c => c.id == caseId);
        const modal = document.getElementById('caseModal');
        
        document.getElementById('modalFIRNumber').textContent = caseData.firNumber;
        document.getElementById('caseDetails').innerHTML = `
            <p><strong>Complainant:</strong> ${caseData.name}</p>
            <p><strong>Contact:</strong> ${caseData.phone} | ${caseData.email}</p>
            <p><strong>Incident Date:</strong> ${new Date(caseData.incidentDate).toLocaleString()}</p>
            <p><strong>Location:</strong> ${caseData.location}</p>
            <p><strong>Description:</strong> ${caseData.description}</p>
            <p><strong>Suspect Details:</strong> ${caseData.suspect || 'N/A'}</p>
        `;

        const statusSelect = document.getElementById('statusSelect');
        statusSelect.value = caseData.status;
        
        document.getElementById('updateStatusBtn').onclick = () => {
            caseData.status = statusSelect.value;
            localStorage.setItem(FIRS_KEY, JSON.stringify(cases));
            loadCases(document.getElementById('statusFilter').value);
            modal.classList.add('hidden');
        };

        modal.classList.remove('hidden');
    }
});