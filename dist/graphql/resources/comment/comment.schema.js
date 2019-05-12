"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        post: Int!
    }
`;
exports.commentTypes = commentTypes;
const commentQueries = `
    commentsbyPost(postId: ID!, first: Int, offset: Int): [ Comment! ]!
`;
exports.commentQueries = commentQueries;
const commentMutations = `
    createComment(input: CommentInput!): Comment
    updatedComment(id: ID!, input: CommentInput!): Comment
    deleteComment(id: ID!):Boolean
`;
exports.commentMutations = commentMutations;
