import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify
)
import os

import database as db

# Azure
import requests
import matplotlib.pyplot as plt
import json
from PIL import Image
from io import BytesIO

bp = Blueprint('final', __name__, url_prefix='/final')
"""File to handle all the final results obtained running the experiment.
1. read_from_folder : insert into the database data related to old experiment runned in the past, uploading all the images of a folder.
2. get_person_results: return all the information related to a person such as all his/her emotion in front of a painting, the evolution of the emotion and so on."""

# Setup azure
subscription_key = "1906a065079e4402b155f4256ed451b3"

assert subscription_key

emotion_recognition_url = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect"

@bp.route('/person', methods=['GET'])
def get_person_results():
    print("EHIEHI")
    """Function to get all the data related to a person. Return a json {time: {<all the data untouched>}, average: {<all the data averaged for each painting>}}
    Example of use: http://localhost:5000/final/person?p=<id of the person>"""
    person = request.args.get('p')
    paintings = db.getEmotionsByPerson(person)
    results = {'time' : {}, 'average': {}}

    # add results without averaging and touching anything
    for p in paintings:
        identifier = str(p[0]) + "-" + str(p[2])
        results['time'][identifier] = {'id': p[0], 'person': p[1], 'time': p[2], 'name': p[3], 'anger': p[4], 'contempt': p[5], 'disgust': p[6], 'fear': p[7], 'happiness': p[8], 'neutral': p[9], 'sadness': p[10], 'surprise': p[11]}

    emotions = ['anger', 'contempt', 'disgust', 'fear', 'happiness', 'neutral', 'sadness', 'surprise']
    # add results averaging all
    for paint in paintings:
        pain_id = paint[0]

        if pain_id not in paintings:
            results['average'][pain_id] = {"person": paint[1], "time": 0, "name": paint[3], "anger": 0, "contempt": 0, "disgust": 0, "fear": 0, "happiness": 0, "neutral": 0, "sadness": 0, "surprise": 0}

        results['average'][pain_id]['time'] += 1
        t = results['average'][pain_id]['time']
        for i, emotion in enumerate(emotions):
            results['average'][pain_id][emotion] = ((results['average'][pain_id][emotion]*(t-1))/t) + (paint[i+4]/t)

    return jsonify(results)


@bp.route('/upload', methods=['GET'])
def read_from_folder():
    """Function to analyze all photos inside a folder. All the results are added automatically to the database.
    Example of use: http://localhost:5000/final/upload?folder=<name of the folder>"""
    dirname = request.args.get('folder')

    sequence = ["101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115", "116", "117", "118", "119", "120", "121", "122", "123"]
    f = open("flaskr/static/experiments/%s/log.txt" % (dirname),"w+")
    person = int(db.findIdPerson()) + 1
    for el in sequence:
        for index in range(1, 5):
            name_frame = 'flaskr/static/experiments/%s/%s-%s.jpg' % (dirname, el, str(index))
            image_url = "./" + name_frame
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
    f.close()
    return str(person)
