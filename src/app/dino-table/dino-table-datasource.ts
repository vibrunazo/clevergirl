import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

import { DINOS} from './dinostats';

// TODO: Replace this with your own data model type
export interface DinoTableItem {
  name: string;
  rarity: number;
  hp: number;
  armor: number;
  damage: number;
  crit: number;
  speed: number;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: DinoTableItem[] = [
  {name: 'Velociraptor', rarity: 0, hp: 1950, armor: 0, damage: 1500, crit: 5, speed: 132},
  {name: 'Allosaurus', rarity: 0, hp: 4740, armor: 0, damage: 1650, crit: 20, speed: 104},
  {name: 'Stegosaurus', rarity: 0, hp: 4290, armor: 15, damage: 1300, crit: 5, speed: 116},
];

/**
 * Data source for the DinoTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class DinoTableDataSource extends DataSource<DinoTableItem> {
  data: DinoTableItem[] = DINOS;

  constructor(private paginator: MatPaginator, private sort: MatSort) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<DinoTableItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange
    ];

    // Set the paginators length
    this.paginator.length = this.data.length;

    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.data]));
    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: DinoTableItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: DinoTableItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'rarity': return compare(+a.rarity, +b.rarity, isAsc);
        case 'hp': return compare(+a.hp, +b.hp, isAsc);
        case 'armor': return compare(+a.armor, +b.armor, isAsc);
        case 'damage': return compare(+a.damage, +b.damage, isAsc);
        case 'crit': return compare(+a.crit, +b.crit, isAsc);
        case 'speed': return compare(+a.speed, +b.speed, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
