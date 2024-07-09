import pytz

from users.middleware.threadlocalmiddleware import get_current_timezone


def convert_datetime_to_user_timezone(date_time):
    """
   Convert date to current user timezone.
   Format: 2023-09-20T07:10:00
   """
    current_timezone = get_current_timezone()
    local = pytz.timezone(current_timezone)
    return date_time.astimezone(local)


def convert_datetime_to_utc_timezone(date_time):
    """
   Convert date to utc timezone.
   """
    user_tz = pytz.timezone(get_current_timezone())
    localized_time = user_tz.localize(date_time.replace(tzinfo=None))
    return localized_time.astimezone(pytz.utc)
