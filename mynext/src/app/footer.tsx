"use client"
import './global.css'
import Link from 'next/link'

export default function Footer() {

    return ( 
       <div className="footers bg-white border-gray-200 dark:bg-gray-900">
            <div className="footer-containers">
              <div className="footer-section"> 
                <h4>Quick Links</h4>
                <ul>
                  <li><Link href="/about">About Us</Link></li>
                  <li><Link href="/support">Contact Us</Link></li>
                  <li><Link href="/FAQs">FAQs</Link></li>
                  <li><Link href="/terms-and-conditions">Terms & Conditions</Link></li>
                </ul>
              </div>
              <div className="footer-section">
                <h4>Contact Us</h4>
                <p>Email: support@onlinestore.com</p>
                <p>Phone: +123 456 7890</p>
                <p>Address: 123 E-commerce St, Online City</p>
              </div>
              <div className="footer-section">
                <h4>Follow Us</h4>
                <div className="social-icons">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                </div>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; {new Date().getFullYear()} OnlineStore. All rights reserved.</p>
            </div>
          </div>
    );
} 