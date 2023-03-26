1. added 'visitor' as new user type, to be later updated to user type 'user' by admin
2. adding login form in frontend, using vanila JS only...
3. frontend pages created:
admin pannel: activate/deactivate/delete all users. view all in a table with pagination
login: styling + Proper error display on failure, sets localstorage auth token and redirects to profile/admin on success
register: styling + Proper error display on failure, sets localstorage auth token and redirects to profile/admin on success
profile: barebones, only takes data from localstorage and displays on page... no styles
4. adding chat schema mongoose model
5. installing socket.io
6. chat implemented  inbackend:
   * user connects
   socket stored in server RAM against his _id
   all online connections receive news of him getting online
   he receives list of all online connections

   * message sent from client sender: server receivs message
   received by server
   stored to db with status unseen
   acknowledgement of storage sent to sender
   if online:
     update its status in db as seen
     message sent to receiver client if online

   * message seen by client receiver: server gets notified
   acknowledgement of seen sent back to sender by server

   * user disconnects
   ram cleard
   all online connections receive news of him getting offline



