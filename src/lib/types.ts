// src/lib/types.ts

// --- Strapi media ---
export interface StrapiMedia {
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

// --- Shared components ---
export interface MenuItem {
  label: string;
  sectionTarget: string;
}

export interface Link {
  label: string;
  url: string;
}

export interface CTAButton {
  label: string;
  url: string;
  style: 'primary' | 'secondary';
}

export interface Step {
  icon: string;
  title: string;
  description: string;
}

export interface GroupCard {
  icon: string;
  title: string;
  color: string;
  checkColor: string;
  scenario: string;
  howTheyUse: string[];
  value: string[];
}

export interface Stat {
  label: string;
  value: string;
  unit: string;
}

export interface MetricCard {
  icon: string;
  backgroundImage: StrapiMedia;
  bigNumber: string;
  label: string;
  barPercent: number;
  stats: Stat[];
}

export interface Change {
  text: string;
}

export interface BenefitRow {
  icon: string;
  title: string;
  image: StrapiMedia;
  description: string;
  changes: Change[];
}

export interface ContributeCard {
  title: string;
  description: string;
  url: string;
  icon: string;
}

// --- Single types ---
export interface NavbarData {
  logo: string;
  menuItems: MenuItem[];
  questionnairePopupTitle: string;
  questionnaireLinks: Link[];
  emailPlaceholder: string;
  formspreeUrl: string;
}

export interface HeroData {
  title: string;
  subtitle: string;
  desktopImage: StrapiMedia;
  mobileImage: StrapiMedia;
  ctaButtons: CTAButton[];
  emailPlaceholder: string;
  emailButtonText: string;
  contactText: string;
  contactUrl: string;
}

export interface HowItWorksData {
  title: string;
  subtitle: string;
  steps: Step[];
}

export interface GroupsData {
  title: string;
  caption: string;
  cards: GroupCard[];
}

export interface ImpactData {
  title: string;
  caption: string;
  metrics: MetricCard[];
}

export interface BenefitsData {
  title: string;
  caption: string;
  rows: BenefitRow[];
}

export interface FooterData {
  logo: string;
  tagline: string;
  emailLabel: string;
  emailPlaceholder: string;
  emailButtonText: string;
  formspreeUrl: string;
  contributeTitle: string;
  contributeCards: ContributeCard[];
  copyright: string;
}

// --- Questionnaire ---
export interface FieldOption {
  label: string;
  value: string;
  hasTextInput: boolean;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'textarea' | 'radio' | 'checkbox' | 'scale';
  placeholder?: string;
  required: boolean;
  minValue?: number;
  maxValue?: number;
  maxSelections?: number;
  scaleMin?: number;
  scaleMax?: number;
  conditionalOn?: string;
  conditionalValue?: string;
  options?: FieldOption[];
}

export interface FormSection {
  title: string;
  icon: string;
  fields: FormField[];
}

export interface MetaTag {
  icon: string;
  text: string;
}

export interface QuestionnaireData {
  slug: string;
  title: string;
  subtitle: string;
  metaInfo: MetaTag[];
  successTitle: string;
  successMessage: string;
  successLinkText: string;
  successLinkUrl: string;
  sections: FormSection[];
}
