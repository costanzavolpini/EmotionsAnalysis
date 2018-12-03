import sqlite3

import click
from flask import current_app, g
from flask.cli import with_appcontext


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

    db.cursor().execute("INSERT INTO experience(id,person,time,name,anger,contempt,disgust,fear,happiness,neutral,sadness,surprise) VALUES (101,0,NULL,'Chinese fans',1.907199e-11,3.90811e-12,1.13893242e-10,4.20374e-14,1,5.548324e-10,1.76978265e-10,9.196895e-12);")
    db.commit()
    db.cursor().execute("INSERT INTO experience(id,person,time,name,anger,contempt,disgust,fear,happiness,neutral,sadness,surprise) VALUES (101,1,NULL,'Chinese fans',0.0000342313579,0.008032377,0.0000244957046,0.00000117248157,0.02203092,0.9637915,0.006058844,0.0000264721821);")
    db.commit()
    db.cursor().execute("INSERT INTO experience(id,person,time,name,anger,contempt,disgust,fear,happiness,neutral,sadness,surprise) VALUES (101,2,NULL,'Chinese fans',2.9392416e-7,0.000105862411,9.324011e-8,4.25794466e-9,0.000030717827,0.9998108,0.000048978276,0.00000326401187);")
    db.commit()
    db.cursor().execute("INSERT INTO experience(id,person,time,name,anger,contempt,disgust,fear,happiness,neutral,sadness,surprise) VALUES (101,3,NULL,'Chinese fans',0.00000511267854,0.008225651,0.00000519775,4.77131756e-9,0.0006666175,0.990933,0.000163000281,0.00000140547854);")
    db.commit()
    db.cursor().execute("INSERT INTO experience(id,person,time,name,anger,contempt,disgust,fear,happiness,neutral,sadness,surprise) VALUES (101,4,NULL,'Chinese fans',0.002245707,0.0545209534,0.00384021015,0.0001744583,0.0252681579,0.9033566,0.008946809,0.00164706388);")
    db.commit()


def findIdPerson():
    table = get_db().cursor()
    # c.execute("
    # INSERT INTO transactions(Item, Shack, Paym_Reference, Amount) VALUES (%s,%s,%s,%s)", (Item, Shack, Paym_Reference, Amount))
    # c = table.execute('SELECT MAX(person) FROM experience')
    c = table.execute('SELECT person FROM experience')
    person = c.fetchall()
    print(person)
    return "ehheh"
    # query = 'SELECT %s, MAX(name) as name FROM %s' % (
    #     idPainting,
    #     get_db()
    # )
    # cur.execute(query, values)
    # g.db.commit()
    # id = cur.lastrowid
    # print(id)
    # cur.close()
    # return id



@click.command('init-db')
@with_appcontext
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()
    click.echo('Initialized the database.')


def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)

# import sqlite3

# import click
# from flask import current_app, g
# from flask.cli import with_appcontext

# # sqlite3 ./tmp/experience.db < schema.sql from terminal
# DATABASE = '/tmp/experience.db'

# def get_db():
#     if 'db' not in g:
#         print(current_app.config)
#         g.db = sqlite3.connect(
#             # current_app.config['DATABASE'],
#             DATABASE,
#             detect_types=sqlite3.PARSE_DECLTYPES
#         )
#         g.db.row_factory = sqlite3.Row
#     return g.db


# def close_db(e=None):
#     db = g.pop('db', None)

#     if db is not None:
#         db.close()

# def query_db(query, args=(), one=False):
#     cur = get_db().execute(query, args)
#     rv = cur.fetchall()
#     cur.close()
#     return (rv[0] if rv else None) if one else rv


# def init_db():
#     db = get_db()

#     with current_app.open_resource('schema.sql', mode='r') as f:
#         print("################################ehhheheh################################\n################################ehhheheh################################\n################################ehhheheh################################\n################################ehhheheh################################\n")
#         db.executescript(f.read().decode('utf8'))
#         # db.cursor().executescript(f.read())
#     # db.commit()





# def insert(fields=(), values=()):
#     table = get_db()
#     print(table)
#     cur = table.cursor()
#     # Example:
#     #
# INSERT INTO mytable(id,person,time,name,anger,contempt,disgust,fear,happiness,neutral,sadness,surprise) VALUES (101,0,NULL,'Chinese fans',1.907199e-11,3.90811e-12,1.13893242e-10,4.20374e-14,1,5.548324e-10,1.76978265e-10,9.196895e-12);
#     query = '
# INSERT INTO %s (%s) VALUES (%s)' % (
#         table,
#         ', '.join(fields),
#         ', '.join(['?'] * len(values))
#     )
#     cur.execute(query, values)
#     g.db.commit()
#     id = cur.lastrowid
#     cur.close()
#     return id

# def findIdPerson():
#     table = get_db().cursor()
#     # c.execute("
# INSERT INTO transactions(Item, Shack, Paym_Reference, Amount) VALUES (%s,%s,%s,%s)", (Item, Shack, Paym_Reference, Amount))
#     # c = table.execute('SELECT MAX(person) FROM experience')
#     c = table.execute('SELECT person FROM experience')
#     person = c.fetchall()
#     print(person)
#     return "ehheh"
#     # query = 'SELECT %s, MAX(name) as name FROM %s' % (
#     #     idPainting,
#     #     get_db()
#     # )
#     # cur.execute(query, values)
#     # g.db.commit()
#     # id = cur.lastrowid
#     # print(id)
#     # cur.close()
#     # return id


# # @app.cli.command('initdb')

# @click.command('init-db')
# @with_appcontext
# def init_db_command():
#     """Clear the existing data and create new tables."""
#     init_db()
#     print('Initialized the database!')

# def init_app(app):
#     app.teardown_appcontext(close_db)
#     app.cli.add_command(init_db_command)