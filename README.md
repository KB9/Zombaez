# Zombaez
WAD Project
KB9           Kavan Bickerstaff - 2125515
davidboyd96   David Boyd        - 2116483
theotherlefty Douglas Fraser    - 2140345

In order to run zombaez, two packages must be installed using the following commands:

pip install fake-factory
pip install wsgiref

Once these two packages have installed you need to navigate to the folder where the manage.py file is located. This is at
Zombaez/ZombaezProject.

Before running the project, to ensure that the database contains no data you must delete the db.sqlite file.
Then run the command ..\Scripts\python manage.py migrate
Then the command    ..\Scripts\python populate_zombaez.py in order to repopulate the database

The python command used to run the local server is ..\Scripts\python manage.py runserver

The whole "..\Scripts\" is because the local python environment is located there.

Bug fixes made after code submission but prior to presentation:

Errors related to unpickling: These were caused because the default pickled value of the games data were not consistent with the objects in the game. Variables had been changed/deleted making the unpickling impossible

As a result of the pickling changes, updating the leaderboards and awarding badges failed so this also had to be fixed.

The HUD was not updating properly once successful AJAX requests were made so this also had to be fixed.

Game over fuction failed most of the time due to errors with dying when fighting zombaez. This also caused errors further up the line with pickling and leaderboards.

The original population script was faulty as it did not actually create a django auth user for each user making login impossible for testing
