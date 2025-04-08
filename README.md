# Web Development Project 5 - *MyTop12*

Submitted by: **Rafael Niebles**

This web app: **Allows you to find out information about any user's top 12 most listened to tracks.**

Time spent: **8** hours spent in total

## Required Features

The following **required** functionality is completed:

- [x] **The site has a dashboard displaying a list of data fetched using an API call**
  - The dashboard should display at least 10 unique items, one per row
  - The dashboard includes at least two features in each row
- [x] **`useEffect` React hook and `async`/`await` are used**
- [x] **The app dashboard includes at least three summary statistics about the data** 
    > The summary stats are most mainstream artist, most niche (underground) artist, and most listened to genre
- [x] **A search bar allows the user to search for an item in the fetched data**
  - The search bar **correctly** filters items in the list, only displaying items matching the search query
  - The list of results dynamically updates as the user types into the search bar
- [x] **An additional filter allows the user to restrict displayed items by specified categories**
    - The filter restricts items in the list using a **different attribute** than the search bar 
    - The filter **correctly** filters items in the list, only displaying items matching the filter attribute in the dashboard
    - The dashboard list dynamically updates as the user adjusts the filter
    > You're able to filter out artists by genre using the menu on the left

The following **optional** features are implemented:

- [x] Multiple filters can be applied simultaneously
    > You can apply a follower range filter, genre filters, and a search filter at the same time
- [x] Filters use different input types
    > There is a toggle-wise filter (genres), numeric filter (follower range), and simple search filter
- [x] The user can enter specific bounds for filter values
    > The followers filter allows you to filter artists by min and max followers 

## Video Walkthrough

Because there are a number of features, the demo's been linked as a video.

[Click here to access it!](https://drive.google.com/file/d/1ghAqV6RiABW16wNQTFus39fk2TZ1XUBw/view?usp=sharing)


## Notes

Because LastFM (the user music info API) only returns top artists but not info about them (image, follow count, etc), I had to use Spotify's web search API as well to retrieve metadata about the specified artists by first grabbing the top 12's names from LastFM and then passing them to Spotify in order to receive metadata linked to those names. It was a fun exercise!

## License

    Copyright [2025] [Rafael Niebles]

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

