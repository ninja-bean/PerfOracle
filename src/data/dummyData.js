// PerfOracle Dataset & Benchmark Engine - Default Data & Schema

export const initialTiers = [
  {
    id: "tier-s",
    name: "Tier S",
    tagline: "Ultra-High Efficiency & Sub-millisecond Execution",
    badgeClass: "border-white bg-white text-black font-bold",
    minScore: 88,
    maxLatency: 8.0,
    maxMemory: 20.0,
    description: "Algorithms exhibiting optimal sub-linear or linearithmic scaling with minimal cache misses and microsecond response times.",
    accent: "bg-white text-black"
  },
  {
    id: "tier-a",
    name: "Tier A",
    tagline: "High Throughput & Linear Predictability",
    badgeClass: "border-zinc-300 text-zinc-100 bg-white/10 font-semibold",
    minScore: 72,
    maxLatency: 35.0,
    maxMemory: 64.0,
    description: "Solid high-performance production workloads. Scales predictably with manageable constant factors and stable memory usage.",
    accent: "border-zinc-400 text-zinc-200"
  },
  {
    id: "tier-b",
    name: "Tier B",
    tagline: "Standard Operational Performance",
    badgeClass: "border-zinc-500 text-zinc-300 bg-white/5",
    minScore: 55,
    maxLatency: 120.0,
    maxMemory: 160.0,
    description: "Acceptable for non-realtime or moderate input vectors. May exhibit auxiliary allocation overhead during peak cycles.",
    accent: "border-zinc-600 text-zinc-300"
  },
  {
    id: "tier-c",
    name: "Tier C",
    tagline: "Compute / Memory Intensive",
    badgeClass: "border-zinc-700 text-zinc-400 bg-white/[0.03]",
    minScore: 40,
    maxLatency: 450.0,
    maxMemory: 380.0,
    description: "High CPU burn or super-linear memory footprints. Suitable only with batch processing or off-peak scheduler runs.",
    accent: "border-zinc-700 text-zinc-400"
  },
  {
    id: "tier-d",
    name: "Tier D",
    tagline: "Constrained / Sub-optimal Legacy",
    badgeClass: "border-zinc-800 text-zinc-500 bg-black/40",
    minScore: 0,
    maxLatency: 9999.0,
    maxMemory: 9999.0,
    description: "Quadratic or exponential scaling bottlenecks. Significant variance, garbage collection stalls, or memory leaks.",
    accent: "border-zinc-800 text-zinc-500"
  }
];

export const initialRubricCriteria = [
  { id: "latency", name: "Execution Latency", unit: "ms", weight: 35, ideal: 5, worst: 500, description: "Wall-clock runtime on calibrated CPU test runner" },
  { id: "memory", name: "Peak Memory Overhead", unit: "MB", weight: 25, ideal: 10, worst: 400, description: "Maximum RSS allocation during workload processing" },
  { id: "cpu", name: "CPU Core Load", unit: "%", weight: 15, ideal: 20, worst: 100, description: "Core utilization factor normalized to single-thread budget" },
  { id: "scalability", name: "Scalability Index", unit: "/10", weight: 15, ideal: 10, worst: 1, description: "Rate of latency growth under 10x input scaling factor" },
  { id: "stability", name: "Convergence & Stability", unit: "%", weight: 10, ideal: 99, worst: 40, description: "Standard deviation variance across 10 repeated sample runs" },
];

export const initialAlgorithms = [
  {
    id: "ALG-001",
    name: "Dual-Pivot Quicksort",
    category: "Sorting & Search",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(log n)",
    inPlace: true,
    stable: false,
    defaultTier: "Tier S",
    description: "Yaroslavskiy's dual-pivot partition quicksort algorithm offering enhanced cache locality and reduced branch mispredictions.",
    codeSnippet: `def dual_pivot_quicksort(arr, low, high):\n    if low < high:\n        p, q = partition(arr, low, high)\n        dual_pivot_quicksort(arr, low, p - 1)\n        dual_pivot_quicksort(arr, p + 1, q - 1)\n        dual_pivot_quicksort(arr, q + 1, high)`
  },
  {
    id: "ALG-002",
    name: "Timsort Adaptive Hybrid",
    category: "Sorting & Search",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    inPlace: false,
    stable: true,
    defaultTier: "Tier S",
    description: "Hybrid stable sorting algorithm derived from merge sort and insertion sort, optimized for real-world partially sorted arrays.",
    codeSnippet: `def timsort(arr):\n    min_run = 32\n    for start in range(0, len(arr), min_run):\n        insertion_sort(arr, start, min(start + min_run - 1, len(arr) - 1))\n    # Iterative merge of natural runs`
  },
  {
    id: "ALG-003",
    name: "Heapsort In-Place",
    category: "Sorting & Search",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    inPlace: true,
    stable: false,
    defaultTier: "Tier A",
    description: "Comparison-based sorting using a binary max-heap. Guarantees strict O(n log n) upper bound with zero auxiliary heap allocation.",
    codeSnippet: `def heapsort(arr):\n    build_max_heap(arr)\n    for i in range(len(arr) - 1, 0, -1):\n        arr[0], arr[i] = arr[i], arr[0]\n        max_heapify(arr, 0, i)`
  },
  {
    id: "ALG-004",
    name: "Dijkstra's SPF with Fibonacci Heap",
    category: "Graph Theory",
    timeComplexity: "O(E + V log V)",
    spaceComplexity: "O(V)",
    inPlace: false,
    stable: true,
    defaultTier: "Tier S",
    description: "Single-source shortest path for weighted non-negative directed graphs using an amortized constant decrease-key priority structure.",
    codeSnippet: `def dijkstra_fibonacci(graph, src):\n    dist = {v: float('inf') for v in graph}\n    dist[src] = 0\n    pq = FibonacciHeap()\n    pq.insert(src, 0)`
  },
  {
    id: "ALG-005",
    name: "A* Euclidean Heuristic Search",
    category: "Graph Theory",
    timeComplexity: "O(E)",
    spaceComplexity: "O(V)",
    inPlace: false,
    stable: true,
    defaultTier: "Tier A",
    description: "Informed pathfinding algorithm evaluating nodes via f(n) = g(n) + h(n), delivering high pruning rates on spatial meshes.",
    codeSnippet: `def a_star(start, goal, h):\n    open_set = PriorityQueue()\n    open_set.put((0, start))\n    came_from = {}\n    # traverse with admissible heuristic`
  },
  {
    id: "ALG-006",
    name: "Bellman-Ford Dynamic",
    category: "Graph Theory",
    timeComplexity: "O(V * E)",
    spaceComplexity: "O(V)",
    inPlace: true,
    stable: true,
    defaultTier: "Tier C",
    description: "Computes shortest paths in graphs containing negative edge weights and detects negative weight reachable cycles.",
    codeSnippet: `def bellman_ford(vertices, edges, src):\n    dist = [float('inf')] * len(vertices)\n    dist[src] = 0\n    for _ in range(len(vertices) - 1):\n        for u, v, w in edges:\n            if dist[u] + w < dist[v]: dist[v] = dist[u] + w`
  },
  {
    id: "ALG-007",
    name: "Floyd-Warshall All-Pairs",
    category: "Dynamic Programming",
    timeComplexity: "O(V^3)",
    spaceComplexity: "O(V^2)",
    inPlace: false,
    stable: true,
    defaultTier: "Tier D",
    description: "Dense matrix dynamic programming algorithm finding shortest paths between all pairs of vertices in a weighted graph.",
    codeSnippet: `for k in range(V):\n    for i in range(V):\n        for j in range(V):\n            dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`
  },
  {
    id: "ALG-008",
    name: "0/1 Knapsack Space-Optimized",
    category: "Dynamic Programming",
    timeComplexity: "O(N * W)",
    spaceComplexity: "O(W)",
    inPlace: false,
    stable: true,
    defaultTier: "Tier B",
    description: "Classic pseudo-polynomial dynamic programming with 1D array state rolling to compress memory overhead from O(NW) to O(W).",
    codeSnippet: `def knapsack(W, wt, val, n):\n    dp = [0] * (W + 1)\n    for i in range(n):\n        for w in range(W, wt[i] - 1, -1):\n            dp[w] = max(dp[w], dp[w - wt[i]] + val[i])`
  },
  {
    id: "ALG-009",
    name: "Strassen Matrix Multiplication",
    category: "Linear Algebra / ML",
    timeComplexity: "O(n^2.807)",
    spaceComplexity: "O(n^2)",
    inPlace: false,
    stable: true,
    defaultTier: "Tier B",
    description: "Sub-cubic matrix multiplication using 7 recursive block multiplications instead of the standard 8, lowering asymptotic ops.",
    codeSnippet: `def strassen(A, B):\n    if len(A) <= LEAF_SIZE: return standard_mult(A, B)\n    # Compute 7 sub-products M1 through M7 and recombine`
  },
  {
    id: "ALG-010",
    name: "Cooley-Tukey Radix-2 FFT",
    category: "Signal Processing",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    inPlace: false,
    stable: true,
    defaultTier: "Tier S",
    description: "Fast Fourier Transform recursively breaking discrete Fourier transform into two halves, drastically accelerating frequency analysis.",
    codeSnippet: `def fft(x):\n    N = len(x)\n    if N <= 1: return x\n    even, odd = fft(x[0::2]), fft(x[1::2])\n    T = [exp(-2j * pi * k / N) * odd[k] for k in range(N // 2)]`
  },
  {
    id: "ALG-011",
    name: "K-Means Lloyd Clustering",
    category: "Machine Learning",
    timeComplexity: "O(k * n * d * i)",
    spaceComplexity: "O(n * d + k * d)",
    inPlace: false,
    stable: false,
    defaultTier: "Tier B",
    description: "Iterative vector quantization partitioning n observations into k clusters via Euclidean centroid convergence.",
    codeSnippet: `def lloyd_kmeans(X, k, max_iter=100):\n    centroids = init_centroids(X, k)\n    for _ in range(max_iter):\n        labels = assign_clusters(X, centroids)\n        centroids = update_centroids(X, labels, k)`
  },
  {
    id: "ALG-012",
    name: "SHA-256 Block Transform",
    category: "Cryptography",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    inPlace: true,
    stable: true,
    defaultTier: "Tier A",
    description: "NIST cryptographic hash function utilizing Merkle-Damgård construction over 512-bit message blocks with 64-round compression.",
    codeSnippet: `def sha256_compress(state, chunk):\n    W = expand_message_schedule(chunk)\n    # Run 64 rounds of non-linear Sigma and Ch functions`
  }
];

export const initialBenchmarks = [
  {
    id: "BM-101",
    algoId: "ALG-001",
    name: "Dual-Pivot Quicksort",
    category: "Sorting & Search",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(log n)",
    inputSize: 100000,
    testCaseType: "Uniform Random Array",
    latencyMs: 7.2,
    peakMemoryMb: 14.8,
    cpuUtilizationPct: 42,
    scalabilityScore: 9.4,
    stabilityIndex: 98.2,
    rubricScore: 91.5,
    assignedTier: "Tier S",
    timestamp: "2026-11-18 10:14:02"
  },
  {
    id: "BM-102",
    algoId: "ALG-001",
    name: "Dual-Pivot Quicksort",
    category: "Sorting & Search",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(log n)",
    inputSize: 500000,
    testCaseType: "Partially Ordered 90%",
    latencyMs: 24.8,
    peakMemoryMb: 28.4,
    cpuUtilizationPct: 56,
    scalabilityScore: 9.1,
    stabilityIndex: 97.4,
    rubricScore: 88.2,
    assignedTier: "Tier S",
    timestamp: "2026-11-18 10:16:45"
  },
  {
    id: "BM-103",
    algoId: "ALG-002",
    name: "Timsort Adaptive Hybrid",
    category: "Sorting & Search",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    inputSize: 100000,
    testCaseType: "Uniform Random Array",
    latencyMs: 11.4,
    peakMemoryMb: 32.1,
    cpuUtilizationPct: 48,
    scalabilityScore: 8.9,
    stabilityIndex: 99.1,
    rubricScore: 87.0,
    assignedTier: "Tier A",
    timestamp: "2026-11-18 10:20:11"
  },
  {
    id: "BM-104",
    algoId: "ALG-002",
    name: "Timsort Adaptive Hybrid",
    category: "Sorting & Search",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    inputSize: 500000,
    testCaseType: "Runs of Size 32 Sorted",
    latencyMs: 16.5,
    peakMemoryMb: 48.6,
    cpuUtilizationPct: 38,
    scalabilityScore: 9.6,
    stabilityIndex: 99.4,
    rubricScore: 92.1,
    assignedTier: "Tier S",
    timestamp: "2026-11-18 10:22:30"
  },
  {
    id: "BM-105",
    algoId: "ALG-003",
    name: "Heapsort In-Place",
    category: "Sorting & Search",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    inputSize: 100000,
    testCaseType: "Worst Case (Reversed Array)",
    latencyMs: 29.1,
    peakMemoryMb: 8.2,
    cpuUtilizationPct: 62,
    scalabilityScore: 8.4,
    stabilityIndex: 95.0,
    rubricScore: 78.6,
    assignedTier: "Tier A",
    timestamp: "2026-11-18 11:02:18"
  },
  {
    id: "BM-106",
    algoId: "ALG-004",
    name: "Dijkstra's SPF with Fibonacci Heap",
    category: "Graph Theory",
    timeComplexity: "O(E + V log V)",
    spaceComplexity: "O(V)",
    inputSize: 50000,
    testCaseType: "Sparse Road Network (E=3V)",
    latencyMs: 6.8,
    peakMemoryMb: 18.5,
    cpuUtilizationPct: 45,
    scalabilityScore: 9.2,
    stabilityIndex: 98.8,
    rubricScore: 92.4,
    assignedTier: "Tier S",
    timestamp: "2026-11-18 11:30:10"
  },
  {
    id: "BM-107",
    algoId: "ALG-005",
    name: "A* Euclidean Heuristic Search",
    category: "Graph Theory",
    timeComplexity: "O(E)",
    spaceComplexity: "O(V)",
    inputSize: 50000,
    testCaseType: "2D Grid Euclidean Obstacles",
    latencyMs: 4.1,
    peakMemoryMb: 12.0,
    cpuUtilizationPct: 35,
    scalabilityScore: 9.5,
    stabilityIndex: 99.2,
    rubricScore: 95.8,
    assignedTier: "Tier S",
    timestamp: "2026-11-18 11:45:00"
  },
  {
    id: "BM-108",
    algoId: "ALG-006",
    name: "Bellman-Ford Dynamic",
    category: "Graph Theory",
    timeComplexity: "O(V * E)",
    spaceComplexity: "O(V)",
    inputSize: 5000,
    testCaseType: "Dense Negative Edge DAG",
    latencyMs: 182.4,
    peakMemoryMb: 94.0,
    cpuUtilizationPct: 88,
    scalabilityScore: 5.2,
    stabilityIndex: 82.5,
    rubricScore: 48.3,
    assignedTier: "Tier C",
    timestamp: "2026-11-18 12:10:40"
  },
  {
    id: "BM-109",
    algoId: "ALG-007",
    name: "Floyd-Warshall All-Pairs",
    category: "Dynamic Programming",
    timeComplexity: "O(V^3)",
    spaceComplexity: "O(V^2)",
    inputSize: 800,
    testCaseType: "Complete Graph Adjacency",
    latencyMs: 642.0,
    peakMemoryMb: 245.0,
    cpuUtilizationPct: 98,
    scalabilityScore: 2.8,
    stabilityIndex: 94.0,
    rubricScore: 36.1,
    assignedTier: "Tier D",
    timestamp: "2026-11-18 12:40:15"
  },
  {
    id: "BM-110",
    algoId: "ALG-008",
    name: "0/1 Knapsack Space-Optimized",
    category: "Dynamic Programming",
    timeComplexity: "O(N * W)",
    spaceComplexity: "O(W)",
    inputSize: 10000,
    testCaseType: "W=2000 Capacity Heavy",
    latencyMs: 48.5,
    peakMemoryMb: 15.6,
    cpuUtilizationPct: 65,
    scalabilityScore: 7.8,
    stabilityIndex: 96.5,
    rubricScore: 74.2,
    assignedTier: "Tier A",
    timestamp: "2026-11-18 13:15:22"
  },
  {
    id: "BM-111",
    algoId: "ALG-009",
    name: "Strassen Matrix Multiplication",
    category: "Linear Algebra / ML",
    timeComplexity: "O(n^2.807)",
    spaceComplexity: "O(n^2)",
    inputSize: 1024,
    testCaseType: "Square Dense Float32 1024x1024",
    latencyMs: 88.0,
    peakMemoryMb: 142.0,
    cpuUtilizationPct: 82,
    scalabilityScore: 6.9,
    stabilityIndex: 93.0,
    rubricScore: 63.8,
    assignedTier: "Tier B",
    timestamp: "2026-11-18 13:45:00"
  },
  {
    id: "BM-112",
    algoId: "ALG-010",
    name: "Cooley-Tukey Radix-2 FFT",
    category: "Signal Processing",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    inputSize: 262144,
    testCaseType: "Audio PCM Spectral Decomposition",
    latencyMs: 5.4,
    peakMemoryMb: 22.0,
    cpuUtilizationPct: 40,
    scalabilityScore: 9.7,
    stabilityIndex: 99.6,
    rubricScore: 94.3,
    assignedTier: "Tier S",
    timestamp: "2026-11-18 14:02:10"
  },
  {
    id: "BM-113",
    algoId: "ALG-011",
    name: "K-Means Lloyd Clustering",
    category: "Machine Learning",
    timeComplexity: "O(k * n * d * i)",
    spaceComplexity: "O(n * d + k * d)",
    inputSize: 50000,
    testCaseType: "K=8 Clusters, D=16 Features",
    latencyMs: 76.5,
    peakMemoryMb: 58.0,
    cpuUtilizationPct: 75,
    scalabilityScore: 7.2,
    stabilityIndex: 89.0,
    rubricScore: 66.4,
    assignedTier: "Tier B",
    timestamp: "2026-11-18 14:35:50"
  },
  {
    id: "BM-114",
    algoId: "ALG-012",
    name: "SHA-256 Block Transform",
    category: "Cryptography",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    inputSize: 1000000,
    testCaseType: "100MB Stream Block Hash",
    latencyMs: 31.0,
    peakMemoryMb: 4.8,
    cpuUtilizationPct: 54,
    scalabilityScore: 9.3,
    stabilityIndex: 99.8,
    rubricScore: 86.5,
    assignedTier: "Tier A",
    timestamp: "2026-11-18 15:00:12"
  }
];

// Rubric scoring algorithm that transforms raw measurements into 0-100 rubric score
export function calculateRubricScore(metrics, criteriaWeights = null) {
  // Metric bounds and normalization (lower is better for latency, memory, cpu; higher is better for scalability, stability)
  const latencyScore = Math.max(0, Math.min(100, 100 - (metrics.latencyMs / 400) * 100));
  const memoryScore = Math.max(0, Math.min(100, 100 - (metrics.peakMemoryMb / 300) * 100));
  const cpuScore = Math.max(0, Math.min(100, 100 - (metrics.cpuUtilizationPct / 100) * 100));
  const scalabilityScore = Math.max(0, Math.min(100, (metrics.scalabilityScore / 10) * 100));
  const stabilityScore = Math.max(0, Math.min(100, metrics.stabilityIndex));

  const weights = criteriaWeights || {
    latency: 35,
    memory: 25,
    cpu: 15,
    scalability: 15,
    stability: 10
  };

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  const weightedSum = (
    latencyScore * weights.latency +
    memoryScore * weights.memory +
    cpuScore * weights.cpu +
    scalabilityScore * weights.scalability +
    stabilityScore * weights.stability
  ) / totalWeight;

  return Math.round(weightedSum * 10) / 10;
}

// Auto-determine tier from rubric score
export function getTierFromScore(score) {
  if (score >= 88) return "Tier S";
  if (score >= 72) return "Tier A";
  if (score >= 55) return "Tier B";
  if (score >= 40) return "Tier C";
  return "Tier D";
}

// CSV Formatter
export function generateCsvDataset(benchmarks, selectedColumns = null) {
  const allColumns = [
    { key: "id", label: "benchmark_id" },
    { key: "algoId", label: "algorithm_id" },
    { key: "name", label: "algorithm_name" },
    { key: "category", label: "category" },
    { key: "timeComplexity", label: "time_complexity" },
    { key: "spaceComplexity", label: "space_complexity" },
    { key: "inputSize", label: "input_size_n" },
    { key: "testCaseType", label: "workload_distribution" },
    { key: "latencyMs", label: "latency_ms" },
    { key: "peakMemoryMb", label: "peak_memory_mb" },
    { key: "cpuUtilizationPct", label: "cpu_usage_pct" },
    { key: "scalabilityScore", label: "scalability_index_10" },
    { key: "stabilityIndex", label: "stability_pct" },
    { key: "rubricScore", label: "rubric_composite_score" },
    { key: "assignedTier", label: "assigned_tier" },
    { key: "timestamp", label: "benchmark_timestamp" }
  ];

  const columns = selectedColumns 
    ? allColumns.filter(c => selectedColumns.includes(c.key))
    : allColumns;

  const headerRow = columns.map(c => `"${c.label}"`).join(",");
  const dataRows = benchmarks.map(row => {
    return columns.map(col => {
      const val = row[col.key];
      if (typeof val === "string") {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val ?? "";
    }).join(",");
  });

  return [headerRow, ...dataRows].join("\r\n");
}
