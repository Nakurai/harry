HARRY
===============================

Purpose
-------------------------------
Harry is a learning and responsive agent. The goal is to get him to understand what things are and to react accordingly, given a list of actions.

Consider it as a baby !! On the opposite of all the ways to go today, it will be taught step by step, hopefully not by myself alone but with the good will of all the community.

It's also the first open-source and free french semantic engine. It's very difficult to find up-to-date and reusable resources for this purpose in french (at least it has been difficult for me), and I think it would be cool if it was something everyone shoud be able to put in place and use easily. 
The idea is to be able to add languages afterwards, but the primary focus is to manage french.

All the semantic concepts are linked as soon as possible to already existing semantic definitions, for example on [schema.org](http://schema.org) or on [wordnet](https://wordnet.princeton.edu/). On the other hand, none are fully compatible with Harry, so I prefer starting over.


Roadmap
-------------------------------
Syntax
[x] Load the french lexicon from the txt file 
[x] Save the french lexicon in a readable and reusable format 
[x] Create a simple web interface to query the vocabulary
[x] From some sentences as input, split and get words information from the french dictionary
[] Add other dictionaries: (proper names ?, words not found, slang words, emoticons...)
    [] first names
    [] emoticons
Grammar
[] Split the sentence before/after the first verb
[] According to syntactical information, guess more relevant form ofthe word
[] Create a simple web interface to illustrate how the sentence has been splitted
[] Use machine learning to improve guessings
Meaning
[] Create a semantic model allowing: self reference, actions, links between verbs and semantic concepts
[] Load the model in memory in a graph database
[] Replace each component by a relevant contextual information
[] Look for the semantic item for each words and deduce the most relevant
[] Create a simple web interface to allow user to teach new concepts
[] Use machine learning to improve deduction
Actions
[] Create a web interface for the user to speak
[] Create actions lists and link them in the semantic model
[] According to the sentence and semantic element, deduce an action
[] Use machine learning to improve deduction
[] Add the action's results in the web interface


Files description
-------------------------------
Item - role
*lang_analysis/* | I have the intuition it will be the folder that will require most of my time. Here you can find everything related to the french language analysis, ie syntactical analysis, vocabulary storage, sentences parsing,...
*senses/* | because everything around us makes sense only from our sensations, with actual senses giving us pieces of information, so will Harry. In this folder are supposed to be stored all the programs used to scrap data from the internet, from any API, from the machine the program is executed on...
*conf.js* | local configuration for the program
*log.js* | simple logging tools
*me.js* | the ia lancher
*save_dict.js* | small program to load the french dictionary then save it in a json format. To use it, one have to change the format the dictionary is loaded from in the syntax.js file
*test.js* | file to test the ia functionalities during dev


