import Checkout from '@/components/checkout/Checkout';
// Page-specific metadata for SEO
export const metadata = {
  title: "TechMart | Secure Checkout",
  description: "Complete your purchase securely on TechMart",
  keywords: ["checkout", "secure payment", "TechMart", "online shopping", "ecommerce"],
};

export default function CheckoutPage(){
  return <Checkout />
}