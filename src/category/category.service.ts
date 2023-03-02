import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CountProduct } from '../product/dtos/count-product.dto';
import { ProductService } from 'src/product/product.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { ReturnCategoryDto } from './dtos/return-category.dto';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,

    private readonly productService: ProductService,
  ) { }

  findAmountCategoryInProducts(
    category: CategoryEntity,
    countList: CountProduct[],
  ): number {
    const count = countList.find(
      (itemCount) => itemCount.category_id === category.id,
    );

    if (count) {
      return count.total;
    }

    return 0;
  }

  async findAllCategories(): Promise<ReturnCategoryDto[]> {
    const categories = await this.categoryRepository.find();

    const count = await this.productService.countProdutsByCategoryId();

    if (!categories || categories.length === 0) {
      throw new NotFoundException('Categories empty');
    }

    return categories.map(
      (category) =>
        new ReturnCategoryDto(
          category,
          this.findAmountCategoryInProducts(category, count),
        ),
    );
  }

  async findCategoryById(categoryId: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category id: ${categoryId} not found`);
    }

    return category;
  }

  async findCategoryByName(name: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: {
        name,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category name ${name} not found`);
    }

    return category;
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    const category = await this.findCategoryByName(
      createCategoryDto.name,
    ).catch(() => undefined);

    if (category) {
      throw new BadRequestException(
        `Category name ${createCategoryDto.name} exist`,
      );
    }

    return this.categoryRepository.save(createCategoryDto);
  }
}
