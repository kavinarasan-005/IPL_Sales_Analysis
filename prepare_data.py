#!/usr/bin/env python3
"""
Prepare data for React dashboard by converting CSV to JSON
"""
import pandas as pd
import json
import os

def prepare_data():
    """Convert CSV files to JSON for React app"""
    # Paths
    csv_dir = '/Users/kavinarasan/Downloads/PowerBI_Data'
    output_dir = '/Users/kavinarasan/Downloads/ipl_dashboard/public/data'
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Files to convert
    files = {
        'top_batsmen_per_season.csv': 'topBatsmen.json',
        'economical_bowlers_powerplay.csv': 'economicalBowlers.json',
        'toss_impact.csv': 'tossImpact.json',
        'runs_in_wins.csv': 'runsInWins.json',
        'match_data.csv': 'matchData.json',
    }
    
    converted = {}
    
    for csv_file, json_file in files.items():
        csv_path = os.path.join(csv_dir, csv_file)
        json_path = os.path.join(output_dir, json_file)
        
        if os.path.exists(csv_path):
            try:
                df = pd.read_csv(csv_path)
                # Convert to JSON
                data = df.to_dict(orient='records')
                
                with open(json_path, 'w') as f:
                    json.dump(data, f, indent=2)
                
                converted[json_file] = len(data)
                print(f"✓ Converted {csv_file} → {json_file} ({len(data)} records)")
            except Exception as e:
                print(f"✗ Error converting {csv_file}: {e}")
        else:
            print(f"✗ File not found: {csv_path}")
    
    # Create summary stats
    summary = {
        'generated': pd.Timestamp.now().isoformat(),
        'datasets': converted,
        'totalRecords': sum(converted.values())
    }
    
    summary_path = os.path.join(output_dir, 'summary.json')
    with open(summary_path, 'w') as f:
        json.dump(summary, f, indent=2)
    
    print(f"\n✓ Created summary.json")
    print(f"✓ Total records: {summary['totalRecords']}")
    print(f"\nAll data files are in: {output_dir}")

if __name__ == '__main__':
    prepare_data()


