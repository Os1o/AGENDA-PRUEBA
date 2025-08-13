<?php
// includes/footer.php
// Footer reutilizable para todas las páginas del sistema

// Obtener información del sistema
$current_year = date('Y');
$current_page = basename($_SERVER['PHP_SELF'], '.php');
$last_updated = isset($last_updated) ? $last_updated : date('Y-m-d');
?>

<!-- Footer -->
<footer class="footer">
    <div class="footer-content">
        <!-- Información principal del footer -->
        <div class="footer-grid">
            <!-- Sección: Información de la empresa -->
            <div class="footer-section">
                <h3>Dirección Jurídica</h3>
                <p>Sistema integral de gestión de personal y directorio empresarial.</p>
                <p>Optimizando la comunicación interna y la organización departamental.</p>
                
                <!-- Estadísticas del sistema -->
                <div class="footer-stats">
                    <div class="stat-item">
                        <span class="stat-number" id="footerTotalEmployees">-</span>
                        <span class="stat-label">Empleados</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number" id="footerTotalDepartments">-</span>
                        <span class="stat-label">Departamentos</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number" id="footerSystemStatus">●</span>
                        <span class="stat-label">Estado</span>
                    </div>
                </div>
            </div>
            
            <!-- Sección: Enlaces rápidos -->
            <div class="footer-section">
                <h3>Enlaces Rápidos</h3>
                <div class="footer-links">
                    <a href="index.php">
                        <span class="link-icon">🏠</span>
                        Página Principal
                    </a>
                    <a href="directorio.php">
                        <span class="link-icon">📋</span>
                        Directorio Completo
                    </a>
                    <a href="organigrama.php">
                        <span class="link-icon">🏢</span>
                        Organigrama
                    </a>
                    <a href="insumos.php">
                        <span class="link-icon">📦</span>
                        Gestión de Insumos
                    </a>
                    <a href="contacto.php">
                        <span class="link-icon">📞</span>
                        Información de Contacto
                    </a>
                </div>
            </div>
            
            <!-- Sección: Soporte técnico -->
            <div class="footer-section">
                <h3>Soporte Técnico</h3>
                <div class="footer-links">
                    <a href="#" onclick="showHelp()">
                        <span class="link-icon">❓</span>
                        Mesa de Ayuda
                    </a>
                    <a href="#" onclick="showManual()">
                        <span class="link-icon">📖</span>
                        Manual de Usuario
                    </a>
                    <a href="#" onclick="reportIssue()">
                        <span class="link-icon">🐛</span>
                        Reportar Problema
                    </a>
                    <a href="#" onclick="showChangelog()">
                        <span class="link-icon">📝</span>
                        Notas de Versión
                    </a>
                    <a href="#" onclick="downloadBackup()">
                        <span class="link-icon">💾</span>
                        Respaldo de Datos
                    </a>
                </div>
            </div>
            
            <!-- Sección: Información de contacto -->
            <div class="footer-section">
                <h3>Información de Contacto</h3>
                <div class="contact-info">
                    <div class="contact-item">
                        <span class="contact-icon">📧</span>
                        <div class="contact-details">
                            <strong>Email:</strong>
                            <a href="mailto:soporte@empresa.com">soporte@empresa.com</a>
                        </div>
                    </div>
                    
                    <div class="contact-item">
                        <span class="contact-icon">📞</span>
                        <div class="contact-details">
                            <strong>Teléfono:</strong>
                            <a href="tel:+525512345678">+52 55 1234 5678</a>
                        </div>
                    </div>
                    
                    <div class="contact-item">
                        <span class="contact-icon">🏢</span>
                        <div class="contact-details">
                            <strong>Ubicación:</strong>
                            <span>Piso 6 Oriente</span>
                        </div>
                    </div>
                    
                    <div class="contact-item">
                        <span class="contact-icon">🕐</span>
                        <div class="contact-details">
                            <strong>Horario:</strong>
                            <span>Lun - Vie: 9:00 - 18:00</span>
                        </div>
                    </div>
                </div>
                
                <!-- Redes sociales / Enlaces adicionales -->
                <div class="social-links">
                    <a href="#" class="social-link" title="Intranet corporativa">
                        <span class="social-icon">🌐</span>
                    </a>
                    <a href="#" class="social-link" title="Sistema de tickets">
                        <span class="social-icon">🎫</span>
                    </a>
                    <a href="#" class="social-link" title="Portal de empleados">
                        <span class="social-icon">👥</span>
                    </a>
                </div>
            </div>
        </div>
        
        <!-- Sección inferior del footer -->
        <div class="footer-bottom">
            <div class="footer-bottom-content">
                <div class="footer-left">
                    <p>&copy; <?php echo $current_year; ?> Dirección Jurídica. Todos los derechos reservados.</p>
                    <p class="footer-subtitle">
                        Desarrollado con ❤️ para mejorar la comunicación interna
                        <?php if (isset($app_version)): ?>
                            | Versión <?php echo $app_version; ?>
                        <?php endif; ?>
                    </p>
                </div>
                
                <div class="footer-center">
                    <div class="footer-badges">
                        <span class="badge badge-php" title="Desarrollado en PHP">PHP</span>
                        <span class="badge badge-responsive" title="Diseño responsivo">📱</span>
                        <span class="badge badge-secure" title="Conexión segura">🔒</span>
                    </div>
                </div>
                
                <div class="footer-right">
                    <div class="footer-actions">
                        <button class="footer-btn" onclick="scrollToTop()" title="Ir arriba">
                            ↑ Subir
                        </button>
                        <button class="footer-btn" onclick="toggleTheme()" title="Cambiar tema">
                            🌙 Tema
                        </button>
                        <button class="footer-btn" onclick="printPage()" title="Imprimir página">
                            🖨️ Imprimir
                        </button>
                    </div>
                    
                    <!-- Información del sistema -->
                    <div class="system-info">
                        <small>
                            Última actualización: <?php echo $last_updated; ?> |
                            Servidor: <?php echo $_SERVER['SERVER_NAME']; ?> |
                            IP: <?php echo $_SERVER['REMOTE_ADDR']; ?>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Widget de estado del sistema -->
    <div class="system-status-widget" id="systemStatusWidget">
        <div class="status-indicator">
            <span class="status-dot" id="statusDot"></span>
            <span class="status-text" id="statusText">Verificando conexión...</span>
        </div>
        <div class="status-details" id="statusDetails" style="display: none;">
            <div class="status-item">
                <span class="status-label">Base de datos:</span>
                <span class="status-value" id="dbStatus">Conectando...</span>
            </div>
            <div class="status-item">
                <span class="status-label">Última sincronización:</span>
                <span class="status-value" id="lastSync">--:--</span>
            </div>
            <div class="status-item">
                <span class="status-label">Rendimiento:</span>
                <span class="status-value" id="performance">--ms</span>
            </div>
        </div>
    </div>
</footer>

<!-- Modal de ayuda -->
<div id="helpModal" class="modal-overlay" style="display: none;">
    <div class="modal-content help-modal">
        <div class="modal-header">
            <h3>Centro de Ayuda</h3>
            <button class="modal-close" onclick="closeModal('helpModal')">&times;</button>
        </div>
        <div class="modal-body">
            <div class="help-sections">
                <div class="help-section">
                    <h4>Navegación Básica</h4>
                    <ul>
                        <li>Use los módulos de la página principal para acceder a diferentes vistas</li>
                        <li>La búsqueda se puede realizar desde cualquier página</li>
                        <li>Use ESC para cerrar ventanas modales</li>
                    </ul>
                </div>
                <div class="help-section">
                    <h4>Búsqueda de Empleados</h4>
                    <ul>
                        <li>Busque por nombre, ID, ubicación o departamento</li>
                        <li>Use filtros para refinar resultados</li>
                        <li>Los resultados se actualizan en tiempo real</li>
                    </ul>
                </div>
                <div class="help-section">
                    <h4>Problemas Comunes</h4>
                    <ul>
                        <li>Si no ve datos, verifique la conexión a internet</li>
                        <li>Actualice la página si los datos no cargan</li>
                        <li>Use el botón "Reportar Problema" para issues técnicos</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
// ===================================
// FUNCIONES DEL FOOTER
// ===================================

// Cargar estadísticas del footer
async function loadFooterStats() {
    try {
        if (typeof supabase !== 'undefined') {
            const { data: empleados, error } = await supabase
                .from('empleados')
                .select('categoria, ubicacion');
            
            if (!error && empleados) {
                // Total de empleados
                document.getElementById('footerTotalEmployees').textContent = empleados.length;
                
                // Total de departamentos únicos
                const departamentos = [...new Set(empleados.map(emp => emp.categoria))].filter(Boolean);
                document.getElementById('footerTotalDepartments').textContent = departamentos.length;
                
                // Estado del sistema
                const statusElement = document.getElementById('footerSystemStatus');
                const statusDot = document.getElementById('statusDot');
                const statusText = document.getElementById('statusText');
                
                if (statusElement) statusElement.textContent = '●';
                if (statusElement) statusElement.style.color = '#27ae60';
                if (statusDot) statusDot.className = 'status-dot online';
                if (statusText) statusText.textContent = 'Sistema operativo';
                
                updateSystemStatus('online', 'Conexión estable');
            }
        }
    } catch (error) {
        console.error('Error cargando estadísticas del footer:', error);
        updateSystemStatus('error', 'Error de conexión');
    }
}

// Actualizar estado del sistema
function updateSystemStatus(status, message) {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const dbStatus = document.getElementById('dbStatus');
    const lastSync = document.getElementById('lastSync');
    
    if (statusDot && statusText) {
        statusDot.className = `status-dot ${status}`;
        statusText.textContent = message;
    }
    
    if (dbStatus) {
        dbStatus.textContent = status === 'online' ? 'Conectada' : 'Error';
    }
    
    if (lastSync) {
        lastSync.textContent = new Date().toLocaleTimeString();
    }
}

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
    
    showNotification(
        `Tema cambiado a ${newTheme === 'dark' ? 'oscuro' : 'claro'}`,
        'info'
    );
}

// Imprimir página
function printPage() {
    // Ocultar elementos no necesarios para impresión
    const elementsToHide = ['.navbar', '.footer', '.modal-overlay'];
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
    document.getElementById('helpModal').style.display = 'flex';
}

// Mostrar manual
function showManual() {
    showNotification('Abriendo manual de usuario...', 'info');
    // Aquí podrías abrir un PDF o página de manual
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
        url: window.location.href
    };
    
    // En un sistema real, esto enviaría los datos a un sistema de tickets
    console.log('Datos del reporte:', issueData);
    
    showNotification('Reporte enviado al equipo de soporte', 'success');
}

// Mostrar changelog
function showChangelog() {
    showNotification('Cargando notas de la versión...', 'info');
    // Aquí mostrarías las notas de la versión actual
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

// Toggle del widget de estado
document.addEventListener('DOMContentLoaded', function() {
    const widget = document.getElementById('systemStatusWidget');
    const details = document.getElementById('statusDetails');
    
    if (widget) {
        widget.addEventListener('click', function() {
            const isVisible = details.style.display !== 'none';
            details.style.display = isVisible ? 'none' : 'block';
        });
    }
    
    // Cargar estadísticas del footer
    loadFooterStats();
    
    // Cargar tema guardado
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
    }
    
    // Actualizar estadísticas cada 5 minutos
    setInterval(loadFooterStats, 5 * 60 * 1000);
});

// Monitoreo de rendimiento
function measurePerformance() {
    const start = performance.now();
    
    // Simular una operación
    setTimeout(() => {
        const end = performance.now();
        const duration = Math.round(end - start);
        
        const performanceElement = document.getElementById('performance');
        if (performanceElement) {
            performanceElement.textContent = `${duration}ms`;
        }
    }, 100);
}

// Ejecutar medición de rendimiento cada minuto
setInterval(measurePerformance, 60000);

console.log('Footer scripts cargados');
</script>

<!-- Estilos específicos del footer -->
<style>
/* ===================================
   ESTILOS ADICIONALES DEL FOOTER
   =================================== */

/* Estadísticas del footer */
.footer-stats {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-stats .stat-item {
    text-align: center;
}

.footer-stats .stat-number {
    display: block;
    font-size: 1.2rem;
    font-weight: bold;
    color: #8b7355;
}

.footer-stats .stat-label {
    font-size: 0.8rem;
    color: #bdc3c7;
}

/* Enlaces del footer */
.footer-links {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.footer-links a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #bdc3c7;
    text-decoration: none;
    padding: 0.25rem 0;
    transition: all 0.3s ease;
}

.footer-links a:hover {
    color: #8b7355;
    transform: translateX(5px);
}

.link-icon {
    font-size: 1rem;
    width: 20px;
    text-align: center;
}

/* Información de contacto */
.contact-info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.contact-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
}

.contact-icon {
    font-size: 1.2rem;
    width: 24px;
    text-align: center;
    flex-shrink: 0;
}

.contact-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.contact-details strong {
    color: #8b7355;
    font-size: 0.9rem;
}

.contact-details a {
    color: #bdc3c7;
    text-decoration: none;
}

.contact-details a:hover {
    color: #8b7355;
}

/* Redes sociales */
.social-links {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    color: white;
    text-decoration: none;
    transition: all 0.3s ease;
}

.social-link:hover {
    background: #8b7355;
    transform: translateY(-3px);
}

.social-icon {
    font-size: 1.2rem;
}

/* Footer bottom mejorado */
.footer-bottom-content {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 2rem;
    align-items: center;
}

.footer-left, .footer-right {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.footer-center {
    text-align: center;
}

.footer-subtitle {
    font-size: 0.85rem;
    opacity: 0.8;
}

/* Badges */
.footer-badges {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
}

.badge {
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.7rem;
    font-weight: bold;
    text-transform: uppercase;
}

.badge-php { background: #8993be; color: white; }
.badge-responsive { background: #28a745; color: white; }
.badge-secure { background: #6c757d; color: white; }

/* Acciones del footer */
.footer-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
}

.footer-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.3s ease;
}

.footer-btn:hover {
    background: #8b7355;
    border-color: #8b7355;
    transform: translateY(-2px);
}

/* Información del sistema */
.system-info {
    text-align: right;
    margin-top: 0.5rem;
}

.system-info small {
    color: #95a5a6;
    font-size: 0.7rem;
}

/* Widget de estado del sistema */
.system-status-widget {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 12px;
    padding: 1rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    z-index: 999;
}

.system-status-widget:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.status-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    animation: pulse 2s infinite;
}

.status-dot.online { background: #27ae60; }
.status-dot.warning { background: #f39c12; }
.status-dot.error { background: #e74c3c; }

.status-text {
    font-size: 0.9rem;
    font-weight: 600;
    color: #2c3e50;
}

.status-details {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e0e0e0;
}

.status-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.8rem;
}

.status-label {
    color: #7f8c8d;
}

.status-value {
    font-weight: 600;
    color: #2c3e50;
}

/* Modal de ayuda */
.help-modal {
    max-width: 600px;
    max-height: 70vh;
    overflow-y: auto;
}

.help-sections {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.help-section h4 {
    color: #8b7355;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
}

.help-section ul {
    list-style: none;
    padding-left: 0;
}

.help-section li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #f0f0f0;
    position: relative;
    padding-left: 1.5rem;
}

.help-section li::before {
    content: '→';
    position: absolute;
    left: 0;
    color: #8b7355;
    font-weight: bold;
}

/* Temas */
[data-theme="dark"] {
    --bg-color: #1a1a1a;
    --text-color: #ffffff;
    --card-bg: #2d2d2d;
}

[data-theme="dark"] .system-status-widget {
    background: rgba(45, 45, 45, 0.95);
    color: white;
}

[data-theme="dark"] .status-text {
    color: white;
}

[data-theme="dark"] .status-value {
    color: #e0e0e0;
}

/* Responsive */
@media (max-width: 768px) {
    .footer-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    
    .footer-bottom-content {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 1rem;
    }
    
    .footer-actions {
        justify-content: center;
    }
    
    .system-info {
        text-align: center;
    }
    
    .system-status-widget {
        position: relative;
        bottom: auto;
        right: auto;
        margin: 1rem auto;
        width: fit-content;
    }
    
    .footer-stats {
        justify-content: center;
    }
    
    .social-links {
        justify-content: center;
    }
}

/* Animaciones */
@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}
</style>