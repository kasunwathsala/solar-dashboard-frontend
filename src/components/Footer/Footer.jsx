import React from "react";
import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 mt-12">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/assets/images/sun.png" alt="SunLeaf Energy" className="h-10 w-auto object-contain" />
              <span className="text-lg font-semibold text-foreground">SunLeaf Energy</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xs">Revolutionizing solar energy monitoring with actionable insights, instant alerts and easy-to-use dashboards.</p>
            <div className="flex items-center gap-3 mt-6">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">f</a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">t</a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">in</a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">git</a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Solutions</h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
              <li><a href="#">Digital Twin Platform</a></li>
              <li><a href="#">Predictive Analytics</a></li>
              <li><a href="#">Remote Monitoring</a></li>
              <li><a href="#">Performance Optimization</a></li>
              <li><a href="#">Real-time Alerts</a></li>
              <li><a href="#">Maintenance Planning</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
              <li><a href="#">Documentation</a></li>
              <li><a href="#">API Reference</a></li>
              <li><a href="#">Case Studies</a></li>
              <li><a href="#">White Papers</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Support Center</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Get in Touch</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">Kasun<br/>Mapalana, Kamburupitiya</p>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">+94770417565<br/>contact@sunleaf.energy</p>

            <div className="mt-4">
              <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">Stay Updated</label>
              <div className="flex gap-2">
                <input type="email" placeholder="Enter your email" className="flex-1 px-3 py-2 rounded border border-gray-200 focus:outline-none" />
                <button className="px-4 py-2 bg-blue-600 text-white rounded">Subscribe</button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-800 text-sm text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
            <a href="#">Accessibility</a>
          </div>
          <div>© 2025 SunLeaf Energy. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
