import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify
)

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

bp = Blueprint('experiment', __name__, url_prefix='/experiment')

# Setup azure
# Replace <Subscription Key> with your valid subscription key.
subscription_key = "1e94ebc81f34468a9e9bea9bf04052cb"
assert subscription_key

emotion_recognition_url = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect"


@bp.route('/', methods=['GET'])
def get_camera():
    sequence = request.args.get('sequence').split("-")
    print(sequence)

    # 23 elements * 7.5 = 172.5seconds (one element is bad quality)

    # res = l - i
    camera = cv2.VideoCapture(0)
    time.sleep(0.1)

    dirname = request.args.get('sequence') + '&time=' + str(int(time.time()*1000.0))
    os.mkdir("flaskr/static/experiments/" + dirname)

    # timer = 172.5
    timer = 10
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
        filename = 'flaskr/static/experiments/%s/%s-%s.jpg' % (dirname, sequence[i], str(c))
        cv2.imwrite(filename, frame)
        time.sleep(1.5)
        print(timer)

    cv2.destroyAllWindows()

    # When everything done, release the capture
    del camera

    person = int(db.findIdPerson()) + 1

    for el in sequence:
        f = open("flaskr/static/experiments/%s/log.txt" % (dirname),"w+")
        for index in range(1, 5):
            try:
                name_frame = 'flaskr/static/experiments/%s/%s-%s.jpg' % (dirname, el, str(index))
                # send to microsoft azure
                image_url = "./" + name_frame #image_url to the URL of an image that you want to analyze
                image_data = open(image_url, "rb").read()

                header = {'Content-Type': 'application/octet-stream', 'Ocp-Apim-Subscription-Key': subscription_key}
                params = {
                    'returnFaceId': 'true',
                    'returnFaceLandmarks': 'false',
                    'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
                }
                response = requests.post(emotion_recognition_url, headers=header, data=image_data, params=params)
                analysis = response.json()
                try:
                    emotions_found = analysis[0]['faceAttributes']['emotion']
                    db.insertEmotion(emotions_found, person, el, index)
                except:
                    f.write("No emotion found in photo: %s-%s.jpg\r\n" % (el, str(index)))

                # emotions_found = analysis[0]['faceAttributes']['emotion']
                # age_found = analysis[0]['faceAttributes']['age']
                # gender_found = analysis[0]['faceAttributes']['gender']
                # db.findIdPerson(el)
                # db.insert(fields=('id','person','time','name','anger','contempt','disgust','fear','happiness','neutral','sadness','surprise'), values=(el, TODO, index, emotions_found['anger'], emotions_found['contempt'], emotions_found['disgust'], emotions_found['fear'], emotions_found['happiness'], emotions_found['neutral'], emotions_found['sadness'], emotions_found['surprise']))

            except Exception as e:
	            f.write("No photo found (%s-%s.jpg)\r\n" % (el, str(index)))
        f.close()



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
