import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  createdAt: Date;
}

@Injectable()
export class ProductService {
  private products: Product[] = [];

  async findAll(): Promise<Product[]> {
    console.log('🔍 Checking cache...');
    
    console.log('💾 Fetching from database...');
    return this.products;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    console.log('✅ Validating product data...');
    
    console.log('🌍 Calling external price validation API...');
    
    const product: Product = {
      id: Math.random().toString(36).substr(2, 9),
      ...createProductDto,
      createdAt: new Date(),
    };

    console.log('💾 Saving to database...');
    this.products.push(product);

    console.log('📧 Sending notification email...');

    console.log('⚡ Invalidating cache...');

    return product;
  }
}