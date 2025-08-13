<?php
// includes/header.php
// Header reutilizable para todas las páginas del sistema

// Obtener la página actual para marcar el enlace activo
$current_page = basename($_SERVER['PHP_SELF'], '.php');
?>

<!-- Navigation Bar -->
<nav class="navbar">
    <div class="nav-container">
        <div class="logo">
            <div class="logo-icon">DJ</div>
            <div class="logo-text">Directorio Jurídico</div>
        </div>
        
        <ul class="nav-links">
            <li>
                <a href="index.php" class="<?php echo ($current_page == 'index') ? 'active' : ''; ?>">
                    Inicio
                </a>
            </li>
            <li>
                <a href="directorio.php" class="<?php echo ($current_page == 'directorio') ? 'active' : ''; ?>">
                    Directorio
                </a>
            </li>
            <li>
                <a href="organigrama.php" class="<?php echo ($current_page == 'organigrama') ? 'active' : ''; ?>">
                    Organigrama
                </a>
            </li>
            <li>
                <a href="insumos.php" class="<?php echo ($current_page == 'insumos') ? 'active' : ''; ?>">
                    Insumos
                </a>
            </li>
            <li>
                <a href="contacto.php" class="<?php echo ($current_page == 'contacto') ? 'active' : ''; ?>">
                    Contacto
                </a>
            </li>
        </ul>
        
        <div class="nav-actions">
            <!-- Búsqueda rápida en el header -->
            <div class="quick-search" id="quickSearch" style="display: none;">
                <input type="text" 
                       class="quick-search-input" 
                       placeholder="Buscar empleado..." 
                       id="quickSearchInput">
                <button class="quick-search-btn" onclick="quickSearch()">🔍</button>
            </div>
            
            <!-- Botón de búsqueda -->
            <button class="search-toggle" onclick="toggleQuickSearch()" title="Búsqueda rápida">
                🔍
            </button>
            
            <!-- Menú móvil -->
            <button class="mobile-menu" onclick="toggleMobileMenu()">
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
            </button>
        </div>
    </div>
    
    <!-- Menú móvil desplegable -->
    <div class="mobile-nav" id="mobileNav">
        <div class="mobile-nav-content">
            <a href="index.php" class="mobile-nav-link <?php echo ($current_page == 'index') ? 'active' : ''; ?>">
                <span class="mobile-nav-icon">🏠</span>
                Inicio
            </a>
            <a href="directorio.php" class="mobile-nav-link <?php echo ($current_page == 'directorio') ? 'active' : ''; ?>">
                <span class="mobile-nav-icon">📋</span>
                Directorio
            </a>
            <a href="organigrama.php" class="mobile-nav-link <?php echo ($current_page == 'organigrama') ? 'active' : ''; ?>">
                <span class="mobile-nav-icon">🏢</span>
                Organigrama
            </a>
            <a href="insumos.php" class="mobile-nav-link <?php echo ($current_page == 'insumos') ? 'active' : ''; ?>">
                <span class="mobile-nav-icon">📦</span>
                Insumos
            </a>
            <a href="contacto.php" class="mobile-nav-link <?php echo ($current_page == 'contacto') ? 'active' : ''; ?>">
                <span class="mobile-nav-icon">📞</span>
                Contacto
            </a>
            
            <!-- Información adicional en móvil -->
            <div class="mobile-nav-info">
                <div class="mobile-nav-section">
                    <h4>Sistema</h4>
                    <p><?php echo isset($app_name) ? $app_name : 'Directorio Empresarial'; ?></p>
                    <p>Versión <?php echo isset($app_version) ? $app_version : '1.0.0'; ?></p>
                </div>
                
                <div class="mobile-nav-section">
                    <h4>Soporte</h4>
                    <p>📧 soporte@empresa.com</p>
                    <p>📞 +52 55 1234 5678</p>
                </div>
            </div>
        </div>
    </div>
</nav>

<!-- Overlay para cerrar menú móvil -->
<div class="mobile-overlay" id="mobileOverlay" onclick="closeMobileMenu()"></div>

<script>
// ===================================
// FUNCIONES DEL HEADER
// ===================================

// Toggle del menú móvil
function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const body = document.body;
    
    if (mobileNav && mobileOverlay) {
        const isOpen = mobileNav.classList.contains('open');
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            mobileNav.classList.add('open');
            mobileOverlay.classList.add('active');
            body.classList.add('mobile-menu-open');
        }
    }
}

// Cerrar menú móvil
function closeMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const body = document.body;
    
    if (mobileNav && mobileOverlay) {
        mobileNav.classList.remove('open');
        mobileOverlay.classList.remove('active');
        body.classList.remove('mobile-menu-open');
    }
}

// Toggle de búsqueda rápida
function toggleQuickSearch() {
    const quickSearch = document.getElementById('quickSearch');
    const searchInput = document.getElementById('quickSearchInput');
    
    if (quickSearch) {
        const isVisible = quickSearch.style.display !== 'none';
        
        if (isVisible) {
            quickSearch.style.display = 'none';
        } else {
            quickSearch.style.display = 'flex';
            if (searchInput) {
                searchInput.focus();
            }
        }
    }
}

// Búsqueda rápida
function quickSearch() {
    const searchInput = document.getElementById('quickSearchInput');
    if (searchInput && searchInput.value.trim() !== '') {
        const searchTerm = searchInput.value.trim();
        
        // Si estamos en la página del directorio, hacer búsqueda directa
        if (typeof searchEmployees === 'function') {
            document.getElementById('searchInput').value = searchTerm;
            searchEmployees();
        } else {
            // Si no, redirigir al directorio con parámetro de búsqueda
            window.location.href = `directorio.php?search=${encodeURIComponent(searchTerm)}`;
        }
        
        // Cerrar búsqueda rápida
        toggleQuickSearch();
    }
}

// Cerrar búsqueda rápida al presionar Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const quickSearch = document.getElementById('quickSearch');
        if (quickSearch && quickSearch.style.display !== 'none') {
            toggleQuickSearch();
        }
        
        // También cerrar menú móvil
        closeMobileMenu();
    }
});

// Búsqueda rápida al presionar Enter
document.addEventListener('DOMContentLoaded', function() {
    const quickSearchInput = document.getElementById('quickSearchInput');
    if (quickSearchInput) {
        quickSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                quickSearch();
            }
        });
    }
});

// Cerrar menús al hacer resize de ventana
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        closeMobileMenu();
        
        const quickSearch = document.getElementById('quickSearch');
        if (quickSearch) {
            quickSearch.style.display = 'none';
        }
    }
});

// Scroll handler para ocultar/mostrar navbar
let lastScrollTop = 0;
let isScrolling = false;

window.addEventListener('scroll', function() {
    if (!isScrolling) {
        window.requestAnimationFrame(function() {
            const navbar = document.querySelector('.navbar');
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            
            if (navbar) {
                if (currentScroll > lastScrollTop && currentScroll > 100) {
                    // Scrolling down
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    // Scrolling up
                    navbar.style.transform = 'translateY(0)';
                }
            }
            
            lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
            isScrolling = false;
        });
        
        isScrolling = true;
    }
});

// Indicador de carga en la navegación
function showNavLoading() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.classList.add('loading');
    }
}

function hideNavLoading() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.classList.remove('loading');
    }
}

// Actualizar indicador de estado de conexión
function updateConnectionStatus(isConnected) {
    const logo = document.querySelector('.logo-icon');
    if (logo) {
        if (isConnected) {
            logo.classList.remove('disconnected');
            logo.title = 'Conectado a la base de datos';
        } else {
            logo.classList.add('disconnected');
            logo.title = 'Sin conexión a la base de datos';
        }
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    // Insertar después del navbar
    const navbar = document.querySelector('.navbar');
    if (navbar && navbar.parentNode) {
        navbar.parentNode.insertBefore(notification, navbar.nextSibling);
        
        // Auto-remove después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

console.log('Header scripts cargados');
</script>

<!-- Estilos específicos del header -->
<style>
/* ===================================
   ESTILOS ADICIONALES DEL HEADER
   =================================== */

/* Transición suave para ocultar navbar */
.navbar {
    transition: transform 0.3s ease-in-out;
}

/* Estados del logo */
.logo-icon.disconnected {
    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    animation: pulse-red 2s infinite;
}

@keyframes pulse-red {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}

/* Búsqueda rápida */
.nav-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.quick-search {
    display: none;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 25px;
    padding: 0.5rem;
    backdrop-filter: blur(10px);
}

.quick-search-input {
    background: transparent;
    border: none;
    color: white;
    padding: 0.5rem;
    border-radius: 20px;
    width: 200px;
    font-size: 0.9rem;
}

.quick-search-input::placeholder {
    color: rgba(255, 255, 255, 0.7);
}

.quick-search-input:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.1);
}

.quick-search-btn, .search-toggle {
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.quick-search-btn:hover, .search-toggle:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.1);
}

/* Menú móvil mejorado */
.mobile-menu {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    display: none;
    flex-direction: column;
    gap: 3px;
}

.hamburger-line {
    width: 20px;
    height: 2px;
    background: white;
    transition: all 0.3s ease;
    border-radius: 2px;
}

.mobile-nav {
    position: fixed;
    top: 0;
    right: -100%;
    width: 300px;
    height: 100vh;
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    transition: right 0.3s ease;
    z-index: 1001;
    overflow-y: auto;
}

.mobile-nav.open {
    right: 0;
}

.mobile-nav-content {
    padding: 2rem 1rem;
    padding-top: 4rem;
}

.mobile-nav-link {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: white;
    text-decoration: none;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 0.5rem;
    transition: all 0.3s ease;
}

.mobile-nav-link:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
}

.mobile-nav-link.active {
    background: #8b7355;
}

.mobile-nav-icon {
    font-size: 1.2rem;
    width: 24px;
    text-align: center;
}

.mobile-nav-info {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-nav-section {
    margin-bottom: 1.5rem;
}

.mobile-nav-section h4 {
    color: #8b7355;
    margin-bottom: 0.5rem;
    font-size: 1rem;
}

.mobile-nav-section p {
    color: #bdc3c7;
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
}

.mobile-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.mobile-overlay.active {
    opacity: 1;
    visibility: visible;
}

/* Prevenir scroll cuando el menú móvil está abierto */
.mobile-menu-open {
    overflow: hidden;
}

/* Indicador de carga */
.navbar.loading::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #8b7355, transparent);
    animation: loading-bar 2s infinite;
}

@keyframes loading-bar {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

/* Notificaciones */
.notification {
    position: fixed;
    top: 80px;
    right: 20px;
    background: white;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    z-index: 1002;
    display: flex;
    align-items: center;
    gap: 1rem;
    max-width: 400px;
    animation: slideInRight 0.3s ease;
}

.notification-info { border-left: 4px solid #3498db; }
.notification-success { border-left: 4px solid #27ae60; }
.notification-warning { border-left: 4px solid #f39c12; }
.notification-error { border-left: 4px solid #e74c3c; }

.notification-close {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: #7f8c8d;
    padding: 0;
}

@keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

/* Responsive */
@media (max-width: 768px) {
    .nav-links {
        display: none;
    }
    
    .mobile-menu {
        display: flex;
    }
    
    .quick-search {
        position: absolute;
        top: 100%;
        right: 1rem;
        left: 1rem;
        margin-top: 1rem;
        background: white;
        border-radius: 12px;
        padding: 1rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }
    
    .quick-search-input {
        color: #2c3e50;
        background: #f8f9fa;
        border: 1px solid #e0e0e0;
        width: 100%;
    }
    
    .quick-search-input::placeholder {
        color: #7f8c8d;
    }
    
    .quick-search-btn {
        color: #2c3e50;
    }
}
</style>