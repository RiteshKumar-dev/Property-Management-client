import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />

      <div className="pt-24 grow max-w-7xl mx-auto p-6 w-full">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}

export default Layout;
