import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)

import database as db

bp = Blueprint('homepage', __name__, url_prefix='/')

@bp.route('/')
def hello_world():
    return render_template('index.html')