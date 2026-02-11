# La Elegancia del Coseno

Proyecto educativo interactivo que enseña la similitud del coseno desde sus fundamentos matemáticos hasta su aplicación en LLMs modernos.

## 🎯 Propuesta de Valor

- **Geometría visual (2D/3D) antes de álgebra** - Entender el concepto visualmente
- **Implementación desde axiomas** - NumPy puro, sin black boxes
- **Historia + matemática + práctica** - Todo en una experiencia integrada
- **Zero dependencias pesadas** - No sklearn, no PyTorch

## 📚 Módulos

### Módulo 1: Geometría Intuitiva
Entender el concepto visualmente antes de las ecuaciones
- Canvas 2D interactivo (arrastrar vectores, ver ángulo θ)
- Visualización 3D rotable (Three.js)
- Comparación visual: ángulo vs distancia euclidiana

**💡 El ángulo importa más que la distancia**

### Módulo 2: Matemática desde Cero
Construcción paso a paso de la fórmula
- Implementación Python transparente (cada operación explicada)
- Calculadora interactiva paso a paso
- Visualización de cada término: producto punto, normas, división

**💡 cos(θ) = (A·B) / (||A|| ||B||) funciona en cualquier dimensión**

### Módulo 3: Texto → Vectores
Del lenguaje natural a la geometría
- Bag-of-Words manual
- TF-IDF desde cero
- Heatmap de similitudes entre documentos
- Comparador BoW vs TF-IDF

**💡 Las palabras son coordenadas en un espacio**

### Módulo 4: Embeddings Semánticos
El salto de contar palabras a capturar significado
- Mapa 2D de embeddings (simulación de proyección t-SNE)
- Calculadora de analogías: "rey - hombre + mujer = ?"
- Comparador: BoW (12 dims) vs Word2Vec (300 dims) vs GPT (12k dims)

**💡 Más dimensiones = más matices de significado**

### Módulo 5: Conexión con LLMs
Cómo Claude/GPT usan esto ahora mismo
- Búsqueda semántica simulada (RAG simplificado)
- Visualización de "query → retrieve por similitud"
- Timeline histórico: Euclides → Salton → Transformers

**💡 La misma geometría de 300 AC funciona en 2024**

## 🛠️ Instalación

```bash
# Clonar el repositorio
git clone https://github.com/montesquieu891/La-Elegancia-del-Coseno.git
cd La-Elegancia-del-Coseno

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar la aplicación
python app.py
```

Luego abre tu navegador en `http://localhost:5000`

## 🎨 Stack Tecnológico

### Backend
- **Python 3.x** - Lenguaje principal
- **Flask 3.0.0** - API REST simple
- **NumPy 1.24.0** - Álgebra lineal pura
- **Gensim 4.3.0** - Para cargar embeddings preentrenados (opcional)
- **Flask-CORS 4.0.0** - CORS para frontend

### Frontend
- **HTML5** - Estructura semántica
- **CSS Vanilla** - Sin frameworks
- **JavaScript Vanilla** - Interactividad pura
- **Three.js** - Visualización 3D
- **Canvas API** - Gráficos 2D

### Diseño
- Paleta: `#FFFFFF` (fondo), `#000000` (texto), `#00CC66` (acentos)
- Tipografía: System fonts (sin cargas externas)

## 🚀 Características

- ✅ Implementación completa de similitud coseno desde cero
- ✅ Visualizaciones interactivas 2D y 3D
- ✅ Calculadora paso a paso con explicaciones
- ✅ Bag-of-Words y TF-IDF implementados manualmente
- ✅ Comparación de métodos de vectorización
- ✅ Mapas de similitud (heatmaps)
- ✅ Demostración de RAG (Retrieval-Augmented Generation)
- ✅ Timeline histórico de la evolución del concepto
- ✅ 100% educativo y transparente

## 📖 API Endpoints

- `POST /api/cosine` - Calcular similitud coseno entre dos vectores
- `POST /api/bow` - Generar vectores Bag-of-Words
- `POST /api/tfidf` - Generar vectores TF-IDF
- `POST /api/compare_methods` - Comparar BoW vs TF-IDF
- `POST /api/euclidean_distance` - Calcular distancia euclidiana

## 🎓 Uso Educativo

Este proyecto está diseñado para:
- Estudiantes de ciencias de la computación
- Desarrolladores aprendiendo sobre NLP y LLMs
- Educadores enseñando conceptos de ML
- Cualquiera curioso sobre cómo funcionan los embeddings

## 📝 Licencia

Este proyecto es de código abierto y está disponible para fines educativos.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

**La Elegancia del Coseno** - Donde la geometría euclidiana se encuentra con los LLMs modernos 🎯