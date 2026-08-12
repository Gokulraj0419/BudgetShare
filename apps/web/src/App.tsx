import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouter } from './router/AppRouter';
import { theme } from './theme';
import { BudgetShareProvider } from './context/BudgetShareContext';


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BudgetShareProvider>
        <AppRouter />
      </BudgetShareProvider>
    </ThemeProvider>
  );
}

export default App;
