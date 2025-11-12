# IPL Data Analysis Dashboard

A comprehensive data analysis and visualization project that processes large-scale IPL (Indian Premier League) cricket data using PySpark and presents interactive insights through a modern React web dashboard.

## 🏏 Project Overview

This project demonstrates a complete data science workflow:
- **Data Analysis**: Large-scale data processing using PySpark on AWS S3
- **Data Processing**: CSV to JSON conversion for web consumption
- **Visualization**: Interactive React dashboard with 8+ dynamic charts

## 🎯 Features

### Data Analysis (PySpark Notebook)
- **Scalable Processing**: Handles large datasets using distributed computing
- **7 Key Analyses**:
  - Top Scoring Batsmen Per Season
  - Economical Bowlers (Powerplay Analysis)
  - Toss Impact Analysis
  - Average Runs in Wins
  - Scores by Venue
  - Dismissal Types Analysis
  - Team Toss Performance

### Interactive Dashboard (React)
- **8+ Interactive Visualizations**:
  - Top Batsmen Chart (with season filtering)
  - Economical Bowlers Chart
  - Toss Impact Chart (pie & count plot)
  - Runs in Wins Chart
  - Season Analysis (trends over time)
  - Scores by Venue Chart
  - Dismissal Types Chart (bar & pie)
  - Team Toss Performance Chart
- **Interactive Features**:
  - Season filtering
  - Top N selection
  - Metric toggling (Average/Highest)
  - View mode switching (Bar/Pie charts)
  - Interactive tooltips
  - Responsive design

## 🚀 Tech Stack

### Backend/Analysis
- **PySpark**: Distributed data processing
- **Spark SQL**: Complex query processing
- **AWS S3**: Data storage
- **Python 3**: Data processing scripts
- **Pandas**: CSV to JSON conversion

### Frontend
- **React 18.2**: UI framework
- **Recharts 2.8**: Interactive charting library
- **Tailwind CSS 3.3**: Utility-first styling
- **Framer Motion 10.16**: Smooth animations
- **React Router DOM 6.16**: Navigation
- **Lucide React**: Icon library

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Python 3
- PySpark (for data analysis)
- AWS S3 access (for data analysis)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/kavinarasan-005/IPL_Sales_Analysis.git
cd IPL_Sales_Analysis
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Prepare Data

The data files need to be converted from CSV to JSON format:

```bash
python3 prepare_data.py
```

This will create JSON files in the `public/data/` directory from CSV files in the `PowerBI_Data/` directory.

### 4. Start Development Server

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
ipl_dashboard/
├── public/
│   ├── data/              # JSON data files
│   │   ├── topBatsmen.json
│   │   ├── economicalBowlers.json
│   │   ├── tossImpact.json
│   │   ├── runsInWins.json
│   │   ├── matchData.json
│   │   ├── scoresByVenue.json
│   │   ├── dismissalTypes.json
│   │   └── teamTossPerformance.json
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Dashboard.js
│   │   ├── Header.js
│   │   ├── StatCard.js
│   │   ├── TopBatsmenChart.js
│   │   ├── EconomicalBowlersChart.js
│   │   ├── TossImpactChart.js
│   │   ├── RunsInWinsChart.js
│   │   ├── SeasonAnalysis.js
│   │   ├── ScoresByVenueChart.js
│   │   ├── DismissalTypesChart.js
│   │   └── TeamTossPerformanceChart.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── ipl_data_analysis_fixed.ipynb  # PySpark analysis notebook
├── prepare_data.py                 # Data processing script
├── package.json
├── tailwind.config.js
└── README.md
```

## 🔄 Complete Workflow

```
Raw Data (AWS S3)
  ↓
PySpark Analysis (Jupyter Notebook)
  - Load data from S3
  - Process and transform data
  - Run SQL queries
  - Generate insights
  ↓
CSV Export (Analysis Results)
  - top_batsmen_per_season.csv
  - economical_bowlers_powerplay.csv
  - toss_impact.csv
  - runs_in_wins.csv
  - scores_by_venue.csv
  - dismissal_types.csv
  - team_toss_performance.csv
  ↓
Data Processing (Python Script)
  - Read CSV files
  - Convert to JSON format
  - Validate data
  ↓
JSON Files (Processed Data)
  - Stored in public/data/
  ↓
React Dashboard (Interactive Visualization)
  - Load JSON data
  - Render interactive charts
  - Enable filtering and exploration
```

## 📊 Part 1: PySpark Data Analysis (Jupyter Notebook)

### PySpark Setup and Configuration

The analysis begins by setting up a PySpark session and importing necessary libraries:

```python
from pyspark.sql import SparkSession
from pyspark.sql.types import StructField, StructType, IntegerType, StringType, BooleanType, DateType, DecimalType
from pyspark.sql.functions import col, when, sum, avg, row_number, year, month, dayofmonth, lower, regexp_replace, current_date
from pyspark.sql.window import Window

# Create Spark Session
spark = SparkSession.builder.appName("IPL Data Analysis").getOrCreate()
```

### Data Sources and Schema Definitions

The notebook loads 5 main data sources from AWS S3:

#### 1. Ball-by-Ball Data (`Ball_By_Ball.csv`)
**Schema**: 48 fields including:
- Match identifiers: `match_id`, `over_id`, `ball_id`, `innings_no`
- Team information: `team_batting`, `team_bowling`
- Runs data: `runs_scored`, `extra_runs`, `wides`, `legbyes`, `byes`, `noballs`
- Wicket data: `out_type`, `caught`, `bowled`, `run_out`, `lbw`, `stumped`, `bowler_wicket`
- Player identifiers: `striker`, `non_striker`, `bowler`, `player_out`
- Match metadata: `match_date`, `season`

**Purpose**: Contains ball-by-ball match data for detailed analysis.

#### 2. Match Data (`Match.csv`)
**Schema**: 18 fields including:
- Match info: `match_id`, `match_sk`, `team1`, `team2`
- Date and season: `match_date`, `season_year`
- Venue: `venue_name`, `city_name`, `country_name`
- Toss and winner: `toss_winner`, `match_winner`, `toss_name`
- Match outcome: `win_type`, `outcome_type`, `win_margin`, `manofmach`

**Purpose**: Contains match-level information for aggregations and analysis.

#### 3. Player Data (`Player.csv`)
**Schema**: 7 fields:
- Player identifiers: `player_id`, `player_sk`, `player_name`
- Player attributes: `dob`, `batting_hand`, `bowling_skill`, `country_name`

**Purpose**: Contains player information and attributes.

#### 4. Player Match Data (`Player_match.csv`)
**Schema**: 23 fields including:
- Match-player relationship: `match_id`, `player_id`, `player_match_sk`
- Team information: `player_team`, `opposit_team`
- Player status: `batting_status`, `bowling_status`, `role_desc`
- Match context: `season_year`, `is_manofthematch`, `age_as_on_match`, `isplayers_team_won`
- Leadership: `player_captain`, `opposit_captain`, `player_keeper`, `opposit_keeper`

**Purpose**: Links players to matches with contextual information.

#### 5. Team Data (`Team.csv`)
**Schema**: 3 fields:
- Team identifiers: `team_id`, `team_sk`, `team_name`

**Purpose**: Contains team information.

### Data Loading from AWS S3

```python
# Load Ball-by-Ball data
ball_by_ball_df = spark.read.schema(ball_by_ball_schema).format("csv").option("header", "true").load("s3://ipl-data-analysis-project/Ball_By_Ball.csv")

# Load Match data
match_df = spark.read.schema(match_schema).format("csv").option("header","true").load("s3://ipl-data-analysis-project/Match.csv")

# Load Player data
player_df = spark.read.schema(player_schema).format("csv").option("header","true").load("s3://ipl-data-analysis-project/Player.csv")

# Load Player Match data
player_match_df = spark.read.schema(player_match_schema).format("csv").option("header","true").load("s3://ipl-data-analysis-project/Player_match.csv")

# Load Team data
team_df = spark.read.schema(team_schema).format("csv").option("header","true").load("s3://ipl-data-analysis-project/Team.csv")
```

### Data Cleaning and Transformation

#### 1. Filter Invalid Data
```python
# Filter out wides and no-balls for accurate analysis
ball_by_ball_df = ball_by_ball_df.filter((col("wides") == 0) & (col("noballs")==0))
```

#### 2. Calculate Aggregations
```python
# Calculate total and average runs per match/innings
total_and_avg_runs = ball_by_ball_df.groupBy("match_id", "innings_no").agg(
    sum("runs_scored").alias("total_runs"),
    avg("runs_scored").alias("average_runs")
)
```

#### 3. Window Functions for Running Totals
```python
# Calculate running total of runs per match/innings
windowSpec = Window.partitionBy("match_id","innings_no").orderBy("over_id")
ball_by_ball_df = ball_by_ball_df.withColumn(
    "running_total_runs",
    sum("runs_scored").over(windowSpec)
)
```

#### 4. Feature Engineering: High Impact Events
```python
# Identify high-impact balls (>6 runs or wickets)
ball_by_ball_df = ball_by_ball_df.withColumn(
    "high_impact",
    when((col("runs_scored") + col("extra_runs") > 6) | (col("bowler_wicket") == True), True).otherwise(False)
)
```

#### 5. Match Data Enhancements
```python
# Extract date components
match_df = match_df.withColumn("year", year("match_date"))
match_df = match_df.withColumn("month", month("match_date"))
match_df = match_df.withColumn("day", dayofmonth("match_date"))

# Categorize win margins
match_df = match_df.withColumn(
    "win_margin_category",
    when(col("win_margin") >= 100, "High")
    .when((col("win_margin") >= 50) & (col("win_margin") < 100), "Medium")
    .otherwise("Low")
)

# Determine if toss winner won match
match_df = match_df.withColumn(
    "toss_match_winner",
    when(col("toss_winner") == col("match_winner"), "Yes").otherwise("No")
)
```

#### 6. Player Data Cleaning
```python
# Clean player names (lowercase, remove special characters)
player_df = player_df.withColumn("player_name", lower(regexp_replace("player_name", "[^a-zA-Z0-9 ]", "")))

# Fill missing values
player_df = player_df.na.fill({"batting_hand": "unknown", "bowling_skill": "unknown"})

# Categorize batting style
player_df = player_df.withColumn(
    "batting_style",
    when(col("batting_hand").contains("left"), "Left-Handed").otherwise("Right-Handed")
)
```

#### 7. Player Match Data Enhancements
```python
# Categorize veteran status
player_match_df = player_match_df.withColumn(
    "veteran_status",
    when(col("age_as_on_match") >= 35, "Veteran").otherwise("Non-Veteran")
)

# Calculate years since debut
player_match_df = player_match_df.withColumn(
    "years_since_debut",
    (year(current_date()) - col("season_year"))
)
```

### Creating Temporary Views for SQL Queries

```python
# Create temporary views for SQL queries
ball_by_ball_df.createOrReplaceTempView("ball_by_ball")
match_df.createOrReplaceTempView("match")
player_df.createOrReplaceTempView("player")
player_match_df.createOrReplaceTempView("player_match")
team_df.createOrReplaceTempView("team")
```

### SQL Queries and Analyses

#### Query 1: Top Scoring Batsmen Per Season

**SQL Query**:
```sql
SELECT 
    p.player_name,
    m.season_year,
    SUM(b.runs_scored) AS total_runs 
FROM ball_by_ball b
JOIN match m ON b.match_id = m.match_id   
JOIN player_match pm ON m.match_id = pm.match_id AND b.striker = pm.player_id     
JOIN player p ON p.player_id = pm.player_id
GROUP BY p.player_name, m.season_year
ORDER BY m.season_year, total_runs DESC
```

**Explanation**:
- **Purpose**: Identifies top run scorers for each IPL season
- **Joins**: 
  - `ball_by_ball` with `match` on `match_id`
  - `match` with `player_match` on `match_id`
  - `player_match` with `ball_by_ball` on `striker = player_id`
  - `player_match` with `player` on `player_id`
- **Aggregation**: Sums `runs_scored` by player and season
- **Output**: Player name, season year, total runs
- **Dashboard Visualization**: `TopBatsmenChart.js` - Horizontal bar chart with season filtering

**Key Insights**:
- Tracks player performance across multiple seasons
- Identifies consistent performers
- Reveals emerging talents and veteran contributions

---

#### Query 2: Economical Bowlers (Powerplay Analysis)

**SQL Query**:
```sql
SELECT 
    p.player_name, 
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

**Explanation**:
- **Purpose**: Identifies most economical bowlers during powerplay overs (overs 1-6)
- **Filter**: `WHERE b.over_id <= 6` - Only powerplay overs
- **Joins**: 
  - `ball_by_ball` with `player_match` on `match_id` and `bowler = player_id`
  - `player_match` with `player` on `player_id`
- **Aggregation**: 
  - Average runs per ball (`AVG(runs_scored)`)
  - Total wickets taken (`COUNT(bowler_wicket)`)
- **Sorting**: By economy rate (ascending - lower is better), then by wickets (descending)
- **Output**: Player name, average runs per ball, total wickets
- **Dashboard Visualization**: `EconomicalBowlersChart.js` - Horizontal bar chart

**Key Insights**:
- Powerplay bowling is crucial for team success
- Lower economy rate indicates better performance
- Identifies bowlers who excel in early overs

---

#### Query 3: Toss Impact Analysis

**SQL Query**:
```sql
SELECT 
    m.match_id, 
    m.toss_winner, 
    m.toss_name, 
    m.match_winner,
    CASE 
        WHEN m.toss_winner = m.match_winner THEN 'Won' 
        ELSE 'Lost' 
    END AS match_outcome
FROM match m
WHERE m.toss_name IS NOT NULL
ORDER BY m.match_id
```

**Explanation**:
- **Purpose**: Analyzes the correlation between winning the toss and winning the match
- **Filter**: `WHERE m.toss_name IS NOT NULL` - Only matches with toss data
- **Logic**: Uses `CASE` statement to determine if toss winner won the match
- **Output**: Match ID, toss winner, toss decision (bat/field), match winner, match outcome (Won/Lost)
- **Dashboard Visualization**: `TossImpactChart.js` - Pie chart (overall) and count plot (team-wise)

**Key Insights**:
- Determines if winning toss provides advantage
- Analyzes team-specific toss strategies
- Strategic insights for team decision-making

---

#### Query 4: Average Runs in Wins

**SQL Query**:
```sql
SELECT 
    p.player_name, 
    AVG(b.runs_scored) AS avg_runs_in_wins, 
    COUNT(*) AS innings_played
FROM ball_by_ball b
JOIN player_match pm ON b.match_id = pm.match_id AND b.striker = pm.player_id
JOIN player p ON pm.player_id = p.player_id
JOIN match m ON pm.match_id = m.match_id
WHERE m.match_winner = pm.player_team
GROUP BY p.player_name
ORDER BY avg_runs_in_wins ASC
```

**Explanation**:
- **Purpose**: Identifies players who perform best in winning matches (clutch performers)
- **Filter**: `WHERE m.match_winner = pm.player_team` - Only matches where player's team won
- **Joins**: 
  - `ball_by_ball` with `player_match` on `match_id` and `striker = player_id`
  - `player_match` with `player` on `player_id`
  - `player_match` with `match` on `match_id`
- **Aggregation**: 
  - Average runs scored in wins (`AVG(runs_scored)`)
  - Total innings played in wins (`COUNT(*)`)
- **Output**: Player name, average runs in wins, innings played
- **Dashboard Visualization**: `RunsInWinsChart.js` - Horizontal bar chart showing top performers

**Key Insights**:
- Identifies match-winners vs. consistent scorers
- Shows which players perform best under pressure
- Highlights players who contribute most to team victories

---

#### Query 5: Scores by Venue

**SQL Query**:
```sql
SELECT 
    venue_name, 
    AVG(total_runs) AS average_score, 
    MAX(total_runs) AS highest_score
FROM (
    SELECT 
        ball_by_ball.match_id, 
        match.venue_name, 
        SUM(runs_scored) AS total_runs
    FROM ball_by_ball
    JOIN match ON ball_by_ball.match_id = match.match_id
    GROUP BY ball_by_ball.match_id, match.venue_name
)
GROUP BY venue_name
ORDER BY average_score DESC
```

**Explanation**:
- **Purpose**: Analyzes scoring patterns by venue/stadium
- **Subquery**: 
  - Groups ball-by-ball data by match and venue
  - Sums runs scored per match per venue
- **Outer Query**:
  - Aggregates by venue
  - Calculates average score per venue
  - Finds highest score per venue
- **Joins**: `ball_by_ball` with `match` on `match_id`
- **Output**: Venue name, average score, highest score
- **Dashboard Visualization**: `ScoresByVenueChart.js` - Horizontal bar chart with Average/Highest toggle

**Key Insights**:
- Different venues have different scoring patterns
- Identifies high-scoring and low-scoring venues
- Helps teams prepare venue-specific strategies
- Reveals home advantage patterns

---

#### Query 6: Dismissal Types

**SQL Query**:
```sql
SELECT 
    out_type, 
    COUNT(*) AS frequency
FROM ball_by_ball
WHERE out_type IS NOT NULL
GROUP BY out_type
ORDER BY frequency DESC
```

**Explanation**:
- **Purpose**: Analyzes most common dismissal types in IPL
- **Filter**: `WHERE out_type IS NOT NULL` - Only balls with dismissals
- **Aggregation**: Counts frequency of each dismissal type
- **Output**: Dismissal type, frequency
- **Dashboard Visualization**: `DismissalTypesChart.js` - Bar chart and pie chart with view toggle

**Key Insights**:
- Most common ways batsmen get out
- Pattern analysis for batting and bowling strategies
- Strategic insights for team preparation
- Helps understand wicket-taking patterns

**Dismissal Types Include**:
- Caught
- Bowled
- Run Out
- LBW (Leg Before Wicket)
- Stumped
- Caught and Bowled
- Hit Wicket
- Retired Hurt

---

#### Query 7: Team Toss Performance

**SQL Query**:
```sql
SELECT 
    team1, 
    COUNT(*) AS matches_played, 
    SUM(CASE WHEN toss_winner = match_winner THEN 1 ELSE 0 END) AS wins_after_toss
FROM match
WHERE toss_winner = team1
GROUP BY team1
ORDER BY wins_after_toss DESC
```

**Explanation**:
- **Purpose**: Analyzes team performance after winning the toss
- **Filter**: `WHERE toss_winner = team1` - Only matches where team1 won toss
- **Aggregation**: 
  - Counts total matches where team won toss
  - Sums wins when toss winner = match winner
- **Output**: Team name, matches played (after winning toss), wins after toss
- **Dashboard Visualization**: `TeamTossPerformanceChart.js` - Horizontal bar chart with Total Wins/Win Ratio toggle

**Key Insights**:
- Team-specific performance after winning toss
- Identifies teams that benefit most from winning toss
- Reveals team strategies and decision-making patterns
- Helps understand toss impact on team performance

---

### Data Export and Visualization

After running the SQL queries, the results are:
1. **Converted to Pandas DataFrames** for visualization in the notebook
2. **Exported to CSV files** for further processing
3. **Converted to JSON** using `prepare_data.py` for the React dashboard
4. **Loaded in React dashboard** for interactive visualization

### Notebook Visualizations

The notebook also includes initial visualizations using Matplotlib and Seaborn:
- Bar charts for economical bowlers
- Count plots for toss impact
- Bar charts for runs in wins
- Bar charts for scores by venue
- Bar charts for dismissal types
- Bar charts for team toss performance

These serve as initial analysis before the interactive React dashboard.

## 🎨 Part 2: Interactive Dashboard (React)

### Dashboard Overview

The React dashboard serves as the **visualization and exploration interface** for the analysis results from the PySpark notebook. It transforms static CSV data into interactive, filterable visualizations.

### Data Pipeline: From Notebook to Dashboard

1. **CSV Export**: Analysis results from notebook are exported to CSV files
2. **Data Processing**: Python script (`prepare_data.py`) converts CSV to JSON
3. **React Dashboard**: Loads JSON data and renders interactive visualizations

### Dashboard Components and Their Connection to Notebook Queries

#### 1. Statistics Cards

**Component**: `StatCard.js` (used in `Dashboard.js`)

**Data Source**: Derived from multiple notebook queries

**Display**:
- **Top Scorer**: From `top_scoring_batsmen_per_season` query (highest total_runs)
- **Total Players**: Count from `top_scoring_batsmen_per_season` query
- **Average Runs**: Calculated from `top_scoring_batsmen_per_season` query
- **Total Matches**: From `match` data

**Purpose**: Provides quick overview of key metrics at a glance

---

#### 2. Top Batsmen Chart

**Component**: `TopBatsmenChart.js`

**Notebook Query**: `top_scoring_batsmen_per_season` (Query 1)

**Data Source**: `topBatsmen.json` (from `top_batsmen_per_season.csv`)

**Features**:
- **Horizontal Bar Chart**: Shows top run scorers
- **Season Filtering**: Filter by specific season or view all seasons
- **Top N Selection**: Display top 10, 15, 20, or 25 players
- **Color Coding**: Gold, Silver, Bronze for top 3 performers
- **Interactive Tooltips**: Shows player name, runs, and season

**Connection to Notebook**:
- Direct visualization of Query 1 results
- Displays `player_name`, `season_year`, and `total_runs`
- Enables filtering and exploration of notebook results

---

#### 3. Economical Bowlers Chart

**Component**: `EconomicalBowlersChart.js`

**Notebook Query**: `economical_bowlers_powerplay` (Query 2)

**Data Source**: `economicalBowlers.json` (from `economical_bowlers_powerplay.csv`)

**Features**:
- **Horizontal Bar Chart**: Shows most economical bowlers
- **Top N Selection**: Display top 10, 15, 20, or 25 bowlers
- **Interactive Tooltips**: Shows economy rate and wickets
- **Sorted by Economy**: Lower economy rate = better performance

**Connection to Notebook**:
- Direct visualization of Query 2 results
- Displays `player_name`, `avg_runs_per_ball`, and `total_wickets`
- Shows powerplay bowling performance from notebook analysis

---

#### 4. Toss Impact Chart

**Component**: `TossImpactChart.js`

**Notebook Query**: `toss_impact_individual_matches` (Query 3)

**Data Source**: `tossImpact.json` (from `toss_impact.csv`)

**Features**:
- **Pie Chart View**: Shows overall toss impact (Won/Lost)
- **Count Plot View**: Shows team-wise toss performance
- **View Toggle**: Switch between pie chart and count plot
- **Interactive Tooltips**: Shows team, wins, losses, and totals
- **Interactive Legend**: Filter by team

**Connection to Notebook**:
- Direct visualization of Query 3 results
- Displays `match_id`, `toss_winner`, `match_winner`, and `match_outcome`
- Processes data to show team-wise and overall toss impact

---

#### 5. Runs in Wins Chart

**Component**: `RunsInWinsChart.js`

**Notebook Query**: `average_runs_in_wins` (Query 4)

**Data Source**: `runsInWins.json` (from `runs_in_wins.csv`)

**Features**:
- **Horizontal Bar Chart**: Shows top performers in winning matches
- **Top N Selection**: Display top 10, 15, 20, or 25 players
- **Interactive Tooltips**: Shows average runs in wins and innings played
- **Filtered Data**: Only shows players with runs > 0

**Connection to Notebook**:
- Direct visualization of Query 4 results
- Displays `player_name`, `avg_runs_in_wins`, and `innings_played`
- Shows clutch performers who excel in winning matches

---

#### 6. Season Analysis Chart

**Component**: `SeasonAnalysis.js`

**Notebook Query**: Derived from `top_scoring_batsmen_per_season` (Query 1)

**Data Source**: `topBatsmen.json` (processed)

**Features**:
- **Line Chart**: Shows trends over time
- **Multi-Season Comparison**: Performance evolution across seasons
- **Trend Identification**: Shows improving/declining patterns
- **Statistics Cards**: Shows top 3 seasons with average runs
- **Interactive Tooltips**: Shows season, average runs, and player count

**Connection to Notebook**:
- Processes Query 1 results to show season-wise trends
- Groups by `season_year` and calculates average runs
- Displays performance evolution over time

---

#### 7. Scores by Venue Chart

**Component**: `ScoresByVenueChart.js`

**Notebook Query**: `scores_by_venue` (Query 5)

**Data Source**: `scoresByVenue.json` (from `scores_by_venue.csv`)

**Features**:
- **Horizontal Bar Chart**: Shows venue-specific scoring patterns
- **Metric Toggle**: Switch between Average Score and Highest Score
- **Interactive Tooltips**: Shows venue name, average score, and highest score
- **Color Coding**: Different colors based on score values
- **Dynamic Sorting**: Sorts by selected metric

**Connection to Notebook**:
- Direct visualization of Query 5 results
- Displays `venue_name`, `average_score`, and `highest_score`
- Shows venue-specific patterns from notebook analysis

---

#### 8. Dismissal Types Chart

**Component**: `DismissalTypesChart.js`

**Notebook Query**: `dismissal_types` (Query 6)

**Data Source**: `dismissalTypes.json` (from `dismissal_types.csv`)

**Features**:
- **Bar Chart View**: Horizontal bar chart showing dismissal frequencies
- **Pie Chart View**: Pie chart showing percentage distribution
- **View Toggle**: Switch between bar chart and pie chart
- **Interactive Tooltips**: Shows dismissal type, frequency, and percentage
- **Sorted by Frequency**: Most common dismissals first
- **Color Coding**: Different colors for each dismissal type

**Connection to Notebook**:
- Direct visualization of Query 6 results
- Displays `out_type` and `frequency`
- Shows most common dismissal types from notebook analysis

---

#### 9. Team Toss Performance Chart

**Component**: `TeamTossPerformanceChart.js`

**Notebook Query**: `team_toss_win_performance` (Query 7)

**Data Source**: `teamTossPerformance.json` (from `team_toss_performance.csv`)

**Features**:
- **Horizontal Bar Chart**: Shows team performance after winning toss
- **Metric Toggle**: Switch between Total Wins and Win Ratio
- **Interactive Tooltips**: Shows team, wins after toss, matches played, and win ratio
- **Color Coding**: Different colors based on performance
- **Dynamic Sorting**: Sorts by selected metric

**Connection to Notebook**:
- Direct visualization of Query 7 results
- Displays `team1`, `matches_played`, and `wins_after_toss`
- Calculates win ratio from notebook data
- Shows team-specific toss performance

---

### Interactive Features

#### 1. Season Filtering
- **Location**: Top Batsmen Chart
- **Function**: Filter by specific season or view all seasons
- **Impact**: Updates chart to show data for selected season
- **Data Processing**: Filters notebook results by `season_year`

#### 2. Top N Selection
- **Location**: Top Batsmen Chart, Economical Bowlers Chart, Runs in Wins Chart
- **Function**: Display top 10, 15, 20, or 25 players
- **Impact**: Adjusts number of players displayed
- **Data Processing**: Slices sorted data from notebook results

#### 3. Metric Toggling
- **Location**: Scores by Venue Chart, Team Toss Performance Chart
- **Function**: Switch between Average/Highest or Wins/Win Ratio
- **Impact**: Changes data displayed and chart sorting
- **Data Processing**: Selects different columns from notebook results

#### 4. View Mode Switching
- **Location**: Toss Impact Chart, Dismissal Types Chart
- **Function**: Toggle between Bar Chart and Pie Chart
- **Impact**: Changes visualization type
- **Data Processing**: Processes same notebook data differently

#### 5. Interactive Tooltips
- **Location**: All charts
- **Function**: Show detailed information on hover
- **Impact**: Provides additional context and data
- **Data Source**: Direct from notebook query results

#### 6. Responsive Design
- **Location**: All components
- **Function**: Adapts to different screen sizes
- **Impact**: Works on desktop, tablet, and mobile
- **Implementation**: Tailwind CSS responsive classes

---

### Dashboard Architecture

```
Dashboard.js (Main Container)
├── Header.js (Navigation)
├── StatCard.js (Statistics Cards - 4 cards)
├── TopBatsmenChart.js (Query 1 visualization)
├── EconomicalBowlersChart.js (Query 2 visualization)
├── TossImpactChart.js (Query 3 visualization)
├── RunsInWinsChart.js (Query 4 visualization)
├── SeasonAnalysis.js (Query 1 processed)
├── ScoresByVenueChart.js (Query 5 visualization)
├── DismissalTypesChart.js (Query 6 visualization)
└── TeamTossPerformanceChart.js (Query 7 visualization)
```

### Data Flow in Dashboard

1. **Data Loading**: 
   - `Dashboard.js` loads all JSON files asynchronously using `Promise.all()`
   - Data is validated and sorted
   - Loading states are displayed during data fetch

2. **Data Processing**:
   - Data is sorted based on requirements
   - Filtered based on user selections
   - Processed for chart display

3. **Chart Rendering**:
   - Each chart component receives processed data
   - Charts render using Recharts library
   - Interactive features are enabled

4. **User Interaction**:
   - User interactions (filtering, toggling) update state
   - State changes trigger chart re-renders
   - Tooltips provide additional information

---

### Technical Implementation

#### State Management
- **React Hooks**: `useState` for component state
- **useMemo**: For computed values and performance optimization
- **useEffect**: For data loading and side effects

#### Performance Optimization
- **Lazy Loading**: Data loaded asynchronously
- **Memoization**: Computed values cached with `useMemo`
- **Efficient Sorting**: Optimized sorting algorithms
- **Error Handling**: Graceful error handling and retry mechanisms

#### User Experience
- **Loading States**: Visual feedback during data loading
- **Error Handling**: User-friendly error messages
- **Smooth Animations**: Framer Motion for transitions
- **Responsive Design**: Mobile-first approach
- **Interactive Tooltips**: Detailed information on hover

---

### Connection Summary: Notebook → Dashboard

| Notebook Query | CSV File | JSON File | Dashboard Component | Visualization Type |
|----------------|----------|-----------|---------------------|-------------------|
| Query 1: Top Batsmen | `top_batsmen_per_season.csv` | `topBatsmen.json` | `TopBatsmenChart.js` | Horizontal Bar Chart |
| Query 2: Economical Bowlers | `economical_bowlers_powerplay.csv` | `economicalBowlers.json` | `EconomicalBowlersChart.js` | Horizontal Bar Chart |
| Query 3: Toss Impact | `toss_impact.csv` | `tossImpact.json` | `TossImpactChart.js` | Pie Chart / Count Plot |
| Query 4: Runs in Wins | `runs_in_wins.csv` | `runsInWins.json` | `RunsInWinsChart.js` | Horizontal Bar Chart |
| Query 5: Scores by Venue | `scores_by_venue.csv` | `scoresByVenue.json` | `ScoresByVenueChart.js` | Horizontal Bar Chart |
| Query 6: Dismissal Types | `dismissal_types.csv` | `dismissalTypes.json` | `DismissalTypesChart.js` | Bar Chart / Pie Chart |
| Query 7: Team Toss Performance | `team_toss_performance.csv` | `teamTossPerformance.json` | `TeamTossPerformanceChart.js` | Horizontal Bar Chart |
| Query 1 (Processed) | `top_batsmen_per_season.csv` | `topBatsmen.json` | `SeasonAnalysis.js` | Line Chart |

This mapping ensures that each dashboard visualization directly corresponds to a specific notebook analysis, providing a complete end-to-end data science workflow.

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### Deploy

The `build` folder can be deployed to any static hosting service:
- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [AWS S3](https://aws.amazon.com/s3/)
- [GitHub Pages](https://pages.github.com/)

## 🔧 Configuration

### Customize Colors

Edit `tailwind.config.js` to change the color scheme:

```javascript
colors: {
  primary: '#366092',
  secondary: '#70AD47',
  accent: '#FFC000',
}
```

### Modify Charts

Edit chart components in `src/components/` to customize:
- Chart types
- Colors
- Data processing
- Tooltips
- Legends

## 📈 Data Sources

The dashboard uses data from:
- Top Batsmen per Season
- Economical Bowlers (Powerplay)
- Toss Impact Analysis
- Runs in Winning Matches
- Match Data
- Scores by Venue
- Dismissal Types
- Team Toss Performance

All data is derived from the IPL analysis notebook and exported CSV files.

## 🐛 Troubleshooting

### Data not loading?

1. Ensure data files exist in `public/data/`
2. Run `python3 prepare_data.py` to regenerate JSON files
3. Check browser console for errors

### Charts not displaying?

1. Verify Recharts is installed: `npm list recharts`
2. Check that data is in correct format
3. Look for errors in browser console

### Build errors?

1. Clear node_modules: `rm -rf node_modules`
2. Reinstall: `npm install`
3. Clear cache: `npm start -- --reset-cache`

## 📝 Scripts

- `npm start`: Start development server
- `npm run build`: Build for production
- `npm test`: Run tests
- `npm run eject`: Eject from Create React App

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available for educational purposes.

## 👤 Author

**Kavinarasan**

- GitHub: [@kavinarasan-005](https://github.com/kavinarasan-005)
- Repository: [IPL_Sales_Analysis](https://github.com/kavinarasan-005/IPL_Sales_Analysis)

## 🙏 Acknowledgments

- IPL data sources
- Recharts for excellent charting library
- React community for amazing tools and resources

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Verify data file formats
3. Check component imports
4. Verify dependencies installation

---

**Enjoy exploring your IPL data! 🏏**

