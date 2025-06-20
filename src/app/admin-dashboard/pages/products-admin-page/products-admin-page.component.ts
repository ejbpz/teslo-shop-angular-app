import { Component, inject, signal } from '@angular/core';
import { ProductTableComponent } from "../../../products/components/product-table/product-table.component";
import { ProductsService } from '@/products/services/products.service';
import { PaginationService } from '@/shared/components/pagination.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTableComponent, PaginationComponent, RouterLink],
  templateUrl: './products-admin-page.component.html',
})
export default class ProductsAdminPageComponent {
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);
  productsPerPage = signal<number>(10);

  productsResource = rxResource({
    request: () => ({
      page: this.paginationService.currentPage() - 1,
      amout: this.productsPerPage(),
    }),
    loader: ({request}) => {
      return this.productsService.getProducts({
        limit: request.amout,
        offset: request.page * request.amout
      });
    }
  });
}
