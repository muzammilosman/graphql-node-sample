const express = require('express');
const userData = require('./mock-data.json');
const graphql = require('graphql')
const { GraphQLSchema, GraphQLInt, GraphQLString, GraphQLObjectType, GraphQLList } = graphql;
const { graphqlHTTP } = require('express-graphql');
const app = express();


// defining user schema
const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: GraphQLInt},
        firstName: {type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString }
    })
})

// defining queries
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        getAllUsers: {                         // equivalent to API to fetch all users
            type: new GraphQLList(UserType),
            args: { id: { type: GraphQLInt}},
            resolve: (parent, args) => {         // database call and function logic to return data goes here
                return userData
            }
        },
        getUserById: {
            type: UserType,
            args: { id: { type: GraphQLInt}},
            resolve: (parent, args) => {         // database call and function logic to return data goes here
                const matchedUser = userData.find((user) => user.id === args.id);
                return matchedUser;
            }
        }
    }
})

// defining Mutations
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: UserType,
            args: {
                firstName: { type: GraphQLString},
                lastName: { type: GraphQLString},
                email: { type: GraphQLString},
                password: { type: GraphQLString}
            },
            resolve: (parent, args) => {
                userData.push(args);
                return args;
            }
        }
    }
})

const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})

// configuring the end-point
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

app.listen(3000, () => {
    console.log('App listening on Port 3000')
})