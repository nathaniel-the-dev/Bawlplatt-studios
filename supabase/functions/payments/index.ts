// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/v135/@supabase/functions-js@2.4.1/src/edge-runtime.d.ts" />

import { load } from 'https://deno.land/std@0.224.0/dotenv/mod.ts';
import { promisify } from 'https://deno.land/x/promisify@v0.1.0/mod.ts';
import braintree from 'npm:braintree@3';
import supabase from 'https://esm.sh/@supabase/supabase-js@2.43.4';

const env = await load();

Deno.serve(async (req) => {
    const data = await req.json();

    const gateway = new braintree.BraintreeGateway({
        environment: braintree.Environment.Sandbox,
        // Use your own credentials from the sandbox Control Panel here
        merchantId: env['BRAINTREE_MERCHANT_ID'],
        publicKey: env['BRAINTREE_PUBLIC_KEY'],
        privateKey: env['BRAINTREE_PRIVATE_KEY'],
    });
    const makeSale = promisify(gateway.transaction.sale);

    // Use the payment method nonce here
    const nonceFromTheClient = data.paymentMethodNonce;

    try {
        if (!nonceFromTheClient) {
            throw new Error('No payment method nonce provided');
        }
        if (!data.bookingId) {
            throw new Error('No booking id provided');
        }
        if (!data.totalAmount) {
            throw new Error('No amount provided');
        }

        // Create a new transaction
        const result = await makeSale({
            amount: data.totalAmount || '0.00',
            paymentMethodNonce: nonceFromTheClient,
            options: {
                // This option requests the funds from the transaction
                // once it has been authorized successfully
                submitForSettlement: true,
            },
        });

        if (result) {
            // Create a new transaction in your database
            const supabaseClient = supabase.createClient(
                env['SUPABASE_URL'],
                env['SUPABASE_KEY']
            );
            await supabaseClient.from('transactions').insert({
                booking: data.bookingId,
                amount: data.totalAmount,
                type: 'online',
                transaction_date: new Date().toISOString(),
            });

            return new Response(JSON.stringify(result), {
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            throw new Error('Something went wrong');
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/payments' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
