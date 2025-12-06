/**
 * QRL - QR Code Generator
 * Production-ready QR code generation with PNG/SVG support
 * @author Nandan Patil
 * @license MIT
 */

const form = document.getElementById("qrForm");
const canvas = document.getElementById("qrCanvas");
const svgContainer = document.getElementById("qrSvg");
const downloadBtn = document.getElementById("downloadBtn");
const shareBtn = document.getElementById("shareBtn");
const copyBtn = document.getElementById("copyBtn");
const copyQRBtn = document.getElementById("copyQRBtn");
const statusMessage = document.getElementById("statusMessage");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const yearEl = document.getElementById("year");
const shareDialog = document.getElementById("shareDialog");
const shareDialogText = document.getElementById("shareDialogText");
const sidebar = document.querySelector(".sidebar");
const sidebarOverlay = document.querySelector(".sidebar-overlay");
const toggleSidebarBtn = document.getElementById("toggleSidebarBtn");

// Configuration constants
const HISTORY_KEY = "qr-flux-history";
const MAX_HISTORY = 10;
const PREVIEW_SIZE = 320;
let currentObjectUrl = null;
let currentQRData = null; // Store current QR data for clipboard copy

/**
 * Load QR code history from localStorage
 * @returns {Array} Array of history items
 */
const loadHistory = () => {
  const stored = localStorage.getItem(HISTORY_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {
    console.error("Failed to parse history:", e);
  }
  return [];
};

/**
 * Persist history to localStorage
 * @param {Array} items - History items to save
 */
const persistHistory = items => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, MAX_HISTORY)));
  } catch (e) {
    console.error("Failed to save history:", e);
    setStatus("Unable to save to history. Storage may be full.", true);
  }
};

/**
 * Format ISO date to locale string
 * @param {string} iso - ISO date string
 * @returns {string} Formatted date string
 */
const formatDate = iso => {
  const date = new Date(iso);
  return date.toLocaleString(undefined, { hour: "numeric", minute: "2-digit", month: "short", day: "numeric" });
};

const renderHistory = () => {
  const items = loadHistory();
  historyList.innerHTML = "";
  if (!items.length) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "No QR codes yet. Generate one to see it here.";
    historyList.appendChild(emptyItem);
    return;
  }
  items.forEach(item => {
    const li = document.createElement("li");
    const meta = document.createElement("div");
    meta.className = "meta";
    const title = document.createElement("strong");
    title.textContent = item.url;
    const detail = document.createElement("span");
    detail.textContent = `${item.format.toUpperCase()} · ${item.size}px · ${formatDate(item.createdAt)} · FG ${item.color} / BG ${item.background || "#ffffff"}`;
    meta.appendChild(title);
    meta.appendChild(detail);
    const actions = document.createElement("div");
    actions.className = "actions";
    const reuseBtn = document.createElement("button");
    reuseBtn.type = "button";
    reuseBtn.textContent = "Reuse";
    reuseBtn.addEventListener("click", () => {
      document.getElementById("urlInput").value = item.url;
      document.getElementById("formatSelect").value = item.format;
      document.getElementById("sizeSelect").value = String(item.size);
      document.getElementById("colorInput").value = item.color;
      document.getElementById("bgColorInput").value = item.background || "#ffffff";

      // Close the sidebar first
      closeSidebar();

      // Trigger form submission
      form.requestSubmit();
    });
    const shareBtn = document.createElement("button");
    shareBtn.type = "button";
    shareBtn.textContent = "Copy";
    shareBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(item.url);
        setStatus("Link copied from history.");
      } catch (err) {
        console.error(err);
        setStatus("Clipboard permissions denied.", true);
      }
    });
    actions.appendChild(reuseBtn);
    actions.appendChild(shareBtn);
    li.appendChild(meta);
    li.appendChild(actions);
    historyList.appendChild(li);
  });
  if (items.length && sidebar) sidebar.setAttribute("aria-hidden", sidebar.getAttribute("data-visible") === "true" ? "false" : sidebar.getAttribute("aria-hidden"));
};

/**
 * Display status message to user
 * @param {string} message - Message to display
 * @param {boolean} isError - Whether this is an error message
 */
const setStatus = (message, isError = false) => {
  statusMessage.textContent = message;
  statusMessage.style.color = isError ? "#f87171" : "#38f8c0";
  // Announce to screen readers
  statusMessage.setAttribute("role", isError ? "alert" : "status");
};

/**
 * Sanitize and validate URL input
 * @param {string} value - URL to sanitize
 * @returns {string|null} Sanitized URL or null if invalid
 */
const sanitizeUrl = value => {
  if (!value) return null;
  const trimmed = value.trim();

  // Add https:// if no protocol specified
  let urlString = trimmed;
  if (!/^https?:\/\//i.test(trimmed)) {
    urlString = `https://${trimmed}`;
  }

  try {
    const url = new URL(urlString);
    if (!url.protocol.startsWith("http")) {
      return null;
    }
    return url.toString();
  } catch (err) {
    console.error("URL validation error:", err);
    return null;
  }
};

const revokeObjectUrl = () => {
  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = null;
  }
};

/**
 * Generate smart filename from URL and format
 * @param {string} format - File format (png/svg)
 * @param {string} hostname - Hostname from URL
 * @returns {string} Smart filename
 */
const generateFileName = (format, hostname) => {
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const host = hostname ? hostname.replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').slice(0, 40) : "qr";
  return `qr-${host || "qr"}-${date}.${format}`;
};

const enableDownload = (href, filename) => {
  downloadBtn.classList.remove("disabled");
  downloadBtn.setAttribute("aria-disabled", "false");
  downloadBtn.href = href;
  downloadBtn.download = filename;
};

const disableDownload = () => {
  downloadBtn.classList.add("disabled");
  downloadBtn.setAttribute("aria-disabled", "true");
  downloadBtn.removeAttribute("href");
  downloadBtn.removeAttribute("download");
};

const saveHistory = entry => {
  const existing = loadHistory();
  const filtered = existing.filter(item => item.url !== entry.url || item.format !== entry.format || item.size !== entry.size);
  filtered.unshift(entry);
  persistHistory(filtered);
  renderHistory();
};

const postEvent = payload => {
  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).catch(err => console.error(err));
};

const handleGeneration = async event => {
  event.preventDefault();
  const urlInput = document.getElementById("urlInput");
  const formatSelect = document.getElementById("formatSelect");
  const sizeSelect = document.getElementById("sizeSelect");
  const colorInput = document.getElementById("colorInput");
  const bgColorInput = document.getElementById("bgColorInput");
  const errorCorrectionSelect = document.getElementById("errorCorrectionSelect");

  const sanitized = sanitizeUrl(urlInput.value.trim());
  if (!sanitized) {
    setStatus("Enter a valid URL starting with http or https.", true);
    disableDownload();
    return;
  }
  const format = formatSelect.value;
  const size = parseInt(sizeSelect.value, 10) || 512;
  const color = colorInput.value || "#000000";
  const background = bgColorInput.value || "#ffffff";
  const errorCorrectionLevel = errorCorrectionSelect ? errorCorrectionSelect.value : "M";

  setStatus("Generating QR code...");
  disableDownload();
  revokeObjectUrl();
  try {
    const qrOptions = {
      width: size,
      margin: 1,
      color: { dark: color, light: background },
      errorCorrectionLevel: errorCorrectionLevel
    };

    if (format === "png") {
      await QRCode.toCanvas(canvas, sanitized, qrOptions);
      canvas.classList.remove("hidden");
      canvas.style.width = `${PREVIEW_SIZE}px`;
      canvas.style.height = `${PREVIEW_SIZE}px`;
      svgContainer.classList.add("hidden");
      svgContainer.innerHTML = "";
      const dataUrl = canvas.toDataURL("image/png");
      currentQRData = dataUrl;
      const filename = generateFileName("png", new URL(sanitized).hostname);
      enableDownload(dataUrl, filename);
    } else {
      const svg = await QRCode.toString(sanitized, {
        type: "svg",
        ...qrOptions
      });
      canvas.classList.add("hidden");
      svgContainer.classList.remove("hidden");
      svgContainer.innerHTML = svg;
      const svgEl = svgContainer.querySelector("svg");
      if (svgEl) {
        svgEl.setAttribute("width", PREVIEW_SIZE);
        svgEl.setAttribute("height", PREVIEW_SIZE);
        svgEl.style.width = `${PREVIEW_SIZE}px`;
        svgEl.style.height = `${PREVIEW_SIZE}px`;
      }
      const blob = new Blob([svg], { type: "image/svg+xml" });
      currentObjectUrl = URL.createObjectURL(blob);
      currentQRData = svg;
      const filename = generateFileName("svg", new URL(sanitized).hostname);
      enableDownload(currentObjectUrl, filename);
    }
    saveHistory({
      url: sanitized,
      format,
      size,
      color,
      background,
      errorCorrection: errorCorrectionLevel,
      createdAt: new Date().toISOString()
    });
    setStatus("QR code ready for download.");
    postEvent({ type: "generate", format, size, color, background, errorCorrection: errorCorrectionLevel });
  } catch (err) {
    console.error("QR generation error:", err);
    setStatus("Failed to generate QR code. Please try again.", true);
    disableDownload();
  }
};

const handleShare = async () => {
  const href = downloadBtn.getAttribute("href");
  if (!href) {
    setStatus("Generate a QR code first.", true);
    return;
  }
  const url = document.getElementById("urlInput").value.trim();
  if (navigator.share) {
    try {
      await navigator.share({
        title: "QR Flux",
        text: "Scan this QR code.",
        url
      });
      setStatus("Shared successfully.");
      postEvent({ type: "share" });
    } catch (err) {
      console.error(err);
      setStatus("Share cancelled or unavailable.", true);
    }
  } else {
    shareDialogText.textContent = url;
    shareDialog.showModal();
  }
};

const handleCopy = async () => {
  const url = document.getElementById("urlInput").value.trim();
  if (!url) {
    setStatus("Nothing to copy.", true);
    return;
  }
  try {
    await navigator.clipboard.writeText(url);
    setStatus("Link copied to clipboard.");
  } catch (err) {
    console.error("Clipboard error:", err);
    setStatus("Unable to copy. Please copy manually.", true);
  }
};

const handleClearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
};

const closeSidebar = () => {
  if (!sidebar) return;
  sidebar.setAttribute("data-visible", "false");
  sidebar.setAttribute("aria-hidden", "true");
  document.body.removeAttribute("data-sidebar");
  if (sidebarOverlay) {
    sidebarOverlay.setAttribute("data-visible", "false");
    sidebarOverlay.setAttribute("aria-hidden", "true");
  }
  if (toggleSidebarBtn) {
    toggleSidebarBtn.setAttribute("aria-expanded", "false");
  }
};

const openSidebar = () => {
  if (!sidebar) return;
  sidebar.setAttribute("data-visible", "true");
  sidebar.setAttribute("aria-hidden", "false");
  document.body.setAttribute("data-sidebar", "open");
  if (sidebarOverlay) {
    sidebarOverlay.setAttribute("data-visible", "true");
    sidebarOverlay.setAttribute("aria-hidden", "false");
  }
  if (toggleSidebarBtn) {
    toggleSidebarBtn.setAttribute("aria-expanded", "true");
  }
};

const toggleSidebar = () => {
  if (!sidebar) return;
  const visible = sidebar.getAttribute("data-visible") === "true";
  if (visible) closeSidebar();
  else openSidebar();
};

/**
 * Copy QR code to clipboard
 */
const copyQRToClipboard = async () => {
  if (!currentQRData) {
    setStatus("Generate a QR code first!", true);
    return;
  }

  try {
    const format = document.getElementById("formatSelect").value;

    if (format === "png") {
      // Convert data URL to blob
      const response = await fetch(currentQRData);
      const blob = await response.blob();

      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      setStatus("QR code copied to clipboard! ✓");
    } else {
      // For SVG, copy as text
      await navigator.clipboard.writeText(currentQRData);
      setStatus("SVG code copied to clipboard! ✓");
    }
  } catch (err) {
    console.error("Failed to copy QR:", err);
    setStatus("Copy failed. Please try the download button.", true);
  }
};

/**
 * Keyboard shortcuts handler
 */
const handleKeyboardShortcuts = (event) => {
  // Ctrl/Cmd + Enter: Generate QR
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    form.requestSubmit();
    return;
  }

  // Ctrl/Cmd + S: Download QR
  if ((event.ctrlKey || event.metaKey) && event.key === "s") {
    event.preventDefault();
    if (!downloadBtn.classList.contains("disabled")) {
      downloadBtn.click();
    }
    return;
  }

  // Escape: Close sidebar
  if (event.key === "Escape") {
    if (sidebar.dataset.visible === "true") {
      closeSidebar();
    }
  }
};

// Initialize
form.addEventListener("submit", handleGeneration);
shareBtn.addEventListener("click", () => {
  const url = form.elements.url.value;
  if (!url) return;
  if (navigator.share) {
    navigator.share({ title: "QR Flux", text: `Generated QR code for: ${url}`, url: window.location.href }).catch(e => {
      console.error("Share error:", e);
    });
  } else {
    shareDialogText.textContent = `Copy this link to share: ${window.location.href}`;
    shareDialog.showModal();
  }
});
copyBtn.addEventListener("click", async () => {
  const url = form.elements.url.value;
  if (!url) return;
  try {
    await navigator.clipboard.writeText(url);
    setStatus("URL copied to clipboard! ✓");
  } catch (err) {
    console.error("Copy URL error:", err);
    setStatus("Failed to copy URL", true);
  }
});

// Copy QR button
if (copyQRBtn) {
  copyQRBtn.addEventListener("click", copyQRToClipboard);
}

// Keyboard shortcuts
document.addEventListener("keydown", handleKeyboardShortcuts);

clearHistoryBtn.addEventListener("click", () => {
  if (confirm("Clear all QR code history?")) {
    try {
      localStorage.removeItem(HISTORY_KEY);
      renderHistory();
      setStatus("History cleared");
    } catch (e) {
      console.error("Failed to clear history:", e);
      setStatus("Unable to clear history", true);
    }
  }
});

downloadBtn.addEventListener("click", () => {
  const format = document.getElementById("formatSelect").value;
  const size = parseInt(document.getElementById("sizeSelect").value, 10) || 512;
  postEvent({ type: "download", format, size });
});
if (toggleSidebarBtn) toggleSidebarBtn.addEventListener("click", toggleSidebar);
if (sidebarOverlay) sidebarOverlay.addEventListener("click", closeSidebar);

// Close sidebar button
const closeSidebarBtn = document.getElementById("closeSidebarBtn");
if (closeSidebarBtn) closeSidebarBtn.addEventListener("click", closeSidebar);

yearEl.textContent = new Date().getFullYear();
renderHistory();
window.addEventListener("beforeunload", revokeObjectUrl);

