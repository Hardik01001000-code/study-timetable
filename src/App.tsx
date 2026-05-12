import { HashRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './hooks/useStore';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { CalendarView } from './views/CalendarView';
import { SubjectsView } from './views/SubjectsView';
import { SubjectDetailsView } from './views/SubjectDetailsView';
import { LoginView } from './views/LoginView';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <HashRouter>
          <Routes>
            {/* Public Read-Only Routes */}
            <Route path="/" element={<Layout readOnly />}>
              <Route index element={<CalendarView readOnly />} />
              <Route path="subjects" element={<SubjectsView readOnly />} />
              <Route path="subjects/:id" element={<SubjectDetailsView readOnly />} />
            </Route>

            {/* Login Route */}
            <Route path="/login" element={<LoginView />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<CalendarView />} />
              <Route path="subjects" element={<SubjectsView />} />
              <Route path="subjects/:id" element={<SubjectDetailsView />} />
            </Route>
          </Routes>
        </HashRouter>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;
