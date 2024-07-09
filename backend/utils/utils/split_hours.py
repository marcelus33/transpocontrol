import datetime

default_exclude_hours = list()


def split_hours(start_time, end_time, minutes_split=30, exclude_hours=None):
    """
    Splits a range of hours into individual hours with a specific duration, excluding times whose date and time match the exclude_hours.

    Args:
      start_time: A datetime object representing the start time.
      end_time: A datetime object representing the end time.
      duration: A timedelta object representing the desired duration for each split.
      exclude_hours: A list of datetime objects representing the hours to exclude.

    Returns:
      A list of datetime objects representing each split within the range, excluding times whose date and time match the exclude_hours.
    """
    if exclude_hours is None:
        exclude_hours = []
    duration = datetime.timedelta(minutes=minutes_split)
    hours = []
    current_time = start_time
    exclude_hours_list = [exclude_hour.hour for exclude_hour in exclude_hours]
    exclude_minute_list = [exclude_hour.minute for exclude_hour in exclude_hours]
    while current_time <= end_time:
        if not (current_time.hour in exclude_hours_list and current_time.minute in exclude_minute_list):
            hours.append(current_time)
        current_time += duration
    return hours
