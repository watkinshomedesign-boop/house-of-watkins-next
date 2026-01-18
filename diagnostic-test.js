const fs = require('fs');
const { createClient } = require('@sanity/client');

function maskToken(t) {
  if (!t) return '(missing)';
  const s = String(t).trim();
  if (s.length <= 12) return s.replace(/./g, '*');
  return `${s.slice(0, 8)}...${s.slice(-4)} (len=${s.length})`;
}

function tokenPrefix(t, n = 20) {
  if (!t) return '(missing)';
  const s = String(t).trim();
  return s.slice(0, Math.min(n, s.length));
}

function readEnvToken() {
  const envPath = '.env.local';
  if (!fs.existsSync(envPath)) return null;
  const envContent = fs.readFileSync(envPath, 'utf8');
  const m = envContent.match(/^SANITY_API_TOKEN=(.+)$/m);
  return m ? m[1].trim() : null;
}

async function run() {
  const config = require('./image-upload-config.json');

  console.log('=== CONFIG SUMMARY ===');
  console.log('Project ID:', config?.sanity?.projectId || '(missing)');
  console.log('Dataset  :', config?.sanity?.dataset || '(missing)');

  // Step 2: Check token format (masked)
  console.log('\n=== STEP 2: TOKEN FORMAT (config) ===');
  const cfgToken = config?.sanity?.apiToken ? String(config.sanity.apiToken).trim() : '';
  console.log('Token prefix (first 20):', tokenPrefix(cfgToken, 20));
  console.log('Token masked:', maskToken(cfgToken));
  console.log('Length:', cfgToken.length);
  console.log("Starts with 'sk-':", cfgToken.startsWith('sk-'));
  console.log("Starts with 'sk':", cfgToken.startsWith('sk'));

  // Step 3: Compare with .env.local (masked)
  console.log('\n=== STEP 3: TOKEN COMPARISON (.env.local vs config) ===');
  const envToken = readEnvToken();
  if (!envToken) {
    console.log('✗ SANITY_API_TOKEN not found in .env.local');
  } else {
    console.log('Env token prefix (first 20):', tokenPrefix(envToken, 20));
    console.log('Env token masked:', maskToken(envToken));
    console.log('Config token prefix (first 20):', tokenPrefix(cfgToken, 20));
    console.log('Config token masked:', maskToken(cfgToken));
    console.log('Match:', envToken === cfgToken ? '✓ EXACT MATCH' : '✗ DIFFERENT');
  }

  // Step 1: Basic token validity tests (per prompt) using fixed apiVersion
  console.log('\n=== TEST 1: Basic Connection (/users/me) ===');
  const client = createClient({
    projectId: config.sanity.projectId,
    dataset: config.sanity.dataset,
    token: config.sanity.apiToken,
    useCdn: false,
    apiVersion: '2024-01-01'
  });

  try {
    const user = await client.request({ uri: '/users/me' });
    console.log('✓ Token is VALID');
    console.log('  User ID:', user?._id || 'N/A');
    console.log('  Name:', user?.displayName || 'N/A');
  } catch (err) {
    console.log('✗ Token INVALID or REVOKED');
    console.log('  Error status:', err?.statusCode || 'N/A');
    console.log('  Error message:', err?.message || String(err));
    if (err?.statusCode === 401) {
      console.log('  → Token is expired, revoked, or invalid');
    }
    if ((err?.message || '').includes('Session not found')) {
      console.log('  → Session-specific issue (token may be for different project)');
    }
  }

  console.log('\n=== TEST 2: Project Access (/projects/{projectId}) ===');
  try {
    await client.request({ uri: `/projects/${config.sanity.projectId}` });
    console.log(`✓ Can access project ${config.sanity.projectId}`);
  } catch (err) {
    console.log(`✗ Cannot access project ${config.sanity.projectId}`);
    console.log('  Error status:', err?.statusCode || 'N/A');
    console.log('  Error message:', err?.message || String(err));
    console.log('  → Token may be for a different project, or missing permissions');
  }

  console.log('\n=== TEST 3: Dataset Access (/projects/{projectId}/datasets/{dataset}) ===');
  try {
    await client.request({ uri: `/projects/${config.sanity.projectId}/datasets/${config.sanity.dataset}` });
    console.log(`✓ Can access dataset "${config.sanity.dataset}"`);
  } catch (err) {
    console.log('✗ Cannot access dataset');
    console.log('  Error status:', err?.statusCode || 'N/A');
    console.log('  Error message:', err?.message || String(err));
  }

  console.log('\n=== TEST 4: Asset Permissions (GET /assets?limit=1) ===');
  try {
    await client.request({ uri: '/assets?limit=1', method: 'GET' });
    console.log('✓ Can read assets');
  } catch (err) {
    console.log('✗ Cannot read assets');
    console.log('  Error status:', err?.statusCode || 'N/A');
    console.log('  Error message:', err?.message || String(err));
    console.log('  → May need asset permissions (read/assets.manage)');
  }
}

run().catch((e) => {
  console.error('FATAL:', e?.stack || String(e));
  process.exit(1);
});
