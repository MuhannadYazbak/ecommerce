import ForgotPassword from '@/components/forgotPassword/forgotPassword';

export const metadata = {
  title: "TechMart | Forgot Your Password",
  description: "Forgot your password? No worries, you can reset your password securely",
  keywords: [
    "TechMart",
    "personalized shopping",
    "reset password",
    "forgot password",
  ],
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    title: "TechMart | Forgot Your Password",
    description: "Forgot your password? No worries, you can reset your password securely",
    url: "https://techmart.com/forgotPassword",
    siteName: "TechMart"
  },
  alternates: {
    canonical: "https://techmart.com/forgotPassword"
  }
};

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}