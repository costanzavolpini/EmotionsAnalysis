import os

from flask import Flask, Blueprint
import flaskr.database as db
import flaskr.experiment
import flaskr.homepage
import flaskr.pathgenerator
import flaskr.final
"""Main file"""

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    app.debug = False


    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    db.init_app(app)

    # Register blueprint
    app.register_blueprint(homepage.bp)
    app.register_blueprint(pathgenerator.bp)
    app.register_blueprint(experiment.bp)
    app.register_blueprint(pathgenerator.bp)
    app.register_blueprint(final.bp)

    return app