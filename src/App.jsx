import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import OrganizationPage from './Pages/OrganizationPage';
import AdminPage from './Pages/AdminPage';
import ProjectPage from './Pages/ProjectsPage';
import LogsPage from './Pages/LogsPage';
import ModelsPage from './Pages/ModelsPage';
import ModelUploadForm from './Pages/ModelUploadForm';
import ApprovalPage from './Pages/ApprovalPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/organization' element={<OrganizationPage />} />
          <Route path='/admin' element={<AdminPage />} />
          <Route path='/approvals' element={<ApprovalPage />} />
          <Route path='/project' element={<ProjectPage />} />
          <Route path='/project/models' element={<ModelsPage />} />
          <Route path='/logs' element={<LogsPage />} />
          <Route path='/model-upload' element={<ModelUploadForm />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
