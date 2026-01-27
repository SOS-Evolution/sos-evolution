// =============================================
// Database Types for SOS Evolution
// =============================================

// === LECTURAS (Original) ===
export interface ReadingData {
  cardName: string;
  keywords: string[];
  description: string;
  action: string;
}

// === PROFILES ===
export interface Profile {
  id: string;
  full_name: string | null;
  display_name: string | null;
  birth_date: string | null; // ISO date string
  birth_place: string | null;
  birth_time: string | null;
  latitude: number | null;
  longitude: number | null;
  gender: string | null;
  life_path_number: number | null;
  zodiac_sign: string | null;
  avatar_url: string | null;
  extra_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdate {
  full_name?: string;
  display_name?: string;
  birth_date?: string;
  birth_place?: string;
  birth_time?: string;
  latitude?: number;
  longitude?: number;
  gender?: string;
  life_path_number?: number;
  zodiac_sign?: string;
  avatar_url?: string;
  extra_data?: Record<string, unknown>;
}

// === CREDITS ===
export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  source: 'mission' | 'purchase' | 'admin' | 'reading' | 'bonus' | 'refund';
  description: string | null;
  reference_id: string | null;
  created_at: string;
}

export interface UserBalance {
  balance: number;
  transactions: CreditTransaction[];
}

// === MISSIONS ===
export interface Mission {
  id: string;
  code: string;
  title: string;
  description: string | null;
  reward_credits: number;
  trigger_type: 'manual' | 'auto_profile' | 'auto_reading' | 'auto_streak';
  trigger_config: Record<string, unknown>;
  icon: string;
  is_active: boolean;
  sort_order: number;
}

export interface UserMission {
  id: string;
  user_id: string;
  mission_id: string;
  progress: number;
  target: number;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  // Joined data
  mission?: Mission;
}

export interface CompleteMissionResult {
  success: boolean;
  error?: string;
  mission?: string;
  reward?: number;
  new_balance?: number;
}

// === READING TYPES ===
export interface ReadingType {
  id: string;
  code: string;
  name: string;
  description: string | null;
  credit_cost: number;
  icon: string;
  prompt_template: string | null;
  is_active: boolean;
  sort_order: number;
}

// === LECTURAS (Enhanced) ===
export interface Lectura {
  id: string;
  user_id: string;
  reading_type_id: string | null;
  card_name: string;
  keywords: string[];
  description: string;
  action: string;
  question: string | null;
  created_at: string;
  // Joined data
  reading_type?: ReadingType;
}

// === CARD STATISTICS ===
export interface CardStat {
  card_name: string;
  times_drawn: number;
  last_drawn: string;
}

// === API REQUEST/RESPONSE TYPES ===
export interface LecturaRequest {
  question?: string;
  cardIndex?: number;
  readingTypeCode?: string;
}

export interface LecturaResponse extends ReadingData {
  id?: string;
  creditsUsed?: number;
  newBalance?: number;
}

export interface DashboardData {
  profile: Profile;
  balance: number;
  missions: UserMission[];
  topCard: CardStat | null;
  recentLecturas: Lectura[];
}
