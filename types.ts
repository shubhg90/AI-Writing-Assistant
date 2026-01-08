export enum Platform {
  LINKEDIN = 'LinkedIn',
  TWITTER = 'Twitter/X',
  INSTAGRAM = 'Instagram',
  FACEBOOK = 'Facebook',
  BLOG = 'Blog Post',
  EMAIL = 'Email Newsletter'
}

export enum Tone {
  PROFESSIONAL = 'Professional',
  CASUAL = 'Casual',
  WITTY = 'Witty',
  ENTHUSIASTIC = 'Enthusiastic',
  EMPATHETIC = 'Empathetic',
  AUTHORITATIVE = 'Authoritative'
}

export enum Length {
  SHORT = 'Short',
  MEDIUM = 'Medium',
  LONG = 'Long'
}

export interface GeneratedPost {
  id: string;
  originalIdea: string;
  content: string;
  platform: Platform;
  tone: Tone;
  timestamp: number;
}

export interface GenerationConfig {
  idea: string;
  platform: Platform;
  tone: Tone;
  length: Length;
}