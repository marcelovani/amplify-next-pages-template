import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Company: a
    .model({
      name: a.string().required(),
      domains: a.email().authorization((allow) => allow.owner()),
      users: a.hasMany('User', ['companyId']),
      groupChats: a.hasMany('GroupChat', ['companyId']),
    })
    .authorization((allow) => [
      allow.authenticated().to(['read']),
      allow.owner(),
    ]),
  User: a
    .model({
      name: a.string().required(),
      email: a.email().authorization((allow) => allow.owner()),
      companyId: a.id(),
      company: a.belongsTo('Company', ['companyId']),
      groupChats: a.hasMany('GroupChat', ['groupChatId']),
    })
    .authorization((allow) => [
      allow.authenticated().to(['read']),
      allow.owner(),
    ]),
  GroupChat: a
    .model({
      name: a.string().default('New GroupChat'),
      companyId: a.id(),
      company: a.belongsTo('Company', ['companyId']),
      userId: a.id(),
      user: a.belongsTo('User', ['userId']),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(['read']),
      allow.owner(),
    ]),
  Message: a
    .model({
      content: a.string(),
      userId: a.id(),
      user: a.belongsTo('User', ['userId']),
      groupChatId: a.id(),
      groupChat: a.belongsTo('GroupChat', ['groupChatId']),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(['read']),
      allow.owner(),
    ]),
  }).authorization((allow) => allow.publicApiKey());

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: groups } = await client.models.Group.list()

// return <ul>{groups.map(group => <li key={group.id}>{group.content}</li>)}</ul>
