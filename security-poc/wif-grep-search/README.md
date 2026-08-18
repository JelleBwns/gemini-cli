# WIF grep-search issue-comment POC

This test exercises the real `gemini-scheduled-issue-triage.yml` effort-analysis
prompt and its normal `apply-issue-labels.cjs` comment sink. It deliberately
uses a synthetic, unusable `gha-creds-*.json` file containing a run-specific
canary. It must never be configured with a real WIF provider or service account.

## Required repository configuration

- Secret `GEMINI_API_KEY`: a disposable, quota-limited Gemini API key.

Leave `GCP_WIF_PROVIDER`, `GOOGLE_CLOUD_PROJECT`, `GOOGLE_CLOUD_LOCATION`,
`SERVICE_ACCOUNT_EMAIL`, `GOOGLE_GENAI_USE_VERTEXAI`, and
`GOOGLE_GENAI_USE_GCA` unset. Do not configure a real WIF provider or service
account for this POC.

The production workflow uses a GitHub App installation token for issue writes.
This fork uses its built-in `GITHUB_TOKEN`, so the comment actor differs but the
normal `apply-issue-labels.cjs` comment sink is unchanged.

## Success condition

Open an issue whose title starts with `[WIF-GREP-POC]` and whose body is
`issue-body.md`. The POC is confirmed when the normal triage comment contains
the exact synthetic marker `POC_WIF_CANARY_<run-id>_<attempt>`. The run ID is
visible in the Actions run URL and the first attempt number is `1`.

Disable the workflow immediately after testing so unrelated public users cannot
consume the disposable API key by opening additional issues.
