import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
import Path as pt
from Path import EmoDist

bp = Blueprint('pathgenerator', __name__, url_prefix='/pathgenerator')

@bp.route('/', methods=['POST'], strict_slashes=False)
# Function to get the value of the emotions in order to generate the path
def get_emotions_path():
    print(request.get_json())
    if request.method == 'POST':
        if request.json:
            mydata = request.json
            # return the new image of the path
            try:
                pt.EmoDist([mydata["anger"], mydata["fear"], mydata["disgust"], mydata["contempt"], mydata["happiness"], mydata["sadness"], mydata["surprise"]], mydata["date"])
                return "Generated Path"
            except Exception as e:
                print(str(e))
                return str(e)
        else:
            return "no json received"
    return "No post request"
