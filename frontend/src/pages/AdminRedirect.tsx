import React, { useEffect } from 'react';

const AdminRedirect: React.FC = () => {
  useEffect(() => {
    const currentHost = window.location.hostname;
    const adminPort = 5174;
    const path = window.location.pathname.replace('/admin', '') || '/';
    window.location.href = `http://${currentHost}:${adminPort}${path}`;
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-xl">Redirecting to admin panel...</p>
    </div>
  );
};

export default AdminRedirect;
