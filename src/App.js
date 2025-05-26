import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";

function App() {
  return (
    
    <CartProvider>
    <WishlistProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </WishlistProvider>
  </CartProvider>
  );
}

export default App;
