#README

Project 02 Retrospective

Shannyn Cabi, Achsah Jojo, Abel Plascencia, Luis Tapia

Github Link Front End: https://github.com/abplas/Devbuild_vocabapp_frontend
Github Link Back End: https://github.com/AchsahJojo/VocabularyApp_Backend
API Link: https://vocabapp-backend-3ec74c7b267c.herokuapp.com

Introduction

It was the best of projects, it was the worst of projects. It was a project that revealed our wisdom, it was a project that revealed our foolishness.
We communicated primarily through Slack and in person meetings.
We initially considered about 8 user stories that resulted in 20 github issues.  In the end we completed 19 of the 20 issues.

Introduction	1

Team Member Retrospectives	2

Achsah Jojo	2

Shannyn Cabi	4

Luis Tapia	5

Abel Plascencia	6

Conclusions	3
How successful was the project?	3
What was the largest victory?	3
Final assessment of the project	3


Team Member Retrospectives
Achsah Jojo

I made the whole project come together by connecting the backend to the front-end. 
What was your role / which stories did you work on
My role was on both frontend and backend to fix bugs and connect everything together
I initially worked on OAuth and user login, then I pivoted to fixing backend API routing issues, front-end caching, log visibility, and API connection issues. I also worked on creating new github repos that replicated the current errors and fixed those errors so that everyone on the team had the same working version of the project.
How much time was spent working outside of class
I spent about 4 hours each week outside of class and then towards the end, over 6-8 hours. 
What was the biggest challenge? 
Incorrect localhost configuration, API call mismatches, caching and dependency inconsistencies, log visibility and debugging setup,  parsing results in wordList.tsx, branch synchronization and version consistency.
Why was it a challenge?
Several backend API endpoints were not configured to use http://localhost:8080. This caused front-end requests to fail because they were referencing different host addresses (e.g., http://192.168.1.224:8080).
The front-end code invoked certain API routes differently than they were defined in the backend, resulting in successful backend responses that were not properly reflected in the front-end application.
The project experienced issues with caching and node_modules. Log visibility in the console was inconsistent, sometimes appearing, sometimes not suggesting potential issues with local caching or dependency mismatches.
 wordList.tsx and VocabListPage.tsx were still using the local SQLite database instead of retrieving data from the MongoDB backend.
The main branch and Luis’s branch were not aligned, despite Git indicating that they were up to date. 
How was it addressed?
To reproduce and analyze the problem, Luis’s front-end branch was cloned and checked out locally, as his version was functioning more reliably than the main branch.
The following steps were taken to ensure a clean environment: deleted node_modules and package-lock.json, cleared the npm cache, reinstalled dependencies with npm install, restarted the project with npm start
Version mismatches were resolved by explicitly installing compatible dependencies given by Expo Go in the error message
After resolving dependency issues, logs became consistently visible. Using React Native DevTools (launched via pressing “j” in the terminal) enabled front-end debugging and allowed verification that API requests were reaching the backend correctly, though data was not rendering properly on iOS.
Save word to existing list by updated API URLs to use the correct localhost address.
Save word to history fix by removing SQLite dependency, integrated MongoDB API via http://localhost:8080/api/vocab/lists/{listId}/word, updated data models to use MongoDB string IDs, and added loading indicators.
Favorite / most interesting part of this project
Looking through the errors and debugging the problems in the front and back
If you could do it over, what would you change?
I would tell the backend issued teammate to give the team good documentation on what they did and how they did/ or a good PR with description so that if anyone had questions, they can refer to this instead of being out of the loop.
I would also understand how the containers worked in the project because it feels like it did not do anything.
What is the most valuable thing you learned?
Documentation is key. If only one team member knows how the entire backend which is the backbone of a backend based project works then it is really difficult to debug errors and understand why things were done the way they were. Also it is important to understand the code you write so you can explain it to others.

Shannyn Cabi

My main contribution was creating the delete operations for lists (since the original project was missing a delete function) and implementing that to work with the frontend as well. I also worked with testing all the API routes using PostMan to ensure our code worked, even though we faced many issues with getting the program to run on all our devices. I also kept track/organized our progress on GitHub with Achsah.
What was your role / which stories did you work on
My role was incorporating DELETE operations into our app and ensuring all our API routes were working with Postman testing.
How much time was spent working outside of class
I spent a few hours each week outside of class.
What was the biggest challenge? 
One of the biggest challenges for me and my whole team was issues connecting to our database and having the app run on our emulators at all. This was due to some mismatch between localhost8080 and the android studio emulator address, while other team members were running on an ios emulator.
Why was it a challenge?
While our code and setup seemed correct, we kept facing the connection issues and couldn’t diagnose why (since 8080 is the default and worked on the last project). We assumed it might have been an issue with our MongoDB connection, but couldn’t figure out what.
How was it addressed?
We all went to office hours or at least reached out to Roberto and relayed his help to our whole team; we ended up changing and fixing our host thanks to the diagnosis and solution from Roberto. Personally, I also was having some expo/node_modules issues that he helped me with as well, which was a major block for me running the program.
Favorite / most interesting part of this project
My favorite part was seeing how our database connected to the endpoints connected to our postman testing. It felt interesting doing it all from scratch, and the postman tests were neat.
It was also fun working with teammates/TAs and all celebrating once we got things working!
If you could do it over, what would you change?
I would have gone to Dr. C or our TAs much sooner to have someone more experienced look over my issues and hopefully help debug them faster. This would have saved me lots of time from debugging or searching for solutions that did not help me. 
I would also try to learn more about the parts I’m not working on, like setting up SpringBoot or OAuth, just so I am in the loop of how they generally are put together in a project so I can replicate it myself in the future.
What is the most valuable thing you learned?
For me, it was very informative looking over code from my other teammates, the controllers for example, which I barely had any experience with before,  and getting familiar working specifically on building the backend. I think another important lesson for me was getting help sooner rather than later, and knowing when my efforts towards solving a bug kept leading to the same dead end, vs getting an outside perspective to help debug and solve an issue.

Luis Tapia

My main contribution to the project was the backend. I set up the MongoDB and connected it to spring boot. I also helped on some of the front end functionality. I also worked on setting up unit testing.
What was your role / which stories did you work on
I worked on setting up springboot, setting up some api endpoints, implementing the MongoDb, and finally connecting them together. 
How much time was spent working outside of class
I would spend a couple hours a week outside of class. 
What was the biggest challenge? 
My biggest challenge was getting the frontend and backend to connect and have full functionality.Another challenge was getting the same code to appear on all of our machines, for some reason even though all of my code was pushed, it was not appearing on everyone else’s machines even though they were merging from main
Why was it a challenge?
I could not progress since that was the main functionality of the app. I could not solve it for 2 days. Since I was the only one working , no one else could progress.
How was it addressed?
I asked Achsah for help and she quickly helped me debug the errors I had going on. We made new repositories and it seemed it fixed it.
Favorite / most interesting part of this project
My favorite part was when Achsah solved the issue and we all got super excited since our code was working again. 
If you could do it over, what would you change?
I would go about how I created the backend differently since it was my first time with most of this software. 
What is the most valuable thing you learned?
I learned how important it is to communicate with your team. 

Abel Plascencia

My Main contribution was deploying the API on heroku and doing a heavy chunk of OAuth logic for logging in as well as creating the keys and such to log in. Also connecting OAuth tokens to the back end.
What was your role / which stories did you work on
My roles were hosting the backend API, deploying the container and wrapping it up with deploying OAuth.
How much time was spent working outside of class
At least 2-6 hours every week.
What was the biggest challenge? 
The biggest challenge was converting the app from a regular expo go application  to a Dev Build in order to allow OAuth.
Why was it a challenge?
There were so many rabbit holes I had to jump through as at some point I had to change settings in my own system and restart in order for a process to be made through the build itself.
How was it addressed?
By taking down an error each time independently then addressing the next one that popped up to the best of my abilities.
Also asking AI for what commands to run to resolve the issue as the conversion is very sporadic and unpredictable so each person manages the changes differently.
Favorite / most interesting part of this project
My favorite part of this project was deploying on heroku as I had not run into many issues as most groups did.
It was interesting to me because the only main issue was that the m=nod modules clashed but once I did a split commit to merge into heroku for hosting, there were no real issues and the API was plug and play and all the database data was there and it was as if there was no real struggle.
If you could do it over, what would you change?
Don't waste as much time on a container on aws at least without a personal public domain. 
The container might have been better deployed on heroku.
What is the most valuable thing you learned?
Apps are not just made overnight, apps take a lot of time and meticulous changes in order for them to run decently as we were given the blue print already and it was still a struggle.

Conclusions

How successful was the project?

In the end, our team was just about 100% successful. This is because we were able to find work through and find solutions to our seemingly endless issues with connectivity, errors on starting up the program, and many more discussed in our documentation. We were able to strengthen our understanding of both AWS and Heroku, since we ended up switching, and got better at diagnosing issues regarding web only vs android vs ios emulators. We also learned the importance of effective communication with each other and with our TAs since we had to be explicit in describing and replicating the issues we were running into.
What was the largest victory?

Our largest victory was finally getting the front and back end connected for all group members, and diagnosing our local host issue that was preventing us from reaching this point sooner. 
Final assessment of the project
This project was very helpful in preparing us for both capstone and real-life projects; we were faced with failure upon failure, and our attempts at solving them seemed futile, which caused lots of pressure due to our time-crunch for the project. However, it forced us to try and experiment with new solutions and see where we were lacking; in communication, our actual code, our systems, etc.
