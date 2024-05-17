const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const targetPath = './src/environments/environment.ts';

const config = `
export const environment = {
    production: ${process.env['NODE_ENV'] === 'production'},
    debug: ${process.env['DEBUG_MODE'] === 'true'},
    SUPABASE_URL: '${process.env['SUPABASE_URL']}',
    SUPABASE_KEY: '${process.env['SUPABASE_KEY']}',
    SERVICE_ROLE_KEY: '${process.env['SERVICE_ROLE_KEY']}',
};
`;

fs.writeFileSync(targetPath, config, 'utf-8');
console.log('Successfully set environment!');
