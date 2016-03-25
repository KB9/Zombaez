# Zombaez
WAD Project
KB9           Kavan Bickerstaff - 2125515
davidboyd96   David Boyd        - 2116483
theotherlefty Douglas Fraser    - 2140345

The first step is to clone the repository. This can be done by opening up the git shell and typing the command:

git clone https://github.com/KB9/Zombaez

If you get any error messages relating to faker/fake-factory then please use these two commands:

..\Scripts\pip install fake-factory
..\Scripts\pip install wsgiref

These should already be installed in the local python directory but just incase you need them I have listed them.


First you need to navigate to the folder where the manage.py file is located. This is at
Zombaez/ZombaezProject.

Before running the project, to ensure that the database contains no data or duplicates, you must delete the db.sqlite file.

Then run the command ..\Scripts\python manage.py migrate

Then the command    ..\Scripts\python populate_zombaez.py in order to repopulate the database

The python command used to run the local server is ..\Scripts\python manage.py runserver

The "..\Scripts\" part of the command is because this is where the local python executable is located.

Bug fixes made after code submission but prior to presentation:

Errors related to unpickling: These were caused because the default pickled value of the games data were not consistent with the objects in the game. Variables had been changed/deleted making the unpickling impossible

As a result of the pickling changes, updating the leaderboards and awarding badges failed so this also had to be fixed.

The HUD was not updating properly once successful AJAX requests were made so this also had to be fixed.

Game over fuction failed most of the time due to errors with dying when fighting zombaez. This also caused errors further up the line with pickling and leaderboards.

The original population script was faulty as it did not actually create a django auth user for each user making login impossible for testing

Comments added in the appropriate places and bug on python anywhere deploment regarding pickling has been fixed
