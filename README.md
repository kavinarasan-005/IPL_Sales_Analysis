# IPL Data Analysis Dashboard

A comprehensive data analysis and visualization project that processes large-scale IPL (Indian Premier League) cricket data using PySpark and presents interactive insights through a modern React web dashboard.

![IPL Dashboard Preview](images/dashboard-screenshot.png)

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

### Frontend
- **React 18.2**: UI framework
- **Recharts 2.8**: Interactive charting library
- **Tailwind CSS 3.3**: Utility-first styling
- **Framer Motion 10.16**: Smooth animations
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
│   └── index.html
├── src/
│   ├── components/        # React components
│   ├── App.js
│   └── index.js
├── ipl_data_analysis_fixed.ipynb  # PySpark analysis notebook
├── prepare_data.py                 # Data processing script
└── package.json
```

## 🔄 Workflow

```
Raw Data (AWS S3)
  ↓
PySpark Analysis (Jupyter Notebook)
  ↓
CSV Export (Analysis Results)
  ↓
Data Processing (Python Script)
  ↓
JSON Files (Processed Data)
  ↓
React Dashboard (Interactive Visualization)
```

## 📊 Key Analyses

### 1. Top Scoring Batsmen Per Season
Identifies top run scorers for each IPL season with season-wise filtering.

### 2. Economical Bowlers (Powerplay)
Analyzes most economical bowlers during powerplay overs (overs 1-6).

### 3. Toss Impact Analysis
Analyzes correlation between winning the toss and winning the match.

### 4. Average Runs in Wins
Identifies players who perform best in winning matches (clutch performers).

### 5. Scores by Venue
Analyzes scoring patterns by venue/stadium.

### 6. Dismissal Types
Analyzes most common dismissal types in IPL.

### 7. Team Toss Performance
Analyzes team performance after winning the toss.

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

## 👤 Author

**Kavinarasan**

- GitHub: [@kavinarasan-005](https://github.com/kavinarasan-005)
- Repository: [IPL_Sales_Analysis](https://github.com/kavinarasan-005/IPL_Sales_Analysis)

## 📄 License

This project is open source and available for educational purposes.

---

**Enjoy exploring your IPL data! 🏏**
