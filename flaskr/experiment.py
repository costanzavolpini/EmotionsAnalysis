import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify
)

"""File that handle the experiment."""
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
# Replace <Subscription Key> with your valid subscription key every 7 days!
subscription_key = "1906a065079e4402b155f4256ed451b3"

assert subscription_key

emotion_recognition_url = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect"

@bp.route('/person', methods=['GET'])
"""Return a new id to use for a person."""
def get_person():
    return str(int(db.findIdPerson()) + 1)

@bp.route('/folder', methods=['GET'])
def make_dir():
    """Generate a folder where save the images of the experiment."""
    dirname = request.args.get('dirname')
    os.mkdir("flaskr/static/experiments/" + dirname)
    return ("Generated folder %s" % dirname)

@bp.route('/', methods=['GET'])
def get_photo():
    """Capture pictures for the experiment and send it to Microsoft Azure."""
    dirname = request.args.get('sequence')
    id = request.args.get('id')
    person = request.args.get('person')
    camera = cv2.VideoCapture(0)
    time.sleep(0.1)

    curr_photo = 0

    start_time = time.time()
    while curr_photo < 5:
        if (time.time() - start_time)//1.5 >= curr_photo:
            # Capture frame-by-frame
            ret, frame = camera.read()
            curr_photo += 1
            filename = 'flaskr/static/experiments/%s/%s-%s.jpg' % (dirname, str(id), str(curr_photo))
            cv2.imwrite(filename, frame)

    cv2.destroyAllWindows()

    # When everything done, release the capture
    del camera

    f = open("flaskr/static/experiments/%s/log.txt" % (dirname),"w+")
    for index in range(1, 5):
        print("analysing photo %s-%s" % (id, str(index)))
        try:
            name_frame = 'flaskr/static/experiments/%s/%s-%s.jpg' % (dirname, id, str(index))
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
                db.insertEmotion(emotions_found, person, id, index)
            except:
                f.write("No emotion found in photo: %s-%s.jpg\r\n" % (id, str(index)))

        except Exception as e:
	        f.write("No photo found (%s-%s.jpg)\r\n" % (id, str(index)))
    f.close()

    return str(id)

@bp.route('/painting', methods=['GET'])
def getPainting():
    """Get the emotion related to a painting."""
    id = request.args.get('id')
    datas = db.getEmotionByPaiting(id)
    ds = {}
    emotions = ['anger', 'contempt', 'disgust', 'fear', 'happiness', 'neutral', 'sadness', 'surprise']
    for d in datas:
        frame = d[2]
        if(d[2] == None):
            frame = '3'
        if frame not in ds:
            ds[frame] = {"count": 0, "name": d[3], "anger": 0, "contempt": 0, "disgust": 0, "fear": 0, "happiness": 0, "neutral": 0, "sadness": 0, "surprise": 0}
        ds[frame]['count'] += 1
        t = ds[frame]['count']
        for i, emotion in enumerate(emotions):
            ds[frame][emotion] = ((ds[frame][emotion]*(t-1))/t) + (d[i+4]/t)
    return jsonify(ds)


@bp.route('/emotion', methods=['GET'])
def getEmotion():
    """Get the emotion related to a person."""
    person = request.args.get('person')
    paintings = db.getEmotionsByPerson(person)
    ps = {}
    emotions = ['anger', 'contempt', 'disgust', 'fear', 'happiness', 'neutral', 'sadness', 'surprise']
    for paint in paintings:
        pain_id = paint[0]

        if pain_id not in ps:
            ps[pain_id] = {"person": paint[1], "time": 0, "name": paint[3], "anger": 0, "contempt": 0, "disgust": 0, "fear": 0, "happiness": 0, "neutral": 0, "sadness": 0, "surprise": 0}

        ps[pain_id]['time'] += 1
        t = ps[pain_id]['time']
        for i, emotion in enumerate(emotions):
            ps[pain_id][emotion] = ((ps[pain_id][emotion]*(t-1))/t) + (paint[i+4]/t)

    return jsonify(ps)

@bp.route('/table', methods=['GET'])
def getTable():
    """Get all the information stored."""
    table = {}
    ts = db.query_db("select * from experience", one=False)
    emotions = ['anger', 'contempt', 'disgust', 'fear', 'happiness', 'neutral', 'sadness', 'surprise']
    for t in ts:
        id = t[0]
        if id not in table:
            table[id] = {"count": 0, "name": t[3], "anger": 0, "contempt": 0, "disgust": 0, "fear": 0, "happiness": 0, "neutral": 0, "sadness": 0, "surprise": 0}

        table[id]['count'] += 1
        c = table[id]['count']
        for i, emotion in enumerate(emotions):
            table[id][emotion] = ((table[id][emotion]*(c-1))/c) + (t[i+4]/c)

    return jsonify(table)


@bp.route('/tableJson', methods=['GET'])
def getTableJson():
    """Return a json containing all the rows of the table (database)."""
    table = {}
    ts = db.query_db("select * from experience", one=False)
    i = 0
    for t in ts:
        id = t[0]
        table[i] = {"id": t[0], "person": t[2], "time": t[2], "name": t[3], "anger": t[4], "contempt": t[5], "disgust": t[6], "fear": t[7], "happiness": t[8], "neutral": t[9], "sadness": t[10], "surprise": t[11]}
        i = i+1
    return jsonify(table)