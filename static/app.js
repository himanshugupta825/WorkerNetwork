document.addEventListener('DOMContentLoaded', function() {
  // Get page elements
  const mainPage = document.getElementById('main-page');
  const applyPage = document.getElementById('apply-page');
  const postJobPage = document.getElementById('post-job-page');
  const applyForm = document.getElementById('apply-form');
  const postJobForm = document.getElementById('post-job-form');
  const applySuccessMessage = document.getElementById('apply-success');
  const postSuccessMessage = document.getElementById('post-success');
  const applyErrorMessage = document.getElementById('apply-error');
  const postErrorMessage = document.getElementById('post-error');
  
  // Add event listeners to main buttons
  document.getElementById('apply-button').addEventListener('click', function() {
    mainPage.classList.add('d-none');
    applyPage.classList.remove('d-none');
  });
  
  document.getElementById('post-button').addEventListener('click', function() {
    mainPage.classList.add('d-none');
    postJobPage.classList.remove('d-none');
  });
  
  // Add event listeners to back buttons
  document.querySelectorAll('.btn-back').forEach(function(button) {
    button.addEventListener('click', function() {
      mainPage.classList.remove('d-none');
      applyPage.classList.add('d-none');
      postJobPage.classList.add('d-none');
      
      // Hide success and error messages
      applySuccessMessage.style.display = 'none';
      postSuccessMessage.style.display = 'none';
      applyErrorMessage.style.display = 'none';
      postErrorMessage.style.display = 'none';
      
      // Reset forms
      applyForm.reset();
      postJobForm.reset();
    });
  });
  
  // Handle apply form submission
  applyForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
      name: document.getElementById('apply-name').value,
      phone: document.getElementById('apply-phone').value,
      skill: document.getElementById('apply-skill').value,
      location: document.getElementById('apply-location').value,
      experience: document.getElementById('apply-experience').value || null,
      education: document.getElementById('apply-education').value || null
    };
    
    // Send data to server
    fetch('/apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        // Show error message
        applyErrorMessage.textContent = data.error;
        applyErrorMessage.style.display = 'block';
        applyErrorMessage.classList.add('fade-in');
      } else {
        // Show success message
        applySuccessMessage.style.display = 'block';
        applySuccessMessage.classList.add('fade-in');
        
        // Reset form
        applyForm.reset();
      }
    })
    .catch(error => {
      console.error('Error:', error);
      applyErrorMessage.textContent = 'An error occurred. Please try again.';
      applyErrorMessage.style.display = 'block';
      applyErrorMessage.classList.add('fade-in');
    });
  });
  
  // Handle post job form submission
  postJobForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
      business_name: document.getElementById('post-business').value,
      job_role: document.getElementById('post-role').value,
      payment: document.getElementById('post-payment').value,
      contact_number: document.getElementById('post-contact').value,
      location: document.getElementById('post-location').value || null,
      job_description: document.getElementById('post-description').value || null
    };
    
    // Send data to server
    fetch('/post-job', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        // Show error message
        postErrorMessage.textContent = data.error;
        postErrorMessage.style.display = 'block';
        postErrorMessage.classList.add('fade-in');
      } else {
        // Show success message
        postSuccessMessage.style.display = 'block';
        postSuccessMessage.classList.add('fade-in');
        
        // Reset form
        postJobForm.reset();
      }
    })
    .catch(error => {
      console.error('Error:', error);
      postErrorMessage.textContent = 'An error occurred. Please try again.';
      postErrorMessage.style.display = 'block';
      postErrorMessage.classList.add('fade-in');
    });
  });
});