# Prompt de Identidade Visual - DevFlow Solutions (Backup B2B)

Este documento contém as especificações técnicas e o "prompt" visual para replicar a interface corporativa/B2B da Landing Page do DevFlow Solutions. Use estas diretrizes para manter a consistência visual em futuras refatorações ou mudanças de plataforma.

---

## 1. Visão Geral (Core Visual Identity)
O estilo deve ser **Premium, Moderno e Corporativo (B2B)**, utilizando uma estética de "Dark Mode" profundo com toques de cores vibrantes (roxo e verde/teal) e efeitos de vidro (glassmorphism).

## 2. Tipografia (Typography)
As fontes são baseadas na família "Madefor".

- **Display H1 (Títulos de Impacto):**
  - **Fonte:** `madefor-display-bold`
  - **Tamanho:** `clamp(48px, 6vw, 72px)` (Responsivo)
  - **Line Height:** `1.1em`
  - **Transform:** `uppercase`
  - **Estilo:** Gradiente Linear (`#FFFFFF` para `#B3B3B3`)

- **Subtítulos/Headings (H2/H3):**
  - **Fonte:** `madefor-text` ou `madefor-display-bold`
  - **Tamanho:** `48px` (H2) / `24px` (H3)
  - **Line Height:** `1.2em`

- **Corpo de Texto:**
  - **Fonte:** `madefor-text`
  - **Tamanho:** `18px`
  - **Line Height:** `1.4em`
  - **Cor:** `#F5F4F3` ou `rgba(255,255,255,0.6)` para textos secundários.

## 3. Cores e Paletas (Color Palette)
- **Fundo Principal:** `#0A0A0A` (Preto Profundo / Cinza Escuro).
- **Acento Roxo (Primary Accent):** `#D2C5FF` (Lilas Suave) e `#4F46E5` (Roxo Intenso).
- **Acento Verde/Teal (Secondary Accent):** `#345C59`.
- **Gradients:**
  - **Hero Background:** `linear-gradient(0deg, #1f1f1f 0%, #4F46E5 50%, #0A0A0A 100%)`.
  - **Progress Bars/Accents:** `linear-gradient(90deg, #345C59, #D2C5FF)`.

## 4. Layout e Estrutura
- **Grid System:** Sistema de 12 colunas ou Grid de 2/4 colunas para seções de conteúdo.
- **Espaçamento (Padding):** Seções com `120px 40px` para gerar "respiro" corporativo.
- **Navegação (Header):** 
  - Fixa (`position: fixed`), altura `80px`.
  - Fundo: `rgba(0,0,0,0.4)` com `backdrop-filter: blur(20px)`.
  - Borda inferior fina: `1px solid rgba(255,255,255,0.1)`.

## 5. Componentes e Estilização
- **Botões (B2B Style):**
  - **Primário:** Fundo branco (`#fff`), texto preto, bordas arredondadas (`100px`), hover roxo.
  - **Fantasma (Ghost):** Borda branca semi-transparente, sem fundo, hover com leve opacidade.
  - **Ícones:** Transição de `0.3s`, com movimento horizontal de `4px` no hover.
- **Cards (Feature/Stat Cards):**
  - Fundo: `rgba(255,255,255,0.03)`.
  - Borda: `1px solid rgba(255,255,255,0.08)`.
  - Blur: `backdrop-filter: blur(10px)`.
  - Arredondamento: `16px`.
  - Efeito Hover: `transform: translateY(-8px)` e fundo levemente mais claro.

## 6. Animações e Micro-interações
- **Pulse Background (Hero):** Radial gradient (`rgba(99,102,241,0.2)`) pulsando atrás do título principal.
- **Status Dot:** Círculo luminoso com `box-shadow` e animação de pulso infinito.
- **Suavidade:** Todas as transições (`all 0.3s ease`).

## 7. Variáveis CSS Base (Referência Direta)
```css
:root {
    --color_main_bg: #0A0A0A;
    --color_accent_purple: #D2C5FF;
    --color_accent_deep_purple: #4F46E5;
    --color_text_white: #F5F4F3;
    --font_display: 'madefor-display-bold';
    --font_text: 'madefor-text';
    --radius_button: 100px;
    --radius_card: 16px;
}
```
