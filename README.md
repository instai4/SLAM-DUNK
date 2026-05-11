# Slam Dunk — Ultra-Premium 3D Basketball Showcase

A cinematic, high-performance interactive 3D basketball showroom engineered with **Three.js** and **Vanilla JavaScript**. This project pushes the boundaries of web-based product presentation through advanced WebGL rendering, procedural art, and liquid-smooth user interactions.

---

# 🚀 Core Features & Technical Deep-Div

### 🏀 1. High-Fidelity 3D Rendering Engine
The experience is powered by a custom-tuned Three.js renderer featuring:
- **PBR (Physically Based Rendering)**: Every basketball utilizes `MeshStandardMaterial` with custom-generated normal maps to simulate realistic pebbled leather and surface imperfections.
- **Dynamic Gaussian Scaling**: A mathematical scaling algorithm (`Math.exp(-dist * dist * 6.5)`) ensures that only the active product is prominent, creating a focused, "one-at-a-time" cinematic transition during scroll.
- **Adaptive Lighting Orchestration**: The scene dynamically interpolates between different lighting rigs (Ambient, Directional, and Point lights) to match the unique aesthetic of each basketball series.

### 🎨 2. Procedural Texture Generation
Unlike traditional stores that use heavy image assets, Slam Dunk generates its high-resolution textures on-the-fly using the HTML5 Canvas API:
- **Lava Core**: Uses randomized recursive line-drawing with Gaussian shadows to simulate cracked earth.
- **Midnight Marble**: Implements randomized linear gradients and elliptical masking for a luxury marble swirl.
- **Standard Pebbles**: Mathematically scatters 25,000+ tiny arcs with varying opacity to create the iconic basketball "grip" texture without external assets.

### 🧪 3. Interactive Custom Lab (The Engine)
A real-time customization pipeline that allows users to become designers:
- **Live Preview System**: Changes to colors, seam styles, and patterns are instantly baked into a new `CanvasTexture` and applied to the 3D model.
- **Dynamic Engraving**: User text is rendered directly into the 3D model's diffuse map using specialized typography alignment, allowing personalized names to appear physically "on" the ball.

### 🌊 4. Fluid UX & Environmental Scaling
- **Liquid Environment Transitions**: Utilizing the **CSS `@property` API**, the site transitions background and vignette colors fluidly over 1.2s without the "flicker" typical of standard variable swaps.
- **Magnetic UI Navigation**: A custom interaction layer that calculates cursor proximity to apply subtle translation and scale transforms, making the interface feel alive and responsive.
- **"Power Spin" Interaction**: A physics-based rotation velocity system that allows users to "trick shot" the 3D models with momentum-based spinning on click.

---

# 🛠 Tech Stack & Engineering

| Category | Technology | Usage |
| :--- | :--- | :--- |
| **3D Engine** | Three.js (r128) | Scene graph, WebGL rendering, PBR materials, Camera orchestration. |
| **Logic** | ES6+ JavaScript | State machine, scroll interpolation, and magnetic math. |
| **Graphics** | Canvas API | Procedural texture synthesis and custom engraving logic. |
| **Styling** | Modern CSS | CSS @property interpolation, Glassmorphism, and Flex/Grid layouts. |
| **Performance** | WebGL | 60-FPS rendering with adaptive pixel ratios and PCFSoftShadowMaps. |

---

# 📈 Performance Optimization

- **Zero Asset Loading**: By using procedural textures, the project eliminates large texture downloads, leading to near-instant "Time to Interactive."
- **Adaptive Resolution**: The renderer automatically adjusts its pixel ratio based on device capability (capping at 2x) to maintain high frame rates on lower-end devices.
- **Visibility Culling**: High-threshold visibility logic ensures that inactive 3D models are removed from the render loop, saving GPU cycles.

---

# 🎯 Project Purpose

This is a **technical showcase** designed to demonstrate the feasibility of ultra-luxury 3D experiences on the web. It serves as a case study for:
- Building high-performance 3D storefronts without frameworks.
- Synchronizing 3D scene states with 2D DOM overlays.
- Creating immersive brand storytelling through scroll-driven interaction.

---

# 👤 Author

**Anurag Singh**
*Specializing in High-Performance 3D Web Experiences*

[Explore My Portfolio](https://instai4.github.io/PORT-FOLIO/) | [Contact via Portfolio](https://instai4.github.io/PORT-FOLIO/)

---

*Made with 🏀 and high-performance code.*
