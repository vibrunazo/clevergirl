import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatSort } from "@angular/material";
import { DinoTableDataSource } from "./dino-table-datasource";
import { Ihastitle } from "../ihastitle";

@Component({
  selector: "app-dino-table",
  templateUrl: "./dino-table.component.html",
  styleUrls: ["./dino-table.component.scss"]
})
export class DinoTableComponent implements OnInit, Ihastitle {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: DinoTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    "name",
    "rarity",
    "hp",
    "armor",
    "damage",
    "crit",
    "speed"
  ];

  ngOnInit() {
    this.dataSource = new DinoTableDataSource(this.paginator, this.sort);
  }

  getRarityName(raritycode: number): any {
    let c;
    let r;
    r = +raritycode;
    switch (r) {
      case 0:
        c = "Common";
        break;
      case 1:
        c = "Rare";
        break;
      case 2:
        c = "Epic";
        break;
      case 3:
        c = "Legendary";
        break;
      case 4:
        c = "Unique";
        break;

      default:
        c = "Common";
        break;
    }
    return c;
  }

  getImageUrl(dino: string): string {
    let str = '';
    // str = `https://res.cloudinary.com/vibrunazo/image/upload/c_scale,f_auto,q_auto,w_50,f_jpg/profiles/${this.getImageName(dino)}`;
    str = `https://res.cloudinary.com/vibrunazo/image/upload/c_scale,f_auto,q_auto,w_50/profile/${this.getImageName(dino)}`;
    return str;
  }

  getImageName(dino: string): string {
    dino = dino.replace("Gen ", "GEN");
    // dino = dino.replace(" ", "_");
    dino = dino.split(" ").join("_");
    return `JWA_Profile_${dino}`;
  }

  getDisplayName(dino: string, rarity: number): string {
    const c = this.getRarityName(rarity).toLowerCase();
    // return `<a routerLink="/stats/${dino}"><span class='${c}'>${dino}</span></a>`;

    return `<span class='${c}'>${dino}</span>`;
    // <a mat-list-item routerLink="/stats">Dino Stats</a>
  }

  getDinoRoute(dino: string): string {
    return `/stats/${dino}`;
  }

  getTitle() {
    return "Dino Table";
  }
}
