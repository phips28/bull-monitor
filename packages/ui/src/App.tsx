import React from 'react';
import Shell from '@/components/Shell';
import { QueryClient, QueryClientProvider } from 'react-query';
import { getMuiTheme } from '@/stores/theme';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ConfirmProvider } from 'material-ui-confirm';
import { SnackbarProvider } from 'notistack';
import { NetworkProvider } from './providers/network';
import { useRunStoreSideEffects } from './stores/side-effects';
import { QueuesQueryProvider } from './providers/queues-query';
import { useDynamicPageTitle } from './hooks/use-dynamic-page-title';
import HydrateShareGate from './components/HydrateShareGate';
import ScreensSwitch from './screens/switch';

const queryClient = new QueryClient();

export default function App() {
  const muiTheme = getMuiTheme();
  useRunStoreSideEffects();
  useDynamicPageTitle();
  return (
    <HydrateShareGate>
      <NetworkProvider>
        <MuiThemeProvider theme={muiTheme}>
          <ConfirmProvider>
            <SnackbarProvider maxSnack={3}>
              <QueryClientProvider client={queryClient}>
                <QueuesQueryProvider>
                  <Shell>
                    <ScreensSwitch />
                  </Shell>
                </QueuesQueryProvider>
              </QueryClientProvider>
            </SnackbarProvider>
          </ConfirmProvider>
        </MuiThemeProvider>
      </NetworkProvider>
    </HydrateShareGate>
  );
}
