import scipy.misc
import numpy as np
import networkx as nx
import bezier
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from PIL import Image
from resizeimage import resizeimage
import random

def makeAdjacency(map1):
    matrix = np.zeros((len(map1),len(map1[0])))
    adjacency = np.zeros((len(map1)*len(map1[0]),len(map1)*len(map1[0])))

    for i in range(0,len(map1)):
        for j in range(0,len(map1[i])):
            matrix[i][j]= int(int(round(map1[i][j][0]/30))*100+int(round(map1[i][j][1]/30))*10+int(round(map1[i][j][2]/30)))

    matLine = np.reshape(matrix, len(map1)*len(map1[i]))

    for i in range(0,len(adjacency)):
        #i_1 = (i-i%116)/116
        #i_2 = i%116
        if(matLine[i] >= 800 and matLine[i] < 870):
            if(i-1 >= 0 and i-1 < len(adjacency) and matLine[i-1] != 888 and matLine[i-1] >= 800 and matLine[i-1] < 870):
                adjacency[i][i-1] = 1
            if(i+1 >= 0 and i+1 < len(adjacency) and matLine[i+1] != 888 and matLine[i+1] >= 800 and matLine[i+1] < 870):
                adjacency[i][i+1] = 1
            if(i-len(map1[0]) >= 0 and i-len(map1[0]) < len(adjacency) and matLine[i-len(map1[0])] != 888 and matLine[i-len(map1[0])] >= 800 and matLine[i-len(map1[0])] < 870):
                adjacency[i][i-len(map1[0])] = 1
            if(i+len(map1[0]) >= 0 and i+len(map1[0]) < len(adjacency) and matLine[i+len(map1[0])] != 888 and matLine[i+len(map1[0])] >= 800 and matLine[i+len(map1[0])] < 870):
                adjacency[i][i+len(map1[0])] = 1
            #if(i-len(map1)+1 >= 0 and i-len(map1[0])+1 < len(adjacency) and matLine[i-len(map1[0])+1] != 888 and matLine[i-len(map1[0])+1] >= 800 and matLine[i-len(map1[0])+1] < 870):
            #    adjacency[i][i-len(map1[0])+1] = 1
            #if(i+len(map1[0])+1 >= 0 and i+len(map1[0])+1 < len(adjacency) and matLine[i+len(map1[0])+1] != 888 and matLine[i+len(map1[0])+1] >= 800 and matLine[i+len(map1[0])+1] < 870):
            #    adjacency[i][i+len(map1[0])+1] = 1
            #if(i-len(map1[0])-1 >= 0 and i-len(map1[0])-1 < len(adjacency) and matLine[i-len(map1[0])-1] != 888 and matLine[i-len(map1[0])-1] >= 800 and matLine[i-len(map1[0])-1] < 870):
            #    adjacency[i][i-len(map1[0])-1] = 1
            #if(i+len(map1[0])-1 >= 0 and i+len(map1[0])-1 < len(adjacency) and matLine[i+len(map1[0])-1] != 888 and matLine[i+len(map1[0])-1] >= 800 and matLine[i+len(map1[0])-1] < 870):
            #    adjacency[i][i+len(map1[0])-1] = 1

    return adjacency

def drawPath(map1, G, points):
    path = []
    for i in range(0,len(points)-1):
        path.append(nx.shortest_path(G,source=len(map1[0])*points[i][0]+points[i][1],target=len(map1[0])*points[i+1][0]+points[i+1][1]))


    paths_draw=[]
    for i in range(0,len(path)):
        paths_draw.append(np.reshape(map1[:,:,0], (len(map1)*len(map1[1]))))
        paths_draw[i][path[i]] = 150
        paths_draw[i] = np.reshape(paths_draw[i], (len(map1),len(map1[1])))

    plt.ioff()
    plt.figure(figsize=(10,10))
    nodes = np.asfortranarray([
        [0.0],
        [0.0],
    ])

    curve = bezier.Curve(nodes, degree=2)
    ax =  curve.plot(num_pts=256)

    for i in range(0,len(path)):

        controlX= np.zeros(len(path[i]))
        controlY= np.zeros(len(path[i]))

        for j in range(0,len(path[i])):
            controlY[j] = len(map1)-path[i][j]/len(map1[0])
            controlX[j] = path[i][j]%len(map1[0])

        nodes = np.asfortranarray([
            controlX,
            controlY,
            ])
        curve = bezier.Curve(nodes, degree=2)
        normalizedCurve = curve.nodes
        normalizedCurve[0] = normalizedCurve[0]/len(map1[0])
        normalizedCurve[1] = normalizedCurve[1]/len(map1)

        #curves on same plot
        bezier.Curve(normalizedCurve, degree=10).plot(num_pts=256,ax=ax)

    plt.axis(xmin=0, ymin=0, xmax=1, ymax=1)
    #ax.set_axis_off()
    plt.savefig("sexyPath.jpg",frameon=True,bbox_inches='tight')

def copyPath(source,target):
    mapResize = scipy.misc.imread(target,mode="RGB")
    bPath = scipy.misc.imread(source,mode="RGB")
    img = Image.fromarray(bPath)
    img = img.crop([55,21,535,383])
    img= img.resize((len(mapResize[0]), len(mapResize)), Image.ANTIALIAS)
    bPath = np.array(img)
    for i in range(0,len(bPath)):
        for j in range(0,len(bPath[0])):
            if bPath[i][j][0] <= 200 or bPath[i][j][1] < 200 or bPath[i][j][2] <= 200:
                mapResize[i][j] = bPath[i][j]
    Image.fromarray(mapResize).show()
    # Image.fromarray(mapResize).save("path.png")
    Image.fromarray(mapResize).save("./flaskr/static/images/path.png")

def path1(map1,points):
    G=nx.from_numpy_matrix(makeAdjacency(map1))
    drawPath(map1, G, points)
    copyPath("./flaskr/sexyPath.jpg","./flaskr/map/Elysee quello vero-Model-1.jpg")

def path2(map1,points):
    G=nx.from_numpy_matrix(makeAdjacency(map1))
    drawPath(map1, G, points)
    copyPath("./flaskr/sexyPath.jpg","./flaskr/map/Elysee quello vero2-1.jpg")

def randomEmo(seed=None):
    random.seed(seed)
    return [random.random(),random.random(),random.random(),random.random(),random.random(),random.random(),random.random(),random.random()]

#Create distance and emotion arrays for each floor

def EmoDist(emotions):
    emotions = dict({'disgust':emotions[2], 'fear':emotions[1], 'surprise':emotions[6], 'contempt':emotions[3], 'anger':emotions[0], 'neutral':0.0, 'sadness':emotions[5], 'happiness':emotions[4]})
    emotions = [emotions['disgust'],emotions['fear'],emotions['surprise'],emotions['contempt'],emotions['anger'],emotions['neutral'],emotions['sadness'],emotions['happiness']]

    artifacts = []
    artifacts.append(((32,2),[0,0,0,0,0,0,0,0])) #pipes
    artifacts.append(((28,2),[0,0,0,0,0,0,0,0]))#Provisional wall
    artifacts.append(((17,2),[0,0,0,0,0,0,0,0])) #The laid-off workers
    artifacts.append(((10,4),[0,0,0,0,0,0,0,0])) #Open field
    artifacts.append(((10,8),[0,0,0,0,0,0,0,0])) #Unify the though to promote education
    artifacts.append(((10,12),[0,0,0,0,0,0,0,0])) #Voter registration is in accordance with the law
    artifacts.append(((5,19),[0,0,0,0,0,0,0,0])) #Chinese fan 3
    artifacts.append(((2,21),[0,1,0,0,0,0,0,0])) #8 Nine-dragon screen
    artifacts.append(((13,14),[0,1,0,0,0,0,0,0])) #Info port
    artifacts.append(((10,25),[0,1,0,0,0,0,0,0])) #Monastery
    artifacts.append(((5,24),[0,1,0,0,0,0,0,0])) #Chinese fan 2
    artifacts.append(((12,27),[0,1,0,0,0,0,0,0])) #United struggling
    artifacts.append(((16,27),[0,1,0,0,0,0,0,0])) #New culture needs more
    artifacts.append(((20,27),[0,1,0,0,0,0,0,0])) #Suoja Village 2
    artifacts.append(((10,18),[0,1,0,0,0,0,0,0])) #Learn by figure
    artifacts.append(((12,18),[0,1,0,0,0,0,0,0])) #Head portrait (Mao)
    artifacts.append(((15,18),[0,1,0,0,0,0,0,0])) #In front of the party flag
    artifacts.append(((23,25),[0,1,0,0,0,0,0,0])) #Policeman and civilian 2
    artifacts.append(((23,13),[0,0,0,0,0,0,0,0])) #The inheritance
    artifacts.append(((23,8),[0,0,0,0,0,0,0,0])) #Info wall
    artifacts.append(((28,7),[0,0,0,0,0,0,0,0])) #Road block
    artifacts.append(((32,7),[0,0,0,0,0,0,0,0])) #Forklift
    artifacts.append(((35,4),[0,0,0,0,0,0,0,0])) #Creeping forward
    artifacts.append(((23,8),[0,0,0,0,0,0,0,0])) #Temple of heaven
    artifacts.append(((17,8),[0,0,0,0,0,0,0,0])) #Birds nest
    artifacts.append(((9,7),[0,0,0,0,0,0,0,0])) #Green food
    artifacts.append(((4,15),[0,0,1,0,0,0,0,0])) #Supermarket 3
    artifacts.append(((2,20),[0,0,1,0,0,0,0,0])) #Your world
    artifacts.append(((4,25),[0,0,1,0,0,0,0,0])) #Mobile phones
    artifacts.append(((9,33),[0,0,1,0,0,0,0,0])) #Panda
    artifacts.append(((15,26),[0,0,1,0,0,0,0,0])) #Screen in rest
    artifacts.append(((17,33),[0,0,1,0,0,0,0,0])) #Into the woods
    artifacts.append(((20,29),[0,0,1,0,0,0,0,0])) #Cancer village
    artifacts.append(((23,33),[0,0,1,0,0,0,0,0])) #The great wall
    artifacts.append(((15,16),[0,0,1,0,0,0,0,0])) #Water crisis
    artifacts.append(((30,26),[0,0,0,0,0,0,0,0])) #Cooperate with rero
    artifacts.append(((20,12),[0,0,0,0,0,0,0,0])) #Forest 2
    artifacts1 = artifacts[:23]
    artifacts2 = artifacts[23:]

    map1 = scipy.misc.imread("./flaskr/map/pixel_floor1.jpg")
    map2 = scipy.misc.imread("./flaskr/map/pixel_floor2.jpg")
    G1=nx.from_numpy_matrix(makeAdjacency(map1))
    G2=nx.from_numpy_matrix(makeAdjacency(map2))
    distances1 = [] #0 is the entrance
    distances2 = [] #1 first artifact
    entrance1 = (25,21)
    entrance2 = (40,20)

    def computeDistance(map1, artifacts, G, entrance):
        distances = []
        distance = []
        #entrance
        for i in artifacts:
            distance.append(1/nx.shortest_path_length(G,entrance[0]*len(map1[0])+entrance[1],i[0][0]*len(map1[0])+i[0][1]))
        distance = np.array(distance)/max(distance)
        distances.append(distance)

        for i in range(0,len(artifacts)):
            distance = []
            for j in range(0,len(artifacts)):
                if(i!=j):
                    distance.append(1/nx.shortest_path_length(G,artifacts[i][0][0]*len(map1[0])+artifacts[i][0][1],artifacts[j][0][0]*len(map1[0])+artifacts[j][0][1]))
                else:
                    distance.append(-1)
            distance = np.array(distance)/max(distance)
            distances.append(distance)

        return distances

    distances1 = computeDistance(map1,artifacts1,G1,entrance1)
    distances2 = computeDistance(map2,artifacts2,G2,entrance2)

    emo_score1 = []
    for i in artifacts1:
        emo_score1.append(np.dot(np.array(emotions),np.array(i[1])))

    emo_score2 = []
    for i in artifacts2:
        emo_score2.append(np.dot(np.array(emotions),np.array(i[1])))


    def findNextHop(distance, emo_score, current, visited):
        final_score = np.array((distance)*np.array(emo_score))
        final_indices = np.argsort(-final_score)
        i=0
        while(final_indices[i] in visited or final_indices[i]==current):
            i+=1

        return final_indices[i]

    final_indices1 = []
    max_hops = 8

    current=-1
    for i in range(max_hops):
        nextHop = findNextHop(distances1[current+1],emo_score1,current,final_indices1)
        final_indices1.append(nextHop)
        current = nextHop

    final_indices2 = []
    current=-1
    for i in range(max_hops):
        nextHop = findNextHop(distances2[current+1],emo_score2,current,final_indices2)
        final_indices2.append(nextHop)
        current = nextHop

    pointsFinal1 = [entrance1]
    pointsFinal2 = [entrance2]

    for i in final_indices1:
        if(i<len(artifacts1)):
            pointsFinal1.append(artifacts1[i][0])
    pointsFinal1.append(entrance1)

    for i in final_indices2:
        if(i<len(artifacts2)):
            pointsFinal2.append(artifacts2[i][0])
    pointsFinal2.append(entrance2)
    path1(map1,pointsFinal1)
# EmoDist([.2,.0,.0,.0,.0,.0,.0])
#EmoDist([.0,.3,.0,.0,.0,.0,.0])
#EmoDist([.2,.3,.0,.0,.0,.0,.0])
