import os

from flask import Flask, Blueprint
import database as db
import experiment
import homepage
import pathGenerator

# Initialize database
# flask init-db

# For Linux and Mac:
# export FLASK_APP=flaskr && export FLASK_ENV=development && flask run

# For Windows cmd, use set instead of export:
# set FLASK_APP=flaskr && set FLASK_ENV=development && flask run


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

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    db.init_app(app)

    app.register_blueprint(homepage.bp)
    app.register_blueprint(experiment.bp)
    app.register_blueprint(pathGenerator.bp)


    # # a simple page that says hello
    # @app.route('/')
    # def main():
    #     # db.init_app(app)
    #     cur = db.get_db().cursor()
    #     return render_template('index.html')

    return app