export type PublicSession = {
  authenticated: boolean;
  role?: string;
  dashboardPath?: string;
  onboardingComplete?: boolean;
  user?: { email?: string };
  profile?: {
    first_name?: string;
    last_name?: string;
    profile_image?: string;
    slug?: string;
  };
  subscription?: { isPro?: boolean };
  completeness?: { percentage?: number };
};
