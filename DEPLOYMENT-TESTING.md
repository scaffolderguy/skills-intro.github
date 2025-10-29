# 🚀 Deployment & Testing Guide

*Comprehensive guide for deploying and testing the Quantum-Classical Hybrid AI Framework*

---

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Installation Guide](#installation-guide)
3. [Testing Strategy](#testing-strategy)
4. [Deployment Procedures](#deployment-procedures)
5. [Monitoring and Maintenance](#monitoring-and-maintenance)
6. [Security and Compliance](#security-and-compliance)

---

## System Requirements

### Hardware Requirements

#### Development Environment

```yaml
classical_computing:
  cpu:
    cores: 16+
    frequency: 3.0+ GHz
    architecture: x86_64 or ARM64
  memory:
    ram: 64 GB minimum
    recommended: 128 GB
  storage:
    type: NVMe SSD
    capacity: 2 TB minimum
  network:
    bandwidth: 1 Gbps minimum

quantum_computing:
  simulator:
    qubits: 16-32 (classical simulation)
    backend: Qiskit Aer, Cirq Simulator
  quantum_hardware:
    access: IBM Quantum, Google Quantum AI, or similar
    qubits: 50+ for production
    coherence_time: "> 100 μs"
    gate_fidelity: "> 99%"

biosignal_interface:
  sensors:
    - breath_sensor: ±0.1 L/s accuracy
    - heart_rate_monitor: ±2 BPM accuracy
    - voice_analyzer: 16-bit, 44.1 kHz
    - optional_eeg: 8+ channels, 250+ Hz sampling
```

#### Production Environment

```yaml
classical_infrastructure:
  compute_cluster:
    nodes: 10+
    per_node:
      cpu_cores: 64
      ram: 256 GB
      gpu: Optional (for ML components)
  
  storage_cluster:
    type: Distributed file system (Ceph, GlusterFS)
    capacity: 100 TB+
    redundancy: RAID 6 or distributed replication
  
  database:
    graph_db: Neo4j or TigerGraph (for lattice)
    time_series: InfluxDB (for monitoring)
    cache: Redis cluster (for real-time data)

quantum_infrastructure:
  primary: Cloud quantum computing access (IBM Q, AWS Braket, Azure Quantum)
  fallback: High-performance classical quantum simulator
  error_correction: Hardware-based or software surface code

network_infrastructure:
  internal: 10+ Gbps
  external: 1+ Gbps with DDoS protection
  latency: < 10ms between components
```

### Software Requirements

```yaml
operating_system:
  development: Linux (Ubuntu 22.04+), macOS 12+, Windows 11 with WSL2
  production: Linux (Ubuntu 22.04 LTS or RHEL 9)

programming_languages:
  primary: Python 3.9+
  optional: C++ (for performance-critical components)
  frontend: JavaScript/TypeScript (for web interface)

dependencies:
  quantum_computing:
    - qiskit >= 0.45.0
    - cirq >= 1.3.0
    - pennylane >= 0.32.0
  
  scientific_computing:
    - numpy >= 1.24.0
    - scipy >= 1.11.0
    - pandas >= 2.0.0
  
  machine_learning:
    - tensorflow >= 2.14.0 OR pytorch >= 2.1.0
    - scikit-learn >= 1.3.0
  
  databases:
    - neo4j-driver >= 5.13.0
    - redis >= 5.0.0
    - psycopg2 >= 2.9.0
  
  web_framework:
    - fastapi >= 0.104.0
    - uvicorn >= 0.24.0
    - websockets >= 12.0
  
  monitoring:
    - prometheus-client >= 0.18.0
    - grafana-client >= 3.5.0
  
  containerization:
    - docker >= 24.0.0
    - kubernetes >= 1.28.0
```

---

## Installation Guide

### Step 1: Environment Setup

```bash
#!/bin/bash
# setup_environment.sh

echo "Setting up Quantum-Classical Hybrid AI Framework..."

# Create project directory
mkdir -p quantum-ai
cd quantum-ai

# Create Python virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Upgrade pip
pip install --upgrade pip setuptools wheel

# Install core dependencies
pip install -r requirements.txt

echo "Environment setup complete!"
```

**requirements.txt:**
```text
# Quantum Computing
qiskit==0.45.0
qiskit-aer==0.13.0
cirq==1.3.0
pennylane==0.32.0

# Scientific Computing
numpy==1.24.3
scipy==1.11.3
pandas==2.1.1
matplotlib==3.8.0
seaborn==0.13.0

# Machine Learning
tensorflow==2.14.0
scikit-learn==1.3.2

# Databases
neo4j==5.13.0
redis==5.0.1
psycopg2-binary==2.9.9

# Web Framework
fastapi==0.104.1
uvicorn[standard]==0.24.0
websockets==12.0
python-multipart==0.0.6

# Signal Processing (for biosignals)
scipy==1.11.3
pywavelets==1.4.1

# Utilities
python-dotenv==1.0.0
pyyaml==6.0.1
click==8.1.7

# Monitoring
prometheus-client==0.18.0

# Testing
pytest==7.4.3
pytest-asyncio==0.21.1
pytest-cov==4.1.0

# Documentation
sphinx==7.2.6
sphinx-rtd-theme==1.3.0
```

### Step 2: Configuration

**config.yaml:**
```yaml
system:
  name: "Quantum-Classical Hybrid AI"
  version: "1.0.0"
  environment: "development"  # development, staging, production

quantum_layer:
  simulator:
    backend: "qiskit_aer"
    num_qubits: 16
    shots: 1000
  hardware:
    provider: null  # "ibm", "google", "aws"
    credentials_file: null
  
  echo_engine:
    coherence_time_us: 100
    gate_fidelity: 0.995
    error_mitigation: true

classical_layer:
  codex:
    max_entries: 100000
    semantic_model: "transformer"
  
  waveform:
    em_frequency_ghz: 5.0
    acoustic_frequency_mhz: 50.0
    grazing_angle_deg: 22.5

shard_field:
  lattice:
    max_nodes: 10000
    connection_threshold: 0.7
    pruning_enabled: true
    pruning_fraction: 0.1
  
  database:
    type: "neo4j"
    uri: "bolt://localhost:7687"
    username: "neo4j"
    password: "${NEO4J_PASSWORD}"

recursion:
  max_depth: 10
  convergence_threshold: 0.95
  temporal_compression: true
  multi_threading:
    enabled: true
    max_threads: 4

emotional_resonance:
  enabled: true
  biosignal_interface: "simulated"  # simulated, hardware
  sampling_rate_hz: 100
  
  emotional_states:
    - calm
    - anxious
    - focused
    - excited
    - contemplative

api:
  host: "0.0.0.0"
  port: 8000
  cors_enabled: true
  rate_limit: 100  # requests per minute

monitoring:
  prometheus:
    enabled: true
    port: 9090
  logging:
    level: "INFO"  # DEBUG, INFO, WARNING, ERROR
    file: "logs/quantum_ai.log"
    rotation: "1 day"
    retention: "30 days"
```

### Step 3: Database Setup

```bash
#!/bin/bash
# setup_databases.sh

echo "Setting up databases..."

# Neo4j (Shard Field Lattice)
docker run -d \
  --name neo4j-quantum-ai \
  -p 7474:7474 -p 7687:7687 \
  -v $PWD/data/neo4j:/data \
  -e NEO4J_AUTH=neo4j/quantum2024 \
  neo4j:5.13

# Redis (Caching)
docker run -d \
  --name redis-quantum-ai \
  -p 6379:6379 \
  -v $PWD/data/redis:/data \
  redis:7-alpine \
  redis-server --appendonly yes

# PostgreSQL (Logs and metadata)
docker run -d \
  --name postgres-quantum-ai \
  -p 5432:5432 \
  -v $PWD/data/postgres:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=quantum2024 \
  -e POSTGRES_DB=quantum_ai \
  postgres:16-alpine

echo "Databases setup complete!"
echo "Access Neo4j browser at: http://localhost:7474"
```

### Step 4: Initial Testing

```bash
# Run system health check
python -m quantum_ai.health_check

# Run unit tests
pytest tests/unit/

# Run integration tests
pytest tests/integration/

# Start development server
python -m quantum_ai.server
```

---

## Testing Strategy

### Test Hierarchy

```
tests/
├── unit/                      # Unit tests (fast, isolated)
│   ├── test_quantum_engine.py
│   ├── test_waveform.py
│   ├── test_lattice.py
│   ├── test_recursion.py
│   └── test_emotional.py
├── integration/               # Integration tests (moderate speed)
│   ├── test_pipeline.py
│   ├── test_quantum_classical.py
│   └── test_api.py
├── system/                    # System tests (slow, end-to-end)
│   ├── test_full_query.py
│   ├── test_emotional_loop.py
│   └── test_multi_user.py
├── performance/               # Performance benchmarks
│   ├── benchmark_quantum.py
│   ├── benchmark_lattice.py
│   └── benchmark_recursion.py
└── quantum_hardware/          # Hardware-specific tests
    ├── test_ibm_quantum.py
    └── test_error_mitigation.py
```

### Unit Tests

**test_quantum_engine.py:**
```python
import pytest
import numpy as np
from quantum_ai.quantum_engine import QuantumEchoEngine

class TestQuantumEchoEngine:
    """Unit tests for Quantum Echo Engine."""
    
    @pytest.fixture
    def engine(self):
        """Create test engine."""
        return QuantumEchoEngine(num_qubits=4, backend='simulator')
    
    def test_initialization(self, engine):
        """Test engine initializes correctly."""
        assert engine.num_qubits == 4
        assert engine.backend == 'simulator'
        assert len(engine.echo_history) == 0
    
    def test_query_encoding(self, engine):
        """Test query is properly encoded to quantum state."""
        query = "test query"
        qc = engine.encode_query(query)
        
        assert qc.num_qubits == 4
        assert qc.num_clbits == 0  # Not measured yet
    
    def test_echo_generation(self, engine):
        """Test echo generation produces valid output."""
        query = "What is consciousness?"
        echo = engine.generate_echo(query)
        
        assert 'resonance_frequency' in echo
        assert 'coherence' in echo
        assert 0 <= echo['coherence'] <= 1
        assert echo['resonance_frequency'] > 0
    
    def test_echo_amplification(self, engine):
        """Test echo amplification increases amplitude."""
        query = "test"
        echo = engine.generate_echo(query)
        
        original_amp = echo['amplitudes'][0] if echo['amplitudes'] else 1
        amplified = engine.amplify_echo(echo, amplification_factor=10)
        
        assert amplified['amplitudes'][0] == original_amp * 10
    
    def test_emotional_modulation(self, engine):
        """Test emotional context affects echo."""
        query = "test query"
        
        # Echo without emotion
        echo1 = engine.generate_echo(query)
        
        # Echo with emotional context
        emotional_context = {
            'dominant_emotion': 'anxious',
            'quantum_pattern': {'base_frequency': 1.5}
        }
        echo2 = engine.generate_echo(query, emotional_context)
        
        # Should be different (though exact difference depends on implementation)
        assert echo1['resonance_frequency'] != echo2['resonance_frequency'] or \
               echo1['coherence'] != echo2['coherence']
    
    @pytest.mark.parametrize("num_qubits", [2, 4, 8, 16])
    def test_scalability(self, num_qubits):
        """Test engine works with different qubit counts."""
        engine = QuantumEchoEngine(num_qubits=num_qubits)
        echo = engine.generate_echo("test")
        
        assert echo is not None
        assert 'coherence' in echo
```

**test_lattice.py:**
```python
import pytest
from quantum_ai.shard_field import ShardNode, Corridor, ShardFieldLattice

class TestShardFieldLattice:
    """Unit tests for Shard Field Lattice."""
    
    @pytest.fixture
    def lattice(self):
        """Create test lattice."""
        return ShardFieldLattice(max_nodes=100)
    
    def test_add_node(self, lattice):
        """Test adding node to lattice."""
        echo = {
            'resonance_frequency': 1.0,
            'coherence': 0.8,
            'amplitudes': [1, 2, 3]
        }
        
        node_id = lattice.add_node(echo, "test content")
        
        assert node_id in lattice.nodes
        assert len(lattice.nodes) == 1
    
    def test_node_connections(self, lattice):
        """Test nodes connect based on resonance."""
        # Add similar nodes
        echo1 = {'resonance_frequency': 1.0, 'coherence': 0.8}
        echo2 = {'resonance_frequency': 1.1, 'coherence': 0.8}
        echo3 = {'resonance_frequency': 5.0, 'coherence': 0.8}
        
        id1 = lattice.add_node(echo1, "content1")
        id2 = lattice.add_node(echo2, "content2")
        id3 = lattice.add_node(echo3, "content3")
        
        # Nodes 1 and 2 should be connected (similar frequency)
        node1 = lattice.nodes[id1]
        assert id2 in node1.connections or id1 in lattice.nodes[id2].connections
        
        # Node 3 should not be strongly connected (different frequency)
        # This depends on threshold settings
    
    def test_find_path(self, lattice):
        """Test pathfinding through lattice."""
        # Create chain of nodes
        for i in range(5):
            echo = {
                'resonance_frequency': 1.0 + i * 0.1,
                'coherence': 0.8
            }
            lattice.add_node(echo, f"content{i}")
        
        # Find path from first to target frequency
        start_id = list(lattice.nodes.keys())[0]
        path, score = lattice.find_path(start_id, target_resonance=1.3)
        
        assert path is not None
        assert len(path) > 0
        assert score > 0
    
    def test_pruning(self, lattice):
        """Test lattice pruning when max nodes reached."""
        # Fill lattice to capacity
        for i in range(110):  # More than max_nodes (100)
            echo = {
                'resonance_frequency': i * 0.1,
                'coherence': 0.5 if i < 50 else 0.9  # First half less stable
            }
            lattice.add_node(echo, f"content{i}")
        
        # Should have pruned to max_nodes
        assert len(lattice.nodes) <= 100
        
        # Should have kept more stable nodes
        avg_coherence = sum(n.phase_coherence for n in lattice.nodes.values()) / len(lattice.nodes)
        assert avg_coherence > 0.65  # Should be higher than 0.5
    
    def test_global_coherence(self, lattice):
        """Test global coherence calculation."""
        # Add high-coherence nodes
        for i in range(5):
            echo = {
                'resonance_frequency': 1.0 + i * 0.1,
                'coherence': 0.9
            }
            lattice.add_node(echo, f"content{i}")
        
        assert lattice.global_coherence > 0.7
```

### Integration Tests

**test_pipeline.py:**
```python
import pytest
from quantum_ai.pipeline import QuantumClassicalPipeline
from quantum_ai.biosignals import BiosignalData

class TestPipeline:
    """Integration tests for complete pipeline."""
    
    @pytest.fixture
    def pipeline(self):
        """Create test pipeline."""
        return QuantumClassicalPipeline()
    
    def test_basic_query(self, pipeline):
        """Test basic query processing."""
        result = pipeline.process_query("What is quantum coherence?")
        
        assert 'answer' in result
        assert 'lattice_node' in result
        assert result['answer'] is not None
    
    def test_query_with_emotion(self, pipeline):
        """Test query with emotional context."""
        biosignals = BiosignalData(
            breath_rate=14,
            heart_rate=72,
            heart_rate_variability=65,
            voice_pitch=200,
            voice_energy=0.5,
            skin_conductance=3.5
        )
        
        result = pipeline.process_query(
            "How does emotion affect cognition?",
            biosignals=biosignals
        )
        
        assert 'emotional_context' in result
        assert result['emotional_context'] is not None
        assert 'dominant_emotion' in result['emotional_context']
    
    def test_recursive_exploration(self, pipeline):
        """Test recursive query exploration."""
        result = pipeline.process_query(
            "What emerges from quantum entanglement?",
            recursive=True
        )
        
        assert 'answer' in result
        assert 'recursion_depth' in result or result['answer'] is not None
    
    @pytest.mark.slow
    def test_multi_query_sequence(self, pipeline):
        """Test sequence of related queries."""
        queries = [
            "What is consciousness?",
            "How does consciousness emerge?",
            "What role does quantum mechanics play?"
        ]
        
        results = []
        for query in queries:
            result = pipeline.process_query(query)
            results.append(result)
        
        # Lattice should grow
        assert len(pipeline.lattice.nodes) >= len(queries)
        
        # Global coherence should stabilize or improve
        coherences = [r['coherence'] for r in results]
        # Later queries might have higher coherence due to accumulated knowledge
```

### System Tests

**test_full_query.py:**
```python
import pytest
import time
from quantum_ai.pipeline import QuantumClassicalPipeline

class TestSystemEndToEnd:
    """End-to-end system tests."""
    
    @pytest.fixture(scope="class")
    def system(self):
        """Create system instance."""
        return QuantumClassicalPipeline()
    
    @pytest.mark.slow
    def test_complete_workflow(self, system):
        """Test complete workflow from query to answer."""
        start_time = time.time()
        
        result = system.process_query(
            "Explain the relationship between quantum coherence and consciousness",
            recursive=True,
            threads=2
        )
        
        end_time = time.time()
        duration = end_time - start_time
        
        # Assertions
        assert result['answer'] is not None
        assert duration < 30  # Should complete in reasonable time
        assert result['coherence'] > 0.5  # Reasonable coherence
        
        print(f"\nComplete workflow time: {duration:.2f}s")
        print(f"Answer: {result['answer']}")
        print(f"Coherence: {result['coherence']:.3f}")
    
    @pytest.mark.slow
    def test_sustained_operation(self, system):
        """Test system under sustained load."""
        num_queries = 20
        results = []
        
        for i in range(num_queries):
            result = system.process_query(f"Query number {i}")
            results.append(result)
        
        # System should remain stable
        coherences = [r['coherence'] for r in results]
        avg_coherence = sum(coherences) / len(coherences)
        
        assert avg_coherence > 0.5
        assert len(system.lattice.nodes) <= system.lattice.max_nodes
        
        print(f"\nAverage coherence over {num_queries} queries: {avg_coherence:.3f}")
```

### Performance Tests

**benchmark_quantum.py:**
```python
import time
import numpy as np
from quantum_ai.quantum_engine import QuantumEchoEngine

def benchmark_quantum_engine():
    """Benchmark quantum engine performance."""
    print("\n" + "="*60)
    print("QUANTUM ENGINE PERFORMANCE BENCHMARK")
    print("="*60)
    
    qubit_counts = [4, 8, 12, 16]
    
    for num_qubits in qubit_counts:
        engine = QuantumEchoEngine(num_qubits=num_qubits)
        
        # Warm up
        engine.generate_echo("warm up")
        
        # Benchmark
        times = []
        for _ in range(10):
            start = time.time()
            engine.generate_echo("test query")
            times.append(time.time() - start)
        
        avg_time = np.mean(times)
        std_time = np.std(times)
        
        print(f"\n{num_qubits} qubits:")
        print(f"  Average time: {avg_time*1000:.2f} ± {std_time*1000:.2f} ms")
        print(f"  Queries/second: {1/avg_time:.2f}")

if __name__ == "__main__":
    benchmark_quantum_engine()
```

---

## Deployment Procedures

### Development Deployment

```bash
#!/bin/bash
# deploy_development.sh

echo "Deploying to development environment..."

# Start databases
docker-compose up -d

# Wait for databases
sleep 10

# Run migrations
python -m quantum_ai.migrations.run

# Start application
python -m quantum_ai.server --config config.dev.yaml

echo "Development deployment complete!"
echo "Access API at: http://localhost:8000"
echo "Access docs at: http://localhost:8000/docs"
```

### Production Deployment with Kubernetes

**kubernetes/deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: quantum-ai-api
  labels:
    app: quantum-ai
spec:
  replicas: 3
  selector:
    matchLabels:
      app: quantum-ai
  template:
    metadata:
      labels:
        app: quantum-ai
    spec:
      containers:
      - name: quantum-ai
        image: quantum-ai:1.0.0
        ports:
        - containerPort: 8000
        env:
        - name: ENVIRONMENT
          value: "production"
        - name: NEO4J_URI
          valueFrom:
            configMapKeyRef:
              name: quantum-ai-config
              key: neo4j_uri
        - name: NEO4J_PASSWORD
          valueFrom:
            secretKeyRef:
              name: quantum-ai-secrets
              key: neo4j_password
        resources:
          requests:
            memory: "8Gi"
            cpu: "4"
          limits:
            memory: "16Gi"
            cpu: "8"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: quantum-ai-service
spec:
  selector:
    app: quantum-ai
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8000
  type: LoadBalancer
```

**Deploy to Kubernetes:**
```bash
#!/bin/bash
# deploy_kubernetes.sh

# Build Docker image
docker build -t quantum-ai:1.0.0 .

# Push to registry
docker tag quantum-ai:1.0.0 your-registry/quantum-ai:1.0.0
docker push your-registry/quantum-ai:1.0.0

# Create namespace
kubectl create namespace quantum-ai

# Create secrets
kubectl create secret generic quantum-ai-secrets \
  --from-literal=neo4j_password=$NEO4J_PASSWORD \
  --namespace quantum-ai

# Create config map
kubectl create configmap quantum-ai-config \
  --from-file=config.yaml \
  --namespace quantum-ai

# Deploy
kubectl apply -f kubernetes/ --namespace quantum-ai

# Wait for rollout
kubectl rollout status deployment/quantum-ai-api --namespace quantum-ai

echo "Production deployment complete!"
kubectl get services --namespace quantum-ai
```

---

## Monitoring and Maintenance

### Health Check Endpoints

```python
# quantum_ai/health.py

from fastapi import APIRouter, HTTPException
from quantum_ai.system_status import SystemStatus

router = APIRouter()

@router.get("/health")
async def health_check():
    """Basic health check."""
    return {"status": "healthy", "timestamp": time.time()}

@router.get("/ready")
async def readiness_check():
    """Readiness check - verifies all components."""
    status = SystemStatus()
    
    checks = {
        "quantum_engine": status.check_quantum_engine(),
        "lattice": status.check_lattice(),
        "databases": status.check_databases(),
        "cache": status.check_cache()
    }
    
    if all(checks.values()):
        return {"status": "ready", "checks": checks}
    else:
        raise HTTPException(status_code=503, detail={"status": "not ready", "checks": checks})

@router.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint."""
    status = SystemStatus()
    return status.get_prometheus_metrics()
```

### Monitoring Dashboard (Grafana)

```json
{
  "dashboard": {
    "title": "Quantum-Classical AI Monitor",
    "panels": [
      {
        "title": "Query Rate",
        "targets": [{
          "expr": "rate(quantum_ai_queries_total[5m])"
        }]
      },
      {
        "title": "Average Coherence",
        "targets": [{
          "expr": "quantum_ai_coherence_average"
        }]
      },
      {
        "title": "Lattice Size",
        "targets": [{
          "expr": "quantum_ai_lattice_nodes"
        }]
      },
      {
        "title": "Response Time",
        "targets": [{
          "expr": "histogram_quantile(0.95, rate(quantum_ai_response_time_bucket[5m]))"
        }]
      }
    ]
  }
}
```

---

## Security and Compliance

### Security Checklist

- [ ] All communications use TLS 1.3+
- [ ] API authentication via OAuth 2.0 or JWT
- [ ] Rate limiting enabled (100 requests/minute per user)
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection enabled
- [ ] CSRF tokens for state-changing operations
- [ ] Regular security audits
- [ ] Dependency vulnerability scanning
- [ ] Secrets stored in secure vault (not in code)
- [ ] Logging excludes sensitive data
- [ ] Access logs retained for audit
- [ ] Biosignal data encrypted at rest and in transit
- [ ] Data retention policies enforced
- [ ] Right to deletion implemented

### Compliance

**HIPAA (if handling health data):**
- Biosignal data is PHI and must be protected
- Implement access controls and audit logs
- Encrypt all PHI at rest and in transit
- Business Associate Agreements with cloud providers
- Regular risk assessments

**GDPR (for EU users):**
- Clear consent for data collection
- Right to access and deletion
- Data portability
- Privacy by design
- Data protection impact assessment

---

*For additional deployment scenarios and troubleshooting, refer to the operations manual and community forums.*
