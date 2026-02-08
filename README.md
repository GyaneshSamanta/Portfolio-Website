# Gyanesh Samanta - Product Management Portfolio

![Portfolio Preview](public/og.jpg)

A premium, high-performance portfolio website built for Product Managers who code. Features a "Cyberpunk Product" aesthetic, seamless animations, and integrations with GitHub, YouTube, and LinkedIn.

## 🚀 Built With

- **[Next.js 14](https://nextjs.org/)** (App Router)
- **[Tailwind CSS](https://tailwindcss.com/)** (Styling)
- **[Framer Motion](https://www.framer.com/motion/)** (Animations)
- **TypeScript** (Type Safety)
- **Lucide React** (Icons)

## ✨ Features

- **Home Page**: High-impact hero section with staggered animations.
- **My Journey**: Interactive vertical timeline of professional experience.
- **GitHub Integration**: Automatically fetches and displays repositories using the GitHub API.
- **Content Hub**: Dedicated sections for Newsletter (LinkedIn) and Podcast (YouTube) content.
- **Contact**: Integrated Calendly scheduling and quick-copy email.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop.
- **Dark Mode**: Cyberpunk-inspired dark theme by default.

## 🛠️ Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/GyaneshSamanta/Portfolio-Website.git
   cd Portfolio-Website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Customization

- **Site Config**: Edit `lib/constants.ts` to update your name, links, SEO metadata, and experience timeline.
- **Content**:
  - `data/videos.json`: Add your YouTube video links.
  - `data/newsletter.json`: Add your newsletter articles.
- **Theme**: Modify `app/globals.css` CSS variables to change the cyberpunk color scheme.

## 📦 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com).

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Deploy! (No additional configuration required).

## 📄 License

MIT License. Feel free to use this as a template for your own portfolio!
