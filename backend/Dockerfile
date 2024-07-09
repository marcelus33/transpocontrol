FROM python:3.11-slim-bookworm as deps

ARG YOUR_ENV

ENV YOUR_ENV=${YOUR_ENV} \
  PYTHONFAULTHANDLER=1 \
  PYTHONUNBUFFERED=1 \
  PYTHONHASHSEED=random \
  PIP_NO_CACHE_DIR=off \
  PIP_DISABLE_PIP_VERSION_CHECK=on \
  PIP_DEFAULT_TIMEOUT=100 \
  POETRY_VERSION=1.5.1

# System deps:
RUN pip install "poetry==$POETRY_VERSION" chuy


# Copy only requirements to cache them in docker layer
WORKDIR /opt/webapp

ADD poetry.lock pyproject.toml /opt/webapp/

# Project initialization:
RUN poetry config virtualenvs.create false \
  && poetry install $(test "$YOUR_ENV" == production && echo "--no-dev") --no-interaction --no-ansi

# libpq-dev and python3-dev help with psycopg2
#RUN apt-get update \
#  && apt-get install -y --no-install-recommends python3-dev libpq-dev gcc curl binutils libproj-dev gdal-bin g++ \
#  && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
#  && rm -rf /var/lib/apt/lists/*
  # You can add additional steps to the build by appending commands down here using the
  # format `&& <command>`. Remember to add a `\` at the end of LOC 12.
  # WARNING: Changes to this file may cause unexpected behaviors when building the app.
  # Change it at your own risk.

FROM deps as release

#COPY --from=base /root/.local /root/.local
#COPY --from=base /opt/webapp/manage.py /opt/webapp/manage.py
WORKDIR /opt/webapp
ADD . /opt/webapp/

ARG SECRET_KEY
RUN python3 manage.py collectstatic --no-input

# Run the image as a non-root user
RUN adduser --disabled-password --gecos "" django
USER django
#CMD sleep 999999
CMD waitress-serve --port=$PORT transpocargo.wsgi:application
