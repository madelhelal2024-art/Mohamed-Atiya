import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HomePage } from './pages/HomePage';
import { CurriculumPage } from './pages/CurriculumPage';
import { UnitPage } from './pages/UnitPage';
import { LessonPage } from './pages/LessonPage';
import { BoardPage } from './pages/BoardPage';
import { LearningProfilePage } from './pages/LearningProfilePage';
import { StudentProgramsPage } from './pages/StudentProgramsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AppShell>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/curriculum" element={<CurriculumPage />} />
            <Route path="/unit/:unitId" element={<UnitPage />} />
            <Route path="/lesson/:lessonId" element={<LessonPage />} />
            <Route path="/board" element={<BoardPage />} />
            <Route path="/profile" element={<LearningProfilePage />} />
            <Route path="/learning-profile" element={<LearningProfilePage />} />
            <Route path="/programs" element={<StudentProgramsPage />} />
            <Route path="/student-programs" element={<StudentProgramsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppShell>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
