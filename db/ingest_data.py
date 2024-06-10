import matplotlib.pyplot as plt
import pandas as pd
import os
import json


"""
Given directory containing 'materialsforabusinessgroup' files, concatenate all of the data in a dataframe and save to the given out file as a csv
"""
def ingest_data(dir: str, out_file: str)
	# Gather files for "materials for a business group"
	dfs = []
	files = []
	df = None


	for filename in os.listdir(dir):
	    if filename.startswith('materialsforabusinessgroup'):
	        files.append(filename)
	        new_data = pd.read_excel(os.path.join(dir, filename), sheet_name=1)

	        # Fix the columns if this has "data suppressed" at the top
	        first_col = new_data.columns[0]
	        if isinstance(first_col, str) and first_col.startswith("Warning: Some data for this selection is suppressed and affects the results."):
	          new_data = pd.read_excel(os.path.join(dir, filename), sheet_name=1, header=1)

	        # print(new_data.size)
	        if df is None:
	          df = new_data
	        else:
	          df = pd.concat([df, new_data])
	        print(filename + " " + str(len(df.columns)))

	df.to_csv(out_file)


"""
Not sure how useful this is, but saving it in case. This takes the specific json file in the first line, which contains the coordinates demarcating the county, and strips a number of characters from each line. It returns the clean json as a string.

Originally, each line looked like this, I believe:

'b<actual text of the line>/r/nb'

I can't actually find a copy of that file that I can open to see the extra characters anymore - don't know if we just saved the new version over the old one, or if it's just a weird artifact from different OSes/platforms opening a text file.

"""
def process_coord_data():
	with open('alameda_county_coordinate_data.json', 'r') as f:
	    """
	        Couldn't get Hex to load the file itself, needed to convert to string
	        Need to strip several characters
	            - /r, /n at the end of the line - use strip()
	            - b at beginning, ' at beginning and end - take string slice [2:-1]
	    """
	    stripped = [l.strip()[2:-1] for l in f.readlines()]
	    f_text = ' '.join(stripped)
	    ala_json = json.loads(f_text)

	return ala_json