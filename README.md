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
