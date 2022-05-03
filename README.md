# Atelier Reviews & Ratings API

## Objective
For this system design project, I was given legacy code for an existing for a e-commerce front-end application. This application previously relied on a monolithic API service that needed improvement in terms of modularity and latency. As part a group project, we built out our own API microservices for each of the modules of the web application. 

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

## API Endpoints

### To get reviews of a product

`GET /reviews`

Query Parameters

`Status: 200 OK`

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| product_id | integer | Required. Specifies product for which to retrieve reviews. |
| page | integer | Selects page of results to return. Default 1. |
| count| integer | Specifies how many results to return per page. Default 5. |
| sort | text | Changes how reviews are sorted based on "relevant", "helpfulness", or "newest". Default "helpfulness". |

```json
{
    "product": "2",
    "page": 1,
    "count": 5,
    "results": [
        {
            "review_id": 3,
            "rating": 4,
            "summary": "I am liking these glasses",
            "recommend": true,
            "response": "Glad you're enjoying the product!",
            "body": "They are very dark.  But that's good because I'm in very sunny spots",
            "date": "2020-12-30T10:57:31.000Z",
            "reviewer_name": "bigbrotherbenjamin",
            "helpfulness": 5,
            "photos": []
        },
        {
            "review_id": 5,
            "rating": 3,
            "summary": "I'm enjoying wearing these shades",
            "recommend": true,
            "response": null,
            "body": "Comfortable and practical.",
            "date": "2021-03-17T13:28:37.000Z",
            "reviewer_name": "shortandsweeet",
            "helpfulness": 5,
            "photos": [
                {
                    "id": 1,
                    "url": "https://images.unsplash.com/photo-1560570803-7474c0f9af99?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80"
                },
                {
                    "id": 2,
                    "url": "https://images.unsplash.com/photo-1561693532-9ff59442a7db?ixlib=rb-1.2.1&auto=format&fit=crop&w=975&q=80"
                },
                {
                    "id": 3,
                    "url": "https://images.unsplash.com/photo-1487349384428-12b47aca925e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"
                }
            ]
        },
        {
            "review_id": 4,
            "rating": 4,
            "summary": "They look good on me",
            "recommend": true,
            "response": null,
            "body": "I so stylish and just my aesthetic.",
            "date": "2020-07-01T18:34:45.000Z",
            "reviewer_name": "fashionperson",
            "helpfulness": 1,
            "photos": []
        }
    ]
}

```
### To get review metadata of a product

`GET /reviews/meta`

Query Parameters

`Status: 200 OK`

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| product_id | integer | Required. Specifies product for which to retrieve reviews. |

```json
{
    "product_id": "2",
    "ratings": {
        "2": "1",
        "3": "1",
        "4": "2",
        "5": "1"
    },
    "recommended": {
        "false": "2",
        "true": "3"
    },
    "characteristics": {
        "Quality": {
            "id": 5,
            "value": "4.2000000000000000"
        }
    }
}

```
### To post a review for a product

`POST /reviews`

Body Parameters

`Status: 201 CREATED`

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| product_id | integer | Specifies product for which to post review for. |
| rating | integer | Integer (1-5) indicating the review rating. |
| summary| text | Summary text of the review. |
| body | text | Continued or full text of the review. |
| recommend | bool | Value indicating if the reviewer recommends the product. |
| name | text | Username of reviewer. |
| name | text | Email address of reviwer. |
| photos | [text] | Array of text url links of images to be shown. |
| characteristics | object | Object of keys representing characteristic_id and values representing the review value for that characteristic. |

### To mark a review as helpful

`PUT /reviews/:review_id/helpful`

`Status: 204 NO CONTENT `

Parameters

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| review_id | integer | Specifies review to mark helpful. |

### To report a review

`PUT /reviews/:review_id/report`

`Status: 204 NO CONTENT `

Parameters

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| review_id | integer | Specifies review to report. |


