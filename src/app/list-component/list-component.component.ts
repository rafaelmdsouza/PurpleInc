import { Component, OnInit, ViewChild } from '@angular/core';
import { PersonViewModel } from '../model/PersonViewModel';
import { ListComponentService } from './service/list-component.service';
import { MatDialog } from '@angular/material/dialog';
import { AddPersonComponent } from './add-person/add-person.component';
import { MatSort, MatSortable, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-list-component',
  templateUrl: './list-component.component.html',
  styleUrls: ['./list-component.component.scss'],
})
export class ListComponentComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;

  displayedColumns: string[] = [
    'name',
    'gender',
    'state',
    'city',
    'neighborhood',
    'action',
  ];

  dataSource: MatTableDataSource<any>;
  isPersonPosted: boolean = false;

  constructor(public service: ListComponentService, public dialog: MatDialog) {}

  ngOnInit() {
    this.getPerson();
  }

  getPerson() {
    this.service.getPerson().subscribe((response) => {
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
      this.sort.sort({ id: 'name', start: 'asc' } as MatSortable);
      this.dataSource.sort = this.sort;
      this.sortData(this.dataSource.sort);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog() {
    this.dialog
      .open(AddPersonComponent, {
        minWidth: '550px',
      })
      .afterClosed()
      .subscribe((res) => {
        this.getPerson();
      });
  }

  deletePerson(id: number) {
    this.service.deletePerson(id).subscribe(() => {
      this.getPerson();
    });
  }

  sortData(dataSort: Sort) {
    if (!dataSort.active || dataSort.direction == '') {
      this.dataSource.sort = this.sort;
      return;
    }
      this.verifyActiveSort(dataSort.active)
  }

  private verifyActiveSort(sortActive: string){
    if (sortActive === 'name') {
      this.dataSource.sortData = (data: PersonViewModel[], sort: MatSort) => {
        return data.sort((a, b) => {
          let directionAsc = sort.direction === 'asc';
          return this.compare(a.name.toLowerCase(),b.name.toLowerCase(), directionAsc);
        });
      };
    }
    if (sortActive === 'gender') {
      this.dataSource.sortData = (data: PersonViewModel[], sort: MatSort) => {
        return data.sort((a, b) => {
          let directionAsc = sort.direction === 'asc';
          return this.compare(a.gender, b.gender, directionAsc);
        });
      };
    }
  }

  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
