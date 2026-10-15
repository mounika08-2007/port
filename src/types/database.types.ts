export type CareerStage = 
  | 'first-year'
  | 'second-year'
  | 'third-year'
  | 'fourth-year'
  | 'job-seeker'
  | 'professional'
  | 'hr-recruiter';

export interface Education {
  id?: string;
  profile_id?: string;
  institution: string;
  degree: string;
  field_of_study?: string;
  start_year?: string;
  end_year?: string;
  grade_cgpa?: string;
  grade?: string;
  achievements?: string;
  display_order?: number;
}

export interface Certification {
  id?: string;
  profile_id?: string;
  title: string;
  issuer: string;
  issue_date?: string;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
  display_order?: number;
}

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

export interface GuestbookEntry {
  id: string;
  profile_id: string;
  visitor_name: string;
  message: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  profile_id: string;
  title: string;
  content: string;
  summary?: string;
  published_at: string;
}

export interface ThemePack {
  id?: string;
  slug: string;
  name: string;
  tagline: string;
  listed_price: number;
  currency: string;
  is_active: boolean;
  thumbnail_url?: string;
  recommended_for: CareerStage[];
  features: string[];
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface UserEntitlement {
  id?: string;
  user_id: string;
  pack_slug: string;
  status: 'active' | 'expired' | 'revoked';
  is_demo: boolean;
  listed_price_inr: number;
  amount_paid_inr: number;
  transaction_ref: string;
  notes?: string;
  activated_at?: string;
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
  // Multi-user PaaS extensions
  career_stage?: CareerStage;
  headline?: string;
  location?: string;
  phone?: string;
  is_published?: boolean;
  active_theme_pack?: string;
  published_at?: string;
  updated_at?: string;
  // Visual & styling settings
  animation_style?: 'fade' | 'slide-up' | 'glitch' | 'liquid-reveal';
  animation_speed?: 'slow' | 'normal' | 'fast';
  background_effect?: 'mesh-gradient' | 'particles' | 'matrix' | 'none';
  layout_variant?: 'classic' | 'minimalist' | 'cyberpunk-grid';
  custom_font?: string;
  // Relational data
  education?: Education[];
  certifications?: Certification[];
  experiences?: Experience[];
  testimonials?: Testimonial[];
  skills?: Skill[];
  projects?: Project[];
  social_links?: SocialLink[];
  github_username?: string;
  show_terminal_toggle?: boolean;
  sound_effects_enabled?: boolean;
  custom_terminal_welcome?: string;
  posts?: BlogPost[];
}

export interface Skill {
  id: string;
  profile_id: string;
  skill_name: string;
  category: string;
  proficiency?: string;
  display_order?: number;
}

export interface Project {
  id: string;
  profile_id: string;
  title: string;
  description: string;
  image_url: string;
  live_link?: string;
  github_link?: string;
  live_url?: string;
  github_url?: string;
  featured?: boolean;
  display_order: number;
  // Extended structured fields for case study presentations
  problem?: string;
  solution?: string;
  tech_stack?: any;
  contribution?: string;
}

export interface SocialLink {
  id: string;
  profile_id: string;
  platform: string;
  url: string;
}
