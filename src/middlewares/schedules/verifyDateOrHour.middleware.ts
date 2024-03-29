import { Request, Response, NextFunction } from "express";
import AppDataSource from "../../data-source";
import Properties from "../../entities/properties.entity";
import Schedules_user_properties from "../../entities/schedules_user_properties.entity";
import { AppError, handleError } from "../../errors/appErrors";
import { validate } from "uuid";

const verifyDateOrHour = async (req: Request, res: Response, next: NextFunction) => {
    
    try {

        const date = req.body.date;
        const hour = req.body.hour
        const propertyId = req.body.propertyId
        
        const validateTypeId = validate(propertyId)

        const schedulesRepository = AppDataSource.getRepository(Schedules_user_properties);
        const propertyRepository = AppDataSource.getRepository(Properties);

        if(!validateTypeId){throw new AppError(404, 'Invalid Id')};

        const property = await propertyRepository.findOneBy({id: propertyId});

        if(!property){throw new AppError(404, 'Property not found!')};

        const scheduleFind = await schedulesRepository.findOne({
            relations: {
                property: true
            },
            where: { 
                date: date,
                hour: hour,
                property: {
                    id: propertyId
                },
            }
        }); 

        if( scheduleFind){throw new AppError(400, 'Reserved day or time')};

        return  next();

    } catch (error) {

        if (error instanceof AppError) {

           handleError(error, res)

        };
    };
};

export default verifyDateOrHour;