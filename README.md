# PlanetariumWebEditor
Web editor to create dynamic full domes


Things to create:
 - Editor
    - Edit in 3D? Edit on an equidistant projection? 
 - Visualizer
    - 3D visualizer to show what dome will look like? (Sounds difficult) (three.js?)
 - Exporter
    - Export to DM control page? (Easy now, not in future)
    - Export as file for media viewer webpage (Less dynamic, needs dm integration, future proof)
 - Save/Load
    - Save as a scene? Save as a JSON? Save as a Video?
 - Viewer
    - To display on dome through stream pc
    - But only if we export project as a file

Features of the editor:
 - Videos
 - Images
 - Animation with keyframes
 - Opacity
 - Text
 - Transitions




==== Editor ====
Drag and drop items.
Create divs that correspond to the center of every object, move div -> object follows
Either scale and rotation with sliders or with draggables
Media library?
Store a dictionary of all the objects
Every frame draw all the objects in de dictionary
Object selector on the side like in photoshop?
Do we need the possibility of different scenes? Probably
Visually should look like the powerpoint program

== Powerpoint "clone" idea: ==
Visually should be similar to power point, so it is intuitive to users
Hierarchy:
   -Presentation-
   contains n slides
   -Slide-
   contains m elements
   -Element-
   video, image, etc. Every element has a set amount of attributes
   -Attribute-
   Some parameter in some data structure that tells us something about the element



==== Backend ====
How do we store objects?

Object XXX DEPRECATED SEE UML DIAGRAM XXX
 - Name
 - id
 - datatype
 - center (phi, theta)
 - scale (s)
 - rotation (alpha)
 - opacity
 - layer priority
 - time alive counter (That the keyframes will use)
But how do we deal with changing objects with keyframes?



==== Data types ====
 - videos
 - images
 - text
 - particle effect (?)


==== Animation ====
How do we change objects on cue
We need some sort of timeline
We need a "next button" (That responds to a clicker)


==== Exporting ====
How do we store the file?
How do we handle file sizes of 4k videos?


==== Visualizer ==== (stretch goal)
We need a visualizer to show the user what their design looks like in 3d


==== Viewer ====
How do we display the final product?
Just upload the file to a seperate webpage that will display it
