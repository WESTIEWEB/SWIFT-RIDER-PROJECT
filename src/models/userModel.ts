import {DataTypes, Model} from 'sequelize'
import { db } from '../config'

export interface UserAttribute{
    id:string
    Name:string,
    PhoneNumber:number,
    Email:string
    Password:string
    salt:string
    role:string

}
export class UserInstance extends
Model<UserAttribute>{}

UserInstance.init({
    id:{
        type:DataTypes.UUID,
        primaryKey:true,
        allowNull:false
    },
    Name:{
        type:DataTypes.STRING,
    allowNull:false,
    unique:true,
    validate:{
        notNull:{
            msg:"Name is required"
        },
      
    }
    },
    PhoneNumber:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notNull:{
                msg:"Please input phone number"
            }
        }
    },
    Email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
    validate:{
        notNull:{
            msg:"Email address is required"
        },
        isEmail:{
            msg:"Please provide a valid email"
        }
    }
    },
    Password:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notNull:{
                msg:"Please input password"
            }
        }
    },
    salt:{
        type:DataTypes.STRING,
        allowNull:false
    },
    role:{
        type:DataTypes.STRING,
        allowNull:true
    }

},
{
    sequelize:db,
    tableName:'pickup user'
}
)