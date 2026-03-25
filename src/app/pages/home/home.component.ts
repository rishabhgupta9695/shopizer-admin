import { Component, OnInit } from '@angular/core';

import { UserService } from '../shared/services/user.service';
import { CrudService } from '../shared/services/crud.service';
import { Country } from '../shared/models/country';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StorageService } from '../shared/services/storage.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { OrdersService } from '../orders/services/orders.service';


@Component({
  selector: 'ngx-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loading = false;
  loadingList: boolean = false;
  user = {
    userName: '',
    lastAccess: '',
    merchantName: '',
    address: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    country: '',
    defaultLanguage: '',
    phone: ''
  };
  canAccessToOrder: boolean;
  userId;
  _countryArray: Country[];

  // stats
  selectedPeriod = '7d';
  stats: any = null;
  revenueChartData: any = null;
  revenueChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{ ticks: { beginAtZero: true } }] }
  };

  constructor(
    private userService: UserService,
    private crudService: CrudService,
    private storageService: StorageService,
    private translate: TranslateService,
    private ordersService: OrdersService,
  ) {
    this.userService.getUserProfile()
      .subscribe(user => {
        this.userService.checkForAccess(user.groups);
        this.canAccessToOrder = this.userService.roles.canAccessToOrder;
      });
  }

  ngOnInit() {
    const lang = this.storageService.getLanguage();
    this.loading = true;
    const store = localStorage.getItem('merchant');
    forkJoin([this.crudService.listCountriesByLanguage(lang), this.userService.getUserProfile(), this.userService.getMerchant(store)])
      .subscribe(([countries, user, merchant]) => {
        this._countryArray = countries;
        this.user.userName = user.userName;
        this.user.lastAccess = user.lastAccess;
        this.user.merchantName = merchant.name;
        this.user.address = merchant.address.address;
        this.user.city = merchant.address.city;
        this.user.stateProvince = merchant.address.stateProvince;
        this.user.postalCode = merchant.address.postalCode;
        this.user.defaultLanguage = user.defaultLanguage;
        this.user.country = this.country(merchant.address.country)[0].name;
        this.user.phone = merchant.phone;

        localStorage.setItem('merchantLanguage', this.user.defaultLanguage);
        localStorage.setItem('merchantName', merchant.name);
        localStorage.setItem('supportedLanguages', JSON.stringify(merchant.supportedLanguages));
        localStorage.setItem('defaultCountry', merchant.address.country);

        this.loading = false;
      });

    this.loadStats();
  }

  loadStats() {
    this.ordersService.getOrderStats(this.selectedPeriod).subscribe(data => {
      this.stats = data;
      this.revenueChartData = {
        labels: data.revenueByDay.map((d: any) => d.date),
        datasets: [{
          label: 'Revenue',
          data: data.revenueByDay.map((d: any) => d.amount),
          borderColor: '#3366ff',
          backgroundColor: 'rgba(51,102,255,0.1)',
          fill: true
        }]
      };
    });
  }

  onPeriodChange(period: string) {
    this.selectedPeriod = period;
    this.loadStats();
  }

  setLanguage() {
    if (this.user.defaultLanguage != null) {
      localStorage.setItem('lang', this.user.defaultLanguage);
      this.translate.setDefaultLang(localStorage.getItem('lang'));
      this.translate.use(localStorage.getItem('lang'));
    } else {
      localStorage.setItem('lang', environment.client.language.default);
    }
  }

  country(code: string) {
    return this._countryArray.filter(c => c.code === code);
  }

  deleteCache() {
    this.loading = true;
  }
}
