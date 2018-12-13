import os
import sys
sys.path.append(os.path.join(os.getcwd(), 'flaskr'))

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

#Creates an adjacency matrix of the graph representing the possible positions in the floor from an image.
def makeAdjacency(map1):
    matrix = np.zeros((len(map1),len(map1[0])))
    adjacency = np.zeros((len(map1)*len(map1[0]),len(map1)*len(map1[0])))

    for i in range(0,len(map1)):
        for j in range(0,len(map1[i])):
            matrix[i][j]= int(int(round(map1[i][j][0]/30))*100+int(round(map1[i][j][1]/30))*10+int(round(map1[i][j][2]/30)))

    matLine = np.reshape(matrix, len(map1)*len(map1[i]))

    #Creating edges if both pixels are colored(red)
    for i in range(0,len(adjacency)):
        if(matLine[i] >= 800 and matLine[i] < 870):
            if(i-1 >= 0 and i-1 < len(adjacency) and matLine[i-1] != 888 and matLine[i-1] >= 800 and matLine[i-1] < 870):
                adjacency[i][i-1] = 1
            if(i+1 >= 0 and i+1 < len(adjacency) and matLine[i+1] != 888 and matLine[i+1] >= 800 and matLine[i+1] < 870):
                adjacency[i][i+1] = 1
            if(i-len(map1[0]) >= 0 and i-len(map1[0]) < len(adjacency) and matLine[i-len(map1[0])] != 888 and matLine[i-len(map1[0])] >= 800 and matLine[i-len(map1[0])] < 870):
                adjacency[i][i-len(map1[0])] = 1
            if(i+len(map1[0]) >= 0 and i+len(map1[0]) < len(adjacency) and matLine[i+len(map1[0])] != 888 and matLine[i+len(map1[0])] >= 800 and matLine[i+len(map1[0])] < 870):
                adjacency[i][i+len(map1[0])] = 1

    return adjacency

#Draw the path on a separate image using nodes as control points after computing the shortest paths for every bigram in the points array.
def drawPath(map1, G, points):

    #compute shortest paths for all points
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

    #Draw all bezier curves one by one on the same plot
    for i in range(0,len(path)):

        controlX= np.zeros(len(path[i]))
        controlY= np.zeros(len(path[i]))

        for j in range(0,len(path[i])):
            controlY[j] = len(map1)-path[i][j]/float(len(map1[0]))
            controlX[j] = path[i][j]%len(map1[0])

        nodes = np.asfortranarray([
            controlX,
            controlY,
            ])
        curve = bezier.Curve(nodes, degree=2)
        normalizedCurve = curve.nodes
        normalizedCurve[0] = normalizedCurve[0]/float(len(map1[0]))
        normalizedCurve[1] = normalizedCurve[1]/float(len(map1))

        #color of path
        c0=(255-244)*i/len(path)+244
        c1=(237-160)*i/len(path)+160
        c2= (160-101)*i/len(path)+101

        #curves on same plot
        if (len(normalizedCurve[0])>25):
            ind=[0]
            for k in range(1,len(normalizedCurve[0]-1),2):
                ind.append(k)
            ind.append(len(normalizedCurve[0])-1)
            bezier.Curve(normalizedCurve[:,ind], degree=10).plot(num_pts=256,ax=ax,color=[c0/255.0,c1/255.0,c2/255.0])
        else:
            bezier.Curve(normalizedCurve, degree=10).plot(num_pts=256,ax=ax,color=[c0/255.0,c1/255.0,c2/255.0])

    #Save the image
    plt.axis(xmin=0, ymin=0, xmax=1, ymax=1)
    ax.set_axis_off()
    plt.savefig("./flaskr/map/sPath.jpg",frameon=True,bbox_inches='tight')

#Copies the actual path to the floor plan image
def copyPath(source,target,scale, name):
    mapResize = scipy.misc.imread(target,mode="RGB")
    scaleMap = scipy.misc.imread(scale,mode="RGB")
    bPath = scipy.misc.imread(source,mode="RGB")
    img = Image.fromarray(bPath)

    #Crop to have the correct scale
    img = img.crop([50,21,535,383])
    img= img.resize((len(scaleMap[0]), len(scaleMap)), Image.ANTIALIAS)
    bPath = np.array(img)
    diff1 = len(mapResize) - len(bPath)
    diff2 = len(mapResize[0]) - len(bPath[0])

    #Copy colored pixels
    for i in range(0,len(bPath)):
        for j in range(0,len(bPath[0])):
            if bPath[i][j][0] <= 240 or bPath[i][j][1] < 240 or bPath[i][j][2] <= 240:
                mapResize[i+int(diff1/2)][j+int(diff2/2)] = bPath[i][j]

    #Save the image
    Image.fromarray(mapResize).save("./flaskr/static/images/pathGenerated"+ name +".png")

#Takes an image a set of points and a name to generate a path image for the first floor
def path1(map1,points,name):
    G=nx.from_numpy_matrix(makeAdjacency(map1))
    drawPath(map1, G, points)
    copyPath("./flaskr/map/sPath.jpg","./flaskr/map/prospettometrico.jpg","./flaskr/map/prospettometricoScale.jpg", name)

#Takes an image a set of points and a name to generate a path image for the second floor
def path2(map1,points,name):
    G=nx.from_numpy_matrix(makeAdjacency(map1))
    drawPath(map1, G, points)
    copyPath("./flaskr/map/sPath.jpg","./flaskr/map/Elysee quello vero2-1.jpg","./flaskr/map/prospettometricoScale.jpg", name)


#Creates a path and generates an image with that path from an emotion list,a name and a time specified in minutes.
def EmoDist(emotions, name, time=24):
    emotions = dict({'disgust':emotions[2], 'fear':emotions[1], 'surprise':emotions[6], 'contempt':emotions[3], 'anger':emotions[0], 'neutral':0.0, 'sadness':emotions[5], 'happiness':emotions[4]})
    emotions = [emotions['disgust'],emotions['fear'],emotions['surprise'],emotions['contempt'],emotions['anger'],emotions['neutral'],emotions['sadness'],emotions['happiness']]

    #List of emotions per piece of art
    artifacts = []
    artifacts.append(((35,2),[0.003114284729630245, 0.007223662704549059, 0.0016858212355301396, 0.00016405983059756136, 0.2743962541631626, 0.00566353309158946, 0.03422367038104477, 0.0004200016215656562])) #pipes
    artifacts.append(((31,2),[0.00012897703697416134, 0.00510296691643047, 0.0001199773460572663, 2.488433069414404e-05, 0.09206292427807605, 0.010007219933790284, 0.009125791089037877, 0.00028789832033016954]))#Provisional wall
    artifacts.append(((17,2),[0.00011400650485918195, 0.003035879342086566, 8.692761392059312e-05, 9.022815073132042e-06, 0.09056130400160069, 0.010010791351790184, 0.013181011775144266, 5.89965458788129e-05])) #The laid-off workers
    artifacts.append(((10,2),[0.00039494094722043125, 0.003813840049857659, 0.0005353528584087512, 6.562956063455151e-05, 0.09299896735759215, 0.008872250653976631, 0.10080733634458425, 0.0005493216952992742])) #Open field
    artifacts.append(((10,6),[0.0001332170712530942, 0.003959671054980486, 0.00016437878534052142, 2.574726109818645e-06, 0.16090121120430992, 0.008805519547510911, 0.01561226818000705, 7.331005292956846e-05])) #Unify the though to promote education
    artifacts.append(((10,9),[0.0013366384340327475, 0.003374762483573287, 0.008376778042208226, 1.0467678015131577e-05, 0.16016991848639942, 0.008717597590691004, 0.01706949556713421, 0.0001234468371924055])) #Voter registration is in accordance with the law
    artifacts.append(((3,19),[0.0002277248312173414, 0.004887179194999689, 0.0004230683269912659, 3.3307094809658264e-05, 0.03156273431147314, 0.01041118188314787, 0.04205449033460012, 0.000401154633757011])) #Chinese fan 3
    artifacts.append(((1,21),[0.00012995640441848186, 0.004928511853432146, 9.965140635357493e-05, 1.0543429321124377e-05, 0.08761648411265743, 0.009885145525646689, 0.027314477746480152, 0.0001237212356326476])) #8 Nine-dragon screen
    artifacts.append(((13,10),[0.0007904398415070276, 0.003785395871205486, 0.00160962325065507, 0.0001271850485309911, 0.0011808044530601993, 0.010778500226071843, 0.03609771580177341, 0.0009148706090377585])) #Info port
    artifacts.append(((10,28),[0.00026534782076271423, 0.0013783571892367434, 0.0002601443096180834, 2.8221332934760385e-05, 0.16069696301826938, 0.008823004794171821, 0.016101728670543304, 0.0005000485138653595])) #Monastery
    artifacts.append(((3,24),[0.0005254931411881041, 0.01576551639409468, 0.0008891656677224623, 4.0429269364383834e-05, 0.16502380698728875, 0.00871395761904818, 0.003476757782587364, 0.0003860042282151309])) #Chinese fan 2
    artifacts.append(((12,28),[8.837925915108395e-05, 0.000900672369924867, 6.74465484718821e-05, 0.0006394225845892637, 0.24313385114499908, 0.004814919386131511, 0.001615449507284051, 0.1591745379246612])) #United struggling
    artifacts.append(((16,28),[0.0002187790459378726, 0.00404052099303527, 0.00030168164727408826, 4.335174277635266e-05, 0.011253747762454537, 0.010766070753276031, 0.030310161389324096, 0.0002658887278761197])) #New culture needs more
    artifacts.append(((20,28),[0.0006294003921530854, 0.008177123750881601, 0.0008566795291065945, 6.011103476972694e-05, 0.03175050332282471, 0.010209678314768609, 0.05558529961182932, 0.00028082723062582387])) #Suoja Village 2
    artifacts.append(((10,18),[0.00032339634216078407, 0.0022688156410241803, 8.66772531149977e-05, 0.000542520471947868, 0.20088917874250806, 0.00808716120577495, 0.002568942922216969, 0.0013699506031804988])) #Learn by figure
    artifacts.append(((12,18),[0.0010365218331618276, 0.0061547306796465385, 0.0019479926636554509, 5.887823711650977e-05, 0.0008551434399643391, 0.010026733980972253, 0.0937435020849862, 0.0003280119669134551])) #Head portrait (Mao)
    artifacts.append(((15,18),[0.0007176544359391438, 0.010265866230531193, 0.00039887872704194057, 7.904237803533662e-05, 0.06763117669813654, 0.01027191508168707, 0.009358630764690058, 0.0006994274278279679])) #In front of the party flag
    artifacts.append(((23,27),[0.0006128306017573622, 0.0049729455406594, 0.00035252249984139405, 1.251048794091145e-05, 0.24824385938852808, 0.006812493420220656, 0.006812684272462559, 9.84321382869462e-05])) #Policeman and civilian 2
    artifacts.append(((23,13),[0.0007990148971046627, 0.043609457726377594, 0.07696327326441121, 0.00020885875951047345, 0.2788827443243378, 0.003706377476135806, 0.07872671799634662, 0.0001893254675692762])) #The inheritance
    artifacts.append(((23,10),[0.0006674739781227262, 0.005272919163264571, 0.0007403476083577221, 3.452483035033877e-05, 0.051051232387221875, 0.010491531618969175, 0.013011979469745702, 0.0002672166475115809])) #Info wall
    artifacts.append(((31,7),[0.00018897209835385846, 0.00266282992426137, 0.0005370890742168096, 2.3945594310562733e-05, 0.14451987752915066, 0.007939292214836335, 0.10826755898345426, 0.0004954204363834188])) #Road block
    artifacts.append(((35,7),[0.0011162853296353002, 0.050581803109568425, 0.003069006423308702, 0.00013174733928791199, 0.11446499955656253, 0.008999358768122563, 0.008880214379924393, 0.014535570492488973])) #Forklift
    artifacts.append(((37,4),[0.0013344633928108625, 0.007911085565737136, 0.0009128258544814364, 4.041449371701087e-05, 0.21084661674690958, 0.007530042407755634, 0.02818896177404244, 0.0001416449899177982])) #Creeping forward
    artifacts.append(((23,8),[0.04187541986335259, 0.023252405962820414, 0.11717118043846948, 1.2842411336686253e-05, 0.1588496652609483, 0.006846345649447813, 0.0039012485368033426, 0.00021692283735472729])) #Temple of heaven
    artifacts.append(((17,8),[0.07065846643728874, 0.01267089529392658, 0.0010670832619953444, 5.8010688873058316e-05, 0.0031724010752331613, 0.00969145206430973, 0.02638650636149576, 0.03098898308571982])) #Birds nest
    artifacts.append(((9,7),[0.021003076108598973, 0.012721854124695887, 0.027468231819558552, 0.0059612575469558116, 0.016715095389085968, 0.009609302814209022, 0.052367450441550376, 0.02221615382357876])) #Green food
    artifacts.append(((4,15),[0.0003547102375113603, 0.021051207902707873, 0.0005628519087429023, 0.0005505467843534943, 0.046729357045156024, 0.009898279334781697, 0.005715799309244038, 0.052116674078804825])) #Supermarket 3
    artifacts.append(((2,20),[9.466688392324107e-05, 0.0031073926867845048, 0.00036059071959343225, 8.068081127336966e-05, 0.00802825176612624, 0.01066878160438496, 0.04238897109308215, 0.0006502214984220622])) #Your world
    artifacts.append(((4,25),[0.0012512697974304302, 0.00688010188271811, 0.002233903669253172, 0.00013161288294019763, 0.2512529168310824, 0.006419514747471504, 0.031102161594006954, 0.0006411937178419419])) #Mobile phones
    artifacts.append(((9,33),[0.00021688705917726958, 0.00408569629493654, 0.00018991855497670675, 8.480116619820605e-06, 0.2255829563099503, 0.007493966246511477, 0.0015160742421529956, 0.0001084119553886432])) #Panda
    artifacts.append(((15,26),[0.0010181255910470225, 0.010858235557177591, 0.0013202163279714269, 0.00042629463947695725, 0.23443379145302512, 0.007094055827494767, 0.004719139602344632, 0.004699774458188805])) #Screen in rest
    artifacts.append(((17,33),[0.00015808596563845632, 0.02006842025171744, 9.86279701872203e-05, 1.5109175949306784e-06, 0.07906909736344496, 0.010092717030325759, 0.003651107641862784, 3.819321794955264e-05])) #Into the woods
    artifacts.append(((20,29),[0.00037158388400679006, 0.007296854855327585, 0.00017320210435313666, 5.538060593921612e-06, 0.19147703496437057, 0.008277446372738568, 0.0014968203279242004, 7.922664221193755e-05])) #Cancer village
    artifacts.append(((23,33),[0.007364901319878112, 0.004889895728076491, 0.010447716072431088, 0.001233874898477945, 0.0723380491513972, 0.009487803596780977, 0.052268692287376024, 0.01395572502815311])) #The great wall
    artifacts.append(((15,16),[0.00011589086459607323, 0.0012106328060325225, 0.0004498447591928208, 8.561787946468424e-06, 0.24865988342134923, 0.006902473200818978, 0.0006024878165213847, 0.00013281043960142126])) #Water crisis
    artifacts.append(((30,26),[0.020669587430652083, 0.006627560860320249, 0.006430877661852104, 8.987867818554116e-06, 0.022662838830229827, 0.010548476890667641, 0.012258295055558548, 0.0003391770258139032])) #Cooperate with rero
    artifacts.append(((20,12),[0.00037744630891234056, 0.017144744781651518, 0.00039012041433358625, 0.00012659930795340477, 0.16457632565180444, 0.008674815582133698, 0.006449437883311316, 0.00140610500335182])) #Forest 2
    #First floor artifacts
    artifacts1 = artifacts[:23]
    #Second floor artifacts
    artifacts2 = artifacts[23:]

    #Load floor images
    map1 = scipy.misc.imread("./flaskr/map/pixel_floor1.jpg")
    map2 = scipy.misc.imread("./flaskr/map/pixel_floor2.jpg")
    #Generate graph
    G1=nx.from_numpy_matrix(makeAdjacency(map1))
    #G2=nx.from_numpy_matrix(makeAdjacency(map2))
    distances1 = [] #0 is the entrance
    distances2 = [] #1 first artifact
    #Entrance pointe in floors 1 and 2
    entrance1 = (25,21)
    entrance2 = (40,20)

    #Computes the distance between all pairs of points in artifacts using G as the graph and an entrance point
    def computeDistance(map1, artifacts, G, entrance):
        distances = []
        distance = []
        #entrance
        for i in artifacts:
            distance.append(1.0/nx.shortest_path_length(G,entrance[0]*len(map1[0])+entrance[1],i[0][0]*len(map1[0])+i[0][1]))
        distance = np.array(distance)/max(distance)
        distances.append(distance)

        for i in range(0,len(artifacts)):
            distance = []
            for j in range(0,len(artifacts)):
                if(i!=j):
                    distance.append(1.0/nx.shortest_path_length(G,artifacts[i][0][0]*len(map1[0])+artifacts[i][0][1],artifacts[j][0][0]*len(map1[0])+artifacts[j][0][1]))
                else:
                    distance.append(-1)
            distance = np.array(distance)/max(distance)
            distances.append(distance)

        return distances

    #Compute the distances
    distances1 = computeDistance(map1,artifacts1,G1,entrance1)
    #distances2 = computeDistance(map2,artifacts2,G2,entrance2)

    #Create a list of emotion_scores for each artifact in the first floor
    emo_score1 = []
    for i in artifacts1:
        emo_score1.append(np.dot(np.array(emotions),np.array(i[1])))

    emo_score2 = []
    #for i in artifacts2:
    #    emo_score2.append(np.dot(np.array(emotions),np.array(i[1])))

    #Finds the next hop by computing as score for every non-visited point by combining the distance and the similarity of both emotion scores.
    def findNextHop(distance, emo_score, current, visited):
        final_score = np.array((distance)*np.array(emo_score))
        final_indices = np.argsort(-final_score)
        i=0
        while(final_indices[i] in visited or final_indices[i]==current):
            i+=1

        return final_indices[i]

    #Final set of visited points in order
    final_indices1 = []
    #Maximum number of hops using the time parameter
    max_hops = min(int(np.ceil(time/2.0)),23)

    current=-1
    #Compute all the points in the path
    for i in range(max_hops):
        nextHop = findNextHop(distances1[current+1],emo_score1,current,final_indices1)
        final_indices1.append(nextHop)
        current = nextHop

    #final_indices2 = []
    #current=-1
    #for i in range(max_hops):
    #    nextHop = findNextHop(distances2[current+1],emo_score2,current,final_indices2)
    #    final_indices2.append(nextHop)
    #    current = nextHop

    #Add the entrance
    pointsFinal1 = [entrance1]
    #pointsFinal2 = [entrance2]

    #Get back the coordinates of each index
    for i in final_indices1:
        if(i<len(artifacts1)):
            pointsFinal1.append(artifacts1[i][0])
    #Add the exit
    pointsFinal1.append(entrance1)

    #for i in final_indices2:
    #    if(i<len(artifacts2)):
    #        pointsFinal2.append(artifacts2[i][0])
    #pointsFinal2.append(entrance2)

    #Generate the path
    path1(map1,pointsFinal1, name)
