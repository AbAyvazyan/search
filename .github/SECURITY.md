# Security

## Snyk Integration

This project uses Snyk for security vulnerability scanning. Snyk offers a **free tier** for individual developers and small teams.

### Free Tier Features:

- ✅ Vulnerability scanning for dependencies
- ✅ License compliance checking
- ✅ Basic security reports
- ✅ GitHub integration
- ✅ Limited scans per month (sufficient for most projects)

### Setup Instructions:

#### Option 1: Use Snyk Free (No Token Required)

The workflows will automatically run Snyk scans without requiring any setup. This provides basic security scanning.

#### Option 2: Enhanced Snyk (With Token)

For enhanced features and unlimited scans:

1. **Get a free Snyk account:**
   - Go to [snyk.io](https://snyk.io)
   - Sign up for a free account
   - Get your API token from account settings

2. **Add token to GitHub Secrets:**
   - Go to your GitHub repository
   - Navigate to Settings → Secrets and variables → Actions
   - Add a new secret named `SNYK_TOKEN`
   - Paste your Snyk API token

3. **Enhanced features with token:**
   - Unlimited scans
   - Detailed vulnerability reports
   - GitHub Code Scanning integration
   - Advanced security insights

### Security Workflows:

- **`security-scan.yml`**: Dedicated security scanning with Snyk
- **`ci.yml`**: Includes Snyk in the main CI pipeline
- **Daily scans**: Automatic security monitoring
- **PR checks**: Security validation on every pull request

### What Snyk Scans:

- ✅ **Dependencies**: npm packages for known vulnerabilities
- ✅ **License compliance**: Check for problematic licenses
- ✅ **Docker images**: Container security (if applicable)
- ✅ **Infrastructure**: IaC security (if applicable)

### Free Tier Limits:

- **200 tests per month** (usually sufficient for small projects)
- **Basic vulnerability database**
- **Community support**

### Upgrading:

If you need more scans or advanced features:

- **Team Plan**: $25/month per product
- **Enterprise Plan**: Custom pricing for large organizations

## Other Security Measures:

- **npm audit**: Built-in Node.js security scanning
- **ESLint security rules**: Code-level security checks
- **Pre-commit hooks**: Security validation before commits
- **Dependency updates**: Automated security patches

## Reporting Security Issues:

If you find a security vulnerability, please:

1. **Do not** create a public issue
2. Email security concerns privately
3. Use GitHub's private vulnerability reporting

---

**Note**: All security scans are configured to not fail the build, ensuring your CI/CD pipeline remains stable while providing security insights.
