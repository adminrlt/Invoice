import { useState } from 'react';
import type { AuthMode } from '../types';

export const useAuth = () => {
  const [mode, setMode] = useState<AuthMode>('login');

  return {
    mode,
    setMode
  };
};