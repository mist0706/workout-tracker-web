// Version Footer - injected via build env vars
export const VersionFooter = () => {
  // Get version from env vars
  const gitSha = import.meta.env.VITE_GIT_SHA?.slice(0, 8) || 'dev';
  const buildTime = import.meta.env.VITE_BUILD_TIME || new Date().toISOString();
  
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-100/90 backdrop-blur-sm border-t border-gray-200 px-4 py-1.5 text-center z-50">
      <span className="text-[10px] text-gray-400 font-mono select-none">
        v{gitSha} • {new Date(buildTime).toLocaleString()} • Deployed via CI/CD
      </span>
    </footer>
  );
};