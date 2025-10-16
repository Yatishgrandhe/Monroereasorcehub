import { config } from 'dotenv';
import { updateRealData } from '../lib/update-real-data';

// Load environment variables
config({ path: '.env.local' });

async function main() {
  console.log('🔄 Starting real data update...');
  await updateRealData();
  console.log('✅ Real data update completed!');
  process.exit(0);
}

main().catch((error) => {
  console.error('❌ Real data update failed:', error);
  process.exit(1);
});
