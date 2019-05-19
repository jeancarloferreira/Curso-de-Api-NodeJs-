import { GraphQLResolveInfo } from 'graphql'
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { Transaction } from 'sequelize'
import { CommentInstance } from "../../../models/CommentModel";
import { PostInstance } from "../../../models/PostModel";
import { handleError, throwError } from "../../../utils/utils";
import { compose } from '../../composable/composable.resolver';
import { AuthUser } from '../../../interfaces/AuthUserInterface';
import { authResolvers } from '../../composable/auth.resolver';
import { DataLoaders } from '../../../interfaces/DataLoadersinterface';

export const commentResolvers = {

    Comment: {
        post: (comment, args, {db, dataloaders: {postLoader}}:{db: DbConnection, dataloaders: DataLoaders}, info: GraphQLResolveInfo) => {
            return postLoader
                .load(comment.get('post'))
                .catch(handleError);
        },

        user: (comment, args, {db, dataloaders: {userLoader}}:{db: DbConnection, dataloaders: DataLoaders}, info: GraphQLResolveInfo) => {
            return userLoader
            .load(comment.get('user'))
            .catch(handleError);
        }
    },

    Query: {
        commentsbyPost: (parent, {postId, first = 10, offset = 0}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            const id = parseInt(postId);
            return db.Post.findById(id).then((post: PostInstance) => {
                throwError(!post, `Não existe esse Post`);
                    return db.Comment
                        .findAll({
                            where: {post: postId},
                            limit: first,
                            offset: offset
                        }).catch(handleError);
            }).catch(handleError);
        }
    },

    Mutation: {
        createComment: compose(...authResolvers)((parent, {input}, {db, authUser}: {db: DbConnection, authUser: AuthUser}, info: GraphQLResolveInfo) => {
            input.user = authUser.id;
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment
                    .create(input, {transaction: t});
            }).catch(handleError);
        }),

        updatedComment: compose(...authResolvers)((parent, {id, input}, {db, authUser}: {db: DbConnection, authUser: AuthUser}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment
                    .findById(id)
                    .then((comment: CommentInstance) => {
                        throwError(!comment, `Comment with id ${id} not found`);
                        throwError(comment.get('user') != authUser.id, `Unauthorized! You can only edit comments by yourself!`)
                        input.user = authUser.id;
                        return comment
                            .update(input, {transaction: t});
                    });
            }).catch(handleError);
        }),

        deleteComment: compose(...authResolvers)((parent, {id}, {db, authUser}: {db: DbConnection, authUser: AuthUser}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment
                    .findById(id)
                    .then((comment: CommentInstance) => {
                        throwError(!comment, `Comment with id ${id} not found`);
                        throwError(comment.get('user') != authUser.id, `Unauthorized! You can only delete comments by yourself!`)
                        return comment.destroy()
                        .then(() => true)
                        .catch(() => false)
                    });
            }).catch(handleError);
        })
    }

};