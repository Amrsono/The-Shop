import { supabase } from './lib/supabase';

async function test() {
    const { data, error } = await supabase.from('orders').select('*').limit(1);
    console.log(JSON.stringify(data, null, 2));
}

test();
