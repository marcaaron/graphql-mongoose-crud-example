import React from 'react';
import RenderAdminSites from './RenderAdminSites';
import { NavLink } from 'react-router-dom';

const Admin = () => {
  return(
    <div>
    <h1>Admin</h1>
    <NavLink to="/admin/add-page">Add Page</NavLink>
    <h2>Site Navigation</h2>
    <h3>All Sites</h3>
    <RenderAdminSites />
    </div>
  );
};

export default Admin;
