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
});