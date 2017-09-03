import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import PouchDB from 'pouchdb';
import PouchDBAdapterCordovaSqlite from 'pouchdb-adapter-cordova-sqlite';
import PouchDBFind from 'pouchdb-find';

import * as uuidv4 from 'uuid/v4';

@Injectable()
export class DatabaseService {
  public openDatabase(name: string): any {
    PouchDB.plugin(PouchDBAdapterCordovaSqlite);
    PouchDB.plugin(PouchDBFind);
    return new PouchDB(name, {
      adapter: 'cordova-sqlite'
    });
  }

  public synchronizeWith(
    database: any,
    collection: any[],
    deserialize?: (serializedItem: any) => void
  ): Observable<any> {
    return new Observable<any>((observer) => {
      database.changes({ live: true, since: 'now', include_docs: true })
        .on('change', (change) => {
          //const index = this.findIndex(collection, change.id);
          const index = collection.findIndex((item) => item._id === change.id);
          const item = collection[index];
          
          if (change.deleted) {
            if (item) {
              collection.splice(index, 1); // delete
              observer.next({ item, action: 'deleted' });
            }
          } else {
            if (deserialize) {
              deserialize(change.doc);
            }
            if (item && item._id === change.id) {
              collection[index] = change.doc; // update
              observer.next({ item, action: 'updated' });
            } else {
              collection.splice(index, 0, change.doc); // insert
              observer.next({ item, action: 'added' });
            }
          }
        });
    });
  }

  // // Binary search, the array is by default sorted by _id.
  // private findIndex(collection: any[], id: string): number {
  //   let low = 0;
  //   let high = collection.length
  //   let mid;
  //   while (low < high) {
  //     mid = (low + high) >>> 1;
  //     collection[mid]._id < id ? low = mid + 1 : high = mid
  //   }
  //   return low;
  // }

  public createUuid(): string {
    return uuidv4();
  }
}
