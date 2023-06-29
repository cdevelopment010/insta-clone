# Things that are broken (like my brain right now)

- [x] Images for post need reworking. On hover they should turn light gray and this isn't possible with using the svg as an image source. 
- [x] Implement storage for photos/images
  - [x] This will need a folder for user profile pictures
  - [x] and a folder for post images
- [x] On posts, show username not ID (will need to access the user collection)
- [x] Sign in should redirect user to home page.
- [x] Need to check sign in with email/password - probably need to update code. 
- [x] Re-write home/profile to work within the menu
- [x] Re-write menu to work for mobile, and to take the children as content.
- [x] Style new user page
- [x] Style profile page
  - [x] Add post images as a grid
  - [x] Mobile version tidy up
  - [ ] Nice to have: show comment and like count.
- [x] multi-image posts. 
- [ ] refresh on post created
- [ ] Click on post to enlarge (nice to have)
- [x] Comments (sub collection of post)
  - [x] Edit comment
  - [x] delete comment
    - [ ] delete comment also if you are post creator 
- [x] Likes (sub collection of post)
- [x] Should only show icons for comments/likes, and also create post, if user is signed in. 
- [x] Search functionality 
  - [x] Also with tags
- [ ] Tidy up code
- [ ] Custom toast component
- [ ] Style textarea for create post (generally just style create post)
- [ ] Show image on file input (before upload)
- [ ] optimise images
- [ ] nice to have: notifications




To allow authentication from Firebase:
- go to console.firebase (your project)
- Go to authentication
- Settings
- Authorised domains
- Add your domain (in my case it is cdevelopment010.github.io)