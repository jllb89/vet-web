// Config data base settings
const firebaseConfig = {
    apiKey: "AIzaSyC5C40k1hUT5s3asXWBTK-qb2TYscMPDGM",
    authDomain: "formulario-c6fed.firebaseapp.com",
    databaseURL: "https://formulario-c6fed-default-rtdb.firebaseio.com",
    projectId: "formulario-c6fed",
    storageBucket: "formulario-c6fed.appspot.com",
    messagingSenderId: "956662769580",
    appId: "1:956662769580:web:1a2882b17ac7c31c487c09",
    measurementId: "G-1BBTH1PLD1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference to the same database
const formulario = firebase.database().ref('formulario');

// Step variables
let currentStep = 0;
const totalSteps = 4; // Adjusted to the number of steps in your supplier form

// Event listener for next button
document.getElementById('nextBtn').addEventListener('click', nextStep);

// Event listener for previous button
document.getElementById('prevBtn').addEventListener('click', prevStep);

// Function to show the current step and hide others
function showStep(stepIndex) {
    const steps = document.querySelectorAll('.step');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    steps.forEach((step, index) => {
        step.style.display = index === stepIndex ? 'block' : 'none';
    });

    prevBtn.style.display = stepIndex === 0 ? 'none' : 'block';
    nextBtn.style.display = stepIndex === totalSteps - 1 ? 'none' : 'block';
    submitBtn.style.display = stepIndex === totalSteps - 1 ? 'block' : 'none';
}

// Function to navigate to the next step
function nextStep() {
    if (currentStep < totalSteps - 1) {
        currentStep++;
        showStep(currentStep);
    }
}

// Function to navigate to the previous step
function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
    }
}

// Event listener for form submission
document.getElementById('formulario').addEventListener('submit', submitForm);

// Function to handle form submission
function submitForm(e) {
    e.preventDefault();

    // Collect form data
    const name = getElementVal('name');
    const emailid = getElementVal('emailid');
    const serviceDescription = getElementVal('serviceDescription'); // Updated ID
    const businessInfo = getElementVal('businessInfo'); // Ensure this ID exists in your HTML

    // Check if all required fields are filled
    if (!name || !emailid || !serviceDescription || !businessInfo) {
        // Show error message for empty required fields
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = 'Please fill out all required fields.';
        errorMessage.style.display = 'block';

        // Hide the error message after 3 seconds
        setTimeout(function () {
          errorMessage.style.display = 'none';
        }, 3000);

        return;
    }

    // Save data in Firebase
    saveMessages(name, emailid, serviceDescription, businessInfo);

    // Show success message and reset the form
    showSuccessMessage();
    resetForm();
}

// Function to save messages in Firebase
function saveMessages(name, emailid, serviceDescription, businessInfo) {
    const newFormEntry = formulario.push();
    newFormEntry.set({
        name: name,
        emailid: emailid,
        serviceDescription: serviceDescription,
        businessInfo: businessInfo,
        formType: 'supplier' // Helps to differentiate the type of form entry
    });
}

// Function to get element value by ID
function getElementVal(id) {
    return document.getElementById(id).value;
}

// Function to display success message
function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    successMessage.style.display = 'block';

    // Hide success message after 3 seconds
    setTimeout(function () {
        successMessage.style.display = 'none';
    }, 3000);
}

// Function to reset the form
function resetForm() {
    document.getElementById('formulario').reset();
    currentStep = 0;
    showStep(currentStep);
}

// Initialize the form with the first step
showStep(currentStep);
