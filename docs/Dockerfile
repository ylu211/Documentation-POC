FROM python:3.11-slim

RUN pip install mkdocs mkdocs-material mkdocs-swagger-ui

WORKDIR /docs

CMD ["mkdocs", "serve", "-a", "0.0.0.0:8000"]

