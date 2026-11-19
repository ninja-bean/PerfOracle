import React, { useState, useEffect } from 'react';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
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

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAlgoForBench, setSelectedAlgoForBench] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inspectingAlgo, setInspectingAlgo] = useState(null);
  const [isPhase2ModalOpen, setIsPhase2ModalOpen] = useState(false);
  const [rawCsvText, setRawCsvText] = useState(null);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  // Clear any light theme setting from document
  useEffect(() => {
    document.documentElement.removeAttribute('data-theme');
    localStorage.removeItem('perforacle_theme');
  }, []);

  // Automatically trigger tutorial on first visit
  useEffect(() => {
    const isDismissed = localStorage.getItem('perforacle_tutorial_dismissed');
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setIsTutorialOpen(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAddAlgorithm = (newAlgo) => {
    setAlgorithms([newAlgo, ...algorithms]);
  };

  const handleSelectForBenchmark = (algo) => {
    setSelectedAlgoForBench(algo.id);
    setActiveTab('rubrics');
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

  return (
    <div className="min-h-screen bg-[#060608] text-white flex selection:bg-white selection:text-black relative">
      {/* Background Precision Grid */}
      <div className="fixed inset-0 bg-grid-subtle opacity-60 pointer-events-none -z-20" />

      {/* Persistent Left Sidebar (Flex child on desktop, modal drawer on mobile) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPhase2={() => setIsPhase2ModalOpen(true)}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        algoCount={algorithms.length}
        benchmarkCount={benchmarks.length}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area — Naturally fills space adjacent to sidebar without any overlap */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Header
          activeTab={activeTab}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenPhase2={() => setIsPhase2ModalOpen(true)}
          onOpenTutorial={() => setIsTutorialOpen(true)}
          onNavigate={setActiveTab}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'overview' && (
            <OverviewView
              algorithms={algorithms}
              benchmarks={benchmarks}
              tiers={tiers}
              onNavigate={setActiveTab}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onOpenPhase2={() => setIsPhase2ModalOpen(true)}
            />
          )}

          {activeTab === 'algorithms' && (
            <AlgorithmList
              algorithms={algorithms}
              onSelectForBenchmark={handleSelectForBenchmark}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onViewDetails={(algo) => setInspectingAlgo(algo)}
            />
          )}

          {activeTab === 'tiers' && (
            <TierMatrix
              tiers={tiers}
              algorithms={algorithms}
              benchmarks={benchmarks}
              onReassignTier={handleReassignTier}
              onUpdateTierThreshold={handleUpdateTierThreshold}
            />
          )}

          {activeTab === 'rubrics' && (
            <RubricTester
              algorithms={algorithms}
              tiers={tiers}
              criteria={criteria}
              selectedAlgorithmId={selectedAlgoForBench}
              onAddBenchmark={handleAddBenchmark}
              onOpenDataset={() => setActiveTab('dataset')}
            />
          )}

          {activeTab === 'dataset' && (
            <DatasetTable
              benchmarks={benchmarks}
              onDeleteBenchmark={handleDeleteBenchmark}
              onResetBenchmarks={handleResetBenchmarks}
              onOpenRawCsv={(csv) => setRawCsvText(csv)}
              onOpenPhase2={() => setIsPhase2ModalOpen(true)}
            />
          )}
        </main>

        {/* Minimalist Human Footer */}
        <footer className="border-t border-white/[0.08] bg-[#050507] py-6 px-4 text-xs text-zinc-500 font-mono">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-300 font-sans">PerfOracle</span>
              <span>• Final Year Design Project</span>
              <span className="hidden sm:inline text-zinc-600">|</span>
              <span className="hidden sm:inline">Empirical Benchmark Engine</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-zinc-400">
              <button 
                onClick={() => setIsTutorialOpen(true)}
                className="hover:text-white transition-colors"
              >
                Replay Visual Tour
              </button>
              <span>•</span>
              <span>RFC 4180 Dataset Studio</span>
              <span>•</span>
              <span className="text-zinc-200">Site 1 Production-Ready</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Modals & Onboarding Tour */}
      <TutorialTour
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        onNavigate={setActiveTab}
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
    </div>
  );
}
