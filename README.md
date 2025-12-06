# QRL - Fast QR Code Generator

<div align="center">

![QRL Banner](og-image.svg)

**🚀 Generate branded QR codes instantly with PNG/SVG downloads and custom branding**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Pages](https://img.shields.io/badge/deployed-GitHub%20Pages-blue)](https://np-nandanpatil.github.io/QRL)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Live Demo](https://np-nandanpatil.github.io/QRL) · [Report Bug](https://github.com/np-nandanpatil/QRL/issues) · [Request Feature](https://github.com/np-nandanpatil/QRL/issues)

</div>

---

## ✨ Features

- 🎨 **Custom Branding**: Customize foreground and background colors
- 📦 **Multiple Formats**: Download as PNG or SVG
- 📐 **Flexible Sizes**: 256px, 512px, or 1024px options
- 💾 **Smart History**: Auto-saves recent QR codes locally
- 📱 **Full Responsive**: Works seamlessly on all devices
- 🌙 **Dark Theme**: Beautiful dark mode design
- ♿ **Accessible**: ARIA labels and keyboard navigation
- 🔒 **Privacy-First**: All processing happens client-side
- ⚡ **Lightning Fast**: Instant generation with no server delays
- 🎯 **SEO Optimized**: Comprehensive meta tags and schema.org markup

## 🚀 Quick Start

### Use Online

Simply visit [https://np-nandanpatil.github.io/QRL](https://np-nandanpatil.github.io/QRL) and start generating QR codes!

### Local Development

```bash
# Clone the repository
git clone https://github.com/np-nandanpatil/QRL.git
cd QRL

# Serve locally (choose any method)
# Using Python
python -m http.server 8000

# Or using Node.js
npx http-server

# Open http://localhost:8000 in your browser
```

## 📖 How to Use

1. **Enter URL**: Paste your destination URL in the input field
2. **Customize**: Choose format (PNG/SVG), size, and colors
3. **Generate**: Click "Generate QR" button
4. **Download**: Click the download button to save your QR code
5. **Share**: Use the share button to share via native sharing or copy the link

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **QR Library**: [qrcode.js](https://github.com/davidshimjs/qrcodejs)
- **Fonts**: [Inter](https://fonts.google.com/specimen/Inter) from Google Fonts
- **Hosting**: GitHub Pages / Cloudflare Pages
- **Analytics**: Cloudflare Functions (optional)

## 📁 Project Structure

```
QRL/
├── index.html          # Main application page
├── script.js           # Application logic
├── styles.css          # Styling
├── privacy.html        # Privacy policy
├── terms.html          # Terms of service
├── 404.html            # Custom error page
├── sitemap.xml         # SEO sitemap
├── robots.txt          # Search engine directives
├── site.webmanifest    # PWA manifest
├── favicon.svg         # Site icon
├── og-image.svg        # Social media preview image
├── humans.txt          # Credits and team info
├── _headers            # Security headers (Cloudflare)
├── LICENSE             # MIT License
├── README.md           # This file
├── CONTRIBUTING.md     # Contribution guidelines
├── CHANGELOG.md        # Version history
└── functions/          # Cloudflare Functions
    └── api/
        └── events.js   # Analytics endpoint
```

## 🔒 Security

QRL takes security seriously:

- **Client-side processing**: No data sent to servers
- **URL sanitization**: Validates and sanitizes all inputs
- **Security headers**: CSP, X-Frame-Options, XSS protection
- **HTTPS only**: Enforced secure connections
- **No tracking**: Privacy-first approach

## ♿ Accessibility

- **Keyboard navigation**: Full keyboard support
- **Screen reader friendly**: Proper ARIA labels
- **High contrast**: WCAG AA compliant colors
- **Reduced motion**: Respects user preferences

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting PRs.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Nandan Patil**

- GitHub: [@np-nandanpatil](https://github.com/np-nandanpatil)

## 🙏 Acknowledgments

- [qrcode.js](https://github.com/davidshimjs/qrcodejs) for the QR generation library
- [Google Fonts](https://fonts.google.com/) for the Inter font family
- Cloudflare for edge infrastructure (if using Cloudflare Pages)

## 📊 Project Stats

- Pure vanilla JavaScript - no frameworks
- < 50KB total size (excluding external libraries)
- 100% client-side processing
- Mobile-first responsive design

---

<div align="center">

**[⬆ Back to Top](#qrl---fast-qr-code-generator)**

Made with ❤️ by [Nandan Patil](https://github.com/np-nandanpatil)

</div>