from flask import Flask, render_template
app = Flask(__name__)

# url_for('static', filename='animate.min.css')
# url_for('static', filename='bootstrap.min.css')
# url_for('static', filename='flexslider.css')
# url_for('static', filename='font-icon.css')
# url_for('static', filename='main.css')
# url_for('static', filename='responsive.css')
# url_for('static', filename='jquery.fancybox.css')

@app.route('/')
def hello_world():
    # return 'Hello, World!'
    return render_template('index.html')

# export FLASK_APP=server.py && flask run