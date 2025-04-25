import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import OrganizationPage from './Pages/OrganizationPage';
import AdminPage from './Pages/AdminPage';
import ProjectPage from './Pages/ProjectsPage';
import LogsPage from './Pages/LogsPage';
import ModelsPage from './Pages/ModelsPage';
import { useCallback, useEffect } from 'react';
import { fetchAndCacheTenantData } from './utils/fetchAndCacheTenantData';

function App() {

  const redirectIfRequire = useCallback(async (token) => {
    // Prefetch everything
    await fetchAndCacheTenantData();
  }, [])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('auth');
    console.log(urlParams, token)

    if (token) {
      localStorage.setItem('token', token);
      redirectIfRequire(token)
    }
  }, [])

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/organization' element={<OrganizationPage />} />
          <Route path='/admin' element={<AdminPage />} />
          <Route path='/project' element={<ProjectPage />} />
          <Route path='/model' element={<ModelsPage />} />
          <Route path='/logs' element={<LogsPage />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
