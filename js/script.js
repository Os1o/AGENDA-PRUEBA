/* ===================================
   DIRECTORIO EMPRESARIAL - SCRIPT.JS
   Sistema integral de gestión de personal
   =================================== */

// ===================================
// CONFIGURACIÓN GLOBAL
// ===================================

// Variables del sistema
const APP_CONFIG = {
    name: 'Directorio Empresarial',
    version: '1.2.0',
    description: 'Sistema integral de gestión de personal - Dirección Jurídica',
    company: 'Dirección Jurídica',
    email: 'soporte@empresa.com',
    phone: '+52 55 1234 5678'
};

// Configuración de Supabase
const SUPABASE_URL = 'https://gtogelwnsbgodwfghhku.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0b2dlbHduc2Jnb2R3ZmdoaGt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTk4MDcsImV4cCI6MjA2OTk5NTgwN30.HRxeUmgbT8esQ_PwMRMF3p4jI6CStRRfm5x-lvHUytw'

// Crear cliente de Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Variables globales
let currentEmployees = [];
let allEmployees = [];
let currentSort = 'az';
let currentModule = '';
let isLoading = false;

// ===================================
// FUNCIÓN DE ESTADÍSTICAS INICIALES
// ===================================

async function loadInitialStats() {
    try {
        console.log('Cargando estadísticas iniciales...');

        // 🕐 AGREGAR: Marcar tiempo de inicio (para medir rendimiento)
        const startTime = Date.now();
        
        // Obtener elementos del DOM para mostrar estadísticas
        const totalEmployeesElement = document.getElementById('totalEmployees');
        const systemStatusElement = document.getElementById('systemStatus');
        const lastUpdateElement = document.getElementById('lastUpdate');
        const serverStatusElement = document.getElementById('serverStatus');

        // 🎯 AGREGAR: Los dos elementos que faltan
        const lastSync = document.getElementById('lastSync');
        const performance = document.getElementById('performance');
        const statusDot = document.getElementById('statusDot');        
        
        // MÉTODO CORREGIDO: obtener solo IDs y contar
        const { data: empleados, error } = await supabase
            .from('empleados')
            .select('id');

        // 📊 AGREGAR: Calcular tiempo de respuesta
        const responseTime = Date.now() - startTime;
        
        if (error) {
            console.error('Error cargando estadísticas:', error);
            updateStatsUI('error');
            return;
        }
        
        const totalCount = empleados ? empleados.length : 0;
        
        // Actualizar UI
        if (totalEmployeesElement) {
            totalEmployeesElement.textContent = totalCount;
        }
        
        if (systemStatusElement) {
            systemStatusElement.textContent = 'Operativo';
            systemStatusElement.className = 'status-online';
        }
        
        if (lastUpdateElement) {
            lastUpdateElement.textContent = new Date().toLocaleString();
        }
        
        if (serverStatusElement) {
            serverStatusElement.textContent = '🟢 Conectado';
        }

        if (statusDot) {
            statusDot.style.backgroundColor = '#00b894';
            statusDot.style.boxShadow = '0 0 10px rgba(0, 184, 148, 0.5)';
        }

        // 🎯 AGREGAR: Las dos líneas que faltan
        if (lastSync) {
            lastSync.textContent = new Date().toLocaleTimeString();
        }
        
        if (performance) {
            performance.textContent = `${responseTime}ms`;
        }

        updateSystemStats(totalCount);
        
        console.log(`✅ Estadísticas cargadas: ${totalCount} empleados`);
        
    } catch (error) {
        console.error('Error en loadInitialStats:', error);
        updateStatsUI('error');
    }
}

// Función auxiliar para actualizar estadísticas del sistema
function updateSystemStats(totalEmployees) {
    const statsElements = {
        totalRecordsFooter: totalEmployees,
        appVersion: APP_CONFIG.version,
        currentYear: new Date().getFullYear(),
        lastUpdated: new Date().toLocaleDateString()
    };
    
    Object.keys(statsElements).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = statsElements[id];
        }
    });
    
    if (window.performance && window.performance.memory) {
        const memoryElement = document.getElementById('memoryUsage');
        if (memoryElement) {
            const memory = (window.performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(1);
            memoryElement.textContent = `${memory} MB`;
        }
    }
}

// Función auxiliar para manejar errores en las estadísticas
function updateStatsUI(status) {
    const systemStatusElement = document.getElementById('systemStatus');
    const serverStatusElement = document.getElementById('serverStatus');
    
    if (status === 'error') {
        if (systemStatusElement) {
            systemStatusElement.textContent = 'Error';
            systemStatusElement.className = 'status-error';
        }
        
        if (serverStatusElement) {
            serverStatusElement.textContent = '🔴 Error de conexión';
        }
    }
}

// ===================================
// SISTEMA DE INCLUDES
// ===================================

// Función para cargar componentes
async function loadComponent(containerId, filePath) {
    try {
        const response = await fetch(filePath);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const html = await response.text();
        const container = document.getElementById(containerId);
        
        if (container) {
            container.innerHTML = html;
            console.log(`✅ Componente cargado: ${filePath}`);
            
            // Ejecutar scripts específicos después de cargar el componente
            if (filePath.includes('header')) {
                setupHeaderEvents();
            } else if (filePath.includes('footer')) {
                setupFooterEvents();
                setTimeout(loadInitialStats, 100);
            }
        } else {
            console.error(`❌ Container no encontrado: ${containerId}`);
        }
    } catch (error) {
        console.error(`❌ Error cargando ${filePath}:`, error);
        
        // Mostrar error en el container
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="error" style="text-align: center; padding: 1rem; border-radius: 8px;">
                    ⚠️ Error cargando ${filePath}<br>
                    <small>Verifique que el archivo existe</small>
                </div>
            `;
        }
    }
}

// Actualizar información dinámica después de cargar includes
function updateDynamicInfo() {
    // Actualizar año actual
    const yearElements = document.querySelectorAll('#currentYear, .current-year');
    yearElements.forEach(el => {
        if (el) el.textContent = new Date().getFullYear();
    });
    
    // Actualizar fecha de última actualización
    const updateElements = document.querySelectorAll('#lastUpdated, .last-updated');
    updateElements.forEach(el => {
        if (el) el.textContent = new Date().toLocaleDateString();
    });
    
    // Actualizar nombre del servidor
    const serverElements = document.querySelectorAll('#serverName, .server-name');
    serverElements.forEach(el => {
        if (el) el.textContent = window.location.hostname;
    });
}

// ===================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ===================================

document.addEventListener('DOMContentLoaded', async function() {
    console.log(APP_CONFIG.name + ' v' + APP_CONFIG.version + ' iniciando...');
    
    try {
        // Cargar componentes del sistema
        await loadComponent('header-container', 'includes/header.html');
        await loadComponent('footer-container', 'includes/foot.html');
        
        // Actualizar información dinámica
        updateDynamicInfo();
        
        // Configurar eventos una vez que todo esté cargado
        setTimeout(setupAllEventListeners, 200);
        
        // Cargar estadísticas iniciales
        setTimeout(loadInitialStats, 1000);
        
        // Validar conexión con Supabase
        validateSupabaseConnection();
        
        console.log('✅ Aplicación inicializada correctamente');
        
    } catch (error) {
        console.error('❌ Error durante la inicialización:', error);
    }
});

function initializeApp() {
    // Esta función se mantiene para compatibilidad
    console.log('Función initializeApp() ya no es necesaria - la inicialización es automática');
}

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
            const mainSearchInput = document.getElementById('searchInput');
            if (mainSearchInput) {
                mainSearchInput.value = searchTerm;
                searchEmployees();
            }
        }
        
        // Cerrar búsqueda rápida
        toggleQuickSearch();
    }
}

// ===================================
// FUNCIONES DEL FOOTER
// ===================================

// Función para subir al inicio
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Cambiar tema (claro/oscuro)
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (typeof showNotification === 'function') {
        showNotification(
            `Tema cambiado a ${newTheme === 'dark' ? 'oscuro' : 'claro'}`,
            'info'
        );
    }
}

// Imprimir página
function printPage() {
    // Ocultar elementos no necesarios para impresión
    const elementsToHide = ['.navbar', '.footer', '.modal-overlay', '.system-status-widget'];
    elementsToHide.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.style.display = 'none');
    });
    
    window.print();
    
    // Restaurar elementos después de imprimir
    setTimeout(() => {
        elementsToHide.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => el.style.display = '');
        });
    }, 1000);
}

// Mostrar ayuda
function showHelp() {
    const helpModal = document.getElementById('helpModal');
    if (helpModal) {
        helpModal.style.display = 'flex';
    }
}

// Mostrar manual
function showManual() {
    showNotification('Abriendo manual de usuario...', 'info');
    setTimeout(() => {
        showNotification('Manual disponible en el portal de empleados', 'success');
    }, 1500);
}

// Reportar problema
function reportIssue() {
    const userAgent = navigator.userAgent;
    const currentPage = window.location.pathname;
    const timestamp = new Date().toISOString();
    
    const issueData = {
        page: currentPage,
        userAgent: userAgent,
        timestamp: timestamp,
        url: window.location.href,
        appVersion: APP_CONFIG.version
    };
    
    console.log('Datos del reporte:', issueData);
    showNotification('Reporte enviado al equipo de soporte', 'success');
}

// Mostrar changelog
function showChangelog() {
    showNotification(`Versión ${APP_CONFIG.version} - Últimas mejoras cargadas`, 'info');
}

// Descargar respaldo
function downloadBackup() {
    if (typeof exportEmployeesToCSV === 'function') {
        exportEmployeesToCSV();
        showNotification('Respaldo descargado exitosamente', 'success');
    } else {
        showNotification('Función de respaldo no disponible en esta página', 'warning');
    }
}

// Cerrar modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function setupAllEventListeners() {
    console.log('Configurando event listeners...');
    
    // Event listeners del header
    setupHeaderEvents();
    
    // Event listeners del footer  
    setupFooterEvents();
    
    // Event listeners generales
    setupGeneralEvents();
    
    // Event listeners del directorio
    setupDirectoryEvents();
}

function setupHeaderEvents() {
    // Búsqueda rápida en header
    const quickSearchInput = document.getElementById('quickSearchInput');
    if (quickSearchInput) {
        quickSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                quickSearch();
            }
        });
    }
    
    // Menú móvil
    const mobileOverlay = document.getElementById('mobileOverlay');
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileMenu);
    }
}

function setupFooterEvents() {
    // Toggle del widget de estado
    const widget = document.getElementById('systemStatusWidget');
    const details = document.getElementById('statusDetails');
    
    if (widget && details) {
        widget.addEventListener('click', function() {
            const isVisible = details.style.display !== 'none';
            details.style.display = isVisible ? 'none' : 'block';
        });
    }
    
    // Actualizar estadísticas cada 5 minutos
    setInterval(loadInitialStats, 5 * 60 * 1000);
    
    // Cargar tema guardado
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
    }
}

function setupGeneralEvents() {
    // Navegación con teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Cerrar directorio
            const directoryPage = document.getElementById('directoryPage');
            if (directoryPage && directoryPage.style.display !== 'none') {
                showMain();
            }
            
            // Cerrar búsqueda rápida
            const quickSearch = document.getElementById('quickSearch');
            if (quickSearch && quickSearch.style.display !== 'none') {
                toggleQuickSearch();
            }
            
            // Cerrar menú móvil
            closeMobileMenu();
            
            // Cerrar modales
            const modals = document.querySelectorAll('.modal-overlay');
            modals.forEach(modal => modal.style.display = 'none');
        }
    });
    
    // Prevenir submit en formularios
    document.addEventListener('submit', function(e) {
        e.preventDefault();
    });
}

function setupDirectoryEvents() {
    // Búsqueda en tiempo real
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchEmployees();
            }, 300);
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchEmployees();
            }
        });
    }
}

function setupEventListeners() {
    // Función legacy - ahora usa setupAllEventListeners()
    setupAllEventListeners();
}

// ===================================
// VALIDACIÓN DE CONEXIÓN
// ===================================

async function validateSupabaseConnection() {
    try {
        const { data, error } = await supabase
            .from('empleados')
            .select('id')
            .limit(1);

        if (error) {
            console.error('Error de conexión con Supabase:', error);
            return false;
        }

        console.log('Conexión con Supabase validada exitosamente');
        return true;
    } catch (error) {
        console.error('Error validando conexión:', error);
        return false;
    }
}

// ===================================
// GESTIÓN DE ESTADOS UI
// ===================================

function showLoading() {
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const employeeContent = document.getElementById('employeeContent');

    if (loadingState) loadingState.style.display = 'block';
    if (errorState) errorState.style.display = 'none';
    if (employeeContent) employeeContent.style.display = 'none';
    
    isLoading = true;
}

function showError(message) {
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const employeeContent = document.getElementById('employeeContent');

    if (loadingState) loadingState.style.display = 'none';
    if (errorState) {
        errorState.style.display = 'block';
        errorState.innerHTML = `❌ ${message}<br><small>Verifica la conexión a la base de datos.</small>`;
    }
    if (employeeContent) employeeContent.style.display = 'none';
    
    isLoading = false;
}

function showContent() {
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const employeeContent = document.getElementById('employeeContent');

    if (loadingState) loadingState.style.display = 'none';
    if (errorState) errorState.style.display = 'none';
    if (employeeContent) employeeContent.style.display = 'block';
    
    isLoading = false;
}

// ===================================
// SISTEMA DE NOTIFICACIONES
// ===================================

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

async function loadEmployeesFromSupabase() {
    if (isLoading) return;

    try {
        showLoading();
        
        const { data: empleados, error } = await supabase
            .from('empleados')
            .select('*')
            .order('nomExt', { ascending: true });
        
        if (error) {
            throw new Error(`Error en base de datos: ${error.message}`);
        }

        if (!empleados || empleados.length === 0) {
            throw new Error('No se encontraron empleados en la base de datos');
        }
        
        // Mapear datos de Supabase al formato esperado
        allEmployees = empleados.map(emp => ({
            name: emp.nomExt || 'Sin nombre',
            extension: emp.extension?.toString() || 'Sin ID',
            floor: emp.piso ? `Piso ${emp.piso}` : 'Sin ubicación',
            edificio: emp.edificio || emp.ubicacion || 'N/A',
            categoria: emp.categoria || 'Sin categoría',
            adscripcion: emp.adscripcion || 'Sin adscripcion',
            adscripcionCorta: emp.adscripcionCorta || 'Sin adscripcion',
            ubicacion: emp.ubicacion || 'Sin ubicación'
        }));
        
        currentEmployees = [...allEmployees];
        
        console.log(`${allEmployees.length} empleados cargados exitosamente`);
        
        showContent();
        renderEmployees();
        
    } catch (error) {
        console.error('Error cargando empleados:', error);
        showError(error.message);
    }
}

// ===================================
// NAVEGACIÓN ENTRE PÁGINAS
// ===================================

function showDirectory(module) {
    if (isLoading) return;

    currentModule = module;
    
    const mainPage = document.getElementById('mainPage');
    const directoryPage = document.getElementById('directoryPage');
    
    if (mainPage) mainPage.style.display = 'none';
    if (directoryPage) directoryPage.style.display = 'block';
    
    // Actualizar estado del menú
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => link.classList.remove('active'));
    
    const directoryLink = document.querySelector('.nav-links a[onclick*="showDirectory"]');
    if (directoryLink) {
        directoryLink.classList.add('active');
    }
    
    // Actualizar título según el módulo
    const titles = {
        'ubicacion': 'Directorio por Ubicación',
        'adscripcion': 'Directorio por Adscripción', 
        'categoria': 'Directorio por Categoría',
        'completo': 'Listado Completo'
    };
    
    const directoryTitle = document.querySelector('.directory-title');
    if (directoryTitle) {
        directoryTitle.textContent = titles[module] || 'Agenda Dirección Jurídica';
    }
    
    // Cargar empleados desde Supabase
    loadEmployeesFromSupabase();
    
    // Limpiar búsqueda
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
}

function showMain() {
    const mainPage = document.getElementById('mainPage');
    const directoryPage = document.getElementById('directoryPage');
    
    if (mainPage) mainPage.style.display = 'block';
    if (directoryPage) directoryPage.style.display = 'none';
    
    // AGREGAR después de mostrar las páginas:
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => link.classList.remove('active'));
    
    const homeLink = document.querySelector('.nav-links a[href="index.html"]');
    if (homeLink) {
        homeLink.classList.add('active');
    }

    // Limpiar búsqueda
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    
    // Resetear datos
    currentEmployees = [...allEmployees];
    currentModule = '';
    currentLocation = '';
}

// ===================================
// RENDERIZADO DE EMPLEADOS
// ===================================

function renderEmployees() {
    const grid = document.getElementById('employeesGrid');
    if (!grid) return;

    grid.innerHTML = '';

    if (!currentEmployees || currentEmployees.length === 0) {
        grid.innerHTML = `
            <div class="loading" style="grid-column: 1 / -1;">
                📝 No se encontraron empleados con los criterios de búsqueda
            </div>
        `;
        updateRecordsCount(0);
        return;
    }

    currentEmployees.forEach((employee, index) => {
        const employeeCard = createEmployeeCard(employee, index);
        grid.appendChild(employeeCard);
    });

    updateRecordsCount(currentEmployees.length);
}

function createEmployeeCard(employee, index) {
    const employeeCard = document.createElement('div');
    employeeCard.className = 'employee-card';
    employeeCard.style.animationDelay = `${index * 0.1}s`;
    
    const initials = getInitials(employee.name);
    
    employeeCard.innerHTML = `
        <div class="floor-badge">${employee.floor}</div>
        <div class="employee-header">
            <div class="employee-avatar">${initials}</div>
            <div class="employee-info">
                <div class="employee-name">${employee.name}</div>
                <div class="employee-details">
                    <div class="employee-id">
                        <span>📞</span>
                        <span>${employee.extension}</span>
                    </div>
                    <span style="color: #95a5a6;">|</span>
                    <span title="${employee.edificio}">${truncateText(employee.edificio, 30)}</span>
                </div>
            </div>
        </div>
        <div class="office-badge">${employee.adscripcionCorta}</div>
    `;
    
    // Agregar evento click para detalles (opcional)
    employeeCard.addEventListener('click', () => {
        showEmployeeDetails(employee);
    });
    
    return employeeCard;
}

// ===================================
// UTILIDADES
// ===================================

function getInitials(name) {
    if (!name) return '??';
    return name.split(' ')
               .map(n => n[0])
               .join('')
               .substring(0, 2)
               .toUpperCase();
}

function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function updateRecordsCount(count) {
    const totalRecords = document.getElementById('totalRecords');
    if (totalRecords) {
        totalRecords.textContent = `${count} registro${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`;
    }
}

// ===================================
// FUNCIONALIDAD DE BÚSQUEDA
// ===================================

function searchEmployees() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        currentEmployees = [...allEmployees];
    } else {
        currentEmployees = allEmployees.filter(employee => 
            employee.name.toLowerCase().includes(searchTerm) ||
            employee.extension.includes(searchTerm) ||
            employee.floor.toLowerCase().includes(searchTerm) ||
            employee.adscripcionCorta.toLowerCase().includes(searchTerm) ||
            employee.categoria.toLowerCase().includes(searchTerm) ||
            employee.adscripcion.toLowerCase().includes(searchTerm) ||
            employee.edificio.toLowerCase().includes(searchTerm) ||
            employee.ubicacion.toLowerCase().includes(searchTerm)
        );
    }
    
    // Aplicar ordenamiento actual
    applySorting();
    renderEmployees();
}

// ===================================
// FUNCIONALIDAD DE ORDENAMIENTO
// ===================================

function sortBy(order) {
    // Actualizar botones activos
    const sortButtons = document.querySelectorAll('.sort-button');
    sortButtons.forEach(btn => btn.classList.remove('active'));
    
    // Buscar el botón clickeado y marcarlo como activo
    const clickedButton = event.target;
    if (clickedButton) {
        clickedButton.classList.add('active');
    }

    currentSort = order;
    applySorting();
    renderEmployees();
}

function applySorting() {
    switch (currentSort) {
        case 'az':
            currentEmployees.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'za':
            currentEmployees.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'id':
            currentEmployees.sort((a, b) => {
                const idA = parseInt(a.id) || 0;
                const idB = parseInt(b.id) || 0;
                return idA - idB;
            });
            break;
        default:
            currentEmployees.sort((a, b) => a.name.localeCompare(b.name));
    }
}

// ===================================
// DETALLES DE EMPLEADO (MODAL)
// ===================================

function showEmployeeDetails(employee) {
    // Crear modal dinámico
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Detalles del Trabajador</h3>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="employee-detail-grid">
                    <div class="detail-item">
                        <label>Nombre:</label>
                        <span>${employee.name}</span>
                    </div>
                    <div class="detail-item">
                        <label>Categoría:</label>
                        <span>${employee.categoria}</span>
                    </div>
                    <div class="detail-item">
                        <label>Adscripción:</label>
                        <span>${employee.adscripcion}</span>
                    </div>  
                    <div class="detail-item">
                        <label>Ubicación:</label>
                        <span>${employee.floor} - ${employee.ubicacion}</span>
                    </div>                                                          
                    <div class="modal-header">
                        <h4>Extensión:</h4>
                        <strong>${employee.extension}</strong>
                    </div>
                </div>
            </div>
<!--       <div class="modal-footer">
                <button class="btn-secondary" onclick="closeModal()">Cerrar</button>
            </div>-->
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar modal al hacer click fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

// ===================================
// MANEJO DE ERRORES GLOBAL
// ===================================

window.addEventListener('error', function(e) {
    console.error('Error global capturado:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Promise rechazada:', e.reason);
});

// ===================================
// FUNCIONES DE EXPORTACIÓN
// ===================================

function exportEmployeesToCSV() {
    if (!currentEmployees || currentEmployees.length === 0) {
        alert('No hay empleados para exportar');
        return;
    }

    const headers = ['Nombre', 'Extension', 'Descripción', 'Categoría', 'Piso', 'Ubicación', 'Oficina'];
    const csvContent = [
        headers.join(','),
        ...currentEmployees.map(emp => [
            `"${emp.name}"`,
            emp.id,
            `"${emp.adscripcion}"`,
            `"${emp.categoria}"`,
            `"${emp.floor}"`,
            `"${emp.ubicacion}"`,
            `"${emp.adscripcionCorta}"`
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `directorio_empleados_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ===================================
// DEBUG Y DESARROLLO
// ===================================

function debugInfo() {
    console.log('=== DEBUG INFO ===');
    console.log('Total empleados:', allEmployees.length);
    console.log('Empleados actuales:', currentEmployees.length);
    console.log('Módulo actual:', currentModule);
    console.log('Ordenamiento actual:', currentSort);
    console.log('Estado de carga:', isLoading);
    console.log('=================');
}

// Exponer funciones para debug en desarrollo
if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
    window.debugDirectorio = {
        debugInfo,
        allEmployees: () => allEmployees,
        currentEmployees: () => currentEmployees,
        reloadEmployees: loadEmployeesFromSupabase,
        exportCSV: exportEmployeesToCSV
    };
}


//CODIGO NUEVO

// ===================================
// SISTEMA DE UBICACIONES
// ===================================

// Variables globales para ubicaciones
let allLocations = [];
let currentLocation = '';

// Función para cargar ubicaciones únicas desde Supabase
async function loadLocationsFromSupabase() {
    try {
        console.log('Cargando ubicaciones...');
        
        // Obtener todas las ubicaciones únicas
        const { data: empleados, error } = await supabase
            .from('empleados')
            .select('edificio, ubicacion')
            .not('edificio', 'is', null)
            .not('edificio', 'eq', '');
        
        if (error) {
            throw new Error(`Error cargando ubicaciones: ${error.message}`);
        }

        // Agrupar por edificio y contar empleados
        const ubicacionesMap = new Map();
        
        empleados.forEach(emp => {
            const edificio = emp.edificio || 'Sin ubicación';
            
            if (ubicacionesMap.has(edificio)) {
                ubicacionesMap.get(edificio).count++;
            } else {
                ubicacionesMap.set(edificio, {
                    name: edificio,
                    fullAddress: emp.ubicacion || edificio,
                    count: 1,
                    // Agregar icono según el tipo de edificio
                    icon: getLocationIcon(edificio)
                });
            }
        });
        
        // Convertir a array y ordenar
        allLocations = Array.from(ubicacionesMap.values())
            .sort((a, b) => a.name.localeCompare(b.name));
        
        console.log(`✅ ${allLocations.length} ubicaciones cargadas`);
        return allLocations;
        
    } catch (error) {
        console.error('Error cargando ubicaciones:', error);
        return [];
    }
}

// Función para obtener icono según el edificio
function getLocationIcon(edificio) {
    const nombre = edificio.toLowerCase();
    
    if (nombre.includes('reforma')) return '🏛️';
    if (nombre.includes('hamburgo')) return '🏢';
    if (nombre.includes('tokio')) return '🏬';
    if (nombre.includes('manuel') || nombre.includes('villalongin')) return '🏤';
    if (nombre.includes('insurgentes')) return '🏙️';
    
    // Por defecto
    return '🏢';
}

// Modificar la función showDirectory existente
function showDirectory(module) {
    if (isLoading) return;

    currentModule = module;
    
    const mainPage = document.getElementById('mainPage');
    const directoryPage = document.getElementById('directoryPage');
    
    if (mainPage) mainPage.style.display = 'none';
    if (directoryPage) directoryPage.style.display = 'block';
    
    // Actualizar estado del menú
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => link.classList.remove('active'));
    
    const directoryLink = document.querySelector('.nav-links a[onclick*="showDirectory"]');
    if (directoryLink) {
        directoryLink.classList.add('active');
    }
    
    // Actualizar título según el módulo
    const titles = {
        'ubicacion': 'Directorio por Ubicación',
        'adscripcion': 'Directorio por Adscripción', 
        'categoria': 'Directorio por Categoría',
        'completo': 'Listado Completo'
    };
    
    const directoryTitle = document.querySelector('.directory-title');
    if (directoryTitle) {
        directoryTitle.textContent = titles[module] || 'Agenda Dirección Jurídica';
    }
    
    // 🎯 NUEVA LÓGICA: Mostrar vista según el módulo
    if (module === 'ubicacion') {
        showLocationsView();
    } else {
        showEmployeesView();
    }
    
    // Limpiar búsqueda
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
}

// Nueva función para mostrar la vista de ubicaciones (edificios)
async function showLocationsView() {
    try {
        showLoading();
        
        // Cargar ubicaciones
        await loadLocationsFromSupabase();
        
        // Ocultar controles de empleados y mostrar vista de ubicaciones
        const searchContainer = document.querySelector('.search-container');
        const controlsSection = document.querySelector('.controls-section');
        const employeesGrid = document.getElementById('employeesGrid');
        
        if (searchContainer) searchContainer.style.display = 'none';
        if (controlsSection) controlsSection.style.display = 'none';
        
        

        if (employeesGrid) {
            employeesGrid.innerHTML = '';
            employeesGrid.className = 'locations-grid'; // Cambiar clase
            renderLocations();
        }
        
        showContent();
        
    } catch (error) {
        console.error('Error mostrando ubicaciones:', error);
        showError('Error cargando ubicaciones');
    }
}

// Nueva función para mostrar la vista normal de empleados
function showEmployeesView() {
    // Restaurar controles de empleados
    const searchContainer = document.querySelector('.search-container');
    const controlsSection = document.querySelector('.controls-section');
    
    if (controlsSection) controlsSection.style.display = 'flex';
    if (searchContainer) searchContainer.style.display = 'flex';

    const employeesGrid = document.getElementById('employeesGrid');
    if (employeesGrid) {
        employeesGrid.className = 'employees-grid'; // Restaurar clase original
    }
    
    // Cargar empleados normal
    loadEmployeesFromSupabase();
}

// Función para renderizar las tarjetas de ubicaciones
function renderLocations() {
    const grid = document.getElementById('employeesGrid');
    if (!grid) return;

    grid.innerHTML = '';

    if (!allLocations || allLocations.length === 0) {
        grid.innerHTML = `
            <div class="loading" style="grid-column: 1 / -1;">
                🏢 No se encontraron ubicaciones
            </div>
        `;
        return;
    }

    allLocations.forEach((location, index) => {
        const locationCard = createLocationCard(location, index);
        grid.appendChild(locationCard);
    });

    // Actualizar contador
    const totalRecords = document.getElementById('totalRecords');
    if (totalRecords) {
        totalRecords.textContent = `${allLocations.length} ubicación${allLocations.length !== 1 ? 'es' : ''} encontrada${allLocations.length !== 1 ? 's' : ''}`;
    }
}

// Función para crear tarjeta de ubicación
function createLocationCard(location, index) {
    const locationCard = document.createElement('div');
    locationCard.className = 'location-card';
    locationCard.style.animationDelay = `${index * 0.1}s`;
    
    locationCard.innerHTML = `
        <div class="location-header">
            <div class="location-icon">${location.icon}</div>
            <div class="location-info">
                <div class="location-name">${location.name}</div>
                <div class="location-address">${location.fullAddress}</div>
            </div>
        </div>
        
        <div class="location-stats">
            <div class="employee-count">
                <span class="count-number">${location.count}</span>
                <span class="count-label">empleado${location.count !== 1 ? 's' : ''}</span>
            </div>
        </div>
        
        <button class="view-building-btn" onclick="showEmployeesInLocation('${location.name}')">
            Ver todo el edificio
        </button>
    `;
    
    return locationCard;
}

// Función para mostrar empleados de una ubicación específica
async function showEmployeesInLocation(locationName) {
    try {
        currentLocation = locationName;
        
        showLoading();
        
        // Cargar empleados de esa ubicación específica
        const { data: empleados, error } = await supabase
            .from('empleados')
            .select('*')
            .eq('edificio', locationName)
            .order('nomExt', { ascending: true });
        
        if (error) {
            throw new Error(`Error cargando empleados: ${error.message}`);
        }
        
        // Mapear empleados
        allEmployees = empleados.map(emp => ({
            name: emp.nomExt || 'Sin nombre',
            extension: emp.extension?.toString() || 'Sin extensión',
            floor: emp.piso ? `Piso ${emp.piso}` : 'Sin ubicación',
            edificio: emp.edificio || 'N/A',
            categoria: emp.categoria || 'Sin categoría',
            adscripcion: emp.adscripcion || 'Sin adscripción',
            adscripcionCorta: emp.adscripcionCorta || 'Sin adscripción',
            ubicacion: emp.ubicacion || 'Sin ubicación'
        }));
        
        currentEmployees = [...allEmployees];
        
        // Actualizar título
        const directoryTitle = document.querySelector('.directory-title');
        if (directoryTitle) {
            directoryTitle.textContent = `Empleados en ${locationName}`;
        }
        
        // Mostrar vista de empleados
        const searchContainer = document.querySelector('.search-container');
        const controlsSection = document.querySelector('.controls-section');
        
        if (searchContainer) searchContainer.style.display = 'flex';
        if (controlsSection) controlsSection.style.display = 'flex';
        if (employeesGrid) {
            employeesGrid.className = 'employees-grid';
        }
        
        showContent();
        renderEmployees();
        
        console.log(`✅ ${allEmployees.length} empleados cargados para ${locationName}`);

        updateBackButtonText();
        
    } catch (error) {
        console.error('Error cargando empleados de ubicación:', error);
        showError(`Error cargando empleados de ${locationName}`);
    }
}

// Función para regresar a la vista de ubicaciones
function backToLocations() {
    currentLocation = '';
    showLocationsView();
    
    // Restaurar título
    const directoryTitle = document.querySelector('.directory-title');
    if (directoryTitle) {
        directoryTitle.textContent = 'Directorio por Ubicación';
    }

    updateBackButtonText();
}


// ===================================
// NAVEGACIÓN INTELIGENTE
// ===================================

function smartBack() {
    // Si estamos viendo empleados de una ubicación específica
    if (currentLocation && currentModule === 'ubicacion') {
        backToLocations();
        updateBackButtonText();
    } 
    // En cualquier otro caso, regresar al inicio
    else {
        showMain();
    }
}

function updateBackButtonText() {
    const backButtonText = document.getElementById('backButtonText');
    if (!backButtonText) return;
    
    if (currentLocation && currentModule === 'ubicacion') {
        backButtonText.textContent = 'Volver a Edificios';
    } else if (currentModule) {
        backButtonText.textContent = 'Regresar al Inicio';
    } else {
        backButtonText.textContent = 'Regresar';
    }
}




// ===================================
// SISTEMA DE ADSCRIPCIONES SIMPLIFICADO
// ===================================

// Variables globales para adscripciones
let allUnits = [];
let currentUnit = '';
let currentUnitEmployees = [];
let currentFilter = 'todos';

// Definir las unidades y sus sub-unidades
const UNIT_STRUCTURE = {
    'Dirección Jurídica': {
        icon: '🏛️',
        subUnits: ['DJ', 'CA'],
        color: '#8b7355'
    },
    'Unidad de Asuntos Consultivos y de Atención a Órganos Fiscalizadores': {
        icon: '📋',
        subUnits: ['UACAOF', 'CLC', 'CAOF'],
        color: '#3498db'
    },
    'Unidad de Investigaciones y Procesos Jurídicos': {
        icon: '⚖️',
        subUnits: ['UIPJ', 'CAC', 'CTCC', 'CL', 'CEPJ', 'CIAD', 'CTCIPP'],
        color: '#e74c3c'
    },
    'Unidad de Derechos Humanos': {
        icon: '👥',
        subUnits: ['UDH', 'CAQCE', 'CIGI', 'CTPIDH'],
        color: '#27ae60'
    }
};

// Función para cargar y agrupar empleados por unidades
async function loadAdscripcionesFromSupabase() {
    try {
        console.log('Cargando adscripciones...');
        
        // Obtener todos los empleados
        const { data: empleados, error } = await supabase
            .from('empleados')
            .select('*')
            .not('adscripcionCorta', 'is', null)
            .not('adscripcionCorta', 'eq', '');
        
        if (error) {
            throw new Error(`Error cargando empleados: ${error.message}`);
        }

        // Agrupar empleados por unidades
        allUnits = Object.keys(UNIT_STRUCTURE).map(unitName => {
            const unitConfig = UNIT_STRUCTURE[unitName];
            
            // Filtrar empleados de esta unidad
            const unitEmployees = empleados.filter(emp => 
                unitConfig.subUnits.includes(emp.adscripcionCorta)
            );
            
            return {
                name: unitName,
                icon: unitConfig.icon,
                color: unitConfig.color,
                subUnits: unitConfig.subUnits,
                totalEmployees: unitEmployees.length,
                employees: unitEmployees
            };
        });
        
        console.log(`✅ ${allUnits.length} unidades cargadas`);
        return allUnits;
        
    } catch (error) {
        console.error('Error cargando adscripciones:', error);
        return [];
    }
}

// Función para mostrar la vista de unidades principales
async function showUnitsView() {
    try {
        showLoading();
        
        // Cargar unidades
        await loadAdscripcionesFromSupabase();
        
        // Ocultar controles de búsqueda
        const searchContainer = document.querySelector('.search-container');
        const controlsSection = document.querySelector('.controls-section');
        
        if (searchContainer) searchContainer.style.display = 'none';
        if (controlsSection) controlsSection.style.display = 'none';
        
        const employeesGrid = document.getElementById('employeesGrid');
        
        if (employeesGrid) {
            employeesGrid.innerHTML = '';
            employeesGrid.className = 'units-grid';
            renderUnits();
        }
        
        showContent();
        
    } catch (error) {
        console.error('Error mostrando unidades:', error);
        showError('Error cargando unidades');
    }
}

// Función para renderizar las tarjetas de unidades principales
function renderUnits() {
    const grid = document.getElementById('employeesGrid');
    if (!grid) return;

    grid.innerHTML = '';

    if (!allUnits || allUnits.length === 0) {
        grid.innerHTML = `
            <div class="loading" style="grid-column: 1 / -1;">
                🏛️ No se encontraron unidades
            </div>
        `;
        return;
    }

    allUnits.forEach((unit, index) => {
        const unitCard = createUnitCard(unit, index);
        grid.appendChild(unitCard);
    });

    // Actualizar contador
    const totalRecords = document.getElementById('totalRecords');
    if (totalRecords) {
        totalRecords.textContent = `${allUnits.length} unidad${allUnits.length !== 1 ? 'es' : ''} encontrada${allUnits.length !== 1 ? 's' : ''}`;
    }
}

// Función para crear tarjeta de unidad principal
function createUnitCard(unit, index) {
    const unitCard = document.createElement('div');
    unitCard.className = 'unit-card';
    unitCard.style.animationDelay = `${index * 0.1}s`;
    unitCard.style.borderLeftColor = unit.color;
    
    unitCard.innerHTML = `
        <div class="unit-header">
            <div class="unit-icon" style="background: linear-gradient(135deg, ${unit.color} 0%, ${unit.color}cc 100%);">
                ${unit.icon}
            </div>
            <div class="unit-info">
                <div class="unit-name">${unit.name}</div>
                <div class="unit-subunits">
                    ${unit.subUnits.map(sub => `<span class="subunit-tag">${sub}</span>`).join(' ')}
                </div>
            </div>
        </div>
        
        <div class="unit-stats">
            <div class="employee-count">
                <span class="count-number">${unit.totalEmployees}</span>
                <span class="count-label">empleado${unit.totalEmployees !== 1 ? 's' : ''}</span>
            </div>
        </div>
        
        <button class="view-unit-btn" style="background: linear-gradient(135deg, ${unit.color} 0%, ${unit.color}cc 100%);" onclick="showEmployeesInUnit('${unit.name}')">
            Ver empleados
        </button>
    `;
    
    return unitCard;
}

// Función para mostrar empleados de una unidad con filtros
async function showEmployeesInUnit(unitName) {
    try {
        currentUnit = unitName;
        currentFilter = 'todos';
        
        showLoading();
        
        // Encontrar la unidad
        const unit = allUnits.find(u => u.name === unitName);
        if (!unit) return;
        
        // Mapear empleados de esta unidad
        currentUnitEmployees = unit.employees.map(emp => ({
            name: emp.nomExt || 'Sin nombre',
            extension: emp.extension?.toString() || 'Sin extensión',
            floor: emp.piso ? `Piso ${emp.piso}` : 'Sin ubicación',
            edificio: emp.edificio || 'N/A',
            categoria: emp.categoria || 'Sin categoría',
            adscripcion: emp.adscripcion || 'Sin adscripción',
            adscripcionCorta: emp.adscripcionCorta || 'Sin adscripción',
            ubicacion: emp.ubicacion || 'Sin ubicación'
        }));
        
        allEmployees = [...currentUnitEmployees];
        currentEmployees = [...currentUnitEmployees];
        
        // Actualizar título
        const directoryTitle = document.querySelector('.directory-title');
        if (directoryTitle) {
            directoryTitle.textContent = unitName;
        }
        
        // Mostrar vista de empleados con filtros
        const searchContainer = document.querySelector('.search-container');
        const controlsSection = document.querySelector('.controls-section');
        
        if (searchContainer) searchContainer.style.display = 'flex';
        if (controlsSection) {
            // Crear filtros personalizados
            createFilterButtons(unit);
            controlsSection.style.display = 'flex';
        }
        
        const employeesGrid = document.getElementById('employeesGrid');
        if (employeesGrid) {
            employeesGrid.className = 'employees-grid';
        }
        
        showContent();
        renderEmployees();
        updateBackButtonText();
        
        console.log(`✅ ${allEmployees.length} empleados cargados para ${unitName}`);
        
    } catch (error) {
        console.error('Error cargando empleados de unidad:', error);
        showError(`Error cargando empleados de ${unitName}`);
    }
}

// Función para crear botones de filtro
function createFilterButtons(unit) {
    const controlsSection = document.querySelector('.controls-section');
    if (!controlsSection) return;
    
    // Limpiar controles existentes
    controlsSection.innerHTML = '';
    
    // Crear contenedor de filtros
    const filtersContainer = document.createElement('div');
    filtersContainer.className = 'filters-container';
    
    // Botón "Todos"
    const allButton = document.createElement('button');
    allButton.className = 'filter-button active';
    allButton.textContent = 'Todos';
    allButton.onclick = () => filterBySubUnit('todos');
    filtersContainer.appendChild(allButton);
    
    // Botones por sub-unidad
    unit.subUnits.forEach(subUnit => {
        const button = document.createElement('button');
        button.className = 'filter-button';
        button.textContent = subUnit;
        button.onclick = () => filterBySubUnit(subUnit);
        filtersContainer.appendChild(button);
    });
    
    // Agregar filtros al contenedor
    controlsSection.appendChild(filtersContainer);
    
    // Agregar contador de resultados
    const resultsInfo = document.createElement('div');
    resultsInfo.className = 'results-info';
    resultsInfo.innerHTML = `<span id="totalRecords">${currentEmployees.length} registro${currentEmployees.length !== 1 ? 's' : ''} encontrado${currentEmployees.length !== 1 ? 's' : ''}</span>`;
    controlsSection.appendChild(resultsInfo);
}

// Función para filtrar por sub-unidad
function filterBySubUnit(subUnit) {
    currentFilter = subUnit;
    
    // Actualizar botones activos
    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    
    const activeButton = Array.from(filterButtons).find(btn => 
        btn.textContent === subUnit || (subUnit === 'todos' && btn.textContent === 'Todos')
    );
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Filtrar empleados
    if (subUnit === 'todos') {
        currentEmployees = [...currentUnitEmployees];
    } else {
        currentEmployees = currentUnitEmployees.filter(emp => 
            emp.adscripcionCorta === subUnit
        );
    }
    
    // Aplicar ordenamiento actual
    applySorting();
    renderEmployees();
}

// Función para regresar a la vista de unidades
function backToUnits() {
    currentUnit = '';
    currentFilter = 'todos';
    showUnitsView();
    
    const directoryTitle = document.querySelector('.directory-title');
    if (directoryTitle) {
        directoryTitle.textContent = 'Directorio por Adscripción';
    }
    
    updateBackButtonText();
}

// Actualizar la función showDirectory para incluir adscripciones
function showDirectory(module) {
    if (isLoading) return;

    currentModule = module;
    
    const mainPage = document.getElementById('mainPage');
    const directoryPage = document.getElementById('directoryPage');
    
    if (mainPage) mainPage.style.display = 'none';
    if (directoryPage) directoryPage.style.display = 'block';
    
    // Actualizar estado del menú
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => link.classList.remove('active'));
    
    const directoryLink = document.querySelector('.nav-links a[onclick*="showDirectory"]');
    if (directoryLink) {
        directoryLink.classList.add('active');
    }
    
    // Actualizar título según el módulo
    const titles = {
        'ubicacion': 'Directorio por Ubicación',
        'adscripcion': 'Directorio por Adscripción', 
        'categoria': 'Directorio por Categoría',
        'completo': 'Listado Completo'
    };
    
    const directoryTitle = document.querySelector('.directory-title');
    if (directoryTitle) {
        directoryTitle.textContent = titles[module] || 'Agenda Dirección Jurídica';
    }
    
    // Mostrar vista según el módulo
    if (module === 'ubicacion') {
        showLocationsView();
    } else if (module === 'adscripcion') {
        showUnitsView();
    } else {
        showEmployeesView();
    }
    
    // Limpiar búsqueda
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
}

// Actualizar la función smartBack
function smartBack() {
    // Si estamos viendo empleados de una unidad
    if (currentUnit && currentModule === 'adscripcion') {
        backToUnits();
    }
    // Si estamos viendo empleados de una ubicación específica
    else if (currentLocation && currentModule === 'ubicacion') {
        backToLocations();
    } 
    // En cualquier otro caso, regresar al inicio
    else {
        showMain();
    }
}

// Actualizar la función updateBackButtonText
function updateBackButtonText() {
    const backButtonText = document.getElementById('backButtonText');
    if (!backButtonText) return;
    
    if (currentUnit && currentModule === 'adscripcion') {
        backButtonText.textContent = 'Volver a Unidades';
    } else if (currentLocation && currentModule === 'ubicacion') {
        backButtonText.textContent = 'Volver a Edificios';
    } else if (currentModule) {
        backButtonText.textContent = 'Regresar al Inicio';
    } else {
        backButtonText.textContent = 'Regresar';
    }
}




//FIN DEL CODIGO NUEVO

// ===================================
// INICIALIZACIÓN FINAL
// ===================================

console.log('Script.js cargado completamente');