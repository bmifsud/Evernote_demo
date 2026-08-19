# Evernote E2E Automation Framework

A production-grade TypeScript test automation framework built with Playwright for Evernote Web, covering UI, API, session state handling, and CI execution.

## 🚀 Key Features
- **Page Object Model (POM)**: Complete separation of test logic from page selectors and actions.
- **Unified UI & API Engine**: Fast pre-flight setup/teardowns using Playwright API client.
- **Trace & Artifact Diagnostics**: Full traces, screenshots, and videos recorded automatically on test failure.
- **GitHub Actions Ready**: Fully containerized CI runner with parallel execution and HTML artifact uploading.

## 📦 Prerequisites
- Node.js (v18 or higher)
- npm or yarn

## 🛠 Setup & Installation
1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/<your-username>/evernote-playwright-framework.git
   cd evernote-playwright-framework
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Install Playwright browser binaries:
   \`\`\`bash
   npx playwright install --with-deps
   \`\`\`
4. Configure environment variables:
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   Edit `.env` with valid credentials:
   \`\`\`env
   BASE_URL=https://www.evernote.com
   EVERNOTE_VALID_EMAIL=bernard.mifsud@gmail.com
   EVERNOTE_VALID_PASSWORD=q~Wk%R/XPNy~6<j
   \`\`\`

## 🧪 Running Tests Locally
- Run all tests across configured browsers:
  \`\`\`bash
  npm test
  \`\`\`
- Run tests in headed browser mode:
  \`\`\`bash
  npm run test:headed
  \`\`\`
- Run interactive UI mode (debugger & locator picker):
  \`\`\`bash
  npm run test:ui
  \`\`\`
- View test execution reports:
  \`\`\`bash
  npm run report
  \`\`\`
