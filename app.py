"""
La Elegancia del Coseno - Backend API
Educational project for teaching cosine similarity
"""

from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import numpy as np
import math
from collections import Counter
import json
import os

# Configure Flask to serve static files correctly
app = Flask(__name__, 
            static_folder='static',
            static_url_path='')
CORS(app)

# ============================================================================
# MÓDULO 2: Matemática desde Cero - Cosine Similarity Implementation
# ============================================================================

def cosine_similarity_detailed(vec_a, vec_b):
    """
    Calculate cosine similarity with step-by-step breakdown
    Returns detailed computation steps for educational purposes
    """
    vec_a = np.array(vec_a, dtype=float)
    vec_b = np.array(vec_b, dtype=float)
    
    # Step 1: Dot product
    dot_product = np.dot(vec_a, vec_b)
    
    # Step 2: Magnitudes
    magnitude_a = np.sqrt(np.sum(vec_a ** 2))
    magnitude_b = np.sqrt(np.sum(vec_b ** 2))
    
    # Step 3: Cosine similarity
    if magnitude_a == 0 or magnitude_b == 0:
        similarity = 0.0
    else:
        similarity = dot_product / (magnitude_a * magnitude_b)
    
    # Step 4: Angle in degrees
    angle_rad = math.acos(max(-1.0, min(1.0, similarity)))
    angle_deg = math.degrees(angle_rad)
    
    return {
        'dot_product': float(dot_product),
        'magnitude_a': float(magnitude_a),
        'magnitude_b': float(magnitude_b),
        'cosine_similarity': float(similarity),
        'angle_radians': float(angle_rad),
        'angle_degrees': float(angle_deg),
        'steps': {
            'step1': f'A · B = {dot_product:.4f}',
            'step2': f'||A|| = {magnitude_a:.4f}, ||B|| = {magnitude_b:.4f}',
            'step3': f'cos(θ) = {dot_product:.4f} / ({magnitude_a:.4f} × {magnitude_b:.4f}) = {similarity:.4f}',
            'step4': f'θ = {angle_deg:.2f}°'
        }
    }

# ============================================================================
# MÓDULO 3: Texto → Vectores - Bag of Words & TF-IDF
# ============================================================================

def simple_tokenize(text):
    """Simple tokenization for educational purposes"""
    return text.lower().replace(',', '').replace('.', '').split()

def bag_of_words(documents):
    """
    Manual Bag-of-Words implementation
    Returns vocabulary and document vectors
    """
    # Build vocabulary
    all_words = []
    for doc in documents:
        all_words.extend(simple_tokenize(doc))
    
    vocab = sorted(set(all_words))
    vocab_index = {word: i for i, word in enumerate(vocab)}
    
    # Create vectors
    vectors = []
    for doc in documents:
        words = simple_tokenize(doc)
        vector = [0] * len(vocab)
        for word in words:
            if word in vocab_index:
                vector[vocab_index[word]] += 1
        vectors.append(vector)
    
    return {
        'vocabulary': vocab,
        'vectors': vectors,
        'vocab_size': len(vocab)
    }

def tf_idf(documents):
    """
    Manual TF-IDF implementation from scratch
    """
    # Step 1: Tokenize
    tokenized_docs = [simple_tokenize(doc) for doc in documents]
    
    # Step 2: Build vocabulary
    all_words = []
    for words in tokenized_docs:
        all_words.extend(words)
    vocab = sorted(set(all_words))
    vocab_index = {word: i for i, word in enumerate(vocab)}
    
    # Step 3: Calculate TF (Term Frequency)
    tf_vectors = []
    for words in tokenized_docs:
        word_counts = Counter(words)
        total_words = len(words)
        tf_vector = [0.0] * len(vocab)
        for word, count in word_counts.items():
            if word in vocab_index:
                tf_vector[vocab_index[word]] = count / total_words
        tf_vectors.append(tf_vector)
    
    # Step 4: Calculate IDF (Inverse Document Frequency)
    num_docs = len(documents)
    idf_vector = [0.0] * len(vocab)
    
    for i, word in enumerate(vocab):
        # Count documents containing this word
        doc_count = sum(1 for words in tokenized_docs if word in words)
        # IDF formula: log(N / df)
        idf_vector[i] = math.log(num_docs / doc_count) if doc_count > 0 else 0
    
    # Step 5: Calculate TF-IDF
    tfidf_vectors = []
    for tf_vector in tf_vectors:
        tfidf_vector = [tf * idf for tf, idf in zip(tf_vector, idf_vector)]
        tfidf_vectors.append(tfidf_vector)
    
    return {
        'vocabulary': vocab,
        'tf_vectors': tf_vectors,
        'idf_vector': idf_vector,
        'tfidf_vectors': tfidf_vectors,
        'vocab_size': len(vocab)
    }

def calculate_similarity_matrix(vectors):
    """Calculate pairwise cosine similarities"""
    n = len(vectors)
    matrix = [[0.0] * n for _ in range(n)]
    
    for i in range(n):
        for j in range(n):
            if i == j:
                matrix[i][j] = 1.0
            else:
                result = cosine_similarity_detailed(vectors[i], vectors[j])
                matrix[i][j] = result['cosine_similarity']
    
    return matrix

# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.route('/')
def index():
    """Serve the main HTML page"""
    return send_file('static/index.html')

@app.route('/<path:path>')
def serve_static(path):
    """Serve static files"""
    return send_file(os.path.join('static', path))

@app.route('/api/cosine', methods=['POST'])
def calculate_cosine():
    """
    Calculate cosine similarity between two vectors
    Input: {"vector_a": [x1, y1, ...], "vector_b": [x2, y2, ...]}
    """
    data = request.json
    vec_a = data.get('vector_a', [])
    vec_b = data.get('vector_b', [])
    
    if not vec_a or not vec_b:
        return jsonify({'error': 'Both vectors are required'}), 400
    
    if len(vec_a) != len(vec_b):
        return jsonify({'error': 'Vectors must have same dimensions'}), 400
    
    result = cosine_similarity_detailed(vec_a, vec_b)
    return jsonify(result)

@app.route('/api/bow', methods=['POST'])
def calculate_bow():
    """
    Calculate Bag-of-Words vectors for documents
    Input: {"documents": ["text1", "text2", ...]}
    """
    data = request.json
    documents = data.get('documents', [])
    
    if not documents:
        return jsonify({'error': 'Documents are required'}), 400
    
    result = bag_of_words(documents)
    
    # Calculate similarity matrix
    similarity_matrix = calculate_similarity_matrix(result['vectors'])
    result['similarity_matrix'] = similarity_matrix
    
    return jsonify(result)

@app.route('/api/tfidf', methods=['POST'])
def calculate_tfidf():
    """
    Calculate TF-IDF vectors for documents
    Input: {"documents": ["text1", "text2", ...]}
    """
    data = request.json
    documents = data.get('documents', [])
    
    if not documents:
        return jsonify({'error': 'Documents are required'}), 400
    
    result = tf_idf(documents)
    
    # Calculate similarity matrix
    similarity_matrix = calculate_similarity_matrix(result['tfidf_vectors'])
    result['similarity_matrix'] = similarity_matrix
    
    return jsonify(result)

@app.route('/api/compare_methods', methods=['POST'])
def compare_methods():
    """
    Compare BoW vs TF-IDF for the same documents
    Input: {"documents": ["text1", "text2", ...]}
    """
    data = request.json
    documents = data.get('documents', [])
    
    if not documents:
        return jsonify({'error': 'Documents are required'}), 400
    
    bow_result = bag_of_words(documents)
    tfidf_result = tf_idf(documents)
    
    bow_similarity = calculate_similarity_matrix(bow_result['vectors'])
    tfidf_similarity = calculate_similarity_matrix(tfidf_result['tfidf_vectors'])
    
    return jsonify({
        'bow': {
            'vectors': bow_result['vectors'],
            'similarity_matrix': bow_similarity,
            'vocab_size': bow_result['vocab_size']
        },
        'tfidf': {
            'vectors': tfidf_result['tfidf_vectors'],
            'similarity_matrix': tfidf_similarity,
            'vocab_size': tfidf_result['vocab_size']
        },
        'vocabulary': bow_result['vocabulary']
    })

@app.route('/api/euclidean_distance', methods=['POST'])
def calculate_euclidean():
    """
    Calculate Euclidean distance between two vectors for comparison
    Input: {"vector_a": [x1, y1], "vector_b": [x2, y2]}
    """
    data = request.json
    vec_a = np.array(data.get('vector_a', []), dtype=float)
    vec_b = np.array(data.get('vector_b', []), dtype=float)
    
    if len(vec_a) != len(vec_b):
        return jsonify({'error': 'Vectors must have same dimensions'}), 400
    
    distance = np.sqrt(np.sum((vec_a - vec_b) ** 2))
    
    return jsonify({
        'euclidean_distance': float(distance),
        'vector_a': vec_a.tolist(),
        'vector_b': vec_b.tolist()
    })

if __name__ == '__main__':
    # Note: Set debug=False in production
    app.run(debug=True, host='0.0.0.0', port=5000)
