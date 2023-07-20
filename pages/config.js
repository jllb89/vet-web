
//config data base settings
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

// Reference database
const formulario = firebase.database().ref('formulario');

// Step variables
let currentStep = 0;
const totalSteps = 4; // Update this value to the total number of steps

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
  const input = document.getElementById('name'); // Get the input element

  for (let i = 0; i < steps.length; i++) {
    if (i === stepIndex) {
      steps[i].style.display = 'block';
    } else {
      steps[i].style.display = 'none';
    }
  }

  // Show/hide buttons based on the current step
  if (stepIndex === 0) {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'block';
    submitBtn.style.display = 'none';
  } else if (stepIndex === totalSteps - 1) {
    prevBtn.style.display = 'block';
    nextBtn.style.display = 'none';
    submitBtn.style.display = 'block';
  } else {
    prevBtn.style.display = 'block';
    nextBtn.style.display = 'block';
    submitBtn.style.display = 'none';
  }
}

// Event listener for input
document.getElementById('name').addEventListener('input', function () {
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');

  if (this.value.trim() !== '') {
    nextBtn.disabled = false;
    prevBtn.disabled = false;
  } else {
    nextBtn.disabled = true;
    prevBtn.disabled = true;
  }
});

// Initialize button states
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
nextBtn.disabled = true;
prevBtn.disabled = true;

// Function to navigate to the next step
function nextStep() {
  if (currentStep < totalSteps - 1) {
    if (currentStep === 1) {
      const emailid = getElementVal('emailid');
      if (!validateEmail(emailid)) {
        // Show error message for invalid email format
        const alertMessage = document.getElementById('alertMessage');
        alertMessage.textContent = 'Please enter a valid email address.';
        alertMessage.style.display = 'block';
        // Hide alert message after 3 seconds
        setTimeout(function () {
          alertMessage.style.display = 'none';
        }, 3000);
        return;
      }
    }
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

  if (currentStep === totalSteps - 1) {
    const name = getElementVal('name');
    const emailid = getElementVal('emailid');
    const msgContent = getElementVal('msgContent');
    const services = getSelectedServices();

    // Check if all required fields are filled
    if (!name || !emailid || !msgContent || services.length === 0) {
      // Show error message for empty required fields
      const errorMessage = document.getElementById('errorMessage');
      errorMessage.textContent = 'Please fill out all required fields.';
      errorMessage.style.display = 'block';

      // Set a timer to hide the error message after 3 seconds
      setTimeout(function () {
        errorMessage.style.display = 'none';
      }, 3000);

      return;
    }

    // Perform email format validation only on the email step
    if (currentStep === 1) {
      if (!validateEmail(emailid)) {
        // Show error message for invalid email format
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = 'Please enter a valid email address.';
        errorMessage.style.display = 'block';
        return;
      }
    }

    // Save data in Firebase
    saveMessages(name, emailid, msgContent, services);

    // Show success message
    showSuccessMessage();

    // Reset form
    document.getElementById('formulario').reset();
    currentStep = 0;
    showStep(currentStep);
  }
}

// Function to validate email format
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Function to reset the form
function resetForm() {
  document.getElementById('formulario').reset();
  currentStep = 0;
  showStep(currentStep);

  // Hide success message
  const successMessage = document.getElementById('successMessage');
  successMessage.style.display = 'none';
}

// Function to save messages in Firebase
function saveMessages(name, emailid, msgContent, services) {
  const newFormulario = formulario.push();
  newFormulario.set({
    name: name,
    emailid: emailid,
    msgContent: msgContent,
    services: services,
  });
}

// Function to get element value by ID
function getElementVal(id) {
  return document.getElementById(id).value;
}

// Function to get selected services
function getSelectedServices() {
  const checkboxes = document.getElementsByName('services');
  const selectedServices = [];

  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      const checkboxContainer = checkboxes[i].closest('.inputBox');
      selectedServices.push(checkboxContainer.textContent.trim());
    }
  }

  return selectedServices;
}

// Function to display success message
function showSuccessMessage() {
  const successMessage = document.getElementById('successMessage');
  successMessage.style.display = 'block';

  // Hide success message after 3 seconds
  setTimeout(function () {
    successMessage.style.display = 'none';
    redirectToHome();
  }, 3000);
}

// Function to redirect to home.html
function redirectToHome() {
  window.location.href = 'http://www.vetoncall.app';
}

// Show initial step
showStep(currentStep);
