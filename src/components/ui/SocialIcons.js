// src/components/ui/SocialIcons.js
import { Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react';

export const SocialIcon = ({ platform, className }) => {
  const icons = {
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
    youtube: Youtube,
    linkedin: Linkedin,
  };

  const Icon = icons[platform.toLowerCase()];
  if (!Icon) return null;

  return <Icon className={className} />;
};