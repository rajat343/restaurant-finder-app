# The Restaurant Finder!

![image](https://media.giphy.com/media/3o6Ztgy6tMwEaxnUFq/giphy.gif)

# Restaurant Finder Application

An end-to-end scalable application that enables users to search, rate, and review restaurants, allows business owners to manage their listings, and empowers admins to maintain platform integrity.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [System Design](#system-design)
    - [Component Diagram](#component-diagram)
    - [Deployment Architecture](#deployment-architecture)
6. [Use Case Diagrams](#use-case-diagrams)
7. [Sprint Workflow](#sprint-workflow)
8. [XP Core Values](#xp-core-values)
9. [Conclusion](#conclusion)

---

## Project Overview

The **Restaurant Finder Application** is a platform similar to Yelp, offering:

-   **For Users**:

    -   Search restaurants by name, category, price range, and ratings.
    -   Search restaurants by location integrated with **Google Maps API**.
    -   Submit reviews and ratings.
    -   View detailed restaurant profiles.

-   **For Business Owners**:

    -   Add and manage restaurant listings (photos, descriptions, hours).
    -   Update restaurant details.
    -   View owned restaurant listings.

-   **For Admins**:
    -   Remove duplicate listings.
    -   Manage inactive or closed restaurant entries.

The application is deployed on **AWS ECS** with load balancing and auto-scaling to ensure scalability and reliability.

---

## Technology Stack

### Backend

-   NodeJS with Typescript (RESTful API development)
-   MongoDB (Non Relational Database)

### Frontend

-   React.js (Responsive Web UI)
-   Google Maps API (Location-based search)

### Cloud Deployment

-   AWS EC2 (Elastic Container Service)
-   Load Balancer (Traffic management)
-   Auto-Scaling (Dynamic resource management)
-   AWS S3 (Cloud Storage)

### Tools

-   **Postman**: API testing
-   **GitHub**: Source code and version control
-   **Google Sheets**: Sprint backlog, burndown chart

---

## Database Schema

### Users Table

| **Field**    | **Type** | **Description**              |
| ------------ | -------- | ---------------------------- |
| `first_name` | String   | First name of the user.      |
| `last_name`  | String   | Last name of the user.       |
| `email`      | String   | User email (unique).         |
| `p_n`        | String   | Contact number.              |
| `is_admin`   | Boolean  | Role indicator (Admin/User). |
| `is_deleted` | Boolean  | Soft delete flag.            |
| `metadata`   | Object   | Additional user details.     |

### Restaurants Table

| **Field**             | **Type** | **Description**                  |
| --------------------- | -------- | -------------------------------- |
| `name`                | String   | Restaurant name.                 |
| `description`         | String   | Restaurant description.          |
| `contact_info`        | String   | Contact details.                 |
| `hours_active`        | JSON     | Operating hours.                 |
| `owner_id`            | Integer  | Reference to BusinessOwner ID.   |
| `average_price_for_2` | Integer  | Average cost for two people.     |
| `location`            | String   | Restaurant address with zipcode. |
| `photos`              | Array    | List of photos.                  |
| `type_of_food`        | JSON     | Food categories (Veg/Non-Veg).   |
| `is_deleted`          | Boolean  | Soft delete flag.                |
| `metadata`            | Object   | Additional details.              |

### User Restaurant Interaction Table

| **Field**       | **Type**      | **Description**             |
| --------------- | ------------- | --------------------------- |
| `user_id`       | String        | Reference to `users` table. |
| `restaurant_id` | String        | Reference to `restaurants`. |
| `rating`        | Integer       | User rating (1 to 5 stars). |
| `review`        | String        | Review text.                |
| `review_photos` | Array<String> | Review Photos.              |

### Cuisine Table

| **Field**     | **Type** | **Description**      |
| ------------- | -------- | -------------------- |
| `name`        | String   | Cuisine Name.        |
| `description` | String   | Cuisine Description. |
| `image`       | Integer  | Cuisine Image.       |
| `is_deleted`  | Boolean  | Soft delete flag.    |

### Restaurant Cuisine Table

| **Field**       | **Type** | **Description**                  |
| --------------- | -------- | -------------------------------- |
| `restaurant_id` | String   | Reference to `restaurant` table. |
| `cuisine_id`    | String   | Reference to `cuisine` table.    |
| `is_deleted`    | Boolean  | Soft delete flag.                |

---

## API Endpoints

### For Users

| **Functionality**   | **Method** | **Endpoint**   |
| ------------------- | ---------- | -------------- |
| Register a new user | POST       | `/signup`      |
| User login          | POST       | `/login`       |
| Get User Details    | GET        | `/:user_id`    |
| Update User         | PUT        | `/update_user` |
| Delete User         | DELETE     | `/:user_id`    |

### For Business Owners

| **Functionality**                   | **Method** | **Endpoint**                    |
| ----------------------------------- | ---------- | ------------------------------- |
| Add a new restaurant                | POST       | `/create_restaurant`            |
| Update restaurant details           | PUT        | `update_restaurant`             |
| Get Restaurant Details              | GET        | `/:restaurant_id`               |
| Get Restaurant List                 | GET        | `/get_restaurants`              |
| Get Restaurant List from cuisine Id | POST       | `/get_restaurants_from_cuisine` |

### User Interaction

| **Functionality**                       | **Method** | **Endpoint**                                     |
| --------------------------------------- | ---------- | ------------------------------------------------ |
| Give Ratings                            | POST       | `/give_rating`                                   |
| Get restaurant interaction from User Id | GET        | `/get_user_restaurant_interactions_from_user_id` |

---
