
import React, { useState, useRef, useEffect, useCallback } from 'react';

// Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in-fast" onClick={onClose}>
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-full max-w-2xl text-white relative" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// Particle Canvas Background
const GalaxyBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mousePos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: { x: number; y: number; size: number; speedX: number; speedY: number; color: string }[];
        
        const colors = ['#FFFFFF', '#FFD700', '#ADD8E6', '#E6E6FA'];
        
        const handleMouseMove = (event: MouseEvent) => {
            mousePos.current = { x: event.clientX, y: event.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 1.2 + 0.3,
                    speedX: (Math.random() * 0.2 - 0.1),
                    speedY: (Math.random() * 0.2 - 0.1),
                    color: colors[Math.floor(Math.random() * colors.length)]
                });
            }
        };

        const animate = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                // Parallax effect calculation
                const distanceX = p.x - mousePos.current.x;
                const distanceY = p.y - mousePos.current.y;
                const forceX = distanceX / 2000;
                const forceY = distanceY / 2000;

                p.x -= forceX;
                p.y -= forceY;

                p.x += p.speedX;
                p.y += p.speedY;

                if (p.x > canvas.width + 5) p.x = -5;
                if (p.x < -5) p.x = canvas.width + 5;
                if (p.y > canvas.height + 5) p.y = -5;
                if (p.y < -5) p.y = canvas.height + 5;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        resizeCanvas();
        animate();
        
        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};


// Main Theme Layout Component
interface ThemeLayoutProps {
  children: React.ReactNode;
}

export const ThemeLayout: React.FC<ThemeLayoutProps> = ({ children }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (modalName: string) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

  const navLinks = ["About", "Contact", "Guide", "Privacy Policy", "Terms of Service", "DMCA"];

  return (
    <div className="relative min-h-screen w-full flex flex-col text-white font-sans overflow-x-hidden">
      <GalaxyBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-gray-900/70 to-black/30 -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(128,0,128,0.2)_0%,rgba(0,0,0,0)_70%)] -z-10" />


      <header className="w-full p-4 animate-fade-in-slow">
        <nav className="max-w-7xl mx-auto flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
            {navLinks.map(link => (
                <button key={link} onClick={() => openModal(link)} className="text-gray-400 hover:text-purple-400 transition-colors duration-300 text-sm">
                    {link}
                </button>
            ))}
        </nav>
      </header>

      <main className="flex-grow flex items-center justify-center py-12 px-4 animate-fade-in">
        {children}
      </main>

      <footer className="w-full text-center p-6 text-gray-500 text-sm animate-fade-in-slow">
        <p>
            Powered by <a href="https://github.com/hsinidev" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline" style={{color: '#FFD700'}}>HSINI MOHAMED</a>
        </p>
        <p className="mt-1">
            doodax.com | hsini.web@gmail.com
        </p>
      </footer>
      
      {/* Modals */}
      <Modal isOpen={activeModal === "About"} onClose={closeModal} title="About Us">
        <p>This Email Validator is a free tool designed to help developers, marketers, and individuals quickly check the format and syntax of email addresses. Using client-side JavaScript and Regular Expressions, it provides instant feedback without sending any data to a server, ensuring your privacy.</p>
      </Modal>
      <Modal isOpen={activeModal === "Contact"} onClose={closeModal} title="Contact">
        <p>For inquiries, please reach out to us at <a href="mailto:hsini.web@gmail.com" className="text-purple-400">hsini.web@gmail.com</a> or visit our website at doodax.com.</p>
      </Modal>
      <Modal isOpen={activeModal === "Guide"} onClose={closeModal} title="How to Use">
        <p>Simply enter an email address into the input field and click the "Check Format" button. The tool will instantly analyze the email's structure and provide a "VALID" or "INVALID" status, along with a breakdown of specific checks performed.</p>
      </Modal>
       <Modal isOpen={activeModal === 'Privacy Policy'} onClose={closeModal} title="Privacy Policy">
        <p>We respect your privacy. This tool operates entirely within your browser. No email addresses or any other data are ever sent to our servers. All validation is performed on your local machine.</p>
      </Modal>
      <Modal isOpen={activeModal === 'Terms of Service'} onClose={closeModal} title="Terms of Service">
        <p>This service is provided "as is", without any warranty. Use it at your own risk. We are not liable for any damages or losses related to the use of this free tool. The validation provided is for format checking only and does not guarantee email deliverability.</p>
      </Modal>
      <Modal isOpen={activeModal === 'DMCA'} onClose={closeModal} title="DMCA">
        <p>If you believe that any content on this site infringes on your copyright, please contact us at hsini.web@gmail.com with a valid DMCA complaint, and we will address it promptly.</p>
      </Modal>
    </div>
  );
};
