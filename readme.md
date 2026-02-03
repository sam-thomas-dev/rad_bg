## Synopsis
This web app is used to look up the average yearly background radiation dose in a city stemming from ground composition alone. It was created using the MERN stack (mongodb, express js, react, and node js). References for the sources used to create the dataset can be found in app, for the final dataset used, click [here](./documentation_resources/final_dataset.csv).

[**_Link To Deployed Site_**](https://bg-rad-frontend.samsjourniesw.workers.dev/), hosted using Cloudflare Pages.<br>
Note, this repository does not reflect the changes made to the project required to deploy both the API & frontend using cloudflare.<br>

**_Inspiration_**<br>
Inspiration for the app came from a video titled "[Big Nuclear’s Big Mistake - Linear No-Threshold](https://www.youtube.com/watch?v=gzdLdNRaPKc)", in which the linear no-threshold model for safe radiation exposure is discussed. The video explains that despite being discredited by multiple scientific reports from credible publications, the model is still the basis for most radiation based safety and policy decisions. Put simply, the model implies that any exposure to radiation, no matter the dose, increases a person's risk of radiation based illness (ie, there is no safe exposure threshold). In the video, the example is presented that, if this were the case, we would likely see an increase in cancer rates or radiation based illnesses in cities that have higher average background radiation doses, but we don’t. After hearing this, I wanted to know the average annual background radiation dose in my own city, and realised the data for each country was spread over multiple not easy to parse sources. To solve this issue, I decided to create a web app to centralise the data, and display it in a useful and easily searchable form.

## Document Content
This document outlines how the app was created, its main features, and a general technical overview regarding how said features were implemented. It contains the following sections:
- [Main Components](#main-components)
- [API / Backend](#api--backend)
- [UI / Frontend](#ui--frontend)

## Main Components
The technical details of the app can be broken down into two main components, the UI and API (or frontend and backend respectively). In this case, the [API / backend](./bg_rad_backend/) is used to submit queries to the database or get user information using the provided endpoints, with the [UI / frontend](./bg_rad_frontend/) being used by the user to select the information to query. 

## API / Backend
The API was created using the express js web app framework. Express was used to define three main endpoints that return a JSON object when a get request is made using a valid URL parameter. The API interacts with the radiation dataset stored in a [mongodb](https://www.mongodb.com/) database to retrieve the records requested at each endpoint. The main features supported by the API are as follows:

- Retrieving background radiation data, done so through three endpoints get/byID, get/byFilter, and get/ByIP defined [here](./bg_rad_backend/rad_data_endpoint/routes/radDataRoute.js). Get by filter returns an array of records that contain the filter parameter specified in the URL parameter, get by ID returns the object in the database with the ID specified in the URL parameter, and get by IP returns the record with the closest latitude and longitude to that of the IP provided in the URL parameter. Documentation for the API can be found [here](./bg_rad_backend/apiInfo.md), detailing specifics on endpoint behavior. 

- Detecting approximate user location & closest record, done through the use of the external [IPStack](https://ipstack.com/) API which returns the approximate latitude, longitude, and country of any IP address provided. Given this information, a query is then made to the database for all locations in the same county as the provided IP address, this query is then iterated over until the record that minimises the difference between the IP addresses latitude and longitude with that of its own is found, this functionality is defined [here](./bg_rad_backend/rad_data_endpoint/database/ipStackRequest.js).

## UI / Frontend
The UI was created using the next js react framework. React was used to define the components of the site and connect the UI with the API specified above. With components being updated through react hooks, following the recommended best practices and processes outlined in the [react documentation](https://react.dev/learn/thinking-in-react).

The UI enables users to search locations via keywords, and select their desired location, after which the UI will then display the background radiation as a figure, place it on a scale for safe dose, and display other supplemental information about the location including its position on a map, this functionality is defined [here](./bg_rad_frontend/app/page.tsx). Upon loading the site, if records exist in the same country as the user, the record closest to the user's approximate location is shown, otherwise the default location is shown. The main features implemented in the UI are as follows:

- Location shown via map, implemented using the open-source [Leaflet](https://leafletjs.com/) react library.

- Detecting user IP and closest record, implemented using the [IPIfy](https://www.ipify.org/) API and using the result to fetch the closest record using the API specified above.

- Theme toggle, allowing user to toggle between dark and light mode






