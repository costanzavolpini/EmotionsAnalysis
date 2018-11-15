from flask import Flask, render_template, request, jsonify
import cv2
import time
import Path

# export FLASK_APP=server.py && export FLASK_ENV=development && flask run
# export FLASK_APP=server.py && export FLASK_ENV=development && flask run --host=0.0.0.0
# localhost:5000

app = Flask(__name__)
app.debug = True
# app.run(host = '192.33.203.197',port=5000)
app.run(host='0.0.0.0' , port=5000)

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


@app.route('/diagrams', methods=['GET'])
def diagram():
    return render_template('diagrams.html')


@app.route('/path', methods=['GET', 'POST'])
# Function to get the value of the emotions in order to generate the path
def get_emotions_path():
    app.logger.debug("JSON received...")
    app.logger.debug(request.get_json(force=True))

    if request.json:
        mydata = request.json
        # return the new image of the path
        Path.EmoDist([mydata["anger"], mydata["fear"], mydata["disgust"], mydata["contempt"], mydata["happiness"], mydata["sadness"], mydata["surprise"]])
        return "Thanks. Your Surprise value is %s" % mydata.get("surprise")
    else:
        return "no json received"


@app.route('/closeCamera', methods=['GET'])
def close_camera():
    cv2.destroyAllWindows()
    return jsonify({"res" : "camera destroyed"})

@app.route('/experiment', methods=['GET'])
def get_camera():
    t0= time.clock()
    i = float(request.args.get('time'))
    l = float(request.args.get('duration'))
    t = t0

    res = l - i
    camera_port = 0
    camera = cv2.VideoCapture(camera_port)
    time.sleep(0.1)

    while(t < res):
        # Capture frame-by-frame
        ret, frame = camera.read()
        if ret == True:
            # Our operations on the frame come here
            filename = 'frame%d.jpg' % (t)
            cv2.imwrite(filename, frame)
            time.sleep(3)

        t = time.clock() - t0
        if t >= res:
            break

    # When everything done, release the capture
    del camera

    # Send all to microsoft and return a JSON
    result =   {
        "faceRectangle": {
        "top": 141,
        "left": 130,
        "width": 162,
        "height": 162
        },
        "scores": {
        "anger": 9.29041E-06,
        "contempt": 0.000118981574,
        "disgust": 3.15619363E-05,
        "fear": 0.000589638,
        "happiness": 0.06630674,
        "neutral": 0.00555004273,
        "sadness": 7.44669524E-06,
        "surprise": 0.9273863
        }
    }

    # del camera
    return jsonify(result)


