import CheckoutNavbar from '@/components/checkout/CheckoutNavbar';
import CheckoutFooter from '@/components/checkout/CheckoutFooter';
import NewHeader from '@/components/landing/NewHeader';
import Footer from '@/components/Footer';


export default function CheckoutLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <NewHeader />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
}
