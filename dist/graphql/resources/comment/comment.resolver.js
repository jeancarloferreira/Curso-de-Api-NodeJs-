"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../utils/utils");
const composable_resolver_1 = require("../../composable/composable.resolver");
const auth_resolver_1 = require("../../composable/auth.resolver");
exports.commentResolvers = {
    Comment: {
        post: (comment, args, { db }, info) => {
            return db.Post
                .findById(comment.get('post')).catch(utils_1.handleError);
        },
        user: (comment, args, { db }, info) => {
            return db.User
                .findById(comment.get('user')).catch(utils_1.handleError);
        }
    },
    Query: {
        commentsbyPost: (parent, { postId, first = 10, offset = 0 }, { db }, info) => {
            const id = parseInt(postId);
            return db.Post.findById(id).then((post) => {
                utils_1.throwError(!post, `Não existe esse Post`);
                return db.Comment
                    .findAll({
                    where: { post: postId },
                    limit: first,
                    offset: offset
                }).catch(utils_1.handleError);
            }).catch(utils_1.handleError);
        }
    },
    Mutation: {
        createComment: composable_resolver_1.compose(...auth_resolver_1.authResolvers)((parent, { input }, { db, authUser }, info) => {
            input.user = authUser.id;
            return db.sequelize.transaction((t) => {
                return db.Comment
                    .create(input, { transaction: t });
            }).catch(utils_1.handleError);
        }),
        updatedComment: composable_resolver_1.compose(...auth_resolver_1.authResolvers)((parent, { id, input }, { db, authUser }, info) => {
            id = parseInt(id);
            return db.sequelize.transaction((t) => {
                return db.Comment
                    .findById(id)
                    .then((comment) => {
                    utils_1.throwError(!comment, `Comment with id ${id} not found`);
                    utils_1.throwError(comment.get('user') != authUser.id, `Unauthorized! You can only edit comments by yourself!`);
                    input.user = authUser.id;
                    return comment
                        .update(input, { transaction: t });
                });
            }).catch(utils_1.handleError);
        }),
        deleteComment: composable_resolver_1.compose(...auth_resolver_1.authResolvers)((parent, { id }, { db, authUser }, info) => {
            id = parseInt(id);
            return db.sequelize.transaction((t) => {
                return db.Comment
                    .findById(id)
                    .then((comment) => {
                    utils_1.throwError(!comment, `Comment with id ${id} not found`);
                    utils_1.throwError(comment.get('user') != authUser.id, `Unauthorized! You can only delete comments by yourself!`);
                    return comment.destroy()
                        .then(() => true)
                        .catch(() => false);
                });
            }).catch(utils_1.handleError);
        })
    }
};
