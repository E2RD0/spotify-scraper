# Spotify Scraper

## Introduction

This is a script designed to scrape data from Spotify's web interface. It fetches account plan details and order history.

## Installation

1. Install necessary dependencies:

```bash
npm install
```

2. Add the session cookie `sp_dc` in the `.env` file.

## Usage

To start the script:
```bash
npm start
```

## Problem Solving Approach

Here's a breakdown of the steps taken to address the problem:

1. **Identifying Session Cookie**: Analyzed the behavior post-login using the browser's Dev Tools panel to identify the `sp_dc` cookie.

2. **Extracting Account Information**: Identified selectors for relevant information on the account overview page. Utilized the Cheerio library to parse HTML efficiently and retrieve the required data.

3. **Fetching Order History**: Inspected the page source code and discovered a script tag containing invoice data in JSON format. Leveraged this structure to easily extract the desired information.

## Example output:

Current Plan: Premium Familiar - with a price of: 10.99 USD

Order history:

|              InvoiceId              | Status |           Date           |       Description      |   Amount   |
|-------------------------------------|--------|--------------------------|------------------------|------------|
| 8c7c229c-f5b8-428c-8f30-db882a2ecc12 | paid   | 2024-05-11T03:46:27.523Z | Spotify Premium Family | 10.99USD   |
| a2e53391-8481-4e5c-8260-bd4e2a76ef35 | paid   | 2024-04-11T03:46:28.046Z | Spotify Premium Family | 10.99USD   |
| af619d37-d598-4f07-a539-0de26fc3f76e | paid   | 2024-03-11T03:46:27.709Z | Spotify Premium Family | 10.99USD   |
| d479f256-cea1-4371-8556-9228dd540d20 | paid   | 2024-02-11T03:46:27.163Z | Spotify Premium Family | 10.99USD   |
| b413dcac-9e47-4366-b340-d70b82987c6f | paid   | 2024-01-11T03:46:27.289Z | Spotify Premium Family | 10.99USD   |
| 8112d508-94f9-484c-b196-418de2c8a607 | paid   | 2023-12-11T03:46:27.441Z | Spotify Premium Family | 10.99USD   |
