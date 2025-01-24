import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';

const TeamMemberCard = ({ name, role, image, description, Icon }) => {
  return (
    <div className="group animate-slide-up">
      <div className="relative">
        <div className="absolute inset-0 bg-[rgb(0,212,142)] rounded-xl transform rotate-6 group-hover:rotate-12 transition-all duration-300"></div>
        <div className="relative bg-white p-8 rounded-xl shadow-md group-hover:shadow-xl transition-all duration-300">
          <div className="relative mb-6">
            <img
              src={image}
              alt={name}
              className="w-32 h-32 rounded-full object-cover mx-auto transform group-hover:scale-105 transition-all duration-300"
            />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border-2 border-[rgb(0,212,142)] animate-pulse-ring"></div>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-2">{name}</h3>
            <p className="text-[rgb(0,212,142)] font-medium mb-4 flex items-center justify-center gap-2">
              <Icon className="w-4 h-4" />
              {role}
            </p>
            <p className="text-gray-600 mb-6">{description}</p>
            <div className="flex justify-center space-x-4">
              {[Github, Linkedin, Twitter].map((SocialIcon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-gray-600 hover:text-[rgb(0,212,142)] transform hover:scale-110 hover:rotate-12 transition-all duration-300"
                >
                  <SocialIcon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;