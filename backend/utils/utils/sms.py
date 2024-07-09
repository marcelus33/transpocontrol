

from twilio_client.client import TwilioClient


def send_sms(message, phone_number):
    """
    Sends SMS using Twilio client
    """
    client = TwilioClient()
    client.send_sms(message, phone_number)

