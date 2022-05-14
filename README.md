# Visualization of Olympic Performances

# Proposal

## Overview
The Olympics have long been known as the symbol of competitive athletic spirit, while they have also witnessed historical events and changes. In the first Olympic female athletes were not even allowed to compete, but now more and more female athletes are competing for themselves, for their nation and for their people. From WWII to the modern day COVID pandemic, people continue to show their resilience and perseverance with participation in the Olympics. How did my nation perform in the Olympics? That might be a question that comes naturally when you’re watching them. For our project, we intend to propose a visualization system that helps the general audience to find out how each nation performs in the Olympics on a time scale.


## Description of Dataset and Processing
We found and will visualize a dataset named [Olympic Sports and Medals, 1896-2014](https://www.kaggle.com/datasets/the-guardian/olympic-games), which contains about 37,000 records of every Olympic athlete that has won a medal from the first Olympics Athens 1896 to the XXII Olympic Winter Games Sochi 2014. Each record consists of 9 attributes that describe the information of an awarded athlete: game year, host city, athlete name, athlete country code, athlete gender, sport, discipline, event and the type of medal awarded.
The data was provided by the IOC Research and Reference Service and published by the Guardian's Datablog, so it is highly reliable. Although a few records are missing information, we have filled them using data from the International Olympic Committee’s website. In order to improve user experience in the visualization, we aggregate statistics from the original dataset and export a much smaller dataset in size, which enables better processing/loading speed and thus better user experience.
Not all attributes provided by the original dataset will be used in this project. Only a few of them are aggregated into a processed dataset and will be visualized:

- Olympic Game Year
- Summer/Winter Olympic Game
- Number of total/gold/silver/bronze medal a country won in an Olympic game
- Number of medal a country won by male/female in an Olympic game

## Usage Scenarios & Tasks
After watching the 2020 Tokyo Olympics, Lily is so intrigued that she would like to know more about how each nation is performing in the Olympics. She wants to know how many medals her nation has won in previous games and its historic changes. She also wants to see how female athletes are doing in the games. So she logs on to the visualization system, and sees a geographical map of the world. Each country is colored with a different gradient by the number of medals they historically won. She gets the sense that her nation ranks pretty high for the numbers and immediately hovers over it. The following line and bar chart change accordingly. The line chart shows the number of gold, silver, and bronze medals achieved by her nation from 1896 to 2014. The bar chart shows the number of athletes participating in the olympics. She notices that more and more athletes are competing in the games, and it’s becoming more gender balanced. Besides the chart, there’s a drop-down list for her to select a specific country. She selects the country her friend comes from, and all  three charts change to the data about that country. She is now able to compare between different countries and she sees that the gender distribution of the athletes is pretty skewed. These all help her to see how each nation is performing in the Olympic games throughout time and to compare them.

## Description of Visualization & Sketch
Three views will be presented in this project: geo-map, line chart, and bar chart respectively.

![Sketch](pics\sketch.png)

The first view (geo-map) visualizes a country’s performance in the Olympics determined by the total number of medals won and using color legend. When hovering over a country, a tooltip pops up showing the name of the country as well as how many medals the country won. 

The second view (line chart) visualizes the trend of total/gold/silver/bronze medals won by a country in a period of time. When hovering over a point, a tooltip shows up showing the country’s name as well as a detailed breakdown of how many medals the country won. 

The third view (grouped bar chart) visualizes the comparison of the number of medals a country won by female and male athlete in a period of time. When hovering over a grouped bar, a tooltip shows the country's name with how many medals females and males won respectively. 

There are 5 UI widgets designed for these views: one radio button for users to choose to display summer or winter Olympic data; one drop-down for users to select the country of interest; two  drop-downs for users to choose the start and end years of their time period. All three views are linked together. When users modify filters in UI widgets, all three views will be updated. The line chart and the grouped bar chart are linked bidirectionally. When hovering over a point or a grouped bar, the corresponding grouped bar and points will be highlighted immediately, and the geomap data updates as well.
