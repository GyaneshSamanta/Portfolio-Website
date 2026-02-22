# Portfolio Website

A premium, interactive portfolio website for a Product Manager, built with Next.js 14, Tailwind CSS, and Framer Motion.

## Features

- **Modern Design**: 
  - **Single Theme**: Cyberpunk Product (Dark Mode Only)
  - **Premium Aesthetics**: Grainy textures, glassmorphism, and bold colors (Violet/Hot Pink).
- **Interactivity**: 
  - **Hover Previews**: Hover over content pillars to see latest items.
  - **Micro-Interactions**: Amplified UI sound effects and smooth animations.
- **Content Integration**:
  - **GitHub**: Automatically fetches and displays repositories.
  - **YouTube**: Displays video feed (Podcast).
  - **Newsletter**: Curated list of articles.
- **Performance**: Built on Next.js App Router for optimal speed and SEO.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Typography**: [Geist](https://vercel.com/font)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run development server**:
    ```bash
    npm run dev
    ```

3.  **Build for production**:
    ```bash
    npm run build
    ```

## Customization

- **Site Info**: Edit `lib/constants.ts` to update your name, links, and content.
- **Experience**: Update the `experience` array in `lib/constants.ts`.
- **Data**: Add new videos or articles in `data/videos.json` and `data/newsletter.json`.
- **Logo**: Replace `public/logo.png` with your own image.
