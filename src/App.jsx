import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import {
Github,
Linkedin,
Instagram,
Twitter,
Facebook,
Mail,
Phone,
ExternalLink,
Code2,
Cpu,
Database,
Terminal,
ChevronDown,
Download,
Sparkles,
Globe,
BrainCircuit,
Layers
} from 'lucide-react';

// --- Typing Effect Component ---
const TypingEffect = ({ text, speed = 50, startDelay = 0, showCursor = true }) => {
const [displayedText, setDisplayedText] = useState("");
const [started, setStarted] = useState(false);

useEffect(() => {
const startTimeout = setTimeout(() => {
setStarted(true);
}, startDelay);

return () => clearTimeout(startTimeout);
}, [startDelay]);

useEffect(() => {
if (!started) return;

let index = 0;
const interval = setInterval(() => {
if (index <= text.length) {
setDisplayedText(text.slice(0, index));
index++;
} else {
clearInterval(interval);
}
}, speed);

return () => clearInterval(interval);
}, [text, speed, started]);

return (
<span>
      {displayedText}
      {showCursor && (
        <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-[2px] h-[1em] bg-cyan-500 ml-1 align-middle"
        />
      )}
    </span>
);
};

// --- 3D Background Component (Neural Network / Particles) ---
const ThreeBackground = () => {
const mountRef = useRef(null);
const { scrollYProgress } = useScroll();

useEffect(() => {
const mount = mountRef.current;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
mount.appendChild(renderer.domElement);

// Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 700;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
posArray[i] = (Math.random() - 0.5) * 15;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const material = new THREE.PointsMaterial({
size: 0.025,
color: 0x00d8ff, // Cyan neon
transparent: true,
opacity: 0.8,
});

const particlesMesh = new THREE.Points(particlesGeometry, material);
scene.add(particlesMesh);

// Connecting Lines (Neural look)
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.15 });
const linesGeometry = new THREE.BufferGeometry();
const linesMesh = new THREE.LineSegments(linesGeometry, lineMaterial);
scene.add(linesMesh);

camera.position.z = 4;

// Mouse interaction
let mouseX = 0;
let mouseY = 0;

const handleMouseMove = (event) => {
mouseX = event.clientX / window.innerWidth - 0.5;
mouseY = event.clientY / window.innerHeight - 0.5;
};
document.addEventListener('mousemove', handleMouseMove);

let clickBurst = false;

const handleClick = () => {
clickBurst = true;
setTimeout(() => clickBurst = false, 1000);
};

document.addEventListener('click', handleClick);

const animate = () => {
requestAnimationFrame(animate);

// Get current scroll progress
const scrollProgress = scrollYProgress.get();

particlesMesh.rotation.y += 0.001;
particlesMesh.rotation.x += 0.001;

// Parallax based on mouse
particlesMesh.rotation.y += mouseX * 0.05;
particlesMesh.rotation.x += mouseY * 0.05;

// Scroll-based parallax: adjust camera Z and particle scale
camera.position.z = 4 + scrollProgress * 2;
particlesMesh.scale.setScalar(1 + scrollProgress * 0.5 + (clickBurst ? 0.2 : 0));

// Dynamic color based on scroll
const color = new THREE.Color().setHSL(0.55 + scrollProgress * 0.1, 0.8, 0.6 + (clickBurst ? 0.2 : 0));
material.color = color;

renderer.render(scene, camera);
};

animate();

const handleResize = () => {
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth, window.innerHeight);
};
window.addEventListener('resize', handleResize);

return () => {
window.removeEventListener('resize', handleResize);
document.removeEventListener('mousemove', handleMouseMove);
mount.removeChild(renderer.domElement);
};
}, [scrollYProgress]);

return <div ref={mountRef} className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-60" />;
};

// --- Custom Magnetic Cursor ---
const CustomCursor = () => {
const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
const [isHovering, setIsHovering] = useState(false);

useEffect(() => {
const updateMousePosition = (e) => {
setMousePosition({ x: e.clientX, y: e.clientY });
};

const handleMouseOver = (e) => {
if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
setIsHovering(true);
} else {
setIsHovering(false);
}
};

window.addEventListener('mousemove', updateMousePosition);
window.addEventListener('mouseover', handleMouseOver);

return () => {
window.removeEventListener('mousemove', updateMousePosition);
window.removeEventListener('mouseover', handleMouseOver);
};
}, []);

return (
<>
<motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-cyan-500 rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{
        x: mousePosition.x - 8,
        y: mousePosition.y - 8,
        scale: isHovering ? 0.5 : 1
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
/>
<motion.div
        className="fixed top-0 left-0 w-12 h-12 border border-cyan-500/50 rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{
        x: mousePosition.x - 24,
        y: mousePosition.y - 24,
        scale: isHovering ? 1.5 : 1,
        opacity: isHovering ? 1 : 0.5
        }}
        transition={{ type: "spring", stiffness: 250, damping: 20, mass: 0.8 }}
/>
</>
);
};

// --- Floating Particles Component ---
const FloatingParticles = () => {
const [particles, setParticles] = useState([]);

useEffect(() => {
const createParticle = () => {
const particle = {
id: Date.now() + Math.random(),
x: Math.random() * window.innerWidth,
y: Math.random() * window.innerHeight,
size: Math.random() * 6 + 2,
speedX: (Math.random() - 0.5) * 2,
speedY: (Math.random() - 0.5) * 2,
opacity: Math.random() * 0.5 + 0.2,
};
setParticles(prev => [...prev, particle]);
};

const interval = setInterval(createParticle, 2000);

const animate = () => {
setParticles(prev => prev.map(p => ({
...p,
x: p.x + p.speedX,
y: p.y + p.speedY,
speedX: p.x < 0 || p.x > window.innerWidth ? -p.speedX : p.speedX,
speedY: p.y < 0 || p.y > window.innerHeight ? -p.speedY : p.speedY,
})));
requestAnimationFrame(animate);
};
animate();

return () => clearInterval(interval);
}, []);

return (
<div className="fixed top-0 left-0 w-full h-full pointer-events-none z-20">
{particles.map(particle => (
<motion.div
key={particle.id}
className="absolute rounded-full bg-cyan-400/30 blur-sm"
style={{
width: particle.size,
height: particle.size,
left: particle.x,
top: particle.y,
opacity: particle.opacity,
}}
animate={{
x: [0, 10, -10, 0],
y: [0, -10, 10, 0],
}}
transition={{
duration: 4 + Math.random() * 2,
repeat: Infinity,
ease: "easeInOut",
}}
whileHover={{ scale: 1.5, opacity: 0.8 }}
/>
))}
</div>
);
};

// --- Components ---

const GlassCard = ({ children, className = "", hoverEffect = true }) => {
return (
<div
className={`
relative overflow-hidden rounded-2xl
bg-white/[0.03] backdrop-blur-xl border border-white/[0.1]
shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
${hoverEffect ? 'transition-all duration-500 hover:border-cyan-500/30 hover:shadow-[0_8px_32px_0_rgba(6,182,212,0.15)] hover:-translate-y-1' : ''}
${className}
`}
>
{/* Noise Texture */}
<div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
{/* Gradient Glow */}
<div className="absolute -inset-px bg-gradient-to-r from-cyan-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

{children}
</div>
);
};

// --- Progress Bar Component ---
const ProgressBar = ({ progress, className = "" }) => {
return (
<div className={`w-full bg-white/10 rounded-full h-2 overflow-hidden ${className}`}>
<motion.div
  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
  initial={{ width: 0 }}
  whileInView={{ width: `${progress}%` }}
  viewport={{ once: true }}
  transition={{ duration: 1.5, ease: "easeOut" }}
/>
</div>
);
};

// --- Ripple Button Component ---
const RippleButton = ({ children, className = "", onClick, as = "button", ...props }) => {
const [ripples, setRipples] = useState([]);

const handleClick = (e) => {
const element = e.currentTarget;
const rect = element.getBoundingClientRect();
const size = Math.max(rect.width, rect.height);
const x = e.clientX - rect.left - size / 2;
const y = e.clientY - rect.top - size / 2;

const newRipple = { id: Date.now(), x, y, size };
setRipples(prev => [...prev, newRipple]);

setTimeout(() => {
setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
}, 600);

if (onClick) onClick(e);
};

const Component = as;

return (
<Component
className={`relative overflow-hidden ${className}`}
onClick={handleClick}
{...props}
>
{children}
{ripples.map(ripple => (
<span
key={ripple.id}
className="absolute rounded-full bg-white/30 animate-ping"
style={{
left: ripple.x,
top: ripple.y,
width: ripple.size,
height: ripple.size,
animationDuration: '0.6s',
}}
/>
))}
</Component>
);
};

const SectionHeading = ({ title, subtitle }) => {
return (
<div className="mb-16 text-center relative">
    <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block"
    >
        <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-white mb-4 tracking-tight">
            {title}
        </h2>
        <div className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-cyan-500 to-transparent rounded-full" />
    </motion.div>
    {subtitle && (
    <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 mt-4 max-w-2xl mx-auto"
    >
        {subtitle}
    </motion.p>
    )}
</div>
);
};

// --- Data ---

const SKILLS = [
{ category: "Languages", items: ["Python", "C", "JavaScript", "SQL"], icon: <Code2 size={20} />, proficiency: 85 },
{ category: "AI / ML", items: ["TensorFlow", "PyTorch", "Scikit-learn", "NumPy", "Pandas"], icon: <BrainCircuit size={20} />, proficiency: 90 },
{ category: "Web Dev", items: ["React", "Next.js", "Tailwind CSS", "HTML/CSS"], icon: <Globe size={20} />, proficiency: 80 },
{ category: "Tools", items: ["Git & GitHub", "Linux", "VS Code", "Jupyter"], icon: <Terminal size={20} />, proficiency: 75 },
];

const PROJECTS = [
{
title: "Agami AI",
desc: "Advanced AI project focusing on predictive analytics and neural processing.",
tech: ["Python", "Deep Learning", "AI"],
links: [
{ url: "https://github.com/Anir6800/AgamiAI", type: "Repo 1" },
{ url: "https://github.com/Anir6800/Agami_AI", type: "Repo 2" }
]
},
{
title: "Machi Magic",
desc: "Innovative solution integrating machine learning for smart automation.",
tech: ["ML", "Automation", "Python"],
links: [
{ url: "https://github.com/Anir6800/MachiMagic", type: "GitHub" }
]
},
{
title: "Plannerium",
desc: "Intelligent scheduling assistant utilizing data structures for optimization.",
tech: ["React", "Algorithms", "Web"],
links: [
{ url: "https://github.com/Anir6800/Plannerium", type: "GitHub" }
]
},
{
title: "Impector",
desc: "NASA Space Apps Challenge entry. Space data visualization and analysis tool.",
tech: ["Data Science", "Visualization", "Space Apps"],
links: [
{ url: "https://github.com/Anir6800/Impector-2025", type: "GitHub" }
]
},
{
title: "OrbitTrack",
desc: "Satellite tracking and orbital mechanics simulation software.",
tech: ["Physics", "Simulation", "Tracking"],
links: [
{ url: "https://github.com/Anir6800/OrbitTrack", type: "Core" },
{ url: "https://github.com/Anir6800/OrbiTrack_W", type: "Web" }
]
}
];

const SOCIALS = [
{ icon: <Mail size={20} />, label: "Email", href: "mailto:anir6800@gmail.com", value: "anir6800@gmail.com" },
{ icon: <Github size={20} />, label: "GitHub", href: "https://github.com/Anir6800", value: "@Anir6800" },
{ icon: <Linkedin size={20} />, label: "LinkedIn", href: "https://www.linkedin.com/in/aniruddh-rathod-5ba722245/", value: "Aniruddh Rathod" },
{ icon: <Instagram size={20} />, label: "Instagram", href: "https://www.instagram.com/ani_r_6800/", value: "@ani_r_6800" },
{ icon: <Twitter size={20} />, label: "X (Twitter)", href: "https://x.com/Anir_r_666", value: "@Anir_r_666" },
{ icon: <Facebook size={20} />, label: "Facebook", href: "https://www.facebook.com/aniruddh.rathod.7543", value: "Aniruddh Rathod" },
];

// --- Main App Component ---

export default function App() {
const { scrollYProgress } = useScroll();
const scaleX = useSpring(scrollYProgress, {
stiffness: 100,
damping: 30,
restDelta: 0.001
});

return (
<motion.div
  className="bg-[#030305] min-h-screen text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1.5, ease: "easeOut" }}
>
    <ThreeBackground />
    <CustomCursor />
    <FloatingParticles />

    {/* Progress Bar */}
    <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-500 to-cyan-500 origin-left z-[100]"
            style={{ scaleX }}
    />

    {/* Navigation */}
    <nav className="fixed top-0 left-0 w-full z-40 flex justify-center pt-6 pointer-events-none">
        <div className="pointer-events-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 flex gap-6 items-center shadow-lg">
            <span className="text-sm font-bold tracking-widest text-cyan-400">AR</span>
            <div className="w-px h-4 bg-white/20"></div>
            <a href="#about" className="text-xs hover:text-white transition-colors text-gray-400">BIO</a>
            <a href="#projects" className="text-xs hover:text-white transition-colors text-gray-400">WORK</a>
            <a href="#contact" className="text-xs hover:text-white transition-colors text-gray-400">CONNECT</a>
        </div>
    </nav>

    {/* HERO SECTION */}
    <section className="min-h-screen flex flex-col justify-center items-center relative px-4 pt-20">
        <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 text-center max-w-4xl"
        >
        <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-6"
        >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            Open for Collaboration
        </motion.div>

        <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500">
              Aniruddh Rathod
            </span>
        </h1>

        <div className="text-xl md:text-2xl text-gray-400 mb-8 font-light min-h-[2rem]">
            <TypingEffect text="Student Developer • AI & ML Enthusiast" speed={40} startDelay={1000} />
        </div>

        <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
            <RippleButton
                    as="a"
                    href="#projects"
                    className="group relative px-8 py-3 rounded-full bg-white text-black font-semibold overflow-hidden hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
            >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors">
                View Projects <Layers size={16} />
              </span>
            </RippleButton>
            <RippleButton
                    as="a"
                    href="#contact"
                    className="px-8 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-cyan-500/30 hover:shadow-md hover:shadow-cyan-500/10 transition-all duration-300 flex items-center gap-2"
            >
                Contact Me
            </RippleButton>
        </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
        >
            <span className="text-[10px] uppercase tracking-widest">Scroll</span>
            <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
            >
                <ChevronDown size={20} />
            </motion.div>
        </motion.div>
    </section>

    {/* ABOUT & BIO SECTION */}
    <section id="about" className="py-24 px-4 relative z-10 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: useTransform(scrollYProgress, [0.1, 0.3], ['radial-gradient(circle at 50% 50%, rgba(6,182,212,0.1) 0%, transparent 70%)', 'radial-gradient(circle at 50% 50%, rgba(139,92,246,0.15) 0%, transparent 70%)'])
          }}
        />
        <div className="max-w-6xl mx-auto relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                >
                    <SectionHeading title="About Me" />
                    <div className="text-lg text-gray-300 leading-relaxed space-y-6">
                        <p>
                            I am a passionate <span className="text-cyan-400 font-semibold">AI & Data Science</span> student currently pursuing my Bachelor of Engineering. My journey began with a Diploma in Computer Engineering, where I built a strong foundation in software principles.
                        </p>
                        <p>
                            Driven by curiosity, I transitioned into the world of Artificial Intelligence, fascinated by how neural networks can mimic human cognition. I spend my days training models, visualizing complex datasets, and building tools that bridge the gap between raw data and actionable insights.
                        </p>
                        <p>
                            My goal is to engineer systems that are not just functional, but intelligent and adaptive.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                >
                    <GlassCard className="p-8 border-l-4 border-l-cyan-500">
                        <h3 className="text-2xl font-bold mb-6 text-white">Education Path</h3>
                        <div className="space-y-8 border-l border-white/10 ml-3 pl-8 relative">
                            {/* Timeline Item 1 */}
                            <div className="relative">
                                <span className="absolute -left-[39px] top-1 w-5 h-5 rounded-full bg-[#030305] border-2 border-cyan-500" />
                                <span className="text-cyan-400 text-sm font-mono mb-1 block">Current</span>
                                <h4 className="text-xl font-bold text-white">B.E. in Artificial Intelligence & Data Science</h4>
                                <p className="text-gray-400 text-sm">Deepening knowledge in ML algorithms and Big Data.</p>
                            </div>
                            {/* Timeline Item 2 */}
                            <div className="relative">
                                <span className="absolute -left-[39px] top-1 w-5 h-5 rounded-full bg-[#030305] border-2 border-gray-600 group-hover:border-cyan-500 transition-colors" />
                                <span className="text-gray-500 text-sm font-mono mb-1 block">Completed</span>
                                <h4 className="text-xl font-bold text-white">Diploma in Computer Engineering</h4>
                                <p className="text-gray-400 text-sm">Foundational software development and hardware architecture.</p>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </div>
    </section>

    {/* SKILLS SECTION */}
    <section className="py-24 px-4 relative z-10 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: useTransform(scrollYProgress, [0.3, 0.5], ['radial-gradient(circle at 30% 70%, rgba(6,182,212,0.08) 0%, transparent 60%)', 'radial-gradient(circle at 70% 30%, rgba(139,92,246,0.12) 0%, transparent 60%)'])
          }}
        />
        <div className="max-w-6xl mx-auto relative z-10">
            <SectionHeading title="Technical Arsenal" subtitle="Tools and technologies I use to bring ideas to life." />

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
                {SKILLS.map((skill, idx) => (
                <motion.div
                        key={idx}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 }
                        }}
                        transition={{ duration: 0.5 }}
                >
                    <GlassCard className="p-6 h-full hover:bg-white/[0.05]">
                        <div className="mb-4 text-cyan-400 p-3 bg-cyan-500/10 rounded-xl w-fit">
                            {skill.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-4 text-white">{skill.category}</h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {skill.items.map((item, i) => (
                            <span key={i} className="text-xs font-medium px-2 py-1 rounded-md bg-white/5 text-gray-300 border border-white/5">
                        {item}
                      </span>
                            ))}
                        </div>
                        <div className="mt-auto">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Proficiency</span>
                                <span>{skill.proficiency}%</span>
                            </div>
                            <ProgressBar progress={skill.proficiency} />
                        </div>
                    </GlassCard>
                </motion.div>
                ))}
            </motion.div>
        </div>
    </section>

    {/* PROJECTS SECTION */}
    <section id="projects" className="py-24 px-4 relative z-10 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-25"
          style={{
            background: useTransform(scrollYProgress, [0.5, 0.7], ['radial-gradient(circle at 50% 20%, rgba(139,92,246,0.1) 0%, transparent 50%)', 'radial-gradient(circle at 50% 80%, rgba(6,182,212,0.15) 0%, transparent 50%)'])
          }}
        />
        <div className="max-w-6xl mx-auto relative z-10">
            <SectionHeading title="Featured Projects" subtitle="Real-world applications of AI, ML, and Software Engineering." />

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.15
                  }
                }
              }}
            >
                {PROJECTS.map((project, index) => (
                <motion.div
                        key={index}
                        variants={{
                          hidden: { opacity: 0, y: 30 },
                          visible: { opacity: 1, y: 0 }
                        }}
                        transition={{ duration: 0.6 }}
                        className={index === 4 ? "md:col-span-2 md:w-2/3 md:mx-auto" : ""}
                        whileHover={{
                          rotateY: 5,
                          scale: 1.02,
                          transition: { duration: 0.3 }
                        }}
                        style={{ perspective: 1000 }}
                >
                <GlassCard className="group h-full flex flex-col p-0 hover:shadow-2xl hover:shadow-cyan-500/20">
                    <div className="p-8 flex flex-col h-full relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <motion.div
                              className="p-3 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/10"
                              whileHover={{ scale: 1.1, rotate: 10 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                <Layers className="text-cyan-300" size={24} />
                            </motion.div>
                            <div className="flex gap-2">
                                {project.links.map((link, lIdx) => (
                                <motion.a
                                        key={lIdx}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-full bg-white/5 hover:bg-white/20 transition-colors text-gray-300 hover:text-white"
                                        title={link.type}
                                        whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                                        whileTap={{ scale: 0.95 }}
                                >
                                    <Github size={18} />
                                </motion.a>
                                ))}
                            </div>
                        </div>

                        <motion.h3
                          className="text-2xl font-bold text-white mb-2"
                          whileHover={{ color: "#06b6d4" }}
                        >
                            {project.title}
                        </motion.h3>
                        <p className="text-gray-400 mb-6 flex-grow">
                            {project.desc}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-auto">
                            {project.tech.map((t, tIdx) => (
                            <motion.span
                              key={tIdx}
                              className="text-xs font-mono text-cyan-200/80"
                              whileHover={{ scale: 1.05, color: "#06b6d4" }}
                            >
                          #{t}
                        </motion.span>
                            ))}
                        </div>
                    </div>

                    {/* Decorative background gradient */}
                    <motion.div
                      className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl"
                      whileHover={{ scale: 1.2, opacity: 0.4 }}
                      transition={{ duration: 0.5 }}
                    />
                </GlassCard>
                </motion.div>
                ))}
            </motion.div>
        </div>
    </section>

    {/* CONTACT SECTION */}
    <section id="contact" className="py-24 px-4 relative z-10 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: useTransform(scrollYProgress, [0.7, 0.9], ['radial-gradient(circle at 20% 50%, rgba(6,182,212,0.12) 0%, transparent 40%)', 'radial-gradient(circle at 80% 50%, rgba(139,92,246,0.18) 0%, transparent 40%)'])
          }}
        />
        <div className="max-w-4xl mx-auto relative z-10">
            <SectionHeading title="Initialize Connection" />

            <GlassCard className="p-8 md:p-12 border border-cyan-500/30 shadow-[0_0_50px_-12px_rgba(6,182,212,0.2)]">
                <div className="grid md:grid-cols-2 gap-12">

                    {/* Left: Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-1">Get in Touch</h3>
                            <p className="text-gray-400 text-sm">Feel free to reach out for collaborations or just a chat.</p>
                        </div>

                        <div className="space-y-4">
                            <a href="tel:+919624519644" className="flex items-center gap-4 text-gray-300 hover:text-cyan-400 transition-colors group">
                                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                                    <Phone size={20} />
                                </div>
                                <span className="text-sm font-mono">+91 96245 19644</span>
                            </a>

                            <div className="flex items-center gap-4 text-gray-300 hover:text-cyan-400 transition-colors group">
                                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                                    <Mail size={20} />
                                </div>
                                <div className="flex flex-col text-sm font-mono">
                                    <a href="mailto:anir6800@gmail.com" className="hover:underline">anir6800@gmail.com</a>
                                    <a href="mailto:anir6800@outlook.com" className="hover:underline text-gray-500">anir6800@outlook.com</a>
                                </div>
                            </div>
                        </div>

                        {/* Social Grid */}
                        <div className="pt-4">
                            <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">Social Protocols</p>
                            <div className="flex flex-wrap gap-3">
                                {SOCIALS.slice(1).map((social, idx) => (
                                <a
                                        key={idx}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-cyan-500/20 hover:border-cyan-500/50 hover:text-cyan-400 transition-all duration-300 hover:-translate-y-1"
                                        title={social.label}
                                >
                                    {social.icon}
                                </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Terminal Effect */}
                    <div className="bg-black/40 rounded-xl border border-white/10 p-4 font-mono text-xs md:text-sm relative overflow-hidden group min-h-[200px]">
                        <div className="flex gap-2 mb-4 opacity-50">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                        <div className="space-y-2 text-gray-300">
                            <p>
                                <span className="text-green-400">user@portfolio:~$</span>
                                <TypingEffect text=" ./connect_aniruddh.sh" speed={30} startDelay={0} showCursor={false} />
                            </p>
                            <div className="text-cyan-400">
                                <TypingEffect text="Initializing communication protocols..." speed={20} startDelay={1000} showCursor={false} />
                            </div>
                            <div>
                                <TypingEffect text="Loading contact modules... [100%]" speed={10} startDelay={2000} showCursor={false} />
                            </div>
                            <div className="text-yellow-400">
                                <TypingEffect text="Warning: High levels of enthusiasm detected." speed={20} startDelay={3000} showCursor={false} />
                            </div>
                            <div className="border-l-2 border-gray-700 pl-2 ml-2 text-gray-500 italic mt-2">
                                <TypingEffect
                                        text='"I am always open to discussing new projects, creative ideas or opportunities to be part of your visions."'
                                        speed={30}
                                        startDelay={4500}
                                        showCursor={true}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </GlassCard>
        </div>
    </section>

    {/* FOOTER */}
    <footer className="py-8 text-center border-t border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-gray-500 text-sm">
                © 2025 Aniruddh Rathod — AI/ML Developer Portfolio
            </p>
            <p className="text-xs text-gray-700 font-mono">
                Built with React • Three.js • Tailwind
            </p>
        </div>
    </footer>
</motion.div>
);
}