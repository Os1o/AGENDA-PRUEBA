<?php
/**
 * =====================================
 * DIRECTORIO EMPRESARIAL - CONFIG.PHP
 * Archivo de configuración principal
 * =====================================
 */

// Prevenir acceso directo al archivo
if (!defined('CONFIG_LOADED')) {
    define('CONFIG_LOADED', true);
}

// Iniciar sesión si no está activa
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// =====================================
// CONFIGURACIÓN DEL ENTORNO
// =====================================

// Detectar entorno (desarrollo, pruebas, producción)
$server_name = $_SERVER['SERVER_NAME'] ?? 'localhost';
$is_localhost = in_array($server_name, ['localhost', '127.0.0.1', '::1']);
$is_netlify = strpos($server_name, 'netlify') !== false;
$is_production = !$is_localhost && !$is_netlify;

// Configurar entorno
if ($is_localhost) {
    define('ENVIRONMENT', 'development');
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} elseif ($is_netlify) {
    define('ENVIRONMENT', 'testing');
    error_reporting(E_ERROR | E_WARNING);
    ini_set('display_errors', 0);
} else {
    define('ENVIRONMENT', 'production');
    error_reporting(0);
    ini_set('display_errors', 0);
}

// =====================================
// INFORMACIÓN DE LA APLICACIÓN
// =====================================

$app_name = "Directorio Empresarial";
$app_version = "1.2.0";
$app_description = "Sistema integral de gestión de personal - Dirección Jurídica";
$app_author = "Equipo de Desarrollo Interno";
$app_release_date = "2025-01-15";
$last_updated = date('Y-m-d H:i:s');

// Configuración de la empresa
$company_name = "Dirección Jurídica";
$company_department = "Coordinación Administrativa";
$company_address = "Piso 6 Oriente";
$company_phone = "+52 55 1234 5678";
$company_email = "soporte@empresa.com";

// =====================================
// CONFIGURACIÓN DE BASE DE DATOS
// =====================================

// Configuración para servidor local (XAMPP/WAMP)
if (ENVIRONMENT === 'development') {
    // Base de datos MySQL local
    $db_config = [
        'host' => 'localhost',
        'port' => '3306',
        'dbname' => 'directorio_empresa',
        'username' => 'root',
        'password' => '',
        'charset' => 'utf8mb4',
        'options' => [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    ];
    
    // Configuración de Supabase para desarrollo
    $supabase_config = [
        'url' => 'https://gtogelwnsbgodwfghhku.supabase.co',
        'anon_key' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0b2dlbHduc2Jnb2R3ZmdoaGt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTk4MDcsImV4cCI6MjA2OTk5NTgwN30.HRxeUmgbT8esQ_PwMRMF3p4jI6CStRRfm5x-lvHUytw',
        'service_role_key' => '', // Solo para operaciones administrativas
        'table_prefix' => '',
        'schema' => 'public'
    ];
} 
// Configuración para entorno de pruebas (Netlify)
elseif (ENVIRONMENT === 'testing') {
    // Solo Supabase en testing
    $db_config = null;
    
    $supabase_config = [
        'url' => 'https://gtogelwnsbgodwfghhku.supabase.co',
        'anon_key' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0b2dlbHduc2Jnb2R3ZmdoaGt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTk4MDcsImV4cCI6MjA2OTk5NTgwN30.HRxeUmgbT8esQ_PwMRMF3p4jI6CStRRfm5x-lvHUytw',
        //'service_role_key' => $_ENV['SUPABASE_SERVICE_ROLE_KEY'] ?? '',
        'table_prefix' => '',
        'schema' => 'public'
    ];
}
// Configuración para producción
else {
    // Base de datos MySQL/MariaDB local
    $db_config = [
        'host' => $_ENV['DB_HOST'] ?? 'localhost',
        'port' => $_ENV['DB_PORT'] ?? '3306',
        'dbname' => $_ENV['DB_NAME'] ?? 'directorio_empresa',
        'username' => $_ENV['DB_USER'] ?? 'directorio_user',
        'password' => $_ENV['DB_PASS'] ?? '',
        'charset' => 'utf8mb4',
        'options' => [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    ];
    
    // Supabase como respaldo o para sincronización
    $supabase_config = [
        'url' => 'https://gtogelwnsbgodwfghhku.supabase.co',
        'anon_key' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0b2dlbHduc2Jnb2R3ZmdoaGt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTk4MDcsImV4cCI6MjA2OTk5NTgwN30.HRxeUmgbT8esQ_PwMRMF3p4jI6CStRRfm5x-lvHUytw',
        'table_prefix' => '',
        'schema' => 'public'
    ];
}

// =====================================
// CONFIGURACIÓN DE SEGURIDAD
// =====================================

// Configuración de sesiones
$session_config = [
    'lifetime' => 3600, // 1 hora
    'path' => '/',
    'domain' => $server_name,
    'secure' => !$is_localhost, // HTTPS solo en producción
    'httponly' => true,
    'samesite' => 'Lax'
];

// Configurar sesión
ini_set('session.cookie_lifetime', $session_config['lifetime']);
ini_set('session.cookie_path', $session_config['path']);
ini_set('session.cookie_domain', $session_config['domain']);
ini_set('session.cookie_secure', $session_config['secure']);
ini_set('session.cookie_httponly', $session_config['httponly']);
ini_set('session.cookie_samesite', $session_config['samesite']);

// Configuración de seguridad adicional
$security_config = [
    'max_login_attempts' => 5,
    'lockout_duration' => 900, // 15 minutos
    'password_min_length' => 8,
    'session_regenerate_interval' => 300, // 5 minutos
    'csrf_token_lifetime' => 3600,
    'allowed_file_types' => ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv'],
    'max_file_size' => 5 * 1024 * 1024, // 5MB
];

// Headers de seguridad
if (!$is_localhost) {
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('X-XSS-Protection: 1; mode=block');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    if ($is_production) {
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
    }
}

// =====================================
// CONFIGURACIÓN DE LA APLICACIÓN
// =====================================

// Configuración de paginación
$pagination_config = [
    'default_limit' => 20,
    'max_limit' => 100,
    'show_pagination_info' => true,
    'pagination_range' => 5
];

// Configuración de búsqueda
$search_config = [
    'min_search_length' => 2,
    'max_search_length' => 100,
    'search_delay' => 300, // milisegundos
    'highlight_results' => true,
    'fuzzy_search' => false
];

// Configuración de exportación
$export_config = [
    'allowed_formats' => ['csv', 'xlsx', 'pdf'],
    'max_export_records' => 1000,
    'include_headers' => true,
    'date_format' => 'Y-m-d H:i:s'
];

// Configuración de cache
$cache_config = [
    'enabled' => ENVIRONMENT === 'production',
    'default_ttl' => 3600, // 1 hora
    'employee_cache_ttl' => 1800, // 30 minutos
    'stats_cache_ttl' => 300, // 5 minutos
    'cache_directory' => __DIR__ . '/../cache/'
];

// =====================================
// CONFIGURACIÓN DE LOGGING
// =====================================

$log_config = [
    'enabled' => true,
    'level' => ENVIRONMENT === 'development' ? 'DEBUG' : 'ERROR',
    'file_path' => __DIR__ . '/../logs/',
    'max_file_size' => 10 * 1024 * 1024, // 10MB
    'max_files' => 10,
    'log_rotation' => true,
    'include_user_info' => true
];

// Crear directorio de logs si no existe
if ($log_config['enabled'] && !is_dir($log_config['file_path'])) {
    mkdir($log_config['file_path'], 0755, true);
}

// =====================================
// FUNCIONES DE UTILIDAD
// =====================================

/**
 * Función para conectar a la base de datos MySQL
 */
function getDBConnection() {
    global $db_config;
    
    if (!$db_config) {
        return null;
    }
    
    try {
        $dsn = "mysql:host={$db_config['host']};port={$db_config['port']};dbname={$db_config['dbname']};charset={$db_config['charset']}";
        $pdo = new PDO($dsn, $db_config['username'], $db_config['password'], $db_config['options']);
        
        // Configurar zona horaria
        $pdo->exec("SET time_zone = '+00:00'");
        
        return $pdo;
    } catch (PDOException $e) {
        logError('Database connection failed: ' . $e->getMessage());
        return null;
    }
}

/**
 * Función para obtener configuración de Supabase
 */
function getSupabaseConfig() {
    global $supabase_config;
    return $supabase_config;
}

/**
 * Función de logging
 */
function logMessage($message, $level = 'INFO') {
    global $log_config;
    
    if (!$log_config['enabled']) {
        return;
    }
    
    $log_levels = ['DEBUG' => 0, 'INFO' => 1, 'WARNING' => 2, 'ERROR' => 3];
    $current_level = $log_levels[$log_config['level']] ?? 1;
    $message_level = $log_levels[$level] ?? 1;
    
    if ($message_level < $current_level) {
        return;
    }
    
    $timestamp = date('Y-m-d H:i:s');
    $user_info = '';
    
    if ($log_config['include_user_info']) {
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
        $user_info = " [IP: $ip] [UA: " . substr($user_agent, 0, 50) . "]";
    }
    
    $log_entry = "[$timestamp] [$level]$user_info $message" . PHP_EOL;
    
    $log_file = $log_config['file_path'] . 'app_' . date('Y-m-d') . '.log';
    file_put_contents($log_file, $log_entry, FILE_APPEND | LOCK_EX);
    
    // Rotación de logs
    if ($log_config['log_rotation']) {
        rotateLogs();
    }
}

/**
 * Función para logging de errores
 */
function logError($message) {
    logMessage($message, 'ERROR');
}

/**
 * Función para logging de debug
 */
function logDebug($message) {
    logMessage($message, 'DEBUG');
}

/**
 * Rotación de archivos de log
 */
function rotateLogs() {
    global $log_config;
    
    $log_files = glob($log_config['file_path'] . '*.log');
    
    foreach ($log_files as $file) {
        if (filesize($file) > $log_config['max_file_size']) {
            $backup_file = $file . '.' . time() . '.bak';
            rename($file, $backup_file);
        }
    }
    
    // Limpiar archivos antiguos
    $backup_files = glob($log_config['file_path'] . '*.bak');
    if (count($backup_files) > $log_config['max_files']) {
        usort($backup_files, function($a, $b) {
            return filemtime($a) - filemtime($b);
        });
        
        $files_to_delete = array_slice($backup_files, 0, count($backup_files) - $log_config['max_files']);
        foreach ($files_to_delete as $file) {
            unlink($file);
        }
    }
}

/**
 * Función para generar token CSRF
 */
function generateCSRFToken() {
    if (!isset($_SESSION['csrf_token']) || 
        !isset($_SESSION['csrf_token_time']) || 
        (time() - $_SESSION['csrf_token_time']) > $GLOBALS['security_config']['csrf_token_lifetime']) {
        
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        $_SESSION['csrf_token_time'] = time();
    }
    
    return $_SESSION['csrf_token'];
}

/**
 * Función para validar token CSRF
 */
function validateCSRFToken($token) {
    return isset($_SESSION['csrf_token']) && 
           hash_equals($_SESSION['csrf_token'], $token) &&
           isset($_SESSION['csrf_token_time']) &&
           (time() - $_SESSION['csrf_token_time']) <= $GLOBALS['security_config']['csrf_token_lifetime'];
}

/**
 * Función para sanear entrada de datos
 */
function sanitizeInput($data) {
    if (is_array($data)) {
        return array_map('sanitizeInput', $data);
    }
    
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

/**
 * Función para validar email
 */
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Función para obtener información del sistema
 */
function getSystemInfo() {
    global $app_name, $app_version, $app_release_date;
    
    return [
        'app_name' => $app_name,
        'app_version' => $app_version,
        'app_release_date' => $app_release_date,
        'environment' => ENVIRONMENT,
        'php_version' => PHP_VERSION,
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
        'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? '',
        'server_name' => $_SERVER['SERVER_NAME'] ?? 'localhost'
    ];
}

// =====================================
// INICIALIZACIÓN DEL SISTEMA
// =====================================

// Regenerar ID de sesión periódicamente
if (isset($_SESSION['last_regeneration']) && 
    (time() - $_SESSION['last_regeneration']) > $security_config['session_regenerate_interval']) {
    session_regenerate_id(true);
    $_SESSION['last_regeneration'] = time();
} elseif (!isset($_SESSION['last_regeneration'])) {
    $_SESSION['last_regeneration'] = time();
}

// Establecer zona horaria
date_default_timezone_set('America/Mexico_City');

// Configurar límites de memoria y tiempo (solo en desarrollo)
if (ENVIRONMENT === 'development') {
    ini_set('memory_limit', '256M');
    ini_set('max_execution_time', 300);
}

// Log del inicio del sistema
logMessage("Sistema iniciado - Entorno: " . ENVIRONMENT . " - Versión: $app_version");

// =====================================
// CONSTANTES DEL SISTEMA
// =====================================

define('APP_NAME', $app_name);
define('APP_VERSION', $app_version);
define('APP_DESCRIPTION', $app_description);
define('COMPANY_NAME', $company_name);
define('COMPANY_EMAIL', $company_email);
define('COMPANY_PHONE', $company_phone);

// Rutas del sistema
define('BASE_PATH', __DIR__ . '/../');
define('INCLUDES_PATH', __DIR__ . '/');
define('ASSETS_PATH', BASE_PATH . 'assets/');
define('UPLOADS_PATH', BASE_PATH . 'uploads/');
define('CACHE_PATH', BASE_PATH . 'cache/');
define('LOGS_PATH', BASE_PATH . 'logs/');

// URLs del sistema
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';
$base_url = $protocol . $_SERVER['HTTP_HOST'] . dirname($_SERVER['SCRIPT_NAME']);
define('BASE_URL', rtrim($base_url, '/') . '/');

// =====================================
// CONFIGURACIÓN FINAL
// =====================================

// Hacer variables globales disponibles
$GLOBALS['db_config'] = $db_config;
$GLOBALS['supabase_config'] = $supabase_config;
$GLOBALS['security_config'] = $security_config;
$GLOBALS['pagination_config'] = $pagination_config;
$GLOBALS['search_config'] = $search_config;
$GLOBALS['export_config'] = $export_config;
$GLOBALS['cache_config'] = $cache_config;
$GLOBALS['log_config'] = $log_config;

// Mensaje de confirmación (solo en desarrollo)
if (ENVIRONMENT === 'development') {
    logDebug("Configuración cargada exitosamente");
}

?>