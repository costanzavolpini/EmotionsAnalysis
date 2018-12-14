# FACE TO FACE
**EPFL | Media & Design Lab | Experience Design** <br>
Project realized in context of the master course CS-489 Experience Design at EPFL (Fall Semester 2018/2019).
<br>
Professor: __Jeffrey **Huang**__ <br>
Assistant: __Immanuel **Koh**__

## Abstract
### __Art is watching you!__
Reverse your perspective: for once the artwork will look at you like you’re a work of art. **The paintings have eyes**. Create your own path following your emotions, making your experience in the museum unique. Be the curator of your own emotions!

We intend to **analyse and record feelings and emotions in visitors** in front of various paintings and investigate the way they look at artworks. The aim is to set a specific path, museum design and succession of depictions based on a precise sequence of feelings that the viewer or even the organiser of the exhibition wants to evoke.

#### Liu Bolin
For our research we have chosen one particular exhibition (Liu Bolin - Le Théâtre des apparences) because his work is not too well known to interfere with the recording of visitors’ impressions and it’s at the same time various (in terms of atmosphere of the work curious for most of the visitors and unconventional).

**Watch our project video on [youtube](https://www.youtube.com/watch?v=DTCL3usNJIY)!**<br><br>
**For the technical report, click [here](https://github.com/costanzavolpini/EmotionsAnalysis/blob/master/graphics-deliverables/technical_report_FACE2FACE.pdf)**<br><br>
**For the final presentation, click [here](https://github.com/costanzavolpini/EmotionsAnalysis/blob/master/graphics-deliverables/FACEtoFACE_presentation.pdf)**<br>
**For the final posters, click [here](https://github.com/costanzavolpini/EmotionsAnalysis/blob/master/graphics-deliverables/A2_posters.pdf)**

## Procedure
We have realized a website in order to record feelings and emotions of a person in front of a random sequence of paintings. We record 4 pictures of the user for every artwork (one every 1.5 seconds) to analyse how feelings evolve in front of it. At the end of the experiment the user is able to put their emotion in front of an artwork in comparison with our previously recorded samples (and at the same time they will improve our dataset). Every artwork is then mapped to a category (happiness, anger... etc.), so we can create an algorithm of how the paintings sequence should be according to the swing of emotions we want to reach. A feeling path is also suggested: it is computed from a set emotion values given by the user which is compared to the emotion values of all of the art pieces. A time value can also be fed to the algorithm to decide what number of artwork will be visited on the path.


## Installation
All the following commands must be executed from the root of the project.
### Setup
Install all the requirements (__requirements.txt__ file) using pip. <br>
```pip install -r requirements.txt``` (Mac and Linux) <br>
```py -m pip install -r requirements.txt``` (Windows)

In case you have problem use:
```python3 -mpip install -r requirements.txt``` (Mac and Linux)

In case you are missing module cv2:
```sudo pip3 install opencv-python```

### Run the server:
```export FLASK_APP=flaskr && export FLASK_ENV=development && flask run``` (Mac and Linux) <br>
```set FLASK_APP=flaskr && set FLASK_ENV=development && flask run``` (Windows)
<!-- To share:
```export FLASK_APP=server.py && export FLASK_ENV=development && flask run --host=0.0.0.0``` -->

### Initialize database
In case you want to initialize the database, delete flaskr.sqlite inside instance folder, and after:
```flask init-db```

### Key Azure
**Important**: The key named __subscription_key__ used in the file __/flaskr/experiment.py__ expired every 7 days. To run the experiment, substitute it with a new one.


## Structure of the code
### Folders:
- **\flaskr** Files related to the frontend and backend of the website. A description of the file is provided inside every one.
- **\instance** Current instance of the database of the website.
- **\graphics-deliverables** Files for the final presentation.
- **\PCA** Containing Jupyther that shows code and result for PCA.
- **\matplotlib** Library matplotlib.

### Flaskr folder:
- **\map** Images used to generated the path.
- **\static** Css, fonts, images, js, scss files
- **\templates** index.html
Backend files for the server (Python) and schema.sql

### Graphics deliverables folder:
- **\images** Images used for the __README.md__
- **\technical_report** Latex technical report
Final A2 posters, midterm presentation, final presentation, dwg and skp files, renderings, technical report.

## Website (Screenshots)
![Homepage](https://github.com/costanzavolpini/emotions-museum.github.io/blob/master/graphics-deliverables/images/homepage.png?raw=true)

![Procedure](https://github.com/costanzavolpini/emotions-museum.github.io/blob/master/graphics-deliverables/images/projectprocedure.png?raw=true)
<br>
It is possible to **analyze the feeling of a person** directly from the website: the button "Try the experiment" opens a modal that will show a sequence of paintings.
<br>
![Experiment](https://github.com/costanzavolpini/emotions-museum.github.io/blob/master/graphics-deliverables/images/experiment1.png?raw=true)
<br>
For each painting the webcamera will capture 4 pictures.
<br>
![Experiment Run](https://github.com/costanzavolpini/emotions-museum.github.io/blob/master/graphics-deliverables/images/experiment2.png?raw=true)
<br>
All the results are then analyzed by **Microsoft Azure**; a chart for each artwork containing his/her emotionsis is then returned to the user.
<br>
![Results](https://github.com/costanzavolpini/emotions-museum.github.io/blob/master/graphics-deliverables/images/results.png?raw=true)
<br>
For each painting we analyse anger, fear, disgust, contempt, happiness, sadness, and surprise.
<br>
Become the curator of yourself, just generating a **feeling path** that best fits your feelings.
<br>
![Path](https://github.com/costanzavolpini/emotions-museum.github.io/blob/master/graphics-deliverables/images/path.png?raw=true)
<br>
In case you are interested in the **collected data**, you can visualize the corresponding charts for each artwork.
<br>
![Chart](https://github.com/costanzavolpini/emotions-museum.github.io/blob/master/graphics-deliverables/images/chart.png?raw=true)

![Team](https://raw.githubusercontent.com/costanzavolpini/emotions-museum.github.io/master/graphics-deliverables/images/team.png)


