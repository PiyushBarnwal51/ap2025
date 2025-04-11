// Initialize Firebase (replace with your config)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// DOM elements
const firForm = document.getElementById('firForm');
const trackingSection = document.getElementById('trackingSection');
const firNumberSpan = document.getElementById('firNumber');

// Form submission
firForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form values
    const firData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        incidentDate: document.getElementById('incidentDate').value,
        location: document.getElementById('location').value,
        description: document.getElementById('description').value,
        suspect: document.getElementById('suspect').value,
        evidence: document.getElementById('evidence').files,
        status: "Under Investigation",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        // Add FIR to Firestore
        const docRef = await db.collection('firs').add(firData);
        
        // Generate FIR number (YYYYMMDD-XXXX)
        const today = new Date();
        const firNumber = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${String(docRef.id).substring(0, 4).toUpperCase()}`;
        
        // Update the document with FIR number
        await db.collection('firs').doc(docRef.id).update({
            firNumber: firNumber
        });
        
        // Show success message
        firNumberSpan.textContent = firNumber;
        firForm.reset();
        trackingSection.classList.remove('hidden');
        
    } catch (error) {
        console.error("Error adding FIR: ", error);
        alert("An error occurred while submitting your FIR. Please try again.");
    }
});

// Track button functionality
document.getElementById('trackBtn').addEventListener('click', () => {
    alert("Tracking functionality will be implemented in the next phase.");
});