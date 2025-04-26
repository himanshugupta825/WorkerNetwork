document.addEventListener('DOMContentLoaded', function() {
  // Get page elements
  const mainPage = document.getElementById('main-page');
  const applyPage = document.getElementById('apply-page');
  const postJobPage = document.getElementById('post-job-page');
  const workersPage = document.getElementById('workers-page');
  const jobsPage = document.getElementById('jobs-page');
  const applyForm = document.getElementById('apply-form');
  const postJobForm = document.getElementById('post-job-form');
  const applySuccessMessage = document.getElementById('apply-success');
  const postSuccessMessage = document.getElementById('post-success');
  const applyErrorMessage = document.getElementById('apply-error');
  const postErrorMessage = document.getElementById('post-error');
  
  // Get worker and job listing elements
  const workersContainer = document.getElementById('workers-container');
  const jobsContainer = document.getElementById('jobs-container');
  const workersLoading = document.getElementById('workers-loading');
  const jobsLoading = document.getElementById('jobs-loading');
  const noWorkersMessage = document.getElementById('no-workers-message');
  const noJobsMessage = document.getElementById('no-jobs-message');
  const workersError = document.getElementById('workers-error');
  const jobsError = document.getElementById('jobs-error');
  
  // Theme toggle elements
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const themeText = document.getElementById('theme-text');
  const htmlElement = document.getElementById('html-element');
  
  // Add event listeners to main buttons
  document.getElementById('apply-button').addEventListener('click', function() {
    mainPage.classList.add('d-none');
    applyPage.classList.remove('d-none');
  });
  
  document.getElementById('post-button').addEventListener('click', function() {
    mainPage.classList.add('d-none');
    postJobPage.classList.remove('d-none');
  });
  
  // Add event listeners to view workers button
  document.getElementById('view-workers-button').addEventListener('click', function() {
    mainPage.classList.add('d-none');
    workersPage.classList.remove('d-none');
    
    // Load workers data
    fetchWorkers();
  });
  
  // Add event listeners to view jobs button
  document.getElementById('view-jobs-button').addEventListener('click', function() {
    mainPage.classList.add('d-none');
    jobsPage.classList.remove('d-none');
    
    // Load jobs data
    fetchJobs();
  });
  
  // Add event listeners to back buttons
  document.querySelectorAll('.btn-back').forEach(function(button) {
    button.addEventListener('click', function() {
      mainPage.classList.remove('d-none');
      applyPage.classList.add('d-none');
      postJobPage.classList.add('d-none');
      workersPage.classList.add('d-none');
      jobsPage.classList.add('d-none');
      
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
  
  // Theme toggle functionality
  themeToggleBtn.addEventListener('click', function() {
    const currentTheme = htmlElement.getAttribute('data-bs-theme');
    
    if (currentTheme === 'dark') {
      // Switch to light theme
      htmlElement.setAttribute('data-bs-theme', 'light');
      themeIcon.textContent = '☀️';
      themeText.textContent = 'Light Mode';
      themeToggleBtn.classList.remove('btn-outline-light');
      themeToggleBtn.classList.add('btn-outline-dark');
      
      // Save theme preference in local storage
      localStorage.setItem('theme', 'light');
    } else {
      // Switch to dark theme
      htmlElement.setAttribute('data-bs-theme', 'dark');
      themeIcon.textContent = '🌙';
      themeText.textContent = 'Dark Mode';
      themeToggleBtn.classList.remove('btn-outline-dark');
      themeToggleBtn.classList.add('btn-outline-light');
      
      // Save theme preference in local storage
      localStorage.setItem('theme', 'dark');
    }
  });
  
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    if (savedTheme === 'light') {
      // Apply light theme
      htmlElement.setAttribute('data-bs-theme', 'light');
      themeIcon.textContent = '☀️';
      themeText.textContent = 'Light Mode';
      themeToggleBtn.classList.remove('btn-outline-light');
      themeToggleBtn.classList.add('btn-outline-dark');
    } else {
      // Apply dark theme (default)
      htmlElement.setAttribute('data-bs-theme', 'dark');
      themeIcon.textContent = '🌙';
      themeText.textContent = 'Dark Mode';
      themeToggleBtn.classList.remove('btn-outline-dark');
      themeToggleBtn.classList.add('btn-outline-light');
    }
  }
  
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
  
  // Function to fetch workers data
  function fetchWorkers() {
    // Show loading spinner, hide error and no content messages
    workersLoading.classList.remove('d-none');
    workersError.classList.add('d-none');
    noWorkersMessage.classList.add('d-none');
    
    // Clear previous content
    workersContainer.innerHTML = '';
    
    // Fetch workers data from API
    fetch('/workers')
      .then(response => response.json())
      .then(data => {
        // Hide loading spinner
        workersLoading.classList.add('d-none');
        
        if (data.error) {
          // Show error message
          workersError.textContent = data.error;
          workersError.classList.remove('d-none');
        } else if (data.workers && data.workers.length > 0) {
          // Display workers
          data.workers.forEach(worker => {
            const workerCard = createWorkerCard(worker);
            workersContainer.appendChild(workerCard);
          });
        } else {
          // Show no workers message
          noWorkersMessage.classList.remove('d-none');
        }
      })
      .catch(error => {
        console.error('Error fetching workers:', error);
        workersLoading.classList.add('d-none');
        workersError.textContent = 'Failed to load workers. Please try again.';
        workersError.classList.remove('d-none');
      });
  }
  
  // Function to fetch jobs data
  function fetchJobs() {
    // Show loading spinner, hide error and no content messages
    jobsLoading.classList.remove('d-none');
    jobsError.classList.add('d-none');
    noJobsMessage.classList.add('d-none');
    
    // Clear previous content
    jobsContainer.innerHTML = '';
    
    // Fetch jobs data from API
    fetch('/jobs')
      .then(response => response.json())
      .then(data => {
        // Hide loading spinner
        jobsLoading.classList.add('d-none');
        
        if (data.error) {
          // Show error message
          jobsError.textContent = data.error;
          jobsError.classList.remove('d-none');
        } else if (data.jobs && data.jobs.length > 0) {
          // Display jobs
          data.jobs.forEach(job => {
            const jobCard = createJobCard(job);
            jobsContainer.appendChild(jobCard);
          });
        } else {
          // Show no jobs message
          noJobsMessage.classList.remove('d-none');
        }
      })
      .catch(error => {
        console.error('Error fetching jobs:', error);
        jobsLoading.classList.add('d-none');
        jobsError.textContent = 'Failed to load jobs. Please try again.';
        jobsError.classList.remove('d-none');
      });
  }
  
  // Function to create a worker card
  function createWorkerCard(worker) {
    const card = document.createElement('div');
    card.className = 'card mb-3';
    
    // Format the date if available
    let formattedDate = 'Unknown';
    if (worker.created_at) {
      const date = new Date(worker.created_at);
      formattedDate = date.toLocaleDateString();
    }
    
    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${worker.name}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${worker.skill}</h6>
        
        <div class="card-text">
          <p><strong>Location:</strong> ${worker.location || 'Not specified'}</p>
          <p><strong>Experience:</strong> ${worker.experience || 'Not specified'}</p>
          <p><strong>Education:</strong> ${worker.education || 'Not specified'}</p>
          <p><strong>Contact:</strong> ${worker.phone}</p>
        </div>
        
        <div class="card-footer text-muted">
          Applied on: ${formattedDate}
        </div>
      </div>
    `;
    
    return card;
  }
  
  // Function to create a job card
  function createJobCard(job) {
    const card = document.createElement('div');
    card.className = 'card mb-3';
    
    // Format the date if available
    let formattedDate = 'Unknown';
    if (job.created_at) {
      const date = new Date(job.created_at);
      formattedDate = date.toLocaleDateString();
    }
    
    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${job.job_role}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${job.business_name}</h6>
        
        <div class="card-text">
          <p><strong>Payment:</strong> ${job.payment}</p>
          <p><strong>Location:</strong> ${job.location || 'Not specified'}</p>
          <p><strong>Description:</strong> ${job.job_description || 'Not provided'}</p>
          <p><strong>Contact:</strong> ${job.contact_number}</p>
          <p><strong>Status:</strong> <span class="badge bg-success">${job.status || 'Open'}</span></p>
        </div>
        
        <div class="card-footer text-muted">
          Posted on: ${formattedDate}
        </div>
      </div>
    `;
    
    return card;
  }
});