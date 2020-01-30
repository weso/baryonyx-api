# baryonyx-api
SOLID POD's integration with Symmetry - API repository

## To run the application
Execute the following line in a cmd :
```
    npm app
```

## To run the tests
Execute the following line in a cmd :
```
    npm test
```

## What does our API offer ?
### Reading allergy file
using an HTTP GET with the following route :
```
    /symmetry/alergias/:id
```
_id refers to the user's identification_

### Deleting allergy file
using an HTTP POST with the following route :
```
    /symmetry/delete
```

### Creating allergy file for the user's allergies
using an HTTP POST with the following route :
```
    /symmetry/write
```

### Deleting the user's folder
using an HTTP POST with the following route :
```
    /symmetry/user/delete
```
