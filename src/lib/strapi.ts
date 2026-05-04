// src/lib/strapi.ts
import type {
  NavbarData,
  HeroData,
  HowItWorksData,
  GroupsData,
  ImpactData,
  BenefitsData,
  FooterData,
  QuestionnaireData,
} from './types';

const STRAPI_URL = import.meta.env.STRAPI_API_URL;
const STRAPI_TOKEN = import.meta.env.STRAPI_API_TOKEN;

async function fetchStrapi<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${STRAPI_URL}/api/${endpoint}`);
  // Populate all first-level relations
  if (!Object.keys(params).some(k => k.includes('populate'))) {
    url.searchParams.set('populate', '*');
  }
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Strapi fetch failed: ${res.status} ${res.statusText} — ${endpoint}`);
  }

  const json = await res.json();
  return json.data;
}

// --- Single types ---
export async function getNavbar(): Promise<NavbarData> {
  return fetchStrapi<NavbarData>('navbar');
}

export async function getHero(): Promise<HeroData> {
  return fetchStrapi<HeroData>('hero');
}

export async function getHowItWorks(): Promise<HowItWorksData> {
  return fetchStrapi<HowItWorksData>('how-it-works');
}

export async function getGroups(): Promise<GroupsData> {
  return fetchStrapi<GroupsData>('groups-section');
}

export async function getImpact(): Promise<ImpactData> {
  return fetchStrapi<ImpactData>('impact', {
    'populate[metrics][populate]': '*',
  });
}

export async function getBenefits(): Promise<BenefitsData> {
  return fetchStrapi<BenefitsData>('benefits', {
    'populate[rows][populate]': '*',
  });
}

export async function getFooter(): Promise<FooterData> {
  return fetchStrapi<FooterData>('footer');
}

// --- Collection types ---
export async function getQuestionnaires(): Promise<QuestionnaireData[]> {
  return fetchStrapi<QuestionnaireData[]>('questionnaires', {
    'populate[sections][populate]': '*',
    'populate[metaInfo]': '*',
  });
}

export async function getQuestionnaireBySlug(slug: string): Promise<QuestionnaireData> {
  const results = await fetchStrapi<QuestionnaireData[]>(
    'questionnaires',
    {
      'filters[slug][$eq]': slug,
      'populate[sections][populate]': '*',
      'populate[metaInfo]': '*',
    }
  );
  if (!results || results.length === 0) {
    throw new Error(`Questionnaire not found: ${slug}`);
  }
  return results[0];
}
