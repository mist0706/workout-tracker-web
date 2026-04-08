import { useEffect, useState } from 'react';

export const VersionFooter = () => {
  const [version, setVersion] = useState('');
  const [buildTime, setBuildTime] = useState('');

  useEffect(() => {
    // Read from environment variables injected at build time
    setVersion(import.meta.env.VITE_GIT_SHA || 'dev');
    setBuildTime(import.meta.env.VITE_BUILD_TIME || new Date().toISOString());
  }, []);

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-200 px-4 py-1 text-center z-50">
      <span className="text-xs text-gray-400 font-mono">
        v{version.slice(0, 8)} • {new Date(buildTime).toLocaleString()}
      </span>
    </footer>
  );
};