import { CountProduct } from '../../product/dtos/count-product.dto';
import { categoryMock } from '../../category/__mocks__/category.mock';


export const countProductMock: CountProduct = {
  category_id: categoryMock.id,
  total: 4,
};