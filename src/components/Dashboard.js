import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import StatCard from './StatCard';
import TopBatsmenChart from './TopBatsmenChart';
import EconomicalBowlersChart from './EconomicalBowlersChart';
import TossImpactChart from './TossImpactChart';
import RunsInWinsChart from './RunsInWinsChart';
import SeasonAnalysis from './SeasonAnalysis';
import ScoresByVenueChart from './ScoresByVenueChart';
import DismissalTypesChart from './DismissalTypesChart';
import TeamTossPerformanceChart from './TeamTossPerformanceChart';
import { Trophy, Target, TrendingUp, Users, MapPin, BarChart3, Users2 } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState({
    topBatsmen: [],
    economicalBowlers: [],
    tossImpact: [],
    runsInWins: [],
    matchData: [],
    scoresByVenue: [],
    dismissalTypes: [],
    teamTossPerformance: [],
    loading: true,
    error: null
  });

  const [stats, setStats] = useState({
    totalPlayers: 0,
    topScorer: '',
    topScore: 0,
    totalMatches: 0,
    avgRuns: 0
  });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      const [
        topBatsmen,
        economicalBowlers,
        tossImpact,
        runsInWins,
        matchData,
        scoresByVenue,
        dismissalTypes,
        teamTossPerformance
      ] = await Promise.all([
        fetch('/data/topBatsmen.json').then(res => {
          if (!res.ok) throw new Error('Failed to fetch topBatsmen.json');
          return res.json();
        }),
        fetch('/data/economicalBowlers.json').then(res => {
          if (!res.ok) throw new Error('Failed to fetch economicalBowlers.json');
          return res.json();
        }),
        fetch('/data/tossImpact.json').then(res => {
          if (!res.ok) throw new Error('Failed to fetch tossImpact.json');
          return res.json();
        }),
        fetch('/data/runsInWins.json').then(res => {
          if (!res.ok) throw new Error('Failed to fetch runsInWins.json');
          return res.json();
        }),
        fetch('/data/matchData.json').then(res => {
          if (!res.ok) throw new Error('Failed to fetch matchData.json');
          return res.json();
        }),
        fetch('/data/scoresByVenue.json').then(res => {
          if (!res.ok) return [];
          return res.json();
        }).catch(() => []),
        fetch('/data/dismissalTypes.json').then(res => {
          if (!res.ok) return [];
          return res.json();
        }).catch(() => []),
        fetch('/data/teamTossPerformance.json').then(res => {
          if (!res.ok) return [];
          return res.json();
        }).catch(() => []),
      ]);

      // Sort topBatsmen by total_runs descending
      const sortedTopBatsmen = (topBatsmen || []).sort((a, b) => {
        const runsA = parseFloat(a.total_runs) || 0;
        const runsB = parseFloat(b.total_runs) || 0;
        return runsB - runsA;
      });

      // Sort economicalBowlers by economy (ascending - lower is better)
      const sortedEconomicalBowlers = (economicalBowlers || []).sort((a, b) => {
        const economyA = parseFloat(a.avg_runs_per_ball) || 0;
        const economyB = parseFloat(b.avg_runs_per_ball) || 0;
        return economyA - economyB;
      });

      // Sort runsInWins by avg_runs_in_wins descending
      const sortedRunsInWins = (runsInWins || []).sort((a, b) => {
        const runsA = parseFloat(a.avg_runs_in_wins) || 0;
        const runsB = parseFloat(b.avg_runs_in_wins) || 0;
        return runsB - runsA;
      });

      console.log('Data loaded:', {
        topBatsmen: sortedTopBatsmen.length,
        economicalBowlers: sortedEconomicalBowlers.length,
        tossImpact: tossImpact?.length || 0,
        runsInWins: sortedRunsInWins.length,
        matchData: matchData?.length || 0,
        scoresByVenue: scoresByVenue?.length || 0,
        dismissalTypes: dismissalTypes?.length || 0,
        teamTossPerformance: teamTossPerformance?.length || 0
      });

      setData({
        topBatsmen: sortedTopBatsmen,
        economicalBowlers: sortedEconomicalBowlers,
        tossImpact: tossImpact || [],
        runsInWins: sortedRunsInWins,
        matchData: matchData || [],
        scoresByVenue: scoresByVenue || [],
        dismissalTypes: dismissalTypes || [],
        teamTossPerformance: teamTossPerformance || [],
        loading: false,
        error: null
      });

      // Calculate stats
      if (sortedTopBatsmen && sortedTopBatsmen.length > 0) {
        const topPlayer = sortedTopBatsmen[0];
        const totalRuns = sortedTopBatsmen.reduce((sum, p) => sum + (parseFloat(p.total_runs) || 0), 0);
        setStats({
          totalPlayers: sortedTopBatsmen.length,
          topScorer: topPlayer.player_name || 'N/A',
          topScore: topPlayer.total_runs || 0,
          totalMatches: matchData?.length || 0,
          avgRuns: totalRuns / sortedTopBatsmen.length
        });
      } else {
        setStats({
          totalPlayers: 0,
          topScorer: 'N/A',
          topScore: 0,
          totalMatches: matchData?.length || 0,
          avgRuns: 0
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setData({
        topBatsmen: [],
        economicalBowlers: [],
        tossImpact: [],
        runsInWins: [],
        matchData: [],
        scoresByVenue: [],
        dismissalTypes: [],
        teamTossPerformance: [],
        loading: false,
        error: error.message || 'Failed to load data'
      });
    }
  };

  if (data.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Data</h2>
          <p className="text-gray-700 mb-4">{data.error}</p>
          <button 
            onClick={() => {
              setData(prev => ({ ...prev, loading: true, error: null }));
              loadData();
            }}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StatCard
              title="Top Scorer"
              value={stats.topScorer}
              subtitle={`${stats.topScore} runs`}
              icon={<Trophy className="w-8 h-8" />}
              color="bg-yellow-500"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <StatCard
              title="Total Players"
              value={stats.totalPlayers}
              subtitle="Analyzed"
              icon={<Users className="w-8 h-8" />}
              color="bg-blue-500"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <StatCard
              title="Average Runs"
              value={Math.round(stats.avgRuns)}
              subtitle="Per player"
              icon={<TrendingUp className="w-8 h-8" />}
              color="bg-green-500"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <StatCard
              title="Total Matches"
              value={stats.totalMatches}
              subtitle="In dataset"
              icon={<Target className="w-8 h-8" />}
              color="bg-purple-500"
            />
          </motion.div>
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="card-hover"
          >
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Top Batsmen</h2>
              <TopBatsmenChart data={data.topBatsmen} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="card-hover"
          >
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Economical Bowlers</h2>
              <EconomicalBowlersChart data={data.economicalBowlers} />
            </div>
          </motion.div>
        </div>

        {/* Secondary Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="card-hover"
          >
            <div className="bg-white rounded-lg shadow-lg p-6">
              <TossImpactChart data={data.tossImpact} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="card-hover"
          >
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Runs in Winning Matches</h2>
              <RunsInWinsChart data={data.runsInWins} />
            </div>
          </motion.div>
        </div>

        {/* Season Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="card-hover"
        >
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Season-wise Analysis</h2>
            <SeasonAnalysis data={data.topBatsmen} />
          </div>
        </motion.div>

        {/* New Visualizations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="card-hover"
          >
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-gray-800">Scores by Venue</h2>
              </div>
              <ScoresByVenueChart data={data.scoresByVenue} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="card-hover"
          >
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-gray-800">Dismissal Types</h2>
              </div>
              <DismissalTypesChart data={data.dismissalTypes} />
            </div>
          </motion.div>
        </div>

        {/* Team Toss Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="card-hover"
        >
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users2 className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-gray-800">Team Performance After Winning Toss</h2>
            </div>
            <TeamTossPerformanceChart data={data.teamTossPerformance} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;


