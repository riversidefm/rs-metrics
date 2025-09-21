#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

/**
 * Wait for database to be ready before proceeding
 */
async function waitForDatabase() {
  console.log('🔄 Waiting for database to be ready...');
  
  // Load environment variables
  require('dotenv').config();
  
  const maxAttempts = 30;
  const delayMs = 2000;
  
  // Extract database connection info from DATABASE_URL or env vars
  const dbUrl = process.env.DATABASE_URL;
  const dbUser = process.env.POSTGRES_USER || 'rs-metrics';
  const dbHost = 'localhost';
  const dbPort = process.env.POSTGRES_PORT || '5434';
  const dbName = process.env.POSTGRES_DB || 'rs-metrics_db';
  
  console.log(`🔍 Checking database connection: ${dbUser}@${dbHost}:${dbPort}/${dbName}`);
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // Use pg_isready to check PostgreSQL availability
      const checkCmd = `docker exec rs-metrics-service-postgres pg_isready -h localhost -U ${dbUser}`;
      execSync(checkCmd, { stdio: 'ignore' });
      
      console.log(`✅ Database is ready! (attempt ${attempt}/${maxAttempts})`);
      return true;
    } catch (error) {
      console.log(`⏳ Database not ready yet (attempt ${attempt}/${maxAttempts})`);
      
      if (attempt === maxAttempts) {
        console.error('❌ Database failed to become ready within timeout');
        
        // Show helpful debug information
        console.log('\n🔧 Debug information:');
        try {
          execSync('docker compose ps', { stdio: 'inherit' });
        } catch (e) {
          console.log('Could not get container status');
        }
        
        console.log('\n💡 Try these commands:');
        console.log('  npm run infra:status  # Check container status');
        console.log('  npm run infra:logs    # Check logs');
        console.log('  npm run setup:clean   # Clean restart');
        
        process.exit(1);
      }
      
      // Wait before next attempt
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}

// Handle errors gracefully
process.on('uncaughtException', (error) => {
  console.error('❌ Script error:', error.message);
  process.exit(1);
});

// Run the wait function
waitForDatabase().catch((error) => {
  console.error('❌ Failed to wait for database:', error.message);
  process.exit(1);
});