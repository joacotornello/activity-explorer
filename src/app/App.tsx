import { ApplicationTopbar } from './components/ApplicationTopbar';
import { ActivityExplorerPage } from './components/ActivityExplorerPage';
import './App.scss';

export const App = () => (
  <div className="app-shell">
    <ApplicationTopbar />
    <ActivityExplorerPage />
  </div>
);
