import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';


@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {} 
    

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email });
    }

    async findById(id: string): Promise<UserDocument | null> {
        return this.userModel.findById(id)  ;
    }

    async create(user: User): Promise<UserDocument | null> {
        return this.userModel.create(user);
    }
}
