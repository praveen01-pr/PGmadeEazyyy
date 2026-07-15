import { NavLink } from "react-router-dom";
import { Mail, Linkedin, Twitter, Instagram, Github, Send, ArrowUp } from "lucide-react";

export default function Footer() {
  
  // Scroll to Top Function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-black/90 backdrop-blur-lg border-t border-orange-600 text-gray-300 py-10 relative">
      <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Brand & Description */}
        <div>
          <h2 className="text-xl font-bold text-white">PG Made Eazy</h2>
          <p className="mt-2 text-gray-400">Find and list PG accommodations with ease. Secure, verified, and hassle-free.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-orange-500">Quick Links</h3>
          <ul className="mt-3 space-y-2">
            <li><NavLink to="/" className="hover:text-orange-500 transition">Home Page</NavLink></li>
            <li><NavLink to="/how-it-works" className="hover:text-orange-500 transition">How it Works</NavLink></li>
            <li><NavLink to="/contact" className="hover:text-orange-500 transition">Contact</NavLink></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-orange-500">Contact Us</h3>
          <ul className="mt-3 space-y-2">
            <li className="flex items-center gap-2"><Mail className="h-5 w-5 text-orange-500" /> support@pgmadeeazy.com</li>
            <li className="flex items-center gap-2"> Hyderabad, India</li>
            <li className="flex items-center gap-2"> +91 8247593561</li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div>
          <h3 className="text-lg font-semibold text-orange-500">Stay Updated</h3>
          <p className="mt-2 text-gray-400">Subscribe to get the latest PG listings & updates.</p>
          <form className="mt-3 flex gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full p-3 text-white placeholder-white bg-transparent border border-white rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <button type="submit" className="bg-orange-500 px-4 py-3 rounded-md hover:bg-orange-600 transition flex items-center">
              <Send className="h-5 w-5 text-black" />
            </button>
          </form>
        </div>

      </div>

      {/* Social Media & Copyright */}
      <div className="border-t border-orange-600 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center px-6 text-gray-400">
        
        {/* Social Icons */}
        <div className="flex space-x-4">
          <a href="https://www.linkedin.com/in/vamshi05" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition">
            <Linkedin className="h-6 w-6" />
          </a>
          <a href="https://x.com/vamshi_0508" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition">
            <Twitter className="h-6 w-6" />
          </a>
          <a href="https://www.instagram.com/mruh_meme_project_/" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition">
            <Instagram className="h-6 w-6" />
          </a>
          <a href="https://github.com/VamshiMudiraj05" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition">
            <Github className="h-6 w-6" />
          </a>
        </div>

        {/* Copyright Text */}
        <p className="mt-4 sm:mt-0"> {new Date().getFullYear()} PG Made Eazy. All Rights Reserved.</p>
      </div>

      {/* Back to Top Button - Centered */}
      <div className="mt-10 flex justify-center">
        <button 
          onClick={scrollToTop}
          className="bg-orange-500 px-6 py-3 rounded-md shadow-lg hover:bg-orange-600 transition transform hover:scale-105 flex items-center gap-2 text-black font-medium"
        >
          <ArrowUp className="h-5 w-5" />
          <span>Back to Top</span>
        </button>
      </div>

    </footer>
  );
}