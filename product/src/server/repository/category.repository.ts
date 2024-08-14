import { Optional, Order, WhereOptions } from "sequelize";
import { CategoryRepository } from "../../contract/repository.contract";
import { AppDataSource } from "../../module/datasource.module";
import { FindResult, List_Payload } from "../../module/dto.module";
import { Category, CategoryAttributes, CategoryCreationAttributes } from "../model/category.model";
import { BaseRepository } from "./base.repository";
import { ROLE } from "../../constant/role.constant";

export class SequelizeCategoryRepository extends BaseRepository implements CategoryRepository {
    private category!: typeof Category;
    init(datasource: AppDataSource): void {
        this.category = datasource.sqlModel.Category;
    }

    insert = async (payload: CategoryCreationAttributes): Promise<CategoryAttributes> => {
        return this.category.create(payload);
    };

    findByXid = async (xid: string): Promise<CategoryAttributes | null> => {
        return this.category.findOne({
            where: {
                xid,
            },
        });
    };

    findList = async (payload: List_Payload): Promise<FindResult<CategoryAttributes>> => {
        const { filters, showAll, sortBy, usersSession } = payload;

        let limit: number | undefined = undefined;
        let offset: number | undefined = undefined;

        if (!showAll) {
            limit = payload.limit;
            offset = payload.skip;
        }

        const where: WhereOptions<CategoryAttributes> = {};

        if (filters.name) {
            where.name = filters.name;
        }

        if (usersSession.audiance !== ROLE.admin) {
            where.active = true;
        }

        const { order } = this.parseSortBy(sortBy);

        return this.category.findAndCountAll({
            where,
            limit,
            offset,
            order,
        });
    };

    update = async (id: number, payload: Partial<CategoryAttributes>, version: number): Promise<number> => {
        const result = await this.category.update(payload, {
            where: {
                id,
                version,
            },
        });

        return result[0];
    };

    private parseSortBy = (sortBy: string): { order: Order } => {
        // determine sorting option
        let order: Order;
        switch (sortBy) {
            case "createdAt-asc": {
                order = [["createdAt", "ASC"]];
                break;
            }
            case "createdAt-desc": {
                order = [["createdAt", "DESC"]];
                break;
            }
            case "updatedAt-asc": {
                order = [["updatedAt", "ASC"]];
                break;
            }
            case "updatedAt-desc": {
                order = [["updatedAt", "DESC"]];
                break;
            }
            default: {
                order = [["createdAt", "DESC"]];
            }
        }

        return { order };
    };
}
