<?php include 'includes/config.php'; ?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $app_name; ?> - Dirección Jurídica</title>
    <link rel="stylesheet" href="css/styles.css">
    <meta name="description" content="Sistema integral de gestión de personal y directorio empresarial">
</head>
<body>
    <?php include 'includes/header.php'; ?>
    
    <main class="main-content">
        <!-- Página Principal -->
        <div class="main-page" id="mainPage">
            <div class="hero">
                <h1>Directorio Empresarial</h1>
                <p>Sistema integral de gestión de personal - Dirección Jurídica</p>
            </div>

            <div class="modules-grid">
                <div class="module-card" onclick="showDirectory('ubicacion')">
                    <div class="module-icon">📍</div>
                    <div class="module-title">Por Ubicación</div>
                    <div class="module-description">Encuentra empleados por su ubicación física y piso de trabajo</div>
                </div>
                
                <div class="module-card" onclick="showDirectory('adscripcion')">
                    <div class="module-icon">🏢</div>
                    <div class="module-title">Por Adscripción</div>
                    <div class="module-description">Organiza el personal por departamentos y áreas de trabajo</div>
                </div>
                
                <div class="module-card" onclick="showDirectory('categoria')">
                    <div class="module-icon">👤</div>
                    <div class="module-title">Por Categoría</div>
                    <div class="module-description">Clasifica empleados por jerarquía y tipo de puesto</div>
                </div>
                
                <div class="module-card" onclick="showDirectory('completo')">
                    <div class="module-icon">📋</div>
                    <div class="module-title">Listado Completo</div>
                    <div class="module-description">Visualiza todo el personal en un directorio completo</div>
                </div>
            </div>
        </div>

        <!-- Página de Directorio -->
        <div class="directory-page" id="directoryPage">
            <div class="directory-header">
                <div class="directory-nav">
                    <button class="back-button" onclick="showMain()">
                        <span>←</span> Regresar
                    </button>
                    <div class="directory-title">Agenda Dirección Jurídica</div>
                    <div class="search-container">
                        <input type="text" class="search-input" placeholder="Buscar empleado o ID..." id="searchInput">
                        <button class="search-button" onclick="searchEmployees()">🔍 Buscar</button>
                    </div>
                </div>
            </div>

            <div class="content-area">
                <div id="loadingState" class="loading" style="display: none;">
                    🔄 Cargando empleados desde la base de datos...
                </div>

                <div id="errorState" class="error" style="display: none;">
                    ❌ Error al cargar datos. Revisa la conexión a la base de datos.
                </div>

                <div id="employeeContent" style="display: none;">
                    <div class="controls-section">
                        <div class="sort-controls">
                            <button class="sort-button active" onclick="sortBy('az')">A → Z</button>
                            <button class="sort-button" onclick="sortBy('za')">Z → A</button>
                        </div>
                        <div class="results-info">
                            <span id="totalRecords">0 registros encontrados</span>
                        </div>
                    </div>

                    <div class="employees-grid" id="employeesGrid">
                        <!-- Los empleados se cargarán aquí -->
                    </div>
                </div>
            </div>
        </div>
    </main>

    <?php include 'includes/footer.php'; ?>
    
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="js/script.js"></script>
</body>
</html>