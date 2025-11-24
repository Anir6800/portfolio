# Aniruddh Rathod - AI/ML Developer Portfolio

A modern, interactive portfolio website showcasing AI/ML expertise with stunning animations and dynamic visual effects.

![Portfolio Preview](https://via.placeholder.com/800x400/030305/00d8ff?text=Portfolio+Preview)

## ✨ Features

### 🎨 Visual Effects & Animations
- **3D Particle Background**: Interactive Three.js particle system with mouse parallax and scroll-based effects
- **Scroll-Triggered Animations**: Smooth reveal animations using Framer Motion
- **Dynamic Section Backgrounds**: Gradient backgrounds that change based on scroll position
- **Floating Particles**: Animated particles that respond to user interactions
- **Custom Cursor**: Magnetic cursor with hover effects and dual-ring design

### 🎯 Interactive Elements
- **Ripple Button Effects**: Custom buttons with animated ripple effects on click
- **3D Card Transforms**: Project cards with hover rotations and scaling
- **Staggered Animations**: Sequential reveal animations for skills and projects
- **Progress Bars**: Animated proficiency indicators for technical skills
- **Interactive 3D Background**: Click interactions that trigger visual bursts

### 📱 Responsive Design
- Fully responsive across all devices
- Glassmorphism design with backdrop blur effects
- Dark theme optimized for readability
- Smooth scrolling navigation

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS, PostCSS
- **Animations**: Framer Motion
- **3D Graphics**: Three.js
- **Icons**: Lucide React
- **Build Tool**: Vite

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Anir6800/portfolio.git
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder, ready for deployment.

## 🌐 Deployment

### Netlify (Free)
1. Build the project: `npm run build`
2. Go to [Netlify](https://netlify.com) and sign up/login
3. Drag and drop the `dist` folder into the deploy area
4. Your site will be live instantly!

### Other Platforms
The built files in `dist` can be deployed to any static hosting service:
- Vercel
- GitHub Pages
- Firebase Hosting
- AWS S3 + CloudFront

## 📁 Project Structure

```
portfolio/
├── public/
│   └── vite.svg
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles
├── dist/                # Built files (after npm run build)
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🎨 Customization

### Colors
The color scheme uses a cyan/purple gradient. To change colors:
- Update Tailwind config in `tailwind.config.js`
- Modify Three.js material colors in `App.jsx`

### Content
Edit the data arrays in `App.jsx`:
- `SKILLS`: Technical skills and proficiency levels
- `PROJECTS`: Portfolio projects with links
- `SOCIALS`: Social media links

### Animations
All animations are configured in `App.jsx` using Framer Motion. Adjust timing, easing, and effects as needed.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Aniruddh Rathod**
- Portfolio: [Live Site](https://aniruddh-rathod.netlify.app/)
- GitHub: [@Anir6800](https://github.com/Anir6800)
- LinkedIn: [Aniruddh Rathod](https://www.linkedin.com/in/aniruddh-rathod-5ba722245/)
- Email: anir6800@gmail.com

## 🙏 Acknowledgments

- Built with React, Three.js, and Framer Motion
- Inspired by modern web design trends
- Icons from Lucide React
- Fonts from Google Fonts (via Tailwind)

---

⭐ If you like this portfolio, give it a star on GitHub!
