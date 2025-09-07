export interface ResetPasswordToken {
  id: number;
  user_id: number;
  token_hash: string;
  expires_at: Date;
  used: boolean;
}