# RedditClone

Using Typescript , React , Convex - For Interview purpose &amp; revise basics and learn something new.

- Convex is not just a database it replaces the entire backend of your application and allows you to write in Typescript.
  - It's a ACID compliant database , contains vector search , file storage , uploading images ..etc , Automatic caching and a ton of other great features.
  - `It's extremely fast and also real-time` , so we don't need to write our own client state management anymore. We can just directly rely on this convex backend and database to automatically keep everything up to date and sync.
    - Example : unlike other sites you've used where you might need to refresh to see n update or to see something like a vote change or a new comment.When you use a convex site everything will just in real time automatically be updated.Without us to add any other extra logic or polling or any webhooks or advanced stuff like that. It works out of the box , this is actually written in rust. (Simply Lovely).
    - They [designed](https://www.convex.dev/) it to kind of solve all of the issues that they were with traditional backends.
      - Fetch data and perform business logic with strong consistency by writing pure TypeScript.
      - Insert, update, and remove data with autocompleted types. 100% ACID compliant.
      - Call third-party services without affecting database performance. Schedule asynchronous jobs and control your data flow.
      - This is cool https://docs.convex.dev/home

## Getting Started

- https://docs.convex.dev/quickstart/react & reference code : https://github.com/techwithtim/convex-reddit-clone
- `npm create vite@latest reddit -- --template react-ts` - creates a new react vite application for us.

```
Done. Now run:

  cd reddit
  npm install
  npm run dev
```

- npm install convex
- npm i --save-dev @types/node @clerk/backend svix react-router-dom react-icons - need these dependencies for things like navigation and some nice icons for our project.

## configure the backend/

- now the backend convex also lives in the same project folder and kind of like a mono repo structure.which also means it's very easy for us to sync types between the frontend and backend
- upto now we have a regular react project & to setup backend we do - `npx convex dev`

```
Set up a Convex dev deployment
Next, run npx convex dev. This will prompt you to log in with GitHub, create a project, and save your production and deployment URLs.

It will also create a convex/ folder for you to write your backend API functions in. The dev command will then continue running to sync your functions with your dev deployment in the cloud.

```

- also we see `.env.local` file created for us , it contains the connection strings for your convex backend - because what wull happen is this is automatically going to be deployed for us in the cloud.
  - so we can keep the npx convex dev command running in the background and anytime we make a change to backend folder it's going to automatically rebuild the backend. It's going to put that in this generated folder for us.Then it's going to push that up and deploy that in the cloud for free.And that's going to allow us to use the backend from our front-end.
  - to run the frontend - `npm run dev` - Local: http://localhost:5173/

## Clerk Authentication Setup

- we want to start setting up authentication , so for this application obviously we need to build a sign in and sign out & to do that we are gonna use `clerk` - a modern kind of authentication platform that makes it very easy to handle auth gives you an authentication dashboard.You can manage roles users etc.Integrate nicely with react and convex here.
- Follow this doc : https://docs.convex.dev/auth/clerk
- configure the jwt template like it says in convex. Under session management go to JWT templates in Clerk dashboard > New Template > select convex > don't change anything and copy the issuer URL > npm install @clerk/clerk-react
- we have just wrapped our app in the convex and clarke provider so now we're able to connect to the backend as well as clerk provider for authentication.
- we will be having slightly advanced setup than what we have here. now let's commit these changes.

### Understanding backEND schema

- create a file in convex directory names `schema.ts` - this is where we define what the backend of our application is going to look like.
- we're going to begin by just defining the users table or the users collection.Now in convex we store json like objects .
- since we're using clerk , clerk will automatically handle the users for us.It will store their email when they're created.It can store a lot of different fields for us , but we want to have the users kind of replicated in our convex database as well.so that we can use them for various relationships and get maybe information about other users , usernames stc.so what we're doing is kind of creating a limited version of what we would normally store for users inthis database.so we have it directly in convex. `users table`. the reason is we want to have some information about the users directly in convex.so we can have things like relationships with this user's table.And create an index - it's just a way that allows you to quickly look up information on a table based on field or column.
- there are few more steps to get the users from clerk into convex. - https://docs.convex.dev/auth/database-auth - There are two ways you can choose from for storing user information in your database (but only the second one allows storing information not contained in the JWT) which is `Implement a webhook and have your identity provider call it whenever user information changes`. Using a webhook means that anytime we make a change to a user in clerks whether creating , deleting wtc we are going to call a function in our convex backend which is going to pick up that change and adjust this user's table(defined in schema.ts)
- follow https://docs.convex.dev/auth/database-auth#set-up-webhooks Then https://docs.convex.dev/auth/database-auth#mutations-for-upserting-and-deleting-users - create a users.ts in convex directory and this will contain mutations (Mutations for upserting and deleting users) are what can be called to actually modify data in the convex database that will be used in order to will update the user from clerk. and create http.ts file and copy the code from this part https://docs.convex.dev/auth/database-auth#webhook-endpoint-implementation - we can basically read through docs to understand the code later.

## setting up pages and navigation

- we want to have `home page` , we're going to have a page to view a post , to view a user's profile , to submit a new post , a page for viewing subreddits.
- create a new folder in frontend `pages` & `components` & `styles`.
- Added all of the css files from techwithtime git repo.To save time.But will explore later.(TODO)
- we have base pages setup done.
- `and start working on navigation. for this we need some kind of nav bar.` here also we stub it , means stab(bing) writing the skeleton of the component but we're not actually implementing it yet.
- Layout component is just going to handle rendering the navbar for us & the rest of the layout of our site. Outlet - Renders the matching child route of a parent route or nothing if no child route matches - just renders a page - it's just saying whatever page run , we're going to render that inside of here . so we will be using this layout component from our app component where we have the main navigation setup.
- we will be setting up navigation in APP.TSX using react-router-dom.we will always be rending the Layout and we render all other pages inside of layout route.
- upto here Navigation is working.

### Navigation Bar

- next writing the authentication components and completing the nav bar.
- also let's go to clerk to allow us to create username as well.
- created a account on my name abhimvp and it's cool.
- if we want to see if the users are getting added to convex databse , we go to convex dashboard > Data > we see users table and the user created data.

### Subreddit creation form.

- next allow users to create a subreddit. using the Faplus logo.
- create a dropdown & we also need to have components that we're goinng to render when we press the buttion in the drop down.
- now first we created the commnuity modal and now to see that we create the dropdown component.

### Creating subreddits

- now on backend , we go to schemas and define the type that we want to have for our subreddit and the fields that we want to have on that.
- By the way in convex it's automatically going to insert an ID as well as the created at time.Any time you make a new instance of like a user or a subreddit or whatever.so we don't have to specify those fields ourselves.
- Now remember that in convex we have three main operations that we can use - queries (get some info and display it on frontend ), mutations (create or delete or modify something in database ), action ( used to call some third party service) - Here we need mutations and queries .
  - so we need to now write a mutation in order to create a new subreddit.It's good practice to create a file on the name of table we deal with mutations or queries.
  - now we created the create mutation to create new subreddit and now how do we call this from frontend.?
    - we go to create community modal and we use the imports in there to have a function on our frontend that triggers or links back to that mutation.

### viewing subreddits

- now we want to display a subreddit . so let's write the subreddit display page that when we go to the subreddit , we can see the description ..etc and the subreddit creation is working.
- it's working , go to [localhost](http://localhost:5173/r/programming) and see

### Creating posts(backend) & post creation form(frontend)

- same as above we begin with schema , define the posts table and what fields it needs and create mutations and query to add and display posts info in a subreddit.
- frontend : submitPage - done can see the data in databse.

#### Uploading / Posting Image
- upload images as part of our post.
  - select the image
  - preview the image
  - upload the image (the way it works is if the user is trying to submit the post).Then we grab the image we're going to generate a unique upload URL for that image in convex storage which is included in the backend.we're then going to upload that image to the URL.Then once the image is uploaded , we're going to take that image URL and store that in the post.
