HARRY
===============================
Warning
-------------------------------

The project use a json file to load information about french words. As this file isvery big, I couldn't upload it with everything else, so feel free to contact me if you want to kwow more about it.
The source of this file is located here: [INRIA lefff](http://alpage.inria.fr/~sagot/lefff.html)), but I have reformatted it and kept only the relevant part for my project, which could be useful for other people.

Purpose
-------------------------------
Nurse is supposed to offer an interface to communicate with the responsive agent named Harry. All the code of this agent is located in the ia folder.

Nurse is here to help it being presented to the world, being trained, being taught. One day, it won't be necessary anymore and other interfaces will be plugged to Harry; but it will never get forgotten.

Files description
-------------------------------
File - role
*ia/* | Harry's intelligence
*node_modules/* | trivial
*public/* | public ressources for the website (images, javascript...)
*views/* | ejs files to create webpages
*package.json* | trivial
*README.md* | this file
*server.js* | start a web server after all the resources have been initialized. This web server allow interaction with the responsive agent in ia folder
*startmongod.bat* | a simple file to launch mongodb on localhost

