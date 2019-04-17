const commentTypes = `
    type Comment {
        id: ID!
        comment: String!
        post: Post!
        user: User!
        createdAt: String!
        updatedAt: String!

    }

    input CommentInput{
        comment: String!
        user: Int!
        post: Int!
    }
`;

const commentQueries = `
    commentsbyPost(post: ID!, first: Int!, offset: Int): [ Comment! ]!
`;

const commentMutations = `
    createComment(input: CommentInput!): Comment
    updatedComment(id: ID!, input: CommentInput!): Comment
    deleteComment(id: ID!):Boolean
`;

export {
    commentTypes,
    commentQueries,
    commentMutations
}