from flask import Flask, render_template, request, jsonify
import cv2
import time
import Path
import os

# Azure
import requests
import matplotlib.pyplot as plt
import json
from PIL import Image
from io import BytesIO

# export FLASK_APP=server.py && export FLASK_ENV=development && flask run
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
vision_base_url = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect"

analyze_url = vision_base_url + "analyze"

#Start application:
app = Flask(__name__)
app.debug = True
# app.run(host = '192.33.203.197',port=5000)
app.run(host='0.0.0.0' , port=5000)


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

    # 36 elements * 5 = 180seconds

    # res = l - i
    camera = cv2.VideoCapture(0)
    time.sleep(0.1)

    dirname = request.args.get('sequence') + '&time=' + time.strftime("%c")
    os.mkdir("static/experiments/" + dirname)

    timer = 180
    i = -1
    c = 0

    while (i < len(sequence)) & (timer != 0):
        timer = timer-1
        # Capture frame-by-frame
        ret, frame = camera.read()
        if(timer % 5 == 0):
            # Our operations on the frame come here
            i = i + 1
            c = 0
        c = c + 1
        # filename = '%s/%s-%d.jpg' % (dirname,sequence[i], c)
        filename = 'static/experiments/%s/%s-%s.jpg' % (dirname, sequence[i], str(c))
        cv2.imwrite(filename, frame)
        time.sleep(1)
        print(timer)

    print(i, timer)

    cv2.destroyAllWindows()

    # When everything done, release the capture
    del camera

    # Set image_url to the URL of an image that you want to analyze.
    # image_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/" + \
    #     "Broadway_and_Times_Square_by_night.jpg/450px-Broadway_and_Times_Square_by_night.jpg"

    # headers = {'Ocp-Apim-Subscription-Key': subscription_key }
    # params  = {'visualFeatures': 'Categories,Description,Color'}
    # data    = {'url': image_url}
    # response = requests.post(analyze_url, headers=headers, params=params, json=data)
    # response.raise_for_status()

    # # The 'analysis' object contains various fields that describe the image. The most
    # # relevant caption for the image is obtained from the 'description' property.
    # analysis = response.json()
    # print(json.dumps(response.json()))
    # image_caption = analysis["description"]["captions"][0]["text"].capitalize()

    # # Display the image and overlay it with the caption.
    # image = Image.open(BytesIO(requests.get(image_url).content))
    # plt.imshow(image)
    # plt.axis("off")
    # _ = plt.title(image_caption, size="x-large", y=-0.1)
    # plt.show()

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

