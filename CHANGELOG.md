# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-06

### Added
- Initial release of QRL (QR Flux)
- QR code generation in PNG and SVG formats
- Customizable QR code colors (foreground and background)
- Multiple size options (256px, 512px, 1024px)
- URL validation and sanitization
- Local history storage for recent QR codes
- Download functionality for generated QR codes
- Share functionality via Web Share API
- Copy URL to clipboard feature
- Responsive design with mobile-first approach
- Dark mode theme
- Accessibility features (ARIA labels, keyboard navigation)
- SEO optimization (meta tags, schema.org markup, sitemap)
- Privacy policy and terms of service pages
- Cloudflare Functions integration for analytics
- PWA manifest for installability
- Custom 404 error page
- Security headers configuration
- Comprehensive documentation

### Security
- Content Security Policy headers
- X-Frame-Options protection
- XSS protection headers
- URL sanitization to prevent malicious inputs
- Client-side only processing (privacy-friendly)

### Performance
- Edge-optimized delivery via Cloudflare
- Lazy loading of external scripts
- Optimized asset delivery
- Minimal dependencies
