import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)

import Path

bp = Blueprint('pathGenerator', __name__, url_prefix='/path')


@bp.route('/', methods=['GET', 'POST'])
# Function to get the value of the emotions in order to generate the path
def get_emotions_path():
    # app.logger.debug("JSON received...")
    # app.logger.debug(request.get_json(force=True))

    if request.json:
        mydata = request.json
        # return the new image of the path
        Path.EmoDist([mydata["anger"], mydata["fear"], mydata["disgust"], mydata["contempt"], mydata["happiness"], mydata["sadness"], mydata["surprise"]], mydata["date"])
        return "Thanks. Your Surprise value is %s" % mydata.get("surprise")
    else:
        return "no json received"