FROM python:3.8-buster

WORKDIR /app

COPY requirements.txt /app
RUN pip install -r requirements.txt

COPY . /app

EXPOSE 21000

CMD python src/app.py
