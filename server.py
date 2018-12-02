from flask import Flask, render_template, request, jsonify
import cv2
import time
import Path
import os
import database as db

# Azure
import requests
import matplotlib.pyplot as plt
import json
from PIL import Image
from io import BytesIO




# export FLASK_APP=server.py && export FLASK_ENV=development && flask run && flask init-db
# export FLASK_APP=server.py && export FLASK_ENV=development && flask run --host=0.0.0.0
# to kill: sudo lsof -i :5000
# kill -9 *id*

#Setup azure
# Replace <Subscription Key> with your valid subscription key.
subscription_key = "1e94ebc81f34468a9e9bea9bf04052cb"
assert subscription_key

# You must use the same region in your REST call as you used to get your
# subscription keys. For example, if you got your subscription keys from
# westus, replace "westcentralus" in the URI below with "westus".
#
# Free trial subscription keys are generated in the "westus" region.
# If you use a free trial subscription key, you shouldn't need to change
# this region.
emotion_recognition_url = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect"
# emotion_recognition_url = "https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize"


#Start application:
app = Flask(__name__)
app.debug = True
# app.run(host = '192.33.203.197',port=5000)
app.run(host='0.0.0.0' , port=5000)
db.init_app(app)


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

@app.route('/experiment', methods=['GET'])
def get_camera():
    sequence = request.args.get('sequence').split("-")
    print(sequence)

    if "localhost:" in request.base_url:
        base_url = "http://localhost:5000/"
    # else:
    #     #setup new link


    # 23 elements * 7.5 = 172.5seconds (one element is bad quality)

    # res = l - i
    camera = cv2.VideoCapture(0)
    time.sleep(0.1)

    dirname = request.args.get('sequence') + '&time=' + str(int(time.time()*1000.0))
    os.mkdir("static/experiments/" + dirname)

    # timer = 172.5
    timer = 7.5
    i = -1
    c = 0

    while (i < len(sequence)) & (timer > 0):
        timer = timer-1.5
        # Capture frame-by-frame
        ret, frame = camera.read()
        if(timer % 7.5 == 0):
            # Our operations on the frame come here
            i = i + 1
            c = 0
        c = c + 1
        # filename = '%s/%s-%d.jpg' % (dirname,sequence[i], c)
        filename = 'static/experiments/%s/%s-%s.jpg' % (dirname, sequence[i], str(c))
        cv2.imwrite(filename, frame)
        time.sleep(1.5)
        print(timer)

    cv2.destroyAllWindows()

    # When everything done, release the capture
    del camera

    for el in sequence:
        for index in range(1, 5):
            try:
                name_frame = 'static/experiments/%s/%s-%s.jpg' % (dirname, el, str(index))
                # send to microsoft azure
                image_url = "./" + name_frame #image_url to the URL of an image that you want to analyze
                # image_url = './' + name_frame #image_url to the URL of an image that you want to analyze
                image_data = open(image_url, "rb").read()

                header = {'Content-Type': 'application/octet-stream', 'Ocp-Apim-Subscription-Key': subscription_key}
                params = {
                    'returnFaceId': 'true',
                    'returnFaceLandmarks': 'false',
                    'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
                }

                # data = {'url': image_url}

                # response = requests.post(emotion_recognition_url, params=params, headers=header, data=image_data)
                response = requests.post(emotion_recognition_url, headers=header, data=image_data, params=params)
                # response.raise_for_status()
                analysis = response.json()

                # header = {'Ocp-Apim-Subscription-Key': subscription_key, "Content-Type": "application/octet-stream" }
                # response = requests.post(emotion_recognition_url, headers=header, data=image_data)
                print(analysis)

            except Exception as e:
	            print("Photo not found:%s-%s" % (el, str(index)))


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

