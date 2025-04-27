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
  
  // Elements for date, time and location display
  const currentDateElement = document.getElementById('current-date');
  const currentTimeElement = document.getElementById('current-time');
  const currentLocationElement = document.getElementById('current-location');
  const locationDisplay = document.getElementById('location-display');
  
  // Search form elements
  const navbarSearchForm = document.getElementById('navbar-search-form');
  const navbarSearchInput = document.getElementById('navbar-search-input');
  
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
  
  // Language selection elements
  const languageOptions = document.querySelectorAll('[data-language]');
  
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
  
  // Add event listeners to main buttons - using direct DOM references to avoid variable issues
  document.getElementById('apply-button').addEventListener('click', function() {
    document.getElementById('main-page').classList.add('d-none');
    document.getElementById('apply-page').classList.remove('d-none');
  });
  
  document.getElementById('post-button').addEventListener('click', function() {
    document.getElementById('main-page').classList.add('d-none');
    document.getElementById('post-job-page').classList.remove('d-none');
  });
  
  // Add event listeners to view workers button
  document.getElementById('view-workers-button').addEventListener('click', function() {
    document.getElementById('main-page').classList.add('d-none');
    document.getElementById('workers-page').classList.remove('d-none');
    
    // Load workers data
    fetchWorkers();
  });
  
  // Add event listeners to view jobs button
  document.getElementById('view-jobs-button').addEventListener('click', function() {
    document.getElementById('main-page').classList.add('d-none');
    document.getElementById('jobs-page').classList.remove('d-none');
    
    // Load jobs data
    fetchJobs();
  });
  
  // Add event listeners to back buttons
  document.querySelectorAll('.btn-back').forEach(function(button) {
    button.addEventListener('click', function() {
      document.getElementById('main-page').classList.remove('d-none');
      document.getElementById('apply-page').classList.add('d-none');
      document.getElementById('post-job-page').classList.add('d-none');
      document.getElementById('workers-page').classList.add('d-none');
      document.getElementById('jobs-page').classList.add('d-none');
      
      // Hide success and error messages
      document.getElementById('apply-success').style.display = 'none';
      document.getElementById('post-success').style.display = 'none';
      document.getElementById('apply-error').style.display = 'none';
      document.getElementById('post-error').style.display = 'none';
      
      // Reset forms
      document.getElementById('apply-form').reset();
      document.getElementById('post-job-form').reset();
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
    // Determine current page using proper ID references
    let currentPage = 'main';
    if (!document.getElementById('main-page').classList.contains('d-none')) {
      currentPage = 'main';
    } else if (!document.getElementById('apply-page').classList.contains('d-none')) {
      currentPage = 'apply';
    } else if (!document.getElementById('post-job-page').classList.contains('d-none')) {
      currentPage = 'post-job';
    } else if (!document.getElementById('workers-page').classList.contains('d-none')) {
      currentPage = 'workers';
    } else if (!document.getElementById('jobs-page').classList.contains('d-none')) {
      currentPage = 'jobs';
    }
    
    // Create audio element and play voice guide
    const audio = new Audio(`/voice-guide/${currentPage}`);
    audio.play();
  });
  
  // Visual guide functionality
  visualGuideBtn.addEventListener('click', function() {
    // Determine current page using proper ID references
    let currentPage = 'main';
    if (!document.getElementById('main-page').classList.contains('d-none')) {
      currentPage = 'main';
    } else if (!document.getElementById('apply-page').classList.contains('d-none')) {
      currentPage = 'apply';
    } else if (!document.getElementById('post-job-page').classList.contains('d-none')) {
      currentPage = 'post-job';
    } else if (!document.getElementById('workers-page').classList.contains('d-none')) {
      currentPage = 'workers';
    } else if (!document.getElementById('jobs-page').classList.contains('d-none')) {
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
  
  // Function to update date and time
  function updateDateTime() {
    const now = new Date();
    
    // Format date: Apr 27, 2025
    const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = now.toLocaleDateString('en-US', dateOptions);
    
    // Format time: 14:30:45
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const formattedTime = now.toLocaleTimeString('en-US', timeOptions);
    
    // Update elements
    if (currentDateElement) currentDateElement.textContent = formattedDate;
    if (currentTimeElement) currentTimeElement.textContent = formattedTime;
  }
  
  // Update date and time initially and then every second
  updateDateTime();
  setInterval(updateDateTime, 60000); // Update every minute
  
  // Set up location dropdown functionality
  function setupLocationDropdown() {
    // Define a list of available locations
    const locations = [
      'All Locations',
      'New York, NY',
      'Los Angeles, CA',
      'Chicago, IL',
      'Houston, TX',
      'Phoenix, AZ',
      'Philadelphia, PA',
      'San Antonio, TX',
      'San Diego, CA',
      'Dallas, TX',
      'San Jose, CA'
    ];
    
    // Get all location options in the dropdown menu
    const locationOptions = document.querySelectorAll('.location-option');
    
    // Populate the nearby location select dropdown
    const nearbyLocationSelect = document.getElementById('nearby-location-select');
    if (nearbyLocationSelect) {
      // Clear existing options
      nearbyLocationSelect.innerHTML = '';
      
      // Add location options (excluding 'All Locations' for nearby jobs)
      locations.forEach(location => {
        if (location !== 'All Locations') {
          const option = document.createElement('option');
          option.value = location;
          option.textContent = location;
          nearbyLocationSelect.appendChild(option);
        }
      });
      
      // Set default selection based on saved location
      const savedLocation = localStorage.getItem('selectedLocation');
      if (savedLocation && savedLocation !== 'All Locations') {
        // Find and select the matching option
        for (let i = 0; i < nearbyLocationSelect.options.length; i++) {
          if (nearbyLocationSelect.options[i].value === savedLocation) {
            nearbyLocationSelect.options[i].selected = true;
            break;
          }
        }
      }
    }
    
    // Set initial location in the navbar
    if (currentLocationElement) {
      const savedLocation = localStorage.getItem('selectedLocation') || 'All Locations';
      currentLocationElement.textContent = savedLocation;
    }
    
    // Add click event listeners to each location option in the dropdown
    locationOptions.forEach(option => {
      option.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get the selected location
        const selectedLocation = this.getAttribute('data-location');
        
        // Update the current location display
        if (currentLocationElement) {
          currentLocationElement.textContent = selectedLocation;
          
          // Save to localStorage
          localStorage.setItem('selectedLocation', selectedLocation);
          
          // Update nearby location dropdown to match
          if (nearbyLocationSelect && selectedLocation !== 'All Locations') {
            for (let i = 0; i < nearbyLocationSelect.options.length; i++) {
              if (nearbyLocationSelect.options[i].value === selectedLocation) {
                nearbyLocationSelect.options[i].selected = true;
                break;
              }
            }
          }
          
          // If a location is selected and search form exists, update search
          if (navbarSearchForm && selectedLocation !== 'All Locations') {
            // If the search input has text, automatically trigger search with location
            const searchQuery = navbarSearchInput.value.trim();
            if (searchQuery) {
              // We could automatically trigger the search, but for now we'll just let
              // the user click the search button when ready
              console.log(`Location updated to: ${selectedLocation}`);
            }
          }
        }
        
        // Add active class to selected item and remove from others
        locationOptions.forEach(opt => {
          if (opt.getAttribute('data-location') === selectedLocation) {
            opt.classList.add('active');
          } else {
            opt.classList.remove('active');
          }
        });
      });
      
      // Set initial active state in the dropdown
      if (localStorage.getItem('selectedLocation') === option.getAttribute('data-location')) {
        option.classList.add('active');
      }
    });
    
    // Set up nearby jobs functionality
    setupNearbyJobs();
  }
  
  // Initialize location dropdown
  setupLocationDropdown();
  
  // Set up language selection
  languageOptions.forEach(option => {
    option.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get the selected language
      const language = this.getAttribute('data-language');
      
      // Save the preference
      localStorage.setItem('preferred-language', language);
      
      // Update the UI to show active language
      languageOptions.forEach(opt => {
        if (opt.getAttribute('data-language') === language) {
          opt.classList.add('active');
          opt.querySelector('i').classList.remove('d-none');
        } else {
          opt.classList.remove('active');
          const icon = opt.querySelector('i');
          if (icon) icon.classList.add('d-none');
        }
      });
      
      // TODO: In a real implementation, you would load language-specific content here
      console.log(`Language changed to: ${language}`);
      
      // Display a notification about language change
      const notification = document.createElement('div');
      notification.className = 'toast position-fixed bottom-0 end-0 m-3';
      notification.setAttribute('role', 'alert');
      notification.setAttribute('aria-live', 'assertive');
      notification.setAttribute('aria-atomic', 'true');
      notification.innerHTML = `
        <div class="toast-header">
          <i class="bi bi-translate me-2"></i>
          <strong class="me-auto">Language Changed</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          Language changed to ${language === 'en' ? 'English' : 'हिंदी (Hindi)'}
        </div>
      `;
      document.body.appendChild(notification);
      
      // Show the notification
      const toast = new bootstrap.Toast(notification);
      toast.show();
      
      // Remove notification after it's hidden
      notification.addEventListener('hidden.bs.toast', function () {
        document.body.removeChild(notification);
      });
    });
  });
  
  // Load saved language preference
  const savedLanguage = localStorage.getItem('preferred-language') || 'en';
  languageOptions.forEach(option => {
    const lang = option.getAttribute('data-language');
    if (lang === savedLanguage) {
      option.classList.add('active');
      option.querySelector('i').classList.remove('d-none');
    } else {
      option.classList.remove('active');
      const icon = option.querySelector('i');
      if (icon) icon.classList.add('d-none');
    }
  });
  
  // Function to set up nearby jobs functionality
  function setupNearbyJobs() {
    const findNearbyJobsBtn = document.getElementById('find-nearby-jobs');
    if (!findNearbyJobsBtn) return;
    
    findNearbyJobsBtn.addEventListener('click', searchNearbyJobs);
  }
  
  // Function to search for nearby jobs
  function searchNearbyJobs() {
    // Get the selected location and distance
    const locationSelect = document.getElementById('nearby-location-select');
    const distanceSelect = document.getElementById('distance-select');
    
    const location = locationSelect.value;
    const maxDistance = parseInt(distanceSelect.value);
    
    if (!location) {
      showNearbyJobsError('Please select a location');
      return;
    }
    
    // Show loading spinner
    document.getElementById('nearby-jobs-loading').classList.remove('d-none');
    
    // Hide previous results and errors
    document.getElementById('nearby-jobs-results').classList.add('d-none');
    document.getElementById('map-container').classList.add('d-none');
    document.getElementById('nearby-jobs-error').classList.add('d-none');
    
    // Make API call to get nearby jobs
    fetch('/nearby-jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ location, max_distance: maxDistance })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Hide loading spinner
      document.getElementById('nearby-jobs-loading').classList.add('d-none');
      
      // Update heading to show search location
      document.getElementById('jobs-heading').textContent = `Jobs Near ${location}`;
      
      // Display map if available
      if (data.map_url) {
        const mapImage = document.getElementById('map-image');
        mapImage.src = data.map_url;
        document.getElementById('map-container').classList.remove('d-none');
      }
      
      // Show results container
      const resultsContainer = document.getElementById('nearby-jobs-results');
      resultsContainer.classList.remove('d-none');
      
      if (data.nearby_jobs && data.nearby_jobs.length > 0) {
        displayNearbyJobs(data.nearby_jobs);
        document.getElementById('no-nearby-jobs').classList.add('d-none');
      } else {
        document.getElementById('nearby-jobs-container').innerHTML = '';
        document.getElementById('no-nearby-jobs').classList.remove('d-none');
      }
    })
    .catch(error => {
      console.error('Error finding nearby jobs:', error);
      document.getElementById('nearby-jobs-loading').classList.add('d-none');
      showNearbyJobsError('Failed to find nearby jobs. Please try again later.');
    });
  }
  
  // Function to display nearby jobs
  function displayNearbyJobs(jobs) {
    const container = document.getElementById('nearby-jobs-container');
    container.innerHTML = '';
    
    jobs.forEach((job, index) => {
      // Create a job card with distance information
      const card = createJobCard(job, index + 1);
      container.appendChild(card);
    });
  }
  
  // Function to show nearby jobs error
  function showNearbyJobsError(message) {
    const errorElement = document.getElementById('nearby-jobs-error');
    errorElement.textContent = message;
    errorElement.classList.remove('d-none');
  }
  
  // Handle search form submission
  if (navbarSearchForm) {
    navbarSearchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const searchQuery = navbarSearchInput.value.trim();
      const selectedLocation = currentLocationElement ? currentLocationElement.textContent : 'All Locations';
      
      if (searchQuery) {
        console.log('Searching for:', searchQuery, 'in location:', selectedLocation);
        
        // Navigate to jobs page and show loading indicator
        document.getElementById('main-page').classList.add('d-none');
        document.getElementById('jobs-page').classList.remove('d-none');
        
        // Clear previous content and show loading
        jobsContainer.innerHTML = '';
        jobsLoading.classList.remove('d-none');
        jobsError.classList.add('d-none');
        noJobsMessage.classList.add('d-none');
        
        // Build the query URL with search query and location (if not "All Locations")
        let queryUrl = `/jobs?query=${encodeURIComponent(searchQuery)}`;
        if (selectedLocation && selectedLocation !== 'All Locations') {
          queryUrl += `&location=${encodeURIComponent(selectedLocation)}`;
        }
        
        // Fetch jobs with the search query and location
        fetch(queryUrl)
          .then(response => response.json())
          .then(data => {
            jobsLoading.classList.add('d-none');
            
            if (data.error) {
              jobsError.textContent = data.error;
              jobsError.classList.remove('d-none');
            } else if (data.jobs && data.jobs.length > 0) {
              // Display jobs
              data.jobs.forEach(job => {
                const jobCard = createJobCard(job);
                jobsContainer.appendChild(jobCard);
              });
              
              // Display search summary
              const locationText = selectedLocation !== 'All Locations' ? ` in ${selectedLocation}` : '';
              document.getElementById('jobs-heading').textContent = `Jobs matching "${searchQuery}"${locationText}`;
            } else {
              // Show no jobs message
              noJobsMessage.classList.remove('d-none');
              noJobsMessage.textContent = `No jobs found matching "${searchQuery}"${selectedLocation !== 'All Locations' ? ` in ${selectedLocation}` : ''}`;
            }
          })
          .catch(error => {
            console.error('Error searching jobs:', error);
            jobsLoading.classList.add('d-none');
            jobsError.textContent = 'Failed to search jobs. Please try again.';
            jobsError.classList.remove('d-none');
          });
      }
    });
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
    card.className = 'card mb-3 worker-card';
    
    // Format the date if available
    let formattedDate = 'Unknown';
    if (worker.created_at) {
      const date = new Date(worker.created_at);
      formattedDate = date.toLocaleDateString();
    }
    
    // Generate random color for avatar background
    const colors = ['#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#E91E63', '#00BCD4'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Get initials for avatar
    const initials = worker.name.split(' ').map(name => name.charAt(0)).join('').toUpperCase();
    
    card.innerHTML = `
      <div class="card-body">
        <div class="d-flex">
          <div class="worker-avatar me-3" style="background-color: ${randomColor}; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.2rem;">
            ${initials}
          </div>
          <div>
            <h5 class="card-title">${worker.name}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${worker.skill}</h6>
          </div>
        </div>
        
        <div class="card-text mt-3">
          <p>
            <i class="bi bi-geo-alt-fill text-primary me-2"></i>
            <strong>Location:</strong> ${worker.location || 'Not specified'}
          </p>
          <p>
            <i class="bi bi-briefcase-fill text-primary me-2"></i>
            <strong>Experience:</strong> ${worker.experience || 'Not specified'}
          </p>
          <p>
            <i class="bi bi-book-fill text-primary me-2"></i>
            <strong>Education:</strong> ${worker.education || 'Not specified'}
          </p>
          <div class="d-flex align-items-center">
            <p class="mb-0 me-2">
              <i class="bi bi-telephone-fill text-primary me-2"></i>
              <strong>Contact:</strong> ${worker.phone}
            </p>
            <a href="tel:${worker.phone.replace(/\D/g,'')}" class="btn btn-sm btn-success call-btn">
              <i class="bi bi-telephone-fill"></i> Call
            </a>
          </div>
        </div>
        
        <div class="d-flex justify-content-between align-items-center mt-3">
          <div class="text-muted small">
            <i class="bi bi-calendar-event me-1"></i> Profile created: ${formattedDate}
          </div>
          <button class="btn btn-primary btn-sm contact-worker-btn" data-worker-id="${worker.id || '0'}">
            <i class="bi bi-chat-dots-fill"></i> Contact
          </button>
        </div>
      </div>
    `;
    
    // Add event listener for contact button
    setTimeout(() => {
      const contactBtn = card.querySelector('.contact-worker-btn');
      if (contactBtn) {
        contactBtn.addEventListener('click', function() {
          showWorkerContactModal(worker);
        });
      }
    }, 0);
    
    return card;
  }
  
  // Function to show worker contact modal
  function showWorkerContactModal(worker) {
    // Create modal dynamically if it doesn't exist
    let modal = document.getElementById('worker-contact-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'modal fade';
      modal.id = 'worker-contact-modal';
      modal.setAttribute('tabindex', '-1');
      modal.setAttribute('aria-labelledby', 'worker-contact-modal-label');
      modal.setAttribute('aria-hidden', 'true');
      
      modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="worker-contact-modal-label">Contact Worker</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="worker-info mb-3"></div>
              <form id="worker-contact-form">
                <div class="mb-3">
                  <label for="job-description" class="form-label">Job Description</label>
                  <textarea class="form-control" id="job-description" rows="3" placeholder="Describe the job opportunity..."></textarea>
                </div>
                <div class="mb-3">
                  <label for="employer-name" class="form-label">Your Name</label>
                  <input type="text" class="form-control" id="employer-name" placeholder="Enter your name">
                </div>
                <div class="mb-3">
                  <label for="employer-contact" class="form-label">Your Contact Number</label>
                  <input type="tel" class="form-control" id="employer-contact" placeholder="Enter your contact number">
                </div>
                <div class="confirmation-slider-container mt-3 mb-3">
                  <label for="contact-confirmation-slider" class="form-label">Slide to confirm</label>
                  <input type="range" class="form-range" id="contact-confirmation-slider" min="0" max="100" value="0">
                  <div class="d-flex justify-content-between">
                    <small>Slide right to confirm</small>
                    <small class="contact-confirmation-value">0%</small>
                  </div>
                </div>
                <div class="alert alert-success d-none" id="worker-contact-success">
                  Message sent successfully! The worker will contact you soon.
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" id="send-message-btn" disabled>Send Message</button>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Set up the slider functionality
      const slider = document.getElementById('contact-confirmation-slider');
      const confirmBtn = document.getElementById('send-message-btn');
      const confirmationValue = document.querySelector('.contact-confirmation-value');
      
      slider.addEventListener('input', function() {
        confirmationValue.textContent = `${this.value}%`;
        if (parseInt(this.value) >= 90) {
          confirmBtn.disabled = false;
        } else {
          confirmBtn.disabled = true;
        }
      });
      
      // Set up the send button functionality
      confirmBtn.addEventListener('click', function() {
        // Here you would normally send the message to the server
        // For now, we'll just show a success message
        document.getElementById('worker-contact-success').classList.remove('d-none');
        
        // Reset form and slider
        document.getElementById('worker-contact-form').reset();
        slider.value = 0;
        confirmationValue.textContent = '0%';
        confirmBtn.disabled = true;
        
        // Close the modal after a delay
        setTimeout(() => {
          const modalInstance = bootstrap.Modal.getInstance(modal);
          modalInstance.hide();
          document.getElementById('worker-contact-success').classList.add('d-none');
        }, 2000);
      });
    }
    
    // Update modal content with worker details
    const workerInfo = modal.querySelector('.worker-info');
    workerInfo.innerHTML = `
      <div class="d-flex align-items-center">
        <div class="me-3">
          <i class="bi bi-person-circle fs-1 text-primary"></i>
        </div>
        <div>
          <h5 class="mb-1">${worker.name}</h5>
          <p class="mb-1 text-muted">${worker.skill}</p>
          <p class="mb-0 small">Location: ${worker.location || 'Not specified'}</p>
        </div>
      </div>
    `;
    
    // Show the modal
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
  }
  
  // Function to create a job card
  function createJobCard(job, index) {
    const card = document.createElement('div');
    card.className = 'card mb-3';
    
    // Format the date if available
    let formattedDate = 'Unknown';
    if (job.created_at) {
      const date = new Date(job.created_at);
      formattedDate = date.toLocaleDateString();
    }
    
    // Add index label if provided (for nearby jobs)
    const indexLabel = index ? `<span class="badge bg-info position-absolute top-0 start-0 mt-2 ms-2">#${index}</span>` : '';
    
    card.innerHTML = `
      <div class="card-body position-relative">
        ${indexLabel}
        <h5 class="card-title">${job.job_role}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${job.business_name}</h6>
        
        <div class="card-text">
          <p><strong>Payment:</strong> ${job.payment}</p>
          <p><strong>Location:</strong> ${job.location || 'Not specified'}</p>
          <p><strong>Description:</strong> ${job.job_description || 'Not provided'}</p>
          <div class="contact-info d-flex align-items-center">
            <p class="mb-0 me-2"><strong>Contact:</strong> ${job.contact_number}</p>
            <a href="tel:${job.contact_number.replace(/\D/g,'')}" class="btn btn-sm btn-success call-btn">
              <i class="bi bi-telephone-fill"></i> Call
            </a>
          </div>
          <p class="mt-2"><strong>Status:</strong> <span class="badge bg-success">${job.status || 'Open'}</span></p>
          ${job.distance ? `<p><strong>Distance:</strong> <span class="badge bg-info">${job.distance} km away</span></p>` : ''}
        </div>
        
        <div class="d-flex justify-content-between align-items-center mt-3">
          <div class="card-footer text-muted">
            Posted on: ${formattedDate}
          </div>
          <button class="btn btn-primary apply-to-job-btn" data-job-id="${job.id}">
            <i class="bi bi-check-circle-fill"></i> Apply Now
          </button>
        </div>
      </div>
    `;
    
    // Add event listener to the apply button after the card is created
    setTimeout(() => {
      const applyBtn = card.querySelector('.apply-to-job-btn');
      if (applyBtn) {
        applyBtn.addEventListener('click', function() {
          showJobApplicationModal(job);
        });
      }
    }, 0);
    
    return card;
  }
  
  // Function to show job application modal
  function showJobApplicationModal(job) {
    // Create modal dynamically if it doesn't exist
    let modal = document.getElementById('job-application-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'modal fade';
      modal.id = 'job-application-modal';
      modal.setAttribute('tabindex', '-1');
      modal.setAttribute('aria-labelledby', 'job-application-modal-label');
      modal.setAttribute('aria-hidden', 'true');
      
      modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="job-application-modal-label">Apply for Job</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p class="job-details"></p>
              <div class="confirmation-slider-container mt-3 mb-3">
                <label for="confirmation-slider" class="form-label">Slide to confirm your application</label>
                <input type="range" class="form-range" id="confirmation-slider" min="0" max="100" value="0">
                <div class="d-flex justify-content-between">
                  <small>Slide right to confirm</small>
                  <small class="confirmation-value">0%</small>
                </div>
              </div>
              <div class="alert alert-success d-none" id="job-application-success">
                Application successful! The employer will contact you soon.
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" id="confirm-application-btn" disabled>Confirm Application</button>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Set up the slider functionality
      const slider = document.getElementById('confirmation-slider');
      const confirmBtn = document.getElementById('confirm-application-btn');
      const confirmationValue = document.querySelector('.confirmation-value');
      
      slider.addEventListener('input', function() {
        confirmationValue.textContent = `${this.value}%`;
        if (parseInt(this.value) >= 90) {
          confirmBtn.disabled = false;
        } else {
          confirmBtn.disabled = true;
        }
      });
      
      // Set up the confirm button functionality
      confirmBtn.addEventListener('click', function() {
        // Here you would normally send the application to the server
        // For now, we'll just show a success message
        document.getElementById('job-application-success').classList.remove('d-none');
        slider.value = 0;
        confirmationValue.textContent = '0%';
        confirmBtn.disabled = true;
        
        // Close the modal after a delay
        setTimeout(() => {
          const modalInstance = bootstrap.Modal.getInstance(modal);
          modalInstance.hide();
          document.getElementById('job-application-success').classList.add('d-none');
        }, 2000);
      });
    }
    
    // Update modal content with job details
    const jobDetails = modal.querySelector('.job-details');
    jobDetails.innerHTML = `
      You are applying for <strong>${job.job_role}</strong> at 
      <strong>${job.business_name}</strong> in ${job.location || 'Not specified'}.
    `;
    
    // Show the modal
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
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
  
  // Authentication Elements
  const userInfo = document.getElementById('user-info');
  const usernameDisplay = document.getElementById('username-display');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const loginError = document.getElementById('login-error');
  const registerError = document.getElementById('register-error');
  const logoutLink = document.getElementById('logout-link');
  const profileLink = document.getElementById('profile-link');
  
  // Profile Modal Elements
  const profileUsername = document.getElementById('profile-username');
  const profileEmail = document.getElementById('profile-email');
  const profileType = document.getElementById('profile-type');
  const profileCreated = document.getElementById('profile-created');
  
  // Check if user is already logged in
  checkAuthStatus();
  
  // Function to check authentication status
  function checkAuthStatus() {
    fetch('/user')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          // User is not logged in
          showAuthButtons();
          return null;
        } else {
          throw new Error('Failed to check auth status');
        }
      })
      .then(data => {
        if (data && data.user) {
          // User is logged in
          showUserInfo(data.user);
          
          // Update profile modal with user data
          updateProfileModal(data.user);
        }
      })
      .catch(error => {
        console.error('Auth status check error:', error);
        showAuthButtons();
      });
  }
  
  // Reference welcome section
  const welcomeSection = document.getElementById('welcome-section');
  
  // Function to show welcome screen (when not logged in)
  function showAuthButtons() {
    userInfo.classList.add('d-none');
    
    // Show welcome section, hide main page
    if (welcomeSection) {
      welcomeSection.classList.remove('d-none');
    }
    if (document.getElementById('main-page')) {
      document.getElementById('main-page').classList.add('d-none');
    }
  }
  
  // Function to show user info when logged in
  function showUserInfo(user) {
    userInfo.classList.remove('d-none');
    usernameDisplay.textContent = user.username;
    
    // Hide welcome section, show main page
    if (welcomeSection) {
      welcomeSection.classList.add('d-none');
    }
    if (document.getElementById('main-page')) {
      document.getElementById('main-page').classList.remove('d-none');
    }
  }
  
  // Function to update profile modal with user data
  function updateProfileModal(user) {
    // Update profile details
    profileUsername.textContent = user.username;
    profileEmail.textContent = user.email;
    
    // Update header elements
    const profileUsernameHeader = document.getElementById('profile-username-header');
    const profileTypeHeader = document.getElementById('profile-type-header');
    
    if (profileUsernameHeader) {
      profileUsernameHeader.textContent = user.username;
    }
    
    // Determine account type
    let accountType = '';
    if (user.is_worker && user.is_employer) {
      accountType = 'Worker & Employer';
    } else if (user.is_worker) {
      accountType = 'Worker';
    } else if (user.is_employer) {
      accountType = 'Employer';
    } else {
      accountType = 'Standard User';
    }
    
    profileType.textContent = accountType;
    
    if (profileTypeHeader) {
      profileTypeHeader.textContent = accountType;
    }
    
    // Format the created_at date
    if (user.created_at) {
      const date = new Date(user.created_at);
      profileCreated.textContent = date.toLocaleDateString();
    } else {
      profileCreated.textContent = 'Unknown';
    }
  }
  
  // Login form submission
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Hide previous errors
      loginError.classList.add('d-none');
      
      // Get form data
      const formData = {
        email: document.getElementById('login-email').value,
        password: document.getElementById('login-password').value
      };
      
      // Send login request
      fetch('/login', {
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
          loginError.textContent = data.error;
          loginError.classList.remove('d-none');
        } else {
          // Login successful
          // Close modal
          const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
          loginModal.hide();
          
          // Show user info
          showUserInfo(data);
          
          // Update profile modal
          updateProfileModal(data);
          
          // Reset form
          loginForm.reset();
        }
      })
      .catch(error => {
        console.error('Login error:', error);
        loginError.textContent = 'An error occurred during login. Please try again.';
        loginError.classList.remove('d-none');
      });
    });
  }
  
  // Register form submission
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Hide previous errors
      registerError.classList.add('d-none');
      
      // Get form data
      const password = document.getElementById('register-password').value;
      const confirmPassword = document.getElementById('register-confirm-password').value;
      
      // Check if passwords match
      if (password !== confirmPassword) {
        registerError.textContent = 'Passwords do not match';
        registerError.classList.remove('d-none');
        return;
      }
      
      // Get selected user type
      const userType = document.querySelector('input[name="user-type"]:checked').value;
      
      const formData = {
        username: document.getElementById('register-username').value,
        email: document.getElementById('register-email').value,
        password: password,
        confirm_password: confirmPassword,
        user_type: userType
      };
      
      // Send registration request
      fetch('/register', {
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
          registerError.textContent = data.error;
          registerError.classList.remove('d-none');
        } else {
          // Registration successful
          // Close modal
          const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
          registerModal.hide();
          
          // Show user info
          showUserInfo(data);
          
          // Reset form
          registerForm.reset();
          
          // Show welcome message
          alert('Welcome to GigWorker Match! Your account has been created successfully.');
        }
      })
      .catch(error => {
        console.error('Registration error:', error);
        registerError.textContent = 'An error occurred during registration. Please try again.';
        registerError.classList.remove('d-none');
      });
    });
  }
  
  // Logout functionality
  if (logoutLink) {
    logoutLink.addEventListener('click', function(e) {
      e.preventDefault();
      
      fetch('/logout', {
        method: 'POST'
      })
      .then(response => response.json())
      .then(data => {
        // Show login/register buttons
        showAuthButtons();
        
        // Close the profile modal if it's open
        const profileModal = bootstrap.Modal.getInstance(document.getElementById('profileModal'));
        if (profileModal) {
          profileModal.hide();
        }
      })
      .catch(error => {
        console.error('Logout error:', error);
      });
    });
  }
  
  // Additional logout button in profile modal
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      fetch('/logout', {
        method: 'POST'
      })
      .then(response => response.json())
      .then(data => {
        // Show login/register buttons
        showAuthButtons();
        
        // Close the profile modal
        const profileModal = bootstrap.Modal.getInstance(document.getElementById('profileModal'));
        if (profileModal) {
          profileModal.hide();
        }
      })
      .catch(error => {
        console.error('Logout error:', error);
      });
    });
  }
  
  // Profile link
  if (profileLink) {
    profileLink.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Show profile modal
      const profileModal = new bootstrap.Modal(document.getElementById('profileModal'));
      profileModal.show();
    });
  }
});