/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import InvoicesView from './components/InvoicesView';
import InvoiceDetailView from './components/InvoiceDetailView';
import CustomersView from './components/CustomersView';
import QuotationsView from './components/QuotationsView';
import PaymentsView from './components/PaymentsView';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<CustomersView />} />
          <Route path="quotes" element={<QuotationsView />} />
          <Route path="invoices" element={<InvoicesView />} />
          <Route path="invoices/:id" element={<InvoiceDetailView />} />
          <Route path="payments" element={<PaymentsView />} />
          <Route path="performance" element={<div className="p-8"><h1 className="text-2xl font-bold">Performance</h1></div>} />
          <Route path="equipment" element={<div className="p-8"><h1 className="text-2xl font-bold">Equipment</h1></div>} />
          <Route path="settings" element={<div className="p-8"><h1 className="text-2xl font-bold">Settings</h1></div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

