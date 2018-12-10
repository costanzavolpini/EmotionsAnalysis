import sqlite3

import click
from flask import current_app, g
from flask.cli import with_appcontext

def generatePaintingsMap():
    paintingsDic = {}
    paintingsDic["101"] = "Chinese fans"
    paintingsDic["102"] = "Chinese fans 4"
    paintingsDic["103"] = "Creeping forward"
    paintingsDic["104"] = "Forklift"
    paintingsDic["105"] = "Head portrait"
    paintingsDic["106"] = "Info port"
    paintingsDic["107"] = "Info wall"
    paintingsDic["108"] = "Learn by figure"
    paintingsDic["109"] = "Monastery"
    paintingsDic["110"] = "New culture need more _"
    paintingsDic["111"] = "Nine-dragon screen"
    paintingsDic["112"] = "Open field of finance"
    paintingsDic["113"] = "Pipes"
    paintingsDic["114"] = "Policier and civilian 2"
    paintingsDic["115"] = "Provisional wall"
    paintingsDic["116"] = "Road block"
    paintingsDic["117"] = "Sawmill"
    paintingsDic["118"] = "Suojia Village 1"
    paintingsDic["119"] = "The inheritance"
    paintingsDic["120"] = "The laid-off workers"
    paintingsDic["121"] = "Unify the thoughts to promote education"
    paintingsDic["122"] = "United struggling"
    paintingsDic["123"] = "Vore registration is in accordance with the law"
    return paintingsDic

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row

    return g.db


def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()


def init_db():
    db = get_db()

    with current_app.open_resource('schema.sql') as f:
        db.executescript(f.read().decode('utf8'))


def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv

def getEmotionsByPerson(person):
    paintings = query_db('select * from experience where person = %s' % (person), one=False)
    return paintings

def getEmotionByPaiting(painting):
    datas = query_db('select * from experience where id = %s' % (painting), one=False)
    return datas


def findIdPerson():
    """Find the maximum id used for a person until now. The person id is used to identify an user."""
    max_person = query_db('select max(person) from experience', one=True)
    if max_person:
        return max_person[0]
    else:
        return -1

def insertEmotion(emotion, person, painting, time):
    """Insert row of emotion into the database."""
    paintingsDic = generatePaintingsMap()
    db = get_db()
    db.commit()
    query = ('INSERT INTO experience (id,person,time,name,anger,contempt,disgust,fear,happiness,neutral,sadness,surprise) VALUES (%s, %s, %s, "%s", %s, %s, %s, %s, %s, %s, %s, %s)' % (painting, person, time, paintingsDic[painting], emotion['anger'], emotion['contempt'], emotion['disgust'], emotion['fear'], emotion['happiness'], emotion['neutral'], emotion['sadness'], emotion['surprise']))
    db.cursor().execute(query)
    db.commit()

@click.command('init-db')
@with_appcontext
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()
    click.echo('Initialized the database.')


def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)