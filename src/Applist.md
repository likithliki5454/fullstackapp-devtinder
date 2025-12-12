<!-- #devtinder API's -->

<!-- Auth Rputer -->
Post    auth/signup
post    auth/Login
post    auth/Logout 

<!-- Profile Router -->
get     /profile
patch   /profile/edit
patch   /profile/password

<!-- connection request router -->
post    /request/send/intrested/:userId
post    /request/send/ignored/:userId
post    /request/review/accepted/:requestId
post    /request/review/rejected/:requestId


<!-- myprofile router -->
get     user/connections
get     user/requests
get     user/feed         -gets you the profiles of other user on platform
