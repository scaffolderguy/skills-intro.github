# Mechanical Engineering AI System

A comprehensive AI-powered system for mechanical engineering that provides component recognition, 3D modeling, assembly simulation, and educational capabilities.

## 🚀 Features

### 1. **Component Recognition & Classification**
- **AI-Powered Detection**: Automatically identify mechanical parts from images
- **Smart Classification**: Classify components by function (power transmission, fluid control, electrical signaling, etc.)
- **High Accuracy**: Advanced computer vision models for precise recognition
- **Property Extraction**: Automatically extract component specifications and dimensions

### 2. **3D Modeling & Technical Drawings**
- **Automated 3D Generation**: Convert 2D diagrams or photos into 3D models
- **Technical Drawings**: Generate isometric, orthographic, and exploded views
- **CAD Integration**: Export models in standard formats (STL, STEP, IGES)
- **Parametric Modeling**: Create parametric definitions for design optimization

### 3. **Assembly Simulation**
- **Real-Time Motion**: Simulate mechanical system motion and interactions
- **Stress Analysis**: Calculate stress distribution and safety factors
- **Gear Meshing**: Specialized simulation for gear systems
- **Material Properties**: Comprehensive material database with thermal and mechanical properties

### 4. **Educational System**
- **Interactive Quizzes**: Adaptive learning with personalized questions
- **Knowledge Assessment**: Track learning progress and identify weak areas
- **Multi-Level Content**: Beginner to advanced engineering concepts
- **Smart Recommendations**: AI-driven learning path suggestions

### 5. **Diagnostic & Maintenance**
- **Fault Detection**: Intelligent diagnosis based on symptoms and measurements
- **Predictive Maintenance**: Forecast failure modes and maintenance needs
- **Visual Inspection**: Automated analysis of component wear and damage
- **Maintenance Scheduling**: Generate optimized maintenance schedules

## 🛠️ Installation

### Prerequisites
- Python 3.8 or higher
- Node.js 14+ (for web interface)
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/scaffolderguy/skills-intro.github.git
   cd skills-intro.github
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the demo**
   ```bash
   python demo.py
   ```

4. **Start the web interface**
   ```bash
   python -m flask --app src.web_interface.app run
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000`

## 📖 Usage

### Component Recognition
```python
from src.core.component_recognition import ComponentRecognizer
import cv2

# Initialize recognizer
recognizer = ComponentRecognizer()

# Load and analyze image
image = cv2.imread('mechanical_part.jpg')
components = recognizer.detect_components(image)

# Display results
for component in components:
    print(f"Found: {component.component_type.value}")
    print(f"Confidence: {component.confidence:.2%}")
```

### 3D Modeling
```python
from src.modeling.modeling_engine import ThreeDModeler

# Generate 3D model
modeler = ThreeDModeler()
model_3d = modeler.generate_3d_model(component)

# Export to CAD
from src.modeling.modeling_engine import CADIntegration
cad = CADIntegration()
cad.export_to_cad(model_3d, "output.stl")
```

### Assembly Simulation
```python
from src.core.assembly_simulation import AssemblySimulator

# Set up simulation
simulator = AssemblySimulator()
simulator.add_component("gear1", gear_model)
simulator.add_component("gear2", gear_model_2)

# Run simulation
motion_history = simulator.simulate_motion(duration=2.0)
```

### Educational Quiz
```python
from src.ai_models.educational_diagnostic import EducationalSystem

# Generate quiz
edu_system = EducationalSystem()
quiz = edu_system.generate_quiz(
    topic_area="power_transmission",
    difficulty="intermediate",
    num_questions=5
)
```

## 🏗️ Architecture

```
src/
├── core/                     # Core AI algorithms
│   ├── component_recognition.py
│   └── assembly_simulation.py
├── ai_models/               # Educational & diagnostic AI
│   └── educational_diagnostic.py
├── 3d_modeling/            # 3D modeling & CAD
│   └── modeling_engine.py
├── web_interface/          # Web application
│   ├── app.py
│   ├── templates/
│   └── static/
└── utils/                  # Utility functions
```

## 🔧 API Reference

### REST API Endpoints

#### Component Recognition
- `POST /api/recognize` - Recognize components in image
- `POST /api/classify` - Classify components by function

#### 3D Modeling
- `POST /api/generate_3d_model` - Generate 3D model
- `POST /api/generate_isometric` - Create technical drawings

#### Simulation
- `POST /api/simulate_assembly` - Run assembly simulation
- `POST /api/simulate_gear_mesh` - Simulate gear meshing
- `POST /api/analyze_stress` - Perform stress analysis

#### Education
- `POST /api/generate_quiz` - Create educational quiz
- `POST /api/evaluate_quiz` - Evaluate quiz answers
- `GET /api/learning_path/{user_id}` - Get learning path

#### Diagnostics
- `POST /api/diagnose_component` - Diagnose component issues
- `POST /api/predict_failures` - Predict failure modes
- `POST /api/maintenance_schedule` - Generate maintenance plan

## 🧪 Testing

Run the test suite:
```bash
pytest tests/ -v
```

Run specific test categories:
```bash
pytest tests/test_component_recognition.py -v
pytest tests/test_3d_modeling.py -v
pytest tests/test_simulation.py -v
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Setup
```bash
# Install development dependencies
pip install -r requirements-dev.txt

# Run linting
flake8 src/
black src/

# Run type checking
mypy src/
```

## 📊 System Capabilities

| Feature | Status | Description |
|---------|--------|-------------|
| 🔍 Component Recognition | ✅ | AI-powered part identification |
| 🎯 Classification | ✅ | Functional categorization |
| 🧊 3D Modeling | ✅ | Automated mesh generation |
| 📐 Technical Drawings | ✅ | Isometric & orthographic views |
| ⚙️ Motion Simulation | ✅ | Real-time assembly dynamics |
| 🔧 Stress Analysis | ✅ | FEA and material properties |
| 🎓 Educational Quizzes | ✅ | Adaptive learning system |
| 🏥 Diagnostics | ✅ | Fault detection & prediction |
| 🛠️ Maintenance Planning | ✅ | Predictive maintenance |
| 🌐 Web Interface | ✅ | User-friendly dashboard |

## 🎯 Supported Components

- **Gears**: Spur, helical, bevel, worm gears
- **Bearings**: Ball, roller, thrust bearings
- **Shafts**: Power transmission shafts
- **Clutches**: Friction and magnetic clutches
- **Valves**: Control and isolation valves
- **Motors**: Electric and hydraulic motors
- **Pumps**: Centrifugal and positive displacement
- **Springs**: Compression, extension, torsion
- **Fasteners**: Bolts, screws, pins
- **Housings**: Enclosures and mounting structures

## 🌟 Advanced Features

### Material Simulation
- **Thermal Analysis**: Heat dissipation and thermal expansion
- **Fatigue Analysis**: S-N curves and life prediction
- **Corrosion Modeling**: Environmental degradation
- **Wear Simulation**: Contact mechanics and tribology

### Manufacturing Integration
- **DFM Analysis**: Design for manufacturability checks
- **Cost Estimation**: Material and process cost modeling
- **Tolerance Analysis**: Statistical tolerance modeling
- **Quality Control**: Automated inspection algorithms

### Standards Compliance
- **ISO Standards**: International standard compliance
- **ANSI Standards**: American national standards
- **JIS Standards**: Japanese industrial standards
- **DIN Standards**: German standards integration

## 🔮 Roadmap

### Near Term (Q1-Q2 2024)
- [ ] Enhanced AI models with larger training datasets
- [ ] Advanced material property database
- [ ] Improved web interface with 3D visualization
- [ ] Mobile application development
- [ ] Cloud deployment and scaling

### Long Term (Q3-Q4 2024)
- [ ] Augmented reality (AR) integration
- [ ] Voice-guided assembly instructions
- [ ] Integration with major CAD software (SolidWorks, AutoCAD)
- [ ] Real-time IoT sensor integration
- [ ] Multi-language support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TensorFlow Team**: For the deep learning framework
- **Open3D**: For 3D geometry processing
- **OpenCV**: For computer vision capabilities
- **Flask**: For the web framework
- **Bootstrap**: For UI components

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/scaffolderguy/skills-intro.github/issues)
- **Discussions**: [GitHub Discussions](https://github.com/scaffolderguy/skills-intro.github/discussions)
- **Email**: support@mechanicalai.com

---

**Made with ❤️ for the mechanical engineering community**