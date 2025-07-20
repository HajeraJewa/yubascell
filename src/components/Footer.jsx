import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white mt-10">
      <div className="container mx-auto px-4 py-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        {/* Brand Info */}
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-bold">Yubascell</h2>
          <p className="text-sm text-gray-400 mt-1">
            © {new Date().getFullYear()} Yubascell. All rights reserved.
          </p>
        </div>

        {/* Social Media */}
        <div className="flex space-x-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-amber-500 transition"
          >
            <FaFacebookF size={20} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-amber-500 transition"
          >
            <FaInstagram size={20} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-amber-500 transition"
          >
            <FaTwitter size={20} />
          </a>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noreferrer"
            className="hover:text-amber-500 transition"
          >
            <FaWhatsapp size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
