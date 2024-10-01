# Objective
This objective of this project is to show you the power of a good event loop management in javascript aplications.
To do it, I implements two endpoint with the same behavior: get data about all examsIds and get the PDF accourding each data and, in the final, merge all PDF in only one PDF and returns a base64 pdf.

1) worng endpoint:
 This endpoint have a bad event loop management. Consequently, the response time of this endpoint will be related with the number of examsIds that the client requests. The more ID is passed in the request, the longer it will take. According to Big-O notation, I could say, in simple terms, that the endpoint has an O(n) notation.

2) faster endpoint:
 This endpoint have a good event loop management. The response time will depend on how the environment will handle the concurrency of requests. According to Big-O notation, I could say, in simple terms, that the endpoint has an O(1) notation.