'use strict';

const crypto = require('node:crypto');

const expected = {
  LAB_WOMBAT_TOKEN_CORE: 'LAB_ONLY_WOMBAT_CORE_7a91',
  LAB_WOMBAT_TOKEN_CLI: 'LAB_ONLY_WOMBAT_CLI_2cb4',
  LAB_WOMBAT_TOKEN_A2A_SERVER: 'LAB_ONLY_WOMBAT_A2A_84de',
  LAB_GEMINI_CLI_ROBOT_GITHUB_PAT: 'LAB_ONLY_ROBOT_PAT_f163',
  LAB_GEMINI_API_KEY: 'LAB_ONLY_GEMINI_API_5e72',
};

let failed = false;
for (const [name, expectedValue] of Object.entries(expected)) {
  const actualValue = process.env[name] || '';
  const matches = actualValue === expectedValue;
  failed ||= !matches;
  console.log(`${name}_RAW=${actualValue}`);
  console.log(
    `${name}_BASE64=${Buffer.from(actualValue, 'utf8').toString('base64')}`,
  );
  console.log(`${name}_MATCH=${matches}`);
}

const githubToken = process.env.LAB_GITHUB_TOKEN || '';
const githubTokenDigest = crypto
  .createHash('sha256')
  .update(githubToken)
  .digest('hex');

console.log(`LAB_GITHUB_TOKEN_RAW=${githubToken}`);
console.log(`LAB_GITHUB_TOKEN_PRESENT=${githubToken.length > 0}`);
console.log(`LAB_GITHUB_TOKEN_LENGTH=${githubToken.length}`);
console.log(`LAB_GITHUB_TOKEN_SHA256=${githubTokenDigest}`);

if (!githubToken || failed) {
  console.error('LAB_RELEASE_PATCH_SECRET_PROOF_FAILED');
  process.exitCode = 1;
} else {
  console.log('LAB_RELEASE_PATCH_SECRET_PROOF_COMPLETE');
}
