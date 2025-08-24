// src/pages/AutoCertificateGenerator.jsx
import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";

// Fixed artboard size for crisp export (A4 landscape ratio)
const ARTBOARD_W = 1122;
const ARTBOARD_H = 793;

export default function AutoCertificateGenerator({
  // You can wire these props from backend later
  participant = { id: "U-0001", name: "Muhammad Rizwan" },
  event = {
    id: "EVT-2025-UNITECH",
    title: "University Tech Fest 2025",
    venue: "Main Auditorium, XYZ University",
    dateText: "24 Aug 2025",
  },
  org = { name: "XYZ University", code: "XYZ" },
  certificateId = "XYZ-EVT-2025-UNITECH-REG-2025-001",
  verifyUrl = "https://example.com/verify",
  fileName = "Certificate.pdf",
}) {
  const containerRef = useRef(null);
  const certRef = useRef(null);

  const [scale, setScale] = useState(1);        // responsive screen scale (preview only)
  const [qr, setQr] = useState("");             // QR data URL
  const [downloading, setDownloading] = useState(false);

  // Generate QR once
  useEffect(() => {
    (async () => {
      try {
        const url = `${verifyUrl}?id=${encodeURIComponent(certificateId)}`;
        const dataUrl = await QRCode.toDataURL(url, {
          width: 96,
          margin: 1,
          color: {
            dark: '#0f172a',
            light: '#ffffff'
          }
        });
        setQr(dataUrl);
      } catch (e) {
        console.warn("QR generation failed", e);
        setQr("");
      }
    })();
  }, [verifyUrl, certificateId]);

  // Responsively scale the artboard to the container width
  useEffect(() => {
    const compute = () => {
      const el = containerRef.current;
      if (!el) return;
      const cw = el.clientWidth || ARTBOARD_W;
      const s = Math.min(cw / ARTBOARD_W, 1); // never upscale above 1x
      setScale(s || 1);
      // maintain height so container reserves space
      el.style.height = `${ARTBOARD_H * (s || 1)}px`;
    };
    compute();

    let ro = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(compute);
      if (containerRef.current) ro.observe(containerRef.current);
    }
    window.addEventListener("resize", compute);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, []);

  // Download as PDF (clone at 1:1 to avoid transform/scroll issues)
  const handleDownload = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const src = certRef.current;
      const clone = src.cloneNode(true);

      // normalize the clone for capture with fixed positioning
      Object.assign(clone.style, {
        transform: "none",
        position: "fixed",
        top: "0",
        left: "0",
        width: `${ARTBOARD_W}px`,
        height: `${ARTBOARD_H}px`,
        zIndex: "-2147483647",
        background: "#ffffff",
        overflow: "hidden",
      });
      clone.setAttribute("data-capture-root", "1");
      
      // Fix all child elements to use absolute positioning for PDF
      const allElements = clone.querySelectorAll('*');
      allElements.forEach(el => {
        const computed = window.getComputedStyle(el);
        if (computed.position === 'relative' || computed.display === 'flex') {
          el.style.position = 'static';
        }
      });

      document.body.appendChild(clone);
      
      // Wait a bit for rendering
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0,
        width: ARTBOARD_W,
        height: ARTBOARD_H,
        onclone: (doc) => {
          // strip any oklch() usage in the cloned document only
          try {
            const sheets = Array.from(doc.styleSheets || []);
            for (const sheet of sheets) {
              let rules;
              try {
                rules = sheet.cssRules;
              } catch {
                continue;
              }
              if (!rules) continue;
              for (let i = rules.length - 1; i >= 0; i--) {
                const t = rules[i]?.cssText || "";
                if (t.includes("oklch(")) sheet.deleteRule(i);
              }
            }
            const root = doc.querySelector('[data-capture-root="1"]');
            if (root) {
              root.querySelectorAll("*").forEach((el) => {
                const s = el.getAttribute("style");
                if (s && s.includes("oklch(")) {
                  el.setAttribute("style", s.replace(/oklch\([^)]*\)/g, "#000"));
                }
              });
            }
          } catch {
            /* ignore sanitizer errors */
          }
        },
      });

      document.body.removeChild(clone);

      // Add to PDF with proper scaling
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("landscape", "pt", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Scale to fit properly
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      
      // Center vertically if needed
      const yOffset = imgHeight < pdfHeight ? (pdfHeight - imgHeight) / 2 : 0;
      
      pdf.addImage(imgData, "PNG", 0, yOffset, imgWidth, imgHeight);
      pdf.save(fileName || `Certificate-${participant.name}.pdf`);
    } catch (e) {
      console.error(e);
      alert("Failed to generate PDF. Check console.");
    } finally {
      setDownloading(false);
    }
  };

  // Colors (hex via inline styles so no oklch)
  const COLORS = {
    dark: "#0f172a",  // slate-900
    gray: "#6b7280",  // gray-500
    gold: "#C7A14B",
    lightBorder: "#e5e7eb",
    midBorder: "#d1d5db",
  };

  return (
    <div className="min-h-screen w-full bg-white p-4 md:p-6">
      <div className="mx-auto max-w-6xl">
        {/* PREVIEW CARD */}
        <div className="rounded-2xl border" style={{ borderColor: COLORS.lightBorder }}>
          <div className="bg-[#fafafa] p-3 rounded-2xl">
            {/* Responsive container controls the scale */}
            <div ref={containerRef} className="relative w-full overflow-hidden">
              <div
                ref={certRef}
                className="relative mx-auto overflow-hidden rounded-xl shadow-md"
                style={{
                  width: ARTBOARD_W,
                  height: ARTBOARD_H,
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                  backgroundColor: "#ffffff",
                  position: "relative",
                }}
              >
                {/* Double frame */}
                <div
                  className="absolute rounded-lg pointer-events-none"
                  style={{ 
                    border: `3px solid ${COLORS.gold}`,
                    left: "24px",
                    right: "24px", 
                    top: "24px",
                    bottom: "24px"
                  }}
                />
                <div
                  className="absolute rounded-md pointer-events-none"
                  style={{ 
                    border: `1px solid ${COLORS.dark}`,
                    left: "40px",
                    right: "40px",
                    top: "40px", 
                    bottom: "40px"
                  }}
                />

                {/* Top gold bar */}
                <div
                  className="absolute"
                  style={{ 
                    backgroundColor: COLORS.gold,
                    left: "40px",
                    right: "40px",
                    top: "56px",
                    height: "3px"
                  }}
                />

                {/* Watermark */}
                <div
                  className="absolute select-none pointer-events-none"
                  aria-hidden
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%) rotate(-24deg)",
                    opacity: 0.06,
                    fontSize: "160px",
                    fontWeight: 800,
                    color: COLORS.dark,
                    lineHeight: 1,
                  }}
                >
                  {org.code || "ORG"}
                </div>

                {/* CONTENT - Using absolute positioning for PDF compatibility */}
                <div 
                  className="absolute"
                  style={{
                    left: "40px",
                    right: "40px", 
                    top: "32px",
                    bottom: "32px",
                    zIndex: 10
                  }}
                >
                  {/* Branding Row */}
                  <div style={{ position: "relative", height: "60px", marginBottom: "32px" }}>
                    {/* Left side - Logo and org name */}
                    <div style={{ position: "absolute", left: 0, top: 0, display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{ 
                          width: "48px",
                          height: "48px",
                          backgroundColor: COLORS.dark,
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "18px",
                          fontWeight: "bold"
                        }}
                      >
                        {org.code || "ORG"}
                      </div>
                      <div style={{ fontSize: "20px", fontWeight: "600", color: COLORS.dark }}>
                        {org.name}
                      </div>
                    </div>
                    
                    {/* Right side - IDs */}
                    <div style={{ position: "absolute", right: 0, top: 0, textAlign: "right", fontSize: "12px", color: COLORS.gray }}>
                      <div>Registration: {participant.id}</div>
                      <div style={{ marginTop: "4px" }}>ID: {certificateId}</div>
                    </div>
                  </div>

                  {/* Title Block */}
                  <div style={{ textAlign: "center", marginTop: "32px", marginBottom: "64px" }}>
                    <div style={{ fontSize: "14px", letterSpacing: "0.3em", color: COLORS.gray, marginBottom: "12px" }}>
                      CERTIFICATE OF PARTICIPATION
                    </div>
                    <div style={{ fontSize: "48px", fontWeight: "800", color: COLORS.dark, marginBottom: "8px", lineHeight: 1.1 }}>
                      {participant.name}
                    </div>
                    <div style={{ fontSize: "16px", color: "#4b5563", marginBottom: "8px" }}>
                      has successfully participated in
                    </div>
                    <div style={{ fontSize: "24px", fontWeight: "600", color: COLORS.dark, marginBottom: "12px" }}>
                      {event.title}
                    </div>
                    <div style={{ fontSize: "14px", color: COLORS.dark }}>
                      Date: {event.dateText} • Venue: {event.venue}
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ 
                    height: "1px", 
                    backgroundColor: COLORS.midBorder, 
                    width: "75%", 
                    margin: "32px auto" 
                  }} />

                  {/* Footer row - Using absolute positioning */}
                  <div style={{ position: "absolute", bottom: "80px", left: 0, right: 0, height: "120px" }}>
                    {/* Left signature */}
                    <div style={{ position: "absolute", left: "16px", width: "280px", textAlign: "center" }}>
                      <div style={{ 
                        width: "224px", 
                        height: "1px", 
                        backgroundColor: COLORS.dark, 
                        margin: "0 auto 8px" 
                      }} />
                      <div style={{ fontSize: "12px", color: COLORS.gray }}>Event Coordinator</div>
                    </div>

                    {/* Seal (center) */}
                    <div style={{ 
                      position: "absolute", 
                      left: "50%", 
                      transform: "translateX(-50%)",
                      width: "96px",
                      height: "96px"
                    }}>
                      <div style={{ 
                        width: "96px",
                        height: "96px",
                        backgroundColor: COLORS.gold,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <div style={{ 
                          width: "80px",
                          height: "80px",
                          backgroundColor: "#ffffff",
                          border: `2px solid ${COLORS.dark}`,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          <div style={{ 
                            fontSize: "10px", 
                            fontWeight: "bold", 
                            color: COLORS.dark, 
                            letterSpacing: "0.15em", 
                            lineHeight: 1.1,
                            textAlign: "center"
                          }}>
                            OFFICIAL<br />SEAL
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* QR (right) */}
                    <div style={{ position: "absolute", right: "16px", width: "280px", textAlign: "center" }}>
                      {qr ? (
                        <img
                          src={qr}
                          alt="QR"
                          style={{ 
                            width: "96px",
                            height: "96px",
                            border: `1px solid ${COLORS.midBorder}`,
                            borderRadius: "8px",
                            padding: "4px",
                            margin: "0 auto",
                            display: "block"
                          }}
                        />
                      ) : (
                        <div style={{ 
                          width: "96px",
                          height: "96px",
                          border: `1px solid ${COLORS.lightBorder}`,
                          backgroundColor: "#f3f4f6",
                          borderRadius: "8px",
                          margin: "0 auto"
                        }} />
                      )}
                      <div style={{ fontSize: "11px", color: COLORS.gray, marginTop: "4px" }}>Verify</div>
                    </div>
                  </div>

                  {/* Bottom meta */}
                  <div style={{ 
                    position: "absolute", 
                    bottom: "48px", 
                    left: 0, 
                    right: 0, 
                    textAlign: "center", 
                    fontSize: "11px", 
                    color: COLORS.gray 
                  }}>
                    Certificate ID: {certificateId} • Verify at {verifyUrl}
                  </div>
                </div>

                {/* Bottom gold bar */}
                <div
                  className="absolute"
                  style={{ 
                    backgroundColor: COLORS.gold,
                    left: "40px",
                    right: "40px",
                    bottom: "56px",
                    height: "3px"
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* DOWNLOAD BUTTON */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 shadow-sm hover:bg-neutral-50 active:scale-[0.99] disabled:opacity-60"
            disabled={downloading}
          >
            {downloading ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3a1 1 0 011 1v9.586l2.293-2.293a1 1 0 111.414 1.414l-4.001 4a1 1 0 01-1.412 0l-4.001-4a1 1 0 111.414-1.414L11 13.586V4a1 1 0 011-1z"></path>
                <path d="M5 20a1 1 0 011-1h12a1 1 0 110 2H6a1 1 0 01-1-1z"></path>
              </svg>
            )}
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}