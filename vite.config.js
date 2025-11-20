// vite.config.js
// -----------------------------------------------------------------------------
// OBJETIVO DESTE ARQUIVO
// -----------------------------------------------------------------------------
// Este arquivo configura o Vite, que é a ferramenta usada para rodar o projeto
// React em modo desenvolvimento e também para gerar o build de produção.
//
// Aqui fazemos três coisas principais:
// 1) Dizemos ao Vite que vamos usar React (plugin @vitejs/plugin-react-swc);
// 2) Definimos uma Content Security Policy (CSP) mais rígida para produção;
// 3) Aplicamos essa CSP apenas no `preview` (simulação de produção), e NÃO em dev,
//    para não quebrar o hot reload e os scripts internos do Vite.
// -----------------------------------------------------------------------------

// `defineConfig` é uma função auxiliar do Vite que ajuda a escrever
// a configuração com melhor suporte de tipos/autocomplete.
import { defineConfig } from "vite";

// Plugin oficial do Vite para projetos React usando o compilador SWC.
// Ele é responsável por entender JSX/TSX, fazer transformações, HMR etc.
import react from "@vitejs/plugin-react-swc";

// -----------------------------------------------------------------------------
// DEFINIÇÃO DA CONTENT SECURITY POLICY (CSP) PARA PRODUÇÃO/PREVIEW
// -----------------------------------------------------------------------------
// A CSP é um cabeçalho de segurança que diz ao navegador de quais origens
// (domínios / protocolos) o site pode carregar scripts, estilos, imagens, etc.
// Isso ajuda a reduzir o risco de ataques como XSS (injeção de scripts).
const csp = [
    "default-src 'none'",                      // regra padrão: bloquear tudo, a menos que seja liberado abaixo
    "script-src 'self'",                      // só permite scripts do próprio domínio (sem CDN, sem inline)
    "style-src 'self'",                       // só CSS do próprio domínio
    "img-src 'self' data:",                   // imagens locais ou embutidas via data: (ex.: base64)
    "font-src 'self'",                        // fontes somente do próprio domínio
    "connect-src 'self' http://localhost:3000",
    // ↑ Permite requisições (fetch/XHR/WebSocket) apenas:
    //   - para o próprio front ('self')
    //   - para a API em http://localhost:3000 (backend local, por exemplo)
    "base-uri 'none'",                        // impede uso de <base> para mudar a base das URLs
    "frame-ancestors 'none'",                 // impede que seu site seja colocado em iframes de outros sites
    "form-action 'self'",                     // formulários só podem enviar dados para o mesmo domínio
    "object-src 'none'",                      // bloqueia <object>, <embed>, <applet> (recursos antigos e perigosos)
    "frame-src 'none'",                       // impede carregar outros sites dentro de iframes (a não ser que libere aqui)
    "upgrade-insecure-requests",              // em HTTPS, força links http:// a virarem https:// automaticamente
].join("; "); // transforma o array em uma string única, separando cada diretiva por "; "

// -----------------------------------------------------------------------------
// EXPORTANDO A CONFIGURAÇÃO PARA O VITE
// -----------------------------------------------------------------------------
// `defineConfig` recebe um objeto com as opções do Vite e exporta como padrão.
// O Vite lê esse arquivo automaticamente quando você roda `npm run dev` ou `npm run build`.
export default defineConfig({
    // Plugins que o Vite deve usar; aqui só estamos usando o plugin do React.
    plugins: [react()],

    // ---------------------------------------------------------------------------
    // CONFIGURAÇÃO DO SERVIDOR DE DESENVOLVIMENTO (npm run dev)
    // ---------------------------------------------------------------------------
    server: {
        headers: {
            // Aqui poderíamos definir cabeçalhos extras para o servidor de DEV.
            // De propósito NÃO colocamos a CSP em desenvolvimento.
            //
            // Motivo:
            // - Em dev, o Vite injeta scripts especiais (HMR, React Fast Refresh, etc.)
            //   que usam scripts inline e outras coisas que uma CSP rígida bloquearia.
            // - Se colocarmos uma CSP muito restritiva aqui, o hot reload quebra e
            //   o ambiente de desenvolvimento fica cheio de erros de CSP.
            //
            // Por isso, deixamos SEM "Content-Security-Policy" no dev.
            // Quando você acessar via `npm run dev`, não terá essa CSP ativa.
        },
    },

    // ---------------------------------------------------------------------------
    // CONFIGURAÇÃO DO `vite preview` (build local de produção)
    // ---------------------------------------------------------------------------
    // `vite preview` simula o comportamento do build de produção rodando em um
    // servidor estático local. Aqui já faz sentido aplicar a CSP rígida para
    // testar a segurança antes de subir para o servidor real.
    preview: {
        headers: {
            // Agora sim, aplicamos a Content Security Policy definida acima.
            "Content-Security-Policy": csp,
        },
    },
});
