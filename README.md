# MaskFit AR integration samples

Runnable reference implementations for integrating with the [MaskFit AR API](https://portal.maskfitar.com/api/docs/). Each sample is self-contained with its own README and setup instructions.

| Sample | Stack | What it shows |
| --- | --- | --- |
| [`nextynext/`](nextynext/) | Next.js 16 · React 19 · Chakra UI | Authenticating with the API, acquiring a face-scan link (`/scan`), and rendering a patient questionnaire in your own UI with the Questionnaire API (`/questionnaire`) |

See [`nextynext/README.md`](nextynext/README.md) for setup and a walkthrough of each example.

All samples keep the MaskFit API credential on the server side — it must never be shipped to a browser.
