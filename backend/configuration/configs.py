from django.core.files import File

from configuration.utils import ConfigKey


# TEST = ConfigKey(
#     value=1,
#     verbose_name='Test configuration value',
#     validation_function=lambda key, value: isinstance(value, int) and value > 0
# )
#
# TEST_NOT_FILE = ConfigKey(
#     value=1,
#     verbose_name='Test configuration value',
#     validation_function=lambda key, value: not isinstance(value, File)
# )
#
#
# TEST2 = 45
#
# TEST3 = "hola que tal"





















# don't touch this
from configuration.utils import setup_configs_hooks
setup_configs_hooks()
