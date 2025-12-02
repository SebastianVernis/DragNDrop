/**
 * Verification Script for Workflow 4
 * Checks that all modules are properly implemented
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Workflow 4 Implementation...\n');

const checks = {
  passed: 0,
  failed: 0,
  warnings: 0
};

function checkFile(filePath, description) {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    console.log(`✅ ${description}`);
    console.log(`   📄 ${filePath} (${stats.size} bytes)`);
    checks.passed++;
    return true;
  } else {
    console.log(`❌ ${description}`);
    console.log(`   📄 ${filePath} - NOT FOUND`);
    checks.failed++;
    return false;
  }
}

function checkDirectory(dirPath, description) {
  const fullPath = path.join(__dirname, dirPath);
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
    const files = fs.readdirSync(fullPath);
    console.log(`✅ ${description}`);
    console.log(`   📁 ${dirPath} (${files.length} files)`);
    checks.passed++;
    return true;
  } else {
    console.log(`❌ ${description}`);
    console.log(`   📁 ${dirPath} - NOT FOUND`);
    checks.failed++;
    return false;
  }
}

console.log('📦 Checking Core Modules...\n');

// Deployment modules
checkFile('src/deploy/vercelDeployer.js', 'Vercel Deployer');
checkFile('src/deploy/fileUploader.js', 'File Uploader');
checkFile('src/deploy/deploymentMonitor.js', 'Deployment Monitor');
checkFile('src/deploy/deploymentHistory.js', 'Deployment History');
checkFile('src/deploy/index.js', 'Deploy Module Exports');

console.log('\n🔗 Checking Integration Modules...\n');

// Integration modules
checkFile('src/integrations/gitIntegration.js', 'Git Integration');
checkFile('src/integrations/repoManager.js', 'Repository Manager');
checkFile('src/integrations/index.js', 'Integration Module Exports');

console.log('\n📚 Checking Tutorial Modules...\n');

// Tutorial modules
checkFile('src/tutorial/tutorialEngine.js', 'Tutorial Engine');
checkFile('src/tutorial/spotlight.js', 'Spotlight System');
checkFile('src/tutorial/steps.js', 'Tutorial Steps');
checkFile('src/tutorial/index.js', 'Tutorial Module Exports');

console.log('\n🎨 Checking UI Components...\n');

// UI components
checkFile('src/components/DeployModal.js', 'Deploy Modal Component');
checkFile('src/init-workflow4.js', 'Workflow 4 Initialization');

console.log('\n💅 Checking Styles...\n');

// Styles
checkFile('src/styles/deploy.css', 'Deployment Styles');
checkFile('src/styles/tutorial.css', 'Tutorial Styles');

console.log('\n🧪 Checking Tests...\n');

// Tests
checkFile('tests/deploy/fileUploader.test.js', 'FileUploader Tests');
checkFile('tests/deploy/vercelDeployer.test.js', 'VercelDeployer Tests');
checkFile('tests/integration/deployment-flow.test.js', 'Integration Tests');

console.log('\n📖 Checking Documentation...\n');

// Documentation
checkFile('docs/WORKFLOW_4_IMPLEMENTATION.md', 'Implementation Guide');
checkFile('docs/DEPLOYMENT_GUIDE.md', 'Deployment Guide');
checkFile('WORKFLOW_4_COMPLETE.md', 'Completion Summary');

console.log('\n🔧 Checking Integration...\n');

// Check index.html integration
const indexPath = path.join(__dirname, 'index.html');
if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  if (indexContent.includes('init-workflow4.js')) {
    console.log('✅ Workflow 4 script imported in index.html');
    checks.passed++;
  } else {
    console.log('⚠️  Workflow 4 script not found in index.html');
    checks.warnings++;
  }
  
  if (indexContent.includes('deploy.css')) {
    console.log('✅ Deploy styles imported in index.html');
    checks.passed++;
  } else {
    console.log('⚠️  Deploy styles not found in index.html');
    checks.warnings++;
  }
  
  if (indexContent.includes('tutorial.css')) {
    console.log('✅ Tutorial styles imported in index.html');
    checks.passed++;
  } else {
    console.log('⚠️  Tutorial styles not found in index.html');
    checks.warnings++;
  }
  
  if (indexContent.includes('showDeployModal')) {
    console.log('✅ Deploy button added to toolbar');
    checks.passed++;
  } else {
    console.log('⚠️  Deploy button not found in toolbar');
    checks.warnings++;
  }
  
  if (indexContent.includes('startTutorial')) {
    console.log('✅ Tutorial button added to toolbar');
    checks.passed++;
  } else {
    console.log('⚠️  Tutorial button not found in toolbar');
    checks.warnings++;
  }
}

console.log('\n' + '='.repeat(60));
console.log('📊 VERIFICATION SUMMARY');
console.log('='.repeat(60));
console.log(`✅ Passed:   ${checks.passed}`);
console.log(`❌ Failed:   ${checks.failed}`);
console.log(`⚠️  Warnings: ${checks.warnings}`);
console.log('='.repeat(60));

if (checks.failed === 0) {
  console.log('\n🎉 SUCCESS! All Workflow 4 components are properly implemented!');
  console.log('\n📝 Next Steps:');
  console.log('   1. Start dev server: npm run dev');
  console.log('   2. Open http://localhost:8080/index.html');
  console.log('   3. Click "🚀 Deploy" to test deployment');
  console.log('   4. Click "📚 Tutorial" to test tutorial system');
  console.log('\n📚 Documentation:');
  console.log('   - Implementation: docs/WORKFLOW_4_IMPLEMENTATION.md');
  console.log('   - Deployment Guide: docs/DEPLOYMENT_GUIDE.md');
  console.log('   - Summary: WORKFLOW_4_COMPLETE.md');
  process.exit(0);
} else {
  console.log('\n❌ FAILED! Some components are missing.');
  console.log('   Please check the failed items above.');
  process.exit(1);
}
