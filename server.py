from flask import Flask, render_template, request, jsonify
import cv2
import time
import Path
import os

# export FLASK_APP=server.py && export FLASK_ENV=development && flask run
# export FLASK_APP=server.py && export FLASK_ENV=development && flask run --host=0.0.0.0
# to kill: sudo lsof -i :5000
# kill -9 *id*

app = Flask(__name__)
app.debug = True
# app.run(host = '192.33.203.197',port=5000)
app.run(host='0.0.0.0' , port=5000)

global closeCamera
global nameFile

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
        Path.EmoDist([mydata["anger"], mydata["fear"], mydata["disgust"], mydata["contempt"], mydata["happiness"], mydata["sadness"], mydata["surprise"]], mydata["date"])
        return "Thanks. Your Surprise value is %s" % mydata.get("surprise")
    else:
        return "no json received"


@app.route('/closeCamera', methods=['GET'])
def close_camera():
    closeCamera = True
    cv2.destroyAllWindows()
    return jsonify({"res" : "camera destroyed"})

@app.route('/experiment', methods=['GET'])
def get_camera():
    closeCamera = False

    sequence = request.args.get('sequence').split("-")
    print(sequence)

    # 36 elements * 5 = 180seconds

    # save time for each painting

    # res = l - i
    camera_port = 0
    camera = cv2.VideoCapture(camera_port)
    time.sleep(0.1)

    # i = 0

    # cur_char = -1
    # prev_char = -1

    dirname = request.args.get('sequence') + '&time=' + time.strftime("%c")

    if os.path.exists(dirname):
        os.mkdir(dirname)
    os.mkdir(dirname)

    timer = 180
    i = -1
    c = 0

    # while i < len(sequence):
    while i < len(sequence) & timer != 0 & closeCamera == False:
        timer = timer-1
        # Capture frame-by-frame
        ret, frame = camera.read()
        if(timer % 5 == 0):
            # Our operations on the frame come here
            i = i + 1
            print(i)
            c = 0
        c = c + 1
        filename = '%s/%s-%d.jpg' % (dirname,sequence[i], c)
        cv2.imwrite(filename, frame)
        time.sleep(1)
        print(timer)

    print(i, timer, closeCamera)

    cv2.destroyAllWindows()

    # When everything done, release the capture
    del camera

    # Send all to microsoft (upload all photos) and return a JSON
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

    return jsonify(result)

@app.route('/next', methods=['GET'])
def update_name():
    nameFile = request.args.get('name')
