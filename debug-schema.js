const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema() {
    const { data, error } = await supabase.from('orders').select('*').limit(1);
    if (error) {
        console.error('Error:', error);
        return;
    }
    if (data && data.length > 0) {
        console.log('Columns:', Object.keys(data[0]));
    } else {
        console.log('No data found in orders table, check table definition via API if possible.');
        // Try to insert a dummy row to see what fails or check if we can get columns another way
        const { data: cols, error: colError } = await supabase.rpc('get_table_columns', { table_name: 'orders' });
        if (colError) console.error('RPC Error (expected if not defined):', colError.message);
        else console.log('Columns from RPC:', cols);
    }
}

checkSchema();
