import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Cedula from '../template/layout/abstract/Cedula/Cedula';
import OtherIncomeReceipts from '../template/layout/abstract/OtherIncomeReceipts/OtherIncomeReceipts';
import GeneralFund from '../template/layout/abstract/GeneralFund/GeneralFund';
import RealPropertyTax from '../template/layout/abstract/RealPropertyTax/RealPropertyTax';
import TrustFunds from '../template/layout/abstract/TrustFund/TrustFund';
import Calendar from '../template/layout/big-calendar/index';
import CashTicket from '../template/layout/cashticket/Index';
import Dashboard from '../template/layout/dashboard/Home';
import DiveTicket from '../template/layout/divingticket/Index';
import Login from '../template/sign-in/SignIn';

import BusinessCard from '../template/layout/reports/BusinessCard/BusinessCard';
import Esre from '../template/layout/reports/ESRE/esre';
import FullReport from '../template/layout/reports/FullReport/FullReport';
import Rcd from '../template/layout/reports/RCD/rcd';
import RptCard from '../template/layout/reports/RPTCARD/realpropertytax_card';

import BusinessRegistration from '../template/layout/businesspermit/BusinessRegistration/BusinessRegistration';
import EbikeTrisikad from '../template/layout/businesspermit/E-BIKE_TRISIKAD/ebiketrisikad';
import Mch from '../template/layout/businesspermit/MCH/mch';

import NewForm from '../template/layout/businesspermit/BusinessRegistration/components/BNew';
import BusinessOperation from '../template/layout/businesspermit/BusinessRegistration/components/BusinessOperation';
import BusinessAddress from '../template/layout/businesspermit/BusinessRegistration/components/BusinessAdress';
import Collection from '../template/layout/reports/Collection/collection';



function Routers() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/my-app" element={<Dashboard />}>
          <Route path="real-property-tax" element={<RealPropertyTax />} />
          <Route path="general-fund" element={<GeneralFund />} />
          <Route path="trust-fund" element={<TrustFunds />} />
          <Route path="community-tax-certificate" element={<Cedula />} />
          <Route path="other-income-receipts" element={<OtherIncomeReceipts />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="dive-ticket" element={<DiveTicket />} />
          <Route path="cash-ticket" element={<CashTicket />} />

          <Route path="business-card" element={<BusinessCard />} />
          <Route path="rpt-card" element={<RptCard />} />
          <Route path="full-report" element={<FullReport />} />
          <Route path="rcd" element={<Rcd />} />
          <Route path="esre" element={<Esre />} />
          <Route path="collection" element={<Collection />} />

          <Route path="business-registration" element={<BusinessRegistration />} />
          <Route path="mch" element={<Mch />} />
          <Route path="e-bike-trisikad" element={<EbikeTrisikad />} />
          
          <Route path="new-application" element={<NewForm />} />
          <Route path="business-operation" element={<BusinessOperation />} />
          <Route path="business-address" element={<BusinessAddress />} />
          
        </Route>
      </Routes>
    </Router>
  );
}

export default Routers;
