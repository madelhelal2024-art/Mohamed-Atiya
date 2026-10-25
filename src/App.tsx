import React from 'react';
import { HashRouter as Router, Navigate, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HomePage } from './pages/HomePage';
import { GradeSixOverviewPage } from './pages/GradeSixOverviewPage';
import { GradeSixTermOnePage } from './pages/GradeSixTermOnePage';
import { GradeSixTermTwoPage } from './pages/GradeSixTermTwoPage';
import { GradeSixLessonPage } from './pages/GradeSixLessonPage';
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
            <Route path="/curriculum" element={<Navigate to="/grade-six" replace />} />
            <Route path="/grade-six" element={<GradeSixOverviewPage />} />
            <Route path="/grade-six/term-one" element={<GradeSixTermOnePage />} />
            <Route path="/grade-six/term-one/:unitId/:entryIndex" element={<GradeSixLessonPage />} />
            <Route path="/grade-six/term-two" element={<GradeSixTermTwoPage />} />
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
