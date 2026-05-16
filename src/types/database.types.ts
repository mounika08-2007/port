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
