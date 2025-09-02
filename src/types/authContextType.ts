import { User } from './user';
import { SlimUser } from '@/types/user';
export interface AuthContextType {
  user: SlimUser | null;
  guest: SlimUser | null;
  ready: boolean;
  login: (userData: SlimUser, token: string) => void;
  logout: () => void;
  asGuest: (guestData: SlimUser, token: string) => void;
}