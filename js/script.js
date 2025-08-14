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
        
        // Obtener elementos del DOM para mostrar estadísticas
        const totalEmployeesElement = document.getElementById('totalEmployees');
        const systemStatusElement = document.getElementById('systemStatus');
        const lastUpdateElement = document.getElementById('lastUpdate');
        const serverStatusElement = document.getElementById('serverStatus');
        
        // MÉTODO CORREGIDO: obtener solo IDs y contar
        const { data: empleados, error } = await supabase
            .from('empleados')
            .select('id');
        
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
            adscripcionCorta: emp.adscripcionCorta || emp.ubicacion || 'N/A',
            categoria: emp.categoria || 'Sin categoría',
            adscripcion: emp.adscripcion || 'Sin adscripcion',
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
    
    // Limpiar búsqueda
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    
    // Resetear datos
    currentEmployees = [...allEmployees];
    currentModule = '';
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
                    <span title="${employee.adscripcion}">${truncateText(employee.adscripcion, 30)}</span>
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
                        <label>Extensión:</label>
                        <span>${employee.extension}</span>
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

// ===================================
// INICIALIZACIÓN FINAL
// ===================================

console.log('Script.js cargado completamente');