import React from 'react';
import { Github, Linkedin, Twitter, Mail, FileText, Globe } from 'lucide-react';
function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-12">
          <img
            src="/profile.jpg"
            alt="Profile"
            className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg object-cover"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Yash Dangar</h1>
          <p className="text-xl text-gray-600">Computer Engineer</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About Me</h2>
          <p className="text-gray-700 leading-relaxed">
            I am a 3rd year computer Engineering student and full-stack web developer.
          </p>
        </div>

        {/* Contact & Social */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect With Me</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://github.com/yashdangar"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Github size={20} />
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/yash-dangar-43104921a/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Linkedin size={20} />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://x.com/YashDangar20"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
            >
              <Twitter size={20} />
              <span>Twitter</span>
            </a>
            <a
              href="mailto:yashdangar123@gmail.com"
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Mail size={20} />
              <span>Email</span>
            </a>
            <a
              href="https://drive.google.com/file/d/1a5We8VzE7sURWMS_Bg6pAw63Po6BFq7G/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <FileText size={20} />
              <span>Resume</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;