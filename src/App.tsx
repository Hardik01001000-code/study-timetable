import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './hooks/useStore';
import { Layout } from './components/Layout';
import { CalendarView } from './views/CalendarView';
import { SubjectsView } from './views/SubjectsView';
import { SubjectDetailsView } from './views/SubjectDetailsView';

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<CalendarView />} />
            <Route path="subjects" element={<SubjectsView />} />
            <Route path="subjects/:id" element={<SubjectDetailsView />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;
