// src/components/ReCaptcha.jsx
import { useState, useEffect, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const getBootstrapTheme = () => {
  if (typeof document === "undefined") return "light";

  const theme =
    document.documentElement.getAttribute("data-bs-theme") || "light";

  return theme === "dark" ? "dark" : "light";
};

const isSmallScreen = () => {
  if (typeof window === "undefined") return false;
  return window.innerWidth <= 576;
};

const getZoomScale = () => {
  if (typeof window === "undefined" || !window.devicePixelRatio) return 1;
  return window.devicePixelRatio;
};

const ReCaptcha = ({ setCaptchaToken }) => {
  const [recaptchaTheme, setRecaptchaTheme] = useState(getBootstrapTheme());
  const [smallScreen, setSmallScreen] = useState(isSmallScreen());
  const [zoomScale, setZoomScale] = useState(getZoomScale());
  const wrapperRef = useRef(null);

  // Sincroniza o tema com o <html data-bs-theme="...">
  useEffect(() => {
    const updateTheme = () => {
      setRecaptchaTheme(getBootstrapTheme());
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-bs-theme"],
    });

    return () => observer.disconnect();
  }, []);

  // Observa largura de tela e zoom (devicePixelRatio) para mobile + bordas
  useEffect(() => {
    const handleResizeOrZoom = () => {
      setSmallScreen(isSmallScreen());
      setZoomScale(getZoomScale());
    };

    window.addEventListener("resize", handleResizeOrZoom);
    return () => window.removeEventListener("resize", handleResizeOrZoom);
  }, []);

  // Remove borda padrão do iframe do reCAPTCHA
  useEffect(() => {
    if (!wrapperRef.current) return;

    const applyIframeStyles = () => {
      const iframe = wrapperRef.current.querySelector(
        "iframe[src*='recaptcha']"
      );
      if (!iframe) return;

      iframe.style.border = "none";
      iframe.style.borderRadius = "0";
    };

    applyIframeStyles();

    const mo = new MutationObserver(applyIframeStyles);
    mo.observe(wrapperRef.current, {
      childList: true,
      subtree: true,
    });

    return () => mo.disconnect();
  }, [recaptchaTheme]);

  // Escala suave em mobile para evitar overflow horizontal
  useEffect(() => {
    if (!wrapperRef.current) return;

    const wrapper = wrapperRef.current;
    wrapper.style.transformOrigin = "top left";
    wrapper.style.transform = smallScreen ? "scale(0.9)" : "none";
  }, [smallScreen]);

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  // Cores principais
  const bgColor = recaptchaTheme === "dark" ? "#222" : "#f9f9f9";
  const maskColor = recaptchaTheme === "dark" ? "#222222" : "#f9f9f9";

  // Container que envolve o iframe
  const containerStyle = {
    display: "inline-block",
    lineHeight: 0,
    overflow: "hidden",
    position: "relative",
    backgroundColor: bgColor,
  };

  // Wrapper externo (borda arredondada + fundo de acordo com o tema)
  const outerWrapperStyle = {
    borderRadius: "0.9rem",
    overflow: "hidden",
    backgroundColor: bgColor,
    display: "inline-block",
    lineHeight: 0,
  };

  const edgeBaseStyle = {
    position: "absolute",
    backgroundColor: maskColor,
    pointerEvents: "none",
  };

  // ----------------- CÁLCULOS DE ESPESSURA / OFFSET -----------------
  // Base pensada para zoom ~1; escala conforme devicePixelRatio,
  // com limites para não ficar fino demais nem grosso demais.
  const baseThickness = 8;

  // Inset negativo "come" a borda do widget.
  const baseInset = -(baseThickness/2); // px

  const topMaskStyle = {
    ...edgeBaseStyle,
    top: baseInset,
    left: 0,
    right: 0,
    height: `${baseThickness}px`,
  };

  const bottomMaskStyle = {
    ...edgeBaseStyle,
    bottom: baseInset,
    left: 0,
    right: 0,
    height: `${baseThickness}px`,
  };

  const leftMaskStyle = {
    ...edgeBaseStyle,
    top: 0,
    bottom: 0,
    left: baseInset,
    width: `${baseThickness}px`,
  };

  const rightMaskStyle = {
    ...edgeBaseStyle,
    top: 0,
    bottom: 0,
    right: baseInset,
    width: `${baseThickness}px`,
  };

  const labelStyle = {
    fontSize: "0.8rem",
    textTransform: "uppercase",
    fontWeight: 600,
    marginBottom: "0.25rem",
    color: "var(--bs-secondary-color)",
  };

  const helpTextStyle = {
    fontSize: "0.8rem",
    marginTop: "0.25rem",
    color: "var(--bs-secondary-color)",
  };

  return (
    <div className="my-2">
      <div style={labelStyle}>Verificação de segurança</div>

      <div className="p-1" style={outerWrapperStyle}>
        <div ref={wrapperRef} style={containerStyle}>
          <ReCAPTCHA
            key={recaptchaTheme}
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={handleCaptchaChange}
            theme={recaptchaTheme}
          />

          {/* Máscaras sobrepostas nas bordas */}
          <div id="id-1" style={topMaskStyle} />
          <div id="id-2" style={bottomMaskStyle} />
          <div id="id-3" style={leftMaskStyle} />
          <div id="id-4" style={rightMaskStyle} />
        </div>
      </div>

      <div style={helpTextStyle}>
        Isso ajuda a proteger sua conta contra acessos automatizados.
      </div>
    </div>
  );
};

export default ReCaptcha;
