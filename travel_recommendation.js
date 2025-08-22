document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('href').substring(1);
            
            // Hide all sections
            document.getElementById('home').style.display = 'none';
            document.getElementById('about').style.display = 'none';
            document.getElementById('contact').style.display = 'none';
            
            // Show the target section
            if (targetSection === 'home') {
                document.getElementById('home').style.display = 'flex';
                document.querySelector('.search-section').style.visibility = 'visible';
            } else if (targetSection === 'about') {
                document.getElementById('about').style.display = 'block';
                document.querySelector('.search-section').style.visibility = 'hidden';
            } else if (targetSection === 'contact') {
                document.getElementById('contact').style.display = 'block';
                document.querySelector('.search-section').style.visibility = 'hidden';
            }
        });
    });

    function searchRecommendations() {
        const query = document.getElementById('searchInput').value.toLowerCase();
        const resultDiv = document.getElementById('resultsContainer');
        resultDiv.innerHTML = '';

        if (query.trim() === '') {
            return;
        }

        fetch('travel_recommendation_api.json')
            .then(response => response.json())
            .then(data => {
                let results = [];
                
                // Search in countries/cities
                data.countries.forEach(country => {
                    country.cities.forEach(city => {
                        if (city.name.toLowerCase().includes(query) || 
                            city.description.toLowerCase().includes(query) ||
                            country.name.toLowerCase().includes(query)) {
                            results.push({
                                name: city.name,
                                imageUrl: city.imageUrl,
                                description: city.description,
                                type: 'City'
                            });
                        }
                    });
                });
                
                // Search in temples
                data.temples.forEach(temple => {
                    if (temple.name.toLowerCase().includes(query) || 
                        temple.description.toLowerCase().includes(query)) {
                        results.push({
                            name: temple.name,
                            imageUrl: temple.imageUrl,
                            description: temple.description,
                            type: 'Temple'
                        });
                    }
                });
                
                // Search in beaches
                data.beaches.forEach(beach => {
                    if (beach.name.toLowerCase().includes(query) || 
                        beach.description.toLowerCase().includes(query)) {
                        results.push({
                            name: beach.name,
                            imageUrl: beach.imageUrl,
                            description: beach.description,
                            type: 'Beach'
                        });
                    }
                });
                
                displayResults(results);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                resultDiv.innerHTML = '<p>Error loading recommendations. Please try again.</p>';
            });
    }

    function displayResults(results) {
        const resultDiv = document.getElementById('resultsContainer');
        
        if (results.length === 0) {
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = '<p>No recommendations found. Try a different search term.</p>';
            return;
        }
        
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = '';
        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.innerHTML = `
                <img src="${result.imageUrl}" alt="${result.name}">
                <h3>${result.name}</h3>
                <p class="result-type">Type: ${result.type}</p>
                <p class="result-description">${result.description}</p>
            `;
            resultDiv.appendChild(resultItem);
        });
    }

    function clearResults() {
        const resultDiv = document.getElementById('resultsContainer');
        const searchInput = document.getElementById('searchInput');
        resultDiv.innerHTML = '';
        resultDiv.style.display = 'none';
        searchInput.value = '';
    }

    // Make functions globally accessible
    window.searchRecommendations = searchRecommendations;
    window.clearResults = clearResults;

    // Add event listeners for search and reset buttons
    const searchButton = document.getElementById('searchBtn');
    const resetButton = document.getElementById('resetBtn');
    const searchInput = document.getElementById('searchInput');

    if (searchButton) {
        searchButton.addEventListener('click', searchRecommendations);
    }

    if (resetButton) {
        resetButton.addEventListener('click', clearResults);
    }

    // Allow search on Enter key press
    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                searchRecommendations();
            }
        });
    }

    // Handle contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Show success notification
            showNotification('Thank you! Your message has been sent successfully. We will get back to you soon.');
            
            // Reset form
            contactForm.reset();
        });
    }

    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Hide and remove notification after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
});