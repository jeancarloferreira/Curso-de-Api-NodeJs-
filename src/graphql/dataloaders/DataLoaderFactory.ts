import * as DataLoader from 'dataloader';

import { DbConnection } from "../../interfaces/DbConnectionInterface";
import { DataLoaders } from "../../interfaces/DataLoadersinterface";
import { UserLoader } from "./UserLoader";
import { UserInstance } from "../../models/UserModel";
import { PostInstance } from '../../models/PostModel';
import { PostLoader } from './PostLoader';

export class DataLoaderFactory {
    constructor(
        private db: DbConnection
    ) {}

    getLoaders(): DataLoaders {
        return {
            userLoader: new DataLoader<number, UserInstance>(
                (ids: number[]) => UserLoader.batchUsers(this.db.User, ids)
            ),

            postLoader: new DataLoader<number, PostInstance>(
                (ids: number[]) => PostLoader.batchPost(this.db.User, ids)
            )
        }
    }
}