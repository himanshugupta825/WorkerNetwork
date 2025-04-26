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
  const htmlElement = document.documentElement;
  
  // Accessibility elements
  const voiceGuideBtn = document.getElementById('voice-guide-btn');
  const visualGuideBtn = document.getElementById('visual-guide-btn');
  const guidePanel = document.getElementById('guide-panel');
  const guidePanelClose = document.getElementById('guide-panel-close');
  const guidePanelContent = document.getElementById('guide-panel-content');
  const visualCues = document.getElementById('visual-cues');
  
  // Set SVG icons
  document.getElementById('speaker-icon').innerHTML = ICONS['speaker-icon'];
  document.getElementById('guide-icon').innerHTML = ICONS['guide-icon'];
  document.getElementById('mic-button-icon').innerHTML = ICONS['mic-icon'];
  
  // Voice search elements
  const voiceSearchBtn = document.getElementById('voice-search-btn');
  const voiceStatusText = document.getElementById('voice-status-text');
  const voiceTranscript = document.getElementById('voice-transcript');
  const voiceResponseContainer = document.getElementById('voice-response-container');
  const voiceResponseText = document.getElementById('voice-response-text');
  const playResponseBtn = document.getElementById('play-response-btn');
  const voiceSearchResultsPage = document.getElementById('voice-search-results-page');
  const voiceSearchSummaryText = document.getElementById('voice-search-summary-text');
  const voiceSearchResults = document.getElementById('voice-search-results');
  const voiceSearchLoading = document.getElementById('voice-search-loading');
  const noResultsMessage = document.getElementById('no-results-message');
  const voiceSearchError = document.getElementById('voice-search-error');
  
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
  
  // Voice guidance functionality
  voiceGuideBtn.addEventListener('click', function() {
    // Determine current page
    let currentPage = 'main';
    if (!mainPage.classList.contains('d-none')) {
      currentPage = 'main';
    } else if (!applyPage.classList.contains('d-none')) {
      currentPage = 'apply';
    } else if (!postJobPage.classList.contains('d-none')) {
      currentPage = 'post-job';
    } else if (!workersPage.classList.contains('d-none')) {
      currentPage = 'workers';
    } else if (!jobsPage.classList.contains('d-none')) {
      currentPage = 'jobs';
    }
    
    // Create audio element and play voice guide
    const audio = new Audio(`/voice-guide/${currentPage}`);
    audio.play();
  });
  
  // Visual guide functionality
  visualGuideBtn.addEventListener('click', function() {
    // Determine current page
    let currentPage = 'main';
    if (!mainPage.classList.contains('d-none')) {
      currentPage = 'main';
    } else if (!applyPage.classList.contains('d-none')) {
      currentPage = 'apply';
    } else if (!postJobPage.classList.contains('d-none')) {
      currentPage = 'post-job';
    } else if (!workersPage.classList.contains('d-none')) {
      currentPage = 'workers';
    } else if (!jobsPage.classList.contains('d-none')) {
      currentPage = 'jobs';
    }
    
    // Fetch visual guide data
    fetch(`/visual-guide/${currentPage}`)
      .then(response => response.json())
      .then(data => {
        // Update guide panel content
        guidePanelContent.innerHTML = '';
        
        // Add title
        const title = document.createElement('h3');
        title.className = 'mb-4';
        title.textContent = data.title;
        guidePanelContent.appendChild(title);
        
        // Add steps
        data.steps.forEach(step => {
          const stepDiv = document.createElement('div');
          stepDiv.className = 'guide-step';
          
          const iconDiv = document.createElement('div');
          iconDiv.className = 'guide-step-icon';
          iconDiv.innerHTML = ICONS[step.icon] || ICONS['help-icon'];
          
          const textDiv = document.createElement('div');
          textDiv.className = 'guide-step-text';
          textDiv.textContent = step.text;
          
          stepDiv.appendChild(iconDiv);
          stepDiv.appendChild(textDiv);
          guidePanelContent.appendChild(stepDiv);
        });
        
        // Show the guide panel
        guidePanel.classList.add('active');
        
        // Add visual cues/arrows to the page
        addVisualCues(currentPage);
      })
      .catch(error => {
        console.error('Error fetching visual guide:', error);
      });
  });
  
  // Close guide panel
  guidePanelClose.addEventListener('click', function() {
    guidePanel.classList.remove('active');
    // Remove visual cues
    visualCues.classList.remove('active');
    visualCues.innerHTML = '';
  });
  
  // Function to add visual cues based on page
  function addVisualCues(page) {
    visualCues.innerHTML = '';
    visualCues.classList.add('active');
    
    // Different cues for different pages
    switch(page) {
      case 'main':
        // Add arrows pointing to main buttons
        addArrow(document.getElementById('apply-button'), 'top');
        addArrow(document.getElementById('post-button'), 'top');
        break;
      case 'apply':
        // Add arrow pointing to first form field
        addArrow(document.getElementById('apply-name'), 'top');
        break;
      case 'post-job':
        // Add arrow pointing to first form field
        addArrow(document.getElementById('post-business'), 'top');
        break;
    }
  }
  
  // Function to add a pulsing arrow near an element
  function addArrow(element, position) {
    if (!element) return;
    
    const rect = element.getBoundingClientRect();
    const arrow = document.createElement('div');
    arrow.className = 'pulse-arrow';
    arrow.innerHTML = ICONS['arrow-down'];
    
    // Position the arrow
    switch(position) {
      case 'top':
        arrow.style.top = `${rect.top - 40}px`;
        arrow.style.left = `${rect.left + rect.width / 2 - 12}px`;
        break;
      case 'right':
        arrow.style.top = `${rect.top + rect.height / 2 - 12}px`;
        arrow.style.left = `${rect.right + 10}px`;
        arrow.style.transform = 'rotate(-90deg)';
        break;
      case 'bottom':
        arrow.style.top = `${rect.bottom + 10}px`;
        arrow.style.left = `${rect.left + rect.width / 2 - 12}px`;
        arrow.style.transform = 'rotate(180deg)';
        break;
      case 'left':
        arrow.style.top = `${rect.top + rect.height / 2 - 12}px`;
        arrow.style.left = `${rect.left - 40}px`;
        arrow.style.transform = 'rotate(90deg)';
        break;
    }
    
    visualCues.appendChild(arrow);
  }
  
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
  
  // Web Speech API voice recognition
  let recognition;
  let isListening = false;
  
  // Check if browser supports speech recognition
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    // Initialize speech recognition
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    
    // Handle speech recognition results
    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      voiceTranscript.textContent = transcript;
      
      // If final result
      if (event.results[0].isFinal) {
        processVoiceCommand(transcript);
      }
    };
    
    // Handle speech recognition end
    recognition.onend = function() {
      voiceSearchBtn.classList.remove('listening');
      isListening = false;
      voiceStatusText.textContent = 'Click the microphone and speak';
    };
    
    // Handle speech recognition errors
    recognition.onerror = function(event) {
      console.error('Speech recognition error:', event.error);
      voiceStatusText.textContent = 'Error: ' + event.error;
      voiceSearchBtn.classList.remove('listening');
      isListening = false;
    };
    
    // Add click event for voice search button
    voiceSearchBtn.addEventListener('click', function() {
      if (!isListening) {
        // Start listening
        voiceSearchBtn.classList.add('listening');
        voiceStatusText.textContent = 'Listening...';
        voiceTranscript.textContent = '';
        voiceResponseContainer.classList.add('d-none');
        
        // Start recognition
        recognition.start();
        isListening = true;
      } else {
        // Stop listening
        recognition.stop();
        voiceSearchBtn.classList.remove('listening');
        voiceStatusText.textContent = 'Click the microphone and speak';
        isListening = false;
      }
    });
    
    // Add click event for play response button
    playResponseBtn.addEventListener('click', function() {
      const responseText = voiceResponseText.textContent;
      
      // Send the text to the server for conversion to speech
      fetch('/voice-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: responseText })
      })
      .then(response => response.blob())
      .then(blob => {
        // Create audio from the blob
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        audio.play();
      })
      .catch(error => {
        console.error('Error playing voice response:', error);
      });
    });
  } else {
    // Browser doesn't support speech recognition
    voiceSearchBtn.disabled = true;
    voiceStatusText.textContent = 'Voice search not supported in this browser';
  }
  
  // Function to process voice command
  function processVoiceCommand(command) {
    // Show loading status
    voiceStatusText.textContent = 'Processing your request...';
    
    // Send voice command to server
    fetch('/voice-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ voice_command: command })
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        // Show error
        voiceStatusText.textContent = 'Error: ' + data.error;
      } else {
        // Show voice response
        voiceResponseText.textContent = data.voice_response;
        voiceResponseContainer.classList.remove('d-none');
        
        // If there are jobs, navigate to results page
        if (data.matched_jobs && data.matched_jobs.length > 0) {
          // Show the results on a new page
          showVoiceSearchResults(data);
        } else if (data.total_matches === 0) {
          // No results found
          voiceSearchSummaryText.textContent = 'No jobs found matching your search.';
          voiceStatusText.textContent = 'Done! Try another search.';
        }
      }
    })
    .catch(error => {
      console.error('Error processing voice command:', error);
      voiceStatusText.textContent = 'Error processing your request. Please try again.';
    });
  }
  
  // Function to show voice search results
  function showVoiceSearchResults(data) {
    // Hide main page
    mainPage.classList.add('d-none');
    // Show voice search results page
    voiceSearchResultsPage.classList.remove('d-none');
    
    // Update summary text
    voiceSearchSummaryText.textContent = data.voice_response;
    
    // Clear previous results
    voiceSearchResults.innerHTML = '';
    
    // Show loading spinner
    voiceSearchLoading.classList.remove('d-none');
    noResultsMessage.classList.add('d-none');
    voiceSearchError.classList.add('d-none');
    
    try {
      // Hide loading spinner
      voiceSearchLoading.classList.add('d-none');
      
      if (data.matched_jobs && data.matched_jobs.length > 0) {
        // Create job cards for each result
        data.matched_jobs.forEach(job => {
          const jobCard = createJobCard(job);
          voiceSearchResults.appendChild(jobCard);
        });
      } else {
        // Show no results message
        noResultsMessage.classList.remove('d-none');
      }
    } catch (error) {
      console.error('Error displaying search results:', error);
      voiceSearchLoading.classList.add('d-none');
      voiceSearchError.textContent = 'Error displaying search results. Please try again.';
      voiceSearchError.classList.remove('d-none');
    }
  }
});