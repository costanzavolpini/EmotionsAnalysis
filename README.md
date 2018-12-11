# FACE TO FACE
**EPFL | Media & Design Lab | Experience Design**
Project realized in context of the master course CS-489 Experience Design at EPFL (Fall Semester 2018/2019).
Professor: Jeffrey Huang <br>
Assistant: Immanuel Koh

# Abstract
## __Art is watching you!__
Reverse your perspective: for once the artwork will look at you like you’re a work of art. **The paintings have eyes**. Create your own path following your emotions, making your experience in the museum unique. Be the curator of your own emotions!

We intend to **analyse and record feelings and emotions in visitors** in front of various paintings and investigate the way they look at artworks. The aim is to set a specific path, museum design and succession of depictions based on a precise sequence of feelings that the viewer or even the organiser of the exhibition wants to evoke.

### Liu Bolin
For our research we have chosen one particular exhibition (Liu Bolin - Le Théâtre des apparences) because his work is not too well known to interfere with the recording of visitors’ impressions and it’s at the same time various (in terms of atmosphere of the work curious for most of the visitors and unconventional.

# Procedure
We have realized a website in order to record feelings and emotions of a person in front of a random sequence of paintings. We record 4 pictures of the user for every artwork (one every 1.5 seconds) to analyse how the feelings evolve in front of it. At the end of the experiment the user is able to compare its emotion in front of an artwork in comparison with our sample recorded before (and at the same time is improving our dataset). Every artwork is then mapped to a category (happiness, anger... etc.) then we can create an algorithm of how the paintings sequence should be according to the swing of emotions we want to reach. A feeling path is also proposed, *SKANDER WRITE SOMETHING HERE!*.

# Website
Describe and put some images!


# Setup
Install all the requirements (__requirements.txt__ file) using pip.
```pip install -r requirements.txt```

# Initialize database
Delete flaskr.sqlite inside instance folder
```flask init-db```

# For Linux and Mac:
```export FLASK_APP=flaskr && export FLASK_ENV=development && flask run```
To share:
```export FLASK_APP=server.py && export FLASK_ENV=development && flask run --host=0.0.0.0```

# For Windows cmd, use set instead of export:
```set FLASK_APP=flaskr && set FLASK_ENV=development && flask run```

# Future improvements
- Improve our sample: analyse more people of different age, sex and cultural background.
- Create a tool to help museum curators to realize the best path for an exhibition.