// Reservia - Professional Booking Platform
// Enhanced functionality for hotel booking website

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all features
    initializeSearch();
    initializeFilters();
    initializeDatePicker();
    initializeGuestCounter();
    initializeHotelCards();
    initializeNavigation();
    initializeFavorites();
    console.log('Reservia booking platform initialized');
}

// Search functionality
function initializeSearch() {
    const searchForm = document.querySelector('form');
    const searchInput = document.querySelector('input[name="localisation"]');
    const searchButton = document.querySelector('button');
    
    if (searchForm && searchInput && searchButton) {
        searchForm.addEventListener('submit', handleSearch);
        searchInput.addEventListener('input', handleSearchInput);
    }
}

function handleSearch(event) {
    event.preventDefault();
    const searchTerm = document.querySelector('input[name="localisation"]').value.toLowerCase();
    
    // Show loading state
    showLoadingState();
    
    // Simulate API call delay
    setTimeout(() => {
        filterHotelsByLocation(searchTerm);
        hideLoadingState();
        
        // Update info text
        updateSearchResults(searchTerm);
    }, 800);
}

function handleSearchInput(event) {
    // Real-time search suggestions could be added here
    const value = event.target.value;
    if (value.length > 2) {
        // Could show dropdown with suggestions
    }
}

function filterHotelsByLocation(searchTerm) {
    const hotels = document.querySelectorAll('article');
    let visibleCount = 0;
    
    hotels.forEach(hotel => {
        const title = hotel.querySelector('h3')?.textContent.toLowerCase() || '';
        const isVisible = title.includes(searchTerm) || searchTerm === '' || 
                         searchTerm === 'marseille' || searchTerm === 'france';
        
        hotel.style.display = isVisible ? 'block' : 'none';
        if (isVisible) visibleCount++;
    });
    
    return visibleCount;
}

function updateSearchResults(searchTerm) {
    const infoElement = document.querySelector('.phraseInfo');
    if (infoElement) {
        const count = document.querySelectorAll('article[style*="block"], article:not([style*="none"])').length;
        infoElement.textContent = `${count} logements trouvés pour "${searchTerm}"`;
    }
}

// Filter functionality
function initializeFilters() {
    const filters = document.querySelectorAll('.filtres > div');
    
    filters.forEach((filter, index) => {
        if (index > 0) { // Skip the "Filtres" text element
            filter.addEventListener('click', () => handleFilterClick(filter));
            filter.style.cursor = 'pointer';
            filter.classList.add('filter-button');
        }
    });
}

function handleFilterClick(filterElement) {
    // Toggle active state
    filterElement.classList.toggle('filter-active');
    
    // Apply filter logic
    const filterType = filterElement.querySelector('.descriptionfiltre')?.textContent.toLowerCase();
    applyFilter(filterType, filterElement.classList.contains('filter-active'));
}

function applyFilter(filterType, isActive) {
    const hotels = document.querySelectorAll('.blocartes article');
    
    hotels.forEach(hotel => {
        const price = parseInt(hotel.querySelector('.description')?.textContent.match(/\d+/)?.[0] || '0');
        let shouldShow = true;
        
        // Apply filter logic based on type
        switch(filterType) {
            case 'économique':
                shouldShow = isActive ? price <= 50 : true;
                break;
            case 'familial':
                // Family-friendly hotels (could be based on hotel name or features)
                shouldShow = isActive ? hotel.querySelector('h3')?.textContent.toLowerCase().includes('famille') || price <= 80 : true;
                break;
            case 'romantique':
                // Romantic hotels (higher-end)
                shouldShow = isActive ? price >= 60 : true;
                break;
            case 'animaux autorisés':
                // Pet-friendly (could be based on hotel features)
                shouldShow = isActive ? Math.random() > 0.5 : true; // Random for demo
                break;
        }
        
        if (!isActive) {
            hotel.style.display = 'block'; // Show all when filter is deactivated
        } else {
            hotel.style.display = shouldShow ? 'block' : 'none';
        }
    });
}

// Date picker functionality
function initializeDatePicker() {
    createDatePickerSection();
}

function createDatePickerSection() {
    const searchSection = document.querySelector('.parametres');
    const existingForm = searchSection.querySelector('form');
    
    // Create date picker container
    const dateContainer = document.createElement('div');
    dateContainer.className = 'date-picker-container';
    dateContainer.innerHTML = `
        <div class="booking-controls">
            <div class="date-inputs">
                <div class="date-group">
                    <label for="checkin">Arrivée</label>
                    <input type="date" id="checkin" name="checkin" required>
                </div>
                <div class="date-group">
                    <label for="checkout">Départ</label>
                    <input type="date" id="checkout" name="checkout" required>
                </div>
            </div>
            <div class="guest-counter">
                <label for="guests">Voyageurs</label>
                <div class="guest-controls">
                    <button type="button" class="guest-btn minus" onclick="changeGuestCount(-1)">-</button>
                    <span id="guest-count">2</span>
                    <button type="button" class="guest-btn plus" onclick="changeGuestCount(1)">+</button>
                </div>
            </div>
        </div>
    `;
    
    // Insert after the search form
    existingForm.parentNode.insertBefore(dateContainer, existingForm.nextSibling);
    
    // Set default dates
    setDefaultDates();
}

function setDefaultDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    document.getElementById('checkin').value = today.toISOString().split('T')[0];
    document.getElementById('checkout').value = tomorrow.toISOString().split('T')[0];
    
    // Add event listeners for date validation
    document.getElementById('checkin').addEventListener('change', validateDates);
    document.getElementById('checkout').addEventListener('change', validateDates);
}

function validateDates() {
    const checkin = new Date(document.getElementById('checkin').value);
    const checkout = new Date(document.getElementById('checkout').value);
    
    if (checkout <= checkin) {
        const newCheckout = new Date(checkin);
        newCheckout.setDate(newCheckout.getDate() + 1);
        document.getElementById('checkout').value = newCheckout.toISOString().split('T')[0];
    }
}

// Guest counter functionality
function initializeGuestCounter() {
    // Guest counter is created in the date picker section
    window.changeGuestCount = function(change) {
        const countElement = document.getElementById('guest-count');
        let count = parseInt(countElement.textContent);
        count = Math.max(1, Math.min(8, count + change)); // Min 1, Max 8 guests
        countElement.textContent = count;
    };
}

// Enhanced hotel cards with modals
function initializeHotelCards() {
    const hotelCards = document.querySelectorAll('article');
    
    hotelCards.forEach((card, index) => {
        // Add hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '';
        });
        
        // Add click handler for modal
        card.addEventListener('click', () => openHotelModal(card, index));
        
        // Add favorite button
        addFavoriteButton(card, index);
    });
}

function addFavoriteButton(card, index) {
    const favoriteBtn = document.createElement('button');
    favoriteBtn.className = 'favorite-btn';
    favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
    favoriteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(index, favoriteBtn);
    });
    
    card.style.position = 'relative';
    card.appendChild(favoriteBtn);
}

function openHotelModal(card, index) {
    const hotelName = card.querySelector('h3').textContent;
    const hotelPrice = card.querySelector('.description').textContent;
    const hotelImage = card.querySelector('img').src;
    const hotelRating = card.querySelectorAll('.fas.fa-star.bleu').length;
    
    const modal = document.createElement('div');
    modal.className = 'hotel-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-header">
                <img src="${hotelImage}" alt="${hotelName}">
                <div class="hotel-info">
                    <h2>${hotelName}</h2>
                    <div class="rating">
                        ${'★'.repeat(hotelRating)}${'☆'.repeat(5-hotelRating)}
                    </div>
                    <p class="price">${hotelPrice}</p>
                </div>
            </div>
            <div class="modal-body">
                <h3>Détails de l'hébergement</h3>
                <div class="amenities">
                    <div class="amenity"><i class="fas fa-wifi"></i> WiFi gratuit</div>
                    <div class="amenity"><i class="fas fa-parking"></i> Parking</div>
                    <div class="amenity"><i class="fas fa-swimming-pool"></i> Piscine</div>
                    <div class="amenity"><i class="fas fa-dumbbell"></i> Salle de sport</div>
                </div>
                <div class="description">
                    <p>Situé au cœur de Marseille, cet établissement offre un séjour confortable avec tous les équipements modernes.</p>
                </div>
                <button class="book-now-btn" onclick="openBookingForm('${hotelName}')">Réserver maintenant</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Booking functionality
window.openBookingForm = function(hotelName) {
    alert(`Redirection vers le formulaire de réservation pour: ${hotelName}\n\nFonctionnalité de réservation en cours de développement...`);
    // Here you would typically redirect to a booking form or open a booking modal
};

// Smooth scrolling navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Favorites functionality
function initializeFavorites() {
    loadFavorites();
}

function toggleFavorite(index, button) {
    const favorites = JSON.parse(localStorage.getItem('reservia-favorites') || '[]');
    const isCurrentlyFavorite = favorites.includes(index);
    
    if (isCurrentlyFavorite) {
        const favoriteIndex = favorites.indexOf(index);
        favorites.splice(favoriteIndex, 1);
        button.innerHTML = '<i class="far fa-heart"></i>';
        button.classList.remove('favorited');
    } else {
        favorites.push(index);
        button.innerHTML = '<i class="fas fa-heart"></i>';
        button.classList.add('favorited');
    }
    
    localStorage.setItem('reservia-favorites', JSON.stringify(favorites));
}

function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('reservia-favorites') || '[]');
    
    favorites.forEach(index => {
        const cards = document.querySelectorAll('article');
        if (cards[index]) {
            const favoriteBtn = cards[index].querySelector('.favorite-btn');
            if (favoriteBtn) {
                favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
                favoriteBtn.classList.add('favorited');
            }
        }
    });
}

// Loading states
function showLoadingState() {
    const searchButton = document.querySelector('button');
    if (searchButton) {
        searchButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Recherche...';
        searchButton.disabled = true;
    }
}

function hideLoadingState() {
    const searchButton = document.querySelector('button');
    if (searchButton) {
        searchButton.innerHTML = '<span>Rechercher</span><i class="fas fa-search"></i>';
        searchButton.disabled = false;
    }
}