import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = new this.userModel(userData);
    return user.save();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findOne({ id }).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findAll(limit = 10, offset = 0): Promise<User[]> {
    return this.userModel
      .find()
      .limit(limit)
      .skip(offset)
      .exec();
  }

  async updateById(id: string, updateData: Partial<User>): Promise<User | null> {
    return this.userModel
      .findOneAndUpdate({ id }, updateData, { new: true })
      .exec();
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.userModel.findOneAndDelete({ id }).exec();
    return !!result;
  }
}
