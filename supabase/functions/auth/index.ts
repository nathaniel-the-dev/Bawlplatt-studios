// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/v135/@supabase/functions-js@2.4.1/src/edge-runtime.d.ts" />

import { load } from 'https://deno.land/std@0.224.0/dotenv/mod.ts';
import supabase from 'https://esm.sh/@supabase/supabase-js@2.43.4';

const env = await load();

Deno.serve(async (req) => {
    // Get code and redirectUrl from the request
    const _url = req.url;

    const url = new URL(_url);
    const code = url.searchParams.get('code');
    const redirectUrl = url.searchParams.get('redirectUrl');

    if (code) {
        const supabaseClient = supabase.createClient(
            env['SUPABASE_URL'],
            env['SUPABASE_KEY']
        );
        await supabaseClient.auth.exchangeCodeForSession(code);
    }

    return Response.redirect(redirectUrl!, 302);
});
