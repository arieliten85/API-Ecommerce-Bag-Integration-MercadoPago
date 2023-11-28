import { PartialType } from "@nestjs/mapped-types";

import { CreateOrderItemsDto } from "./create-order-items.dto";

export class UpdateOrderItemsDto extends PartialType(CreateOrderItemsDto) {}
