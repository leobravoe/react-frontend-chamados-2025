// src/components/ReCaptcha.jsx
import { useState, useEffect, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

// Lê o tema atual do Bootstrap a partir do <html>
const getBootstrapTheme = () => {
    if (typeof document === "undefined") return "light";

    const html = document.documentElement;
    const attr = html.getAttribute("data-bs-theme");

    // Qualquer coisa diferente de "dark" tratamos como "light"
    return attr === "dark" ? "dark" : "light";
};

const ReCaptcha = ({ setCaptchaToken }) => {
    const [recaptchaTheme, setRecaptchaTheme] = useState(getBootstrapTheme());
    const wrapperRef = useRef(null);

    // Mantém o tema sincronizado com <html data-bs-theme="...">
    useEffect(() => {
        const updateTheme = () => {
            setRecaptchaTheme(getBootstrapTheme());
        };

        // 1) Sincroniza imediatamente após o mount
        //    (pega o valor final que o script de tema já tiver aplicado)
        updateTheme();

        // 2) Observa mudanças futuras no atributo data-bs-theme
        const obs = new MutationObserver(updateTheme);
        obs.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-bs-theme"],
        });

        return () => obs.disconnect();
    }, []);

    // Remove borda padrão do iframe do reCAPTCHA
    useEffect(() => {
        if (!wrapperRef.current) return;

        const apply = () => {
            const iframe = wrapperRef.current.querySelector(
                "iframe[src*='recaptcha']"
            );
            if (!iframe) return;
            iframe.style.border = "none";
            iframe.style.borderRadius = "0";
        };

        apply();

        const mo = new MutationObserver(apply);
        mo.observe(wrapperRef.current, { childList: true, subtree: true });

        return () => mo.disconnect();
    }, [recaptchaTheme]);

    const handleCaptchaChange = (token) => {
        setCaptchaToken(token);
    };

    // Cores principais
    const bgColor = recaptchaTheme === "dark" ? "#222" : "#f9f9f9";

    // Parametrização da “moldura”
    const FRAME_PADDING = 8;     // quanto o container é maior que o recaptcha
    const OVERLAY_INSET = 4;     // quão “pra dentro” começa o overlay
    const FRAME_THICKNESS = 10;  // espessura da borda interna opaca

    // Container que envolve o iframe (um pouco maior que o reCAPTCHA)
    const containerStyle = {
        display: "inline-block",
        position: "relative",
        lineHeight: 0,
        overflow: "hidden",
        backgroundColor: bgColor,
        paddingTop: `${FRAME_PADDING}px`,
        paddingRight: `${FRAME_PADDING}px`,
        paddingBottom: `${FRAME_PADDING}px`,
        paddingLeft: `${FRAME_PADDING + 2}px`,
    };

    // Wrapper externo (apenas para respeitar o layout com padding BootStrap)
    const outerWrapperStyle = {
        borderRadius: "0.9rem",
        overflow: "hidden",
        backgroundColor: bgColor,
        display: "inline-block",
        lineHeight: 0,
    };

    // Overlay por cima do recaptcha:
    // - centro transparente (mostra o widget)
    // - borda interna opaca que "come" as laterais/anti-alias
    const overlayStyle = {
        position: "absolute",
        inset: OVERLAY_INSET,
        pointerEvents: "none",
        boxShadow: `0 0 0 ${FRAME_THICKNESS}px ${bgColor} inset`,
    };

    return (
        <div className="my-2">
            <div>
                <label htmlFor="id-google-captcha" className="form-label">Google Captcha</label>
            </div>
            <div className="p-1" style={outerWrapperStyle}>
                <div ref={wrapperRef} style={containerStyle}>
                    <ReCAPTCHA
                        id="id-google-captcha"
                        key={recaptchaTheme}
                        sitekey={RECAPTCHA_SITE_KEY}
                        onChange={handleCaptchaChange}
                        theme={recaptchaTheme}
                    />

                    {/* Overlay oca com bordas internas arredondadas e opacas */}
                    <div id="overlay" style={overlayStyle} />
                </div>
            </div>

            <div className="form-text text-body">
                Isso ajuda a proteger sua conta contra acessos automatizados.
            </div>
        </div>
    );
};

export default ReCaptcha;
