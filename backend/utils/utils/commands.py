import json

from asgiref.sync import async_to_sync
from django.core.management import BaseCommand
from munch import munchify

try:
    import aiofiles
except ImportError:
    aiofiles = None


class AsyncCommand(BaseCommand):

    def handle(self, *args, **options):
        self.style.INFO = self.style.HTTP_NOT_MODIFIED  # sugar
        self.style.MAGENTA = self.style.HTTP_SERVER_ERROR  # sugar
        async_to_sync(self.ahandle)(*args, **options)


class JSONArgsHelpersMixin:

    async def readjson(self, filen):
        if aiofiles is None:
            raise ImportError('aiofiles is not installed')
        async with aiofiles.open(filen, mode='rb') as f:
            return munchify(json.loads(await f.read()))

    async def arg(self, options, paramName, default, parsejson=False, isjson=False):
        if paramName in options and options[paramName] is not None:
            res = options[paramName]
            res = (await munchify(self.readjson(res))) if parsejson else res
            return munchify(json.loads(res)) if isjson else res
        return default
