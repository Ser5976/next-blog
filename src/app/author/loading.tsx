import React from 'react';

import { LoadingScreen } from '@/shared/ui/loading-screen';

const AuthorLoadingScreen = () => {
  return (
    <LoadingScreen
      title="Loading Dashboard..."
      text="Please wait while we prepare your dashboard"
    />
  );
};

export default AuthorLoadingScreen;
