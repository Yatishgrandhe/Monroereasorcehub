import { config } from 'dotenv';
import { updateComprehensiveData } from '../lib/comprehensive-data-update';

// Load environment variables
config({ path: '.env.local' });

async function main() {
  console.log('🔄 Starting comprehensive data update...');
  await updateComprehensiveData();
  console.log('✅ Comprehensive data update completed!');
  process.exit(0);
}

main().catch((error) => {
  console.error('❌ Comprehensive data update failed:', error);
  process.exit(1);
});
