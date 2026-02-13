import React, { useState } from 'react';
import Home from './components/Home';
import Workspace from './components/Workspace';
import { UserContext, CloudProvider } from './types';

const App: React.FC = () => {
  const [context, setContext] = useState<UserContext | null>(null);

  const handleResearch = (prompt: string, provider: CloudProvider) => {
    setContext({ prompt, provider });
  };

  return (
    <div className="w-full min-h-screen text-slate-900 font-sans">
      {!context ? (
        <Home onResearch={handleResearch} />
      ) : (
        <Workspace context={context} onReset={() => setContext(null)} />
      )}
    </div>
  );
};

export default App;
