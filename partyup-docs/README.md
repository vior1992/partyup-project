# PARTYUP

### **INTRODUCTION**

####  **The project.**

This full-stack project was developed for the Skylab Coders bootcamp with the goal of applying the following technologies and methodologies in a real life application:

+ Javascript (ECMAScript2016)
+ ReactJS
+ React Router
+ NodeJS 
+ CSS
+ Sass
+ BEM
+ Mongo
+ Mongoose
+ Claudinary

![alt text](https://github.com/manuelbarzi/skylab-bootcamp-201807/raw/develop/staff/gerard-baste/jelzi/docs/images/slidesLogos.png "technologies")

---

####  **What is Partyup?**

Friday night at home and without plans? **Partyup is the solution.**

*Looking for city or tag, you can find events or plans of your interest, see where and who will attend and comment some doubts about the event.*

*But if you have the plan but not the people, you can post your event and people interested in it can join you!*

---

### **INSTRUCTIONS**

For launch, in each folder (Partyup-app and Partyup-api)

> $ npm i

> $ npm yarn start

---

### **DOCUMENTATION**

On the **landing**, the user can see the next 3 events that will be in the country. Can **Register** or **Login**.

![alt text](./landing.png "Landing")

If the user wants to filter some **city** or **tags**, you must login. After that, the user will be on the **home**. Here they can find and enter the events that will appear. 

![alt text](./home.png "home")

In every **partyup**, the user can read the information like the description, date, host's name, etc. The user can confirm **assistance** or cancelate it, **delete** the partyup (only if the user is the host).

![alt text](./event1.png "event")

The user can make some **commentary** about the event. 

![alt text](./event2.png "event")

It is possible to see who will attend the event and check the **public profile**, which shows the information about the partyup the user created and will attend.

![alt text](./profile.png "profile")

By default the user has a user avatar that can change in the **profile**. Profile is similar to Public profile, with the diference that if you wish to **delete your profile**, or **upload a new avatar**, you can.

Finally, you can **create a partyup**, write the title, description, and other information. If you desire, you can upload an image of the event.

#### **USE CASES DIAGRAM**
![alt text](./use_diagram.png "case diagram")

---

### **TECHNICAL DESCRIPTION**

The front-end part of the application was built using ReactJS. 

The back-end, built using NodeJS, is connected to  Partyup-data to manage the information in mongoose. 

#### **BLOCK DIAGRAM**
![alt text](./block_diagram.png "block diagram")


#### **COMPONENT DIAGRAM**
![alt text](./component_diagram.png "block diagram")

#### **DATA MODEL**
Partyup-data is composed of 3 schemas: User, Partyup and Commentary, linked to each other the following way: 
![alt text](./data_model.png "data model")

#### **TEST COVERAGE**

![alt text](./coverage.png "Logic coverage")

---

### **LIVE DEMO**

[Partyup responsive web](http://partyup.surge.sh/#/ "Partyup")

---

### **AUTHOR**
Daniel Villegas Ortiz
