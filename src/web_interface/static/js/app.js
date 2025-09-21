// Mechanical Engineering AI System - Frontend JavaScript

class MechEngAI {
    constructor() {
        this.baseUrl = '/api';
        this.currentComponents = [];
        this.currentQuiz = [];
        this.simulationChart = null;
        
        this.initializeEventListeners();
        this.checkSystemHealth();
    }

    initializeEventListeners() {
        // Image upload handling
        const imageInput = document.getElementById('imageInput');
        const uploadArea = document.getElementById('uploadArea');

        if (imageInput) {
            imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        }

        if (uploadArea) {
            uploadArea.addEventListener('click', () => imageInput.click());
            uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
            uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        }

        // Button event listeners
        this.bindButtonEvents();
        
        // Smooth scrolling for navigation
        this.initializeSmoothScrolling();
    }

    bindButtonEvents() {
        const buttons = {
            'generate3DBtn': () => this.generate3DModel(),
            'generateDrawingBtn': () => this.generateDrawing(),
            'runSimulationBtn': () => this.runSimulation(),
            'generateQuizBtn': () => this.generateQuiz(),
            'submitQuizBtn': () => this.submitQuiz(),
            'runDiagnosisBtn': () => this.runDiagnosis(),
            'downloadDrawingBtn': () => this.downloadDrawing(),
            'exportCADBtn': () => this.exportToCAD()
        };

        Object.entries(buttons).forEach(([id, handler]) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('click', handler);
            }
        });
    }

    initializeSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    async checkSystemHealth() {
        try {
            const response = await fetch(`${this.baseUrl}/health`);
            const data = await response.json();
            
            if (data.status === 'healthy') {
                console.log('System is healthy:', data);
            } else {
                this.showError('System health check failed');
            }
        } catch (error) {
            console.error('Health check failed:', error);
        }
    }

    // Image Upload and Processing
    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        document.getElementById('uploadArea').classList.add('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        document.getElementById('uploadArea').classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processImageFile(files[0]);
        }
    }

    handleImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            this.processImageFile(file);
        }
    }

    processImageFile(file) {
        if (!file.type.startsWith('image/')) {
            this.showError('Please select a valid image file');
            return;
        }

        // Show image preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('imagePreview');
            const previewImg = document.getElementById('previewImg');
            
            previewImg.src = e.target.result;
            preview.style.display = 'block';
            
            // Recognize components
            this.recognizeComponents(file);
        };
        
        reader.readAsDataURL(file);
    }

    async recognizeComponents(file) {
        this.showLoading('Analyzing image...', 'Detecting mechanical components');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${this.baseUrl}/recognize`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.currentComponents = data.components;
            this.displayRecognitionResults(data.components);

        } catch (error) {
            console.error('Recognition error:', error);
            this.showError('Failed to recognize components: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    displayRecognitionResults(components) {
        const resultsPanel = document.getElementById('recognitionResults');
        const componentsList = document.getElementById('componentsList');
        
        componentsList.innerHTML = '';

        if (components.length === 0) {
            componentsList.innerHTML = '<p class="text-muted">No components detected in the image.</p>';
        } else {
            components.forEach((component, index) => {
                const componentDiv = document.createElement('div');
                componentDiv.className = 'component-item fade-in';
                
                componentDiv.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <div class="component-type">${component.component_type.replace('_', ' ')}</div>
                            <small class="text-muted">Function: ${component.function_category.replace('_', ' ')}</small>
                        </div>
                        <span class="badge bg-primary confidence-badge">
                            ${Math.round(component.confidence * 100)}% confidence
                        </span>
                    </div>
                    <div class="mt-2">
                        <small>Properties: ${Object.keys(component.properties).length} detected</small>
                    </div>
                `;
                
                componentsList.appendChild(componentDiv);
            });

            document.getElementById('generate3DBtn').disabled = false;
        }

        resultsPanel.style.display = 'block';
    }

    // 3D Modeling Functions
    async generate3DModel() {
        if (this.currentComponents.length === 0) {
            this.showError('No components available for 3D modeling');
            return;
        }

        this.showLoading('Generating 3D model...', 'Creating mesh geometry');

        try {
            const component = this.currentComponents[0]; // Use first component
            
            const response = await fetch(`${this.baseUrl}/generate_3d_model`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(component)
            });

            const data = await response.json();
            
            if (data.model_generated) {
                this.showSuccess(`3D model generated successfully!<br>
                                Volume: ${data.volume.toFixed(2)} mm³<br>
                                Surface Area: ${data.surface_area.toFixed(2)} mm²`);
                
                // Enable drawing generation
                document.getElementById('componentType').value = component.component_type;
            } else {
                this.showError('Failed to generate 3D model');
            }

        } catch (error) {
            this.showError('3D modeling error: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    async generateDrawing() {
        const componentType = document.getElementById('componentType').value;
        const drawingType = document.getElementById('drawingType').value;

        if (!componentType) {
            this.showError('Please select a component type');
            return;
        }

        this.showLoading('Generating technical drawing...', 'Creating ' + drawingType + ' view');

        try {
            // Create dummy component data for drawing generation
            const componentData = {
                component_type: componentType,
                function_category: 'power_transmission',
                confidence: 0.9,
                bounding_box: [0, 0, 100, 100],
                properties: {
                    estimated_diameter: 50,
                    tooth_count: 20
                }
            };

            const response = await fetch(`${this.baseUrl}/generate_isometric`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(componentData)
            });

            const data = await response.json();
            
            if (data.drawing_generated) {
                this.displayDrawingResults(data);
            } else {
                this.showError('Failed to generate drawing');
            }

        } catch (error) {
            this.showError('Drawing generation error: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    displayDrawingResults(data) {
        const drawingDisplay = document.getElementById('drawingDisplay');
        const resultsPanel = document.getElementById('drawingResults');
        
        drawingDisplay.innerHTML = `
            <div class="text-center">
                <p class="mb-3">Technical drawing generated successfully!</p>
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    Drawing files: Isometric + ${Object.keys(data.orthographic_views || {}).length} orthographic views
                </div>
                <div class="drawing-placeholder p-4 border rounded">
                    <i class="fas fa-drafting-compass fa-4x text-muted mb-3"></i>
                    <p>Technical drawing would be displayed here</p>
                    <small class="text-muted">In production, the actual drawing would be rendered</small>
                </div>
            </div>
        `;
        
        resultsPanel.style.display = 'block';
    }

    // Assembly Simulation
    async runSimulation() {
        const simulationType = document.getElementById('simulationType').value;
        const duration = parseFloat(document.getElementById('simulationDuration').value);
        const inputSpeed = parseFloat(document.getElementById('inputSpeed').value);

        this.showLoading('Running simulation...', `Performing ${simulationType} analysis`);

        try {
            let endpoint = '';
            let requestBody = {};

            switch (simulationType) {
                case 'gear_mesh':
                    endpoint = '/simulate_gear_mesh';
                    requestBody = {
                        gear1_id: 'gear1',
                        gear2_id: 'gear2',
                        contact_ratio: 1.5
                    };
                    break;
                case 'stress':
                    endpoint = '/analyze_stress';
                    requestBody = {
                        component_id: 'comp_gear',
                        applied_loads: [{
                            force_vector: [0, 0, -1000],
                            torque_vector: [100, 0, 0],
                            application_point: [0, 0, 0]
                        }]
                    };
                    break;
                default:
                    endpoint = '/simulate_assembly';
                    requestBody = {
                        components: this.currentComponents.slice(0, 2), // Use first 2 components
                        simulation_duration: duration,
                        input_motion: {
                            'comp_gear': {
                                angular_velocity: [0, 0, inputSpeed * 2 * Math.PI / 60] // Convert RPM to rad/s
                            }
                        }
                    };
            }

            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            this.displaySimulationResults(data, simulationType);

        } catch (error) {
            this.showError('Simulation error: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    displaySimulationResults(data, simulationType) {
        const resultsPanel = document.getElementById('simulationResults');
        const dataDisplay = document.getElementById('simulationData');
        
        let resultHtml = '';

        switch (simulationType) {
            case 'gear_mesh':
                const meshData = data.gear_mesh_simulation;
                resultHtml = `
                    <div class="row">
                        <div class="col-md-6">
                            <h6>Gear Ratio</h6>
                            <p class="h4 text-primary">${meshData.gear_ratio.toFixed(2)}:1</p>
                        </div>
                        <div class="col-md-6">
                            <h6>Contact Force</h6>
                            <p class="h4 text-warning">${meshData.contact_force.toFixed(0)} N</p>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-md-6">
                            <h6>Contact Stress</h6>
                            <p class="h4 text-danger">${meshData.contact_stress.toFixed(1)} MPa</p>
                        </div>
                        <div class="col-md-6">
                            <h6>Efficiency</h6>
                            <p class="h4 text-success">${(meshData.power_transmission_efficiency * 100).toFixed(1)}%</p>
                        </div>
                    </div>
                `;
                break;
            case 'stress':
                const stressData = data.stress_analysis;
                resultHtml = `
                    <div class="alert alert-info">
                        <h6>Stress Analysis Results</h6>
                        <p><strong>Max Stress:</strong> ${stressData.max_stress.toFixed(1)} Pa</p>
                        <p><strong>Safety Factor:</strong> ${stressData.safety_factor.toFixed(2)}</p>
                        <p><strong>Fatigue Life:</strong> ${stressData.fatigue_life_estimate.toLocaleString()} cycles</p>
                    </div>
                `;
                break;
            default:
                resultHtml = `
                    <div class="alert alert-success">
                        <h6>Motion Simulation Complete</h6>
                        <p>Simulation Duration: ${data.simulation_time} seconds</p>
                        <p>Components Analyzed: ${Object.keys(data.motion_history || {}).length}</p>
                    </div>
                `;
        }

        dataDisplay.innerHTML = resultHtml;
        resultsPanel.style.display = 'block';

        // Create a simple chart if motion data is available
        if (data.motion_history) {
            this.createSimulationChart(data.motion_history);
        }
    }

    createSimulationChart(motionHistory) {
        const ctx = document.getElementById('simulationChart');
        if (!ctx) return;

        if (this.simulationChart) {
            this.simulationChart.destroy();
        }

        // Extract time and position data for the first component
        const firstComponent = Object.keys(motionHistory)[0];
        if (!firstComponent) return;

        const states = motionHistory[firstComponent];
        const timeData = states.map(s => s.timestamp);
        const positionData = states.map(s => Math.sqrt(s.position[0]**2 + s.position[1]**2 + s.position[2]**2));

        this.simulationChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timeData,
                datasets: [{
                    label: 'Position Magnitude',
                    data: positionData,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Time (s)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Position (mm)'
                        }
                    }
                }
            }
        });
    }

    // Educational System
    async generateQuiz() {
        const topic = document.getElementById('quizTopic').value;
        const difficulty = document.getElementById('quizDifficulty').value;
        const numQuestions = parseInt(document.getElementById('numQuestions').value);

        this.showLoading('Generating quiz...', 'Creating personalized questions');

        try {
            const requestBody = {
                topic_area: topic || undefined,
                difficulty: difficulty || undefined,
                num_questions: numQuestions,
                user_id: 'demo_user'
            };

            const response = await fetch(`${this.baseUrl}/generate_quiz`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            this.currentQuiz = data.quiz;
            this.displayQuiz(data.quiz);

        } catch (error) {
            this.showError('Quiz generation error: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    displayQuiz(questions) {
        const container = document.getElementById('quizContainer');
        const questionsDiv = document.getElementById('quizQuestions');
        
        questionsDiv.innerHTML = '';

        questions.forEach((question, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question-item fade-in';
            
            let optionsHtml = '';
            if (question.options && question.options.length > 0) {
                optionsHtml = question.options.map((option, optionIndex) => `
                    <div class="option-item">
                        <input type="radio" name="question_${question.question_id}" 
                               value="${option}" id="q${index}_opt${optionIndex}">
                        <label for="q${index}_opt${optionIndex}">${option}</label>
                    </div>
                `).join('');
            } else {
                optionsHtml = `
                    <div class="option-item">
                        <input type="text" class="form-control" 
                               name="question_${question.question_id}" 
                               placeholder="Enter your answer...">
                    </div>
                `;
            }

            questionDiv.innerHTML = `
                <div class="question-header">
                    Question ${index + 1}: ${question.question_text}
                </div>
                <div class="question-meta mb-3">
                    <small class="text-muted">
                        Topic: ${question.topic_area.replace('_', ' ')} | 
                        Difficulty: ${question.difficulty_level} | 
                        Points: ${question.points}
                    </small>
                </div>
                <div class="question-options">
                    ${optionsHtml}
                </div>
            `;
            
            questionsDiv.appendChild(questionDiv);
        });

        container.style.display = 'block';
        document.getElementById('submitQuizBtn').style.display = 'block';
    }

    async submitQuiz() {
        const answers = {};
        
        this.currentQuiz.forEach(question => {
            const inputs = document.querySelectorAll(`[name="question_${question.question_id}"]`);
            
            if (inputs[0].type === 'radio') {
                const checked = document.querySelector(`[name="question_${question.question_id}"]:checked`);
                if (checked) {
                    answers[question.question_id] = checked.value;
                }
            } else {
                answers[question.question_id] = inputs[0].value;
            }
        });

        this.showLoading('Evaluating quiz...', 'Analyzing your answers');

        try {
            const response = await fetch(`${this.baseUrl}/evaluate_quiz`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: 'demo_user',
                    answers: answers
                })
            });

            const data = await response.json();
            this.displayQuizResults(data.evaluation_results);

        } catch (error) {
            this.showError('Quiz evaluation error: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    displayQuizResults(results) {
        const resultsDiv = document.getElementById('quizResults');
        const scoreDisplay = document.getElementById('scoreDisplay');
        const recommendations = document.getElementById('recommendations');

        const score = Math.round(results.score_percentage);
        const scoreColor = score >= 80 ? 'success' : score >= 60 ? 'warning' : 'danger';

        scoreDisplay.innerHTML = `
            <div class="score-display">
                <div class="score-circle mx-auto">
                    ${score}%
                </div>
                <h4>Quiz Complete!</h4>
                <p>You scored ${results.correct_answers} out of ${results.total_questions} questions correctly.</p>
            </div>
        `;

        recommendations.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h6>Recommendations</h6>
                    ${results.recommendations.map(rec => `<p class="mb-2"><i class="fas fa-lightbulb text-warning me-2"></i>${rec}</p>`).join('')}
                </div>
            </div>
        `;

        resultsDiv.style.display = 'block';
        document.getElementById('quizContainer').style.display = 'none';
    }

    // Diagnostic System
    async runDiagnosis() {
        const componentType = document.getElementById('diagnosticComponent').value;
        const temperature = document.getElementById('temperature').value;
        const vibration = document.getElementById('vibration').value;

        // Get selected symptoms
        const symptoms = [];
        document.querySelectorAll('#diagnostics input[type="checkbox"]:checked').forEach(cb => {
            symptoms.push(cb.value);
        });

        this.showLoading('Running diagnostics...', 'Analyzing component condition');

        try {
            const componentData = {
                component_type: componentType,
                function_category: 'power_transmission',
                confidence: 0.9,
                bounding_box: [0, 0, 100, 100],
                properties: {
                    material: 'steel'
                }
            };

            const measurements = {};
            if (temperature) measurements.temperature = parseFloat(temperature);
            if (vibration) measurements.vibration_rms = parseFloat(vibration);

            const response = await fetch(`${this.baseUrl}/diagnose_component`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...componentData,
                    symptoms: symptoms,
                    measurements: measurements
                })
            });

            const data = await response.json();
            this.displayDiagnosticResults(data);

            // Also get maintenance schedule
            await this.getMaintenanceSchedule(componentData);

        } catch (error) {
            this.showError('Diagnostic error: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    displayDiagnosticResults(data) {
        const resultsDiv = document.getElementById('diagnosticResults');
        const findingsDiv = document.getElementById('findingsList');

        findingsDiv.innerHTML = '';

        if (data.diagnosis_results.length === 0) {
            findingsDiv.innerHTML = '<p class="text-success"><i class="fas fa-check-circle me-2"></i>No issues detected. Component appears to be operating normally.</p>';
        } else {
            data.diagnosis_results.forEach(finding => {
                const findingDiv = document.createElement('div');
                findingDiv.className = `diagnostic-finding ${finding.level}`;
                
                findingDiv.innerHTML = `
                    <div class="finding-title">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        ${finding.title}
                    </div>
                    <div class="finding-description">
                        ${finding.description}
                    </div>
                    <div class="finding-action">
                        <strong>Recommended Action:</strong> ${finding.recommended_action}
                    </div>
                    <div class="mt-2">
                        <small class="text-muted">Confidence: ${Math.round(finding.confidence * 100)}%</small>
                    </div>
                `;
                
                findingsDiv.appendChild(findingDiv);
            });
        }

        resultsDiv.style.display = 'block';
    }

    async getMaintenanceSchedule(componentData) {
        try {
            const response = await fetch(`${this.baseUrl}/maintenance_schedule`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    components: [componentData],
                    operating_conditions: {
                        temperature: 70,
                        load_factor: 1.2,
                        rpm: 1500
                    }
                })
            });

            const data = await response.json();
            this.displayMaintenanceSchedule(data.maintenance_schedule);

        } catch (error) {
            console.error('Maintenance schedule error:', error);
        }
    }

    displayMaintenanceSchedule(schedule) {
        const maintenanceDiv = document.getElementById('maintenanceList');
        
        maintenanceDiv.innerHTML = '';

        Object.entries(schedule).forEach(([timeframe, items]) => {
            if (items.length > 0) {
                const timeframeDiv = document.createElement('div');
                timeframeDiv.innerHTML = `<h6 class="text-capitalize mt-3">${timeframe} Maintenance</h6>`;
                maintenanceDiv.appendChild(timeframeDiv);

                items.forEach(item => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = `maintenance-item ${item.urgency}`;
                    itemDiv.innerHTML = `
                        <strong>${item.component}:</strong> ${item.action}
                        <span class="badge bg-secondary ms-2">${item.urgency}</span>
                    `;
                    maintenanceDiv.appendChild(itemDiv);
                });
            }
        });
    }

    // Utility Functions
    showLoading(title = 'Processing...', subtitle = 'Please wait...') {
        const modal = new bootstrap.Modal(document.getElementById('loadingModal'));
        document.getElementById('loadingText').textContent = title;
        document.getElementById('loadingSubtext').textContent = subtitle;
        modal.show();
    }

    hideLoading() {
        const modal = bootstrap.Modal.getInstance(document.getElementById('loadingModal'));
        if (modal) {
            modal.hide();
        }
    }

    showError(message) {
        this.showAlert(message, 'danger');
    }

    showSuccess(message) {
        this.showAlert(message, 'success');
    }

    showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
        
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }

    // Download and Export Functions
    downloadDrawing() {
        this.showAlert('Drawing download would be initiated in production', 'info');
    }

    exportToCAD() {
        this.showAlert('CAD export functionality would be available in production', 'info');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mechEngAI = new MechEngAI();
    console.log('Mechanical Engineering AI System initialized');
});