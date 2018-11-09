from flask import Flask, render_template, request, jsonify
import cv2
import time

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
    return render_template('index.html')


@app.route('/path', methods=['GET', 'POST'])
# Function to get the value of the emotions in order to generate the path
def get_emotions_path():
    app.logger.debug("JSON received...")
    app.logger.debug(request.get_json(force=True))

    if request.json:
        mydata = request.json
        # return the new image of the path
        return "Thanks. Your Surprise value is %s" % mydata.get("surprise")
    else:
        return "no json received"

# export FLASK_APP=server.py && export FLASK_ENV=development && flask run


# camera_port = 0
# camera = cv2.VideoCapture(camera_port)
# time.sleep(0.1)  # If you don't wait, the image will be dark
# return_value, image = camera.read()
# cv2.imwrite("opencv.png", image)
# del(camera)  # so that others can use the camera as soon as possible

@app.route('/experiment', methods=['GET'])
def get_camera():
    camera_port = 0
    camera = cv2.VideoCapture(camera_port)
    time.sleep(0.1)
    return_value, image = camera.read()
    cv2.imwrite("user.png", image)
    del camera
    return "LLL"