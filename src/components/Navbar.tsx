'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import CartIcon from './CartIcon';

export default function Navbar() {
  const { user, guest, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <img src="/images/logo.png" alt="Logo" className="h-12 w-12" />
        <h1 className="text-xl font-semibold">TechMart</h1>
      </div>
      
      {user || guest ? (
        <div className="flex justify-center space-x-5">
          <span className='mt-2'>Hello, {user?.name || guest?.name}</span>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">
            Logout
          </button>
          <div className="flex justify-center space-x-15 bg-blue-100">
              <CartIcon />
              </div>
        </div>
      ) : (
        <span className="text-sm text-gray-300 italic">Please log in</span>
      )}
    </nav>
  );
}

// 'use client'

// import { useAuth } from '../hooks/useAuth';
// import { useRouter } from 'next/navigation';

// export default function Navbar() {
//   const router = useRouter();
//   const { user, ready } = useAuth();

//   // const handleLogout = () => {
//   //   localStorage.clear();
//   //   router.push('/login');
//   // };

//   const handleLogout = () => {
//   localStorage.clear();
//   window.dispatchEvent(new Event('auth-change'));
//   router.push('/login');
// };

//   if (!ready) return null; // prevent flicker during hydration

//   return (
//     <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
//       <div className="flex items-center space-x-3">
//         <img src="/images/logo.png" alt="Logo" className="h-8 w-8" />
//         <h1 className="text-xl font-semibold">TechMart</h1>
//       </div>

//       {user ? (
//         <div className="flex items-center space-x-4">
//           <span>Hello, {user.fullname.split(' ')[0]}</span>
//           <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">
//             Logout
//           </button>
//         </div>
//       ) : (
//         <span className="text-sm text-gray-300 italic">Please log in</span>
//       )}
//     </nav>
//   );
// }