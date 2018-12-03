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
INSERT INTO experience(id,person,time,name,anger,contempt,disgust,fear,happiness,neutral,sadness,surprise) VALUES (101,0,NULL,'Chinese fans',1.907199e-11,3.90811e-12,1.13893242e-10,4.20374e-14,1,5.548324e-10,1.76978265e-10,9.196895e-12);
INSERT INTO experience(id,person,time,name,anger,contempt,disgust,fear,happiness,neutral,sadness,surprise) VALUES (101,1,NULL,'Chinese fans',0.0000342313579,0.008032377,0.0000244957046,0.00000117248157,0.02203092,0.9637915,0.006058844,0.0000264721821);
INSERT INTO experience(id,person,time,name,anger,contempt,disgust,fear,happiness,neutral,sadness,surprise) VALUES (101,2,NULL,'Chinese fans',2.9392416e-7,0.000105862411,9.324011e-8,4.25794466e-9,0.000030717827,0.9998108,0.000048978276,0.00000326401187);
INSERT INTO experience(id,person,time,name,anger,contempt,disgust,fear,happiness,neutral,sadness,surprise) VALUES (101,3,NULL,'Chinese fans',0.00000511267854,0.008225651,0.00000519775,4.77131756e-9,0.0006666175,0.990933,0.000163000281,0.00000140547854);
INSERT INTO experience(id,person,time,name,anger,contempt,disgust,fear,happiness,neutral,sadness,surprise) VALUES (101,4,NULL,'Chinese fans',0.002245707,0.0545209534,0.00384021015,0.0001744583,0.0252681579,0.9033566,0.008946809,0.00164706388);
