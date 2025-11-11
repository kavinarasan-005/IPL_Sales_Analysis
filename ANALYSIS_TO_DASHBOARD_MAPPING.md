# Analysis to Dashboard Mapping

## 📊 Complete Mapping: Notebook Queries → Dashboard Visualizations

This document shows how each analysis in the PySpark notebook maps to visualizations in the React dashboard.

---

## 1. Top Scoring Batsmen Per Season

### Notebook Query
```sql
SELECT p.player_name, m.season_year, SUM(b.runs_scored) AS total_runs 
FROM ball_by_ball b
JOIN match m ON b.match_id = m.match_id   
JOIN player_match pm ON m.match_id = pm.match_id AND b.striker = pm.player_id     
JOIN player p ON p.player_id = pm.player_id
GROUP BY p.player_name, m.season_year
ORDER BY m.season_year, total_runs DESC
```

### Notebook Output
- CSV File: `top_batsmen_per_season.csv`
- Shows: Player name, season year, total runs
- Analysis: Identifies top run scorers per season

### Dashboard Visualization
- **Component**: `TopBatsmenChart.js`
- **Chart Type**: Horizontal Bar Chart
- **Data Source**: `topBatsmen.json`
- **Features**:
  - Season filtering (all seasons or specific season)
  - Top N selection (10, 15, 20, 25 players)
  - Color-coded bars (Gold, Silver, Bronze for top 3)
  - Interactive tooltips with detailed stats

### Connection
The notebook query aggregates runs by player and season, which is then visualized in the dashboard as an interactive bar chart with filtering capabilities.

---

## 2. Economical Bowlers (Powerplay)

### Notebook Query
```sql
SELECT p.player_name, 
AVG(b.runs_scored) AS avg_runs_per_ball, 
COUNT(b.bowler_wicket) AS total_wickets
FROM ball_by_ball b
JOIN player_match pm ON b.match_id = pm.match_id AND b.bowler = pm.player_id
JOIN player p ON pm.player_id = p.player_id
WHERE b.over_id <= 6
GROUP BY p.player_name
HAVING COUNT(*) >= 1
ORDER BY avg_runs_per_ball, total_wickets DESC
```

### Notebook Output
- CSV File: `economical_bowlers_powerplay.csv`
- Shows: Player name, average runs per ball, total wickets
- Analysis: Identifies most economical bowlers in powerplay overs (1-6)

### Dashboard Visualization
- **Component**: `EconomicalBowlersChart.js`
- **Chart Type**: Horizontal Bar Chart
- **Data Source**: `economicalBowlers.json`
- **Features**:
  - Sorted by economy rate (ascending - lower is better)
  - Powerplay focus (overs 1-6)
  - Interactive tooltips with detailed stats
  - Visual representation of bowling efficiency

### Connection
The notebook query analyzes powerplay overs and calculates economy rates, which is visualized in the dashboard as a horizontal bar chart showing the most economical bowlers.

---

## 3. Toss Impact Analysis

### Notebook Query
```sql
SELECT m.match_id, m.toss_winner, m.toss_name, m.match_winner,
CASE WHEN m.toss_winner = m.match_winner THEN 'Won' ELSE 'Lost' END AS match_outcome
FROM match m
WHERE m.toss_name IS NOT NULL
ORDER BY m.match_id
```

### Notebook Output
- CSV File: `toss_impact.csv`
- Shows: Match ID, toss winner, toss name, match winner, match outcome
- Analysis: Determines if winning toss affects match outcome

### Dashboard Visualization
- **Component**: `TossImpactChart.js`
- **Chart Type**: Pie Chart and Count Plot
- **Data Source**: `tossImpact.json`
- **Features**:
  - Pie chart showing overall toss impact
  - Count plot showing team-wise performance
  - Win/Loss breakdown
  - Interactive legend and tooltips
  - View mode toggle (pie/countplot)

### Connection
The notebook query correlates toss winners with match winners, which is visualized in the dashboard as both a pie chart (overall impact) and count plot (team-wise performance).

---

## 4. Average Runs in Wins

### Notebook Query
```sql
SELECT p.player_name, AVG(b.runs_scored) AS avg_runs_in_wins, COUNT(*) AS innings_played
FROM ball_by_ball b
JOIN player_match pm ON b.match_id = pm.match_id AND b.striker = pm.player_id
JOIN player p ON pm.player_id = p.player_id
JOIN match m ON pm.match_id = m.match_id
WHERE m.match_winner = pm.player_team
GROUP BY p.player_name
ORDER BY avg_runs_in_wins ASC
```

### Notebook Output
- CSV File: `runs_in_wins.csv`
- Shows: Player name, average runs in wins, innings played
- Analysis: Identifies players who perform best in winning matches

### Dashboard Visualization
- **Component**: `RunsInWinsChart.js`
- **Chart Type**: Bar Chart
- **Data Source**: `runsInWins.json`
- **Features**:
  - Sorted by average runs in wins
  - Highlights clutch performers
  - Shows performance in critical matches
  - Interactive tooltips with detailed stats

### Connection
The notebook query analyzes player performance specifically in winning matches, which is visualized in the dashboard as a bar chart showing clutch performers.

---

## 5. Scores by Venue

### Notebook Query
```sql
SELECT venue_name, AVG(total_runs) AS average_score, MAX(total_runs) AS highest_score
FROM (
    SELECT ball_by_ball.match_id, match.venue_name, SUM(runs_scored) AS total_runs
    FROM ball_by_ball
    JOIN match ON ball_by_ball.match_id = match.match_id
    GROUP BY ball_by_ball.match_id, match.venue_name
)
GROUP BY venue_name
ORDER BY average_score DESC
```

### Notebook Output
- CSV File: `scores_by_venue.csv`
- Shows: Venue name, average score, highest score
- Analysis: Analyzes venue-specific scoring patterns

### Dashboard Visualization
- **Component**: `ScoresByVenueChart.js`
- **Chart Type**: Bar Chart
- **Data Source**: `scoresByVenue.json`
- **Features**:
  - Venue-wise breakdown
  - Average scores per venue
  - Venue comparison
  - Interactive tooltips

### Connection
The notebook query aggregates scores by venue, which is visualized in the dashboard as a bar chart showing venue-specific scoring patterns.

---

## 6. Dismissal Types

### Notebook Query
```sql
SELECT out_type, COUNT(*) AS frequency
FROM ball_by_ball
WHERE out_type IS NOT NULL
GROUP BY out_type
ORDER BY frequency DESC
```

### Notebook Output
- CSV File: `dismissal_types.csv`
- Shows: Out type, frequency
- Analysis: Identifies most common dismissal types

### Dashboard Visualization
- **Component**: `DismissalTypesChart.js`
- **Chart Type**: Bar Chart
- **Data Source**: `dismissalTypes.json`
- **Features**:
  - Categorical data visualization
  - Percentage distribution
  - Dismissal pattern insights
  - Interactive tooltips

### Connection
The notebook query counts dismissal types, which is visualized in the dashboard as a bar chart showing the frequency of different dismissal types.

---

## 7. Team Toss Performance

### Notebook Query
```sql
SELECT team1, COUNT(*) AS matches_played, 
SUM(CASE WHEN toss_winner = match_winner THEN 1 ELSE 0 END) AS wins_after_toss
FROM match
WHERE toss_winner = team1
GROUP BY team1
ORDER BY wins_after_toss DESC
```

### Notebook Output
- CSV File: `team_toss_performance.csv`
- Shows: Team name, matches played, wins after toss
- Analysis: Analyzes team performance after winning toss

### Dashboard Visualization
- **Component**: `TeamTossPerformanceChart.js`
- **Chart Type**: Bar Chart
- **Data Source**: `teamTossPerformance.json`
- **Features**:
  - Team-wise comparison
  - Toss decision impact
  - Performance metrics
  - Interactive tooltips

### Connection
The notebook query analyzes team performance after winning toss, which is visualized in the dashboard as a bar chart showing team-specific toss performance.

---

## 8. Season Analysis (Derived)

### Notebook Query
- Derived from: `top_scoring_batsmen_per_season` query
- Additional processing: Grouped by season, calculated averages

### Notebook Output
- Derived from: `top_batsmen_per_season.csv`
- Shows: Season trends and patterns
- Analysis: Performance evolution over time

### Dashboard Visualization
- **Component**: `SeasonAnalysis.js`
- **Chart Type**: Line Chart
- **Data Source**: `topBatsmen.json` (processed)
- **Features**:
  - Multi-season comparison
  - Trend identification
  - Time-series visualization
  - Interactive tooltips

### Connection
The season analysis is derived from the top batsmen data, processed to show trends over time, which is visualized in the dashboard as a line chart.

---

## 9. Statistics Cards (Aggregated)

### Notebook Query
- Derived from: Multiple queries (top batsmen, match data)
- Additional processing: Aggregated statistics

### Notebook Output
- Derived from: Multiple CSV files
- Shows: Key statistics (top scorer, total players, average runs, total matches)
- Analysis: Summary metrics

### Dashboard Visualization
- **Component**: `StatCard.js` (used in `Dashboard.js`)
- **Chart Type**: Stat Cards
- **Data Source**: Multiple JSON files (processed)
- **Features**:
  - Top Scorer
  - Total Players
  - Average Runs
  - Total Matches
  - Icon-based visualization

### Connection
The statistics cards aggregate data from multiple analyses to provide a quick overview of key metrics.

---

## 📊 Data Flow Summary

```
Notebook Query (PySpark)
  ↓
CSV Export (Analysis Results)
  ↓
Python Script (prepare_data.py)
  ↓
JSON Conversion
  ↓
React Dashboard (Visualization)
```

---

## 🔗 Key Connections

### 1. One-to-One Mappings
- Top Batsmen Query → Top Batsmen Chart
- Economical Bowlers Query → Economical Bowlers Chart
- Toss Impact Query → Toss Impact Chart
- Runs in Wins Query → Runs in Wins Chart
- Scores by Venue Query → Scores by Venue Chart
- Dismissal Types Query → Dismissal Types Chart
- Team Toss Performance Query → Team Toss Performance Chart

### 2. Derived Visualizations
- Top Batsmen Query → Season Analysis Chart (processed)
- Multiple Queries → Statistics Cards (aggregated)

### 3. Data Transformation
- CSV files from notebook → JSON files for dashboard
- Raw analysis results → Interactive visualizations
- Static data → Dynamic, filterable charts

---

## 🎯 Presentation Tips

### When Presenting:
1. **Show the Query First**: Display the notebook query
2. **Show the CSV Output**: Show the analysis results
3. **Show the Dashboard Visualization**: Show how it's visualized
4. **Explain the Connection**: Highlight the mapping
5. **Demonstrate Interactivity**: Show filtering and exploration

### Key Points to Emphasize:
- Each dashboard visualization corresponds to a notebook analysis
- The data flows from analysis to visualization through CSV → JSON conversion
- The dashboard adds interactivity and filtering to static analysis results
- The complete workflow demonstrates end-to-end data science pipeline

---

## 📋 Quick Reference

### Notebook Queries → Dashboard Charts
1. `top_scoring_batsmen_per_season` → Top Batsmen Chart
2. `economical_bowlers_powerplay` → Economical Bowlers Chart
3. `toss_impact_individual_matches` → Toss Impact Chart
4. `average_runs_in_wins` → Runs in Wins Chart
5. `scores_by_venue` → Scores by Venue Chart
6. `dismissal_types` → Dismissal Types Chart
7. `team_toss_win_performance` → Team Toss Performance Chart
8. `top_scoring_batsmen_per_season` (processed) → Season Analysis Chart
9. Multiple queries (aggregated) → Statistics Cards

### CSV Files → JSON Files
1. `top_batsmen_per_season.csv` → `topBatsmen.json`
2. `economical_bowlers_powerplay.csv` → `economicalBowlers.json`
3. `toss_impact.csv` → `tossImpact.json`
4. `runs_in_wins.csv` → `runsInWins.json`
5. `scores_by_venue.csv` → `scoresByVenue.json`
6. `dismissal_types.csv` → `dismissalTypes.json`
7. `team_toss_performance.csv` → `teamTossPerformance.json`
8. `match_data.csv` → `matchData.json`

---

**This mapping document helps you explain the complete workflow from analysis to visualization during your presentation! 🚀**

