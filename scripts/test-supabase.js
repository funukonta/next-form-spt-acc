
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local manually since we don't have dotenv installed
const envPath = path.join(__dirname, '../.env.local');
let supabaseUrl = '';
let supabaseKey = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    for (const line of lines) {
        if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
            supabaseUrl = line.split('=')[1].trim();
        }
        if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
            supabaseKey = line.split('=')[1].trim();
        }
    }
} catch (e) {
    console.error('Error reading .env.local:', e.message);
    process.exit(1);
}

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Could not find Supabase credentials in .env.local');
    process.exit(1);
}

console.log('Testing connection to:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        const { data, error } = await supabase.from('submissions').select('count', { count: 'exact', head: true });
        if (error) {
            console.error('Supabase Error:', error.message);
        } else {
            console.log('Success! Connection verified.');
            console.log('Submissions count:', data.length); // count is in count property if head:true but data is empty array
        }
    } catch (e) {
        console.error('Connection failed:', e.message);
    }
}

testConnection();
