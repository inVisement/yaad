# Title

## APIs
- example1: `GET,POST /api/endpoints/{endpoint}?user=&size=10&output?pass:password=&file:file=&complete=true`
- example2: `GET /api/endpoints/{endpoint}??pass:password=&file:file=&complete=true`
- example3: `POST /apis/{api}/endpoints/?user=&size=10&output`
- not example: `some code that does not matter`


## To-Do
- [x] new: update cik financials with url-to-sec-submission
    - fetch xml.text
    - xbrl2df.extract_xbrl
    - trim
    -for tag in tags:
        - update-quarterly
        - update-yearly

- [ ] new: update raw extracted financial tags in /ciks/{cik}/extracted-tags/trimmed-tags.csv
    - change old function in sec file to update trimmed tags

- [ ] new: update instant.csv

- [ ] new: bash to schedule every hour
    - read feeds that are extracted their xbrl
    - extract feed (daily or recent) 
    - find new submissions
    - for sub in submissions
        update cik financials ...
    - save feed

- [x] define tags
    - ~~make tags to_lower case~~
    - ~~define 50 tags~~

- [x] exapnd tags
    - write function to expand current tags (define_new_tags)

- [ ] separate fetch endpoint and deploy in cloud run

- [ ] in index.js/url2form:
    - implement how to mention "required" parameters (query and body)
    - implement data type for parameters (query and body) 


## bugs    

- run f only after all markdowns are converted
- add expandable class to icons and change select them
- add console.table to viewer
