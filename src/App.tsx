import React, { useState } from 'react';
import { MarketProvider, useMarket } from './context/MarketContext';
import { Header } from './components/header/Header';
import { PriceTicker } from './components/header/PriceTicker';
import { FarmerPortal } from './components/farmer/FarmerPortal';
import { WholesalerPortal } from './components/wholesaler/WholesalerPortal';
import { StateCooperativePortal } from './components/state/StateCooperativePortal';
import { NationalAnalytics } from './components/analytics/NationalAnalytics';
import { ControlRoomDashboard } from './components/control/ControlRoomDashboard';
import { ContractModal } from './components/modals/ContractModal';
import { ReportSpeculationModal } from './components/modals/ReportSpeculationModal';
import { ContractsListModal } from './components/modals/ContractsListModal';
import { ToastContainer } from './components/common/ToastContainer';
import { Footer } from './components/footer/Footer';

const MainContent: React.FC = () => {
  const { role, selectedContractForModal, setSelectedContractForModal } = useMarket();

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isContractsListOpen, setIsContractsListOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#03130d] text-slate-100 flex flex-col font-['Cairo',sans-serif] selection:bg-amber-400 selection:text-slate-950">
      {/* Header with Role Selector */}
      <Header
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenContractsList={() => setIsContractsListOpen(true)}
      />

      {/* Live Regulatory Price Ticker */}
      <PriceTicker />

      {/* Main Dynamic View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {role === 'farmer' && <FarmerPortal />}
        {role === 'wholesaler' && <WholesalerPortal />}
        {role === 'state' && <StateCooperativePortal />}
        {role === 'control_room' && <ControlRoomDashboard />}
        {role === 'analytics' && <NationalAnalytics />}
      </main>

      {/* Official Government Printable Contract / Waybill Modal */}
      <ContractModal
        contract={selectedContractForModal}
        isOpen={!!selectedContractForModal}
        onClose={() => setSelectedContractForModal(null)}
      />

      {/* Speculation Report / Whistleblower Modal */}
      <ReportSpeculationModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      {/* Contracts Archive List Modal */}
      <ContractsListModal
        isOpen={isContractsListOpen}
        onClose={() => setIsContractsListOpen(false)}
        onSelectContract={(contract) => setSelectedContractForModal(contract)}
      />

      {/* Real-time Toast Messages */}
      <ToastContainer />

      {/* Official Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <MarketProvider>
      <MainContent />
    </MarketProvider>
  );
}
