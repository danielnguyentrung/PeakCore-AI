FROM python:3.12-slim

WORKDIR /app 

COPY  requirements.txt .

RUN pip install -r requirements.txt

COPY staleness_check.py . 

CMD ["python", "staleness_check.py"]