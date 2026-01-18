# Windsurf Token Diagnostic Prompt – Investigate Current Token

---

## Objective

You are a diagnostic agent. Your job is to investigate why the current Sanity API token is failing authentication.

**Do NOT create a new token yet.** First, let's understand what's wrong with the current one.

---

## Context

- **Project ID:** oz82ztaw
- **Current token (from .env.local):** `skD6phXDuQPo...` (first 20 chars match)
- **Error:** "Unauthorized - Session not found"
- **Goal:** Figure out why this token was rejected

---

## Investigation Steps

### Step 1: Test Basic Token Validity

Run this Node.js test:

```javascript
const config = require('./image-upload-config.json');
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: config.sanity.projectId,
  dataset: config.sanity.dataset,
  token: config.sanity.apiToken,
  useCdn: false,
  apiVersion: '2024-01-01'
});

// Test 1: Check if token is even valid
console.log('\n=== TEST 1: Basic Connection ===');
client.request({ uri: '/users/me' })
  .then(user => {
    console.log('✓ Token is VALID');
    console.log('  User ID:', user._id);
    console.log('  Name:', user.displayName || 'N/A');
  })
  .catch(err => {
    console.log('✗ Token INVALID or REVOKED');
    console.log('  Error status:', err.statusCode);
    console.log('  Error message:', err.message);
    if (err.statusCode === 401) {
      console.log('  → Token is expired, revoked, or invalid');
    }
    if (err.message.includes('Session not found')) {
      console.log('  → Session-specific issue (token may be for different project)');
    }
  });

// Test 2: Check project access
console.log('\n=== TEST 2: Project Access ===');
setTimeout(() => {
  client.request({ uri: `/projects/${config.sanity.projectId}` })
    .then(() => {
      console.log('✓ Can access project oz82ztaw');
    })
    .catch(err => {
      console.log('✗ Cannot access project oz82ztaw');
      console.log('  Error:', err.message);
      console.log('  → Token may be for a different project');
    });
}, 1000);

// Test 3: Check dataset access
console.log('\n=== TEST 3: Dataset Access ===');
setTimeout(() => {
  client.request({ uri: `/projects/${config.sanity.projectId}/datasets/${config.sanity.dataset}` })
    .then(() => {
      console.log('✓ Can access dataset "production"');
    })
    .catch(err => {
      console.log('✗ Cannot access dataset');
      console.log('  Error:', err.message);
    });
}, 2000);

// Test 4: Check asset permissions
console.log('\n=== TEST 4: Asset Permissions ===');
setTimeout(() => {
  // Try a read-only asset operation first
  client.request({ 
    uri: `/assets?limit=1`,
    method: 'GET'
  })
    .then(() => {
      console.log('✓ Can read assets');
    })
    .catch(err => {
      console.log('✗ Cannot read assets');
      console.log('  Error:', err.message);
      console.log('  → May need asset.read permission');
    });
}, 3000);
```

Run it:
```bash
node diagnostic-test.js
```

### Step 2: Check Token Format

Verify the token stored in `image-upload-config.json`:

```javascript
const config = require('./image-upload-config.json');
console.log('Token in config:');
console.log('  Starts with: sk-' + config.sanity.apiToken.substring(3, 20) + '...');
console.log('  Length:', config.sanity.apiToken.length);
console.log('  Valid format:', config.sanity.apiToken.startsWith('sk-'));
```

### Step 3: Compare with .env.local

Read `.env.local` and compare:

```javascript
const fs = require('fs');
const envContent = fs.readFileSync('.env.local', 'utf-8');
const envMatch = envContent.match(/SANITY_API_TOKEN=(.+)/);

if (envMatch) {
  const envToken = envMatch[1].trim();
  const configToken = require('./image-upload-config.json').sanity.apiToken;
  
  console.log('\n=== TOKEN COMPARISON ===');
  console.log('From .env.local:', envToken.substring(0, 30) + '...');
  console.log('In config file:', configToken.substring(0, 30) + '...');
  console.log('Match:', envToken === configToken ? '✓ EXACT MATCH' : '✗ DIFFERENT');
  
  if (envToken !== configToken) {
    console.log('\n⚠️  MISMATCH FOUND!');
    console.log('The token in image-upload-config.json does NOT match .env.local');
    console.log('This could be why authentication is failing.');
    console.log('\nProposed fix:');
    console.log('Update image-upload-config.json to use the token from .env.local');
  }
} else {
  console.log('✗ SANITY_API_TOKEN not found in .env.local');
}
```

### Step 4: Report Findings

Based on the tests above, report:

1. **Is the token valid?** (Test 1)
   - ✓ Valid → token works
   - ✗ Invalid → token is revoked/expired
   - ✗ Session not found → token is for wrong project

2. **Can we access the project?** (Test 2)
   - ✓ Yes → project access OK
   - ✗ No → token may be for different project

3. **Can we access the dataset?** (Test 3)
   - ✓ Yes → dataset access OK
   - ✗ No → token doesn't have dataset access

4. **Can we access assets?** (Test 4)
   - ✓ Yes → can upload files
   - ✗ No → token missing asset permissions

5. **Do tokens match?** (Step 3)
   - ✓ Yes → they're identical
   - ✗ No → config file has wrong token, use .env.local version

---

## Possible Outcomes & Solutions

### Outcome A: Token is valid, but config has WRONG token

**Evidence:** 
- Test 1: ✗ fails (config token is bad)
- Token comparison: ✗ doesn't match .env.local

**Fix:**
- Update `image-upload-config.json` to use the correct token from `.env.local`

### Outcome B: Token is revoked/expired

**Evidence:**
- Test 1: ✗ fails with "401 Unauthorized"
- Token comparison: ✓ matches .env.local

**Fix:**
- Token needs to be regenerated in Sanity dashboard (unavoidable)

### Outcome C: Token is for wrong project

**Evidence:**
- Test 1: ✗ "Session not found"
- Test 2: ✗ "Cannot access project oz82ztaw"

**Fix:**
- Token needs to be for project oz82ztaw (regenerate)

### Outcome D: Token is valid but missing permissions

**Evidence:**
- Test 1: ✓ works
- Test 4: ✗ cannot read/write assets

**Fix:**
- Regenerate token and enable all permissions: Read, Write, Assets (Create, Delete, Manage)

---

## Execute This Now

1. Create the diagnostic test above
2. Run: `node diagnostic-test.js`
3. Run the token format check
4. Run the token comparison
5. Report all findings

Do NOT create a new token until we know why the current one failed.

---

## Go!

Start the diagnostics now and report what you find.
