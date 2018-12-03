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

            except Exception as e:
	            f.write("No photo found (%s-%s.jpg)\r\n" % (el, str(index)))
        f.close()

    return str(person)


@bp.route('/emotion', methods=['GET'])
def getEmotion():
    person = request.args.get('person')
    paintings = db.getEmotionsByPerson(person)
    return jsonify(paintings)
    # print(painting)