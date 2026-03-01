export interface BookingState {
  service?: string;
  price?: string;
  duration?: string;
  stylist?: string;
  slot?: string;
}

export interface Stylist {
  name: string;
  specialty: string;
  years: number;
  initials: string;
  accentFrom: string;
  accentTo: string;
  clients: string;
  slug: string;
}

export interface Service {
  name: string;
  price: string;
  duration: string;
  description: string;
  tag: string | null;
  slug: string;
}
