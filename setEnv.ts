const fs = require('fs');
const dotenv = require('dotenv');

const { parsed: env } = dotenv.config({ path: './.env' });

const targetPath = './src/environments/environment.ts';

const config = `
export const environment = {
    production: ${env['NODE_ENV'] === 'production'},
    debug: ${env['DEBUG_MODE'] === 'true'},
    SUPABASE_URL: '${env['SUPABASE_URL']}',
    SUPABASE_KEY: '${env['SUPABASE_KEY']}',
    SERVICE_ROLE_KEY: '${env['SERVICE_ROLE_KEY']}',
    BRAINTREE_SDK_TOKEN: '${env['BRAINTREE_SDK_TOKEN']}',
};
`;

fs.writeFileSync(targetPath, config, 'utf-8');
console.log('Successfully set environment!');
