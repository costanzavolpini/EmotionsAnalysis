import functools
import os
import sys
sys.path.append(os.path.join(os.getcwd(), 'flaskr'))

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)

import database as db

bp = Blueprint('homepage', __name__, url_prefix='/')
"""Root for the homepage."""
@bp.route('/')
def hello_world():
    return render_template('index.html')