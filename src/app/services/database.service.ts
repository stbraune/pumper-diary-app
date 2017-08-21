import { Injectable } from '@angular/core';

import PouchDB from 'pouchdb';
import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';

import * as uuidv4 from 'uuid/v4';

@Injectable()
export class DatabaseService {
  public constructor() {
  }

  public openDatabase(name: string): PouchDB {
    console.log(PouchDB);
    console.log(cordovaSqlitePlugin);
    PouchDB.plugin(cordovaSqlitePlugin);
    return new PouchDB(name, {
      adapter: 'cordova-sqlite'
    });
  }

  public synchronizeWith(
    database: PouchDB,
    collection: any[],
    deserialize?: (serializedItem: any) => void
  ): void {
    console.log('Sync changes');
    database.changes({ live: true, since: 'now', include_docs: true })
      .on('change', (change) => {
        const index = this.findIndex(collection, change.id);
        const item = collection[index];

        if (change.deleted) {
          if (item) {
            collection.splice(index, 1); // delete
          }
        } else {
          if (deserialize) {
            deserialize(change.doc);
          }
          if (item && item._id === change.id) {
            collection[index] = change.doc; // update
          } else {
            collection.splice(index, 0, change.doc) // insert
          }
        }
      });
  }

  // Binary search, the array is by default sorted by _id.
  private findIndex(collection: any[], id: string): number {
    let low = 0;
    let high = collection.length
    let mid;
    while (low < high) {
      mid = (low + high) >>> 1;
      collection[mid]._id < id ? low = mid + 1 : high = mid
    }
    return low;
  }

  public createUuid(): string {
    return uuidv4();
  }
}
