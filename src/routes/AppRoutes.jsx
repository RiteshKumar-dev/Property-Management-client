import { Routes, Route } from 'react-router-dom';
import Layout from '../layouts/Layout';
import ProtectedRoute from './ProtectedRoute';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import AddProperty from '../pages/AddProperty';
import MyProperties from '../pages/MyProperties';
import InterestPropertyUserList from '../pages/InterestPropertyUserList';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-property"
          element={
            <ProtectedRoute>
              <AddProperty />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-properties"
          element={
            <ProtectedRoute>
              <MyProperties />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interest-properties"
          element={
            <ProtectedRoute>
              <InterestPropertyUserList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={
            <ProtectedRoute authentication={false}>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute authentication={false}>
              <Register />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
