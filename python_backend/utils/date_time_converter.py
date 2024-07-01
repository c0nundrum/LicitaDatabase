import re
from datetime import datetime

def find_and_convert_datetime(string):
    # Define regex patterns for date and time
    date_pattern = r'(\d{2}/\d{2}/\d{4})'
    time_pattern = r'(\d{2}h\d{2}min|\d{2}h|\d{2}:\d{2})'
    
    # Find date and time in the string
    date_match = re.search(date_pattern, string)
    time_match = re.search(time_pattern, string)
    
    if date_match and time_match:
        date_str = date_match.group(0)
        time_str = time_match.group(0)
        
        # Convert date string to standard format
        date_format = "%d/%m/%Y"
        date_obj = datetime.strptime(date_str, date_format)
        
        # Convert time string to standard format
        if 'h' in time_str and 'min' in time_str:
            time_str = time_str.replace('h', ':').replace('min', '')
            time_format = "%H:%M"
        elif 'h' in time_str:
            time_str = time_str.replace('h', ':00')
            time_format = "%H:%M"
        else:
            time_format = "%H:%M"
        
        time_obj = datetime.strptime(time_str, time_format)
        
        # Combine date and time
        combined_datetime = datetime.combine(date_obj, time_obj.time())
        
        return combined_datetime
    else:
        return None


if __name__ == "__main__":
  # Example usage:
  strings = [
      "Meeting on 09/07/2024 08h35min and then lunch.",
      "Start time is 10/08/2024 15h, be there.",
      "Project due by 11/09/2024 14:30, do not be late."
  ]
  results = []

  for string in strings:
    results.append(find_and_convert_datetime(string))

  for dt in results:
      print(dt)
