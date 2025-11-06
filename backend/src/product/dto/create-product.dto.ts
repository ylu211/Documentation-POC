import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class CreateProductDto {
    @ApiProperty({ example: 'iPhone 15', description: 'Nom du produit' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 999, description: 'Prix en euros', minimum: 0 })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({ example: 'Smartphone Apple dernière génération', description: 'Description du produit' })
    @IsString()
    description: string;
}
