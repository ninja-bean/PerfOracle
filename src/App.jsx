import React, { useState, useEffect } from 'react';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';

// Site 1 Components (Empirical Benchmarks)
import OverviewView from './components/dashboard/OverviewView';
import AlgorithmList from './components/algorithms/AlgorithmList';
import AddAlgoModal from './components/algorithms/AddAlgoModal';
import CodeInspectModal from './components/algorithms/CodeInspectModal';
import TierMatrix from './components/tiers/TierMatrix';
import RubricTester from './components/rubrics/RubricTester';
import DatasetTable from './components/dataset/DatasetTable';
import CsvRawModal from './components/dataset/CsvRawModal';
import Phase2TeaserModal from './components/ml/Phase2TeaserModal';
import TutorialTour from './components/tutorial/TutorialTour';

// Site 2 Components (Predictive Machine Learning Platform)
import PredictorOverview from './components/predictor/PredictorOverview';
import InferenceSandbox from './components/predictor/InferenceSandbox';
import ScalingCurvePlot from './components/predictor/ScalingCurvePlot';
import HardwareCompatibility from './components/predictor/HardwareCompatibility';
import ModelLeaderboard from './components/predictor/ModelLeaderboard';
import PredictionCardModal from './components/predictor/PredictionCardModal';

import { 
  initialAlgorithms, 
  initialTiers, 
  initialRubricCriteria, 
  initialBenchmarks 
} from './data/dummyData';

export default function App() {
  const [algorithms, setAlgorithms] = useState(initialAlgorithms);
  const [tiers, setTiers] = useState(initialTiers);
  const [criteria, setCriteria] = useState(initialRubricCriteria);
  const [benchmarks, setBenchmarks] = useState(initialBenchmarks);

  // Platform Site Mode: 'site1' (Ground Truth Studio) or 'site2' (ML Predictor)
  const [activeSite, setActiveSite] = useState('site2');

  // Navigation states for Site 1 & Site 2
  const [site1ActiveTab, setSite1ActiveTab] = useState('overview');
  const [site2ActiveTab, setSite2ActiveTab] = useState('overview');

  const [selectedAlgoForBench, setSelectedAlgoForBench] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inspectingAlgo, setInspectingAlgo] = useState(null);
  const [isPhase2ModalOpen, setIsPhase2ModalOpen] = useState(false);
  const [rawCsvText, setRawCsvText] = useState(null);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [cardModalData, setCardModalData] = useState(null);

  // Clear any light theme setting from document
  useEffect(() => {
    document.documentElement.removeAttribute('data-theme');
    localStorage.removeItem('perforacle_theme');
  }, []);

  const handleAddAlgorithm = (newAlgo) => {
    setAlgorithms([newAlgo, ...algorithms]);
  };

  const handleSelectForBenchmark = (algo) => {
    setSelectedAlgoForBench(algo.id);
    setActiveSite('site1');
    setSite1ActiveTab('rubrics');
  };

  const handleAddBenchmark = (newBenchmark) => {
    setBenchmarks([newBenchmark, ...benchmarks]);
  };

  const handleDeleteBenchmark = (id) => {
    setBenchmarks(benchmarks.filter(b => b.id !== id));
  };

  const handleResetBenchmarks = () => {
    setBenchmarks(initialBenchmarks);
  };

  const handleReassignTier = (algoId, newTier) => {
    setAlgorithms(algorithms.map(a => a.id === algoId ? { ...a, defaultTier: newTier } : a));
  };

  const handleUpdateTierThreshold = (tierId, newThresholds) => {
    setTiers(tiers.map(t => t.id === tierId ? { ...t, ...newThresholds } : t));
  };

  const nextAlgoId = `ALG-${String(algorithms.length + 1).padStart(3, '0')}`;

  const handleSwitchSite = (site) => {
    setActiveSite(site);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#060608] text-white flex selection:bg-white selection:text-black relative">
      {/* Background Precision Grid */}
      <div className="fixed inset-0 bg-grid-subtle opacity-60 pointer-events-none -z-20" />

      {/* Persistent Left Sidebar */}
      <Sidebar
        activeSite={activeSite}
        onSwitchSite={handleSwitchSite}
        activeTab={site1ActiveTab}
        setActiveTab={setSite1ActiveTab}
        site2ActiveTab={site2ActiveTab}
        setSite2ActiveTab={setSite2ActiveTab}
        onOpenPhase2={() => handleSwitchSite('site2')}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        algoCount={algorithms.length}
        benchmarkCount={benchmarks.length}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Header
          activeSite={activeSite}
          onSwitchSite={handleSwitchSite}
          activeTab={site1ActiveTab}
          site2ActiveTab={site2ActiveTab}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenPhase2={() => handleSwitchSite('site2')}
          onOpenTutorial={() => setIsTutorialOpen(true)}
          onNavigate={(tab) => {
            if (activeSite === 'site1') setSite1ActiveTab(tab);
            else setSite2ActiveTab(tab);
          }}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* ═══════════════════════════════════════════════
              SITE 2: PREDICTIVE MACHINE LEARNING PLATFORM
          ═══════════════════════════════════════════════ */}
          {activeSite === 'site2' && (
            <>
              {site2ActiveTab === 'overview' && (
                <PredictorOverview
                  onNavigate={setSite2ActiveTab}
                  onOpenSandbox={() => setSite2ActiveTab('sandbox')}
                />
              )}

              {site2ActiveTab === 'sandbox' && (
                <InferenceSandbox
                  onOpenReportCard={(data) => setCardModalData(data)}
                />
              )}

              {site2ActiveTab === 'scaling' && (
                <ScalingCurvePlot />
              )}

              {site2ActiveTab === 'hardware' && (
                <HardwareCompatibility />
              )}

              {site2ActiveTab === 'models' && (
                <ModelLeaderboard />
              )}
            </>
          )}

          {/* ═══════════════════════════════════════════════
              SITE 1: EMPIRICAL BENCHMARK & GROUND TRUTH
          ═══════════════════════════════════════════════ */}
          {activeSite === 'site1' && (
            <>
              {site1ActiveTab === 'overview' && (
                <OverviewView
                  algorithms={algorithms}
                  benchmarks={benchmarks}
                  tiers={tiers}
                  onNavigate={setSite1ActiveTab}
                  onOpenAddModal={() => setIsAddModalOpen(true)}
                  onOpenPhase2={() => handleSwitchSite('site2')}
                />
              )}

              {site1ActiveTab === 'algorithms' && (
                <AlgorithmList
                  algorithms={algorithms}
                  onSelectForBenchmark={handleSelectForBenchmark}
                  onOpenAddModal={() => setIsAddModalOpen(true)}
                  onViewDetails={(algo) => setInspectingAlgo(algo)}
                />
              )}

              {site1ActiveTab === 'tiers' && (
                <TierMatrix
                  tiers={tiers}
                  algorithms={algorithms}
                  benchmarks={benchmarks}
                  onReassignTier={handleReassignTier}
                  onUpdateTierThreshold={handleUpdateTierThreshold}
                />
              )}

              {site1ActiveTab === 'rubrics' && (
                <RubricTester
                  algorithms={algorithms}
                  tiers={tiers}
                  criteria={criteria}
                  selectedAlgorithmId={selectedAlgoForBench}
                  onAddBenchmark={handleAddBenchmark}
                  onOpenDataset={() => setSite1ActiveTab('dataset')}
                />
              )}

              {site1ActiveTab === 'dataset' && (
                <DatasetTable
                  benchmarks={benchmarks}
                  onDeleteBenchmark={handleDeleteBenchmark}
                  onResetBenchmarks={handleResetBenchmarks}
                  onOpenRawCsv={(csv) => setRawCsvText(csv)}
                  onOpenPhase2={() => handleSwitchSite('site2')}
                />
              )}
            </>
          )}
        </main>

        {/* Minimalist Engineering Footer */}
        <footer className="border-t border-white/[0.08] bg-[#050507] py-6 px-4 text-xs text-zinc-500 font-mono">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-300 font-sans">PerfOracle</span>
              <span>• Final Year Design Project</span>
              <span className="hidden sm:inline text-zinc-600">|</span>
              <span className="hidden sm:inline">
                {activeSite === 'site2' ? 'Site 2: Predictive ML Engine' : 'Site 1: Empirical Benchmark Engine'}
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-zinc-400">
              <button 
                onClick={() => handleSwitchSite(activeSite === 'site1' ? 'site2' : 'site1')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Switch to {activeSite === 'site1' ? 'Site 2 (ML Predictor)' : 'Site 1 (Benchmark Studio)'}
              </button>
              <span>•</span>
              <button 
                onClick={() => setIsTutorialOpen(true)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Replay Tour
              </button>
              <span>•</span>
              <span className="text-zinc-200">Production Ready</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Modals */}
      <TutorialTour
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        onNavigate={(tab) => {
          setActiveSite('site1');
          setSite1ActiveTab(tab);
        }}
      />

      <AddAlgoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddAlgorithm={handleAddAlgorithm}
        categories={['All', 'Sorting & Search', 'Graph Theory', 'Dynamic Programming', 'Linear Algebra / ML', 'Signal Processing', 'Cryptography']}
        nextId={nextAlgoId}
      />

      <CodeInspectModal
        algo={inspectingAlgo}
        isOpen={!!inspectingAlgo}
        onClose={() => setInspectingAlgo(null)}
      />

      <Phase2TeaserModal
        isOpen={isPhase2ModalOpen}
        onClose={() => setIsPhase2ModalOpen(false)}
        totalRecords={benchmarks.length}
        algorithms={algorithms}
      />

      <CsvRawModal
        isOpen={!!rawCsvText}
        onClose={() => setRawCsvText(null)}
        csvText={rawCsvText}
      />

      <PredictionCardModal
        isOpen={!!cardModalData}
        onClose={() => setCardModalData(null)}
        data={cardModalData}
      />
    </div>
  );
}
