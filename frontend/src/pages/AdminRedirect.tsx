import React, { useEffect, useState } from 'react';

const AdminRedirect: React.FC = () => {
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      // In production, we'll use the same domain but with /admin path
      // This will be handled by Nginx to route to the admin app
      const protocol = window.location.protocol;
      const host = window.location.host;
      const path = '/admin';
      
      window.location.href = `${protocol}//${host}${path}`;
      setRedirecting(false);
    }, 2500); // 2.5 seconds delay

    return () => clearTimeout(redirectTimer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <p className="text-2xl mb-4">Redirecting to admin panel...</p>
      {redirecting && (
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      )}
    </div>
  );
};

export default AdminRedirect;
