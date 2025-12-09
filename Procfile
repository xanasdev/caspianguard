web: python manage.py collectstatic --noinput && python manage.py makemigrations && python manage.py migrate && gunicorn caspianguard.wsgi --bind 0.0.0.0:$PORT
