CREATE TABLE experience(
   id     INTEGER  NOT NULL
  ,person INTEGER  NOT NULL
  ,time   VARCHAR(5)
  ,name   VARCHAR(12) NOT NULL
  ,anger  NUMERIC(32,14) NOT NULL
  ,contempt NUMERIC(32,12) NOT NULL
  ,disgust NUMERIC(32,13) NOT NULL
  ,fear   NUMERIC(32,14) NOT NULL
  ,happiness NUMERIC(32,12) NOT NULL
  ,neutral NUMERIC(32,10) NOT NULL
  ,sadness NUMERIC(32,12) NOT NULL
  ,surprise NUMERIC(32,14) NOT NULL,
  PRIMARY KEY (id, person, time)
);
