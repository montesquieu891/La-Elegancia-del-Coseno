// La Elegancia del Coseno - Main JavaScript
// All interactivity for the 5 modules

// ============================================================================
// GLOBAL STATE & CONFIGURATION
// ============================================================================

const API_BASE_URL = window.location.origin;
let selectedModule = 'module1';

// 2D Canvas state
let canvas2d, ctx2d;
let vectorA = { x: 100, y: 100 };
let vectorB = { x: 150, y: 50 };
let dragging = null;

// 3D Scene state
let scene3d, camera3d, renderer3d;
let vectorA3d, vectorB3d;

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initModule1_Geometry();
    initModule2_Math();
    initModule3_TextVectors();
    initModule4_Embeddings();
    initModule5_LLMs();
});

// ============================================================================
// NAVIGATION
// ============================================================================

function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const moduleId = btn.getAttribute('data-module');
            showModule(moduleId);
            
            // Update active state
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

function showModule(moduleId) {
    const modules = document.querySelectorAll('.module');
    modules.forEach(module => {
        module.classList.remove('active');
    });
    
    const targetModule = document.getElementById(moduleId);
    if (targetModule) {
        targetModule.classList.add('active');
        selectedModule = moduleId;
        
        // Refresh module-specific elements
        if (moduleId === 'module1') {
            setTimeout(() => {
                if (renderer3d) renderer3d.render(scene3d, camera3d);
            }, 100);
        }
    }
}

// ============================================================================
// MÓDULO 1: GEOMETRÍA INTUITIVA
// ============================================================================

function initModule1_Geometry() {
    init2DCanvas();
    init3DCanvas();
}

function init2DCanvas() {
    canvas2d = document.getElementById('canvas2d');
    if (!canvas2d) return;
    
    ctx2d = canvas2d.getContext('2d');
    
    // Event listeners for dragging
    canvas2d.addEventListener('mousedown', onCanvasMouseDown);
    canvas2d.addEventListener('mousemove', onCanvasMouseMove);
    canvas2d.addEventListener('mouseup', onCanvasMouseUp);
    canvas2d.addEventListener('mouseleave', onCanvasMouseUp);
    
    draw2DCanvas();
}

function onCanvasMouseDown(e) {
    const rect = canvas2d.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if clicking near vector endpoints
    const threshold = 15;
    
    if (Math.abs(x - vectorA.x) < threshold && Math.abs(y - vectorA.y) < threshold) {
        dragging = 'A';
    } else if (Math.abs(x - vectorB.x) < threshold && Math.abs(y - vectorB.y) < threshold) {
        dragging = 'B';
    }
}

function onCanvasMouseMove(e) {
    if (!dragging) return;
    
    const rect = canvas2d.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Constrain to canvas
    const constrainedX = Math.max(10, Math.min(canvas2d.width - 10, x));
    const constrainedY = Math.max(10, Math.min(canvas2d.height - 10, y));
    
    if (dragging === 'A') {
        vectorA.x = constrainedX;
        vectorA.y = constrainedY;
    } else if (dragging === 'B') {
        vectorB.x = constrainedX;
        vectorB.y = constrainedY;
    }
    
    draw2DCanvas();
    update2DInfo();
    update3DVectors();
}

function onCanvasMouseUp() {
    dragging = null;
}

function draw2DCanvas() {
    if (!ctx2d) return;
    
    const centerX = canvas2d.width / 2;
    const centerY = canvas2d.height / 2;
    
    // Clear canvas
    ctx2d.clearRect(0, 0, canvas2d.width, canvas2d.height);
    
    // Draw grid
    ctx2d.strokeStyle = '#EEEEEE';
    ctx2d.lineWidth = 1;
    for (let i = 0; i <= canvas2d.width; i += 50) {
        ctx2d.beginPath();
        ctx2d.moveTo(i, 0);
        ctx2d.lineTo(i, canvas2d.height);
        ctx2d.stroke();
    }
    for (let i = 0; i <= canvas2d.height; i += 50) {
        ctx2d.beginPath();
        ctx2d.moveTo(0, i);
        ctx2d.lineTo(canvas2d.width, i);
        ctx2d.stroke();
    }
    
    // Draw axes
    ctx2d.strokeStyle = '#CCCCCC';
    ctx2d.lineWidth = 2;
    ctx2d.beginPath();
    ctx2d.moveTo(centerX, 0);
    ctx2d.lineTo(centerX, canvas2d.height);
    ctx2d.moveTo(0, centerY);
    ctx2d.lineTo(canvas2d.width, centerY);
    ctx2d.stroke();
    
    // Draw Vector A (green)
    ctx2d.strokeStyle = '#00CC66';
    ctx2d.fillStyle = '#00CC66';
    ctx2d.lineWidth = 3;
    drawArrow(ctx2d, centerX, centerY, vectorA.x, vectorA.y, '#00CC66');
    
    // Draw Vector B (black)
    drawArrow(ctx2d, centerX, centerY, vectorB.x, vectorB.y, '#000000');
    
    // Draw angle arc
    drawAngleArc(ctx2d, centerX, centerY);
}

function drawArrow(ctx, fromX, fromY, toX, toY, color) {
    const headlen = 15;
    const angle = Math.atan2(toY - fromY, toX - fromX);
    
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3;
    
    // Line
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    
    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
    
    // Endpoint circle
    ctx.beginPath();
    ctx.arc(toX, toY, 8, 0, Math.PI * 2);
    ctx.fill();
}

function drawAngleArc(ctx, centerX, centerY) {
    const ax = vectorA.x - centerX;
    const ay = vectorA.y - centerY;
    const bx = vectorB.x - centerX;
    const by = vectorB.y - centerY;
    
    const angleA = Math.atan2(ay, ax);
    const angleB = Math.atan2(by, bx);
    
    const radius = 50;
    
    ctx.strokeStyle = '#00CC66';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, angleA, angleB, angleA > angleB);
    ctx.stroke();
}

function update2DInfo() {
    const centerX = canvas2d.width / 2;
    const centerY = canvas2d.height / 2;
    
    // Convert to mathematical coordinates (origin at center, y-up)
    const ax = vectorA.x - centerX;
    const ay = centerY - vectorA.y;
    const bx = vectorB.x - centerX;
    const by = centerY - vectorB.y;
    
    // Update vector displays
    document.getElementById('vectorA').textContent = `[${ax.toFixed(1)}, ${ay.toFixed(1)}]`;
    document.getElementById('vectorB').textContent = `[${bx.toFixed(1)}, ${by.toFixed(1)}]`;
    
    // Calculate metrics
    const dotProduct = ax * bx + ay * by;
    const magA = Math.sqrt(ax * ax + ay * ay);
    const magB = Math.sqrt(bx * bx + by * by);
    
    let cosineSim = 0;
    let angle = 0;
    
    if (magA > 0 && magB > 0) {
        cosineSim = dotProduct / (magA * magB);
        // Clamp to [-1, 1] to avoid Math.acos errors
        cosineSim = Math.max(-1, Math.min(1, cosineSim));
        angle = Math.acos(cosineSim) * 180 / Math.PI;
    }
    
    const euclidean = Math.sqrt((ax - bx) * (ax - bx) + (ay - by) * (ay - by));
    
    // Update displays
    document.getElementById('angle').textContent = `${angle.toFixed(2)}°`;
    document.getElementById('cosineSim').textContent = cosineSim.toFixed(4);
    document.getElementById('euclidean').textContent = euclidean.toFixed(2);
}

function init3DCanvas() {
    const container = document.getElementById('canvas3d');
    if (!container || typeof THREE === 'undefined') return;
    
    // Scene
    scene3d = new THREE.Scene();
    scene3d.background = new THREE.Color(0xFAFAFA);
    
    // Camera
    camera3d = new THREE.PerspectiveCamera(75, container.offsetWidth / 500, 0.1, 1000);
    camera3d.position.set(5, 5, 5);
    camera3d.lookAt(0, 0, 0);
    
    // Renderer
    renderer3d = new THREE.WebGLRenderer({ antialias: true });
    renderer3d.setSize(container.offsetWidth, 500);
    container.appendChild(renderer3d.domElement);
    
    // Axes helper
    const axesHelper = new THREE.AxesHelper(5);
    scene3d.add(axesHelper);
    
    // Grid
    const gridHelper = new THREE.GridHelper(10, 10, 0xCCCCCC, 0xEEEEEE);
    scene3d.add(gridHelper);
    
    // Vector A (green)
    const dirA = new THREE.Vector3(3, 2, 1).normalize();
    vectorA3d = new THREE.ArrowHelper(dirA, new THREE.Vector3(0, 0, 0), 4, 0x00CC66, 0.5, 0.3);
    scene3d.add(vectorA3d);
    
    // Vector B (black)
    const dirB = new THREE.Vector3(2, 3, 0.5).normalize();
    vectorB3d = new THREE.ArrowHelper(dirB, new THREE.Vector3(0, 0, 0), 4, 0x000000, 0.5, 0.3);
    scene3d.add(vectorB3d);
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.6);
    scene3d.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.4);
    directionalLight.position.set(5, 10, 5);
    scene3d.add(directionalLight);
    
    // Animation loop
    function animate3D() {
        requestAnimationFrame(animate3D);
        
        // Slow rotation
        camera3d.position.x = 5 * Math.cos(Date.now() * 0.0001);
        camera3d.position.z = 5 * Math.sin(Date.now() * 0.0001);
        camera3d.lookAt(0, 0, 0);
        
        renderer3d.render(scene3d, camera3d);
    }
    animate3D();
    
    // Reset button
    const resetBtn = document.getElementById('reset3d');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            camera3d.position.set(5, 5, 5);
            camera3d.lookAt(0, 0, 0);
        });
    }
}

function update3DVectors() {
    if (!vectorA3d || !vectorB3d) return;
    
    const centerX = canvas2d.width / 2;
    const centerY = canvas2d.height / 2;
    
    const ax = (vectorA.x - centerX) / 50;
    const ay = (centerY - vectorA.y) / 50;
    const bx = (vectorB.x - centerX) / 50;
    const by = (centerY - vectorB.y) / 50;
    
    const dirA = new THREE.Vector3(ax, ay, 0.5).normalize();
    const dirB = new THREE.Vector3(bx, by, 0.5).normalize();
    
    vectorA3d.setDirection(dirA);
    vectorB3d.setDirection(dirB);
}

// ============================================================================
// MÓDULO 2: MATEMÁTICA DESDE CERO
// ============================================================================

function initModule2_Math() {
    const calculateBtn = document.getElementById('calculate');
    if (!calculateBtn) return;
    
    calculateBtn.addEventListener('click', async () => {
        const vecAInput = document.getElementById('vecA').value;
        const vecBInput = document.getElementById('vecB').value;
        
        // Parse vectors
        const vecA = vecAInput.split(',').map(v => parseFloat(v.trim()));
        const vecB = vecBInput.split(',').map(v => parseFloat(v.trim()));
        
        if (vecA.some(isNaN) || vecB.some(isNaN)) {
            alert('Por favor ingresa vectores válidos (números separados por comas)');
            return;
        }
        
        if (vecA.length !== vecB.length) {
            alert('Los vectores deben tener la misma dimensión');
            return;
        }
        
        // Call API
        try {
            const response = await fetch(`${API_BASE_URL}/api/cosine`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vector_a: vecA, vector_b: vecB })
            });
            
            const result = await response.json();
            displayCalculationSteps(result);
        } catch (error) {
            console.error('Error calculating:', error);
            alert('Error al calcular. Por favor intenta de nuevo.');
        }
    });
}

function displayCalculationSteps(result) {
    const stepsDiv = document.getElementById('steps');
    if (!stepsDiv) return;
    
    stepsDiv.innerHTML = `
        <div class="step">
            <strong>Paso 1: Producto Punto</strong>
            <p>${result.steps.step1}</p>
            <code>A · B = ${result.dot_product.toFixed(4)}</code>
        </div>
        <div class="step">
            <strong>Paso 2: Magnitudes</strong>
            <p>${result.steps.step2}</p>
            <code>||A|| = ${result.magnitude_a.toFixed(4)}, ||B|| = ${result.magnitude_b.toFixed(4)}</code>
        </div>
        <div class="step">
            <strong>Paso 3: Similitud Coseno</strong>
            <p>${result.steps.step3}</p>
            <code>cos(θ) = ${result.cosine_similarity.toFixed(4)}</code>
        </div>
        <div class="step">
            <strong>Paso 4: Ángulo</strong>
            <p>${result.steps.step4}</p>
            <code>θ = ${result.angle_degrees.toFixed(2)}° (${result.angle_radians.toFixed(4)} radianes)</code>
        </div>
        <div class="step highlight">
            <strong>Resultado Final</strong>
            <p>Similitud Coseno: <span style="font-size: 1.5em; color: #00CC66;">${result.cosine_similarity.toFixed(4)}</span></p>
            <p>Ángulo: <span style="font-size: 1.5em; color: #00CC66;">${result.angle_degrees.toFixed(2)}°</span></p>
        </div>
    `;
}

// ============================================================================
// MÓDULO 3: TEXTO → VECTORES
// ============================================================================

function initModule3_TextVectors() {
    const bowBtn = document.getElementById('analyzeBow');
    const tfidfBtn = document.getElementById('analyzeTfidf');
    const compareBtn = document.getElementById('compareMethod');
    
    if (bowBtn) bowBtn.addEventListener('click', analyzeBow);
    if (tfidfBtn) tfidfBtn.addEventListener('click', analyzeTfidf);
    if (compareBtn) compareBtn.addEventListener('click', compareMethods);
}

async function analyzeBow() {
    const documents = getDocuments();
    if (!documents) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/bow`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ documents })
        });
        
        const result = await response.json();
        displayVectorResults('Bag-of-Words', result);
        drawHeatmap(result.similarity_matrix);
    } catch (error) {
        console.error('Error:', error);
        alert('Error al analizar. Por favor intenta de nuevo.');
    }
}

async function analyzeTfidf() {
    const documents = getDocuments();
    if (!documents) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/tfidf`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ documents })
        });
        
        const result = await response.json();
        displayVectorResults('TF-IDF', result);
        drawHeatmap(result.similarity_matrix);
    } catch (error) {
        console.error('Error:', error);
        alert('Error al analizar. Por favor intenta de nuevo.');
    }
}

async function compareMethods() {
    const documents = getDocuments();
    if (!documents) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/compare_methods`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ documents })
        });
        
        const result = await response.json();
        displayComparison(result);
    } catch (error) {
        console.error('Error:', error);
        alert('Error al comparar. Por favor intenta de nuevo.');
    }
}

function getDocuments() {
    const doc1 = document.getElementById('doc1').value.trim();
    const doc2 = document.getElementById('doc2').value.trim();
    const doc3 = document.getElementById('doc3').value.trim();
    
    const documents = [doc1, doc2, doc3].filter(d => d.length > 0);
    
    if (documents.length < 2) {
        alert('Por favor ingresa al menos 2 documentos');
        return null;
    }
    
    return documents;
}

function displayVectorResults(method, result) {
    const resultsDiv = document.getElementById('vectorResults');
    if (!resultsDiv) return;
    
    let html = `<h4>Resultados: ${method}</h4>`;
    html += `<p>Vocabulario (${result.vocab_size} palabras): ${result.vocabulary.join(', ')}</p>`;
    html += `<h5>Vectores:</h5><pre>`;
    
    const vectors = result.tfidf_vectors || result.vectors;
    vectors.forEach((vec, i) => {
        html += `Doc ${i + 1}: [${vec.map(v => v.toFixed(3)).join(', ')}]\n`;
    });
    
    html += `</pre>`;
    resultsDiv.innerHTML = html;
}

function drawHeatmap(matrix) {
    const canvas = document.getElementById('heatmap');
    if (!canvas || !matrix || matrix.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    const size = matrix.length;
    const cellSize = canvas.width / size;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const value = matrix[i][j];
            
            // Color interpolation: white (0) to green (1)
            const green = Math.floor(204 * value + 51);
            const red = Math.floor(255 * (1 - value));
            const blue = Math.floor(255 * (1 - value));
            
            ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
            ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
            
            // Draw border
            ctx.strokeStyle = '#000000';
            ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
            
            // Draw value
            ctx.fillStyle = value > 0.5 ? '#FFFFFF' : '#000000';
            ctx.font = '16px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(value.toFixed(2), j * cellSize + cellSize / 2, i * cellSize + cellSize / 2);
        }
    }
    
    // Labels
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px sans-serif';
    for (let i = 0; i < size; i++) {
        ctx.fillText(`D${i + 1}`, -20, i * cellSize + cellSize / 2);
        ctx.fillText(`D${i + 1}`, i * cellSize + cellSize / 2, -10);
    }
}

function displayComparison(result) {
    const compDiv = document.getElementById('comparisonResults');
    if (!compDiv) return;
    
    let html = `<h3>Comparación: BoW vs TF-IDF</h3>`;
    html += `<div class="comparison-grid">`;
    
    // BoW side
    html += `<div class="method-result">`;
    html += `<h4>Bag-of-Words</h4>`;
    html += `<p>Vectores simples basados en conteo de palabras</p>`;
    html += `<p>Vocabulario: ${result.vocab_size} palabras</p>`;
    html += `<h5>Matriz de Similitudes:</h5>`;
    html += `<pre>${matrixToString(result.bow.similarity_matrix)}</pre>`;
    html += `</div>`;
    
    // TF-IDF side
    html += `<div class="method-result">`;
    html += `<h4>TF-IDF</h4>`;
    html += `<p>Pesos ajustados por frecuencia en corpus</p>`;
    html += `<p>Vocabulario: ${result.vocab_size} palabras</p>`;
    html += `<h5>Matriz de Similitudes:</h5>`;
    html += `<pre>${matrixToString(result.tfidf.similarity_matrix)}</pre>`;
    html += `</div>`;
    
    html += `</div>`;
    
    html += `<div style="margin-top: 1rem; padding: 1rem; background: #E6FFE6; border: 2px solid #00CC66;">`;
    html += `<strong>Observación:</strong> TF-IDF tiende a dar menos peso a palabras muy comunes, `;
    html += `capturando mejor la importancia relativa de cada término.`;
    html += `</div>`;
    
    compDiv.innerHTML = html;
}

function matrixToString(matrix) {
    return matrix.map(row => 
        row.map(val => val.toFixed(3)).join('  ')
    ).join('\n');
}

// ============================================================================
// MÓDULO 4: EMBEDDINGS SEMÁNTICOS
// ============================================================================

function initModule4_Embeddings() {
    drawEmbeddingMap();
    
    const analogyBtn = document.getElementById('calculateAnalogy');
    if (analogyBtn) {
        analogyBtn.addEventListener('click', () => {
            const a = document.getElementById('analogyA').value;
            const b = document.getElementById('analogyB').value;
            const c = document.getElementById('analogyC').value;
            
            const resultDiv = document.getElementById('analogyResult');
            resultDiv.innerHTML = `
                <p><strong>Analogía:</strong> ${a} - ${b} + ${c} = ?</p>
                <p>En embeddings reales, esto encontraría la palabra más cercana al vector resultante.</p>
                <p>Ejemplos famosos:</p>
                <ul>
                    <li>rey - hombre + mujer ≈ reina</li>
                    <li>Madrid - España + Francia ≈ París</li>
                    <li>grande - más grande + pequeño ≈ más pequeño</li>
                </ul>
                <p style="color: #00CC66; font-weight: bold;">
                    Esto demuestra que los embeddings capturan relaciones semánticas en el espacio vectorial.
                </p>
            `;
        });
    }
}

function drawEmbeddingMap() {
    const canvas = document.getElementById('embeddingMap');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Simulated word embeddings in 2D (t-SNE projection simulation)
    const words = [
        { word: 'rey', x: 100, y: 100, cluster: 'royalty' },
        { word: 'reina', x: 120, y: 110, cluster: 'royalty' },
        { word: 'príncipe', x: 90, y: 120, cluster: 'royalty' },
        { word: 'hombre', x: 300, y: 100, cluster: 'gender' },
        { word: 'mujer', x: 320, y: 110, cluster: 'gender' },
        { word: 'perro', x: 150, y: 300, cluster: 'animals' },
        { word: 'gato', x: 170, y: 310, cluster: 'animals' },
        { word: 'mascota', x: 160, y: 330, cluster: 'animals' },
        { word: 'comer', x: 400, y: 200, cluster: 'actions' },
        { word: 'dormir', x: 420, y: 210, cluster: 'actions' },
        { word: 'jugar', x: 410, y: 230, cluster: 'actions' }
    ];
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.fillStyle = '#FAFAFA';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw connections between related words
    ctx.strokeStyle = '#CCCCCC';
    ctx.lineWidth = 1;
    for (let i = 0; i < words.length; i++) {
        for (let j = i + 1; j < words.length; j++) {
            if (words[i].cluster === words[j].cluster) {
                ctx.beginPath();
                ctx.moveTo(words[i].x, words[i].y);
                ctx.lineTo(words[j].x, words[j].y);
                ctx.stroke();
            }
        }
    }
    
    // Draw words
    words.forEach(item => {
        // Circle
        ctx.fillStyle = '#00CC66';
        ctx.beginPath();
        ctx.arc(item.x, item.y, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Text
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.word, item.x, item.y - 10);
    });
    
    // Legend
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Palabras cercanas en el espacio tienen significados relacionados', 10, canvas.height - 10);
}

// ============================================================================
// MÓDULO 5: CONEXIÓN CON LLMs
// ============================================================================

function initModule5_LLMs() {
    const searchBtn = document.getElementById('searchRag');
    if (!searchBtn) return;
    
    searchBtn.addEventListener('click', () => {
        const query = document.getElementById('ragQuery').value;
        
        if (!query.trim()) {
            alert('Por favor ingresa una consulta');
            return;
        }
        
        const resultsDiv = document.getElementById('ragResults');
        resultsDiv.innerHTML = `
            <div class="rag-step">
                <strong>Paso 1: Query → Vector</strong>
                <p>Tu pregunta: "${query}"</p>
                <p>Se convierte en un vector de embeddings (ej: dimensiones variables según el modelo)</p>
                <code style="background: #000; color: #00CC66; padding: 0.5rem; display: block; margin-top: 0.5rem;">
                query_vector = embed("${query}") → [0.234, -0.891, 0.432, ...]
                </code>
            </div>
            <div class="rag-step">
                <strong>Paso 2: Calcular Similitud</strong>
                <p>Se compara tu query con TODOS los documentos de la base de datos</p>
                <code style="background: #000; color: #00CC66; padding: 0.5rem; display: block; margin-top: 0.5rem;">
                for doc in database:
                    similarity = cosine_similarity(query_vector, doc.vector)
                </code>
            </div>
            <div class="rag-step">
                <strong>Paso 3: Recuperar Más Relevantes</strong>
                <p>Los documentos con mayor similitud coseno se seleccionan (típicamente top-5 o top-10)</p>
                <p>Ejemplo de resultados:</p>
                <ul style="margin-top: 0.5rem;">
                    <li>Doc 287: similitud = 0.94</li>
                    <li>Doc 1042: similitud = 0.89</li>
                    <li>Doc 523: similitud = 0.85</li>
                </ul>
            </div>
            <div class="rag-step">
                <strong>Paso 4: Generar Respuesta</strong>
                <p>El LLM recibe tu pregunta + los documentos relevantes como contexto</p>
                <p>Genera una respuesta informada basada en esa información específica</p>
                <code style="background: #000; color: #00CC66; padding: 0.5rem; display: block; margin-top: 0.5rem;">
                prompt = f"Contexto: {top_docs}\\n\\nPregunta: {query}\\n\\nRespuesta:"
                response = llm.generate(prompt)
                </code>
            </div>
            <div style="margin-top: 1rem; padding: 1rem; background: #E6FFE6; border: 2px solid #00CC66;">
                <strong>🎯 Clave:</strong> La similitud coseno permite encontrar información relevante 
                por <em>significado</em>, no solo por coincidencia de palabras. Esto es lo que hace 
                que Claude, GPT y otros LLMs sean tan efectivos en encontrar y usar información relevante.
            </div>
        `;
    });
}
