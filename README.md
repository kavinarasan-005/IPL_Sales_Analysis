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

## 📊 Key Analyses

### 1. Top Scoring Batsmen Per Season
- Aggregates runs by player and season
- Identifies top performers
- Tracks consistency across seasons

### 2. Economical Bowlers (Powerplay)
- Analyzes powerplay overs (1-6)
- Calculates economy rates
- Identifies most economical bowlers

### 3. Toss Impact Analysis
- Correlates toss winner with match winner
- Determines toss advantage
- Strategic insights for teams

### 4. Average Runs in Wins
- Analyzes player performance in winning matches
- Identifies clutch performers
- Match-winner analysis

### 5. Scores by Venue
- Venue-specific scoring patterns
- Home advantage analysis
- Strategic preparation insights

### 6. Dismissal Types
- Most common dismissal types
- Pattern analysis
- Strategic insights

### 7. Team Toss Performance
- Team performance after winning toss
- Team-specific strategies
- Win ratio analysis

## 🎨 Dashboard Features

### Statistics Cards
- Top Scorer
- Total Players Analyzed
- Average Runs per Player
- Total Matches

### Interactive Charts
- **Season Filtering**: View specific seasons or all seasons
- **Top N Selection**: Display top 10, 15, 20, or 25 players
- **Metric Toggling**: Switch between Average and Highest scores
- **View Modes**: Toggle between Bar and Pie charts
- **Interactive Tooltips**: Detailed information on hover
- **Responsive Design**: Works on all devices

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

