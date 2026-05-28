export interface Experience {
  role: string;
  company: string;
  duration: string;
  bullet_points: string[];
}

export interface Testimonial {
  reviewer_name: string;
  designation: string;
  review_text: string;
  avatar_url?: string;
}

export interface Profile {
  id: string;
  user_id?: string;
  slug: string;
  full_name: string;
  professional_title: string;
  avatar_url: string;
  bio: string;
  resume_url: string;
  theme_color: string;
  created_at: string;
  animation_style?: 'fade' | 'slide-up' | 'glitch' | 'liquid-reveal';
  animation_speed?: 'slow' | 'normal' | 'fast';
  background_effect?: 'mesh-gradient' | 'particles' | 'matrix' | 'none';
  layout_variant?: 'classic' | 'minimalist' | 'cyberpunk-grid';
  custom_font?: string;
  experiences?: Experience[];
  testimonials?: Testimonial[];
  skills?: Skill[];
  projects?: Project[];
  social_links?: SocialLink[];
}

export interface Skill {
  id: string;
  profile_id: string;
  skill_name: string;
  category: string;
}

export interface Project {
  id: string;
  profile_id: string;
  title: string;
  description: string;
  image_url: string;
  live_link: string;
  github_link: string;
  display_order: number;
}

export interface SocialLink {
  id: string;
  profile_id: string;
  platform: string;
  url: string;
}
