export interface OnboardingSlide {
  image: string;
  badgeIcon: string;
  badgeText: string;
  title: string;
  body: string;
}

export interface Cafe {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  image: string;
  tags: string[];
  openStatus: string;
}

export type FilterCategory = 'all' | 'specialty' | 'work' | 'top';

export interface CoffeePassStatus {
  available: boolean;
  badgeText: string;
  title: string;
  subtitle: string;
  iconName: string;
}
