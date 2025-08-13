/* ===================================
   DIRECTORIO EMPRESARIAL - SCRIPT.JS
   Sistema integral de gestión de personal
   =================================== */

// ===================================
// CONFIGURACIÓN GLOBAL
// ===================================

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
// INICIALIZACIÓN
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Directorio Empresarial iniciado');
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    validateSupabaseConnection();
}

// ===================================
// CONFIGURACIÓN DE EVENTOS
// ===================================

function setupEventListeners() {
    // Búsqueda en tiempo real con debounce
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchEmployees();
            }, 300);
        });

        // Búsqueda al presionar Enter
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchEmployees();
            }
        });
    }

    // Navegación con teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const directoryPage = document.getElementById('directoryPage');
            if (directoryPage && directoryPage.style.display !== 'none') {
                showMain();
            }
        }
    });

    // Prevenir submit en formularios
    document.addEventListener('submit', function(e) {
        e.preventDefault();
    });
}

// ===================================
// VALIDACIÓN DE CONEXIÓN
// ===================================

async function validateSupabaseConnection() {
    try {
        const { data, error } = await supabase
            .from('empleados')
            .select('count(*)')
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
// CARGA DE DATOS DESDE SUPABASE
// ===================================

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
            id: emp.id?.toString() || 'Sin ID',
            floor: emp.piso ? `Piso ${emp.piso}` : 'Sin ubicación',
            office: emp.descripcionCorta || emp.ubicacion || 'N/A',
            categoria: emp.categoria || 'Sin categoría',
            descripcion: emp.descripcion || 'Sin descripción',
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
                        <span>🆔</span>
                        <span>${employee.id}</span>
                    </div>
                    <span style="color: #95a5a6;">|</span>
                    <span title="${employee.descripcion}">${truncateText(employee.descripcion, 30)}</span>
                </div>
            </div>
        </div>
        <div class="office-badge">${employee.office}</div>
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
            employee.id.includes(searchTerm) ||
            employee.floor.toLowerCase().includes(searchTerm) ||
            employee.office.toLowerCase().includes(searchTerm) ||
            employee.categoria.toLowerCase().includes(searchTerm) ||
            employee.descripcion.toLowerCase().includes(searchTerm) ||
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
                <h3>Detalles del Empleado</h3>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="employee-detail-grid">
                    <div class="detail-item">
                        <label>Nombre Completo:</label>
                        <span>${employee.name}</span>
                    </div>
                    <div class="detail-item">
                        <label>ID:</label>
                        <span>${employee.id}</span>
                    </div>
                    <div class="detail-item">
                        <label>Descripción:</label>
                        <span>${employee.descripcion}</span>
                    </div>
                    <div class="detail-item">
                        <label>Categoría:</label>
                        <span>${employee.categoria}</span>
                    </div>
                    <div class="detail-item">
                        <label>Ubicación:</label>
                        <span>${employee.floor} - ${employee.ubicacion}</span>
                    </div>
                    <div class="detail-item">
                        <label>Oficina:</label>
                        <span>${employee.office}</span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="closeModal()">Cerrar</button>
            </div>
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

    const headers = ['Nombre', 'ID', 'Descripción', 'Categoría', 'Piso', 'Ubicación', 'Oficina'];
    const csvContent = [
        headers.join(','),
        ...currentEmployees.map(emp => [
            `"${emp.name}"`,
            emp.id,
            `"${emp.descripcion}"`,
            `"${emp.categoria}"`,
            `"${emp.floor}"`,
            `"${emp.ubicacion}"`,
            `"${emp.office}"`
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