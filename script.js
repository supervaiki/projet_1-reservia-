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
    initializeSortFunctionality();
    initializeAccessibility();
    addFavoritesManagement();
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
    updateFavoritesDisplay();
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

// Sort functionality
function initializeSortFunctionality() {
    createSortControls();
}

function createSortControls() {
    const accommodationsSection = document.querySelector('.hebergement section');
    const title = accommodationsSection.querySelector('h2');
    
    const sortContainer = document.createElement('div');
    sortContainer.className = 'sort-controls';
    sortContainer.innerHTML = `
        <label for="sort-select">Trier par:</label>
        <select id="sort-select">
            <option value="default">Pertinence</option>
            <option value="price-low">Prix croissant</option>
            <option value="price-high">Prix décroissant</option>
            <option value="rating">Note</option>
            <option value="name">Nom A-Z</option>
        </select>
    `;
    
    title.parentNode.insertBefore(sortContainer, title.nextSibling);
    
    document.getElementById('sort-select').addEventListener('change', handleSort);
}

function handleSort(event) {
    const sortType = event.target.value;
    const hotelContainer = document.querySelector('.blocartes');
    const hotels = Array.from(hotelContainer.querySelectorAll('article'));
    
    hotels.sort((a, b) => {
        switch(sortType) {
            case 'price-low':
                return getHotelPrice(a) - getHotelPrice(b);
            case 'price-high':
                return getHotelPrice(b) - getHotelPrice(a);
            case 'rating':
                return getHotelRating(b) - getHotelRating(a);
            case 'name':
                return getHotelName(a).localeCompare(getHotelName(b));
            default:
                return 0;
        }
    });
    
    // Clear and re-append sorted hotels
    hotelContainer.innerHTML = '';
    const firstColumn = document.createElement('div');
    const secondColumn = document.createElement('div');
    
    hotels.forEach((hotel, index) => {
        if (index < 3) {
            firstColumn.appendChild(hotel);
        } else {
            secondColumn.appendChild(hotel);
        }
    });
    
    hotelContainer.appendChild(firstColumn);
    hotelContainer.appendChild(secondColumn);
}

function getHotelPrice(hotel) {
    const priceText = hotel.querySelector('.description')?.textContent || '0';
    return parseInt(priceText.match(/\d+/)?.[0] || '0');
}

function getHotelRating(hotel) {
    return hotel.querySelectorAll('.fas.fa-star.bleu').length;
}

function getHotelName(hotel) {
    return hotel.querySelector('h3')?.textContent || '';
}

// Accessibility improvements
function initializeAccessibility() {
    // Add ARIA labels
    addAriaLabels();
    
    // Add keyboard navigation
    addKeyboardNavigation();
    
    // Add focus management
    addFocusManagement();
}

function addAriaLabels() {
    // Add ARIA labels to interactive elements
    const searchInput = document.querySelector('input[name="localisation"]');
    if (searchInput) {
        searchInput.setAttribute('aria-label', 'Rechercher une destination');
        searchInput.setAttribute('aria-describedby', 'search-help');
    }
    
    const filters = document.querySelectorAll('.filter-button');
    filters.forEach(filter => {
        const filterText = filter.querySelector('.descriptionfiltre')?.textContent;
        filter.setAttribute('aria-label', `Filtre ${filterText}`);
        filter.setAttribute('role', 'button');
        filter.setAttribute('tabindex', '0');
    });
    
    const hotelCards = document.querySelectorAll('article');
    hotelCards.forEach(card => {
        const hotelName = card.querySelector('h3')?.textContent;
        card.setAttribute('aria-label', `Voir détails de ${hotelName}`);
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
    });
}

function addKeyboardNavigation() {
    // Allow filters to be activated with keyboard
    const filters = document.querySelectorAll('.filter-button');
    filters.forEach(filter => {
        filter.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                filter.click();
            }
        });
    });
    
    // Allow hotel cards to be activated with keyboard
    const hotelCards = document.querySelectorAll('article');
    hotelCards.forEach(card => {
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
}

function addFocusManagement() {
    // Improve focus visibility
    const style = document.createElement('style');
    style.textContent = `
        .filter-button:focus,
        article:focus,
        .guest-btn:focus,
        input:focus,
        button:focus,
        select:focus {
            outline: 3px solid #0065FC;
            outline-offset: 2px;
        }
        
        .filter-button:focus,
        article:focus {
            box-shadow: 0 0 0 3px rgba(0, 101, 252, 0.3);
        }
    `;
    document.head.appendChild(style);
}

// Favorites management
function addFavoritesManagement() {
    createFavoritesSection();
}

function createFavoritesSection() {
    const main = document.querySelector('main');
    const favoritesSection = document.createElement('section');
    favoritesSection.className = 'favorites-section';
    favoritesSection.innerHTML = `
        <div class="favorites-header">
            <h2>Mes favoris</h2>
            <button class="toggle-favorites" onclick="toggleFavoritesView()">
                <i class="fas fa-heart"></i> Voir mes favoris (<span id="favorites-count">0</span>)
            </button>
        </div>
        <div class="favorites-list" id="favorites-list" style="display: none;">
            <p id="no-favorites">Aucun favori sélectionné</p>
        </div>
    `;
    
    // Insert before activities section
    const activitiesSection = document.getElementById('Activites');
    main.insertBefore(favoritesSection, activitiesSection);
    
    updateFavoritesDisplay();
}

window.toggleFavoritesView = function() {
    const favoritesList = document.getElementById('favorites-list');
    const isVisible = favoritesList.style.display !== 'none';
    
    favoritesList.style.display = isVisible ? 'none' : 'block';
    
    if (!isVisible) {
        updateFavoritesDisplay();
    }
};

function updateFavoritesDisplay() {
    const favorites = JSON.parse(localStorage.getItem('reservia-favorites') || '[]');
    const favoritesCount = document.getElementById('favorites-count');
    const favoritesList = document.getElementById('favorites-list');
    const noFavorites = document.getElementById('no-favorites');
    
    favoritesCount.textContent = favorites.length;
    
    if (favorites.length === 0) {
        noFavorites.style.display = 'block';
        return;
    }
    
    noFavorites.style.display = 'none';
    
    // Create favorite hotel cards
    const hotelCards = document.querySelectorAll('.blocartes article, aside article');
    let favoritesHTML = '<div class="favorites-grid">';
    
    favorites.forEach(index => {
        if (hotelCards[index]) {
            const hotel = hotelCards[index];
            const hotelName = hotel.querySelector('h3')?.textContent || '';
            const hotelPrice = hotel.querySelector('.description, span')?.textContent || '';
            const hotelImage = hotel.querySelector('img')?.src || '';
            
            favoritesHTML += `
                <div class="favorite-card">
                    <img src="${hotelImage}" alt="${hotelName}">
                    <div class="favorite-info">
                        <h4>${hotelName}</h4>
                        <p>${hotelPrice}</p>
                        <button onclick="removeFavorite(${index})" class="remove-favorite">
                            <i class="fas fa-trash"></i> Retirer
                        </button>
                    </div>
                </div>
            `;
        }
    });
    
    favoritesHTML += '</div>';
    favoritesList.innerHTML = favoritesHTML;
}

window.removeFavorite = function(index) {
    const favorites = JSON.parse(localStorage.getItem('reservia-favorites') || '[]');
    const favoriteIndex = favorites.indexOf(index);
    if (favoriteIndex > -1) {
        favorites.splice(favoriteIndex, 1);
        localStorage.setItem('reservia-favorites', JSON.stringify(favorites));
        
        // Update UI
        const hotelCards = document.querySelectorAll('article');
        if (hotelCards[index]) {
            const favoriteBtn = hotelCards[index].querySelector('.favorite-btn');
            if (favoriteBtn) {
                favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
                favoriteBtn.classList.remove('favorited');
            }
        }
        
        updateFavoritesDisplay();
    }
};