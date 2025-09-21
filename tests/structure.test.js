const fs = require('fs');
const path = require('path');

// Test project structure
function testProjectStructure() {
  const requiredDirectories = [
    'src',
    'src/ai',
    'src/ai/interview',
    'src/ai/dynamics', 
    'src/ai/workflow',
    'src/api',
    'src/client',
    'src/client/components',
    'src/client/pages',
    'src/client/services',
    'src/models',
    'src/middleware',
    'src/utils',
    'docs',
    'tests',
    'config'
  ];

  const requiredFiles = [
    'package.json',
    'src/index.js',
    'src/ai/interview/InterviewEngine.js',
    'src/ai/dynamics/TeamDynamicsAnalyzer.js',
    'src/ai/workflow/WorkflowManager.js',
    'src/api/auth.js',
    'src/api/candidates.js',
    'src/api/teams.js',
    'src/api/workflows.js',
    'src/models/Candidate.js',
    'src/models/Team.js',
    'src/client/App.js',
    'src/client/pages/HomePage.js',
    'AI_PLATFORM.md',
    'docs/DEVELOPMENT.md',
    '.env.example'
  ];

  console.log('🧪 Testing AI-Powered Adaptive Collaboration Platform Structure\\n');

  // Test directories
  console.log('📁 Checking directories:');
  let directoriesPass = true;
  requiredDirectories.forEach(dir => {
    const fullPath = path.join(__dirname, '..', dir);
    const exists = fs.existsSync(fullPath);
    console.log(`  ${exists ? '✅' : '❌'} ${dir}`);
    if (!exists) directoriesPass = false;
  });

  // Test files  
  console.log('\\n📄 Checking required files:');
  let filesPass = true;
  requiredFiles.forEach(file => {
    const fullPath = path.join(__dirname, '..', file);
    const exists = fs.existsSync(fullPath);
    console.log(`  ${exists ? '✅' : '❌'} ${file}`);
    if (!exists) filesPass = false;
  });

  // Test package.json content
  console.log('\\n📦 Checking package.json content:');
  const packagePath = path.join(__dirname, '..', 'package.json');
  if (fs.existsSync(packagePath)) {
    const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const requiredFields = ['name', 'version', 'description', 'scripts', 'dependencies'];
    let packagePass = true;
    
    requiredFields.forEach(field => {
      const exists = packageContent[field] !== undefined;
      console.log(`  ${exists ? '✅' : '❌'} ${field}`);
      if (!exists) packagePass = false;
    });
    
    // Check for key dependencies
    const keyDeps = ['express', 'mongoose', 'openai'];
    console.log('\\n  Key dependencies:');
    keyDeps.forEach(dep => {
      const exists = packageContent.dependencies && packageContent.dependencies[dep];
      console.log(`    ${exists ? '✅' : '❌'} ${dep}`);
    });
  }

  // Test AI component structure
  console.log('\\n🤖 Checking AI components:');
  const aiComponents = [
    'src/ai/interview/InterviewEngine.js',
    'src/ai/dynamics/TeamDynamicsAnalyzer.js', 
    'src/ai/workflow/WorkflowManager.js'
  ];
  
  aiComponents.forEach(component => {
    const fullPath = path.join(__dirname, '..', component);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const hasClass = content.includes('class ');
      const hasExports = content.includes('module.exports');
      console.log(`  ${hasClass && hasExports ? '✅' : '❌'} ${component} (${hasClass ? 'Class' : 'No Class'}, ${hasExports ? 'Exports' : 'No Exports'})`);
    }
  });

  // Summary
  console.log('\\n📊 Test Summary:');
  console.log(`  Directories: ${directoriesPass ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  Files: ${filesPass ? '✅ PASS' : '❌ FAIL'}`);
  
  const overallPass = directoriesPass && filesPass;
  console.log(`\\n🎯 Overall: ${overallPass ? '✅ PASS - Platform structure is ready!' : '❌ FAIL - Some components missing'}`);
  
  if (overallPass) {
    console.log('\\n🎼 The AI Conductor platform foundation is successfully established!');
    console.log('   Ready for AI-powered adaptive hiring and collaboration.');
  }
  
  return overallPass;
}

// Run the test
if (require.main === module) {
  testProjectStructure();
}

module.exports = testProjectStructure;